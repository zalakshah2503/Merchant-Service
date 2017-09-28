using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;


namespace MerchantService.Repository.Modules.ItemChangeRequest
{
    public class ICRRepository : IICRRepository
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<IcrDetail> _icrDetailContext;
        private readonly IDataRepository<IcrPrice> _icrPriceContext;
        private readonly IDataRepository<IcrQuantity> _icrQuantityContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowContext;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogContext;
        private readonly IWorkFlowDetailsRepository _IWorkFlowDetailsRepository;
        private readonly IICRWorkListRepository _IICRWorkListRepository;
        #endregion

        #region Constructor
        public ICRRepository(IICRWorkListRepository IICRWorkListRepository, IDataRepository<ItemProfile> itemProfileContext,
            IDataRepository<IcrQuantity> icrQuantityContext, IDataRepository<IcrPrice> icrPriceContext, IDataRepository<IcrDetail> icrDetailContext,
            IDataRepository<WorkFlowLog> workFlowLogContext, IDataRepository<ItemQuantity> itemQuantityContext,
            IWorkFlowDetailsRepository IWorkFlowDetailsRepository, IDataRepository<WorkFlowDetail> workFlowContext, IErrorLog errorLog)
        {
            _itemQuantityContext = itemQuantityContext;
            _icrDetailContext = icrDetailContext;
            _icrPriceContext = icrPriceContext;
            _icrQuantityContext = icrQuantityContext;
            _workFlowContext = workFlowContext;
            _workFlowLogContext = workFlowLogContext;
            _IICRWorkListRepository = IICRWorkListRepository;
            _IWorkFlowDetailsRepository = IWorkFlowDetailsRepository;
            _itemProfileContext = itemProfileContext;
            _errorLog = errorLog;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// this method is used for fetching ItemQuantity list.-JJ
        /// </summary>
        /// <param name="ItemId">Id of Item</param>
        /// <param name="BranchId">Id of current user's branch</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        public List<ItemChangedDetailsAC> GetItemQuantityList(int ItemId, int? BranchId)
        {
            try
            {
                var listAC = new List<ItemChangedDetailsAC>();
                var itemQuantityList = new List<ItemQuantity>();
                var item = _itemProfileContext.Find(ItemId);
                var itemId = 0;
                if (item.IsParentItem)
                    itemId = ItemId;
                else
                    itemId = (int)item.ParentItemId;
                if (BranchId == null)
                    itemQuantityList = _itemQuantityContext.Fetch(X => X.ItemId == itemId).ToList();
                else
                    itemQuantityList = _itemQuantityContext.Fetch(X => X.ItemId == itemId && X.BranchId == BranchId).ToList();

                foreach (var quantity in itemQuantityList)
                {
                    var actualQuantity = 0M;
                    if (item.IsParentItem)
                    {
                        actualQuantity = quantity.ActualQuantity;
                    }
                    else
                    {
                        if (item.BaseUnit > 0)
                        {
                            actualQuantity = quantity != null ? Math.Floor((decimal)(quantity.ActualQuantity / item.BaseUnit)) : 0;
                        }
                        else
                        {
                            actualQuantity = 0;
                        }
                    }
                    ItemChangedDetailsAC itemQuantity = new ItemChangedDetailsAC
                    {
                        Id = quantity.Id,
                        BranchId = quantity.BranchId,
                        BranchName = quantity.Branch.Name,
                        ItemId = ItemId,
                        MaxQuantity = quantity.MaxQuantity,
                        MinQuantity = quantity.MinQuantity,
                        ActualQuantity = (int)actualQuantity,
                        IsICRGenerated = quantity.IsICRGenerated
                    };
                    listAC.Add(itemQuantity);
                }
                return listAC;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for adding ICR.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="user">object of UserDetail</param>
        /// <param name="company"></param>
        /// <param name="WorkFlowId"></param>
        /// <returns>status</returns>
        public string SaveICR(ItemChangedDetailsAC itemChangedDetail, UserDetail user, CompanyDetail company, int? WorkFlowId)
        {
            try
            {
                var ParentRecordId = 0;
                if (itemChangedDetail.IsInDirect)
                {
                    ParentRecordId = (int)itemChangedDetail.ParentRecordId;
                    itemChangedDetail.IsPOItemIcr = true;
                }
                else
                {
                    var workFlowLog = _IWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.ItemChangeRequest, StringConstants.InitiateICR, user, company, itemChangedDetail, itemChangedDetail.Comment, itemChangedDetail);
                    if (workFlowLog != null)
                    {
                        WorkFlowLog log = (WorkFlowLog)workFlowLog.Item1;
                        ParentRecordId = log.RecordId;
                        WorkFlowDetail WorkFlow = (WorkFlowDetail)workFlowLog.Item2;
                        WorkFlowId = WorkFlow.Id;
                    }
                    else
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }
                }
                return AddICR(itemChangedDetail, ParentRecordId, WorkFlowId, company, user);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for updating ICR.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="user">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <return>status</return>
        public string UpdateICR(ItemChangedDetailsAC itemChangedDetail, UserDetail user, CompanyDetail company, int RecordId)
        {
            try
            {
                var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                var workFlowLog = new WorkFlowLog();
                var profitMargin = _itemProfileContext.Fetch(x => x.Id == itemChangedDetail.ItemId).FirstOrDefault().ProfitMargin;
                var total = (itemChangedDetail.ModifyingCostPrice * (100 + profitMargin)) / 100;
                itemChangedDetail.CalculatedCostPrice = total;
                if (itemChangedDetail.Comment == ".")
                {
                    itemChangedDetail.Comment = null;
                }
                if (log.WorkFlowDetail.AssignedId == user.RoleId)
                {
                    if (itemChangedDetail.IsResubmit)
                    {
                        workFlowLog = _IWorkFlowDetailsRepository.GetResubmitActionWorkFlow(RecordId, itemChangedDetail, itemChangedDetail, StringConstants.ReSubmitedAction, itemChangedDetail.Comment, user);
                    }
                    else
                    {
                        workFlowLog = _IWorkFlowDetailsRepository.GetResubmitActionWorkFlow(RecordId, itemChangedDetail, itemChangedDetail, StringConstants.EditedAction, itemChangedDetail.Comment, user);
                    }
                    if (workFlowLog != null)
                    {
                        var icrDetail = _icrDetailContext.Fetch(x => x.RecordId == RecordId).FirstOrDefault();
                        icrDetail.IsReturned = false;
                        icrDetail.IsPriceChangeRequest = itemChangedDetail.IsPriceChangeRequest;
                        icrDetail.ModifiedDateTime = DateTime.UtcNow;
                        _icrDetailContext.Update(icrDetail);
                        _icrDetailContext.SaveChanges();
                        bool modifyingCostPriceEditable = icrDetail.SPOItemId != null ? false : true;
                        return AddICRPriceQuantity(itemChangedDetail, icrDetail.ItemId, icrDetail.Id, true, modifyingCostPriceEditable);
                    }
                    else
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }
                }
                else
                {
                    return StringConstants.WorkFlowNotCreated;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for deleting ICR.- JJ
        /// </summary>
        /// <param name="Id">Id of ICR Detail</param>
        public void DeleteICR(int Id)
        {
            IcrDetail icrDetail = _icrDetailContext.Find(Id);
            icrDetail.IsDeleted = true;
            icrDetail.ModifiedDateTime = DateTime.UtcNow;
            _icrDetailContext.Update(icrDetail);
            _icrDetailContext.SaveChanges();

            var icrPrice = _icrPriceContext.Fetch(x => x.IcrId == Id).FirstOrDefault();
            _icrPriceContext.Delete(icrPrice);
            _icrPriceContext.SaveChanges();

            var item = _itemProfileContext.Find(icrDetail.ItemId);
            item.IsItemChangeRequestGenerated = false;
            item.ModifiedDateTime = DateTime.UtcNow;
            _itemProfileContext.Update(item);
            _itemProfileContext.SaveChanges();
        }
        #endregion


        #region Private Methods
        /// <summary>
        /// this method is used for deleting ICR Items.- JJ
        /// </summary>
        /// <param name="Id">Id of ICR Detail</param>
        /// <param name="item">object of ItemProfile</param>
        private void DeleteICRItem(int id, ItemProfile item)
        {
            var icrQuantities = _icrQuantityContext.Fetch(x => x.IcrId == id).ToList();
            foreach (var quantity in icrQuantities)
            {
                if (quantity.ModifyingQuantity > 0)
                {
                    ItemQuantity itemQuantity;
                    if (item.IsParentItem)
                    {
                        itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == quantity.BranchId);
                    }
                    else
                    {
                        itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.ParentItemId && x.BranchId == quantity.BranchId);
                    }
                    itemQuantity.IsICRGenerated = false;
                    itemQuantity.ModifiedDateTime = DateTime.UtcNow;
                    _itemQuantityContext.Update(itemQuantity);
                    _itemQuantityContext.SaveChanges();
                }
                _icrQuantityContext.Delete(quantity);
                _icrQuantityContext.SaveChanges();
            }
        }


        /// <summary>
        /// this method is used for adding ICR.- JJ
        /// </summary>
        /// <param name="company"></param>
        /// <param name="itemChangedDetail"></param>
        /// <param name="ParentRecordId"></param>
        /// <param name="user"></param>
        /// <param name="WorkFlowId"></param>
        /// <returns>status</returns>
        public string AddICR(ItemChangedDetailsAC itemChangedDetail, int ParentRecordId, int? WorkFlowId, CompanyDetail company, UserDetail user)
        {
            try
            {
                var item = _itemProfileContext.Find(itemChangedDetail.ItemId);
                if (item.IsItemChangeRequestGenerated && itemChangedDetail.IsInDirect)
                {
                    return StringConstants.ICRPriceGenerateError;
                }
                else
                {
                    var icrDetail = new IcrDetail
                    {
                        CreatedDateTime = DateTime.UtcNow,
                        IsAddItemIcr = itemChangedDetail.IsAddItemIcr,
                        IsPOItemIcr = itemChangedDetail.IsPOItemIcr,
                        IsPriceChangeRequest = itemChangedDetail.IsPriceChangeRequest,
                        ItemId = itemChangedDetail.ItemId,
                        RecordId = ParentRecordId
                    };
                    if (itemChangedDetail.POItemId > 0)
                        icrDetail.SPOItemId = itemChangedDetail.POItemId;
                    _icrDetailContext.Add(icrDetail);
                    _icrDetailContext.SaveChanges();
                    string status = AddICRPriceQuantity(itemChangedDetail, itemChangedDetail.ItemId, icrDetail.Id, false, true);
                    var workflow = _workFlowContext.Find(WorkFlowId);
                    if (workflow.NextActivity.IsClosed)
                    {
                        _IICRWorkListRepository.UpdateItem(ParentRecordId, true, company, user);
                    }
                    return status;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for adding ICR prices or quantity.- JJ
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="itemChangedDetail"></param>
        /// <param name="IcrId"></param>
        /// <returns>status</returns>
        private string AddICRPriceQuantity(ItemChangedDetailsAC itemChangedDetail, int itemId, int IcrId, bool isUpdate, bool modifyingCostPriceEditable)
        {
            try
            {
                var item = _itemProfileContext.Find(itemId);
                string status = "ok";
                if (itemChangedDetail.IsPriceChangeRequest)
                {
                    if (item.IsItemChangeRequestGenerated && !isUpdate)
                    {
                        status = StringConstants.ICRPriceGenerateError;
                    }
                    else
                    {
                        if (itemChangedDetail.IsPriceChangeRequest)
                        {
                            var oldItemPrice = _icrPriceContext.Fetch(x => x.IcrId == IcrId).FirstOrDefault();
                            if (oldItemPrice != null)
                            {
                                if (!modifyingCostPriceEditable)
                                    itemChangedDetail.ModifyingCostPrice = oldItemPrice.ModifyingCostPrice;
                                _icrPriceContext.Delete(oldItemPrice);
                                _icrPriceContext.SaveChanges();
                            }
                        }
                        var icrPrice = new IcrPrice
                        {
                            CreatedDateTime = DateTime.UtcNow,
                            IcrId = IcrId,
                            ModifyingCostPrice = itemChangedDetail.ModifyingCostPrice,
                            ModifyingSellPrice = itemChangedDetail.ModifyingSellPrice,
                            ModifyingSellPriceA = itemChangedDetail.ModifyingSellPriceA,
                            ModifyingSellPriceB = itemChangedDetail.ModifyingSellPriceB,
                            ModifyingSellPriceC = itemChangedDetail.ModifyingSellPriceC,
                            ModifyingSellPriceD = itemChangedDetail.ModifyingSellPriceD,
                            ModifiedDateTime = DateTime.UtcNow
                        };
                        _icrPriceContext.Add(icrPrice);
                        _icrPriceContext.SaveChanges();
                        item.IsItemChangeRequestGenerated = true;
                        DeleteICRItem(IcrId, item);
                    }
                }
                if (itemChangedDetail.IcrQuantity != null)
                {
                    foreach (var quantity in itemChangedDetail.IcrQuantity)
                    {
                        ItemQuantity itemQuantity = new ItemQuantity();
                        if (item.IsParentItem)
                        {
                            itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == quantity.BranchId);
                        }
                        else
                        {
                            itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.ParentItemId && x.BranchId == quantity.BranchId);
                        }
                        if (itemQuantity.IsICRGenerated && !isUpdate && quantity.ModifyingQuantity > 0)
                        {
                            status = StringConstants.ICRQuantityGenerateError;
                        }
                        else
                        {
                            DeleteICRItem(IcrId, item);
                            var icrQuantity = new IcrQuantity
                            {
                                BranchId = quantity.BranchId,
                                SystemQuantity = quantity.ActualQuantity,
                                CreatedDateTime = DateTime.UtcNow,
                                IcrId = IcrId,
                                IsAddOperation = quantity.IsAddOperation,
                                ModifyingQuantity = quantity.ModifyingQuantity
                            };
                            _icrQuantityContext.Add(icrQuantity);
                            _icrQuantityContext.SaveChanges();

                            if (quantity.ModifyingQuantity > 0)
                            {
                                itemQuantity.ModifiedDateTime = DateTime.UtcNow;
                                itemQuantity.IsICRGenerated = true;
                                _itemQuantityContext.Update(itemQuantity);
                                _itemQuantityContext.SaveChanges();
                            }
                        }
                    }
                }
                if (status == "ok")
                {
                    item.ModifiedDateTime = DateTime.UtcNow;
                    _itemProfileContext.Update(item);
                    _itemProfileContext.SaveChanges();
                }
                return status;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion


        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _itemQuantityContext.Dispose();
                _icrDetailContext.Dispose();
                _itemProfileContext.Dispose();
                _icrPriceContext.Dispose();
                _icrQuantityContext.Dispose();
                _workFlowContext.Dispose();
                _workFlowLogContext.Dispose();
                _IWorkFlowDetailsRepository.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }
        #endregion
    }
}

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
using MerchantService.Repository.Modules.Item;

namespace MerchantService.Repository.Modules.ItemChangeRequest
{
    public class ICRWorkListRepository : IICRWorkListRepository
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<IcrDetail> _icrDetailContext;
        private readonly IDataRepository<IcrQuantity> _icrQuantityContext;
        private readonly IDataRepository<IcrPrice> _icrPriceContext;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IItemRepository _itemRepository;
        #endregion

        #region Constructor
        public ICRWorkListRepository(IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<ItemProfile> itemProfileContext, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IDataRepository<UserDetail> userDetailContext, IDataRepository<IcrPrice> icrPriceContext, IDataRepository<IcrQuantity> icrQuantityContext, IDataRepository<WorkFlowLog> workFlowLogContext, IDataRepository<IcrDetail> icrDetailContext, IErrorLog errorLog, IItemRepository itemRepository)
        {
            _icrDetailContext = icrDetailContext;
            _icrPriceContext = icrPriceContext;
            _icrQuantityContext = icrQuantityContext;
            _workFlowLogContext = workFlowLogContext;
            _userDetailContext = userDetailContext;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _itemProfileContext = itemProfileContext;
            _itemQuantityContext = itemQuantityContext;
            _errorLog = errorLog;
            _itemRepository = itemRepository;
        }

        #endregion

        #region Public Methods
        /// <summary>
        /// this method is used for fetching Item Change Request list.
        /// </summary>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        public List<ItemChangedDetailsAC> GetICRWorkList()
        {
            try
            {
                var itemcrList = new List<ItemChangedDetailsAC>();
                var icrList = _icrDetailContext.Fetch(x => !x.IsDeleted).OrderByDescending(x => x.CreatedDateTime).ToList();
                foreach (var icr in icrList)
                {
                    ItemChangedDetailsAC icrAC = new ItemChangedDetailsAC
                    {
                        ItemName = icr.ItemProfile.ItemNameEn,
                        RequestedDate = icr.CreatedDateTime,
                        Barcode = icr.ItemProfile.Barcode,
                        Id = icr.Id,
                        IsPriceChangeRequest = icr.IsPriceChangeRequest,
                        IsRejected = icr.IsRejected,
                        Action = GetActionName(icr.RecordId)
                    };
                    itemcrList.Add(icrAC);
                }
                return itemcrList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for fetching Item Change Request list.
        /// </summary>
        /// <param name="branchId">current user's branch id</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        public List<ItemChangedDetailsAC> GetICRWorkListForParticularBranch(int? branchId)
        {
            try
            {
                var itemcrList = new List<ItemChangedDetailsAC>();
                var icrList = _icrDetailContext.Fetch(x => !x.IsDeleted).OrderByDescending(x => x.CreatedDateTime).ToList();
                foreach (var icr in icrList)
                {
                    ItemChangedDetailsAC icrAC = new ItemChangedDetailsAC
                    {
                        ItemName = icr.ItemProfile.ItemNameEn,
                        RequestedDate = icr.CreatedDateTime,
                        Barcode = icr.ItemProfile.Barcode,
                        BranchId = branchId,
                        Id = icr.Id,
                        IsPriceChangeRequest = icr.IsPriceChangeRequest,
                        IsRejected = icr.IsRejected,
                        Action = GetActionName(icr.RecordId)
                    };
                    itemcrList.Add(icrAC);
                }
                return itemcrList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for fetching Item Change Request Details.
        /// </summary>
        /// <param name="Id">Id of Icr</param>
        /// <returns>object of ItemChangedDetailsAC</returns>
        public ItemChangedDetailsAC GetICRDetail(int Id, string userId)
        {
            IcrDetail icrDetail = _icrDetailContext.Find(Id);
            var ModifyingCostPrice = 0M;
            var ModifyingSellPrice = 0M;
            var ModifyingSellPriceA = 0M;
            var ModifyingSellPriceB = 0M;
            var ModifyingSellPriceC = 0M;
            var ModifyingSellPriceD = 0M;
            var icrQuantity = _icrQuantityContext.Fetch(x => x.IcrId == Id).ToList();
            if (icrDetail != null)
            {
                var logList = _iWorkFlowDetailsRepository.GetAllWorkFlowActionList(icrDetail.RecordId);
                var quantityList = new List<IcrQuantityAC>();
                foreach (var quantity in icrQuantity)
                {
                    var icrQuantityAC = new IcrQuantityAC
                    {
                        BranchId = quantity.BranchId,
                        BranchName = quantity.BranchDetail.Name,
                        ActualQuantity = quantity.SystemQuantity,
                        IcrId = quantity.IcrId,
                        IsAddOperation = quantity.IsAddOperation,
                        ModifyingQuantity = quantity.ModifyingQuantity
                    };
                    quantityList.Add(icrQuantityAC);
                }
                var icrPrice = _icrPriceContext.Fetch(x => x.IcrId == Id).FirstOrDefault();
                if (icrPrice != null)
                {
                    ModifyingCostPrice = icrPrice.ModifyingCostPrice;
                    ModifyingSellPrice = icrPrice.ModifyingSellPrice;
                    ModifyingSellPriceA = icrPrice.ModifyingSellPriceA;
                    ModifyingSellPriceB = icrPrice.ModifyingSellPriceB;
                    ModifyingSellPriceC = icrPrice.ModifyingSellPriceC;
                    ModifyingSellPriceD = icrPrice.ModifyingSellPriceD;
                }
                var hideQuantity =
                     userId != icrDetail.ParentRecord.InitiatorId;

                var icrDetailAC = new ItemChangedDetailsAC
                {
                    ItemProfile = icrDetail.ItemProfile,
                    IcrQuantity = quantityList,
                    WorkFlowLog = logList,
                    Id = icrDetail.Id,
                    IsAddItemIcr = icrDetail.IsAddItemIcr,
                    IsPOItemIcr = icrDetail.IsPOItemIcr,
                    IsPriceChangeRequest = icrDetail.IsPriceChangeRequest,
                    ItemId = icrDetail.ItemId,
                    ParentRecordId = icrDetail.RecordId,
                    IsRejected = icrDetail.IsRejected,
                    IsReturned = icrDetail.IsReturned,
                    ModifyingCostPrice = ModifyingCostPrice,
                    ModifyingSellPrice = ModifyingSellPrice,
                    ModifyingSellPriceA = ModifyingSellPriceA,
                    ModifyingSellPriceB = ModifyingSellPriceB,
                    ModifyingSellPriceC = ModifyingSellPriceC,
                    ModifyingSellPriceD = ModifyingSellPriceD,
                    RequestedDate = icrDetail.CreatedDateTime,
                    HideQuantity = hideQuantity
                };
                if (icrDetail.SPOItemId != null)
                    icrDetailAC.POItemId = (int)icrDetail.SPOItemId;
                else
                    icrDetailAC.POItemId = 0;
                return icrDetailAC;
            }
            else
            {
                return null;
            }
        }


        /// <summary>
        /// This method is used for approve/reject icr in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="user"> Currently logged in UserDetail </param>
        /// <param name="status"></param>
        /// <param name="companyDetails"></param>
        /// <returns>status</returns>
        public string ApprovalICR(string Comment, int RecordId, UserDetail user, bool status, CompanyDetail companyDetails)
        {
            var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
            var prevActivity = log.WorkFlowDetail.NextActivity.AcceptPermission;
            if (log.WorkFlowDetail.AssignedId == user.RoleId)
            {
                Comment = (Comment == ".") ? null : Comment;

                if (status)
                {
                    var loger = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(RecordId, StringConstants.ApprovAction, Comment, user, status);
                    if (loger == null)
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }
                }
                else
                {
                    var loger = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(RecordId, StringConstants.ReturnAction, Comment, user, status);
                    if (loger != null)
                    {
                        var icrDetail = _icrDetailContext.Fetch(x => x.RecordId == RecordId).FirstOrDefault();
                        icrDetail.IsReturned = true;
                        icrDetail.ModifiedDateTime = DateTime.UtcNow;
                        _icrDetailContext.Update(icrDetail);
                        _icrDetailContext.SaveChanges();
                    }
                    else
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }
                }
                return CheckApproved(RecordId, status, prevActivity, companyDetails, user);
            }
            else
            {
                return StringConstants.WorkFlowNotCreated;
            }
        }


        /// <summary>
        /// This method is used for reject Item Change Request. - JJ
        /// </summary>
        /// <param name="Id">Id of IcrDetail</param>
        /// <param name="RecordId"></param>
        /// <param name="Comment"></param>
        /// <param name="user"> Currently logged in userDetail </param>
        /// <param name="companyDetails"></param>
        /// <returns>status</returns>
        public string RejectICR(int Id, int RecordId, string Comment, UserDetail user, CompanyDetail companyDetails)
        {
            var icrDetail = _icrDetailContext.Find(Id);
            if (icrDetail != null)
            {
                if (UpdateItem(RecordId, false, companyDetails, user) == true)
                {
                    return "ok";
                }
                else
                {
                    return "Sorry ICR couldn't be rejected";
                }
            }
            else
            {
                return "Item Change Request Not Found";
            }
        }


        /// <summary>
        /// This method is used to review Item Change Request. - JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="user">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="Comment"></param>
        /// <param name="RecordId"></param>
        /// <returns>status</returns>
        public string ReviewICR(ItemChangedDetailsAC itemChangedDetail, UserDetail user, CompanyDetail company, int RecordId, string Comment)
        {
            var currentUser = _userDetailContext.First(x => x.UserName == user.UserName && x.IsDelete == false);
            var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
            var prevActivity = log.WorkFlowDetail.NextActivity.AcceptPermission;
            var profitMargin = _itemProfileContext.Fetch(x => x.Id == itemChangedDetail.ItemId).FirstOrDefault().ProfitMargin;
            var total = (itemChangedDetail.ModifyingCostPrice * (100 + profitMargin)) / 100;
            itemChangedDetail.CalculatedCostPrice = total;
            if (log.WorkFlowDetail.AssignedId == currentUser.RoleId)
            {
                Comment = (Comment == ".") ? null : Comment;

                if (log.WorkFlowDetail.IsReview || log.WorkFlowDetail.IsCondition)
                {
                    var loger = _iWorkFlowDetailsRepository.GetReviewActionWorkFlow(RecordId, itemChangedDetail, itemChangedDetail, StringConstants.ReviewAction, Comment, user);
                    if (loger != null)
                    {
                        return CheckApproved(RecordId, true, prevActivity, company, user);
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
            else
            {
                return StringConstants.WorkFlowNotCreated;
            }
        }

        /// <summary>
        /// This method is used to update items according to  Item Change Request. - JJ
        /// </summary>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="status">status</param>
        /// <param name="companyDetails"></param>
        /// <param name="user"></param>
        /// <returns>status</returns>
        public bool UpdateItem(int RecordId, bool status, CompanyDetail companyDetails, UserDetail user)
        {
            try
            {
                var icr = _icrDetailContext.Fetch(x => x.RecordId == RecordId).FirstOrDefault();
                var item = _itemProfileContext.Find(icr.ItemId);
                if (status)
                {
                    icr.IsApproved = true;
                    icr.IsRejected = false;
                    icr.ModifiedDateTime = DateTime.UtcNow;
                    _icrDetailContext.Update(icr);
                    _icrDetailContext.SaveChanges();
                    if (icr.IsPriceChangeRequest)
                    {
                        if (icr.SPOItemId == null)
                        {
                            var icrPrice = _icrPriceContext.Fetch(x => x.IcrDetail.RecordId == RecordId).FirstOrDefault();
                            item.SellPrice = icrPrice.ModifyingSellPrice;
                            item.SellPriceA = icrPrice.ModifyingSellPriceA;
                            item.SellPriceB = icrPrice.ModifyingSellPriceB;
                            item.SellPriceC = icrPrice.ModifyingSellPriceC;
                            item.SellPriceD = icrPrice.ModifyingSellPriceD;
                            item.CostPrice = icrPrice.ModifyingCostPrice;
                        }
                        item.IsItemChangeRequestGenerated = false;
                    }
                    else
                    {
                        var icrQuantity = _icrQuantityContext.Fetch(x => x.IcrDetail.RecordId == RecordId).ToList();
                        foreach (var quantity in icrQuantity)
                        {

                            var itemQuantity = new ItemQuantity();
                            if (item.IsParentItem)
                            {
                                itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == quantity.BranchId);
                                if (quantity.IsAddOperation)
                                {
                                    itemQuantity.ActualQuantity += quantity.ModifyingQuantity;
                                }
                                else
                                {
                                    itemQuantity.ActualQuantity -= quantity.ModifyingQuantity;
                                }
                            }
                            else
                            {
                                itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.ParentItemId && x.BranchId == quantity.BranchId);
                                if (quantity.IsAddOperation)
                                {
                                    itemQuantity.ActualQuantity += (item.BaseUnit * quantity.ModifyingQuantity);
                                }
                                else
                                {
                                    itemQuantity.ActualQuantity -= (item.BaseUnit * quantity.ModifyingQuantity);
                                }
                            }
                            itemQuantity.IsICRGenerated = false;
                            itemQuantity.ModifiedDateTime = DateTime.UtcNow;
                            _itemQuantityContext.Update(itemQuantity);
                            _itemQuantityContext.SaveChanges();

                            GenrateAutomaticSpo(itemQuantity, companyDetails, user);
                        }

                    }
                }
                else
                {
                    icr.IsApproved = false;
                    icr.IsRejected = true;
                    icr.ModifiedDateTime = DateTime.UtcNow;
                    _icrDetailContext.Update(icr);
                    _icrDetailContext.SaveChanges();
                    if (!icr.IsPriceChangeRequest)
                    {
                        var icrQuantity = _icrQuantityContext.Fetch(x => x.IcrDetail.RecordId == RecordId).ToList();
                        foreach (var quantity in icrQuantity)
                        {
                            var itemQuantity = new ItemQuantity();
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
                            GenrateAutomaticSpo(itemQuantity, companyDetails, user);
                        }
                    }
                    else
                    {
                        item.IsItemChangeRequestGenerated = false;
                    }
                }
                item.ModifiedDateTime = DateTime.UtcNow;
                _itemProfileContext.Update(item);
                _itemProfileContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        #region Private Region
        /// <summary>
        /// This method is used to get last workflow action name. - JJ
        /// </summary>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <returns>action name</returns>
        private string GetActionName(int RecordId)
        {
            var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().LastOrDefault();
            if (log != null)
                return log.Action;
            else
                return "";
        }

        /// <summary>
        /// This method is used to check whether Item Change Request has received the final approval. - JJ
        /// </summary>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="status">status</param>
        /// <param name="companyDetails"></param>
        /// <param name="user"></param>
        /// <param name="prevActivity"></param>
        /// <returns>status of completion of function</returns>
        private string CheckApproved(int RecordId, bool status, string prevActivity, CompanyDetail companyDetails, UserDetail user)
        {
            try
            {
                var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                var update = false;

                if ((prevActivity != null) && (status && prevActivity.Equals(StringConstants.FurtherApproval) && log.WorkFlowDetail.NextActivity.IsClosed))
                {
                    update = UpdateItem(RecordId, true, companyDetails, user);
                }
                else if (!status && log.WorkFlowDetail.NextActivity.IsClosed)
                {
                    update = UpdateItem(RecordId, false, companyDetails, user);
                }
                else
                {
                    if (log.WorkFlowDetail.NextActivity.IsClosed)
                    {
                        update = UpdateItem(RecordId, false, companyDetails, user);
                    }
                    else
                    {
                        update = true;
                    }
                }
                if (update)
                {
                    return "ok";
                }
                else
                {
                    return "Error in Updating Item";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to genrate automatic spo.
        /// </summary>
        /// <param name="itemQuantityDetails"></param>
        /// <param name="companyDetail"></param>
        /// <param name="userDetail"></param>
        private void GenrateAutomaticSpo(ItemQuantity itemQuantityDetails, CompanyDetail companyDetail, UserDetail userDetail)
        {
            try
            {
                _itemRepository.GenrateAutomaticSpo(itemQuantityDetails, companyDetail, userDetail);
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
                _icrDetailContext.Dispose();
                _icrQuantityContext.Dispose();
                _icrPriceContext.Dispose();
                _itemQuantityContext.Dispose();
                _itemProfileContext.Dispose();
                _workFlowLogContext.Dispose();
                _userDetailContext.Dispose();
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

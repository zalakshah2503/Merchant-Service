using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Supplier
{
    public class SupplierReturnRepository : ISupplierReturnRepository
    {
        #region Private Variable
        private readonly IDataRepository<SupplierReturnDetail> _supplierReturnDetailContext;
        private readonly IDataRepository<SupplierReturnItem> _supplierReturnItemContext;
        private readonly IDataRepository<BranchDetail> _branchDetailContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemSupplier> _itemSupplierContext;
        private readonly IDataRepository<CompanyConfiguration> _companyConfigurationContext;
        private readonly IWorkFlowDetailsRepository _IWorkFlowDetailsRepository;
        private readonly IItemRepository _iItemRepository;
        private readonly ISupReturnWorkListRepository _ISupReturnWorkListRepository;
        private readonly ISystemParameterRepository _systemParameterContext;
        private readonly ISupplierProfileRepository _supplierProfileContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public SupplierReturnRepository(ISupplierProfileRepository supplierProfileContext, IItemRepository iItemRepository,
            IDataRepository<CompanyConfiguration> companyConfigurationContext, IDataRepository<BranchDetail> branchDetailContext,
            IDataRepository<ItemProfile> itemProfileContext, ISupReturnWorkListRepository ISupReturnWorkListRepository,
           IDataRepository<SupplierReturnItem> supplierReturnItemContext, IWorkFlowDetailsRepository IWorkFlowDetailsRepository,
            IDataRepository<SupplierReturnDetail> supplierReturnDetailContext, ISystemParameterRepository systemParameterContext,
            IDataRepository<ItemSupplier> itemSupplierContext, IErrorLog errorLog)
        {
            _supplierReturnDetailContext = supplierReturnDetailContext;
            _supplierReturnItemContext = supplierReturnItemContext;
            _itemProfileContext = itemProfileContext;
            _ISupReturnWorkListRepository = ISupReturnWorkListRepository;
            _systemParameterContext = systemParameterContext;
            _supplierProfileContext = supplierProfileContext;
            _IWorkFlowDetailsRepository = IWorkFlowDetailsRepository;
            _companyConfigurationContext = companyConfigurationContext;
            _iItemRepository = iItemRepository;
            _branchDetailContext = branchDetailContext;
            _itemSupplierContext = itemSupplierContext;
            _errorLog = errorLog;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// This method is used for save new  supplier return request in database. - JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">object of SupplierReturnRequest</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="user">object of UserDetail</param>
        /// <returns>object of SupplierReturnRequest</returns>

        public SupplierReturnRequest SaveSupplierReturnRequest(SupplierReturnRequest SupplierReturnRequest, UserDetail user, CompanyDetail company)
        {
            try
            {
                var status = CheckSupplierConditions(SupplierReturnRequest.SupplierId, SupplierReturnRequest.SupplierReturnItemAC);
                if (status == "ok")
                {
                    var ParentRecordId = 0;
                    var workFlowLog = _IWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.SupplierReturnRequest, StringConstants.InitiateSupplierReturnRequest, user, company, null, SupplierReturnRequest.InitiationComment, null);
                    if (workFlowLog != null)
                    {
                        WorkFlowLog log = (WorkFlowLog)workFlowLog.Item1;
                        WorkFlowDetail workFlowDetail = (WorkFlowDetail)workFlowLog.Item2;
                        ParentRecordId = log.RecordId;
                        var requestNo = RequestNumberGenerator(company.Id);
                        var supplierReturnDetail = new SupplierReturnDetail
                        {
                            CreatedDateTime = DateTime.UtcNow,
                            IsRejected = false,
                            IsDeleted = false,
                            RecordId = ParentRecordId,
                            LastActivityDate = DateTime.UtcNow,
                            SupplierId = SupplierReturnRequest.SupplierId,
                            RequestNo = requestNo,
                            BranchId = SupplierReturnRequest.BranchId,
                            InitiatorId = user.Id,
                            InitiationComment = SupplierReturnRequest.InitiationComment
                        };
                        _supplierReturnDetailContext.Add(supplierReturnDetail);
                        _supplierReturnDetailContext.SaveChanges();

                        foreach (var item in SupplierReturnRequest.SupplierReturnItemAC)
                        {
                            var supplierReturnItem = new SupplierReturnItem
                            {
                                CostPrice = item.CostPrice,
                                CreatedDateTime = DateTime.UtcNow,
                                ItemId = item.ItemId,
                                ReturnQuantity = item.ReturnQuantity,
                                SupplierReturnId = supplierReturnDetail.Id,
                                ReturnCauseId = item.ReturnCauseId
                            };
                            _supplierReturnItemContext.Add(supplierReturnItem);
                            _supplierReturnItemContext.SaveChanges();

                            var itemProfile = _itemProfileContext.Find(item.ItemId);
                            itemProfile.IsSupplierReturnRequestGenerated = true;
                            _itemProfileContext.Update(itemProfile);
                            _itemProfileContext.SaveChanges();
                        }
                        SupplierReturnRequest.SupplierReturnId = supplierReturnDetail.Id;
                        var companyid = _branchDetailContext.Find(supplierReturnDetail.BranchId).CompanyId;
                        if (workFlowDetail.NextActivity.IsClosed)
                        {
                            var outcome = _ISupReturnWorkListRepository.IssueCreditNote(supplierReturnDetail.Id, supplierReturnDetail.BranchId, companyid, supplierReturnDetail.InitiationComment);
                            if (outcome)
                                SupplierReturnRequest.Status = "print";
                            else
                                SupplierReturnRequest.Status = "Error in Issueing Credit Note";
                            return SupplierReturnRequest;
                        }
                        else
                        {
                            SupplierReturnRequest.Status = "ok";
                            return SupplierReturnRequest;
                        }
                    }
                    else
                    {
                        SupplierReturnRequest.Status = StringConstants.WorkFlowNotCreated;
                        return SupplierReturnRequest;
                    }
                }
                else
                {
                    SupplierReturnRequest.Status = status;
                    return SupplierReturnRequest;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for update supplier return request in database. - JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">object of SupplierReturnRequest</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="user">object of UserDetail</param>
        /// <returns>status</returns>
        public string UpdateSupplierReturnRequest(SupplierReturnRequest SupplierReturnRequest, UserDetail user, CompanyDetail company)
        {
            try
            {
                var workFlowLog = new WorkFlowLog();
                var supplierReturn = _supplierReturnDetailContext.Fetch(x => x.RecordId == SupplierReturnRequest.RecordId).FirstOrDefault();
                if (supplierReturn.IsRejected || supplierReturn.IsDeleted)
                {
                    if (supplierReturn.IsRejected)
                        return "Supplier Return Request is Rejected. You cannot Resubmit or Edit it";
                    else
                        return "Supplier Return Request is Deleted. You cannot Resubmit or Edit it";
                }
                else
                {
                    var status = CheckSupplierConditions(SupplierReturnRequest.SupplierId, SupplierReturnRequest.SupplierReturnItemAC);
                    if (status == "ok")
                    {
                        if (SupplierReturnRequest.IsResubmit)
                        {
                            workFlowLog = _IWorkFlowDetailsRepository.GetResubmitActionWorkFlow(SupplierReturnRequest.RecordId, SupplierReturnRequest, SupplierReturnRequest, StringConstants.ReSubmitedAction, SupplierReturnRequest.Comment, user);
                        }
                        else
                        {
                            workFlowLog = _IWorkFlowDetailsRepository.GetResubmitActionWorkFlow(SupplierReturnRequest.RecordId, SupplierReturnRequest, SupplierReturnRequest, StringConstants.EditedAction, SupplierReturnRequest.InitiationComment, user);
                        }
                        if (workFlowLog != null)
                        {
                            supplierReturn.SupplierId = SupplierReturnRequest.SupplierId;
                            supplierReturn.LastActivityDate = DateTime.UtcNow;
                            supplierReturn.ModifiedDateTime = DateTime.UtcNow;
                            _supplierReturnDetailContext.Update(supplierReturn);
                            _supplierReturnDetailContext.SaveChanges();

                            DeleteSupplierReturnItem(supplierReturn.Id);

                            foreach (var item in SupplierReturnRequest.SupplierReturnItemAC)
                            {
                                var supplierReturnItem = new SupplierReturnItem
                                {
                                    CostPrice = item.CostPrice,
                                    CreatedDateTime = DateTime.UtcNow,
                                    ItemId = item.ItemId,
                                    ReturnQuantity = item.ReturnQuantity,
                                    SupplierReturnId = SupplierReturnRequest.SupplierReturnId,
                                    ReturnCauseId = item.ReturnCauseId
                                };
                                _supplierReturnItemContext.Add(supplierReturnItem);
                                _supplierReturnItemContext.SaveChanges();

                                var itemProfile = _itemProfileContext.Find(item.ItemId);
                                itemProfile.IsSupplierReturnRequestGenerated = true;
                                itemProfile.ModifiedDateTime = DateTime.UtcNow;
                                _itemProfileContext.Update(itemProfile);
                                _itemProfileContext.SaveChanges();
                            }
                            return "ok";
                        }
                        else
                        {
                            return StringConstants.WorkFlowNotCreated;
                        }
                    }
                    else
                    {
                        return status;
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used fetch Item List from database. - JJ
        /// </summary>
        /// <param name="CompanyDetail">object of CompanyDetail</param>
        /// ?<param name="BranchId"></param>
        /// <returns>list of ItemProfileAC</returns>
        public List<ItemProfileAC> GetItemList(CompanyDetail company, int BranchId)
        {
            try
            {
                var itemACList = new List<ItemProfileAC>();
                var itemList = _itemProfileContext.Fetch(x => x.IsDeleted == false && x.CompanyId == company.Id && x.IsActive && x.IsParentItem).ToList();
                if (itemList != null)
                {
                    foreach (var item in itemList)
                    {
                        var itemProfileList = GetItemProfileAcObject(item, BranchId);
                        foreach (var itemProfile in itemProfileList)
                        {
                            var childitemList = _itemProfileContext.Fetch(x => x.IsDeleted == false && x.CompanyId == company.Id && x.IsActive && x.ParentItemId == item.Id).ToList();
                            itemProfile.listOfChildProfileAC = new List<SubItemProfileAC>();
                            foreach (var childItem in childitemList)
                            {
                                itemProfile.HasChildItem = true;
                                itemProfile.listOfChildProfileAC.Add(GetSubItemProfileAcObject(childItem, BranchId, itemProfile.SupplierId, itemProfile.SupplierName));
                            }
                            itemACList.Add(itemProfile);
                        }
                    }
                }
                return itemACList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for generating RequestNo number - jj
        /// </summary>
        /// <param name="companyId">Id of logged in user's company</param>
        /// <returns>RequestNumber</returns>
        public string RequestNumberGenerator(int companyId)
        {
            var companyConfig = _companyConfigurationContext.First(x => x.CompanyId == companyId);
            var SupplierReturnNo = companyConfig.SupplierReturnNo;
            var returnnumber = "";
            var checkSR = "" + SupplierReturnNo + "" + DateTime.UtcNow.ToString("ddMMyy");
            var num = _supplierReturnDetailContext.Fetch(x => x.RequestNo.Contains(checkSR)).Count();
            if (num == 0)
            {
                var numString = (num + 1).ToString();
                var ponum = numString.PadLeft(numString.Length + 4 - 1, '0');
                returnnumber = checkSR + "" + ponum;
            }
            else
            {
                var requestLists = _supplierReturnDetailContext.Fetch(x => x.BranchDetail.CompanyId == companyId).ToList();
                if (requestLists.Any())
                {
                    var lastRecord = requestLists.Last();
                    var fixedPrefixLen = SupplierReturnNo.Length + 8;
                    int subSR = int.Parse(lastRecord.RequestNo.Substring(fixedPrefixLen));
                    string nextSR = (subSR + 1).ToString();
                    // number of zero required
                    int countZero = (4 - nextSR.Length) >= 0 ? (4 - nextSR.Length) : 0;
                    string sub;
                    if (countZero > 0)
                    {
                        sub = nextSR.PadLeft(countZero + 1, '0');
                    }
                    else
                    {
                        sub = nextSR;
                    }
                    returnnumber = checkSR + "" + sub;
                }
            }
            return returnnumber;
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// This method is used to check whether items can be returned to a supplier. - JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">list of objects of SupplierReturnRequest</param>
        /// <param name="SupplierId"></param>
        /// <returns>status</returns>
        private string CheckSupplierConditions(int SupplierId, List<SupplierReturnItemAC> SupplierReturnItemAC)
        {
            var causeList = _systemParameterContext.GetSystemParameterListById(35);
            var causeId = 0;
            var supplier = _supplierProfileContext.DoesSupplierAcceptExpiredItem(SupplierId);
            var allowSave = true;
            if (supplier != null)
            {
                if (supplier.IsActive)
                {
                    foreach (var cause in causeList)
                    {
                        if (cause.ValueEn == StringConstants.Expier)
                        {
                            causeId = cause.Id;
                        }
                    }
                    foreach (var returnItem in SupplierReturnItemAC)
                    {
                        if (causeId == returnItem.ReturnCauseId && !supplier.IsAcceptReturnForExpiredItem)
                        {
                            allowSave = false;
                            break;
                        }
                    }
                    if (allowSave)
                    {
                        return "ok";
                    }
                    else
                    {
                        return "Supplier does not accept expired items";
                    }
                }
                else
                {
                    return "Items cannot be returned as Supplier is Inactive";
                }
            }
            else
            {
                return "Supplier Does Not Exist";
            }
        }

        /// <summary>
        /// This method used to form a list of items according to their suppliers - JJ
        /// </summary>
        /// <param name="BranchId"></param>
        /// <param name="item"></param>
        /// <returns>list of objects of ItemProfileAC</returns>        
        private List<ItemProfileAC> GetItemProfileAcObject(ItemProfile item, int BranchId)
        {
            try
            {
                ItemProfileAC itemProfileAc;
                List<ItemProfileAC> itemList = new List<ItemProfileAC>();
                var supplierList = _itemSupplierContext.Fetch(x => x.CategoryId == item.CategoryId).ToList();
                foreach (var supplier in supplierList)
                {
                    itemProfileAc = new ItemProfileAC();
                    itemProfileAc.AverageCostPrice = item.AverageCostPrice;
                    itemProfileAc.Barcode = item.Barcode;
                    itemProfileAc.BaseUnit = item.BaseUnit;
                    itemProfileAc.CategoryId = item.CategoryId;
                    itemProfileAc.SupplierId = supplier.SupplierProfile.Id;
                    itemProfileAc.SupplierName = supplier.SupplierProfile.NameEn;
                    itemProfileAc.Code = item.Code;
                    itemProfileAc.CostPrice = item.CostPrice;
                    itemProfileAc.FlavourEn = item.FlavourEn;
                    itemProfileAc.FlavourSl = item.FlavourSl;
                    itemProfileAc.HasOffer = item.HasOffer;
                    itemProfileAc.IsActive = item.IsActive;
                    itemProfileAc.IsIcrApproved = item.IsIcrApproved;
                    itemProfileAc.IsItemChangeRequestGenerated = item.IsItemChangeRequestGenerated;
                    itemProfileAc.IsSupplierReturnRequestGenerated = item.IsSupplierReturnRequestGenerated;
                    itemProfileAc.IsOfferItem = item.IsOfferItem;
                    itemProfileAc.IsParentItem = item.IsParentItem;
                    itemProfileAc.ItemNameEn = item.ItemNameEn;
                    itemProfileAc.ItemNameSl = item.ItemNameSl;
                    itemProfileAc.OldRequestQuantity = 0;
                    itemProfileAc.PreviousCostPrice = item.PreviousCostPrice;
                    itemProfileAc.ProfitMargin = item.ProfitMargin;
                    itemProfileAc.SellPrice = item.SellPrice;
                    itemProfileAc.SellPriceA = item.SellPriceA;
                    itemProfileAc.SellPriceB = item.SellPriceB;
                    itemProfileAc.SellPriceC = item.SellPriceC;
                    itemProfileAc.SellPriceD = item.SellPriceD;
                    itemProfileAc.UnitParamTypeId = item.UnitParamTypeId;
                    itemProfileAc.Id = item.Id;
                    itemProfileAc.ItemId = item.Id;
                    itemProfileAc.ItemType = item.Category.BrandParamType.ValueEn + "-" + item.Category.GroupParamType.ValueEn;
                    itemProfileAc.Unit = item.SystemParameter.ValueEn;
                    itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(item.Id);

                    if (itemProfileAc.IsParentItem)
                    {
                        itemProfileAc.ParentItemId = item.Id;
                        var itemQuantity = _iItemRepository.GetItemQuantityByItemId(itemProfileAc.Id, Convert.ToInt32(BranchId));
                        itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                        itemProfileAc.UpdateSystemQunatity = itemProfileAc.SystemQuantity;
                    }
                    else
                    {
                        itemProfileAc.ParentItemId = item.ParentItemId;
                        if (itemProfileAc.BaseUnit > 0)
                        {
                            var itemQuantity = _iItemRepository.GetItemQuantityByItemId((int)itemProfileAc.ParentItemId, Convert.ToInt32(BranchId));
                            itemProfileAc.SystemQuantity = itemQuantity != null ? Math.Floor((decimal)(itemQuantity.ActualQuantity / itemProfileAc.BaseUnit)) : 0;
                            itemProfileAc.UpdateSystemQunatity = itemQuantity.ActualQuantity;
                        }
                        else
                        {
                            itemProfileAc.SystemQuantity = 0;
                        }
                    }
                    itemProfileAc.ActualQuantity = Convert.ToInt32(itemProfileAc.SystemQuantity);
                    itemList.Add(itemProfileAc);
                }
                return itemList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used convert model class to application class and add quantity data . - JJ
        /// </summary>
        /// <param name="BranchId"></param>
        /// <param name="childItem">object of ItemProfile</param>
        /// <param name="SupplierId"></param>
        /// <param name="SupplierName"></param>
        /// <returns>object of SubItemProfileAC</returns>
        private SubItemProfileAC GetSubItemProfileAcObject(ItemProfile childItem, int BranchId, int SupplierId, string SupplierName)
        {
            try
            {
                SubItemProfileAC itemProfileAc = new SubItemProfileAC();
                itemProfileAc.AverageCostPrice = childItem.AverageCostPrice;
                itemProfileAc.Barcode = childItem.Barcode;
                itemProfileAc.BaseUnit = childItem.BaseUnit;
                itemProfileAc.CategoryId = childItem.CategoryId;
                itemProfileAc.SupplierId = SupplierId;
                itemProfileAc.SupplierName = SupplierName;
                itemProfileAc.Code = childItem.Code;
                itemProfileAc.CostPrice = childItem.CostPrice;
                itemProfileAc.FlavourEn = childItem.FlavourEn;
                itemProfileAc.FlavourSl = childItem.FlavourSl;
                itemProfileAc.HasOffer = childItem.HasOffer;
                itemProfileAc.IsActive = childItem.IsActive;
                itemProfileAc.IsIcrApproved = childItem.IsAutomaticPO;
                itemProfileAc.IsOfferItem = childItem.IsOfferItem;
                itemProfileAc.IsParentItem = childItem.IsParentItem;
                itemProfileAc.ItemNameEn = childItem.ItemNameEn;
                itemProfileAc.ItemNameSl = childItem.ItemNameSl;
                itemProfileAc.ParentItemId = childItem.ParentItemId;
                itemProfileAc.PreviousCostPrice = childItem.PreviousCostPrice;
                itemProfileAc.OldRequestQuantity = 0;
                itemProfileAc.IsSupplierReturnRequestGenerated = childItem.IsSupplierReturnRequestGenerated;
                itemProfileAc.IsItemChangeRequestGenerated = childItem.IsItemChangeRequestGenerated;
                itemProfileAc.ProfitMargin = childItem.ProfitMargin;
                itemProfileAc.SellPrice = childItem.SellPrice;
                itemProfileAc.SellPriceA = childItem.SellPriceA;
                itemProfileAc.SellPriceB = childItem.SellPriceB;
                itemProfileAc.SellPriceC = childItem.SellPriceC;
                itemProfileAc.SellPriceD = childItem.SellPriceD;
                itemProfileAc.UnitParamTypeId = childItem.UnitParamTypeId;
                itemProfileAc.Id = childItem.Id;
                itemProfileAc.ItemId = childItem.Id;
                itemProfileAc.IsIssueInventory = childItem.IsIssueInventory;
                itemProfileAc.ItemType = childItem.Category.BrandParamType.ValueEn + "-" + childItem.Category.GroupParamType.ValueEn;
                itemProfileAc.Unit = childItem.SystemParameter.ValueEn;
                itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(childItem.Id);
                itemProfileAc.BaseUnitCount = childItem.SystemParameter.ValueEn + " - " + childItem.BaseUnit;
                if (BranchId != 0)
                {
                    itemProfileAc.ParentItemId = childItem.ParentItemId;
                    if (itemProfileAc.BaseUnit > 0)
                    {
                        var itemQuantity = _iItemRepository.GetItemQuantityByItemId((int)itemProfileAc.ParentItemId, Convert.ToInt32(BranchId));
                        itemProfileAc.SystemQuantity = itemQuantity != null ? Math.Floor((decimal)(itemQuantity.ActualQuantity / itemProfileAc.BaseUnit)) : 0;
                        itemProfileAc.UpdateSystemQunatity = itemProfileAc.SystemQuantity;
                    }
                    else
                    {
                        itemProfileAc.SystemQuantity = 0;
                    }
                    itemProfileAc.ActualQuantity = Convert.ToInt32(itemProfileAc.SystemQuantity);
                }
                return itemProfileAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for delete SupplierReturnItem in database. - JJ
        /// </summary>
        /// <param name="Id">id of SupplierReturnDetail</param>
        /// <returns>void</returns>
        private void DeleteSupplierReturnItem(int Id)
        {
            try
            {
                if (_supplierReturnItemContext.Fetch(x => x.SupplierReturnId == Id).ToList().Any())
                {
                    var items = _supplierReturnItemContext.Fetch(x => x.SupplierReturnId == Id).ToList();
                    foreach (var item in items)
                    {
                        _supplierReturnItemContext.Delete(item.Id);
                        _supplierReturnItemContext.SaveChanges();

                        var itemProfile = _itemProfileContext.Find(item.ItemId);
                        itemProfile.IsSupplierReturnRequestGenerated = false;
                        itemProfile.ModifiedDateTime = DateTime.UtcNow;
                        _itemProfileContext.Update(itemProfile);
                        _itemProfileContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }

        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _supplierReturnDetailContext.Dispose();
                _supplierReturnItemContext.Dispose();
                _companyConfigurationContext.Dispose();
                _branchDetailContext.Dispose();
                _itemProfileContext.Dispose();
                _itemSupplierContext.Dispose();
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

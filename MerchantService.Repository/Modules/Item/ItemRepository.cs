using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.ItemDestruction;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Role;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.SupplierPO;
using MerchantService.Repository.Modules.WorkFlow;
using System.Text;

namespace MerchantService.Repository.Modules.Item
{
    public class ItemRepository : IItemRepository, IDisposable
    {
        #region "Private Variable(s)"
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<SystemParameter> _isystemParamTypeContext;
        private readonly IDataRepository<UserDetail> _iUserDetailContext;
        private readonly IDataRepository<CompanyConfiguration> _iCompanyConfigration;
        private readonly IDataRepository<ItemQuantity> _iItemQuantityContext;
        private readonly IDataRepository<PurchaseOrderItem> _iPurchaseOrderItemContext;
        private readonly IDataRepository<ItemOffer> _iItemOfferContext;
        private readonly IDataRepository<StatusType> _iStatusTypeContext;
        private readonly IDataRepository<BranchDetail> _iBranchDetailContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<ConditionalOperator> _conditionalOperatorContext;
        private readonly IDataRepository<ItemSupplier> _itemSupplierContext;
        private readonly IDataRepository<WorkFlowLog> _iWorkFlowLogContext;
        private readonly IDataRepository<WorkFlowDetail> _iWorkFlowDetailContext;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPOContext;
        private readonly IDataRepository<PurchaseOrderItem> _purchaseOrderItemContext;
        private readonly IDataRepository<PurchaseOrderBranch> _purchaseOrderBranchContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListContext;
        private readonly IWorkFlowDetailsRepository _IWorkFlowDetailsRepository;
        private readonly IDataRepository<AutomaticPODetail> _autoPODetailContext;
        private readonly IDataRepository<Role> _roleDataContext;
        private readonly IDataRepository<CompanyBarcodeConfiguration> _companyBarcodeConfiguration;

        #endregion

        #region "Constructor & Destructor(s)"

        public ItemRepository(IErrorLog errorLog, IDataRepository<ItemProfile> itemProfileContext, IDataRepository<SystemParameter> isystemParamTypeContext, IDataRepository<UserDetail> iUserDetailContext, IDataRepository<CompanyDetail> iCompanyDetailContext
            , IDataRepository<CompanyConfiguration> iCompanyConfigration, IDataRepository<ItemQuantity> iItemQuantityContext, IDataRepository<Category> iCategoryContext,
            IDataRepository<PurchaseOrderItem> iPurchaseOrderItemContext, IDataRepository<ItemOffer> iItemOfferContext, IDataRepository<StatusType> iStatusTypeContext,
            IDataRepository<BranchDetail> iBranchDetailContext, IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<ConditionalOperator> conditionalOperatorContext
            , IDataRepository<ItemSupplier> itemSupplierContext, IDataRepository<WorkFlowLog> iWorkFlowLogContext, IDataRepository<WorkFlowDetail> iWorkFlowDetailContext
            , IDataRepository<AutomaticPODetail> autoPODetailContext, ISupplierPOWorkListRepository supplierPOWorkListContext, IDataRepository<PurchaseOrderItem> purchaseOrderItemContext, IDataRepository<ParamType> paramTypeContext, IDataRepository<Role> roleDataContext, IDataRepository<SupplierPurchaseOrder> supplierPOContext, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IDataRepository<PurchaseOrderBranch> purchaseOrderBranchContext,
            IDataRepository<CompanyBarcodeConfiguration> companyBarcodeConfiguration)
        {
            _errorLog = errorLog;
            _itemSupplierContext = itemSupplierContext;
            _iItemQuantityContext = iItemQuantityContext;
            _iUserDetailContext = iUserDetailContext;
            _iCompanyConfigration = iCompanyConfigration;
            _isystemParamTypeContext = isystemParamTypeContext;
            _itemProfileContext = itemProfileContext;
            _iPurchaseOrderItemContext = iPurchaseOrderItemContext;
            _iItemOfferContext = iItemOfferContext;
            _iStatusTypeContext = iStatusTypeContext;
            _iWorkFlowDetailContext = iWorkFlowDetailContext;
            _iWorkFlowLogContext = iWorkFlowLogContext;
            _iBranchDetailContext = iBranchDetailContext;
            _conditionalOperatorContext = conditionalOperatorContext;
            _supplierPOContext = supplierPOContext;
            _itemQuantityContext = itemQuantityContext;
            _IWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _conditionalOperatorContext = conditionalOperatorContext;
            _roleDataContext = roleDataContext;
            _autoPODetailContext = autoPODetailContext;
            _purchaseOrderBranchContext = purchaseOrderBranchContext;
            _purchaseOrderItemContext = purchaseOrderItemContext;
            _supplierPOWorkListContext = supplierPOWorkListContext;
            _paramTypeContext = paramTypeContext;
            _companyBarcodeConfiguration = companyBarcodeConfiguration;
        }
        #endregion

        #region "Dispose Method(s)"
        /// <summary>
        /// Method disposes the repository context 
        /// </summary>
        public void Dispose()
        {
            try
            {
                _itemProfileContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion

        #region "Public Method(s)"

        public string GenrateCompanyBarcode(int companyId)
        {
            CompanyBarcodeConfiguration companyBarcodeConfiguration = _companyBarcodeConfiguration.FirstOrDefault(x => x.CompanyId == companyId);
            if (companyBarcodeConfiguration != null)
            {
                Random random = new Random();
                int lengthOfStartWith = (companyBarcodeConfiguration.StartWith != null && companyBarcodeConfiguration.StartWith != 0) ? companyBarcodeConfiguration.StartWith.ToString().Length : 0;
                int remainingToLength = companyBarcodeConfiguration.To - lengthOfStartWith;
                int remainingFromLength = companyBarcodeConfiguration.From - lengthOfStartWith;
                int barcodeGenrationRange = random.Next((remainingFromLength < 0 ?  0 : remainingFromLength), remainingToLength);

                //Initialize static 0 to 9.
                string chars = StringConstants.RendomNumber;
                StringBuilder stringBuilder = new StringBuilder();
                for (var i = 0; i < barcodeGenrationRange; i++)
                {
                    stringBuilder.Append(chars[random.Next(0, 9)]);
                }
                if (companyBarcodeConfiguration.StartWith != null && companyBarcodeConfiguration.StartWith != 0)
                    return companyBarcodeConfiguration.StartWith + stringBuilder.ToString();
                else
                    return stringBuilder.ToString();
            }
            return null;
        }



        public ItemOffer GetItemOfferWithDeletedRecordById(int id)
        {
            try
            {
                return _iItemOfferContext.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used fo get condition operator by work flow id. -An
        /// </summary>
        /// <param name="workFlowId"></param>
        /// <returns></returns>
        public ConditionalOperator GetConditionalOperatorByWorkFlowId(int workFlowId)
        {
            try
            {
                return _conditionalOperatorContext.FirstOrDefault(x => x.WorkFlowDetailId == workFlowId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get itemoffer detail by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ItemOfferDetailAC GetItemOfferDetailById(int id, UserDetail userDetails, int companyId)
        {
            try
            {
                ItemOfferDetailAC itemOfferDetailAc = new ItemOfferDetailAC();
                ItemOffer itemOffer = _iItemOfferContext.FirstOrDefault(x => x.Id == id);
                if (itemOffer != null)
                {
                    if (itemOffer.ItemProfile != null)
                    {
                        itemOfferDetailAc.Barcode = itemOffer.ItemProfile.Barcode;
                        itemOfferDetailAc.BaseUnitCount = itemOffer.ItemProfile.BaseUnit;
                        itemOfferDetailAc.CostPrice = itemOffer.ItemProfile.CostPrice;
                        itemOfferDetailAc.FlavourEn = itemOffer.ItemProfile.FlavourEn;
                        itemOfferDetailAc.IsOfferItem = itemOffer.ItemProfile.IsOfferItem == true ? "Yes" : "No";
                        itemOfferDetailAc.ItemCode = itemOffer.ItemProfile.Code;
                        itemOfferDetailAc.ItemNameEn = itemOffer.ItemProfile.ItemNameEn;
                        itemOfferDetailAc.IsStop = itemOffer.IsStop;
                        itemOfferDetailAc.ItemType = itemOffer.ItemProfile.Category.BrandParamType.ValueEn + "-" + itemOffer.ItemProfile.Category.GroupParamType.ValueEn;
                        if (itemOffer.ItemProfile.IsParentItem)
                        {
                            var itemQunatity = _iItemQuantityContext.FirstOrDefault(x => x.ItemId == itemOffer.ItemProfile.Id && x.BranchId == userDetails.BranchId);
                            if (itemQunatity != null)
                                itemOfferDetailAc.SystemQuantity = itemQunatity.ActualQuantity > 0 ? itemQunatity.ActualQuantity : 0;
                        }
                        else
                        {
                            var itemQunatity = _iItemQuantityContext.FirstOrDefault(x => x.ItemId == itemOffer.ItemProfile.ParentItemId && x.BranchId == userDetails.BranchId);
                            if (itemQunatity != null)
                            {
                                decimal systemQuantity = itemQunatity.ActualQuantity > 0 ? (itemQunatity.ActualQuantity / itemOffer.ItemProfile.BaseUnit) : 0;
                                itemOfferDetailAc.SystemQuantity = systemQuantity > 0 ? Math.Ceiling(systemQuantity) : 0;
                            }
                        }
                        itemOfferDetailAc.SellPrice = itemOffer.ItemProfile.SellPrice;
                        itemOfferDetailAc.SellPriceA = itemOffer.ItemProfile.SellPriceA;
                        itemOfferDetailAc.SellPriceB = itemOffer.ItemProfile.SellPriceB;
                        itemOfferDetailAc.SellPriceC = itemOffer.ItemProfile.SellPriceC;
                        itemOfferDetailAc.SellPriceD = itemOffer.ItemProfile.SellPriceD;
                        itemOfferDetailAc.MarginProfit = itemOffer.ItemProfile.ProfitMargin;
                        itemOfferDetailAc.UnitType = itemOffer.ItemProfile.SystemParameter != null ? itemOffer.ItemProfile.SystemParameter.ValueEn : "";
                    }
                    itemOfferDetailAc.NewSellPrice = itemOffer.SellPrice;
                    itemOfferDetailAc.NewSellPriceA = itemOffer.SellPriceA;
                    itemOfferDetailAc.NewSellPriceB = itemOffer.SellPriceB;
                    itemOfferDetailAc.NewSellPriceC = itemOffer.SellPriceC;
                    itemOfferDetailAc.NewSellPriceD = itemOffer.SellPriceD;
                    itemOfferDetailAc.EndDate = itemOffer.EndDateTime.Date;
                    itemOfferDetailAc.EndTime = itemOffer.EndDateTime.TimeOfDay;
                    itemOfferDetailAc.StartDate = itemOffer.StartDateTime.Date;
                    itemOfferDetailAc.StartTime = itemOffer.StartDateTime.TimeOfDay;
                    itemOfferDetailAc.QuantityLimit = itemOffer.QuantityLimit;
                    itemOfferDetailAc.Discount = itemOffer.Discount;

                    var comapnyConfiguration = _iCompanyConfigration.FirstOrDefault(x => x.CompanyId == companyId);
                    if (comapnyConfiguration != null)
                        itemOfferDetailAc.IsOfferCreatedBelowCostPrice = comapnyConfiguration.IsOfferCreatedBelowCostPrice;


                    if (!itemOffer.IsDeleted)
                    {
                        if (itemOffer.EndDateTime >= DateTime.UtcNow)
                        {
                            var workFlowLog = _iWorkFlowLogContext.Fetch(x => x.RecordId == itemOffer.RecordId).OrderByDescending(x => x.CreatedDateTime).FirstOrDefault();
                            if (workFlowLog != null && workFlowLog.WorkFlowDetail != null)
                            {
                                if (workFlowLog.WorkFlowDetail.InitiatorId != workFlowLog.WorkFlowDetail.AssignedId && workFlowLog.WorkFlowDetail.AssignedId == userDetails.RoleId && workFlowLog.WorkFlowDetail.IsParentAction)
                                    itemOfferDetailAc.IsItemOfferStatusEditPanding = true;

                                //for update button dispaly
                                if (workFlowLog.WorkFlowDetail.IsRejectPanel && workFlowLog.WorkFlowDetail.AssignedId == userDetails.RoleId)
                                    itemOfferDetailAc.IsAllowToUpdate = true;

                                if (workFlowLog.WorkFlowDetail.Activity.Name == StringConstants.Review && workFlowLog.WorkFlowDetail.IsRejectPanel || workFlowLog.WorkFlowDetail.Activity.Name == "Condition" && workFlowLog.WorkFlowDetail.IsRejectPanel)
                                    itemOfferDetailAc.IsItemOfferStatusEditPanding = true;

                                #region Check Already Approve Or Not.
                                if (!workFlowLog.WorkFlowDetail.IsApproval && workFlowLog.WorkFlowDetail.IsParentAction) //to check Approval is complesoury or not.
                                {
                                    List<WorkFlowDetail> listOfWorkFlowDetail = _iWorkFlowDetailContext.Fetch(x => x.ParentActivityId == workFlowLog.WorkFlowDetail.Id).ToList();
                                    if (listOfWorkFlowDetail.Any())
                                    {
                                        foreach (var workFlowDetial in listOfWorkFlowDetail)
                                        {
                                            if (workFlowDetial.NextActivity.IsClosed)
                                            {
                                                itemOfferDetailAc.IsApprove = true;
                                                itemOfferDetailAc.IsAllowToUpdate = false;
                                                ////to check stop action is already done so this condition is true and isStoped is set true.
                                                if (itemOffer.IsActive)
                                                    itemOfferDetailAc.IsResume = true;
                                                else   ////to check resume action is already done so this condition is true and isResume is set true.
                                                {
                                                    if (itemOffer.EndDateTime < DateTime.UtcNow)
                                                        itemOfferDetailAc.IsStoped = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (workFlowLog.WorkFlowDetail.NextActivity.IsClosed)//When after all aprroval this bit set true.
                                {
                                    itemOfferDetailAc.IsAllowToUpdate = false;
                                    ////to check stop action is already done so this condition is true and isStoped is set true.
                                    if (itemOffer.IsActive)
                                        itemOfferDetailAc.IsResume = true;
                                    else   ////to check resume action is already done so this condition is true and isResume is set true.
                                    {
                                        if (itemOffer.EndDateTime < DateTime.UtcNow)
                                            itemOfferDetailAc.IsStoped = true;
                                    }
                                }
                                #endregion

                                //after item offer is aprrove and reject this boolean set true. 
                                if ((workFlowLog.WorkFlowDetail.Activity.Name == StringConstants.Review && workFlowLog.WorkFlowDetail.IsRejectPanel))
                                    itemOfferDetailAc.IsAlreadyValidReject = true;

                                if (workFlowLog.WorkFlowDetail.WorkFlowName == StringConstants.DeleteItemOffer && workFlowLog.WorkFlowDetail.IsApproval)
                                    itemOfferDetailAc.IsDeletedRequest = true;

                            }
                        }
                        else
                            itemOfferDetailAc.IsDeleted = true;
                    }
                    else
                        itemOfferDetailAc.IsDeleted = true;
                }
                return itemOfferDetailAc;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for update item Quantity. -An
        /// </summary>
        /// <param name="item"></param>
        /// <param name="branchId"></param>
        /// <param name="destructionQuantity"></param>
        /// <param name="companyDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="itemId"></param>
        /// <returns></returns>
        public int UpdateItemQuantity(ItemProfile item, int branchId, int destructionQuantity, CompanyDetail companyDetails, UserDetail userDetails)
        {
            try
            {
                if (item.IsParentItem)
                {
                    var itemQunatity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == branchId);
                    if (itemQunatity != null)
                    {
                        itemQunatity.ActualQuantity = itemQunatity.ActualQuantity - destructionQuantity;
                        itemQunatity.ActualQuantity = itemQunatity.ActualQuantity > 0 ? itemQunatity.ActualQuantity : 0;
                        itemQunatity.ModifiedDateTime = DateTime.UtcNow;
                        _itemQuantityContext.Update(itemQunatity);
                        _itemQuantityContext.SaveChanges();
                        GenrateAutomaticSpo(itemQunatity, companyDetails, userDetails);
                        return itemQunatity.Id;
                    }
                }
                else
                {
                    var parentItemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.ParentItemId && x.BranchId == branchId);
                    if (parentItemQuantity != null)
                    {
                        int systemQuantity = parentItemQuantity.ActualQuantity - (item.BaseUnit * destructionQuantity);
                        parentItemQuantity.ActualQuantity = systemQuantity > 0 ? systemQuantity : 0;
                        parentItemQuantity.ModifiedDateTime = DateTime.UtcNow;
                        _itemQuantityContext.Update(parentItemQuantity);
                        _itemQuantityContext.SaveChanges();
                        GenrateAutomaticSpo(parentItemQuantity, companyDetails, userDetails);
                        return parentItemQuantity.Id;
                    }
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get list of conditional operator. -An
        /// </summary>
        /// <param name="parentConditionalOperatorId"></param>
        /// <returns></returns>
        public List<ConditionalOperator> GetListOfConditionalOperator(int workFlowId)
        {
            try
            {
                return _conditionalOperatorContext.Fetch(x => x.WorkFlowDetailId == workFlowId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get Item Supplier By Category Is. -An
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public List<ItemSupplier> GetItemSupplierListByCategoryId(int categoryId)
        {
            try
            {
                return _itemSupplierContext.Fetch(x => x.CategoryId == categoryId && !x.IsDelete).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method is used for geeting list of without offer item Profile list. 
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>list of item profile</returns>
        public List<ItemProfile> GetListOfWithOutOfferItem(int companyId)
        {
            try
            {
                return _itemProfileContext.Fetch(x => !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId && !x.IsOfferItem).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This metod used for get list of item profile with searching
        /// </summary>
        /// <param name="itemDestructionSearchModelAC"></param>
        /// <param name="comapnyId"></param>
        /// <returns></returns>
        public List<ItemProfile> GetListOfItemProfileWithSearching(ItemDestructionSearchModelAC itemDestructionSearchModelAC, int comapnyId)
        {
            try
            {
                var result = _itemProfileContext.Fetch(x => !x.IsDeleted && x.CompanyId == comapnyId);

                if (itemDestructionSearchModelAC.Barcode != "" && itemDestructionSearchModelAC.Barcode != null)
                {
                    result = result.Where(x => x.Barcode == itemDestructionSearchModelAC.Barcode);
                }
                if (itemDestructionSearchModelAC.ItemNameEn != "" && itemDestructionSearchModelAC.ItemNameEn != null)
                {
                    result = result.Where(x => x.ItemNameEn.Contains(itemDestructionSearchModelAC.ItemNameEn));
                }
                if (itemDestructionSearchModelAC.ItemCode != "" && itemDestructionSearchModelAC.ItemCode != null)
                {
                    result = result.Where(x => x.Code == itemDestructionSearchModelAC.ItemCode);
                }
                if (itemDestructionSearchModelAC.UnitParamTypeId != 0)
                {
                    result = result.Where(x => x.UnitParamTypeId == itemDestructionSearchModelAC.UnitParamTypeId);
                }
                if (itemDestructionSearchModelAC.CategoryId != 0)
                {
                    result = result.Where(x => x.CategoryId == itemDestructionSearchModelAC.CategoryId);
                }
                return result.ToList();

            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// This method used for get list of item offer for all branch. -An 
        /// </summary>
        /// <returns></returns>
        public List<ItemOffer> GetListOfItemOfferAllBranch()
        {
            try
            {
                return _iItemOfferContext.GetAll().OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update item qunatity return primary key. -An
        /// </summary>
        /// <param name="itemQunatity"></param>
        /// <returns></returns>
        public int UpdateItemQunatity(ItemQuantity itemQunatity)
        {
            try
            {
                itemQunatity.ModifiedDateTime = DateTime.UtcNow;
                _iItemQuantityContext.Update(itemQunatity);
                _iItemQuantityContext.SaveChanges();
                return itemQunatity.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get item Quantity by branch id and item id. -An
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        public ItemQuantity GetItemQunatityByItemIdAndBranchId(int itemId, int branchId)
        {
            try
            {
                return _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemId && x.BranchId == branchId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for update item offer and return primary key.-An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns></returns>
        public int UpdateItemOffer(ItemOffer itemOffer)
        {
            try
            {
                itemOffer.ModifiedDateTime = DateTime.UtcNow;
                _iItemOfferContext.Update(itemOffer);
                _iItemOfferContext.SaveChanges();
                return itemOffer.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get list of unit type. -An
        /// </summary>
        /// <returns>list of unit types</returns>
        public List<SystemParameter> GetListOfUnitTypeByCompanyId(int companyId)
        {
            try
            {
                return _isystemParamTypeContext.Fetch(x => x.ParamId == 3 && !x.IsDelete && x.CompanyId == companyId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for check parent item have sub items. -An 
        /// </summary>
        /// <param name="parntId">pass parentId</param>
        /// <returns>return boolean, if true means sub item is exits and false for not exists</returns>
        public bool CheckAnySubItemIsExists(int parntId)
        {
            try
            {
                var itemList = _itemProfileContext.Fetch(x => x.ParentItemId == parntId && !x.IsDeleted).ToList();
                if (itemList.Any())
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for convert sub item to main item. -An
        /// </summary>
        /// <param name="id">passed item primary key id</param>
        /// <returns></returns>
        public int ConvertToMainItem(int id)
        {
            try
            {
                var itemProfile = _itemProfileContext.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
                if (itemProfile != null)
                {
                    itemProfile.IsParentItem = true;
                    itemProfile.ParentItemId = null;
                    itemProfile.ModifiedDateTime = DateTime.UtcNow;
                    _itemProfileContext.Update(itemProfile);
                    _itemProfileContext.SaveChanges();
                    return itemProfile.Id;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get margin profit by login user company id. -An
        /// </summary>
        /// <param name="name">name as login user name</param>
        /// <returns></returns>
        public decimal GetMarginProfit(int companyId)
        {
            try
            {
                var companyDetail = _iCompanyConfigration.FirstOrDefault(x => x.CompanyId == companyId);
                if (companyDetail != null)
                {
                    return companyDetail.ProfitMargin;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into item profile in item profile table and return primary key. -An
        /// </summary>
        /// <param name="itemProfile">UnitParamTypeId,CategoryId,ParentItemId,Barcode,Code,ItemNameEn,
        /// ItemNameSl,BaseUnit,FlavourEn,FlavourSl,IsActive,HasOffer,IsOfferItem,IsParentItem,IsIcrApproved,CostPriceSellPrice,SellPriceA,
        /// SellPriceB,SellPriceC,SellPriceD,PreviousCostPrice,AverageCostPrice
        ///,ProfitMargin,branchId,MinimuQuantity,MaximunQuantity,ListOfItemQuantityList</param>
        /// <returns>return primary key</returns>
        public int AddNewItemProfile(ItemProfile itemProfile)
        {
            try
            {
                var item = _itemProfileContext.FirstOrDefault(x => x.Barcode == itemProfile.Barcode && x.CompanyId == itemProfile.CompanyId && !x.IsDeleted);
                if (item == null)
                {
                    //check item code is already exists in database.
                    item = _itemProfileContext.FirstOrDefault(x => x.Code == itemProfile.Code && x.CompanyId == itemProfile.CompanyId && !x.IsDeleted);
                    if (item == null)
                    {
                        if (itemProfile.IsParentItem)
                        {
                            ItemQuantityList itemQuantityList = new ItemQuantityList();
                            itemQuantityList.BranchId = itemProfile.BranchId;
                            itemQuantityList.MinimumQuantity = itemProfile.MinimumQuantity;
                            itemQuantityList.MaximumQuantity = itemProfile.MaximumQuantity;
                            itemQuantityList.ActualQuantity = itemProfile.ActualQuantity;
                            itemProfile.ListOfItemQuantityList.Add(itemQuantityList);
                        }

                        #region Check same branchs are exists.

                        //to check same branch is not exitst in this list.
                        int count = itemProfile.ListOfItemQuantityList.GroupBy(x => x.BranchId).Count();
                        if (count != itemProfile.ListOfItemQuantityList.Count())
                            return -1;
                        #endregion

                        //insert into item profile detail in item profile table
                        itemProfile.CreatedDateTime = DateTime.UtcNow;
                        itemProfile.BaseUnit = itemProfile.BaseUnit > 0 ? itemProfile.BaseUnit : 1;
                        _itemProfileContext.Add(itemProfile);
                        _itemProfileContext.SaveChanges();

                        if (itemProfile.IsAutomaticPO)
                        {
                            CreateAutomaticPODetail(itemProfile.Id, itemProfile.SupplierId, itemProfile.AutomaticPOQuantity, (int)itemProfile.InitiatorRoleId);
                        }

                        //insert item Quantity particular branch wise 
                        foreach (ItemQuantityList itemQuantityObject in itemProfile.ListOfItemQuantityList)
                        {
                            ItemQuantity itemQuantity = new ItemQuantity();
                            if (itemQuantityObject.BranchId != 0)
                            {
                                itemQuantity.ActualQuantity = itemQuantityObject.ActualQuantity;
                                itemQuantity.BranchId = itemQuantityObject.BranchId;
                                itemQuantity.MaxQuantity = itemQuantityObject.MaximumQuantity;
                                itemQuantity.MinQuantity = itemQuantityObject.MinimumQuantity;
                                itemQuantity.CreatedDateTime = DateTime.UtcNow;
                                itemQuantity.ItemId = itemProfile.Id;

                                _iItemQuantityContext.Add(itemQuantity);
                                _iItemQuantityContext.SaveChanges();
                            }
                        }

                        //check list of item quantity list.(When user not set minimum,maximum,actual quantity for branch1 so that time we insert all same qunatity as first selected branch.)
                        if (itemProfile.ListOfItemQuantityList.Count > 0)
                        {
                            List<BranchDetail> listOfBranchDetail = _iBranchDetailContext.Fetch(x => x.CompanyId == itemProfile.CompanyId && !x.IsDelete).ToList();
                            foreach (var branch in listOfBranchDetail)
                            {
                                var itemQunatityObject = itemProfile.ListOfItemQuantityList.FirstOrDefault(x => x.BranchId == branch.Id);
                                if (itemQunatityObject == null)
                                {
                                    ItemQuantity itemQuantity = new ItemQuantity();
                                    itemQuantity.ActualQuantity = itemProfile.ListOfItemQuantityList[0].ActualQuantity;
                                    itemQuantity.BranchId = branch.Id;
                                    itemQuantity.MaxQuantity = itemProfile.ListOfItemQuantityList[0].MaximumQuantity;
                                    itemQuantity.MinQuantity = itemProfile.ListOfItemQuantityList[0].MinimumQuantity;
                                    itemQuantity.CreatedDateTime = DateTime.UtcNow;
                                    itemQuantity.ItemId = itemProfile.Id;

                                    _iItemQuantityContext.Add(itemQuantity);
                                    _iItemQuantityContext.SaveChanges();
                                }
                            }

                        }
                        return itemProfile.Id;
                    }
                    return -2;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used  for get item qunatity objet by branchid and itemid. -An 
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        public ItemQuantity GetItemQunatityByBranchIdAndItemId(int itemId, int branchId)
        {
            try
            {
                return _iItemQuantityContext.FirstOrDefault(x => x.ItemId == itemId && x.BranchId == branchId);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of item profile.
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>return list of item prfoile</returns>
        public List<ItemProfile> GetListOfItemProfile(int companyId)
        {
            try
            {
                var itemList = _itemProfileContext.Fetch(x => !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId).OrderByDescending(x => x.CreatedDateTime).ToList();
                if (itemList != null)
                {
                    foreach (var item in itemList)
                    {
                        if (_iItemQuantityContext.Fetch(x => x.ItemId == item.Id).Any())
                        {
                            item.ActualQuantity = _iItemQuantityContext.First(x => x.ItemId == item.Id).ActualQuantity;
                        }
                    }
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
        /// This method used for get item profile by barocde. -An
        /// </summary>
        /// <param name="barcode"></param>
        /// <returns></returns>
        public ItemProfile GetItemProfileByBarcode(string barcode, int branchId)
        {
            try
            {
                var itemProfile = new ItemProfile();
                itemProfile = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode);
                if (itemProfile != null && itemProfile.IsAutomaticPO)
                {
                    var autoPODetail = _autoPODetailContext.FirstOrDefault(x => x.ItemId == itemProfile.Id);

                    itemProfile.AutomaticPOQuantity = autoPODetail != null ? autoPODetail.Quantity : 0;
                    itemProfile.SupplierId = autoPODetail != null ? autoPODetail.SupplierId : 0;
                    itemProfile.InitiatorRoleId = autoPODetail != null ? autoPODetail.InitiatorRoleId : 0;
                }
                return itemProfile;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }




        /// <summary>
        /// This method used for get item profile object by id. -An
        /// </summary>
        /// <param name="id">pass primary key value</param>
        /// <returns>return item profile object related passed id</returns>
        public ItemProfile GetItemProfileObjectById(int id)
        {
            try
            {
                ItemProfile itemProfile = _itemProfileContext.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
                if (itemProfile.IsAutomaticPO)
                {
                    var autoPODetail = _autoPODetailContext.FirstOrDefault(x => x.ItemId == itemProfile.Id);

                    itemProfile.AutomaticPOQuantity = autoPODetail != null ? autoPODetail.Quantity : 0;
                    itemProfile.SupplierId = autoPODetail != null ? autoPODetail.SupplierId : 0;
                    itemProfile.InitiatorRoleId = autoPODetail != null ? autoPODetail.InitiatorRoleId : 0;
                }
                if (itemProfile != null)
                {
                    List<ItemQuantityList> itemQuantityList = new List<ItemQuantityList>();

                    List<ItemQuantity> listOfitemQunatity = _iItemQuantityContext.Fetch(x => x.ItemId == itemProfile.Id && !x.Branch.IsDelete).OrderBy(x => x.Id).ToList();
                    if (listOfitemQunatity.Any())
                    {
                        itemProfile.BranchId = listOfitemQunatity[0].BranchId;
                        itemProfile.ActualQuantity = listOfitemQunatity[0].ActualQuantity > 0 ? listOfitemQunatity[0].ActualQuantity : 0;
                        itemProfile.MaximumQuantity = listOfitemQunatity[0].MaxQuantity;
                        itemProfile.MinimumQuantity = listOfitemQunatity[0].MinQuantity;


                        for (int i = 1; i <= listOfitemQunatity.Count - 1; i++)
                        {
                            ItemQuantityList itemQuantityListObject = new ItemQuantityList();
                            itemQuantityListObject.BranchId = listOfitemQunatity[i].BranchId;
                            itemQuantityListObject.ActualQuantity = listOfitemQunatity[i].ActualQuantity > 0 ? listOfitemQunatity[i].ActualQuantity : 0;
                            itemQuantityListObject.MaximumQuantity = listOfitemQunatity[i].MaxQuantity;
                            itemQuantityListObject.MinimumQuantity = listOfitemQunatity[i].MinQuantity;
                            itemQuantityList.Add(itemQuantityListObject);
                        }
                    }
                    itemProfile.ListOfItemQuantityList = itemQuantityList;
                }
                return itemProfile;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for update item profile. -An
        /// <param name="itemProfile">UnitParamTypeId,CategoryId,ParentItemId,Barcode,Code,ItemNameEn,
        /// ItemNameSl,BaseUnit,FlavourEn,FlavourSl,IsActive,HasOffer,IsOfferItem,IsParentItem,IsIcrApproved,CostPriceSellPrice,SellPriceA,
        /// SellPriceB,SellPriceC,SellPriceD,PreviousCostPrice,AverageCostPrice,Id
        ///,ProfitMargin,branchId,MinimuQuantity,MaximunQuantity,ListOfItemQuantityList</param>
        /// <returns></returns>
        public int UpdateItemProfile(ItemProfile itemProfile)
        {
            var itemObject = _itemProfileContext.GetById(itemProfile.Id);
            if (!itemObject.IsIssueInventory)
            {
                //check same barcode is exists or not. 
                var item = _itemProfileContext.FirstOrDefault(x => x.Barcode == itemProfile.Barcode && x.Id != itemProfile.Id && x.CompanyId == itemProfile.CompanyId && !x.IsDeleted);
                if (item == null)
                {
                    if (!itemProfile.IsItemChangeRequestGenerated)
                    {
                        //check item code is already exists in database.
                        item = _itemProfileContext.FirstOrDefault(x => x.Code == itemProfile.Code && x.Id != itemProfile.Id && x.CompanyId == itemProfile.CompanyId && !x.IsDeleted);
                        if (item == null)
                        {
                            if (itemProfile.IsParentItem)
                            {
                                ItemQuantityList itemQuantityList = new ItemQuantityList();
                                itemQuantityList.BranchId = itemProfile.BranchId;
                                itemQuantityList.MinimumQuantity = itemProfile.MinimumQuantity;
                                itemQuantityList.MaximumQuantity = itemProfile.MaximumQuantity;
                                itemQuantityList.ActualQuantity = itemProfile.ActualQuantity;
                                itemProfile.ListOfItemQuantityList.Add(itemQuantityList);
                            }

                            #region Check same branchs are exists.
                            //to check same branch is not exitst in this list.
                            int count = itemProfile.ListOfItemQuantityList.GroupBy(x => x.BranchId).Count();
                            if (count != itemProfile.ListOfItemQuantityList.Count())
                                return -1;
                            #endregion


                            //used for update item profile
                            var itemProfileDetail = _itemProfileContext.FirstOrDefault(x => x.Id == itemProfile.Id);
                            if (itemProfileDetail != null)
                            {

                                itemProfileDetail.ItemNameEn = itemProfile.ItemNameEn;
                                itemProfileDetail.ItemNameSl = itemProfile.ItemNameSl;
                                itemProfileDetail.FlavourEn = itemProfile.FlavourEn;
                                itemProfileDetail.FlavourSl = itemProfile.FlavourSl;
                                itemProfileDetail.Barcode = itemProfile.Barcode;
                                itemProfileDetail.UnitParamTypeId = itemProfile.UnitParamTypeId;
                                itemProfileDetail.Code = itemProfile.Code;
                                itemProfileDetail.CategoryId = itemProfile.CategoryId;
                                itemProfileDetail.IsOfferItem = itemProfile.IsOfferItem;
                                itemProfileDetail.IsActive = itemProfile.IsActive;
                                itemProfileDetail.IsAutomaticPO = itemProfile.IsAutomaticPO;
                                itemProfileDetail.ProfitMargin = itemProfile.ProfitMargin;
                                itemProfileDetail.ModifiedDateTime = DateTime.UtcNow;
                                itemProfileDetail.BaseUnit = itemProfile.BaseUnit > 0 ? itemProfile.BaseUnit : 1;
                                _itemProfileContext.Update(itemProfileDetail);
                                _itemProfileContext.SaveChanges();
                            }

                            if (itemProfileDetail.IsAutomaticPO)
                            {
                                CreateAutomaticPODetail(itemProfileDetail.Id, itemProfile.SupplierId, itemProfile.AutomaticPOQuantity, (int)itemProfile.InitiatorRoleId);
                            }
                            else
                            {
                                DeleteAutomaticPODetail(itemProfile.Id);
                            }
                            if (itemProfile.ListOfItemQuantityList != null && itemProfile.ListOfItemQuantityList.Count > 0)
                            {
                                //used for delete old qunatity records.
                                _iItemQuantityContext.Delete(x => x.ItemId == itemProfile.Id);
                                _iItemQuantityContext.SaveChanges();

                                foreach (ItemQuantityList itemQuantityObject in itemProfile.ListOfItemQuantityList)
                                {
                                    if (itemQuantityObject.BranchId != 0)
                                    {
                                        ItemQuantity itemQuantity = new ItemQuantity();
                                        itemQuantity.ActualQuantity = itemQuantityObject.ActualQuantity;
                                        itemQuantity.BranchId = itemQuantityObject.BranchId;
                                        itemQuantity.MaxQuantity = itemQuantityObject.MaximumQuantity;
                                        itemQuantity.MinQuantity = itemQuantityObject.MinimumQuantity;
                                        itemQuantity.CreatedDateTime = DateTime.UtcNow;
                                        itemQuantity.ItemId = itemProfile.Id;

                                        _iItemQuantityContext.Add(itemQuantity);
                                        _iItemQuantityContext.SaveChanges();
                                    }
                                }

                            }
                            return itemProfile.Id;
                        }
                        return -2;
                    }
                    return -3; //icr created.
                }
                return 0;
            }
            return -4; //issue invetory

        }


        /// <summary>
        /// This method used for delete item profile. -An
        /// </summary>
        /// <param name="id">pass primary key id which you want to delete item profile.</param>
        /// <returns>return true/false</returns>
        public string DeleteItemProfile(int id)
        {
            try
            {
                var itemProfile = _itemProfileContext.FirstOrDefault(x => x.Id == id);
                if (itemProfile != null)
                {
                    List<ItemProfile> listOfItemProfile = _itemProfileContext.Fetch(x => x.ParentItemId == itemProfile.Id && !x.IsDeleted).ToList();
                    if (!listOfItemProfile.Any())
                    {
                        itemProfile.IsDeleted = true;
                        itemProfile.ModifiedDateTime = DateTime.UtcNow;
                        _itemProfileContext.Update(itemProfile);
                        _itemProfileContext.SaveChanges();
                        DeleteAutomaticPODetail(id);
                        return null;
                    }
                }
                return itemProfile.ItemNameEn;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for check item Purchse and Customer Order Completed or not. -An
        /// </summary>
        /// <param name="itemId">pass item primary key.</param>
        /// <returns>return 0 when its completed.</returns>
        public int CheckItemOrderCompleted(int itemId)
        {
            try
            {
                bool isPuchaseOrderClose = true;
                List<PurchaseOrderItem> listOfPurchaseOrder = _iPurchaseOrderItemContext.Fetch(x => x.ItemId == itemId).ToList();
                if (listOfPurchaseOrder.Any())
                {
                    foreach (var purchaseOrderItem in listOfPurchaseOrder)
                    {
                        if (purchaseOrderItem.SystemParameter.ValueEn != StringConstants.ClosedPurchaseOrder)
                            isPuchaseOrderClose = false;
                    }

                    if (!isPuchaseOrderClose)//to check item purchase order is not close so return -1
                        return -1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert sub item and return primary key. -An
        /// </summary>
        /// <param name="itemProfile">UnitParamTypeId,CategoryId,ParentItemId,Barcode,Code,ItemNameEn,
        /// ItemNameSl,BaseUnit,FlavourEn,FlavourSl,IsActive,HasOffer,IsOfferItem,IsParentItem,IsIcrApproved,CostPriceSellPrice,SellPriceA,
        /// SellPriceB,SellPriceC,SellPriceD,PreviousCostPrice
        ///,ProfitMargin,</param>
        /// <returns>primary key</returns>
        public int InsertSubItem(ItemProfile itemProfile)
        {
            try
            {
                itemProfile.CreatedDateTime = DateTime.UtcNow;
                var item = _itemProfileContext.FirstOrDefault(x => x.Barcode == itemProfile.Barcode && x.CompanyId == itemProfile.CompanyId && !x.IsDeleted);
                if (item == null)
                {
                    //check item code is already exists in database.
                    item = _itemProfileContext.FirstOrDefault(x => x.Code == itemProfile.Code && x.CompanyId == itemProfile.CompanyId && !x.IsDeleted);
                    if (item == null)
                    {
                        _itemProfileContext.Add(itemProfile);
                        _itemProfileContext.SaveChanges();
                        CreateAutomaticPODetail(itemProfile.Id, itemProfile.SupplierId, itemProfile.AutomaticPOQuantity, (int)itemProfile.InitiatorRoleId);
                        return itemProfile.Id;
                    }
                    return -1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get sub item list by parent Id. -An
        /// </summary>
        /// <param name="parentId">pass parentId</param>
        /// <param name="parentId">pass companyId(Login user companyId)</param>
        /// <returns>return list of sub items.</returns>
        public List<ItemProfile> GetSubItemListByParentId(int parentId, int companyId)
        {
            try
            {
                var itemList = _itemProfileContext.Fetch(x => !x.IsDeleted && !x.IsParentItem && x.ParentItemId == parentId && x.CompanyId == companyId).OrderByDescending(x => x.CreatedDateTime).ToList();
                return itemList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get sub item list by parent Id. -jj
        /// </summary>
        /// <param name="parentId">pass parentId</param>
        /// <param name="parentId">pass companyId(Login user companyId)</param>
        /// <returns>return list of sub items.</returns>
        public List<ItemProfile> GetSubItemProfileList(int parentId, int companyId, int? branchId)
        {
            try
            {
                var date = DateTime.UtcNow;
                var itemList = _itemProfileContext.Fetch(x => !x.IsDeleted && !x.IsParentItem && x.ParentItemId == parentId && x.CompanyId == companyId && x.IsActive).ToList();
                if (itemList != null)
                {
                    foreach (var item in itemList)
                    {
                        var itemOffer = _iItemOfferContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == branchId && x.IsActive && !x.IsDeleted && x.StartDateTime <= date && date <= x.EndDateTime && x.RemainingQuantity > 0);
                        if (itemOffer != null)
                            item.ItemOffer = itemOffer;
                    }
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
        /// This method used for change main item. -An
        /// </summary>
        /// <param name="parentId">pass parentId and childId</param>
        /// <param name="childId"></param>
        /// <returns>true/false</returns>
        public bool ChangeMainItem(int parentId, int childId)
        {
            try
            {
                var subItem = _itemProfileContext.FirstOrDefault(x => x.Id == childId && !x.IsDeleted);
                if (subItem != null)
                {
                    var parentItem = _itemProfileContext.FirstOrDefault(x => x.Id == parentId && !x.IsDeleted);
                    if (parentItem != null)
                    {
                        subItem.ParentItemId = parentItem.Id;
                        subItem.ItemNameEn = parentItem.ItemNameEn;
                        subItem.ItemNameSl = parentItem.ItemNameSl;
                        subItem.FlavourEn = parentItem.FlavourEn;
                        subItem.FlavourSl = parentItem.FlavourSl;
                        subItem.ModifiedDateTime = DateTime.UtcNow;
                        _itemProfileContext.Update(subItem);
                        _itemProfileContext.SaveChanges();
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for insert item offer and return primary key. -An
        /// </summary>
        /// <param name="itemOffer">ItemId,RecordId,StartDateTime,EndDateTime,SellPrice,SellPriceA,SellPriceB,SellPriceC,SellPriceD,
        ///Discount,QuantityLimit,IsSupplierInitiate,IsActive</param>
        /// <returns></returns>
        public int AddItemOffer(ItemOffer itemOffer)
        {
            try
            {
                _iItemOfferContext.Add(itemOffer);
                _iItemOfferContext.SaveChanges();
                return itemOffer.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get list of active status. -An
        /// </summary>
        /// <returns></returns>
        public List<StatusType> GetlistOfStatus()
        {
            try
            {
                return _iStatusTypeContext.GetAll().ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of item offer. -An
        /// </summary>
        /// <returns></returns>
        public List<ItemOffer> GetListOfItemOffer(int branchId)
        {
            try
            {
                return _iItemOfferContext.Fetch(x => x.BranchId == branchId).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get list of item profile. -JJ
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>return list of item prfoile</returns>
        public List<ItemProfile> GetItemList(int companyId, int? branchId)
        {
            try
            {
                var date = DateTime.UtcNow;
                var itemOffer = new ItemOffer();
                var itemList = _itemProfileContext.Fetch(x => !x.IsDeleted && x.CompanyId == companyId && x.IsActive).ToList();
                if (itemList != null)
                {
                    foreach (var item in itemList)
                    {
                        if (branchId != null)
                        {
                            itemOffer = _iItemOfferContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == branchId && x.IsActive && !x.IsDeleted && x.StartDateTime <= date && date <= x.EndDateTime && x.RemainingQuantity > 0);
                        }
                        else
                        {
                            itemOffer = _iItemOfferContext.FirstOrDefault(x => x.ItemId == item.Id && x.IsActive && !x.IsDeleted && x.StartDateTime <= date && date <= x.EndDateTime && x.RemainingQuantity > 0);
                        }
                        if (itemOffer != null)
                            item.ItemOffer = itemOffer;
                    }
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
        /// This method used for get list of item profile. -JJ
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>return list of item prfoile</returns>
        public List<ItemProfile> GetItemProfileList(int companyId, int? branchId)
        {
            try
            {
                var date = DateTime.UtcNow;
                var itemList = _itemProfileContext.Fetch(x => !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId && x.IsActive).ToList();
                if (itemList != null)
                {
                    foreach (var item in itemList)
                    {
                        var itemOffer = _iItemOfferContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == branchId && x.IsActive && !x.IsDeleted && x.StartDateTime <= date && date <= x.EndDateTime && x.RemainingQuantity > 0);
                        if (itemOffer != null)
                            item.ItemOffer = itemOffer;
                    }
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
        /// This method used for get item offer by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ItemOffer GetItemOfferById(int id)
        {
            try
            {
                return _iItemOfferContext.Fetch(x => x.Id == id && !x.IsDeleted).Include(x => x.ItemProfile).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        ///This method used for check item offer is already exists or not. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns></returns>
        public bool CheckItemOfferIsAlreadyExists(int itemId, int branchId, int updateId)
        {
            try
            {
                ItemOffer itemOfferDetail = new ItemOffer();

                if (updateId == 0)
                    itemOfferDetail = _iItemOfferContext.Fetch(x => x.ItemId == itemId && !x.IsDeleted && x.BranchId == branchId).OrderByDescending(x => x.EndDateTime).FirstOrDefault();
                else
                    itemOfferDetail = _iItemOfferContext.Fetch(x => x.ItemId == itemId && !x.IsDeleted && x.BranchId == branchId && x.Id != updateId).OrderByDescending(x => x.EndDateTime).FirstOrDefault();

                if (itemOfferDetail != null)
                {
                    if (DateTime.UtcNow > itemOfferDetail.EndDateTime)
                        return true;
                    else
                        return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get item offer by barcode. -An
        /// </summary>
        /// <param name="barcode"></param>
        /// <returns></returns>
        public ItemOffer GetItemOfferByBarCode(string barcode, int branchId)
        {
            try
            {
                return _iItemOfferContext.Fetch(x => x.ItemProfile.Barcode == barcode
                    && x.BranchId == branchId && !x.IsDeleted).ToList().OrderByDescending(y => y.CreatedDateTime).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool UpdateItemQuantityForPOS(int itemId, int Quantity, int branchId, int currentUserId)
        {
            try
            {
                ItemQuantity itemQuantityObj = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemId && x.BranchId == branchId);
                if (itemQuantityObj != null)
                {
                    if ((itemQuantityObj.ActualQuantity - Quantity) <= 0)
                    {
                        itemQuantityObj.ActualQuantity = 0;
                        if (itemQuantityObj.ItemProfile.IsOfferItem)
                        {
                            itemQuantityObj.ItemProfile.IsActive = false;
                            itemQuantityObj.ItemProfile.ModifiedDateTime = DateTime.UtcNow;
                        }
                    }
                    else
                        itemQuantityObj.ActualQuantity = (itemQuantityObj.ActualQuantity - Quantity);
                    itemQuantityObj.ModifiedDateTime = DateTime.UtcNow;
                    _itemQuantityContext.Update(itemQuantityObj);
                    _itemQuantityContext.SaveChanges();
                    var branchDetail = _iBranchDetailContext.FirstOrDefault(x => x.Id == branchId);
                    var currentUserDetails = _iUserDetailContext.FirstOrDefault(x => x.Id == currentUserId);
                    if (branchDetail != null && currentUserDetails != null)
                    {
                        GenrateAutomaticSpo(itemQuantityObj, branchDetail.CompanyDetail, currentUserDetails);
                    }

                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        public ItemQuantity GetItemQuantityByItemId(int itemId, int branchId)
        {
            try
            {
                ItemQuantity itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemId && x.BranchId == branchId);
                return itemQuantity;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int InsertItemProfileForPos(ItemProfile itemProfile)
        {
            try
            {
                itemProfile.CreatedDateTime = DateTime.UtcNow;
                _itemProfileContext.Add(itemProfile);
                _itemProfileContext.SaveChanges();
                return itemProfile.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public ItemOffer UpdateItemOfferForRemainingQuantiy(ItemOffer itemOffer)
        {
            try
            {
                var itemOfferObj = _iItemOfferContext.FirstOrDefault(x => x.BranchId == itemOffer.BranchId && x.Id == itemOffer.Id);
                if (itemOfferObj != null)
                {
                    itemOfferObj.RemainingQuantity = itemOffer.RemainingQuantity;
                    if (itemOffer.RemainingQuantity == 0)
                    {
                        itemOfferObj.IsActive = false;
                    }
                    itemOffer.ModifiedDateTime = DateTime.UtcNow;
                    _iItemOfferContext.Update(itemOffer);
                    _iItemOfferContext.SaveChanges();
                }
                return itemOfferObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// Method to check if the itemcode is unique or not
        /// </summary>
        /// <param name="itemCode"></param>
        /// <returns></returns>
        public bool CheckForUniqueItemCode(string itemCode)
        {
            try
            {
                var item = _itemProfileContext.FirstOrDefault(x => x.Code.Equals(itemCode, StringComparison.InvariantCultureIgnoreCase));
                return item == null;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void AddItemQuantity(int id, int companyId)
        {
            try
            {
                var brachDetails = _iBranchDetailContext.Fetch(x => x.CompanyId == companyId).ToList();
                if (brachDetails.Count != 0)
                {
                    foreach (var brachDetail in brachDetails)
                    {
                        var itemQuantityDetail = new ItemQuantity
                        {
                            CreatedDateTime = DateTime.UtcNow,
                            ItemId = id,
                            BranchId = brachDetail.Id,
                            ActualQuantity = 0,
                            MaxQuantity = 0,
                            MinQuantity = 0
                        };
                        _itemQuantityContext.Add(itemQuantityDetail);
                        _itemQuantityContext.SaveChanges();
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
        /// this method is used to genrate automatic spo.
        /// </summary>
        /// <param name="itemQuantity"></param>
        /// <param name="companyDetail"></param>
        /// <param name="userDetails"></param>
        public void GenrateAutomaticSpo(ItemQuantity itemQuantity, CompanyDetail companyDetail, UserDetail userDetails)
        {
            try
            {
                var log = new WorkFlowLog();
                var workFlowDetails = new WorkFlowDetail();
                if (itemQuantity.ActualQuantity < itemQuantity.MinQuantity)
                {
                    var autoSpoDetails = _autoPODetailContext.FirstOrDefault(x => x.ItemId == itemQuantity.ItemId);
                    if (autoSpoDetails != null)
                    {
                        var userDetail = _iUserDetailContext.FirstOrDefault(x => x.RoleId == autoSpoDetails.InitiatorRoleId && x.BranchId == userDetails.BranchId);
                        if (userDetail != null)
                        {
                            var spoExistOrNot = _purchaseOrderItemContext.FirstOrDefault(x => x.ItemId == itemQuantity.ItemId && x.SupplierPurchaseOrder.IsAutomaticSpo && x.SupplierPurchaseOrder.SupplierId == autoSpoDetails.SupplierId && !x.IsReceived);
                            if (spoExistOrNot == null)
                            {
                                var companyConfig = _iCompanyConfigration.First(x => x.CompanyId == companyDetail.Id);
                                var sponumber = companyConfig.SPOInvoiceNo;
                                bool IsApproved = false;
                                bool IsConfirmed = false;
                                bool IsCanceled = false;
                                bool IsRejected = false;
                                bool IsPartiallyReceived = false;
                                string ponumber = PurchaseOrderNumberGenerator(sponumber, 4);

                                var workFlowLog = _IWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.SupplierPurchaseOrder, StringConstants.CreateSupplierPurchaseOrder, userDetail, companyDetail, null, "Initiate Automatic SPO", null);
                                if (workFlowLog != null)
                                {
                                    log = (WorkFlowLog)workFlowLog.Item1;
                                    workFlowDetails = (WorkFlowDetail)workFlowLog.Item2;


                                    if (workFlowDetails.NextActivity.IsClosed)
                                    {
                                        IsApproved = true;
                                    }
                                    else
                                    {
                                        IsApproved = false;
                                    }


                                    var supplierType = _paramTypeContext.Fetch(x => x.ParamId == 48);
                                    bool isCredit = false;
                                    foreach (var type in supplierType)
                                    {
                                        if (type.Id == autoSpoDetails.SupplierProfile.SupplierTypeId && type.ValueEn == "Credit")
                                            isCredit = true;
                                        else
                                            isCredit = false;
                                    }

                                    var supplierPurchaseOrder = new SupplierPurchaseOrder
                                    {
                                        UserId = userDetail.Id,
                                        RecordId = log.RecordId,
                                        SupplierId = autoSpoDetails.SupplierId,//change supplier id
                                        //ReceivingBranchId = supplierPO.BranchId,
                                        InitiationBranchId = itemQuantity.BranchId,
                                        IsApproved = IsApproved,
                                        IsConfirmed = IsConfirmed,
                                        IsNotProcessed = true,
                                        IsRejected = IsRejected,
                                        IsCanceled = IsCanceled,
                                        IsPartiallyReceived = IsPartiallyReceived,
                                        IsSend = false,
                                        IsSubmitted = true,
                                        DueDate = DateTime.UtcNow,
                                        CreatedDateTime = DateTime.UtcNow,
                                        CreditDaysLimit = 0,
                                        IsCreditPayment = isCredit,
                                        UpdatedDate = DateTime.UtcNow,
                                        PurchaseOrderNumber = ponumber,
                                        IsAutomaticSpo = true
                                    };
                                    _supplierPOContext.Add(supplierPurchaseOrder);
                                    _supplierPOContext.SaveChanges();

                                    _supplierPOWorkListContext.SaveSupplierPurchaseOrderLog(log.Action, "Initiate Automatic Supplier Purchace Order", supplierPurchaseOrder.Id, log.RecordId, userDetail.RoleName, log.Stage, userDetail.UserName);


                                    var spoBranch = new PurchaseOrderBranch
                                    {
                                        CreatedDateTime = DateTime.UtcNow,
                                        BranchId = itemQuantity.BranchId,
                                        PurchaseOrderId = supplierPurchaseOrder.Id
                                    };
                                    _purchaseOrderBranchContext.Add(spoBranch);
                                    _purchaseOrderBranchContext.SaveChanges();


                                    var poItem = new PurchaseOrderItem
                                    {
                                        CreatedDateTime = DateTime.UtcNow,
                                        FreeQuantity = 0,
                                        ItemId = itemQuantity.ItemId,
                                        OrderCostPrice = itemQuantity.ItemProfile.CostPrice,
                                        OrderQuantity = autoSpoDetails.Quantity,//change Quantity
                                        ReceivingCostPrice = itemQuantity.ItemProfile.CostPrice,
                                        BillCostPrice = itemQuantity.ItemProfile.CostPrice,
                                        ReceivingQuantity = autoSpoDetails.Quantity,
                                        SystemParameterId = itemQuantity.ItemProfile.UnitParamTypeId,
                                        PercentageDiscount = 0,
                                        IsPercentageDiscount = true,
                                        PurchaseOrderId = supplierPurchaseOrder.Id,
                                        ReceivingDate = DateTime.UtcNow,
                                        UpdatedDate = DateTime.UtcNow,
                                        SPOReceivingStatus = SPOReceivingStatus.NotReceived
                                    };
                                    _purchaseOrderItemContext.Add(poItem);
                                    _purchaseOrderItemContext.SaveChanges();
                                }
                            }

                        }
                    }


                }


            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<RoleAc> GetAllInitiatorOfSpo(int companyId)
        {
            try
            {
                var roleCollection = new List<RoleAc>();
                var workflowInfo = _iWorkFlowDetailContext.Fetch(x => x.Activity.Name == StringConstants.CreateSupplierPurchaseOrder && x.CompanyId == companyId).ToList().GroupBy(x => x.InitiatorId);
                foreach (var workFLowDetails in workflowInfo)
                {
                    var roleDetails = _roleDataContext.FirstOrDefault(x => x.Id == workFLowDetails.Key);
                    if (roleDetails != null)
                    {
                        var roleAc = new RoleAc();
                        roleAc = ApplicationClassHelper.ConvertType<Role, RoleAc>(roleDetails);
                        roleAc.RoleId = roleDetails.Id;
                        roleCollection.Add(roleAc);
                    }

                }
                return roleCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        #region Private Method(s)

        private string PurchaseOrderNumberGenerator(string SpoInvoiceNumber, int SPOInvoiceDigit)
        {
            string ponumber;
            var checkSPO = "" + SpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyyyy");
            var num = _supplierPOContext.Fetch(x => x.PurchaseOrderNumber.Contains(checkSPO)).Count();
            if (num == 0)
            {
                var numString = (num + 1).ToString();
                var ponum = numString.PadLeft(numString.Length + SPOInvoiceDigit - 1, '0');
                ponumber = "" + SpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyyyy") + "" + ponum;
            }
            else
            {
                var poNum = _supplierPOContext.Fetch().ToList().LastOrDefault().PurchaseOrderNumber;

                var fixedPrefixLen = SpoInvoiceNumber.Length + 8;
                int subSPO = int.Parse(poNum.Substring(fixedPrefixLen));
                string nextSPO = (subSPO + 1).ToString();
                // number of zero required
                int countZero = (SPOInvoiceDigit - nextSPO.Length) >= 0 ? (SPOInvoiceDigit - nextSPO.Length) : 0;
                string sub;
                if (countZero > 0)
                {
                    sub = nextSPO.PadLeft(countZero + 1, '0');
                }
                else
                {
                    sub = nextSPO;
                }
                ponumber = "" + SpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyyyy") + "" + sub;
            }
            return ponumber;
        }

        /// <summary>
        /// This method is used to edit or update Automatic PO Details - jj
        /// </summary>
        /// <param name="ItemId"></param>
        /// <param name="AutomaticPOQuantity"></param>
        /// <param name="SupplierId"></param>
        /// <param name="initiatorRoleId"></param>
        /// <returns></returns>
        private void CreateAutomaticPODetail(int ItemId, int SupplierId, int AutomaticPOQuantity, int initiatorRoleId)
        {
            try
            {
                var item = _autoPODetailContext.Fetch(x => x.ItemId == ItemId).FirstOrDefault();
                if (item != null)
                {
                    item.SupplierId = SupplierId;
                    item.Quantity = AutomaticPOQuantity;
                    item.ModifiedDateTime = DateTime.UtcNow;
                    item.InitiatorRoleId = initiatorRoleId;
                    _autoPODetailContext.Update(item);
                    _autoPODetailContext.SaveChanges();
                }
                else
                {
                    item = new AutomaticPODetail();
                    item.ItemId = ItemId;
                    item.SupplierId = SupplierId;
                    item.Quantity = AutomaticPOQuantity;
                    item.CreatedDateTime = DateTime.UtcNow;
                    item.ModifiedDateTime = DateTime.UtcNow;
                    item.InitiatorRoleId = initiatorRoleId;
                    _autoPODetailContext.Add(item);
                    _autoPODetailContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to delete Automatic PO Details - jj
        /// </summary>
        /// <param name="ItemId"></param>
        /// <returns></returns>
        private void DeleteAutomaticPODetail(int ItemId)
        {
            var item = _autoPODetailContext.Fetch(x => x.ItemId == ItemId).FirstOrDefault();
            if (item != null)
            {
                _autoPODetailContext.Delete(item);
                _autoPODetailContext.SaveChanges();
            }
        }

        #endregion 

    }
}

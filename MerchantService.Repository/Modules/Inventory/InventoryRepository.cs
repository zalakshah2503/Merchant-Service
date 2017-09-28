using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.IssueInventory;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Inventory;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.ApplicationClasses.SystemParameter;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Inventory
{
    public class InventoryRepository : IInventoryRepository
    {

        #region Private Variables

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<SupplierProfile> _supplierContext;
        private readonly IDataRepository<Category> _categoryContext;
        private readonly IDataRepository<ItemSupplier> _itemSupplierContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<IssueInventory> _issueInventoryContext;
        private readonly IDataRepository<InventoryRecorder> _inventoryRecorderContext;
        private readonly IWorkFlowDetailsRepository _workFlowDetailsRepository;
        private readonly IDataRepository<InventoryUnmatchedItem> _inventoryUnmatchedContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailsContext;
        private readonly IDataRepository<ParentRecord> _parentRecordContext;
        private readonly IDataRepository<WorkFlowLog> _workFLowLogContext;
        private readonly IAccountingRepository _iAccountRepository;
        private readonly IDataRepository<BranchDetail> _brachContext;
        private readonly IItemRepository _itemRepository;

        #endregion


        #region Constructor

        public InventoryRepository(IErrorLog errorLog, IDataRepository<ParamType> paramTypeContext, IDataRepository<SupplierProfile> supplierContext, IDataRepository<Category> categoryContext, IDataRepository<ItemSupplier> itemSupplierContext, IDataRepository<ItemProfile> itemProfileContext, IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<IssueInventory> issueInventoryContext, IDataRepository<InventoryRecorder> inventoryRecorderContext,
            IWorkFlowDetailsRepository workFlowDetailsRepository, IDataRepository<InventoryUnmatchedItem> inventoryUnmatchedContext,
            IDataRepository<WorkFlowDetail> workFlowDetailsContext, IDataRepository<ParentRecord> parentRecordContext, IDataRepository<WorkFlowLog> workFLowLogContext, IAccountingRepository iAccountRepository, IDataRepository<BranchDetail> brachContext, IItemRepository itemRepository)
        {
            _errorLog = errorLog;
            _paramTypeContext = paramTypeContext;
            _supplierContext = supplierContext;
            _categoryContext = categoryContext;
            _itemSupplierContext = itemSupplierContext;
            _itemProfileContext = itemProfileContext;
            _itemQuantityContext = itemQuantityContext;
            _issueInventoryContext = issueInventoryContext;
            _inventoryRecorderContext = inventoryRecorderContext;
            _workFlowDetailsRepository = workFlowDetailsRepository;
            _inventoryUnmatchedContext = inventoryUnmatchedContext;
            _workFlowDetailsContext = workFlowDetailsContext;
            _parentRecordContext = parentRecordContext;
            _workFLowLogContext = workFLowLogContext;
            _iAccountRepository = iAccountRepository;
            _brachContext = brachContext;
            _itemRepository = itemRepository;
        }

        #endregion


        #region Dispose method

        public void Dispose()
        {
            _paramTypeContext.Dispose();
            _supplierContext.Dispose();
            _itemProfileContext.Dispose();
            _issueInventoryContext.Dispose();
            _inventoryRecorderContext.Dispose();
            _categoryContext.Dispose();
            _itemSupplierContext.Dispose();
            _inventoryUnmatchedContext.Dispose();
        }

        #endregion


        #region Public methods


        /// <summary>
        /// this method is used to get all inventory types.
        /// </summary>
        /// <returns></returns>
        public List<ParamTypeAc> GetAllInvetoryTypeList(int paramId)
        {
            try
            {
                var inventoryTypeCollection = new List<ParamTypeAc>();

                foreach (var inventoryType in _paramTypeContext.Fetch(x => x.ParamId == paramId).ToList())
                {
                    var inventoryTypeAc = new ParamTypeAc();
                    inventoryTypeAc = ApplicationClassHelper.ConvertType<ParamType, ParamTypeAc>(inventoryType);
                    inventoryTypeAc.ParamTypeId = inventoryType.Id;

                    inventoryTypeCollection.Add(inventoryTypeAc);
                }
                return inventoryTypeCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get all supplier list.
        /// </summary>
        /// <returns></returns>
        public List<SupplierProfileAC> GetAllSupplierList(int comapanyId)
        {
            try
            {
                var supplierCollection = new List<SupplierProfileAC>();
                foreach (var supplier in _supplierContext.Fetch(x => x.CompanyId == comapanyId && !x.IsDeleted))
                {
                    var supplierAc = new SupplierProfileAC();
                    supplierAc = ApplicationClassHelper.ConvertType<SupplierProfile, SupplierProfileAC>(supplier);
                    supplierAc.SupplierProfileId = supplier.Id;
                    supplierCollection.Add(supplierAc);
                }
                return supplierCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get all gategory list.
        /// </summary>
        /// <returns></returns>
        public List<CategoryAC> GetAllCateGoryList(int comapanyId)
        {
            try
            {
                var categoryCollection = new List<CategoryAC>();
                foreach (var category in _categoryContext.Fetch(x => x.CompanyId == comapanyId && !x.IsDelete).ToList())
                {
                    var categoryAc = new CategoryAC();
                    categoryAc = ApplicationClassHelper.ConvertType<Category, CategoryAC>(category);
                    categoryAc.CategoryId = category.Id;
                    categoryAc.BrandName = category.BrandParamType.ValueEn;
                    categoryAc.GroupName = category.GroupParamType.ValueEn;
                    categoryAc.CategoryName = category.BrandParamType.ValueEn + "-" + category.GroupParamType.ValueEn;

                    categoryCollection.Add(categoryAc);
                }
                return categoryCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to submit issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public IssueInventoryAc SubmitIssueStockInventory(IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetails)
        {
            try
            {
                bool isBranchConflict = false;
                DateTime startDate = issueInventoryDetails.StartingDate.ToLocalTime();
                DateTime universalDateTime = issueInventoryDetails.StartingDate.ToUniversalTime();
                _errorLog.LogInfo("client side local time convert");
                _errorLog.LogInfo(startDate.ToString("ddMMyy"));

                _errorLog.LogInfo("client side univesal time convert");
                _errorLog.LogInfo(universalDateTime.ToString("ddMMyy"));

                var startTimeInfo = issueInventoryDetails.StartingDate.ToLocalTime().Date;
                var startTimeDetails = issueInventoryDetails.StartingDate.ToUniversalTime().Date;

                _errorLog.LogInfo("time zone start time info");
                _errorLog.LogInfo(startTimeInfo.ToString());

                _errorLog.LogInfo("time zone start time details");
                _errorLog.LogInfo(startTimeDetails.ToString());

                var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                if (paramTypeDetails != null)
                {
                    IssueInventory inventoryExist;
                    foreach (var branchDetails in issueInventoryDetails.BranchList)
                    {
                        switch (paramTypeDetails.ValueEn)
                        {
                            case StringConstants.SupplierInventory:
                                inventoryExist = _issueInventoryContext.Fetch(x => x.SupplierId == issueInventoryDetails.SupplierId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                if (inventoryExist != null)
                                {
                                    isBranchConflict = true;
                                    break;
                                }
                                break;
                            case StringConstants.ItemInventory:
                                inventoryExist = _issueInventoryContext.Fetch(x => x.Barcode == issueInventoryDetails.Barcode && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                if (inventoryExist != null)
                                {
                                    isBranchConflict = true;
                                    break;
                                }
                                break;
                            case StringConstants.FullInventory:
                                inventoryExist = _issueInventoryContext.Fetch(x => x.ParamTypeId == issueInventoryDetails.ParamTypeId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                if (inventoryExist != null)
                                {
                                    isBranchConflict = true;
                                    break;
                                }
                                break;
                            case StringConstants.CategoryInventory:
                                inventoryExist = _issueInventoryContext.Fetch(x => x.CategoryId == issueInventoryDetails.CategoryId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                if (inventoryExist != null)
                                {
                                    isBranchConflict = true;
                                    break;
                                }
                                break;
                        }
                        if (isBranchConflict)
                        {
                            break;
                        }
                    }
                }

                if (isBranchConflict)
                {
                    var branchConflicCollection = GetAllBranchConflictList(issueInventoryDetails);
                    branchConflicCollection.CompletedStatus = StringConstants.BranchConflict;
                    return branchConflicCollection;
                }
                else
                {
                    var issueInventoryCollection = SubmitStockInventory(issueInventoryDetails, companyDetails);
                    return issueInventoryCollection;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get all inventory list.
        /// </summary>
        /// <returns></returns>
        public IOrderedEnumerable<IssueInventoryAc> GetAllInventoryList(int? branchId, bool isAllowToAccessAllBranch)
        {
            try
            {
                var inventtoryCollection = new List<IssueInventoryAc>();
                if (isAllowToAccessAllBranch)
                {
                    foreach (var inventory in _issueInventoryContext.GetAll().ToList())
                    {
                        var issueInventoryAc = new IssueInventoryAc();
                        issueInventoryAc =
                            ApplicationClassHelper.ConvertType<IssueInventory, IssueInventoryAc>(inventory);
                        if (inventory.RecordId != null)
                        {
                            var parentRecredDetails =
                                _parentRecordContext.FirstOrDefault(x => x.Id == inventory.RecordId);
                            if (parentRecredDetails != null)
                            {
                                var workFlowStatusDetails =
                                    _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id)
                                        .ToList()
                                        .LastOrDefault();
                                if (workFlowStatusDetails != null)
                                {
                                    issueInventoryAc.WorkFlowStatus = workFlowStatusDetails.Action;
                                }
                            }
                        }

                        inventtoryCollection.Add(FetchAllInventoryList(issueInventoryAc, inventory));
                    }
                }
                else
                {
                    foreach (var inventory in _issueInventoryContext.Fetch(x => x.BranchId == branchId).ToList())
                    {
                        var issueInventoryAc = new IssueInventoryAc();
                        issueInventoryAc = ApplicationClassHelper.ConvertType<IssueInventory, IssueInventoryAc>(inventory);
                        if (inventory.RecordId != null)
                        {
                            var parentRecredDetails = _parentRecordContext.FirstOrDefault(x => x.Id == inventory.RecordId);
                            if (parentRecredDetails != null)
                            {
                                var workFlowStatusDetails = _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id).ToList().LastOrDefault();
                                if (workFlowStatusDetails != null)
                                {
                                    issueInventoryAc.WorkFlowStatus = workFlowStatusDetails.Action;
                                }
                            }
                        }

                        inventtoryCollection.Add(FetchAllInventoryList(issueInventoryAc, inventory));
                    }
                }
                return inventtoryCollection.OrderByDescending(x => x.IssueStockInventoryId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to delete issue stock inventory request.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        public void DeleteIssueStockInventoryById(int issueInventoryId)
        {
            try
            {
                var issueInventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId);
                if (issueInventoryDetails != null)
                {
                    _issueInventoryContext.Delete(issueInventoryDetails.Id);
                    _issueInventoryContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to view the inventory monitor details by the Id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        public IssueInventoryAc ViewIssueStockInventoryMoniterDetailsById(int issueInventoryId)
        {
            try
            {
                var inventory = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId);
                var issueInventoryAc = new IssueInventoryAc();
                if (inventory != null)
                {
                    issueInventoryAc = ApplicationClassHelper.ConvertType<IssueInventory, IssueInventoryAc>(inventory);
                    issueInventoryAc.BranchName = inventory.BranchDetail.Name;
                    issueInventoryAc.InventoryType = inventory.ParamType.ValueEn;
                    issueInventoryAc.IssueStockInventoryId = inventory.Id;
                    issueInventoryAc.StartDate = inventory.StartDate.Date;
                    issueInventoryAc.StartedDate = inventory.StartDate.ToString("dd-MM-yyyy");
                    if (inventory.CloseDate == null)
                    {
                        issueInventoryAc.ElapsedTime = 0;
                        issueInventoryAc.CloseDate = null;
                        issueInventoryAc.IsCloseDateNullable = false;
                    }
                    else
                    {
                        TimeSpan timeDifference = (Convert.ToDateTime(inventory.CloseDate)) - inventory.StartDate;
                        issueInventoryAc.ElapsedTime = timeDifference.Hours;
                        issueInventoryAc.CloseDate = (DateTime)inventory.CloseDate;
                        issueInventoryAc.IsCloseDateNullable = true;
                    }

                    if (inventory.StartDate.Date == DateTime.UtcNow.Date)
                    {
                        issueInventoryAc.IsStartDate = true;
                    }
                    var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == inventory.ParamTypeId);
                    if (paramTypeDetails != null)
                    {
                        switch (paramTypeDetails.ValueEn)
                        {
                            case StringConstants.SupplierInventory:
                                issueInventoryAc.IsSupplierInventory = true;
                                issueInventoryAc.SupplierName = inventory.SupplierProfile.NameEn;
                                break;
                            case StringConstants.ItemInventory:
                                issueInventoryAc.IsItemInventory = true;

                                break;
                            case StringConstants.FullInventory:
                                issueInventoryAc.IsFullInventory = true;
                                break;
                            case StringConstants.CategoryInventory:
                                issueInventoryAc.IsCategoryInventory = true;
                                issueInventoryAc.CategoryName = inventory.Category.BrandParamType.ValueEn + "-" + inventory.Category.GroupParamType.ValueEn;
                                break;
                        }
                    }
                    var unmatchedItemDetails = _inventoryUnmatchedContext.Fetch(x => x.IssueInventoryId == inventory.Id).ToList();
                    if (unmatchedItemDetails.Count() != 0)
                    {
                        issueInventoryAc.IsUnmatchedButtonVisible = true;
                    }

                    var inventoryRecorderDetails = _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == inventory.Id).ToList();
                    if (inventoryRecorderDetails.Count != 0)
                    {
                        var inventoryRecorderCollection = new List<InventoryRecorderAc>();
                        issueInventoryAc.IsAllowToStartInventory = true;
                        var recordDetails = inventoryRecorderDetails.GroupBy(x => new { x.IssueInventoryId, x.UserId }).ToList();
                        foreach (var recordDetail in recordDetails)
                        {
                            decimal recordProcess = 0;
                            var inventoryRecorderAc = new InventoryRecorderAc();
                            foreach (var inventoryRecordInfo in _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == recordDetail.Key.IssueInventoryId && x.UserId == recordDetail.Key.UserId).ToList())
                            {
                                recordProcess = recordProcess + inventoryRecordInfo.RecordedQuantity;
                                inventoryRecorderAc = ApplicationClassHelper.ConvertType<InventoryRecorder, InventoryRecorderAc>(inventoryRecordInfo);
                                inventoryRecorderAc.UserName = inventoryRecordInfo.UserDetail.UserName;
                                inventoryRecorderAc.RecordedQuantity = (int)recordProcess;
                                if (inventory.SystemAmount != 0)
                                {
                                    inventoryRecorderAc.Process = decimal.Round((recordProcess * 100 / inventory.SystemAmount), 2);
                                    issueInventoryAc.QuantityProcess = decimal.Round((inventory.ShelfAmount * 100 / inventory.SystemAmount), 2);
                                }
                            }
                            inventoryRecorderCollection.Add(inventoryRecorderAc);
                        }
                        issueInventoryAc.InventoryRecorderCollection = inventoryRecorderCollection;
                    }
                }
                return issueInventoryAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get all recorder list.
        /// </summary>
        /// <returns></returns>
        public IOrderedEnumerable<IssueInventoryAc> GetAllInventoryRecorderList(int? branchId, bool isAllowToAccessAllBranch)
        {
            try
            {
                var inventtoryCollection = new List<IssueInventoryAc>();
                if (isAllowToAccessAllBranch)
                {
                    foreach (var inventory in _issueInventoryContext.Fetch(x => x.IsRecord).ToList())
                    {
                        inventtoryCollection.Add(FetchAllInventoryRecorderList(inventory));
                    }
                }
                else
                {
                    foreach (var inventory in _issueInventoryContext.Fetch(x => x.IsRecord && x.BranchId == branchId || x.IsRerecord).ToList())
                    {
                        inventtoryCollection.Add(FetchAllInventoryRecorderList(inventory));
                    }
                }
                return inventtoryCollection.OrderByDescending(x => x.IssueStockInventoryId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to start issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        public void StartIssueStockInventory(int issueInventoryId)
        {
            try
            {
                var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId);
                if (inventoryDetails != null)
                {
                    inventoryDetails.IsInitiate = false;
                    inventoryDetails.IsRecord = true;
                    inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                    _issueInventoryContext.Update(inventoryDetails);
                    _issueInventoryContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get iventory record details by id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        public IssueInventoryAc GetInventoryRecorderDetailsById(int issueInventoryId)
        {
            try
            {
                var inventory = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId && (x.IsRecord || x.IsRerecord));
                var issueInventoryAc = new IssueInventoryAc();
                if (inventory != null)
                {
                    issueInventoryAc = ApplicationClassHelper.ConvertType<IssueInventory, IssueInventoryAc>(inventory);
                    var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == inventory.ParamTypeId);
                    if (paramTypeDetails != null)
                    {
                        switch (paramTypeDetails.ValueEn)
                        {
                            case StringConstants.SupplierInventory:
                                issueInventoryAc.IsSupplierInventory = true;
                                issueInventoryAc.IsQuantityDisabled = true;
                                break;
                            case StringConstants.ItemInventory:
                                issueInventoryAc.IsItemInventory = true;
                                issueInventoryAc.IsQuantityDisabled = false;
                                break;
                            case StringConstants.FullInventory:
                                issueInventoryAc.IsFullInventory = true;
                                issueInventoryAc.IsQuantityDisabled = true;
                                break;
                            case StringConstants.CategoryInventory:
                                issueInventoryAc.IsCategoryInventory = true;
                                issueInventoryAc.IsQuantityDisabled = true;
                                break;
                        }
                    }
                    issueInventoryAc.BranchName = inventory.BranchDetail.Name;
                    issueInventoryAc.InventoryType = inventory.ParamType.ValueEn;
                    issueInventoryAc.IssueStockInventoryId = inventory.Id;
                    issueInventoryAc.StartDate = inventory.StartDate.Date;
                    if (inventory.CloseDate == null)
                    {
                        issueInventoryAc.CloseDate = null;
                    }
                    else
                    {
                        issueInventoryAc.CloseDate = (DateTime)inventory.CloseDate;
                    }
                    return issueInventoryAc;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get item list by the inventory Id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        public List<ItemProfileAC> GetItemListByIssueInventoryId(int issueInventoryId, int companyId)
        {
            try
            {
                var issueInventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId);
                var itemProfileCollection = new List<ItemProfileAC>();
                if (issueInventoryDetails != null)
                {
                    if (issueInventoryDetails.IsRerecord)
                    {
                        var unamtchedItemCollection = _inventoryUnmatchedContext.Fetch(x => x.IssueInventoryId == issueInventoryDetails.Id && x.IsRerecord).ToList();
                        foreach (var inventoryUnmatchedItem in unamtchedItemCollection)
                        {
                            var itemProfileAc = new ItemProfileAC();
                            var itemProfile = _itemProfileContext.FirstOrDefault(x => x.Id == inventoryUnmatchedItem.ItemId && !x.IsDeleted && x.CompanyId == companyId);
                            if (itemProfile != null)
                            {
                                itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfile);
                                itemProfileAc.ItemProfileId = itemProfile.Id;
                                itemProfileAc.ItemType = itemProfile.Category.BrandParamType.ValueEn + "-" + itemProfile.Category.GroupParamType.ValueEn;
                                itemProfileAc.Unit = itemProfile.SystemParameter.ValueEn + " - " + itemProfile.BaseUnit;
                                itemProfileAc.listOfChildProfileAC = GetSubItemList(itemProfile.Id);
                                if (itemProfileAc.listOfChildProfileAC.Count != 0)
                                {
                                    itemProfileAc.HasChildItem = true;
                                }
                                itemProfileCollection.Add(itemProfileAc);
                            }
                        }
                    }
                    else
                    {
                        var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                        if (paramTypeDetails != null)
                        {
                            itemProfileCollection = GetItemCollection(issueInventoryDetails, paramTypeDetails, companyId);
                        }
                    }
                }
                return itemProfileCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get item details by the item barcode.
        /// </summary>
        /// <param name="issueStockInventoryId"></param>
        /// <param name="barcode"></param>
        /// <returns></returns>
        public ItemProfileAC GetItemDetailsByItemBarcode(string barcode, int issueStockInventoryId)
        {
            try
            {
                int recoredCount = 0;
                var issueInventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueStockInventoryId);
                if (issueInventoryDetails != null)
                {
                    if (issueInventoryDetails.IsRerecord)
                    {
                        var itemDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode);
                        if (itemDetails != null)
                        {
                            int? itemID;
                            if (itemDetails.IsParentItem)
                            {
                                itemID = itemDetails.Id;
                            }
                            else
                            {
                                itemID = itemDetails.ParentItemId;
                            }
                            var unmatchedItemDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.IssueInventoryId == issueStockInventoryId && x.ItemId == itemID);
                            if (unmatchedItemDetails != null)
                            {
                                var itemProfileAc = new ItemProfileAC();
                                itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemDetails);
                                itemProfileAc.ItemProfileId = itemDetails.Id;
                                itemProfileAc.ItemType = itemDetails.Category.BrandParamType.ValueEn + "-" +
                                                        itemDetails.Category.GroupParamType.ValueEn;
                                itemProfileAc.Unit = itemDetails.SystemParameter.ValueEn;

                                var itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemID && x.IssueInventoryId == issueStockInventoryId).ToList();
                                foreach (var inventoryRecorder in itemRecordDetails)
                                {
                                    recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                }
                                itemProfileAc.ItemRecordCount = recoredCount;
                                return itemProfileAc;
                            }
                            else
                            {
                                return null;
                            }
                        }
                        else
                        {
                            return null;
                        }
                    }
                    else
                    {
                        var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                        if (paramTypeDetails != null)
                        {
                            ItemProfile itemProfileDetails;
                            switch (paramTypeDetails.ValueEn)
                            {
                                case StringConstants.SupplierInventory:
                                    var itemSupplierDetails = _itemSupplierContext.FirstOrDefault(x => x.SupplierId == issueInventoryDetails.SupplierId);
                                    if (itemSupplierDetails != null)
                                    {
                                        itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode && x.CategoryId == itemSupplierDetails.CategoryId && !x.IsDeleted);

                                        if (itemProfileDetails != null)
                                        {
                                            var itemProfileAc = new ItemProfileAC();
                                            itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                            itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                            itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" + itemProfileDetails.Category.GroupParamType.ValueEn;
                                            itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn;

                                            List<InventoryRecorder> itemRecordDetails;
                                            if (itemProfileDetails.IsParentItem)
                                            {
                                                itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.Id && x.IssueInventoryId == issueStockInventoryId).ToList();

                                                foreach (var inventoryRecorder in itemRecordDetails)
                                                {
                                                    recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                                }
                                                itemProfileAc.ItemRecordCount = recoredCount;
                                            }
                                            else
                                            {
                                                itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.ParentItemId && x.IssueInventoryId == issueStockInventoryId).ToList();
                                                foreach (var inventoryRecorder in itemRecordDetails)
                                                {
                                                    recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                                }
                                                itemProfileAc.ItemRecordCount = recoredCount;
                                            }
                                            return itemProfileAc;
                                        }
                                        else
                                        {
                                            return null;
                                        }
                                    }
                                    else
                                    {
                                        return null;
                                    }
                                case StringConstants.ItemInventory:
                                    itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode && !x.IsDeleted);
                                    if (itemProfileDetails != null)
                                    {
                                        var inventoryItemInfo = _itemProfileContext.FirstOrDefault(x => x.Barcode == issueInventoryDetails.Barcode);
                                        if (inventoryItemInfo != null)
                                        {
                                            var itemProfileAc = new ItemProfileAC();
                                            if (!inventoryItemInfo.IsParentItem)
                                            {
                                                if (itemProfileDetails.IsParentItem)
                                                {
                                                    if (inventoryItemInfo.ParentItemId != itemProfileDetails.Id)
                                                    {
                                                        return null;
                                                    }
                                                }
                                                else
                                                {
                                                    if (inventoryItemInfo.ParentItemId != itemProfileDetails.ParentItemId)
                                                    {
                                                        return null;
                                                    }
                                                }
                                            }

                                            itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                            itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                            itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" +
                                                                     itemProfileDetails.Category.GroupParamType.ValueEn;
                                            itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn;
                                            List<InventoryRecorder> itemRecordDetails;
                                            if (itemProfileDetails.IsParentItem)
                                            {
                                                itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.Id && x.IssueInventoryId == issueStockInventoryId).ToList();

                                                foreach (var inventoryRecorder in itemRecordDetails)
                                                {
                                                    recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                                }
                                                itemProfileAc.ItemRecordCount = recoredCount;
                                            }
                                            else
                                            {
                                                itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.ParentItemId && x.IssueInventoryId == issueStockInventoryId).ToList();
                                                foreach (var inventoryRecorder in itemRecordDetails)
                                                {
                                                    recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                                }
                                                itemProfileAc.ItemRecordCount = recoredCount;
                                            }
                                            return itemProfileAc;
                                        }
                                    }
                                    else
                                    {
                                        return null;
                                    }

                                    break;
                                case StringConstants.FullInventory:
                                    itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode && !x.IsDeleted);
                                    if (itemProfileDetails != null)
                                    {
                                        var itemProfileAc = new ItemProfileAC();
                                        itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                        itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                        itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" +
                                                                 itemProfileDetails.Category.GroupParamType.ValueEn;
                                        itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn;

                                        List<InventoryRecorder> itemRecordDetails;
                                        if (itemProfileDetails.IsParentItem)
                                        {
                                            itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.Id && x.IssueInventoryId == issueStockInventoryId).ToList();
                                            foreach (var inventoryRecorder in itemRecordDetails)
                                            {
                                                recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                            }
                                            itemProfileAc.ItemRecordCount = recoredCount;
                                        }
                                        else
                                        {
                                            itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.ParentItemId && x.IssueInventoryId == issueStockInventoryId).ToList();
                                            foreach (var inventoryRecorder in itemRecordDetails)
                                            {
                                                recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                            }
                                            itemProfileAc.ItemRecordCount = recoredCount;
                                        }
                                        return itemProfileAc;
                                    }
                                    else
                                    {
                                        return null;
                                    }
                                case StringConstants.CategoryInventory:
                                    itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode && x.CategoryId == issueInventoryDetails.CategoryId && !x.IsDeleted);
                                    if (itemProfileDetails != null)
                                    {
                                        var itemProfileAc = new ItemProfileAC();
                                        itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                        itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                        itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" +
                                                                 itemProfileDetails.Category.GroupParamType.ValueEn;
                                        itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn;

                                        List<InventoryRecorder> itemRecordDetails;
                                        if (itemProfileDetails.IsParentItem)
                                        {
                                            itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.Id && x.IssueInventoryId == issueStockInventoryId).ToList();
                                            foreach (var inventoryRecorder in itemRecordDetails)
                                            {
                                                recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                            }
                                            itemProfileAc.ItemRecordCount = recoredCount;
                                        }
                                        else
                                        {
                                            itemRecordDetails = _inventoryRecorderContext.Fetch(x => x.ItemId == itemProfileDetails.ParentItemId && x.IssueInventoryId == issueStockInventoryId).ToList();
                                            foreach (var inventoryRecorder in itemRecordDetails)
                                            {
                                                recoredCount = recoredCount + inventoryRecorder.RecordedQuantity;
                                            }
                                            itemProfileAc.ItemRecordCount = recoredCount;
                                        }
                                        return itemProfileAc;
                                    }
                                    else
                                    {
                                        return null;
                                    }
                            }
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
            return null;
        }


        /// <summary>
        /// this method is used to add issue inventory recored details.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <param name="getUserId"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public IssueInventoryAc AddIssueInventoryRecordDetails(IssueInventoryAc issueInventoryDetails, int getUserId, CompanyDetail companyDetails)
        {
            try
            {
                var issueInventoryInfo = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);
                if (issueInventoryInfo != null)
                {
                    var itemInfo = _itemProfileContext.FirstOrDefault(x => x.Barcode == issueInventoryDetails.Barcode);

                    if (itemInfo != null)
                    {
                        int? itemID;
                        if (!itemInfo.IsParentItem)
                        {
                            itemID = itemInfo.ParentItemId;
                            issueInventoryDetails.Quantity = itemInfo.BaseUnit * issueInventoryDetails.Quantity;
                        }
                        else
                        {
                            itemID = itemInfo.Id;
                            issueInventoryDetails.Quantity = itemInfo.BaseUnit * issueInventoryDetails.Quantity;
                        }
                        var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemID);
                        if (itemQuantityDetails != null)
                        {
                            var inventoryRecordInfo = _inventoryRecorderContext.FirstOrDefault(x => x.IssueInventoryId == issueInventoryDetails.IssueStockInventoryId && x.ItemId == itemID && x.UserId == getUserId);
                            if (inventoryRecordInfo != null)
                            {
                                inventoryRecordInfo.RecordedQuantity = (int)(inventoryRecordInfo.RecordedQuantity + issueInventoryDetails.Quantity);

                                _inventoryRecorderContext.Update(inventoryRecordInfo);
                                _inventoryRecorderContext.SaveChanges();
                            }
                            else
                            {

                                var inventoryRecord = new InventoryRecorder
                                {
                                    CreatedDateTime = DateTime.UtcNow,
                                    IssueInventoryId = issueInventoryInfo.Id,
                                    ItemId = (int)itemID,
                                    RecordedQuantity = (int)issueInventoryDetails.Quantity,
                                    UserId = getUserId
                                };
                                _inventoryRecorderContext.Add(inventoryRecord);
                                _inventoryRecorderContext.SaveChanges();
                            }
                        }
                        else
                        {
                            var inventoryRecordInfo = _inventoryRecorderContext.FirstOrDefault(x => x.IssueInventoryId == issueInventoryDetails.IssueStockInventoryId && x.ItemId == itemID && x.UserId == getUserId);
                            if (inventoryRecordInfo != null)
                            {
                                inventoryRecordInfo.RecordedQuantity = (int)(inventoryRecordInfo.RecordedQuantity + issueInventoryDetails.Quantity);
                                inventoryRecordInfo.ModifiedDateTime = DateTime.UtcNow;
                                _inventoryRecorderContext.Update(inventoryRecordInfo);
                                _inventoryRecorderContext.SaveChanges();
                            }
                            else
                            {

                                var inventoryRecord = new InventoryRecorder
                                {
                                    CreatedDateTime = DateTime.UtcNow,
                                    IssueInventoryId = issueInventoryInfo.Id,
                                    ItemId = (int)itemID,
                                    RecordedQuantity = (int)issueInventoryDetails.Quantity,
                                    UserId = getUserId
                                };
                                _inventoryRecorderContext.Add(inventoryRecord);
                                _inventoryRecorderContext.SaveChanges();
                            }
                        }

                        var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                        if (paramTypeDetails != null)
                        {
                            decimal systemQuantity = ItemQunatityCount(issueInventoryDetails, paramTypeDetails, issueInventoryDetails.BranchId, companyDetails);
                            issueInventoryInfo.SystemAmount = systemQuantity;
                        }
                        decimal inventoryRecordCount = 0;
                        var inventoryRecordDetails = _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == issueInventoryDetails.IssueStockInventoryId && x.ItemId == itemID).ToList();
                        foreach (var inventoryRecordDetail in inventoryRecordDetails)
                        {
                            inventoryRecordCount = inventoryRecordCount + inventoryRecordDetail.RecordedQuantity;
                        }
                        var itemQuantityInfo = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemID && x.BranchId == issueInventoryInfo.BranchId);
                        if (inventoryRecordDetails.Count != 0 && itemQuantityInfo != null)
                        {

                            if (inventoryRecordCount != itemQuantityInfo.ActualQuantity)
                            {
                                var unmatchedDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.IssueInventoryId == issueInventoryDetails.IssueStockInventoryId && x.ItemId == itemQuantityInfo.ItemId);
                                if (unmatchedDetails == null)
                                {
                                    var inventoryUnmatched = new InventoryUnmatchedItem
                                    {
                                        ItemId = itemQuantityInfo.ItemId,
                                        CreatedDateTime = DateTime.UtcNow,
                                        IssueInventoryId = issueInventoryDetails.IssueStockInventoryId,
                                        ResolveDate = DateTime.UtcNow,
                                    };
                                    inventoryUnmatched.IsResolvedDoNothing = true;
                                    issueInventoryDetails.IsUnmatchedItem = true;
                                    _inventoryUnmatchedContext.Add(inventoryUnmatched);
                                    _inventoryUnmatchedContext.SaveChanges();
                                    if (inventoryUnmatched.Id != 0)
                                    {
                                        issueInventoryInfo.IsInventoryUnmatched = true;
                                    }
                                }
                                else
                                {
                                    unmatchedDetails.IsResolvedDoNothing = true;
                                    issueInventoryDetails.IsUnmatchedItem = true;
                                    unmatchedDetails.ModifiedDateTime = DateTime.UtcNow;
                                    _inventoryUnmatchedContext.Update(unmatchedDetails);
                                    _inventoryUnmatchedContext.SaveChanges();
                                }
                            }
                            else
                            {
                                if (!issueInventoryInfo.IsRerecord)
                                {
                                    var unmatchedDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.IssueInventoryId == issueInventoryDetails.IssueStockInventoryId && x.ItemId == itemQuantityInfo.ItemId);
                                    if (unmatchedDetails != null)
                                    {
                                        _inventoryUnmatchedContext.Delete(unmatchedDetails.Id);
                                        _inventoryUnmatchedContext.SaveChanges();
                                    }
                                }
                            }
                        }
                        issueInventoryInfo.ShelfAmount = issueInventoryInfo.ShelfAmount + issueInventoryDetails.Quantity;
                        issueInventoryInfo.ModifiedDateTime = DateTime.UtcNow;
                        _issueInventoryContext.Update(issueInventoryInfo);
                        _issueInventoryContext.SaveChanges();
                        issueInventoryDetails.ShelfAmount = issueInventoryInfo.ShelfAmount;
                        issueInventoryDetails.SystemAmount = issueInventoryInfo.SystemAmount;
                        issueInventoryDetails.ItemDetails.ItemRecordCount = (int)inventoryRecordCount;
                    }
                }

                return issueInventoryDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to submit issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        public string SubmitIssueStockInventoryDetails(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails)
        {
            try
            {
                var workflowDetails = _workFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.IssueStockInventory, StringConstants.ReviewStockInventory, userDetails, companyDetails, issueInventoryDetails, issueInventoryDetails.InitiationComment, issueInventoryDetails);
                if (workflowDetails != null)
                {
                    var workFlowLog = (WorkFlowLog)workflowDetails.Item1;
                    var workflowDetailsInfo = (WorkFlowDetail)workflowDetails.Item2;
                    if (workFlowLog.Id != 0)
                    {
                        var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);

                        if (inventoryDetails != null)
                        {
                            if (workflowDetailsInfo.NextActivity.IsClosed)
                            {

                                inventoryDetails.RecordId = workFlowLog.RecordId;
                                inventoryDetails.IsRecord = false;
                                inventoryDetails.IsActive = true;
                                inventoryDetails.CloseDate = DateTime.UtcNow;
                                UpdateItemProfile(inventoryDetails.ParamTypeId, inventoryDetails.SupplierId, inventoryDetails.Barcode, inventoryDetails.CategoryId, companyDetails);

                                if (inventoryDetails.IsInventoryUnmatched && issueInventoryDetails.UnmatchedItemCollection.Count() != 0)
                                {
                                    UpdateUnmatchedItemCollection(issueInventoryDetails.UnmatchedItemCollection, issueInventoryDetails, companyDetails, userDetails);
                                }
                            }
                            else
                            {
                                inventoryDetails.IsRecord = false;
                                inventoryDetails.IsReview = true;
                                inventoryDetails.RecordId = workFlowLog.RecordId;
                            }
                            inventoryDetails.CloseDate = DateTime.UtcNow;
                            inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                            _issueInventoryContext.Update(inventoryDetails);
                            _issueInventoryContext.SaveChanges();
                        }
                        return "Work Flow Created";
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return "Work Flow Not Created";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to view issue stock inventory details by Id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        public IssueInventoryAc ViewIssueStockInventoryDetailsById(int issueInventoryId, UserDetail userDetails, bool isAllowUnmatchedItemRecover)
        {
            try
            {
                int unmatchedItemCount = 0;
                int matchedItemCount = 0;
                var inventory = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId);
                var issueInventoryAc = new IssueInventoryAc();
                if (inventory != null)
                {
                    issueInventoryAc = ApplicationClassHelper.ConvertType<IssueInventory, IssueInventoryAc>(inventory);
                    issueInventoryAc.BranchName = inventory.BranchDetail.Name;
                    issueInventoryAc.InventoryType = inventory.ParamType.ValueEn;
                    issueInventoryAc.IssueStockInventoryId = inventory.Id;
                    issueInventoryAc.StartDate = inventory.StartDate.Date;

                    if (inventory.CloseDate == null)
                    {
                        issueInventoryAc.CloseDate = null;
                    }
                    else
                    {
                        issueInventoryAc.CloseDate = (DateTime)inventory.CloseDate;
                    }
                    matchedItemCount = _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == inventory.Id).ToList().GroupBy(x => x.ItemId).ToList().Count();
                    if (inventory.IsInventoryUnmatched)
                    {
                        var unmatchedDetails = _inventoryUnmatchedContext.Fetch(x => x.IssueInventoryId == inventory.Id).ToList();

                        unmatchedItemCount = unmatchedDetails.Count();
                        var unmatchedItemCollection = new List<InventoryUnmatchedItemAc>();
                        if (unmatchedDetails.Count() != 0)
                        {
                            foreach (var unmatchedItemInformation in unmatchedDetails)
                            {
                                var unmatchedItemAc = new InventoryUnmatchedItemAc();
                                unmatchedItemAc = ApplicationClassHelper.ConvertType<InventoryUnmatchedItem, InventoryUnmatchedItemAc>(unmatchedItemInformation);
                                unmatchedItemAc.InventotyUnmatchedId = unmatchedItemInformation.Id;
                                if (unmatchedItemInformation.IsResolvedGain)
                                {
                                    unmatchedItemAc.ResolvedId = 2;
                                }
                                else if (unmatchedItemInformation.IsResolvedLoss)
                                {
                                    unmatchedItemAc.ResolvedId = 4;
                                }
                                else if (unmatchedItemInformation.IsResolvedAdjust)
                                {
                                    unmatchedItemAc.ResolvedId = 3;
                                }
                                else
                                {
                                    unmatchedItemAc.ResolvedId = 1;
                                }
                                var inventoryRecorderDetails = _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == unmatchedItemInformation.IssueInventoryId && x.ItemId == unmatchedItemInformation.ItemId).ToList();
                                if (inventoryRecorderDetails.Count != 0)
                                {
                                    decimal shelfItemCount = 0;
                                    foreach (var recordDetail in inventoryRecorderDetails)
                                    {
                                        shelfItemCount = shelfItemCount + recordDetail.RecordedQuantity;
                                    }
                                    var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == unmatchedItemInformation.ItemId && x.BranchId == inventory.BranchId);
                                    if (itemQuantityDetails != null)
                                    {
                                        if (!inventory.IsActive)
                                        {
                                            unmatchedItemAc.SystemQuantity = itemQuantityDetails.ActualQuantity;
                                            unmatchedItemAc.TotalPrice = Math.Abs((itemQuantityDetails.ActualQuantity - shelfItemCount) * itemQuantityDetails.ItemProfile.CostPrice);
                                        }
                                        else
                                        {
                                            if (unmatchedItemInformation.SystemQuantity != null)
                                            {
                                                unmatchedItemAc.SystemQuantity = (int)unmatchedItemInformation.SystemQuantity;
                                                unmatchedItemAc.TotalPrice = Math.Abs(((int)unmatchedItemInformation.SystemQuantity - shelfItemCount) * itemQuantityDetails.ItemProfile.CostPrice);
                                            }
                                        }
                                        unmatchedItemAc.ShelfQuantity = shelfItemCount;
                                        unmatchedItemAc.Unit = itemQuantityDetails.ItemProfile.SystemParameter.ValueEn;
                                        unmatchedItemAc.Barcode = itemQuantityDetails.ItemProfile.Barcode;
                                        unmatchedItemAc.ItemName = itemQuantityDetails.ItemProfile.ItemNameEn;
                                    }
                                }
                                unmatchedItemCollection.Add(unmatchedItemAc);
                            }
                        }
                        issueInventoryAc.UnmatchedItemCollection = unmatchedItemCollection;
                    }

                    if (inventory.RecordId != null)
                    {
                        if (inventory.IsRejected)
                        {
                            var currentworkFlowDetails = _workFlowDetailsRepository.ViewRejectWorkFlowDetailsById((int)inventory.RecordId, userDetails);
                            if (currentworkFlowDetails != null)
                            {
                                var parentWorkFlowDetails = _workFlowDetailsContext.FirstOrDefault(x => x.Id == currentworkFlowDetails.ParentActivityId);
                                if (parentWorkFlowDetails != null)
                                {
                                    if (parentWorkFlowDetails.ParentActivityId != 0)
                                    {
                                        if (parentWorkFlowDetails.IsChildCondition)
                                        {
                                            if (parentWorkFlowDetails.InitiatorId == userDetails.RoleId && currentworkFlowDetails.AssignedId == userDetails.RoleId)
                                            {
                                                if (inventory.IsRerecord)
                                                {
                                                    var unmatchedItemcolletion = _inventoryUnmatchedContext.Fetch(x => x.IssueInventoryId == inventory.Id && x.IsRerecord);
                                                    bool isReRecord = false;
                                                    foreach (var inventoryUnmatchedItem in unmatchedItemcolletion)
                                                    {
                                                        var inventoryRecoredDetails = _inventoryRecorderContext.FirstOrDefault(x => x.IssueInventoryId == inventoryUnmatchedItem.IssueInventoryId && x.ItemId == inventoryUnmatchedItem.ItemId);
                                                        if (inventoryRecoredDetails == null)
                                                        {
                                                            isReRecord = true;
                                                            break;
                                                        }
                                                    }
                                                    if (!isReRecord)
                                                    {
                                                        issueInventoryAc.IsResubmitReRecord = true;
                                                    }
                                                    else
                                                    {
                                                        issueInventoryAc.IsResubmitReRecord = false;
                                                    }
                                                }
                                                else
                                                {
                                                    issueInventoryAc.IsResubmitReRecord = true;
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (parentWorkFlowDetails.IsApproval)
                                            {
                                                var parentWorkflowInfo =
                                                    _workFlowDetailsContext.FirstOrDefault(x => x.Id == parentWorkFlowDetails.ParentActivityId);
                                                if (parentWorkflowInfo != null)
                                                {
                                                    if (parentWorkflowInfo.ParentActivityId != 0)
                                                    {
                                                        issueInventoryAc.IsResubmitRequest = parentWorkFlowDetails.IsReview;
                                                        issueInventoryAc.IsRejectedRequest = parentWorkFlowDetails.IsApproval;
                                                    }
                                                    else
                                                    {
                                                        issueInventoryAc.IsResubmitRequest = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        issueInventoryAc.IsResubmitRequest = true;
                                    }
                                }
                                if (isAllowUnmatchedItemRecover)
                                {
                                    issueInventoryAc.IsRecoveItem = true;
                                }
                            }
                        }
                        else
                        {
                            var currentworkFlowDetails = _workFlowDetailsRepository.ViewWorkFlowDetailsById((int)inventory.RecordId, userDetails);

                            if (currentworkFlowDetails != null)
                            {
                                issueInventoryAc.IsAllowApprovalButton = currentworkFlowDetails.IsApproval;
                                issueInventoryAc.IsAllowReViewButton = currentworkFlowDetails.IsReview;
                                if (isAllowUnmatchedItemRecover)
                                {
                                    if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                    {
                                        issueInventoryAc.IsRecoveItem = true;
                                    }
                                    else
                                    {
                                        issueInventoryAc.IsRecoveItem = false;
                                    }
                                }
                            }
                        }
                        issueInventoryAc.WorkFlowAction = _workFlowDetailsRepository.GetAllWorkFlowActionList((int)inventory.RecordId).OrderByDescending(x => x.WorkFlowActionId);
                    }
                    if (matchedItemCount != 0)
                    {
                        issueInventoryAc.MatchItemCount = matchedItemCount - unmatchedItemCount;
                    }
                    else
                    {
                        issueInventoryAc.MatchItemCount = matchedItemCount;
                    }

                    issueInventoryAc.UnMatchItemCount = unmatchedItemCount;
                }
                return issueInventoryAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for either approve or reject issue stock inventory details.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        public string IssueStockInventoryApprovalById(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover)
        {
            try
            {
                if (issueInventoryDetails.IsStatus)
                {
                    var workflowDetails = _workFlowDetailsRepository.GetApprovalActionWorkFLow((int)issueInventoryDetails.RecordId, StringConstants.ApprovAction, issueInventoryDetails.InitiationComment, userDetails, issueInventoryDetails.IsStatus);

                    if (workflowDetails.Id != 0)
                    {
                        var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);
                        var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);

                        if (inventoryDetails != null)
                        {
                            if (workFlowInfo.NextActivity.IsClosed)
                            {
                                inventoryDetails.IsRecord = false;
                                inventoryDetails.IsActive = true;
                                inventoryDetails.CloseDate = DateTime.UtcNow;
                                UpdateItemProfile(inventoryDetails.ParamTypeId, inventoryDetails.SupplierId, inventoryDetails.Barcode, inventoryDetails.CategoryId, companyDetails);

                                if (inventoryDetails.IsInventoryUnmatched && issueInventoryDetails.UnmatchedItemCollection.Count() != 0)
                                {
                                    UpdateUnmatchedItemCollection(issueInventoryDetails.UnmatchedItemCollection, issueInventoryDetails, companyDetails, userDetails);
                                }
                                inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                                _issueInventoryContext.Update(inventoryDetails);
                                _issueInventoryContext.SaveChanges();
                            }
                            else
                            {
                                if (isAllowUnmatchedItemRecover && issueInventoryDetails.UnmatchedItemCollection.Count() != 0)
                                {
                                    UpdateUnmatchedItemRecover(issueInventoryDetails.UnmatchedItemCollection);
                                }
                            }
                        }
                        return "Work Flow Created";
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    var workflowDetails = _workFlowDetailsRepository.GetApprovalActionWorkFLow((int)issueInventoryDetails.RecordId, StringConstants.RejectAction, issueInventoryDetails.InitiationComment, userDetails, issueInventoryDetails.IsStatus);
                    if (workflowDetails.Id != 0)
                    {
                        var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);
                        var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);

                        if (inventoryDetails != null)
                        {
                            if (workFlowInfo.NextActivity.IsClosed)
                            {
                                inventoryDetails.IsRecord = false;
                                inventoryDetails.IsActive = false;
                                inventoryDetails.IsDeleted = true;
                            }
                            else
                            {
                                inventoryDetails.IsRecord = false;
                                inventoryDetails.IsRejected = true;
                            }
                            inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                            _issueInventoryContext.Update(inventoryDetails);
                            _issueInventoryContext.SaveChanges();
                        }
                        return "Work Flow Created";
                    }
                    else
                    {
                        return null;
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
        /// this method is used to review issue stock inventory request by Id.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        public string ReviewIssueStockInventoryById(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover)
        {
            try
            {
                var workflowDetails = _workFlowDetailsRepository.GetReviewActionWorkFlow((int)issueInventoryDetails.RecordId, issueInventoryDetails, issueInventoryDetails, StringConstants.ReviewAction, issueInventoryDetails.InitiationComment, userDetails);

                if (workflowDetails.Id != 0)
                {
                    var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);

                    var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);

                    if (inventoryDetails != null)
                    {

                        if (workFlowInfo.NextActivity.IsClosed)
                        {
                            inventoryDetails.IsRecord = false;
                            inventoryDetails.IsActive = true;
                            inventoryDetails.CloseDate = DateTime.UtcNow;
                            UpdateItemProfile(inventoryDetails.ParamTypeId, inventoryDetails.SupplierId, inventoryDetails.Barcode, inventoryDetails.CategoryId, companyDetails);

                            if (inventoryDetails.IsInventoryUnmatched && issueInventoryDetails.UnmatchedItemCollection.Count() != 0)
                            {
                                UpdateUnmatchedItemCollection(issueInventoryDetails.UnmatchedItemCollection, issueInventoryDetails, companyDetails, userDetails);
                            }
                        }
                        if (isAllowUnmatchedItemRecover && issueInventoryDetails.UnmatchedItemCollection.Count() != 0)
                        {
                            UpdateUnmatchedItemRecover(issueInventoryDetails.UnmatchedItemCollection);
                        }
                        inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                        _issueInventoryContext.Update(inventoryDetails);
                        _issueInventoryContext.SaveChanges();
                    }
                    return "Work Flow Created";
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get item details.
        /// </summary>
        /// <param name="paramId"></param>
        /// <param name="detailsId"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<ItemProfileAC> GetItemDetailsById(int paramId, int detailsId, int? companyId)
        {
            try
            {
                var itemProfileCollection = new List<ItemProfileAC>();
                var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == paramId);
                if (paramTypeDetails != null)
                {
                    List<ItemProfile> itemDetails;
                    switch (paramTypeDetails.ValueEn)
                    {
                        case StringConstants.SupplierInventory:
                            var supllierCollection = _itemSupplierContext.Fetch(x => x.SupplierId == detailsId).ToList().GroupBy(x => x.CategoryId).ToList();
                            foreach (var itemSupplier in supllierCollection)
                            {
                                itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == itemSupplier.Key && x.CompanyId == companyId && !x.IsDeleted && x.IsParentItem).ToList();
                                itemProfileCollection.AddRange(FetchItemCollection(itemDetails));
                            }
                            break;
                        case StringConstants.ItemInventory:

                            var itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Id == detailsId && !x.IsDeleted && x.CompanyId == companyId);
                            if (itemProfileDetails != null)
                            {
                                var itemProfileAc = new ItemProfileAC();
                                if (itemProfileDetails.IsParentItem)
                                {
                                    itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                    itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                    itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" + itemProfileDetails.Category.GroupParamType.ValueEn;
                                    itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn + " - " + itemProfileDetails.BaseUnit;

                                    itemProfileCollection.Add(itemProfileAc);
                                }
                                else
                                {
                                    itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Id == itemProfileDetails.ParentItemId);
                                    itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                    itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                    itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" + itemProfileDetails.Category.GroupParamType.ValueEn;
                                    itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn + " - " + itemProfileDetails.BaseUnit;
                                    itemProfileAc.listOfChildProfileAC = GetSubItemList((int)itemProfileDetails.Id);
                                    if (itemProfileAc.listOfChildProfileAC.Count != 0)
                                    {
                                        itemProfileAc.HasChildItem = true;
                                    }
                                    itemProfileCollection.Add(itemProfileAc);
                                }
                            }
                            break;
                        case StringConstants.FullInventory:
                            itemDetails = _itemProfileContext.Fetch(x => !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId).ToList();
                            itemProfileCollection = FetchItemCollection(itemDetails);
                            break;
                        case StringConstants.CategoryInventory:
                            itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == detailsId && !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId).ToList();
                            itemProfileCollection = FetchItemCollection(itemDetails);
                            break;
                    }
                }
                return itemProfileCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to update issue stock inventory date.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        public string UpdateIssueInventoryDate(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);
                DateTime startDate = issueInventoryDetails.StartDate.ToLocalTime();

                if (inventoryDetails != null)
                {
                    var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                    if (paramTypeDetails != null)
                    {
                        IssueInventory inventoryExist;
                        List<IssueInventory> inventoryCollection;
                        switch (paramTypeDetails.ValueEn)
                        {
                            case StringConstants.SupplierInventory:
                                inventoryCollection = _issueInventoryContext.Fetch(x => x.Id == inventoryDetails.Id && x.SupplierId == inventoryDetails.SupplierId && x.BranchId == inventoryDetails.BranchId && !x.IsActive).ToList();
                                if (inventoryCollection.Count() != 0)
                                {
                                    inventoryExist = inventoryCollection.FirstOrDefault(x => x.StartDate.Date == startDate.Date && x.Id != inventoryDetails.Id);
                                    if (inventoryExist != null)
                                    {
                                        return "Current Date Already Exist";
                                    }
                                    else
                                    {
                                        return "Already Exist";
                                    }
                                }
                                else
                                {
                                    inventoryDetails.StartDate = startDate;
                                }
                                break;
                            case StringConstants.ItemInventory:
                                inventoryCollection = _issueInventoryContext.Fetch(x => x.Id == inventoryDetails.Id && x.Barcode == inventoryDetails.Barcode && x.BranchId == inventoryDetails.BranchId && !x.IsActive).ToList();
                                if (inventoryCollection.Count() != 0)
                                {
                                    inventoryExist = inventoryCollection.FirstOrDefault(x => x.StartDate.Date == startDate.Date && x.Id != inventoryDetails.Id);
                                    if (inventoryExist != null)
                                    {
                                        return "Current Date Already Exist";
                                    }
                                    else
                                    {
                                        return "Already Exist";
                                    }
                                }
                                else
                                {
                                    inventoryDetails.StartDate = startDate;
                                }
                                break;
                            case StringConstants.FullInventory:
                                inventoryCollection = _issueInventoryContext.Fetch(x => x.Id == inventoryDetails.Id && x.ParamTypeId == inventoryDetails.ParamTypeId && x.BranchId == inventoryDetails.BranchId && !x.IsActive).ToList();
                                if (inventoryCollection.Count() != 0)
                                {
                                    inventoryExist = inventoryCollection.FirstOrDefault(x => x.StartDate.Date == startDate.Date && x.Id != inventoryDetails.Id);
                                    if (inventoryExist != null)
                                    {
                                        return "Current Date Already Exist";
                                    }
                                    else
                                    {
                                        return "Already Exist";
                                    }
                                }
                                else
                                {
                                    inventoryDetails.StartDate = startDate;
                                }
                                break;
                            case StringConstants.CategoryInventory:
                                inventoryCollection = _issueInventoryContext.Fetch(x => x.CategoryId == inventoryDetails.CategoryId && x.BranchId == inventoryDetails.BranchId && !x.IsActive).ToList();
                                if (inventoryCollection.Count() != 0)
                                {
                                    inventoryExist = inventoryCollection.FirstOrDefault(x => x.StartDate.Date == startDate.Date && x.Id != inventoryDetails.Id);
                                    if (inventoryExist != null)
                                    {
                                        return "Current Date Already Exist";
                                    }
                                    else
                                    {
                                        return "Already Exist";
                                    }
                                }
                                else
                                {
                                    inventoryDetails.StartDate = startDate;
                                }
                                break;
                        }
                    }
                    inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                    _issueInventoryContext.Update(inventoryDetails);
                    _issueInventoryContext.SaveChanges();
                }
                return "Initiate Request";
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to submit issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public IssueInventoryAc SubmitStockInventory(IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetails)
        {
            try
            {
                DateTime startDate = issueInventoryDetails.StartingDate;
                var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                if (paramTypeDetails != null)
                {
                    foreach (var branchDetails in issueInventoryDetails.BranchList)
                    {
                        decimal itemSystemQuantity = ItemQunatityCount(issueInventoryDetails, paramTypeDetails, branchDetails.Id, companyDetails);
                        var issueInventory = new IssueInventory
                        {
                            BranchId = branchDetails.Id,
                            CreatedDateTime = DateTime.UtcNow,
                            Barcode = issueInventoryDetails.Barcode,
                            CategoryId = issueInventoryDetails.CategoryId,
                            ParamTypeId = issueInventoryDetails.ParamTypeId,
                            SupplierId = issueInventoryDetails.SupplierId,
                            SystemAmount = itemSystemQuantity,
                            CloseDate = null,
                            StartDate = startDate,
                            InventoryNO = GetTheIssueInventoryNumber(),
                            IsInitiate = true
                        };
                        _issueInventoryContext.Add(issueInventory);
                        _issueInventoryContext.SaveChanges();
                    }
                }
                return issueInventoryDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to submit muliple branch issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public IssueInventoryAc SubmitConflictBranchIssueInventory(IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetails)
        {
            try
            {
                DateTime startDate = issueInventoryDetails.StartingDate;
                var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                if (paramTypeDetails != null)
                {
                    foreach (var branchDetails in issueInventoryDetails.BranchList)
                    {
                        if (branchDetails.IsInventorySelected)
                        {
                            decimal itemSystemQuantity = ItemQunatityCount(issueInventoryDetails, paramTypeDetails, branchDetails.BranchId, companyDetails);
                            issueInventoryDetails.CompletedStatus = StringConstants.InitiateInventory;
                            var issueInventory = new IssueInventory
                            {
                                BranchId = branchDetails.Id,
                                CreatedDateTime = DateTime.UtcNow,
                                Barcode = issueInventoryDetails.Barcode,
                                CategoryId = issueInventoryDetails.CategoryId,
                                ParamTypeId = issueInventoryDetails.ParamTypeId,
                                SupplierId = issueInventoryDetails.SupplierId,
                                SystemAmount = itemSystemQuantity,
                                CloseDate = null,
                                StartDate = startDate,
                                InventoryNO = GetTheIssueInventoryNumber(),
                                IsInitiate = true
                            };
                            _issueInventoryContext.Add(issueInventory);
                            _issueInventoryContext.SaveChanges();
                        }
                    }
                    return issueInventoryDetails;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public void UpdateStockIssueInventoryDate(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                DateTime startDate = issueInventoryDetails.StartDate.ToLocalTime();
                var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);
                if (inventoryDetails != null)
                {
                    inventoryDetails.StartDate = startDate;
                    inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                    _issueInventoryContext.Update(inventoryDetails);
                    _issueInventoryContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        ///  this method is used to get unmatched item list.
        /// </summary>
        /// <param name="issueStockInventoryId"></param>
        /// <returns></returns>
        public IssueInventoryUnmatchedItemAc GetUnmatchedItemListById(int issueStockInventoryId, UserDetail userDetails)
        {
            try
            {
                var issueInventoryUnmatchedItem = new IssueInventoryUnmatchedItemAc();
                var unmatchedItemCollection = new List<InventoryUnmatchedItemAc>();
                var issueStockInventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueStockInventoryId);
                if (issueStockInventoryDetails != null)
                {
                    foreach (var unmatchedItem in _inventoryUnmatchedContext.Fetch(x => x.IssueInventoryId == issueStockInventoryId).ToList())
                    {
                        var unmatchedItemAc = new InventoryUnmatchedItemAc();
                        unmatchedItemAc = ApplicationClassHelper.ConvertType<InventoryUnmatchedItem, InventoryUnmatchedItemAc>(unmatchedItem);
                        unmatchedItemAc.InventotyUnmatchedId = unmatchedItem.Id;
                        var inventoryRecorderDetails = _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == unmatchedItem.IssueInventoryId && x.ItemId == unmatchedItem.ItemId).ToList();
                        if (inventoryRecorderDetails.Count != 0)
                        {
                            decimal shelfItemCount = 0;
                            foreach (var recordDetail in inventoryRecorderDetails)
                            {
                                shelfItemCount = shelfItemCount + recordDetail.RecordedQuantity;
                            }
                            var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == unmatchedItem.ItemId && x.BranchId == issueStockInventoryDetails.BranchId);
                            if (itemQuantityDetails != null)
                            {
                                if (issueStockInventoryDetails.IsActive)
                                {
                                    if (unmatchedItem.SystemQuantity != null)
                                    {
                                        unmatchedItemAc.SystemQuantity = (int)unmatchedItem.SystemQuantity;
                                        unmatchedItemAc.TotalPrice = Math.Abs(((int)unmatchedItem.SystemQuantity - shelfItemCount) * itemQuantityDetails.ItemProfile.CostPrice);
                                    }
                                }
                                else
                                {
                                    unmatchedItemAc.SystemQuantity = itemQuantityDetails.ActualQuantity;
                                    unmatchedItemAc.TotalPrice = Math.Abs((itemQuantityDetails.ActualQuantity - shelfItemCount) * itemQuantityDetails.ItemProfile.CostPrice);
                                }

                                unmatchedItemAc.ShelfQuantity = shelfItemCount;
                                unmatchedItemAc.Unit = itemQuantityDetails.ItemProfile.SystemParameter.ValueEn;
                                unmatchedItemAc.Barcode = itemQuantityDetails.ItemProfile.Barcode;
                                unmatchedItemAc.ItemName = itemQuantityDetails.ItemProfile.ItemNameEn;
                                unmatchedItemAc.FlavorName = itemQuantityDetails.ItemProfile.FlavourEn;
                                unmatchedItemAc.CategoryName = itemQuantityDetails.ItemProfile.Category.BrandParamType.ValueEn + "-" + itemQuantityDetails.ItemProfile.Category.GroupParamType.ValueEn;
                                unmatchedItemAc.IsRerecordDisabled = unmatchedItem.IsRerecord;
                            }
                        }
                        unmatchedItemCollection.Add(unmatchedItemAc);
                    }
                    if (issueStockInventoryDetails.IsRejected)
                    {
                        var currentworkFlowDetails = _workFlowDetailsRepository.ViewRejectWorkFlowDetailsById((int)issueStockInventoryDetails.RecordId, userDetails);
                        if (currentworkFlowDetails != null)
                        {
                            var parentWorkFlowDetails =
                                _workFlowDetailsContext.FirstOrDefault(
                                    x => x.Id == currentworkFlowDetails.ParentActivityId);

                            if (parentWorkFlowDetails != null && parentWorkFlowDetails.ParentActivityId != 0 && parentWorkFlowDetails.IsChildCondition && parentWorkFlowDetails.IsChildCondition && parentWorkFlowDetails.InitiatorId == userDetails.RoleId && currentworkFlowDetails.AssignedId == userDetails.RoleId)
                            {
                                issueInventoryUnmatchedItem.IsRerecord = true;
                            }
                        }
                    }
                    issueInventoryUnmatchedItem.UnmatchedItemCollection = unmatchedItemCollection;
                }
                return issueInventoryUnmatchedItem;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to re-record item details.
        /// </summary>
        /// <param name="issueInventoryUnmatchedItem"></param>
        /// <returns></returns>
        public IssueInventoryUnmatchedItemAc ReRecordSelectedItemDetails(IssueInventoryUnmatchedItemAc issueInventoryUnmatchedItem)
        {
            try
            {
                decimal shelfItemCount = 0;
                bool isRerecord = false;
                int issueInventoryId = 0;
                foreach (var unmatchedItem in issueInventoryUnmatchedItem.UnmatchedItemCollection)
                {
                    var issueInventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == unmatchedItem.IssueInventoryId);
                    issueInventoryId = unmatchedItem.IssueInventoryId;
                    if (issueInventoryDetails != null && unmatchedItem.IsRerecord)
                    {
                        var unmatchedItemDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.Id == unmatchedItem.InventotyUnmatchedId);
                        if (unmatchedItemDetails != null)
                        {
                            foreach (var inventoryRecord in _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == unmatchedItem.IssueInventoryId && x.ItemId == unmatchedItem.ItemId).ToList())
                            {
                                var inventoryRecordDetails = _inventoryRecorderContext.FirstOrDefault(x => x.Id == inventoryRecord.Id);
                                if (inventoryRecordDetails != null)
                                {
                                    shelfItemCount = shelfItemCount + inventoryRecordDetails.RecordedQuantity;
                                    _inventoryRecorderContext.Delete(inventoryRecordDetails.Id);
                                    _inventoryRecorderContext.SaveChanges();
                                }
                            }
                            unmatchedItemDetails.IsRerecord = true;
                            isRerecord = true;
                            unmatchedItemDetails.ModifiedDateTime = DateTime.UtcNow;
                            _inventoryUnmatchedContext.Update(unmatchedItemDetails);
                            _inventoryUnmatchedContext.SaveChanges();
                        }
                    }
                }
                if (isRerecord)
                {
                    var issueInventoryInfo = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryId);
                    if (issueInventoryInfo != null)
                    {
                        issueInventoryInfo.IsRerecord = true;
                        issueInventoryInfo.ShelfAmount = Math.Abs((issueInventoryInfo.ShelfAmount - shelfItemCount));
                        issueInventoryInfo.ModifiedDateTime = DateTime.UtcNow;
                        _issueInventoryContext.Update(issueInventoryInfo);
                        _issueInventoryContext.SaveChanges();
                    }
                }
                return issueInventoryUnmatchedItem;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to resubmit the issue stock inventory request.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        public string ReSubmitIssueStockInventory(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover)
        {
            try
            {
                if (issueInventoryDetails.IsStatus)
                {
                    var workflowDetails = _workFlowDetailsRepository.GetResubmitActionWorkFlow((int)issueInventoryDetails.RecordId, issueInventoryDetails, issueInventoryDetails, StringConstants.ReSubmitedAction, issueInventoryDetails.InitiationComment, userDetails);
                    if (workflowDetails != null && workflowDetails.Id != 0)
                    {
                        var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);
                        if (inventoryDetails != null)
                        {
                            if (inventoryDetails.IsRerecord)
                            {
                                inventoryDetails.IsRerecord = false;
                                inventoryDetails.IsRejected = false;
                                inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                                _issueInventoryContext.Update(inventoryDetails);
                                _issueInventoryContext.SaveChanges();

                                foreach (var unmatchedItemCollection in _inventoryUnmatchedContext.Fetch(x => x.IssueInventoryId == inventoryDetails.Id && x.IsRerecord).ToList())
                                {
                                    decimal itemCount = 0;
                                    foreach (var recordItemCount in _inventoryRecorderContext.Fetch(x => x.IssueInventoryId == unmatchedItemCollection.IssueInventoryId && x.ItemId == unmatchedItemCollection.ItemId).ToList())
                                    {
                                        itemCount = itemCount + recordItemCount.RecordedQuantity;
                                    }

                                    var itemQuantityDetails =
                                        _itemQuantityContext.FirstOrDefault(x => x.ItemId == unmatchedItemCollection.ItemId && x.BranchId == unmatchedItemCollection.IssueInventory.BranchId);
                                    if (itemQuantityDetails != null)
                                    {
                                        var unmatchedItemDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.IssueInventoryId == unmatchedItemCollection.IssueInventoryId && x.ItemId == unmatchedItemCollection.ItemId);

                                        if (unmatchedItemCollection != null)
                                        {
                                            if (itemQuantityDetails.ActualQuantity == itemCount)
                                            {
                                                _inventoryUnmatchedContext.Delete(unmatchedItemDetails.Id);
                                                _inventoryUnmatchedContext.SaveChanges();
                                            }
                                            else
                                            {
                                                unmatchedItemDetails.IsRerecord = false;
                                                unmatchedItemDetails.ModifiedDateTime = DateTime.UtcNow;
                                                _inventoryUnmatchedContext.Update(unmatchedItemDetails);
                                                _inventoryUnmatchedContext.SaveChanges();
                                            }
                                        }
                                    }
                                }
                                return "Work Flow Created";
                            }
                            else
                            {
                                inventoryDetails.IsRejected = false;
                                inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                                _issueInventoryContext.Update(inventoryDetails);
                                _issueInventoryContext.SaveChanges();

                                if (isAllowUnmatchedItemRecover && issueInventoryDetails.UnmatchedItemCollection.Count() != 0)
                                {
                                    foreach (var unmatchedDetails in issueInventoryDetails.UnmatchedItemCollection)
                                    {
                                        var itemUnmatchedDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.ItemId == unmatchedDetails.ItemId && x.IssueInventoryId == unmatchedDetails.IssueInventoryId);
                                        if (itemUnmatchedDetails != null)
                                        {
                                            switch (unmatchedDetails.ResolvedId)
                                            {
                                                case 2:
                                                    itemUnmatchedDetails.IsResolvedGain = true;
                                                    break;
                                                case 4:
                                                    itemUnmatchedDetails.IsResolvedLoss = true;
                                                    break;
                                                case 3:
                                                    itemUnmatchedDetails.IsResolvedAdjust = true;
                                                    break;
                                                default:
                                                    itemUnmatchedDetails.IsResolvedDoNothing = true;
                                                    break;
                                            }
                                            itemUnmatchedDetails.UnmatchedItemComment = unmatchedDetails.UnmatchedItemComment;
                                            itemUnmatchedDetails.ModifiedDateTime = DateTime.UtcNow;
                                            _inventoryUnmatchedContext.Update(itemUnmatchedDetails);
                                            _inventoryUnmatchedContext.SaveChanges();
                                        }
                                    }
                                }
                                return "Work Flow Created";
                            }
                        }
                        else
                        {
                            return "no Record Found";
                        }
                    }
                    else
                    {
                        return "Work Flow Not Created";
                    }
                }
                else
                {
                    var workflowDetails = _workFlowDetailsRepository.GetRejectActionActionWorkFlow((int)issueInventoryDetails.RecordId, issueInventoryDetails, issueInventoryDetails, StringConstants.RejectAction, issueInventoryDetails.InitiationComment, userDetails);
                    if (workflowDetails != null && workflowDetails.Id != 0)
                    {
                        var inventoryDetails = _issueInventoryContext.FirstOrDefault(x => x.Id == issueInventoryDetails.IssueStockInventoryId);
                        if (inventoryDetails != null)
                        {
                            inventoryDetails.IsRejected = true;
                            inventoryDetails.ModifiedDateTime = DateTime.UtcNow;
                            _issueInventoryContext.Update(inventoryDetails);
                            _issueInventoryContext.SaveChanges();
                        }
                        return "Work Flow Created";
                    }
                    else
                    {
                        return "Work Flow Not Created";
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion


        #region Private methods


        private void UpdateItemProfile(int? paramTypeId, int? supplierId, string barcode, int? categoryId, CompanyDetail companyDetails)
        {
            try
            {
                var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == paramTypeId);
                if (paramTypeDetails != null)
                {
                    List<ItemProfile> itemDetails;
                    IssueInventory inventoryInfo;
                    switch (paramTypeDetails.ValueEn)
                    {
                        case StringConstants.SupplierInventory:
                            inventoryInfo = _issueInventoryContext.FirstOrDefault(x => x.SupplierId == supplierId && !x.IsActive);
                            if (inventoryInfo != null)
                            {
                                var itemSupplierDetails = _itemSupplierContext.FirstOrDefault(x => x.SupplierId == supplierId && !x.IsDelete);
                                if (itemSupplierDetails != null)
                                {
                                    itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == itemSupplierDetails.CategoryId && !x.IsDeleted && x.CompanyId == companyDetails.Id).ToList();
                                    foreach (var itemProfile in itemDetails)
                                    {
                                        itemProfile.IsIssueInventory = false;
                                        itemProfile.ModifiedDateTime = DateTime.UtcNow;
                                        _itemProfileContext.Update(itemProfile);
                                        _itemProfileContext.SaveChanges();
                                    }
                                }
                            }
                            break;
                        case StringConstants.ItemInventory:
                            inventoryInfo = _issueInventoryContext.FirstOrDefault(x => x.Barcode == barcode && !x.IsActive);
                            if (inventoryInfo != null)
                            {
                                var itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode && !x.IsDeleted && x.CompanyId == companyDetails.Id);
                                if (itemProfileDetails != null)
                                {
                                    itemProfileDetails.IsIssueInventory = false;
                                    itemProfileDetails.ModifiedDateTime = DateTime.UtcNow;
                                    _itemProfileContext.Update(itemProfileDetails);
                                    _itemProfileContext.SaveChanges();
                                }
                            }
                            break;
                        case StringConstants.FullInventory:
                            inventoryInfo = _issueInventoryContext.FirstOrDefault(x => !x.IsActive);
                            if (inventoryInfo != null)
                            {
                                itemDetails = _itemProfileContext.Fetch(x => !x.IsDeleted && x.CompanyId == companyDetails.Id).ToList();
                                foreach (var itemProfile in itemDetails)
                                {
                                    itemProfile.IsIssueInventory = false;
                                    itemProfile.ModifiedDateTime = DateTime.UtcNow;
                                    _itemProfileContext.Update(itemProfile);
                                    _itemProfileContext.SaveChanges();
                                }
                            }
                            break;
                        case StringConstants.CategoryInventory:
                            inventoryInfo = _issueInventoryContext.FirstOrDefault(x => x.CategoryId == categoryId && !x.IsActive);
                            if (inventoryInfo != null)
                            {
                                itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == categoryId && !x.IsDeleted && x.CompanyId == companyDetails.Id).ToList();
                                foreach (var itemProfile in itemDetails)
                                {
                                    itemProfile.IsIssueInventory = false;
                                    itemProfile.ModifiedDateTime = DateTime.UtcNow;
                                    _itemProfileContext.Update(itemProfile);
                                    _itemProfileContext.SaveChanges();
                                }
                            }
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private string GetTheIssueInventoryNumber()
        {
            try
            {
                var checkIssueInventoryNo = DateTime.UtcNow.ToString("ddMMyyyy");
                var issueInventoryCount = _issueInventoryContext.Fetch(x => x.InventoryNO.Contains(checkIssueInventoryNo)).Count();
                var issueInventoryNumber = "";
                var numString = (issueInventoryCount + 1).ToString();
                var ponum = numString.PadLeft(numString.Length + 4 - 1, '0');
                var currentDate = DateTime.UtcNow.ToString("ddMMyyyy");
                issueInventoryNumber = currentDate + "" + ponum;
                return issueInventoryNumber;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used update unmatched item recovery.
        /// </summary>
        /// <param name="unmatchedItemCollection"></param>
        private void UpdateUnmatchedItemRecover(List<InventoryUnmatchedItemAc> unmatchedItemCollection)
        {
            try
            {
                foreach (var unmatchedDetails in unmatchedItemCollection)
                {
                    var itemUnmatchedDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.ItemId == unmatchedDetails.ItemId && x.IssueInventoryId == unmatchedDetails.IssueInventoryId);
                    if (itemUnmatchedDetails != null)
                    {
                        switch (unmatchedDetails.ResolvedId)
                        {
                            case 2:
                                itemUnmatchedDetails.IsResolvedGain = true;
                                break;
                            case 4:
                                itemUnmatchedDetails.IsResolvedLoss = true;
                                break;
                            case 3:
                                itemUnmatchedDetails.IsResolvedAdjust = true;
                                break;
                            default:
                                itemUnmatchedDetails.IsResolvedDoNothing = true;
                                break;

                        }
                        itemUnmatchedDetails.UnmatchedItemComment = unmatchedDetails.UnmatchedItemComment;
                        itemUnmatchedDetails.ModifiedDateTime = DateTime.UtcNow;
                        _inventoryUnmatchedContext.Update(itemUnmatchedDetails);
                        _inventoryUnmatchedContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private void InsertIntoAccounting(IssueInventoryAc issueInventoryDetails, decimal totalCostPrice, InventoryUnmatchedItemAc unmatchedItemDetails)
        {
            List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
            if (unmatchedItemDetails != null && issueInventoryDetails != null && totalCostPrice != 0)
            {
                if (unmatchedItemDetails.IsResolvedLoss) // If Loss Inventory
                {
                    var ledgersForMiscLoss = _iAccountRepository.GetAccountLedgerByName(StringConstants.Loss, issueInventoryDetails.BranchId);
                    var ledgerForStockInHand = _iAccountRepository.GetAccountLedgerByName(StringConstants.StockInHand, issueInventoryDetails.BranchId);
                    if (ledgersForMiscLoss != null && ledgerForStockInHand != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForMiscLoss.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalCostPrice, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.IssueStockInventory, Description = "for " + unmatchedItemDetails.ItemName + " item of " + issueInventoryDetails.BranchName + " branch" });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgerForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = totalCostPrice, Debit = 0, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.IssueStockInventory, Description = "for " + unmatchedItemDetails.ItemName + " item of " + issueInventoryDetails.BranchName + " branch" });
                    }
                }
                else if (unmatchedItemDetails.IsResolvedGain) //If Gain Invetory
                {
                    var ledgersForIncome = _iAccountRepository.GetAccountLedgerByName(StringConstants.Income, issueInventoryDetails.BranchId);
                    var ledgerForStockInHand = _iAccountRepository.GetAccountLedgerByName(StringConstants.StockInHand, issueInventoryDetails.BranchId);
                    if (ledgerForStockInHand != null && ledgersForIncome != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForIncome.Id, TransactionDate = DateTime.UtcNow, Credit = totalCostPrice, Debit = 0, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.IssueStockInventory, Description = "for " + unmatchedItemDetails.ItemName + " item of " + issueInventoryDetails.BranchName + " branch" });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgerForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalCostPrice, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.IssueStockInventory, Description = "for " + unmatchedItemDetails.ItemName + " item of " + issueInventoryDetails.BranchName + " branch" });
                    }
                }
                if (listOfDoubleEntry.Any())
                    _iAccountRepository.AddAccountingEntries(listOfDoubleEntry);
            }
        }


        private List<ItemProfileAC> FetchItemCollection(List<ItemProfile> itemDetails)
        {
            List<ItemProfileAC> itemProfileCollection = new List<ItemProfileAC>();
            foreach (var itemProfile in itemDetails)
            {                
                ItemProfileAC itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfile);
                itemProfileAc.ItemProfileId = itemProfile.Id;
                itemProfileAc.ItemType = itemProfile.Category.BrandParamType.ValueEn + "-" + itemProfile.Category.GroupParamType.ValueEn;
                itemProfileAc.Unit = itemProfile.SystemParameter.ValueEn + " - " + itemProfile.BaseUnit;
                itemProfileAc.listOfChildProfileAC = GetSubItemList(itemProfile.Id);
                if (itemProfileAc.listOfChildProfileAC.Count != 0)
                {
                    itemProfileAc.HasChildItem = true;
                }
                itemProfileCollection.Add(itemProfileAc);
            }
            return itemProfileCollection;
        }


        private IssueInventoryAc FetchAllInventoryList(IssueInventoryAc issueInventoryAc, IssueInventory inventory)
        {
            var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == inventory.ParamTypeId);
            if (paramTypeDetails != null)
            {
                if (paramTypeDetails.ValueEn == StringConstants.ItemInventory)
                {
                    var itemDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == inventory.Barcode);
                    if (itemDetails != null)
                    {
                        issueInventoryAc.TotalQuantity = itemDetails.BaseUnit * inventory.SystemAmount;
                        issueInventoryAc.IsTotalQuantity = true;
                    }
                }
                else
                {
                    issueInventoryAc.IsTotalQuantity = false;
                }
            }
            issueInventoryAc.BranchName = inventory.BranchDetail.Name;
            issueInventoryAc.InventoryType = inventory.ParamType.ValueEn;
            issueInventoryAc.IssueStockInventoryId = inventory.Id;
            issueInventoryAc.StartDate = inventory.StartDate.Date;
            if (inventory.CloseDate != null)
            {
                issueInventoryAc.CloseDate = (DateTime)inventory.CloseDate;
            }
            else
            {
                issueInventoryAc.CloseDate = null;
            }
            return issueInventoryAc;
        }


        private IssueInventoryAc FetchAllInventoryRecorderList(IssueInventory inventory)
        {
            IssueInventoryAc issueInventoryAc;
            issueInventoryAc = ApplicationClassHelper.ConvertType<IssueInventory, IssueInventoryAc>(inventory);
            if (inventory.RecordId != null)
            {
                var parentRecredDetails = _parentRecordContext.FirstOrDefault(x => x.Id == inventory.RecordId);
                if (parentRecredDetails != null)
                {
                    var workFlowStatusDetails = _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id).ToList().LastOrDefault();
                    if (workFlowStatusDetails != null)
                    {
                        issueInventoryAc.WorkFlowStatus = workFlowStatusDetails.Action;
                    }
                }
            }
            issueInventoryAc.BranchName = inventory.BranchDetail.Name;
            issueInventoryAc.InventoryType = inventory.ParamType.ValueEn;
            issueInventoryAc.IssueStockInventoryId = inventory.Id;
            issueInventoryAc.StartDate = inventory.StartDate.Date;
            if (inventory.CloseDate == null)
            {
                issueInventoryAc.CloseDate = null;
            }
            else
            {
                issueInventoryAc.CloseDate = (DateTime)inventory.CloseDate;
            }
            return issueInventoryAc;
        }


        private List<ItemProfileAC> GetItemCollection(IssueInventory issueInventoryDetails, ParamType paramTypeDetails, int companyId)
        {
            try
            {
                List<ItemProfile> itemDetails;
                var itemProfileCollection = new List<ItemProfileAC>();
                switch (paramTypeDetails.ValueEn)
                {
                    case StringConstants.SupplierInventory:
                        var itemSupplierDetails = _itemSupplierContext.FirstOrDefault(x => x.SupplierId == issueInventoryDetails.SupplierId && !x.IsDelete);
                        if (itemSupplierDetails != null)
                        {
                            itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == itemSupplierDetails.CategoryId && !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId).ToList();
                            itemProfileCollection.AddRange(FetchItemCollection(itemDetails));
                        }
                        break;
                    case StringConstants.ItemInventory:
                        var itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == issueInventoryDetails.Barcode && !x.IsDeleted && x.CompanyId == companyId);
                        if (itemProfileDetails != null)
                        {
                            var itemProfileAc = new ItemProfileAC();
                            if (itemProfileDetails.IsParentItem)
                            {
                                itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" + itemProfileDetails.Category.GroupParamType.ValueEn;
                                itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn + " - " + itemProfileDetails.BaseUnit;
                                itemProfileCollection.Add(itemProfileAc);
                            }
                            else
                            {
                                itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Id == itemProfileDetails.ParentItemId && !x.IsDeleted && x.CompanyId == companyId);
                                itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetails);
                                itemProfileAc.ItemProfileId = itemProfileDetails.Id;
                                itemProfileAc.ItemType = itemProfileDetails.Category.BrandParamType.ValueEn + "-" + itemProfileDetails.Category.GroupParamType.ValueEn;
                                itemProfileAc.Unit = itemProfileDetails.SystemParameter.ValueEn + " - " + itemProfileDetails.BaseUnit;
                                itemProfileAc.listOfChildProfileAC = GetSubItemList((int)itemProfileDetails.Id);
                                if (itemProfileAc.listOfChildProfileAC.Count != 0)
                                {
                                    itemProfileAc.HasChildItem = true;
                                }
                                itemProfileCollection.Add(itemProfileAc);
                            }
                        }
                        break;
                    case StringConstants.FullInventory:
                        itemDetails = _itemProfileContext.Fetch(x => !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId).ToList();
                        itemProfileCollection.AddRange(FetchItemCollection(itemDetails));
                        break;
                    case StringConstants.CategoryInventory:
                        itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == issueInventoryDetails.CategoryId && !x.IsDeleted && x.IsParentItem && x.CompanyId == companyId).ToList();
                        itemProfileCollection.AddRange(FetchItemCollection(itemDetails));
                        break;
                }
                return itemProfileCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private List<SubItemProfileAC> GetSubItemList(int id)
        {
            try
            {
                var subItemColletion = new List<SubItemProfileAC>();
                var subItemList = _itemProfileContext.Fetch(x => !x.IsDeleted && !x.IsParentItem && x.ParentItemId == id && x.IsActive).ToList();
                if (subItemList.Count != 0)
                {
                    foreach (var itemProfile in subItemList)
                    {
                        var subItemProfileAc = new SubItemProfileAC();
                        subItemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, SubItemProfileAC>(itemProfile);
                        subItemProfileAc.ItemProfileId = itemProfile.Id;
                        subItemProfileAc.ItemType = itemProfile.Category.BrandParamType.ValueEn + "-" + itemProfile.Category.GroupParamType.ValueEn;
                        subItemProfileAc.Unit = itemProfile.SystemParameter.ValueEn + " - " + itemProfile.BaseUnit;
                        subItemProfileAc.Code = itemProfile.Code;
                        subItemProfileAc.ItemNameEn = itemProfile.ItemNameEn;
                        subItemProfileAc.UnitParamTypeId = itemProfile.UnitParamTypeId;
                        subItemProfileAc.IsIssueInventory = itemProfile.IsIssueInventory;
                        subItemColletion.Add(subItemProfileAc);
                    }
                }
                return subItemColletion;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to update unmatched Item collection.
        /// </summary>
        /// <param name="unmatchedItemCollection"></param>
        /// <param name="issueInventoryDetails"></param>
        private void UpdateUnmatchedItemCollection(List<InventoryUnmatchedItemAc> unmatchedItemCollection, IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetail, UserDetail userDetail)
        {
            try
            {
                foreach (var unmatchedItemDetails in unmatchedItemCollection)
                {
                    var itemUnmatchedDetails = _inventoryUnmatchedContext.FirstOrDefault(x => x.ItemId == unmatchedItemDetails.ItemId && x.IssueInventoryId == unmatchedItemDetails.IssueInventoryId);
                    if (itemUnmatchedDetails != null)
                    {
                        switch (unmatchedItemDetails.ResolvedId)
                        {
                            case 2:
                                itemUnmatchedDetails.IsResolvedGain = true;
                                break;
                            case 4:
                                itemUnmatchedDetails.IsResolvedLoss = true;
                                break;
                            case 3:
                                itemUnmatchedDetails.IsResolvedAdjust = true;
                                break;
                            default:
                                itemUnmatchedDetails.IsResolvedDoNothing = true;
                                break;
                        }

                        itemUnmatchedDetails.ModifiedDateTime = DateTime.UtcNow;

                        if (itemUnmatchedDetails.IsResolvedGain || itemUnmatchedDetails.IsResolvedLoss || itemUnmatchedDetails.IsResolvedAdjust)
                        {
                            if (itemUnmatchedDetails.ItemProfile.IsParentItem)
                            {
                                var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemUnmatchedDetails.ItemId && x.BranchId == issueInventoryDetails.BranchId);
                                if (itemQuantityDetails != null)
                                {
                                    decimal totalCostPrice = (Math.Abs(itemQuantityDetails.ActualQuantity - (int)unmatchedItemDetails.ShelfQuantity)) * itemQuantityDetails.ItemProfile.CostPrice;
                                    itemUnmatchedDetails.SystemQuantity = (int)unmatchedItemDetails.ShelfQuantity;
                                    itemQuantityDetails.ActualQuantity = (int)unmatchedItemDetails.ShelfQuantity;
                                    itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                    _itemQuantityContext.Update(itemQuantityDetails);
                                    _itemQuantityContext.SaveChanges();
                                    GenrateAutomaticSpo(itemQuantityDetails, companyDetail, userDetail);
                                    InsertIntoAccounting(issueInventoryDetails, totalCostPrice, unmatchedItemDetails);
                                }
                            }
                            else
                            {
                                var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemUnmatchedDetails.ItemProfile.ParentItemId && x.BranchId == issueInventoryDetails.BranchId);
                                if (itemQuantityDetails != null)
                                {
                                    decimal totalCostPrice = (Math.Abs(itemQuantityDetails.ActualQuantity - ((int)unmatchedItemDetails.ShelfQuantity * itemQuantityDetails.ItemProfile.BaseUnit))) * itemQuantityDetails.ItemProfile.CostPrice;
                                    itemUnmatchedDetails.SystemQuantity = (int)unmatchedItemDetails.ShelfQuantity * itemQuantityDetails.ItemProfile.BaseUnit;
                                    itemQuantityDetails.ActualQuantity = itemQuantityDetails.ActualQuantity + ((int)unmatchedItemDetails.ShelfQuantity * itemQuantityDetails.ItemProfile.BaseUnit);
                                    itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                    _itemQuantityContext.Update(itemQuantityDetails);
                                    _itemQuantityContext.SaveChanges();

                                    InsertIntoAccounting(issueInventoryDetails, totalCostPrice, unmatchedItemDetails);
                                }
                            }
                        }
                        _inventoryUnmatchedContext.Update(itemUnmatchedDetails);
                        _inventoryUnmatchedContext.SaveChanges();
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


        private IssueInventoryAc GetAllBranchConflictList(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                DateTime startDate = issueInventoryDetails.StartingDate.ToLocalTime().Date;
                var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == issueInventoryDetails.ParamTypeId);
                if (paramTypeDetails != null)
                {
                    IssueInventory inventoryExist;
                    var branchConflictCollection = new List<BranchListAc>();
                    foreach (var branchDetails in issueInventoryDetails.BranchList)
                    {
                        var branchConflictAc = new BranchListAc();
                        var branchInfo = _brachContext.FirstOrDefault(x => x.Id == branchDetails.Id);
                        if (branchInfo != null)
                        {
                            branchConflictAc.Id = branchInfo.Id;
                            branchConflictAc.BranchId = branchInfo.Id;
                            branchConflictAc.CategoryType = paramTypeDetails.ValueEn;
                            branchConflictAc.BranchName = branchInfo.Name;
                            branchConflictAc.IsInventorySelected = true;
                            switch (paramTypeDetails.ValueEn)
                            {

                                case StringConstants.SupplierInventory:
                                    inventoryExist = _issueInventoryContext.Fetch(x => x.SupplierId == issueInventoryDetails.SupplierId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().Where(y => y.StartDate.Date == startDate).LastOrDefault();
                                    if (inventoryExist != null)
                                    {
                                        branchConflictAc.IsAlreadyExist = true;
                                        branchConflictAc.IsInventorySelected = false;
                                        branchConflictAc.Status = StringConstants.CurrentDateInventory;
                                        branchConflictAc.Date = inventoryExist.StartDate.Date;
                                    }
                                    else
                                    {
                                        inventoryExist = _issueInventoryContext.Fetch(x => x.SupplierId == issueInventoryDetails.SupplierId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                        if (inventoryExist != null)
                                        {
                                            branchConflictAc.IsScheduledOn = true;
                                            branchConflictAc.Status = StringConstants.ScheduledOn;
                                            branchConflictAc.Date = inventoryExist.StartDate.Date;
                                        }
                                        else
                                        {
                                            inventoryExist = _issueInventoryContext.Fetch(x => x.SupplierId == issueInventoryDetails.SupplierId && x.BranchId == branchDetails.Id && x.IsActive).ToList().LastOrDefault();
                                            if (inventoryExist != null)
                                            {
                                                branchConflictAc.IsCompletedOn = true;
                                                branchConflictAc.Status = StringConstants.CompletedOn;
                                                branchConflictAc.Date = inventoryExist.StartDate.Date;
                                            }
                                            else
                                            {
                                                branchConflictAc.Date = null;
                                            }

                                        }

                                    }
                                    break;
                                case StringConstants.ItemInventory:
                                    inventoryExist = _issueInventoryContext.Fetch(x => x.Barcode == issueInventoryDetails.Barcode && x.BranchId == branchDetails.Id && !x.IsActive).ToList().Where(y => y.StartDate.Date == startDate).LastOrDefault();
                                    if (inventoryExist != null)
                                    {
                                        branchConflictAc.IsAlreadyExist = true;
                                        branchConflictAc.IsInventorySelected = false;
                                        branchConflictAc.Status = StringConstants.CurrentDateInventory;
                                        branchConflictAc.Date = inventoryExist.StartDate.Date;
                                    }
                                    else
                                    {
                                        inventoryExist = _issueInventoryContext.Fetch(x => x.Barcode == issueInventoryDetails.Barcode && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                        if (inventoryExist != null)
                                        {
                                            branchConflictAc.IsScheduledOn = true;
                                            branchConflictAc.Status = StringConstants.ScheduledOn;
                                            branchConflictAc.Date = inventoryExist.StartDate.Date;
                                        }
                                        else
                                        {
                                            inventoryExist = _issueInventoryContext.Fetch(x => x.Barcode == issueInventoryDetails.Barcode && x.BranchId == branchDetails.Id && x.IsActive).ToList().LastOrDefault();
                                            if (inventoryExist != null)
                                            {
                                                branchConflictAc.IsCompletedOn = true;
                                                branchConflictAc.Status = StringConstants.CompletedOn;
                                                branchConflictAc.Date = inventoryExist.StartDate.Date;
                                            }
                                            else
                                            {
                                                branchConflictAc.Date = null;
                                            }
                                        }
                                    }
                                    break;
                                case StringConstants.FullInventory:
                                    inventoryExist = _issueInventoryContext.Fetch(x => x.ParamTypeId == issueInventoryDetails.ParamTypeId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                    if (inventoryExist != null)
                                    {
                                        branchConflictAc.IsAlreadyExist = true;
                                        branchConflictAc.IsInventorySelected = false;
                                        branchConflictAc.Status = StringConstants.FullInventoryExist;
                                        branchConflictAc.Date = inventoryExist.StartDate.Date;
                                    }
                                    else
                                    {
                                        inventoryExist = _issueInventoryContext.Fetch(x => x.ParamTypeId == issueInventoryDetails.ParamTypeId && x.BranchId == branchDetails.Id && x.IsActive).ToList().LastOrDefault();
                                        if (inventoryExist != null)
                                        {
                                            branchConflictAc.IsCompletedOn = true;
                                            branchConflictAc.Status = StringConstants.CompletedOn;
                                            branchConflictAc.Date = inventoryExist.StartDate.Date;
                                        }
                                        else
                                        {
                                            branchConflictAc.Date = null;
                                        }
                                    }
                                    break;
                                case StringConstants.CategoryInventory:
                                    inventoryExist = _issueInventoryContext.Fetch(x => x.CategoryId == issueInventoryDetails.CategoryId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().Where(y => y.StartDate.Date == startDate).LastOrDefault();
                                    if (inventoryExist != null)
                                    {
                                        branchConflictAc.IsAlreadyExist = true;
                                        branchConflictAc.IsInventorySelected = false;
                                        branchConflictAc.Status = StringConstants.CurrentDateInventory;
                                        branchConflictAc.Date = inventoryExist.StartDate.Date;
                                    }
                                    else
                                    {
                                        inventoryExist = _issueInventoryContext.Fetch(x => x.CategoryId == issueInventoryDetails.CategoryId && x.BranchId == branchDetails.Id && !x.IsActive).ToList().LastOrDefault();
                                        if (inventoryExist != null)
                                        {
                                            branchConflictAc.IsScheduledOn = true;
                                            branchConflictAc.Status = StringConstants.ScheduledOn;
                                            branchConflictAc.Date = inventoryExist.StartDate.Date;
                                        }
                                        else
                                        {
                                            inventoryExist = _issueInventoryContext.Fetch(x => x.CategoryId == issueInventoryDetails.CategoryId && x.BranchId == branchDetails.Id && x.IsActive).ToList().LastOrDefault();
                                            if (inventoryExist != null)
                                            {
                                                branchConflictAc.IsCompletedOn = true;
                                                branchConflictAc.Status = StringConstants.CompletedOn;
                                                branchConflictAc.Date = inventoryExist.StartDate.Date;
                                            }
                                            else
                                            {
                                                branchConflictAc.Date = null;
                                            }
                                        }
                                    }
                                    break;
                            }
                            branchConflictCollection.Add(branchConflictAc);
                        }
                    }
                    issueInventoryDetails.BranchList = branchConflictCollection;
                }
                return issueInventoryDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private decimal ItemQunatityCount(IssueInventoryAc issueInventoryDetails, ParamType paramTypeDetails, int branchId, CompanyDetail companyDetails)
        {
            try
            {
                decimal systemQuantity = 0;
                int itemCount = 0;
                List<ItemProfile> itemDetails;

                switch (paramTypeDetails.ValueEn)
                {
                    case StringConstants.SupplierInventory:
                        var itemSupplierDetails = _itemSupplierContext.FirstOrDefault(x => x.SupplierId == issueInventoryDetails.SupplierId);
                        if (itemSupplierDetails != null)
                        {
                            itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == itemSupplierDetails.CategoryId && !x.IsDeleted && x.IsParentItem && x.CompanyId == companyDetails.Id).ToList();
                            itemCount = itemDetails.Count();
                            foreach (var itemProfile in itemDetails)
                            {
                                ItemProfile profile = itemProfile;
                                ItemQuantity itemQuantityDetails;
                                if (profile.IsParentItem)
                                {
                                    itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == profile.Id && x.BranchId == branchId);
                                    if (itemQuantityDetails != null)
                                    {
                                        systemQuantity = systemQuantity + itemQuantityDetails.ActualQuantity;
                                    }
                                }

                                itemProfile.IsIssueInventory = true;
                                itemProfile.ModifiedDateTime = DateTime.UtcNow;
                                _itemProfileContext.Update(itemProfile);
                                _itemProfileContext.SaveChanges();
                            }
                        }
                        break;
                    case StringConstants.ItemInventory:
                        var itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == issueInventoryDetails.Barcode && !x.IsDeleted && x.CompanyId == companyDetails.Id);
                        if (itemProfileDetails != null)
                        {
                            itemCount = 1;
                            ItemQuantity itemQuantityDetails;
                            if (itemProfileDetails.IsParentItem)
                            {
                                itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.Id && x.BranchId == branchId);
                                if (itemQuantityDetails != null)
                                {
                                    systemQuantity = itemQuantityDetails.ActualQuantity;
                                }
                            }
                            else
                            {
                                itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.ParentItemId && x.BranchId == branchId);
                                if (itemQuantityDetails != null)
                                {
                                    systemQuantity = itemQuantityDetails.ActualQuantity;
                                }
                            }
                            itemProfileDetails.IsIssueInventory = true;
                            itemProfileDetails.ModifiedDateTime = DateTime.UtcNow;
                            _itemProfileContext.Update(itemProfileDetails);
                            _itemProfileContext.SaveChanges();
                        }
                        break;
                    case StringConstants.FullInventory:
                        itemDetails = _itemProfileContext.Fetch(x => !x.IsDeleted && x.IsParentItem && x.CompanyId == companyDetails.Id).ToList();
                        itemCount = itemDetails.Count();
                        foreach (var itemProfile in itemDetails)
                        {
                            ItemProfile profile = itemProfile;
                            ItemQuantity itemQuantityDetails;
                            if (profile.IsParentItem)
                            {
                                itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == profile.Id && x.BranchId == branchId);
                                if (itemQuantityDetails != null)
                                {
                                    systemQuantity = systemQuantity + itemQuantityDetails.ActualQuantity;
                                }
                            }
                            itemProfile.IsIssueInventory = true;
                            itemProfile.ModifiedDateTime = DateTime.UtcNow;
                            _itemProfileContext.Update(itemProfile);
                            _itemProfileContext.SaveChanges();
                        }
                        break;
                    case StringConstants.CategoryInventory:

                        itemDetails = _itemProfileContext.Fetch(x => x.CategoryId == issueInventoryDetails.CategoryId && !x.IsDeleted && x.IsParentItem && x.CompanyId == companyDetails.Id).ToList();
                        itemCount = itemDetails.Count();
                        foreach (var itemProfile in itemDetails)
                        {
                            ItemProfile profile = itemProfile;
                            ItemQuantity itemQuantityDetails;
                            if (profile.IsParentItem)
                            {
                                itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == profile.Id && x.BranchId == branchId);
                                if (itemQuantityDetails != null)
                                {
                                    systemQuantity = systemQuantity + itemQuantityDetails.ActualQuantity;
                                }
                            }
                            itemProfile.IsIssueInventory = true;
                            itemProfile.ModifiedDateTime = DateTime.UtcNow;
                            _itemProfileContext.Update(itemProfile);
                            _itemProfileContext.SaveChanges();
                        }
                        break;
                }
                return systemQuantity;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        #endregion

    }
}
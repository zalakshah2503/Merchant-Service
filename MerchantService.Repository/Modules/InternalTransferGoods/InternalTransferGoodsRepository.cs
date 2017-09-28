using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.InventoryTransfer;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.InternalTransferGoods;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.SystemParameter;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;

namespace MerchantService.Repository.Modules.InternalTransferGoods
{
    public class InternalTransferGoodsRepository : IInternalTransferGoodsRepository
    {
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<BranchDetail> _branchContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailsContext;
        private readonly IDataRepository<ParentRecord> _parentRecordContext;
        private readonly IDataRepository<WorkFlowLog> _workFLowLogContext;
        private readonly IWorkFlowDetailsRepository _workFlowDetailsRepository;
        private readonly IDataRepository<InventoryTransfer> _inventoryTransferContext;
        private readonly IDataRepository<ItemInventoryTransfer> _itemInventoryContext;
        private readonly IAccountingRepository _iAccountRepository;
        private readonly IItemRepository _itemRepository;
        public InternalTransferGoodsRepository(IErrorLog errorLog, IDataRepository<BranchDetail> branchContext, IDataRepository<ParamType> paramTypeContext, IDataRepository<ItemProfile> itemProfileContext, IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<WorkFlowDetail> workFlowDetailsContext, IDataRepository<ParentRecord> parentRecordContext, IDataRepository<WorkFlowLog> workFLowLogContext, IWorkFlowDetailsRepository workFlowDetailsRepository, IDataRepository<InventoryTransfer> inventoryTransferContext, IDataRepository<ItemInventoryTransfer> itemInventoryContext, IAccountingRepository iAccountRepository, IItemRepository itemRepository)
        {
            _errorLog = errorLog;
            _branchContext = branchContext;
            _paramTypeContext = paramTypeContext;
            _itemProfileContext = itemProfileContext;
            _itemQuantityContext = itemQuantityContext;
            _workFlowDetailsContext = workFlowDetailsContext;
            _parentRecordContext = parentRecordContext;
            _workFLowLogContext = workFLowLogContext;
            _workFlowDetailsRepository = workFlowDetailsRepository;
            _inventoryTransferContext = inventoryTransferContext;
            _itemInventoryContext = itemInventoryContext;
            _iAccountRepository = iAccountRepository;
            _itemRepository = itemRepository;
        }
        public void Dispose()
        {
            _branchContext.Dispose();
            _paramTypeContext.Dispose();
            _itemProfileContext.Dispose();
            _itemQuantityContext.Dispose();
            _workFLowLogContext.Dispose();
            _workFlowDetailsContext.Dispose();
            _parentRecordContext.Dispose();
            _inventoryTransferContext.Dispose();
            _itemInventoryContext.Dispose();
        }


        /// <summary>
        /// this method is used to get all branch list.
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<BranchDetailAC> GetAllBranchList(int? branchId, int? companyId)
        {
            try
            {
                var branchCollection = new List<BranchDetailAC>();
                var brachDetailLsit = _branchContext.Fetch(x => x.Id != branchId && x.CompanyId == companyId && !x.IsDelete).ToList();
                if (brachDetailLsit.Count() != 0)
                {

                    foreach (var branch in brachDetailLsit)
                    {
                        var branchAc = new BranchDetailAC();
                        branchAc = ApplicationClassHelper.ConvertType<BranchDetail, BranchDetailAC>(branch);
                        branchAc.BranchId = branch.Id;

                        branchCollection.Add(branchAc);
                    }
                }

                return branchCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get all request type.
        /// </summary>
        /// <param name="paramId"></param>
        /// <returns></returns>
        public List<ParamTypeAc> GetAllRequestType(int paramId)
        {
            var inventoryTypeCollection = new List<ParamTypeAc>();
            foreach (var inventoryType in _paramTypeContext.Fetch(x => x.ParamId == paramId).ToList())
            {
                ParamTypeAc inventoryTypeAc = ApplicationClassHelper.ConvertType<ParamType, ParamTypeAc>(inventoryType);
                inventoryTypeAc.ParamTypeId = inventoryType.Id;
                inventoryTypeCollection.Add(inventoryTypeAc);
            }
            return inventoryTypeCollection;
        }

        /// <summary>
        /// this method is used to get all item list by branch id.
        /// </summary>
        /// <param name="branchId"></param>
        /// <returns></returns>
        public List<ItemProfileAC> GetItemListById(int branchId)
        {
            try
            {
                var itemQuantityDetails = _itemQuantityContext.Fetch(x => x.BranchId == branchId).ToList().GroupBy(x => x.ItemId).ToList().OrderByDescending(y => y.Key);
                var itemProfileCollection = new List<ItemProfileAC>();
                foreach (var itemQuantity in itemQuantityDetails)
                {
                    var itemProfileAc = new ItemProfileAC();
                    var itemProfile = _itemProfileContext.FirstOrDefault(x => x.Id == itemQuantity.Key && x.IsActive);
                    if (itemProfile != null)
                    {
                        itemProfileAc = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfile);
                        itemProfileAc.ItemProfileId = itemProfile.Id;
                        itemProfileAc.ItemType = itemProfile.Category.BrandParamType.ValueEn + "-" + itemProfile.Category.GroupParamType.ValueEn;
                        itemProfileAc.Unit = itemProfile.SystemParameter.ValueEn;
                        itemProfileAc.listOfChildProfileAC = GetSubItemList(itemProfile.Id);
                        if (itemProfileAc.listOfChildProfileAC.Count != 0)
                        {
                            itemProfileAc.HasChildItem = true;
                        }
                        itemProfileCollection.Add(itemProfileAc);
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
        /// this method is used to get the item details by item barcode
        /// </summary>
        /// <param name="barcode"></param>
        /// <param name="targetBranchId"></param>
        /// <param name="requestTypeId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        public ItemInventoryTransferAc GetItemDetailsByItemBarcode(string barcode, int targetBranchId, int requestTypeId, int? branchId)
        {
            try
            {
                var itemInventoryTransferDetails = new ItemInventoryTransferAc();
                var itemDetails = _itemProfileContext.FirstOrDefault(x => x.Barcode == barcode && x.IsActive);
                if (itemDetails != null)
                {
                    var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == requestTypeId);
                    if (paramTypeDetails != null)
                    {
                        ItemQuantity targetBranchDetails;
                        ItemQuantity currentBranchDetails;
                        decimal targetBranchActaulQuantity;
                        decimal currentBranchActualQuantity;

                        if (itemDetails.IsParentItem)
                        {
                            currentBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemDetails.Id && x.BranchId == branchId);
                            targetBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemDetails.Id && x.BranchId == targetBranchId);
                            currentBranchActualQuantity = (decimal)(currentBranchDetails.ActualQuantity);
                            targetBranchActaulQuantity = (decimal)(targetBranchDetails.ActualQuantity);
                            itemInventoryTransferDetails.ParentItemId = (int)itemDetails.Id;
                        }
                        else
                        {
                            currentBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemDetails.ParentItemId && x.BranchId == branchId);
                            targetBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemDetails.ParentItemId && x.BranchId == targetBranchId);
                            currentBranchActualQuantity = (decimal)(currentBranchDetails.ActualQuantity);
                            targetBranchActaulQuantity = (decimal)(targetBranchDetails.ActualQuantity);
                            itemInventoryTransferDetails.ParentItemId = (int)itemDetails.ParentItemId;
                        }

                        switch (paramTypeDetails.ValueEn)
                        {
                            case StringConstants.RequestInventory:
                                if (targetBranchDetails == null)
                                {
                                    itemInventoryTransferDetails.IsQuantityRequried = true;
                                    return itemInventoryTransferDetails;
                                }
                                else
                                {
                                    itemInventoryTransferDetails.ItemId = itemDetails.Id;
                                    itemInventoryTransferDetails.Unit = itemDetails.SystemParameter.ValueEn;
                                    itemInventoryTransferDetails.ItemName = itemDetails.ItemNameEn;
                                    itemInventoryTransferDetails.Flavour = itemDetails.FlavourEn;
                                    itemInventoryTransferDetails.Barcode = itemDetails.Barcode;
                                    itemInventoryTransferDetails.BaseUnitCount = itemDetails.BaseUnit;
                                    itemInventoryTransferDetails.IsParentItem = itemDetails.IsParentItem;
                                    if (currentBranchDetails != null)
                                        itemInventoryTransferDetails.CurrentBranchQuantity = (int)currentBranchActualQuantity;
                                    itemInventoryTransferDetails.CurrentBranchQunatitytoolTip = (int)Math.Floor(currentBranchActualQuantity / itemDetails.BaseUnit);
                                    if (targetBranchDetails.ActualQuantity == 0)
                                    {
                                        itemInventoryTransferDetails.IsQuantityRequried = true;
                                        return itemInventoryTransferDetails;
                                    }
                                    else
                                    {
                                        itemInventoryTransferDetails.TargetBranchQuantity = (int)targetBranchActaulQuantity;
                                        itemInventoryTransferDetails.TargetBranchQuantityToolTip = (int)Math.Floor(targetBranchActaulQuantity / itemDetails.BaseUnit);
                                        itemInventoryTransferDetails.MinimumQunatity = currentBranchDetails.MaxQuantity;
                                        itemInventoryTransferDetails.SystemQuantity = (int)targetBranchActaulQuantity;
                                        itemInventoryTransferDetails.UpdateSystemQunatity = (int)targetBranchActaulQuantity;
                                    }
                                }
                                break;
                            case StringConstants.SendInventory:
                                itemInventoryTransferDetails.ItemId = itemDetails.Id;
                                itemInventoryTransferDetails.Unit = itemDetails.SystemParameter.ValueEn;
                                itemInventoryTransferDetails.ItemName = itemDetails.ItemNameEn;
                                itemInventoryTransferDetails.Flavour = itemDetails.FlavourEn;
                                itemInventoryTransferDetails.Barcode = itemDetails.Barcode;
                                itemInventoryTransferDetails.BaseUnitCount = itemDetails.BaseUnit;
                                itemInventoryTransferDetails.IsSendInventory = true;
                                itemInventoryTransferDetails.IsParentItem = itemDetails.IsParentItem;
                                if (currentBranchDetails != null)
                                    if (currentBranchDetails.ActualQuantity == 0)
                                    {
                                        itemInventoryTransferDetails.IsQuantityRequried = true;
                                        return itemInventoryTransferDetails;
                                    }
                                    else
                                    {
                                        itemInventoryTransferDetails.CurrentBranchQuantity = (int)currentBranchActualQuantity;
                                        itemInventoryTransferDetails.MinimumQunatity = currentBranchDetails.MinQuantity;
                                        itemInventoryTransferDetails.CurrentBranchQunatitytoolTip = (int)Math.Floor(currentBranchActualQuantity / itemDetails.BaseUnit);
                                        itemInventoryTransferDetails.SystemQuantity = (int)currentBranchActualQuantity;
                                        itemInventoryTransferDetails.UpdateSystemQunatity = (int)currentBranchActualQuantity;
                                    }

                                if (targetBranchDetails != null)
                                    itemInventoryTransferDetails.TargetBranchQuantity = (int)targetBranchActaulQuantity;
                                itemInventoryTransferDetails.TargetBranchQuantityToolTip = (int)Math.Floor(targetBranchActaulQuantity / itemDetails.BaseUnit);
                                break;
                        }
                    }
                    return itemInventoryTransferDetails;
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
        /// this method is used to submit transfer request.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public string SubmitInventoryTranserRequest(InventoryTransferAc transferGoodsDetails, UserDetail userDetails, CompanyDetail companyDetails)
        {
            try
            {
                string transferInventoryNumber = "";
                transferInventoryNumber = GetTheTransferInventoryNumber();
                var workflowDetails = _workFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.InternalTransferGoods, StringConstants.InitiateTransferGoodRequest, userDetails, companyDetails, transferGoodsDetails, transferGoodsDetails.InitiationComment, transferGoodsDetails);
                if (workflowDetails != null)
                {
                    var workFlowLog = (WorkFlowLog)workflowDetails.Item1;
                    var workflowDetailsInfo = (WorkFlowDetail)workflowDetails.Item2;
                    if (workFlowLog.Id != 0)
                    {
                        var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == transferGoodsDetails.RequestTypeId);
                        InventoryTransfer inventoryTransferDetails = null;
                        if (paramTypeDetails != null)
                        {
                            switch (paramTypeDetails.ValueEn)
                            {
                                case StringConstants.SendInventory:
                                    inventoryTransferDetails = new InventoryTransfer
                                    {
                                        CreatedDateTime = DateTime.UtcNow,
                                        RecordId = workFlowLog.RecordId,
                                        CurrentBranchId = (int)userDetails.BranchId,
                                        TargetBranchId = transferGoodsDetails.TargetBranchId,
                                        RequestTypeId = transferGoodsDetails.RequestTypeId,
                                        RequestNo = transferInventoryNumber,
                                        DueDate = transferGoodsDetails.DueDate.ToLocalTime(),
                                        IsInitiateTransferRequest = true,
                                        InitiateBranchId = transferGoodsDetails.TargetBranchId
                                    };
                                    break;
                                case StringConstants.RequestInventory:
                                    inventoryTransferDetails = new InventoryTransfer
                                    {
                                        CreatedDateTime = DateTime.UtcNow,
                                        RecordId = workFlowLog.RecordId,
                                        CurrentBranchId = (int)userDetails.BranchId,
                                        TargetBranchId = transferGoodsDetails.TargetBranchId,
                                        RequestTypeId = transferGoodsDetails.RequestTypeId,
                                        RequestNo = transferInventoryNumber,
                                        DueDate = transferGoodsDetails.DueDate.ToLocalTime(),
                                        IsInitiateTransferRequest = true,
                                        InitiateBranchId = (int)userDetails.BranchId
                                    };
                                    break;
                            }
                        }

                        if (workflowDetailsInfo.NextActivity.IsClosed)
                        {
                            inventoryTransferDetails.IsProcessing = false;
                            inventoryTransferDetails.IsReceiving = true;
                            inventoryTransferDetails.IsReceived = true;
                            inventoryTransferDetails.IsReceivingInProcess = true;
                            inventoryTransferDetails.IsInitiateTransferRequest = false;
                            inventoryTransferDetails.DueDate = DateTime.UtcNow;
                        }
                        else
                        {
                            inventoryTransferDetails.IsProcessing = true;
                        }

                        _inventoryTransferContext.Add(inventoryTransferDetails);
                        _inventoryTransferContext.SaveChanges();

                        if (inventoryTransferDetails.Id != 0)
                        {
                            foreach (var itemDetails in transferGoodsDetails.ItemInventoryTransfer)
                            {
                                var itemTransferDetails = new ItemInventoryTransfer
                                {
                                    CreatedDateTime = DateTime.UtcNow,
                                    InventoryTransferId = inventoryTransferDetails.Id,
                                    ItemId = itemDetails.ItemId,
                                    ReceivingQuantity = itemDetails.ReceivingQuantity,
                                    RequestQuantity = itemDetails.RequestQuantity,
                                    ResolvedId = 1,
                                    IsWarningMessage = itemDetails.IsWarningMesssage
                                };
                                _itemInventoryContext.Add(itemTransferDetails);
                                _itemInventoryContext.SaveChanges();
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
        /// this method is used to get all inventory transfer list.
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="isAllowToAccessAllBranch"></param>
        /// <returns></returns>
        public IOrderedEnumerable<InventoryTransferAc> GetAllInventoryTransferList(int? branchId, bool isAllowToAccessAllBranch)
        {
            try
            {
                var inventoryTransferCollection = new List<InventoryTransferAc>();
                if (isAllowToAccessAllBranch)
                {
                    foreach (var allBranchInventoryCollection in _inventoryTransferContext.GetAll().ToList())
                    {
                        var invnetoryTransferDetails = new InventoryTransferAc();
                        invnetoryTransferDetails = ApplicationClassHelper.ConvertType<InventoryTransfer, InventoryTransferAc>(allBranchInventoryCollection);
                        invnetoryTransferDetails.InventoryTransferId = allBranchInventoryCollection.Id;
                        invnetoryTransferDetails.CurrentBranchName = allBranchInventoryCollection.CurrentBranchDetail.Name;
                        invnetoryTransferDetails.TargetBranchName = allBranchInventoryCollection.TargetBranch.Name;
                        invnetoryTransferDetails.RequestType = allBranchInventoryCollection.RequestDetails.ValueEn;
                        invnetoryTransferDetails.IssueDate =
                            allBranchInventoryCollection.CreatedDateTime.ToString("dd-MM-yyyy");
                        invnetoryTransferDetails.IssuedDateTime = allBranchInventoryCollection.CreatedDateTime;
                        invnetoryTransferDetails.DueDate = allBranchInventoryCollection.DueDate.Date;
                        var parentRecredDetails =
                            _parentRecordContext.FirstOrDefault(x => x.Id == allBranchInventoryCollection.RecordId);
                        if (parentRecredDetails != null)
                        {
                            var workFlowStatusDetails =
                                _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id).ToList().Last();
                            if (workFlowStatusDetails != null)
                            {
                                invnetoryTransferDetails.WorkFlowStatus = workFlowStatusDetails.Action;
                            }
                        }
                        inventoryTransferCollection.Add(invnetoryTransferDetails);
                    }
                }
                else
                {
                    foreach (var currentBranchInventoryCollction in _inventoryTransferContext.Fetch(x => x.CurrentBranchId == branchId).ToList())
                    {
                        var invnetoryTransferDetails = new InventoryTransferAc();
                        invnetoryTransferDetails =
                            ApplicationClassHelper.ConvertType<InventoryTransfer, InventoryTransferAc>(
                                currentBranchInventoryCollction);
                        invnetoryTransferDetails.InventoryTransferId = currentBranchInventoryCollction.Id;
                        invnetoryTransferDetails.CurrentBranchName = currentBranchInventoryCollction.CurrentBranchDetail.Name;
                        invnetoryTransferDetails.TargetBranchName = currentBranchInventoryCollction.TargetBranch.Name;
                        invnetoryTransferDetails.RequestType = currentBranchInventoryCollction.RequestDetails.ValueEn;
                        invnetoryTransferDetails.IssueDate =
                            currentBranchInventoryCollction.CreatedDateTime.ToString("dd-MM-yyyy");
                        invnetoryTransferDetails.IssuedDateTime = currentBranchInventoryCollction.CreatedDateTime;
                        invnetoryTransferDetails.DueDate = currentBranchInventoryCollction.DueDate.Date;
                        var parentRecredDetails =
                            _parentRecordContext.FirstOrDefault(x => x.Id == currentBranchInventoryCollction.RecordId);
                        if (parentRecredDetails != null)
                        {
                            var workFlowStatusDetails =
                                _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id).ToList().Last();
                            if (workFlowStatusDetails != null)
                            {
                                invnetoryTransferDetails.WorkFlowStatus = workFlowStatusDetails.Action;
                            }
                        }
                        inventoryTransferCollection.Add(invnetoryTransferDetails);
                    }

                    foreach (
                        var targetBranchInventoryCollction in _inventoryTransferContext.Fetch(x => x.TargetBranchId == branchId).ToList())
                    {
                        var invnetoryTransferDetails = new InventoryTransferAc();
                        invnetoryTransferDetails =
                            ApplicationClassHelper.ConvertType<InventoryTransfer, InventoryTransferAc>(
                                targetBranchInventoryCollction);
                        invnetoryTransferDetails.InventoryTransferId = targetBranchInventoryCollction.Id;
                        invnetoryTransferDetails.CurrentBranchName = targetBranchInventoryCollction.CurrentBranchDetail.Name;
                        invnetoryTransferDetails.TargetBranchName = targetBranchInventoryCollction.TargetBranch.Name;
                        invnetoryTransferDetails.RequestType = targetBranchInventoryCollction.RequestDetails.ValueEn;
                        invnetoryTransferDetails.IssueDate = targetBranchInventoryCollction.CreatedDateTime.ToString("dd-MM-yyyy");
                        invnetoryTransferDetails.IssuedDateTime = targetBranchInventoryCollction.CreatedDateTime;
                        invnetoryTransferDetails.IsTragetedBranch = true;
                        var parentRecredDetails =
                            _parentRecordContext.FirstOrDefault(x => x.Id == targetBranchInventoryCollction.RecordId);
                        if (parentRecredDetails != null)
                        {
                            var workFlowStatusDetails =
                                _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id).ToList().Last();
                            if (workFlowStatusDetails != null)
                            {
                                invnetoryTransferDetails.WorkFlowStatus = workFlowStatusDetails.Action;
                            }
                        }
                        inventoryTransferCollection.Add(invnetoryTransferDetails);
                    }
                }
                return inventoryTransferCollection.OrderByDescending(x => x.InventoryTransferId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to view the tranfser details by Id.
        /// </summary>
        /// <param name="inventoryTransferId"></param>
        /// <param name="userDetails"></param>
        /// <param name="allowToReslovedUnmatchedItem"></param>
        /// <param name="isAllowToAccessAllBranch"></param>
        /// <param name="isAllowToRecieveInternalTransferGoods"></param>
        /// <returns></returns>
        public InventoryTransferAc ViewInternalTransferGoodDetailsById(int inventoryTransferId, UserDetail userDetails, bool allowToReslovedUnmatchedItem, bool isAllowToAccessAllBranch, bool isAllowToRecieveInternalTransferGoods)
        {
            try
            {
                var inventoryTransferDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == inventoryTransferId);
                var transferInventoryAc = new InventoryTransferAc();
                if (inventoryTransferDetails != null)
                {

                    transferInventoryAc = ApplicationClassHelper.ConvertType<InventoryTransfer, InventoryTransferAc>(inventoryTransferDetails);
                    transferInventoryAc.InventoryTransferId = inventoryTransferDetails.Id;
                    transferInventoryAc.CurrentBranchName = inventoryTransferDetails.CurrentBranchDetail.Name;
                    transferInventoryAc.TargetBranchName = inventoryTransferDetails.TargetBranch.Name;
                    transferInventoryAc.RequestType = inventoryTransferDetails.RequestDetails.ValueEn;
                    transferInventoryAc.IssueDate = inventoryTransferDetails.CreatedDateTime.ToString("dd-MM-yyyy");
                    transferInventoryAc.DueDate = inventoryTransferDetails.DueDate.Date;
                    transferInventoryAc.IsReceiveQuantityDisabled = true;
                    transferInventoryAc.IsRequestQuantityDisabled = true;
                    var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == inventoryTransferDetails.RequestTypeId);
                    if (paramTypeDetails != null)
                    {
                        switch (paramTypeDetails.ValueEn)
                        {
                            case StringConstants.SendInventory:
                                transferInventoryAc.IsSendRequest = true;
                                break;
                            case StringConstants.RequestInventory:
                                transferInventoryAc.IsSendRequest = false;
                                break;

                        }
                    }
                    var itemInventoryCollection = new List<ItemInventoryTransferAc>();
                    foreach (var itemInventory in _itemInventoryContext.Fetch(x => x.InventoryTransferId == inventoryTransferDetails.Id).ToList())
                    {
                        var itemInventoryTransferDetails = new ItemInventoryTransferAc();
                        itemInventoryTransferDetails = ApplicationClassHelper.ConvertType<ItemInventoryTransfer, ItemInventoryTransferAc>(
                                itemInventory);
                        itemInventoryTransferDetails.ItemInventoryTransferId = itemInventory.Id;
                        ItemQuantity targetBranchDetails;
                        ItemQuantity currentBranchDetails;
                        decimal targetBranchActaulQuantity;
                        decimal currentBranchActualQuantity;
                        if (itemInventory.ItemProfile.IsParentItem)
                        {
                            currentBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemInventory.ItemProfile.Id && x.BranchId == inventoryTransferDetails.CurrentBranchId);
                            targetBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemInventory.ItemProfile.Id && x.BranchId == inventoryTransferDetails.TargetBranchId);
                            currentBranchActualQuantity = (decimal)(currentBranchDetails.ActualQuantity);
                            targetBranchActaulQuantity = (decimal)(targetBranchDetails.ActualQuantity);
                        }
                        else
                        {
                            currentBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemInventory.ItemProfile.ParentItemId && x.BranchId == inventoryTransferDetails.CurrentBranchId);
                            targetBranchDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemInventory.ItemProfile.ParentItemId && x.BranchId == inventoryTransferDetails.TargetBranchId);
                            currentBranchActualQuantity = (decimal)(currentBranchDetails.ActualQuantity);
                            targetBranchActaulQuantity = (decimal)(targetBranchDetails.ActualQuantity);
                        }
                        itemInventoryTransferDetails.ItemId = itemInventory.ItemId;
                        itemInventoryTransferDetails.Unit = itemInventory.ItemProfile.SystemParameter.ValueEn;
                        itemInventoryTransferDetails.ItemName = itemInventory.ItemProfile.ItemNameEn;
                        itemInventoryTransferDetails.Flavour = itemInventory.ItemProfile.FlavourEn;
                        itemInventoryTransferDetails.Barcode = itemInventory.ItemProfile.Barcode;
                        itemInventoryTransferDetails.BaseUnitCount = itemInventory.ItemProfile.BaseUnit;
                        itemInventoryTransferDetails.IsWarningMesssage = itemInventory.IsWarningMessage;
                        if (currentBranchDetails != null)
                            itemInventoryTransferDetails.CurrentBranchQuantity = (int)currentBranchActualQuantity;
                        itemInventoryTransferDetails.CurrentBranchQunatitytoolTip = (int)Math.Ceiling(currentBranchActualQuantity / itemInventory.ItemProfile.BaseUnit);
                        itemInventoryTransferDetails.OldRequestQuantity = itemInventory.RequestQuantity;
                        if (transferInventoryAc.IsSendRequest)
                        {
                            itemInventoryTransferDetails.MinimumQunatity = currentBranchDetails.MinQuantity;
                            itemInventoryTransferDetails.SystemQuantity = (int)currentBranchActualQuantity;
                            itemInventoryTransferDetails.IsSendInventory = true;
                            itemInventoryTransferDetails.UpdateSystemQunatity = (int)currentBranchActualQuantity;
                        }
                        else
                        {
                            itemInventoryTransferDetails.MinimumQunatity = currentBranchDetails.MaxQuantity;
                            itemInventoryTransferDetails.SystemQuantity = (int)targetBranchActaulQuantity;
                            itemInventoryTransferDetails.UpdateSystemQunatity = (int)targetBranchActaulQuantity;
                        }
                        if (targetBranchDetails != null)
                            itemInventoryTransferDetails.TargetBranchQuantity = (int)targetBranchActaulQuantity;
                        itemInventoryTransferDetails.TargetBranchQuantityToolTip = (int)Math.Ceiling(targetBranchActaulQuantity / itemInventory.ItemProfile.BaseUnit);
                        itemInventoryTransferDetails.ResolvedId = itemInventory.ResolvedId;
                        itemInventoryTransferDetails.IsReceivedItem = true;
                        itemInventoryCollection.Add(itemInventoryTransferDetails);
                    }
                    transferInventoryAc.ItemInventoryTransfer = itemInventoryCollection;

                    if (inventoryTransferDetails.IsReject)
                    {
                        var currentworkFlowDetails = _workFlowDetailsRepository.ViewRejectWorkFlowDetailsById((int)inventoryTransferDetails.RecordId, userDetails);
                        if (currentworkFlowDetails != null)
                        {
                            if (currentworkFlowDetails.IsAllowOtherBranchUser && inventoryTransferDetails.TargetBranchId == userDetails.BranchId)
                            {
                                transferInventoryAc.IsRejectedRequest = true;
                                transferInventoryAc.IsTragetedBranch = true;
                                transferInventoryAc.IsComment = true;
                            }
                            else
                            {
                                if (isAllowToAccessAllBranch)
                                {
                                    transferInventoryAc.IsRejectedRequest = true;
                                    transferInventoryAc.IsTragetedBranch = true;
                                    transferInventoryAc.IsComment = true;
                                    if (inventoryTransferDetails.IsReceivingInProcess)
                                    {
                                        transferInventoryAc.IsAllowToEditQunatity = true;
                                        transferInventoryAc.IsReceiveQuantityDisabled = false;
                                        transferInventoryAc.IsRequestQuantityDisabled = true;
                                    }
                                    else
                                    {
                                        transferInventoryAc.IsAllowToEditQunatity = false;
                                        transferInventoryAc.IsReceiveQuantityDisabled = true;
                                        transferInventoryAc.IsRequestQuantityDisabled = false;
                                    }

                                    if (allowToReslovedUnmatchedItem)
                                    {
                                        transferInventoryAc.IsRecoveItem = true;
                                    }
                                }
                                else
                                {
                                    if (inventoryTransferDetails.IsInitiateTransferRequest)
                                    {
                                        if (inventoryTransferDetails.CurrentBranchId == userDetails.BranchId)
                                        {
                                            transferInventoryAc.IsRejectedRequest = true;
                                            transferInventoryAc.IsTragetedBranch = true;
                                            transferInventoryAc.IsReceiveQuantityDisabled = true;
                                            transferInventoryAc.IsRequestQuantityDisabled = false;
                                            transferInventoryAc.IsComment = true;
                                        }
                                    }
                                    else
                                    {
                                        if (inventoryTransferDetails.IsReceivingInProcess && inventoryTransferDetails.InitiateBranchId == userDetails.BranchId)
                                        {
                                            transferInventoryAc.IsRejectedRequest = true;
                                            transferInventoryAc.IsTragetedBranch = true;
                                            transferInventoryAc.IsReceiveQuantityDisabled = false;
                                            transferInventoryAc.IsRequestQuantityDisabled = true;
                                            transferInventoryAc.IsComment = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        var currentworkFlowDetails = _workFlowDetailsRepository.ViewWorkFlowDetailsById((int)inventoryTransferDetails.RecordId, userDetails);
                        if (currentworkFlowDetails != null)
                        {
                            if (currentworkFlowDetails.IsAllowOtherBranchUser)
                            {
                                if (inventoryTransferDetails.TargetBranchId == userDetails.BranchId)
                                {
                                    transferInventoryAc.IsAllowApprovalButton = currentworkFlowDetails.IsApproval;
                                    transferInventoryAc.IsAllowReViewButton = currentworkFlowDetails.IsReview;
                                    if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                    {
                                        transferInventoryAc.IsComment = true;
                                    }
                                    transferInventoryAc.IsTragetedBranch = true;
                                }
                            }
                            else
                            {
                                if (isAllowToAccessAllBranch)
                                {
                                    transferInventoryAc.IsAllowApprovalButton = currentworkFlowDetails.IsApproval;
                                    transferInventoryAc.IsAllowReViewButton = currentworkFlowDetails.IsReview;
                                    transferInventoryAc.IsTragetedBranch = true;
                                    if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                    {
                                        transferInventoryAc.IsComment = true;
                                    }
                                    if (inventoryTransferDetails.IsReceivingInProcess)
                                    {
                                        transferInventoryAc.IsRequestQuantityDisabled = true;
                                        transferInventoryAc.IsReceiveQuantityDisabled = false;
                                    }
                                    else
                                    {
                                        transferInventoryAc.IsReceiveQuantityDisabled = true;
                                        transferInventoryAc.IsRequestQuantityDisabled = false;
                                    }
                                    if (allowToReslovedUnmatchedItem)
                                    {
                                        if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                        {
                                            transferInventoryAc.IsRecoveItem = true;
                                        }
                                        else
                                        {
                                            transferInventoryAc.IsRecoveItem = false;
                                        }
                                    }
                                }
                                else
                                {
                                    if (inventoryTransferDetails.IsReceivingInProcess)
                                    {
                                        if (isAllowToRecieveInternalTransferGoods && inventoryTransferDetails.InitiateBranchId == userDetails.BranchId)
                                        {
                                            transferInventoryAc.IsReceiveQuantityDisabled = false;
                                            transferInventoryAc.IsTragetedBranch = true;
                                            transferInventoryAc.IsComment = true;
                                        }
                                    }
                                    else
                                    {
                                        if (inventoryTransferDetails.IsReceiving)
                                        {
                                            if (inventoryTransferDetails.InitiateBranchId == userDetails.BranchId)
                                            {
                                                transferInventoryAc.IsAllowApprovalButton = currentworkFlowDetails.IsApproval;
                                                transferInventoryAc.IsAllowReViewButton = currentworkFlowDetails.IsReview;
                                                if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                                {
                                                    transferInventoryAc.IsComment = true;
                                                }
                                                transferInventoryAc.IsTragetedBranch = true;
                                                if (allowToReslovedUnmatchedItem)
                                                {
                                                    if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                                    {
                                                        transferInventoryAc.IsRecoveItem = true;
                                                    }
                                                    else
                                                    {
                                                        transferInventoryAc.IsRecoveItem = false;
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (inventoryTransferDetails.CurrentBranchId == userDetails.BranchId)
                                            {
                                                transferInventoryAc.IsAllowApprovalButton = currentworkFlowDetails.IsApproval;
                                                transferInventoryAc.IsAllowReViewButton = currentworkFlowDetails.IsReview;
                                                transferInventoryAc.IsTragetedBranch = true;
                                                if (currentworkFlowDetails.IsApproval || currentworkFlowDetails.IsReview)
                                                {
                                                    transferInventoryAc.IsComment = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (isAllowToRecieveInternalTransferGoods && inventoryTransferDetails.IsReceivingInProcess && inventoryTransferDetails.InitiateBranchId == userDetails.BranchId)
                            {
                                transferInventoryAc.IsReceiveQuantityDisabled = false;
                                transferInventoryAc.IsTragetedBranch = true;
                                transferInventoryAc.IsComment = true;
                            }
                        }
                    }
                    transferInventoryAc.WorkFlowAction = _workFlowDetailsRepository.GetAllWorkFlowActionList((int)inventoryTransferDetails.RecordId).OrderByDescending(x => x.WorkFlowActionId);
                }
                return transferInventoryAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to either approve or reject the transfer request.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <param name="isAllowUnmatchedItemRecover"></param>
        /// <returns></returns>
        public string TransferInventoryApprovalById(InventoryTransferAc transferGoodsDetails, UserDetail userDetails,
            CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover)
        {
            try
            {
                if (transferGoodsDetails.IsStatus)
                {
                    var workflowDetails = _workFlowDetailsRepository.GetApprovalActionWorkFLow((int)transferGoodsDetails.RecordId, StringConstants.ApprovAction, transferGoodsDetails.InitiationComment, userDetails, transferGoodsDetails.IsStatus);

                    if (workflowDetails != null && workflowDetails.Id != 0)
                    {
                        var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);
                        var inventoryTransferDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == transferGoodsDetails.InventoryTransferId);

                        if (inventoryTransferDetails != null)
                        {
                            if (workFlowInfo.NextActivity.IsClosed)
                            {
                                if (inventoryTransferDetails.IsReceiving)
                                {
                                    inventoryTransferDetails.IsProcessing = false;
                                    inventoryTransferDetails.IsReceiving = false;
                                    inventoryTransferDetails.IsActive = true;
                                    inventoryTransferDetails.DueDate = DateTime.UtcNow;
                                    UpdateItemInventoryDetails(transferGoodsDetails.ItemInventoryTransfer, inventoryTransferDetails, isAllowUnmatchedItemRecover, transferGoodsDetails, companyDetails, userDetails);
                                    inventoryTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                                    _inventoryTransferContext.Update(inventoryTransferDetails);
                                    _inventoryTransferContext.SaveChanges();
                                }
                                else
                                {
                                    inventoryTransferDetails.IsProcessing = false;
                                    inventoryTransferDetails.IsReceiving = true;
                                    inventoryTransferDetails.IsReceived = true;
                                    inventoryTransferDetails.IsReceivingInProcess = true;
                                    inventoryTransferDetails.IsInitiateTransferRequest = false;
                                    inventoryTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                                    UpdateItemRecevingQuantity(transferGoodsDetails.ItemInventoryTransfer);
                                    _inventoryTransferContext.Update(inventoryTransferDetails);
                                    _inventoryTransferContext.SaveChanges();
                                    return "Receipt Print";
                                }
                            }
                            else
                            {
                                if (inventoryTransferDetails.IsReceiving && isAllowUnmatchedItemRecover)
                                {
                                    foreach (var itemDetails in transferGoodsDetails.ItemInventoryTransfer)
                                    {
                                        var transferItemDetails = _itemInventoryContext.FirstOrDefault(x => x.Id == itemDetails.ItemInventoryTransferId);
                                        if (transferItemDetails != null)
                                        {
                                            transferItemDetails.ResolvedId = itemDetails.ResolvedId;
                                            transferItemDetails.ModifiedDateTime = DateTime.UtcNow;
                                            _itemInventoryContext.Update(transferItemDetails);
                                            _itemInventoryContext.SaveChanges();
                                        }
                                    }
                                }
                            }
                        }
                        return "Work Flow Created";
                    }
                    else
                    {
                        return "Work Flow Not Created";
                    }
                }
                else
                {
                    var workflowDetails = _workFlowDetailsRepository.GetApprovalActionWorkFLow((int)transferGoodsDetails.RecordId, StringConstants.RejectAction, transferGoodsDetails.InitiationComment, userDetails, transferGoodsDetails.IsStatus);

                    if (workflowDetails != null && workflowDetails.Id != 0)
                    {
                        var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);
                        var inventoryTransferDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == transferGoodsDetails.InventoryTransferId);

                        if (inventoryTransferDetails != null)
                        {
                            if (workFlowInfo.NextActivity.IsClosed)
                            {
                                inventoryTransferDetails.IsActive = false;
                                inventoryTransferDetails.IsDeleted = true;
                            }
                            else
                            {
                                inventoryTransferDetails.IsReject = true;
                                if (inventoryTransferDetails.IsReceiving)
                                {
                                    inventoryTransferDetails.IsReceivingInProcess = true;
                                }
                            }
                            inventoryTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                            _inventoryTransferContext.Update(inventoryTransferDetails);
                            _inventoryTransferContext.SaveChanges();
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


        private void UpdateItemRecevingQuantity(List<ItemInventoryTransferAc> itemInventoryTransfer)
        {
            try
            {
                foreach (var item in itemInventoryTransfer)
                {
                    var itemTransferDetails = _itemInventoryContext.FirstOrDefault(x => x.Id == item.ItemInventoryTransferId);
                    if (itemInventoryTransfer != null)
                    {
                        itemTransferDetails.ReceivingQuantity = itemTransferDetails.RequestQuantity;

                        _itemInventoryContext.Update(itemTransferDetails);
                        _itemInventoryContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private void UpdateItemInventoryDetails(List<ItemInventoryTransferAc> itemInventoryTransfer, InventoryTransfer inventoryTransferDetails, bool isAllowUnmatchedItemRecover, InventoryTransferAc transferGoodsDetails, CompanyDetail companyDetail, UserDetail userDetail)
        {
            try
            {
                foreach (var itemDetails in itemInventoryTransfer)
                {
                    var itemProfileDetails = _itemProfileContext.FirstOrDefault(x => x.Id == itemDetails.ItemId);
                    if (itemProfileDetails != null)
                    {
                        var paramTypeDetails = _paramTypeContext.FirstOrDefault(x => x.Id == transferGoodsDetails.RequestTypeId);

                        if (paramTypeDetails != null)
                        {
                            ItemQuantity itemQuantityDetails;
                            ItemQuantity currentitemQuantityDetails;
                            int? itemId;
                            switch (paramTypeDetails.ValueEn)
                            {
                                case StringConstants.SendInventory:

                                    if (itemProfileDetails.IsParentItem)
                                    {
                                        itemId = itemProfileDetails.Id;
                                        itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.Id && x.BranchId == transferGoodsDetails.TargetBranchId);
                                    }
                                    else
                                    {
                                        itemId = itemProfileDetails.ParentItemId;
                                        itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.ParentItemId && x.BranchId == transferGoodsDetails.TargetBranchId);
                                    }

                                    decimal totalCostPrice;
                                    if (itemQuantityDetails != null)
                                    {
                                        totalCostPrice = (Math.Abs(itemQuantityDetails.ActualQuantity - (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit))) * itemProfileDetails.CostPrice;
                                        itemQuantityDetails.ActualQuantity = itemQuantityDetails.ActualQuantity + (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit);
                                        itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                        _itemQuantityContext.Update(itemQuantityDetails);
                                        _itemQuantityContext.SaveChanges();
                                        GenrateAutomaticSpo(itemQuantityDetails, companyDetail, userDetail);
                                        InsertGainAccounting(inventoryTransferDetails, totalCostPrice, itemDetails, transferGoodsDetails.TargetBranchId, transferGoodsDetails.TargetBranchName);
                                    }
                                    else
                                    {

                                        var itemQuantityDetail = new ItemQuantity
                                        {
                                            CreatedDateTime = DateTime.UtcNow,
                                            ItemId = (int)itemId,
                                            BranchId = inventoryTransferDetails.TargetBranchId,
                                            ActualQuantity = itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit,
                                            MaxQuantity = 0,
                                            MinQuantity = 0
                                        };
                                        _itemQuantityContext.Add(itemQuantityDetail);
                                        _itemQuantityContext.SaveChanges();
                                        GenrateAutomaticSpo(itemQuantityDetail, companyDetail, userDetail);
                                        if (itemQuantityDetail.Id != 0)
                                        {
                                            totalCostPrice = ((itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit)) * itemProfileDetails.CostPrice;
                                            InsertGainAccounting(inventoryTransferDetails, totalCostPrice, itemDetails, transferGoodsDetails.TargetBranchId, transferGoodsDetails.TargetBranchName);
                                        }
                                    }

                                    if (itemProfileDetails.IsParentItem)
                                    {
                                        currentitemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.Id && x.BranchId == transferGoodsDetails.CurrentBranchId);
                                    }
                                    else
                                    {
                                        currentitemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.ParentItemId && x.BranchId == transferGoodsDetails.CurrentBranchId);
                                    }

                                    if (currentitemQuantityDetails != null)
                                    {
                                        totalCostPrice = (Math.Abs(currentitemQuantityDetails.ActualQuantity - (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit))) * itemProfileDetails.CostPrice;
                                        currentitemQuantityDetails.ActualQuantity = currentitemQuantityDetails.ActualQuantity - (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit);
                                        currentitemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                        _itemQuantityContext.Update(currentitemQuantityDetails);
                                        _itemQuantityContext.SaveChanges();
                                        GenrateAutomaticSpo(currentitemQuantityDetails, companyDetail, userDetail);
                                        InsertLostAccounting(inventoryTransferDetails, totalCostPrice, itemDetails, transferGoodsDetails.CurrentBranchId, transferGoodsDetails.CurrentBranchName);
                                    }
                                    break;
                                case StringConstants.RequestInventory:
                                    if (itemProfileDetails.IsParentItem)
                                    {
                                        itemId = itemProfileDetails.Id;
                                        itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.Id && x.BranchId == transferGoodsDetails.CurrentBranchId);
                                    }
                                    else
                                    {
                                        itemId = itemProfileDetails.ParentItemId;
                                        itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.ParentItemId && x.BranchId == transferGoodsDetails.CurrentBranchId);
                                    }
                                    if (itemQuantityDetails != null)
                                    {
                                        totalCostPrice = (Math.Abs(itemQuantityDetails.ActualQuantity - (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit))) * itemProfileDetails.CostPrice;
                                        itemQuantityDetails.ActualQuantity = itemQuantityDetails.ActualQuantity + (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit);
                                        itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                        _itemQuantityContext.Update(itemQuantityDetails);
                                        _itemQuantityContext.SaveChanges();
                                        GenrateAutomaticSpo(itemQuantityDetails, companyDetail, userDetail);
                                        InsertGainAccounting(inventoryTransferDetails, totalCostPrice, itemDetails, transferGoodsDetails.CurrentBranchId, transferGoodsDetails.CurrentBranchName);
                                    }
                                    else
                                    {
                                        var itemQuantityDetail = new ItemQuantity
                                        {
                                            CreatedDateTime = DateTime.UtcNow,
                                            ItemId = (int)itemId,
                                            BranchId = inventoryTransferDetails.CurrentBranchId,
                                            ActualQuantity = itemDetails.ReceivingQuantity,
                                            MaxQuantity = 0,
                                            MinQuantity = 0
                                        };
                                        _itemQuantityContext.Add(itemQuantityDetail);
                                        _itemQuantityContext.SaveChanges();
                                        GenrateAutomaticSpo(itemQuantityDetail, companyDetail, userDetail);
                                        if (itemQuantityDetail.Id != 0)
                                        {
                                            totalCostPrice = ((itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit)) * itemProfileDetails.CostPrice;
                                            InsertGainAccounting(inventoryTransferDetails, totalCostPrice, itemDetails, transferGoodsDetails.CurrentBranchId, transferGoodsDetails.CurrentBranchName);
                                        }
                                    }

                                    if (itemProfileDetails.IsParentItem)
                                    {
                                        currentitemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.Id && x.BranchId == transferGoodsDetails.TargetBranchId);
                                    }
                                    else
                                    {
                                        currentitemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfileDetails.ParentItemId && x.BranchId == transferGoodsDetails.TargetBranchId);
                                    }
                                    if (currentitemQuantityDetails != null)
                                    {
                                        totalCostPrice = (Math.Abs(currentitemQuantityDetails.ActualQuantity - (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit))) * itemProfileDetails.CostPrice;
                                        currentitemQuantityDetails.ActualQuantity = currentitemQuantityDetails.ActualQuantity - (itemDetails.ReceivingQuantity * itemProfileDetails.BaseUnit);
                                        currentitemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                        _itemQuantityContext.Update(currentitemQuantityDetails);
                                        _itemQuantityContext.SaveChanges();
                                        GenrateAutomaticSpo(currentitemQuantityDetails, companyDetail, userDetail);
                                        InsertLostAccounting(inventoryTransferDetails, totalCostPrice, itemDetails, transferGoodsDetails.TargetBranchId, transferGoodsDetails.TargetBranchName);
                                    }
                                    break;
                            }
                        }

                        if (isAllowUnmatchedItemRecover)
                        {
                            var transferItemDetails = _itemInventoryContext.FirstOrDefault(x => x.Id == itemDetails.ItemInventoryTransferId);
                            if (transferItemDetails != null)
                            {
                                transferItemDetails.ResolvedId = itemDetails.ResolvedId;
                                transferItemDetails.ModifiedDateTime = DateTime.UtcNow;
                                _itemInventoryContext.Update(transferItemDetails);
                                _itemInventoryContext.SaveChanges();
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


        private void InsertLostAccounting(InventoryTransfer inventoryTransferDetails, decimal totalCostPrice, ItemInventoryTransferAc itemDetails, int branchId, string branchName)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                if (itemDetails != null && inventoryTransferDetails != null && totalCostPrice != 0)
                {
                    var ledgersForMiscLoss = _iAccountRepository.GetAccountLedgerByName(StringConstants.Loss, branchId);
                    var ledgerForStockInHand = _iAccountRepository.GetAccountLedgerByName(StringConstants.StockInHand, branchId);
                    if (ledgersForMiscLoss != null && ledgerForStockInHand != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForMiscLoss.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalCostPrice, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.InternalTransferGoods, Description = "for " + itemDetails.ItemName + " item of " + branchName + " branch" });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgerForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = totalCostPrice, Debit = 0, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.InternalTransferGoods, Description = "for " + itemDetails.ItemName + " item of " + branchName + " branch" });
                    }
                    if (listOfDoubleEntry.Any())
                        _iAccountRepository.AddAccountingEntries(listOfDoubleEntry);
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private void InsertGainAccounting(InventoryTransfer inventoryTransferDetails, decimal totalCostPrice, ItemInventoryTransferAc itemDetails, int branchId, string branchName)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                if (itemDetails != null && inventoryTransferDetails != null && totalCostPrice != 0)
                {
                    var ledgersForIncome = _iAccountRepository.GetAccountLedgerByName(StringConstants.Income, branchId);
                    var ledgerForStockInHand = _iAccountRepository.GetAccountLedgerByName(StringConstants.StockInHand, branchId);
                    if (ledgerForStockInHand != null && ledgersForIncome != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForIncome.Id, TransactionDate = DateTime.UtcNow, Credit = totalCostPrice, Debit = 0, Description = "for " + itemDetails.ItemName + " item of " + branchName + " branch", CreatedDateTime = DateTime.UtcNow });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgerForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalCostPrice, ActivityName = StringConstants.InternalTransferGoods, CreatedDateTime = DateTime.UtcNow, Description = "for " + itemDetails.ItemName + " item of " + branchName + " branch" });
                    }
                    if (listOfDoubleEntry.Any())
                        _iAccountRepository.AddAccountingEntries(listOfDoubleEntry);
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to review the inventory tarnsfer details.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <param name="isAllowUnmatchedItemRecover"></param>
        /// <returns></returns>
        public string ReviewTransferInventoryById(InventoryTransferAc transferGoodsDetails, UserDetail userDetails,
            CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover)
        {
            try
            {
                var workflowDetails = _workFlowDetailsRepository.GetReviewActionWorkFlow((int)transferGoodsDetails.RecordId, transferGoodsDetails, transferGoodsDetails, StringConstants.ReviewAction, transferGoodsDetails.InitiationComment, userDetails);

                if (workflowDetails != null && workflowDetails.Id != 0)
                {
                    var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);

                    var inventoryTransferDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == transferGoodsDetails.InventoryTransferId);

                    if (inventoryTransferDetails != null)
                    {
                        if (workFlowInfo.NextActivity.IsClosed)
                        {
                            if (inventoryTransferDetails.IsReceiving)
                            {
                                inventoryTransferDetails.IsProcessing = false;
                                inventoryTransferDetails.IsReceiving = false;
                                inventoryTransferDetails.IsActive = true;
                                inventoryTransferDetails.DueDate = DateTime.UtcNow;
                                UpdateItemInventoryDetails(transferGoodsDetails.ItemInventoryTransfer, inventoryTransferDetails, isAllowUnmatchedItemRecover, transferGoodsDetails, companyDetails, userDetails);
                            }
                            else
                            {
                                inventoryTransferDetails.IsProcessing = false;
                                inventoryTransferDetails.IsReceiving = true;
                                inventoryTransferDetails.IsReceived = true;
                                inventoryTransferDetails.IsReceivingInProcess = true;
                                inventoryTransferDetails.IsInitiateTransferRequest = false;
                                UpdateItemRecevingQuantity(transferGoodsDetails.ItemInventoryTransfer);
                            }
                        }
                        else
                        {
                            if (inventoryTransferDetails.IsReceiving && isAllowUnmatchedItemRecover)
                            {
                                foreach (var itemDetails in transferGoodsDetails.ItemInventoryTransfer)
                                {
                                    var transferItemDetails = _itemInventoryContext.FirstOrDefault(x => x.Id == itemDetails.ItemInventoryTransferId);
                                    if (transferItemDetails != null)
                                    {
                                        transferItemDetails.ResolvedId = itemDetails.ResolvedId;
                                        transferItemDetails.ModifiedDateTime = DateTime.UtcNow;
                                        _itemInventoryContext.Update(transferItemDetails);
                                        _itemInventoryContext.SaveChanges();
                                    }
                                }
                            }
                        }
                        _inventoryTransferContext.Update(inventoryTransferDetails);
                        _inventoryTransferContext.SaveChanges();
                    }

                    return "Work Flow Created";
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
        /// this method is used to re-submit the transfer details.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <param name="isAllowToInitiateIntrenalTransferGood"></param>
        /// <param name="isAllowToReceiveIntranalTransferGood"></param>
        /// <returns></returns>
        public string ReSubmitTransferInventory(InventoryTransferAc transferGoodsDetails, UserDetail userDetails,
            CompanyDetail companyDetails, bool isAllowToInitiateIntrenalTransferGood, bool isAllowToReceiveIntranalTransferGood)
        {
            try
            {
                var workflowDetails = _workFlowDetailsRepository.GetResubmitActionWorkFlow((int)transferGoodsDetails.RecordId, transferGoodsDetails, transferGoodsDetails, StringConstants.ReSubmitedAction, transferGoodsDetails.InitiationComment, userDetails);
                if (workflowDetails != null && workflowDetails.Id != 0)
                {
                    var inventoryTransferDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == transferGoodsDetails.InventoryTransferId);
                    if (inventoryTransferDetails != null)
                    {
                        foreach (var itemDetails in transferGoodsDetails.ItemInventoryTransfer)
                        {
                            var itemTransferDetails = _itemInventoryContext.FirstOrDefault(x => x.Id == itemDetails.ItemInventoryTransferId);
                            {
                                if (transferGoodsDetails.IsAllowToEditQunatity)
                                {
                                    if (isAllowToReceiveIntranalTransferGood)
                                    {
                                        itemTransferDetails.ReceivingQuantity = itemDetails.ReceivingQuantity;
                                        itemTransferDetails.IsNotReceivedItem = itemDetails.IsNotReceivedItem;
                                        itemTransferDetails.IsReceivedItem = itemDetails.IsReceivedItem;
                                        itemTransferDetails.IsPartialReceivedItem = itemDetails.IsPartialReceivedItem;
                                        if (itemTransferDetails.RequestQuantity != itemDetails.ReceivingQuantity)
                                        {
                                            itemTransferDetails.IsUnmatchedItem = true;
                                        }
                                        itemTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                                        _itemInventoryContext.Update(itemTransferDetails);
                                        _itemInventoryContext.SaveChanges();
                                    }
                                }
                                else
                                {
                                    if (isAllowToInitiateIntrenalTransferGood)
                                    {
                                        itemTransferDetails.RequestQuantity = itemDetails.RequestQuantity;
                                        itemTransferDetails.IsWarningMessage = itemDetails.IsWarningMesssage;
                                    }
                                    itemTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                                    _itemInventoryContext.Update(itemTransferDetails);
                                    _itemInventoryContext.SaveChanges();
                                }
                            }
                        }
                        inventoryTransferDetails.IsReject = false;
                        inventoryTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                        _inventoryTransferContext.Update(inventoryTransferDetails);
                        _inventoryTransferContext.SaveChanges();
                    }
                    return "Work Flow Created";
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
        /// this method is used to recieve tranfser order by the Id.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public string ReceiveTransferInventoryById(InventoryTransferAc transferGoodsDetails, UserDetail userDetails,
            CompanyDetail companyDetails)
        {
            try
            {
                var workflowDetails = _workFlowDetailsRepository.GetEditActionWorkFlow(StringConstants.InternalTransferGoods, StringConstants.ReceiveInternalTransferGood, userDetails, companyDetails, transferGoodsDetails, transferGoodsDetails.InitiationComment, transferGoodsDetails, (int)transferGoodsDetails.RecordId, StringConstants.ReceiveAction);
                if (workflowDetails != null)
                {
                    var workFlowInfo = _workFlowDetailsContext.FirstOrDefault(x => x.Id == workflowDetails.WorkFlowId);
                    var inventoryTransferDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == transferGoodsDetails.InventoryTransferId);
                    if (inventoryTransferDetails != null)
                    {
                        foreach (var itemDetails in transferGoodsDetails.ItemInventoryTransfer)
                        {
                            var itemTransferDetails = _itemInventoryContext.FirstOrDefault(x => x.Id == itemDetails.ItemInventoryTransferId);
                            {
                                itemTransferDetails.ReceivingQuantity = itemDetails.ReceivingQuantity;
                                itemTransferDetails.IsNotReceivedItem = itemDetails.IsNotReceivedItem;
                                itemTransferDetails.IsReceivedItem = itemDetails.IsReceivedItem;
                                itemTransferDetails.IsPartialReceivedItem = itemDetails.IsPartialReceivedItem;
                                itemTransferDetails.ResolvedId = itemDetails.ResolvedId;
                                if (itemTransferDetails.RequestQuantity != itemDetails.ReceivingQuantity)
                                {
                                    itemTransferDetails.IsUnmatchedItem = true;
                                }
                                itemTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                                _itemInventoryContext.Update(itemTransferDetails);
                                _itemInventoryContext.SaveChanges();
                            }
                        }
                        if (workFlowInfo.NextActivity.IsClosed)
                        {
                            if (inventoryTransferDetails.IsReceiving)
                            {
                                inventoryTransferDetails.IsProcessing = false;
                                inventoryTransferDetails.IsReceiving = false;
                                inventoryTransferDetails.IsActive = true;
                                inventoryTransferDetails.IsReceivingInProcess = false;
                                inventoryTransferDetails.DueDate = DateTime.UtcNow;
                                foreach (var itemDetails in transferGoodsDetails.ItemInventoryTransfer)
                                {
                                    var itemProfileDetails =
                                        _itemProfileContext.FirstOrDefault(x => x.Id == itemDetails.ItemId);
                                    if (itemProfileDetails != null)
                                    {
                                        var itemQuantityDetails =
                                            _itemQuantityContext.FirstOrDefault(
                                                x =>
                                                    x.ItemId == itemProfileDetails.Id &&
                                                    x.BranchId == transferGoodsDetails.TargetBranchId);
                                        if (itemQuantityDetails != null)
                                        {
                                            itemQuantityDetails.ActualQuantity = itemQuantityDetails.ActualQuantity + itemDetails.ReceivingQuantity;
                                            itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                            _itemQuantityContext.Update(itemQuantityDetails);
                                            _itemQuantityContext.SaveChanges();
                                        }
                                        else
                                        {
                                            var itemQuantityDetail = new ItemQuantity
                                            {
                                                CreatedDateTime = DateTime.UtcNow,
                                                ItemId = itemDetails.ItemId,
                                                BranchId = inventoryTransferDetails.TargetBranchId,
                                                ActualQuantity = itemDetails.ReceivingQuantity,
                                                MaxQuantity = 0,
                                                MinQuantity = 0
                                            };
                                            _itemQuantityContext.Add(itemQuantityDetail);
                                            _itemQuantityContext.SaveChanges();
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            inventoryTransferDetails.IsProcessing = true;
                            inventoryTransferDetails.IsReceivingInProcess = false;
                        }
                        inventoryTransferDetails.ModifiedDateTime = DateTime.UtcNow;
                        _inventoryTransferContext.Update(inventoryTransferDetails);
                        _inventoryTransferContext.SaveChanges();
                    }
                    return "Work Flow Created";
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
        /// this method is used to print the inventory tarnsfer receipt.
        /// </summary>
        /// <param name="inventoryTransferId"></param>
        /// <returns></returns>
        public InventoryTransferAc PrintTransferGoodReceipt(int inventoryTransferId)
        {
            try
            {
                var inventoryTransferAc = new InventoryTransferAc();
                decimal amount = 0;
                var transferGoodDetails = _inventoryTransferContext.FirstOrDefault(x => x.Id == inventoryTransferId);
                inventoryTransferAc = ApplicationClassHelper.ConvertType<InventoryTransfer, InventoryTransferAc>(transferGoodDetails);
                inventoryTransferAc.InventoryTransferId = transferGoodDetails.Id;
                inventoryTransferAc.BranchDetail = transferGoodDetails.TargetBranch;
                inventoryTransferAc.PrintDate = DateTime.UtcNow.ToString("dd-MM-yyyy");
                inventoryTransferAc.Invoice = InvoiceToHtml.get39(transferGoodDetails.RequestNo, 1.5, 20);
                inventoryTransferAc.RequestBranchDetails = transferGoodDetails.CurrentBranchDetail;
                inventoryTransferAc.IssueDate = transferGoodDetails.CreatedDateTime.ToString("dd-MM-yyyy");
                inventoryTransferAc.PrintDueDate = transferGoodDetails.DueDate.ToString("dd-MM-yyyy");
                if (transferGoodDetails != null)
                {
                    var itemInventoryCollection = new List<ItemInventoryTransferAc>();
                    foreach (var transferItemDetails in _itemInventoryContext.Fetch(x => x.InventoryTransferId == transferGoodDetails.Id).ToList())
                    {
                        var itemInventoryTransferAc = new ItemInventoryTransferAc();
                        itemInventoryTransferAc = ApplicationClassHelper.ConvertType<ItemInventoryTransfer, ItemInventoryTransferAc>(transferItemDetails);
                        itemInventoryTransferAc.ItemInventoryTransferId = transferItemDetails.Id;
                        itemInventoryTransferAc.ItemId = transferItemDetails.ItemId;
                        itemInventoryTransferAc.Unit = transferItemDetails.ItemProfile.SystemParameter.ValueEn;
                        itemInventoryTransferAc.ItemName = transferItemDetails.ItemProfile.ItemNameEn;
                        itemInventoryTransferAc.Flavour = transferItemDetails.ItemProfile.FlavourEn;
                        itemInventoryTransferAc.Barcode = transferItemDetails.ItemProfile.Barcode;
                        itemInventoryTransferAc.Price = transferItemDetails.ItemProfile.CostPrice;
                        itemInventoryTransferAc.BaseUnitCount = transferItemDetails.ItemProfile.BaseUnit;
                        if (amount == 0)
                        {
                            amount = transferItemDetails.ItemProfile.CostPrice * transferItemDetails.RequestQuantity;
                        }
                        else
                        {
                            amount = amount + (transferItemDetails.ItemProfile.CostPrice * transferItemDetails.RequestQuantity);
                        }

                        itemInventoryCollection.Add(itemInventoryTransferAc);
                    }
                    inventoryTransferAc.TotalAmount = amount;
                    inventoryTransferAc.ItemInventoryTransfer = itemInventoryCollection;
                }
                return inventoryTransferAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private string GetTheTransferInventoryNumber()
        {
            try
            {
                var checkTransferInventoryNo = DateTime.UtcNow.ToString("ddMMyyyy");
                var transferInventoryCount = _inventoryTransferContext.Fetch(x => x.RequestNo.Contains(checkTransferInventoryNo)).Count();
                var transferInventoryNumber = "";
                var numString = (transferInventoryCount + 1).ToString();
                var ponum = numString.PadLeft(numString.Length + 4 - 1, '0');
                var currentDate = DateTime.UtcNow.ToString("ddMMyyyy");
                transferInventoryNumber = currentDate + "" + ponum;
                return transferInventoryNumber;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}

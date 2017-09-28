using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.ItemDestruction;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.CreditNote;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.ItemDestructionRequest;
using MerchantService.Repository.Modules.ParentRecords;
using MerchantService.Repository.Modules.Supplier;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.ItemDestructionRequest
{
    [RoutePrefix("api/itemdestruction")]
    public class ItemDestructionController : BaseController
    {
        private readonly IErrorLog _errorLog;
        private readonly IItemRepository _iItemRepository;
        private readonly IBranchRepository _iBranchRepository;
        private readonly ISupplierProfileRepository _iSupplierProfileRepository;
        private readonly IParentRecordsRepository _iParentRecordsRepository;
        private readonly IItemDestructionRequestRepository _iItemDestructionRequestRepository;
        private readonly ISystemParameterRepository _iSystemParameterRepository;
        private readonly ICreditNoteRepository _ICreditNoteRepository;
        private readonly IRoleRepository _iRoleRepository;
        private readonly IUserDetailRepository _userDetailRepository;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IAccountingRepository _iAccountingRepository;

        private readonly int currentCompanyId;

        public ItemDestructionController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IItemRepository iItemRepository, IParentRecordsRepository iParentRecordsRepository,
            IItemDestructionRequestRepository iItemDestructionRequestRepository, IRoleRepository iRoleRepository, IUserDetailRepository userDetailRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository,
            ICreditNoteRepository ICreditNoteRepository, IAccountingRepository iAccountingRepository, IBranchRepository iBranchRepository, ISupplierProfileRepository iSupplierProfileRepository, ISystemParameterRepository iSystemParameterRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _iBranchRepository = iBranchRepository;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _ICreditNoteRepository = ICreditNoteRepository;
            _iItemRepository = iItemRepository;
            _iParentRecordsRepository = iParentRecordsRepository;
            currentCompanyId = MerchantContext.CompanyDetails.Id;
            _iSystemParameterRepository = iSystemParameterRepository;
            _iItemDestructionRequestRepository = iItemDestructionRequestRepository;
            _iRoleRepository = iRoleRepository;
            _userDetailRepository = userDetailRepository;
            _iAccountingRepository = iAccountingRepository;
            _iSupplierProfileRepository = iSupplierProfileRepository;
        }


        /// <summary>
        /// This method used for Get Supplier Item List. -An
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("getsupplieritemlist")]
        public IHttpActionResult GetSupplierItemList(ItemDestructionSearchModelAC itemDestructionSearchModel)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemDestructionDetailAC itemDestructionAC = new ItemDestructionDetailAC();
                    List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                    itemDestructionSearchModel.BranchId = itemDestructionSearchModel.BranchId != 0 ? itemDestructionSearchModel.BranchId : Convert.ToInt32(MerchantContext.UserDetails.BranchId);
                    List<ItemProfile> listOfItemProfile = _iItemRepository.GetListOfItemProfileWithSearching(itemDestructionSearchModel, currentCompanyId);
                    listOfItemProfile = listOfItemProfile.OrderByDescending(x => x.IsParentItem).ToList();
                    foreach (var item in listOfItemProfile)
                    {
                        if (item.CategoryId != null)
                        {
                            List<ItemSupplier> supplierItemList = _iItemRepository.GetItemSupplierListByCategoryId(Convert.ToInt32(item.CategoryId));
                            foreach (var supplier in supplierItemList)
                            {
                                ItemProfileAC itemProfileAc = new ItemProfileAC();
                                itemProfileAc.SupplierName = supplier != null ? supplier.SupplierProfile.NameEn : "";
                                itemProfileAc.SupplierId = supplier != null ? supplier.SupplierProfile.Id : 0;
                                itemProfileAc.ItemNameEn = item.ItemNameEn;
                                itemProfileAc.Barcode = item.Barcode;
                                itemProfileAc.FlavourEn = item.FlavourEn;
                                itemProfileAc.UnitParamTypeId = item.UnitParamTypeId;
                                itemProfileAc.Unit = item.SystemParameter.ValueEn;
                                itemProfileAc.BaseUnit = item.BaseUnit;
                                itemProfileAc.Id = item.Id;
                                itemProfileAc.CategoryId = item.CategoryId;
                                itemProfileAc.OldRequestQuantity = 0;
                                itemProfileAc.ParentItemId = item.Id;
                                itemProfileAc.IsParentItem = item.IsParentItem;
                                itemProfileAc.CostPrice = item.CostPrice;
                                itemProfileAc.ItemProfileId = item.Id;
                                itemProfileAc.ItemType = item.Category.BrandParamType.ValueEn + "-" + item.Category.GroupParamType.ValueEn;
                                var itemQuantity = _iItemRepository.GetItemQuantityByItemId(item.Id, itemDestructionSearchModel.BranchId);
                                itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                                itemProfileAc.ActualQuantity = itemProfileAc.SystemQuantity;
                                itemProfileAc.UpdateSystemQunatity = itemProfileAc.ActualQuantity;
                                itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(item.Id);
                                List<ItemProfile> listOfChildItemProfile = _iItemRepository.GetSubItemListByParentId(itemProfileAc.Id, currentCompanyId);
                                if (listOfChildItemProfile.Any())
                                {
                                    List<SubItemProfileAC> listOfChildItemProfileAC = new List<SubItemProfileAC>();
                                    foreach (var childItem in listOfChildItemProfile)
                                    {
                                        if (childItem.CategoryId != null)
                                        {
                                            List<ItemSupplier> childItemSupplier = _iItemRepository.GetItemSupplierListByCategoryId(Convert.ToInt32(childItem.CategoryId));
                                            foreach (var childItemSupplierObject in childItemSupplier)
                                            {
                                                SubItemProfileAC childItemProfileAc = new SubItemProfileAC();
                                                childItemProfileAc.SupplierName = childItemSupplierObject != null ? childItemSupplierObject.SupplierProfile.NameEn : "";
                                                childItemProfileAc.SupplierId = childItemSupplierObject != null ? childItemSupplierObject.SupplierProfile.Id : 0;
                                                childItemProfileAc.ItemNameEn = childItem.ItemNameEn;
                                                childItemProfileAc.Id = childItem.Id;
                                                childItemProfileAc.ParentItemId = childItem.ParentItemId;
                                                childItemProfileAc.FlavourEn = childItem.FlavourEn;
                                                childItemProfileAc.Barcode = childItem.Barcode;
                                                childItemProfileAc.Unit = childItem.SystemParameter.ValueEn;
                                                childItemProfileAc.BaseUnit = childItem.BaseUnit;
                                                childItemProfileAc.OldRequestQuantity = 0;
                                                childItemProfileAc.UpdateSystemQunatity = itemProfileAc.ActualQuantity;
                                                childItemProfileAc.IsParentItem = childItem.IsParentItem;
                                                childItemProfileAc.UnitParamTypeId = childItem.UnitParamTypeId;
                                                childItemProfileAc.CategoryId = childItem.CategoryId;
                                                childItemProfileAc.CostPrice = childItem.CostPrice;
                                                childItemProfileAc.ItemProfileId = childItem.Id;
                                                childItemProfileAc.ItemType = childItem.Category.BrandParamType.ValueEn + "-" + childItem.Category.GroupParamType.ValueEn;
                                                if (itemQuantity.ActualQuantity > 0)
                                                {
                                                    decimal systemQuantity = (itemQuantity.ActualQuantity / childItem.BaseUnit);
                                                    childItemProfileAc.SystemQuantity = systemQuantity > 0 ? Math.Floor(systemQuantity) : 0;
                                                    childItemProfileAc.ActualQuantity = childItemProfileAc.SystemQuantity;
                                                }
                                                listOfChildItemProfileAC.Add(childItemProfileAc);
                                            }
                                        }
                                    }
                                    itemProfileAc.listOfChildProfileAC = listOfChildItemProfileAC;
                                }

                                bool isValid = true;
                                if (itemDestructionSearchModel.SupplierId != 0)
                                {
                                    if (supplier.SupplierId == itemDestructionSearchModel.SupplierId)
                                        isValid = true;
                                    else
                                        isValid = false;
                                }
                                if (isValid)
                                {
                                    //to check already sub item is exists in parent
                                    bool isAlreadyExist = false;
                                    if (!itemProfileAc.IsParentItem)
                                    {
                                        foreach (var itemProfile in listOfItemProfileAC)
                                        {
                                            if (item.ParentItemId == itemProfile.Id)
                                            {
                                                isAlreadyExist = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!isAlreadyExist)
                                        listOfItemProfileAC.Add(itemProfileAc);
                                }
                            }
                        }
                    }
                    itemDestructionAC.BranchId = Convert.ToInt32(MerchantContext.UserDetails.BranchId);
                    itemDestructionAC.listOfItemProfileAC = listOfItemProfileAC;
                    return Ok(itemDestructionAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("checkitemalreadydestruct")]
        public IHttpActionResult CheckItemAlreadyDestruct(ItemDestructionRequestAC itemDestructionRequestAC)
        {
            try
            {
                if (itemDestructionRequestAC.listOfItemProfileAC.Count > 0)
                {
                    string itemNameList = "";
                    foreach (var item in itemDestructionRequestAC.listOfItemProfileAC)
                    {
                        List<ItemDestructionDetail> listOfItemDestruction = _iItemDestructionRequestRepository.GetItemDestructionDetails(item.Id);
                        bool isItemAlreadyExistsDestructionRequest = false;
                        foreach (var listofItemDestruction in listOfItemDestruction)
                        {
                            if (!listofItemDestruction.Desturction.IsDelete)
                            {
                                var workFlowLog = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(listofItemDestruction.Desturction.RecordId);
                                if (workFlowLog != null)
                                {
                                    if (workFlowLog.WorkFlowDetail.IsClosed || workFlowLog.WorkFlowDetail.NextActivity.IsClosed)
                                        isItemAlreadyExistsDestructionRequest = false;
                                    else
                                    {
                                        isItemAlreadyExistsDestructionRequest = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (isItemAlreadyExistsDestructionRequest)
                            itemNameList = item.ItemNameEn + "," + itemNameList;
                    }
                    if (itemNameList != "")
                    {
                        itemNameList = itemNameList.Remove(itemNameList.Length - 1);
                        return Ok(new { _isResult = itemNameList });
                    }
                }
                return Ok(new { _isResult = true });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getsupplieritemlistbybranchid")]
        public IHttpActionResult getSupplierItemListByBranchId(int branchId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {

                    ItemDestructionDetailAC itemDestructionAC = new ItemDestructionDetailAC();
                    List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                    List<SubItemProfileAC> listOfChildItemProfileAC = new List<SubItemProfileAC>();
                    List<ItemProfile> listOfItemProfile = _iItemRepository.GetListOfItemProfile(currentCompanyId);
                    foreach (var item in listOfItemProfile)
                    {
                        if (item.CategoryId != null)
                        {
                            List<ItemSupplier> supplierItemList = _iItemRepository.GetItemSupplierListByCategoryId(Convert.ToInt32(item.CategoryId));
                            foreach (var supplier in supplierItemList)
                            {
                                ItemProfileAC itemProfileAc = new ItemProfileAC();
                                itemProfileAc.SupplierName = supplier != null ? supplier.SupplierProfile.NameEn : "";
                                itemProfileAc.SupplierId = supplier != null ? supplier.SupplierProfile.Id : 0;
                                itemProfileAc.ItemNameEn = item.ItemNameEn;
                                itemProfileAc.FlavourEn = item.FlavourEn;
                                itemProfileAc.Barcode = item.Barcode;
                                itemProfileAc.UnitParamTypeId = item.UnitParamTypeId;
                                itemProfileAc.Unit = item.SystemParameter.ValueEn;
                                itemProfileAc.Id = item.Id;
                                itemProfileAc.CategoryId = item.CategoryId;
                                itemProfileAc.CostPrice = item.CostPrice;
                                itemProfileAc.ItemProfileId = item.Id;
                                itemProfileAc.ItemType = item.Category.BrandParamType.ValueEn + "-" + item.Category.GroupParamType.ValueEn;
                                var itemQuantity = _iItemRepository.GetItemQuantityByItemId(item.Id, branchId);
                                itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                                itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(item.Id);
                                List<ItemProfile> listOfChildItemProfile = _iItemRepository.GetSubItemListByParentId(itemProfileAc.Id, currentCompanyId);
                                if (listOfChildItemProfile.Any())
                                {
                                    foreach (var childItem in listOfChildItemProfile)
                                    {
                                        if (childItem.CategoryId != null)
                                        {
                                            List<ItemSupplier> childItemSupplier = _iItemRepository.GetItemSupplierListByCategoryId(Convert.ToInt32(childItem.CategoryId));
                                            foreach (var childItemSupplierObject in childItemSupplier)
                                            {
                                                SubItemProfileAC childItemProfileAc = new SubItemProfileAC();
                                                childItemProfileAc.SupplierName = childItemSupplierObject != null ? childItemSupplierObject.SupplierProfile.NameEn : "";
                                                childItemProfileAc.SupplierId = childItemSupplierObject != null ? childItemSupplierObject.SupplierProfile.Id : 0;
                                                childItemProfileAc.ItemNameEn = childItem.ItemNameEn;
                                                childItemProfileAc.Id = childItem.Id;
                                                childItemProfileAc.FlavourEn = childItem.FlavourEn;
                                                childItemProfileAc.Barcode = childItem.Barcode;
                                                childItemProfileAc.Unit = childItem.SystemParameter.ValueEn;
                                                childItemProfileAc.UnitParamTypeId = childItem.UnitParamTypeId;
                                                childItemProfileAc.CategoryId = childItem.CategoryId;
                                                childItemProfileAc.CostPrice = childItem.CostPrice;
                                                childItemProfileAc.ItemProfileId = childItem.Id;
                                                childItemProfileAc.ItemType = childItem.Category.BrandParamType.ValueEn + "-" + childItem.Category.GroupParamType.ValueEn;
                                                if (itemQuantity.ActualQuantity > 0)
                                                {
                                                    decimal systemQuantity = (itemQuantity.ActualQuantity / childItem.BaseUnit);
                                                    childItemProfileAc.SystemQuantity = systemQuantity > 0 ? Math.Floor(systemQuantity) : 0;
                                                }
                                                listOfChildItemProfileAC.Add(childItemProfileAc);
                                            }
                                        }
                                    }
                                    itemProfileAc.listOfChildProfileAC = listOfChildItemProfileAC;
                                }
                                listOfItemProfileAC.Add(itemProfileAc);
                            }
                        }
                    }
                    itemDestructionAC.BranchId = branchId;
                    itemDestructionAC.listOfItemProfileAC = listOfItemProfileAC;
                    return Ok(itemDestructionAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for seubmit Item Destruction Request. -An
        /// </summary>
        /// <param name="itemDestructionRequestAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("submitdestructionitemrequest")]
        public IHttpActionResult SubmitItemDestructionRequest(ItemDestructionRequestAC itemDestructionRequestAC)
        {
            try
            {
                ItemDestructionApprovalAC itemDestructionApproval = new ItemDestructionApprovalAC();
                itemDestructionRequestAC.branchId = itemDestructionRequestAC.branchId != 0 ? itemDestructionRequestAC.branchId : Convert.ToInt32(MerchantContext.UserDetails.BranchId);
                if (itemDestructionRequestAC.listOfItemProfileAC.Count > 0)
                {
                    var itemDestructionList = itemDestructionRequestAC.listOfItemProfileAC.GroupBy(x => x.SupplierId);
                    foreach (var item in itemDestructionList)
                    {
                        var workFlow = _iWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.DestructionItem, StringConstants.DestructionItemRequest, MerchantContext.UserDetails, MerchantContext.CompanyDetails, null, itemDestructionRequestAC.comment, null);
                        if (workFlow != null)
                        {
                            var workFlowLog = (WorkFlowLog)workFlow.Item1;
                            var workflowDetailsInfo = (WorkFlowDetail)workFlow.Item2;

                            Destruction destruction = new Destruction();
                            destruction.DestructionCauseId = itemDestructionRequestAC.destructioCasueId;
                            if (itemDestructionRequestAC.intiatedId == 1)
                                destruction.IsInitiatedBysupplier = true;
                            destruction.SupplierId = item.Key;
                            destruction.RecordId = workFlowLog.RecordId;

                            List<Destruction> listOfTodayDestrutionRquest = _iItemDestructionRequestRepository.GetTodayItemDestructionListByBranchId(itemDestructionRequestAC.branchId);
                            DateTime dt = DateTime.UtcNow;
                            destruction.RequestNo = "Req" + dt.Day.ToString() + dt.Month.ToString() + dt.Year.ToString() + (listOfTodayDestrutionRquest.Count + 1);
                            destruction.CreatedDateTime = DateTime.UtcNow;
                            destruction.BranchId = itemDestructionRequestAC.branchId;
                            destruction = _iItemDestructionRequestRepository.AddDestruction(destruction);
                            if (destruction != null)
                            {
                                List<ItemDestructionDetail> listOfItemDesturction = new List<ItemDestructionDetail>();
                                List<ItemProfileAC> listOfItemProfileAc = item.ToList();
                                foreach (var itemOfDestruction in listOfItemProfileAc)
                                {
                                    ItemDestructionDetail itemDestructionDetail = new ItemDestructionDetail();
                                    itemDestructionDetail.CostPrice = itemOfDestruction.CostPrice;
                                    itemDestructionDetail.CreatedDateTime = DateTime.UtcNow;
                                    itemDestructionDetail.DestructionId = destruction.Id;
                                    itemDestructionDetail.DestructionQuantity = itemOfDestruction.DestructionQuantity;
                                    itemDestructionDetail.ItemId = itemOfDestruction.ItemProfileId;
                                    listOfItemDesturction.Add(itemDestructionDetail);
                                    _iItemDestructionRequestRepository.AddDestructionItem(itemDestructionDetail);
                                }
                                if (workflowDetailsInfo.IsClosed)
                                {

                                    #region Created CreditNotes
                                    if (destruction.IsInitiatedBysupplier)
                                        itemDestructionApproval = CreateCreditNote(itemDestructionApproval, itemDestructionRequestAC.branchId, destruction);

                                    #endregion

                                    #region Collected Item Destruction Receipt Data
                                    itemDestructionApproval.ApprovedBy = MerchantContext.UserDetails.UserName;
                                    var branch = _iBranchRepository.GetBranchById(Convert.ToInt32(destruction.BranchId));
                                    if (branch != null)
                                    {
                                        itemDestructionApproval.ComapnyAddress = branch.Address;
                                        itemDestructionApproval.BranchName = branch.Name;
                                    }
                                    itemDestructionApproval.CreatedDateTime = destruction.CreatedDateTime;
                                    itemDestructionApproval.ReceiptNumber = destruction.RequestNo;
                                    itemDestructionApproval.Invoice = InvoiceToHtml.get39(destruction.RequestNo, 1.5, 20);
                                    var supplier = _iSupplierProfileRepository.GetSupplierById(destruction.SupplierId);
                                    if (supplier != null)
                                    {
                                        itemDestructionApproval.SupplierMobileNumber = supplier.Phone;
                                        itemDestructionApproval.SupplierName = supplier.NameEn;
                                    }
                                    List<ItemDestructionDetail> listOfItemDestruction = _iItemDestructionRequestRepository.GetItemDestructionDetials(destruction.Id);
                                    List<ItemProfileAC> listOfItemProfile = new List<ItemProfileAC>();
                                    decimal totalAmount = 0;
                                    int totalQuantity = 0;
                                    foreach (var destructionItem in listOfItemDestruction)
                                    {
                                        ItemProfileAC itemProfileAC = new ItemProfileAC();
                                        itemProfileAC.Id = destructionItem.ItemId;
                                        itemProfileAC.CostPrice = destructionItem.CostPrice;
                                        var itemProfile = _iItemRepository.GetItemProfileObjectById(destructionItem.ItemId);
                                        if (itemProfile != null)
                                        {
                                            itemProfileAC.ItemNameEn = itemProfile.ItemNameEn;
                                            itemProfileAC.Unit = itemProfile.SystemParameter.ValueEn;
                                            itemProfileAC.FlavourEn = itemProfile.FlavourEn;
                                        }
                                        itemProfileAC.DestructionQuantity = destructionItem.DestructionQuantity;
                                        ParamType paramType = _iSystemParameterRepository.GetParamTypeById(destruction.DestructionCauseId);
                                        itemProfileAC.DestructionCause = paramType != null ? paramType.ValueEn : "";
                                        totalAmount = totalAmount + itemProfileAC.CostPrice;
                                        totalQuantity = totalQuantity + itemProfileAC.DestructionQuantity;
                                        listOfItemProfile.Add(itemProfileAC);
                                    }
                                    itemDestructionApproval.TotalAmount = totalAmount;
                                    itemDestructionApproval.TotalQuantity = totalQuantity;
                                    itemDestructionApproval.listOfItemProdileAC = listOfItemProfile;

                                    #endregion

                                    decimal totalCostPrice = 0;
                                    foreach (var itemDestruction in listOfItemDesturction)
                                    {
                                        var newItemProfile = _iItemRepository.GetItemProfileObjectById(itemDestruction.ItemId);
                                        _iItemRepository.UpdateItemQuantity(newItemProfile, itemDestructionRequestAC.branchId, itemDestruction.DestructionQuantity, MerchantContext.CompanyDetails, MerchantContext.UserDetails);
                                        totalCostPrice = totalCostPrice + itemDestruction.CostPrice;
                                    }
                                    var itemName = string.Join(",", listOfItemDestruction.Select(x => x.ItemProfile.ItemNameEn));

                                    #region Accounting Portion

                                    InsertIntoAccountEntries(destruction, totalCostPrice, itemName);
                                    #endregion
                                    itemDestructionApproval.IsResult = "true";

                                }
                                else
                                    itemDestructionApproval.IsResult = "false";
                            }
                        }
                        else
                            itemDestructionApproval.IsResult = "NotExists";
                    }
                }
                return Ok(new { _isResult = itemDestructionApproval });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for item destruction work list. -An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemdestructionrequest")]
        public IHttpActionResult GetItemDestructionRequest()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    bool isAdd = true;
                    List<ItemDestructionRequestWorkListAC> listOfItemDestructionRequestWorkListAC = new List<ItemDestructionRequestWorkListAC>();
                    if (MerchantContext.UserDetails.BranchId != null)
                    {
                        List<Destruction> listOfDestruction = new List<Destruction>();
                        listOfDestruction = _iItemDestructionRequestRepository.GetDestructionDetailByBranchId(Convert.ToInt32(MerchantContext.UserDetails.BranchId), MerchantContext.Permission.IsAllowToAccessAllBranch);

                        foreach (var item in listOfDestruction)
                        {
                            ItemDestructionRequestWorkListAC itemDestructionRequestWorkList = new ItemDestructionRequestWorkListAC();
                            if (item.BranchDetail != null)
                                itemDestructionRequestWorkList.Branch = item.BranchDetail.Name;
                            itemDestructionRequestWorkList.BranchId = item.BranchId != null ? Convert.ToInt32(item.BranchId) : 0;

                            itemDestructionRequestWorkList.Cause = item.ParamType != null ? item.ParamType.ValueEn : "";
                            itemDestructionRequestWorkList.CauseId = item.DestructionCauseId;

                            List<ItemDestructionDetail> listOfItemDestructionDetail = _iItemDestructionRequestRepository.GetItemDestructionDetials(item.Id);
                            int quantity = 0;
                            foreach (var listOfItemDestruction in listOfItemDestructionDetail)
                            {
                                quantity = listOfItemDestruction.DestructionQuantity + quantity;
                            }
                            itemDestructionRequestWorkList.DestructedQuantity = quantity;
                            itemDestructionRequestWorkList.DestructionId = item.Id;
                            itemDestructionRequestWorkList.RequestNo = item.RequestNo;
                            itemDestructionRequestWorkList.IsDeleted = item.IsDelete;
                            if (!item.IsDelete)
                            {
                                var workFlowLog = _iParentRecordsRepository.GetWorkFlowLogLastObjectByRecordId(item.RecordId);
                                if (workFlowLog != null)
                                {
                                    if (workFlowLog.Action == StringConstants.Rejected)
                                        itemDestructionRequestWorkList.Status = "Returned";
                                    else
                                        itemDestructionRequestWorkList.Status = workFlowLog.Action;
                                }
                            }
                            else
                                itemDestructionRequestWorkList.Status = "Deleted";

                            itemDestructionRequestWorkList.SupplierName = item.SupplierProfile.NameEn;
                            itemDestructionRequestWorkList.SupplierId = item.SupplierId;
                            itemDestructionRequestWorkList.RequestedDate = item.CreatedDateTime;

                            if (item.IsDelete)
                            {
                                DateTime newCreatedDate = item.CreatedDateTime.AddDays(14);// deleted recordes not dispaly after two weeks.
                                if (DateTime.UtcNow >= newCreatedDate)
                                    isAdd = false;
                            }

                            if (isAdd)//ifisAdd not 
                                listOfItemDestructionRequestWorkListAC.Add(itemDestructionRequestWorkList);
                        }
                    }
                    return Ok(listOfItemDestructionRequestWorkListAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get destruction detail by destruction id. -An
        /// </summary>
        /// <param name="destructionId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemdestructiondetailbydesturctionid")]
        public IHttpActionResult GetItemDestructionDetailByDestructionId(int destructionId)
        {
            try
            {
                List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                ItemDestructionDetailAC itemDestructionDetailAC = new ItemDestructionDetailAC();
                var itemDestructionDetial = _iItemDestructionRequestRepository.GetDestructionById(destructionId);
                if (itemDestructionDetial != null)
                {
                    itemDestructionDetailAC.Branch = itemDestructionDetial.BranchDetail.Name;
                    itemDestructionDetailAC.Cause = itemDestructionDetial.ParamType.ValueEn;
                    itemDestructionDetailAC.RequestedDate = itemDestructionDetial.CreatedDateTime.ToString("dd-MM-yyyy hh:mm");
                    itemDestructionDetailAC.RequestNo = itemDestructionDetial.RequestNo;
                    itemDestructionDetailAC.SupplierCode = itemDestructionDetial.SupplierProfile.Code;
                    itemDestructionDetailAC.SupplierName = itemDestructionDetial.SupplierProfile.NameEn;
                    if (itemDestructionDetial.IsInitiatedBysupplier)
                        itemDestructionDetailAC.InitiatedBy = StringConstants.Supplier;
                    else
                        itemDestructionDetailAC.InitiatedBy = StringConstants.Owner;
                    List<ItemDestructionDetail> listOfItemDestructionDetail = _iItemDestructionRequestRepository.GetItemDestructionDetials(destructionId);
                    int total = 0;
                    decimal totalPrice = 0;
                    foreach (var item in listOfItemDestructionDetail)
                    {
                        ItemProfileAC itemProfileAC = new ItemProfileAC();
                        itemProfileAC.Id = item.ItemId;
                        itemProfileAC.ItemNameEn = item.ItemProfile.ItemNameEn;
                        itemProfileAC.Barcode = item.ItemProfile.Barcode;
                        itemProfileAC.FlavourEn = item.ItemProfile.FlavourEn;
                        itemProfileAC.Unit = item.ItemProfile.SystemParameter.ValueEn;
                        itemProfileAC.CostPrice = item.CostPrice;
                        itemProfileAC.DestructionQuantity = item.DestructionQuantity;
                        itemProfileAC.TotalCostPrice = (item.CostPrice * item.DestructionQuantity);
                        total = total + itemProfileAC.DestructionQuantity;
                        totalPrice = totalPrice + itemProfileAC.TotalCostPrice;
                        listOfItemProfileAC.Add(itemProfileAC);
                    }
                    itemDestructionDetailAC.TotalQuantity = total;
                    itemDestructionDetailAC.TotalCostPrice = totalPrice;
                    itemDestructionDetailAC.listOfItemProfileAC = listOfItemProfileAC;
                    var workFlowLog = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(itemDestructionDetial.RecordId);
                    if (workFlowLog != null)
                    {
                        if (workFlowLog.WorkFlowDetail.Activity.Name == StringConstants.Review && workFlowLog.WorkFlowDetail.IsApproval)
                            itemDestructionDetailAC.IsPandingApproval = true;

                        if (workFlowLog.WorkFlowDetail.AssignedId == MerchantContext.UserDetails.RoleId)
                            itemDestructionDetailAC.IsAllowApproval = true;
                        else
                            itemDestructionDetailAC.IsDeleted = true;

                        if (workFlowLog.WorkFlowDetail.IsClosed || workFlowLog.WorkFlowDetail.NextActivity.IsClosed)
                            itemDestructionDetailAC.IsClosed = true;
                        else
                        {
                            if (workFlowLog.WorkFlowDetail.IsApprovePanel && workFlowLog.WorkFlowDetail.IsChildAction)
                                itemDestructionDetailAC.IsApproval = true;

                            if (workFlowLog.WorkFlowDetail.IsChildAction && workFlowLog.WorkFlowDetail.IsRejectPanel && itemDestructionDetailAC.IsAllowApproval)
                                itemDestructionDetailAC.IsReject = true;

                        }
                    }
                    if (itemDestructionDetial.IsDelete)
                        itemDestructionDetailAC.IsDeleted = true;
                }
                return Ok(itemDestructionDetailAC);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get destruction action list. -An
        /// </summary>
        /// <param name="destructionId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getactionlist")]
        public IHttpActionResult GetActionList(int destructionId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<WorkFlowActionAC> listOfWorkFlowActionAc = new List<WorkFlowActionAC>();
                    Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(destructionId);
                    if (destruction != null)
                    {
                        List<WorkFlowLog> listOfWrkFlow = _iParentRecordsRepository.GetListOfWorkFlowLogByRecordId(destruction.RecordId);
                        foreach (var item in listOfWrkFlow)
                        {
                            WorkFlowActionAC workFlowActionAc = new WorkFlowActionAC();
                            workFlowActionAc.Id = item.Id;
                            var roleDetail = _iRoleRepository.GetRoleById(item.RoleId);
                            if (roleDetail != null)
                            {
                                workFlowActionAc.Role = roleDetail.RoleName;
                                workFlowActionAc.RoleId = roleDetail.Id;
                            }
                            workFlowActionAc.Comments = item.Comments;
                            workFlowActionAc.ActionDate = item.CreatedDateTime;
                            workFlowActionAc.Action = item.Action;
                            workFlowActionAc.Stage = item.Stage;
                            UserDetail userDetail = _userDetailRepository.GetUserDetailUserId(item.UserId);
                            if (userDetail != null)
                                workFlowActionAc.UserName = userDetail.UserName;

                            listOfWorkFlowActionAc.Add(workFlowActionAc);
                        }
                    }
                    return Ok(listOfWorkFlowActionAc);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for approve item destruction. -An
        /// </summary>
        /// <param name="itemDestructionDetailApprovalAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("approveitemdestructionrequest")]
        public IHttpActionResult ApproveItemDestruction(ItemDestructionDetailApprovalAC itemDestructionDetailApprovalAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {

                    ItemDestructionApprovalAC itemDestructionApproval = new ItemDestructionApprovalAC();
                    Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(itemDestructionDetailApprovalAC.destructionId);
                    if (destruction != null)
                    {
                        if (destruction.IsDelete || _iWorkFlowDetailsRepository.CheckLastActionPerform(destruction.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                        var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(destruction.RecordId, StringConstants.ApprovAction, itemDestructionDetailApprovalAC.Comment, MerchantContext.UserDetails, true);
                        if (activityWorkFlow != null)
                        {
                            var workFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailById(activityWorkFlow.WorkFlowId);
                            bool isApprove = false;
                            if (workFlowDetail.IsClosed)
                                isApprove = true;

                            if (workFlowDetail.NextActivity.IsClosed)
                                isApprove = true;

                            if (isApprove)
                            {
                                int branchId = 0;
                                branchId = destruction.BranchId != null ? Convert.ToInt32(destruction.BranchId) : Convert.ToInt32(MerchantContext.UserDetails.BranchId);

                                #region Created CreditNotes
                                if (destruction.IsInitiatedBysupplier)
                                    itemDestructionApproval = CreateCreditNote(itemDestructionApproval, branchId, destruction);

                                #endregion

                                #region Collected Item Destruction Receipt Data
                                itemDestructionApproval.ApprovedBy = MerchantContext.UserDetails.UserName;
                                itemDestructionApproval.ComapnyAddress = destruction.BranchDetail.Address;
                                itemDestructionApproval.BranchName = destruction.BranchDetail.Name;
                                itemDestructionApproval.CreatedDateTime = destruction.CreatedDateTime;
                                itemDestructionApproval.ReceiptNumber = destruction.RequestNo;
                                itemDestructionApproval.Invoice = InvoiceToHtml.get39(destruction.RequestNo, 1.5, 20);
                                itemDestructionApproval.SupplierMobileNumber = destruction.SupplierProfile.Phone;
                                itemDestructionApproval.SupplierName = destruction.SupplierProfile.NameEn;
                                List<ItemDestructionDetail> listOfItemDestruction = _iItemDestructionRequestRepository.GetItemDestructionDetials(destruction.Id);
                                List<ItemProfileAC> listOfItemProfile = new List<ItemProfileAC>();
                                decimal totalAmount = 0;
                                int totalQuantity = 0;
                                foreach (var item in listOfItemDestruction)
                                {
                                    ItemProfileAC itemProfileAC = new ItemProfileAC();
                                    itemProfileAC.Id = item.ItemId;
                                    itemProfileAC.CostPrice = item.CostPrice;
                                    itemProfileAC.ItemNameEn = item.ItemProfile.ItemNameEn;
                                    itemProfileAC.Unit = item.ItemProfile.SystemParameter.ValueEn;
                                    itemProfileAC.FlavourEn = item.ItemProfile.FlavourEn;
                                    itemProfileAC.DestructionQuantity = item.DestructionQuantity;
                                    itemProfileAC.DestructionCause = item.Desturction.ParamType.ValueEn;
                                    totalQuantity = totalQuantity + itemProfileAC.DestructionQuantity;
                                    totalAmount = totalAmount + (itemProfileAC.CostPrice * itemProfileAC.DestructionQuantity);
                                    listOfItemProfile.Add(itemProfileAC);
                                }
                                itemDestructionApproval.TotalAmount = totalAmount;
                                itemDestructionApproval.TotalQuantity = totalQuantity;
                                itemDestructionApproval.listOfItemProdileAC = listOfItemProfile;

                                #endregion

                                List<ItemDestructionDetail> listOfItemDesturction = _iItemDestructionRequestRepository.GetItemDestructionDetials(itemDestructionDetailApprovalAC.destructionId);
                                decimal totalCostPrice = 0;
                                foreach (var item in listOfItemDesturction)
                                {
                                    _iItemRepository.UpdateItemQuantity(item.ItemProfile, branchId, item.DestructionQuantity, MerchantContext.CompanyDetails, MerchantContext.UserDetails);
                                    totalCostPrice = totalCostPrice + item.CostPrice;
                                }
                                var itemName = string.Join(",", listOfItemDestruction.Select(x => x.ItemProfile.ItemNameEn));

                                #region Accounting Portion
                                InsertIntoAccountEntries(destruction, totalCostPrice, itemName);
                                #endregion

                                itemDestructionApproval.IsResult = "true";
                            }
                            return Ok(new { _isResult = itemDestructionApproval });
                        }
                        itemDestructionApproval.IsResult = "NotExists";
                    }
                    return Ok(new { _isResult = itemDestructionApproval });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for reject item destruction. -An
        /// </summary>
        /// <param name="itemDestructionDetailApprovalAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("rejectitemdestructionrequest")]
        public IHttpActionResult RejectItemDestructionRequest(ItemDestructionDetailApprovalAC itemDestructionDetailApprovalAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(itemDestructionDetailApprovalAC.destructionId);
                    if (destruction != null)
                    {
                        if (destruction.IsDelete || _iWorkFlowDetailsRepository.CheckLastActionPerform(destruction.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                        destruction.IsDelete = true;
                        _iItemDestructionRequestRepository.UpdateDestruction(destruction);
                        return Ok(new { _isResult = true });
                    }
                    return Ok(new { _isResult = false });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for return item destruction request(delete item destruction request.) -An
        /// </summary>
        /// <param name="itemDestructionDetailApprovalAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("returnitemdestructionrequest")]
        public IHttpActionResult ReturnItemDestructionRequest(ItemDestructionDetailApprovalAC itemDestructionDetailApprovalAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(itemDestructionDetailApprovalAC.destructionId);
                    if (destruction != null)
                    {
                        if (destruction.IsDelete || _iWorkFlowDetailsRepository.CheckLastActionPerform(destruction.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                        var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(Convert.ToInt32(destruction.RecordId), StringConstants.ReturnAction, itemDestructionDetailApprovalAC.Comment, MerchantContext.UserDetails, false);
                        if (activityWorkFlow != null)
                        {
                            return Ok(new { _isResult = true });
                        }
                    }
                    return Ok(new { _isResult = "NotExists" });
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used fro item destruction requset by id. -An
        /// </summary>
        /// <param name="destructionId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("itemdestructionrequestbyid")]
        public IHttpActionResult ItemDestructionRequset(int destructionId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(destructionId);
                    if (destruction != null)
                    {
                        ItemDestructionRequestAC itemDestructionRequestAC = new ItemDestructionRequestAC();
                        itemDestructionRequestAC.branchId = destruction.BranchId != null ? Convert.ToInt32(destruction.BranchId) : 0;
                        itemDestructionRequestAC.destructioCasueId = destruction.DestructionCauseId;
                        if (destruction.IsInitiatedBysupplier)
                            itemDestructionRequestAC.intiatedId = 1;
                        else
                            itemDestructionRequestAC.intiatedId = 2;

                        List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                        List<ItemDestructionDetail> listOfItemDestructionDetail = _iItemDestructionRequestRepository.GetItemDestructionDetials(destructionId);
                        foreach (var item in listOfItemDestructionDetail)
                        {
                            ItemProfileAC itemProfileAc = new ItemProfileAC();
                            itemProfileAc.Barcode = item.ItemProfile.Barcode;
                            itemProfileAc.ItemNameEn = item.ItemProfile.ItemNameEn;
                            itemProfileAc.ItemType = item.ItemProfile.Category.BrandParamType.ValueEn + "-" + item.ItemProfile.Category.GroupParamType.ValueEn;
                            itemProfileAc.UnitParamTypeId = item.ItemProfile.UnitParamTypeId;
                            itemProfileAc.Unit = item.ItemProfile.SystemParameter.ValueEn;
                            itemProfileAc.Id = item.ItemProfile.Id;
                            itemProfileAc.ItemProfileId = item.ItemProfile.Id;
                            itemProfileAc.CategoryId = item.ItemProfile.CategoryId;
                            itemProfileAc.BaseUnit = item.ItemProfile.BaseUnit;
                            itemProfileAc.IsParentItem = item.ItemProfile.IsParentItem;
                            itemProfileAc.CostPrice = item.CostPrice;
                            itemProfileAc.ItemProfileId = item.Id;
                            itemProfileAc.DestructionQuantity = item.DestructionQuantity;
                            itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(item.ItemId);
                            var itemQuantity = _iItemRepository.GetItemQuantityByItemId(item.ItemId, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                            itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                            itemProfileAc.ActualQuantity = itemQuantity.ActualQuantity;

                            if (item.ItemProfile.IsParentItem)
                            {
                                itemProfileAc.UpdateSystemQunatity = itemProfileAc.SystemQuantity;
                                itemProfileAc.ParentItemId = item.ItemProfile.Id;
                            }
                            else
                            {
                                var subItemQuantity = _iItemRepository.GetItemQuantityByItemId(Convert.ToInt32(item.ItemProfile.ParentItemId), Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                                decimal systemQuantity = subItemQuantity != null ? (subItemQuantity.ActualQuantity / item.ItemProfile.BaseUnit) : 0;
                                itemProfileAc.SystemQuantity = Math.Floor(systemQuantity);
                                itemProfileAc.UpdateSystemQunatity = subItemQuantity != null ? Convert.ToInt32(subItemQuantity.ActualQuantity) : 0;
                                itemProfileAc.ParentItemId = item.ItemProfile.ParentItemId;
                            }
                            itemProfileAc.SupplierName = destruction.SupplierProfile.NameEn;
                            itemProfileAc.SupplierId = destruction.SupplierId;
                            listOfItemProfileAC.Add(itemProfileAc);
                        }
                        itemDestructionRequestAC.listOfItemProfileAC = listOfItemProfileAC;

                        return Ok(new { _isResult = itemDestructionRequestAC });
                    }
                    return Ok(new { _isResult = false });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for update destruction item. -An
        /// </summary>
        /// <param name="itemDestructionRequestAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("updatedestructionitem")]
        public IHttpActionResult UpdateItemDestructionRequest(ItemDestructionRequestAC itemDestructionRequestAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.DestructionItem, MerchantContext.CompanyDetails.Id);
                    if (listOfWorkFlowDetail.Any())
                    {
                        Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(itemDestructionRequestAC.destructionId);
                        if (destruction != null && (destruction.IsDelete || _iWorkFlowDetailsRepository.CheckLastActionPerform(destruction.RecordId, StringConstants.ReturnAction, MerchantContext.UserDetails.RoleId)))
                            return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                        var activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.InitiatorId == MerchantContext.UserDetails.RoleId && x.IsParentAction);
                        if (activityWorkFlow != null)
                        {
                            Destruction destructionObj = new Destruction();
                            if (destruction != null)
                            {
                                if (itemDestructionRequestAC.intiatedId == 1)
                                    destruction.IsInitiatedBysupplier = true;
                                else
                                    destruction.IsInitiatedBysupplier = false;

                                destruction.BranchId = itemDestructionRequestAC.branchId;
                                destruction.DestructionCauseId = itemDestructionRequestAC.destructioCasueId;

                                //Deleted Old Item Destruction Detail.-An
                                List<ItemDestructionDetail> listOfItemDestructionDetail = _iItemDestructionRequestRepository.GetItemDestructionDetials(itemDestructionRequestAC.destructionId);
                                foreach (var item in listOfItemDestructionDetail)
                                {
                                    _iItemDestructionRequestRepository.DeleteItemDestructionDetail(item.Id);
                                }

                                var itemDestructionList = itemDestructionRequestAC.listOfItemProfileAC.GroupBy(x => x.SupplierId);
                                foreach (var item in itemDestructionList)
                                {
                                    WorkFlowLog workFLowLogDetail = new WorkFlowLog();
                                    if (item.Key != destruction.SupplierId)//if already exists item destruction supplier and updated supplier are not same then add otherwise update.
                                    {
                                        ParentRecord parentRecords = new ParentRecord();
                                        parentRecords.BranchId = itemDestructionRequestAC.branchId;
                                        parentRecords.CreatedDateTime = DateTime.UtcNow;
                                        parentRecords.InitiationComment = itemDestructionRequestAC.comment;
                                        parentRecords.InitiationDate = parentRecords.CreatedDateTime;
                                        parentRecords.InitiatorId = MerchantContext.UserDetails.UserId;
                                        parentRecords.ModificationDate = parentRecords.CreatedDateTime;
                                        parentRecords.ModifiedUserId = parentRecords.InitiatorId;
                                        parentRecords.WorkFlowId = activityWorkFlow.Id;
                                        int recordId = _iParentRecordsRepository.AddParentRecords(parentRecords);


                                        if (itemDestructionRequestAC.intiatedId == 1)
                                            destructionObj.IsInitiatedBysupplier = true;
                                        else
                                            destructionObj.IsInitiatedBysupplier = false;
                                        destructionObj.BranchId = itemDestructionRequestAC.branchId;
                                        destructionObj.DestructionCauseId = itemDestructionRequestAC.destructioCasueId;
                                        destructionObj.SupplierId = item.Key;
                                        List<Destruction> listOfTodayDestrutionRquest = _iItemDestructionRequestRepository.GetTodayItemDestructionListByBranchId(Convert.ToInt32(itemDestructionRequestAC.branchId));
                                        DateTime dt = DateTime.UtcNow;
                                        destructionObj.RequestNo = "Req" + dt.Day.ToString() + dt.Month.ToString() + dt.Year.ToString() + (listOfTodayDestrutionRquest.Count + 1);
                                        destructionObj.CreatedDateTime = DateTime.UtcNow;
                                        destructionObj.RecordId = recordId;
                                        workFLowLogDetail.RecordId = recordId;

                                    }
                                    else
                                        workFLowLogDetail.RecordId = destruction.RecordId;

                                    workFLowLogDetail.Action = "Updated";
                                    workFLowLogDetail.Stage = "Updated" + " By" + (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "");
                                    workFLowLogDetail.UserId = MerchantContext.UserDetails.UserId;
                                    workFLowLogDetail.WorkFlowId = activityWorkFlow.Id;
                                    workFLowLogDetail.RoleId = MerchantContext.UserDetails.RoleId;
                                    workFLowLogDetail.CreatedDateTime = DateTime.UtcNow;
                                    workFLowLogDetail.Comments = itemDestructionRequestAC.comment;
                                    int workFlowId = _iParentRecordsRepository.AddWorkFlowLogs(workFLowLogDetail);
                                    int destructionId = 0;
                                    if (workFlowId != 0)
                                    {
                                        if (item.Key != destruction.SupplierId)//if same supplier so add other wise update
                                        {
                                            Destruction newDestruction = _iItemDestructionRequestRepository.AddDestruction(destructionObj);
                                            destructionId = newDestruction.Id;
                                        }
                                        else
                                            destructionId = _iItemDestructionRequestRepository.UpdateDestruction(destruction);
                                    }
                                    List<ItemProfileAC> listOfItemProfileAc = item.ToList();
                                    foreach (var itemOfDestruction in listOfItemProfileAc)
                                    {
                                        ItemDestructionDetail itemDestructionDetail = new ItemDestructionDetail();
                                        itemDestructionDetail.CostPrice = itemOfDestruction.CostPrice;
                                        itemDestructionDetail.CreatedDateTime = DateTime.UtcNow;
                                        itemDestructionDetail.DestructionId = destructionId;
                                        itemDestructionDetail.DestructionQuantity = itemOfDestruction.DestructionQuantity;
                                        itemDestructionDetail.ItemId = itemOfDestruction.Id;
                                        _iItemDestructionRequestRepository.AddDestructionItem(itemDestructionDetail);
                                    }
                                }
                                return Ok(new { _isResult = true });
                            }
                        }
                    }
                    return Ok(new { _isResult = "NotExists" });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("resubmititemdestruction")]
        public IHttpActionResult ReSubmitItemDestruction(ItemDestructionRequestAC itemDestructionRequestAC)
        {
            try
            {
                Destruction destruction = _iItemDestructionRequestRepository.GetDestructionById(itemDestructionRequestAC.destructionId);
                if (destruction != null)
                {
                    if (destruction.IsDelete || _iWorkFlowDetailsRepository.CheckLastActionPerform(destruction.RecordId, StringConstants.ReturnAction, MerchantContext.UserDetails.RoleId))
                        return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                    var workflowDetails = _iWorkFlowDetailsRepository.GetResubmitActionWorkFlow(destruction.RecordId, destruction, destruction, StringConstants.ReSubmitedAction, itemDestructionRequestAC.comment, MerchantContext.UserDetails);
                    if (workflowDetails != null)
                    {
                        return Ok(new { _isResult = true });
                    }
                    return Ok(new { _isResult = "NotExists" });
                }
                return Ok(new { _isResult = false });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        #region Private methods

        /// <summary>
        /// This method used for create Credit Notes. -An
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="destruction"></param>
        private ItemDestructionApprovalAC CreateCreditNote(ItemDestructionApprovalAC itemDestructionApproval, int branchId, Destruction destruction)
        {
            try
            {
                CreditNoteDetail creditNoteDetail = new CreditNoteDetail();
                List<CreditNoteDetail> listOfCreditNotes = _ICreditNoteRepository.GetTodayListOfCreditNotes(branchId, Convert.ToInt32(CreditNoteType.SupplierDestructionNote));
                DateTime dt = DateTime.UtcNow;
                creditNoteDetail.CreditNoteNo = "CR" + dt.Day.ToString() + dt.Month.ToString() + dt.Year.ToString() + (listOfCreditNotes.Count + 1);
                creditNoteDetail.BranchId = branchId;
                creditNoteDetail.CreatedDateTime = dt;
                creditNoteDetail.InitiationComment = "Created Credit Notes For Item Destruction By" + " " + MerchantContext.UserDetails.UserName;
                creditNoteDetail.InitiationDate = dt;
                creditNoteDetail.TypeId = Convert.ToInt32(CreditNoteType.SupplierDestructionNote);
                decimal totalPrice = 0;
                List<ItemDestructionDetail> listOfItemDestructionDetail = _iItemDestructionRequestRepository.GetItemDestructionDetials(destruction.Id);
                foreach (var item in listOfItemDestructionDetail)
                {
                    totalPrice = (item.CostPrice * item.DestructionQuantity) + totalPrice;
                }
                creditNoteDetail.Amount = totalPrice;
                int creditNoteId = _ICreditNoteRepository.AddCreditNoteDetail(creditNoteDetail);
                if (creditNoteId != 0)
                {
                    foreach (var item in listOfItemDestructionDetail)
                    {
                        CreditNoteItem creditNoteItem = new CreditNoteItem();
                        creditNoteItem.CostPrice = item.CostPrice;
                        creditNoteItem.CreatedDateTime = DateTime.UtcNow;
                        creditNoteItem.CreditNoteId = creditNoteId;
                        creditNoteItem.ItemId = item.ItemId;
                        creditNoteItem.Quantity = item.DestructionQuantity;
                        _ICreditNoteRepository.AddCreditNotesItem(creditNoteItem);
                    }
                    itemDestructionApproval.CreditNoteNumber = creditNoteDetail.CreditNoteNo;
                    itemDestructionApproval.Amount = creditNoteDetail.Amount;
                    ItemDestructionCreditNote itemDestruction = new ItemDestructionCreditNote();
                    itemDestruction.CreatedDateTime = DateTime.UtcNow;
                    itemDestruction.CreditNoteId = creditNoteId;
                    itemDestruction.DestructionId = destruction.Id;
                    _ICreditNoteRepository.AddCreditNoteDestruciton(itemDestruction);
                }
                return itemDestructionApproval;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for insert into account entroes table.-An
        /// </summary>
        /// <param name="destruction"></param>
        /// <param name="totalCostPrice"></param>
        private void InsertIntoAccountEntries(Destruction destruction, decimal totalCostPrice, string itemName)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                var branchDetail = _iBranchRepository.GetBranchById(Convert.ToInt32(destruction.BranchId));
                if (destruction.IsInitiatedBysupplier)//check initiatedBySupplier.
                {
                    var ledgersForSupplier = _iAccountingRepository.GetAccountLedgerBySupplier(destruction.SupplierId);
                    var ledgersForCreditNote = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CRNote, Convert.ToInt32(destruction.BranchId));
                    if (ledgersForSupplier != null && ledgersForCreditNote != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForSupplier.Id, TransactionDate = DateTime.UtcNow, Credit = totalCostPrice, Debit = 0, ActivityName = StringConstants.DestructionItem, CreatedDateTime = DateTime.UtcNow, Description = "for " + itemName + " item of " + branchDetail.Name + " branch initiated by supplier" });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCreditNote.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalCostPrice, ActivityName = StringConstants.DestructionItem, CreatedDateTime = DateTime.UtcNow, Description = "for " + itemName + " item of " + branchDetail.Name + " branch initiated by supplier" });
                    }
                }
                else
                {
                    var ledgerStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(destruction.BranchId));
                    var ledgersForMiscLoss = _iAccountingRepository.GetAccountLedgerByName(StringConstants.Loss, Convert.ToInt32(destruction.BranchId));
                    if (ledgersForMiscLoss != null && ledgerStockInHand != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgerStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = totalCostPrice, Debit = 0, ActivityName = StringConstants.DestructionItem, CreatedDateTime = DateTime.UtcNow, Description = "for " + itemName + " item of " + branchDetail.Name + " branch initiated by owner" });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForMiscLoss.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalCostPrice, ActivityName = StringConstants.DestructionItem, CreatedDateTime = DateTime.UtcNow, Description = "for " + itemName + " item of " + branchDetail.Name + " branch initiated by owner" });

                    }
                }

                if (listOfDoubleEntry.Any())
                    _iAccountingRepository.AddAccountingEntries(listOfDoubleEntry);
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

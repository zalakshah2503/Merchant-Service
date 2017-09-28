using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.DomainModel.Models.Company;

namespace MerchantService.Repository.Modules.Supplier
{
    public class SupReturnWorkListRepository : ISupReturnWorkListRepository
    {
        #region Private Variable
        private readonly IDataRepository<SupplierReturnDetail> _supplierReturnDetailContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<SupplierReturnItem> _supplierReturnItemContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<SupplierReturnCreditNote> _supplierReturnCreditNoteContext;
        private readonly IDataRepository<CreditNoteDetail> _creditNoteDetailContext;
        private readonly IDataRepository<CreditNoteItem> _creditNoteItemContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailContext;
        private readonly IWorkFlowDetailsRepository _IWorkFlowDetailsRepository;
        private readonly IItemRepository _iItemRepository;
        private readonly IAccountingRepository _iAccountingRepository;
        private readonly IErrorLog _errorLog;
        private readonly IItemRepository _itemRepository;

        #endregion

        #region Constructor
        public SupReturnWorkListRepository(IDataRepository<ParamType> paramTypeContext, IDataRepository<WorkFlowLog> workFlowLogContext,
            IAccountingRepository iAccountingRepository, IItemRepository iItemRepository, IDataRepository<UserDetail> userDetailContext,
            IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<ItemProfile> itemProfileContext, IErrorLog errorLog,
            IWorkFlowDetailsRepository IWorkFlowDetailsRepository, IDataRepository<CreditNoteItem> creditNoteItemContext,
            IDataRepository<CreditNoteDetail> creditNoteDetailContext, IDataRepository<SupplierReturnCreditNote> supplierReturnCreditNoteContext,
            IDataRepository<WorkFlowDetail> workFlowDetailContext, IDataRepository<SupplierReturnDetail> supplierReturnDetailContext,
            IDataRepository<SupplierReturnItem> supplierReturnItemContext, IItemRepository itemRepository)
        {
            _supplierReturnDetailContext = supplierReturnDetailContext;
            _userDetailContext = userDetailContext;
            _supplierReturnItemContext = supplierReturnItemContext;
            _supplierReturnCreditNoteContext = supplierReturnCreditNoteContext;
            _creditNoteDetailContext = creditNoteDetailContext;
            _creditNoteItemContext = creditNoteItemContext;
            _itemProfileContext = itemProfileContext;
            _iItemRepository = iItemRepository;
            _workFlowDetailContext = workFlowDetailContext;
            _itemQuantityContext = itemQuantityContext;
            _iAccountingRepository = iAccountingRepository;
            _IWorkFlowDetailsRepository = IWorkFlowDetailsRepository;
            _workFlowLogContext = workFlowLogContext;
            _paramTypeContext = paramTypeContext;
            _errorLog = errorLog;
            _itemRepository = itemRepository;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// This method is used for fetching supplier return request list from database. - JJ
        /// </summary>   
        /// <param name="BranchId">branch id of the currently logged in user</param>
        /// <param name="CompanyId"></param>
        /// <param name="IsAllow">whether is allowed to fetch details of other branches</param>
        /// <returns>list of objects of SupplierReturnRequest</returns>
        public List<SupplierReturnRequest> GetSupReturnWorkList(int CompanyId, bool IsAllow, int? BranchId)
        {
            try
            {
                var date = DateTime.UtcNow.Subtract(TimeSpan.FromDays(14));
                var isInList = false;
                var supplierReturn = new List<SupplierReturnDetail>();
                if (IsAllow)
                    supplierReturn = _supplierReturnDetailContext.Fetch(x => x.BranchDetail.CompanyId == CompanyId).OrderByDescending(x => x.CreatedDateTime).ToList();
                else
                    supplierReturn = _supplierReturnDetailContext.Fetch(x => x.BranchDetail.Id == BranchId).OrderByDescending(x => x.CreatedDateTime).ToList();
                var supplierReturnList = new List<SupplierReturnRequest>();

                foreach (var detail in supplierReturn)
                {
                    isInList = false;
                    if (detail.RejectedDate != null)
                    {
                        if (detail.RejectedDate > date)
                            isInList = true;
                    }
                    else
                    {
                        isInList = false;
                        var log = _workFlowLogContext.Fetch(x => x.RecordId == detail.RecordId).ToList().LastOrDefault();
                        if (log != null)
                        {
                            var workFlow = _workFlowDetailContext.Find(log.WorkFlowId);
                            if (workFlow != null)
                            {
                                if (workFlow.NextActivityId == 3)
                                {
                                    if (detail.LastActivityDate != null && detail.LastActivityDate > date)
                                    {
                                        isInList = true;
                                    }
                                }
                                else
                                    isInList = true;
                            }
                        }
                    }
                    if (isInList)
                    {
                        var supplierReturnDetail = new SupplierReturnRequest
                        {
                            SupplierReturnId = detail.Id,
                            BranchId = detail.BranchId,
                            BranchName = detail.BranchDetail.Name,
                            Initiator = detail.Initiator.FullName,
                            InitiationDate = detail.CreatedDateTime,
                            RequestNo = detail.RequestNo,
                            IsRejected = detail.IsRejected,
                            IsDeleted = detail.IsDeleted,
                            SupplierId = detail.SupplierId,
                            SupplierName = detail.SupplierProfile.NameEn,
                            Action = GetActionName(detail.RecordId)
                        };
                        supplierReturnList.Add(supplierReturnDetail);
                    }
                }
                return supplierReturnList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for approve/return Supplier Return Request. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="user"> Currently logged in userDetail </param>
        /// <param name="status"></param>
        /// <param name="SupplierReturnId"></param>
        /// <param name="companyDetails"></param>
        /// <returns>status</returns>
        public string ApprovalSupplierReturn(string Comment, int RecordId, UserDetail user, bool status, int SupplierReturnId, CompanyDetail companyDetails)
        {
            try
            {
                var supplierReturnDetail = _supplierReturnDetailContext.Find(SupplierReturnId);
                if (supplierReturnDetail.IsRejected)
                    return "Supplier Return Request is already Rejected";
                else
                {
                    if (supplierReturnDetail.IsDeleted)
                        return "Supplier Return Request is already Deleted";
                    else
                    {
                        var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                        var prevActivity = log.WorkFlowDetail.NextActivity.AcceptPermission;
                        if (log.WorkFlowDetail.AssignedId == user.RoleId)
                        {
                            if (Comment == ".")
                                Comment = null;
                            if (status)
                            {
                                var loger = _IWorkFlowDetailsRepository.GetApprovalActionWorkFLow(RecordId, StringConstants.ApprovAction, Comment, user, status);
                                if (loger == null)
                                    return StringConstants.WorkFlowNotCreated;
                            }
                            else
                            {
                                var loger = _IWorkFlowDetailsRepository.GetApprovalActionWorkFLow(RecordId, StringConstants.ReturnAction, Comment, user, status);
                                if (loger == null)
                                    return StringConstants.WorkFlowNotCreated;
                            }

                            supplierReturnDetail.LastActivityDate = DateTime.UtcNow;
                            supplierReturnDetail.ModifiedDateTime = DateTime.UtcNow;
                            _supplierReturnDetailContext.Update(supplierReturnDetail);
                            _supplierReturnDetailContext.SaveChanges();

                            log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                            var outcome = false;
                            var update = false;
                            var isPrint = false;
                            if (status && prevActivity.Equals(StringConstants.FurtherApproval) && log.WorkFlowDetail.NextActivity.IsClosed)
                            {
                                isPrint = true;
                                outcome = IssueCreditNote(SupplierReturnId, supplierReturnDetail.BranchId, supplierReturnDetail.BranchDetail.CompanyId, Comment);
                                update = UpdateItemQuantity(SupplierReturnId, (int)supplierReturnDetail.BranchId, false, companyDetails, user);
                                InsertIntoAccountEntries(supplierReturnDetail.Id, (int)supplierReturnDetail.BranchId);
                                SetItemBit(supplierReturnDetail.Id);
                                if (outcome && update)
                                {
                                    if (isPrint)
                                        return "print";
                                    else
                                        return "ok";
                                }
                                else
                                {
                                    if (!outcome)
                                        return "Error in Issueing Credit Note";
                                    else
                                        return "Error in Updating Item Quantity";
                                }
                            }
                            else
                            {
                                if (log.WorkFlowDetail.NextActivity.IsClosed)
                                    SetItemBit(supplierReturnDetail.Id);
                                return "ok";
                            }
                        }
                        else
                            return StringConstants.WorkFlowNotCreated;
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
        /// This method is used for reject Supplier Return Request. - JJ
        /// </summary>
        /// <param name="Id">Id of SupplierReturnRequestDetail</param>
        /// <param name="Comment"></param>
        /// <param name="RejectorId">id of the user who rejects</param>
        /// <returns>status</returns>
        public string RejectSupplierReturn(int Id, int RejectorId, string Comment)
        {
            try
            {
                var supplierReturn = _supplierReturnDetailContext.Find(Id);
                if (Comment == ".")
                    Comment = null;
                if (supplierReturn != null)
                {
                    if (!supplierReturn.IsDeleted)
                    {
                        if (!supplierReturn.IsRejected)
                        {
                            supplierReturn.IsRejected = true;
                            supplierReturn.RejectorId = RejectorId;
                            supplierReturn.Comment = Comment;
                            supplierReturn.RejectedDate = DateTime.UtcNow;
                            supplierReturn.LastActivityDate = DateTime.UtcNow;
                            supplierReturn.ModifiedDateTime = DateTime.UtcNow;
                            _supplierReturnDetailContext.Update(supplierReturn);
                            _supplierReturnDetailContext.SaveChanges();
                            SetItemBit(supplierReturn.Id);
                            return "ok";
                        }
                        else
                            return "Supplier Return Request is already Rejected";
                    }
                    else
                        return "Supplier Return Request is already Deleted";
                }
                else
                    return "Supplier Return Request Not Found";
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method is used for delete Supplier Return Request. - JJ
        /// </summary>
        /// <param name="Id">Id of SupplierReturnRequestDetail</param>
        /// <param name="userName">username of the current logged in user</param>
        /// <param name="Comment"></param>
        /// <returns>status</returns>
        public string DeleteSupplierReturn(int Id, string userName, string Comment)
        {
            try
            {
                var supplierReturn = _supplierReturnDetailContext.Find(Id);
                if (Comment == ".")
                    Comment = null;
                var user = _userDetailContext.Fetch(x => x.UserName == userName && x.IsActive && !x.IsDelete).FirstOrDefault();
                if (user == null)
                    return "You are not authorized to delete this Supplier Return Request";
                else
                {
                    if (supplierReturn != null)
                    {
                        if (user.Id == supplierReturn.InitiatorId)
                        {
                            if (!supplierReturn.IsDeleted)
                            {
                                if (!supplierReturn.IsRejected)
                                {
                                    supplierReturn.IsDeleted = true;
                                    supplierReturn.Comment = Comment;
                                    supplierReturn.RejectedDate = DateTime.UtcNow;
                                    supplierReturn.LastActivityDate = DateTime.UtcNow;
                                    supplierReturn.ModifiedDateTime = DateTime.UtcNow;
                                    _supplierReturnDetailContext.Update(supplierReturn);
                                    _supplierReturnDetailContext.SaveChanges();
                                    SetItemBit(supplierReturn.Id);
                                    return "ok";
                                }
                                else
                                    return "Supplier Return Request is already Rejected";
                            }
                            else
                                return "Supplier Return Request is already Deleted";
                        }
                        else
                            return "You are not authorized to delete this Supplier Return Request";
                    }
                    else
                        return "Supplier Return Request Not Found";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for fetching supplier return request from database. - JJ
        /// </summary>   
        /// <param name="id">id of supplier return detail</param>
        /// <returns>object of SupplierReturnRequest</returns>
        public SupplierReturnRequest GetSupReturnRequest(int id)
        {
            try
            {
                var supplierReturn = _supplierReturnDetailContext.Find(id);
                var log = _IWorkFlowDetailsRepository.GetAllWorkFlowActionList(supplierReturn.RecordId);

                if (supplierReturn.IsRejected || supplierReturn.IsDeleted)
                {
                    var workFlowActionAc = new WorkFlowActionAc();
                    if (supplierReturn.IsRejected)
                    {
                        var rejector = _userDetailContext.Find(supplierReturn.RejectorId);
                        workFlowActionAc.Stage = "Rejected by " + rejector.RoleName;
                        workFlowActionAc.Action = StringConstants.RejectAction;
                        workFlowActionAc.UserName = rejector.UserName;
                        workFlowActionAc.RoleName = rejector.RoleName;
                    }
                    else
                    {
                        workFlowActionAc.Stage = "Deleted by " + supplierReturn.Initiator.RoleName;
                        workFlowActionAc.Action = "Deleted";
                        workFlowActionAc.UserName = supplierReturn.Initiator.UserName;
                        workFlowActionAc.RoleName = supplierReturn.Initiator.RoleName;
                    }
                    workFlowActionAc.Comment = supplierReturn.Comment;
                    workFlowActionAc.ActionDate = String.Format("{0:dd-MM-yyyy}", supplierReturn.RejectedDate);
                    log.Add(workFlowActionAc);
                }
                var supplierReturnItem = ConvertToApplicationClass(_supplierReturnItemContext.Fetch(x => x.SupplierReturnId == id).ToList());
                var supplierReturnRequest = new SupplierReturnRequest
                {
                    BranchId = supplierReturn.BranchId,
                    BranchName = supplierReturn.BranchDetail.Name,
                    InitiationDate = supplierReturn.CreatedDateTime,
                    IsRejected = supplierReturn.IsRejected,
                    RequestNo = supplierReturn.RequestNo,
                    Initiator = supplierReturn.Initiator.FullName,
                    InitiatorId = supplierReturn.InitiatorId,
                    IsDeleted = supplierReturn.IsDeleted,
                    SupplierId = supplierReturn.SupplierId,
                    SupplierName = supplierReturn.SupplierProfile.NameEn,
                    SupplierCode = supplierReturn.SupplierProfile.Code,
                    SupplierReturnId = supplierReturn.Id,
                    SupplierReturnItemAC = supplierReturnItem,
                    RecordId = supplierReturn.RecordId,
                    WorkFlowLog = log
                };
                return supplierReturnRequest;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for Getting details for Supplier Return Request Receipt. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="SupplierReturnId">id of SupplierReturnDetail</param>
        /// <param name="userName">username of the currently logged in user</param>
        /// <returns>object of SupplierReturnReceiptAC</returns>
        public SupplierReturnReceiptAC PrintReceipt(string Comment, int SupplierReturnId, string userName)
        {
            try
            {
                var returnDetail = _supplierReturnDetailContext.Find(SupplierReturnId);
                var creditNote = _supplierReturnCreditNoteContext.Fetch(x => x.SuppierReturnId == SupplierReturnId).FirstOrDefault();
                var returnItem = _supplierReturnItemContext.Fetch(x => x.SupplierReturnId == SupplierReturnId).ToList();
                if (Comment == ".")
                    Comment = "";
                var supplierReturnReceipt = new SupplierReturnReceiptAC
                {
                    ApproverName = userName,
                    BranchAddress = returnDetail.BranchDetail.Address,
                    BranchName = returnDetail.BranchDetail.Name,
                    Date = DateTime.UtcNow,
                    SupplierId = returnDetail.SupplierId,
                    SupplierMobileNo = returnDetail.SupplierProfile.Phone,
                    SupplierName = returnDetail.SupplierProfile.NameEn,
                    ReceiptNo = returnDetail.RequestNo,
                    CreditNoteAmount = creditNote.CreditNoteDetail.Amount,
                    CreditNoteNo = creditNote.CreditNoteDetail.CreditNoteNo,
                    SupplierReturnItemAC = ConvertToApplicationClass(returnItem)
                };
                supplierReturnReceipt.Invoice = InvoiceToHtml.get39(supplierReturnReceipt.ReceiptNo, 1, 20);
                return supplierReturnReceipt;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to update quantity. - JJ
        /// </summary>
        /// <param name="SupplierReturnId">Id of SupplierReturnDetail</param>
        /// <param name="BranchId">Id of Returning Branch</param>
        /// <param name="isAdd"></param>
        /// <param name="companyDetails"></param>
        /// <param name="user"></param>
        /// <returns>status</returns>
        public bool UpdateItemQuantity(int SupplierReturnId, int BranchId, bool isAdd, CompanyDetail companyDetails, UserDetail user)
        {
            try
            {
                var supplierReturnItems = _supplierReturnItemContext.Fetch(x => x.SupplierReturnId == SupplierReturnId).ToList();
                foreach (var returnItem in supplierReturnItems)
                {
                    if (returnItem.ItemProfile.IsParentItem)
                    {
                        if (_itemQuantityContext.Fetch(x => x.ItemId == returnItem.ItemProfile.Id && x.BranchId == BranchId).ToList().Any())
                        {
                            var itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == returnItem.ItemProfile.Id && x.BranchId == BranchId);
                            if (isAdd)
                                itemQuantity.ActualQuantity += (returnItem.ItemProfile.BaseUnit * returnItem.ReturnQuantity);
                            else
                                itemQuantity.ActualQuantity -= (returnItem.ItemProfile.BaseUnit * returnItem.ReturnQuantity);

                            itemQuantity.ModifiedDateTime = DateTime.UtcNow;
                            _itemQuantityContext.Update(itemQuantity);
                            _itemQuantityContext.SaveChanges();

                            GenrateAutomaticSpo(itemQuantity, companyDetails, user);
                        }
                    }
                    else if (_itemQuantityContext.Fetch(x => x.ItemId == returnItem.ItemProfile.ParentItemId && x.BranchId == BranchId).ToList().Any())
                    {
                        var itemQuantity = new ItemQuantity();
                        itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == returnItem.ItemProfile.ParentItemId && x.BranchId == BranchId);
                        if (isAdd)
                            itemQuantity.ActualQuantity += (returnItem.ItemProfile.BaseUnit * returnItem.ReturnQuantity);
                        else
                            itemQuantity.ActualQuantity -= (returnItem.ItemProfile.BaseUnit * returnItem.ReturnQuantity);
                        itemQuantity.ModifiedDateTime = DateTime.UtcNow;
                        _itemQuantityContext.Update(itemQuantity);
                        _itemQuantityContext.SaveChanges();
                        GenrateAutomaticSpo(itemQuantity, companyDetails, user);
                    }
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


        /// <summary>
        /// This method is used to issue credit note. - JJ
        /// </summary>
        /// <param name="SupplierReturnId">Id of SupplierReturnDetail</param>
        /// <param name="BranchId"></param>
        /// <param name="Comment"></param>
        /// <param name="CompanyId"></param>
        /// <returns>status</returns>
        public bool IssueCreditNote(int SupplierReturnId, int? BranchId, int CompanyId, string Comment)
        {
            try
            {
                var supplierReturnItem = _supplierReturnItemContext.Fetch(x => x.SupplierReturnId == SupplierReturnId).ToList();
                var amount = 0M;
                var supplierReturnDetailId = 0;
                foreach (var item in supplierReturnItem)
                {
                    supplierReturnDetailId = item.SupplierReturnId;
                    amount = amount + (item.CostPrice * item.ReturnQuantity);
                }
                var creditNoteDetail = new CreditNoteDetail
                {
                    Amount = amount,
                    BranchId = BranchId,
                    CreatedDateTime = DateTime.UtcNow,
                    InitiationComment = Comment,
                    InitiationDate = DateTime.UtcNow,
                    IsCollected = false,
                    TypeId = _paramTypeContext.FirstOrDefault(x => x.ValueEn == StringConstants.SupplierReturnNote).Id,
                    CreditNoteNo = CreditNoteNumberGenerator(CompanyId)
                };
                _creditNoteDetailContext.Add(creditNoteDetail);
                _creditNoteDetailContext.SaveChanges();

                foreach (var item in supplierReturnItem)
                {
                    var creditNoteItem = new CreditNoteItem
                    {
                        CostPrice = item.CostPrice,
                        CreatedDateTime = DateTime.UtcNow,
                        CreditNoteId = creditNoteDetail.Id,
                        ItemId = item.ItemId,
                        Quantity = item.ReturnQuantity,
                    };
                    _creditNoteItemContext.Add(creditNoteItem);
                    _creditNoteItemContext.SaveChanges();
                }

                var supoplierReturnCreditNote = new SupplierReturnCreditNote
                {
                    CreatedDateTime = DateTime.UtcNow,
                    CreditNoteId = creditNoteDetail.Id,
                    SuppierReturnId = supplierReturnDetailId
                };
                _supplierReturnCreditNoteContext.Add(supoplierReturnCreditNote);
                _supplierReturnCreditNoteContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for generating credit note number - jj
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns>CreditNoteNo</returns>
        public string CreditNoteNumberGenerator(int companyId)
        {
            try
            {
                var date = DateTime.UtcNow.ToString("ddMMyyyy");
                var num = _creditNoteDetailContext.Fetch(x => x.CreditNoteNo.Contains(date)).Count();
                var cnumber = "CR" + date + "" + (num + 1);
                return cnumber;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        #endregion

        #region Private Methods


        /// <summary>
        /// This method used for insert into account entroes table.- JJ
        /// </summary>
        /// <param name="SupplierReturnId"></param>
        /// <param name="SupplierId"></param>
        /// <param name="BranchId"></param>
        private void InsertIntoAccountEntries(int SupplierReturnId, int BranchId)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                var supplierReturnItems = _supplierReturnItemContext.Fetch(x => x.SupplierReturnId == SupplierReturnId).ToList();
                var totalReturnAmount = 0M;
                foreach (var item in supplierReturnItems)
                {
                    totalReturnAmount += (decimal)(item.ReturnQuantity * item.CostPrice);
                }
                if (totalReturnAmount > 0)
                {
                    var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(BranchId));
                    var ledgersForCreditNote = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CRNote, Convert.ToInt32(BranchId));
                    if (ledgersForStockInHand != null && ledgersForCreditNote != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCreditNote.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalReturnAmount, ActivityName = StringConstants.SupplierReturnRequest, CreatedDateTime = DateTime.UtcNow });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = totalReturnAmount, Debit = 0, ActivityName = StringConstants.SupplierReturnRequest, CreatedDateTime = DateTime.UtcNow });
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


        private bool SetItemBit(int SupplierReturnDetailId)
        {
            try
            {
                var supplierReturnItems = _supplierReturnItemContext.Fetch(x => x.SupplierReturnId == SupplierReturnDetailId).ToList();
                foreach (var item in supplierReturnItems)
                {
                    var itemProfile = _itemProfileContext.Find(item.ItemId);
                    itemProfile.IsSupplierReturnRequestGenerated = false;
                    _itemProfileContext.Update(itemProfile);
                    _itemProfileContext.SaveChanges();
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
        /// This method is used to fetch last action name from log.- JJ
        /// </summary>
        /// <param name="RecordId">parent record id</param>
        /// <returns>action name</returns>
        private string GetActionName(int RecordId)
        {
            try
            {
                var action = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().LastOrDefault();
                if (action != null)
                    return action.Action;
                else
                    return "";
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to convert model class to application class and add quantity data -JJ
        /// </summary>
        /// <param name="items">list of objects of SupplierReturnItem</param>
        /// <returns>list of objects of SupplierReturnItemAC</returns>
        private List<SupplierReturnItemAC> ConvertToApplicationClass(List<SupplierReturnItem> items)
        {
            try
            {
                var itemACList = new List<SupplierReturnItemAC>();
                var actualQuantity = 0M;
                var updatedSystemQuantity = 0M;
                foreach (var item in items)
                {
                    if (item.ItemProfile.IsParentItem)
                    {
                        item.ItemProfile.ParentItemId = item.ItemProfile.Id;
                        var itemQuantity = _iItemRepository.GetItemQuantityByItemId(item.ItemProfile.Id, Convert.ToInt32(item.SupplierReturnDetail.BranchId));
                        actualQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                        updatedSystemQuantity = actualQuantity;
                    }
                    else
                    {
                        if (item.ItemProfile.BaseUnit > 0)
                        {
                            var itemQuantity = _iItemRepository.GetItemQuantityByItemId((int)item.ItemProfile.ParentItemId, Convert.ToInt32(item.SupplierReturnDetail.BranchId));
                            actualQuantity = itemQuantity != null ? Math.Floor((decimal)(itemQuantity.ActualQuantity / item.ItemProfile.BaseUnit)) : 0;
                            updatedSystemQuantity = itemQuantity.ActualQuantity;
                        }
                        else
                            actualQuantity = 0;
                    }
                    var itemAC = new SupplierReturnItemAC
                    {
                        CostPrice = item.CostPrice,
                        Id = item.ItemId,
                        ItemId = item.ItemId,
                        ParentItemId = item.ItemProfile.ParentItemId,
                        IsParentItem = item.ItemProfile.IsParentItem,
                        ItemNameEn = item.ItemProfile.ItemNameEn,
                        ReturnQuantity = item.ReturnQuantity,
                        ActualQuantity = (int)actualQuantity,
                        SystemQuantity = (int)actualQuantity,
                        Barcode = item.ItemProfile.Barcode,
                        UpdateSystemQunatity = updatedSystemQuantity,
                        OldRequestQuantity = 0,
                        BaseUnit = item.ItemProfile.BaseUnit,
                        FlavourEn = item.ItemProfile.FlavourEn,
                        FlavourSl = item.ItemProfile.FlavourSl,
                        Unit = item.ItemProfile.SystemParameter.ValueEn,
                        SupplierId = item.SupplierReturnDetail.SupplierId,
                        ReturnCauseId = item.ReturnCauseId,
                        ReturnCause = item.ReturnCause.ValueEn,
                        ItemType = item.ItemProfile.Category.BrandParamType.ValueEn + "-" + item.ItemProfile.Category.GroupParamType.ValueEn
                    };
                    itemACList.Add(itemAC);
                }
                return itemACList;
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
                _supplierReturnDetailContext.Dispose();
                _supplierReturnItemContext.Dispose();
                _supplierReturnCreditNoteContext.Dispose();
                _creditNoteDetailContext.Dispose();
                _creditNoteItemContext.Dispose();
                _itemProfileContext.Dispose();
                _itemQuantityContext.Dispose();
                _paramTypeContext.Dispose();
                _workFlowLogContext.Dispose();
                _userDetailContext.Dispose();
                _workFlowDetailContext.Dispose();
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

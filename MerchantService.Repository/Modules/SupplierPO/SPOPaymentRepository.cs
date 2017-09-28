
using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.DomainModel.Models.SupplierPayment;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.Utility.Constants;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using MerchantService.Repository.Modules.ItemChangeRequest;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.Repository.Modules.Account;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Supplier;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public class SPOPaymentRepository : ISPOPaymentRepository
    {
        #region Private Variable
        private readonly IDataRepository<WorkFlowDetail> _workFlowContext;
        private readonly IDataRepository<PurchaseOrderItem> _purchaseOrderItemContext;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPurchaseOrderContext;
        private readonly IDataRepository<SupplierReturnCreditNote> _supplierReturnCreditNoteContext;
        private readonly IDataRepository<SupplierPaymentDetail> _supplierPaymentDetailContext;
        private readonly IDataRepository<PurchaseOrderBranch> _purchaseOrderBranchContext;
        private readonly IDataRepository<PaymentType> _paymentTypeContext;
        private readonly IDataRepository<PaymentTypeCreditNote> _paymentTypeCreditNoteContext;
        private readonly IDataRepository<POBillPayment> _poBillPaymentContext;
        private readonly IDataRepository<POSupplierBill> _poSupplierBillContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<CreditNotePayment> _creditNotePaymentContext;
        private readonly IDataRepository<CreditNoteDetail> _creditNoteDetailContext;
        private readonly IDataRepository<IcrDetail> _icrDetailContext;
        private readonly IDataRepository<SupplierDaysLimit> _supplierDaysLimit;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListRepository;
        private readonly IICRRepository _iICRRepository;
        private readonly IAccountingRepository _iAccountingRepository;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public SPOPaymentRepository(IDataRepository<IcrDetail> icrDetailContext, IDataRepository<SupplierPurchaseOrder> supplierPurchaseOrderContext,
            IAccountingRepository iAccountingRepository, IDataRepository<POBillPayment> poBillPaymentContext, IDataRepository<ParamType> paramTypeContext,
             IDataRepository<PurchaseOrderItem> purchaseOrderItemContext,
            ISupplierPOWorkListRepository supplierPOWorkListRepository, IDataRepository<CreditNoteDetail> creditNoteDetailContext,
            IDataRepository<CreditNotePayment> creditNotePaymentContext, IICRRepository iICRRepository, IDataRepository<PaymentType> paymentTypeContext,
            IDataRepository<PurchaseOrderBranch> purchaseOrderBranchContext, IWorkFlowDetailsRepository iWorkFlowDetailsRepository,
            IDataRepository<SupplierReturnCreditNote> supplierReturnCreditNoteContext, IDataRepository<POSupplierBill> poSupplierBillContext,
            IDataRepository<PaymentTypeCreditNote> paymentTypeCreditNoteContext, IDataRepository<SupplierPaymentDetail> supplierPaymentDetailContext,
            IDataRepository<WorkFlowDetail> workFlowContext, IDataRepository<ParentRecord> parentRecordContext, IErrorLog errorLog,
            IDataRepository<SupplierDaysLimit> supplierDaysLimit)
        {
            _supplierPaymentDetailContext = supplierPaymentDetailContext;
            _supplierPurchaseOrderContext = supplierPurchaseOrderContext;
            _icrDetailContext = icrDetailContext;
            _supplierPOWorkListRepository = supplierPOWorkListRepository;
            _paymentTypeContext = paymentTypeContext;
            _supplierReturnCreditNoteContext = supplierReturnCreditNoteContext;
            _paymentTypeCreditNoteContext = paymentTypeCreditNoteContext;
            _poBillPaymentContext = poBillPaymentContext;
            _poSupplierBillContext = poSupplierBillContext;
            _paramTypeContext = paramTypeContext;
            _creditNotePaymentContext = creditNotePaymentContext;
            _creditNoteDetailContext = creditNoteDetailContext;
            _workFlowContext = workFlowContext;
            _purchaseOrderBranchContext = purchaseOrderBranchContext;
            _iAccountingRepository = iAccountingRepository;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _purchaseOrderItemContext = purchaseOrderItemContext;
            _iICRRepository = iICRRepository;
            _supplierDaysLimit = supplierDaysLimit;
            _errorLog = errorLog;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// This method is used to save SPO Payment. - JJ
        /// </summary>
        /// <param name="supplierPOPayment"> object of SPOPaymentAC</param>
        /// <param name="RoleName">rolename of the logged in user</param>
        /// <param name="userName">username of the logged in user</param>
        /// <returns>status</returns>
        public string SaveSupplierPayment(SPOPaymentAC supplierPOPayment, string RoleName, string userName)
        {
            decimal creditNoteAmount;
            string poNumber = string.Empty;
            SupplierPaymentDetail spDetail = new SupplierPaymentDetail
            {
                Amount = supplierPOPayment.Amount,
                CreatedDateTime = DateTime.UtcNow,
                IsPOBillPayment = true
            };
            _supplierPaymentDetailContext.Add(spDetail);
            _supplierPaymentDetailContext.SaveChanges();
            foreach (var bill in supplierPOPayment.SPOBill)
            {
                var poSupplierBill = _poSupplierBillContext.FirstOrDefault(x => x.BillNumber == bill.BillNumber && x.SupplierPurchaseOrder.PurchaseOrderNumber == bill.PurchaseOrderNo);
                if (poSupplierBill != null)
                {
                    poNumber = bill.PurchaseOrderNo;
                    poSupplierBill.IsPaid = true;
                    poSupplierBill.ModifiedDateTime = DateTime.UtcNow;
                    _poSupplierBillContext.Update(poSupplierBill);
                    _poSupplierBillContext.SaveChanges();
                    POBillPayment poBill = new POBillPayment
                    {
                        CreatedDateTime = DateTime.UtcNow,
                        VoucherNo = supplierPOPayment.VoucherNo,
                        POSupplierBillId = poSupplierBill.Id,
                        SupplierPaymentId = spDetail.Id
                    };
                    _poBillPaymentContext.Add(poBill);
                    _poBillPaymentContext.SaveChanges();
                }
            }

            var paymentTypeList = _paramTypeContext.Fetch(x => x.Param.Value.Equals(StringConstants.POSPaymentType)).ToList();
            if (supplierPOPayment.Cash != 0)
            {
                PaymentType type = new PaymentType
                {
                    Amount = supplierPOPayment.Cash,
                    CreatedDateTime = DateTime.UtcNow,
                    SupplierPaymentId = spDetail.Id,
                    TypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn.Equals(StringConstants.Cash)).Id
                };
                _paymentTypeContext.Add(type);
                _paymentTypeContext.SaveChanges();
            }
            if (supplierPOPayment.Cheque != 0)
            {
                PaymentType type = new PaymentType
                {
                    Amount = supplierPOPayment.Cheque,
                    ChequeNo = supplierPOPayment.ChequeNo,
                    CreatedDateTime = DateTime.UtcNow,
                    SupplierPaymentId = spDetail.Id,
                    TypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn.Equals(StringConstants.Cheque)).Id
                };
                _paymentTypeContext.Add(type);
                _paymentTypeContext.SaveChanges();
            }

            creditNoteAmount = supplierPOPayment.Credit;

            if (supplierPOPayment.Credit != 0)
            {
                PaymentType type = new PaymentType
                {
                    Amount = supplierPOPayment.Credit,
                    CreatedDateTime = DateTime.UtcNow,
                    SupplierPaymentId = spDetail.Id,
                    TypeId = _paramTypeContext.FirstOrDefault(x => x.ValueEn.Equals(StringConstants.CreditNote)).Id
                };
                _paymentTypeContext.Add(type);
                _paymentTypeContext.SaveChanges();

                if (supplierPOPayment.CreditNoteDetail != null && supplierPOPayment.CreditNoteDetail.Count > 0)
                {
                    foreach (var note in supplierPOPayment.CreditNoteDetail)
                    {
                        var creditNote = _creditNoteDetailContext.Find(note.Id);
                        if (creditNote != null)
                        {
                            if (creditNote.IsCollected)
                            {
                                if (creditNote.RemainigAmount >= creditNoteAmount)
                                {
                                    creditNote.RemainigAmount = creditNote.RemainigAmount - creditNoteAmount;
                                    creditNoteAmount = 0;
                                }
                                else
                                {
                                    creditNoteAmount = creditNoteAmount - creditNote.RemainigAmount;
                                    creditNote.RemainigAmount = 0;
                                }
                            }
                            else
                            {
                                creditNote.IsCollected = true;
                                if (creditNote.Amount >= creditNoteAmount)
                                {
                                    creditNote.RemainigAmount = creditNote.Amount - creditNoteAmount;
                                    creditNoteAmount = 0;
                                }
                                else
                                {
                                    creditNoteAmount = creditNoteAmount - creditNote.Amount;
                                    creditNote.RemainigAmount = 0;
                                }
                            }
                            creditNote.ModifiedDateTime = DateTime.UtcNow;
                            _creditNoteDetailContext.Update(creditNote);
                            _creditNoteDetailContext.SaveChanges();

                            PaymentTypeCreditNote notePaymentType = new PaymentTypeCreditNote
                            {
                                CreatedDateTime = DateTime.UtcNow,
                                CreditNoteId = note.Id,
                                // insert as needed
                                PaymentTypeId = type.Id
                            };
                            _paymentTypeCreditNoteContext.Add(notePaymentType);
                            _paymentTypeCreditNoteContext.SaveChanges();

                            CreditNotePayment notePayment = new CreditNotePayment
                            {
                                CreatedDateTime = DateTime.UtcNow,
                                SupplierPaymentId = spDetail.Id,
                                CreditNoteId = note.Id
                            };
                            _creditNotePaymentContext.Add(notePayment);
                            _creditNotePaymentContext.SaveChanges();

                            if (creditNoteAmount <= 0)
                            {
                                break;
                            }
                        }
                    }
                }
            }

            var poSupplierBillList = _poSupplierBillContext.Fetch(x => x.SupplierPurchaseOrder.PurchaseOrderNumber == poNumber).ToList();
            var ispaid = true;
            foreach (var bill in poSupplierBillList)
            {
                if (!bill.IsPaid)
                {
                    ispaid = false;
                }
            }
            var spo = _supplierPurchaseOrderContext.FirstOrDefault(x => x.PurchaseOrderNumber == poNumber);
            if (ispaid)
            {
                spo.IsPaid = true;
                spo.ModifiedDateTime = DateTime.UtcNow;
                _supplierPurchaseOrderContext.Update(spo);
                _supplierPurchaseOrderContext.SaveChanges();

                if (supplierPOPayment.Comment == ".")
                    supplierPOPayment.Comment = "";

                _supplierPOWorkListRepository.SaveSupplierPurchaseOrderLog("Paid", supplierPOPayment.Comment, spo.Id, spo.RecordId, RoleName, "" + RoleName + " " + StringConstants.PaySPO, userName);
            }
            else
            {
                _supplierPOWorkListRepository.SaveSupplierPurchaseOrderLog("Partially Paid", supplierPOPayment.Comment, spo.Id, spo.RecordId, RoleName, "" + RoleName + " " + StringConstants.PaySPO, userName);
            }

            var discount = CalculateDiscount(spo.Id);
            InsertIntoAccountEntries(spo, supplierPOPayment, discount);
            return "ok";
        }


        /// <summary>
        /// This method is used for fetching supplier bill list from database. - JJ
        /// </summary>   
        /// <param name="BranchId">id of BRANCH</param>
        /// <returns>list of objects of SPOReceivingBillAC</returns>
        public List<SPOReceivingBillAC> GetSupplierBillList(int? BranchId, bool isAllowForAllBranches)
        {
            var billList = new List<SPOReceivingBillAC>();
            List<POSupplierBill> spoBills;
            if (isAllowForAllBranches)
                spoBills = _poSupplierBillContext.Fetch(x => !x.IsPaid && x.IsVerified && x.SupplierPurchaseOrder.IsVerified).ToList();
            else
                spoBills = _poSupplierBillContext.Fetch(x => !x.IsPaid && x.IsVerified && x.SupplierPurchaseOrder.IsVerified && x.SupplierPurchaseOrder.InitiationBranchId == BranchId).ToList();
            bool isCash = false;
            foreach (var bill in spoBills)
            {
                if (bill.SupplierPurchaseOrder.SupplierProfile.SupplierType.ValueEn.Equals(StringConstants.Cash))
                {
                    isCash = true;
                }
                var supplierbill = new SPOReceivingBillAC
                {
                    Amount = bill.Amount,
                    BillComment = bill.BillComment,
                    BillId = bill.Id,
                    BranchName = bill.SupplierPurchaseOrder.InitiatorBranch.Name,
                    BillNumber = bill.BillNumber,
                    Discount = bill.Discount,
                    IsPaid = bill.IsPaid,
                    IsPercentageDiscount = bill.IsPercentageDiscount,
                    IsVerified = bill.IsVerified,
                    PurchaseOrderNo = bill.SupplierPurchaseOrder.PurchaseOrderNumber,
                    SupplierId = bill.SupplierPurchaseOrder.SupplierId,
                    SupplierName = bill.SupplierPurchaseOrder.SupplierProfile.NameEn,
                    IsCashPO = isCash,
                    TotalDaysLimit = bill.TotalDaysLimit,
                    VerifiedDate = bill.VerifiedDate,
                    SupplierType = bill.SupplierPurchaseOrder.SupplierProfile.SupplierType.ValueEn
                };
                billList.Add(supplierbill);
            }
            return billList;
        }


        /// <summary>
        /// This method is used for fetching supplier bill list from database. - JJ
        /// </summary>   
        /// <param name="SupplierId">id of Supplier</param>
        /// <returns>list of objects of CreditNoteDetail</returns>
        public List<CreditNoteDetail> GetSupplierCreditNoteList(int SupplierId)
        {
            var list = new List<CreditNoteDetail>();
            var noteList = _supplierReturnCreditNoteContext.Fetch(x => x.SupplierReturnDetail.SupplierId == SupplierId).ToList();
            foreach (var note in noteList)
            {
                if (note.CreditNoteDetail.IsCollected)
                {
                    if (note.CreditNoteDetail.RemainigAmount > 0)
                    {
                        var creditNote = note.CreditNoteDetail;
                        creditNote.ActualAmount = creditNote.RemainigAmount;
                        list.Add(creditNote);
                    }
                }
                else
                {
                    var creditNote = note.CreditNoteDetail;
                    creditNote.ActualAmount = creditNote.Amount;
                    list.Add(creditNote);
                }
            }
            return list;
        }


        /// <summary>
        /// This method is used for checking supplier bill list from database. - JJ
        /// </summary>   
        /// <param name="PurchaseOrderId">id of PurchaseOrder</param>
        /// <returns>list of objects of SPOReceivingBillAC</returns>
        public List<SPOReceivingBillAC> CheckCondition(UserDetail currentUser, CompanyDetail company, List<SPOReceivingBillAC> SPOReceivingBill)
        {
            bool isCashPO;
            bool IsDiscountChanged = true;
            decimal discount = 0M;
            bool canBePaid = true;
            foreach (var spobill in SPOReceivingBill)
            {
                var poItems = _purchaseOrderItemContext.Fetch(x => x.SupplierPurchaseOrder.PurchaseOrderNumber == spobill.PurchaseOrderNo && x.SPOReceivingStatus != SPOReceivingStatus.NotReceived).ToList();

                var bill = _poSupplierBillContext.FirstOrDefault(x => x.IsVerified && !x.IsPaid && x.SupplierPurchaseOrder.PurchaseOrderNumber == spobill.PurchaseOrderNo && x.Id == spobill.BillId);
                if (bill != null && bill.SupplierPurchaseOrder.IsApproved && bill.SupplierPurchaseOrder.IsReceived && bill.SupplierPurchaseOrder.IsSend && bill.SupplierPurchaseOrder.IsVerified)
                {
                    if (bill.SupplierPurchaseOrder.SupplierProfile.SupplierType.ValueEn == StringConstants.Cash)
                    {
                        isCashPO = true;
                    }
                    else
                    {
                        isCashPO = false;
                    }
                    if (!isCashPO)
                    {
                        //TODO: replace with supplier days limit
                        var suppDays = _supplierDaysLimit.Fetch(x => x.SupplierId == bill.SupplierPurchaseOrder.SupplierId).ToList();
                        if (suppDays.Any())
                        {
                            var date = DateTime.UtcNow.Subtract(bill.SupplierPurchaseOrder.UpdatedDate);
                            var days = Convert.ToInt32(Math.Round(date.TotalDays));
                            for (var i = 0; i < suppDays.Count; i++)
                            {
                                int index;
                                if (i == 0 && days < suppDays[i].Days) // no limit arrived yet
                                {
                                    IsDiscountChanged = false;
                                    break;
                                }

                                if (days == suppDays[i].Days) //in case its same days limit
                                {
                                    index = i;
                                    if (bill.PresentDiscount == suppDays[index].Discount)
                                    {
                                        IsDiscountChanged = false;
                                        break;
                                    }
                                }
                                else if (suppDays[i].Days > days  //between the days
                                    || (((i + 1) <= (suppDays.Count - 1)) && suppDays[i + 1].Days >= days))
                                {
                                    index = i + 1;
                                    if (bill.PresentDiscount == suppDays[index].Discount)
                                    {
                                        IsDiscountChanged = false;
                                        break;
                                    }
                                    else
                                    {
                                        discount = suppDays[index].Discount;
                                        IsDiscountChanged = true;
                                        break;
                                    }
                                }
                            }
                        }
                        else
                        {
                            IsDiscountChanged = false;
                        }
                        if (IsDiscountChanged && bill.PresentDiscount != discount)
                        {
                            bill.PresentDiscount = discount;
                            _poSupplierBillContext.Update(bill);
                            _poSupplierBillContext.SaveChanges();
                        }
                        else
                        {
                            IsDiscountChanged = false;
                        }
                        PurchaseOrderBranch conditions = new PurchaseOrderBranch
                        {
                            IsDiscountChanged = IsDiscountChanged
                        };
                        var workflowLog = _iWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.SPOPayment, StringConstants.PaySPO, currentUser, company, conditions, null, conditions);
                        if (workflowLog != null)
                        {
                            WorkFlowLog log = (WorkFlowLog)workflowLog.Item1;
                            var workFlowDetail = _workFlowContext.Find(log.WorkFlowId);
                            if (workFlowDetail.NextActivity.IsClosed)
                            {
                                spobill.IsSelected = true;
                                spobill.CanBePaid = true;
                                if (workFlowDetail.ParentPermission.Name == StringConstants.ItemChangeRequest)
                                {
                                    ChangePrices(spobill.PurchaseOrderNo, log.RecordId, currentUser, company, true, workFlowDetail.Id);
                                    break;
                                }
                            }
                            else
                            {
                                if (workFlowDetail.ParentPermission.Name == StringConstants.ItemChangeRequest)
                                {
                                    spobill.IsSelected = true;
                                    spobill.CanBePaid = true;
                                    spobill.IsICRCreated = true;
                                    spobill.IsICRAlreadyCreated = false;
                                    spobill.IsWorkFlowNotCreated = false;
                                    spobill.IsBillNotFound = false;
                                    ChangePrices(spobill.PurchaseOrderNo, log.RecordId, currentUser, company, true, workFlowDetail.Id);
                                    break;
                                }
                            }
                            foreach (var item in poItems)
                            {
                                if (item.ItemProfile.IsItemChangeRequestGenerated)
                                {
                                    canBePaid = false;
                                    break;
                                }
                            }
                            if (!canBePaid)
                            {
                                spobill.IsICRAlreadyCreated = true;
                            }
                        }
                        else
                        {
                            spobill.IsSelected = false;
                            spobill.CanBePaid = false;
                            spobill.IsICRCreated = false;
                            spobill.IsICRAlreadyCreated = false;
                            spobill.IsWorkFlowNotCreated = true;
                            spobill.IsBillNotFound = false;
                        }
                    }
                    else
                    {
                        spobill.IsSelected = true;
                        spobill.CanBePaid = true;
                    }
                }
                else
                {
                    spobill.IsSelected = false;
                    spobill.CanBePaid = false;
                    spobill.IsBillNotFound = true;
                    spobill.IsICRCreated = false;
                    spobill.IsWorkFlowNotCreated = false;
                    spobill.IsICRAlreadyCreated = false;
                }
            }
            return SPOReceivingBill;
        }


        /// <summary>
        /// This method is used to check whether SPO is verified and not paid yet. - JJ
        /// </summary>
        /// <param name="PONumber">SPO purchase order number</param>
        /// <returns>status</returns>
        public string CheckSPO(string PONumber)
        {
            var spo = _supplierPurchaseOrderContext.Fetch(x => x.PurchaseOrderNumber == PONumber).FirstOrDefault();
            if (spo != null)
            {
                if (spo.IsVerified && !spo.IsPaid)
                {
                    return "ok";
                }
                else
                {
                    if (spo.IsPaid)
                    {
                        return "Supplier Purchase Order is Paid";
                    }
                    else
                    {
                        if (!spo.IsApproved)
                            return "Supplier Purchase Order is not Approved";
                        else
                        {
                            if (!spo.IsSend)
                                return "Supplier Purchase Order is not Send to Supplier";
                            else
                            {
                                if (!spo.IsReceived)
                                    return "Supplier Purchase Order is not Received";
                                else
                                {
                                    return "Supplier Purchase Order is not Verified";
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                return StringConstants.PONotFound;
            }
        }

        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _supplierPaymentDetailContext.Dispose();
                _paymentTypeContext.Dispose();
                _paymentTypeCreditNoteContext.Dispose();
                _poBillPaymentContext.Dispose();
                _poSupplierBillContext.Dispose();
                _paramTypeContext.Dispose();
                _workFlowContext.Dispose();
                _purchaseOrderItemContext.Dispose();
                _supplierReturnCreditNoteContext.Dispose();
                _supplierPurchaseOrderContext.Dispose();
                _creditNoteDetailContext.Dispose();
                _creditNotePaymentContext.Dispose();
                _icrDetailContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }
        #endregion

        #region private methods


        /// <summary>
        /// This method used for insert into account entroes table.- JJ
        /// </summary>
        /// <param name="destruction"></param>
        /// <param name="totalCostPrice"></param>
        private void InsertIntoAccountEntries(SupplierPurchaseOrder supplierPO, SPOPaymentAC supplierPOPayment, decimal? discount)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                var spoBranches = _purchaseOrderBranchContext.Fetch(x => x.PurchaseOrderId == supplierPO.Id).ToList();
                foreach (var branch in spoBranches)
                {
                    if (supplierPO.SupplierProfile.SupplierType.ValueEn == StringConstants.Cash)//check whether cash po.
                    {
                        var ledgersForCash = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CashInHand, Convert.ToInt32(branch.BranchId));
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(branch.BranchId));
                        var cash = 0M;
                        cash = supplierPOPayment.Cash;
                        if (discount > 0)
                        {
                            cash += (decimal)discount;
                        }
                        if (ledgersForCash != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCash.Id, TransactionDate = DateTime.UtcNow, Credit = cash, Debit = 0, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = cash, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                        }
                    }
                    else
                    {
                        var ledgersForSupplier = _iAccountingRepository.GetAccountLedgerBySupplier(supplierPO.SupplierId);
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(branch.BranchId));
                        var cheque = 0M;
                        cheque = supplierPOPayment.Cheque;
                        if (discount > 0)
                        {
                            cheque += (decimal)discount;
                        }
                        if (ledgersForSupplier != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForSupplier.Id, TransactionDate = DateTime.UtcNow, Credit = cheque, Debit = 0, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = cheque, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                        }
                    }

                    if (discount > 0)
                    {
                        var ledgersForIncome = _iAccountingRepository.GetAccountLedgerByName(StringConstants.Income, Convert.ToInt32(branch.BranchId));
                        if (ledgersForIncome != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForIncome.Id, TransactionDate = DateTime.UtcNow, Credit = (decimal)discount, Debit = 0, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                        }
                    }

                    if (supplierPOPayment.Credit > 0)
                    {
                        var ledgersForSupplier = _iAccountingRepository.GetAccountLedgerBySupplier(supplierPO.SupplierId);
                        var ledgersForCreditNote = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CRNote, Convert.ToInt32(branch.BranchId));
                        if (ledgersForSupplier != null && ledgersForCreditNote != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCreditNote.Id, TransactionDate = DateTime.UtcNow, Credit = supplierPOPayment.Credit, Debit = 0, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForSupplier.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = supplierPOPayment.Credit, ActivityName = StringConstants.SPOPayment, CreatedDateTime = DateTime.UtcNow, Description = "Entry for SPO no. " + supplierPO.PurchaseOrderNumber });
                        }
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


        private string InitiateICR(PurchaseOrderItem item, int RecordId, UserDetail currentUser, CompanyDetail company, int WorkFlowId)
        {
            ItemChangedDetailsAC itemChange = new ItemChangedDetailsAC
            {
                IsPOItemIcr = true,
                IsPriceChangeRequest = true,
                ItemId = item.ItemId,
                ModifyingCostPrice = item.ReceivingCostPrice,
                ModifyingSellPrice = item.ItemProfile.SellPrice,
                ModifyingSellPriceA = item.ItemProfile.SellPriceA,
                ModifyingSellPriceB = item.ItemProfile.SellPriceB,
                ModifyingSellPriceC = item.ItemProfile.SellPriceC,
                ModifyingSellPriceD = item.ItemProfile.SellPriceD,
                POItemId = item.Id,
                RequestedDate = DateTime.UtcNow,
                ParentRecordId = RecordId,
                IsInDirect = true
            };
            return _iICRRepository.SaveICR(itemChange, currentUser, company, WorkFlowId);
        }


        private string ChangePrices(string PONo, int RecordId, UserDetail currentUser, CompanyDetail company, bool initiateICR, int WorkFlowId)
        {
            var status = "ok";
            var billList = _poSupplierBillContext.Fetch(x => x.SupplierPurchaseOrder.PurchaseOrderNumber == PONo).ToList();
            var itemList = _purchaseOrderItemContext.Fetch(x => x.SupplierPurchaseOrder.PurchaseOrderNumber == PONo).ToList();

            var weightedPercent = 0M;
            var percentDiscount = 0M;
            var billCount = 0;
            foreach (var bill in billList)
            {
                if (bill.Discount > 0)
                {
                    billCount++;
                    if (bill.IsPercentageDiscount)
                    {
                        percentDiscount = percentDiscount + bill.Discount;
                    }
                    else
                    {
                        percentDiscount = percentDiscount + ((100 * bill.Discount) / bill.Amount);
                    }
                }
            }
            if (billCount > 0)
            {
                weightedPercent = percentDiscount / billCount;
            }
            for (var i = 0; i < itemList.Count; i++)
            {
                // i have written this line of code bcoz 
                //i have to calculate the new receivingcostprice(in ui discouted cp) depending on the billcostprice(in ui receive cp)
                //i have used ReceivingCostPrice bcoz it's what gets updated n not OrderCostPrice or BillCostPrice
                itemList[i].ReceivingCostPrice = itemList[i].BillCostPrice;
                itemList[i].ReceivingCostPrice = itemList[i].ReceivingCostPrice - ((itemList[i].ReceivingCostPrice * weightedPercent) / 100);

                if (initiateICR)
                {
                    itemList[i].ModifiedDateTime = DateTime.UtcNow;
                    _purchaseOrderItemContext.Update(itemList[i]);
                    _purchaseOrderItemContext.SaveChanges();
                    status = InitiateICR(itemList[i], RecordId, currentUser, company, WorkFlowId);
                    if (status == "ok")
                    {
                        var itemId = itemList[i].ItemId;
                        var newICRList = _icrDetailContext.Fetch(x => x.ItemId == itemId).ToList();
                        if (newICRList.Any())
                        {
                            var newICR = newICRList[newICRList.Count - 1];
                            if (newICR != null)
                                itemList[i].ICRDetailId = newICR.Id;
                            status = "ICR Generated";
                        }
                    }
                    _purchaseOrderItemContext.Update(itemList[i]);
                    _purchaseOrderItemContext.SaveChanges();
                }
            }
            return status;
        }


        private decimal CalculateDiscount(int SupplierPOId)
        {
            decimal discount = 0M;
            var poItemList = _purchaseOrderItemContext.Fetch(x => x.SupplierPurchaseOrder.Id == SupplierPOId).ToList();
            foreach (var item in poItemList)
            {
                if (item.FreeQuantity > 0)
                {
                    discount += (item.FreeQuantity * item.ReceivingCostPrice);
                    var receivingDiscount = (item.ReceivingQuantity * item.OrderCostPrice) - (item.ReceivingQuantity * item.ReceivingCostPrice);
                    discount += receivingDiscount;
                }
            }
            return discount;
        }

        #endregion
    }
}

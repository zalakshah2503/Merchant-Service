using MerchantService.Core.Global;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.CreditNote;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Supplier
{
    //[DynamicAuthorize]
    [RoutePrefix("api/creditnote")]
    public class CreditNoteController : BaseController
    {
        private readonly IErrorLog _errorLog;

        private readonly ICreditNoteRepository _iCreditNoteRepository;
        private readonly IAccountingRepository _iAccountingRepository;
        public CreditNoteController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, ICreditNoteRepository iCreditNoteRepository, IAccountingRepository iAccountingRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _iAccountingRepository = iAccountingRepository;
            _iCreditNoteRepository = iCreditNoteRepository;
        }



        [HttpGet]
        [Route("getcreditnotelist")]
        public IHttpActionResult GetCreditNoteList(int supplierId)
        {
            try
            {
                List<CreditNoteAC> listOfCreditNoteAc = new List<CreditNoteAC>();
                List<CreditNoteDetail> listOfCreditNote = _iCreditNoteRepository.GetListOfCreditNoteDetailByBranchId(Convert.ToInt32(MerchantContext.UserDetails.BranchId), MerchantContext.Permission.IsAllowToAccessAllBranch);
                if (listOfCreditNote.Count > 0)
                {
                    foreach (var creditNote in listOfCreditNote)
                    {
                        CreditNoteAC creditNoteAC = new CreditNoteAC();
                        creditNoteAC.Id = creditNote.Id;
                        creditNoteAC.Amount = creditNote.Amount;
                        creditNoteAC.RemaningAmount = creditNote.RemainigAmount;
                        creditNoteAC.IsCollected = creditNote.IsCollected;
                        if (!creditNote.IsCollected)
                        {
                            creditNoteAC.IsShow = true;
                            creditNoteAC.Status = StringConstants.NotCollected;
                        }
                        else
                        {
                            if (creditNote.RemainigAmount == 0)
                            {
                                creditNoteAC.IsShow = false;
                                creditNoteAC.Status = StringConstants.Collected;
                            }
                            else
                            {
                                creditNoteAC.IsShow = true;
                                creditNoteAC.Status = StringConstants.PartialCollected;
                            }
                        }

                        creditNoteAC.CreditNoteNo = creditNote.CreditNoteNo;
                        creditNoteAC.InitiationDate = creditNote.InitiationDate.ToString("dd-MM-yyyy hh:mm tt");
                        if (creditNote.TypeId == Convert.ToInt32(CreditNoteType.SupplierItemOfferNote))
                        {
                            ItemOfferCreditNote itemOfferCreditNote = _iCreditNoteRepository.GetItemOfferCreditNoteByCreditId(creditNote.Id);
                            if (itemOfferCreditNote != null)
                            {
                                creditNoteAC.SupplierId = itemOfferCreditNote.SupplierId;
                                creditNoteAC.SupplierName = itemOfferCreditNote.SupplierProfile.NameEn;
                            }
                        }
                        else if (creditNote.TypeId == Convert.ToInt32(CreditNoteType.SupplierDestructionNote))
                        {
                            ItemDestructionCreditNote itemDestructionCreditNote = _iCreditNoteRepository.GetItemDestructionCreditNoteByCreditId(creditNote.Id);
                            if (itemDestructionCreditNote != null)
                            {
                                creditNoteAC.SupplierId = itemDestructionCreditNote.Destruction.SupplierId;
                                creditNoteAC.SupplierName = itemDestructionCreditNote.Destruction.SupplierProfile.NameEn;
                            }

                        }
                        else if (creditNote.TypeId == Convert.ToInt32(CreditNoteType.SupplierReturnNote))
                        {
                            SupplierReturnCreditNote supplierReturnCreditNotes = _iCreditNoteRepository.GetSupplierReturnCreditNoteByCreditNoteId(creditNote.Id);
                            if (supplierReturnCreditNotes != null)
                            {
                                creditNoteAC.SupplierId = supplierReturnCreditNotes.SupplierReturnDetail.SupplierId;
                                creditNoteAC.SupplierName = supplierReturnCreditNotes.SupplierReturnDetail.SupplierProfile.NameEn;
                            }
                        }

                        if (creditNoteAC.SupplierId == supplierId)
                        {
                            listOfCreditNoteAc.Add(creditNoteAC);
                        }
                    }
                }
                return Ok(listOfCreditNoteAc);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("submitreceivigcreditnote")]
        public IHttpActionResult SubmitRecevingCreditNote(CreditNoteReceivingAC creditNoteRecevingAC)
        {
            try
            {
                RecevingCreditNotePaymentDetail recevingCreditNotePaymentDetail = new RecevingCreditNotePaymentDetail();
                recevingCreditNotePaymentDetail.CashAmount = creditNoteRecevingAC.Cash;
                recevingCreditNotePaymentDetail.ChequeAmount = creditNoteRecevingAC.Cheque;
                recevingCreditNotePaymentDetail.VoucherNo = creditNoteRecevingAC.VoucharNo;
                recevingCreditNotePaymentDetail.ChequeNo = creditNoteRecevingAC.ChequeNo;
                recevingCreditNotePaymentDetail.CreatedDateTime = DateTime.UtcNow;
                int recevingCreditNotePaymantId = _iCreditNoteRepository.AddRecevingCreditNotePaymantDetal(recevingCreditNotePaymentDetail);
                decimal remainingAmount = 0;
                decimal totalAmount = creditNoteRecevingAC.Cash + creditNoteRecevingAC.Cheque;
                foreach (var creditNote in creditNoteRecevingAC.ListOfCreditNotes.OrderBy(x => x.Amount))
                {
                    var creditNoteDetail = _iCreditNoteRepository.GetCreditNoteDetailById(creditNote.Id);
                    if (creditNoteDetail != null && totalAmount > 0)
                    {
                        if (creditNoteDetail.IsCollected)
                        {
                            remainingAmount = totalAmount - creditNoteDetail.RemainigAmount;
                            if (remainingAmount < 0)
                            {
                                creditNoteDetail.RemainigAmount = creditNoteDetail.RemainigAmount - totalAmount;
                                totalAmount = remainingAmount;
                            }
                            else
                            {
                                totalAmount = remainingAmount;
                                creditNoteDetail.RemainigAmount = 0;
                            }
                        }
                        else
                        {
                            creditNoteDetail.IsCollected = true;
                            remainingAmount = totalAmount - creditNoteDetail.Amount;
                            if (remainingAmount < 0)
                            {
                                creditNoteDetail.RemainigAmount = creditNoteDetail.Amount - totalAmount;
                                totalAmount = remainingAmount;
                            }
                            else
                            {
                                totalAmount = remainingAmount;
                                creditNoteDetail.RemainigAmount = 0;
                            }
                        }
                        creditNoteDetail.RecevingCreditNotePaymentId = recevingCreditNotePaymantId;
                        _iCreditNoteRepository.UpdateCreditNoteDetail(creditNoteDetail);

                    }


                    #region Insert Into Accounting
                    InsertIntoAccounting(creditNoteRecevingAC, creditNoteDetail);
                    #endregion

                }
                return Ok(new { _isResult = true });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        #region Private Methods
        private void InsertIntoAccounting(CreditNoteReceivingAC creditNoteRecevingAC, CreditNoteDetail creditNoteDetail)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                var ledgersForSupplier = _iAccountingRepository.GetAccountLedgerBySupplier(creditNoteRecevingAC.ListOfCreditNotes[0].SupplierId);
                var ledgersForCash = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CashInHand, Convert.ToInt32(creditNoteDetail.BranchId));
                var ledgersForBank = _iAccountingRepository.GetAccountLedgerByName(StringConstants.Bank, Convert.ToInt32(creditNoteDetail.BranchId));
                if (ledgersForSupplier != null && ledgersForCash != null && ledgersForBank != null)
                {
                    decimal totalAmount = 0;
                    totalAmount = (creditNoteRecevingAC.Cheque + creditNoteRecevingAC.Cash);
                    listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForSupplier.Id, TransactionDate = DateTime.UtcNow, Credit = totalAmount, Debit = 0, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.ReceivingCreditNote, Description = "Credit Note Number :" + creditNoteDetail.CreditNoteNo });
                    if (creditNoteRecevingAC.Cash != 0)
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCash.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = creditNoteRecevingAC.Cash, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.ReceivingCreditNote, Description = "Credit Note Number :" + creditNoteDetail.CreditNoteNo });
                    if (creditNoteRecevingAC.Cheque != 0)
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForBank.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = creditNoteRecevingAC.Cheque, CreatedDateTime = DateTime.UtcNow, ActivityName = StringConstants.ReceivingCreditNote, Description = "Credit Note Number :" + creditNoteDetail.CreditNoteNo });
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

using MerchantService.Core.Global;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.Repository.Modules.CreditNote;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.SupplierPO;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.SupplierPO
{
    //[DynamicAuthorize]
    [RoutePrefix("api/spopayment")]
    public class SPOPaymentController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ISPOPaymentRepository _spoPaymentContext;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListContext;
        private readonly ICreditNoteRepository _iCreditNoteRepository;
        #endregion

        #region Constructor
        public SPOPaymentController(IErrorLog errorLog, ICreditNoteRepository iCreditNoteRepository, ISPOPaymentRepository spoPaymentContext, ISupplierPOWorkListRepository supplierPOWorkListContext,
            IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _spoPaymentContext = spoPaymentContext;
            _supplierPOWorkListContext = supplierPOWorkListContext;
            _iCreditNoteRepository = iCreditNoteRepository;
        }
        #endregion

        #region Public Method


        /// <summary>
        /// This method is used to fetch Bill List - JJ
        /// </summary>
        /// <param name="BranchId">object of BranchId</param>
        /// <returns>list of object of SPOReceivingBillAC</returns>
        [HttpGet]
        [Route("getsupplierbill")]
        public IHttpActionResult GetSupplierBill()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToAccessAllBranch)
                    {
                        var billList = _spoPaymentContext.GetSupplierBillList(null, true);
                        return Ok(billList);
                    }
                    else
                    {
                        var billList = _spoPaymentContext.GetSupplierBillList(MerchantContext.UserDetails.BranchId, false);
                        return Ok(billList);
                    }
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check whether SPO is verified and not paid yet. - JJ
        /// </summary>
        /// <param name="PONumber">SPO purchase order number</param>
        /// <returns>status</returns>
        [HttpGet]
        [Route("checksupplierpo")]
        public IHttpActionResult CheckSupplierPO(string PONumber)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var status = _spoPaymentContext.CheckSPO(PONumber);
                    if (status == "ok")
                    {
                        var poItemList = _supplierPOWorkListContext.GetSupplierPOItemList(null, PONumber);
                        return Ok(new { poItemList = poItemList });
                    }
                    else
                        return Ok(new { status = status });
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to fetch Bill List - JJ
        /// </summary>
        /// <param name="SupplierId">id of Supplier</param>
        /// <returns>list of object of SPOReceivingBillAC</returns>
        [HttpGet]
        [Route("getcreditnote")]
        public IHttpActionResult GetCreditNote(int SupplierId)
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

                        if (creditNoteAC.SupplierId == SupplierId)
                        {
                            if (creditNoteAC.IsCollected)
                            {
                                if (creditNoteAC.RemaningAmount > 0)
                                {
                                    creditNoteAC.ActualAmount = creditNoteAC.RemaningAmount;
                                    listOfCreditNoteAc.Add(creditNoteAC);
                                }
                            }
                            else
                            {
                                creditNoteAC.ActualAmount = creditNoteAC.Amount;
                                listOfCreditNoteAc.Add(creditNoteAC);
                            }
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


        /// <summary>
        /// This method is used to fetch Bill List - JJ
        /// </summary>
        /// <param name="PurchaseOrderId">object of PurchaseOrder</param>
        /// <returns>list of object of SPOReceivingBillAC</returns>
        [HttpPut]
        [Route("checkcondition")]
        public IHttpActionResult CheckCondition(List<SPOReceivingBillAC> sPOReceivingBill)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var spoBillList = _spoPaymentContext.CheckCondition(MerchantContext.UserDetails, MerchantContext.CompanyDetails, sPOReceivingBill);
                    return Ok(spoBillList);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for receive an item of SPO - JJ
        /// </summary>
        /// <param name="SupplierItemAC">object of SPOReceivingAC</param>
        /// <returns>null</returns>
        [HttpPost]
        [Route("savesupplierpayment")]
        public IHttpActionResult SaveSupplierPayment(SPOPaymentAC supplierPOPayment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var user = MerchantContext.UserDetails;
                    var status = _spoPaymentContext.SaveSupplierPayment(supplierPOPayment, user.RoleName, user.UserName);
                    return Ok(new { status = status });
                }
                else
                    return BadRequest();
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
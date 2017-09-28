using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.POS;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Sales;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.ParentRecords;
using MerchantService.Repository.Modules.POS;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.POS
{
    [RoutePrefix("api/possession")]
    public class POSSessionController : BaseController
    {
        private readonly IPOSSessionRepository _iPOSSessionRepository;
        private readonly IErrorLog _errorLog;
        private readonly IParentRecordsRepository _iParentRecordsRepository;
        private readonly IRoleRepository _iRoleRepository;
        private readonly IUserDetailRepository _userDetailRepository;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IReturnBillRepository _posReturnBillItemRepository;
        private readonly int currentCompanyId;



        public POSSessionController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IPOSSessionRepository iPOSSessionRepository, IParentRecordsRepository iParentRecordsRepository,
          IRoleRepository iRoleRepository, IUserDetailRepository userDetailRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IReturnBillRepository posReturnBillItemRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _iPOSSessionRepository = iPOSSessionRepository;
            _iParentRecordsRepository = iParentRecordsRepository;
            _iRoleRepository = iRoleRepository;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _userDetailRepository = userDetailRepository;
            if (MerchantContext.CompanyDetails != null)
            {
                currentCompanyId = MerchantContext.CompanyDetails.Id;
            }
            else
            {
                currentCompanyId = 0;
            }
            _posReturnBillItemRepository = posReturnBillItemRepository;
        }


        /// <summary>
        /// This method used for insert pos session. -An
        /// </summary>
        /// <param name="possSession"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insertpossession")]
        public IHttpActionResult InserIntoPOSSession(POSSession possSession)
        {
            try
            {
                int id = _iPOSSessionRepository.AddNewPOSSession(possSession);
                possSession.Id = id;
                return Ok(possSession);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get cashier list. -An
        /// </summary>
        /// <param name="cashierId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getcashierdetailbyid")]
        public IHttpActionResult GetCashierDetailById(int cashierId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    POSSessionAC posSessionAC = new POSSessionAC();
                    var posLoginSession = _iPOSSessionRepository.GetPOSLoginSessionByUserId(cashierId);
                    if (posLoginSession != null)
                    {
                        posSessionAC.POSSessionLoginId = posLoginSession.Id;
                        posSessionAC.SessionStartDate = posLoginSession.LoginDateTime.ToString("dd-MM-yyyy hh:mm");
                        if (posLoginSession.LogoutDateTime != null)
                            posSessionAC.SessionEndDate = Convert.ToDateTime(posLoginSession.LogoutDateTime).ToString("dd-MM-yyyy hh:mm");
                        else
                            posSessionAC.SessionEndDate = DateTime.UtcNow.ToString("dd-MM-yyyy hh:mm");

                        posSessionAC.SessionStatus = "";

                        if (posLoginSession.LogoutDateTime != null)
                            posSessionAC.IsSessionEnd = true;

                        var posSession = _iPOSSessionRepository.GetPOSSessionByPOSLoginSessionId(posLoginSession.Id);
                        if (posSession != null)
                        {

                            posSessionAC.POSSessionId = posSession.Id;
                            posSessionAC.SystemSalesTotalIn = (posSession.Cheque + posSession.Cash + posSession.Coupon + posSession.CreditCard + posSession.DebitCard + posSession.CreditAccount);
                            List<POSBill> listOfPOSBills = _iPOSSessionRepository.GetListOfPOSBill(posSessionAC.POSSessionId);
                            decimal totalAmount = 0;
                            foreach (var item in listOfPOSBills)
                            {
                                totalAmount = totalAmount + item.TotalAmount;
                            }
                            decimal remainingAmount = posSessionAC.SystemSalesTotalIn - totalAmount;
                            posSessionAC.SystemSalesTotalIn = posSessionAC.SystemSalesTotalIn - remainingAmount;
                            posSessionAC.SystemSalesCash = posSession.Cash - remainingAmount;
                            posSessionAC.SystemSalesCoupon = posSession.Coupon;
                            posSessionAC.SystemSalesCreditAccount = posSession.CreditAccount;
                            posSessionAC.SystemSalesCreditCard = posSession.CreditCard;
                            posSessionAC.SystemSalesDebitCard = posSession.DebitCard;
                            posSessionAC.SystemSalesReturnBill = posSession.ReturnedBill;
                            posSessionAC.ActualSalesCash = posSession.ActualCash;
                            posSessionAC.ActualSalesCoupon = posSession.ActualCoupon;
                            posSessionAC.ActualSalesCreditAccount = posSession.ActualCreditAccount;
                            posSessionAC.ActualSalesCreditCard = posSession.ActualCreditCard;
                            posSessionAC.ActualSalesDebitCard = posSession.ActualDebitCard;
                            posSessionAC.ActualSalesReturnBill = posSession.ActualReturnedBill;
                            posSessionAC.ActualCheque = posSession.ActualCheque;
                            posSessionAC.SystemCheque = posSession.Cheque;
                            posSessionAC.Status = posSession.StatusType.Name;
                            posSessionAC.ActualSalesTotalIn = (posSession.ActualCheque + posSession.ActualCash + posSession.ActualCoupon + posSession.ActualCreditAccount + posSession.ActualDebitCard + posSession.ActualCreditCard);
                            return Ok(new { _isResult = posSessionAC });
                        }
                        return Ok(new { _isResult = false });
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
        /// This method used for gwt all transaction type. -An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getalltransactiontype")]
        public IHttpActionResult GetAllTransactionType()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ParamType> listOfParamType = _iPOSSessionRepository.GetListOfTransactionType();
                    return Ok(listOfParamType);
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
        /// This method used for insert pos login sesion. -An
        /// </summary>
        /// <param name="posLoginSession"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insertposloginsession")]
        public IHttpActionResult InsertPOSLoginSession(POSLoginSession posLoginSession)
        {
            try
            {
                int id = _iPOSSessionRepository.AddNewPOSLoginSession(posLoginSession);
                posLoginSession.Id = id;
                return Ok(posLoginSession);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("checkuserlogoutornot")]
        public IHttpActionResult CheckUserLogoutOrNot(int userId)
        {
            try
            {
                var loginSessionObj = _iPOSSessionRepository.CheckUserLogoutOrNot(userId);
                return Ok(loginSessionObj);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for insert non sales transaction. -An
        /// </summary>
        /// <param name="nonSalesTransactionAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("addnonsalestransaction")]
        public IHttpActionResult InsertNonSalesTransaction(NonSalesTransactionAC nonSalesTransactionAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    POSNonSaleTransaction posNonSaleTransaction = new POSNonSaleTransaction();
                    posNonSaleTransaction.IsDeleted = false;
                    posNonSaleTransaction.POSSessionId = nonSalesTransactionAC.POSSessionId;
                    posNonSaleTransaction.Remark = nonSalesTransactionAC.Remark;
                    posNonSaleTransaction.TransactionTypeId = nonSalesTransactionAC.TransactionTypeId;
                    posNonSaleTransaction.CreatedDateTime = DateTime.UtcNow;
                    posNonSaleTransaction.Amount = nonSalesTransactionAC.Amount;
                    int id = _iPOSSessionRepository.AddPOSNonSaleTransaction(posNonSaleTransaction);
                    return Ok(new { _isResult = id });
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
        /// This method used for get non sales transaction.-An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getnonsalestransaction")]
        public IHttpActionResult GetNonSalesTransaction(int id)
        {
            try
            {
                List<POSNonSalesTransactionListAC> posNonSalesTransactionListAc = new List<POSNonSalesTransactionListAC>();
                List<POSNonSaleTransaction> listOfPOSSalesTransaction = _iPOSSessionRepository.GetPOSNonSalesTransactionList(id);
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (listOfPOSSalesTransaction.Count > 0)
                    {
                        foreach (var posNonSaleTransaction in listOfPOSSalesTransaction)
                        {
                            POSNonSalesTransactionListAC objPOSNonSalesTransactionListAc = new POSNonSalesTransactionListAC();
                            objPOSNonSalesTransactionListAc.Amount = posNonSaleTransaction.Amount;
                            objPOSNonSalesTransactionListAc.Id = posNonSaleTransaction.Id;
                            objPOSNonSalesTransactionListAc.POSSessionId = posNonSaleTransaction.POSSessionId;
                            objPOSNonSalesTransactionListAc.Remark = posNonSaleTransaction.Remark;
                            objPOSNonSalesTransactionListAc.TransactionType = posNonSaleTransaction.ParamType.ValueEn;
                            posNonSalesTransactionListAc.Add(objPOSNonSalesTransactionListAc);
                        }
                    }
                    return Ok(posNonSalesTransactionListAc);
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


        [HttpGet]
        [Route("getpossessionbilllistbycashierid")]
        public IHttpActionResult getPOSSessionBillListByCashierId(int id, bool byuser)
        {
            try
            {

                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<POSSessionBillListAC> listOfPOSSessionBill = new List<POSSessionBillListAC>();
                    POSLoginSession posLoginSession;
                    if (byuser)
                        posLoginSession = _iPOSSessionRepository.GetPOSLoginSessionByUserId(id);
                    else
                        posLoginSession = _iPOSSessionRepository.GetPosSessionLoginById(id);

                    if (posLoginSession != null)
                    {
                        DateTime logOutDateTime = posLoginSession.LogoutDateTime != null ? Convert.ToDateTime(posLoginSession.LogoutDateTime) : DateTime.UtcNow;
                        List<POSBill> listPOSBill = _iPOSSessionRepository.ListOfPOSBillByCashierId(posLoginSession.UserId, posLoginSession.LoginDateTime, logOutDateTime);
                        foreach (var posBill in listPOSBill)
                        {
                            POSSessionBillListAC objPOSSessionBillListAC = new POSSessionBillListAC();
                            objPOSSessionBillListAC.POSBillId = posBill.Id;
                            objPOSSessionBillListAC.BillNo = posBill.BillNo;
                            objPOSSessionBillListAC.BillDate = posBill.BillDate;
                            objPOSSessionBillListAC.CashierName = posBill.UserDetail.UserName;
                            objPOSSessionBillListAC.NumberOfTotalAmount = posBill.TotalAmount;
                            objPOSSessionBillListAC.MembershipCode = posBill.Customer.MembershipCode;
                            List<POSSessionBillItemAC> listOfPOSSessionBillItemAc = new List<POSSessionBillItemAC>();
                            List<POSBillItem> listOfPOSBillItem = _iPOSSessionRepository.GetPOSBillItemByPOSBillId(posBill.Id);
                            if (listOfPOSBillItem.Count > 0)
                            {
                                foreach (var posBillItem in listOfPOSBillItem)
                                {
                                    POSSessionBillItemAC posSessionBillItemAc = new POSSessionBillItemAC();
                                    posSessionBillItemAc.Barcode = posBillItem.ItemProfile.Barcode;
                                    posSessionBillItemAc.BaseUnit = posBillItem.ItemProfile.BaseUnit;
                                    posSessionBillItemAc.Flavor = posBillItem.ItemProfile.FlavourEn;
                                    posSessionBillItemAc.Name = posBillItem.ItemProfile.ItemNameEn;
                                    posSessionBillItemAc.POSBillItemId = posBillItem.Id;
                                    posSessionBillItemAc.Quantity = posBillItem.Quantity;
                                    posSessionBillItemAc.ReturnQunatity =
                                        _posReturnBillItemRepository.GetReturnedQuantityByPosBillItemId(posBillItem.Id);
                                    posSessionBillItemAc.SellPrice = posBillItem.SellPrice;
                                    posSessionBillItemAc.Unit = posBillItem.ItemProfile.SystemParameter.ValueEn;
                                    listOfPOSSessionBillItemAc.Add(posSessionBillItemAc);
                                }
                                if (listOfPOSSessionBillItemAc.Count > 0)
                                    objPOSSessionBillListAC.HasChildItem = true;
                            }
                            objPOSSessionBillListAC.listOfPOSSessionBillItemAC = listOfPOSSessionBillItemAc;


                            listOfPOSSessionBill.Add(objPOSSessionBillListAC);
                        }
                    }
                    return Ok(listOfPOSSessionBill);
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

        [HttpGet]
        [Route("getpossessionbilllist")]
        public IHttpActionResult GetPOSSessionBillList()
        {
            try
            {

                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<POSSessionBillListAC> listOfPOSSessionBill = new List<POSSessionBillListAC>();
                    List<POSBill> listPOSBill = _iPOSSessionRepository.ListOfPOSBill();

                    foreach (var posBill in listPOSBill)
                    {
                        POSSessionBillListAC objPOSSessionBillListAC = new POSSessionBillListAC();
                        objPOSSessionBillListAC.POSBillId = posBill.Id;
                        objPOSSessionBillListAC.BillNo = posBill.BillNo;
                        objPOSSessionBillListAC.BillDate = posBill.BillDate;
                        objPOSSessionBillListAC.CashierName = posBill.UserDetail.UserName;
                        objPOSSessionBillListAC.NumberOfTotalAmount = posBill.TotalAmount;
                        objPOSSessionBillListAC.MembershipCode = posBill.Customer.MembershipCode;

                        List<POSBillItem> listOfPOSBillItem = _iPOSSessionRepository.GetPOSBillItemByPOSBillId(posBill.Id);
                        if (listOfPOSBillItem.Count > 0)
                        {
                            List<POSSessionBillItemAC> listOfPOSSessionBillItemAc = new List<POSSessionBillItemAC>();

                            foreach (var posBillItem in listOfPOSBillItem)
                            {
                                POSSessionBillItemAC posSessionBillItemAc = new POSSessionBillItemAC();
                                posSessionBillItemAc.Barcode = posBillItem.ItemProfile.Barcode;
                                posSessionBillItemAc.BaseUnit = posBillItem.ItemProfile.BaseUnit;
                                posSessionBillItemAc.Flavor = posBillItem.ItemProfile.FlavourEn;
                                posSessionBillItemAc.Name = posBillItem.ItemProfile.ItemNameEn;
                                posSessionBillItemAc.POSBillItemId = posBillItem.Id;
                                posSessionBillItemAc.Quantity = posBillItem.Quantity;
                                posSessionBillItemAc.ReturnQunatity = _posReturnBillItemRepository.GetReturnedQuantityByPosBillItemId(posBillItem.Id);
                                posSessionBillItemAc.SellPrice = posBillItem.SellPrice;
                                posSessionBillItemAc.Unit = posBillItem.ItemProfile.SystemParameter.ValueEn;
                                listOfPOSSessionBillItemAc.Add(posSessionBillItemAc);
                            }
                            objPOSSessionBillListAC.listOfPOSSessionBillItemAC = listOfPOSSessionBillItemAc;

                            if (objPOSSessionBillListAC.listOfPOSSessionBillItemAC.Count > 0)
                                objPOSSessionBillListAC.HasChildItem = true;
                        }
                        listOfPOSSessionBill.Add(objPOSSessionBillListAC);
                    }
                    return Ok(listOfPOSSessionBill);
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
        /// This method used for Save Pos Session Close. -An
        /// </summary>
        /// <param name="posSessionAc"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("savepossessionclose")]
        public IHttpActionResult SavePOSSessionClose(POSSessionClosingAC posSessionAc)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsReconciled && posSessionAc != null)
                    {
                        var posSession = _iPOSSessionRepository.GetPOSSessionById(posSessionAc.POSSessionId);
                        if (posSession != null)
                        {
                            if (posSession.ParentRecordId != null)
                                return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                            posSession.ActualCash = posSessionAc.ActualCash;
                            posSession.ActualCoupon = posSessionAc.ActualCoupon;
                            posSession.ActualCreditAccount = posSessionAc.ActualCreditAccount;
                            posSession.ActualCreditCard = posSessionAc.ActualCreditCard;
                            posSession.ActualDebitCard = posSessionAc.ActualDebitCard;
                            posSession.ActualReturnedBill = posSessionAc.ActualReturnBill;
                            posSession.ActualCheque = posSessionAc.ActualCheque;
                            posSession.Comment = posSessionAc.Comment;
                            _iPOSSessionRepository.UpdatePOSSession(posSession);
                            return Ok(new { _isResult = true });
                        }
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
        /// This method used for Submit POS Session CLose. -An
        /// </summary>
        /// <param name="posSessionAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("submitpossessionclose")]
        public IHttpActionResult SubmitPOSSessionClose(POSSessionClosingAC posSessionAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsReconciled)
                    {
                        List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.SessionClosing, currentCompanyId);
                        if (listOfWorkFlowDetail.Any())
                        {
                            var activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.InitiatorId == MerchantContext.Permission.RoleId && x.IsParentAction && x.Activity.Name == StringConstants.Reconciled);
                            if (activityWorkFlow != null)
                            {
                                if (posSessionAC != null)
                                {
                                    POSSession posSession = _iPOSSessionRepository.GetPOSSessionById(posSessionAC.POSSessionId);
                                    if (posSession != null)
                                    {
                                        if (posSession.ParentRecordId != null)
                                            return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                                        ParentRecord parentRecord = new ParentRecord();
                                        parentRecord.BranchId = posSession.POSLoginSession.UserDetail.BranchId;
                                        parentRecord.CreatedDateTime = DateTime.UtcNow;
                                        parentRecord.InitiationComment = posSessionAC.Comment;
                                        parentRecord.InitiationDate = DateTime.UtcNow;
                                        parentRecord.ModificationDate = DateTime.UtcNow;
                                        parentRecord.InitiatorId = MerchantContext.UserId;
                                        parentRecord.ModifiedUserId = parentRecord.InitiatorId;
                                        parentRecord.WorkFlowId = activityWorkFlow.Id;
                                        int recordId = _iParentRecordsRepository.AddParentRecords(parentRecord);
                                        if (recordId != 0)
                                        {
                                            WorkFlowLog workFlowLog = new WorkFlowLog();
                                            workFlowLog.Comments = posSessionAC.Comment;
                                            workFlowLog.CreatedDateTime = DateTime.UtcNow;
                                            workFlowLog.RecordId = recordId;
                                            workFlowLog.RoleId = MerchantContext.Permission.RoleId;
                                            workFlowLog.UserId = MerchantContext.UserId;
                                            workFlowLog.WorkFlowId = activityWorkFlow.Id;
                                            workFlowLog.Action = "Reconciled";
                                            workFlowLog.Stage = (activityWorkFlow.Activity != null ? activityWorkFlow.Activity.Name : "") + " By" + (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "");
                                            int workFlowId = _iParentRecordsRepository.AddWorkFlowLogs(workFlowLog);
                                            if (workFlowId != 0)
                                            {
                                                posSession.ActualCash = posSessionAC.ActualCash;
                                                posSession.ActualCoupon = posSessionAC.ActualCoupon;
                                                posSession.ActualCreditAccount = posSessionAC.ActualCreditAccount;
                                                posSession.ActualCreditCard = posSessionAC.ActualCreditCard;
                                                posSession.ActualDebitCard = posSessionAC.ActualDebitCard;
                                                posSession.ActualReturnedBill = posSessionAC.ActualReturnBill;
                                                posSession.ActualCheque = posSessionAC.ActualCheque;
                                                decimal different = (posSessionAC.SystemSalesTotalIn - posSessionAC.ActualSalesTotalIn);
                                                if (different == 0)
                                                {
                                                    posSession.IsMatched = true;
                                                    posSession.MismatchedValue = 0;
                                                }
                                                else
                                                {
                                                    posSession.IsMatched = false;
                                                    posSession.MismatchedValue = different;
                                                }
                                                posSession.Comment = posSessionAC.Comment;
                                                posSession.StatusTypeId = Convert.ToInt32(POSSessionStatus.Reconciled);
                                                posSession.ParentRecordId = recordId;
                                                _iPOSSessionRepository.UpdatePOSSession(posSession);
                                                return Ok(new { _isResult = true });
                                            }
                                        }
                                    }
                                }
                                return Ok(new { _isResult = false });
                            }
                        }
                    }
                    return Ok(new { _isResult = "IsNotWorkFlow" });
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

        [HttpGet]
        [Route("viewsessionbillpaymentbyid")]
        public IHttpActionResult ViewSessionBillPaymentById(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<POSBillPaymentAC> listOfPOSBillPaymentAC = new List<POSBillPaymentAC>();
                    List<POSBillPayment> listOfPOSBillPayment = _iPOSSessionRepository.GetPOSBillPaymentListById(id);
                    foreach (var posBillPayment in listOfPOSBillPayment)
                    {
                        POSBillPaymentAC posBillPaymentAC = new POSBillPaymentAC();
                        posBillPaymentAC.Amount = posBillPayment.Amount;
                        posBillPaymentAC.BankPOSTransNo = posBillPayment.BankPOSTransNo;
                        posBillPaymentAC.PaymentType = posBillPayment.ParamType.ValueEn;
                        posBillPaymentAC.POSBillID = posBillPayment.POSBillID;
                        posBillPaymentAC.BillNo = posBillPayment.POSBill.BillNo;
                        posBillPaymentAC.PaymentTypeId = posBillPayment.ParamTypeId;
                        listOfPOSBillPaymentAC.Add(posBillPaymentAC);
                    }
                    return Ok(listOfPOSBillPaymentAC);
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
        [Route("changepaymenttypeevent")]
        public IHttpActionResult UpdatePaymentTypeEvent(POSChangePaymentTypeAC posChangePaymentTypeAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    bool isDeleted = _iPOSSessionRepository.DeleteCurrentPaymentTYpeByPOSBillId(posChangePaymentTypeAC.POSSeesionBillId);
                    if (isDeleted)
                    {
                        if (posChangePaymentTypeAC.Cash != 0)
                        {
                            POSBillPayment posBillPayment = new POSBillPayment();
                            posBillPayment.ParamTypeId = Convert.ToInt32(POSBillPaymentType.Cash);
                            posBillPayment.POSBillID = posChangePaymentTypeAC.POSSeesionBillId;
                            posBillPayment.Amount = posChangePaymentTypeAC.Cash;
                            posBillPayment.CreatedDateTime = DateTime.UtcNow;
                            _iPOSSessionRepository.AddNewPOSBillPayment(posBillPayment);
                        }
                        if (posChangePaymentTypeAC.Coupon != 0)
                        {
                            POSBillPayment posBillPaymentCoupon = new POSBillPayment();
                            posBillPaymentCoupon.ParamTypeId = Convert.ToInt32(POSBillPaymentType.Coupon);
                            posBillPaymentCoupon.Amount = posChangePaymentTypeAC.Coupon;
                            posBillPaymentCoupon.POSBillID = posChangePaymentTypeAC.POSSeesionBillId;
                            posBillPaymentCoupon.BankPOSTransNo = posChangePaymentTypeAC.CouponNo;
                            posBillPaymentCoupon.CreatedDateTime = DateTime.UtcNow;
                            _iPOSSessionRepository.AddNewPOSBillPayment(posBillPaymentCoupon);
                        }
                        if (posChangePaymentTypeAC.CreditCard != 0)
                        {
                            POSBillPayment posBillPaymentCreditCard = new POSBillPayment();
                            posBillPaymentCreditCard.ParamTypeId = Convert.ToInt32(POSBillPaymentType.CreditCard);
                            posBillPaymentCreditCard.Amount = posChangePaymentTypeAC.CreditCard;
                            posBillPaymentCreditCard.POSBillID = posChangePaymentTypeAC.POSSeesionBillId;
                            posBillPaymentCreditCard.BankPOSTransNo = posChangePaymentTypeAC.ReceiptNoCreditCard;
                            posBillPaymentCreditCard.CreatedDateTime = DateTime.UtcNow;
                            _iPOSSessionRepository.AddNewPOSBillPayment(posBillPaymentCreditCard);
                        }
                        if (posChangePaymentTypeAC.DebitCard != 0)
                        {
                            POSBillPayment posBillPaymentDebitCard = new POSBillPayment();
                            posBillPaymentDebitCard.ParamTypeId = Convert.ToInt32(POSBillPaymentType.DebitCard);
                            posBillPaymentDebitCard.Amount = posChangePaymentTypeAC.DebitCard;
                            posBillPaymentDebitCard.POSBillID = posChangePaymentTypeAC.POSSeesionBillId;
                            posBillPaymentDebitCard.BankPOSTransNo = posChangePaymentTypeAC.ReceiptNoDebitCard;
                            posBillPaymentDebitCard.CreatedDateTime = DateTime.UtcNow;
                            _iPOSSessionRepository.AddNewPOSBillPayment(posBillPaymentDebitCard);
                        }
                        if (posChangePaymentTypeAC.Cheque != 0)
                        {
                            POSBillPayment posBillPaymentCreditCard = new POSBillPayment();
                            posBillPaymentCreditCard.ParamTypeId = Convert.ToInt32(POSBillPaymentType.Cheque);
                            posBillPaymentCreditCard.Amount = posChangePaymentTypeAC.Cheque;
                            posBillPaymentCreditCard.POSBillID = posChangePaymentTypeAC.POSSeesionBillId;
                            posBillPaymentCreditCard.BankPOSTransNo = posChangePaymentTypeAC.ChequeNo;
                            posBillPaymentCreditCard.CreatedDateTime = DateTime.UtcNow;
                            _iPOSSessionRepository.AddNewPOSBillPayment(posBillPaymentCreditCard);
                        }
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

        [HttpGet]
        [Route("deletednonsalestransaction")]
        public IHttpActionResult DeletedNonSalesTransaction(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var objPosNonSaleTransaction = _iPOSSessionRepository.GetPOSNonSalesTransactionById(id);
                    if (objPosNonSaleTransaction != null)
                    {
                        objPosNonSaleTransaction.IsDeleted = true;
                        _iPOSSessionRepository.UpdatePOSNonSaleTransaction(objPosNonSaleTransaction);
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


        [HttpPost]
        [Route("updatepossessiondata")]
        public IHttpActionResult UpdatePosSessionData(POSSession posSession)
        {
            try
            {
                POSSession posSessionObj = _iPOSSessionRepository.UpdatePosSessionData(posSession);
                return Ok(posSessionObj);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getpossessionwork")]
        public IHttpActionResult GetPOSSessionWorkList()
        {
            try
            {
                List<POSSessionWorkListAC> listOfPOSSessionWorkListAc = new List<POSSessionWorkListAC>();
                List<POSSession> lisOfPosSession = new List<POSSession>();
                if (MerchantContext.Permission.IsAllowToAccessAllBranch)
                    lisOfPosSession = _iPOSSessionRepository.GetListOfPOSSessionAllBranch();
                else
                    lisOfPosSession = _iPOSSessionRepository.GetListOfPOSSession(Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                foreach (var posSession in lisOfPosSession)
                {
                    POSSessionWorkListAC posSessionWorkListAC = new POSSessionWorkListAC();
                    if (posSession.POSLoginSession.UserDetail != null)
                    {
                        if (posSession.POSLoginSession.UserDetail.Branch != null)
                        {
                            posSessionWorkListAC.BranchName = posSession.POSLoginSession.UserDetail.Branch.Name;
                            posSessionWorkListAC.BranchId = Convert.ToInt32(posSession.POSLoginSession.UserDetail.BranchId);
                        }
                        posSessionWorkListAC.CahierName = posSession.POSLoginSession.UserDetail.UserName;
                        posSessionWorkListAC.CashierId = posSession.POSLoginSession.UserDetail.Id;
                    }
                    posSessionWorkListAC.Id = posSession.Id;
                    posSessionWorkListAC.StartDate = posSession.POSLoginSession.LoginDateTime;
                    posSessionWorkListAC.EndDate = posSession.POSLoginSession.LogoutDateTime != null ? Convert.ToDateTime(posSession.POSLoginSession.LogoutDateTime) : DateTime.UtcNow;
                    posSessionWorkListAC.IsMatched = posSession.IsMatched;
                    posSessionWorkListAC.MisMatchValue = posSession.MismatchedValue;
                    posSessionWorkListAC.Status = posSession.StatusType.Name;
                    posSessionWorkListAC.ResolvedAd = posSession.ParamType.ValueEn;
                    posSessionWorkListAC.ResolvedTypeId = posSession.MismatchResolveTypeID;
                    posSessionWorkListAC.StatusId = posSession.StatusTypeId;
                    listOfPOSSessionWorkListAc.Add(posSessionWorkListAC);
                }
                return Ok(listOfPOSSessionWorkListAc);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get cashier list .-An 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getpossessioncashier")]
        public IHttpActionResult GetCashierList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<UserDetail> listOfUserDetail = new List<UserDetail>();
                    var UserDetailList = _userDetailRepository.GetUserListByBranchId(Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    if (UserDetailList.Any())
                    {
                        foreach (var user in UserDetailList)
                        {
                            List<POSSession> listOfPOSSession = _iPOSSessionRepository.GetPosSessionListForReaminingCloseSession();
                            if (listOfPOSSession.Any())
                            {
                                var objectposSession = listOfPOSSession.FirstOrDefault(x => x.POSLoginSession.UserDetail.Id == user.Id);
                                if (objectposSession != null)
                                {
                                    listOfUserDetail.Add(user);
                                }
                            }
                        }
                    }
                    return Ok(listOfUserDetail);
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
        /// This method used for get cashier list by branch. -An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getcashierbybranch")]
        public IHttpActionResult GetCashierByBranch()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {

                    List<UserDetail> listOfUserDetail = new List<UserDetail>();
                    var userList = _userDetailRepository.GetUserListByBranchId(Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    foreach (var user in userList)
                    {
                        UserDetail userDetail = new UserDetail();
                        if (user.RoleName == "Cashier")
                        {
                            userDetail.Id = user.Id;
                            userDetail.UserName = user.UserName;
                            listOfUserDetail.Add(userDetail);
                        }
                    }
                    return Ok(listOfUserDetail);
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
        /// This method used for get session closing varification work flow. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("sessionclosingvarificationworkflow")]
        public IHttpActionResult SessionClosingVarificationWorkFlow(int id)
        {
            try
            {
                POSSession posSession = _iPOSSessionRepository.GetPOSSessionById(id);
                POSSessionAC posSessionAc = new POSSessionAC();
                if (posSession != null)
                {
                    var workFlowLog = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(Convert.ToInt32(posSession.ParentRecordId));
                    if (workFlowLog?.WorkFlowDetail?.AssignedRole.Id == MerchantContext.UserDetails.RoleId)
                    {
                        if ((workFlowLog.WorkFlowDetail.IsParentAction && !workFlowLog.WorkFlowDetail.IsApproval && workFlowLog.WorkFlowDetail.IsReview) ||
                            (workFlowLog.WorkFlowDetail.IsRejectPanel && workFlowLog.WorkFlowDetail.IsChildAction))
                            posSessionAc.IsRiview = true;
                        else if (workFlowLog.WorkFlowDetail.IsParentAction && workFlowLog.WorkFlowDetail.IsApproval)
                            posSessionAc.IsApproval = true;
                    }

                    posSessionAc.ActualSalesCash = posSession.ActualCash;
                    posSessionAc.ActualSalesCoupon = posSession.ActualCoupon;
                    posSessionAc.ActualSalesCreditAccount = posSession.ActualCreditAccount;
                    posSessionAc.ActualSalesCreditCard = posSession.ActualCreditCard;
                    posSessionAc.ActualSalesDebitCard = posSession.ActualDebitCard;
                    posSessionAc.ActualSalesReturnBill = posSession.ActualReturnedBill;
                    posSessionAc.ActualCheque = posSession.ActualCheque;
                    posSessionAc.ActualSalesTotalIn = (posSessionAc.ActualCheque + posSessionAc.ActualSalesCash + posSessionAc.ActualSalesCoupon + posSessionAc.ActualSalesCreditAccount + posSessionAc.ActualSalesCreditCard + posSessionAc.ActualSalesDebitCard);
                    posSessionAc.SystemCheque = posSession.Cheque;
                    posSessionAc.MsMatcheStatus = posSession.IsMatched == true ? "Equivalent" : "Non Equivalent";
                    posSessionAc.MsMatchValue = posSession.MismatchedValue;
                    posSessionAc.POSSessionId = posSession.Id;
                    posSessionAc.POSSessionLoginId = posSession.POSLoginSessionId;
                    posSessionAc.SessionStartDate = posSession.POSLoginSession.LoginDateTime.ToString("dd-MM-yyyy hh:mm");
                    posSessionAc.SessionEndDate = posSession.POSLoginSession.LogoutDateTime != null ? Convert.ToDateTime(posSession.POSLoginSession.LogoutDateTime).ToString("dd-MM-yyyy hh:mm") : DateTime.UtcNow.ToString("dd-MM-yyyy hh:mm");
                    posSessionAc.Cashier = posSession.POSLoginSession.UserDetail.UserName;
                    posSessionAc.CashierId = posSession.POSLoginSession.UserDetail.Id;
                    posSessionAc.MismatchResolveTypeID = posSession.MismatchResolveTypeID;
                    if (posSession.ParentRecordId != null)
                    {
                        WorkFlowLog workFlowLogObject = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(Convert.ToInt32(posSession.ParentRecordId));
                        posSessionAc.SessionStatus = workFlowLogObject != null ? workFlowLogObject.WorkFlowDetail.Activity.Name : "";
                    }
                    posSessionAc.Comment = posSession.Comment;

                    posSessionAc.SystemSalesTotalIn = (posSession.Cheque + posSession.Cash + posSession.Coupon + posSession.CreditAccount + posSession.CreditCard + posSession.DebitCard);

                    List<POSBill> listOfPOSBills = _iPOSSessionRepository.GetListOfPOSBill(posSession.Id);
                    decimal totalAmount = 0;
                    foreach (var item in listOfPOSBills)
                    {
                        totalAmount = totalAmount + item.TotalAmount;
                    }

                    decimal remainingAmount = posSessionAc.SystemSalesTotalIn - totalAmount;
                    posSessionAc.SystemSalesTotalIn = posSessionAc.SystemSalesTotalIn - remainingAmount;
                    posSessionAc.SystemSalesCash = posSession.Cash - remainingAmount;
                    posSessionAc.SystemSalesCoupon = posSession.Coupon;
                    posSessionAc.SystemSalesCreditAccount = posSession.CreditAccount;
                    posSessionAc.SystemSalesCreditCard = posSession.CreditCard;
                    posSessionAc.SystemSalesDebitCard = posSession.DebitCard;
                    posSessionAc.SystemSalesReturnBill = posSession.ReturnedBill;
                    posSessionAc.Branch = posSession.POSLoginSession.UserDetail.Branch.Name;
                    posSessionAc.BranchId = Convert.ToInt32(posSession.POSLoginSession.UserDetail.BranchId);

                    List<POSNonSalesTransactionListAC> posNonSalesTransactionListAc = new List<POSNonSalesTransactionListAC>();
                    List<POSNonSaleTransaction> listOfPOSSalesTransaction = _iPOSSessionRepository.GetPOSNonSalesTransactionList(id);
                    if (listOfPOSSalesTransaction.Count > 0)
                    {
                        foreach (var posNonSaleTransaction in listOfPOSSalesTransaction)
                        {
                            POSNonSalesTransactionListAC objPOSNonSalesTransactionListAc = new POSNonSalesTransactionListAC();
                            objPOSNonSalesTransactionListAc.Amount = posNonSaleTransaction.Amount;
                            objPOSNonSalesTransactionListAc.Id = posNonSaleTransaction.Id;
                            objPOSNonSalesTransactionListAc.POSSessionId = posNonSaleTransaction.POSSessionId;
                            objPOSNonSalesTransactionListAc.Remark = posNonSaleTransaction.Remark;
                            objPOSNonSalesTransactionListAc.TransactionType = posNonSaleTransaction.ParamType.ValueEn;
                            posNonSalesTransactionListAc.Add(objPOSNonSalesTransactionListAc);
                        }
                    }
                    posSessionAc.listOfPOSNonSalesTransactionListAC = posNonSalesTransactionListAc;
                }
                return Ok(posSessionAc);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for update seesion closing. -AN
        /// </summary>
        /// <param name="posSessionAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("sessionclosingupdate")]
        public IHttpActionResult SessionClosingUpdate(POSSessionClosingAC posSessionAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (posSessionAC != null)
                    {
                        var posSession = _iPOSSessionRepository.GetPOSSessionById(posSessionAC.POSSessionId);
                        if (posSession != null)
                        {
                            var workFlowLogObject = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(Convert.ToInt32(posSession.ParentRecordId));
                            if (workFlowLogObject != null)
                            {
                                if (_iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(posSession.ParentRecordId), StringConstants.Rejected, MerchantContext.UserDetails.RoleId))
                                    return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                                List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.SessionClosing, currentCompanyId);
                                if (listOfWorkFlowDetail.Any())
                                {
                                    WorkFlowDetail workFlowActivity = new WorkFlowDetail();
                                    if (workFlowLogObject.WorkFlowDetail.IsRejectPanel)
                                        workFlowActivity = listOfWorkFlowDetail.FirstOrDefault(x => x.Id == workFlowLogObject.WorkFlowDetail.ParentActivityId);
                                    else
                                        workFlowActivity = listOfWorkFlowDetail.FirstOrDefault(x => x.IsApproval && x.IsParentAction && x.ParentActivityId == workFlowLogObject.WorkFlowId);
                                    if (workFlowActivity != null)
                                    {
                                        WorkFlowLog workFlowLog = new WorkFlowLog();
                                        workFlowLog.Comments = posSessionAC.Comment;
                                        workFlowLog.CreatedDateTime = DateTime.UtcNow;
                                        workFlowLog.RecordId = Convert.ToInt32(posSession.ParentRecordId);
                                        workFlowLog.RoleId = MerchantContext.Permission.RoleId;
                                        workFlowLog.UserId = MerchantContext.UserId;
                                        workFlowLog.WorkFlowId = workFlowActivity.Id;
                                        workFlowLog.Action = "Varified";
                                        if (workFlowActivity.Activity.Name == "Review")
                                            workFlowLog.Stage = "Reviewed by " + (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "");
                                        int workFlowId = _iParentRecordsRepository.AddWorkFlowLogs(workFlowLog);
                                        if (workFlowId != 0)
                                        {
                                            posSession.ActualCash = posSessionAC.ActualCash;
                                            posSession.ActualCoupon = posSessionAC.ActualCoupon;
                                            posSession.ActualCreditAccount = posSessionAC.ActualCreditAccount;
                                            posSession.ActualCreditCard = posSessionAC.ActualCreditCard;
                                            posSession.ActualDebitCard = posSessionAC.ActualDebitCard;
                                            posSession.ActualCheque = posSessionAC.ActualCheque;
                                            posSession.ActualReturnedBill = posSessionAC.ActualReturnBill;
                                            decimal different = (posSessionAC.SystemSalesTotalIn - posSessionAC.ActualSalesTotalIn);
                                            if (different == 0)
                                            {
                                                posSession.IsMatched = true;
                                                posSession.MismatchedValue = 0;
                                            }
                                            else
                                            {
                                                posSession.IsMatched = false;
                                                posSession.MismatchedValue = different;
                                            }
                                            posSession.Comment = posSessionAC.Comment;
                                            posSession.StatusTypeId = Convert.ToInt32(POSSessionStatus.Verified);
                                            if (posSessionAC.MismatchResolveTypeID != 0)
                                                posSession.MismatchResolveTypeID = posSessionAC.MismatchResolveTypeID;
                                            _iPOSSessionRepository.UpdatePOSSession(posSession);
                                            return Ok(new { _isResult = true });
                                        }
                                    }
                                }
                            }
                            return Ok(new { _isResult = "WorkFlowNotExists" });
                        }
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
        /// This method used for Get Pos Session Action List. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getpossessionactionlist")]
        public IHttpActionResult GetPOSSessionActionList(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<WorkFlowActionAC> listOfWorkFlowActionAc = new List<WorkFlowActionAC>();
                    POSSession posSession = _iPOSSessionRepository.GetPOSSessionById(id);
                    if (posSession != null)
                    {
                        List<WorkFlowLog> listOfWrkFlow = _iParentRecordsRepository.GetListOfWorkFlowLogByRecordId(Convert.ToInt32(posSession.ParentRecordId));
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
        /// This method used for varfication for possesion. -An
        /// </summary>
        /// <param name="posSessionAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("varificationforpossession")]
        public IHttpActionResult VarificationForPOSSession(POSSessionClosingAC posSessionAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (posSessionAC != null)
                    {
                        var posSession = _iPOSSessionRepository.GetPOSSessionById(posSessionAC.POSSessionId);
                        if (posSession != null)
                        {

                            var workFlowLogObject = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(Convert.ToInt32(posSession.ParentRecordId));
                            if (workFlowLogObject != null)
                            {
                                if (_iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(posSession.ParentRecordId), StringConstants.Rejected, MerchantContext.UserDetails.RoleId))
                                    return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                                List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.SessionClosing, currentCompanyId);
                                if (listOfWorkFlowDetail.Any())
                                {
                                    WorkFlowDetail workFlowActivity = new WorkFlowDetail();
                                    if (workFlowLogObject.WorkFlowDetail.IsRejectPanel)
                                        workFlowActivity = listOfWorkFlowDetail.FirstOrDefault(x => x.Id == workFlowLogObject.WorkFlowDetail.ParentActivityId);
                                    else
                                        workFlowActivity = listOfWorkFlowDetail.FirstOrDefault(x => x.IsApproval && x.IsParentAction && x.ParentActivityId == workFlowLogObject.WorkFlowId);

                                    if (workFlowActivity != null)
                                    {
                                        WorkFlowLog workFlowLog = new WorkFlowLog();
                                        workFlowLog.Comments = posSessionAC.Comment;
                                        workFlowLog.CreatedDateTime = DateTime.UtcNow;
                                        workFlowLog.RecordId = Convert.ToInt32(posSession.ParentRecordId);
                                        workFlowLog.RoleId = MerchantContext.Permission.RoleId;
                                        workFlowLog.UserId = MerchantContext.UserId;
                                        workFlowLog.WorkFlowId = workFlowActivity.Id;
                                        workFlowLog.Action = "Varified";
                                        if (workFlowActivity.Activity.Name == "Review")
                                            workFlowLog.Stage = "Reviewed by " + (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "");
                                        int workFlowId = _iParentRecordsRepository.AddWorkFlowLogs(workFlowLog);
                                        if (workFlowId != 0)
                                        {
                                            posSession.Comment = posSessionAC.Comment;
                                            posSession.StatusTypeId = Convert.ToInt32(POSSessionStatus.Verified);
                                            _iPOSSessionRepository.UpdatePOSSession(posSession);
                                            if (posSessionAC.StatusId != 0)
                                            {
                                                posSession.MismatchResolveTypeID = posSessionAC.StatusId;
                                                _iPOSSessionRepository.UpdatePOSSession(posSession);
                                            }
                                            return Ok(new { _isResult = true });
                                        }
                                    }
                                }
                            }
                            return Ok(new { _isResult = "WorkFlowNotExists" });
                        }
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
        /// This method used for Approve For PosSession. -An
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("approveforpossession")]
        public IHttpActionResult ApproveForPOSSession(POSSessionClosingAC posSessionAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (posSessionAC != null)
                    {
                        var posSession = _iPOSSessionRepository.GetPOSSessionById(posSessionAC.POSSessionId);
                        if (posSession != null)
                        {
                            if (_iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(posSession.ParentRecordId), StringConstants.Reconciled, MerchantContext.UserDetails.RoleId))
                                return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                            var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(Convert.ToInt32(posSession.ParentRecordId), StringConstants.ApprovAction, posSessionAC.Comment, MerchantContext.UserDetails, true);
                            if (activityWorkFlow != null)
                            {
                                var workFlowActivity = _iParentRecordsRepository.GetWorkFlowDetailById(activityWorkFlow.WorkFlowId);
                                if (workFlowActivity != null)
                                {
                                    posSession.Comment = posSessionAC.Comment;
                                    posSession.StatusTypeId = Convert.ToInt32(POSSessionStatus.Confirmed);
                                    _iPOSSessionRepository.UpdatePOSSession(posSession);
                                    if (posSessionAC.StatusId != 0)
                                    {
                                        posSession.MismatchResolveTypeID = posSessionAC.StatusId;
                                        _iPOSSessionRepository.UpdatePOSSession(posSession);
                                    }
                                    return Ok(new { _isResult = true });
                                }
                            }
                            return Ok(new { _isResult = "WorkFlowNotExists" });
                        }
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
        /// This method used for Reject For PosSession. -An
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("rejectforpossession")]
        public IHttpActionResult RejectForPOSSession(POSSessionClosingAC posSessionAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (posSessionAC != null)
                    {
                        var posSession = _iPOSSessionRepository.GetPOSSessionById(posSessionAC.POSSessionId);
                        if (posSession != null)
                        {
                            if (_iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(posSession.ParentRecordId), StringConstants.Reconciled, MerchantContext.UserDetails.RoleId))
                                return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                            var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(Convert.ToInt32(posSession.ParentRecordId), StringConstants.RejectAction, posSessionAC.Comment, MerchantContext.UserDetails, false);
                            if (activityWorkFlow != null)
                            {
                                var workFlowActivity = _iParentRecordsRepository.GetWorkFlowDetailById(activityWorkFlow.WorkFlowId);
                                if (workFlowActivity != null)
                                {
                                    posSession.Comment = posSessionAC.Comment;
                                    posSession.StatusTypeId = Convert.ToInt32(POSSessionStatus.Reconciled);
                                    _iPOSSessionRepository.UpdatePOSSession(posSession);
                                    if (posSessionAC.StatusId != 0)
                                    {
                                        posSession.MismatchResolveTypeID = posSessionAC.StatusId;
                                        _iPOSSessionRepository.UpdatePOSSession(posSession);
                                    }
                                    return Ok(new { _isResult = true });
                                }
                            }
                            return Ok(new { _isResult = "WorkFlowNotExists" });
                        }
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


        [HttpGet]
        [Route("getpossessionbysessionloginid")]
        public IHttpActionResult GetPosSessionBySessionLoginId(int userLoginId)
        {
            try
            {
                POSSession posSession = _iPOSSessionRepository.GetPosSessionBySessionLoginId(userLoginId);
                return Ok(posSession);
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpPost]
        [Route("updatepossessionforendseesion")]
        public IHttpActionResult UpdatePosSessionForEndSeesion(POSSession posSession)
        {
            try
            {
                var posSessionObj = _iPOSSessionRepository.UpdatePosSessionForEndSeesion(posSession);
                return Ok(posSessionObj);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("updateposloginsessionforendsession")]
        public IHttpActionResult UpdatePosLoginSessionForEndSession(POSLoginSession posLoginSession)
        {
            try
            {
                var posLoginObj = _iPOSSessionRepository.UpdatePosLoginSessionForEndSession(posLoginSession);
                return Ok(posLoginObj);
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpGet]
        [Route("getlastlogoutrecordbyuserid")]
        public IHttpActionResult GetLastLogoutRecordByUserId(int userId)
        {
            try
            {
                var posLoginSession = _iPOSSessionRepository.GetLastLogoutRecordByUserId(userId);
                return Ok(posLoginSession);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("updatepossessionforreturnedbillamount")]
        public IHttpActionResult UpdatePosSessionForReturnedBillAmount(POSSession posSession)
        {
            try
            {
                _iPOSSessionRepository.UpdatePosSessionForReturnedBillAmount(posSession);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}

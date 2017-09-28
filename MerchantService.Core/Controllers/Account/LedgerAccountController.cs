using System;
using System.Collections.Generic;
using System.Web.Http;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Account;
using MerchantService.Utility.Logger;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.Modules.Global;
using MerchantService.Core.Global;

namespace MerchantService.Core.Controllers.Account
{
    //[DynamicAuthorize]
    public class LedgerAccountController : BaseController
    {
        #region Private Variable

        private readonly IErrorLog _errorLog;
        private readonly ILedgerAccountRepository _ledgerAccountRepository;
        private readonly IAccountingRepository _accountingRepository;
        private readonly IGroupAccountRepository _groupAccountRepository;
        private readonly int CurrentCompanyId = 0;
        #endregion

        #region Constructor

        public LedgerAccountController(IErrorLog iErrorLog, ILedgerAccountRepository ledgerAccountRepository, IGroupAccountRepository groupAccountRepository,
            IMerchantDataRepository merchantDataRepository, IAccountingRepository accountingRepository)
            : base(iErrorLog, merchantDataRepository)
        {
            _errorLog = iErrorLog;
            _ledgerAccountRepository = ledgerAccountRepository;
            _accountingRepository = accountingRepository;
            _groupAccountRepository = groupAccountRepository;
            CurrentCompanyId = MerchantContext.CompanyDetails.Id;

        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method is used for getting list of Ledgers.- SP
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/LedgerAccount/GetLedgerList")]
        public IHttpActionResult GetLedgerList()
        {
            try
            {
                var ledgerList = _ledgerAccountRepository.GetLedgerListByCompanyId(CurrentCompanyId);
                var ledgerCollection = new List<LedgerAccountAC>();
                var ledgerAc = new LedgerAccountAC();
                foreach (var ledger in ledgerList)
                {
                    //it will convert model class to appliation class based on naming conversions.
                    ledgerAc = ApplicationClassHelper.ConvertType<Ledgers, LedgerAccountAC>(ledger);
                    ledgerAc.LedgerId = ledger.Id;
                    ledgerAc.IsEditable = ledger.IsEditable;
                    if (!ledger.IsEditable)
                        ledgerAc.BranchName = ledger.BranchDetail != null ? ledger.BranchDetail.Name : "";
                    else
                        ledgerAc.BranchName = "";
                    ledgerAc.LedgerName = ledger.LedgerName;
                    ledgerAc.Address = ledger.Address;
                    ledgerAc.State = ledger.State;
                    ledgerAc.GroupTypeId = ledger.GroupTypId != null ? Convert.ToInt32(ledger.GroupTypId) : 0;
                    ledgerAc.GroupTypeName = ledger.GroupType != null ? ledger.GroupType.Name : "";
                    ledgerAc.ParentLedgerId = ledger.ParentLedgerId != null ? Convert.ToInt32(ledger.ParentLedgerId) : 0;
                    ledgerAc.Balance = ledger.Balance;
                    ledgerAc.GroupName = ledger.Group.GroupName;
                    ledgerCollection.Add((ledgerAc));
                }
                return Ok(ledgerCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("api/LedgerAccount/UpdateLedger")]
        public IHttpActionResult UpdateLedgers(LedgerAccountAC ledgerAccountAc)
        {
            try
            {
                Ledgers ledgers = _ledgerAccountRepository.GetLedgersByLedgersId(ledgerAccountAc.LedgerId);
                if (ledgers != null)
                {
                    ledgers.LedgerName = ledgerAccountAc.LedgerName;
                    ledgers.Name = ledgerAccountAc.LedgerName;
                    int id = _ledgerAccountRepository.UpdateLedgers(ledgers);
                    if (id == 0)
                        return Ok(new { _isResult = "NotValidLedgerName" });
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
        [Route("api/LedgerAccount/getLedegerWithChild")]
        public IHttpActionResult GetLedegerWithChild()
        {
            try
            {
                List<LedgerAccountAC> listOfLedgerAccountAC = _accountingRepository.GetLedgerAccountListByCompanyId(CurrentCompanyId);
                return Ok(listOfLedgerAccountAC);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("api/LedgerAccount/getGroupTypeList")]
        public IHttpActionResult GetGroupTypeList(int groupId)
        {
            try
            {
                List<GroupType> listOfGroupType = _groupAccountRepository.GetGroupTypeListByGroupId(groupId);
                return Ok(listOfGroupType);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for getting list of Receipt and payment Account. -SP
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/LedgerAccount/GetReceiptPaymentAccount")]
        public IHttpActionResult GetReceiptPaymentAccount()
        {
            try
            {
                var ledgerList = _ledgerAccountRepository.GetReceiptPaymentLeadgers(CurrentCompanyId);
                var ledgerCollection = new List<LedgerAccountAC>();
                var ledgerAc = new LedgerAccountAC();
                foreach (var ledger in ledgerList)
                {
                    //it will convert model class to appliation class based on naming conversions.
                    ledgerAc = ApplicationClassHelper.ConvertType<Ledgers, LedgerAccountAC>(ledger);
                    ledgerAc.LedgerId = ledger.Id;
                    ledgerAc.LedgerName = ledger.LedgerName;
                    ledgerAc.GroupName = ledger.Group.GroupName;
                    ledgerCollection.Add((ledgerAc));
                }
                return Ok(ledgerCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is use for save ledger account. -SP
        /// </summary>
        /// <param name="ledger">Object of LedgerAccountAC</param>
        /// <returns>object of LedgerAccountAC </returns>
        [HttpPost]
        [Route("api/LedgerAccount/SaveLedger")]
        public IHttpActionResult SaveLedger(LedgerAccountAC ledger)
        {
            try
            {
                bool isValidGroup = true;
                if (ledger.isSubAccountChecked)
                {
                    Ledgers ledgres = _ledgerAccountRepository.GetLedgersByLedgersId(ledger.ParentLedgerId);
                    if (ledgres != null && ledgres.Group.Id != ledger.GroupId)
                    {
                        isValidGroup = false;
                    }
                }
                if (isValidGroup)
                {
                    Ledgers newLedgers = new Ledgers();
                    newLedgers.CreatedDateTime = DateTime.UtcNow;
                    newLedgers.CompanyId = CurrentCompanyId;
                    newLedgers.GroupId = ledger.GroupId;
                    newLedgers.GroupTypId = ledger.GroupTypeId;
                    newLedgers.LedgerName = ledger.LedgerName;
                    newLedgers.LedgersDate = ledger.ledgersDate != null ? Convert.ToDateTime(ledger.ledgersDate).ToLocalTime() : ledger.ledgersDate;
                    newLedgers.Name = newLedgers.LedgerName;
                    newLedgers.Balance = ledger.Balance;
                    newLedgers.IsEditable = true;
                    if (ledger.ParentLedgerId != 0)
                        newLedgers.ParentLedgerId = ledger.ParentLedgerId;
                    newLedgers.Description = ledger.Description;
                    int id = _ledgerAccountRepository.SaveLedgers(newLedgers);
                    if (id != 0)
                        return Ok(new { _isResult = id });
                    else
                        return Ok(new { _isResult = "NotValidLedgerName" });
                }
                return Ok(new { _isResult = "NotValidGroup" });

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This methoed is used for checking selected account is Bank account or not. SP
        /// </summary>
        /// <param name="ledgerId">ledger account Id </param>
        /// <returns>retrun boolen</returns>
        [HttpGet]
        [Route("api/LedgerAccount/CheckSelectedLedgerIsBankAccount")]
        public IHttpActionResult CheckSelectedLedgerIsBankAccount(int ledgerId)
        {
            try
            {
                bool result = _ledgerAccountRepository.CheckSelectedLedgerIsBankAccount(ledgerId);
                return Ok(new { IsBankAccount = result });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for getting all ledger account without Cash and Banck Account. -SP
        /// </summary>
        /// <returns>retrun list of LedgerAccountAC</returns>
        [HttpGet]
        [Route("api/LedgerAccount/GetLedgerAccountWithoutCashAndBank")]
        public IHttpActionResult GetLedgerAccountWithoutCashAndBank()
        {
            try
            {
                var ledgerList = _ledgerAccountRepository.GetLedgerAccountWithoutCashAndBank(CurrentCompanyId);
                List<LedgerAccountAC> ledgerCollection = GetLedgerAccountAC(ledgerList);
                return Ok(ledgerCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for getting list of sales ledger account by company id.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/LedgerAccount/GetSalesLedgerAccount")]
        public IHttpActionResult GetSalesLedgerAccount()
        {
            try
            {
                var ledgerList = _ledgerAccountRepository.GetSalesLedgerAccount(CurrentCompanyId);
                List<LedgerAccountAC> ledgerCollection = GetLedgerAccountAC(ledgerList);
                return Ok(ledgerCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for getting list of purchase ledger account by company id.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/LedgerAccount/GetPurchaseLedgerAccount")]
        public IHttpActionResult GetPurchaseLedgerAccount()
        {
            try
            {
                var ledgerList = _ledgerAccountRepository.GetPurchaseLedgerAccount(CurrentCompanyId);
                List<LedgerAccountAC> ledgerCollection = GetLedgerAccountAC(ledgerList);
                return Ok(ledgerCollection);
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
        /// This method used for get ledger account ac list 
        /// </summary>
        /// <param name="listOfLedgers">pass ledgers list</param>
        /// <returns></returns>
        private List<LedgerAccountAC> GetLedgerAccountAC(List<Ledgers> listOfLedgers)
        {
            var ledgerCollection = new List<LedgerAccountAC>();
            var ledgerAc = new LedgerAccountAC();
            foreach (var ledger in listOfLedgers)
            {
                //it will convert model class to appliation class based on naming conversions.
                ledgerAc = ApplicationClassHelper.ConvertType<Ledgers, LedgerAccountAC>(ledger);
                ledgerAc.LedgerId = ledger.Id;
                ledgerAc.LedgerName = ledger.LedgerName;
                ledgerAc.Address = ledger.Address;
                ledgerAc.State = ledger.State;
                ledgerAc.GroupName = ledger.Group.GroupName;
                ledgerCollection.Add((ledgerAc));
            }
            return ledgerCollection;
        }




        #endregion

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Logger;
using MerchantService.Repository.Helper;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Core.Global;

namespace MerchantService.Core.Controllers.Account
{
    //[DynamicAuthorize]
    public class AccountingController : BaseController
    {
        private readonly IErrorLog _errorLog;
        private readonly IAccountingRepository _accountingRepository;
        #region Constructor
        public AccountingController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IAccountingRepository accountingRepository)
             : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _accountingRepository = accountingRepository;
        }
        #endregion

        #region Public Method

        [Route("api/Accounting/getAllLedgerAccountList")]
        [HttpGet]
        public IHttpActionResult GetAllLedgerAccountList()
        {
            try
            {
                var ledgerCollection = _accountingRepository.GetLedgerAccountListByCompanyId(MerchantContext.CompanyDetails.Id);
                return Ok(ledgerCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        [Route("api/Accounting/saveAccountingJournalEntry")]
        [HttpPost]
        public IHttpActionResult SaveAccountingJournalEntry(JournalEntryAc journalEntryDetails)
        {
            try
            {
                _accountingRepository.SaveAccountingJournalEntry(journalEntryDetails);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("api/Accounting/getAllAccountingEntry")]
        [HttpGet]
        public IHttpActionResult GetAllAccountingEntry()
        {
            try
            {
                decimal totalDebit = 0;
                decimal totalCredit = 0;
                var account = new AccountingAc();
                var accountCollection = new List<DoubleEntryAc>();
                var accountlist = _accountingRepository.GetAllAccountingEntry(MerchantContext.UserDetails.BranchId);
                foreach (var accountInfo in accountlist)
                {
                    var accountAc = new DoubleEntryAc();
                    accountAc = ApplicationClassHelper.ConvertType<DoubleEntry, DoubleEntryAc>(accountInfo);
                    accountAc.DoubleEntryId = accountInfo.Id;
                    totalDebit = totalDebit + accountInfo.Debit;
                    totalCredit = totalCredit + accountInfo.Credit;
                    accountAc.LedgerName = accountInfo.Ledger.Name;
                    accountCollection.Add(accountAc);
                }
                account.TotalCredit = totalCredit;
                account.TotalDebit = totalDebit;
                account.DoubleEntryAc = accountCollection.OrderByDescending(x => x.DoubleEntryId);

                return Ok(account);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("api/Accounting/AddAccountingEntries")]
        [HttpPost]
        public IHttpActionResult AddAccountingEntries(List<DoubleEntry> doubleEntry)
        {
            _accountingRepository.AddAccountingEntries(doubleEntry);
            return Ok();
        }

        [Route("api/Accounting/GetAllLedgersByBranch")]
        [HttpGet]
        public IHttpActionResult GetAllLedgersByBranch(int branchId)
        {
            try
            {
                var ledgerCollection = _accountingRepository.GetLedgersByBranch(branchId);
                return Ok(ledgerCollection);
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

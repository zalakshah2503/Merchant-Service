using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Account
{
    public class AccountingRepository : IAccountingRepository, IDisposable
    {
        #region Private Variable
        private readonly IDataRepository<Ledgers> _accountLedgerContext;
        private readonly IDataRepository<Group> _accountGroupContext;
        private readonly IDataRepository<DoubleEntry> _accountEntryContext;

        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public AccountingRepository(IErrorLog errorlog, IDataRepository<Ledgers> accountLedgerContext, IDataRepository<Group> accountGroupContext,
            IDataRepository<DoubleEntry> accountEntryContext)
        {
            _errorLog = errorlog;
            _accountGroupContext = accountGroupContext;
            _accountEntryContext = accountEntryContext;
            _accountLedgerContext = accountLedgerContext;
        }

        #endregion

        #region Public Method


        /// <summary>
        /// This method used for add ledgers -An
        /// </summary>
        /// <param name="listOfLedger"></param>
        /// <returns></returns>
        public bool AddLedgers(List<Ledgers> listOfLedger)
        {
            try
            {
                foreach (var ledger in listOfLedger)
                {
                    ledger.CreatedDateTime = DateTime.UtcNow;
                    _accountLedgerContext.Add(ledger);
                    _accountLedgerContext.SaveChanges();

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
        /// This method used for add acount group. -An
        /// </summary>
        /// <param name="accountGroup"></param>
        /// <returns></returns>
        public int AddAccountGroup(Group accountGroup)
        {
            try
            {
                accountGroup.CreatedDateTime = DateTime.UtcNow;
                _accountGroupContext.Add(accountGroup);
                _accountGroupContext.SaveChanges();
                return accountGroup.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for add account ledeger. -An
        /// </summary>
        /// <param name="accountLedger"></param>
        /// <returns></returns>
        public int AddAccountLedger(Ledgers accountLedger)
        {
            try
            {
                accountLedger.CreatedDateTime = DateTime.UtcNow;
                _accountLedgerContext.Add(accountLedger);
                _accountLedgerContext.SaveChanges();
                return accountLedger.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update account group. -An
        /// </summary>
        /// <param name="accountGroup"></param>
        /// <returns></returns>
        public int UpdateAccountGroup(Group accountGroup)
        {
            try
            {
                accountGroup.ModifiedDateTime = DateTime.UtcNow;
                _accountGroupContext.Update(accountGroup);
                _accountGroupContext.SaveChanges();
                return accountGroup.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update account ledeger. -An
        /// </summary>
        /// <param name="accountLedger"></param>
        /// <returns></returns>
        public int UpdateAccountLedger(Ledgers accountLedger)
        {
            try
            {
                accountLedger.ModifiedDateTime = DateTime.UtcNow;
                _accountLedgerContext.Update(accountLedger);
                _accountLedgerContext.SaveChanges();
                return accountLedger.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for add accounting entries. -An 
        /// </summary>
        /// <param name="listOfAccountEntry"></param>
        /// <returns></returns>
        public bool AddAccountingEntries(List<DoubleEntry> listOfAccountEntry)
        {
            try
            {
                foreach (var accountEntry in listOfAccountEntry)
                {
                    accountEntry.CreatedDateTime = DateTime.UtcNow;
                    _accountEntryContext.Add(accountEntry);
                    _accountEntryContext.SaveChanges();
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
        /// This method used for get account ledger by name. -An
        /// </summary>
        /// <param name="ledgerName"></param>
        /// <returns></returns>
        public Ledgers GetAccountLedgerByName(string ledgerName, int branchId)
        {
            try
            {
                return _accountLedgerContext.FirstOrDefault(x => x.Name == ledgerName && x.BranchId == branchId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for Get Account Ledger By Supllier Id.-An
        /// </summary>
        /// <param name="supplierId"></param>
        /// <returns></returns>
        public Ledgers GetAccountLedgerBySupplier(int supplierId)
        {
            try
            {
                return _accountLedgerContext.FirstOrDefault(x => x.SuplierId == supplierId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for Get Account Ledger By Customer Id.-JJ
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        public Ledgers GetAccountLedgerByCustomer(int customerId)
        {
            try
            {
                return _accountLedgerContext.FirstOrDefault(x => x.CustomerId == customerId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get Ledger Account list By Comapny Id.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<LedgerAccountAC> GetLedgerAccountListByCompanyId(int companyId)
        {
            var ledgerAccountCollection = new List<LedgerAccountAC>();
            foreach (var ledgerse in _accountLedgerContext.Fetch(x => x.CompanyId == companyId).ToList())
            {
                var ledgerAccountAc = ApplicationClassHelper.ConvertType<Ledgers, LedgerAccountAC>(ledgerse);
                ledgerAccountAc.LedgerId = ledgerse.Id;

                if (ledgerse.ParentLedger != null)
                {
                    ledgerAccountAc.LableName = "Sub account of " + ledgerse.ParentLedger.Name;
                    ledgerAccountAc.IsChild = true;
                }
                else
                    ledgerAccountAc.LableName = ledgerse.Group.GroupName;

                ledgerAccountCollection.Add(ledgerAccountAc);
            }
            return ledgerAccountCollection;
        }

        /// <summary>
        /// This method used for get Ledger Account list By Comapny Id.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<Ledgers> GetLedgersByBranch(int branchId)
        {
            return _accountLedgerContext.Fetch().Where(x => x.BranchId == branchId).ToList();
        }

        /// <summary>
        /// This method used to save accounting journal entry
        /// </summary>
        /// <param name="journalEntryDetails"></param>
        public void SaveAccountingJournalEntry(JournalEntryAc journalEntryDetails)
        {
            try
            {
                foreach (var entryDetails in journalEntryDetails.JournalEntryCollection)
                {
                    if (entryDetails.LedgerId != 0 && (entryDetails.DebitAmount != 0 || entryDetails.CreditAmount != 0))
                    {
                        var doubleEntry = new DoubleEntry
                        {
                            Debit = entryDetails.DebitAmount,
                            Credit = entryDetails.CreditAmount,
                            Description = entryDetails.Description,
                            LedgerId = entryDetails.LedgerId,
                            TransactionDate = journalEntryDetails.JournalDate.ToLocalTime(),
                            ActivityName = StringConstants.JournalEntry,
                            CreatedDateTime = DateTime.UtcNow
                        };
                        _accountEntryContext.Add(doubleEntry);
                        _accountEntryContext.SaveChanges();
                    }

                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<LedgerAccountAC> GetAllLedgerAccountListByCompanyId(int companyId)
        {
            try
            {
                var ledgerAccountCollection = new List<LedgerAccountAC>();
                foreach (var ledgerse in _accountLedgerContext.Fetch(x => x.ParentLedgerId == null && x.CompanyId == companyId).ToList())
                {
                    var ledgerAccountAc = new LedgerAccountAC();
                    ledgerAccountAc = ApplicationClassHelper.ConvertType<Ledgers, LedgerAccountAC>(ledgerse);
                    ledgerAccountAc.LedgerId = ledgerse.Id;
                    ledgerAccountAc.LableName = ledgerse.Name;
                    ledgerAccountAc.SubLedgerAccountCollection = GetSubLedgerList(ledgerse.Id, companyId);
                    if (ledgerAccountAc.SubLedgerAccountCollection.Count() != 0)
                    {
                        ledgerAccountAc.IsChild = true;
                    }
                    ledgerAccountCollection.Add(ledgerAccountAc);
                }

                return ledgerAccountCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private List<LedgerAccountAC> GetSubLedgerList(int id, int companyId)
        {
            try
            {
                var ledgerAccountCollection = new List<LedgerAccountAC>();
                foreach (var ledgerse in _accountLedgerContext.Fetch(x => x.ParentLedgerId == id && x.CompanyId == companyId))
                {
                    var ledgerAccountAc = new LedgerAccountAC();
                    ledgerAccountAc = ApplicationClassHelper.ConvertType<Ledgers, LedgerAccountAC>(ledgerse);
                    ledgerAccountAc.LedgerId = ledgerse.Id;
                    ledgerAccountAc.LableName = "Sub account of " + ledgerse.ParentLedger.Name;
                    ledgerAccountCollection.Add(ledgerAccountAc);
                }

                return ledgerAccountCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get account group by name. -An
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public Group GetAccountGroupByName(string groupName)
        {
            try
            {
                return _accountGroupContext.FirstOrDefault(x => x.GroupName == groupName);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This get account group by type . -An
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public Group GetAccountGroupByType(string type)
        {
            try
            {
                return _accountGroupContext.FirstOrDefault(x => x.Type == type);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get ledger with transaction. -An
        /// </summary>
        /// <param name="ledgerId"></param>
        /// <returns></returns>
        public List<DoubleEntry> GetLedgerWithTransaction(int ledgerId)
        {
            try
            {
                return _accountEntryContext.Fetch(x => x.LedgerId == ledgerId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<DoubleEntry> GetAllAccountingEntry(int? branchId)
        {
            try
            {
                return _accountEntryContext.GetAll().ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion

        #region Dispose
        public void Dispose()
        {
            try
            {
                _accountLedgerContext.Dispose();
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

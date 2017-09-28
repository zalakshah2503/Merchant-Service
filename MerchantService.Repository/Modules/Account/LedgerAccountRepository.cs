using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
namespace MerchantService.Repository.Modules.Account
{
    public class LedgerAccountRepository : ILedgerAccountRepository
    {

        #region Private Variable
        private readonly IDataRepository<Ledgers> _ledgerContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor

        public LedgerAccountRepository(IErrorLog errorlog, IDataRepository<Ledgers> ledgerContext)
        {
            _errorLog = errorlog;
            _ledgerContext = ledgerContext;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method used for get ledgers by supplier and company. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="supplierId"></param>
        /// <returns></returns>
        public Ledgers GerLedgersBySupplierId(int companyId, int supplierId)
        {
            try
            {
                return _ledgerContext.FirstOrDefault(x => x.CompanyId == companyId && x.SuplierId == supplierId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        public void AddLedgersForBranch(List<Ledgers> listOfLedgers)
        {
            try
            {
                foreach (var ledgers in listOfLedgers)
                {
                    var ledgersBranch = _ledgerContext.FirstOrDefault(x => x.BranchId == ledgers.BranchId && x.CompanyId == ledgers.CompanyId && x.IsEditable == false && x.LedgerName == ledgers.LedgerName);
                    if (ledgersBranch == null)
                    {
                        _ledgerContext.Add(ledgers);
                        _ledgerContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
      
        public List<Ledgers> GetLedgerListByCompanyId(int CompanyId)
        {
            try
            {
                var ledgerList = _ledgerContext.Fetch(x => x.CompanyId == CompanyId).Include(x => x.Group).OrderByDescending(x => x.CreatedDateTime).ToList();
                return ledgerList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get ledger list by companyid and branchid
        /// <param name="companyId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        public List<Ledgers> GetLedgerListByCompanyIdBranchId(int companyId, int? branchId)
        {
            try
            {
                return _ledgerContext.Fetch(x => x.CompanyId == companyId && x.BranchId == branchId).Include(x => x.Group).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }


        /// <summary>
        /// This method is use for getting record of Ledgers - An
        /// </summary>
        /// <returns>list of Ledgers</returns>
        public List<Ledgers> GetLedgerList()
        {
            try
            {
                return _ledgerContext.GetAll().ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get ledgers y Ledgers Id. -An
        /// </summary>
        /// <returns></returns>
        public Ledgers GetLedgersByLedgersId(int ledgerId)
        {
            try
            {
                return _ledgerContext.FirstOrDefault(x => x.Id == ledgerId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int SaveLedgers(Ledgers ledger)
        {
            try
            {
                //check the ledger name is exists or not
                int ledgerCount = _ledgerContext.Fetch(x => x.LedgerName == ledger.LedgerName && x.CompanyId == ledger.CompanyId).Count();
                if (ledgerCount > 0)
                {
                    return 0;
                }
                _ledgerContext.Add(ledger);
                _ledgerContext.SaveChanges();
                return ledger.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int UpdateLedgers(Ledgers ledgers)
        {
            try
            {
                //check the ledger name is exists or not
                int ledgerCount = _ledgerContext.Fetch(x => x.LedgerName == ledgers.LedgerName && x.CompanyId == ledgers.CompanyId && x.Id != ledgers.Id).Count();
                if (ledgerCount > 0)
                {
                    return 0;
                }
                ledgers.ModifiedDateTime = DateTime.UtcNow;
                _ledgerContext.Update(ledgers);
                _ledgerContext.SaveChanges();
                return ledgers.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<Ledgers> GetReceiptPaymentLeadgers(int CompanyId)
        {
            try
            {
                //get the list whose group is Bank,Current Assets and cash in hend.
                var ledgerList = _ledgerContext.GetAll().Where(x => x.CompanyId == CompanyId).Include(x => x.Group).ToList();
                ledgerList = ledgerList.Where(x => x.GroupId == (int)AccountGroup.Bank || x.GroupId == (int)AccountGroup.CurrentAssets || x.GroupId == (int)AccountGroup.CashInHend && x.CompanyId == CompanyId).ToList();
                return ledgerList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool CheckSelectedLedgerIsBankAccount(int ledgerId)
        {
            try
            {
                bool result = false;
                Ledgers ledgers = _ledgerContext.Fetch(x => x.Id == ledgerId).FirstOrDefault();
                if (ledgers != null && ledgers.GroupId == (int)AccountGroup.Bank)
                    result = true;

                return result;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<Ledgers> GetLedgerAccountWithoutCashAndBank(int CompanyId)
        {
            try
            {
                //get the list whose group is not Bank,Current Assets and cash in hend.
                var ledgerList = _ledgerContext.GetAll().Where(x => x.CompanyId == CompanyId).Include(x => x.Group).ToList();
                ledgerList = ledgerList.Where(x => x.GroupId != (int)AccountGroup.Bank && x.GroupId != (int)AccountGroup.CurrentAssets && x.GroupId != (int)AccountGroup.CashInHend).ToList();
                return ledgerList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<Ledgers> GetSalesLedgerAccount(int CompanyId)
        {
            try
            {
                var ledgerList = _ledgerContext.GetAll().Where(x => x.GroupId == (int)AccountGroup.Sales && x.CompanyId == CompanyId).ToList();
                return ledgerList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<Ledgers> GetPurchaseLedgerAccount(int CompanyId)
        {
            try
            {
                var ledgerList = _ledgerContext.GetAll().Where(x => x.GroupId == (int)AccountGroup.Purchase && x.CompanyId == CompanyId).ToList();
                return ledgerList;
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
                _ledgerContext.Dispose();
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

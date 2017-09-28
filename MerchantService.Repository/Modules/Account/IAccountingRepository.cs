using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Account
{
    public interface IAccountingRepository
    {
        /// <summary>
        /// This method used for add acount group. -An
        /// </summary>
        /// <param name="accountGroup"></param>
        /// <returns></returns>
        int AddAccountGroup(Group accountGroup);


        /// <summary>
        /// This method used for add account ledeger. -An
        /// </summary>
        /// <param name="accountLedger"></param>
        /// <returns></returns>
        int AddAccountLedger(Ledgers accountLedger);

        /// <summary>
        /// This method used for update account group. -An
        /// </summary>
        /// <param name="accountGroup"></param>
        /// <returns></returns>
        int UpdateAccountGroup(Group accountGroup);

        /// <summary>
        /// This method used for update account ledeger. -An
        /// </summary>
        /// <param name="accountLedger"></param>
        /// <returns></returns>
        int UpdateAccountLedger(Ledgers accountLedger);

        /// <summary>
        /// This method used for add accounting entries. -An 
        /// </summary>
        /// <param name="listOfAccountEntry"></param>
        /// <returns></returns>
        bool AddAccountingEntries(List<DoubleEntry> listOfAccountEntry);

        /// <summary>
        /// This method used for get account ledger by name. -An
        /// </summary>
        /// <param name="ledgerName"></param>
        /// <returns></returns>
        Ledgers GetAccountLedgerByName(string ledgerName, int branchId);


        /// <summary>
        /// This method used for get account group by name. -An
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        Group GetAccountGroupByName(string groupName);

        /// <summary>
        /// This get account group by type . -An
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        Group GetAccountGroupByType(string type);


        /// <summary>
        /// This method used for get ledger with transaction. -An
        /// </summary>
        /// <param name="ledgerId"></param>
        /// <returns></returns>
        List<DoubleEntry> GetLedgerWithTransaction(int ledgerId);

        /// <summary>
        /// This method used for add ledgers -An
        /// </summary>
        /// <param name="listOfLedger"></param>
        /// <returns></returns>
        bool AddLedgers(List<Ledgers> listOfLedger);

        /// <summary>
        /// This method used for Get Account Ledger By Supllier Id.-An
        /// </summary>
        /// <param name="supplierId"></param>
        /// <returns></returns>
        Ledgers GetAccountLedgerBySupplier(int supplierId);

        /// <summary>
        /// This method used for Get Account Ledger By Customer Id.-JJ
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        Ledgers GetAccountLedgerByCustomer(int customerId);

        /// <summary>
        /// this method is used to get all ledger account list.
        /// </summary>
        /// <returns></returns>
        List<LedgerAccountAC> GetAllLedgerAccountListByCompanyId(int companyId);


        /// <summary>
        /// This method used for get Ledger Account list By Comapny Id.
        /// </summary>
        /// <param name="comapnyId"></param>
        /// <returns></returns>
        List<LedgerAccountAC> GetLedgerAccountListByCompanyId(int companyId);


        /// <summary>
        /// this method is used to save accouting journal entry.
        /// </summary>
        /// <param name="journalEntryDetails"></param>
        void SaveAccountingJournalEntry(JournalEntryAc journalEntryDetails);

        List<DoubleEntry> GetAllAccountingEntry(int? branchId);
        List<Ledgers> GetLedgersByBranch(int branchId);
    }
}

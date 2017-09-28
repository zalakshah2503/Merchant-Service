using MerchantService.DomainModel.Models.Accounting;
using System;
using System.Collections.Generic;
namespace MerchantService.Repository.Modules.Account
{
    public interface ILedgerAccountRepository : IDisposable
    {
        /// <summary>
        /// This method is use for getting record of Ledgers - SP
        /// </summary>
        /// <returns>list of Ledgers</returns>
        List<Ledgers> GetLedgerListByCompanyId(int companyId);


        /// <summary>
        /// This method is use for getting record of Ledgers - An
        /// </summary>
        /// <returns>list of Ledgers</returns>
        List<Ledgers> GetLedgerList();

        /// <summary>
        /// This method used for get ledger list by companyid and branchid
        /// <param name="companyId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        List<Ledgers> GetLedgerListByCompanyIdBranchId(int companyId ,int? branchId);

        /// <summary>
        /// This methode is use insert data in Ledgers. - SP
        /// </summary>
        /// <param name="Ledgers">object of LedgerAccountAC</param>
        /// <returns>object of Ledgers</returns>
        int SaveLedgers(Ledgers ledgers);

        /// <summary>
        /// This metho is use for update data in Ledgers table. -SP
        /// </summary>
        /// <param name="ledgers">object of LedgerAccountAC</param>
        /// <returns>object of Ledgers</returns>
        int UpdateLedgers(Ledgers ledgers);

        /// <summary>
        /// This method is used for getting ledgers account for Receipt and Payment voucher. -SP
        /// </summary>
        /// <returns>list of Ledgers</returns>
        List<Ledgers> GetReceiptPaymentLeadgers(int CompanyId);

        /// <summary>
        /// This method is used for checking Selected Account is Bank account or not. - SP
        /// </summary>
        /// <param name="ledgerId">ledger id</param>
        /// <returns>boolen</returns>
        bool CheckSelectedLedgerIsBankAccount(int ledgerId);


        /// <summary>
        /// This method used for get ledgers y Ledgers Id. -An
        /// </summary>
        /// <returns></returns>
        Ledgers GetLedgersByLedgersId(int ledgerId);

        /// <summary>
        /// This method is used for getting list of ledger account for Receipt and Payment voucher for entring value of Receipt and Payment. -SP
        /// </summary>
        /// <returns>list of Ledgers</returns>
        List<Ledgers> GetLedgerAccountWithoutCashAndBank(int CompanyId);

        /// <summary>
        /// This method is used for getting list of Sales Ledgers. -SP
        /// </summary>
        /// <returns>List of Ledgers</returns>
        List<Ledgers> GetSalesLedgerAccount(int CompanyId);

        /// <summary>
        /// This method is used for getting list of purchase Leadger. -SP
        /// </summary>
        /// <param name="CompanyId"></param>
        /// <returns></returns>
        List<Ledgers> GetPurchaseLedgerAccount(int CompanyId);

        
        void AddLedgersForBranch(List<Ledgers> listOfLedgers);

        /// <summary>
        /// This method used for get ledgers by supplier and company. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="supplierId"></param>
        /// <returns></returns>
        Ledgers GerLedgersBySupplierId(int companyId,int supplierId);

    }
}

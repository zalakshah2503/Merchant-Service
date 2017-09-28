using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public interface ISPOPaymentRepository : IDisposable
    {
        /// <summary>
        /// This method is used to save SPO Payment. - JJ
        /// </summary>
        /// <param name="supplierPOPayment"> object of SPOPaymentAC</param>
        /// <param name="RoleName">role name of the user</param>
        /// <param name="userName">user name </param>
        /// <returns>status</returns>
        string SaveSupplierPayment(SPOPaymentAC supplierPOPayment, string RoleName, string userName);

        /// <summary>
        /// This method is used to check whether SPO is verified and not paid yet. - JJ
        /// </summary>
        /// <param name="PONumber">SPO purchase order number</param>
        /// <returns>status</returns>
        string CheckSPO(string PONumber);

        /// <summary>
        /// This method is used for fetching supplier bill list from database. - JJ
        /// </summary>   
        /// <param name="BranchId">id of BRANCH</param>
        /// <param name="isAllowForAllBranches">whether access is allowed to other branches too</param>
        /// <returns>list of objects of SPOReceivingBillAC</returns>
        List<SPOReceivingBillAC> GetSupplierBillList(int? BranchId, bool isAllowForAllBranches);

        /// <summary>
        /// This method is used for fetching supplier bill list from database. - JJ
        /// </summary>   
        /// <param name="SupplierId">id of Supplier</param>
        /// <returns>list of objects of CreditNoteDetail</returns>
        List<CreditNoteDetail> GetSupplierCreditNoteList(int SupplierId);

        /// <summary>
        /// This method is used for checking supplier bill list from database. - JJ
        /// </summary>   
        /// <param name="company">user's company</param>
        /// <param name="currentUser">current user</param>
        /// <param name="SPOReceivingBill">list of objects of SPOReceivingBillAC</param>
        /// <returns>list of objects of SPOReceivingBillAC</returns>
        List<SPOReceivingBillAC> CheckCondition(UserDetail currentUser, CompanyDetail company, List<SPOReceivingBillAC> SPOReceivingBill);

    }
}

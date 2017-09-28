using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public interface ISupplierPORepository : IDisposable
    {
        /// <summary>
        /// This method is used for fetching supplier item list from database. - JJ
        /// </summary>   
        /// <param name="SupplierId">id of supplier</param>
        /// <param name="userName">name of user</param>
        /// <returns>list of objects of SupplierItemAC</returns>
        List<SupplierItemAC> GetSupplierItemList(int SupplierId, string userName);

        /// <summary>
        /// This method is used for insert new supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="supplierPO"> object of SupplierPOAC</param>
        /// <param name="company">Object of CompanyDetail</param>
        /// <param name="userName">currently logged in user's name</param>
        /// <returns>status</returns>
        string SaveSupplierPO(SupplierPOAC supplierPO, string userName, CompanyDetail company);


        /// <summary>
        /// This method is used for submitting already saved supplier purchase order. - JJ
        /// </summary>
        /// <param name="SupplierPOId">Id of SupplierPO </param>
        /// <param name="Comment">Comment of the initiator</param>
        /// <param name="company">Object of CompanyDetail</param>
        /// <param name="userName">currently logged in user's name</param>
        /// <returns>status</returns>
        string SubmitSupplierPO(int SupplierPOId, string Comment, string userName, CompanyDetail company);


        /// <summary>
        /// This method is used for fetch supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="id">id of spo</param>
        /// <returns>object of SupplierPOAC</returns>
        SupplierPOAC GetSupplierPO(int id);

        /// <summary>
        /// This method is used to update supplierPO - JJ
        /// </summary>
        /// <param name="supplierPO">object of SupplierPOAC</param>
        /// <param name="userName">currently logged in user's name</param>
        /// <returns>null</returns>
        string UpdateSPO(SupplierPOAC supplierPO, string userName);

        /// <summary>
        /// This method is used to resubmit supplierPO - JJ
        /// </summary>
        /// <param name="POId">Id of SPO</param>
        /// <param name="Comment">Comment of the user</param>
        /// <param name="user">Object of UserDetail</param>
        /// <returns>Status</returns>
        string ResubmitSPO(int POId, string Comment, UserDetail user);


        /// <summary>
        /// This method is used for deleting supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="id">id of spo</param>
        /// <param name="user">currently logged in user</param>
        /// <returns>status</returns>
        string DeleteSupplierPO(int id, UserDetail user);
    }
}

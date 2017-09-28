using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.Supplier;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Supplier
{
    public interface ISupplierReturnRepository : IDisposable
    {
        /// <summary>
        /// This method is used for save new  supplier return request in database. - JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">object of SupplierReturnRequest</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="user">object of UserDetail</param>
        /// <returns>object of SupplierReturnRequest</returns>
        SupplierReturnRequest SaveSupplierReturnRequest(SupplierReturnRequest SupplierReturnRequest, UserDetail user, CompanyDetail company);

        /// <summary>
        /// This method is used for update supplier return request in database. - JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">object of SupplierReturnRequest</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="user">object of UserDetail</param>
        /// <returns>status</returns>
        string UpdateSupplierReturnRequest(SupplierReturnRequest SupplierReturnRequest, UserDetail user, CompanyDetail company);

        /// <summary>
        /// This method is used fetch Item List from database. - JJ
        /// </summary>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="BranchId"></param>
        /// <returns>list of ItemProfileAC</returns>
        List<ItemProfileAC> GetItemList(CompanyDetail company, int BranchId);
        
    }
}

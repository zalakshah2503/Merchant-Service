using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.ItemChangeRequest
{
    public interface IICRRepository : IDisposable
    {
        /// <summary>
        /// this method is used for fetching ItemQuantity list.- JJ
        /// </summary>
        /// <param name="ItemId">Id of Item</param>
        /// <param name="BranchId">id of current user's branch</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        List<ItemChangedDetailsAC> GetItemQuantityList(int ItemId, int? BranchId);

        /// <summary>
        /// this method is used for adding ICR.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="user">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="WorkFlowId"></param>
        /// <returns>status</returns>
        string SaveICR(ItemChangedDetailsAC itemChangedDetail, UserDetail user, CompanyDetail company, int? WorkFlowId);

        /// <summary>
        /// this method is used for deleting ICR.- JJ
        /// </summary>
        /// <param name="Id">Id of ICR Detail</param>
        void DeleteICR(int Id);

        /// <summary>
        /// this method is used for updating ICR.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="user">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <returns>status</returns>
        string UpdateICR(ItemChangedDetailsAC itemChangedDetail, UserDetail user, CompanyDetail company, int RecordId);
    }
}



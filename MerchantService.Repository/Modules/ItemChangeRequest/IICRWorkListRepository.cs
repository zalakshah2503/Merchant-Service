using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.ItemChangeRequest
{
    public interface IICRWorkListRepository : IDisposable
    {
        /// <summary>
        /// this method is used for fetching Item Change Request list.
        /// </summary>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        List<ItemChangedDetailsAC> GetICRWorkList();

        /// <summary>
        /// this method is used for fetching Item Change Request list.
        /// </summary>
        /// <param name="branchId">current user's branch id</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        List<ItemChangedDetailsAC> GetICRWorkListForParticularBranch(int? branchId);

        /// <summary>
        /// this method is used for fetching Item Change Request Details.
        /// </summary>
        /// <param name="Id">Id of Icr</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        ItemChangedDetailsAC GetICRDetail(int Id,string userId);

        /// <summary>
        /// This method is used for approve/return Item Change Request. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="user"> Currently logged in userDetail </param>
        /// <param name="status"></param>
        /// <param name="companyDetails"></param>
        /// <returns>status</returns>
        string ApprovalICR(string Comment, int RecordId, UserDetail user, bool status, CompanyDetail companyDetails);

        /// <summary>
        /// This method is used for reject Item Change Request. - JJ
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="Comment"></param>
        /// <param name="user"> Currently logged in userDetail </param>
        /// <param name="companyDetails"></param>
        /// <returns>status</returns>
        string RejectICR(int Id, int RecordId, string Comment, UserDetail user, CompanyDetail companyDetails);

        /// <summary>
        /// This method is used to review Item Change Request. - JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="user">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <param name="RecordId">parent record id</param>
        /// <param name="Comment"></param>
        /// <returns>status</returns>
        string ReviewICR(ItemChangedDetailsAC itemChangedDetail, UserDetail user, CompanyDetail company, int RecordId, string Comment);

        /// <summary>
        /// This method is used to update items according to  Item Change Request. - JJ
        /// </summary>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="status">status</param>
        /// <param name="companyDetails"></param>
        /// <param name="user"></param>
        /// <returns>status</returns>
        bool UpdateItem(int RecordId, bool status, CompanyDetail companyDetails, UserDetail user);
    }
}

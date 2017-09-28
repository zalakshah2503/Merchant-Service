using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using System;
using System.Collections.Generic;
namespace MerchantService.Repository.Modules.Account
{
    public interface IGroupAccountRepository : IDisposable
    {
        /// <summary>
        /// This method is used for insert new group in database.
        /// </summary>
        /// <param name="group"> object of GroupAccountAC</param>
        /// <returns>object of GroupAccountAC</returns>
        Group SaveGroup(GroupAccountAC group);

        /// <summary>
        /// This method is used for getting list of group by Company Id.
        /// </summary>
        /// <returns>List of Gorup</returns>
        List<Group> GetGroupListByCompanyId(int CompanyId);


        /// <summary>
        ///  This method is used for update group record.
        /// </summary>
        /// <param name="group">object of GroupAccountAC</param>
        /// <returns>object of GroupAccountAC</returns>
        Group UpdateGroup(GroupAccountAC group);

        /// <summary>
        /// This method is used for getting group object by group id.
        /// </summary>
        /// <param name="groupId">group id</param>
        /// <returns>object of Group</returns>
        Group GetGroupByGroupId(int groupId);

        /// <summary>
        /// This method used for get group type list by group id.
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        List<GroupType> GetGroupTypeListByGroupId(int groupId);
    }
}

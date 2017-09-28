using MerchantService.DomainModel.Models.UserAccess;
using MerchantService.Repository.ApplicationClasses.Admin.UserAccess;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin.ManageUserAccess
{
    public interface IManageUserAccessRepository
    {
        /// <summary>
        /// This method used for get user access list. -An
        /// </summary>
        /// <returns>list of user access list</returns>
        List<UserAccessDetail> GetUserAccessList();

        /// <summary>
        /// This method used for insert user access details in User Access Detail Table. -An
        /// </summary>
        /// <param name="userAccessDetail">This object contain formId and Role Id,Is Active,Created DateTime</param>
        /// <returns>return primary key</returns>
        int AddUserAccessDetail(UserAccessDetail userAccessDetail);


        /// <summary>
        /// This method used for update user access details in User Access Detail Table. -An 
        /// </summary>
        /// <param name="userAccessDetail">This oject contain formId,Id,RoleId,Is Active,Created DateTime</param>
        /// <returns>return primary key</returns>
        int UpdateAccessDetail(UserAccessDetail userAccessDetail);


        /// <summary>
        /// This method used for get user access detail list by roleId. -An
        /// </summary>
        /// <param name="roleId">pass role Id</param>
        /// <returns>return user access details list</returns>
        List<UserAccessDetail> GetUserAccessDetailByRoleId(int roleId);

        /// <summary>
        /// This method used for get user access detail list by roleId. -An
        /// </summary>
        /// <param name="roleId">pass role Id</param>
        /// <returns>return user access details list</returns>
        List<ActivePageList> GetUserActiveAccessDetailByRoleId(int roleId);

        /// <summary>
        /// This method used for check login user to allow access current page. -An
        /// </summary>
        /// <param name="roleId">pass login user role id</param>
        /// <param name="pageName">pass page name</param>
        /// <returns>if allow to user for access so retun true other wise false</returns>
        bool CheckLoginUserAccessCurrentPage(int roleId, string pageName);

        /// <summary>
        /// This method used for get list of form. -An
        /// </summary>
        /// <returns></returns>
        List<Form> GetListOfForm();

        /// <summary>
        /// This method used for delete user access detail by roleId. -An
        /// </summary>
        /// <param name="roleId">pass roleId</param>
        /// <returns>true/false</returns>
        bool DeleteUserAccessDetail(int roleId);

        /// <summary>
        /// This method used for check user access page exists in table by role id. -An
        /// </summary>
        /// <param name="roleId">pass role id</param>
        /// <returns>true/false</returns>
        bool CheckUserAccessDetailExistsByRoleId(int roleId);

    }
}

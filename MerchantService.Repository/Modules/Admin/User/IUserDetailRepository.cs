using MerchantService.DomainModel.Models;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin
{
    public interface IUserDetailRepository : IDisposable
    {
        /// <summary>
        /// This method is used to get user list - JJ
        /// </summary>
        /// <returns>This method returns list of UserDetail</returns>
        List<UserDetail> GetUserList(string userName);

        /// <summary>
        /// This method is used to fetch the user whose id is given. - JJ
        /// </summary>
        /// <param name="id"> id of user</param>
        /// <returns>return UserDetail object</returns>
        UserDetail GetUserById(int id);

        /// <summary>
        /// This method is used to add user - JJ
        /// </summary>
        /// <param name="userDetail">object of UserDetail</param>
        /// <param name="currentUserName">username of current user</param>
        /// <returns>return UserDetail object</returns>
        UserDetail AddUserDetail(UserDetail userDetail, string currentUserName);

        /// <summary>
        /// This method is used to update userDetail - JJ
        /// </summary>
        /// <param name="userDetail">object of UserDetail</param>
        /// <returns>status</returns>
        int UpdateUserDetail(UserDetail userDetail);


        /// <summary>
        /// This method is used to delete user from the system - JJ
        /// </summary>
        /// <param name="id">id of user</param>
        /// <returns>null</returns>
        void DeleteUserDetail(int id);

        /// <summary>
        /// This method id used to check if user email exists or not - JJ
        /// </summary>
        /// <param name="email">Email of the non-registered user</param>
        /// <returns>if user email exist return true,otherwise false</returns>
        bool CheckUserEmailExist(string email);

        /// <summary>
        /// This method is used to check if username exists or not - JJ
        /// </summary>
        /// <param name="userName">username of the non-registered user</param>
        /// <returns>if username exist return true,otherwise false</returns>
        bool CheckUserNameExist(string userName);


        /// <summary>
        /// This method is used to check if user with same employeeId is already registered to the system - JJ 
        /// </summary>
        /// <param name="employeeId">employeeId of the non-registered user</param>
        /// <param name="userId">userId of the user</param>
        /// <returns>if employeeId exist return true,otherwise false</returns>
        bool CheckEmployeeIdExist(string employeeId, int userId);


        /// <summary>
        /// This method is used to check if user with same mobile no. is already registered to the system - JJ 
        /// </summary>
        /// <param "mobile no." and "userId"></param>
        /// <returns>if user with given mobile no. and companyId exists return true,otherwise false</returns>
        bool CheckMobileNoExist(string mobileno, int userId);

        /// <summary>
        /// this method is used to reset the user passord.
        /// </summary>
        /// <param name="userId">contain userid to reset user password.</param>
        UserDetail ResetUserPassword(int userId);

        /// <summary>
        /// get all  user list
        /// </summary>
        /// <returns>list of user</returns>
        List<UserDetail> GetAllUserList(string userName);

        /// <summary>
        /// This method used for get cashier list by comapny Id. -An 
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        List<UserDetail> GetCashierListByCompanyId(int companyId);

        /// <summary>
        /// This method usd for get cashier List By Branch Id. -An
        /// </summary>
        /// <returns></returns>
        List<UserDetail> GetUserListByBranchId(int branchId);

        /// <summary>
        /// update the user password
        /// </summary>
        /// <param name="userId">contain userid to update the user passowrd.</param>
        void UpdateUserPassword(string userId);

        /// <summary>
        /// This method is used to get user list - JJ
        /// </summary>
        /// <returns>This method returns list of UserDetail</returns>
        List<UserDetail> GetAdminUserList();

        /// <summary>
        /// Get the user detail object by user name. SP
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>object of UserDetail</returns>
        UserDetail GetUserDetailByUserName(string userName);


        /// <summary>
        /// This method used for get user detail by user Id. -An
        /// </summary>
        /// <param name="userId">pass owin user id.</param>
        /// <returns>userDetail object</returns>
        UserDetail GetUserDetailUserId(string userId);

        /// <summary>
        /// Used to check whether there are any workflows for this user's role, if yes then any other eligible user is in this role - JJ
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
         int CheckUserDeletable(int id);
    }
}

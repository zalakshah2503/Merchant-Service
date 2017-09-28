using MerchantService.DomainModel.Models.Branch;
using MerchantService.Repository.ApplicationClasses.Admin;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin
{
    public interface IBranchRepository : IDisposable
    {
        /// <summary>
        /// This method is used to get branch list - JJ
        /// </summary>       
        /// <param name="userName">username of currently logged in user</param>
        /// <param name="companyId">currentCompanyId of currently logged in user company</param>
        /// <returns>return list of BranchDetail objects of user</returns>
        List<BranchDetail> GetBranchList(string userName, int? companyId);

        /// <summary>
        ///This method is used to get branch detail of the specific Id -JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>return BranchDetailAC object</returns>
        BranchDetailAC GetBranchById(int id);

        /// <summary>
        ///This method is used to get branchCPOConfiguration detail of the branch Id -JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>return list of BranchCPOConfiguration object</returns>
        List<BranchCPOConfiguration> GetBranchCPOConfiguarationById(int id);

        /// <summary>
        /// This method is used to add branch to the system - JJ
        /// </summary>
        /// <param name="branch">object of BranchDetailAC</param>
        /// <param name="userName"></param>
        /// <returns>return BranchDetailAC object</returns>
        BranchDetailAC AddBranchDetail(BranchDetailAC branch, string userName);

        /// <summary>
        /// This method is used to update branch - JJ
        /// </summary>
        /// <param name="branchDetail">object of BranchDetailAC</param>
        /// <returns>null</returns>
        void UpdateBranchDetail(BranchDetailAC branchDetail);


        /// <summary>
        /// This method is used to delete branch from the system - JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>Status message</returns>
        string DeleteBranchDetail(int id);



        /// <summary>
        /// this method is used to get current user branch id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        int GetCurrentUserBranchId(string userId);


        /// <summary>
        /// This method is used to check if branch with given code and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="code"></param>
        /// <param name="id"></param>
        /// <param name="companyId"></param>
        /// <returns>if branch with given code and id exists return true,otherwise false</returns>
        bool CheckCodeIdExist(string code, int id, int companyId);


        /// <summary>
        /// This method is used to check if branch with given name and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="name"></param>
        /// <param name="id"></param>
        /// <param name="companyId"></param>
        /// <returns>if branch with given name and id exists return true,otherwise false</returns>
        bool CheckBranchNameIdExist(string name, int id, int companyId);


        /// <summary>
        /// This method is used to check if branch with given email and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="id"></param>
        /// <returns>if branch with given email and id exists return true,otherwise false</returns>
        bool CheckEmailIdExist(string email, int id);

        /// <summary>
        /// This method is used to check if branch with given phone and branchId is already registered to the system - JJ 
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="id"></param>
        /// <returns>if branch with given phone and id exists return true,otherwise false</returns>
        bool CheckPhoneIdExist(string phone, int id);

        /// <summary>
        /// Get the Branch Detail by UserId. -SP
        /// </summary>
        /// <param name="userId">user id</param>
        /// <returns>object of branch</returns>
        BranchDetail GetBranchDetailByUserId(string userId);

        /// <summary>
        /// this method is used to update Iem Quantity.
        /// </summary>
        /// <param name="brachId"></param>
        /// <param name="companyId"></param>
        void UpdateItemQuantity(int brachId, int companyId);
    }
}

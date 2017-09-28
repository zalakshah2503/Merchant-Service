using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.Global
{
   public interface IMerchantDataRepository : IDisposable
    {
        /// <summary>
        /// This method used for get permission object by role Id. -An
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
       Permission GetPermissionByRoleId(int roleId, int companyId);

       /// <summary>
       /// this method is used for get role the id by the customer name.
       /// </summary>
       /// <param name="userName"></param>
       /// <returns></returns>
        int GetRoleIdByCustomerName(string userName);

        /// <summary>
        /// Get the list of Company Detail object by user id. -SP
        /// </summary>
        /// <param name="userName">user id</param>
        /// <returns>object of Company Detail</returns>
        CompanyDetail GetCompanyDetailByUserId(string userId);

        int GetBranchId(string userId);

        CompanyDetail GetCompanyDetail(int companyId);

        List<WorkFlowActivityAc> WorkFlowDetails(int companyId, int roleId);

        UserDetail GetUserDetails(string UserId);
    }
}

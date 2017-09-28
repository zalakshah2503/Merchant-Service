using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.WorkFlow
{
   public interface IRolePermissionRepository :IDisposable
    {
       /// <summary>
        ///  this method is used to get all role wise permission.
       /// </summary>
       /// <returns></returns>
       List<RoleAc> GetAllRolePermissionlist(int companyId);

       /// <summary>
       /// this method is used to get all permission list.
       /// </summary>
       /// <returns></returns>
       List<RolePermissionAc> GetAllPermissionsList();

       /// <summary>
       /// this method is used to get all role list.
       /// </summary>
       /// <returns></returns>
       IOrderedEnumerable<RoleAc> GetAllRoleList(int companyId);

       /// <summary>
       /// this method is used to add role and permission.
       /// </summary>
       /// <param name="rolePermission"></param>
       /// <returns></returns>
       int AddRoleAndPermission(RolePermission rolePermission);

       /// <summary>
       /// this method is used to check role and permission.
       /// </summary>
       /// <param name="roleId"></param>
       /// <returns></returns>
       List<RolePermissionAc> CheckRoleAndPermission(int roleId);

       /// <summary>
       /// this method is used to delete role permission.
       /// </summary>
       /// <param name="rolePermission"></param>
       void DeleteRolePermission(RolePermission rolePermission);

       /// <summary>
       /// Get the RolePermission object by ChildPermissionId - PS
       /// </summary>
       /// <param name="childPermaissionId", name="companyId">childpermisionId, companyId</param>
       /// <returns>RolePermission obejct</returns>
       List<RolePermission> GetRolPermissionByChildPermissionId(int childPermaissionId,int companyId);

       /// <summary>
       /// This method used for get child permission by id. -An
       /// </summary>
       /// <param name="id"></param>
       /// <returns></returns>
       ChildPermission GetChildPermissionById(int id);
    }
}

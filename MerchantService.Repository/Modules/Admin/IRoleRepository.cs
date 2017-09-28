using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.DomainModel.Models.Role;

namespace MerchantService.Repository.Modules.Admin
{
   public interface IRoleRepository : IDisposable
    {
       /// <summary>
       /// update role.- ps
       /// </summary>
       /// <param name="role"></param>
       void UpdateRole(RoleAc role);

       /// <summary>
       /// get role list
       /// </summary>
       /// <returns>return list of role</returns>
       List<RoleAc> GetRoleList(int companyId);

       /// <summary>
       /// check if role name is exist or not. - ps
       /// </summary>
       /// <param name="name"></param>
       /// <returns>if role name exist return true,otherwise false</returns>
       bool CheckRoleNameExistOrNot(RoleAc roleAc,int companyId);

       /// <summary>
       /// get the admin role.
       /// </summary>
       /// <returns>return admin details</returns>
       List<RoleAc> GetAdminRoleList();

       /// <summary>
       /// This method is used to delete role from the database - JJ
       /// </summary>
       /// <param name="id">id of role</param>
       /// <returns>status</returns>
       void DeleteRole(int id);

       /// <summary>
       /// This Method is used for adding new role.- SP
       /// </summary>
       /// <param name="Role">object of RoleAc and companyId</param>
       /// <returns>object Role</returns>
       Role AddNewRole(RoleAc Role,int companyId);

       /// <summary>
       /// get the Role object by id - SP
       /// </summary>
       /// <param name="RoleId"> role id</param>
       /// <returns> object of Role </returns>
       Role GetRoleById(int RoleId);


    }
}

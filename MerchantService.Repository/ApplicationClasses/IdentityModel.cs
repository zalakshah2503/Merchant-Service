using MerchantService.DomainModel.DataContext;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses
{
    #region RoleManager
    public class IdentityManager
    {

        RoleManager<IdentityRole> roleManager = new RoleManager<IdentityRole>(
        new RoleStore<IdentityRole>(new MerchantServiceDataContext()));

        UserManager<IdentityUser> userManager = new UserManager<IdentityUser>(
            new UserStore<IdentityUser>(new MerchantServiceDataContext()));

        /// <summary>
        /// create user 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns>return created user object</returns>
        public IdentityResult Create(IdentityUser user, string password)
        {
            return userManager.Create(user, password);
        }

        /// <summary>
        /// find user with its email address
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>return user object</returns>
        public IdentityUser FindByEmail(string userName)
        {
            return userManager.FindByEmail(userName);
        }

        /// <summary>
        /// check role is exist or not 
        /// </summary>
        /// <param name="name"></param>
        /// <returns>return true if role exist otherwise false</returns>
        public bool RoleExists(string name)
        {
            return roleManager.RoleExists(name);
        }

        /// <summary>
        /// create role
        /// </summary>
        /// <param name="name"></param>
        /// <returns>return true if role is created successfully</returns>
        public bool CreateRole(string name)
        {
            var idResult = roleManager.Create(new IdentityRole(name));
            return idResult.Succeeded;
        }

        /// <summary>
        /// check  current user role
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="roleName"></param>
        /// <returns> Returns true if the user is in the specified role</returns>

        public bool IsUserInRole(string userId, string roleName)
        {
            return userManager.IsInRole(userId, roleName);
        }

        /// <summary>
        /// assign user to role
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="roleName"></param>
        /// <returns>return true if role is added to user successfully otherwise false</returns>
        public bool AddUserToRole(string userId, string roleName)
        {
            var idResult = userManager.AddToRole(userId, roleName);
            return idResult.Succeeded;
        }

        /// <summary>
        /// find current user role
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>return user role</returns>
        public string FindUserRole(string userId)
        {
            var role = userManager.GetRoles(userId);
            return role[0];
        }

        /// <summary>
        /// clear user role
        /// </summary>
        /// <param name="userId"></param>
        public void ClearUserRoles(string userId)
        {
            var user = userManager.FindById(userId);
            var currentRoles = new List<IdentityUserRole>();
            currentRoles.AddRange(user.Roles);
            foreach (var role in currentRoles)
            {
                userManager.RemoveFromRole(userId, role.RoleId);
            }
        }

        /// <summary>
        /// update user information
        /// </summary>
        /// <param name="currentUserName"></param>
        /// <param name="newUserName"></param>
        public void UpdateUser(string currentUserName, string newUserName)
        {
            var user = userManager.FindByName(currentUserName);
            user.UserName = newUserName;
            userManager.Update(user);

        }
    }

    #endregion
}

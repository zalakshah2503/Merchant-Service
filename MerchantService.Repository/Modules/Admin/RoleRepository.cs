using MerchantService.Repository.DataRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.Utility.Constants;
using Microsoft.AspNet.Identity.EntityFramework;
using MerchantService.Utility.Logger;
using MerchantService.DomainModel.DataContext;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.Helper;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models;

namespace MerchantService.Repository.Modules.Admin
{
    public class RoleRepository : IRoleRepository
    {
        #region "Private Member(s)"

        private readonly IDataRepository<IdentityRole> _roleContext;
        private readonly IDataRepository<Role> _roleContext1;
        private readonly IErrorLog _errorLog;

        #endregion

        #region "Constructor & Destructor(s)"
        public RoleRepository(IDataRepository<IdentityRole> roleContext, IErrorLog errorLog, IDataRepository<Role> roleContext1)
        {
            _roleContext = roleContext;
            _errorLog = errorLog;
            _roleContext1 = roleContext1;
        }
        #endregion

        #region "Dispose Method(s)"
        /// <summary>
        /// Method disposes the repository context 
        /// </summary>
        public void Dispose()
        {
            try
            {
                _roleContext.Dispose();
                _roleContext1.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion

        #region "Public Method(s)"

        /// <summary>
        /// update role
        /// </summary>
        /// <param name="role"></param>
        public void UpdateRole(RoleAc role)
        {
            try
            {
                var roleDetail = _roleContext1.GetById(role.Id);
                roleDetail.RoleName = role.RoleName;
                roleDetail.RoleNameSl = role.RoleNameSl;
                roleDetail.IsDeleted = role.IsDeleted;
                roleDetail.ModifiedDateTime = DateTime.UtcNow;
                _roleContext1.Update(roleDetail);
                _roleContext1.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public Role AddNewRole(RoleAc role, int companyId)
        {
            try
            {

                var roles = new Role
                {
                    RoleName = role.RoleName,
                    RoleNameSl = role.RoleNameSl,
                    CompanyId = companyId,
                    CreatedDateTime = DateTime.UtcNow,
                    IsDeleted = false
                };
                _roleContext1.Add(roles);
                _roleContext1.SaveChanges();
                return roles;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// get role list
        /// </summary>
        /// <returns>return list of role</returns>
        public List<RoleAc> GetRoleList(int companyId)
        {

            try
            {
                var roleList = _roleContext1.Fetch(x => x.RoleName != StringConstants.AdminRoleName && x.RoleName != StringConstants.SuperAdminRoleName && x.CompanyId == companyId && x.IsDeleted == false).ToList();
                var roleCollection = new List<RoleAc>();
                foreach (var role in roleList)
                {
                    var roleAc = new RoleAc();
                    roleAc = ApplicationClassHelper.ConvertType<Role, RoleAc>(role);
                    roleAc.IsAdminRole = false;
                    roleCollection.Add(roleAc);
                }
                return roleCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// check if role name is exist or not
        /// </summary>
        /// <param name="name"></param>
        /// <returns>if role name exist return true,otherwise false</returns>
        public bool CheckRoleNameExistOrNot(RoleAc roleAc, int companyId)
        {
            try
            {
                if (roleAc.Id == 0)
                {
                    return _roleContext1.Fetch(x => x.RoleName.ToLower() == roleAc.RoleName.ToLower() && x.CompanyId == companyId && x.IsDeleted == false).Any();
                }
                else
                {
                    return _roleContext1.Fetch(x => x.RoleName.ToLower() == roleAc.RoleName.ToLower() && x.Id != roleAc.Id && x.CompanyId == companyId && x.IsDeleted == false).Any();
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        public List<RoleAc> GetAdminRoleList()
        {
            try
            {

                var roleList = _roleContext1.Fetch(x => x.RoleName == StringConstants.AdminRoleName && x.IsDeleted == false).ToList();
                var roleCollection = new List<RoleAc>();
                foreach (var role in roleList)
                {
                    var roleAc = new RoleAc();
                    roleAc = ApplicationClassHelper.ConvertType<Role, RoleAc>(role);
                    roleAc.IsAdminRole = true;
                    roleCollection.Add(roleAc);
                }

                return roleCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to delete role from the database - JJ
        /// </summary>
        /// <param name="id">id of role</param>
        /// <returns>null</returns>

        public void DeleteRole(int id)
        {
            try
            {
                var deletedRole = _roleContext1.GetById(id);
                deletedRole.IsDeleted = true;
                deletedRole.ModifiedDateTime = DateTime.UtcNow;
                _roleContext1.Update(deletedRole);
                _roleContext1.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public Role GetRoleById(int RoleId)
        {
            try
            {
                var role = _roleContext1.GetById(RoleId);
                return role;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

    }
}


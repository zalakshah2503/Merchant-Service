using System.Security.Cryptography.X509Certificates;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.WorkFlow
{
    public class RolePermissionRepository : IRolePermissionRepository
    {
        private readonly IDataRepository<RolePermission> _rolePermissionDataRepository;
        private readonly IDataRepository<ChildPermission> _childPermissionDataRepository;
        private readonly IDataRepository<ParentPermission> _parentPermissionDataRepository;
        private readonly IDataRepository<Role> _roleRepository;
        private readonly IErrorLog _errorLog;
        public RolePermissionRepository(IDataRepository<RolePermission> rolePermissionDataRepository, IErrorLog errorLog, IDataRepository<ChildPermission> childPermissionDataRepository, IDataRepository<ParentPermission> parentPermissionDataRepository, IDataRepository<Role> roleRepository)
        {
            _rolePermissionDataRepository = rolePermissionDataRepository;
            _errorLog = errorLog;
            _childPermissionDataRepository = childPermissionDataRepository;
            _parentPermissionDataRepository = parentPermissionDataRepository;
            _roleRepository = roleRepository;
        }

        public void Dispose()
        {
            _rolePermissionDataRepository.Dispose();
        }

        /// <summary>
        /// this method is used to get all role wise permission.
        /// </summary>
        /// <returns></returns>
        public List<RoleAc> GetAllRolePermissionlist(int companyId)
        {
            try
            {
                var roleDetail = _rolePermissionDataRepository.Fetch(x => x.CompanyId == companyId).ToList();
                var roleList = roleDetail.GroupBy(x => new { x.RoleId, x.Role.RoleName }).ToList();
                var roleCollection = new List<RoleAc>();
                foreach (var role in roleList)
                {
                    var roleAc = new RoleAc();
                    roleAc.Id = role.Key.RoleId;
                    roleAc.RoleName = role.Key.RoleName;
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
        /// This method used for get child permission by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ChildPermission GetChildPermissionById(int id)
        {
            try
            {
                return _childPermissionDataRepository.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// this method is used to get all permission list.
        /// </summary>
        /// <returns></returns>
        public List<RolePermissionAc> GetAllPermissionsList()
        {
            try
            {
                var rolePermissionCollection = new List<RolePermissionAc>();
                var rolePermissionAc = new RolePermissionAc();
                var permissionlist = new List<PermissionAc>();
                foreach (var permission in _parentPermissionDataRepository.GetAll().ToList())
                {

                    var tree = new PermissionAc
                    {
                        PermissionId = permission.Id,
                        Name = permission.Name,
                        Children = ChildPermission(permission.Id)
                    };
                    permissionlist.Add(tree);
                    rolePermissionAc.Permission = permissionlist;

                }
                rolePermissionCollection.Add(rolePermissionAc);
                return rolePermissionCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get all child permission
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<PermissionAc> ChildPermission(int id)
        {
            List<int> listIds = new List<int> { 21, 22, 23 };
            var permissionlist = new List<PermissionAc>();
            var childPermission = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == id).ToList();
            if (!listIds.Contains(id))
            {
                var list = _childPermissionDataRepository.Fetch(y => y.ParentPermissionId == null && !y.IsClosed && y.IsAllowRolePermission).ToList();
                childPermission.AddRange(list);

            }
            foreach (var permission in childPermission)
            {
                var permissionAc = new PermissionAc();
                permissionAc.PermissionId = permission.Id;
                permissionAc.Name = permission.Name;
                permissionAc.IsChecked = permission.IsChecked;
                permissionlist.Add(permissionAc);
            }
            return permissionlist;
        }

        /// <summary>
        /// this method is used to get all permission list
        /// </summary>
        /// <returns></returns>
        public IOrderedEnumerable<RoleAc> GetAllRoleList(int companyId)
        {
            try
            {
                var roleCollection = new List<RoleAc>();
                foreach (var role in _roleRepository.Fetch(x => !x.IsDeleted && x.RoleName != StringConstants.AdminRoleName && x.RoleName != StringConstants.SuperAdminRoleName && x.CompanyId == companyId).ToList())
                {
                    var roleAc = new RoleAc();
                    roleAc = ApplicationClassHelper.ConvertType<Role, RoleAc>(role);
                    roleAc.Id = role.Id;
                    roleAc.RoleName = role.RoleName;
                    roleCollection.Add(roleAc);
                }

                return roleCollection.OrderBy(x => x.RoleName);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to add role and permission
        /// </summary>
        /// <param name="rolePermission"></param>
        /// <returns></returns>
        public int AddRoleAndPermission(RolePermission rolePermission)
        {
            try
            {
                var currentRolePermission = _rolePermissionDataRepository.FirstOrDefault(x => x.RoleId == rolePermission.RoleId && x.ChildPermissionId == rolePermission.ChildPermissionId);
                if (currentRolePermission == null)
                {
                    _rolePermissionDataRepository.Add(rolePermission);
                    _rolePermissionDataRepository.SaveChanges();
                }

                return rolePermission.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to check role and permission 
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public List<RolePermissionAc> CheckRoleAndPermission(int roleId)
        {
            try
            {
                var rolePermissionCollection = new List<RolePermissionAc>();
                var rolePermissionAc = new RolePermissionAc();
                rolePermissionAc.RoleId = roleId;
                var permissionlist = new List<PermissionAc>();
                foreach (var permission in _parentPermissionDataRepository.GetAll().ToList())
                {

                    var tree = new PermissionAc
                    {
                        PermissionId = permission.Id,
                        Name = permission.Name,
                        Children = ChildPermission(permission.Id)


                    };
                    foreach (var childPermission in tree.Children)
                    {
                        foreach (var rolePermission in _rolePermissionDataRepository.Fetch(x => x.RoleId == roleId).ToList())
                        {
                            if (childPermission.PermissionId == rolePermission.ChildPermissionId)
                            {
                                childPermission.IsChecked = true;
                            }
                        }
                    }
                    permissionlist.Add(tree);
                    rolePermissionAc.Permission = permissionlist;
                }
                rolePermissionCollection.Add(rolePermissionAc);
                return rolePermissionCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to delete the role permission
        /// </summary>
        /// <param name="rolePermission"></param>
        public void DeleteRolePermission(RolePermission rolePermission)
        {
            try
            {
                var currentRolePermission = _rolePermissionDataRepository.FirstOrDefault(x => x.RoleId == rolePermission.RoleId && x.ChildPermissionId == rolePermission.ChildPermissionId);
                if (currentRolePermission != null)
                {
                    var review = _rolePermissionDataRepository.FirstOrDefault(x => x.RoleId == rolePermission.RoleId && x.ChildPermissionId == rolePermission.ChildPermissionId && x.ChildPermission.ParentPermissionId == null);
                    if (review == null)
                    {
                        _rolePermissionDataRepository.Delete(currentRolePermission.Id);
                        _rolePermissionDataRepository.SaveChanges();
                    }

                }

                return;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<RolePermission> GetRolPermissionByChildPermissionId(int childPermaissionId, int companyId)
        {
            try
            {
                List<RolePermission> listOfRolePermission = new List<RolePermission>();
                listOfRolePermission = _rolePermissionDataRepository.Fetch(x => x.ChildPermissionId == childPermaissionId && x.CompanyId == companyId).ToList();
                return listOfRolePermission;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

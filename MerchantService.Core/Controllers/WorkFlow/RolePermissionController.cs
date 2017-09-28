using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.WorkFlow
{
    //[DynamicAuthorize]
    [RoutePrefix("api/RolePermission")]
    public class RolePermissionController : ApiController
    {
        #region Private Variables
        private readonly IErrorLog _errorLog;
        private readonly IRolePermissionRepository _workFlowRepository;
        private readonly ICompanyRepository _companyRepository;
        #endregion

        #region Constructor
        public RolePermissionController(IErrorLog errorLog, IRolePermissionRepository workFlowRepository, ICompanyRepository companyRepository)
        {
            _errorLog = errorLog;
            _workFlowRepository = workFlowRepository;
            _companyRepository = companyRepository;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// this method is used to get all role permission.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getAllRolePermissionlist")]
        public IHttpActionResult GetAllRolePermissionlist()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    string userId = HttpContext.Current.User.Identity.GetUserId();
                    var companyDetail = _companyRepository.GetCompanyDetailByUserId(userId);
                    var rolePermission = _workFlowRepository.GetAllRolePermissionlist(companyDetail.Id);
                    return Ok(rolePermission);
                }
                else
                {
                    return BadRequest();
                }
            
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get all the user permission list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getAllPermissionsList")]
        public IHttpActionResult GetAllPermissionsList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                var permissionCollection = _workFlowRepository.GetAllPermissionsList();
                return Ok(permissionCollection);
                }
                else{
                return BadRequest();
                }
              
            }
            catch(Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// thi method is used to get all role list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getAllRoleList")]
        public IHttpActionResult GetAllRoleList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    string userId = HttpContext.Current.User.Identity.GetUserId();
                    var companyDetail = _companyRepository.GetCompanyDetailByUserId(userId);
                  
                    var roleList = _workFlowRepository.GetAllRoleList(companyDetail.Id);
                    return Ok(roleList);
                }
                else
                {
                    return BadRequest();
                }
               
            }
            catch(Exception ex){
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to save role and permission details
        /// </summary>
        /// <param name="permission"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("saveRoleAndPermissionDetails")]
        public IHttpActionResult SaveRoleAndPermissionDetails(List<RolePermissionAc> permission)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userID = HttpContext.Current.User.Identity.GetUserId();
                    var companyDetails = _companyRepository.GetCompanyDetailByUserId(userID);
                    foreach (var permissionDetails in permission)
                    {
                        foreach (var permissions in permissionDetails.Permission)
                        {
                            foreach (var childPermission in permissions.Children)
                            {
                                if (childPermission.IsChecked)
                                {
                                    var rolePermission = new RolePermission();
                                    rolePermission.CreatedDateTime = DateTime.UtcNow;
                                    rolePermission.ChildPermissionId = childPermission.PermissionId;
                                    rolePermission.CompanyId = companyDetails.Id;
                                    rolePermission.RoleId = permissionDetails.RoleId;
                                    rolePermission.IsChecked = true;
                                    _workFlowRepository.AddRoleAndPermission(rolePermission);
                                }
                                else
                                {
                                    var rolePermission = new RolePermission();
                                    rolePermission.CreatedDateTime = DateTime.UtcNow;
                                    rolePermission.ChildPermissionId = childPermission.PermissionId;
                                    rolePermission.CompanyId = companyDetails.Id;
                                    rolePermission.RoleId = permissionDetails.RoleId;
                                    _workFlowRepository.DeleteRolePermission(rolePermission);
                                }
                            }
                        }

                    }
                    return Ok(new { IsResult = true });
                }
                else
                {
                    return BadRequest();
                }
               
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
        [HttpGet]
        [Route("checkRoleAndPermission")]
        public IHttpActionResult CheckRoleAndPermission(int roleId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var rolePermission = _workFlowRepository.CheckRoleAndPermission(roleId);
                    return Ok(rolePermission);
                }
                else
                {
                    return BadRequest();
                }
                 
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for geeting RolePermission object by childpermissionId. PS
        /// </summary>
        /// <param name="childPermissionId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetRolPermissionByChildPermissionId")]
        public IHttpActionResult GetRolPermissionByChildPermissionId(int childPermissionId,int companyId)
        {
            try
            {
                var rolePermission = _workFlowRepository.GetRolPermissionByChildPermissionId(childPermissionId, companyId);
                return Ok(rolePermission);
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

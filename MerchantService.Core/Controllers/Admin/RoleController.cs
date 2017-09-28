using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models.UserAccess;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Admin
{
    //[DynamicAuthorize]
    [RoutePrefix("api/Role")]
    public class RoleController : ApiController
    {
        #region "Private Member(s)"

        private readonly IErrorLog _errorLog;
        private readonly IRoleRepository _roleContext;
        private readonly ICompanyRepository _companyRepository;

        private readonly IDataRepository<UserAccessDetail> _userAccessDetailContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;


        #endregion

        #region "Constructor"
        public RoleController(IErrorLog errorLog, IDataRepository<UserDetail> userDetailContext, IRoleRepository roleContext, IDataRepository<UserAccessDetail> userAccessDetailContext, ICompanyRepository companyRepository)
        {
            _errorLog = errorLog;
            _roleContext = roleContext;
            _userAccessDetailContext = userAccessDetailContext;
            _companyRepository = companyRepository;
            _userDetailContext = userDetailContext;

        }
        #endregion

        #region "Public Method(s)"
        /// <summary>
        /// this method is used for get role list
        /// </summary>
        /// <returns>return list of role</returns>
        [HttpGet]
        [Route("GetRoleList")]
        public IHttpActionResult GetRoleList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var roleList = new List<RoleAc>();
                    var currentUser = HttpContext.Current.User.Identity.GetUserId();
                    int companyId = 0;
                    var companyDetail = _companyRepository.GetCompanyDetailByUserId(currentUser);
                    if (companyDetail != null)
                    {
                        companyId = companyDetail.Id;
                    }
                    if (HttpContext.Current.User.Identity.Name.ToLower() == StringConstants.SuperAdminRoleName.ToLower())
                        roleList = _roleContext.GetAdminRoleList();
                    else
                        roleList = _roleContext.GetRoleList(companyId);

                    return Ok(roleList);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for add role in database
        /// </summary>
        /// <param name="roleName"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveRole")]
        public IHttpActionResult SaveRole(RoleAc role)
        {
            try
            {
                //get Company Id by user id
                string userId = HttpContext.Current.User.Identity.GetUserId();
                CompanyDetail companyDetail = _companyRepository.GetCompanyDetailByUserId(userId);
                int companyId = 0;
                if (companyDetail != null)
                {
                    companyId = companyDetail.Id;
                }

                //check role name exist or not
                if (_roleContext.CheckRoleNameExistOrNot(role, companyId))
                    return Ok(new { isRoleNameExist = true });

                if (role.Id == 0)
                {
                    Role roleInfo = _roleContext.AddNewRole(role, companyId);
                    return Ok(roleInfo);
                }
                else
                {
                    _roleContext.UpdateRole(role);
                    return Ok(role);
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("DeleteRole")]
        [HttpGet]
        public IHttpActionResult DeleteRole(int id)
        {
            try
            {
                if (_userAccessDetailContext.Fetch(x => x.RoleId == id).Any())
                {
                    var DeleteError = "error";
                    return Ok(new { DeleteError = DeleteError });
                }
                var users = _userDetailContext.Fetch(x => x.RoleId == id && !x.IsDelete).Count();
                if (users > 0)
                {
                    var DeleteError = "" + users + " User(s) Are Registered with This Role. Please Delete User(s) First, Then Proceed to Delete Role";
                    return Ok(new { DeleteError = DeleteError });
                }
                else
                {
                    var DeleteError = "";
                    _roleContext.DeleteRole(id);
                    return Ok(new { DeleteError = DeleteError });
                }
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

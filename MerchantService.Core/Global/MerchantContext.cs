using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNet.Identity;
using MerchantService.DomainModel.Models;
using System.Web.Http;
using MerchantService.DomainModel.DataContext;
using System.Web.Http.Controllers;
using System.Web.Security;
using System.Linq;
using MerchantService.Utility.Constants;

namespace MerchantService.Core.Global
{
    public class MerchantContext
    {
        private readonly IErrorLog _errorLog;
        private readonly IMerchantDataRepository _merchantDataRepository;

        public MerchantContext(IErrorLog _errorLog, IMerchantDataRepository _merchantDataRepository)
        {
            this._errorLog = _errorLog;
            this._merchantDataRepository = _merchantDataRepository;
            InitializeMerchantContext();
        }

        /// <summary>
        /// List of all Permission
        /// </summary>
        public Permission Permission { get; private set; }

        public CompanyDetail CompanyDetails { get; private set; }

        public List<WorkFlowActivityAc> WorkFlow { get; private set; }

        public string UserId { get; private set; }

        public UserDetail UserDetails { get; private set; }


        /// <summary>
        /// Set values for Merchant Context 
        /// </summary>
        public void InitializeMerchantContext()
        {
            try
            {
                _errorLog.LogInfo("IntializedMerchantContext called");
                if (!String.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
                {
                    var user = HttpContext.Current.User.Identity.Name;
                    UserId = HttpContext.Current.User.Identity.GetUserId();
                    var roleId = _merchantDataRepository.GetRoleIdByCustomerName(user);
                    UserDetails = _merchantDataRepository.GetUserDetails(UserId);
                    CompanyDetails = _merchantDataRepository.GetCompanyDetail((int)UserDetails.CompanyId);
                    Permission = _merchantDataRepository.GetPermissionByRoleId(roleId, CompanyDetails.Id);
                    WorkFlow = _merchantDataRepository.WorkFlowDetails(CompanyDetails.Id, roleId);
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }


    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class DynamicAuthorizeAttribute : AuthorizeAttribute
    {
       readonly MerchantServiceDataContext context = new MerchantServiceDataContext();
        
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            try
            {
                if (HttpContext.Current.Session["RoleName"] != null && HttpContext.Current.Session["RoleName"].ToString() == StringConstants.SuperAdminRoleName)
                {
                    return true;
                }
                else
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    string sqlQuery = "SELECT * FROM dbo.UserDetails WHERE UserName ='" + userName + "'; ";
                    if (String.IsNullOrEmpty(userName))
                    {
                        FormsAuthentication.SignOut();
                        FormsAuthentication.RedirectToLoginPage();
                        return false;
                    }
                    else
                    {
                        var userList = context.UserDetail.SqlQuery(sqlQuery).ToList<UserDetail>();
                        var user = userList.Where(x => !x.IsDelete).ToList();
                        if (user != null && user.Count > 0)
                            return CheckCondition(user.FirstOrDefault());
                        else
                        {
                            FormsAuthentication.SignOut();
                            FormsAuthentication.RedirectToLoginPage();
                            return false;
                        }
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }


        public bool CheckCondition(UserDetail user)
        {
            try
            {
                if (user == null)
                    return false;
                else
                {
                    if (user.IsActive && !user.IsDelete)
                        return true;
                    else
                    {
                        FormsAuthentication.SignOut();
                        FormsAuthentication.RedirectToLoginPage();
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}

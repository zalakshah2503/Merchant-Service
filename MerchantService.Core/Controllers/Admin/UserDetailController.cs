using MerchantService.Core.Global;
using MerchantService.DomainModel.Models;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.ManageUserAccess;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Admin
{
    //[DynamicAuthorize]
    [RoutePrefix("api/UserDetail")]
    public class UserDetailController : ApiController
    {
        #region Private Variables
        private readonly IErrorLog _errorLog;
        private readonly IUserDetailRepository _userDetailContext;
        private ApplicationUserManager _userManager;
        private readonly IRoleRepository _roleRepository;
        //Code removed from brevity
        private readonly ApplicationRoleManager _AppRoleManager = null;
        #endregion

        #region Constructor

        public UserDetailController(IErrorLog errorLog, IUserDetailRepository userDetailContext, ApplicationUserManager userManager, IRoleRepository roleRepository)
        {
            _errorLog = errorLog;
            _userDetailContext = userDetailContext;
            UserManager = userManager;
            _roleRepository = roleRepository;
        }

        #endregion


        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        protected ApplicationRoleManager AppRoleManager
        {
            get
            {
                return _AppRoleManager ?? Request.GetOwinContext().GetUserManager<ApplicationRoleManager>();
            }
        }

        #region Public Method


        /// <summary>
        /// This method is used to get user list - JJ
        /// </summary>
        /// <returns>This method returns list of UserDetail</returns>
        [HttpGet]
        [Route("getUserList")]
        public IHttpActionResult GetUserList()
        {
            try
            {
                var userName = HttpContext.Current.User.Identity.Name;
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {

                    var userCollection = new List<UserDetailAc>();

                    if (HttpContext.Current.Session["RoleName"].ToString() == StringConstants.SuperAdminRoleName)
                    {
                        var user = _userDetailContext.GetAdminUserList();
                        foreach (var userDetail in user)
                        {
                            var userAC = new UserDetailAc();
                            userAC = ApplicationClassHelper.ConvertType<UserDetail, UserDetailAc>(userDetail);
                            userAC.UserId = userDetail.Id;
                            userAC.IsAdminRole = true;
                            userCollection.Add(userAC);
                        }
                    }
                    else
                    {
                        var user = _userDetailContext.GetUserList(userName);
                        foreach (var userDetail in user)
                        {
                            var userAC = new UserDetailAc();
                            userAC = ApplicationClassHelper.ConvertType<UserDetail, UserDetailAc>(userDetail);
                            userAC.UserId = userDetail.Id;
                            if (userDetail.Branch != null)
                                userAC.BranchName = userDetail.Branch.Name;
                            else
                                userAC.BranchName = "";
                            userAC.IsAdminRole = false;
                            userCollection.Add(userAC);
                        }
                    }
                    return Ok(userCollection);
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
        /// This method is used to fetch the user whose id is given. - JJ
        /// </summary>
        /// <param name="id"> id of user</param>
        /// <returns>return UserDetail object</returns>
        [HttpGet]
        [Route("getUserById")]
        public IHttpActionResult GetUserById(int userId)
        {
            try
            {
                var user = _userDetailContext.GetUserById(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to add OR update user - JJ
        /// </summary>
        /// <param name="userDetail">object of UserDetail</param>
        /// <returns>return UserDetail object</returns>
        [Route("addUserDetail")]
        [HttpPost]
        public IHttpActionResult SaveUserDetail(UserDetail userDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (userDetail.Id == 0)
                    {
                        if (_userDetailContext.CheckUserNameExist(userDetail.UserName))
                        {
                            return Ok(new { IsUserNameExist = true });
                        }
                        else if (_userDetailContext.CheckUserEmailExist(userDetail.Email))
                        {
                            return Ok(new { IsUserEmailExist = true });
                        }
                        else if (_userDetailContext.CheckEmployeeIdExist(userDetail.EmployeeId, userDetail.Id))
                        {
                            return Ok(new { IsEmployeeIdExist = true });
                        }
                        else if (_userDetailContext.CheckMobileNoExist(userDetail.MobileNumber, userDetail.Id))
                        {
                            return Ok(new { IsMobileNoExist = true });
                        }

                        Register(userDetail);
                        UserDetail userInfo = _userDetailContext.AddUserDetail(userDetail, HttpContext.Current.User.Identity.Name);
                        SendEmail(userDetail);
                        return Ok(userInfo);
                    }
                    else
                    {
                        if (_userDetailContext.CheckEmployeeIdExist(userDetail.EmployeeId, userDetail.Id))
                        {
                            return Ok(new { IsEmployeeIdExist = true });
                        }
                        else if (_userDetailContext.CheckMobileNoExist(userDetail.MobileNumber, userDetail.Id))
                        {
                            return Ok(new { IsMobileNoExist = true });
                        }
                        var userRole = _roleRepository.GetRoleById(userDetail.RoleId);
                        userDetail.RoleName = userRole.RoleName;
                        var status = _userDetailContext.UpdateUserDetail(userDetail);
                        return Ok(new { userDetail = userDetail, status = status });

                    }
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


        public bool SendEmail(UserDetail userDetail)
        {
            string subject = "MerchantService Registration Activation Link";
            string callbackUrl;
            if (userDetail.RoleName == StringConstants.AdminRoleName)
            {
                callbackUrl = this.Url.Link("Default", new { controller = "", action = "" });
            }
            else
            {
                callbackUrl = StringConstants.WebApiPath;
            }
            string path = HttpContext.Current.Server.MapPath(@"\EmailTemplate\WelcomeMail.html");
            string finalTemplate = System.IO.File.ReadAllText(path);
            finalTemplate = finalTemplate.Replace("${UserName}$", userDetail.UserName).Replace("${Password}$", userDetail.Password)
                .Replace("$CallBack$", callbackUrl);
            if (EmailConfig.SendEmail(userDetail.Email, subject, finalTemplate))
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        /// <summary>
        /// This method is used to delete user from the system - JJ
        /// </summary>
        /// <param name="id">id of user</param>
        /// <returns>null</returns>
        [Route("deleteUser")]
        [HttpGet]
        public IHttpActionResult DeleteUser(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userDeleted = _userDetailContext.GetUserById(id);
                    var user = UserManager.FindById(userDeleted.UserId);
                    var status = _userDetailContext.CheckUserDeletable(id);
                    if (status == 1)
                    {
                        UserManager.Delete(user);
                        _userDetailContext.DeleteUserDetail(id);
                        status = 1;
                    }
                    return Ok(new { status = status });
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
        /// this method is used to reset the user password.
        /// </summary>
        /// <param name="userId">contain userid to reset user password.</param>
        /// <returns>object of reset passwordAC with one time genrate password.</returns>
        [Route("resetUserPassword")]
        [HttpGet]
        public IHttpActionResult ResetUserPassword(int userId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userDetails = _userDetailContext.ResetUserPassword(userId);
                    var user = UserManager.FindById(userDetails.UserId);
                    var randomCharUp = GenrateRandomPassword("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                    var randomCharLow = GenrateRandomPassword("abcdefghijklmnopqrstuvwxyz");
                    var randomNum = GenrateRandomPassword("0123456789");
                    var password = "" + randomCharUp + "" + randomCharLow + "" + randomNum;
                    string userToken = UserManager.GeneratePasswordResetToken(user.Id);
                    var resetPasswordAc = new ResetPasswordAc();
                    var resetPasword = UserManager.ResetPassword(user.Id, userToken, password);
                    if (resetPasword.Succeeded)
                    {
                        resetPasswordAc.Succeeded = true;
                        resetPasswordAc.ResetPassword = password;
                    }
                    else
                    {
                        resetPasswordAc.Succeeded = false;
                        resetPasswordAc.ResetPassword = "Invalid User Token";
                    }
                    return Ok(resetPasswordAc);
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
        /// this method is used to get user list
        /// </summary>
        /// <returns>list of user.</returns>
        [Route("getAllUserList")]
        [HttpGet]
        public IHttpActionResult GetAllUserList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var user = _userDetailContext.GetAllUserList(userName);
                    var userCollection = new List<UserDetailAc>();
                    foreach (var userDetail in user)
                    {
                        var userAC = new UserDetailAc();
                        userAC = ApplicationClassHelper.ConvertType<UserDetail, UserDetailAc>(userDetail);
                        userAC.UserId = userDetail.Id;
                        userAC.BranchName = userDetail.Branch.Name;
                        userCollection.Add(userAC);
                    }
                    return Ok(userCollection);
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
        /// This method used for get cashier list .-An 
        /// </summary>
        /// <returns></returns>

        [Route("getCashierList")]
        [HttpGet]
        public IHttpActionResult GetCashierList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<UserDetail> listOfUserDetail = new List<UserDetail>();
                    var userDetail = _userDetailContext.GetUserDetailByUserName(HttpContext.Current.User.Identity.Name);
                    if (userDetail != null)
                    {
                        listOfUserDetail = _userDetailContext.GetCashierListByCompanyId(userDetail.Branch.CompanyId);
                    }
                    return Ok(listOfUserDetail);
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
        /// Get the user detail object by AspNetUser Id. - PS
        /// </summary>
        /// <param name="userId">aspnetuser id</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetUserDetailByAspNetUserId")]
        public IHttpActionResult GetUserDetailByAspNetUserId(string userId)
        {
            try
            {
                var user = _userDetailContext.GetUserDetailUserId(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used to add user to AspNetUsers table
        /// </summary>
        /// <param name="model">userdetail model with user details.</param>
        private void Register(UserDetail model)
        {
            try
            {
                var user = new IdentityUser { UserName = model.UserName, Email = model.Email };
                var randomCharUp = GenrateRandomPassword("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                var randomCharLow = GenrateRandomPassword("abcdefghijklmnopqrstuvwxyz");
                var randomNum = GenrateRandomPassword("0123456789");
                var password = "" + randomCharUp + "" + randomCharLow + "" + randomNum;
                var userRole = _roleRepository.GetRoleById(model.RoleId);
                UserManager.Create(user, password);
                model.UserId = user.Id;
                model.RoleName = userRole.RoleName;
                model.Password = password;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to genrate the random password. -An
        /// </summary>
        /// <returns>ramdom password.</returns>
        public static string GenrateRandomPassword(string allowed)
        {
            var randNum = new Random();
            var chars = new char[3];
            for (int i = 0; i < 3; i++)
            {
                chars[i] = allowed[(int)((allowed.Length) * randNum.NextDouble())];
            }
            return new string(chars);
        }

        /// <summary>
        /// This method used for active user access page list. -An
        /// </summary>
        /// <returns></returns>
        [Route("userAccessPageList")]
        [HttpGet]
        public IHttpActionResult UserAccessPageList()
        {
            return Ok(new { IsResult = true });
        }

        #endregion
    }
}

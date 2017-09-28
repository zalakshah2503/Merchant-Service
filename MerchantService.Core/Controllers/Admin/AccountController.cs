using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Utility.GlobalUtilities;
using MerchantService.Utility.Constants;


namespace MerchantService.Core.Controllers.Admin
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private readonly ICompanyRepository _companyContext;
        private readonly IUserDetailRepository _userDetailRepository;
        private readonly IErrorLog _errorLog;



        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, ICompanyRepository companyContext, IErrorLog errorLog, IUserDetailRepository userDetailRepository)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            _companyContext = companyContext;
            _errorLog = errorLog;
            _userDetailRepository = userDetailRepository;
        }


        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }


        //
        // GET: /Account/Login
        /// <summary>
        /// User will be redirected to Home screen if authenticated otherwise on login screen.
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            try
            {
                AppSettingsUtil.LogConfiguration = _companyContext.CheckLogAllowedOrNot();
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    return RedirectToLocal(returnUrl);
                }
                else
                {
                    return View();
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        // POST: /Account/Login
        /// <summary>
        /// Method that will be used when user provide user name and password.
        /// </summary>
        /// <param name="model">Loginview model with userdetails</param>
        /// <param name="returnUrl">home page url.</param>
        /// <returns>authenticatted user role is admin then it will redirect to the home page otherwise it will redirect the login page.</returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View(model);
                }

                if (ModelState.IsValid)
                {
                    var user = await UserManager.FindAsync(model.UserName, model.Password);

                    if (user != null)
                    {
                        if (String.IsNullOrEmpty(returnUrl))
                        {
                            var userDetail = _userDetailRepository.GetUserDetailByUserName(user.UserName);
                            if (userDetail == null && user.UserName == StringConstants.AdminName)
                            {
                                var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                                switch (result)
                                {
                                    case SignInStatus.Success:
                                        HttpContext.Session["UserId"] = user.Id;
                                        return RedirectToLocal(returnUrl);
                                    case SignInStatus.Failure:
                                    default:
                                        ModelState.AddModelError("", "Invalid login attempt.");
                                        return View(model);
                                }
                            }
                            else
                            {
                                if (userDetail.RoleName == StringConstants.AdminRoleName)
                                {
                                    if (userDetail.IsActive == true)
                                    {
                                        HttpContext.Session["UserId"] = user.Id;
                                        bool isFirstTimeLogin = _userDetailRepository.GetUserDetailUserId(user.Id).IsFirstTimeLogin;
                                        if (!isFirstTimeLogin)
                                        {
                                            Session["AdminFirstTimeLogin"] = true;
                                            return RedirectToAction("ResetPassword", "Account");
                                        }
                                        var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                                        switch (result)
                                        {
                                            case SignInStatus.Success:
                                                var currentCompanyId = _companyContext.GetCompanyDetailByUserId(user.Id);
                                                if (currentCompanyId != null)
                                                {
                                                    HttpContext.Session["CompanyId"] = currentCompanyId.Id;
                                                }
                                                return RedirectToLocal(returnUrl);
                                            case SignInStatus.Failure:
                                            default:
                                                ModelState.AddModelError("", "Invalid login attempt.");
                                                return View(model);
                                        }
                                    }
                                    else
                                    {
                                        ModelState.AddModelError("", "Inactive User. To Login contact your Administrator");
                                        return View(model);
                                    }

                                }

                                else
                                {
                                    return View(model);
                                }
                            }




                        }
                        else
                        {
                            return RedirectToLocal(returnUrl);
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("", "Invalid login attempt");
                    }
                }

                // If we got this far, something failed, redisplay form
                return View(model);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        // GET: /Account/UserResetPassword
        /// <summary>
        /// Method will be rediretd to the resetpassword page
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ResetPassword()
        {

            return View();
        }

        /// <summary>
        /// this method is used to reset the password.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword(UserResetPassword model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View(model);
                }
                var userId = Session["UserId"].ToString();
                var code = UserManager.GeneratePasswordResetToken(userId);
                var user = UserManager.FindById(userId);
                if (user == null)
                {
                    // Don't reveal that the user does not exist
                    return RedirectToAction("ResetPasswordConfirmation", "Acoount");
                }
                var result = UserManager.ResetPassword(user.Id, code, model.Password);
                if (result.Succeeded)
                {
                    if (Session["AdminFirstTimeLogin"] != null && Session["AdminFirstTimeLogin"].ToString() != "true")
                    {
                        var userDetail = _userDetailRepository.GetUserDetailUserId(userId);
                        if (userDetail != null)
                        {
                            userDetail.IsFirstTimeLogin = true;
                            _userDetailRepository.UpdateUserDetail(userDetail);
                        }
                    }
                    _userDetailRepository.UpdateUserPassword(user.Id);
                    AuthenticationManager.SignOut();
                    return RedirectToAction("ResetPasswordConfirmation", "Account");
                }
                AddErrors(result);
                foreach (var error in result.Errors)
                {
                    ViewBag.Message = error;
                    ModelState.AddModelError("", error);
                }

                return View();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        /// <summary>
        /// user will redirect to the resetpassword confirmation page.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        // POST: /Account/LogOff
        /// <summary>
        /// Method that will be used to log off the reporting screen.
        /// </summary>
        /// <returns>redirect to the login page</returns>
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            try
            {
                AuthenticationManager.SignOut();
                return RedirectToAction("Login", "Account");
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// Disposing the user manager and signin manager.
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        /// <summary>
        /// Method that is used to redirect user to admin screen if return url is null.
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns>redirect to  home page</returns>
        private ActionResult RedirectToLocal(string returnUrl)
        {
            try
            {
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return RedirectToAction("Index", "Admin");
            }
            catch (Exception)
            {
                throw;
            }
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}

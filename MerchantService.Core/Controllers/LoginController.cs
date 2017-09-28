using System.Linq;
using MerchantService.Core.Global;
using MerchantService.DomainModel.Models;
using MerchantService.Repository.ApplicationClasses;
using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using MerchantService.Utility.GlobalUtilities;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Utility.Constants;
using MerchantService.DomainModel.Models.Role;
using Autofac.Extras.NLog;

namespace MerchantService.Core.Controllers
{
    [Authorize]
    public class LoginController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private readonly ICompanyRepository _companyContext;
        private readonly IDataRepository<UserDetail> _userDataRepository;
        private readonly IUserDetailRepository _userDetailRepository;
        private readonly IErrorLog _errorLog;
        private readonly IBranchRepository _branchRepository;
        private readonly ILogger _logger;
        public LoginController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, ICompanyRepository companyContext, IDataRepository<UserDetail> userDataRepository, IUserDetailRepository userDetailRepository, IErrorLog errorLog, IBranchRepository branchRepository, IDataRepository<Role> roleContext, ILogger logger)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            _companyContext = companyContext;
            _userDataRepository = userDataRepository;
            _userDetailRepository = userDetailRepository;
            _errorLog = errorLog;
            _branchRepository = branchRepository;
            _logger = logger;
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
                _logger.Info("Application Started Login Controller");
                AppSettingsUtil.LogConfiguration = _companyContext.CheckLogAllowedOrNot();
                var LanguageList = _companyContext.GetAllLanguage();
                ViewBag.LanguageList = LanguageList;
                if (Request.IsAuthenticated)
                {
                    return RedirectToLocal(returnUrl);
                }
                return View();
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
        /// <param name="model">login view model with user details</param>
        /// <param name="returnUrl">authenticated user role is admin then  it will redirect to the login page otherwise it will redirect to home page.</param>
        /// <returns></returns>
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

                var user = await UserManager.FindAsync(model.UserName, model.Password);
                if (user != null)
                {
                    if (string.IsNullOrEmpty(returnUrl))
                    {
                        var userDetail = _userDetailRepository.GetUserDetailByUserName(user.UserName);
                        if (userDetail != null)
                        {
                            if (userDetail.RoleName != StringConstants.AdminRoleName)
                            {
                                if (userDetail.IsActive && !userDetail.IsDelete)
                                {
                                    //its check user password is reset or not.if its reset then it will redirect to the reset passowrd page otherwise redirect to the home page.
                                    int userResetPasswordCount = _userDataRepository.Fetch(x => x.UserId == user.Id && x.IsResetPassword).Count();
                                    bool isFirstTimeLogin = _userDataRepository.FirstOrDefault(x => x.UserId == user.Id).IsFirstTimeLogin;
                                    if (userResetPasswordCount != 0 || !isFirstTimeLogin)
                                    {
                                        if (userResetPasswordCount != 0)
                                            ViewBag.UserId = user.Id;
                                        if (!isFirstTimeLogin)
                                            Session["FirstTimeLogin"] = true;
                                        Session["UserId"] = user.Id;
                                        return RedirectToAction("UserResetPassword", "Login");
                                    }
                                    var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                                    switch (result)
                                    {
                                        case SignInStatus.Success:
                                            HttpContext.Session["Language"] = model.Language;
                                            var branchDetail = _branchRepository.GetBranchDetailByUserId(user.Id);
                                            if (HttpContext.Session != null && branchDetail != null)
                                            {
                                                HttpContext.Session["BranchId"] = branchDetail.Id;
                                                HttpContext.Session["CompanyId"] = branchDetail.CompanyId;
                                            }
                                            return RedirectToLocal(returnUrl);
                                        case SignInStatus.LockedOut:
                                            return View("Lockout");
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
                                ModelState.AddModelError("", "Invalid login attempt");
                                return View(model);
                            }
                        }
                        else
                        {
                            ModelState.AddModelError("", "Invalid login attempt");
                            return View(model);
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
                // If we got this far, something failed, redisplay form
                return View(model);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        //
        // GET: /Account/ForgotPassword
        /// <summary>
        /// user will redirect to the forgot password page.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }


        //
        // POST: /Account/ForgotPassword
        /// <summary>
        ///  Method that will be used when user provide the email address.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await UserManager.FindByEmailAsync(model.Email);

                    if (user == null)
                    {
                        ViewBag.ErrorMessage = "This EmailId is not registered.";
                        ModelState.Clear();
                        return View("ForgotPassword");
                    }
                    else
                    {
                        string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                        var callbackUrl = Url.Action("ResetPassword", "Login", new { userId = user.Id, code = code },
                            protocol: Request.Url.Scheme);
                        string subject = "MerchantService Reset Password Link";
                        string path = Server.MapPath("/EmailTemplate/ForgetPassword.html");
                        string finalTemplate = System.IO.File.ReadAllText(path);
                        finalTemplate = finalTemplate.Replace("${Email}$", user.UserName)
                            .Replace("$CallBack$", callbackUrl);

                        if (EmailConfig.SendEmail(model.Email, subject, finalTemplate))
                        {
                            return RedirectToAction("ForgotPasswordConfirmation", "Login");
                        }
                        else
                        {
                            ViewBag.ErrorMessage =
                                "There is a server issue so can't do 'forgot password' at this time, please try again after some time.";
                            ModelState.Clear();
                            return View("ForgotPassword");
                        }
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


        //
        // GET: /Account/ForgotPasswordConfirmation
        /// <summary>
        /// user will redirect to password confirmation page
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        /// <summary>
        /// user will redirect to the reset paasowrd page
        /// </summary>
        /// <param name="code"></param>
        /// <param name="userid">contain userid to reset the user password</param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ResetPassword(string code, string userid)
        {
            ViewBag.UserId = userid;
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        /// <summary>
        /// Method that will be used when user provide user name and new passoword.
        /// </summary>
        /// <param name="model">reset passowrd model with user name and new passowrd.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {

            try
            {
                if (!ModelState.IsValid)
                {
                    return View(model);
                }
                var user = await UserManager.FindByIdAsync(model.UserId);
                if (user == null)
                {
                    // Don't reveal that the user does not exist
                    return RedirectToAction("ResetPasswordConfirmation", "Login");
                }
                var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
                if (result.Succeeded)
                {
                    return RedirectToAction("ResetPasswordConfirmation", "Login");
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
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            try
            {
                AuthenticationManager.SignOut();
                return RedirectToAction("Login", "Login");
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


        // GET: /Account/UserResetPassword
        /// <summary>
        /// Method will be rediretd to the resetpassword page
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult UserResetPassword()
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
        public ActionResult UserResetPassword(UserResetPassword model)
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
                    return RedirectToAction("ResetPasswordConfirmation", "Login");
                }
                var result = UserManager.ResetPassword(user.Id, code, model.Password);
                if (result.Succeeded)
                {
                    if (Convert.ToBoolean(Session["FirstTimeLogin"]))
                    {
                        var userDetail = _userDataRepository.FirstOrDefault(x => x.UserId == userId);
                        if (userDetail != null)
                        {
                            userDetail.IsFirstTimeLogin = true;
                            userDetail.ModifiedDateTime = DateTime.UtcNow;
                            _userDataRepository.Update(userDetail);
                            _userDataRepository.SaveChanges();
                        }
                    }
                    _userDetailRepository.UpdateUserPassword(user.Id);
                    AuthenticationManager.SignOut();
                    return RedirectToAction("ResetPasswordConfirmation", "Login");
                }
                AddErrors(result);
                ViewBag.Message = "Invalid Tocken";
                return View();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }
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
        /// <returns></returns>
        private ActionResult RedirectToLocal(string returnUrl)
        {
            try
            {
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return RedirectToAction("Index", "Home");
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

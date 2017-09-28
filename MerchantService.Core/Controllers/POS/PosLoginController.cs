using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace MerchantService.Core.Controllers.POS
{
    [RoutePrefix("api/poslogin")]
    public class PosLoginController : ApiController
    {
        private ApplicationUserManager _userManager;
        
        private readonly IErrorLog _errorLog;
        public PosLoginController(ApplicationUserManager userManager, IErrorLog errorLog)
        {
            UserManager = userManager;
            _errorLog = errorLog;
        }

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
        
        
        /// <summary>
        /// check login credentials for POS User.
        /// </summary>
        /// <param name="loginViewModel"></param>
        /// <returns></returns>
        [System.Web.Http.HttpPut]
        [System.Web.Http.Route("validatelogin")]
        public async Task<IHttpActionResult> ValidateLogin(LoginViewModel loginViewModel)
        {
            try
            {

                var user = await _userManager.FindAsync(loginViewModel.UserName, loginViewModel.Password);
                if (user != null)
                {
                    var aspNetUser = new AspNetUsers()
                    {
                        UserName = user.UserName,
                        Id = user.Id
                    };
                    return Ok(aspNetUser);
                }
                return null;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
            
        }
        
    }
}

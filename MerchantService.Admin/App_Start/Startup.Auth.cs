using MerchantService.Core.Global;
using MerchantService.DomainModel.DataContext;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.DataProtection;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MerchantService.Admin
{
    public partial class Startup
    {

        public static IDataProtectionProvider DataProtectionProvider { get; set; }
        public void ConfigureAuth(IAppBuilder app)
        {

            DataProtectionProvider = app.GetDataProtectionProvider();
            //Configuration of data context,signin manager and user manager.
            app.CreatePerOwinContext(MerchantServiceDataContext.Create);

            app.CreatePerOwinContext(() => DependencyResolver.Current.GetService<ApplicationUserManager>());
            app.CreatePerOwinContext(() => DependencyResolver.Current.GetService<ApplicationSignInManager>());
            app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            // Configure the sign in cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                ExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.  

                }
            });
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);


        }
    }
}
using MerchantService.Core.Global;
using MerchantService.DomainModel.DataContext;
using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using Microsoft.Owin.Security.DataProtection;
using System.Web.Mvc;

namespace MerchantService.Web
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
            
            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            // Configure the sign in cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Login/Login"),
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
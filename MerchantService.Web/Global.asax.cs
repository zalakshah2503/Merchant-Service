using Autofac;
using Autofac.Extras.NLog;
using Exceptionless;
using Exceptionless.Web.Extensions;
using MerchantService.Core.ActionFilter;
using System;
using System.Security.Claims;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.SessionState;

namespace MerchantService.Web
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            AreaRegistration.RegisterAllAreas();

            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            var container = AutofacConfig.RegisterDependencies();
            DatabaseConfig.Initialize(container);
            GlobalFilters.Filters.Add(new ExceptionLoggerFilter(container.Resolve<ILogger>()));
            GlobalConfiguration.Configuration.Filters.Add(new ApiExceptionLoggerFilter(container.Resolve<ILogger>()));
            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;

            ExceptionlessClient.Default.RegisterHttpApplicationErrorHandler(this);

            ExceptionlessClient.Default.RegisterWebApi(GlobalConfiguration.Configuration);
        }

        protected void Application_PostAuthorizeRequest()
        {
            if (IsWebApiRequest())
            {
                HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            }
        }

        private bool IsWebApiRequest()
        {
            return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath != null && HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith(WebApiConfig.UrlPrefixRelative);
        }
    }
}
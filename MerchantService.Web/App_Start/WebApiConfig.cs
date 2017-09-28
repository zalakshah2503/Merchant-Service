using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Exceptionless;

namespace MerchantService.Web
{
    public static class WebApiConfig
    {
        public static string UrlPrefix { get { return "api"; } }
        public static string UrlPrefixRelative { get { return "~/api"; } }
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: WebApiConfig.UrlPrefix + "/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            Exceptionless.ExceptionlessClient.Default.RegisterWebApi(config);
        }
    }
}

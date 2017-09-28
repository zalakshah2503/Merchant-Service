using Microsoft.Owin;
using Owin;
using MerchantService.Admin.App_Start;
using System.Web.Mvc;
using System.Web.Http;
using MerchantService.Core.ActionFilter;
using Autofac.Extras.NLog;
using Autofac;

[assembly: OwinStartupAttribute(typeof(MerchantService.Admin.Startup))]
namespace MerchantService.Admin
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var container = AutofacConfig.RegisterDependencey();
            // Register the Autofac middleware FIRST.
            app.UseAutofacMiddleware(container);
            GlobalFilters.Filters.Add(new ExceptionLoggerFilter(container.Resolve<ILogger>()));
            GlobalConfiguration.Configuration.Filters.Add(new ApiExceptionLoggerFilter(container.Resolve<ILogger>()));
            ConfigureAuth(app);
            app.UseAutofacMvc();
            //Database.SetInitializer(new CreateDatabaseIfNotExists<ApplicationDbContext>());
            DatabaseConfig.Initialize(container);
            //JobConfig.InitializeJob(container);
        }
    }
}

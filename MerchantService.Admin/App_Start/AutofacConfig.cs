using Autofac;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Autofac.Integration.Mvc;
using MerchantService.Core.Controllers.Admin;
using Autofac.Integration.WebApi;
using System.Web.Http;
using System.Web.Mvc;
using MerchantService.DomainModel.DataContext;
using System.Data.Entity;
using MerchantService.Core.Global;
using MerchantService.Repository.Modules.Admin.Company;
using Microsoft.Owin.Security;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using MerchantService.Utility.Logger;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.DataRepository;

using Microsoft.Owin.Security.DataProtection;
using MerchantService.Repository.Modules.Admin.Globalization;
using MerchantService.Repository.Modules.Admin.ManageUserAccess;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Repository.Modules.Admin.IncidentReports;
using MerchantService.Repository.Modules.POS;
using MerchantService.Repository.Modules.Account;
using Autofac.Extras.Quartz;
using LocalDBExtractor.Core.Job;
using LocalDBExtractor.Core.Autofac;
using Autofac.Extras.NLog;

namespace MerchantService.Admin.App_Start
{
    public class AutofacConfig
    {
        public static IContainer RegisterDependencey()
        {
            var containerBuilder = new ContainerBuilder();

            //Register all Controller within current assembly
            containerBuilder.RegisterControllers(typeof(AccountController).Assembly);

            // Registers api controllers within the current assembly.
            containerBuilder.RegisterApiControllers(typeof(AccountController).Assembly);

            //Register DbContext
            containerBuilder.RegisterType<MerchantServiceDataContext>()
                        .As<DbContext>()
                        .InstancePerDependency();
            //This will set dependency resolver for MVC
            containerBuilder.RegisterType<UserStore<IdentityUser>>().As<IUserStore<IdentityUser>>().InstancePerRequest();
            containerBuilder.RegisterType<ApplicationUserManager>().AsSelf().InstancePerRequest();
            containerBuilder.RegisterType<ApplicationSignInManager>().AsSelf().InstancePerRequest();
            containerBuilder.RegisterType<EmailService>();
            containerBuilder.Register<IAuthenticationManager>(c => HttpContext.Current.GetOwinContext().Authentication).InstancePerRequest();
            containerBuilder.Register<IDataProtectionProvider>(c => Startup.DataProtectionProvider).InstancePerRequest();
            /*Register Loggers*/
            containerBuilder.RegisterType<ErrorLog>().As<IErrorLog>();

            //Registration of Generic DataRepository
            containerBuilder.RegisterGeneric(typeof(DataRepository<>)).As(typeof(IDataRepository<>)).InstancePerDependency();

            //Registration of Repository.
            containerBuilder.RegisterType<RoleRepository>().As<IRoleRepository>().InstancePerDependency();
            containerBuilder.RegisterType<GlobalizationRepository>().As<IGlobalizationRepository>().InstancePerDependency();
            containerBuilder.RegisterType<CompanyRepository>().As<ICompanyRepository>().InstancePerDependency();
            containerBuilder.RegisterType<BranchRepository>().As<IBranchRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ManageUserAccessRepository>().As<IManageUserAccessRepository>().InstancePerDependency();
            containerBuilder.RegisterType<RolePermissionRepository>().As<IRolePermissionRepository>().InstancePerDependency();
            containerBuilder.RegisterType<UserDetailRepository>().As<IUserDetailRepository>().InstancePerDependency();
            containerBuilder.RegisterType<AdditionalServiceRepository>().As<IAdditionalServiceRepository>().InstancePerDependency();
            containerBuilder.RegisterType<WorkFlowRepository>().As<IWorkFlowRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ManageIncidentReportRepository>().As<IManageIncidentReportRepository>().InstancePerDependency();
            containerBuilder.RegisterType<AccountingRepository>().As<IAccountingRepository>().InstancePerDependency();
            containerBuilder.RegisterType<LedgerAccountRepository>().As<ILedgerAccountRepository>().InstancePerDependency();

            containerBuilder.RegisterModule(new QuartzAutofacFactoryModule());
            containerBuilder.RegisterModule(new QuartzAutofacJobsModule(typeof(SyncJob).Assembly)
            {
                AutoWireProperties = true,
                PropertyWiringOptions = PropertyWiringOptions.AllowCircularDependencies
            });
            containerBuilder.RegisterModule(new SyncDatabaseModule());
            containerBuilder.RegisterModule<NLogModule>();
            containerBuilder.RegisterModule<SimpleNLogModule>();

            var container = containerBuilder.Build();

            //This will set dependency resolver for MVC
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            //This will set dependency resolver for WebAPI
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;


            return container;
        }
    }
}
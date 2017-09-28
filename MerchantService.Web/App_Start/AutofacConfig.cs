using Autofac;
using Autofac.Extras.NLog;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using MerchantService.Core.Controllers;
using MerchantService.Core.Global;
using MerchantService.DomainModel.DataContext;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.Admin.IncidentReports;
using MerchantService.Repository.Modules.Admin.ManageUserAccess;
using MerchantService.Repository.Modules.CreditNote;
using MerchantService.Repository.Modules.Customer;
using MerchantService.Repository.Modules.CustomerPO;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.IncidentReports;
using MerchantService.Repository.Modules.InternalTransferGoods;
using MerchantService.Repository.Modules.Inventory;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.ItemChangeRequest;
using MerchantService.Repository.Modules.ItemDestructionRequest;
using MerchantService.Repository.Modules.ParentRecords;
using MerchantService.Repository.Modules.POS;
using MerchantService.Repository.Modules.Supplier;
using MerchantService.Repository.Modules.SupplierPO;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataProtection;
using System.Data.Entity;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace MerchantService.Web
{
    public class AutofacConfig
    {
        public static IContainer RegisterDependencies()
        {
            var containerBuilder = new ContainerBuilder();

            //Register all Controller within current assembly
            containerBuilder.RegisterControllers(typeof(LoginController).Assembly);
            containerBuilder.RegisterApiControllers(typeof(LoginController).Assembly);

            //Register DbContext
            containerBuilder.RegisterType<MerchantServiceDataContext>()
                        .As<DbContext>()
                        .InstancePerDependency();
            /*Register Loggers*/
            containerBuilder.RegisterType<ErrorLog>().As<IErrorLog>();

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
            containerBuilder.RegisterType<SupplierPORepository>().As<ISupplierPORepository>().InstancePerDependency();
            containerBuilder.RegisterType<SupplierPOWorkListRepository>().As<ISupplierPOWorkListRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SPOReceivingRepository>().As<ISPOReceivingRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SPOPaymentRepository>().As<ISPOPaymentRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SupplierReturnRepository>().As<ISupplierReturnRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SupReturnWorkListRepository>().As<ISupReturnWorkListRepository>().InstancePerDependency();
            containerBuilder.RegisterType<BranchRepository>().As<IBranchRepository>().InstancePerDependency();
            containerBuilder.RegisterType<UserDetailRepository>().As<IUserDetailRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SupplierProfileRepository>().As<ISupplierProfileRepository>().InstancePerDependency();
            containerBuilder.RegisterType<CategoryRepository>().As<ICategoryRepository>().InstancePerDependency();
            containerBuilder.RegisterType<CompanyRepository>().As<ICompanyRepository>().InstancePerDependency();
            containerBuilder.RegisterType<GroupAccountRepository>().As<IGroupAccountRepository>().InstancePerDependency();
            containerBuilder.RegisterType<LedgerAccountRepository>().As<ILedgerAccountRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SystemParameterRepository>().As<ISystemParameterRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ReceiptPaymentVoucherRepository>().As<IReceiptPaymentVoucherRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ManageUserAccessRepository>().As<IManageUserAccessRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ItemRepository>().As<IItemRepository>().InstancePerDependency();
            containerBuilder.RegisterType<MerchantDataRepository>().As<IMerchantDataRepository>().InstancePerDependency();
            containerBuilder.RegisterType<AdditionalServiceRepository>().As<IAdditionalServiceRepository>().InstancePerDependency();
            containerBuilder.RegisterType<WorkFlowDetailsRepository>().As<IWorkFlowDetailsRepository>().InstancePerDependency();
                      
            containerBuilder.RegisterType<CustomerRepository>().As<ICustomerRepository>().InstancePerDependency();
            containerBuilder.RegisterType<CustomerPORepository>().As<ICustomerPORepository>().InstancePerDependency();
            containerBuilder.RegisterType<CustomerPOWorkListRepository>().As<ICustomerPOWorkListRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ICRRepository>().As<IICRRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ICRWorkListRepository>().As<IICRWorkListRepository>().InstancePerDependency();
            containerBuilder.RegisterType<SalesPurchaseVoucherRepository>().As<ISalesPurchaseVoucherRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ParentRecordsRepository>().As<IParentRecordsRepository>().InstancePerDependency();
            containerBuilder.RegisterType<POSProcessRepository>().As<IPOSProcessRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ManageIncidentReportRepository>().As<IManageIncidentReportRepository>().InstancePerDependency();
            containerBuilder.RegisterType<POSSessionRepository>().As<IPOSSessionRepository>().InstancePerDependency();
            containerBuilder.RegisterType<RolePermissionRepository>().As<IRolePermissionRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ReturnBillRepository>().As<IReturnBillRepository>().InstancePerDependency();
            containerBuilder.RegisterType<IncidentReportRepository>()
                .As<IIncidentReportRepository>()
                .InstancePerDependency();
            containerBuilder.RegisterType<CreditNoteRepository>().As<ICreditNoteRepository>().InstancePerDependency();
            containerBuilder.RegisterType<ItemDestructionRequestRepository>().As<IItemDestructionRequestRepository>().InstancePerDependency();
            containerBuilder.RegisterType<InventoryRepository>().As<IInventoryRepository>().InstancePerDependency();
            containerBuilder.RegisterModule<NLogModule>();
            containerBuilder.RegisterModule<SimpleNLogModule>();
            containerBuilder.RegisterType<InternalTransferGoodsRepository>().As<IInternalTransferGoodsRepository>().InstancePerDependency();
            containerBuilder.RegisterType<AccountingRepository>().As<IAccountingRepository>().InstancePerDependency();
            
            var container = containerBuilder.Build();

            //container.ActivateGlimpse();

            //This will set dependency resolver for MVC
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            //This will set dependency resolver for WebAPI
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;


            return container;
        }
    }
}
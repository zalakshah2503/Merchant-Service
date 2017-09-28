using Microsoft.Shell;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media.Animation;
using System.Deployment.Application;
using MerchantService.POS.Data;
using Autofac;
using MerchantService.POS.Repository;
using System.Data.Entity;
using MerchantService.POS.ViewModel;
using MerchantService.Utility.Constants;

namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application, ISingleInstanceApp
    {

        [STAThread]
        public static void Main(string[] args)
        {
            try
            {

                if (SingleInstance<App>.InitializeAsFirstInstance("POS"))
                {
                    var application = new App();

                    application.InitializeComponent();
                    application.Run();
                    application.DispatcherUnhandledException += Application_DispatcherUnhandledException;
                    // Allow single instance code to perform cleanup operations
                    SingleInstance<App>.Cleanup();
                }
                Timeline.DesiredFrameRateProperty.OverrideMetadata(typeof(Timeline), new FrameworkPropertyMetadata { DefaultValue = 10 });
            }
            catch (Exception)
            {
                throw;
            }

        }

        private static void Application_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            MessageBox.Show(e.Exception.Message);
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            try
            {
                RegisterComponents();
                if (CheckForUpdateVersion())
                {
                    ApplicationDeployment applicationDevelopement = ApplicationDeployment.CurrentDeployment;
                    bool result = applicationDevelopement.Update();
                }
            }
            catch (Exception)
            {

            }
        }

        private static void RegisterComponents()
        {

            var builder = new ContainerBuilder();
            builder.RegisterType<PosRepositoryOnline>();
            builder.RegisterType<PosRepository>();
            builder.RegisterType<PosLocaldbContext>()
                       .As<DbContext>().InstancePerDependency();

            builder.RegisterType<POSWindowViewModel>();
            builder.RegisterType<AddItemViewModel>();
            builder.RegisterType<CustomerViewModel>();
            builder.RegisterType<LoginViewModel>();
            builder.RegisterType<LogOutViewModel>();
            builder.RegisterType<SupervisorViewModel>();
            builder.RegisterType<SuspendViewModel>();
            builder.RegisterType<UnsuspendBill>();
            builder.RegisterType<PaymentViewModel>();
            builder.RegisterGeneric(typeof(DataRepository<>))
                .As(typeof(IDataRepository<>)).InstancePerDependency();
            var container = builder.Build();
            Utility.SettingHelpers.InitializeContainer(container);
            InitializeDatabase(container);
        }

        private static void InitializeDatabase(IContainer container)
        {
            using (var merchantDataContext = container.Resolve<DbContext>())
            {
                try
                {
                    merchantDataContext.Database.Initialize(false);
                    Utility.SettingHelpers.Context = merchantDataContext;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            //base.OnExit(e);
            //System.Diagnostics.Process.Start(Application.ResourceAssembly.Location);
            //Application.Current.Shutdown();
        }
        #region ISingleInstanceApp Members

        public bool SignalExternalCommandLineArgs(IList<string> args)
        {

            return true;
        }

        private bool CheckForUpdateVersion()
        {
            try
            {
                if (ApplicationDeployment.IsNetworkDeployed)
                {
                    //   ApplicationDeployment applicationDevelopement = ApplicationDeployment.CurrentDeployment.CheckForUpdate();
                    return ApplicationDeployment.CurrentDeployment.CheckForUpdate();
                }
                return false;
            }
            catch (Exception)
            {

                throw;
            }
        }

        #endregion ISingleInstanceApp Members


    }
}

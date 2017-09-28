using Autofac;
using MerchantService.DomainModel.DataContext;
using System.Data.Entity;
using MerchantService.DomainModel.Migrations;

namespace MerchantService.Admin.App_Start
{
    public class DatabaseConfig
    {
        public static void Initialize(IComponentContext componentContext)
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<MerchantServiceDataContext,Configuration>("MerchantServiceDataContext"));
            using (var merchantDataContext = componentContext.Resolve<DbContext>())
            {
                merchantDataContext.Database.Initialize(false);
            }
        }
    }
}
using System.Data.Entity;
using Autofac;
using MerchantService.DomainModel.DataContext;
using MerchantService.DomainModel.Migrations;
using System;

namespace MerchantService.Web
{
    public class DatabaseConfig
    {
        public static void Initialize(IComponentContext componentContext)
        {
            
            using (var merchantDataContext = componentContext.Resolve<DbContext>())
            {
                try
                {
                    merchantDataContext.Database.Initialize(false);
                }
                catch(Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}
using Autofac;
using LocalDBExtractor.Core.Repository.PayLoad;
using LocalDBExtractor.Core.Repository.Redis;
using LocalDBExtractor.Core.Server;
using System.Data;
using System.Data.SqlClient;

namespace LocalDBExtractor.Core.Autofac
{
    public class SyncDatabaseModule : Module
    {
        private readonly string _connectionString;

        public SyncDatabaseModule(string connectionString)
        {
            _connectionString = connectionString;
        }

        public SyncDatabaseModule()
        {
            _connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["MerchantServiceDataContext"].ConnectionString;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SqlConnection>().WithParameter("connectionString", _connectionString).As<IDbConnection>().InstancePerDependency();
            builder.RegisterType<DatabaseRepository>().As<IDatabaseRepository>().InstancePerDependency();
            builder.RegisterType<XmlFileReader>().As<IFileReader>().SingleInstance();
            builder.RegisterType<PayloadRepository>().As<IPayloadRepository>();
            builder.RegisterType<PayloadMemoryCache>().As<IPayloadCache>().SingleInstance();
            builder.RegisterType<PayLoadRepository>().As<IPayLoadRepository>().InstancePerDependency();
            builder.RegisterGeneric(typeof(RedisRepository<>)).As(typeof(IRedisRepository<>));
            base.Load(builder);
        }
    }
}
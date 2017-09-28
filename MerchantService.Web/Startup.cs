using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute("MerchantServiceWeb", typeof(MerchantService.Web.Startup))]

namespace MerchantService.Web
{

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
        }
    }
}

using MerchantService.Core.Global;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Logger;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers
{
    public class BaseController : ApiController
    {
        private MerchantContext _merchantContext;
        private readonly IErrorLog _errorLog;
        private readonly IMerchantDataRepository _merchantDataRepository;

        public BaseController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository)
        {
            _errorLog = errorLog;
            _merchantDataRepository = merchantDataRepository;
        }


        protected MerchantContext MerchantContext
        {
            get
            {
                if (_merchantContext == null && HttpContext.Current != null)
                {
                    _merchantContext = new MerchantContext(_errorLog, _merchantDataRepository);
                }
                return _merchantContext;
            }
        }
    }
}

using MerchantService.Core.Global;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Logger;
using System;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Admin
{
    //[DynamicAuthorize]
    public class AdditionalServiceController : ApiController
    {
        #region Private Variables

        private readonly IErrorLog _errorLog;
        private readonly IAdditionalServiceRepository _additionalServiceContext;
        private MerchantContext _merchantContext;
        private readonly IMerchantDataRepository _merchantDataRepository;

        #endregion

        #region Protected Variable

        protected MerchantContext MerchantContext
        {
            get
            {
                if (_merchantContext == null && System.Web.HttpContext.Current != null)
                {
                    _merchantContext = new MerchantContext(_errorLog, _merchantDataRepository);
                }
                return _merchantContext;
            }
        }

        #endregion

        #region Constructor

        public AdditionalServiceController(IErrorLog errorLog, IAdditionalServiceRepository additionalServiceContext, IMerchantDataRepository merchantDataRepository)
        {
            _errorLog = errorLog;
            _additionalServiceContext = additionalServiceContext;
            _merchantDataRepository = merchantDataRepository;
        }
        #endregion

        #region Public Method        

        /// <summary>
        ///This method is used to get Additional Services list -JJ
        /// </summary>
        /// <returns>return list of Additional Services</returns>
        [Route("api/additionalServices/getAdditionalServicesList")]
        [HttpGet]
        public IHttpActionResult GetAdditionalServicesList()
        {
            try
            {
                var additionalServicesList = _additionalServiceContext.GetAdditionalServicesList(MerchantContext.CompanyDetails.Id);
                return Ok(additionalServicesList);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion
    }

}

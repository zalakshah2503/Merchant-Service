using System;
using MerchantService.Repository.Modules.Account;
using MerchantService.Utility.Logger;
using MerchantService.Repository.ApplicationClasses.Account;
using System.Web.Http;
using MerchantService.Repository.Modules.Global;
using MerchantService.Core.Global;

namespace MerchantService.Core.Controllers.Account
{
    //[DynamicAuthorize]
    public class SalesPurchaseVoucherController : BaseController
    {
        #region Private Variable
        private readonly ISalesPurchaseVoucherRepository _salesPurchaseVoucherRepository;
        private readonly IErrorLog _errorLog;
        private readonly int currentCompanyId = 0;
        #endregion

        #region Constructor
        public SalesPurchaseVoucherController(ISalesPurchaseVoucherRepository salesPurchaseVoucherRepository, IErrorLog errorLog, IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _salesPurchaseVoucherRepository = salesPurchaseVoucherRepository;
            _errorLog = errorLog;
            currentCompanyId = MerchantContext.CompanyDetails.Id;
        }
        #endregion

        #region Public Methods
        [HttpPost]
        [Route("api/SalesPurchaseVoucher/SaveSalesPurchaseVocuher")]
              public IHttpActionResult SaveSalesPurchaseVocuher(SalesPurchaseVoucherAC resource)
        {
            try
            {
                var salesVoucher = _salesPurchaseVoucherRepository.SaveSalesPurchaseVoucher(resource, currentCompanyId);
                return Ok(salesVoucher);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("api/SalesPurchaseVoucher/CountSalesOrPurchaseVoucherRecord")]
               public IHttpActionResult CountSalesOrPurchaseVoucherRecord(bool isSales)
        {
            try
            {
                int count = _salesPurchaseVoucherRepository.CountSalesOrPurchaseVoucherRecord(isSales, currentCompanyId);
                return Ok(new { recordCount = count });
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

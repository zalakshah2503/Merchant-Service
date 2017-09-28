using System;
using System.Web.Http;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.Modules.Account;
using MerchantService.Utility.Logger;
using MerchantService.Repository.Modules.Global;
using MerchantService.Core.Global;

namespace MerchantService.Core.Controllers.Account
{
    //[DynamicAuthorize]
    public class ReceiptPaymentVoucherController : BaseController
    {
        #region Private Variable

        private readonly IReceiptPaymentVoucherRepository _receiptPaymentVoucherRepository;
        private readonly IErrorLog _errorLog;
        
        #endregion

        #region Constructor
        public ReceiptPaymentVoucherController(IReceiptPaymentVoucherRepository receiptPaymentVoucherRepository,
            IErrorLog errorLog, IMerchantDataRepository merchantDataRepository) : base(errorLog, merchantDataRepository)
        {
            _receiptPaymentVoucherRepository = receiptPaymentVoucherRepository;
            _errorLog = errorLog;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method is used for saving Receipt voucher data. -SP
        /// </summary>
        /// <param name="resource">object ofo ReceiptPaymentVoucherAC</param>
        /// <returns>return object of ReceiptPaymentVoucherAC</returns>
        [HttpPost]
        [Route("api/ReceiptPaymentVoucher/SaveReceiptVoucher")]
        public IHttpActionResult SaveReceiptVoucher(ReceiptPaymentVoucherAC resource)
        {
            int companyId = MerchantContext.CompanyDetails.Id;
            var receiptVoucher = _receiptPaymentVoucherRepository.SaveReceiptVoucher(resource, companyId);
            return Ok(receiptVoucher);
        }

        /// <summary>
        /// This method is use for geeting number of record of Receipt voucher -SP
        /// </summary>
        /// <returns>count of receipt voucher</returns>
        [HttpGet]
        [Route("api/ReceiptPaymentVoucher/CountReceiptVoucherRecord")]
        public IHttpActionResult CountReceiptVoucherRecord(bool isReceipt)
        {
            try
            {
                int companyId = MerchantContext.CompanyDetails.Id;
                int count = _receiptPaymentVoucherRepository.CountReceiptOrPaymentVoucherRecord(isReceipt, companyId);
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

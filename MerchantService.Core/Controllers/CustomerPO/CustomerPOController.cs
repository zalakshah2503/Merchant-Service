using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.CustomerPO;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.CustomerPO
{
    //[DynamicAuthorize]
    [RoutePrefix("api/customerpo")]
    public class CustomerPOController : BaseController
    {
        #region Private Variable
        private readonly ICustomerPORepository _customerPORepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly int companyId;
        private readonly IErrorLog _errorLog;
        #endregion
        #region Constructor
        public CustomerPOController(ICompanyRepository companyRepository, ICustomerPORepository customerPORepository,
            IMerchantDataRepository merchantDataRepository, IErrorLog errorLog)
            : base(errorLog, merchantDataRepository)
        {
            _companyRepository = companyRepository;
            _customerPORepository = customerPORepository;
            if (MerchantContext.CompanyDetails != null)
                companyId = MerchantContext.CompanyDetails.Id;
            _errorLog = errorLog;
        }
        #endregion
        # region Public Methods

        /// <summary>
        /// This method is used for insert new supplier profile in database. - JJ
        /// </summary>
        /// <param name="supplierProfile"> object of SupplierProfileAC</param>
        /// <returns>object of SupplierProfileAC</returns>
        [HttpPost]
        [Route("savecustomerpo")]
        public IHttpActionResult SaveCustomerPO(CustomerPOAC customerPO)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowedToCreateCPO)
                    {
                        var userName = HttpContext.Current.User.Identity.Name;
                        CPOReceiptAC cpoReceiptAC = _customerPORepository.SaveCustomerPO(customerPO, userName);
                        if (!string.IsNullOrEmpty(cpoReceiptAC?.PurchaseOrderNo))
                            cpoReceiptAC.Invoice = InvoiceToHtml.get39(cpoReceiptAC.PurchaseOrderNo, 1, 20);
                        return Ok(cpoReceiptAC);
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for generating customer purchase order number - jj
        /// </summary>
        /// <returns>object of CPOConstantsAC</returns>
        [Route("generatecustomerponumber")]
        [HttpGet]
        public IHttpActionResult GenerateCustomerPONumber()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var date = DateTime.UtcNow;
                    CPOConstantsAC cponumber = _customerPORepository.PurchaseOrderNumberGenerator(companyId);
                    cponumber.userName = userName;
                    if (MerchantContext.UserDetails.Branch != null)
                    {
                        var branch = MerchantContext.UserDetails.Branch;
                        cponumber.branchName = branch.Name;
                        cponumber.branchId = branch.Id;
                    }
                    else
                    {
                        cponumber.branchName = "";
                        cponumber.branchId = 0;
                    }
                    cponumber.date = date;
                    return Ok(cponumber);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for generating customer purchase order number - jj
        /// </summary>
        /// <returns>object of CPOConstantsAC</returns>
        [Route("getconfigurables")]
        [HttpGet]
        public IHttpActionResult getConfigurables()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var companyConfig = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    CPOConstantsAC cpoConfig = new CPOConstantsAC
                    {
                        AllowCreditAccountLimit = companyConfig.AllowCreditAccountLimit,
                        CPODownPaymentDiscount = companyConfig.CPODownPaymentDiscount,
                    };
                    return Ok(cpoConfig);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get customer purchase order by po number. -An
        /// </summary>
        /// <param name="purchaseOrderNumber"></param>
        /// <returns></returns>

        [Route("getcustomerpobyponumber")]
        [HttpGet]
        public IHttpActionResult GetCustomerPOByPoNumber(string purchaseOrderNumber)
        {
            try
            {
                var customerPurchaseOrder = _customerPORepository.getCustomerPurchaseOrderByPONumber(purchaseOrderNumber);
                return Ok(customerPurchaseOrder);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for fetching customer purchase order list from database. - JJ
        /// </summary>   
        /// <param name="customerId">id of customer</param>
        /// <returns>list of objects of CPODownPaymentAC</returns>
        [HttpGet]
        [Route("getcustomerpolistbycustomerid")]
        public IHttpActionResult GetCustomerPOListByCustomerId(int customerId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var cpoList = _customerPORepository.GetCustomerPOListByCustomerId(customerId);
                    return Ok(cpoList);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for cancelling customer purchase order . - JJ
        /// </summary>
        /// <param name="CPONumber">Purchase Order Number of CPO</param>
        [HttpGet]
        [Route("cancelcustomerpo")]
        public IHttpActionResult CancelCustomerPO(int CPOId, decimal returnAmount)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowedToCancelCPO)
                    {
                        _customerPORepository.CancelCustomerPO(CPOId, returnAmount, MerchantContext.UserDetails.Id);
                        return Ok();
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method used for get purchase order by cpo id. -jj
        /// </summary>
        /// <param name="cpoid"></param>
        /// <returns>OBJECT OF CustomerPOAC</returns>
        [HttpGet]
        [Route("getcustomerpurchaseorderbycpoid")]
        public IHttpActionResult GetCustomerPurchaseOrderByCPOId(int cpoId)
        {
            try
            {
                var CPO = _customerPORepository.GetCustomerPurchaseOrderByCPOId(cpoId);
                return Ok(CPO);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("updatecustomerpurchseorderforpos")]
        public IHttpActionResult UpdateCustomerPurchseOrderForPOS(CustomerPurchaseOrder customerPurchaseOrder)
        {
            try
            {
                var result = _customerPORepository.UpdateCustomerPurchseOrderForPOS(customerPurchaseOrder);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("addcpobillforpos")]
        public IHttpActionResult AddCPOBillForPOS(CPOBill cpoBill)
        {
            try
            {
                var result = _customerPORepository.AddCpoBillMappingFromPos(cpoBill);
                return Ok(result);
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

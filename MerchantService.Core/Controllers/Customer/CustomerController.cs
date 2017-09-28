using MerchantService.Core.Global;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Customer;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;

namespace MerchantService.Core.Controllers.Customer
{
    //[DynamicAuthorize]
    [RoutePrefix("api/customer")]
    public class CustomerController : BaseController
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IErrorLog _errorLog;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;

        public CustomerController(ICustomerRepository customerRepository, IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository)
            : base(errorLog, merchantDataRepository)
        {
            _customerRepository = customerRepository;
            _errorLog = errorLog;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
        }

        /// <summary>
        /// adding new customer details.
        /// </summary>
        /// <param name="customerProfile"></param>
        /// <returns></returns>
        [Route("addnewcustomerdetails")]
        [HttpPost]
        public IHttpActionResult AddNewCustomerDetails(CustomerProfileAc customerProfile)
        {
            try
            {
                var customerDetails = _customerRepository.AddNewCustomerDetails(customerProfile, MerchantContext.CompanyDetails, MerchantContext.Permission, MerchantContext.UserDetails);
                return Ok(new { status = customerDetails });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// to get all customer list.
        /// </summary>
        /// <returns></returns>
        [Route("getallcustomer")]
        [HttpGet]
        public IHttpActionResult GetAllCustomerList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var customerCollection = new List<CustomerProfileAc>();
                    foreach (var customer in _customerRepository.GetAllCustomerList())
                    {
                        var customerProfileAc = new CustomerProfileAc();
                        customerProfileAc = ApplicationClassHelper.ConvertType<CustomerProfile, CustomerProfileAc>(customer);
                        customerProfileAc.CustomerId = customer.Id;
                        customerProfileAc = GetCustomerProfileAc(customerProfileAc, customer);
                        if (customer.IsCreditCustomer)
                        {
                            if (customer.BalanceAmount == 0)
                                customerProfileAc.TransactionAmount = customer.AmountLimit - customer.TransactionAmount;
                            else
                                customerProfileAc.TransactionAmount = customer.BalanceAmount - customer.TransactionAmount;
                        }
                        customerCollection.Add(customerProfileAc);
                    }
                    return Ok(customerCollection.OrderByDescending(x => x.CustomerId));
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// to get all customer list. - jj
        /// </summary>
        /// <returns></returns>
        [Route("getcustomer")]
        [HttpGet]
        public IHttpActionResult GetCustomerList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var customerCollection = new List<CustomerProfileAc>();
                    foreach (var customer in _customerRepository.GetCustomerList())
                    {
                        var customerProfileAc = new CustomerProfileAc();
                        customerProfileAc = ApplicationClassHelper.ConvertType<CustomerProfile, CustomerProfileAc>(customer);
                        customerProfileAc.CustomerId = customer.Id;
                        customerProfileAc = GetCustomerProfileAc(customerProfileAc, customer);
                        customerCollection.Add(customerProfileAc);
                    }
                    return Ok(customerCollection.OrderByDescending(x => x.CustomerId));
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
        /// this method is used for to get  customer details.- JJ
        /// </summary>
        /// <params name="id"></params>
        /// <returns>object of Customer Profile</returns>
        [Route("getcustomerbyid")]
        [HttpGet]
        public IHttpActionResult GetCustomerById(int id)
        {
            try
            {
                var customerDetail = _customerRepository.GetCustomerById(id);
                return Ok(customerDetail);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// Delete the customer information
        /// </summary>
        /// <returns></returns>
        [Route("deletecustomerdetail")]
        [HttpGet]
        public IHttpActionResult DeleteCustomerDetail(int customerId)
        {
            try
            {
                var customer = _customerRepository.GetCustomerById(customerId);
                if (customer != null && customer.IsDeleted)
                    return Ok(new { isResult = StringConstants.AlreadyActivityProcessed });

                var customerDetails = _customerRepository.DeleteCustomerDetail(customerId, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
                return Ok(customerDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("viewcustomerdetailsbyid")]
        public IHttpActionResult ViewCustomerDetailsById(int customerId)
        {
            try
            {
                var custmerDetails = _customerRepository.ViewCustomerDetailsById(customerId, HttpContext.Current.User.Identity.Name, MerchantContext.Permission.IsAllowToReview, MerchantContext.UserDetails, MerchantContext.Permission.IsAllowToCreateCustomerProfile);
                return Ok(custmerDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPut]
        [Route("customerrequestapproval")]
        public IHttpActionResult CustomerRequestApproval(WorkFlowLogAc workFlowLog)
        {
            try
            {
                if (_iWorkFlowDetailsRepository.CheckLastActionPerform(workFlowLog.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                    return Ok(new { isResult = StringConstants.AlreadyActivityProcessed });

                _customerRepository.CustomerRequestApproval(workFlowLog, MerchantContext.UserDetails);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getcustomerbymebershipcodeormobileno")]
        public IHttpActionResult GetCustomerByMebershipCodeOrMobileNo(string number)
        {
            try
            {
                var customerObject = _customerRepository.GetCustomerByMebershipCodeOrMobileNo(number);
                return Ok(customerObject);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPut]
        [Route("resubmitcustomerinformation")]
        public IHttpActionResult ReSubmitCustomerInformation(CustomerProfileAc customerProfile)
        {
            try
            {
                if (customerProfile.RecordId != null && _iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(customerProfile.RecordId), StringConstants.Reject, MerchantContext.UserDetails.RoleId))
                    return Ok(new { isResult = StringConstants.AlreadyActivityProcessed });

                _customerRepository.ReSubmitCustomerInformation(customerProfile, MerchantContext.Permission, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPut]
        [Route("updatecustomerinformation")]
        public IHttpActionResult UpdateCustomerInformation(CustomerProfileAc customerProfile)
        {
            try
            {
                if (customerProfile.RecordId != null && _iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(customerProfile.RecordId), StringConstants.Approve, MerchantContext.UserDetails.RoleId))
                    return Ok(new { isResult = StringConstants.AlreadyActivityProcessed });

                _customerRepository.UpdateCustomerInformation(customerProfile, MerchantContext.CompanyDetails, MerchantContext.Permission, MerchantContext.UserDetails);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        [HttpPost]
        [Route("updatecustomertransctionamount")]
        public CustomerProfile UpdateCustomerTransctionAmount(CustomerProfile customerProfile)
        {
            try
            {
                _customerRepository.UpdateCustomerTransctionAmount(customerProfile);
                return customerProfile;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getmembershipcode")]
        public IHttpActionResult GetMembershipCode()
        {
            try
            {
                var getcode = _customerRepository.GetMembershipCode();
                return Ok(new { code = getcode });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpPost]
        [Route("checknumberalreadyexistornot")]
        public IHttpActionResult CheckNumberAlreadyExistOrNot(CustomerProfileAc customerProfile)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var numberAlreadyExist = _customerRepository.CheckNumberAlreadyExistOrNot(customerProfile);
                    return Ok(new { status = numberAlreadyExist });
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

        [Route("savebalanceamount")]
        [HttpPut]
        public IHttpActionResult SaveBalanceAmount(CustomerProfileAc customerInfo)
        {
            try
            {
                _customerRepository.SaveBalanceAmount(customerInfo, MerchantContext.CompanyDetails.Id);
                var customerCollection = new List<CustomerProfileAc>();
                var paymentDetails = new CustomerPaymentReciptAc();

                customerCollection.Add(customerInfo);
                paymentDetails.BranchDetail = MerchantContext.UserDetails.Branch;
                paymentDetails.CurrentDate = DateTime.UtcNow.ToString("dd-MM-yyyy");
                paymentDetails.Invoice = InvoiceToHtml.get39(customerInfo.MembershipCode.ToString(), 1.5, 20);
                paymentDetails.MemberShipNumber = customerInfo.MembershipCode;
                paymentDetails.CustomerDetails = customerCollection;

                return Ok(paymentDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        #region Private Method(s)

        /// <summary>
        /// This method used for get customer profile ac.
        /// </summary>
        /// <param name="customerProfileAc"></param>
        /// <param name="customer"></param>
        /// <returns></returns>
        private CustomerProfileAc GetCustomerProfileAc(CustomerProfileAc customerProfileAc, CustomerProfile customer)
        {
            switch (Convert.ToInt32(customer.PriceCategory))
            {
                case (int)PriceCategory.NormalPrice:
                    customerProfileAc.PriceCategoryName = PriceCategory.NormalPrice.ToString();
                    break;
                case (int)PriceCategory.A:
                    customerProfileAc.PriceCategoryName = PriceCategory.A.ToString();
                    break;
                case (int)PriceCategory.B:
                    customerProfileAc.PriceCategoryName = PriceCategory.B.ToString();
                    break;
                case (int)PriceCategory.C:
                    customerProfileAc.PriceCategoryName = PriceCategory.C.ToString();
                    break;
                case (int)PriceCategory.D:
                    customerProfileAc.PriceCategoryName = PriceCategory.D.ToString();
                    break;
            }
            var userId = HttpContext.Current.User.Identity.GetUserId();
            if (customer.ParentRecord?.InitiatorId == userId)
            {
                customerProfileAc.IsCurrentUser = true;
            }
            return customerProfileAc;
        }

        #endregion

    }
}

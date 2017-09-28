using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.Helper;
using MerchantService.DomainModel.Models.Accounting;

namespace MerchantService.Repository.Modules.Customer
{
    public class CustomerRepository : ICustomerRepository
    {
        #region Private Variable

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<CustomerProfile> _customerDataRepository;
        private readonly IDataRepository<ParentRecord> _parentDataRepository;
        private readonly IDataRepository<WorkFlowLog> _workFlowRepository;
        private readonly IDataRepository<UserDetail> _userDetailsRepository;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailRepository;
        private readonly IDataRepository<UpdateCustomerInfo> _updateCustomerRepository;
        private readonly IDataRepository<Ledgers> _accountLedgerContext;

        #endregion
        public CustomerRepository(IDataRepository<CustomerProfile> customerDataRepository, IErrorLog errorLog, IDataRepository<ParentRecord> parentDataRepository, IDataRepository<WorkFlowLog> workFlowRepository, IDataRepository<UserDetail> userDetailsRepository, IDataRepository<WorkFlowDetail> workFlowDetailRepository, IDataRepository<UpdateCustomerInfo> updateCustomerRepository, IDataRepository<Ledgers> accountLedgerContext)
        {
            _customerDataRepository = customerDataRepository;
            _errorLog = errorLog;
            _parentDataRepository = parentDataRepository;
            _workFlowRepository = workFlowRepository;
            _userDetailsRepository = userDetailsRepository;
            _workFlowDetailRepository = workFlowDetailRepository;
            _updateCustomerRepository = updateCustomerRepository;
            _accountLedgerContext = accountLedgerContext;
        }
        public void Dispose()
        {
            _customerDataRepository.Dispose();
            _workFlowRepository.Dispose();
            _updateCustomerRepository.Dispose();

        }

        /// <summary>
        /// this method is used for adding a new customer details.
        /// </summary>
        /// <param name="customerProfile"></param>
        /// <param name="companyDetail"></param>
        /// <param name="permission"></param>
        /// <param name="userDetail"></param>
        /// <returns></returns>
        public string AddNewCustomerDetails(CustomerProfileAc customerProfile, CompanyDetail companyDetail, Permission permission, UserDetail userDetail)
        {
            try
            {
                var parentRecored = new ParentRecord();
                if (permission.IsAllowToCreateCustomerProfile)
                {
                    var workflowDetails = _workFlowDetailRepository.FirstOrDefault(x => x.Activity.Name == StringConstants.CreateNewCustomer && x.InitiatorId == userDetail.RoleId && x.CompanyId == companyDetail.Id);
                    if (workflowDetails != null)
                    {
                        CustomerProfile customer = ApplicationClassHelper.ConvertType<CustomerProfileAc, CustomerProfile>(customerProfile);

                        customer.CreatedDateTime = DateTime.UtcNow;
                        customer.ArabicName = customerProfile.ArabicName;

                        WorkFlowLog workFlowlog;
                        if (customerProfile.AmountLimit == 0 && customerProfile.PriceCategory == "1")
                        {
                            WorkFlowDetail currentWorkFlowActionDetails;
                            if (workflowDetails.NextActivity.IsClosed)
                            {
                                currentWorkFlowActionDetails = workflowDetails;
                            }
                            else
                            {
                                var workFlowInformation = _workFlowDetailRepository.FirstOrDefault(x => x.IsApprovePanel && x.ParentActivityId == workflowDetails.Id);
                                currentWorkFlowActionDetails = _workFlowDetailRepository.FirstOrDefault(x => x.ActivityId == workFlowInformation.ActivityId && x.NextActivity.IsClosed);
                            }

                            if (currentWorkFlowActionDetails != null)
                            {
                                parentRecored = new ParentRecord
                                {
                                    WorkFlowId = currentWorkFlowActionDetails.Id,
                                    CreatedDateTime = DateTime.UtcNow,
                                    InitiationDate = DateTime.UtcNow,
                                    InitiatorId = userDetail.UserId,
                                    ModifiedUserId = userDetail.UserId,
                                    ModificationDate = DateTime.UtcNow,

                                };
                                _parentDataRepository.Add(parentRecored);
                                _parentDataRepository.SaveChanges();

                                workFlowlog = new WorkFlowLog
                                {
                                    RecordId = parentRecored.Id,
                                    RoleId = userDetail.RoleId,
                                    UserId = userDetail.UserId,
                                    CreatedDateTime = DateTime.UtcNow,
                                    WorkFlowId = currentWorkFlowActionDetails.Id,
                                    Stage = "Request initiated by",
                                    Action = "Approve",
                                    Comments = customerProfile.Comments

                                };
                                _workFlowRepository.Add(workFlowlog);
                                _workFlowRepository.SaveChanges();
                            }
                            customer.RecordId = parentRecored.Id;
                            customer.IsActive = true;
                            customer.IsCreditCustomer = false;
                            customer.BalanceAmount = 0;
                        }
                        else
                        {
                            parentRecored = new ParentRecord
                            {
                                WorkFlowId = workflowDetails.Id,
                                CreatedDateTime = DateTime.UtcNow,
                                InitiationDate = DateTime.UtcNow,
                                InitiatorId = userDetail.UserId,
                                ModifiedUserId = userDetail.UserId,
                                ModificationDate = DateTime.UtcNow,
                            };
                            _parentDataRepository.Add(parentRecored);
                            _parentDataRepository.SaveChanges();

                            workFlowlog = new WorkFlowLog
                            {
                                RecordId = parentRecored.Id,
                                RoleId = userDetail.RoleId,
                                UserId = userDetail.UserId,
                                CreatedDateTime = DateTime.UtcNow,
                                WorkFlowId = workflowDetails.Id,
                                Stage = "Request Initiated by",
                                Action = "Initiate",
                                Comments = customerProfile.Comments
                            };
                            _workFlowRepository.Add(workFlowlog);
                            _workFlowRepository.SaveChanges();
                            customer.RecordId = parentRecored.Id;
                            if (customerProfile.AmountLimit != 0)
                            {
                                customer.IsCreditCustomer = true;
                            }
                            else
                            {
                                customer.IsCreditCustomer = false;
                            }
                            customer.BalanceAmount = 0;
                            if (workflowDetails.NextActivity.IsClosed)
                            {
                                customer.IsActive = true;
                            }
                        }
                        _customerDataRepository.Add(customer);
                        _customerDataRepository.SaveChanges();
                        if (workflowDetails.NextActivity.IsClosed && customer.IsCreditCustomer)
                        {
                            Ledgers ledgers = new Ledgers();
                            ledgers.Address = customer.Address;
                            ledgers.State = "Gujarat";
                            ledgers.CompanyId = Convert.ToInt32(userDetail.CompanyId);
                            ledgers.LedgerName = customer.Name + "Ledgers";
                            ledgers.Name = ledgers.LedgerName;
                            ledgers.CreatedDateTime = DateTime.UtcNow;
                            ledgers.GroupId = 1;
                            ledgers.ParentLedgerId = null;
                            ledgers.Balance = 0;
                            ledgers.CustomerId = customer.Id;
                            _accountLedgerContext.Add(ledgers);
                            _accountLedgerContext.SaveChanges();
                        }
                        return "Customer Profile";
                    }
                    else
                    {
                        return "Work Flow Not Created";
                    }
                }
                else
                {
                    return "Not Allow Permission";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method used for get customer by membership code or mobile no. -An
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public CustomerProfile GetCustomerByMebershipCodeOrMobileNo(string number)
        {
            try
            {
                CustomerProfile customerObject = new CustomerProfile();
                if (!string.IsNullOrEmpty(number))
                {
                    customerObject = _customerDataRepository.FirstOrDefault(x => x.Mobile == number);
                    if (customerObject == null)
                    {
                        long membershipCode;
                        if (long.TryParse(number, out membershipCode))
                        {
                            customerObject = _customerDataRepository.FirstOrDefault(x => x.MembershipCode == membershipCode);
                        }
                    }
                }
                return customerObject;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public long GetMembershipCode()
        {
            try
            {
                int code = GenrateRandomMemberShipCode();
                int membercode = _customerDataRepository.Fetch(x => x.MembershipCode == code).Count();
                if (membercode != 0)
                {
                    code = GenrateRandomMemberShipCode();
                }
                return code;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool CheckNumberAlreadyExistOrNot(CustomerProfileAc customerProfile)
        {
            try
            {
                if (customerProfile.CustomerId != 0)
                {
                    int customerCount = _customerDataRepository.Fetch(x => x.Mobile == customerProfile.Mobile && x.Id != customerProfile.CustomerId).Count();
                    if (customerCount != 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    int customerCount = _customerDataRepository.Fetch(x => x.Mobile == customerProfile.Mobile).Count();
                    if (customerCount != 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }


            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for to get all customer deatils.
        /// </summary>
        /// <returns></returns>
        public List<CustomerProfile> GetAllCustomerList()
        {
            try
            {
                var customer = _customerDataRepository.Fetch(x => !x.IsWalkIn).ToList();

                return customer;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for to get all customer deatils. - jj
        /// </summary>
        /// <returns></returns>
        public List<CustomerProfile> GetCustomerList()
        {
            try
            {
                var customer = _customerDataRepository.Fetch(x => !x.IsWalkIn && !x.IsDeleted).ToList();
                return customer;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void SaveBalanceAmount(CustomerProfileAc customerInfo, int companyId)
        {
            try
            {
                var customer = _customerDataRepository.GetById(customerInfo.CustomerId);
                customer.BalanceAmount = customer.BalanceAmount + customerInfo.BalanceAmount;
                customer.IsCreditCustomer = true;
                customer.ModifiedDateTime = DateTime.UtcNow;
                _customerDataRepository.Update(customer);
                _customerDataRepository.SaveChanges();
                Ledgers customerLedgers = _accountLedgerContext.FirstOrDefault(x => x.CompanyId == companyId && x.CustomerId == customerInfo.CustomerId);
                if (customerLedgers == null)
                {
                    Ledgers ledgers = new Ledgers();
                    ledgers.Address = customerInfo.Address;
                    ledgers.State = "Gujarat";
                    ledgers.CompanyId = companyId;
                    ledgers.LedgerName = customerInfo.Name + "Ledgers";
                    ledgers.Name = ledgers.LedgerName;
                    ledgers.CreatedDateTime = DateTime.UtcNow;
                    ledgers.GroupId = 1;
                    ledgers.ParentLedgerId = null;
                    ledgers.Balance = 0;
                    ledgers.CustomerId = customerInfo.CustomerId;
                    _accountLedgerContext.Add(ledgers);
                    _accountLedgerContext.SaveChanges();
                }
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
        public CustomerProfile GetCustomerById(int id)
        {
            try
            {
                if (_customerDataRepository.Fetch(x => x.Id == id).Any())
                {
                    var customer = _customerDataRepository.First(x => x.Id == id);
                    return customer;
                }
                else
                {
                    return null;
                }


            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to genrate random member ship code.
        /// </summary>
        /// <returns></returns>
        public static int GenrateRandomMemberShipCode()
        {
            Random mebershipCode = new Random();
            var code = mebershipCode.Next(0, 1000000);
            return code;
        }


        public CustomerProfileAc ViewCustomerDetailsById(int customerId, string userName, bool isAllowToReview, UserDetail userDetail, bool isAllowToCreateCustomerProfile)
        {
            try
            {
                CustomerProfileAc customerProfileAc;
                var customerDetails = _customerDataRepository.GetById(customerId);
                var workflowCollection = new List<WorkFlowActionAc>();
                if (customerDetails.RecordId == null) // for walkin customer
                {
                    customerProfileAc = ApplicationClassHelper.ConvertType<CustomerProfile, CustomerProfileAc>(customerDetails);
                    return customerProfileAc;
                }
                var workFlowLastAction = _workFlowRepository.Fetch(x => x.RecordId == customerDetails.RecordId).ToList().Last();
                var lastActionDetail = _workFlowDetailRepository.FirstOrDefault(x => x.Id == workFlowLastAction.WorkFlowId && x.AssignedId == userDetail.RoleId);
                customerProfileAc = ApplicationClassHelper.ConvertType<CustomerProfile, CustomerProfileAc>(customerDetails);
                customerProfileAc.Invoice = InvoiceToHtml.get39(customerDetails.MembershipCode.ToString(), 1, 20);
                if (customerDetails.ParentRecord.InitiatorId == userDetail.UserId)
                {
                    customerProfileAc.IsCurrentUser = true;
                }
                else
                {
                    customerProfileAc.IsCurrentUser = false;
                }
                customerProfileAc.IsDisabled = true;
                customerProfileAc.IsActive = customerDetails.IsActive;
                if (customerProfileAc.IsActive)
                {
                    customerProfileAc.IsDisabled = false;
                }

                customerProfileAc.IsDeleted = customerDetails.IsDeleted;
                customerProfileAc.CustomerId = customerDetails.Id;
                if (customerDetails.IsCreditCustomer)
                {
                    if (customerDetails.BalanceAmount == 0)
                    {
                        customerProfileAc.IsAmountDisabled = false;
                        if (customerProfileAc.AmountLimit != 0)
                        {
                            customerProfileAc.IsAddButtonDisabled = true;
                        }
                        customerProfileAc.TransactionAmount = customerDetails.AmountLimit - customerDetails.TransactionAmount;
                    }
                    else
                    {
                        customerProfileAc.IsAmountDisabled = true;
                        customerProfileAc.TransactionAmount = customerDetails.BalanceAmount - customerDetails.TransactionAmount;
                    }
                }
                if (!isAllowToReview)
                {
                    customerProfileAc.IsAllowReview = false;
                    if (customerDetails.IsRejected)
                    {
                        var currentWorkFlow =
                            _workFlowDetailRepository.FirstOrDefault(
                                x => x.Id == workFlowLastAction.WorkFlowDetail.Id && x.AssignedId == userDetail.RoleId);
                        if (currentWorkFlow != null)
                        {
                            customerProfileAc.IsRejected = true;
                            customerProfileAc.IsRejected = false;
                        }
                        else
                        {
                            customerProfileAc.IsRejected = false;
                        }
                    }
                    else
                    {
                        if (lastActionDetail != null)
                        {
                            customerProfileAc.IsAllowToApprove = lastActionDetail.IsApproval;
                            customerProfileAc.IsRejected = false;
                        }

                    }
                }
                else
                {
                    if (isAllowToCreateCustomerProfile)
                    {
                        customerProfileAc.IsAllowReview = false;
                    }
                    else
                    {
                        customerProfileAc.IsAllowReview = true;
                    }

                    if (customerDetails.IsRejected)
                    {
                        var currentWorkFlow =
                            _workFlowDetailRepository.FirstOrDefault(
                                x => x.Id == workFlowLastAction.WorkFlowDetail.Id && x.AssignedId == userDetail.RoleId);
                        if (currentWorkFlow != null)
                        {
                            customerProfileAc.IsResubmitRequest = currentWorkFlow.IsRejectPanel;

                            if (isAllowToCreateCustomerProfile)
                            {
                                customerProfileAc.IsDisabled = false;
                            }
                            else
                            {
                                customerProfileAc.IsDisabled = true;
                            }
                        }
                        else
                        {
                            customerProfileAc.IsResubmitRequest = false;
                            customerProfileAc.IsDisabled = true;
                        }
                    }
                    else
                    {
                        if (lastActionDetail != null)
                        {
                            customerProfileAc.IsAllowToApprove = lastActionDetail.IsApproval;
                        }

                        if (isAllowToCreateCustomerProfile)
                        {
                            if (customerDetails.IsActive)
                            {
                                if (customerProfileAc.IsCurrentUser)
                                {
                                    customerProfileAc.IsDisabled = false;
                                }
                                else
                                {
                                    customerProfileAc.IsDisabled = true;
                                }

                            }
                            else
                            {
                                customerProfileAc.IsDisabled = true;
                            }

                        }
                        else
                        {
                            customerProfileAc.IsDisabled = true;
                        }
                    }

                }
                if (customerDetails.IsUpdated)
                {
                    var updatedInfo = _updateCustomerRepository.FirstOrDefault(x => x.CustomerProfileId == customerDetails.Id);
                    UpdateCustomerInfoAc updateCustomer = ApplicationClassHelper.ConvertType<UpdateCustomerInfo, UpdateCustomerInfoAc>(updatedInfo);
                    if (customerDetails.ParentRecord.InitiatorId == userDetail.UserId)
                    {
                        updateCustomer.IsCurrentUser = true;
                    }
                    else
                    {
                        updateCustomer.IsCurrentUser = false;
                    }
                    updateCustomer.IsDisabled = true;
                    updateCustomer.IsActive = customerDetails.IsActive;
                    updateCustomer.IsRejected = customerDetails.IsRejected;
                    updateCustomer.IsDeleted = customerDetails.IsDeleted;
                    updateCustomer.CustomerProfileId = customerDetails.Id;
                    updateCustomer.UpdatedCustomerId = updatedInfo.Id;
                    updateCustomer.CustomerId = customerDetails.Id;
                    updateCustomer.IsUpdated = customerDetails.IsUpdated;
                    updateCustomer.PriceCategory = updatedInfo.PriceCategory;
                    updateCustomer.MembershipCode = (int)customerDetails.MembershipCode;
                    updateCustomer.IsCreditCustomer = updatedInfo.IsCreditCustomer;
                    if (updatedInfo.IsCreditCustomer)
                    {
                        if (updatedInfo.BalanceAmount == 0)
                        {
                            updateCustomer.IsAmountDisabled = false;
                            updateCustomer.TransactionAmount = updatedInfo.AmountLimit - updatedInfo.TransactionAmount;
                        }
                        else
                        {
                            updateCustomer.IsAmountDisabled = true;
                            updateCustomer.TransactionAmount = updatedInfo.BalanceAmount - updatedInfo.TransactionAmount;
                        }
                    }
                    if (!isAllowToReview)
                    {
                        updateCustomer.IsAllowReview = false;
                        if (customerDetails.IsRejected)
                        {
                            var currentWorkFlow =
                                _workFlowDetailRepository.FirstOrDefault(
                                    x => x.Id == workFlowLastAction.WorkFlowDetail.Id && x.AssignedId == userDetail.RoleId);
                            if (currentWorkFlow != null)
                            {
                                updateCustomer.IsRejected = true;
                                updateCustomer.IsDisabled = false;
                            }
                            else
                            {
                                updateCustomer.IsRejected = false;
                            }
                        }
                        else
                        {
                            if (lastActionDetail != null)
                            {
                                updateCustomer.IsAllowToApprove = lastActionDetail.IsApproval;
                                updateCustomer.IsRejected = false;
                            }

                        }
                    }
                    else
                    {

                        if (isAllowToCreateCustomerProfile)
                        {
                            updateCustomer.IsAllowReview = false;
                        }
                        else
                        {
                            updateCustomer.IsAllowReview = true;
                        }
                        if (customerDetails.IsRejected)
                        {
                            var workflowDetails =
                                _workFlowDetailRepository.FirstOrDefault(
                                    x => x.Id == workFlowLastAction.WorkFlowDetail.Id && x.AssignedId == userDetail.RoleId);

                            if (workflowDetails != null)
                            {
                                updateCustomer.IsResubmitRequest = true;
                                updateCustomer.IsAllowEnabled = true;
                                updateCustomer.IsDisabled = false;
                            }
                            else
                            {
                                updateCustomer.IsResubmitRequest = false;
                            }
                        }
                        else
                        {
                            if (lastActionDetail != null)
                            {
                                updateCustomer.IsAllowToApprove = lastActionDetail.IsApproval;
                                updateCustomer.IsDisabled = lastActionDetail.IsApproval;
                            }
                        }

                    }
                    customerProfileAc.UpdateInformation = updateCustomer;
                }
                var workFlowDetails = _workFlowRepository.Fetch(x => x.RecordId == customerDetails.RecordId).ToList();
                foreach (var workflowAction in workFlowDetails)
                {
                    var workFlowActionAc = new WorkFlowActionAc();
                    workFlowActionAc.Stage = workflowAction.Stage + ' ' + workflowAction.RoleDetails.RoleName;
                    workFlowActionAc.Action = workflowAction.Action;
                    workFlowActionAc.WorkFlowActionId = workflowAction.Id;
                    workFlowActionAc.RoleName = workflowAction.RoleDetails.RoleName;
                    workFlowActionAc.Comment = workflowAction.Comments;
                    workFlowActionAc.ActionDate = workflowAction.CreatedDateTime.ToShortDateString();
                    var userNames = _userDetailsRepository.FirstOrDefault(x => x.UserId == workflowAction.UserId);
                    if (userNames != null)
                    {
                        workFlowActionAc.UserName = userNames.UserName;
                    }

                    workflowCollection.Add(workFlowActionAc);
                }
                customerProfileAc.WorkFlowAction = workflowCollection.OrderBy(x => x.WorkFlowActionId);
                return customerProfileAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public void CustomerRequestApproval(WorkFlowLogAc workFlow, UserDetail userDetail)
        {
            try
            {
                var workFlowLastActionDetails = _workFlowRepository.Fetch(x => x.RecordId == workFlow.RecordId).ToList().Last();
                var workDetails = _workFlowDetailRepository.Fetch(x => x.ParentActivityId == workFlowLastActionDetails.WorkFlowId).ToList();
                if (workFlow.Status)
                {
                    var currentWorkFlow = workDetails.FirstOrDefault(x => x.IsApprovePanel);
                    if (currentWorkFlow != null)
                    {


                        var workFlowLog = new WorkFlowLog
                        {

                            RecordId = workFlow.RecordId,
                            WorkFlowId = currentWorkFlow.Id,
                            RoleId = userDetail.RoleId,
                            UserId = userDetail.UserId,
                            CreatedDateTime = DateTime.UtcNow,
                            Comments = workFlow.Comment,
                            Stage = "Request approved by",
                            Action = StringConstants.Approve

                        };
                        _workFlowRepository.Add(workFlowLog);
                        _workFlowRepository.SaveChanges();
                    }


                    var customerInformation =
                        _customerDataRepository.FirstOrDefault(x => x.RecordId == workFlow.RecordId);
                    if (customerInformation.IsDeleted)
                    {

                        customerInformation.IsActive = currentWorkFlow.NextActivity.IsClosed;
                        if (customerInformation.IsActive)
                        {
                            customerInformation.IsActive = false;
                            customerInformation.IsDeleted = true;
                            customerInformation.ModifiedDateTime = DateTime.UtcNow;
                            _customerDataRepository.Update(customerInformation);
                            _customerDataRepository.SaveChanges();
                            return;
                        }
                    }
                    else if (customerInformation.IsUpdated)
                    {
                        customerInformation.IsDeleted = false;

                        customerInformation.IsActive = currentWorkFlow.NextActivity.IsClosed;
                        if (customerInformation.IsActive)
                        {

                            var customerProfile = _updateCustomerRepository.FirstOrDefault(x => x.CustomerProfileId == customerInformation.Id);
                            customerInformation.Name = customerProfile.Name;
                            customerInformation.Address = customerProfile.Address;
                            customerInformation.Email = customerProfile.Email;
                            customerInformation.Mobile = customerProfile.Mobile;
                            customerInformation.Phone = customerProfile.Phone;
                            customerInformation.Fax = customerProfile.Fax;
                            customerInformation.Zipcode = customerProfile.Zipcode;
                            customerInformation.MembershipCode = customerProfile.MembershipCode;
                            customerInformation.PriceCategory = customerProfile.PriceCategory;
                            customerInformation.CreatedDateTime = DateTime.UtcNow;
                            customerInformation.AmountLimit = customerProfile.AmountLimit;
                            customerInformation.BalanceAmount = customerProfile.BalanceAmount;
                            customerInformation.IsActive = true;
                            customerInformation.IsRejected = false;
                            customerInformation.IsUpdated = false;
                            customerInformation.ModifiedDateTime = DateTime.UtcNow;
                            _customerDataRepository.Update(customerInformation);
                            _customerDataRepository.SaveChanges();

                            _updateCustomerRepository.Delete(customerProfile.Id);
                            _updateCustomerRepository.SaveChanges();

                            if (customerInformation.IsCreditCustomer)
                            {
                                Ledgers customerLedgers = _accountLedgerContext.FirstOrDefault(x => x.CompanyId == userDetail.CompanyId && x.CustomerId == customerInformation.Id);
                                if (customerLedgers == null)
                                {
                                    Ledgers ledgers = new Ledgers();
                                    ledgers.Address = customerInformation.Address;
                                    ledgers.State = "Gujarat";
                                    ledgers.CompanyId = Convert.ToInt32(userDetail.CompanyId);
                                    ledgers.LedgerName = customerInformation.Name + "Ledgers";
                                    ledgers.Name = ledgers.LedgerName;
                                    ledgers.CreatedDateTime = DateTime.UtcNow;
                                    ledgers.GroupId = 1;
                                    ledgers.ParentLedgerId = null;
                                    ledgers.Balance = 0;
                                    ledgers.CustomerId = customerInformation.Id;
                                    _accountLedgerContext.Add(ledgers);
                                    _accountLedgerContext.SaveChanges();
                                }
                            }
                            return;
                        }
                    }
                    else
                    {
                        customerInformation.IsDeleted = false;
                        customerInformation.IsActive = currentWorkFlow.NextActivity.IsClosed;

                    }
                    customerInformation.ModifiedDateTime = DateTime.UtcNow;
                    _customerDataRepository.Update(customerInformation);
                    _customerDataRepository.SaveChanges();

                }
                else
                {
                    var currentWorkFlow = workDetails.FirstOrDefault(x => x.IsRejectPanel);
                    if (currentWorkFlow != null)
                    {
                        var workFlowLog = new WorkFlowLog
                        {

                            RecordId = workFlow.RecordId,
                            WorkFlowId = currentWorkFlow.Id,
                            RoleId = userDetail.RoleId,
                            UserId = userDetail.UserId,
                            CreatedDateTime = DateTime.UtcNow,
                            Comments = workFlow.Comment,
                            Stage = "Request rejected by",
                            Action = StringConstants.Reject

                        };
                        _workFlowRepository.Add(workFlowLog);
                        _workFlowRepository.SaveChanges();
                    }
                    var customerInformation =
                        _customerDataRepository.FirstOrDefault(x => x.RecordId == workFlow.RecordId);
                    if (customerInformation.IsDeleted)
                    {
                        customerInformation.IsDeleted = false;
                        customerInformation.IsActive = currentWorkFlow.NextActivity.IsClosed;
                        if (customerInformation.IsActive)
                        {
                            customerInformation.IsActive = false;
                            customerInformation.IsDeleted = true;
                            customerInformation.IsRejected = false;
                            customerInformation.IsUpdated = false;
                        }
                        else
                            customerInformation.IsActive = true;
                    }
                    else if (customerInformation.IsUpdated)
                    {
                        customerInformation.IsDeleted = false;
                        customerInformation.IsRejected = true;
                        customerInformation.IsActive = currentWorkFlow.NextActivity.IsClosed;
                        if (customerInformation.IsActive)
                        {
                            customerInformation.IsUpdated = false;
                        }
                    }
                    else
                    {
                        customerInformation.IsRejected = true;
                        customerInformation.IsActive = false;
                    }
                    customerInformation.ModifiedDateTime = DateTime.UtcNow;
                    _customerDataRepository.Update(customerInformation);
                    _customerDataRepository.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public CustomerProfileAc ReSubmitCustomerInformation(CustomerProfileAc customerProfile, Permission permission, UserDetail userDetail, CompanyDetail companyDetail)
        {
            try
            {
                var workFlowlog = new WorkFlowLog();
                if (permission.IsAllowToCreateCustomerProfile || permission.IsAllowToReview)
                {
                    //its check customer name already exist or not.
                    int customerCount = _customerDataRepository.Fetch(x => x.Name == customerProfile.Name && x.Id != customerProfile.CustomerId).Count();
                    if (customerCount != 0)
                    {
                        throw new ArgumentException("Company name already exists.");
                    }

                    var workflow = _workFlowRepository.Fetch(x => x.RecordId == customerProfile.RecordId).ToList().Last();
                    var currentWorkFlow = _workFlowDetailRepository.FirstOrDefault(x => x.Id == workflow.WorkFlowDetail.ParentActivityId);
                    var customer = _customerDataRepository.GetById(customerProfile.CustomerId);

                    if (customerProfile.AmountLimit == 0 && customerProfile.PriceCategory == "1")
                    {
                        customer = GetCustomer(customer, customerProfile);
                        var workFLowDetails = _workFlowDetailRepository.FirstOrDefault(x => x.IsApprovePanel && x.ParentActivityId == currentWorkFlow.Id);
                        if (workFLowDetails != null)
                        {
                            workFlowlog = new WorkFlowLog
                            {
                                RecordId = (int)customerProfile.RecordId,
                                RoleId = userDetail.RoleId,
                                UserId = userDetail.UserId,
                                CreatedDateTime = DateTime.UtcNow,
                                WorkFlowId = workFLowDetails.Id,
                                Comments = customerProfile.Comments,
                                Stage = "Request resubmit by",
                                Action = StringConstants.Approve

                            };
                            _workFlowRepository.Add(workFlowlog);
                            _workFlowRepository.SaveChanges();
                        }

                        customer.RecordId = customerProfile.RecordId;
                        customer.IsActive = true;
                        customer.IsCreditCustomer = false;
                        customer.IsRejected = false;
                        customer.IsUpdated = false;
                        customer.ModifiedDateTime = DateTime.UtcNow;
                        _customerDataRepository.Update(customer);
                        _customerDataRepository.SaveChanges();
                        return customerProfile;
                    }
                    else
                    {
                        if (!customer.IsUpdated)
                        {
                            workFlowlog = new WorkFlowLog
                            {
                                RecordId = (int)customerProfile.RecordId,
                                RoleId = userDetail.RoleId,
                                UserId = userDetail.UserId,
                                CreatedDateTime = DateTime.UtcNow,
                                WorkFlowId = currentWorkFlow.Id,
                                Comments = customerProfile.Comments,
                                Stage = "Request resubmit by",
                                Action = StringConstants.ReSubmit
                            };
                            _workFlowRepository.Add(workFlowlog);
                            _workFlowRepository.SaveChanges();
                            customer = GetCustomer(customer, customerProfile);
                            customer.RecordId = customerProfile.RecordId;
                            if (customerProfile.AmountLimit != 0)
                            {
                                customer.IsCreditCustomer = true;
                            }
                            else
                            {
                                customer.IsCreditCustomer = false;
                            }
                            customer.IsRejected = false;
                            customer.IsUpdated = false;
                            customer.ModifiedDateTime = DateTime.UtcNow;
                            _customerDataRepository.Update(customer);
                            _customerDataRepository.SaveChanges();
                            return customerProfile;
                        }
                        else
                        {
                            var customerInfo = _updateCustomerRepository.FirstOrDefault(x => x.CustomerProfileId == customerProfile.CustomerId);
                            if (currentWorkFlow != null)
                            {
                                var workFlowlogs = new WorkFlowLog
                                {
                                    RecordId = customerInfo.RecordId,
                                    RoleId = userDetail.RoleId,
                                    UserId = userDetail.UserId,
                                    CreatedDateTime = DateTime.UtcNow,
                                    WorkFlowId = currentWorkFlow.Id,
                                    Stage = "Request resubmit by",
                                    Action = StringConstants.ReSubmit,
                                    Comments = customerProfile.Comments
                                };
                                _workFlowRepository.Add(workFlowlogs);
                                _workFlowRepository.SaveChanges();
                            }
                            customerInfo.Name = customerProfile.Name;
                            customerInfo.Address = customerProfile.Address;
                            customerInfo.Email = customerProfile.Email;
                            customerInfo.Mobile = customerProfile.Mobile;
                            customerInfo.Phone = customerProfile.Phone;
                            customerInfo.Fax = customerProfile.Fax;
                            customerInfo.Zipcode = customerProfile.Zipcode;
                            customerInfo.MembershipCode = customerProfile.MembershipCode;
                            customerInfo.PriceCategory = customerProfile.PriceCategory;
                            customerInfo.CreatedDateTime = DateTime.UtcNow;
                            customerInfo.AmountLimit = customerProfile.AmountLimit;
                            customerInfo.BalanceAmount = customerProfile.BalanceAmount;
                            customerInfo.RecordId = (int)customerProfile.RecordId;
                            customerInfo.ArabicName = customerProfile.ArabicName;
                            if (customerProfile.AmountLimit != 0 || customerProfile.BalanceAmount != 0)
                            {
                                customerInfo.IsCreditCustomer = true;
                            }
                            else
                            {
                                customerInfo.IsCreditCustomer = false;
                            }

                            customerInfo.IsRejected = false;
                            customerInfo.IsActive = false;
                            customerInfo.ModifiedDateTime = DateTime.UtcNow;
                            _updateCustomerRepository.Update(customerInfo);
                            _updateCustomerRepository.SaveChanges();

                            customer = GetCustomer(customer, customerProfile);
                            customer.RecordId = customerProfile.RecordId;
                            if (customerProfile.AmountLimit != 0)
                            {
                                customer.IsCreditCustomer = true;
                            }
                            else
                            {
                                customer.IsCreditCustomer = false;
                            }

                            customer.IsRejected = false;
                            customer.ModifiedDateTime = DateTime.UtcNow;
                            _customerDataRepository.Update(customer);
                            _customerDataRepository.SaveChanges();
                            return customerProfile;
                        }
                    }
                }
                else
                {
                    throw new ArgumentException("Not Allow Permission");
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public CustomerProfile DeleteCustomerDetail(int customerId, UserDetail userDetail, CompanyDetail companyDetail)
        {
            try
            {
                var workFlowlog = new WorkFlowLog();
                var workflow = _workFlowDetailRepository.FirstOrDefault(x => x.Activity.Name == StringConstants.CreateNewCustomer && x.InitiatorId == userDetail.RoleId && x.CompanyId == companyDetail.Id);

                var customerDetails = _customerDataRepository.GetById(customerId);


                if (workflow != null)
                {

                    workFlowlog = new WorkFlowLog
                    {
                        RecordId = (int)customerDetails.RecordId,
                        RoleId = userDetail.RoleId,
                        UserId = userDetail.UserId,
                        CreatedDateTime = DateTime.UtcNow,
                        WorkFlowId = workflow.Id,
                        Stage = "Request deleted by",
                        Action = StringConstants.Delete

                    };
                    _workFlowRepository.Add(workFlowlog);
                    _workFlowRepository.SaveChanges();
                }

                customerDetails.IsDeleted = true;
                customerDetails.IsActive = false;
                customerDetails.ModifiedDateTime = DateTime.UtcNow;
                _customerDataRepository.Update(customerDetails);
                _customerDataRepository.SaveChanges();


                return customerDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public CustomerProfileAc UpdateCustomerInformation(CustomerProfileAc customerProfile, CompanyDetail companyDetail, Permission permission, UserDetail userDetail)
        {
            try
            {
                if (permission.IsAllowToCreateCustomerProfile)
                {
                    var workflow = _workFlowDetailRepository.FirstOrDefault(x => x.Activity.Name == StringConstants.CreateNewCustomer && x.InitiatorId == userDetail.RoleId && x.CompanyId == companyDetail.Id);

                    if (customerProfile.AmountLimit == 0 && customerProfile.PriceCategory == "1")
                    {
                        var customer = _customerDataRepository.GetById(customerProfile.CustomerId);
                        var workFlowInformation = _workFlowDetailRepository.FirstOrDefault(x => x.IsApprovePanel && x.ParentActivityId == workflow.Id);
                        var currentWorkFlowDetails = _workFlowDetailRepository.FirstOrDefault(x => x.ActivityId == workFlowInformation.ActivityId && x.NextActivity.IsClosed);
                        if (currentWorkFlowDetails != null)
                        {
                            var workFlowlog = new WorkFlowLog
                            {
                                RecordId = (int)customer.RecordId,
                                RoleId = userDetail.RoleId,
                                UserId = userDetail.UserId,
                                CreatedDateTime = DateTime.UtcNow,
                                WorkFlowId = currentWorkFlowDetails.Id,
                                Stage = "Request updated by",
                                Action = StringConstants.Approve,
                                Comments = customerProfile.Comments
                            };
                            _workFlowRepository.Add(workFlowlog);
                            _workFlowRepository.SaveChanges();
                        }
                        customer = GetCustomer(customer, customerProfile);
                        customer.IsActive = true;
                        customer.IsCreditCustomer = false;
                        customer.IsRejected = false;
                        customer.ModifiedDateTime = DateTime.UtcNow;
                        _customerDataRepository.Update(customer);
                        _customerDataRepository.SaveChanges();
                    }
                    else
                    {
                        var customerInfo = _customerDataRepository.GetById(customerProfile.CustomerId);
                        if (workflow != null)
                        {
                            var workFlowlog = new WorkFlowLog
                            {
                                RecordId = (int)customerInfo.RecordId,
                                RoleId = userDetail.RoleId,
                                UserId = userDetail.UserId,
                                CreatedDateTime = DateTime.UtcNow,
                                WorkFlowId = workflow.Id,
                                Stage = "Request updated by",
                                Action = StringConstants.Update,
                                Comments = customerProfile.Comments
                            };
                            _workFlowRepository.Add(workFlowlog);
                            _workFlowRepository.SaveChanges();
                        }
                        if (workflow.NextActivity.IsClosed)
                        {
                            customerInfo.Name = customerProfile.Name;
                            customerInfo.Address = customerProfile.Address;
                            customerInfo.Email = customerProfile.Email;
                            customerInfo.Mobile = customerProfile.Mobile;
                            customerInfo.Phone = customerProfile.Phone;
                            customerInfo.Fax = customerProfile.Fax;
                            customerInfo.Zipcode = customerProfile.Zipcode;
                            customerInfo.MembershipCode = customerProfile.MembershipCode;
                            customerInfo.PriceCategory = customerProfile.PriceCategory;
                            customerInfo.CreatedDateTime = DateTime.UtcNow;
                            customerInfo.AmountLimit = customerProfile.AmountLimit;
                            customerInfo.BalanceAmount = customerProfile.BalanceAmount;
                            customerInfo.ArabicName = customerProfile.ArabicName;
                            customerInfo.IsActive = true;
                            if (customerProfile.AmountLimit != 0 || customerProfile.BalanceAmount != 0)
                            {
                                customerInfo.IsCreditCustomer = true;
                                customerProfile.IsCreditCustomer = customerInfo.IsCreditCustomer;
                            }
                            else
                            {
                                customerInfo.IsCreditCustomer = false;
                                customerProfile.IsCreditCustomer = customerInfo.IsCreditCustomer;
                            }
                            customerInfo.IsRejected = false;
                            customerInfo.ModifiedDateTime = DateTime.UtcNow;
                            _customerDataRepository.Update(customerInfo);
                            _customerDataRepository.SaveChanges();

                            Ledgers customerLedgers = _accountLedgerContext.FirstOrDefault(x => x.CompanyId == userDetail.CompanyId && x.CustomerId == customerInfo.Id);
                            if (customerLedgers == null)
                            {
                                Ledgers ledgers = new Ledgers();
                                ledgers.Address = customerInfo.Address;
                                ledgers.State = "Gujarat";
                                ledgers.CompanyId = Convert.ToInt32(userDetail.CompanyId);
                                ledgers.LedgerName = customerInfo.Name + "Ledgers";
                                ledgers.Name = ledgers.LedgerName;
                                ledgers.CreatedDateTime = DateTime.UtcNow;
                                ledgers.GroupId = 1;
                                ledgers.ParentLedgerId = null;
                                ledgers.Balance = 0;
                                ledgers.CustomerId = customerInfo.Id;
                                _accountLedgerContext.Add(ledgers);
                                _accountLedgerContext.SaveChanges();
                            }
                        }
                        else
                        {
                            var customer = new UpdateCustomerInfo();
                            customer.CustomerProfileId = customerInfo.Id;
                            customer.RecordId = (int)customerInfo.RecordId;
                            customer.Name = customerProfile.Name;
                            customer.Address = customerProfile.Address;
                            customer.Email = customerProfile.Email;
                            customer.Mobile = customerProfile.Mobile;
                            customer.Phone = customerProfile.Phone;
                            customer.Fax = customerProfile.Fax;
                            customer.Zipcode = customerProfile.Zipcode;
                            customer.MembershipCode = customerProfile.MembershipCode;
                            customer.PriceCategory = customerProfile.PriceCategory;
                            customer.CreatedDateTime = DateTime.UtcNow;
                            customer.AmountLimit = customerProfile.AmountLimit;
                            customer.BalanceAmount = customerProfile.BalanceAmount;
                            customer.RecordId = (int)customerProfile.RecordId;
                            customer.ArabicName = customerProfile.ArabicName;
                            if (customerProfile.AmountLimit != 0 || customerProfile.BalanceAmount != 0)
                            {
                                customer.IsCreditCustomer = true;
                            }
                            else
                            {
                                customer.IsCreditCustomer = false;
                            }
                            customer.IsRejected = false;
                            customer.IsActive = false;

                            _updateCustomerRepository.Add(customer);
                            _updateCustomerRepository.SaveChanges();

                            customerInfo.Name = customerProfile.Name;
                            customerInfo.Address = customerProfile.Address;
                            customerInfo.Email = customerProfile.Email;
                            customerInfo.Mobile = customerProfile.Mobile;
                            customerInfo.Phone = customerProfile.Phone;
                            customerInfo.Fax = customerProfile.Fax;
                            customerInfo.Zipcode = customerProfile.Zipcode;
                            customerInfo.MembershipCode = customerProfile.MembershipCode;
                            customerInfo.PriceCategory = customerProfile.PriceCategory;
                            customerInfo.CreatedDateTime = DateTime.UtcNow;
                            customerInfo.AmountLimit = customerProfile.AmountLimit;
                            customerInfo.BalanceAmount = customerProfile.BalanceAmount;
                            customerInfo.ArabicName = customerProfile.ArabicName;

                            customerInfo.IsUpdated = true;
                            customerInfo.IsActive = false;
                            customerInfo.IsRejected = false;
                            if (customerProfile.AmountLimit != 0 || customerProfile.BalanceAmount != 0)
                            {
                                customerInfo.IsCreditCustomer = true;
                            }
                            else
                            {
                                customerInfo.IsCreditCustomer = false;
                            }
                            customerInfo.ModifiedDateTime = DateTime.UtcNow;
                            _customerDataRepository.Update(customerInfo);
                            _customerDataRepository.SaveChanges();
                        }

                    }

                    return customerProfile;
                }
                else
                {
                    throw new ArgumentException("Not Allow Permission");
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public CustomerProfile UpdateCustomerTransctionAmount(CustomerProfile customerProfile)
        {
            try
            {
                var customerObje = _customerDataRepository.GetById(customerProfile.Id);
                customerObje.TransactionAmount = customerProfile.TransactionAmount;
                customerObje.ModifiedDateTime = DateTime.UtcNow;
                _customerDataRepository.Update(customerObje);
                _customerDataRepository.SaveChanges();
                return customerProfile;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #region Private Method(s)

        private CustomerProfile GetCustomer(CustomerProfile customer, CustomerProfileAc customerProfile)
        {
            customer.Name = customerProfile.Name;
            customer.Address = customerProfile.Address;
            customer.Email = customerProfile.Email;
            customer.Mobile = customerProfile.Mobile;
            customer.Phone = customerProfile.Phone;
            customer.Fax = customerProfile.Fax;
            customer.Zipcode = customerProfile.Zipcode;
            customer.MembershipCode = customerProfile.MembershipCode;
            customer.PriceCategory = customerProfile.PriceCategory;
            customer.CreatedDateTime = DateTime.UtcNow;
            customer.AmountLimit = customerProfile.AmountLimit;
            customer.BalanceAmount = customerProfile.BalanceAmount;
            customer.ArabicName = customerProfile.ArabicName;
            return customer;
        }

        #endregion
    }
}

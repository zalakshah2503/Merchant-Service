using MerchantService.DomainModel.DataContext;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.Modules.Account;
using MerchantService.Utility.Constants;
using MerchantService.DomainModel.Models.SystemParameters;

namespace MerchantService.Repository.Modules.CustomerPO
{
    public class CustomerPORepository : ICustomerPORepository
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<CustomerPurchaseOrder> _customerPOContext;
        private readonly IDataRepository<CPOItem> _CPOItemContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<CPOAdditionalCost> _CPOAdditionalCostContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<CompanyConfiguration> _companyConfigurationContext;
        private readonly IDataRepository<CPOPayment> _cpoPaymentContext;
        private readonly IDataRepository<CPODownPayment> _cpoDownPaymentContext;
        private readonly IDataRepository<CPOPaymentType> _cpoPaymentTypeContext;
        private readonly IDataRepository<CustomerProfile> _customerProfileContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<CPOBill> _cpoBillContext;
        private readonly IAccountingRepository _iAccountingRepository;

        #endregion

        #region Constructor
        public CustomerPORepository(IDataRepository<ItemProfile> itemProfileContext, IDataRepository<CustomerProfile> customerProfileContext,
            IDataRepository<ParamType> paramTypeContext, IDataRepository<UserDetail> userDetailContext, IDataRepository<CPOItem> CPOItemContext,
            IDataRepository<CustomerPurchaseOrder> customerPOContext, IAccountingRepository iAccountingRepository, IErrorLog errorLog,
            IDataRepository<CPOAdditionalCost> CPOAdditionalCostContext, IDataRepository<CompanyConfiguration> companyConfigurationContext,
            IDataRepository<CPODownPayment> cpoDownPaymentContext, IDataRepository<CPOPayment> cpoPaymentContext,
            IDataRepository<CPOPaymentType> cpoPaymentTypeContext, IDataRepository<CPOBill> cpoBillContext)
        {
            _customerProfileContext = customerProfileContext;
            _customerPOContext = customerPOContext;
            _CPOAdditionalCostContext = CPOAdditionalCostContext;
            _userDetailContext = userDetailContext;
            _CPOItemContext = CPOItemContext;
            _paramTypeContext = paramTypeContext;
            _companyConfigurationContext = companyConfigurationContext;
            _cpoPaymentContext = cpoPaymentContext;
            _cpoDownPaymentContext = cpoDownPaymentContext;
            _cpoPaymentTypeContext = cpoPaymentTypeContext;
            _itemProfileContext = itemProfileContext;
            _cpoBillContext = cpoBillContext;
            _iAccountingRepository = iAccountingRepository;
            _errorLog = errorLog;
        }

        #endregion

        # region Public Methods
        /// <summary>
        /// this method is used for adding a new customer purchase order. - jj
        /// </summary>
        /// <param name="customerPO">object of CustomerPOAC</param>
        /// <param name="userName">username of currently logged in user</param>
        /// <returns>object of CPOReceiptAC</returns>
        public CPOReceiptAC SaveCustomerPO(CustomerPOAC customerPO, string userName)
        {
            var currentUser = _userDetailContext.First(x => x.UserName == userName);
            var customerid = (customerPO.CustomerId > 0) ? customerPO.CustomerId : customerPO.Customer.Id;

            customerPO.CustomerId = customerid;
            var customer = _customerProfileContext.Find(customerid);

            if (customerPO.CustomerPOId == 0)
            {
                customerPO.DueDate = (customerPO.DueDate == DateTime.MinValue) ? DateTime.UtcNow.AddDays(2) : customerPO.DueDate;
                if (customerPO.DueDate == DateTime.MinValue)
                {
                    customerPO.DueDate = DateTime.UtcNow.AddDays(2);
                }

                CustomerPurchaseOrder customerpo = new CustomerPurchaseOrder()
                {
                    CollectingBranchId = customerPO.CollectingBranchId,
                    CreatedDateTime = DateTime.UtcNow,
                    CustomerId = customerPO.Customer.Id,
                    DueDate = customerPO.DueDate,
                    InitiationBranchId = currentUser.BranchId,
                    InitiationDate = DateTime.UtcNow,
                    InitiatorId = currentUser.Id,
                    IsCancel = false,
                    IsSPORequired = customerPO.IsSPORequired,
                    IsCollected = false,
                    ModifiedBy = currentUser.Id,
                    ModifiedDate = DateTime.UtcNow,
                    TotalCPOAmount = customerPO.TotalCPOAmount,
                    PurchaseOrderNo = customerPO.PurchaseOrderNo
                };
                _customerPOContext.Add(customerpo);
                _customerPOContext.SaveChanges();
                customerPO.CustomerPOId = customerpo.Id;
                customerPO.InitiationBranchId = currentUser.BranchId;
                customerPO.InitiatorId = currentUser.Id;

                AddPOItemsAdditionalCost(customerPO, currentUser.BranchId);
            }
            else if (customerPO.IsEdit)
            {
                if (_customerPOContext.Fetch(x => x.Id == customerPO.CustomerPOId).Any())
                {
                    var cpo = _customerPOContext.FirstOrDefault(x => x.Id == customerPO.CustomerPOId);
                    cpo.DueDate = customerPO.DueDate;
                    cpo.CollectingBranchId = customerPO.CollectingBranchId;
                    cpo.TotalCPOAmount = customerPO.TotalCPOAmount;
                    cpo.Comments = customerPO.Comments;
                    cpo.IsSPORequired = customerPO.IsSPORequired;
                    cpo.ModifiedBy = currentUser.Id;
                    cpo.ModifiedDate = DateTime.Today;
                    cpo.ModifiedDateTime = DateTime.UtcNow;
                    _customerPOContext.Update(cpo);
                    _customerPOContext.SaveChanges();

                    DeleteItems(customerPO.CustomerPOId);
                    DeleteAdditionalCost(customerPO.CustomerPOId);
                    AddPOItemsAdditionalCost(customerPO, currentUser.BranchId);
                }
                else
                {
                    return null;
                }
            }
            var paymentmode = PaymentMode.ReceiveFromCustomer;
            decimal totalAmount;
            if (customerPO.ToCustomer && (customerPO.TotalCPOAmount <= customerPO.DownPaymentAmount))
            {
                customerPO.ExcessAmount = 0;
                paymentmode = PaymentMode.PayToCustomer;
                totalAmount = customerPO.DownPaymentAmount - customerPO.TotalCPOAmount;
            }
            else
            {
                if (customerPO.ExcessAmount > 0)
                {
                    paymentmode = PaymentMode.ReceiveFromCustomer;
                    totalAmount = (customerPO.CPOPaymentAC.Cash + customerPO.CPOPaymentAC.DebitCardAmount + customerPO.CPOPaymentAC.CouponAmount + customerPO.CPOPaymentAC.CreditCardAmount + customerPO.CPOPaymentAC.CreditAccountAmount) - customerPO.ExcessAmount;
                }
                else
                {
                    customerPO.ExcessAmount = 0;
                    paymentmode = PaymentMode.ReceiveFromCustomer;
                    totalAmount = customerPO.CPOPaymentAC.Cash + customerPO.CPOPaymentAC.DebitCardAmount + customerPO.CPOPaymentAC.CouponAmount + customerPO.CPOPaymentAC.CreditCardAmount + customerPO.CPOPaymentAC.CreditAccountAmount;
                }
            }
            if (paymentmode.Equals(PaymentMode.ReceiveFromCustomer) && totalAmount == 0)
            {
                customerPO.IsReceipt = false;
            }
            else
            {
                customerPO.IsReceipt = true;
                var voucherNum = VoucherNumberGenerator();
                CPOPayment cpoPay = new CPOPayment
                {
                    CustomerId = customerid,
                    CPOId = customerPO.CustomerPOId,
                    Comment = customerPO.CPOPaymentAC.Comment,
                    CreatedDateTime = DateTime.UtcNow,
                    InitiatorId = currentUser.Id,
                    PaymentMode = paymentmode,
                    Purpose = Purpose.DownPayment,
                    TotalAmount = totalAmount,
                    VoucherNo = voucherNum,
                    ExcessAmount = customerPO.ExcessAmount
                };
                _cpoPaymentContext.Add(cpoPay);
                _cpoPaymentContext.SaveChanges();
                customerPO.CPOPaymentAC.CPOPaymentId = cpoPay.Id;

                if (paymentmode.Equals(PaymentMode.ReceiveFromCustomer))
                {
                    customer.TransactionAmount += customerPO.CPOPaymentAC.CreditAccountAmount;
                }
                else
                {
                    customer.TransactionAmount -= customerPO.CPOPaymentAC.CreditAccountAmount;
                }
                customer.ModifiedDateTime = DateTime.UtcNow;
                _customerProfileContext.Update(customer);
                _customerProfileContext.SaveChanges();
                var paymentTypeList = _paramTypeContext.Fetch(x => x.Param.Value == StringConstants.PaymentType).ToList();
                if (customerPO.CPOPaymentAC.Cash != 0)
                {
                    CPOPaymentType cpoCashPayType = new CPOPaymentType
                    {
                        Amount = customerPO.CPOPaymentAC.Cash,
                        CreatedDateTime = DateTime.UtcNow,
                        CustomerPaymentId = customerPO.CPOPaymentAC.CPOPaymentId,
                        PaymentTypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn == StringConstants.PayCash).Id
                    };
                    _cpoPaymentTypeContext.Add(cpoCashPayType);
                    _cpoPaymentTypeContext.SaveChanges();
                }
                if (customerPO.CPOPaymentAC.CouponAmount != 0)
                {
                    CPOPaymentType cpoCouponPayType = new CPOPaymentType
                    {
                        Amount = customerPO.CPOPaymentAC.CouponAmount,
                        CreatedDateTime = DateTime.UtcNow,
                        CustomerPaymentId = customerPO.CPOPaymentAC.CPOPaymentId,
                        PaymentTypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn == StringConstants.PayCoupon).Id,
                        ReceiptNo = customerPO.CPOPaymentAC.CouponNo
                    };
                    _cpoPaymentTypeContext.Add(cpoCouponPayType);
                    _cpoPaymentTypeContext.SaveChanges();
                }
                if (customerPO.CPOPaymentAC.CreditAccountAmount != 0)
                {
                    CPOPaymentType cpoCreditAccountPayType = new CPOPaymentType
                    {
                        Amount = customerPO.CPOPaymentAC.CreditAccountAmount,
                        CreatedDateTime = DateTime.UtcNow,
                        CustomerPaymentId = customerPO.CPOPaymentAC.CPOPaymentId,
                        PaymentTypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn == StringConstants.PayCreditAccount).Id
                    };
                    _cpoPaymentTypeContext.Add(cpoCreditAccountPayType);
                    _cpoPaymentTypeContext.SaveChanges();
                }
                if (customerPO.CPOPaymentAC.CreditCardAmount != 0)
                {
                    CPOPaymentType cpoCreditCardPayType = new CPOPaymentType
                    {
                        Amount = customerPO.CPOPaymentAC.CreditCardAmount,
                        CreatedDateTime = DateTime.UtcNow,
                        CustomerPaymentId = customerPO.CPOPaymentAC.CPOPaymentId,
                        PaymentTypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn == StringConstants.PayCreditCard).Id,
                        ReceiptNo = customerPO.CPOPaymentAC.CreditCardReceipt
                    };
                    _cpoPaymentTypeContext.Add(cpoCreditCardPayType);
                    _cpoPaymentTypeContext.SaveChanges();
                }
                if (customerPO.CPOPaymentAC.DebitCardAmount != 0)
                {
                    CPOPaymentType cpoDebitCardPayType = new CPOPaymentType
                    {
                        Amount = customerPO.CPOPaymentAC.DebitCardAmount,
                        CreatedDateTime = DateTime.UtcNow,
                        CustomerPaymentId = customerPO.CPOPaymentAC.CPOPaymentId,
                        PaymentTypeId = paymentTypeList.FirstOrDefault(x => x.ValueEn == StringConstants.PayDebitCard).Id,
                        ReceiptNo = customerPO.CPOPaymentAC.DebitCardReceipt
                    };
                    _cpoPaymentTypeContext.Add(cpoDebitCardPayType);
                    _cpoPaymentTypeContext.SaveChanges();
                }
                CPODownPayment cpoDownPay = new CPODownPayment
                {
                    Amount = customerPO.CPOPaymentAC.Cash + customerPO.CPOPaymentAC.DebitCardAmount + customerPO.CPOPaymentAC.CouponAmount + customerPO.CPOPaymentAC.CreditCardAmount + customerPO.CPOPaymentAC.CreditAccountAmount,
                    CreatedDateTime = DateTime.UtcNow,
                    CustomerPaymentID = customerPO.CPOPaymentAC.CPOPaymentId
                };
                _cpoDownPaymentContext.Add(cpoDownPay);
                _cpoDownPaymentContext.SaveChanges();
            }

            InsertIntoAccountEntries(customerPO, paymentmode, totalAmount);

            if (!customerPO.IsReceipt)
            {
                var cpoReceipt = new CPOReceiptAC();
                return cpoReceipt;
            }
            else
            {
                var itemACList = new List<CPOItemAC>();
                var cpoReceipt = new CPOReceiptAC
                {
                    CollectingBranchName = customerPO.CollectingBranchName,
                    DueDate = customerPO.DueDate,
                    InitiationBranchName = customerPO.InitiationBranchName,
                    IsReceipt = customerPO.IsReceipt,
                    PurchaseOrderNo = customerPO.PurchaseOrderNo,
                    ToCustomer = customerPO.ToCustomer,
                    CurrentBranchAdd = currentUser.Branch.Address,
                    CurrentBranchName = currentUser.Branch.NameSl,
                    TotalCPOAmount = customerPO.TotalCPOAmount,
                    DownPaymentAmount = customerPO.CPOPaymentAC.Cash + customerPO.CPOPaymentAC.DebitCardAmount + customerPO.CPOPaymentAC.CouponAmount + customerPO.CPOPaymentAC.CreditCardAmount + customerPO.CPOPaymentAC.CreditAccountAmount,
                    CPOItemAC = null
                };
                if (customerPO.CPOItem == null)
                {
                    cpoReceipt.CPOItemAC = customerPO.CPOItemAC;
                    cpoReceipt.CustomerMobile = customerPO.CustomerMobile;
                    cpoReceipt.CustomerName = customerPO.CustomerName;
                    cpoReceipt.MembershipCode = customerPO.MembershipCode;
                }
                else
                {
                    foreach (var cpoItem in customerPO.CPOItem)
                    {
                        var itemProfile = _itemProfileContext.Find(cpoItem.ItemId);
                        var itemCPO = new CPOItemAC
                        {
                            Flavour = itemProfile.FlavourEn,
                            ItemName = itemProfile.ItemNameEn,
                            ItemTotalCost = cpoItem.ItemTotalCost,
                            Quantity = cpoItem.Quantity,
                            SellPrice = cpoItem.SellPrice,
                            Type = itemProfile.SystemParameter.ValueEn + " - " + itemProfile.BaseUnit
                        };
                        itemACList.Add(itemCPO);
                    }
                    cpoReceipt.CPOItemAC = itemACList;
                    cpoReceipt.CustomerMobile = customerPO.Customer.Mobile;
                    cpoReceipt.CustomerName = customerPO.Customer.Name;
                    cpoReceipt.MembershipCode = customerPO.Customer.MembershipCode;
                }
                return cpoReceipt;
            }
        }


        /// <summary>
        /// this method is used for generating customer purchase order number - jj
        /// </summary>
        /// <param name="companyId">CompanyId of the initiator</param>
        /// <returns>object of CPOConstantsAC</returns>
        public CPOConstantsAC PurchaseOrderNumberGenerator(int companyId)
        {
            var companyConfig = _companyConfigurationContext.First(x => x.CompanyId == companyId);
            var CpoInvoiceNumber = companyConfig.CPOInvoiceNo;
            string ponumber;
            var checkCPO = "" + CpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyy");
            var num = _customerPOContext.Fetch(x => x.PurchaseOrderNo.Contains(checkCPO)).Count();
            if (num == 0)
            {
                var numString = (num + 1).ToString();
                var ponum = numString.PadLeft(numString.Length + 3, '0');
                ponumber = "" + CpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyy") + "" + ponum;
            }
            else
            {
                string nextCPO = (num + 1).ToString();
                // number of zero required
                int countZero = (4 - nextCPO.Length) >= 0 ? (4 - nextCPO.Length) : 0;
                if (countZero > 0)
                {
                    string sub = nextCPO.PadLeft(countZero + 1, '0');
                    ponumber = "" + CpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyy") + "" + sub;
                }
                else
                {
                    string sub = nextCPO;
                    ponumber = "" + CpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyy") + "" + sub;
                }
            }
            CPOConstantsAC configurables = new CPOConstantsAC
                {
                    PurchaseOrderNo = ponumber,
                    AllowCreditAccountLimit = companyConfig.AllowCreditAccountLimit,
                    CPODownPaymentDiscount = companyConfig.CPODownPaymentDiscount
                };
            return configurables;
        }


        /// <summary>
        /// this method is used for generating voucher number - jj
        /// </summary>
        /// <returns>VoucherNo</returns>
        public string VoucherNumberGenerator()
        {

            var date = DateTime.UtcNow.ToString("ddMMyyyy");
            var num = _cpoPaymentContext.Fetch(x => x.VoucherNo.Contains(date)).Count();
            MerchantServiceDataContext context = new MerchantServiceDataContext();
            string vnumber;
            if (num == 0)
            {
                var numString = (num + 1).ToString();
                var vouchernum = numString.PadLeft(numString.Length + 4 - 1, '0');
                vnumber = "" + DateTime.UtcNow.ToString("ddMMyyyy") + "" + vouchernum;
            }
            else
            {
                var poNum = (from n in context.CPOPayment
                             orderby n.Id descending
                             select n.VoucherNo).FirstOrDefault();

                int subVoucherNo = int.Parse(poNum.Substring(8));
                string nextVoucherNo = (subVoucherNo + 1).ToString();
                // number of zero required
                int countZero = (4 - nextVoucherNo.Length) >= 0 ? (4 - nextVoucherNo.Length) : 0;
                string sub;
                if (countZero > 0)
                {
                    sub = nextVoucherNo.PadLeft(countZero + 1, '0');
                }
                else
                {
                    sub = nextVoucherNo;
                }
                vnumber = "" + DateTime.UtcNow.ToString("ddMMyyyy") + "" + sub;
            }
            return vnumber;
        }

        /// <summary>
        ///This method used for get purchase order by po number. -An
        /// </summary>
        /// <param name="poNumber"></param>
        /// <returns></returns>
        public CustomerPurchaseOrder getCustomerPurchaseOrderByPONumber(string poNumber)
        {
            try
            {
                return _customerPOContext.FirstOrDefault(x => x.PurchaseOrderNo == poNumber);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for fetching customer purchase order list by customer id. - jj
        /// </summary>
        /// <param name="customerId">Id of Customer</param>
        /// <returns>list of object of CPODownPaymentAC</returns>
        public List<CPODownPaymentAC> GetCustomerPOListByCustomerId(int customerId)
        {
            try
            {
                var customerpoList = new List<CPODownPaymentAC>();
                decimal downPaymentAmount = 0;
                var cpoList = _customerPOContext.Fetch(x => x.CustomerId == customerId && !x.IsCancel).OrderByDescending(x => x.CreatedDateTime).ToList();
                var CPOItemACList = new List<CPOItemAC>();
                foreach (var cpo in cpoList)
                {
                    var cpoItems = _CPOItemContext.Fetch(x => x.CPOId == cpo.Id).ToList();
                    foreach (var item in cpoItems)
                    {
                        var cpoItemAC = new CPOItemAC
                        {
                            Flavour = item.ItemProfile.FlavourEn,
                            ItemName = item.ItemProfile.ItemNameEn,
                            ItemTotalCost = item.ItemTotalCost,
                            Quantity = item.Quantity,
                            SellPrice = item.SellPrice,
                            Type = item.ItemProfile.SystemParameter.ValueEn + " - " + item.ItemProfile.BaseUnit
                        };
                        CPOItemACList.Add(cpoItemAC);
                    }
                    var cpoPayment = _cpoPaymentContext.Fetch(x => x.CPOId == cpo.Id).ToList();
                    downPaymentAmount = 0;
                    foreach (var payment in cpoPayment)
                    {
                        if (payment.PaymentMode == PaymentMode.ReceiveFromCustomer)
                            downPaymentAmount = downPaymentAmount + payment.TotalAmount;
                        else
                            downPaymentAmount = downPaymentAmount - payment.TotalAmount;
                    }

                    CPODownPaymentAC cpoDownPay = new CPODownPaymentAC
                    {
                        CancelationDate = cpo.CancelationDate,
                        CollectingBranchId = cpo.CollectingBranchId,
                        CreditCustomer = cpo.CustomerProfile.IsCreditCustomer,
                        CollectingBranchName = cpo.CollectingBranch.Name,
                        CollectionDate = cpo.CollectionDate,
                        Comments = cpo.Comments,
                        CustomerId = cpo.CustomerId,
                        CustomerMobile = cpo.CustomerProfile.Mobile,
                        CustomerName = cpo.CustomerProfile.Name,
                        AmountLimit = cpo.CustomerProfile.AmountLimit,
                        BalanceAmount = cpo.CustomerProfile.BalanceAmount,
                        CustomerPOId = cpo.Id,
                        DownPaymentAmount = downPaymentAmount,
                        DueDate = cpo.DueDate,
                        InitiationBranchId = cpo.InitiationBranchId,
                        InitiationBranchName = cpo.InitiationBranch.Name,
                        InitiationDate = cpo.InitiationDate,
                        InitiatorId = cpo.InitiatorId,
                        InitiatorName = cpo.UserDetail.UserName,
                        IsCancel = cpo.IsCancel,
                        IsSPORequired = cpo.IsSPORequired,
                        IsCollected = cpo.IsCollected,
                        ModifiedBy = cpo.ModifiedBy,
                        PurchaseOrderNo = cpo.PurchaseOrderNo,
                        Total = cpo.TotalCPOAmount,
                        CPOItemAC = CPOItemACList
                    };
                    customerpoList.Add(cpoDownPay);
                }
                return customerpoList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for cancelling customer purchase order .
        /// </summary>
        /// <param name="CPOId">customer purchase order id</param>
        /// <param name="returnAmount"></param>
        /// <param name="userId"></param>
        public void CancelCustomerPO(int CPOId, decimal returnAmount, int userId)
        {
            try
            {
                if (returnAmount > 0)
                {
                    decimal creditPayment = 0M;
                    if (_customerPOContext.Fetch(x => x.Id == CPOId).Any())
                    {
                        var cpo = _customerPOContext.FirstOrDefault(x => x.Id == CPOId);
                        cpo.IsCancel = true;
                        cpo.CancelationDate = DateTime.UtcNow;
                        cpo.ModifiedDateTime = DateTime.UtcNow;
                        _customerPOContext.Update(cpo);
                        _customerPOContext.SaveChanges();

                        var paymentList = _cpoPaymentTypeContext.Fetch(x => x.CPOPayment.CPOId == CPOId && x.CPOPayment.PaymentMode == 0 && x.ParamType.ValueEn == StringConstants.PayCreditAccount).ToList();
                        foreach (var payment in paymentList)
                        {
                            creditPayment += payment.Amount;
                        }
                        if (creditPayment > 0)
                        {
                            var customer = _customerProfileContext.FirstOrDefault(x => x.Id == cpo.CustomerId);
                            customer.TransactionAmount -= creditPayment;
                            customer.ModifiedDateTime = DateTime.UtcNow;
                            _customerProfileContext.Update(customer);
                            _customerProfileContext.SaveChanges();
                        }
                        var voucherNum = VoucherNumberGenerator();
                        CPOPayment cpoPay = new CPOPayment
                        {
                            CustomerId = cpo.CustomerId,
                            CPOId = CPOId,
                            Comment = "",
                            CreatedDateTime = DateTime.UtcNow,
                            InitiatorId = userId,
                            PaymentMode = PaymentMode.PayToCustomer,
                            Purpose = Purpose.DownPayment,
                            TotalAmount = returnAmount,
                            VoucherNo = voucherNum,
                        };
                        _cpoPaymentContext.Add(cpoPay);
                        _cpoPaymentContext.SaveChanges();
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
        /// this method used for get purchase order by cpo id. -jj
        /// </summary>
        /// <param name="cpoid">customer purchase order id</param>
        /// <returns>object of CustomerPOAC</returns>
        public CustomerPOAC GetCustomerPurchaseOrderByCPOId(int cpoId)
        {
            decimal downPaymentAmount = 0;
            var cpoPayment = _cpoPaymentContext.Fetch(x => x.CPOId == cpoId).ToList();
            decimal posBillAmount = 0;
            foreach (var payment in cpoPayment)
            {
                if (payment.PaymentMode == PaymentMode.ReceiveFromCustomer)
                {
                    downPaymentAmount = downPaymentAmount + payment.TotalAmount;
                    posBillAmount = downPaymentAmount + payment.ExcessAmount;
                }
                else
                    downPaymentAmount = downPaymentAmount - payment.TotalAmount;
            }
            if (_customerPOContext.Fetch(x => x.Id == cpoId).Any())
            {
                var cpo = _customerPOContext.FirstOrDefault(x => x.Id == cpoId);
                var additionalcost = _CPOAdditionalCostContext.Fetch(x => x.CPOId == cpoId).ToList();
                var cpoItems = _CPOItemContext.Fetch(x => x.CPOId == cpoId).ToList();
                CustomerPOAC cpoAC = new CustomerPOAC();
                cpoAC.CancelationDate = cpo.CancelationDate;
                cpoAC.CollectingBranchId = cpo.CollectingBranchId;
                cpoAC.CollectingBranchName = cpo.CollectingBranch.Name;
                cpoAC.CollectionDate = cpo.CollectionDate;
                cpoAC.Comments = cpo.Comments;
                cpoAC.CPOAdditionalCost = additionalcost;
                cpoAC.CPOItem = cpoItems;
                cpoAC.Customer = cpo.CustomerProfile;
                cpoAC.CustomerId = cpo.CustomerId;
                cpoAC.CustomerMobile = cpo.CustomerProfile.Mobile;
                cpoAC.CustomerName = cpo.CustomerProfile.Name;
                cpoAC.CustomerPOId = cpo.Id;
                cpoAC.DueDate = cpo.DueDate;
                cpoAC.InitiationBranchId = cpo.InitiationBranchId;
                cpoAC.InitiationBranchName = cpo.InitiationBranch.Name;
                cpoAC.InitiationDate = cpo.InitiationDate;
                cpoAC.InitiatorId = cpo.InitiatorId;
                cpoAC.InitiatorName = cpo.UserDetail.UserName;
                cpoAC.IsCancel = cpo.IsCancel;
                cpoAC.IsSPORequired = cpo.IsSPORequired;
                cpoAC.PurchaseOrderNo = cpo.PurchaseOrderNo;
                cpoAC.IsCollected = cpo.IsCollected;
                cpoAC.ModifiedBy = cpo.ModifiedBy;
                cpoAC.ModifiedDate = cpo.ModifiedDate;
                cpoAC.DownPaymentAmount = downPaymentAmount;
                cpoAC.Total = cpo.TotalCPOAmount;
                cpoAC.POSBillAmount = posBillAmount;
                return cpoAC;
            }
            else
            {
                return null;
            }
        }


        /// <summary>
        /// this method is used for editing customer purchase order. - jj
        /// </summary>
        /// <param name="customerPO">object of CustomerPOAC</param>
        /// <param name="userName">Username of currently logged in user</param>
        /// <returns></returns>
        public void UpdateCustomerPO(CustomerPOAC customerPO, string userName)
        {
            if (_customerPOContext.Fetch(x => x.Id == customerPO.CustomerPOId).Any())
            {
                var cpo = _customerPOContext.FirstOrDefault(x => x.Id == customerPO.CustomerPOId);
                cpo.DueDate = customerPO.DueDate;
                cpo.CollectingBranchId = customerPO.CollectingBranchId;
                cpo.ModifiedDateTime = DateTime.UtcNow;
                _customerPOContext.Update(cpo);
                _customerPOContext.SaveChanges();
            }
        }


        public int UpdateCustomerPurchseOrderForPOS(CustomerPurchaseOrder customerPurchaseOrder)
        {
            try
            {
                var cpoObj = _customerPOContext.Fetch(x => x.PurchaseOrderNo == customerPurchaseOrder.PurchaseOrderNo).FirstOrDefault();
                cpoObj.IsCollected = customerPurchaseOrder.IsCollected;
                cpoObj.CollectionDate = DateTime.UtcNow;
                cpoObj.ModifiedDateTime = DateTime.UtcNow;
                _customerPOContext.Update(cpoObj);
                _customerPOContext.SaveChanges();
                return cpoObj.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int AddCpoBillMappingFromPos(CPOBill cpoBill)
        {
            try
            {
                cpoBill.CreatedDateTime = DateTime.UtcNow;
                var cpoObj = _cpoBillContext.Add(cpoBill);
                _cpoBillContext.SaveChanges();
                return cpoObj.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion


        #region Private Methods

        /// <summary>
        /// This method used for insert into account entroes table.- JJ
        /// </summary>
        /// <param name="customerPO"></param>
        /// <param name="paymentMode"></param>
        /// <param name="totalAmount"></param>
        private void InsertIntoAccountEntries(CustomerPOAC customerPO, PaymentMode paymentMode, decimal totalAmount)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();

                if (paymentMode.Equals(PaymentMode.PayToCustomer))
                {
                    if (totalAmount > 0)
                    {
                        var ledgersForCash = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CashInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        if (ledgersForCash != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCash.Id, TransactionDate = DateTime.UtcNow, Credit = totalAmount, Debit = 0, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = totalAmount, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                        }
                    }
                }
                else
                {
                    if (customerPO.CPOPaymentAC.Cash != 0)
                    {
                        var ledgersForCash = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CashInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        if (ledgersForCash != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCash.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = customerPO.CPOPaymentAC.Cash, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = customerPO.CPOPaymentAC.Cash, Debit = 0, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                        }
                    }
                    if (customerPO.CPOPaymentAC.CouponAmount != 0)
                    {
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        var ledgersForExpense = _iAccountingRepository.GetAccountLedgerByName(StringConstants.Expenses, Convert.ToInt32(customerPO.CollectingBranchId));
                        if (ledgersForExpense != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForExpense.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = customerPO.CPOPaymentAC.CouponAmount, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = customerPO.CPOPaymentAC.CouponAmount, Debit = 0, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                        }
                    }
                    if (customerPO.CPOPaymentAC.CreditAccountAmount != 0)
                    {
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        var ledgersForCustomer = _iAccountingRepository.GetAccountLedgerByCustomer(customerPO.CustomerId);
                        if (ledgersForCustomer != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCustomer.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = customerPO.CPOPaymentAC.CreditAccountAmount, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = customerPO.CPOPaymentAC.CreditAccountAmount, Debit = 0, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                        }
                    }
                    if (customerPO.CPOPaymentAC.CreditCardAmount != 0)
                    {
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        var ledgersForBank = _iAccountingRepository.GetAccountLedgerByName(StringConstants.Bank, Convert.ToInt32(customerPO.CollectingBranchId));
                        if (ledgersForBank != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForBank.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = customerPO.CPOPaymentAC.CreditCardAmount, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = customerPO.CPOPaymentAC.CreditCardAmount, Debit = 0, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                        }
                    }
                    if (customerPO.CPOPaymentAC.DebitCardAmount != 0)
                    {
                        var ledgersForStockInHand = _iAccountingRepository.GetAccountLedgerByName(StringConstants.StockInHand, Convert.ToInt32(customerPO.CollectingBranchId));
                        var ledgersForBank = _iAccountingRepository.GetAccountLedgerByName(StringConstants.Bank, Convert.ToInt32(customerPO.CollectingBranchId));
                        if (ledgersForBank != null && ledgersForStockInHand != null)
                        {
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForBank.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = customerPO.CPOPaymentAC.DebitCardAmount, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                            listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForStockInHand.Id, TransactionDate = DateTime.UtcNow, Credit = customerPO.CPOPaymentAC.DebitCardAmount, Debit = 0, ActivityName = StringConstants.CPOPayment, CreatedDateTime = DateTime.UtcNow });
                        }
                    }
                }

                if (listOfDoubleEntry.Any())
                    _iAccountingRepository.AddAccountingEntries(listOfDoubleEntry);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to delete item of cpo - JJ
        /// </summary>
        /// <param name="CustomerPOId">id of cpo</param>
        /// <returns>null</returns>
        private void DeleteItems(int CustomerPOId)
        {
            try
            {
                if (_CPOItemContext.Fetch(x => x.CPOId == CustomerPOId).Any())
                {
                    var items = _CPOItemContext.Fetch(x => x.CPOId == CustomerPOId).ToList();
                    foreach (var item in items)
                    {
                        _CPOItemContext.Delete(item.Id);
                        _CPOItemContext.SaveChanges();
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
        /// This method is used to delete additional cost of cpo - JJ
        /// </summary>
        /// <param name="CustomerPOId">id of cpo</param>
        /// <returns>null</returns>
        private void DeleteAdditionalCost(int CustomerPOId)
        {
            try
            {
                if (_CPOAdditionalCostContext.Fetch(x => x.CPOId == CustomerPOId).Any())
                {
                    var services = _CPOAdditionalCostContext.Fetch(x => x.CPOId == CustomerPOId).ToList();
                    foreach (var service in services)
                    {
                        _CPOAdditionalCostContext.Delete(service.Id);
                        _CPOAdditionalCostContext.SaveChanges();
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
        /// This method is used to add item and additional cost of cpo - JJ
        /// </summary>
        /// <param name="customerPO">object of CustomerPOAC</param>
        /// <param name="BranchId"></param>
        /// <returns>null</returns>
        private void AddPOItemsAdditionalCost(CustomerPOAC customerPO, int? BranchId)
        {
            try
            {
                foreach (var item in customerPO.CPOItem)
                {
                    CPOItem cpoitem = new CPOItem()
                       {
                           Barcode = item.Barcode,
                           CostPrice = item.CostPrice,
                           CPOId = customerPO.CustomerPOId,
                           CreatedDateTime = DateTime.UtcNow,
                           ItemId = item.ItemId,
                           Quantity = item.Quantity,
                           SellPrice = item.SellPrice,
                           ItemTotalCost = item.ItemTotalCost,
                       };
                    _CPOItemContext.Add(cpoitem);
                    _CPOItemContext.SaveChanges();
                }

                foreach (var cost in customerPO.CPOAdditionalCost)
                {
                    CPOAdditionalCost additionalCost = new CPOAdditionalCost()
                    {
                        AdditionalServiceId = cost.AdditionalServiceId,
                        Amount = cost.Amount,
                        CPOId = customerPO.CustomerPOId,
                        CreatedDateTime = DateTime.UtcNow
                    };
                    _CPOAdditionalCostContext.Add(additionalCost);
                    _CPOAdditionalCostContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _itemProfileContext.Dispose();
                _customerProfileContext.Dispose();
                _CPOAdditionalCostContext.Dispose();
                _userDetailContext.Dispose();
                _CPOItemContext.Dispose();
                _companyConfigurationContext.Dispose();
                _cpoPaymentContext.Dispose();
                _cpoDownPaymentContext.Dispose();
                _cpoPaymentTypeContext.Dispose();
                _customerPOContext.Dispose();
                _cpoBillContext.Dispose();
                _paramTypeContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }
        #endregion
    }
}

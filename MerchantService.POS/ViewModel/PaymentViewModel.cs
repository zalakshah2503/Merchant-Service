using GalaSoft.MvvmLight.CommandWpf;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using MerchantService.POS.Utility;
using MerchantService.DomainModel.Models.POS;
using Newtonsoft.Json;
using System.Net.Http;
using System.Collections.ObjectModel;
using MerchantService.Repository.ApplicationClasses.Item;
using System.Windows;
using MerchantService.Utility.Constants;
using System.Text.RegularExpressions;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.POS.Repository;
using MerchantService.Core.HttpClients;
namespace MerchantService.POS.ViewModel
{
    public class PaymentViewModel : INotifyPropertyChanged
    {
        private PaymentWindow _paymentWindow;
        private POSWindow _posWindow;
        private ObservableCollection<POSItemDetail> _itemProfileCollection = new ObservableCollection<POSItemDetail>();
        private CustomerInformation customerInfo;
        IPosRepository _posRepository;
        decimal discount;
        PrintParameters printParameters;
        public PaymentViewModel(PaymentWindow paymentWindow)
        {
            _paymentWindow = paymentWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            POSWindowViewModel pos = new POSWindowViewModel();
            if (String.IsNullOrEmpty(SettingHelpers.TotalAmount))
            {
                SettingHelpers.TotalAmount = "0";
            }
            TotalAmount = Convert.ToDecimal(SettingHelpers.TotalAmount.Replace(SettingHelpers.CurrentCultureInfo.NumberFormat.CurrencySymbol, ""));
            if (SettingHelpers.IsCustomerPO)
            {
                SetPaymentModeAmountForCPO();
            }
            if (_posWindow.ViewModel.CustomerInformation.ReturnBill != null)
            {
                TotalAmount = TotalAmount - Convert.ToDecimal(_posWindow.ViewModel.CustomerInformation.ReturnBill.SubstituteItemsAmount);
                SetValueForReturnBillPayment();
            }
        }


        public PaymentViewModel(PaymentWindow paymentWindow, POSWindow posWindow)
        {
            _paymentWindow = paymentWindow;
            _posWindow = posWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            SettingHelpers.TotalAmount = _posWindow.ViewModel.BillSummary.OrderAmount.ToString();
            _itemProfileCollection = _posWindow.ViewModel.ItemProfileCollectionNew;
            TotalAmount = Convert.ToDecimal(SettingHelpers.TotalAmount.Replace(SettingHelpers.CurrentCultureInfo.NumberFormat.CurrencySymbol, ""));
            if (SettingHelpers.IsCustomerPO)
            {
                SettingHelpers.TotalAmount = (_posWindow.ViewModel.BillSummary.OrderAmount
                    + (_posWindow.ViewModel.BillSummary.AdditionalAmount == null ? 0
                    : _posWindow.ViewModel.BillSummary.AdditionalAmount.Value)).ToString();
                SetPaymentModeAmountForCPO();
                TotalAmount = Convert.ToDecimal(SettingHelpers.TotalAmount.Replace(SettingHelpers.CurrentCultureInfo.NumberFormat.CurrencySymbol, ""));
            }
            if (_posWindow.ViewModel.CustomerInformation.ReturnBill != null)
            {
                TotalAmount = TotalAmount - _posWindow.ViewModel.CustomerInformation.ReturnBill.SubstituteItemsAmount;
                SetValueForReturnBillPayment();
            }
        }

        #region Property

        private bool _isBusy;

        public bool IsBusy
        {
            get { return _isBusy; }
            set
            {
                _isBusy = value;
                OnPropertyChanged("IsBusy");
            }
        }


        private decimal _totalAmount;
        public decimal TotalAmount
        {
            get { return _totalAmount; }
            set
            {
                if (value != _totalAmount)
                {
                    _totalAmount = value;
                    OnPropertyChanged("TotalAmount");
                }
            }
        }

        private string _cashAmount;
        public string CashAmount
        {
            get { return _cashAmount; }
            set
            {
                if (value != _cashAmount)
                {
                    if (CheckValidNumber(value))
                    {
                        _cashAmount = value;
                        OnPropertyChanged("CashAmount");
                        CashAmountCalculate(value);
                    }
                }
            }
        }

        private string _debitCardAmount;
        public string DebitCardAmount
        {
            get { return _debitCardAmount; }
            set
            {
                if (value != _debitCardAmount)
                {
                    if (CheckValidNumber(value))
                    {
                        _debitCardAmount = value;
                        OnPropertyChanged("DebitCardAmount");
                        CashAmountCalculate(value);
                    }
                }
            }
        }
        private string _creditCardAmount;
        public string CreditCardAmount
        {
            get { return _creditCardAmount; }
            set
            {
                if (value != _creditCardAmount)
                {
                    if (CheckValidNumber(value))
                    {
                        _creditCardAmount = value;
                        OnPropertyChanged("CreditCardAmount");
                        CashAmountCalculate(value);
                    }
                }
            }
        }

        private string _couponAmount;
        public string CouponAmount
        {
            get { return _couponAmount; }
            set
            {
                if (value != _couponAmount)
                {
                    if (CheckValidNumber(value))
                    {
                        _couponAmount = value;
                        OnPropertyChanged("CouponAmount");
                        CashAmountCalculate(value);
                    }
                }
            }
        }

        private string _chequeAmount;
        public string chequeAmount
        {
            get { return _chequeAmount; }
            set
            {
                if (value != _chequeAmount)
                {
                    if (CheckValidNumber(value))
                    {
                        _chequeAmount = value;
                        OnPropertyChanged("chequeAmount");
                        CashAmountCalculate(value);
                    }
                }
            }
        }
        private string _creditAccountAmount;
        public string CreditAccountAmount
        {
            get { return _creditAccountAmount; }
            set
            {
                if (CheckValidNumber(value))
                {
                    if (CheckIdValidAmountForPostPayCustmer(value))
                    {
                        if (value != _creditAccountAmount)
                        {
                            _creditAccountAmount = value;
                            OnPropertyChanged("CreditAccountAmount");
                            CashAmountCalculate(value);
                        }
                    }
                }
            }
        }

        private decimal _remainingAmount;
        public decimal RemainingAmount
        {
            get { return _remainingAmount; }
            set
            {
                if (value != _remainingAmount)
                {
                    _remainingAmount = value;
                    OnPropertyChanged("RemainingAmount");
                }
            }
        }

        private decimal? _paidAmount;
        public decimal? PaidAmount
        {
            get { return _paidAmount; }
            set
            {
                if (value != _paidAmount)
                {
                    _paidAmount = value;
                    OnPropertyChanged("PaidAmount");
                }
            }
        }

        private decimal? _differenceAmount;
        public decimal? DifferenceAmount
        {
            get { return _differenceAmount; }
            set
            {
                if (value != _differenceAmount)
                {
                    _differenceAmount = value;
                    OnPropertyChanged("DifferenceAmount");

                }
            }
        }


        private string _debitCardReceiptNo;
        public string DebitCardReceiptNo
        {
            get { return _debitCardReceiptNo; }
            set
            {
                if (value != _debitCardReceiptNo)
                {
                    _debitCardReceiptNo = value;
                    OnPropertyChanged("DebitCardReceiptNo");

                }
            }
        }

        private string _creditCardReceiptNumber;
        public string CreditCardReceiptNumber
        {
            get { return _creditCardReceiptNumber; }
            set
            {
                if (value != _creditCardReceiptNumber)
                {
                    _creditCardReceiptNumber = value;
                    OnPropertyChanged("CreditCardReceiptNumber");

                }
            }
        }
        private string _couponNo;
        public string CouponNo
        {
            get { return _couponNo; }
            set
            {
                if (value != _couponNo)
                {
                    _couponNo = value;
                    OnPropertyChanged("CouponNo");

                }
            }
        }

        private string _chequeNo;
        public string ChequeNo
        {
            get { return _chequeNo; }
            set
            {
                if (value != _chequeNo)
                {
                    _chequeNo = value;
                    OnPropertyChanged("ChequeNo");

                }
            }
        }


        private string _downPaymentAmount;
        public string DownPaymentAmount
        {
            get { return _downPaymentAmount; }
            set
            {
                if (value != _downPaymentAmount)
                {
                    _downPaymentAmount = value;
                    OnPropertyChanged("DownPaymentAmount");

                }
            }
        }


        private string _additionalCost;
        public string AdditionalCost
        {
            get { return _additionalCost; }
            set
            {
                if (value != _additionalCost)
                {
                    _additionalCost = value;
                    OnPropertyChanged("AdditionalCost");

                }
            }
        }
        #endregion

        #region Commonad

        #region CashPaymentMode Command

        public ICommand CashPaymentMode
        {
            get
            {
                return new RelayCommand(() => this.CashPayment());
            }
        }

        public void CashPayment()
        {
            _paymentWindow.txtCash.Focus();
            _paymentWindow.txtCash.SelectAll();
        }

        #endregion CashPaymentMode Command

        #region DebitCardPaymentMode Command

        public ICommand DebitCardPaymentMode
        {
            get
            {
                return new RelayCommand(() => this.DebitCardPayment());
            }
        }

        public void DebitCardPayment()
        {
            _paymentWindow.txtDebitCard.Focus();
        }

        #endregion DebitCardPaymentMode Command

        #region CreditCardPaymentMode Command

        public ICommand CreditCardPaymentMode
        {
            get
            {
                return new RelayCommand(() => this.CreditCardPayment());
            }
        }

        public void CreditCardPayment()
        {
            _paymentWindow.txtCreditCard.Focus();
        }

        #endregion CreditCardPaymentMode Command

        #region CouponPaymentMode Command

        public ICommand CouponPaymentMode
        {
            get
            {
                return new RelayCommand(() => this.CouponPayment());
            }
        }

        public void CouponPayment()
        {
            _paymentWindow.txtCoupon.Focus();
        }

        #endregion CouponPaymentMode Command

        #region ChequePaymentMode Command

        public ICommand ChequePaymentMode
        {
            get
            {
                return new RelayCommand(() => this.ChequePayment());
            }
        }

        public void ChequePayment()
        {
            _paymentWindow.txtCheque.Focus();
        }

        #endregion ChequePaymentMode Command

        #region CreditAccountPaymentMode Command

        public ICommand CreditAccountPaymentMode
        {
            get
            {
                return new RelayCommand(() => this.CreditAccountPayment());
            }
        }

        public void CreditAccountPayment()
        {
            _paymentWindow.txtCreditAcocount.Focus();
        }

        #endregion CreditAccountPaymentMode Command

        #region DebitCardReceiptCommand Command

        public ICommand DebitCardReceiptCommand
        {
            get
            {
                return new RelayCommand(() => this.DebitCardReceiptNumber());
            }
        }

        public void DebitCardReceiptNumber()
        {
            _paymentWindow.txtDebitCardReceipt.Focus();
        }

        #endregion DebitCardReceiptCommand Command

        #region CreditCardReceiptNo Command

        public ICommand CreditCardReceiptNo
        {
            get
            {
                return new RelayCommand(() => this.CreditCardNo());
            }
        }

        public void CreditCardNo()
        {
            _paymentWindow.txtCreditCardReceipt.Focus();
        }

        #endregion CreditCardReceiptNo Command

        #region CouponReceiptNo Command

        public ICommand CouponReceiptNo
        {
            get
            {
                return new RelayCommand(() => this.CouponNumber());
            }
        }

        public void CouponNumber()
        {
            _paymentWindow.txtCouponNo.Focus();
        }

        #endregion CouponReceiptNo Command

        #region ChequeReceiptNo Command

        public ICommand ChequeReceiptNo
        {
            get
            {
                return new RelayCommand(() => this.ChequetNo());
            }
        }

        public void ChequetNo()
        {
            _paymentWindow.txtChequeNo.Focus();
        }

        #endregion ChequeReceiptNo Command

        #region SubmitCommand Command

        public ICommand SubmitCommand
        {
            get
            {
                return new RelayCommand(() => this.SubmitPayment());
            }
        }

        public void SubmitPayment()
        {
            if (CashAmount != null || DebitCardAmount != null || CreditCardAmount != null || CouponAmount != null || chequeAmount != null || CreditAccountAmount != null || DownPaymentAmount != null)
            {
                decimal totalPaidAmount = Convert.ToDecimal(CashAmount) + Convert.ToDecimal(DebitCardAmount) + Convert.ToDecimal(CreditCardAmount) + Convert.ToDecimal(CouponAmount) + Convert.ToDecimal(chequeAmount) + Convert.ToDecimal(CreditAccountAmount) + Convert.ToDecimal(DownPaymentAmount) + Convert.ToDecimal(AdditionalCost);
                if (Convert.ToDecimal(totalPaidAmount) < TotalAmount)
                {
                    MessageBox.Show(StringConstants.PayAdtioanlAmout + DifferenceAmount, "Invalid Payment Amount", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }
                if (!String.IsNullOrEmpty(CreditAccountAmount))
                {
                    if (_posWindow.ViewModel.CustomerInformation.Customer != null && _posWindow.ViewModel.CustomerInformation.Customer.IsCreditCustomer)
                    {
                        decimal remainingCredit = 0;
                        if (_posWindow.ViewModel.CustomerInformation.Customer.AmountLimit != 0)
                        {
                            remainingCredit = (_posWindow.ViewModel.CustomerInformation.Customer.AmountLimit) - (_posWindow.ViewModel.CustomerInformation.Customer.TransactionAmount);
                            if (remainingCredit < Convert.ToDecimal(CreditAccountAmount))
                            {
                                MessageBox.Show(StringConstants.CreditAmoutLimitOver, "Credit Limit", MessageBoxButton.OK, MessageBoxImage.Warning);
                                return;
                            }
                        }
                        else
                        {
                            remainingCredit = (_posWindow.ViewModel.CustomerInformation.Customer.BalanceAmount) - (_posWindow.ViewModel.CustomerInformation.Customer.TransactionAmount);
                            if (remainingCredit < Convert.ToDecimal(CreditAccountAmount))
                            {
                                MessageBox.Show(StringConstants.CreditBalanceLimitOver, "Credit Limit", MessageBoxButton.OK, MessageBoxImage.Warning);
                                return;
                            }
                        }
                    }
                }
                IsBusy = true;
                customerInfo = _posWindow.ViewModel.CustomerInformation;
                discount = _posWindow.ViewModel.BillSummary.Discount;
                BackgroundWorker bgPaymentWorker = new BackgroundWorker();
                bgPaymentWorker.DoWork += bgPaymentWorker_DoWork;
                bgPaymentWorker.RunWorkerCompleted += bgPaymentWorker_RunWorkerCompleted;
                bgPaymentWorker.RunWorkerAsync();
            }
        }



        #endregion SubmitCommand Command

        #region CanelCommand Command

        public ICommand CanelCommand
        {
            get
            {
                return new RelayCommand(() => this.CancelWidnow());
            }
        }

        public void CancelWidnow()
        {
            _paymentWindow.DialogResult = false;
            _paymentWindow.Close();
        }

        #endregion CanelCommand Command


        #region CashAmountPaid (Enter on Cash textbox) Command
        private void CashAmountCalculate(string cashAmt)
        {
            if (CheckValidNumber(cashAmt))
            {
                decimal totalPaidAmount = Convert.ToDecimal(CashAmount) + Convert.ToDecimal(DebitCardAmount) + Convert.ToDecimal(CreditCardAmount) + Convert.ToDecimal(CouponAmount) + Convert.ToDecimal(chequeAmount) + Convert.ToDecimal(CreditAccountAmount) + Convert.ToDecimal(DownPaymentAmount);
                PaidAmount = Convert.ToDecimal(totalPaidAmount);
                DifferenceAmount = TotalAmount - Convert.ToDecimal(totalPaidAmount);
                RemainingAmount = 0;
                if (Convert.ToDecimal(totalPaidAmount) > TotalAmount)
                {
                    RemainingAmount = Convert.ToDecimal(totalPaidAmount) - TotalAmount;
                    DifferenceAmount = 0;
                }
            }
            else
            {
                MessageBox.Show(StringConstants.ValidAmount, "Invalid Amount", MessageBoxButton.OK);
            }
        }

        #endregion CashAmountPaid Command
        #endregion

        #region INotifyPropertyChanged implementation
        public void OnPropertyChanged(string propertyName)
        {
            this.OnPropertyChanged(new PropertyChangedEventArgs(propertyName));
        }

        protected virtual void OnPropertyChanged(PropertyChangedEventArgs args)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, args);
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        #endregion INotifyPropertyChanged implementation

        #region Private Method
        private void SetPaymentModeAmountForCPO()
        {
            DownPaymentAmount = _posWindow.ViewModel.BillSummary.DownPayment.ToString();
            TotalAmount = Convert.ToDecimal(SettingHelpers.TotalAmount.Replace(SettingHelpers.CurrentCultureInfo.NumberFormat.CurrencySymbol, ""));
            PaidAmount = _posWindow.ViewModel.BillSummary.DownPayment;
            DifferenceAmount = TotalAmount > Convert.ToDecimal(DownPaymentAmount) ? TotalAmount - Convert.ToDecimal(DownPaymentAmount) : 0;
            AdditionalCost = _posWindow.ViewModel.BillSummary.AdditionalAmount == null ? "0" : _posWindow.ViewModel.BillSummary.AdditionalAmount.ToString();
            RemainingAmount = Convert.ToDecimal(DownPaymentAmount) > TotalAmount ? Convert.ToDecimal(DownPaymentAmount) - TotalAmount : 0;
            if (_posWindow.ViewModel.BillSummary.AdditionalAmount == null || _posWindow.ViewModel.BillSummary.AdditionalAmount <= 0)
            {
                _paymentWindow.lblAdditionalCost.Visibility = Visibility.Hidden;
                _paymentWindow.txtAdditionalCode.Visibility = Visibility.Hidden;
            }
            else
            {
                _paymentWindow.lblAdditionalCost.Visibility = Visibility.Visible;
                _paymentWindow.txtAdditionalCode.Visibility = Visibility.Visible;
            }
        }

        private void SetValueForReturnBillPayment()
        {
            try
            {
                decimal totalReturnAmount = _posWindow.ViewModel.CustomerInformation.ReturnBill.ReturnedCash + _posWindow.ViewModel.CustomerInformation.ReturnBill.SubstituteItemsAmount;
                CashAmount = _posWindow.ViewModel.CustomerInformation.ReturnBill.ReturnedCash.ToString();
                PaidAmount = Convert.ToDecimal(_posWindow.ViewModel.CustomerInformation.ReturnBill.ReturnedCash);
            }
            catch (Exception)
            {

                throw;
            }
        }
        private void UpdateReuturnBill()
        {
            try
            {
                HttpClients httpClients = new HttpClients();
                if (customerInfo.ReturnBill != null)
                {
                    POSReturnBill posReuturnObj = customerInfo.ReturnBill;
                    posReuturnObj.IsProcessed = true;
                    posReuturnObj.ProcessingBranchID = SettingHelpers.CurrentBranchId;
                    posReuturnObj.ProcessorID = SettingHelpers.CurrentUserId;
                    var jsonString = JsonConvert.SerializeObject(posReuturnObj);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    var response = httpClients.PostAsync("api/returnbill/updateposreturnbillforpos", httpContent);
                    if (response.IsSuccessStatusCode)
                    {
                        var result = response.Content.ReadAsAsync<bool>().Result;
                        POSSession posSession = new POSSession();
                        posSession.Id = SettingHelpers.CurrentPosSessionId;
                        posSession.ReturnedBill = RemainingAmount;
                        string jsonPosSession = JsonConvert.SerializeObject(posSession);
                        var httpContentPosSession = new StringContent(jsonPosSession, Encoding.UTF8, "application/json");
                        var reponsePosSession = httpClients.PostAsync("api/possession/updatepossessionforreturnedbillamount", httpContentPosSession);
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion

        #region Private Method Realted to Database
        /// <summary>
        /// This method is used for Insert PosBill related data at the time of Payment.
        /// </summary>
        private void InsertPOSBillData()
        {
            try
            {
                var accountingEntries = new List<DomainModel.Models.Accounting.DoubleEntry>();
                printParameters = new PrintParameters();
                //Get the total bill count of current date.
                string billNumber = ""; //SettingHelpers.CompanyConfigruationObject.InvoiceNo + DateTime.UtcNow.ToString("dd/mm/yyyy") + "0001";
                var billCountResponse = _posRepository.GetTotalBillDataByBillDate();
                if (billCountResponse < 9)
                {
                    billNumber = SettingHelpers.CompanyConfigruationObject.InvoiceNo + DateTime.UtcNow.ToString("dd/MM/yy") + "000" + (billCountResponse + 1);
                }
                else if (billCountResponse < 99)
                {
                    billNumber = SettingHelpers.CompanyConfigruationObject.InvoiceNo + DateTime.UtcNow.ToString("dd/MM/yy") + "00" + (billCountResponse + 1);
                }
                else if (billCountResponse < 999)
                {
                    billNumber = SettingHelpers.CompanyConfigruationObject.InvoiceNo + DateTime.UtcNow.ToString("dd/MM/yy") + "0" + (billCountResponse + 1);
                }
                else if (billCountResponse < 9999)
                {
                    billNumber = SettingHelpers.CompanyConfigruationObject.InvoiceNo + DateTime.UtcNow.ToString("dd/MM/yy") + (billCountResponse + 1);
                }
                else
                {
                    billNumber = SettingHelpers.CompanyConfigruationObject.InvoiceNo + DateTime.UtcNow.ToString("dd/MM/yy") + (billCountResponse + 1);
                }
                POSBill posBill = new POSBill();
                posBill.POSSessionID = SettingHelpers.CurrentPosSessionId;
                posBill.UserID = SettingHelpers.CurrentUserId;
                posBill.BranchID = SettingHelpers.CurrentBranchId;
                if (customerInfo == null || customerInfo.Customer.Id == 0 || customerInfo.Customer.Id == 1)
                {
                    printParameters.IsCustomer = false;
                    posBill.CustomerID = 1;
                }
                else
                {
                    posBill.CustomerID = customerInfo.Customer.Id;
                    printParameters.IsCustomer = true;
                }
                posBill.BillDate = DateTime.UtcNow;
                posBill.TotalAmount = TotalAmount;
                posBill.BillNo = billNumber.Replace("/", "").Replace("-", "");
                posBill.CreatedDateTime = DateTime.UtcNow.Date;

                var billDetail = _posRepository.InsertPosBillData(posBill);
                if (billDetail != null)
                {
                    accountingEntries.Add(new DoubleEntry
                    {
                        Description = "POS Sale Entry Bill No:" + posBill.BillNo,
                        LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.Sales).Id,
                        ActivityName = StringConstants.PosSale,
                        Debit = 0,
                        Credit = TotalAmount + discount,
                        CreatedDateTime = DateTime.UtcNow,
                        TransactionDate = DateTime.UtcNow
                    });
                    _posRepository.InsertPosBillItemsData(_itemProfileCollection.ToList(), billDetail.Id);
                    if (!String.IsNullOrEmpty(CashAmount))
                    {
                        accountingEntries.Add(new DoubleEntry
                        {
                            Description = "POS Sale by cash Entry Bill No:" + posBill.BillNo,
                            LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.CashInHand).Id,
                            ActivityName = StringConstants.PosSale,
                            Debit = Convert.ToDecimal(CashAmount),
                            Credit = 0,
                            CreatedDateTime = DateTime.UtcNow,
                            TransactionDate = DateTime.UtcNow
                        });
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.Cash, string.Empty, Convert.ToDecimal(CashAmount));
                    }
                    if (!String.IsNullOrEmpty(DebitCardAmount))
                    {
                        accountingEntries.Add(new DoubleEntry
                        {
                            Description = "POS Sale by Debit Card Entry Bill No:" + posBill.BillNo,
                            LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.Bank).Id,
                            ActivityName = StringConstants.PosSale,
                            Debit = Convert.ToDecimal(DebitCardAmount),
                            Credit = 0,
                            CreatedDateTime = DateTime.UtcNow,
                            TransactionDate = DateTime.UtcNow
                        });
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.DebitCard, DebitCardReceiptNo, Convert.ToDecimal(DebitCardAmount));
                    }
                    if (!String.IsNullOrEmpty(CreditCardAmount))
                    {
                        accountingEntries.Add(new DoubleEntry
                        {
                            Description = "POS Sale by Credit Card Entry Bill No:" + posBill.BillNo,
                            LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.Bank).Id,
                            ActivityName = StringConstants.PosSale,
                            Debit = Convert.ToDecimal(CreditCardAmount),
                            Credit = 0,
                            CreatedDateTime = DateTime.UtcNow,
                            TransactionDate = DateTime.UtcNow
                        });
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.CreditCard, CreditCardReceiptNumber, Convert.ToDecimal(CreditCardAmount));
                    }
                    if (!String.IsNullOrEmpty(CouponAmount))
                    {
                        accountingEntries.Add(new DoubleEntry
                        {
                            Description = "POS Sale by Coupan Entry Bill No:" + posBill.BillNo,
                            LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.Expenses).Id,
                            ActivityName = StringConstants.PosSale,
                            Debit = Convert.ToDecimal(CouponAmount),
                            Credit = 0,
                            CreatedDateTime = DateTime.UtcNow,
                            TransactionDate = DateTime.UtcNow
                        });
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.Coupon, CouponNo, Convert.ToDecimal(CouponAmount));
                    }
                    if (!String.IsNullOrEmpty(chequeAmount))
                    {
                        accountingEntries.Add(new DoubleEntry
                        {
                            Description = "POS Sale by Cheque Entry Bill No:" + posBill.BillNo,
                            LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.Bank).Id,
                            ActivityName = StringConstants.PosSale,
                            Debit = Convert.ToDecimal(chequeAmount),
                            Credit = 0,
                            CreatedDateTime = DateTime.UtcNow,
                            TransactionDate = DateTime.UtcNow
                        });
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.Cheque, ChequeNo, Convert.ToDecimal(chequeAmount));
                    }
                    if (!String.IsNullOrEmpty(CreditAccountAmount))
                    {
                        //TODO: Customer Ledger
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.CreditAccount, string.Empty, Convert.ToDecimal(CreditAccountAmount));
                    }
                    if (!String.IsNullOrEmpty(DownPaymentAmount))
                    {
                        InsertPosBillPaymentData(billDetail.Id, POSBillPaymentType.DownPayment, string.Empty, Convert.ToDecimal(DownPaymentAmount));
                    }

                    //If Bill process for Customer PO then update Customer PO is collected in CustomerPruchaseOrder table.
                    if (SettingHelpers.IsCustomerPO)
                    {
                        //update CPO bill
                        var cpoObj = new CustomerPurchaseOrder
                        {
                            PurchaseOrderNo = customerInfo.CPO.PurchaseOrderNo,
                            IsCollected = true
                        };
                        var httpClient = new HttpClients();
                        var jsonCPO = JsonConvert.SerializeObject(cpoObj);
                        var httpContentCpo = new StringContent(jsonCPO, Encoding.UTF8, "application/json");
                        var responseCustomerPO = httpClient.PostAsync("api/customerpo/updatecustomerpurchseorderforpos", httpContentCpo);
                        if (responseCustomerPO.IsSuccessStatusCode)
                        {
                            var resultCpo = responseCustomerPO.Content.ReadAsAsync<int>().Result;
                            //add CPO Bill mapping
                            var cpoBill = new CPOBill();
                            cpoBill.CPOId = resultCpo;
                            cpoBill.POSBillId = billDetail.Id;

                            jsonCPO = JsonConvert.SerializeObject(cpoBill);
                            httpContentCpo = new StringContent(jsonCPO, Encoding.UTF8, "application/json");

                            var responseCpoBill = httpClient.PostAsync("api/customerpo/addcpobillforpos", httpContentCpo);
                            if (responseCpoBill.IsSuccessStatusCode)
                            {
                                resultCpo = responseCpoBill.Content.ReadAsAsync<int>().Result;
                            }
                        }
                        printParameters.IsCpo = true;
                        printParameters.DownPayment = DownPaymentAmount;
                        printParameters.AdditionalCost = AdditionalCost;
                        printParameters.CpoNumber = cpoObj.PurchaseOrderNo;
                    }
                    // if bill process for Return Bill then updat the ReturnBill table for process successfully.
                    if (customerInfo.ReturnBill != null)
                    {
                        UpdateReuturnBill();
                        printParameters.IsReturnBill = true;
                        printParameters.ReturnBillNo = customerInfo.ReturnBill.ReturnedBillNo;
                        printParameters.Substitute = customerInfo.ReturnBill.SubstituteItemsAmount;
                        printParameters.ReturnAmount = customerInfo.ReturnBill.ReturnedCash;

                        if (RemainingAmount != 0)
                        {
                            accountingEntries.Add(new DoubleEntry
                            {
                                Description = "POS Sale cash return Bill No:" + customerInfo.ReturnBill.ReturnedBillNo,
                                LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.CashInHand).Id,
                                ActivityName = StringConstants.PosSale,
                                Debit = 0,
                                Credit = RemainingAmount,
                                CreatedDateTime = DateTime.UtcNow,
                                TransactionDate = DateTime.UtcNow
                            });
                        }
                    }
                }
                if (discount > 0)
                {
                    accountingEntries.Add(new DoubleEntry
                    {
                        Description = "POS Sale Discount Bill No:" + printParameters.InvoiceNo,
                        LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.Expenses).Id,
                        ActivityName = StringConstants.PosSale,
                        Debit = discount,
                        Credit = 0,
                        CreatedDateTime = DateTime.UtcNow,
                        TransactionDate = DateTime.UtcNow
                    });
                }

                #region "Set Print Parameters"
                printParameters.Tax = 0;
                printParameters.Cash = PaidAmount.Value;
                printParameters.CashReturn = RemainingAmount;
                printParameters.Customer = customerInfo.Customer;
                printParameters.Items = _itemProfileCollection.ToList();
                printParameters.TotalQuantity = _itemProfileCollection.Sum(x => x.ItemQuantity);
                printParameters.TotalAmount = posBill.TotalAmount + printParameters.Substitute;
                printParameters.Discount = discount;
                printParameters.InvoiceNo = posBill.BillNo;
                printParameters.SDateTime = DateTime.UtcNow.ToString("dd-MM-yy hh:mm:ss");
                #endregion

                _posRepository.AddAccountingEntries(accountingEntries);
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void GenerateOverQuantityIncidentPos()
        {
            if (_posWindow.ViewModel.PosOverQuantityIncidentList != null && _posWindow.ViewModel.PosOverQuantityIncidentList.Any())
            {
                foreach (var posIncidentReport in _posWindow.ViewModel.PosOverQuantityIncidentList)
                {
                    var finalItem = _itemProfileCollection.Where(x => x.ItemId == posIncidentReport.ItemId);
                    if (finalItem.Any())
                    {
                        var sum = finalItem.Sum(x => x.ItemQuantity);
                        var firstItem = finalItem.First();
                        if (sum > firstItem.AvailableQuantity)
                        {
                            posIncidentReport.ItemOverQuantity = sum - firstItem.AvailableQuantity;
                            _posRepository.InsertPosIncidentReport(posIncidentReport);
                        }
                    }
                }
                _posWindow.ViewModel.PosOverQuantityIncidentList = new List<PosIncidentReport>();
            }
        }

        /// <summary>
        /// This method is used for delete all temp transcation data once payment is done.
        /// </summary>
        private void DeleteTempTrascationData()
        {
            try
            {
                _posRepository.DeletePosTempTranscation(SettingHelpers.CurrentTempTransId);
                _posRepository.DeleteAllPOSTempTransItem(SettingHelpers.CurrentTempTransId);
                if (_itemProfileCollection != null)
                {
                    foreach (var item in _itemProfileCollection.ToList())
                    {
                        var id = item.ItemProfile.ParentItem != null ? item.ItemProfile.ParentItem.Id : item.ItemId;
                        var quantity = item.ItemProfile.ParentItem != null ? (item.ItemQuantity * item.BaseUnitCount) : item.ItemQuantity;
                        var quantityResponse = _posRepository.UpdateItemQuantityForPOS(id, quantity, SettingHelpers.CurrentBranchId, SettingHelpers.CurrentUserId);
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// This method is used for Update PosSession data once payment is done.
        /// </summary>
        private void UpdatePosSessionData()
        {
            try
            {
                POSSession posSession = new POSSession();
                posSession.Id = SettingHelpers.CurrentPosSessionId;
                posSession.Cash = Convert.ToDecimal(CashAmount);
                posSession.DebitCard = Convert.ToDecimal(DebitCardAmount);
                posSession.CreditCard = Convert.ToDecimal(CreditCardAmount);
                posSession.Coupon = Convert.ToDecimal(CouponAmount);
                posSession.CreditAccount = Convert.ToDecimal(CreditAccountAmount);
                posSession.Cheque = Convert.ToDecimal(chequeAmount);
                _posRepository.UpdatePosSessionData(posSession);
            }
            catch (Exception)
            {

                throw;
            }
        }
        private bool CheckValidNumber(string number)
        {
            try
            {
                decimal value = 0;
                if (string.IsNullOrEmpty(number))
                    return true;
                bool result = decimal.TryParse(number, out value);
                if (result)
                {
                    if (Regex.IsMatch(value.ToString(), @"^((?:[0-9]\d*)|(?:(?=[\d.]+)(?:[1-9]\d*|0)\.\d+))$"))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return result;
            }
            catch (Exception)
            {

                throw;
            }
        }
        private void UpdateCreditAccountLimitForCustomer()
        {
            try
            {
                if (!String.IsNullOrEmpty(CreditAccountAmount))
                {
                    HttpClients httpClient = new HttpClients();
                    customerInfo.Customer.TransactionAmount = customerInfo.Customer.TransactionAmount + Convert.ToDecimal(CreditAccountAmount);
                    var jsonString = JsonConvert.SerializeObject(customerInfo.Customer);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    var response = httpClient.PostAsync("api/customer/updatecustomertransctionamount", httpContent);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        private void InsertPosBillPaymentData(int posBillId, POSBillPaymentType paymentTypeMode, string BankTranscationNumber, decimal amount)
        {
            try
            {
                POSBillPayment payment = new POSBillPayment();
                payment.POSBillID = posBillId;
                payment.ParamTypeId = (int)paymentTypeMode;
                payment.Amount = amount;
                payment.BankPOSTransNo = BankTranscationNumber;
                payment.CreatedDateTime = DateTime.UtcNow;
                _posRepository.InsertPosBillPaymentData(payment);
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// Method to check if given credit account amount is
        /// valid or not for post pay customer
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private bool CheckIdValidAmountForPostPayCustmer(string value)
        {
            var amount = Convert.ToDecimal(value);
            if (_posWindow.ViewModel.CustomerInformation.Customer != null && _posWindow.ViewModel.CustomerInformation.Customer.IsCreditCustomer)
            {
                var amountLeft = 0M;
                if (_posWindow.ViewModel.CustomerInformation.Customer.BalanceAmount == 0)
                {
                    amountLeft = _posWindow.ViewModel.CustomerInformation.Customer.AmountLimit - _posWindow.ViewModel.CustomerInformation.Customer.TransactionAmount;
                }
                else
                {
                    amountLeft = _posWindow.ViewModel.CustomerInformation.Customer.BalanceAmount - _posWindow.ViewModel.CustomerInformation.Customer.TransactionAmount;
                }
                {
                    if (amount < TotalAmount)
                    {
                        if (_posWindow.ViewModel.CustomerInformation.Customer.BalanceAmount == 0)
                        {
                            decimal totalPaidAmount = Convert.ToDecimal(CashAmount) + Convert.ToDecimal(amount) + Convert.ToDecimal(DebitCardAmount) + Convert.ToDecimal(CreditCardAmount) + Convert.ToDecimal(CouponAmount) + Convert.ToDecimal(chequeAmount) + Convert.ToDecimal(DownPaymentAmount);
                            if (amount > totalPaidAmount || (TotalAmount - totalPaidAmount) < 0)
                            {
                                MessageBox.Show(string.Format("You can not pay more than Remaining Amount from Credit Account", TotalAmount), "Credit Account Amount Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                                return false;
                            }
                        }
                    }
                    else if (amount > TotalAmount)
                    {
                        MessageBox.Show(string.Format("Your Total Bill is {0}. You can not pay more than Total Amount from Credit Account", TotalAmount), "Credit Account Amount Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                        return false;
                    }
                    else if (amount > amountLeft)
                    {
                        MessageBox.Show(string.Format("Account Available Limit is {0}. You can not pay more than that amount for Credit Account", amountLeft), "Credit Account Amount Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                        return false;
                    }
                }
            }
            return true;
        }

        #endregion

        #region Backgound Worker Event
        void bgPaymentWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {

                if (e.Error != null && !string.IsNullOrEmpty(e.Error.Message))
                {
                    IsBusy = false;
                    MessageBox.Show("There was some issue processing this request.::" + e.Error.Message, "Error Processing Request", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }


                printParameters.PrintBill();
                GenerateOverQuantityIncidentPos();
                _paymentWindow.Close();
                SettingHelpers.ItemPurchaseCount = 0;
                var customerInformation = new CustomerInformation
                {
                    Customer = new DomainModel.Models.Customer.CustomerProfile
                    {
                        MembershipCode = 00001,
                        Name = "Walkin",
                        IsWalkIn = true,
                        Id = 1
                    }
                };
                _posWindow.ViewModel.CustomerInformation = customerInformation;
                _posWindow.ViewModel.BillSummary = new BillSummary();
                SettingHelpers.CurrentTempTransId = 0;
                SettingHelpers.TotalAmount = string.Empty;
                SettingHelpers.DownPayment = 0;
                SettingHelpers.AdditionalAmount = 0;
                SettingHelpers.IsCustomerPO = false;
                _posWindow.ViewModel = new POSWindowViewModel(_posWindow, true);
                _posWindow.TxtBarcode.Focus();
                _posWindow.ViewModel.PosOverQuantityIncidentList = null;
                IsBusy = false;
            }
            catch (Exception)
            {

                throw;
            }
        }

        void bgPaymentWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                InsertPOSBillData();
                DeleteTempTrascationData();
                UpdatePosSessionData();
                UpdateCreditAccountLimitForCustomer();
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion
    }
}

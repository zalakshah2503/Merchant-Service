using GalaSoft.MvvmLight.Command;
using MerchantService.Core.HttpClients;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.POS;
using MerchantService.POS.Repository;
using MerchantService.POS.Utility;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Windows;
using System.Windows.Input;
namespace MerchantService.POS.ViewModel
{
    public class CustomerViewModel : INotifyPropertyChanged
    {
        public CustomerWindow _customerWindow;
        public POSWindow _posWindow;
        private IPosRepository _posRepository;

        #region Property
        private string _popupText;
        public string PopupText
        {
            get { return _popupText; }
            set
            {
                _popupText = value;
                OnPropertyChanged("PopupText");
            }
        }

        private string _popupValue;
        public string PopupValue
        {
            get { return _popupValue; }
            set
            {
                _popupValue = value;
                OnPropertyChanged("PopupValue");
            }
        }

        private bool _isCustomer;
        public bool isCustomer
        {
            get { return _isCustomer; }
            set
            {
                if (value != _isCustomer)
                {
                    _isCustomer = value;
                    OnPropertyChanged("_isCustomer");
                }
            }
        }

        private bool _isReturnBill;
        public bool isReturnBill
        {
            get { return _isReturnBill; }
            set
            {
                if (value != _isReturnBill)
                {
                    _isReturnBill = value;
                    OnPropertyChanged("_isReturnBill");
                }
            }
        }

        private bool _isCustomerPO;
        public bool isCustomerPO
        {
            get { return _isCustomerPO; }
            set
            {
                if (value != _isCustomerPO)
                {
                    _isCustomerPO = value;
                    OnPropertyChanged("_isCustomerPO");
                }
            }
        }

        private string _Tag;
        public string Tag
        {
            get { return _Tag; }
            set
            {
                if (value != _Tag)
                {
                    _Tag = value;
                    OnPropertyChanged("_Tag");
                }
            }
        }

        private CustomerProfile _customerProfileObject;
        public CustomerProfile CustomerProfileObject
        {
            get { return _customerProfileObject; }
            set
            {
                if (value != _customerProfileObject)
                {
                    _customerProfileObject = value;
                    OnPropertyChanged("CustomerProfileObject");
                }
            }
        }

        private bool _isError;
        public bool isError
        {
            get { return _isError; }
            set
            {
                if (value != _isError)
                {
                    _isError = value;
                    OnPropertyChanged("isError");
                }
            }
        }

        private string _message;
        public string Message
        {
            get { return _message; }
            set
            {
                if (value != _message)
                {
                    _message = value;
                    OnPropertyChanged("Message");
                }
            }
        }
        #endregion

        #region Constructor
        public CustomerViewModel(CustomerWindow customerWindow)
        {
            _customerWindow = customerWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
        }
        public CustomerViewModel(CustomerWindow customerWindow, POSWindow posWindow)
        {
            _customerWindow = customerWindow;
            _posWindow = posWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
        }
        #endregion

        #region Submit Command

        public ICommand SubmitCommand
        {
            get
            {
                return new RelayCommand(() => this.SubmitButtonCommand());
            }
        }

        public void SubmitButtonCommand()
        {
            HttpClients httpClient = new HttpClients();
            if (!String.IsNullOrEmpty(PopupValue))
            {
                isError = false;
                if (_isCustomer)
                {
                    if (PopupValue.Trim().Equals("00001"))
                    {
                        _posWindow.ViewModel.CustomerInformation.Customer = new CustomerProfile
                        {
                            MembershipCode = 1,
                            Id = 1,
                            Name = "Walkin Customer",
                            IsWalkIn = true
                        };
                        _customerWindow.DialogResult = true;
                        _customerWindow.Close();
                    }
                    else
                    {
                        var response = httpClient.GetAsync("api/customer/getcustomerbymebershipcodeormobileno?number=" + PopupValue);
                        if (response.IsSuccessStatusCode)
                        {

                            string data = response.Content.ReadAsStringAsync().Result;
                            var CustomerProfile = JsonConvert.DeserializeObject<CustomerProfile>(data);
                            if (CustomerProfile != null)
                            {
                                if (CustomerProfile.IsActive)
                                {
                                    CustomerProfileObject = CustomerProfile;
                                    _posWindow.ViewModel.CustomerInformation.Customer = CustomerProfile;
                                    _customerWindow.DialogResult = true;
                                    _customerWindow.Close();
                                }
                                else
                                {
                                    isError = true;
                                    Message = StringConstants.InActiveCustomer;
                                }
                            }

                            else
                            {
                                isError = true;
                                Message = StringConstants.CustomerNoNotFound;
                            }
                            //return CustomerProfile;
                        }
                        else
                        {
                            isError = true;
                            Message = StringConstants.CustomerNoNotFound;
                        }
                    }
                }
                if (_isCustomerPO)
                {

                    var CustomerPOResponse = httpClient.GetAsync("api/customerpo/getcustomerpobyponumber?purchaseOrderNumber=" + PopupValue);
                    if (CustomerPOResponse.IsSuccessStatusCode)
                    {
                        var customerPOString = CustomerPOResponse.Content.ReadAsStringAsync().Result;
                        var customerPOData = JsonConvert.DeserializeObject<CustomerPurchaseOrder>(customerPOString);
                        if (customerPOData != null)
                        {
                            var cpoDetailResponse = httpClient.GetAsync("api/customerpo/getcustomerpurchaseorderbycpoid?cpoId=" + customerPOData.Id);
                            if (cpoDetailResponse.IsSuccessStatusCode)
                            {
                                var cpoDetailString = cpoDetailResponse.Content.ReadAsStringAsync().Result;
                                var cpoDetailData = JsonConvert.DeserializeObject<CustomerPOAC>(cpoDetailString);
                                if (cpoDetailData != null)
                                {
                                    if (cpoDetailData.IsCollected)
                                    {
                                        isError = true;
                                        Message = StringConstants.CpoCollected;
                                    }
                                    else if (cpoDetailData.IsCancel)
                                    {
                                        isError = true;
                                        Message = StringConstants.CpoCancelled;
                                    }
                                    else
                                    {
                                        if(cpoDetailData.CollectingBranchId != SettingHelpers.CurrentBranchId)
                                        {
                                            MessageBox.Show(string.Format(StringConstants.CPOCollectionValidation, cpoDetailData.CollectingBranchName),
                                                "CPO Collection Validation", MessageBoxButton.OK, 
                                                MessageBoxImage.Information);
                                            return;
                                        }
                                        _posWindow.ViewModel.CustomerInformation.Customer = cpoDetailData.Customer;
                                        // SettingHelpers.CurrentBranchId = cpoDetailData.CollectingBranchId;
                                        _posWindow.ViewModel.BillSummary.DownPayment = cpoDetailData.POSBillAmount;

                                        _posWindow.ViewModel.ItemProfileCollectionNew = new ObservableCollection<POSItemDetail>();
                                        _posWindow.ViewModel.BillSummary.OrderAmount = 0;
                                        _posWindow.ViewModel.BillSummary.Discount = 0;
                                        if (cpoDetailData.CPOAdditionalCost.Any())
                                            _posWindow.ViewModel.BillSummary.AdditionalAmount = cpoDetailData.CPOAdditionalCost.Sum(x => x.Amount);
                                        SettingHelpers.AdditionalAmount = _posWindow.ViewModel.BillSummary.AdditionalAmount == null ? 0 :
                                            _posWindow.ViewModel.BillSummary.AdditionalAmount.Value;
                                        var tempPosItem = new List<POSTempTransItem>();
                                        POSTempTransItem newObj;
                                        foreach (var item in cpoDetailData.CPOItem.ToList())
                                        {
                                            newObj = new POSTempTransItem();
                                            newObj.Barcode = item.Barcode;
                                            newObj.ItemProfile = item.ItemProfile;
                                            newObj.Quantity = item.Quantity;
                                            newObj.ItemID = item.ItemId;
                                            tempPosItem.Add(newObj);
                                        }
                                        if (SettingHelpers.CurrentTempTransId == 0)
                                            InsertTempTranscation(cpoDetailData);
                                        _posWindow.ViewModel.ProcessTempTransactionItems(tempPosItem, false);
                                        cpoDetailData.CPOItemDetailPOS = _posWindow.ViewModel.ItemProfileCollectionNew;

                                        SettingHelpers.IsCustomerPO = true;
                                        _posWindow.ViewModel.CustomerInformation.CPO = new CustomerPurchaseOrder
                                        {
                                            PurchaseOrderNo = cpoDetailData.PurchaseOrderNo
                                        };
                                        _customerWindow.DialogResult = true;
                                        _customerWindow.Close();
                                        //BackgroundWorker bgInsertTempTrans = new BackgroundWorker();
                                        //bgInsertTempTrans.DoWork += bgInsertTempTrans_DoWork;
                                        //bgInsertTempTrans.RunWorkerCompleted += bgInsertTempTrans_RunWorkerCompleted;
                                        //bgInsertTempTrans.RunWorkerAsync(cpoDetailData);
                                    }
                                }
                            }
                        }
                        else
                        {
                            isError = true;
                            Message = StringConstants.CpoNotExists;
                        }
                    }
                }
                else if (_isReturnBill)
                {
                    var responseReturnBill = httpClient.GetAsync("api/returnbill/getposreturnbilldatabyreturnbillno?billNo=" + PopupValue);
                    if (responseReturnBill.IsSuccessStatusCode)
                    {
                        var returnBillData = responseReturnBill.Content.ReadAsAsync<POSReturnBill>().Result;
                        if (returnBillData != null)
                        {
                            if (!returnBillData.IsProcessed)
                            {
                                if (SettingHelpers.CurrentBranchId != returnBillData.IssuingBranchID)
                                {
                                    if (SettingHelpers.CompanyConfigruationObject.ReturnItem)
                                    {
                                        _posWindow.ViewModel.CustomerInformation.ReturnBill = returnBillData;
                                        if (returnBillData.POSBill.Customer != null)
                                        {
                                            _posWindow.ViewModel.CustomerInformation.Customer = returnBillData.POSBill.Customer;
                                        }
                                        _customerWindow.DialogResult = true;
                                        _customerWindow.Close();
                                    }
                                    else
                                    {
                                        MessageBox.Show(string.Format(StringConstants.ReturnOtherBranchNotAllowd, returnBillData.BranchDetail.Name), "Return Item", MessageBoxButton.OK, MessageBoxImage.Information);
                                    }
                                }
                                else
                                {
                                    if (returnBillData.POSBill.Customer != null)
                                    {
                                        _posWindow.ViewModel.CustomerInformation.Customer = returnBillData.POSBill.Customer;
                                    }
                                    _posWindow.ViewModel.CustomerInformation.ReturnBill = returnBillData;
                                    _customerWindow.DialogResult = true;
                                    _customerWindow.Close();
                                }
                            }
                            else
                            {
                                isError = true;
                                Message = StringConstants.ReturnBillProceed;
                            }
                        }
                        else
                        {
                            isError = true;
                            Message = StringConstants.ReturnBillNotFount;
                        }
                    }
                    else
                    {
                        isError = true;
                        Message = StringConstants.ReturnBillNotFount;
                    }
                }
            }
            else
            {
                isError = true;
                if (_isCustomer)
                {
                    Message = StringConstants.CustomerNoRequired;
                }
                else if (_isReturnBill)
                {
                    Message = StringConstants.ReturnBillNoRequired;
                }
                else
                {
                    Message = StringConstants.CustomerPORequired;
                }
            }
        }


        #endregion Submit Command


        #region Cancel Command

        public ICommand CancelCommand
        {
            get
            {
                return new RelayCommand(() => this.CancelButtonCommand());
            }
        }

        public void CancelButtonCommand()
        {
            _customerWindow.DialogResult = false;
            _customerWindow.Close();
        }

        #endregion Cancel Command

        #region INotifyPropertyChanged implementation

        public event PropertyChangedEventHandler PropertyChanged = delegate { };
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        #endregion INotifyPropertyChanged implementation

        #region BackgroundWorker
        void bgInsertTempTrans_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            if (e.Error == null)
            {
                _customerWindow.DialogResult = true;
                _customerWindow.Close();
            }
        }

        void bgInsertTempTrans_DoWork(object sender, DoWorkEventArgs e)
        {
            if (e.Argument != null)
            {
                var cpoDetailData = (CustomerPOAC)e.Argument;
                var result = InsertTempTranscation(cpoDetailData);
            }
        }

        #endregion

        #region Private Method
        /// <summary>
        /// This method is used for insert temp data for puchase item by customer. - PS
        /// </summary>
        /// <returns></returns>
        private bool InsertTempTranscation(CustomerPOAC cpoDetailData)
        {
            POSTempTrans tempTrans = new POSTempTrans();
            tempTrans.BranchID = SettingHelpers.CurrentBranchId;
            tempTrans.CreatedDateTime = DateTime.UtcNow;
            tempTrans.CustomerID = cpoDetailData.Customer.Id;
            tempTrans.IsSuspendedBill = false;
            tempTrans.PurchaseOrderNo = cpoDetailData.PurchaseOrderNo;
            tempTrans.ReturnedBillNo = null;
            tempTrans.TransDate = DateTime.UtcNow;
            tempTrans.TransReference = string.Empty;
            tempTrans.UserID = SettingHelpers.CurrentUserId;
            tempTrans.CpoDownPayment = cpoDetailData.DownPaymentAmount;
            tempTrans.AdditionalAmount = SettingHelpers.AdditionalAmount;

            HttpClients httpClient = new HttpClients();
            string jsonString = JsonConvert.SerializeObject(tempTrans);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            var response = httpClient.PostAsync("api/posprocess/insertpostemptransdata", httpContent);

            if (response.IsSuccessStatusCode)
            {
                var tempTranscation = response.Content.ReadAsAsync<POSTempTrans>().Result;
                SettingHelpers.CurrentTempTransId = tempTranscation.Id;
                // bool result = InsertTempTranscationItemData(cpoDetailData.CPOItemDetailPOS.ToList());
                return true;
            }
            return false;
        }

        /// <summary>
        /// This method  is used for Insert data in POSTempTransItem table.
        /// </summary>
        /// <returns>boolean</returns>
        private bool InsertTempTranscationItemData(List<POSItemDetail> cpoDetailData)
        {
            HttpClients httpClient = new HttpClients();
            foreach (var item in cpoDetailData)
            {
                POSTempTransItem tempItem = new POSTempTransItem();
                tempItem.Barcode = item.Barcode;
                tempItem.CreatedDateTime = DateTime.UtcNow;
                tempItem.ItemPrice = item.ItemPrice;
                tempItem.ItemID = item.ItemId;
                tempItem.Quantity = item.ItemQuantity;
                tempItem.TempTransID = SettingHelpers.CurrentTempTransId;
                tempItem.IsOfferItem = item.IsOfferItem;
                string tempTransString = JsonConvert.SerializeObject(tempItem);
                var httpContentTempItem = new StringContent(tempTransString, Encoding.UTF8, "application/json");
                var tempItemResponse = httpClient.PostAsync("api/posprocess/insertpostemptransitemsdata", httpContentTempItem);
            }
            return true;
        }
        #endregion
    }
}


using GalaSoft.MvvmLight.Command;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.POS;
using MerchantService.POS.Repository;
using MerchantService.POS.Utility;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Utility.Constants;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace MerchantService.POS.ViewModel
{
    public class POSWindowViewModel : INotifyPropertyChanged
    {
        private POSWindow _posWindow;
        private int _overQuantityValue;
        IPosRepository _posRepository;
        public POSWindowViewModel(POSWindow posWindow, bool isSuspend)
        {
            _posWindow = posWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            InitializeCustomerAndBillSummary();
            if (!SettingHelpers.isCashierLogOut && !isSuspend)
            {
                GetPendingTempTranscationItemData(false);
            }
            SuspendBillCount = SettingHelpers.SuspendBillCount;
        }

        public POSWindowViewModel()
        {
            InitializeCustomerAndBillSummary();
            SuspendBillCount = SettingHelpers.SuspendBillCount;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
        }

        #region Property

        private CustomerInformation _customerInformation;
        public CustomerInformation CustomerInformation
        {
            get { return _customerInformation; }
            set
            {
                _customerInformation = value;
                OnPropertyChanged("CustomerInformation");
            }
        }

        private BillSummary _billSummary;

        public BillSummary BillSummary
        {
            get { return _billSummary; }
            set
            {
                _billSummary = value;
                OnPropertyChanged("BillSummary");

            }
        }

        public List<PosIncidentReport> PosOverQuantityIncidentList { get; set; }

        private POSItemDetail _selectedItemProfile;
        public POSItemDetail SelectedItemProfile
        {
            get { return _selectedItemProfile; }
            set
            {
                if (value != _selectedItemProfile)
                {
                    _selectedItemProfile = value;
                    OnPropertyChanged("SelectedItemProfile");
                }
            }

        }

        private string _barcodeNo;
        public string BarcodeNo
        {
            get { return _barcodeNo; }
            set
            {
                if (CheckValidNumber(value))
                {
                    if (value != _barcodeNo)
                    {
                        _barcodeNo = value;
                        OnPropertyChanged("BarcodeNo");
                    }
                }
            }
        }

        private int? _customerQuantity;
        public int? CustomerQuantity
        {
            get { return _customerQuantity; }
            set
            {
                if (!SettingHelpers.IsItemSelected && value != 0)
                {
                    if (value != _customerQuantity)
                    {
                        _customerQuantity = value;
                        OnPropertyChanged("CustomerQuantity");
                    }
                }
                else if (SettingHelpers.IsItemSelected)
                {
                    if (value != _customerQuantity)
                    {
                        _customerQuantity = value;
                        OnPropertyChanged("CustomerQuantity");
                    }
                }
            }
        }

        private ObservableCollection<POSItemDetail> _itemProfileCollectionNew = new ObservableCollection<POSItemDetail>();

        public ObservableCollection<POSItemDetail> ItemProfileCollectionNew
        {
            get { return _itemProfileCollectionNew; }
            set
            {
                if (value != _itemProfileCollectionNew)
                {
                    _itemProfileCollectionNew = value;
                    OnPropertyChanged("ItemProfileCollectionNew");

                }
            }
        }

        private int _suspendBillCount;
        public int SuspendBillCount
        {
            get { return _suspendBillCount; }
            set
            {
                if (value != _suspendBillCount)
                {
                    _suspendBillCount = value;
                    OnPropertyChanged("SuspendBillCount");
                }
            }
        }

        private string _itemName;
        public string ItemName
        {
            get { return _itemName; }
            set
            {
                if (value != _itemName)
                {
                    _itemName = value;
                    OnPropertyChanged("ItemName");
                }
            }
        }
        #endregion

        #region Commands
        #region Barcode Command

        public ICommand BarcodeCommand
        {
            get
            {
                return new RelayCommand(() => this.BarcodeNumberCommand());
            }
        }

        public void BarcodeNumberCommand()
        {
            BarcodeNo = "";
            CustomerQuantity = null;
            SettingHelpers.IsItemSelected = false;
            SelectedItemProfile = null;
            SettingHelpers.IsUnRegisteredItem = false;
            ItemName = String.Empty;
            _posWindow.TxtBarcode.Focus();
        }

        #endregion Barcode Command

        #region Customer Command

        public ICommand CustomerWindowCommand
        {
            get
            {
                return new RelayCommand(() => this.CustomerCommand());
            }
        }

        public void CustomerCommand()
        {
            if (CustomerInformation.ReturnBill != null || SettingHelpers.IsCustomerPO)
            {
                MessageBox.Show(StringConstants.SingleProcessTransaction, "Customer Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            CustomerWindow customerWindow = new CustomerWindow(POSBillType.Customer, _posWindow);
            customerWindow.Owner = _posWindow;

            var result = customerWindow.ShowDialog();
            if (result == true)
            {
                var customerProfile = customerWindow.CustomerViewModel.CustomerProfileObject;
                if (customerProfile != null && customerProfile.Id != 0)
                {
                    CustomerInformation.Customer = customerProfile;
                }
                else
                {
                    CustomerInformation.Customer = new DomainModel.Models.Customer.CustomerProfile
                    {
                        Id = 1,
                        Name = "Walkin Customer",
                        MembershipCode = 00001,
                        IsWalkIn = true
                    };
                }
                if (ItemProfileCollectionNew != null)
                {
                    var tempItemProfileCollection = new ObservableCollection<POSItemDetail>();
                    POSTempTrans posTempTrans = new POSTempTrans();
                    posTempTrans.Id = SettingHelpers.CurrentTempTransId;
                    posTempTrans.IsSuspendedBill = false;
                    posTempTrans.CustomerID = CustomerInformation.Customer.Id;
                    posTempTrans.ModifiedDateTime = DateTime.UtcNow;

                    _posRepository.UpdatePosTempTransForSuspendBill(posTempTrans);
                    var tempItemResponse = _posRepository.GetPosTempTransItemByTempTransId(Utility.SettingHelpers.CurrentTempTransId);
                    if (tempItemResponse != null && tempItemResponse.Any())
                    {
                        ItemProfileCollectionNew.Clear();
                        BillSummary.OrderAmount = 0;
                        BillSummary.Discount = 0;
                        ProcessTempTransactionItems(tempItemResponse, true);
                    }
                }
            }
        }

        #endregion Customer Command

        #region Payment Command

        public ICommand PaymentWindowCommand
        {
            get
            {
                return new RelayCommand(() => this.PaymentCommand());
            }
        }

        public void PaymentCommand()
        {
            if (CustomerInformation.ReturnBill != null)
            {
                if (!CustomerInformation.ReturnBill.IsDeleted)
                {
                    if (CustomerInformation.ReturnBill.SubstituteItemsAmount == 0)
                    {
                        UpdateReuturnBill();
                    }
                    else
                    {
                        if (BillSummary.OrderAmount < CustomerInformation.ReturnBill.SubstituteItemsAmount)
                        {
                            MessageBox.Show(StringConstants.ReturnBillSubstituteMsg + CustomerInformation.ReturnBill.SubstituteItemsAmount, "Return Bill", MessageBoxButton.OK, MessageBoxImage.Warning);
                            return;
                        }
                        PaymentWindow paymentWindow = new PaymentWindow(_posWindow);
                        paymentWindow.Owner = _posWindow;
                        var result = paymentWindow.ShowDialog();
                        if (result == true)
                        {
                            SettingHelpers.ItemPurchaseCount = 0;
                        }
                    }
                }
                else
                {
                    MessageBox.Show(StringConstants.ReturnBillAlreadyDeleted, "Return Bill Already Deleted", MessageBoxButton.OK, MessageBoxImage.Warning);
                    InitializeCustomerAndBillSummary();
                    return;
                }
            }
            else
            {
                if (ItemProfileCollectionNew.Count == 0)
                    return;
                PaymentWindow paymentWindow = new PaymentWindow(_posWindow);
                var additionalCost = Convert.ToDecimal(paymentWindow.ViewModel.AdditionalCost);
                if (additionalCost <= 0)
                {
                    paymentWindow.txtAdditionalCode.Visibility = System.Windows.Visibility.Hidden;
                    paymentWindow.lblAdditionalCost.Visibility = System.Windows.Visibility.Hidden;
                }
                paymentWindow.Owner = _posWindow;
                var result = paymentWindow.ShowDialog();
                if (result == true)
                {
                    SettingHelpers.ItemPurchaseCount = 0;
                }
            }
        }

        #endregion Payment Command

        #region Return Bill Command

        public ICommand ReturnBillNoCommand
        {
            get
            {
                return new RelayCommand(() => this.ReturnBillCommand());
            }
        }

        public void ReturnBillCommand()
        {
            if (SettingHelpers.IsCustomerPO || ItemProfileCollectionNew.Any() || CustomerInformation.Customer.MembershipCode != 1)
            {
                MessageBox.Show(StringConstants.SingleProcessTransaction, "Return Bill Validation", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (SettingHelpers.CheckConnection())
            {
                CustomerWindow customerWindow = new CustomerWindow(POSBillType.ReturnBill, _posWindow);
                customerWindow.Owner = _posWindow;
                var result = customerWindow.ShowDialog();
                if (result == true)
                {
                    if (CustomerInformation.ReturnBill != null)
                    {
                        BillSummary = new BillSummary();
                        BillSummary.ReturnAmount = CustomerInformation.ReturnBill.ReturnedCash;
                        BillSummary.Substitute = CustomerInformation.ReturnBill.SubstituteItemsAmount;
                    }
                }
            }
            else
            {
                MessageBox.Show("Internet Connectivity is not available. You can not process Returnbill. Please try after sometime", "Validation", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        #endregion Customer Command

        #region Customer PO Bill Command

        public ICommand CustomerPOCommand
        {
            get
            {
                return new RelayCommand(() => this.CustomerPOBillCommand());
            }
        }
        public void CustomerPOBillCommand()
        {
            if (CustomerInformation.ReturnBill != null)
            {
                MessageBox.Show(StringConstants.SingleProcessTransaction, "Customer Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            if (ItemProfileCollectionNew.Count == 0)
            {
                if (SettingHelpers.CheckConnection())
                {
                    CustomerWindow customerWindow = new CustomerWindow(POSBillType.CustomerPO, _posWindow);
                    customerWindow.Owner = _posWindow;
                    var result = customerWindow.ShowDialog();
                    if (result == true)
                    {
                        SettingHelpers.IsCustomerPO = true;
                    }
                }
                else
                {
                    MessageBox.Show("Internet Connectivity is not available. You can not process Returnbill. Please try after sometime", "Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }
            else
            {
                MessageBox.Show(StringConstants.UnSuspendValidation, "Customer PO Validation", MessageBoxButton.OK, MessageBoxImage.Stop);
            }
        }

        #endregion Customer PO Bill Command

        #region Suspend Bill Command

        public ICommand SuspendCommand
        {
            get
            {
                return new RelayCommand(() => this.SuspendBillCommand());
            }
        }

        public void SuspendBillCommand()
        {
            if (ItemProfileCollectionNew.Any())
            {
                SuspendBill suspendBill = new SuspendBill(_posWindow);
                suspendBill.Owner = _posWindow;
                var result = suspendBill.ShowDialog();
                if (result.Value)
                {
                    SettingHelpers.ItemPurchaseCount = 0;
                    SuspendBillCount = SettingHelpers.SuspendBillCount;
                }
            }
            else
            {
                if (CustomerInformation.ReturnBill != null && CustomerInformation.ReturnBill.SubstituteItemsAmount <= 0)
                {
                    MessageBox.Show(StringConstants.ReturnBillSuspend, "Item Not Found", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    MessageBox.Show(StringConstants.SuspendItemNofFound, "Item Not Found", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }
        }

        #endregion Suspend bill Command

        #region UnSuspend Bill Command

        public ICommand UnsuspendCommand
        {
            get
            {
                return new RelayCommand(() => this.UnSuspendBillCommand());
            }
        }

        public void UnSuspendBillCommand()
        {
            if (CustomerInformation.ReturnBill != null)
            {
                if (CustomerInformation.ReturnBill.SubstituteItemsAmount <= 0)
                {
                    MessageBox.Show(StringConstants.SingleProcessTransaction, "Item Not Found", MessageBoxButton.OK, MessageBoxImage.Information);
                    return;
                }
                else
                {
                    if (!ItemProfileCollectionNew.Any())
                    {
                        MessageBox.Show(StringConstants.SingleProcessTransaction, "Item Not Found", MessageBoxButton.OK, MessageBoxImage.Information);
                        return;
                    }
                }
            }
            if (!ItemProfileCollectionNew.Any())
            {
                UnsuspendBill unSuspendBill = new UnsuspendBill();
                unSuspendBill.Owner = _posWindow;
                var result = unSuspendBill.ShowDialog();
                if (result == true)
                {
                    SettingHelpers.SuspendBillCount = SettingHelpers.SuspendBillCount - 1;
                    SuspendBillCount = SettingHelpers.SuspendBillCount;
                    UnSuspendCurrentItem();
                }
            }
            else
            {
                MessageBox.Show(StringConstants.UnSuspendValidation, "UnSuspend Validation", MessageBoxButton.OK, MessageBoxImage.Stop);
            }
        }

        #endregion UnSuspend Bill Command

        #region Select Item Command

        public ICommand SelectItemCommand
        {
            get
            {
                return new RelayCommand(() => this.SelectItemsCommand());
            }
        }

        public void SelectItemsCommand()
        {
            if (ItemProfileCollectionNew.Any())
            {
                SelectedItemProfile = ItemProfileCollectionNew.First();
                _posWindow.ItemGrid.ScrollIntoView(_posWindow.ItemGrid.Items[0]);
                _posWindow.ItemGrid.UpdateLayout();
                DataGridRow dgRow = (DataGridRow)_posWindow.ItemGrid.ItemContainerGenerator.ContainerFromItem(SelectedItemProfile);
                if (dgRow != null)
                {

                    dgRow.MoveFocus(new TraversalRequest(FocusNavigationDirection.Next));
                }
            }
        }

        #endregion Select Item Command

        #region Logout Command

        public ICommand LogOutCommand
        {
            get
            {
                return new RelayCommand(() => this.LogOutWindowCommand());
            }
        }

        public void LogOutWindowCommand()
        {
            LogOut logoutWindow = new LogOut();
            logoutWindow.Owner = _posWindow;
            var result = logoutWindow.ShowDialog();
            if (result == true)
            {
                _posWindow.DialogResult = true;
                _posWindow.Close();
            }
        }

        #endregion Logout Command

        #region Get Item Profile or Offer Data Command

        public ICommand ItemProfileDataCommand
        {
            get
            {
                return new RelayCommand(() => this.GetItemProfileOrOfferData());
            }
        }

        /// <summary>
        /// This method is used for getting Item Profile or Item Offer data by Barcdoe Number.
        /// </summary>
        public void GetItemProfileOrOfferData()
        {

            if (CustomerInformation.ReturnBill != null && CustomerInformation.ReturnBill.SubstituteItemsAmount == 0)
            {
                MessageBox.Show(StringConstants.SingleProcessTransaction, "Validation", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            if (!String.IsNullOrEmpty(BarcodeNo))
            {
                BackgroundWorker bgOverQuantityIncidentReport = new System.ComponentModel.BackgroundWorker();
                SettingHelpers.CurrentBarcode = BarcodeNo;

                #region "selected item processing"
                if (CustomerQuantity != null && SettingHelpers.IsItemSelected)
                {
                    //Edit Item quatity on grid enter key event.

                    #region "if edit item"
                    if (CustomerQuantity != 0)
                    {
                        if (SelectedItemProfile.ItemQuantity != CustomerQuantity.Value)
                        {
                            ItemName = SelectedItemProfile.ItemName;
                            //Assigning Old Quantity to deduct price from total value
                            SelectedItemProfile.OldQuantity = SelectedItemProfile.ItemQuantity;

                            #region "validate amount decreases"
                            bool resultOperationCount = true;
                            if (SelectedItemProfile.ItemQuantity > CustomerQuantity.Value)
                            {
                                //---- Check Condition for Operation Limit and Amount Limit
                                resultOperationCount = ValidateQuantityAmountDecreaes(SelectedItemProfile);
                            }
                            #endregion

                            #region "if amount decrease is valid"
                            if (resultOperationCount == true)
                            {

                                POSItemDetail item;

                                #region "Over Quantity Incident"
                                //---------End Condition for Operation Limit and Amount Limit
                                if (SelectedItemProfile.AvailableQuantity < (CustomerQuantity.Value * SelectedItemProfile.BaseUnitCount))
                                {
                                    _overQuantityValue = (CustomerQuantity.Value * SelectedItemProfile.BaseUnitCount);
                                    if (!ReportOverQuantityIncident()) { }
                                    // return;
                                }
                                #endregion

                                item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.PosItemId == SettingHelpers.CurrentPosItemId).FirstOrDefault();

                                if (item != null && item.IsOfferItem && !item.IfCustomerPriceLessThanOfferPrice)
                                {
                                    #region "if item is in offer quantity change of selected item"
                                    if (item.ItemQuantity < CustomerQuantity.Value)
                                    {
                                        int currentActualQuantity = CustomerQuantity.Value - item.ItemQuantity;

                                        #region remaining offer quantity is greater than required quantity

                                        if (currentActualQuantity <= item.RemainingOfferQuantity)
                                        {
                                            UpdatePOSTempTransItem(item.ItemQuantity + currentActualQuantity, true);
                                            UpdateCurrentTotalAndDiscount(item, currentActualQuantity, item.ItemQuantity, true);
                                            item.RemainingOfferQuantity = item.RemainingOfferQuantity - currentActualQuantity;
                                        }

                                        #endregion

                                        #region "remaining quantity is zero, consider item as normal item and fetch price"

                                        else if (item.RemainingOfferQuantity == 0)
                                        {
                                            //if remaingItem
                                            item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.IsOfferItem == false).FirstOrDefault();
                                            if (item != null)
                                            {
                                                UpdatePOSTempTransItem(item.ItemQuantity + currentActualQuantity, false);
                                                UpdateCurrentTotalAndDiscount(item, currentActualQuantity, item.ItemQuantity, true);
                                                UpdateOnWindow();
                                            }
                                            else
                                            {
                                                //if item not exists then add new item.
                                                item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.IsOfferItem).FirstOrDefault();
                                                var posItem = GetNewPosItem(item, currentActualQuantity);
                                                UpdateCurrentTotalAndDiscount(posItem, posItem.ItemQuantity, posItem.ItemQuantity, false);
                                                InsertTempTranscationItemData(posItem);
                                                UpdateOnWindow();
                                            }
                                        }

                                        #endregion

                                        else
                                        {
                                            int remaingingQuantity = item.RemainingOfferQuantity;
                                            UpdatePOSTempTransItem(item.ItemQuantity + remaingingQuantity, true);
                                            UpdateCurrentTotalAndDiscount(item, remaingingQuantity, item.ItemQuantity, true);
                                            item.RemainingOfferQuantity = 0;

                                            //for adding remaing item quatity without offer.
                                            var posItem = GetNewPosItem(item, CustomerQuantity.Value - item.ItemQuantity);
                                            UpdateCurrentTotalAndDiscount(posItem, posItem.ItemQuantity, posItem.ItemQuantity, false);
                                            InsertTempTranscationItemData(posItem);
                                            UpdateOnWindow();
                                        }
                                    }
                                    else
                                    {
                                        //if old qunatity is grather then new quantity e.g. old 4 and new 3                                 
                                        int currentActualQuantity = item.QuantityLimit - CustomerQuantity.Value;
                                        BillSummary.OrderAmount -= (item.ItemPrice * item.ItemQuantity);
                                        BillSummary.Discount -= ((item.ActualSellPrice * item.ItemQuantity) - (item.ItemPrice * item.ItemQuantity));
                                        item.ItemQuantity = CustomerQuantity.Value;

                                        int quantityAdd = 0;
                                        int indexOf = ItemProfileCollectionNew.IndexOf(item);
                                        ItemProfileCollectionNew.RemoveAt(indexOf);
                                        var itemDetails = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo).FirstOrDefault();
                                        if (itemDetails != null)
                                        {
                                            BillSummary.OrderAmount -= (itemDetails.ItemPrice * itemDetails.ItemQuantity);
                                            int indexofOffer = ItemProfileCollectionNew.IndexOf(itemDetails);
                                            quantityAdd = itemDetails.ItemQuantity;
                                            itemDetails.ItemQuantity = itemDetails.ItemQuantity - currentActualQuantity;
                                            ItemProfileCollectionNew.RemoveAt(indexofOffer);
                                            if (itemDetails.ItemQuantity > 0)
                                            {
                                                quantityAdd = currentActualQuantity;
                                                BillSummary.OrderAmount += (itemDetails.ItemPrice * itemDetails.ItemQuantity);
                                                ItemProfileCollectionNew.Insert(indexofOffer, itemDetails);
                                                UpdatePOSTempTransItem(itemDetails.ItemQuantity, false);
                                                BillSummary.Discount += ((itemDetails.ActualSellPrice * itemDetails.ItemQuantity) -
                                                    (itemDetails.ItemPrice * itemDetails.ItemQuantity));
                                            }
                                            else
                                            {
                                                //quantityAdd = 1;
                                                DeletePosTransItem(quantityAdd, false);
                                            }

                                            item.ItemQuantity = item.ItemQuantity + quantityAdd;
                                        }

                                        BillSummary.OrderAmount += (item.ItemPrice * item.ItemQuantity);
                                        BillSummary.Discount += ((item.ActualSellPrice * item.ItemQuantity) - (item.ItemPrice * item.ItemQuantity));
                                        ItemProfileCollectionNew.Insert(indexOf, item);

                                        UpdatePOSTempTransItem(item.ItemQuantity, true);
                                        if (item.ItemQuantity == item.QuantityLimit)
                                        {
                                            item.RemainingOfferQuantity = 0;
                                        }
                                        else
                                        {
                                            item.RemainingOfferQuantity = item.QuantityLimit - item.ItemQuantity;
                                        }
                                        UpdateOnWindow();
                                        // return;
                                    }
                                    //end with testing newly coding

                                    #endregion
                                }
                                else
                                {
                                    #region "normal item"
                                    BillSummary.OrderAmount -= (item.ItemQuantity * item.ItemPrice);
                                    item.ItemQuantity = 0;//reset item quantity to zero
                                    UpdateCurrentTotalAndDiscount(item, CustomerQuantity.Value, item.ItemQuantity, true);
                                    UpdatePOSTempTransItem(CustomerQuantity.Value, false);
                                    #endregion
                                }
                                UpdateOnWindow();
                            }
                            #endregion

                            #region "if amount decrease is not valid"
                            else
                            {
                                _posWindow.TxtBarcode.Text = "";
                                CustomerQuantity = null;
                            }
                            #endregion
                        }
                        else
                        {
                            UpdateOnWindow();
                        }
                    }
                    #endregion

                    #region "if delete item"
                    else
                    {
                        ItemName = SelectedItemProfile.ItemName;
                        POSItemDetail item = null;

                        #region "offer item processing"
                        if (SelectedItemProfile.IsOfferItem && !SelectedItemProfile.IfCustomerPriceLessThanOfferPrice)
                        {
                            item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.PosItemId == SettingHelpers.CurrentPosItemId).FirstOrDefault();
                            if (item != null)
                            {
                                bool resultOperationCount = ValidateQuantityAmountDecreaes(SelectedItemProfile);
                                if (resultOperationCount == true)
                                {
                                    BillSummary.OrderAmount -= (item.ItemPrice * item.ItemQuantity);
                                    BillSummary.Discount -= ((item.ActualSellPrice * item.ItemQuantity) - (item.ItemPrice * item.ItemQuantity));
                                    //removed current item
                                    int indexOf = ItemProfileCollectionNew.IndexOf(item);
                                    ItemProfileCollectionNew.RemoveAt(indexOf);

                                    DeletePosTransItem(item.ItemQuantity, true);
                                    item.RemainingOfferQuantity = item.QuantityLimit;

                                    //If another item with same barcode which is not in offer
                                    var anotherItem = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.IsOfferItem == false)
                                            .FirstOrDefault();
                                    if (anotherItem != null)
                                    {
                                        DeletePosTransItem(anotherItem.ItemQuantity, false);

                                        BillSummary.OrderAmount -= (anotherItem.ItemPrice * anotherItem.ItemQuantity);
                                        //so it has other item to process
                                        if (anotherItem.ItemQuantity <= item.RemainingOfferQuantity)
                                        {
                                            // quantity is less then offer quantity
                                            item.ItemQuantity = anotherItem.ItemQuantity;
                                            item.RemainingOfferQuantity = item.RemainingOfferQuantity - item.ItemQuantity;
                                            BillSummary.OrderAmount += (item.ItemPrice * item.ItemQuantity);
                                            BillSummary.Discount += ((item.ActualSellPrice * item.ItemQuantity) - (item.ItemPrice * item.ItemQuantity));
                                            indexOf = ItemProfileCollectionNew.IndexOf(anotherItem);
                                            ItemProfileCollectionNew.RemoveAt(indexOf);
                                            ItemProfileCollectionNew.Insert(indexOf, item);
                                            InsertTempTranscationItemData(item);
                                            UpdateOnWindow();
                                        }
                                        else
                                        {
                                            // quantity is greater then offer quantity
                                            //for adding record of offer item
                                            indexOf = ItemProfileCollectionNew.IndexOf(anotherItem);
                                            ItemProfileCollectionNew.RemoveAt(indexOf);

                                            var nonOfferQuantity = anotherItem.ItemQuantity - item.RemainingOfferQuantity;
                                            var getOfferItemPosObj = GetNewPosItem(item, item.RemainingOfferQuantity, item.ItemOffer);
                                            UpdateCurrentTotalAndDiscount(getOfferItemPosObj, getOfferItemPosObj.ItemQuantity, getOfferItemPosObj.ItemQuantity, false);
                                            InsertTempTranscationItemData(getOfferItemPosObj);
                                            //for adding record of non offer item                                            
                                            var getNonOfferItemObj = GetNewPosItem(item, nonOfferQuantity);
                                            UpdateCurrentTotalAndDiscount(getNonOfferItemObj, nonOfferQuantity, getOfferItemPosObj.ItemQuantity, false);
                                            InsertTempTranscationItemData(getNonOfferItemObj);
                                            UpdateOnWindow();
                                        }
                                    }
                                    else
                                    {
                                        UpdateOnWindow();
                                    }
                                }
                            }
                            else
                            {
                                bool resultOperationCount = ValidateQuantityAmountDecreaes(SelectedItemProfile);
                                if (resultOperationCount == true)
                                {
                                    // there is no offer item with same barcode
                                    item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.PosItemId == SettingHelpers.CurrentPosItemId).FirstOrDefault();
                                    if (item != null)
                                    {
                                        BillSummary.OrderAmount -= (item.ItemPrice * item.ItemQuantity);
                                        BillSummary.Discount -= ((item.ActualSellPrice * item.ItemQuantity) -
                                                   (item.ItemPrice * item.ItemQuantity));

                                        int indexOf = ItemProfileCollectionNew.IndexOf(item);
                                        ItemProfileCollectionNew.RemoveAt(indexOf);
                                        DeletePosTransItem(item.ItemQuantity, true);
                                    }
                                    else
                                    {
                                        DeletePosTransItem(0, false);
                                    }
                                }
                                else
                                {
                                    _posWindow.TxtBarcode.Text = "";
                                    CustomerQuantity = null;
                                }

                            }
                        }
                        #endregion

                        #region "normal item processing"
                        else
                        {
                            bool resultOperationCount = ValidateQuantityAmountDecreaes(SelectedItemProfile);
                            if (resultOperationCount == true)
                            {
                                item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.PosItemId == SettingHelpers.CurrentPosItemId).FirstOrDefault();
                                if (item != null)
                                {
                                    BillSummary.OrderAmount -= (item.ItemPrice * item.ItemQuantity);
                                    int indexOf = ItemProfileCollectionNew.IndexOf(item);
                                    ItemProfileCollectionNew.RemoveAt(indexOf);
                                    DeletePosTransItem(item.ItemQuantity, false);
                                }
                                else
                                {
                                    DeletePosTransItem(0, false);
                                }
                            }
                            else
                            {
                                _posWindow.TxtBarcode.Text = "";
                                CustomerQuantity = null;
                            }

                        }
                        #endregion

                        UpdateOnWindow();
                    }
                    #endregion

                    SettingHelpers.IsItemSelected = false;
                    SelectedItemProfile = null;
                }
                #endregion

                #region "new item add in list processing"
                else
                {
                    BackgroundWorker bgInsertTempTransForItemOffer = new System.ComponentModel.BackgroundWorker();
                    bgInsertTempTransForItemOffer.DoWork += bgInsertTempTransForItemOffer_DoWork;
                    bgInsertTempTransForItemOffer.RunWorkerCompleted += bgInsertTempTransForItemOffer_RunWorkerCompleted;
                    //Add New Item in Grid GetItemProfileByBarcode
                    if (!_posWindow.TxtQuantity.IsFocused)
                    {
                        //Check if item is in offer
                        SelectedItemProfile = GetItemOfferDataByBarcode(BarcodeNo);
                        if (SelectedItemProfile == null)
                        {
                            //if Item not exists in item offer then check item in item profile.
                            SelectedItemProfile = GetItemProfileByBarcode();
                        }
                    }
                    if (SelectedItemProfile != null)
                    {
                        if (!_posWindow.TxtQuantity.IsFocused)
                        {
                            if (!SelectedItemProfile.IsActive)
                            {
                                ReportInActiveItemIncident();
                            }

                            ItemName = SelectedItemProfile.ItemName;
                            _posWindow.TxtQuantity.Focus();
                            CustomerQuantity = 1;
                            _posWindow.TxtQuantity.SelectAll();

                        }
                        else
                        {
                            if (CustomerQuantity != null)
                            {
                                ItemName = SelectedItemProfile.ItemName;
                                if (ItemProfileCollectionNew.Any(x => x.Barcode == BarcodeNo))
                                {
                                    //For Same Item
                                    #region For Same Item
                                    var item = ItemProfileCollectionNew.FirstOrDefault(x => x.Barcode == BarcodeNo);
                                    if (item != null && item.IsOfferItem && !item.IfCustomerPriceLessThanOfferPrice)
                                    {
                                        //if item has no remainging quantity the add item in other item with same barcode
                                        if (item.RemainingOfferQuantity == 0)
                                        {
                                            item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo && x.IsOfferItem == false).FirstOrDefault();
                                            if (item != null)
                                            {
                                                UpdatePOSTempTransItem(CustomerQuantity.Value + item.ItemQuantity, false);
                                                UpdateCurrentTotalAndDiscount(item, CustomerQuantity.Value, item.ItemQuantity, true);
                                                UpdateOnWindow();
                                            }
                                            else
                                            {
                                                //if item not exists then add new item.
                                                item = ItemProfileCollectionNew.Where(x => x.Barcode == BarcodeNo).FirstOrDefault();
                                                var getNewPosObj = GetNewPosItem(item, CustomerQuantity.Value);
                                                UpdateCurrentTotalAndDiscount(getNewPosObj, CustomerQuantity.Value, item.ItemQuantity, false);
                                                InsertTempTranscationItemData(getNewPosObj);
                                                UpdateOnWindow();
                                            }
                                        }
                                        else
                                        {
                                            // if offer item has remaining quantity for offer item.
                                            if (CustomerQuantity.Value > item.RemainingOfferQuantity)
                                            {
                                                //add 2 item. one is remaing qunatity with offer item and 2nd is without offer.
                                                int remaingingQuantity = item.RemainingOfferQuantity;
                                                UpdateCurrentTotalAndDiscount(item, item.RemainingOfferQuantity, item.ItemQuantity, true);
                                                item.RemainingOfferQuantity = 0;
                                                UpdatePOSTempTransItem(item.ItemQuantity + item.RemainingOfferQuantity, true);

                                                //for adding remaing item quatity without offer.
                                                var posItem = GetNewPosItem(item, CustomerQuantity.Value - remaingingQuantity);
                                                posItem.IsOfferItem = false;

                                                UpdateCurrentTotalAndDiscount(posItem, posItem.ItemQuantity, posItem.ItemQuantity, false);
                                                InsertTempTranscationItemData(posItem);
                                                UpdateOnWindow();
                                            }
                                            else
                                            {
                                                // item offer has still remainig quantity.
                                                item.RemainingOfferQuantity = item.RemainingOfferQuantity - CustomerQuantity.Value;
                                                UpdatePOSTempTransItem(item.ItemQuantity + CustomerQuantity.Value, true);
                                                UpdateCurrentTotalAndDiscount(item, CustomerQuantity.Value, item.ItemQuantity, true);
                                                UpdateOnWindow();
                                            }
                                        }
                                        //end Is Offer
                                    }
                                    else
                                    {
                                        if (item != null)
                                        {
                                            var itemsCount = (item.ItemQuantity + CustomerQuantity.Value);
                                            if (item.AvailableQuantity < (itemsCount * item.BaseUnitCount))
                                            {
                                                _overQuantityValue = (itemsCount * SelectedItemProfile.BaseUnitCount);
                                                if (!ReportOverQuantityIncident()) { }
                                                // return;
                                            }
                                            UpdatePOSTempTransItem(itemsCount, false);
                                            UpdateCurrentTotalAndDiscount(item, CustomerQuantity.Value, item.ItemQuantity, true);
                                            UpdateOnWindow();
                                        }
                                    }
                                    #endregion
                                }
                                else
                                {
                                    #region For Newly Item
                                    var posItemACList = new List<POSItemDetail>();
                                    if (!SettingHelpers.IsUnRegisteredItem)
                                    {
                                        if (SelectedItemProfile.AvailableQuantity < (CustomerQuantity.Value * SelectedItemProfile.BaseUnitCount))
                                        {
                                            _overQuantityValue = (CustomerQuantity.Value * SelectedItemProfile.BaseUnitCount);
                                            if (!ReportOverQuantityIncident())
                                            { }// return;
                                        }
                                    }

                                    SettingHelpers.IsUnRegisteredItem = false;
                                    BackgroundWorker bgInsertTempTranscation = new BackgroundWorker();
                                    if (SelectedItemProfile.IsOfferItem && !SelectedItemProfile.IfCustomerPriceLessThanOfferPrice)
                                    {
                                        //if  customer quantity is grater than quantity limit then apply only quantity limit quantity and remaing quantity is without offer
                                        if (CustomerQuantity.Value >= SelectedItemProfile.RemainingOfferQuantity)
                                        {
                                            UpdateCurrentTotalAndDiscount(SelectedItemProfile, SelectedItemProfile.RemainingOfferQuantity, SelectedItemProfile.ItemQuantity, false);
                                            posItemACList.Add(SelectedItemProfile);
                                            if (CustomerQuantity.Value != SelectedItemProfile.RemainingOfferQuantity)
                                            {
                                                //for adding non offer item.
                                                var posItem = GetNewPosItem(SelectedItemProfile, CustomerQuantity.Value - SelectedItemProfile.ItemQuantity);
                                                UpdateCurrentTotalAndDiscount(posItem, posItem.ItemQuantity, posItem.OldQuantity, false);
                                                posItemACList.Add(posItem);
                                            }
                                            SelectedItemProfile.RemainingOfferQuantity = 0;
                                            bgInsertTempTransForItemOffer.RunWorkerAsync(posItemACList);
                                        }
                                        else
                                        {
                                            UpdateCurrentTotalAndDiscount(SelectedItemProfile, CustomerQuantity.Value, SelectedItemProfile.ItemQuantity, false);
                                            SelectedItemProfile.RemainingOfferQuantity = SelectedItemProfile.RemainingOfferQuantity - SelectedItemProfile.ItemQuantity;
                                            posItemACList.Add(SelectedItemProfile);
                                            bgInsertTempTransForItemOffer.RunWorkerAsync(posItemACList);
                                        }

                                    }
                                    else
                                    {
                                        //item is not in offer
                                        posItemACList.Add(SelectedItemProfile);
                                        UpdateCurrentTotalAndDiscount(SelectedItemProfile, CustomerQuantity.Value, SelectedItemProfile.ItemQuantity, false);
                                        bgInsertTempTransForItemOffer.RunWorkerAsync(posItemACList);
                                    }
                                    UpdateOnWindow();
                                    #endregion
                                }
                            }
                            SelectedItemProfile = null;
                        }
                    }
                    #region "item does not exists"
                    else
                    {
                        ReportUnRegisterItemIncident();
                    }
                    #endregion
                }
                #endregion
            }
        }

        private POSItemDetail GetNewPosItem(POSItemDetail selectedItemProfile, int quantity, ItemOffer offer = null)
        {
            var posItemAc = new POSItemDetail(CustomerInformation.Customer, selectedItemProfile.ItemProfile, offer, SettingHelpers.BalanceBarcodeConfigurationObject);
            posItemAc.ItemQuantity = quantity;
            posItemAc.Barcode = selectedItemProfile.Barcode;
            posItemAc.Flavour = selectedItemProfile.Flavour;
            posItemAc.ItemId = selectedItemProfile.ItemId;
            posItemAc.ItemName = selectedItemProfile.ItemName;
            posItemAc.Unit = selectedItemProfile.Unit;
            posItemAc.IsOfferItem = offer != null;
            posItemAc.AvailableQuantity = selectedItemProfile.AvailableQuantity;
            posItemAc.IsActive = selectedItemProfile.IsActive;
            posItemAc.HasOffer = selectedItemProfile.HasOffer;
            posItemAc.BaseUnitCount = selectedItemProfile.BaseUnitCount;
            //  posItemAc.QuantityLimit = selectedItemProfile.QuantityLimit;
            return posItemAc;
        }

        private void UpdateCurrentTotalAndDiscount(POSItemDetail posItem, int requireQuantity, int oldQuantity, bool isUpdate)
        {
            if (isUpdate)
            {
                BillSummary.OrderAmount -= (posItem.ItemPrice * posItem.ItemQuantity);
                BillSummary.Discount -= ((posItem.ActualSellPrice * posItem.ItemQuantity) - (posItem.ItemPrice * posItem.ItemQuantity));
                oldQuantity = posItem.ItemQuantity;
                posItem.ItemQuantity = requireQuantity + oldQuantity;
                BillSummary.OrderAmount += (posItem.ItemPrice * posItem.ItemQuantity);
                int indexOf = ItemProfileCollectionNew.IndexOf(posItem);
                ItemProfileCollectionNew.RemoveAt(indexOf);
                ItemProfileCollectionNew.Insert(indexOf, posItem);
            }
            else
            {
                posItem.ItemQuantity = requireQuantity;
                BillSummary.OrderAmount += (posItem.ItemPrice * posItem.ItemQuantity);
                SettingHelpers.ItemPurchaseCount = SettingHelpers.ItemPurchaseCount + 1;
                posItem.PosItemId = SettingHelpers.ItemPurchaseCount;
                ItemProfileCollectionNew.Add(posItem);
            }
            BillSummary.Discount += ((posItem.ActualSellPrice * posItem.ItemQuantity) - (posItem.ItemPrice * posItem.ItemQuantity));
        }

        private void UpdateOnWindow()
        {
            BarcodeNo = "";
            ItemName = string.Empty;
            CustomerQuantity = null;
            _posWindow.TxtBarcode.Focus();
        }
        private bool ReportOverQuantityIncident()
        {
            var bgIncidentReport = new BackgroundWorker();
            SettingHelpers.IsOverQuantityItem = true;
            bgIncidentReport.DoWork += bgOverQuantityIncidentReport_DoWork;
            bgIncidentReport.RunWorkerAsync(SelectedItemProfile);
            SettingHelpers.IsOverQuantityItem = false;
            return true;
        }
        private bool ReportInActiveItemIncident()
        {
            var bgWorker = new BackgroundWorker();
            bgWorker.DoWork += bgInActiveIncidentReport_DoWork;
            bgWorker.RunWorkerAsync(SelectedItemProfile);
            SelectedItemProfile.IsActive = true;
            return true;
        }
        private void ReportUnRegisterItemIncident()
        {
            MessageBoxResult messageResult = MessageBox.Show(StringConstants.ItemNotExists, "Item Not Found", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (messageResult == MessageBoxResult.Yes)
            {
                SettingHelpers.IsUnRegisteredItem = true;
                SupervisorLogin supervisorLogins = new SupervisorLogin();
                supervisorLogins.Owner = _posWindow;
                var result = supervisorLogins.ShowDialog();
                if (result == true)
                {
                    SettingHelpers.IsUnRegisteredItem = true;
                }
            }
            else
            {
                UpdateOnWindow();
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
                    if (value == 0)
                        return true;
                    if (Regex.IsMatch(value.ToString(), @"^((?:[1-9]\d*)|(?:(?=[\d.]+)(?:[1-9]\d*|0)\.\d+))$"))
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
        #endregion Get Item Profile or Offer Data Command
        #endregion

        #region Private Method

        private void InitializeCustomerAndBillSummary()
        {
            CustomerInformation = new CustomerInformation
            {
                Customer = new DomainModel.Models.Customer.CustomerProfile
                {
                    MembershipCode = 00001,
                    Name = "Walkin",
                    IsWalkIn = true,
                    Id = 1
                }
            };
            BillSummary = new BillSummary() { TotalAmount = 0 };
        }

        /// <summary>
        /// This method  is used for Inser data in POSTempTransItem table for Item Offer data.
        /// </summary>
        /// <returns>boolen</returns>
        private void InsertTempTranscationItemData(POSItemDetail posItem)
        {
            POSTempTransItem tempItem = new POSTempTransItem();
            tempItem.Barcode = posItem.Barcode;
            tempItem.CreatedDateTime = DateTime.Now;
            tempItem.ItemID = posItem.ItemId;
            tempItem.Quantity = posItem.ItemQuantity;
            tempItem.ItemPrice = posItem.ItemPrice;
            tempItem.TempTransID = SettingHelpers.CurrentTempTransId;
            tempItem.IsOfferItem = posItem.IsOfferItem;
            _posRepository.AddPosTempTranItem(tempItem);
        }
        /// <summary>
        /// This method is used for insert temp data for puchase item by customer for offer Item. - PS
        /// </summary>
        /// <returns></returns>
        private bool InsertTempTranscationForItem(List<POSItemDetail> lstPosItemAc)
        {
            try
            {
                POSTempTrans tempTrans = new POSTempTrans();
                tempTrans.BranchID = SettingHelpers.CurrentBranchId;
                tempTrans.CreatedDateTime = DateTime.Now;
                if (CustomerInformation.Customer != null && CustomerInformation.Customer.Id != 0)
                    tempTrans.CustomerID = CustomerInformation.Customer.Id;
                else
                    tempTrans.CustomerID = 1;
                tempTrans.IsSuspendedBill = false;
                tempTrans.PurchaseOrderNo = null;
                if (CustomerInformation.ReturnBill != null)
                {
                    tempTrans.ReturnedBillNo = CustomerInformation.ReturnBill.ReturnedBillNo;
                }
                tempTrans.TransDate = DateTime.Now;
                tempTrans.TransReference = string.Empty;
                tempTrans.UserID = SettingHelpers.CurrentUserId;

                var tempTranObj = _posRepository.AddPosTempTransaction(tempTrans);

                if (tempTranObj != null)
                {
                    SettingHelpers.CurrentTempTransId = tempTranObj.Id;
                    foreach (var posItem in lstPosItemAc)
                    {
                        InsertTempTranscationItemData(posItem);
                    }
                    return true;
                }
                return false;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// This method is used for update POSTempTransItem  table
        /// </summary>
        /// <returns></returns>
        private void UpdatePOSTempTransItem(int Quantiy, bool isOfferItem)
        {
            POSTempTransItem posTempTransItem = new POSTempTransItem();
            posTempTransItem.Quantity = Quantiy;
            posTempTransItem.Barcode = BarcodeNo;
            posTempTransItem.TempTransID = SettingHelpers.CurrentTempTransId;
            posTempTransItem.IsOfferItem = isOfferItem;
            posTempTransItem.ModifiedDateTime = DateTime.UtcNow;
            _posRepository.UpdatePosTempTransItem(posTempTransItem);
        }
        /// <summary>
        /// This method is used for getting item offer object by barcode.
        /// </summary>
        /// <returns></returns>
        private POSItemDetail GetItemOfferDataByBarcode(string barCodeNumber)
        {
            try
            {
                var itemOfferObj = GetItemOfferData(barCodeNumber);
                if (itemOfferObj != null)
                {
                    ItemName = itemOfferObj.ItemProfile.ItemNameEn;
                    var posItemObj = new POSItemDetail(CustomerInformation.Customer, itemOfferObj.ItemProfile, itemOfferObj, SettingHelpers.BalanceBarcodeConfigurationObject)
                    {
                        Barcode = BarcodeNo,
                        Flavour = itemOfferObj.ItemProfile.FlavourEn,
                        ItemId = itemOfferObj.ItemProfile.Id,
                        ItemName = itemOfferObj.ItemProfile.ItemNameEn,
                        Unit = itemOfferObj.ItemProfile.SystemParameter.ValueEn,
                        IsOfferItem = true,
                        AvailableQuantity = itemOfferObj.AvailableQuantity,
                        IsActive = itemOfferObj.ItemProfile.IsActive,
                        RemainingOfferQuantity = itemOfferObj.QuantityLimit,
                        ItemOfferId = itemOfferObj.Id,
                        BaseUnitCount = itemOfferObj.ItemProfile.BaseUnit,
                        HasOffer = itemOfferObj.ItemProfile.IsOfferItem
                    };
                    return posItemObj;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        private ItemOffer GetItemOfferData(string barCodeNumber)
        {
            try
            {
                var itemOfferObj = _posRepository.GetItemOfferByBarCode(barCodeNumber, SettingHelpers.CurrentBranchId);
                if (itemOfferObj != null)
                {
                    //Check offer it Active or not
                    if (itemOfferObj.IsActive && !itemOfferObj.IsDeleted)
                    {
                        // Check offer Start and End date.
                        if (itemOfferObj.StartDateTime <= DateTime.Now && itemOfferObj.EndDateTime >= DateTime.Now)
                        {
                            var id = itemOfferObj.ItemProfile.ParentItem != null ? itemOfferObj.ItemProfile.ParentItem.Id : itemOfferObj.ItemId;
                            itemOfferObj.AvailableQuantity = GetItemActualQuantity(id);
                            return itemOfferObj;
                        }
                    }
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }
        /// <summary>
        /// This method is used for getting item profile object by Barcode
        /// </summary>
        /// <returns></returns>
        private POSItemDetail GetItemProfileByBarcode()
        {
            try
            {
                var itemProfileObj = _posRepository.GetItemProfileByBarcode(BarcodeNo, SettingHelpers.CurrentBranchId);
                if (itemProfileObj != null)
                {
                    int actualQuantity = 0;
                    actualQuantity = GetItemActualQuantity(itemProfileObj.ParentItem != null
                        ? itemProfileObj.ParentItem.Id : itemProfileObj.Id);
                    ItemName = itemProfileObj.ItemNameEn;
                    var posItemObj = new POSItemDetail(CustomerInformation.Customer, itemProfileObj, null, SettingHelpers.BalanceBarcodeConfigurationObject)
                    {
                        Barcode = BarcodeNo,
                        Flavour = itemProfileObj.FlavourEn,
                        ItemId = itemProfileObj.Id,
                        ItemName = itemProfileObj.ItemNameEn,
                        Unit = itemProfileObj.SystemParameter.ValueEn,
                        AvailableQuantity = actualQuantity,
                        IsActive = itemProfileObj.IsActive,
                        BaseUnitCount = itemProfileObj.BaseUnit,
                        HasOffer = itemProfileObj.IsOfferItem
                    };
                    return posItemObj;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        private int GetItemActualQuantity(int itemId)
        {
            var itemQuantityData = _posRepository.GetItemQuantityByItemId(itemId, SettingHelpers.CurrentBranchId);
            if (itemQuantityData != null)
                return itemQuantityData.ActualQuantity;
            return 0;
        }
        private void DeletePosTransItem(int quantity, bool isOfferItem)
        {
            POSTempTransItem posTempTrans = new POSTempTransItem();
            posTempTrans.TempTransID = SettingHelpers.CurrentTempTransId;
            posTempTrans.Barcode = BarcodeNo;
            posTempTrans.Quantity = quantity;
            posTempTrans.IsOfferItem = isOfferItem;
            _posRepository.DeletePOSTempIransItem(posTempTrans);
        }
        private void DeletePosTransItemByBarCode(string barcode)
        {
            POSTempTransItem posTempTrans = new POSTempTransItem();
            posTempTrans.TempTransID = SettingHelpers.CurrentTempTransId;
            posTempTrans.Barcode = barcode;
            _posRepository.DeletePOSTempIransItemByBarcode(posTempTrans);
        }

        /// <summary>
        /// This method is used for getting Temp transcation data if casher is not logout. (Cashier logout by Keep Session and LogOut)
        /// </summary>
        private POSTempTrans GetPendingTempTranscationItemData(bool isUnsuspend)
        {
            POSTempTrans tempTrans = null;
            if (!isUnsuspend)
                tempTrans = _posRepository.GetPOSTempTransByUserId(Utility.SettingHelpers.CurrentUserId);
            else
                tempTrans = _posRepository.GetPosTempTransByTransId(Utility.SettingHelpers.CurrentTempTransId);
            if (tempTrans != null)
            {
                Utility.SettingHelpers.CurrentTempTransId = tempTrans.Id;
                if (!string.IsNullOrEmpty(tempTrans.PurchaseOrderNo))
                {
                    CustomerInformation.CPO = new DomainModel.Models.CustomerPurchaseOrder.CustomerPurchaseOrder
                    {
                        PurchaseOrderNo = tempTrans.PurchaseOrderNo,
                    };
                    SettingHelpers.IsCustomerPO = true;
                    BillSummary.AdditionalAmount = tempTrans.AdditionalAmount;
                    SettingHelpers.AdditionalAmount = BillSummary.AdditionalAmount == null ? 0 : BillSummary.AdditionalAmount.Value;
                    BillSummary.DownPayment = tempTrans.CpoDownPayment;
                }
                if (!String.IsNullOrEmpty(tempTrans.ReturnedBillNo))
                {
                    var returnBillData = _posRepository.GetPosReturnBillData(tempTrans.ReturnedBillNo);
                    if (returnBillData != null)
                    {
                        CustomerInformation.ReturnBill = returnBillData;
                        BillSummary.ReturnAmount = returnBillData.ReturnedCash;
                        BillSummary.Substitute = returnBillData.SubstituteItemsAmount;
                    }
                }
                CustomerInformation.Customer = tempTrans.CustomerProfile;
                var tempItemList = _posRepository.GetPosTempTransItemByTempTransId(Utility.SettingHelpers.CurrentTempTransId);
                if (tempItemList != null)
                {
                    ItemProfileCollectionNew = new ObservableCollection<POSItemDetail>();
                    BillSummary.Discount = 0;
                    BillSummary.OrderAmount = 0;
                    ProcessTempTransactionItems(tempItemList, false);
                }
            }
            if (SettingHelpers.CurrentCultureInfo != null)
            {
                //CurrencySymbol = SettingHelpers.CurrentCultureInfo.NumberFormat.CurrencySymbol;
            }
            return tempTrans;
        }

        /// <summary>
        /// This method is used for fill all object of POS window of selected item in by UnSuspeded item.
        /// </summary>
        private void UnSuspendCurrentItem()
        {
            var posTempTrans = GetPendingTempTranscationItemData(true);
            if (posTempTrans != null)
            {
                if (IsValidItem(posTempTrans))
                {
                    posTempTrans.IsSuspendedBill = false;
                    posTempTrans.ModifiedDateTime = DateTime.UtcNow;
                    _posRepository.UpdatePosTempTransForSuspendBill(posTempTrans);
                }
                else
                {
                    _posRepository.DeletePosTempTranscation(posTempTrans.Id);
                    _posRepository.DeleteAllPOSTempTransItem(posTempTrans.Id);
                    SettingHelpers.IsCustomerPO = false;
                    InitializeCustomerAndBillSummary();
                    ItemProfileCollectionNew.Clear();
                }
            }
        }

        private bool IsValidItem(POSTempTrans posTempTrans)
        {
            if (SettingHelpers.IsCustomerPO)
            {
                var cpoDetailData = _posRepository.GetCustomerPurchaseOrderInformation(posTempTrans.PurchaseOrderNo);
                if (cpoDetailData != null)
                {
                    if (cpoDetailData.IsCollected)
                    {
                        MessageBox.Show(StringConstants.CpoCollected, "CPO Already Collected", MessageBoxButton.OK, MessageBoxImage.Information);
                        return false;
                    }
                    else if (cpoDetailData.IsCancel)
                    {
                        MessageBox.Show(StringConstants.CpoCancelled, "CPO Canceled", MessageBoxButton.OK, MessageBoxImage.Information);
                        return false;
                    }
                }
            }
            else if (CustomerInformation.ReturnBill != null)
            {
                var returnBillData = _posRepository.GetPosReturnBillData(posTempTrans.ReturnedBillNo);
                if (returnBillData != null)
                {
                    if (!returnBillData.IsProcessed)
                    {
                        if (SettingHelpers.CurrentBranchId != returnBillData.IssuingBranchID)
                        {
                            if (!SettingHelpers.CompanyConfigruationObject.ReturnItem)
                            {
                                MessageBox.Show(string.Format(StringConstants.ReturnOtherBranchNotAllowd, returnBillData.BranchDetail.Name), "Return Item", MessageBoxButton.OK, MessageBoxImage.Information);
                                return false;
                            }
                        }
                    }
                    else
                    {
                        MessageBox.Show(string.Format(StringConstants.ReturnBillProceed, returnBillData.BranchDetail.Name), "Return Item", MessageBoxButton.OK, MessageBoxImage.Information);
                        return false;
                    }
                }
            }
            return true;
        }
        public void ProcessTempTransactionItems(List<POSTempTransItem> tempItemList, bool isCustomer)
        {
            ItemOffer offer;
            var itemDictionary = new Dictionary<string, List<POSTempTransItem>>();

            #region "Get Similar Records Together"
            foreach (var item in tempItemList)
            {
                if (itemDictionary.ContainsKey(item.Barcode))
                {
                    itemDictionary[item.Barcode].Add(item);
                }
                else
                {
                    itemDictionary.Add(item.Barcode, new List<POSTempTransItem> { item });
                }
            }
            #endregion

            foreach (var itemKey in itemDictionary)
            {
                POSItemDetail item1;
                POSItemDetail item2;

                var itemProfile = itemKey.Value.First();
                offer = GetItemOfferData(itemKey.Key);

                int itemQuantity = itemKey.Value.Sum(x => x.Quantity);


                item1 = new POSItemDetail(CustomerInformation.Customer, itemProfile.ItemProfile, offer, SettingHelpers.BalanceBarcodeConfigurationObject);
                item1.Barcode = itemProfile.Barcode;
                item1.ItemName = itemProfile.ItemProfile.ItemNameEn;
                item1.Flavour = itemProfile.ItemProfile.FlavourEn;
                item1.Unit = itemProfile.ItemProfile.SystemParameter.ValueEn;
                item1.ItemId = itemProfile.ItemID;
                item1.BaseUnitCount = itemProfile.ItemProfile.BaseUnit;
                item1.HasOffer = itemProfile.ItemProfile.IsOfferItem;

                item2 = new POSItemDetail(CustomerInformation.Customer, itemProfile.ItemProfile, null, SettingHelpers.BalanceBarcodeConfigurationObject);
                item2.Barcode = itemProfile.Barcode;
                item2.ItemName = itemProfile.ItemProfile.ItemNameEn;
                item2.Flavour = itemProfile.ItemProfile.FlavourEn;
                item2.Unit = itemProfile.ItemProfile.SystemParameter.ValueEn;
                item2.ItemId = itemProfile.ItemID;
                item2.BaseUnitCount = itemProfile.ItemProfile.BaseUnit;
                item2.HasOffer = itemProfile.ItemProfile.IsOfferItem;

                DeletePosTransItemByBarCode(item1.Barcode);

                int itemId = itemProfile.ItemProfile.ParentItem != null ?
                    itemProfile.ItemProfile.ParentItem.Id : itemProfile.ItemProfile.Id;
                if (offer == null)
                {
                    item1.ItemQuantity = itemQuantity;
                    item1.AvailableQuantity = GetItemActualQuantity(itemId);
                    UpdateCurrentTotalAndDiscount(item1, item1.ItemQuantity, item1.ItemQuantity, false);
                    InsertTempTranscationItemData(item1);
                }
                else if (offer != null && item1.IfCustomerPriceLessThanOfferPrice)
                {
                    item1.IsOfferItem = false;
                    item1.RemainingOfferQuantity = item1.QuantityLimit;
                    item1.ItemQuantity = itemQuantity;
                    item1.AvailableQuantity = GetItemActualQuantity(itemId);
                    UpdateCurrentTotalAndDiscount(item1, item1.ItemQuantity, item1.ItemQuantity, false);
                    InsertTempTranscationItemData(item1);
                }
                else
                {
                    item1.IsOfferItem = true;
                    item1.AvailableQuantity = offer.AvailableQuantity;
                    if (itemQuantity <= offer.QuantityLimit)
                    {
                        item1.ItemQuantity = itemQuantity;
                        item1.RemainingOfferQuantity = offer.QuantityLimit - itemQuantity;
                        UpdateCurrentTotalAndDiscount(item1, item1.ItemQuantity, item1.ItemQuantity, false);
                        InsertTempTranscationItemData(item1);
                    }
                    else
                    {
                        item1.ItemQuantity = offer.QuantityLimit;
                        item1.RemainingOfferQuantity = 0;
                        UpdateCurrentTotalAndDiscount(item1, item1.ItemQuantity, item1.ItemQuantity, false);
                        InsertTempTranscationItemData(item1);
                        //create new record for non offer item
                        item2.ItemQuantity = itemQuantity - offer.QuantityLimit;
                        item2.AvailableQuantity = GetItemActualQuantity(itemId);
                        UpdateCurrentTotalAndDiscount(item2, item2.ItemQuantity, item2.ItemQuantity, false);
                        InsertTempTranscationItemData(item2);
                    }
                }
            }
        }

        private void UpdateReuturnBill()
        {
            if (CustomerInformation.ReturnBill != null)
            {
                POSReturnBill posReuturnObj = CustomerInformation.ReturnBill;
                posReuturnObj.IsProcessed = true;
                posReuturnObj.ProcessingBranchID = SettingHelpers.CurrentBranchId;
                posReuturnObj.ProcessorID = SettingHelpers.CurrentUserId;
                POSSession posSession = new POSSession();
                posSession.Id = SettingHelpers.CurrentPosSessionId;
                posSession.ReturnedBill = BillSummary.ReturnAmount.Value;
                posSession.ModifiedDateTime = DateTime.UtcNow;
                var status = _posRepository.UpdatePosReturnBillForPOs(posReuturnObj, posSession);

                if (status)
                {
                    #region accounting
                    var accountingEntries = new List<DoubleEntry>();
                    accountingEntries.Add(new DoubleEntry
                    {
                        Description = "Return Bill Entry Against Bill No:" + CustomerInformation.ReturnBill.ReturnedBillNo,
                        LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.CashInHand).Id,
                        ActivityName = StringConstants.ReturnBill,
                        Debit = 0,
                        Credit = BillSummary.ReturnAmount.Value,
                        CreatedDateTime = DateTime.UtcNow,
                        TransactionDate = DateTime.UtcNow
                    });
                    accountingEntries.Add(new DoubleEntry
                    {
                        Description = "Return Bill Entry Against Bill No:" + CustomerInformation.ReturnBill.ReturnedBillNo,
                        LedgerId = SettingHelpers.Ledgers.First(x => x.Name == StringConstants.SalesReturn).Id,
                        ActivityName = StringConstants.ReturnBill,
                        Debit = BillSummary.ReturnAmount.Value,
                        Credit = 0,
                        CreatedDateTime = DateTime.UtcNow,
                        TransactionDate = DateTime.UtcNow

                    });
                    _posRepository.AddAccountingEntries(accountingEntries);
                    #endregion

                    CustomerInformation.ReturnBill = null;
                    InitializeCustomerAndBillSummary();
                    MessageBox.Show(StringConstants.SuccessReturn, "Payment Done", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                    MessageBox.Show("There was some issue processing the request. Please contact support", "Return bill Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        private bool ValidateQuantityAmountDecreaes(POSItemDetail posItemAc)
        {
            bool result = false;
            if (SettingHelpers.OperationIncidentReport.Count > 0)
            {
                var cashierIncident = new CashierIncidentReport();
                cashierIncident = _posRepository.GetCashierIncidentReportByCashierId(SettingHelpers.CurrentUserId);
                int quantity = posItemAc.ItemQuantity - CustomerQuantity.Value;
                CashierIncidentReport cashierIncidentReport = new CashierIncidentReport();
                //Per Cashier Login Seesion
                if (cashierIncident != null)
                {
                    decimal totalAmountLimit = cashierIncident.AmountLimit + (quantity * posItemAc.ItemPrice);
                    if (totalAmountLimit > SettingHelpers.OperationIncidentReport[0].AmountLimit || (cashierIncident.OperationCounter + 1) > SettingHelpers.OperationIncidentReport[0].OperationCounter)
                    {
                        result = AskPermission(quantity, posItemAc.ItemPrice);
                    }
                    else
                    {
                        InsertIntoCashierIncidentReport((quantity * posItemAc.ItemPrice), SettingHelpers.CurrentUserId);
                        result = true;
                    }
                }
                else
                {
                    decimal totalAmountLimit = (quantity * posItemAc.ItemPrice);
                    if (totalAmountLimit > SettingHelpers.OperationIncidentReport[0].AmountLimit)
                    {
                        result = AskPermission(quantity, posItemAc.ItemPrice);
                    }
                    else
                    {
                        InsertIntoCashierIncidentReport((quantity * posItemAc.ItemPrice), SettingHelpers.CurrentUserId);
                        result = true;
                    }
                }

                //Reset Incident Report Table.
                //update by ankit (check incident report operation type is per period of time)
                if (UpdateResetIncidentReport())
                {
                    //changed by ankit
                    if (SettingHelpers.OperationIncidentReport.Count > 0)
                    {
                        _posRepository.UpdateIncidentReportByCashierId(SettingHelpers.CurrentUserId);
                    }
                }
            }
            return result;
        }

        private bool AskPermission(int quantity, decimal itemPrice)
        {
            MessageBox.Show("Please Contact to Branch Supervisor for Reset your Decrease Quantity/Amount Limit", "Quantity/Amount Limit", MessageBoxButton.OK, MessageBoxImage.Warning);
            bool result = false;
            SupervisorLogin supervisorLogins = new SupervisorLogin();
            supervisorLogins.Owner = _posWindow;
            SettingHelpers.IsManageIncidentReport = true;
            var result1 = supervisorLogins.ShowDialog();
            if (result1 == true)
            {
                InsertIntoCashierIncidentReport((quantity * itemPrice), SettingHelpers.CurrentUserId);
                result = true;
            }
            return result;
        }

        /// <summary>
        /// This method used for insert into cashier incident report table. -An
        /// </summary>
        /// <param name="totalAmount"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        private bool InsertIntoCashierIncidentReport(decimal totalAmount, int userId)
        {
            CashierIncidentReport cashierIncidentReport = new CashierIncidentReport();
            cashierIncidentReport.AmountLimit = totalAmount;
            cashierIncidentReport.CreatedDateTime = DateTime.UtcNow;
            cashierIncidentReport.OperationCounter = 1;
            cashierIncidentReport.UserId = userId;
            _posRepository.InsertDataInCashierIncidnetReport(cashierIncidentReport);
            return true;
        }

        private bool UpdateResetIncidentReport()
        {
            if (SettingHelpers.OperationIncidentReport[0].OperationTypeId == Convert.ToInt32(OperationTypes.PerPeriodOfTime))
            {
                if (SettingHelpers.OperationIncidentReport[0].StartDateTime != null && SettingHelpers.OperationIncidentReport[0].EndDateTime != null)
                {
                    if (SettingHelpers.OperationIncidentReport[0].DurationTypeId != null)
                    {
                        if (Convert.ToInt32(SettingHelpers.OperationIncidentReport[0].DurationTypeId) != Convert.ToInt32(OperationTypes.FullPeriod))
                        {
                            if (Convert.ToDateTime(SettingHelpers.OperationIncidentReport[0].StartDateTime) < DateTime.Now
                                && Convert.ToDateTime(SettingHelpers.OperationIncidentReport[0].EndDateTime) > DateTime.Now)
                            {
                                if (Convert.ToInt32(SettingHelpers.OperationIncidentReport[0].DurationTypeId) == Convert.ToInt32(OperationTypes.Day))
                                {
                                    return true;
                                }
                                else if (Convert.ToInt32(SettingHelpers.OperationIncidentReport[0].DurationTypeId) == Convert.ToInt32(OperationTypes.Week))
                                {
                                    var dayOfWeek = DateTime.Now.DayOfWeek;
                                    if (dayOfWeek.ToString() == "Monday")
                                        return true;
                                }
                                else if (Convert.ToInt32(SettingHelpers.OperationIncidentReport[0].DurationTypeId) == Convert.ToInt32(OperationTypes.Month))
                                {
                                    int day = DateTime.Now.Day;
                                    int startDay = Convert.ToDateTime(SettingHelpers.OperationIncidentReport[0].StartDateTime).Day;
                                    if (day == startDay)
                                        return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

        #endregion

        #region BackGroudWorker Event
        void bgInsertTempTranscation_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            UpdateOnWindow();
        }

        void bgInsertTempTransForItemOffer_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            UpdateOnWindow();
        }

        void bgInsertTempTransForItemOffer_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            var lstPosItemAc = e.Argument as List<POSItemDetail>;
            if (SettingHelpers.CurrentTempTransId == 0)
            {
                InsertTempTranscationForItem(lstPosItemAc);
            }
            else
            {
                foreach (var posItem in lstPosItemAc)
                {
                    InsertTempTranscationItemData(posItem);
                }
            }
        }

        /// <summary>
        /// This event is fire when item with such barcode is ith over quantity and it require to create Incident Report
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void bgOverQuantityIncidentReport_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            if (PosOverQuantityIncidentList == null)
                PosOverQuantityIncidentList = new List<PosIncidentReport>();
            var posItemAc = e.Argument as POSItemDetail;
            PosIncidentReport posIncidentReport = new PosIncidentReport();
            posIncidentReport.CommitedQuantity = 0;
            posIncidentReport.ItemId = posItemAc.ItemId;
            posIncidentReport.CommittedGainValue = 0;
            posIncidentReport.CommittedLossValue = 0;
            posIncidentReport.CostPrice = posItemAc.CostPrice;
            posIncidentReport.Price = posItemAc.ItemPrice;
            posIncidentReport.ShelfQuantity = 0;
            posIncidentReport.SystemQuantity = posItemAc.AvailableQuantity;
            posIncidentReport.IncidentType = 67;
            posIncidentReport.BranchId = SettingHelpers.CurrentBranchId;
            posIncidentReport.IsOverQuantityItem = true;
            posIncidentReport.ItemOverQuantity = _overQuantityValue;
            posIncidentReport.CreatedDateTime = DateTime.UtcNow;
            posIncidentReport.IsProcess = true;
            PosOverQuantityIncidentList.Add(posIncidentReport);
        }

        /// <summary>
        /// This event is fire when item with such barcode is InActive and it require to create Incident Report
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void bgInActiveIncidentReport_DoWork(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            var posItemAc = e.Argument as POSItemDetail;
            PosIncidentReport posIncidentReport = new PosIncidentReport();
            posIncidentReport.ItemId = posItemAc.ItemId;
            posIncidentReport.CommitedQuantity = 0;
            posIncidentReport.CommittedGainValue = 0;
            posIncidentReport.CommittedLossValue = 0;
            posIncidentReport.CostPrice = posItemAc.CostPrice;
            posIncidentReport.Price = posItemAc.ItemPrice;
            posIncidentReport.ShelfQuantity = 0;
            posIncidentReport.SystemQuantity = posItemAc.AvailableQuantity;
            posIncidentReport.IncidentType = 66;
            posIncidentReport.IsInActiveItem = true;
            posIncidentReport.CreatedDateTime = DateTime.UtcNow;
            posIncidentReport.IsProcess = true;
            posIncidentReport.BranchId = SettingHelpers.CurrentBranchId;
            _posRepository.InsertPosIncidentReport(posIncidentReport);
        }

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
    }
}




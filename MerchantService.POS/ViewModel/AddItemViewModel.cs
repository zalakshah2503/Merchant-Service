using GalaSoft.MvvmLight.CommandWpf;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.POS.Utility;
using MerchantService.Utility.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using MerchantService.POS.Repository;
using System.Text;
using System.Net.Http;
using Newtonsoft.Json;
namespace MerchantService.POS.ViewModel
{
    public class AddItemViewModel : INotifyPropertyChanged
    {
        AddItem _addItem;
        IPosRepository _posRepository;
        public AddItemViewModel(AddItem addItem)
        {
            _addItem = addItem;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            Barcode = SettingHelpers.CurrentBarcode;
            GetUnitTypeList();
        }


        #region Properties

        private bool _addItemErrorVisibility = false;
        public bool AddItemErrorVisibility
        {
            get { return _addItemErrorVisibility; }
            set
            {
                if (value != _addItemErrorVisibility)
                {
                    _addItemErrorVisibility = value;
                    OnPropertyChanged("AddItemErrorVisibility");
                }
            }
        }

        private string _errorText;

        public string ErrorText
        {
            get { return _errorText; }
            set
            {
                _errorText = value;
                OnPropertyChanged("ErrorText");
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

        private string _itemCode;
        public string ItemCode
        {
            get { return _itemCode; }
            set
            {
                if (value != _itemCode)
                {
                    _itemCode = value;
                    OnPropertyChanged("ItemCode");
                }
            }
        }


        private string _barcode;
        public string Barcode
        {
            get { return _barcode; }
            set
            {
                if (value != _barcode)
                {
                    _barcode = value;
                    OnPropertyChanged("Barcode");
                }
            }
        }

        private decimal _sellPrice;
        public decimal SellPrice
        {
            get { return _sellPrice; }
            set
            {
                if (value != _sellPrice)
                {
                    _sellPrice = value;
                    OnPropertyChanged("SellPrice");
                }
            }
        }
        private decimal _costPrice;
        public decimal CostPrice
        {
            get { return _costPrice; }
            set
            {
                _costPrice = value;
                OnPropertyChanged("CostPrice");
            }
        }

        private List<SystemParameter> _unitTypeCollection;
        public List<SystemParameter> UnitTypeCollection
        {
            get { return _unitTypeCollection; }
            set
            {
                if (value != _unitTypeCollection)
                {
                    _unitTypeCollection = value;
                    OnPropertyChanged("UnitTypeCollection");
                }
            }
        }

        private SystemParameter _cateogoryCollection;
        public SystemParameter CateogoryCollection
        {
            get { return _cateogoryCollection; }
            set
            {
                if (value != _cateogoryCollection)
                {
                    _cateogoryCollection = value;
                    OnPropertyChanged("CateogoryCollection");
                }
            }
        }


        private int _baseUnitCount;
        public int BaseUnitCount
        {
            get { return _baseUnitCount; }
            set
            {
                if (value != _baseUnitCount)
                {
                    _baseUnitCount = value;
                    OnPropertyChanged("BaseUnitCount");
                }
            }
        }
        #endregion

        #region Commonad
        #region SubmitCommand Command

        public ICommand SubmitCommand
        {
            get
            {
                return new RelayCommand(() => this.SubmitItem());
            }
        }

        public void SubmitItem()
        {
            if (string.IsNullOrEmpty(ItemName) || string.IsNullOrEmpty(ItemCode) ||
                CostPrice <= 0 || SellPrice <= 0 || BaseUnitCount <= 0)
            {
                AddItemErrorVisibility = true;
                ErrorText = StringConstants.AllFieldsAreMandatory;
                return;
            }
            var sellPriceWithProfileMargin = CostPrice + ((CostPrice * Convert.ToInt32(SettingHelpers.CompanyConfigruationObject.ProfitMargin)) / 100);
            if (SellPrice < sellPriceWithProfileMargin)
            {
                AddItemErrorVisibility = true;
                ErrorText = StringConstants.SellPriceValidation;
                return;
            }
            if (CheckForUniqueItemcode(ItemCode))
            {
                AddItemErrorVisibility = false;
                ErrorText = string.Empty;
                ItemProfile itemProfile = new ItemProfile();
                itemProfile.UnitParamTypeId = ((SystemParameter)_addItem.cbUnitType.SelectedItem).Id;
                itemProfile.CategoryId = 1;
                itemProfile.ParentItemId = null;
                itemProfile.IsActive = true;
                itemProfile.Barcode = Barcode;
                itemProfile.ItemNameEn = ItemName;
                itemProfile.ItemNameSl = ItemName;
                itemProfile.CompanyId = SettingHelpers.CompanyConfigruationObject.CompanyId;
                itemProfile.BaseUnit = BaseUnitCount;
                itemProfile.FlavourEn = null;
                itemProfile.FlavourSl = null;
                itemProfile.IsDeleted = false;
                itemProfile.HasOffer = false;
                itemProfile.IsOfferItem = false;
                itemProfile.IsParentItem = true;
                itemProfile.IsAutomaticPO = false;
                itemProfile.CostPrice = CostPrice;
                itemProfile.SellPrice = SellPrice;
                itemProfile.SellPriceA = SellPrice;
                itemProfile.SellPriceB = SellPrice;
                itemProfile.SellPriceC = SellPrice;
                itemProfile.SellPriceD = SellPrice;
                itemProfile.Code = ItemCode;
                itemProfile.PreviousCostPrice = CostPrice;
                itemProfile.ProfitMargin = Convert.ToInt32(SettingHelpers.CompanyConfigruationObject.ProfitMargin);
                itemProfile.CreatedDateTime = DateTime.UtcNow;

                int id = _posRepository.AddUnregisteredItem(itemProfile);

                BackgroundWorker bgUnRegisteredIncident = new BackgroundWorker();
                bgUnRegisteredIncident.DoWork += bgUnRegisteredIncident_DoWork;
                bgUnRegisteredIncident.RunWorkerCompleted += bgUnRegisteredIncident_RunWorkerCompleted;
                bgUnRegisteredIncident.RunWorkerAsync(id);

                SettingHelpers.IsUnRegisteredItem = false;
                _addItem.DialogResult = true;
                _addItem.Close();
            }
            else
            {
                AddItemErrorVisibility = true;
                ErrorText = StringConstants.UniqueItemCode;
                return;
            }
        }

        private bool CheckForUniqueItemcode(string itemCode)
        {
            return _posRepository.CheckForUniqueItemcode(itemCode);
        }

        void bgUnRegisteredIncident_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {            
        }

        void bgUnRegisteredIncident_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                string itemId = e.Argument.ToString();
                PosIncidentReport posIncidentReport = new PosIncidentReport();
                posIncidentReport.ItemId = Convert.ToInt32(itemId);
                posIncidentReport.CommitedQuantity = 0;
                posIncidentReport.CommittedGainValue = 0;
                posIncidentReport.CommittedLossValue = 0;
                posIncidentReport.CostPrice = CostPrice;
                posIncidentReport.Price = SellPrice;
                posIncidentReport.ShelfQuantity = 0;
                posIncidentReport.SystemQuantity = 0;
                posIncidentReport.IncidentType = 65;
                posIncidentReport.BranchId = SettingHelpers.CurrentBranchId;
                posIncidentReport.IsRegisterItem = true;
                posIncidentReport.CreatedDateTime = DateTime.UtcNow;
                posIncidentReport.IsProcess = true;
                _posRepository.InsertPosIncidentReport(posIncidentReport);
            }
            catch (Exception)
            {

                throw;
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
            _addItem.DialogResult = false;
            _addItem.Close();
        }

        #endregion CanelCommand Command
        #endregion

        #region INotifyPropertyChanged implementation

        public event PropertyChangedEventHandler PropertyChanged = delegate { };
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        #endregion INotifyPropertyChanged implementation


        #region Private Method
        private void GetUnitTypeList()
        {
            UnitTypeCollection = _posRepository.GetUnitType(SettingHelpers.CompanyConfigruationObject.CompanyId);
            if (UnitTypeCollection.Any())
            {
                _addItem.cbUnitType.SelectedIndex = 0;
            }
        }
        #endregion
    }
}
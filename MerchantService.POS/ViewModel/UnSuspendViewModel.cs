using GalaSoft.MvvmLight.CommandWpf;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using MerchantService.DomainModel.Models.POS;
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using MerchantService.Repository.ApplicationClasses.POS;
using System.Windows.Controls;
using MerchantService.POS.Utility;
using MerchantService.POS.Repository;

namespace MerchantService.POS.ViewModel
{
    public class UnSuspendViewModel : INotifyPropertyChanged
    {
        UnsuspendBill _unSuspendBill;
        private IPosRepository _posRepository;
        //public ObservableCollection<POSTempTranscationAC> tempCollection;
        public UnSuspendViewModel(UnsuspendBill unSuspendBill)
        {
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            _unSuspendBill = unSuspendBill;
            GetUnsupendBillList();
        }

        #region Properties

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


        private ObservableCollection<POSTempTranscationAC> _tempTransItemCollection = new ObservableCollection<POSTempTranscationAC>();
        public ObservableCollection<POSTempTranscationAC> TempTransItemCollection
        {
            get { return _tempTransItemCollection; }
            set
            {
                if (value != _tempTransItemCollection)
                {
                    _tempTransItemCollection = value;
                    OnPropertyChanged("TempTransItemCollection");

                }
            }
        }
        #endregion

        #region Commands
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
            _unSuspendBill.Close();
        }

        #endregion Cancel Command
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

        #region Private Methods
        private void GetUnsupendBillList()
        {
            try
            {
                TempTransItemCollection = new ObservableCollection<POSTempTranscationAC>();

                var suspendedBills = _posRepository.GetSuspendBillList(SettingHelpers.CurrentUserId);
                if (suspendedBills.Any())
                {

                    foreach (var item in suspendedBills)
                    {
                        POSTempTranscationAC tempTansAc = new POSTempTranscationAC();
                        tempTansAc.CustomerId = item.CustomerID;
                        tempTansAc.POSTempTransId = item.Id;
                        tempTansAc.Reference = item.TransReference;
                        tempTansAc.TransDate = item.TransDate;
                        var tempTranItems = _posRepository.GetPosTempTransItemByTempTransId(item.Id);

                        if (tempTranItems.Any())
                        {
                            var posTempItemACList = new ObservableCollection<POSTempItemAC>();
                            foreach (var tempItem in tempTranItems)
                            {
                                POSTempItemAC tempItemAc = new POSTempItemAC();
                                tempItemAc.Barcode = tempItem.Barcode;
                                tempItemAc.ItemFlavor = tempItem.ItemProfile.FlavourEn;
                                tempItemAc.ItemId = tempItem.ItemProfile.Id;
                                tempItemAc.ItemName = tempItem.ItemProfile.ItemNameEn;
                                tempItemAc.ItemPrice = tempItem.ItemPrice;
                                tempItemAc.POSTempItemId = tempItem.Id;
                                tempItemAc.Quantity = tempItem.Quantity;
                                tempItemAc.UnitName = tempItem.ItemProfile.SystemParameter.ValueEn;
                                posTempItemACList.Add(tempItemAc);

                            }
                            tempTansAc.POSTempItemForChild = posTempItemACList;
                        }
                        TempTransItemCollection.Add(tempTansAc);
                    }
                    _unSuspendBill.dg1.SelectedIndex = 0;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion
    }

}


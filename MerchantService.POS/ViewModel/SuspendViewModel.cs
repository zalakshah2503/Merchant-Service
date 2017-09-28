using GalaSoft.MvvmLight.Command;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using MerchantService.DomainModel.Models.POS;
using MerchantService.POS.Utility;
using Newtonsoft.Json;
using System.Net.Http;
using MerchantService.Utility.Constants;
using MerchantService.POS.Repository;

namespace MerchantService.POS.ViewModel
{
    public class SuspendViewModel : INotifyPropertyChanged
    {
        public SuspendBill _suspendBill;
        public POSWindow _posWindow;
        public IPosRepository _posRepository;
        public SuspendViewModel(SuspendBill suspendBill)
        {
            if (_posWindow != null)
            {
                _posRepository = SettingHelpers.GetRepositoryImplementation();
                _suspendBill = suspendBill;
                ValidationMessage = string.Empty;
                if (_posWindow.ViewModel.CustomerInformation.Customer != null)
                    ReferenceName = _posWindow.ViewModel.CustomerInformation.Customer.Name;
            }
        }

        public SuspendViewModel(SuspendBill suspendBill, POSWindow posWindow)
        {
            _suspendBill = suspendBill;
            _posWindow = posWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            ValidationMessage = string.Empty;
            if (_posWindow.ViewModel.CustomerInformation.Customer != null)
                ReferenceName = _posWindow.ViewModel.CustomerInformation.Customer.Name;
        }
        #region Properties
        private string _referenceName;
        public string ReferenceName
        {
            get { return _referenceName; }
            set
            {
                if (value != _referenceName)
                {
                    _referenceName = value;
                    OnPropertyChanged("ReferenceName");
                }
            }
        }
        private string _validationMessage;
        public string ValidationMessage
        {
            get { return _validationMessage; }
            set
            {
                if (value != _validationMessage)
                {
                    _validationMessage = value;
                    OnPropertyChanged("ValidationMessage");
                }
            }
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
            try
            {
                if (!String.IsNullOrEmpty(ReferenceName))
                {
                    ValidationMessage = string.Empty;
                    POSTempTrans posTempTrans = new POSTempTrans();
                    posTempTrans.Id = SettingHelpers.CurrentTempTransId;
                    posTempTrans.IsSuspendedBill = true;
                    posTempTrans.TransReference = ReferenceName;
                    if (_posWindow.ViewModel.CustomerInformation.Customer != null && _posWindow.ViewModel.CustomerInformation.Customer.Id != 0)
                    {
                        posTempTrans.CustomerID = _posWindow.ViewModel.CustomerInformation.Customer.Id;
                    }
                    else
                    {
                        posTempTrans.CustomerID = 1;
                    }

                    _posRepository.UpdatePosTempTransForSuspendBill(posTempTrans);
                    SettingHelpers.SuspendBillCount = (SettingHelpers.SuspendBillCount) + (1);
                    SettingHelpers.TotalAmount = string.Empty;
                    _posWindow.ViewModel = new POSWindowViewModel(_posWindow, true);
                    SettingHelpers.CurrentTempTransId = 0;
                    SettingHelpers.IsCustomerPO = false;
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
                    _suspendBill.DialogResult = true;
                    _suspendBill.Close();
                }
                else
                {
                    ValidationMessage = StringConstants.EnterReference;
                }
            }
            catch (Exception)
            {

                throw;
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
            _suspendBill.Close();
        }

        #endregion Cancel Command


        #region INotifyPropertyChanged implementation

        public event PropertyChangedEventHandler PropertyChanged = delegate { };
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        #endregion INotifyPropertyChanged implementation

    }
}
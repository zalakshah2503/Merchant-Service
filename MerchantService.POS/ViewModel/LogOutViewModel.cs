
using GalaSoft.MvvmLight.Command;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using MerchantService.Utility.Constants;
using MerchantService.POS.Utility;
using MerchantService.DomainModel.Models.POS;
using Newtonsoft.Json;
using System.Net.Http;
using MerchantService.DomainModel.Enums;
using MerchantService.POS.Repository;
namespace MerchantService.POS.ViewModel
{
    public class LogOutViewModel : INotifyPropertyChanged
    {
        public LogOut _logOUtWindow;
        private IPosRepository _posRepository;
        public LogOutViewModel(LogOut logoutWindow)
        {
            _logOUtWindow = logoutWindow;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
        }

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
            _logOUtWindow.DialogResult = false;
            _logOUtWindow.Close();

        }

        #endregion Cancel Command

        #region Keep Session Command

        public ICommand KeepSessionCommand
        {
            get
            {
                return new RelayCommand(() => this.KeepSession());
            }
        }

        public void KeepSession()
        {
            //_logOUtWindow_logOUtWindow.Close();
            MessageBoxResult messageResult = MessageBox.Show(StringConstants.KeepSessionMessage, "LogOut Confirmation", MessageBoxButton.YesNo);
            if (messageResult == MessageBoxResult.Yes)
            {
                //Application.Current.Shutdown();
                _logOUtWindow.DialogResult = true;
                _logOUtWindow.Close();
            }
            else
            {
                _logOUtWindow.DialogResult = false;
                _logOUtWindow.Close();
            }
        }

        #endregion Keep Session Command

        #region End Session Command

        public ICommand EndSessionCommand
        {
            get
            {
                return new RelayCommand(() => this.EndSession());
            }
        }

        public void EndSession()
        {
            MessageBoxResult messageResult = MessageBox.Show(StringConstants.EndSessionMessage, "LogOut Confirmation", MessageBoxButton.YesNo);
            if (messageResult == MessageBoxResult.Yes)
            {
                if (!String.IsNullOrEmpty(SettingHelpers.TotalAmount))
                {
                    MessageBox.Show("Please Delete the Added Item To Sign Out.", "End Session", MessageBoxButton.OK, MessageBoxImage.Warning);
                    _logOUtWindow.DialogResult = false;
                    _logOUtWindow.Close();
                    return;
                }

                //Application.Current.Shutdown();
                if (SettingHelpers.SuspendBillCount != 0)
                {
                    MessageBox.Show("Please Delete Suspend Bills " + SettingHelpers.SuspendBillCount + " To Sign Out.", "End Session", MessageBoxButton.OK, MessageBoxImage.Warning);
                    _logOUtWindow.DialogResult = false;
                    _logOUtWindow.Close();
                    return;
                }
                POSSession posSession = new POSSession();
                posSession.Id = SettingHelpers.CurrentPosSessionId;
                posSession.StatusTypeId = 22;//End
                posSession.ModifiedDateTime = DateTime.UtcNow;
                var updatedPosSession = _posRepository.UpdatePosSessionForEndSeesion(posSession);
                if (updatedPosSession != null)
                {
                    POSLoginSession posLoginSession = new POSLoginSession();
                    posLoginSession.Id = updatedPosSession.POSLoginSessionId;
                    var jsonPosLoginSession = JsonConvert.SerializeObject(posLoginSession);
                    posLoginSession.ModifiedDateTime = DateTime.UtcNow;
                    _posRepository.UpdatePosLoginSessionForEndSession(posLoginSession);

                    //changed by ankit
                    if (SettingHelpers.OperationIncidentReport.Count > 0)
                    {
                        if (SettingHelpers.OperationIncidentReport[0].OperationTypeId == Convert.ToInt32(OperationTypes.PerCashierLoginSeesion))
                        {
                            _posRepository.UpdateIncidentReportByCashierId(SettingHelpers.CurrentUserId);
                        }
                    }
                }
                _logOUtWindow.DialogResult = true;
                _logOUtWindow.Close();
            }
            else
            {
                _logOUtWindow.DialogResult = false;
                _logOUtWindow.Close();
            }
        }

        #endregion End Session Command

        #region INotifyPropertyChanged implementation

        public event PropertyChangedEventHandler PropertyChanged = delegate { };
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        #endregion INotifyPropertyChanged implementation
    }
}
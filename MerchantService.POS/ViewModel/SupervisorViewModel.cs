using GalaSoft.MvvmLight.Command;
using MerchantService.Utility.Constants;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Net.Http;
using MerchantService.POS.Utility;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.POS.Repository;

namespace MerchantService.POS.ViewModel
{
    public class SupervisorViewModel : INotifyPropertyChanged
    {

        public SupervisorLogin _supervisorLogin;
        private IPosRepository _posRepository;
        public SupervisorViewModel(SupervisorLogin supervisorLogin)
        {
            _supervisorLogin = supervisorLogin;
            ErrorMessage = string.Empty;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
        }

        #region Properties
        private string _errorMessage;
        public string ErrorMessage
        {
            get { return _errorMessage; }
            set
            {
                if (value != _errorMessage)
                {
                    _errorMessage = value;
                    OnPropertyChanged("ErrorMessage");
                }
            }
        }
        private string _userName;
        public string UserName
        {
            get { return _userName; }
            set
            {
                if (value != _userName)
                {
                    _userName = value;
                    OnPropertyChanged("UserName");
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
            SettingHelpers.IsUnRegisteredItem = false;
            SettingHelpers.IsOverQuantityItem = false;
            SettingHelpers.IsInActiveItem = false;
            _supervisorLogin.DialogResult = false;
            _supervisorLogin.Close();
        }

        #endregion Cancel Command

        #region Submit Command

        public ICommand SubmitCommand
        {
            get
            {
                return new RelayCommand<object>((args) =>
                {
                    SubmitButtonCommand(args);
                });
            }
        }

        public void SubmitButtonCommand(object obj)
        {
            if (!String.IsNullOrEmpty(UserName) && !String.IsNullOrEmpty(((System.Windows.Controls.PasswordBox)(obj)).Password))
            {
                ErrorMessage = string.Empty;
                MerchantService.Repository.ApplicationClasses.LoginViewModel loginViewController = new MerchantService.Repository.ApplicationClasses.LoginViewModel();
                loginViewController.UserName = UserName;
                loginViewController.Password = ((System.Windows.Controls.PasswordBox)(obj)).Password;
                string jsonString = JsonConvert.SerializeObject(loginViewController);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                var user = _posRepository.ValidateLogin(loginViewController.UserName, loginViewController.Password);
                if (user != null)
                {
                    var userDetail = _posRepository.GetUserDetailByAspNetUserId(user.Id);
                    if (userDetail != null)
                    {
                        //Admin User.
                        if (userDetail.RoleId == 1)
                        {
                            //you are not authorized.
                            ErrorMessage = StringConstants.InvalidUser;
                            return;
                        }

                        //get the Branch Detail object by BranchId

                        var branchDetail = _posRepository.GetBranchById(userDetail.BranchId.Value);
                        if (branchDetail != null)
                        {
                            Utility.SettingHelpers.CurrentBranchId = branchDetail.Id;
                            var rolePermissionObj = _posRepository.GetRolPermissionByChildPermissionId((int)MerchantService.DomainModel.Enums.RolePermission.UnRegisterItem, branchDetail.CompanyId);
                            if (rolePermissionObj != null && rolePermissionObj.Any())
                            {
                                bool validRole = false;
                                foreach (var role in rolePermissionObj)
                                {
                                    if (role.RoleId == userDetail.RoleId)
                                        validRole = true;
                                }

                                if (validRole)
                                {
                                    if (SettingHelpers.IsUnRegisteredItem)
                                    {
                                        //Open Item 
                                        AddItem addItem = new AddItem(_supervisorLogin);
                                        addItem.Owner = _supervisorLogin;
                                        var result = addItem.ShowDialog();
                                        if (result == true)
                                        {
                                            SettingHelpers.IsUnRegisteredItem = false;
                                            _supervisorLogin.DialogResult = true;
                                            _supervisorLogin.Close();
                                        }
                                    }
                                    if (SettingHelpers.IsOverQuantityItem)
                                    {
                                        SettingHelpers.IsOverQuantityItem = false;
                                        _supervisorLogin.DialogResult = true;
                                        _supervisorLogin.Close();
                                    }
                                    if (SettingHelpers.IsInActiveItem)
                                    {
                                        SettingHelpers.IsInActiveItem = false;
                                        _supervisorLogin.DialogResult = true;
                                        _supervisorLogin.Close();
                                    }
                                    if (SettingHelpers.IsManageIncidentReport)
                                    {
                                        SettingHelpers.IsManageIncidentReport = false;
                                        _supervisorLogin.DialogResult = true;
                                        _supervisorLogin.Close();
                                    }
                                }
                                else
                                {
                                    //not Authorized
                                    ErrorMessage = StringConstants.InvalidUser;
                                }
                            }
                            else
                            {
                                //not Authorized
                                ErrorMessage = StringConstants.InvalidUser;
                            }
                        }
                    }
                    else
                    {
                        //User not Exists.
                        ErrorMessage = StringConstants.InvalidUser;
                    }


                }
                else
                {
                    //User not Exists.
                    ErrorMessage = StringConstants.InvalidUser;
                    _supervisorLogin.txtUserName.Focus();
                }

            }
            else
            {
                ErrorMessage = StringConstants.InvalidUser;
                _supervisorLogin.txtUserName.Focus();

            }
        }

        #endregion Submit Command
        #endregion

        #region INotifyPropertyChanged implementation

        public event PropertyChangedEventHandler PropertyChanged = delegate { };
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        #endregion INotifyPropertyChanged implementation
    }
}
using GalaSoft.MvvmLight.Command;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.DomainModel.Models.POS;
using MerchantService.POS.Repository;
using MerchantService.POS.Utility;
using MerchantService.Utility.Constants;
using System;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;
using System.Windows.Input;
namespace MerchantService.POS.ViewModel
{
    public class LoginViewModel : INotifyPropertyChanged
    {
        private LoginScreen _loginScreen;
        private bool _isAuthenticated;
        private IPosRepository _posRepository;
        public bool isAuthenticated
        {
            get { return _isAuthenticated; }
            set
            {
                if (value != _isAuthenticated)
                {
                    _isAuthenticated = value;
                    OnPropertyChanged("isAuthenticated");
                }
            }
        }

        private bool _isBusy;
        public bool IsBusy
        {
            get { return _isBusy; }
            set
            {
                if (value != _isBusy)
                {
                    _isBusy = value;
                    OnPropertyChanged("IsBusy");
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

        private string _language;
        public string Language
        {
            get { return _language; }
            set
            {
                if (value != _language)
                {
                    _language = value;
                    OnPropertyChanged("Language");
                }
            }
        }

        private CollectionView _languageList;
        public CollectionView LanguageList
        {
            get { return _languageList; }
        }


        public static CompanyDetail CompanyDetail { get; set; }
        public LoginViewModel()
        {
            _posRepository = SettingHelpers.GetRepositoryImplementation();
        }

        public LoginViewModel(LoginScreen loginScreen)
        {
            _loginScreen = loginScreen;
            _posRepository = SettingHelpers.GetRepositoryImplementation();
            _languageList = new CollectionView(_posRepository.GetAllLanguage());
            _language = "1";
            SettingHelpers.LocalizationDictionary = _posRepository.GetLanguageWiseLabels(int.Parse(Language));
        }

        public ICommand LoginCommand
        {
            get
            {
                return new RelayCommand<object>((args) =>
                {
                    IsBusy = true;
                    ValidateUser(args);
                });
            }
        }
        ///<summary>
        ///validate User Name and Password of user. -PS
        ///</summary>
        ///<param name="obj"></param>
        private void ValidateUser(object obj)
        {
            SettingHelpers.LocalizationDictionary = _posRepository.GetLanguageWiseLabels(int.Parse(Language));

            if (!String.IsNullOrEmpty(UserName) && !String.IsNullOrEmpty(((System.Windows.Controls.PasswordBox)(obj)).Password))
            {
                isAuthenticated = false;
                SettingHelpers.IsCustomerPO = false;
                MerchantService.Repository.ApplicationClasses.LoginViewModel loginViewController = new MerchantService.Repository.ApplicationClasses.LoginViewModel();
                loginViewController.UserName = UserName;
                loginViewController.Password = ((System.Windows.Controls.PasswordBox)(obj)).Password;
                var user = _posRepository.ValidateLogin(loginViewController.UserName, loginViewController.Password);
                if (user != null)
                {
                    var userDetail = _posRepository.GetUserDetailByAspNetUserId(user.Id);
                    if (userDetail != null)
                    {
                        //Admin User.
                        if (userDetail.RoleId == 1)
                        {
                            // you are not authorized.
                            isAuthenticated = true;
                            return;
                        }
                        //get the Branch Detail object by BranchId
                        var branchDetail = _posRepository.GetBranchById(userDetail.BranchId.Value);
                        if (branchDetail != null)
                        {
                            Utility.SettingHelpers.CurrentBranchId = branchDetail.Id;
                            var rolepermissionResponse = _posRepository.GetRolPermissionByChildPermissionId((int)MerchantService.DomainModel.Enums.RolePermission.POSSystemLogin, branchDetail.CompanyId);
                            if (rolepermissionResponse != null && rolepermissionResponse.Any())
                            {
                                //update by ankit
                                bool validRole = false;
                                foreach (var role in rolepermissionResponse)
                                {
                                    if (userDetail.RoleId == role.RoleId)
                                        validRole = true;
                                }
                                if (validRole)
                                {
                                    SettingHelpers.IsReconciled = true;
                                    var companyDetail = _posRepository.GetCompanyConfigurationByCompanyId(branchDetail.CompanyId);
                                    if (companyDetail != null)
                                    {
                                        SettingHelpers.CompanyConfigruationObject = companyDetail;
                                        SettingHelpers.BalanceBarcodeConfigurationObject = _posRepository.GetBalanceBarcodeConfiguration(companyDetail.CompanyId);
                                        var currencyResponse = _posRepository.GetAllCurrencyDetail();
                                        if (currencyResponse.Any())
                                        {
                                            CurrencyDetail currencyDetail = currencyResponse.Where(x => x.Id == companyDetail.CurrencyId).FirstOrDefault();
                                            SettingHelpers.CurrentCultureInfo = new System.Globalization.CultureInfo(currencyDetail.CultureInfoValue);
                                            Thread.CurrentThread.CurrentUICulture = SettingHelpers.CurrentCultureInfo;
                                            Thread.CurrentThread.CurrentCulture = SettingHelpers.CurrentCultureInfo;
                                        }
                                        // Get the Incident Report Data for Cashier by compan id.
                                        var reponseIncidentReport = _posRepository.GetIncidentReportList(branchDetail.CompanyId);
                                        SettingHelpers.OperationIncidentReport = reponseIncidentReport;
                                    }
                                    Utility.SettingHelpers.CurrentUserId = userDetail.Id;
                                    BackgroundWorker bgCheckUserSession = new BackgroundWorker();
                                    bgCheckUserSession.DoWork += bgCheckUserSession_DoWork;
                                    bgCheckUserSession.RunWorkerCompleted += bgCheckUserSession_RunWorkerCompleted;
                                    bgCheckUserSession.RunWorkerAsync();

                                }
                                else
                                {
                                    // not Authorized
                                    IsBusy = false;
                                    isAuthenticated = true;
                                }
                            }
                            else
                            {
                                //not Authorized
                                IsBusy = false;
                                isAuthenticated = true;
                            }
                        }
                        else
                        {
                            // User not Exists.
                            IsBusy = false;
                            isAuthenticated = true;
                        }
                    }
                    else
                    {
                        // User not Exists.
                        IsBusy = false;
                        isAuthenticated = true;
                    }
                }
                else
                {
                    //User not Exists.
                    IsBusy = false;
                    isAuthenticated = true;
                    _loginScreen.txtUserName.Focus();
                }

            }
            else
            {
                IsBusy = false;
                isAuthenticated = true;
                _loginScreen.txtUserName.Focus();

            }

        }

        #region Private Method
        private void InsertPOSSession(int userId)
        {
            POSLoginSession posLoginSession = new POSLoginSession();
            posLoginSession.UserId = userId;
            posLoginSession.LoginDateTime = DateTime.UtcNow;
            posLoginSession.LogoutDateTime = null;
            posLoginSession.CreatedDateTime = DateTime.UtcNow;
            var id = _posRepository.AddNewPOSLoginSession(posLoginSession);
            POSSession posSession = new POSSession();
            posSession.ActualCash = 0;
            posSession.ActualCoupon = 0;
            posSession.ActualCreditAccount = 0;
            posSession.ActualCreditCard = 0;
            posSession.ActualDebitCard = 0;
            posSession.ActualReturnedBill = 0;
            posSession.Cash = 0;
            posSession.Coupon = 0;
            posSession.CreatedDateTime = DateTime.UtcNow;
            posSession.CreditAccount = 0;
            posSession.CreditCard = 0;
            posSession.DebitCard = 0;
            posSession.EndDate = DateTime.UtcNow;
            posSession.IsMatched = false;
            posSession.MismatchedValue = 0;
            posSession.MismatchResolveTypeID = 1;
            posSession.POSLoginSessionId = id;
            posSession.ReturnedBill = 0;
            posSession.StartDate = DateTime.UtcNow;
            posSession.ParentRecord = null;
            posSession.Comment = null;
            posSession.StatusTypeId = 21;//"Processing"
            var posSessionId = _posRepository.InsertPOSSessionsData(posSession);
            Utility.SettingHelpers.CurrentPosSessionId = posSessionId;
        }
        #endregion

        #region INotifyPropertyChanged Methods
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
        #endregion

        #region Method for Databae Operation
        private POSLoginSession CheckUserLogOutOrNot(int userId)
        {
            var posLoginSession = _posRepository.CheckUserLogoutOrNot(userId);
            return posLoginSession;
        }

        #endregion

        #region BackgroundWorker Method
        void bgCheckUserSession_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                if (e.Error == null && Utility.SettingHelpers.IsReconciled)
                {
                    IsBusy = false;
                    //only for cashier role
                    var window = Application.Current.Windows.OfType<POSWindow>().Any();
                    if (!window)
                    {
                        var poswindow = new POSWindow();
                        _loginScreen.Close();
                        poswindow.TxtBarcode.Focus();
                        var resultLogin = poswindow.ShowDialog();
                        if (resultLogin == true)
                        {
                        }
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        void bgCheckUserSession_DoWork(object sender, DoWorkEventArgs e)
        {
            POSLoginSession loginSession = CheckUserLogOutOrNot(Utility.SettingHelpers.CurrentUserId);
            if (loginSession == null)
            {
                var posLoginSessionObj = _posRepository.GetLastLogoutRecordByUserId(Utility.SettingHelpers.CurrentUserId);
                if (posLoginSessionObj != null)
                {
                    var posSessionObjData = _posRepository.GetPosSessionBySessionLoginId(posLoginSessionObj.Id);
                    if (posSessionObjData != null)
                    {
                        if (posSessionObjData.StatusTypeId == 22)//end
                        {
                            MessageBox.Show(StringConstants.ReconcileAccountFirst, "Reconcile Account", MessageBoxButton.OK, MessageBoxImage.Information);
                            Utility.SettingHelpers.IsReconciled = false;
                            IsBusy = false;
                        }
                        else
                        {
                            Utility.SettingHelpers.IsReconciled = true;
                            InsertPOSSession(Utility.SettingHelpers.CurrentUserId);
                            Utility.SettingHelpers.isCashierLogOut = true;
                        }
                    }
                }
                else
                {
                    Utility.SettingHelpers.IsReconciled = true;
                    InsertPOSSession(Utility.SettingHelpers.CurrentUserId);
                    Utility.SettingHelpers.isCashierLogOut = true;
                }
            }
            else
            {
                var posSessionData = _posRepository.GetPosSessionBySessionLoginId(loginSession.Id);
                if (posSessionData != null)
                {
                    Utility.SettingHelpers.CurrentPosSessionId = posSessionData.Id;
                }

                Utility.SettingHelpers.SuspendBillCount = _posRepository.GetSuspendBillCountByUserId(Utility.SettingHelpers.CurrentUserId);
                Utility.SettingHelpers.isCashierLogOut = false;
            }
        }
        #endregion
    }
}

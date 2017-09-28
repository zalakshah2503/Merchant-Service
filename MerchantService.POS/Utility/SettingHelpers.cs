using Autofac;
using MerchantService.Core.HttpClients;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.POS.Data;
using MerchantService.POS.Repository;
using MerchantService.Repository.ApplicationClasses.Admin.Company;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.Utility.Constants;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;

namespace MerchantService.POS.Utility
{
    public class SettingHelpers
    {
        static IComponentContext _container;

        public static void InitializeContainer(IComponentContext container)
        {
            _container = container;
        }
        public static List<BalanceBarcodeAc> BalanceBarcodeConfigurationObject { get; set; }
        public static CompanyConfiguration CompanyConfigruationObject { get; set; }
        internal static List<GlobalizationDetailAc> LocalizationDictionary { get; set; }

        public static bool IsItemSelected { get; set; }

        public static string TotalAmount { get; set; }

        public static int CurrentBranchId { get; set; }

        //public static CustomerProfile CurrentCustomer { get; set; }

        public static int CurrentUserId { get; set; }

        public static int CurrentTempTransId { get; set; }

        public static bool isCashierLogOut { get; set; }

        public static int CurrentPosSessionId { get; set; }

        public static int BillNumberCount { get; set; }

        public static int SuspendBillCount { get; set; }

        public static bool IsCustomerPO { get; set; }

        public static decimal DownPayment { get; set; }

        // public static string CustomerPONumber { get; set; }

        public static decimal AdditionalAmount { get; set; }

        //  public static POSReturnBill PosReturnBill { get; set; }

        public static string CurrentBarcode { get; set; }

        public static bool IsUnRegisteredItem { get; set; }
        public static bool IsOverQuantityItem { get; set; }
        public static bool IsInActiveItem { get; set; }

        public static bool IsReconciled { get; set; }

        public static CultureInfo CurrentCultureInfo { get; set; }

        public static int ItemPurchaseCount { get; set; }

        public static int CurrentPosItemId { get; set; }

        public static bool IsManageIncidentReport { get; set; }

        public static List<IncidentReport> OperationIncidentReport { get; set; }


        public static decimal CusomerPaid { get; set; }

        private static List<Ledgers> _ledgers;
        public static List<Ledgers> Ledgers
        {
            get
            {
                if (_ledgers != null && _ledgers.Any())
                    return _ledgers;

                _ledgers = GetAllLedgers(SettingHelpers.CurrentBranchId);
                return _ledgers;
            }
            set
            {
                _ledgers = value;
            }
        }
        static dynamic PosRepository { get; set; }
        public static dynamic _context;
        public static dynamic Context
        {
            get
            {
                if (_context == null)
                {
                    if (!StringConstants.IsOnline)
                    {
                        _context = PosLocaldbContext.Create();
                    }
                }
                return _context;
            }
            set { _context = value; }
        }

        public static dynamic GetRepositoryImplementation()
        {
            if (PosRepository == null)
            {
                if (StringConstants.IsOnline)
                {
                    PosRepository = _container.Resolve<PosRepositoryOnline>();
                }
                else
                {
                    PosRepository = _container.Resolve<PosRepository>();
                }
            }
            return PosRepository;
        }

        public static List<DoubleEntry> AccountingEntries { get; set; }

        public static List<Ledgers> GetAllLedgers(int branchId)
        {
            var api = string.Format("api/Accounting/GetAllLedgersByBranch?branchId={0}", branchId);
            HttpClients httpClient = new HttpClients();
            var response = httpClient.GetAsync(api);
            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsAsync<List<Ledgers>>().Result;
                return data;
            }
            return null;

        }
        public static bool CheckConnection()
        {
            return true;
            //try
            //{
            //    var request = (HttpWebRequest)WebRequest.Create(StringConstants.WebApiPath);
            //    request.Timeout = 5000;
            //    request.Credentials = CredentialCache.DefaultNetworkCredentials;
            //    var response = (HttpWebResponse)request.GetResponse();

            //    if (response.StatusCode == HttpStatusCode.OK) return true;
            //    else return false;
            //}
            //catch
            //{
            //    return false;
            //}
        }

        public static void SetLabelsLangugaeWise(Window window)
        {
            if (window.Tag != null)
            {
                var value = SettingHelpers.
                        LocalizationDictionary.
                        FirstOrDefault(x => x.Key == window.Tag.ToString());

                if (value != null)
                {
                    if (!string.IsNullOrWhiteSpace(value.ValueSl))
                        window.Title = value.ValueSl;

                    else
                        window.Title = value.ValueEn;
                }
            }
            foreach (var control in FindVisualChildren<Label>(window))
            {
                if (control.Tag == null)
                    continue;
                if (LocalizationDictionary != null)
                {
                    var value = SettingHelpers.
                        LocalizationDictionary.
                        FirstOrDefault(x => x.Key == control.Tag.ToString());
                    if (value != null)
                    {
                        if (!string.IsNullOrWhiteSpace(value.ValueSl))
                            control.Content = value.ValueSl;
                        else
                            control.Content = value.ValueEn;
                    }
                }
            }
            var coll = FindVisualChildren<TextBlock>(window);
            var item = coll.Where(x => x.Name == "rb");

            foreach (var control in coll)
            {
                if (control.Tag == null)
                    continue;
                if (LocalizationDictionary != null)
                {
                    var value = SettingHelpers.
                    LocalizationDictionary.
                    FirstOrDefault(x => x.Key == control.Tag.ToString());
                    if (value != null)
                    {
                        if (!string.IsNullOrWhiteSpace(value.ValueSl))
                            control.Text = value.ValueSl;
                        else
                            control.Text = value.ValueEn;
                    }
                }
            }

            foreach (var control in FindVisualChildren<Button>(window))
            {
                if (control.Tag == null)
                    continue;

                var value = SettingHelpers.
                    LocalizationDictionary.
                    FirstOrDefault(x => x.Key == control.Tag.ToString());
                if (value != null)
                {
                    if (!string.IsNullOrWhiteSpace(value.ValueSl))
                        control.Content = value.ValueSl;
                    else
                        control.Content = value.ValueEn;
                }
            }

            foreach (var control in FindVisualChildren<DataGrid>(window))
            {
                DataGrid ChildList = control;

                if (ChildList != null)
                {
                    foreach (var DataColumn in ChildList.Columns)
                    {
                        if (DataColumn.HeaderStringFormat == null)
                            continue;
                        if (LocalizationDictionary != null)
                        {
                            var value = SettingHelpers.
                                LocalizationDictionary.
                                FirstOrDefault(x => x.Key == DataColumn.HeaderStringFormat.ToString());
                            if (value != null)
                            {
                                if (!string.IsNullOrWhiteSpace(value.ValueSl))
                                    DataColumn.Header = value.ValueSl;
                                else
                                    DataColumn.Header = value.ValueEn;
                            }
                        }
                    }
                }
            }

            // var runControls = 

        }

        //public static void SetLabelsLangugaeWiseForFlowDocument(FlowDocument flowdocument)
        //{
        //    var coll = FindVisualChildren<TextBlock>(flowdocument);
        //    var item = coll.Where(x => x.Name == "rb");

        //    foreach (var control in coll)
        //    {
        //        if (control.Tag == null)
        //            continue;
        //        if (LocalizationDictionary != null)
        //        {
        //            var value = SettingHelpers.
        //            LocalizationDictionary.
        //            FirstOrDefault(x => x.Key == control.Tag.ToString());
        //            if (value != null)
        //            {
        //                if (!string.IsNullOrWhiteSpace(value.ValueSl))
        //                    control.Text = value.ValueSl;
        //                else
        //                    control.Text = value.ValueEn;
        //            }
        //        }
        //    }
        //}

        private static IEnumerable<T> FindVisualChildren<T>(DependencyObject depObj) where T : DependencyObject
        {
            if (depObj != null)
            {
                for (int i = 0; i < VisualTreeHelper.GetChildrenCount(depObj); i++)
                {
                    DependencyObject child = VisualTreeHelper.GetChild(depObj, i);
                    if (child != null && child is T)
                    {
                        yield return (T)child;
                    }

                    foreach (T childOfChild in FindVisualChildren<T>(child))
                    {
                        yield return childOfChild;
                    }
                }
            }
        }
    }
}

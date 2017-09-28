using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using MerchantService.POS.Utility;
using System.Threading;
using System.Windows.Markup;
using System.Globalization;
namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for PaymentWindow.xaml
    /// </summary>
    public partial class PaymentWindow : Window
    {
        POSWindow _posWindow;

        static PaymentWindow()
        {
            FrameworkElement.LanguageProperty.OverrideMetadata(typeof(FrameworkElement),
 new FrameworkPropertyMetadata(XmlLanguage.GetLanguage("en-US")));
        }
        public PaymentWindow()
        {
            InitializeComponent();
            txtCash.Focus();
            this.ViewModel = new POS.ViewModel.PaymentViewModel(this);
            ConfigurePaymentMode();
            Height = 600;
        }
        public PaymentWindow(POSWindow posWindow)
        {
            InitializeComponent();
            txtCash.Focus();
            _posWindow = posWindow;
            this.ViewModel = new POS.ViewModel.PaymentViewModel(this, posWindow);
            ConfigurePaymentMode();
            Height = 600;
            this.Loaded += PaymentWindow_Loaded;
        }

        void PaymentWindow_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }

        public POS.ViewModel.PaymentViewModel ViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.PaymentViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }

        private void ConfigurePaymentMode()
        {
            try
            {
                int windowHeight = 600;
                GridLength gridlLength = new GridLength(0.0, GridUnitType.Pixel);
                if (SettingHelpers.CompanyConfigruationObject != null)
                {

                    if (!SettingHelpers.CompanyConfigruationObject.CashPayment)
                    {
                        grdPaymentMode.RowDefinitions[0].Height = gridlLength;
                        windowHeight = windowHeight - 50;
                    }
                    if (!SettingHelpers.CompanyConfigruationObject.DebitCardPayment)
                    {
                        grdPaymentMode.RowDefinitions[1].Height = gridlLength;
                        windowHeight = windowHeight - 50;
                    }
                    if (!SettingHelpers.CompanyConfigruationObject.CreditCardPayment)
                    {
                        grdPaymentMode.RowDefinitions[2].Height = gridlLength;
                        windowHeight = windowHeight - 50;
                    }
                    if (!SettingHelpers.CompanyConfigruationObject.CoupanPayment)
                    {
                        grdPaymentMode.RowDefinitions[3].Height = gridlLength;
                        windowHeight = windowHeight - 50;
                    }
                    if (!SettingHelpers.CompanyConfigruationObject.ChequePayment)
                    {
                        grdPaymentMode.RowDefinitions[4].Height = gridlLength;
                        windowHeight = windowHeight - 50;
                    }
                    if (!SettingHelpers.CompanyConfigruationObject.CreditAccountPayment || _posWindow.ViewModel.CustomerInformation.Customer == null || !_posWindow.ViewModel.CustomerInformation.Customer.IsCreditCustomer)
                    {
                        grdPaymentMode.RowDefinitions[5].Height = gridlLength;
                        windowHeight = windowHeight - 50;
                    }
                }
                //for DownPayment
                if (!SettingHelpers.IsCustomerPO)
                {
                    grdPaymentMode.RowDefinitions[6].Height = gridlLength;
                    windowHeight = windowHeight - 50;
                }
                Height = windowHeight;
                // MinHeight = Height;
                //MaxHeight = Height;
                //ResizeMode = System.Windows.ResizeMode.NoResize;                
            }
            catch (Exception )
            {

                throw;
            }
        }

        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCash_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCash.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCash_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCash.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }

        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtDebitCard_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtDebitCard.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtDebitCard_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtDebitCard.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }

        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtDebitCardReceipt_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtDebitCardReceipt.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtDebitCardReceipt_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtDebitCardReceipt.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCreditCard_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCreditCard.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCreditCard_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCreditCard.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }

        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCreditCardReceipt_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCreditCardReceipt.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCreditCardReceipt_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCreditCardReceipt.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCoupon_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCoupon.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCoupon_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCoupon.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCouponNo_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCouponNo.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCouponNo_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCouponNo.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCheque_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCheque.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }

        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCheque_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCheque.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtChequeNo_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtChequeNo.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtChequeNo_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtChequeNo.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }

        }
        /// <summary>
        /// This event is used for apply background color on textbox on focus.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCreditAcocount_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCreditAcocount.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception )
            {

                throw;
            }
        }
        /// <summary>
        /// This event is used for clear background color on textbox on lost foucs.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtCreditAcocount_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCreditAcocount.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception )
            {

                throw;
            }
        }



    }
}

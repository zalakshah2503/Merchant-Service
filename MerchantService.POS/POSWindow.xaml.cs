using MerchantService.DomainModel.Models.Item;
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
using MerchantService.Repository.ApplicationClasses.Item;
using System.Globalization;
namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for POSWindow.xaml
    /// </summary>
    public partial class POSWindow : Window
    {
        public POSWindow()
        {
            InitializeComponent();
            this.ViewModel = new POS.ViewModel.POSWindowViewModel(this, false);
            this.Closing += POSWindow_Closing;
            this.Loaded += POSWindow_Loaded;
        }

        void POSWindow_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }

        void POSWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            var result = MessageBox.Show("Are you sure you want to close?", "Close Window", MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (result == MessageBoxResult.Yes)
            {
                e.Cancel = false;
            }
            else
                e.Cancel = true;
        }

        public POS.ViewModel.POSWindowViewModel ViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.POSWindowViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }

        #region Events
        private void grdItemDetail_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            try
            {
                var uiElement = e.OriginalSource as UIElement;
                if (e.Key == Key.Enter && uiElement != null)
                {
                    e.Handled = true;
                    ViewModel.BarcodeNo = ViewModel.SelectedItemProfile.Barcode;
                    ViewModel.CustomerQuantity = ViewModel.SelectedItemProfile.ItemQuantity;
                    object item = ItemGrid.SelectedItem;
                    //TxtBarcode.Text = ((POSItemAC)item).Barcode;
                    //txtQuantity.Text = ((POSItemAC)item).ItemQuantiy.ToString();
                    ViewModel.SelectedItemProfile = (POSItemDetail)ItemGrid.SelectedItem;
                    SettingHelpers.CurrentPosItemId = ViewModel.SelectedItemProfile.PosItemId;
                    //   ViewModel.CurrentItemProfile = item as POSItemAC;
                    ViewModel.ItemName = ViewModel.SelectedItemProfile.ItemName;
                    TxtQuantity.SelectAll();
                    TxtQuantity.Focus();
                    SettingHelpers.IsItemSelected = true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        /// <summary>
        /// This event allow only number input.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void txtQuantity_PreviewTextInput(object sender, TextCompositionEventArgs e)
        {
            try
            {
                //e.Handled = !IsTextNumeric(e.Text);
                if (!char.IsDigit(e.Text, e.Text.Length - 1))
                {
                    e.Handled = true;

                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion


        private void txtBarcode_LostFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                TxtBarcode.Background = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void txtBarcode_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                TxtBarcode.Background = new SolidColorBrush(Color.FromArgb(110, 255, 241, 193));
            }
            catch (Exception)
            {

                throw;
            }
        }       
    }
}

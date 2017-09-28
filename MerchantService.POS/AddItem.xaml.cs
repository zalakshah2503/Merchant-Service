using MerchantService.POS.Utility;
using System;
using System.Windows;

namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for AddItem.xaml
    /// </summary>
    public partial class AddItem : Window
    {
        public AddItem()
        {
            InitializeComponent();
            txtItemName.Focus();
            this.ViewModel = new POS.ViewModel.AddItemViewModel(this);
        }
        public AddItem(SupervisorLogin supervisorLogin)
        {
            InitializeComponent();
            txtItemName.Focus();
            this.ViewModel = new POS.ViewModel.AddItemViewModel(this);
            this.Loaded += AddItem_Loaded;         
        }

        void AddItem_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }
        public POS.ViewModel.AddItemViewModel ViewModel
        {
            get
            {

                return this.DataContext as POS.ViewModel.AddItemViewModel;
            }

            set
            {
                this.DataContext = value;

            }
        }

        private void txtSellPrice_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtSellPrice.SelectAll();
            }
            catch (Exception)
            {
                
                throw;
            }
        }

        private void txtCostPrice_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtCostPrice.SelectAll();
            }
            catch (Exception )
            {

                throw;
            }
        }

        private void txtBaseUnitCount_GotFocus(object sender, RoutedEventArgs e)
        {
            try
            {
                txtBaseUnitCount.SelectAll();
            }
            catch (Exception )
            {

                throw;
            }
        }
    }
}

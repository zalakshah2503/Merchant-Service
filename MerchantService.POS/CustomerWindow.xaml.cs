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
using MerchantService.DomainModel.Enums;
using MerchantService.POS.Utility;
namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for CustomerWindow.xaml
    /// </summary>
    public partial class CustomerWindow : Window
    {
        public CustomerWindow()
        {
            
            InitializeComponent();
            this.CustomerViewModel = new POS.ViewModel.CustomerViewModel(this);
            txtCustomerNo.Focus();
        }

        public CustomerWindow(POSBillType posBillType)
        {
            InitializeComponent();
            this.CustomerViewModel = new POS.ViewModel.CustomerViewModel(this);
            txtCustomerNo.Focus();
            PageTitle(posBillType);
        }
        public CustomerWindow(POSBillType posBillType,POSWindow posWindow)
        {
            InitializeComponent();
            this.CustomerViewModel = new POS.ViewModel.CustomerViewModel(this, posWindow);
            txtCustomerNo.Focus();
            PageTitle(posBillType);
            this.Loaded += CustomerWindow_Loaded;
        }

        void CustomerWindow_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }

        private void PageTitle(POSBillType posBillType)
        {
            switch (posBillType)
            {
                case POSBillType.Customer:
                    CustomerViewModel.isCustomer = true;
                    CustomerViewModel.isReturnBill = false;
                    CustomerViewModel.isCustomerPO = false;
                    CustomerViewModel.PopupText = "Customer Number";
                    CustomerViewModel.Tag = "customernopos";
                    break;
                case POSBillType.ReturnBill:
                    CustomerViewModel.isCustomer = false;
                    CustomerViewModel.isReturnBill = true;
                    CustomerViewModel.isCustomerPO = false;
                    CustomerViewModel.PopupText = "Return Bill Number";
                    CustomerViewModel.Tag = "returnbillnopos";
                    break;
                case POSBillType.CustomerPO:
                    CustomerViewModel.isCustomer = false;
                    CustomerViewModel.isReturnBill = false;
                    CustomerViewModel.isCustomerPO = true;
                    CustomerViewModel.PopupText = "Customer PO Number";
                    CustomerViewModel.Tag = "customerponopos";
                    break;
                default:
                    break;
            }
        }
        public POS.ViewModel.CustomerViewModel CustomerViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.CustomerViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }

       
    }
}

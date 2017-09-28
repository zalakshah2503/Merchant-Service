using Autofac;
using MerchantService.POS.Utility;
using MerchantService.POS.ViewModel;
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

namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for SuspendBill.xaml
    /// </summary>
    public partial class SuspendBill : Window
    {
        public SuspendBill()
        {
            InitializeComponent();
            this.SuspendViewModel = new SuspendViewModel(this);
            txtReferenceNo.Focus();
        }

        public SuspendBill(POSWindow posWindow)
        {
            InitializeComponent();
            this.SuspendViewModel = this.SuspendViewModel = new SuspendViewModel(this,posWindow);
            txtReferenceNo.Focus();
            this.Loaded += SuspendBill_Loaded;
        }

        void SuspendBill_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }

        public POS.ViewModel.SuspendViewModel SuspendViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.SuspendViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }
    }
}

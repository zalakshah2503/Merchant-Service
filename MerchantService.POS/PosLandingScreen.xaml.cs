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
    /// Interaction logic for PosLandingScreen.xaml
    /// </summary>
    public partial class PosLandingScreen : Window
    {
        public PosLandingScreen()
        {
            InitializeComponent();
            this.ViewModel = new POS.ViewModel.PosViewModel(this, false);
            this.Closing += POSWindow_Closing;
        }
        public POS.ViewModel.PosViewModel ViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.PosViewModel;

            }
            set
            {
                this.DataContext = value;
            }
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
    }
}

using MerchantService.POS.Utility;
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
    /// Interaction logic for LogOut.xaml
    /// </summary>
    public partial class LogOut : Window
    {
        public LogOut()
        {
            InitializeComponent();
            this.LogOutViewModel = new POS.ViewModel.LogOutViewModel(this);
            this.Loaded += LogOut_Loaded;
        }

        void LogOut_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }
        public POS.ViewModel.LogOutViewModel LogOutViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.LogOutViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }
    }
}

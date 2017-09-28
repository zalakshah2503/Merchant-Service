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
    /// Interaction logic for SupervisorLogin.xaml
    /// </summary>
    public partial class SupervisorLogin : Window
    {
        public SupervisorLogin()
        {
            InitializeComponent();
            this.SupervisorViewModel = new POS.ViewModel.SupervisorViewModel(this);
            txtUserName.Focus();
            this.Loaded += SupervisorLogin_Loaded;
        }

        void SupervisorLogin_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }
        public POS.ViewModel.SupervisorViewModel SupervisorViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.SupervisorViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }
    }
}

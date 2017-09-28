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
using MerchantService.Utility.Constants;
using MerchantService.Core.Controllers.POS;
using MerchantService.Core.Controllers.Admin;
using MerchantService.Repository.ApplicationClasses;
using MerchantService.POS.Utility;


namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for LoginScreen.xaml
    /// </summary>
    public partial class LoginScreen : Window
    {
        public bool IsDialogResult;
        public LoginScreen()
        {
            InitializeComponent();
            if (System.Deployment.Application.ApplicationDeployment.IsNetworkDeployed)
            {
                Version version = System.Deployment.Application.ApplicationDeployment.CurrentDeployment.CurrentVersion;
                //lblversion.Content = version.ToString();
            }
            lblError.Content = StringConstants.InvalidUser;
            this.ViewModel = new POS.ViewModel.LoginViewModel(this);
            lblError.Content = StringConstants.InvalidUser;
            this.Loaded += LoginScreen_Loaded;
        }

        void LoginScreen_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
        }


        public POS.ViewModel.LoginViewModel ViewModel
        {
            get
            {

                return this.DataContext as POS.ViewModel.LoginViewModel;
            }

            set
            {
                this.DataContext = value;

            }
        }




    }
}

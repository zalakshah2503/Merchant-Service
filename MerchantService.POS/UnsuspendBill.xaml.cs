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
using MerchantService.Repository.ApplicationClasses.POS;

namespace MerchantService.POS
{
    /// <summary>
    /// Interaction logic for Unsuspend.xaml
    /// </summary>
    public partial class UnsuspendBill : Window
    {
        public UnsuspendBill()
        {
            InitializeComponent();
            this.UnsuspendViewModel = new POS.ViewModel.UnSuspendViewModel(this);
            this.Loaded += UnsuspendBill_Loaded;
        }

        void UnsuspendBill_Loaded(object sender, RoutedEventArgs e)
        {
            SettingHelpers.SetLabelsLangugaeWise(this);
            if (this.UnsuspendViewModel.TempTransItemCollection != null && this.UnsuspendViewModel.TempTransItemCollection.Any())
            {
                for (int i = 0; i < dg1.Items.Count; i++)
                {
                    dg1.SelectedIndex = i;
                    dg1.Focus();
                    var selectedRow = (DataGridRow)dg1.ItemContainerGenerator.ContainerFromIndex(0);
                    FocusManager.SetIsFocusScope(selectedRow, true);
                    FocusManager.SetFocusedElement(selectedRow, selectedRow);
                    dg1.MoveFocus(new TraversalRequest(FocusNavigationDirection.Down));
                    SettingHelpers.SetLabelsLangugaeWise(this);
                }
                dg1.SelectedIndex = 0;
            }
        }
        public POS.ViewModel.UnSuspendViewModel UnsuspendViewModel
        {
            get
            {
                return this.DataContext as POS.ViewModel.UnSuspendViewModel;

            }
            set
            {
                this.DataContext = value;
            }
        }

        private void dg1_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            try
            {
                var uiElement = e.OriginalSource as UIElement;
                if (e.Key == Key.Enter && uiElement != null)
                {
                    e.Handled = true;
                    object item = dg1.SelectedItem;
                    SettingHelpers.CurrentTempTransId = ((POSTempTranscationAC)item).POSTempTransId;
                    this.DialogResult = true;
                    this.Close();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }


    }
}

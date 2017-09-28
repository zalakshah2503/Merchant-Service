using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MerchantService.POS.UserControls
{
    /// <summary>
    /// Interaction logic for BusyIndicatorControl.xaml
    /// </summary>
    public partial class BusyIndicatorControl : UserControl
    {
        private const string PERCENTS_TEXT = "{0}%";

        private delegate void VoidDelegete();
        private Timer timer;
        private bool loaded;
        private int progress;

        public BusyIndicatorControl()
        {
            InitializeComponent();

            Loaded += OnLoaded;
        }

        void OnLoaded(object sender, RoutedEventArgs e)
        {
            timer = new Timer(100);
            timer.Elapsed += OnTimerElapsed;
            timer.Start();
            loaded = true;
        }

        void OnTimerElapsed(object sender, ElapsedEventArgs e)
        {
            rotationCanvas.Dispatcher.Invoke
                (
                new VoidDelegete(
                    delegate
                    {
                        SpinnerRotate.Angle += 30;
                        if (SpinnerRotate.Angle == 360)
                        {
                            SpinnerRotate.Angle = 0;
                        }
                    }
                    ),
                null
                );

        }

        private void tblPercents_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (loaded)
            {
                Canvas.SetLeft(tbPercents, (rotationCanvas.ActualHeight - tbPercents.ActualWidth) / 2);
                Canvas.SetTop(tbPercents, (rotationCanvas.ActualHeight - tbPercents.ActualHeight) / 2);
            }
        }

        private void UpdateProgress()
        {
            tbPercents.Text = string.Format(PERCENTS_TEXT, progress);
        }

        public int Progress
        {
            get { return progress; }
            set
            {
                progress = value;
                UpdateProgress();
            }
        }
    }
}

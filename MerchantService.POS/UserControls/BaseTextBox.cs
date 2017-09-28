using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace MerchantService.POS.UserControls
{
    public class BaseTextBox : TextBox
    {
        #region "Private Properties"
        private string lastKeyPress;
        #endregion

        #region "Public Properties"
        /// <summary>
        /// The <see cref="IsNumeric" /> property's name.
        /// </summary>
        public const string IsNumericPropertyName = "IsNumeric";

        private bool _isNumeric;

        /// <summary>
        /// Gets the IsNumeric property.
        /// Changes to that property's value raise the PropertyChanged event. 
        /// This property's value is broadcasted by the Messenger's default instance when it changes.
        /// </summary>
        public bool IsNumeric
        {
            get
            {
                return _isNumeric;
            }

            set
            {
                if (_isNumeric == value)
                {
                    return;
                }

                var oldValue = _isNumeric;
                _isNumeric = value;

                // Update bindings and broadcast change using GalaSoft.MvvmLight.Messenging
                //  RaisePropertyChanged(IsNumericPropertyName, oldValue, value, true);
            }
        }
        /// <summary>
        /// The <see cref="IsString" /> property's name.
        /// </summary>
        public const string IsStringPropertyName = "IsString";

        private bool _isString;

        /// <summary>
        /// Gets the IsString property.
        /// Gets or sets textbox's property to allow entring only alpha characters
        /// Changes to that property's value raise the PropertyChanged event. 
        /// This property's value is broadcasted by the Messenger's default instance when it changes.
        /// </summary>
        public bool IsString
        {
            get
            {
                return _isString;
            }

            set
            {
                if (_isString == value)
                {
                    return;
                }

                var oldValue = _isString;
                _isString = value;

            }
        }

        /// <summary>
        /// The <see cref="IsFloat" /> property's name.
        /// </summary>
        public const string IsFloatPropertyName = "IsFloat";

        private bool _isFloat = false;

        /// <summary>
        /// Gets the IsFloat property.
        /// Changes to that property's value raise the PropertyChanged event. 
        /// This property's value is broadcasted by the Messenger's default instance when it changes.
        /// </summary>
        public bool IsFloat
        {
            get
            {
                return _isFloat;
            }

            set
            {
                if (_isFloat == value)
                {
                    return;
                }

                var oldValue = _isFloat;
                _isFloat = value;

            }
        }
        #endregion

        #region "Events and Methods"
        /// <summary>
        /// Public Constructor.
        /// </summary>
        public BaseTextBox()
        {
            this.TextAlignment = TextAlignment.Left;
            this.TextChanged += new TextChangedEventHandler(BaseTextBox_TextChanged);
            this.MouseDoubleClick += new MouseButtonEventHandler(BaseTextBox_MouseDoubleClick);
        }

        void BaseTextBox_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            this.SelectAll();
        }

        void BaseTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            try
            {
                if (IsFloat)
                {
                    //if (lastKeyPress == ".")
                    //{
                    //    this.Text = this.Text.Replace(".", ",");
                    //    this.CaretIndex = this.Text.Length;
                    //}
                }
            }
            catch (Exception)
            {
            }
            finally
            {

            }
        }
        /// <summary>
        /// Overriden method of On Key Up Event
        /// </summary>
        /// <param name="e"></param>
        protected override void OnKeyUp(System.Windows.Input.KeyEventArgs e)
        {

            try
            {

                //if (!IsFloat)
                //{
                if (!IsString)
                {
                    if (!IsFloat)
                    {
                        if (e.Key == Key.Back || e.Key == Key.Delete)
                        {
                            string text = this.Text;
                            if (string.IsNullOrEmpty(text))
                            {
                                //this.Text = "0";
                            }
                        }
                    }
                    if ((e.Key == Key.LeftCtrl || e.Key == Key.RightCtrl) || e.Key == Key.V)
                    {
                        if (!IsFloatingTypeTextBox(this.Text))
                        {
                            var result = MessageBox.Show("Invalid Format String",
                                                         "Invalid Data", System.Windows.MessageBoxButton.OK);
                            if (result == MessageBoxResult.OK)
                            {
                                this.Text = "";
                            }
                            this.Focus();
                        }
                        else
                        {
                            this.Text = this.Text.Replace(".", ".");
                            this.CaretIndex = this.Text.Length;
                        }

                    }

                }
                //}
                base.OnKeyUp(e);
            }
            catch (Exception)
            {
            }
        }
        /// <summary>
        /// Overriden method of  On previev text input Event
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreviewTextInput(System.Windows.Input.TextCompositionEventArgs e)
        {

            try
            {
                if (IsNumeric)
                {
                    var textBox = e.Source as TextBox;
                    if (textBox != null)
                        e.Handled = !IsNumericTypeTextBox(textBox.Text + e.Text);
                }
                else if (IsString)
                {
                    var textBox = e.Source as TextBox;
                    if (textBox != null)
                        e.Handled = !IsStringTypeTextBok(textBox.Text + e.Text);
                }

                else if (IsFloat)
                {

                    var textBox = (e.Source as TextBox);
                    if (textBox != null)
                    {
                        string text;
                        text = textBox.SelectedText.Length == textBox.Text.Length ? e.Text : textBox.Text.Insert(textBox.CaretIndex, e.Text);
                        if (IsFloatingTypeTextBox(text))
                        {
                            e.Handled = false;
                            lastKeyPress = e.Text;
                        }
                        else
                        {
                            e.Handled = true;
                        }
                    }
                }


                base.OnPreviewTextInput(e);
            }
            catch (Exception )
            {
            }
        }
        /// <summary>
        /// Regualar expression for Numeric Textbox.
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static bool IsNumericTypeTextBox(string text)
        {
            Regex regex = new Regex("[^0-9]+", RegexOptions.IgnoreCase); //regex that matches disallowed text
            return !regex.IsMatch(text);
        }
        /// <summary>
        /// Regular expression for floating point Textbox.
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static bool IsFloatingTypeTextBox(string text)
        {
            // text = text.Replace(".", ",");
            Regex regex = new Regex(@"^\-?\d*\-?\.?\d*$", RegexOptions.IgnoreCase);
            // Regex regex = new Regex(@"^(\-?\d+\,?\d*)$",RegexOptions.IgnoreCase);
            return regex.IsMatch(text);
        }
        /// <summary>
        /// Regular expression for string type Textbox.
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static bool IsStringTypeTextBok(string text)
        {
            Regex regEx = new Regex("[^a-zA-Z'\\s]+", RegexOptions.IgnoreCase);
            return !regEx.IsMatch(text);
        }
        /// <summary>
        /// Method for valudating numeric data.
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        private bool AreAllValidNumericValues(string str)
        {

            try
            {
                //str = str.Replace(".", ",");
                //return Regex.IsMatch(str, "");
                //foreach (char c in str)
                //{
                //    if (!Char.IsDigit(c)) return false;
                //}

                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
        /// <summary>
        /// Got Focus Event of Text box.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnGotFocus(RoutedEventArgs e)
        {
            try
            {
                base.OnGotFocus(e);
                var textBox = e.Source as TextBox;
                if (textBox != null)
                {
                    textBox.SelectAll();
                }

            }
            catch (Exception )
            {
            }
            finally
            {

            }
        }
        #endregion
    }
}

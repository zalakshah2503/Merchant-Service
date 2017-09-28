using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.POS.Utility
{
    public class BillSummary : INotifyPropertyChanged
    {
        private decimal _discount;
        public decimal Discount
        {
            get { return _discount; }
            set
            {
                _discount = value;
                OnPropertyChanged("Discount");
                OnPropertyChanged("DiscountPerc");
            }
        }
        private decimal? _discountPerc;
        public decimal? DiscountPerc
        {
            get
            {
                if (OrderAmount != 0 && Discount != 0)
                {
                    _discountPerc = (Discount * 100) / (OrderAmount + Discount);
                }
                else
                    _discountPerc = 0;

                return Math.Round(_discountPerc.Value, 2);
            }
            set
            {
                _discountPerc = value;
                OnPropertyChanged("DiscountPerc");
            }
        }

        private decimal _orderAmount;
        public decimal OrderAmount
        {
            get { return _orderAmount; }
            set
            {
                _orderAmount = value;
                OnPropertyChanged("OrderAmount");
                OnPropertyChanged("TotalAmount");
                OnPropertyChanged("DiscountPerc");
                OnPropertyChanged("AmountToReturn");
            }
        }

        private decimal _tax;
        public decimal Tax
        {
            get { return _tax; }
            set
            {
                _tax = value;
                OnPropertyChanged("Tax");
            }
        }

        private decimal? _returnAmount;
        public decimal? ReturnAmount
        {
            get { return _returnAmount; }
            set
            {
                _returnAmount = value;
                OnPropertyChanged("ReturnAmount");
                OnPropertyChanged("TotalAmount");
                OnPropertyChanged("AmountToReturn");
            }
        }
        private decimal? _substitute;
        public decimal? Substitute
        {
            get { return _substitute; }
            set
            {
                _substitute = value;
                OnPropertyChanged("Substitute");
                OnPropertyChanged("TotalAmount");
                OnPropertyChanged("AmountToReturn");
            }
        }

        private decimal? _amountToReturn;
        public decimal? AmountToReturn
        {
            get
            {
                if (_orderAmount != 0)
                {
                    _amountToReturn = (_returnAmount + _substitute - _orderAmount);
                }
                else
                {
                    _amountToReturn = _returnAmount;
                }
                if (_amountToReturn <= 0 || _amountToReturn == null)
                    return _amountToReturn = null;
                else
                    return _amountToReturn.Value;
            }
            set
            {
                _amountToReturn = value;
                OnPropertyChanged("AmountToReturn");
            }
        }

        private decimal? _totalAmount;
        public decimal? TotalAmount
        {
            get
            {
                _totalAmount = (_orderAmount + _tax + (AdditionalAmount == null ? 0
                    : AdditionalAmount.Value)) - ((DownPayment == null ? 0
                    : DownPayment.Value) + (ReturnAmount == null ? 0 : ReturnAmount.Value) +
                     +(Substitute == null ? 0 : Substitute.Value));
                if (_totalAmount < 0)
                    return _totalAmount = 0;
                return _totalAmount;
            }
            set
            {
                _totalAmount = value;
                OnPropertyChanged("TotalAmount");
                OnPropertyChanged("AmountToReturn");
            }
        }
        private decimal? _downPayment;
        public decimal? DownPayment
        {
            get { return _downPayment; }
            set
            {
                _downPayment = value;
                OnPropertyChanged("DownPayment");
            }
        }

        private decimal? _additionalAmount;
        public decimal? AdditionalAmount
        {
            get { return _additionalAmount; }
            set
            {
                _additionalAmount = value;
                OnPropertyChanged("AdditionalAmount");
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        private void OnPropertyChanged(string propName)
        {
            if (PropertyChanged != null)
                this.PropertyChanged(this, new PropertyChangedEventArgs(propName));
        }
    }
}

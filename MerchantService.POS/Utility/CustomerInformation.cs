using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.POS;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.POS.Utility
{
    public class CustomerInformation : INotifyPropertyChanged
    {
        private CustomerProfile _customer;
        public CustomerProfile Customer
        {
            get
            {
                return _customer;
            }
            set
            {
                _customer = value;
                OnPropertyChanged("Customer");
                OnPropertyChanged("CustomerBalanceAmount");
            }
        }
        private CustomerPurchaseOrder _cpo;
        public CustomerPurchaseOrder CPO
        {
            get
            {
                return _cpo;
            }
            set
            {
                _cpo = value;
                OnPropertyChanged("CPO");
            }
        }
       
        private POSReturnBill _returnBill;
        public POSReturnBill ReturnBill
        {
            get
            {
                return _returnBill;
            }
            set
            {
                _returnBill = value;
                OnPropertyChanged("ReturnBill");
            }
        }
     
        private decimal? _customerBalanceAmount = 0;
        public decimal? CustomerBalanceAmount
        {
            get
            {
                if (Customer != null && Customer.IsCreditCustomer)
                {
                    if (Customer.BalanceAmount > 0)
                        _customerBalanceAmount = Customer.BalanceAmount - Customer.TransactionAmount;
                    if (Customer.AmountLimit > 0)
                        _customerBalanceAmount = Customer.AmountLimit - Customer.TransactionAmount;
                }
                return _customerBalanceAmount;
            }
            set
            {
                _customerBalanceAmount = value;
                OnPropertyChanged("CustomerBalanceAmount");
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

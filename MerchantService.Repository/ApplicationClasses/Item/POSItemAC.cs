using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Enums;
using MerchantService.Repository.ApplicationClasses.Admin.Company;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class POSItemAC
    {
        public int PosItemAcId { get; set; }
        public int Id { get; set; }

        public string BranchName { get; set; }
        public string StatusName { get; set; }
        public string ItemNameEn { get; set; }
        public string ItemUnit { get; set; }
        public string Barcode { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public double Discount { get; set; }

        public int ItemQuantiy { get; set; }

        public string UnitName { get; set; }

        public decimal SellPriceA { get; set; }

        public decimal SellPriceB { get; set; }

        public decimal SellPriceC { get; set; }

        public decimal SellPriceD { get; set; }

        public decimal SellPrice { get; set; }
        public decimal CostPrice { get; set; }

        public int ActualQuantity { get; set; }
        public decimal CustomerPrice { get; set; }

        public string FlavourEn { get; set; }
        public string EndDateDemo { get; set; }

        public bool IsOfferItem { get; set; }

        public int ItemId { get; set; }

        public bool IsActive { get; set; }

        public int QuantityLimit { get; set; }

        public ItemProfile ItemProfileObj { get; set; }

        public int RemaingingOfferQuantity { get; set; }

        public int PreivousQuantity { get; set; }

        public int ItemOfferId { get; set; }

    }

    public class POSItemDetail
    {
        public POSItemDetail(CustomerProfile customerProfile, ItemProfile itemProfile, ItemOffer itemOffer, List<BalanceBarcodeAc> ListOfBalanceBarcodeConfiguration)
        {
            _customerProfile = customerProfile;
            _itemProfile = itemProfile;
            _itemOffer = itemOffer;
            _listOfBalanceBarcodeConfiguration = ListOfBalanceBarcodeConfiguration;
            _isOfferItem = itemOffer != null;
            _itemPrice = GetItemPrice(_customerProfile, _itemProfile, _itemOffer, _listOfBalanceBarcodeConfiguration);

        }

        private int _itemId;
        private string _barcode;
        private string _itemName;
        private string _itemNameSecondLangugae;
        private int _itemQuantity;
        private CustomerProfile _customerProfile;
        private ItemProfile _itemProfile;
        private ItemOffer _itemOffer;
        private List<BalanceBarcodeAc> _listOfBalanceBarcodeConfiguration;
        private bool _isOfferItem;

        public int ItemId
        {
            get { return _itemId; }
            set { _itemId = value; }
        }
        public int ItemOfferId { get; set; }
        public int PosItemId { get; set; }
        public string Barcode
        {
            get { return _barcode; }
            set { _barcode = value; }
        }
        public string ItemName
        {
            get { return _itemName; }
            set { _itemName = value; }
        }
        public string ItemNameSecondLanguage
        {
            get { return _itemNameSecondLangugae; }
            set { _itemNameSecondLangugae = value; }
        }

        private decimal _itemPrice;
        public decimal ItemPrice
        {
            get
            {
                return _itemPrice = GetItemPrice(_customerProfile, _itemProfile, _itemOffer, _listOfBalanceBarcodeConfiguration);
            }
            private set
            {
                _itemPrice = value;
            }
        }
        public int ItemQuantity
        {
            get { return _itemQuantity; }
            set { _itemQuantity = value; }
        }
        public double ItemTotal { get; set; }
        public string Unit { get; set; }
        public string Flavour { get; set; }
        public bool IsOfferItem
        {
            get { return _isOfferItem; }
            set { _isOfferItem = value; }
        }
        public bool HasOffer { get; set; }
        public int RemainingOfferQuantity { get; set; }
        public int QuantityLimit
        {
            get { return _itemOffer != null ? _itemOffer.QuantityLimit : 0; }
        }
        public decimal ActualSellPrice
        {
            get
            {
                if (_customerProfile != null && !_customerProfile.IsWalkIn)
                    return GetPriceByCategory(_customerProfile.PriceCategory, _itemProfile);
                return _itemProfile.SellPrice;
            }
        }
        public int AvailableQuantity { get; set; }
        public decimal Total
        {
            get
            {
                return ItemPrice * ItemQuantity;
            }
        }
        public int OldQuantity { get; set; }
        public decimal CostPrice { get; set; }

        public ItemProfile ItemProfile
        {
            get { return _itemProfile; }
            set { _itemProfile = value; }
        }
        public ItemOffer ItemOffer
        {
            get { return _itemOffer; }
            set { _itemOffer = value; }
        }
        public CustomerProfile CustomerProfile
        {
            get
            { return _customerProfile; }
            set
            { _customerProfile = value; }
        }
        public int BaseUnitCount { get; set; }
        public bool IfCustomerPriceLessThanOfferPrice { get; set; }

        /// <summary>
        /// To Get Item Price According to Customer/WalkIn Customer or Offer
        /// </summary>
        /// <param name="customer"></param>
        /// <param name="item"></param>
        /// <returns></returns>
        private decimal GetItemPrice(CustomerProfile customer, ItemProfile item, ItemOffer itemOffer, List<BalanceBarcodeAc> listOfBalanceBarcodeConfiguration)
        {
            if (listOfBalanceBarcodeConfiguration != null && listOfBalanceBarcodeConfiguration.Any() )
            {
                foreach (var balancebarcode in listOfBalanceBarcodeConfiguration)
                {
                    int totalLengthforBalanceBarcode = GetTotalLengthOfBalanceBarcode(balancebarcode);
                    if (item.Barcode.Length == totalLengthforBalanceBarcode)
                    {
                        decimal amount = 0M;
                        if (balancebarcode.AmountStartPosition != null)
                        {
                            amount = Convert.ToInt32(item.Barcode.Substring(Convert.ToInt32(balancebarcode.AmountStartPosition) - 1, Convert.ToInt32(balancebarcode.AmountLength) + 1));
                        }
                        if (balancebarcode.AmountDecimalStartPosition != null)
                        {
                            amount = Convert.ToDecimal(amount.ToString() + "." + item.Barcode.Substring(Convert.ToInt32(balancebarcode.AmountDecimalStartPosition) - 1, Convert.ToInt32(balancebarcode.AmountDecimalLength) + 1));
                        }
                        return amount;
                    }
                }
            }
            var priceWithOffer = 0M;
            if (customer != null && !customer.IsWalkIn)
            {
                var priceWithoutOffer = GetPriceByCategory(customer.PriceCategory, item);
                if (itemOffer != null)
                    priceWithOffer = GetPriceByCategory(customer.PriceCategory, itemOffer);

                IfCustomerPriceLessThanOfferPrice = priceWithoutOffer < priceWithOffer;
                //return minimum of customer and offer price
                return priceWithOffer > 0 ? Math.Min(priceWithoutOffer, priceWithOffer) : priceWithoutOffer;
            }
            IfCustomerPriceLessThanOfferPrice = false;
            return itemOffer != null ? itemOffer.SellPrice : item.SellPrice;
        }
        /// <summary>
        /// Get customer category wise price
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        private decimal GetPriceByCategory(string categoryId, dynamic obj)
        {
            decimal itemPrice = 0;
            categoryId = categoryId == null ? PriceCategory.NormalPrice.ToString() : categoryId;
            var customerCategory = (PriceCategory)Enum.Parse(typeof(PriceCategory), categoryId);
            if (obj != null)
            {
                switch (customerCategory)
                {
                    case PriceCategory.A:
                        itemPrice = obj.SellPriceA;
                        break;
                    case PriceCategory.B:
                        itemPrice = obj.SellPriceB;
                        break;
                    case PriceCategory.C:
                        itemPrice = obj.SellPriceC;
                        break;
                    case PriceCategory.D:
                        itemPrice = obj.SellPriceD;
                        break;
                    default:
                        itemPrice = obj.SellPrice;
                        break;
                }
            }
            return itemPrice;
        }

        // get total length of balance barcode
        private int GetTotalLengthOfBalanceBarcode(BalanceBarcodeAc BalanceBarcode)
        {
            int maxValue = 0;
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.PrefixStartPosition, BalanceBarcode.PrefixLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.SubBarcodeStartPosition, BalanceBarcode.SubBarcodeLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.WeightStartPosition, BalanceBarcode.WeightLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.WeightDecimalStartPosition, BalanceBarcode.WeightDecimalLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.WeightUnitStartPosition, BalanceBarcode.WeightUnitLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.AmountStartPosition, BalanceBarcode.AmountLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.AmountDecimalStartPosition, BalanceBarcode.AmountDecimalLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.SuffixStartPosition, BalanceBarcode.SuffixLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.CheckSumStartPosition, BalanceBarcode.CheckSumLength);
            maxValue = this.checkTotalLength(maxValue, BalanceBarcode.OtherStartPosition, BalanceBarcode.OtherLength);
            return maxValue;
        }

        //this method usd for calcualte total length of balance barcode.
        private int checkTotalLength(int maxValue, int? startPosition, int? length)
        {
            if (startPosition != null && startPosition != 0 && length != null && length != 0)
            {
                if (maxValue < Convert.ToInt32(startPosition) + Convert.ToInt32(length))
                {
                    maxValue = Convert.ToInt32(startPosition) + Convert.ToInt32(length);
                }
            }
            return maxValue;
        }

        public bool IsActive { get; set; }
    }
}

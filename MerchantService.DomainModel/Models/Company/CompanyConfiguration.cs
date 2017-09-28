using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Globalization;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Company
{
    public class CompanyConfiguration : MerchantServiceBase
    {
        public int CompanyId { get; set; }
        public int NormalBarcodeFrom { get; set; }
        public int NormalBarcodeTo { get; set; }
        public string PriceStartFrom { get; set; }
        public int PriceDigitLength { get; set; }
        public bool CreditCardPayment { get; set; }
        public bool DebitCardPayment { get; set; }
        public bool ChequePayment { get; set; }
        public bool CoupanPayment { get; set; }
        public bool CreditAccountPayment { get; set; }
        public bool AllowCreditAccountLimit { get; set; }
        public decimal CPODownPaymentDiscount { get; set; }
        public bool ReturnItem { get; set; }
        public string InvoiceNo { get; set; }
        public string ReturnInvoiceNo { get; set; }
        public string CPOInvoiceNo { get; set; }
        public string SPOInvoiceNo { get; set; }
        public string ItemDestructionNo { get; set; }
        public string SupplierReturnNo { get; set; }
        public decimal ProfitMargin { get; set; }
        public int LanguageId { get; set; }
        public int? CurrencyId { get; set; }
        public bool IsIcrrGeneratedAtAddItem { get; set; }
        public bool IsOfferCreatedBelowCostPrice { get; set; }
        public bool IsIcrCreatedBelowCostPrice { get; set; }
        public bool CashPayment { get; set; }
        public int? ValidNumberOfDaysForReturnItem { get; set; }

        public decimal? UpperBound { get; set; }

        public decimal? LowerBound { get; set; }

        public bool IsLogAllowed
        {
            get { return true; }
            set { value = IsLogAllowed; }
        }


        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }

        [ForeignKey("LanguageId")]
        public virtual Language Language { get; set; }

        [ForeignKey("CurrencyId")]
        public virtual CurrencyDetail CurrencyDetail { get; set; }
    }
}

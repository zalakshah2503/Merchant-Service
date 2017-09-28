using MerchantService.DomainModel.Models.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin.Company
{
    public class CompanyDetailAC
    {
        public int CompanyId { get; set; }
        public string Name { get; set; }
        public string NameSL { get; set; }
        public string Location { get; set; }
        public string Email { get; set; }
        public string Zipcode { get; set; }
        public string PhoneNumber { get; set; }
        public int CompanyConfigId { get; set; }
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
        public int? ValidNumberOfDaysForReturnItem { get; set; }
        public decimal ProfitMargin { get; set; }
        public bool CashPayment { get; set; }
        public int LanguageId { get; set; }
        public int? CurrencyId { get; set; }
        public decimal UpperBound { get; set; }
        public decimal LowerBound { get; set; }
        public bool IsIcrrGeneratedAtAddItem { get; set; }

        public bool IsOfferCreatedBelowCostPrice { get; set; }

        public bool IsIcrCreatedBelowCostPrice { get; set; }

        public bool IsDeleteOrEdit { get; set; }

        public string userId { get; set; }

        public List<AdditionalServiceAC> CPOConfigurations { get; set; }

        public CompanyBarcodeConfiguration CompanyBarcodeConfiguration { get; set; }

        public List<BalanceBarcodeAc> ListOfBalanceBarcodeConfiguration { get; set; }
    }
}

using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class ReturnBillReceiptAC
    {
        public string Date { get; set; }

        public long MemberShipNumber { get; set; }

        public string ReturnInvoiceNumber { get; set; }

        public string InvoiceNo { get; set; }
        public string Invoice { get; set; }
        public decimal ReturnAmount { get; set; }

        public decimal ReturnSubtituteAmount { get; set; }

        public string CompanyName { get; set; }

        public string CompanyAddress { get; set; }

        public decimal TotalQuantity { get; set; }

        public List<ReturnBillList> ListOfReturnBillList { get; set; }
    }

    public class ReturnBillList
    {
        public decimal Total { get; set; }

        public decimal Price { get; set; }

        public decimal ReturnQuantity { get; set; }

        public string ItemName { get; set; }

        public string ItemNameArebic { get; set; }

    }
}

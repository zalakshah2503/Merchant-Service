using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class ReturnBillDetailAc
    {
        public List<ReturnBillAC> ReturnBillList { get; set; }

        public List<ReturnBillPaymentTypeListAC> ReturnBillPaymentTypeList { get; set; }

        public List<RetunrBillItemListAC> ReturnBillItemList { get; set; }
    }

    public class ReturnBillAC
    {
        public int BillId { get; set; }
        public string BillNumber { get; set; }

        public DateTime BillDate { get; set; }

        public string CustomerName { get; set; }

        public Int64 CustomerNumber { get; set; }

        public string CashierName { get; set; }

        public string Branch { get; set; }

        public int BranchId { get; set; }

        public decimal Amount { get; set; }
    }

    public class ReturnBillPaymentTypeListAC
    {
        public int PaymentId { get; set; }

        public decimal Amount { get; set; }

        public string PaymentType { get; set; }

        public string BankTransactionNumber { get; set; }

    }

    public class RetunrBillItemListAC
    {
        public int POSBillItemId { get; set; }

        public int ReturnBillItem { get; set; }

        public string BarCode { get; set; }

        public string Name { get; set; }

        public string Flavour { get; set; }

        public string Unit { get; set; }

        public decimal SellPrice { get; set; }

        public int BillQunatity { get; set; }

        public int ReturnQunatity { get; set; }

        public int ReturnedQunatity { get; set; }
    }
}

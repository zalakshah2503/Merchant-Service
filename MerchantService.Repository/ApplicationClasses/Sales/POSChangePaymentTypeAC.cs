
namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSChangePaymentTypeAC
    {
        public int POSSeesionBillId { get; set; }
        public decimal Cash { get; set; }
        public decimal DebitCard { get; set; }
        public string ReceiptNoDebitCard { get; set; }
        public decimal CreditCard { get; set; }
        public string ReceiptNoCreditCard { get; set; }
        public decimal Coupon { get; set; }
        public string CouponNo { get; set; }
        public decimal BillAmount { get; set; }
        public decimal Cheque { get; set; }
        public string ChequeNo { get; set; }
    }
}

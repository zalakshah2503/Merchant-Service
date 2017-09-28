
namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CPOPaymentAC
    {
        public int CPOPaymentId { get; set; }
        public decimal Cash { get; set; }
        public decimal CreditCardAmount { get; set; }
        public decimal DebitCardAmount { get; set; }
        public decimal CouponAmount { get; set; }
        public decimal CreditAccountAmount { get; set; }
        public int CreditCardReceipt { get; set; }
        public int DebitCardReceipt { get; set; }
        public int CouponNo { get; set; }
        public string Comment { get; set; }
    }
}



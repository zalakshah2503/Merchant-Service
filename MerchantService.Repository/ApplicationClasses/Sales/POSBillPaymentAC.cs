
namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSBillPaymentAC
    {
        public int POSBillID { get; set; }
        public string PaymentType { get; set; }
        public int PaymentTypeId { get; set; }
        public decimal Amount { get; set; }
        public string BankPOSTransNo { get; set; }
        public string BillNo { get; set; }
    }
}

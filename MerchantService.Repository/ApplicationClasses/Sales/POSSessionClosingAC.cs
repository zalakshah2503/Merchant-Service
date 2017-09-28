
namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSSessionClosingAC
    {
        public int POSSessionId { get; set; }
        public int POSLoginSessionId { get; set; }
        public int MismatchResolveTypeID { get; set; }
        public decimal ActualCash { get; set; }
        public decimal ActualDebitCard { get; set; }
        public decimal ActualCreditCard { get; set; }
        public decimal ActualCoupon { get; set; }
        public decimal ActualCreditAccount { get; set; }
        public decimal ActualReturnBill { get; set; }
        public decimal ActualSalesTotalIn { get; set; }
        public decimal ActualSalesTotalOut { get; set; }
        public decimal SystemCash { get; set; }
        public decimal SystemDebitCard { get; set; }
        public decimal SystemCreditCard { get; set; }
        public decimal SystemCoupon { get; set; }
        public decimal SystemCreditAccount { get; set; }
        public decimal SystemReturnBill { get; set; }
        public decimal SystemSalesTotalIn { get; set; }
        public decimal SystemSalesTotalOut { get; set; }
        public decimal ActualCheque { get; set; }
        public decimal SystemCheque { get; set; }
        public int CashierId { get; set; }
        public string Comment { get; set; }
        public int StatusId { get; set; }
    }
}


namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSNonSalesTransactionListAC
    {
        public int Id { get; set; }
        public int POSSessionId { get; set; }

        public string TransactionType { get; set; }

        public decimal Amount { get; set; }

        public string Remark { get; set; }
    }
}

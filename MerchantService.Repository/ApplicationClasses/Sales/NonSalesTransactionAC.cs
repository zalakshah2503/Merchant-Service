
namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class NonSalesTransactionAC
    {
        public int POSSessionId { get; set; }

        public int TransactionTypeId { get; set; }

        public decimal Amount { get; set; }

        public string Remark { get; set; }
    }
}

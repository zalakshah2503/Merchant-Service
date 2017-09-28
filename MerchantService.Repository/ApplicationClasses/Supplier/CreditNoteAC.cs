
namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class CreditNoteAC
    {
        public int Id { get; set; }
        public string CreditNoteNo { get; set; }
        public decimal Amount { get; set; }
        public decimal ActualAmount { get; set; }
        public string Status { get; set; }
        public bool IsCollected { get; set; }
        public decimal RemaningAmount { get; set; }
        public string InitiationDate { get; set; }
        public int SupplierId { get; set; }
        public bool IsShow { get; set; }
        public string SupplierName { get; set; }
    }
}

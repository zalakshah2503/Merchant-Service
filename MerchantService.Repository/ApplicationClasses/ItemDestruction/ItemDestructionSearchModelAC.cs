
namespace MerchantService.Repository.ApplicationClasses.ItemDestruction
{
    public class ItemDestructionSearchModelAC
    {
        public string ItemNameEn { get; set; }
        public string ItemCode { get; set; }
        public string Barcode { get; set; }
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        public int UnitParamTypeId { get; set; }
        public int BranchId { get; set; }
    }
}

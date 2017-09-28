
namespace MerchantService.Repository.ApplicationClasses.ItemChangeRequest
{
    public class IcrQuantityAC
    {
        public int Id { get; set; }
        public int IcrId { get; set; }
        public int BranchId { get; set; }
        public int ActualQuantity { get; set; }
        public string BranchName { get; set; }
        public int ModifyingQuantity { get; set; }
        public bool IsAddOperation { get; set; }
    }
}

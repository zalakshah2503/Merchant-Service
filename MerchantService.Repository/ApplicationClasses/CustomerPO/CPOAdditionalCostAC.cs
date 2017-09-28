
namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CPOAdditionalCostAC
    {
        public int CPOAdditionalCostId { get; set; }
        public int CPOId { get; set; }
        public int AdditionalServiceId { get; set; }
        public decimal Amount { get; set; }
    }
}

namespace MerchantService.Repository.ApplicationClasses.Admin.Company
{
    public class AdditionalServiceAC
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string AdditionalCostType { get; set; }
    }
}
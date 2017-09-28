using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.Company
{
    public class CompanyDetail : MerchantServiceBase
    {
        public string Name { get; set; }
        public string NameSL { get; set; }
        public string Location { get; set; }
        public string Email { get; set; }
        public string Zipcode { get; set; }
        public string PhoneNumber { get; set; }
        public string UserId { get; set; }
        public bool IsDeleted { get; set; }
    }
}

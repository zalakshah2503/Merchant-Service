using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Branch
{
    public class AdditionalService : MerchantServiceBase
    {
        public int CompanyId { get; set; }
        public string Name { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
    }
}

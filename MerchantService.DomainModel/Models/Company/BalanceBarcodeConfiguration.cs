using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Company
{
    public class BalanceBarcodeConfiguration : MerchantServiceBase
    {
        public int CompanyId { get; set; }

        public string Name { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }

       
    }
}

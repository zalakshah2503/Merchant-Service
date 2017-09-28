using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.Company;

namespace MerchantService.DomainModel.Models.Globalization
{
    public class SecondaryLanguage : MerchantServiceBase
    {
        public int GlobalizationDetailId { get; set; }
        public string ValueSl { get; set; }

        public int CompanyId { get; set; }

        [ForeignKey("GlobalizationDetailId")]
        public virtual GlobalizationDetail GlobalizationDetail { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
    }
}

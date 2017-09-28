using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Company
{
    public class CompanyBarcodeConfiguration : MerchantServiceBase
    {
        public int CompanyId { get; set; }

        public int? StartWith { get; set; }

        public int To { get; set; }

        public int From { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
    }
}

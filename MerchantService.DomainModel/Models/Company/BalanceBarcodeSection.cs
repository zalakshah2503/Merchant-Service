using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Company
{
    public class BalanceBarcodeSection : MerchantServiceBase
    {
        public int ConfigurationId { get; set; }

        public BarcodeSection Section { get; set; }

        public int? StartPosition { get; set; }

        public int? Length { get; set; }

        [ForeignKey("ConfigurationId")]
        public virtual BalanceBarcodeConfiguration BalanceBarcodeConfiguration { get; set; }
    }
}

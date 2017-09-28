using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Globalization
{
    public class GlobalizationDetail : MerchantServiceBase
    {
        public int ModuleId { get; set; }

        public string Key { get; set; }

        public string ValueEn { get; set; }


        [ForeignKey("ModuleId")]
        public virtual ModuleInfo ModuleInfo { get; set; }

    }
}

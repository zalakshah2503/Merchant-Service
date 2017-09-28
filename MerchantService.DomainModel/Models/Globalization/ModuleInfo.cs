using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations;

namespace MerchantService.DomainModel.Models.Globalization
{
    public class ModuleInfo : MerchantServiceBase
    {
        [MaxLength(100)]
        public string ModuleName { get; set; }

        public bool IsActive { get; set; }
    }
}

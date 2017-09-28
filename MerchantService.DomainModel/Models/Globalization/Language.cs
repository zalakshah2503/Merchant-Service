using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations;

namespace MerchantService.DomainModel.Models.Globalization
{
    public class Language : MerchantServiceBase
    {
        [MaxLength(50)]
        public string Name { get; set; }
        public bool IsRTL { get; set; }
    }
}
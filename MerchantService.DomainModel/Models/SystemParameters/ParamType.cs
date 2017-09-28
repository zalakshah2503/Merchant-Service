using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.SystemParameters
{
    public class ParamType : MerchantServiceBase
    {
        public string ValueEn { get; set; }

        public string ValueSl { get; set; }

        public bool IsDeleted { get; set; }

        public int ParamId { get; set; }

        [ForeignKey("ParamId")]
        public virtual Param Param { get; set; }
    }
}

using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SystemParameters
{
    public class SystemParameter : MerchantServiceBase
    {
        public string ValueEn { get; set; }
        public string ValueSl { get; set; }
        public bool IsDelete { get; set; }
        public int ParamId { get; set; }

        public int CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }

        [ForeignKey("ParamId")]
        public virtual Param Param { get; set; }
    }
}

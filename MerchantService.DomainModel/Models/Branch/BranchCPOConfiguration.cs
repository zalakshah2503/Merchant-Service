using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Branch
{
    public class BranchCPOConfiguration : MerchantServiceBase
    {
        public int BranchId { get; set; }
        public int AdditionalServiceId { get; set; }
        public decimal Amount { get; set; }
        public bool IsDelete { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }
        [ForeignKey("AdditionalServiceId")]
        public virtual AdditionalService AdditionalService { get; set; }

    }
}

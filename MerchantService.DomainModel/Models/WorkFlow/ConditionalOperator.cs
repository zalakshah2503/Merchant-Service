using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class ConditionalOperator : MerchantServiceBase
    {

        public int WorkFlowDetailId { get; set; }
        public string Variable1 { get; set; }
        public string Operator { get; set; }
        public string Variable2 { get; set; }
        public int? ParentConditionalOperatorId { get; set; }
        public string Condition { get; set; }
        public bool IsBoolenCondtion { get; set; }

        [ForeignKey("WorkFlowDetailId")]
        public virtual WorkFlowDetail WorkFlowDetail { get; set; }
    }
}

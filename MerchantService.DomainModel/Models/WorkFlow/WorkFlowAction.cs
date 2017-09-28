using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class WorkFlowAction : MerchantServiceBase
    {
        public int WorkFlowId { get; set; }

        public string Name { get; set; }
        [ForeignKey("WorkFlowId")]
        public virtual ParentPermission ParentPermission { get; set; }
    }
}

using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.WorkFlow;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SystemParameters
{
    public class ParentRecord : MerchantServiceBase
    {
        public int WorkFlowId { get; set; }
        public int? BranchId { get; set; }
        public string InitiatorId { get; set; }
        public DateTime InitiationDate { get; set; }
        public string InitiationComment { get; set; }
        public string ModifiedUserId { get; set; }
        public DateTime ModificationDate { get; set; }
       
        [ForeignKey("BranchId")]
        public virtual BranchDetail Branch { get; set; }

        [ForeignKey("WorkFlowId")]
        public virtual WorkFlowDetail WorkFlowDetail { get; set; }


    }
}

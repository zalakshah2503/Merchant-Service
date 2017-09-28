using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class WorkFlowLog : MerchantServiceBase
    {
        public int RecordId { get; set; }
        public string UserId { get; set; }
        public int RoleId { get; set; }
        public string Comments { get; set; }
        public int WorkFlowId { get; set; }

        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("WorkFlowId")]
        public virtual WorkFlowDetail WorkFlowDetail { get; set; }
        public string Stage { get; set; }
        public string Action { get; set; }
      
        [ForeignKey("RoleId")]
        public virtual Role.Role RoleDetails { get; set; }

      
    }
}

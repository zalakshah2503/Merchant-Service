using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class  WorkFlowDetail : MerchantServiceBase
    {
        public string WorkFlowName { get; set; }
        public int WorkFlowId { get; set; }
        public int ActivityId { get; set; }
        public int InitiatorId { get; set; }
        public bool IsChildCondition { get; set; }
        public int AssignedId { get; set; }
        public string CreatedBy { get; set; }
        public bool IsApproval { get; set; }
        public bool IsReview { get; set; }
       
        //public int? WorkFlowActionId { get; set; }
        public int? NextActivityId { get; set; }
        public int? OtherWorkFlowId { get; set; }
        public int ParentActivityId { get; set; }
        public bool IsApprovePanel { get; set; }
        public bool IsParentAction { get; set; }
        public bool IsChildAction { get; set; }
        public bool IsRejectPanel { get; set; }
        [ForeignKey("ActivityId")]
        public virtual ChildPermission Activity { get; set; }
        [ForeignKey("NextActivityId")]
        public virtual ChildPermission NextActivity { get; set; }
        public int CompanyId { get; set; }

        [ForeignKey("InitiatorId")]
        public virtual Role.Role InitiatorRole { get; set; }

        [ForeignKey("AssignedId")]
        public virtual Role.Role AssignedRole { get; set; }

        //[ForeignKey("OldStatusId")]
        //public virtual StatusType OldStatus { get; set; }
        //[ForeignKey("NewStatusId")]
        //public virtual StatusType NewStatus { get; set; }

        [ForeignKey("WorkFlowId")]
        public virtual ParentPermission ParentPermission { get; set; }
        public bool IsAllowOtherWorkFlow { get; set; }
        //[ForeignKey("WorkFlowActionId")]
        //public virtual WorkFlowAction WorkFlowAction { get; set; }
        public bool IsClosed { get; set; }
        public bool IsCondition { get; set; }

        public bool IsAllowOtherBranchUser { get; set; }
    }
}

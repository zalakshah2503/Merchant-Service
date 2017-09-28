using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.WorkFlow
{
   public class WorkFlowAc
    {
        //PermissionId: number;
        //RoleId: number;
        //Permission: any;
       public int PermissionId { get; set; }
       public bool IsCondition { get; set; }
       public int ActivityId { get; set; }
       public int workFlowActionId { get; set; }
       public bool IsApproval { get; set; }
       public string Operator { get; set; }
       public int WorkFlowDetailParentId { get; set; }
       public int ParentActivityId { get; set; }
       public int WorkFlowParentActivityId { get; set; }
       public string WorkFlowName { get; set; }
       public bool IsAllowOtherBranchUser { get; set; }
       public List<WorkFlowPermission> Permission {get;set;}

      
    }

    public class WorkFlowConditionalOperator
    {
        public int WorkFlowDetailId { get; set; }
        public string Variable1 { get; set; }
        public string Operator { get; set; }
        public string Variable2 { get; set; }
        public int? ParentConditionalOperatorId { get; set; }
        public string ConditionInfo { get; set; }
        public int ConditionalOperatorId { get; set; }
        public bool IsActiveConditional { get; set; }
        public bool IsBoolenCondtion { get; set; }
    }
public class WorkFlowPermission{
    public List<WorkFlowConditionalOperator> ConditionalOperator { get; set; } 

    public WorkFlowPermission()
        {
            Children = new List<WorkFlowPermission>();
        }
    public bool IsAllowOtherBranchUser { get; set; }
    public List<WorkFlowPermission> Children { get; set; } 
      public int WorkFlowId { get; set; }
      public int? OtherWorkFlowId { get; set; }
        public int ActivityId { get; set; }
        public int InitiatorId { get; set; }
       // public int OldStatus { get; set; }
       // public int NewStatus { get; set; }
        public int AssignedId { get; set; }
        public bool IsApproval { get; set; }
        public bool IsReview { get; set; }
        public string CreatedBy { get; set; }
        public int? ActionId { get; set; }
        public bool IsAllowOtherWorkFlow { get; set; }
        public bool IsClosed { get; set; }
        public int ParentActivityId { get; set; }
        public int? NextActivityId { get; set; }
        public bool IsApprovePanel { get; set; }
        public bool IsRejectPanel { get; set; }
        public int workFlowActionId { get; set; }
        public bool IsParentAction { get; set; }
        public bool IsChild { get; set; }
        public string Variable1 { get; set; }
        public string Operator { get; set; }
        public string Variable2 { get; set; }
        public bool IsCondition { get; set; }

        public bool IsActivityClose { get; set; }

}
}

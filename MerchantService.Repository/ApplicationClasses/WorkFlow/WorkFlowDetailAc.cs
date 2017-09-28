using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.WorkFlow
{
   public class WorkFlowDetailAc
    {
       public int WorkFlowId { get; set; }
       public string WorkFlowName { get; set; }
       public bool HasChildActivity { get; set; }
       public int InitiatorId { get; set; }
       public List<WorkFlowChildActivityAc> WorkFlowChildActivity { get; set; }
    }

    //commmet appication class
   public class WorkFlowChildActivityAc
   {
       public int WorkFlowId { get; set; }
       public string ActivityName { get; set; }
       public string RoleFrom { get; set; }
       public string RoleTo { get; set; }
       public string OldStatus { get; set; }
       public string NewStatus { get; set; }
       public bool IsCondition { get; set; }
       public string Action { get; set; }
   }

   public class WorkFlowActivityAc
   {
       public int WorkFlowId { get; set; }
       public string WorkFlowName { get; set; }
       public int WorkFlowNameId { get; set; }
       public string ActivityName { get; set; }
       public int ActivityId { get; set; }
       public string RoleFromName { get; set; }
       public string RoleToName { get; set; }
       public string OldStatus { get; set; }
       public string NewStatus { get; set; }
       public int RoleFromId { get; set; }
       public int RoleToId { get; set; }
       public int OldStatusId { get; set; }
       public int NewStatusId { get; set; }
       public bool IsCondition { get; set; }
       public bool IsInitial { get; set; }
       public bool IsClosed { get; set; }
       public bool IsApproval { get; set; }
       public bool IsReview { get; set; }
   }


   public class WorkFlowTreeNodeAc
   {
       public WorkFlowTreeNodeAc()
        {
            Children = new List<WorkFlowTreeNodeAc>();
        }

       public string WorkFlowName { get; set; }
       public bool IsCondition { get; set; }
       public int ParentWorkFlowId { get; set; }
       public bool IsCollapse { get; set; }
       public bool IsCollapseActive { get; set; }
       public int WorkFlowId { get; set; }
       public string ActivityName { get; set; }
       public string Initiator { get; set; }
       public string Assigned { get; set; }
       //public string OldStatus { get; set; }
       //public string NewStatus { get; set; }
       public bool IsApproval { get; set; }
       public bool IsReview { get; set; }
       public bool IsParentNode { get; set; }
       public bool IsClosed { get; set; }
       public bool IsApprovePanel { get; set; }
       public bool IsRejectPanel { get; set; }

       public bool IsAllowEdit { get; set; }
       public List<WorkFlowTreeNodeAc> Children { get; set; }

       public bool IsAllowOtherWorkFLow { get; set; }
   }
}

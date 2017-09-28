using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.CustomAttributes;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.WorkFlow
{
   public interface IWorkFlowRepository : IDisposable
    {
       List<StatusTypeAc> GetallStatus();

       StatusTypeAc UpdateStatusDetails(StatusTypeAc status);

       StatusType SaveStatusDetails(StatusTypeAc status);
       List<ParentPermission> GetAllWorkFlowName();

       List<RoleAc> CheckPermissionRole (int permissionId,int companyId);

      // List<PermissionAc> AddWorkFlowDetails(int permissionId, int roleId);

       List<PermissionAc> AddWorkFlowDetails(int permissionId);



       List<PermissionAc> EditWorkFlowPermission(int permissionId);
       int SaveWorkFlowDetails(WorkFlowDetail workFlowDetails);

       List<WorkFlowDetailAc> GetAllWorkFlowList(string currentUser);

       List<WorkFlowAction> GetAllWorkFlowAcionList(int activityId);

       List<WorkFlowTreeNodeAc> GetWorkFlowDetailsForTreeViewByActivityId(int activityId);

       int SaveWorkFlowActionDetails(WorkFlowDetail workFlowDetails);

       WorkFlowAc EditWorkFlowInformationById(int workFlowId);

       List<PermissionAc> GetAllActivityList();
       List<WorkFlowTreeNodeAc> GetWorkFlowTreeViewByActivityId(int activityId);

       void DeleteWorkFlowInformation(int workFlowId);

       void DeleteInformation(int workId);
       List<CustomAttributesAc> GetAttributeListByActivityId(int activityId);


       int SaveWorkConditionalOperatorDetails(ConditionalOperator conditionlOperator);

       void DeleteConditionalOperator(int conditionalOperator);

       /// <summary>
       /// This method used fo get condition operator by work flow id. -An
       /// </summary>
       /// <param name="workFlowId"></param>
       /// <returns></returns>
       ConditionalOperator GetConditionalOperatorByWorkFlowId(int workFlowId);

       bool WorkFLowNameAlreadyExistOrNot(WorkFlowAc workFlowDetails);


       List<WorkFlowDetailAc> GetAllWorkFlowNameList(string currentUser);

       List<CustomAttributesAc> GetAllBoolenOperatorListByActivityId(int activityId);
    }
}

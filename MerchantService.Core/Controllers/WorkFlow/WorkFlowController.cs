using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.WorkFlow
{
    //[DynamicAuthorize]
    public class WorkFlowController : ApiController
    {
       private readonly IErrorLog _errorLog;
       private readonly IWorkFlowRepository _workFlowRepository;
       private readonly ICompanyRepository _companyRepository;
       private int _parentActivityId ;
       private int _childActivityId ;
       private int _conditionalOperatorParentId;
       private readonly IDataRepository<CompanyDetail> _companyDataRepository;

       public WorkFlowController(IErrorLog errorLog, IWorkFlowRepository workFlowRepository, ICompanyRepository companyRepository, IDataRepository<CompanyDetail> companyDataRepository)
       {
           _workFlowRepository = workFlowRepository;
           _errorLog = errorLog;
           _companyRepository = companyRepository;
           _companyDataRepository = companyDataRepository;
       }

       [HttpGet]
       [Route("api/WorkFlow/getallStatus")]
       public IHttpActionResult GetallStatus()
       {
           try
           {
               var statusCollection = _workFlowRepository.GetallStatus();
               return Ok(statusCollection);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpPut]
       [Route("api/WorkFlow/updateStatusDetails")]
       public IHttpActionResult UpdateStatusDetails(StatusTypeAc statusTypeDetails)
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   var statusCollection = _workFlowRepository.UpdateStatusDetails(statusTypeDetails);
                   return Ok(statusCollection);
               }
               else
               {
                   return BadRequest();
               }
               
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpPost]
       [Route("api/WorkFlow/saveStatusDetails")]
       public IHttpActionResult SaveStatusDetails(StatusTypeAc status)
       {
           try
           {
               var statusdetails = _workFlowRepository.SaveStatusDetails(status);
               return Ok(statusdetails);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getAllWorkFlowName")]
       public IHttpActionResult GetAllWorkFlowName()
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   var workFlowNameCollection = _workFlowRepository.GetAllWorkFlowName();
                   return Ok(workFlowNameCollection);
               }
               else
               {
                   return BadRequest();
               }
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/checkPermissionRole")]
       public IHttpActionResult CheckPermissionRole(int permissionId)
       {
           try
           {
               if(HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   string userId = HttpContext.Current.User.Identity.GetUserId();
                   var companyDetail = _companyRepository.GetCompanyDetailByUserId(userId);
                   var rolePermissionDetails = _workFlowRepository.CheckPermissionRole(permissionId, companyDetail.Id);
                   var roleList = rolePermissionDetails.GroupBy(x => new { x.Id, x.RoleName }).ToList();
                   var roleCollection = new List<RoleAc>();
                   foreach (var role in roleList)
                   {
                       var roleAc = new RoleAc();
                       roleAc.Id = role.Key.Id;
                       roleAc.RoleName = role.Key.RoleName;
                       roleCollection.Add(roleAc);
                   }
                   return Ok(roleCollection);
               }
               else
               {
                   return BadRequest();
               }
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       //[Route("api/WorkFlow/addWorkFlowDetails/{permissionId}/{roleId}")]
       [Route("api/WorkFlow/addWorkFlowDetails")]
       public IHttpActionResult AddWorkFlowDetails(int permissionId)
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   var permission = _workFlowRepository.AddWorkFlowDetails(permissionId);
                   return Ok(permission);
               }
               else
               {
                   return BadRequest();
               }
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }
       //public IHttpActionResult AddWorkFlowDetails(int permissionId,int roleId)
       //{
       //    try
       //    {
       //        var permission = _workFlowRepository.AddWorkFlowDetails(permissionId, roleId);
       //        return Ok(permission);
       //    }
       //    catch (Exception ex)
       //    {
       //        _errorLog.LogException(ex);
       //        throw;
       //    }
       //}

       [HttpPost]
       [Route("api/WorkFlow/saveWorkFlowDetails")]
       public IHttpActionResult SaveWorkFlowDetails(WorkFlowAc workFlowDetails)
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   var userId = HttpContext.Current.User.Identity.GetUserId();
                   var companyDetails = _companyDataRepository.FirstOrDefault(x => x.UserId == userId);
                   if (companyDetails != null)
                   {
                       foreach (var workFlow in workFlowDetails.Permission)
                       {
                           if (workFlow != null)
                           {
                               if (workFlow.IsApproval || workFlow.IsReview || workFlow.IsClosed || workFlow.IsCondition)
                               {
                                   var workFlowDetail = new WorkFlowDetail
                                   {
                                       WorkFlowName = workFlowDetails.WorkFlowName,
                                       WorkFlowId = workFlowDetails.PermissionId,
                                       InitiatorId = workFlow.InitiatorId,
                                       AssignedId = workFlow.AssignedId,
                                       //OldStatusId = workFlow.OldStatus,
                                       //NewStatusId = workFlow.NewStatus,
                                       //CreatedDateTime = DateTime.UtcNow,
                                       CreatedBy = HttpContext.Current.User.Identity.GetUserId(),
                                       IsApproval = workFlow.IsApproval,
                                       IsReview = workFlow.IsReview,
                                       // WorkFlowActionId = workFlow.ActionId,
                                       CompanyId = companyDetails.Id,
                                       ActivityId = workFlow.ActivityId,
                                       NextActivityId = workFlow.NextActivityId,
                                       IsClosed = workFlow.IsClosed,
                                       IsParentAction = true,
                                       Id = workFlowDetails.workFlowActionId,
                                       //Variable1 = workFlow.Variable1,
                                       //Variable2 = workFlow.Variable2,
                                       //Operator = workFlow.Operator,
                                       IsCondition = workFlow.IsCondition,
                                       IsAllowOtherBranchUser = workFlow.IsAllowOtherBranchUser,
                                       ParentActivityId = 0,
                                       
                                   };
                                   IsChildCondtion = workFlowDetail.IsCondition;
                                   _parentActivityId = _workFlowRepository.SaveWorkFlowActionDetails(workFlowDetail);
                                   if (workFlow.IsCondition)
                                       foreach (var workFlowConditionalOperator in workFlow.ConditionalOperator)
                                       {
                                           //if (workFlowConditionalOperator.ConditionInfo == null)
                                           //{
                                           var conditionlOperator = new ConditionalOperator
                                           {

                                               Id = workFlowConditionalOperator.ConditionalOperatorId,
                                               Variable1 = workFlowConditionalOperator.Variable1,
                                               Variable2 = workFlowConditionalOperator.Variable2,
                                               Condition = workFlowConditionalOperator.ConditionInfo,
                                               //CreatedDateTime = DateTime.UtcNow,
                                               Operator = workFlowConditionalOperator.Operator,
                                               WorkFlowDetailId = _parentActivityId,
                                               IsBoolenCondtion = workFlowConditionalOperator.IsBoolenCondtion,
                                               ParentConditionalOperatorId = _conditionalOperatorParentId
                                           };

                                           _conditionalOperatorParentId = _workFlowRepository.SaveWorkConditionalOperatorDetails(conditionlOperator);
                                           // }
                                           //else
                                           //{
                                           //    var conditionlOperator = new ConditionalOperator
                                           //    {
                                           //        Id = workFlowConditionalOperator.ConditionalOperatorId,
                                           //        Variable1 = workFlowConditionalOperator.Variable1,
                                           //        Variable2 = workFlowConditionalOperator.Variable2,
                                           //        Condition = workFlowConditionalOperator.ConditionInfo,
                                           //        CreatedDateTime = DateTime.UtcNow,
                                           //        Operator = workFlowConditionalOperator.Operator,
                                           //        WorkFlowDetailId = _parentActivityId,
                                           //        ParentConditionalOperatorId = _conditionalOperatorParentId
                                           //    };
                                           //    _conditionalOperatorChildId =
                                           //        _workFlowRepository.SaveWorkConditionalOperatorDetails(conditionlOperator);
                                           //}
                                       }
                               }
                               else
                               {
                                   var workFlowDetail = new WorkFlowDetail
                                   {
                                      // WorkFlowName = workFlowDetails.WorkFlowName,
                                       WorkFlowId = workFlowDetails.PermissionId,
                                       InitiatorId = workFlow.InitiatorId,
                                       AssignedId = workFlow.AssignedId,
                                       //OldStatusId = workFlow.OldStatus,
                                       //NewStatusId = workFlow.NewStatus,
                                       //CreatedDateTime = DateTime.UtcNow,
                                       CreatedBy = HttpContext.Current.User.Identity.GetUserId(),
                                       IsApproval = workFlow.IsApproval,
                                       IsReview = workFlow.IsReview,
                                       // WorkFlowActionId = workFlow.ActionId,
                                       CompanyId = companyDetails.Id,
                                       ActivityId = workFlow.ActivityId,
                                       NextActivityId = workFlow.NextActivityId,
                                       IsClosed = workFlow.IsClosed,
                                       IsApprovePanel = workFlow.IsApprovePanel,
                                       IsRejectPanel = workFlow.IsRejectPanel,
                                       ParentActivityId = _parentActivityId,
                                       IsChildAction = true,
                                       IsAllowOtherWorkFlow = workFlow.IsAllowOtherWorkFlow,
                                       OtherWorkFlowId = workFlow.OtherWorkFlowId,
                                       Id = workFlow.workFlowActionId,
                                       IsAllowOtherBranchUser = workFlow.IsAllowOtherBranchUser,
                                       //Variable2 = workFlow.Variable2,


                                       // Variable1 = workFlow.Variable1,

                                       //Operator = workFlow.Operator,
                                       IsCondition = workFlow.IsCondition,
                                       IsChildCondition = IsChildCondtion,

                                   };
                                   _childActivityId = _workFlowRepository.SaveWorkFlowDetails(workFlowDetail);
                               }


                           }

                       }
                       workFlowDetails.PermissionId = _parentActivityId;
                   }
                   
                 
                   //var workFlowCollection = _workFlowRepository.GetWorkFlowDetailsForTreeViewByActivityId(workFlowDetails.ActivityId);
                   return Ok(workFlowDetails);
               }
               else
               {
                   return BadRequest();
               }
               
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       public bool IsChildCondtion { get; set; }

       [HttpGet]
       [Route("api/workFlow/getAllWorkFlowList")]
       public IHttpActionResult GetAllWorkFlowList()
       {
           try
           {
               var currentUser = HttpContext.Current.User.Identity.GetUserId();

               var getWorkFlow = _workFlowRepository.GetAllWorkFlowList(currentUser);
               return Ok(getWorkFlow);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getAllWorkFlowAcionList")]
       public IHttpActionResult GetAllWorkFlowAcionList(int permissionId)
       {
           try
           {
               var workFlowAction = _workFlowRepository.GetAllWorkFlowAcionList(permissionId);
               return Ok(workFlowAction);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getWorkFlowDetailsForTreeViewByActivityId")]
       public IHttpActionResult GetWorkFlowDetailsForTreeViewByActivityId(int activityId)
       {
           try
           {
               var workFlowAction = _workFlowRepository.GetWorkFlowDetailsForTreeViewByActivityId(activityId);
               return Ok(workFlowAction);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/editWorkFlowInformationById")]
       public IHttpActionResult EditWorkFlowInformationById(int workFlowId)
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {

                   var workFlow = _workFlowRepository.EditWorkFlowInformationById(workFlowId);
                   if (workFlow != null)
                   {
                       return Ok(workFlow);
                   }
                   else
                   {
                       return Ok(new {status = true});
                   }
               }
               else
               {
                   return BadRequest();
               }
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       //[Route("api/WorkFlow/addWorkFlowDetails/{permissionId}/{roleId}")]
       [Route("api/WorkFlow/editWorkFlowPermission")]
       public IHttpActionResult EditWorkFlowPermission(int permissionId)
       {
           try
           {
               var permission = _workFlowRepository.EditWorkFlowPermission(permissionId);
               return Ok(permission);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getAllActivityList")]
       public IHttpActionResult GetAllActivityList()
       {
           try
           {
               var permissionCollection = _workFlowRepository.GetAllActivityList();
               return Ok(permissionCollection);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getWorkFlowTreeViewByActivityId")]
       public IHttpActionResult GetWorkFlowTreeViewByActivityId(int activityId)
       {
           try
           {
               var workFlowAction = _workFlowRepository.GetWorkFlowTreeViewByActivityId(activityId);
               return Ok(workFlowAction);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/deleteWorkFlowInformation")]
       public IHttpActionResult DeleteWorkFlowInformation(int workFlowActionId)
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   _workFlowRepository.DeleteWorkFlowInformation(workFlowActionId);
                   return Ok();    
               }
               else
               {
                   return BadRequest();
               }
               
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getAttributeListByActivityId")]
       public IHttpActionResult GetAttributeListByActivityId(int activityId)
       {
           try
           {
               var customAttributeCollection = _workFlowRepository.GetAttributeListByActivityId(activityId);
               return Ok(customAttributeCollection);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/deleteConditionalOperator")]
       public IHttpActionResult DeleteConditionalOperator(int conditionalOperatorId)
       {
        
           try
           {
               _workFlowRepository.DeleteConditionalOperator(conditionalOperatorId);
               return Ok();
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpPost]
       [Route("api/WorkFlow/workFLowNameAlreadyExistOrNot")]
       public IHttpActionResult WorkFLowNameAlreadyExistOrNot(WorkFlowAc workFlowDetails)
       {
           try
           {
               if (HttpContext.Current.User.Identity.IsAuthenticated)
               {
                   var nameAlreadyExist = _workFlowRepository.WorkFLowNameAlreadyExistOrNot(workFlowDetails);
                   return Ok(new {status = nameAlreadyExist});
               }
               else
               {
                   return BadRequest();
               }
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getAllWorkFlowNameList")]
       public IHttpActionResult GetAllWorkFlowNameList()
       {
           try
           {
               var currentUser = HttpContext.Current.User.Identity.GetUserId();
               var workFlowCollection = _workFlowRepository.GetAllWorkFlowNameList(currentUser);
               return Ok(workFlowCollection);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }

       [HttpGet]
       [Route("api/WorkFlow/getAllBoolenOperatorListByActivityId")]
       public IHttpActionResult GetAllBoolenOperatorListByActivityId(int activityId)
       {
           try
          { 
               var boolenCustomAttributeCollection = _workFlowRepository.GetAllBoolenOperatorListByActivityId(activityId);
               return Ok(boolenCustomAttributeCollection);
           }
           catch (Exception ex)
           {
               _errorLog.LogException(ex);
               throw;
           }
       }
    }
}

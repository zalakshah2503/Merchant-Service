using System.Net;
using System.Reflection;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.CustomAttributes;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.WorkFlow
{
    public class WorkFlowRepository : IWorkFlowRepository
    {
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<StatusType> _statusDataRepository;
        private readonly IDataRepository<ParentPermission> _parentPermissionDataRepository;
        private readonly IDataRepository<ChildPermission> _childPermissionDataRepository;
        private readonly IDataRepository<RolePermission> _rolePermissionDataRepository;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDataRepository;
        private readonly IDataRepository<WorkFlowAction> _workFlowActionDataRepository;
        private readonly IDataRepository<CompanyDetail> _companyDetailRepository;
        private readonly IDataRepository<ConditionalOperator> _conditionalDataRepository;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogDataRepository;
            List<int> list = new List<int>();
        List<int> _conditionList = new List<int>();


        public WorkFlowRepository(IErrorLog errorLog, IDataRepository<StatusType> statusDataRepository, IDataRepository<ParentPermission> parentPermissionDataRepository, IDataRepository<ChildPermission> childPermissionDataRepository, IDataRepository<RolePermission> rolePermissionDataRepository, IDataRepository<WorkFlowDetail> workFlowDataRepository, IDataRepository<WorkFlowAction> workFlowActionDataRepository, IDataRepository<CompanyDetail> companyDetailRepository, IDataRepository<ConditionalOperator> conditionalDataRepository, IDataRepository<WorkFlowLog> workFlowLogDataRepository)
        {
            _statusDataRepository = statusDataRepository;
            _errorLog = errorLog;
            _parentPermissionDataRepository = parentPermissionDataRepository;
            _childPermissionDataRepository = childPermissionDataRepository;
            _rolePermissionDataRepository = rolePermissionDataRepository;
            _workFlowDataRepository = workFlowDataRepository;
            _workFlowActionDataRepository = workFlowActionDataRepository;
            _companyDetailRepository = companyDetailRepository;
                _conditionalDataRepository = conditionalDataRepository;
            _workFlowLogDataRepository = workFlowLogDataRepository;
        }

        public void Dispose()
        {
            _statusDataRepository.Dispose();
            _workFlowActionDataRepository.Dispose();
            _parentPermissionDataRepository.Dispose();
            _workFlowDataRepository.Dispose();
            _workFlowLogDataRepository.Dispose();
            //   _workFlowDataRepository.Dispose();
        }


        /// <summary>
        /// This method used fo get condition operator by work flow id. -An
        /// </summary>
        /// <param name="workFlowId"></param>
        /// <returns></returns>
        public ConditionalOperator GetConditionalOperatorByWorkFlowId(int workFlowId)
        {
            try
            {
                return _conditionalDataRepository.FirstOrDefault(x => x.WorkFlowDetailId == workFlowId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<StatusTypeAc> GetallStatus()
        {
            try
            {
                var statusCollection = new List<StatusTypeAc>();
                foreach (var status in _statusDataRepository.GetAll().ToList())
                {
                    var statusAc = new StatusTypeAc();
                    statusAc = ApplicationClassHelper.ConvertType<StatusType, StatusTypeAc>(status);
                    statusAc.StatusId = status.Id;
                    statusCollection.Add(statusAc);
                }
                return statusCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public StatusTypeAc UpdateStatusDetails(StatusTypeAc status)
        {
            try
            {
                int statusCount = _statusDataRepository.Fetch(x => x.Name == status.Name && x.Id != status.StatusId).Count();
                if (statusCount != 0)
                {
                    throw new ArgumentException("Name already exists.");
                }
                var statusdetails = _statusDataRepository.GetById(status.StatusId);
                statusdetails.Name = status.Name;
                statusdetails.IsClosed = status.IsClosed;
                statusdetails.ModifiedDateTime = DateTime.UtcNow;
                statusdetails.ModifiedDateTime = DateTime.UtcNow;
                _statusDataRepository.Update(statusdetails);
                _statusDataRepository.SaveChanges();
                return status;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public StatusType SaveStatusDetails(StatusTypeAc status)
        {
            try
            {
                var statusType = new StatusType
                {
                    Name = status.Name,
                    IsClosed = status.IsClosed,
                    CreatedDateTime = DateTime.UtcNow
                };
                _statusDataRepository.Add(statusType);
                _statusDataRepository.SaveChanges();
                return statusType;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<ParentPermission> GetAllWorkFlowName()
        {
            try
            {
                
                var workFlowNameCollection = _parentPermissionDataRepository.Fetch(x=>x.IsWorkflowEnabled).ToList();
                return workFlowNameCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<RoleAc> CheckPermissionRole(int permissionId, int companyId)
        {
            try
            {
                var roleCollection = new List<RoleAc>();
                var childPermissionDetails = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == permissionId).ToList();
                foreach (var childDetails in childPermissionDetails)
                {
                    var roleAc = new RoleAc();
                    var roleDetails = _rolePermissionDataRepository.FirstOrDefault(x => x.ChildPermissionId == childDetails.Id && x.CompanyId == companyId);
                    if (roleDetails != null)
                    {
                        roleAc.Id = roleDetails.RoleId;
                        roleAc.RoleName = roleDetails.Role.RoleName;
                        roleAc.CompanyId = roleDetails.CompanyId;

                        roleCollection.Add(roleAc);
                    }
                }
                return roleCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


       


        public List<PermissionAc> AddWorkFlowDetails(int permissionId)
        {
            try
            {
                var childPermissionCollection = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == permissionId && x.IsValidActivity).ToList();
              
                var permissionlist = new List<PermissionAc>();
                foreach (var permission in childPermissionCollection)
                {
                    var permissionAc = new PermissionAc();
                   
                    permissionAc.PermissionId = permission.Id;
                    permissionAc.Name = permission.Name;
                    permissionAc.AcceptPermission = permission.AcceptPermission;
                    permissionAc.RejectPermission = permission.RejectPermission;
                    permissionAc.IsAllowOtherBranchUser = permission.IsAllowOtherBranchUser;
                   // permissionAc. = permission.PermissionName;
                    permissionlist.Add(permissionAc);
                    // }

                }

                return permissionlist;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        public int SaveWorkFlowDetails(WorkFlowDetail workFlowDetails)
        {
            try
            {
                if (workFlowDetails.Id != 0)
                {
                   
                    var workFlowDetail = _workFlowDataRepository.GetById(workFlowDetails.Id);


                    workFlowDetail.WorkFlowId = workFlowDetails.WorkFlowId;
                    workFlowDetail.InitiatorId = workFlowDetails.InitiatorId;
                    workFlowDetail.AssignedId = workFlowDetails.AssignedId;
                    workFlowDetails.WorkFlowName = workFlowDetails.WorkFlowName;
                 
                    workFlowDetail.IsApproval = workFlowDetails.IsApproval;
                    workFlowDetail.IsReview = workFlowDetails.IsReview;
                 
                    workFlowDetail.ActivityId = workFlowDetails.ActivityId;
                    workFlowDetail.NextActivityId = workFlowDetails.NextActivityId;
                    workFlowDetail.IsClosed = workFlowDetails.IsClosed;
                    workFlowDetail.IsAllowOtherWorkFlow = workFlowDetails.IsAllowOtherWorkFlow;
                    workFlowDetail.IsAllowOtherBranchUser = workFlowDetails.IsAllowOtherBranchUser;
                    workFlowDetail.OtherWorkFlowId = workFlowDetails.OtherWorkFlowId;
                  
                    workFlowDetail.ModifiedDateTime = DateTime.UtcNow;
                    _workFlowDataRepository.Update(workFlowDetail);
                    _workFlowDataRepository.SaveChanges();
                    return workFlowDetail.Id;
                    
                }
                else
                {
                    workFlowDetails.CreatedDateTime = DateTime.UtcNow;
                    _workFlowDataRepository.Add(workFlowDetails);
                    _workFlowDataRepository.SaveChanges();
                    return workFlowDetails.Id;
                }



            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<WorkFlowDetailAc> GetAllWorkFlowList(string currentUser)
        {
            try
            {
                var workFlowDetailsCollection = new List<WorkFlowDetailAc>();
                var companyDetails = _companyDetailRepository.FirstOrDefault(x => x.UserId == currentUser);
                //  var ss = _workFlowDataRepository.GetAll().GroupBy(x => x.ActivityId).Select(y=>y.Key).ToList();
                //var s=  _workFlowDataRepository.GetAll().GroupBy(x => new { x.WorkFlowId, x.ParentPermission.Name }).ToList();
                foreach (var workFLowList in _workFlowDataRepository.Fetch(x => x.CompanyId == companyDetails.Id).GroupBy(x => new { x.ActivityId, x.Activity.Name, x.Id }).ToList())
                {
                    var workFlowChildCollection = new List<WorkFlowChildActivityAc>();
                    var workDetails = _workFlowDataRepository.FirstOrDefault(x => x.Id == workFLowList.Key.Id);
                    var workFlowDetailAc = new WorkFlowDetailAc();
                    var getWorkFlowDetails = _childPermissionDataRepository.FirstOrDefault(x => x.Id == workFLowList.Key.ActivityId && x.ParentPermissionId != null);
                    if (getWorkFlowDetails != null)
                    {
                        workFlowDetailAc.WorkFlowId = workDetails.Id;
                        workFlowDetailAc.WorkFlowName = workDetails.WorkFlowName;
                        workFlowDetailsCollection.Add(workFlowDetailAc);
                    }
                  

                }

                return workFlowDetailsCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<WorkFlowAction> GetAllWorkFlowAcionList(int activityId)
        {
            try
            {
                var workFlowAction = _workFlowActionDataRepository.Fetch(x => x.WorkFlowId == activityId).ToList();
                return workFlowAction;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<WorkFlowTreeNodeAc> GetWorkFlowDetailsForTreeViewByActivityId(int activityId)
        {
            try
            {
                var workFlowTreeCollection = new List<WorkFlowTreeNodeAc>();
                var workFlow = _workFlowDataRepository.Fetch(x => x.WorkFlowId == activityId && x.ParentActivityId == 0).ToList();
                foreach (var workFlowDetail in workFlow.GroupBy(x => x.Id).ToList())
                {

                    var ss = _workFlowDataRepository.Fetch(x => x.ActivityId == workFlowDetail.Key).ToList();
                    var sss =
                        _workFlowDataRepository.Fetch(x => x.ActivityId == workFlowDetail.Key)
                            .ToList();
                    foreach (var workflowDetails in _workFlowDataRepository.Fetch(x => x.Id == workFlowDetail.Key).ToList())
                    {
                        var workFlowTreeAc = new WorkFlowTreeNodeAc();
                       // workFlowTreeAc.ActionName = workflowDetails.WorkFlowAction.Name;
                        workFlowTreeAc.ActivityName = workflowDetails.Activity.Name;
                        //workFlowTreeAc.OldStatus = workflowDetails.OldStatus.Name;
                        workFlowTreeAc.IsParentNode = workflowDetails.IsParentAction;
                        workFlowTreeAc.IsCollapse = true;
                        //workFlowTreeAc.NewStatus = workflowDetails.NewStatus.Name;
                        workFlowTreeAc.Initiator = workflowDetails.InitiatorRole.RoleName;
                        workFlowTreeAc.Assigned = workflowDetails.AssignedRole.RoleName;
                        workFlowTreeAc.WorkFlowId = workflowDetails.Id;
                        workFlowTreeAc.ParentWorkFlowId = workflowDetails.Id;
                        workFlowTreeAc.Children = ChildWorkFlowNode(workflowDetails.Id);

                        workFlowTreeCollection.Add(workFlowTreeAc);

                    }

                }

               
                return workFlowTreeCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<WorkFlowTreeNodeAc> ChildWorkFlowNode(int activityId)
        {
            try
            {

                var childrens = new List<WorkFlowTreeNodeAc>();
                var childFlow = _workFlowDataRepository.Fetch(x => x.ParentActivityId == activityId).ToList();
                foreach (var child in childFlow)
                {
                    var activityDetails =
                       _childPermissionDataRepository.FirstOrDefault(x => x.Id == child.NextActivityId);
                 //   if(child.)
                    var childCollection = new WorkFlowTreeNodeAc();

                    var workFlowLogDetails = _workFlowLogDataRepository.FirstOrDefault(x => x.WorkFlowId == child.Id);
                    if (workFlowLogDetails != null)
                    {
                        childCollection.IsAllowEdit = false;
                    }
                    else
                    {
                        childCollection.IsAllowEdit = true;
                    }
                    
                    if (activityDetails != null)
                    {
                        
                    
                    if (child.IsApprovePanel)
                    {
                        if (child.Activity.IsClosed)
                        {
                            childCollection.ActivityName = activityDetails.AcceptPermission;
                        }
                        else
                        {
                            childCollection.ActivityName = activityDetails.AcceptPermission;
                        }
                    }
                    else
                    {
                        if (child.Activity.IsClosed)
                        {
                            childCollection.ActivityName = activityDetails.RejectPermission;
                        }
                       
                        else
                        {
                            childCollection.ActivityName = activityDetails.RejectPermission;
                        } 
                    }
                    }
                    else
                    {
                        childCollection.ActivityName = child.Activity.Name;
                    }
                    childCollection.Initiator = child.InitiatorRole.RoleName;
                    childCollection.Assigned = child.AssignedRole.RoleName;
                        
                    childCollection.ParentWorkFlowId = child.ParentActivityId;
                    childCollection.IsClosed = child.Activity.IsClosed;
                    childCollection.WorkFlowId = child.Id;
                    childCollection.IsApprovePanel = child.IsApprovePanel;
                    childCollection.IsRejectPanel = child.IsRejectPanel;
                    childCollection.IsAllowOtherWorkFLow = child.IsAllowOtherWorkFlow;
                    childCollection.Children = ChildWorkFlowNode(child.Id);

                    childrens.Add(childCollection);
                }
                return childrens;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }





        public int SaveWorkFlowActionDetails(WorkFlowDetail workFlowDetails)
        {
            try
            {
                if (workFlowDetails.Id != 0)
                {
                    var workFlowDetail = _workFlowDataRepository.GetById(workFlowDetails.Id);

                    //if (workFlowDetail.IsParentAction)
                    //{
                    int workFlowCount = _workFlowDataRepository.Fetch(x => x.ActivityId == workFlowDetails.ActivityId && x.Id != workFlowDetail.Id && x.InitiatorId == workFlowDetails.InitiatorId && x.ParentActivityId == 0).Count();
                    if (workFlowCount != 0)
                    {
                       throw new ArgumentException("WorkFlow already exists.");
                    }
                    
                    workFlowDetail.WorkFlowId = workFlowDetails.WorkFlowId;
                    workFlowDetail.InitiatorId = workFlowDetails.InitiatorId;
                    workFlowDetail.AssignedId = workFlowDetails.AssignedId;
                    workFlowDetail.WorkFlowName = workFlowDetails.WorkFlowName;
                    //workFlowDetail.OldStatusId = workFlowDetails.OldStatusId;
                    //workFlowDetail.NewStatusId = workFlowDetails.NewStatusId;
                    workFlowDetail.IsApproval = workFlowDetails.IsApproval;
                    workFlowDetail.IsReview = workFlowDetails.IsReview;
                   // workFlowDetail.WorkFlowActionId = workFlowDetails.WorkFlowActionId;
                    // workFlowDetail.CompanyId = Convert.ToInt32(HttpContext.Current.Session["CompanyId"]),
                    workFlowDetail.ActivityId = workFlowDetails.ActivityId;
                    workFlowDetail.NextActivityId = workFlowDetails.NextActivityId;
                    // workFlowDetail.ParentActivityId = workFlowDetails.P,
                    //workFlowDetail.Variable1 = workFlowDetails.Variable1;
                    //workFlowDetail.Variable2 = workFlowDetails.Variable2;
                    //workFlowDetail.Operator = workFlowDetails.Operator;
                    workFlowDetail.IsAllowOtherWorkFlow = workFlowDetails.IsAllowOtherWorkFlow;
                    workFlowDetail.OtherWorkFlowId = workFlowDetails.OtherWorkFlowId;
                    workFlowDetail.IsCondition = workFlowDetails.IsCondition;
                    workFlowDetail.IsClosed = workFlowDetails.IsClosed;
                    workFlowDetail.IsParentAction = true;
                    workFlowDetail.IsAllowOtherBranchUser = workFlowDetails.IsAllowOtherBranchUser;
                    workFlowDetail.ModifiedDateTime = DateTime.UtcNow;
                    _workFlowDataRepository.Update(workFlowDetail);
                    _workFlowDataRepository.SaveChanges();
                    return workFlowDetail.Id;

                }
                else
                {
                    int workFlowCount = _workFlowDataRepository.Fetch(x => x.ActivityId == workFlowDetails.ActivityId && x.InitiatorId == workFlowDetails.InitiatorId).Count();
                    if (workFlowCount != 0)
                    {
                        throw new ArgumentException("WorkFlow already exists.");
                    }
                    workFlowDetails.CreatedDateTime = DateTime.UtcNow;
                    _workFlowDataRepository.Add(workFlowDetails);
                    _workFlowDataRepository.SaveChanges();
                    return workFlowDetails.Id;
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public WorkFlowAc EditWorkFlowInformationById(int workFlowId)
        {
            try
            {
                var workFlowAc = new WorkFlowAc();
                var workFlowDetails = _workFlowDataRepository.GetById(workFlowId);
                if (workFlowDetails != null)
                {
                    int parentId;
                    if (workFlowDetails.ParentActivityId == 0)
                    {
                        parentId = workFlowDetails.Id;
                    }
                    else
                    {
                        parentId = ParentNodeForTreeView(workFlowDetails.ParentActivityId);
                    }

                    var parentActivityDetails = _workFlowDataRepository.FirstOrDefault(x => x.Id == parentId);
                    //int getParentId = ParentNodeForTreeView(workFlowDetails.ParentActivityId);
                    workFlowAc.ParentActivityId = parentActivityDetails.ActivityId;
                    workFlowAc.WorkFlowParentActivityId = workFlowDetails.ParentActivityId;
                    workFlowAc.WorkFlowDetailParentId = parentId;
                    workFlowAc.PermissionId = workFlowDetails.WorkFlowId;
                    workFlowAc.ActivityId = workFlowDetails.ActivityId;
                    workFlowAc.IsApproval = workFlowDetails.IsApproval;
                    workFlowAc.IsCondition = workFlowDetails.IsCondition;
                    workFlowAc.WorkFlowName = parentActivityDetails.WorkFlowName;
                    workFlowAc.IsAllowOtherBranchUser = parentActivityDetails.Activity.IsAllowOtherBranchUser;
                    //  workFlowAc.Operator = workFlowDetails.Operator;
                    var workFlowColllection = new List<WorkFlowPermission>();
                    if (workFlowDetails.IsParentAction)
                    {

                        var workFlowDetail = new WorkFlowPermission
                        {
                            WorkFlowId = workFlowDetails.WorkFlowId,
                            InitiatorId = workFlowDetails.InitiatorId,
                            AssignedId = workFlowDetails.AssignedId,
                            //OldStatus = childAction.OldStatusId,
                            //NewStatus = childAction.NewStatusId,
                            IsApproval = workFlowDetails.IsApproval,
                            IsReview = workFlowDetails.IsReview,
                            IsParentAction = workFlowDetails.IsParentAction,
                            IsApprovePanel = workFlowDetails.IsApprovePanel,
                            IsRejectPanel = workFlowDetails.IsRejectPanel,
                            ActivityId = workFlowDetails.ActivityId,
                            NextActivityId = workFlowDetails.NextActivityId,
                            ParentActivityId = workFlowDetails.ParentActivityId,
                            IsActivityClose = workFlowDetails.NextActivity.IsClosed,
                            workFlowActionId = workFlowDetails.Id,
                            IsChild = workFlowDetails.IsChildAction,
                            IsCondition = workFlowDetails.IsCondition,
                            OtherWorkFlowId = workFlowDetails.OtherWorkFlowId,
                            IsAllowOtherBranchUser = workFlowDetails.IsAllowOtherBranchUser,
                            //Variable1 = workFlowDetails.Variable1,
                            //Variable2 = workFlowDetails.Variable2,
                            //Operator = workFlowDetails.Operator
                        };
                        if (workFlowDetails.IsCondition)
                        {
                            var condtitionalOperatorCollection = new List<WorkFlowConditionalOperator>();
                            var conditionalDetails =
                                _conditionalDataRepository.Fetch(x => x.WorkFlowDetailId == workFlowDetails.Id);
                            foreach (var conditionalOperator in conditionalDetails)
                            {
                                WorkFlowConditionalOperator workFlowConditionalOperator =
                                    ApplicationClassHelper.ConvertType<ConditionalOperator, WorkFlowConditionalOperator>
                                        (conditionalOperator);
                                workFlowConditionalOperator.ConditionalOperatorId = conditionalOperator.Id;
                                workFlowConditionalOperator.ConditionInfo = conditionalOperator.Condition;
                                workFlowConditionalOperator.IsActiveConditional = true;
                                condtitionalOperatorCollection.Add(workFlowConditionalOperator);
                            }
                            workFlowDetail.ConditionalOperator = condtitionalOperatorCollection;
                        }
                        workFlowDetail.Children = ChildWorkFlowPermissio(workFlowDetails.Id);
                        workFlowColllection.Add(workFlowDetail);
                        workFlowAc.Permission = workFlowColllection;

                    }
                    else
                    {

                        var workFlowDetail = new WorkFlowPermission
                        {
                            WorkFlowId = workFlowDetails.WorkFlowId,
                            InitiatorId = workFlowDetails.InitiatorId,
                            AssignedId = workFlowDetails.AssignedId,
                            //OldStatus = workFlowDetails.OldStatusId,
                            //NewStatus = workFlowDetails.NewStatusId,
                            IsChild = workFlowDetails.IsParentAction,
                            IsParentAction = workFlowDetails.IsParentAction,
                            IsApprovePanel = false,
                            IsRejectPanel = false,
                            ActivityId = workFlowDetails.ActivityId,
                            NextActivityId = workFlowDetails.NextActivityId,
                            ParentActivityId = workFlowDetails.ParentActivityId,
                            workFlowActionId = workFlowDetails.Id,
                            IsActivityClose = workFlowDetails.NextActivity.IsClosed,
                            IsCondition = workFlowDetails.IsCondition,
                            IsAllowOtherWorkFlow = workFlowDetails.IsAllowOtherWorkFlow,
                            OtherWorkFlowId = workFlowDetails.OtherWorkFlowId,
                            IsAllowOtherBranchUser = workFlowDetails.IsAllowOtherBranchUser
                            //Variable1 = workFlowDetails.Variable1,
                            //Variable2 = workFlowDetails.Variable2,Operator = workFlowDetails.Operator
                        };
                        workFlowColllection.Add(workFlowDetail);
                        workFlowAc.Permission = workFlowColllection;
                    }
                    return workFlowAc;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private int ParentNodeForTreeView(int p)
        {
         
            try
            {

                int parentId = 0;
                var workflow = _workFlowDataRepository.FirstOrDefault(x => x.Id == p);
                
                    
                if (workflow.ParentActivityId == 0)
                {
                    parentId = workflow.Id;
                    return parentId;
                }
                else
                {
                   // parentId = workflow.Id;
                    return ParentNodeForTreeView(workflow.ParentActivityId);
                }
                   
                
                //foreach (var workflow in details)
                //{
                //    parentId = workflow.Id;
                //    ParentNodeForTreeView(workflow.ParentActivityId);
                //}
                
               
            }
            catch (Exception)
            {
                
                throw;
            }
        }

        private List<WorkFlowPermission> ChildWorkFlowPermissio(int activityId)
        {
            var childrens = new List<WorkFlowPermission>();
            var childFlow = _workFlowDataRepository.Fetch(x => x.ParentActivityId == activityId).ToList();
            foreach (var workFlowDetails in childFlow)
            {

                childrens.Add(new WorkFlowPermission
                {
                    WorkFlowId = workFlowDetails.WorkFlowId,
                    InitiatorId = workFlowDetails.InitiatorId,
                    AssignedId = workFlowDetails.AssignedId,
                    //OldStatus = childAction.OldStatusId,
                    //NewStatus = childAction.NewStatusId,
                    IsApproval = workFlowDetails.IsApproval,
                    IsReview = workFlowDetails.IsReview,
                    OtherWorkFlowId = workFlowDetails.OtherWorkFlowId,
                    IsApprovePanel = workFlowDetails.IsApprovePanel,
                    IsRejectPanel = workFlowDetails.IsRejectPanel,
                    ActivityId = workFlowDetails.ActivityId,
                    NextActivityId = workFlowDetails.NextActivityId,
                    ParentActivityId = workFlowDetails.ParentActivityId,
                    IsActivityClose = workFlowDetails.NextActivity.IsClosed,
                    workFlowActionId = workFlowDetails.Id,
                    IsChild = workFlowDetails.IsChildAction,
                    IsAllowOtherWorkFlow = workFlowDetails.IsAllowOtherWorkFlow,
                    IsAllowOtherBranchUser = workFlowDetails.IsAllowOtherBranchUser,
                    //Variable1 = workFlowDetails.Variable1,
                    //Variable2 = workFlowDetails.Variable2,
                    //Operator = workFlowDetails.Operator
                });

            }
            return childrens;
        }


       

        public List<PermissionAc> EditWorkFlowPermission(int permissionId)
        {
            try
            {
                var childPermissionCollection = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == permissionId).ToList();
                var commanPermission = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == null).ToList();
                childPermissionCollection.AddRange(commanPermission);
                //var rolePermissionCollection = new List<RolePermissionAc>();
                //var rolePermissionAc = new RolePermissionAc();
                var permissionlist = new List<PermissionAc>();
                foreach (var permission in childPermissionCollection)
                {
                    var permissionAc = new PermissionAc();

                    permissionAc.PermissionId = permission.Id;
                    permissionAc.Name = permission.Name;
                    permissionAc.AcceptPermission = permission.AcceptPermission;
                    permissionAc.RejectPermission = permission.RejectPermission;
                    permissionlist.Add(permissionAc);


                }

                return permissionlist;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<PermissionAc> GetAllActivityList()
        {
            try
            {
                var childPermissionCollection = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == null).ToList();

                //var rolePermissionCollection = new List<RolePermissionAc>();
                //var rolePermissionAc = new RolePermissionAc();
                var permissionlist = new List<PermissionAc>();
                foreach (var permission in childPermissionCollection)
                {
                    var permissionAc = new PermissionAc();
                   
                    permissionAc.PermissionId = permission.Id;
                    permissionAc.Name = permission.Name;
                    permissionAc.IsCondition = permission.IsCondition;
                    permissionAc.AcceptPermission = permission.AcceptPermission;
                    permissionAc.IsAllowOtherWorkFLow = permission.IsAllowOtherWorkFLow;
                    permissionAc.RejectPermission = permission.RejectPermission;
                    permissionAc.IsChecked = permission.IsClosed;
                    permissionlist.Add(permissionAc);
                    // }

                }

                return permissionlist;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<WorkFlowTreeNodeAc> GetWorkFlowTreeViewByActivityId(int activityId)
        {
            try
            {
                var workFlowTreeCollection = new List<WorkFlowTreeNodeAc>();
                int getParentId = ParentNodeForTreeView(activityId);
               
                
                var workFlow = _workFlowDataRepository.Fetch(x => x.Id == getParentId).ToList();

                foreach (var workflowDetails in workFlow)
                {

                   
                    var workFlowTreeAc = new WorkFlowTreeNodeAc();
                    var workFlowLogDetails = _workFlowLogDataRepository.FirstOrDefault(x => x.WorkFlowId == workflowDetails.Id);
                    if (workFlowLogDetails != null)
                    {
                        workFlowTreeAc.IsAllowEdit = false;
                    }
                    else
                    {
                        workFlowTreeAc.IsAllowEdit = true;
                    }
                   // workFlowTreeAc.WorkFlowName = workflowDetails.WorkFlowName;
                        // workFlowTreeAc.ActionName = workflowDetails.WorkFlowAction.Name;
                        workFlowTreeAc.ActivityName = workflowDetails.Activity.Name;
                        //workFlowTreeAc.OldStatus = workflowDetails.OldStatus.Name;
                        workFlowTreeAc.IsParentNode = workflowDetails.IsParentAction;
                        workFlowTreeAc.IsCollapse = true;
                        workFlowTreeAc.IsCondition = workflowDetails.IsCondition;
                        //workFlowTreeAc.NewStatus = workflowDetails.NewStatus.Name;
                        workFlowTreeAc.Initiator = workflowDetails.InitiatorRole.RoleName;
                        workFlowTreeAc.Assigned = workflowDetails.AssignedRole.RoleName;
                        workFlowTreeAc.WorkFlowId = workflowDetails.Id;
                        workFlowTreeAc.Children = ChildWorkFlowNode(workflowDetails.Id);

                    

                    if (workFlowTreeAc.Children.Count != 0)
                    {
                        var workFlowChildDetails = workFlowTreeAc.Children.Find(x => !x.IsAllowEdit);

                        foreach (var workFlowChildCollection in workFlowTreeAc.Children)
                        {
                           
                           
                        }
                    }
                        workFlowTreeCollection.Add(workFlowTreeAc);

                    

                }

                
                return workFlowTreeCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public void DeleteWorkFlowInformation(int workFlowId)
        {
            try
            {
                var getDetails = _workFlowDataRepository.FirstOrDefault(x => x.Id == workFlowId);


                list = ParentTreeNodes(getDetails.Id);
                
             //   List<int> listCount = list;
                foreach (var details in list)
                {
                    var workFlow = _workFlowDataRepository.GetById(details);
                    _workFlowDataRepository.Delete(workFlow.Id);
                    _workFlowDataRepository.SaveChanges();

                }

                getDetails.IsApproval = false;
                getDetails.IsReview = false;
                //getDetails.Variable2 = "";
                //getDetails.Variable1 = "";
                //getDetails.Operator = "";
            
                if (getDetails.IsCondition)
                {
                    var operatorDetails = _conditionalDataRepository.FirstOrDefault(x => x.WorkFlowDetailId == getDetails.Id);
                    _conditionList = ParentConditionNode(operatorDetails.Id);
                    foreach (var condition in _conditionList)
                    {
                        var operatorInfo = _conditionalDataRepository.FirstOrDefault(x => x.Id == condition);
                        _conditionalDataRepository.Delete(operatorInfo.Id);
                        _conditionalDataRepository.SaveChanges();
                    }
                    _conditionalDataRepository.Delete(operatorDetails.Id);
                    _conditionalDataRepository.SaveChanges();
                    getDetails.IsCondition = false;
                }
                //else
                //{
                //    getDetails.IsCondition = false;
                //}
             
                //getDetails.IsParentAction = false;
                getDetails.ModifiedDateTime = DateTime.UtcNow;
                _workFlowDataRepository.Update(getDetails);
                _workFlowDataRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private List<int> ParentConditionNode(int p)
        {
            try
            {
                var conditionDetails = _conditionalDataRepository.Fetch(x => x.ParentConditionalOperatorId == p).ToList();

              


                foreach (var child in conditionDetails)
                {
                    _conditionList.Add(child.Id);
                    ParentConditionNode(child.Id);
                   
                }
                return _conditionList;
               
                    
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        

        private List<int> ParentTreeNodes(int id)
        {
            try
            {

               // var childrens = new List<WorkFlowTreeNodeAc>();
                var children = new List<WorkFlowTreeNodeAc>();
                var workFlowDetails = _workFlowDataRepository.Fetch(x => x.ParentActivityId == id).ToList();
               
                  
                    foreach (var child in workFlowDetails)
                    {
                       list.Add(child.Id);
                        ParentNodeForTreeView(child.Id);
                        
                    }
                    return list;
              

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<CustomAttributesAc> GetAttributeListByActivityId(int activityId)
        {
            try
            {
                var customAttributeCollection = new List<CustomAttributesAc>();
                var dictionaryCollection = ModelDictionary.GetModelDictionary();

                var dictionaryDetails = dictionaryCollection.FirstOrDefault(x => x.Key == activityId);
                var dictinaryModel = (Type)dictionaryDetails.Value;
                if (dictinaryModel != null)
                {
                    var properties = dictinaryModel.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.GetCustomAttributes(typeof(CustomAttribute), false).Count() == 1).ToList();
                    foreach (var propertyInfo in properties)
                    {
                        if (propertyInfo.PropertyType.FullName != "System.Boolean")
                        {
                            var attributeAc = new CustomAttributesAc();
                            attributeAc.VariableName = propertyInfo.Name;
                            customAttributeCollection.Add(attributeAc);
                        }
                      
                    }
                
                }
                ////key.
               
                return customAttributeCollection;
            }
            catch (Exception ex)
            {
               _errorLog.LogException(ex); 
                throw;
            }
        }


        public void DeleteInformation(int workId)
        {
            try
            {
                var workFlow = _workFlowDataRepository.FirstOrDefault(x => x.Id == workId);
                _workFlowDataRepository.Delete(workFlow.Id);
                _workFlowDataRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public int SaveWorkConditionalOperatorDetails(ConditionalOperator conditionlOperator)
        {
            try
            {
                if (conditionlOperator.Id != 0)
                {
                    var conditionalOperatorDetails = _conditionalDataRepository.FirstOrDefault(x => x.Id == conditionlOperator.Id);


                    conditionalOperatorDetails.Variable1 = conditionlOperator.Variable1;
                    conditionalOperatorDetails.Variable2 = conditionlOperator.Variable2;
                    conditionalOperatorDetails.Condition = conditionlOperator.Condition;
                    conditionalOperatorDetails.CreatedDateTime = DateTime.UtcNow;
                    conditionalOperatorDetails.Operator = conditionlOperator.Operator;
                    conditionalOperatorDetails.WorkFlowDetailId = conditionlOperator.WorkFlowDetailId;
                    conditionalOperatorDetails.ParentConditionalOperatorId = conditionlOperator.ParentConditionalOperatorId;
                    conditionalOperatorDetails.ModifiedDateTime = DateTime.UtcNow;      
                    _conditionalDataRepository.Update(conditionalOperatorDetails);
                    _conditionalDataRepository.SaveChanges();
                    return conditionalOperatorDetails.Id;
                }
                else
                {
                    conditionlOperator.CreatedDateTime = DateTime.UtcNow;
                    _conditionalDataRepository.Add(conditionlOperator);
                    _conditionalDataRepository.SaveChanges();
                    return conditionlOperator.Id;
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public void DeleteConditionalOperator(int conditionalOperator)
        {
         
            try
            {
                var conditionalDetails = _conditionalDataRepository.FirstOrDefault(x => x.Id == conditionalOperator);

                if (conditionalDetails != null)
                {

                    _conditionalDataRepository.Delete(conditionalDetails.Id);
                    _conditionalDataRepository.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool WorkFLowNameAlreadyExistOrNot(WorkFlowAc workFlowDetails)
        {
            try
            {
                if (workFlowDetails.WorkFlowDetailParentId != 0)
                {
                    int workFlowCount = _workFlowDataRepository.Fetch(x => x.WorkFlowName == workFlowDetails.WorkFlowName && x.Id != workFlowDetails.WorkFlowDetailParentId).Count();
                    if (workFlowCount != 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    int workFlowCount = _workFlowDataRepository.Fetch(x => x.WorkFlowName == workFlowDetails.WorkFlowName).Count();
                    if (workFlowCount != 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
               
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<WorkFlowDetailAc> GetAllWorkFlowNameList(string currentUser)
        {
            try
            {
                 var workFlowDetailsCollection = new List<WorkFlowDetailAc>();
                var companyDetails = _companyDetailRepository.FirstOrDefault(x => x.UserId == currentUser);
                foreach (var workFLowList in _workFlowDataRepository.Fetch(x => x.CompanyId == companyDetails.Id).GroupBy(x => new { x.ActivityId, x.Activity.Name, x.Id }).ToList())
                {
                    var workDetails = _workFlowDataRepository.FirstOrDefault(x => x.Id == workFLowList.Key.Id);
                    var getWorkFlowDetails = _childPermissionDataRepository.FirstOrDefault(x => x.Id == workFLowList.Key.ActivityId && x.ParentPermissionId != null);
                    if (getWorkFlowDetails != null)
                    {
                        var workFlowDetailAc = new WorkFlowDetailAc();
                        workFlowDetailAc.WorkFlowId = workDetails.Id;
                        workFlowDetailAc.WorkFlowName = workDetails.WorkFlowName;
                        workFlowDetailAc.InitiatorId = workDetails.InitiatorId;
                        workFlowDetailsCollection.Add(workFlowDetailAc);
                    }
                    
                }

                return workFlowDetailsCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
            
            
        }


        public List<CustomAttributesAc> GetAllBoolenOperatorListByActivityId(int activityId)
        {
            try
            {
                var boolenCustomAttributeCollection = new List<CustomAttributesAc>();
                var dictionaryCollection = ModelDictionary.GetModelDictionary();

                var dictionaryDetails = dictionaryCollection.FirstOrDefault(x => x.Key == activityId);
                var dictinaryModel = (Type)dictionaryDetails.Value;
                if (dictinaryModel != null)
                {
                    var properties = dictinaryModel.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.GetCustomAttributes(typeof(CustomAttribute), false).Count() == 1).ToList();
                    foreach (var propertyInfo in properties)
                    {
                        

                        if (propertyInfo.PropertyType.FullName == "System.Boolean")
                        {
                            var attributeAc = new CustomAttributesAc();
                            attributeAc.VariableName = propertyInfo.Name;
                            boolenCustomAttributeCollection.Add(attributeAc);
                        }
                    }

                    

                }
                ////key.

                return boolenCustomAttributeCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }

    
}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using NCalc;

namespace MerchantService.Repository.Modules.WorkFlow
{
    public class WorkFlowDetailsRepository : IWorkFlowDetailsRepository
    {
        #region Private Variable

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailContext;
        private readonly IDataRepository<ConditionalOperator> _conditionalOperatorContext;
        private readonly IDataRepository<ParentRecord> _parentRecordContext;
        private readonly IDataRepository<WorkFlowLog> _workFLowLogContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;

        #endregion
        public WorkFlowDetailsRepository(IErrorLog errorLog, IDataRepository<WorkFlowDetail> workFlowDetailContext, IDataRepository<ConditionalOperator> conditionalOperatorContext, IDataRepository<ParentRecord> parentRecordContext, IDataRepository<WorkFlowLog> workFLowLogContext, IDataRepository<UserDetail> userDetailContext)
        {
            _errorLog = errorLog;
            _workFlowDetailContext = workFlowDetailContext;
            _workFLowLogContext = workFLowLogContext;
            _conditionalOperatorContext = conditionalOperatorContext;
            _parentRecordContext = parentRecordContext;
            _userDetailContext = userDetailContext;
        }

        public void Dispose()
        {
            _parentRecordContext.Dispose();
            _userDetailContext.Dispose();
            _workFLowLogContext.Dispose();
            _workFlowDetailContext.Dispose();
            _conditionalOperatorContext.Dispose();
        }

        /// <summary>
        /// this method is used to get the initialize action work-flow details.
        /// </summary>
        /// <param name="parentActivityName">Parent Activity Name</param>
        /// <param name="childActivityName">Child Activity Name</param>
        /// <param name="userDetail">UserDetail Object</param>
        /// <param name="companyDetail">CompanyDetails Object</param>
        /// <param name="conditionOperator"></param>
        /// <param name="comment">comment</param>
        /// <param name="activityAttributeDetails"></param>
        /// <returns>Object of workflowlog</returns>
        public Tuple<object, object> GetInitiationActionWorkFlow(string parentActivityName, string childActivityName, UserDetail userDetail, CompanyDetail companyDetail, object conditionOperator, string comment, object activityAttributeDetails)
        {
            try
            {
                //WorkFlowLog workFlowLogs = null;
                //var workFlowDetailLogCollection =new Dictionary<WorkFlowLog, WorkFlowDetail>(); 
                var workDetailCollection = _workFlowDetailContext.Fetch(x => x.ParentPermission.Name == parentActivityName && x.CompanyId == companyDetail.Id).ToList();
                if (workDetailCollection.Count != 0)
                {
                    var currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.InitiatorId == userDetail.RoleId && x.IsParentAction && x.Activity.Name == childActivityName);
                    if (currentWorkFlowDetails != null)
                    {
                        WorkFlowLog workflowDetails;
                        if (currentWorkFlowDetails.IsCondition)
                        {
                            var conditionalCollection = GetListOfConditionalOperator(currentWorkFlowDetails.Id);
                            string finalExpression = "";
                            //   List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                            if (conditionalCollection.Any())
                            {
                                foreach (var condition in conditionalCollection)
                                {
                                    string condtionOperation = null;

                                    if (condition.Condition != null)
                                    {

                                        switch (condition.Condition)
                                        {
                                            case "AND":
                                                condtionOperation = "&&";
                                                break;
                                            case "OR":
                                                condtionOperation = "||";
                                                break;
                                        }
                                    }
                                    string expression;
                                    if (condition.IsBoolenCondtion)
                                    {
                                        expression = GetConditionBoolenExpression(condition.Variable1, activityAttributeDetails);
                                    }
                                    else
                                    {
                                        expression = GetConditionExpression(condition.Variable1, condition.Variable2, condition.Operator, activityAttributeDetails, conditionOperator);
                                    }
                                    finalExpression = finalExpression + condtionOperation + expression;

                                }
                            }

                            var e = new Expression(finalExpression);
                            var finalResult = e.Evaluate();
                            if (Convert.ToBoolean(finalResult))
                                currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsApprovePanel);
                            else
                                currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsRejectPanel);
                            workflowDetails = SaveInitiationWorkFlowDetails(currentWorkFlowDetails, comment, userDetail);
                            if (workflowDetails != null)
                            {
                                if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                {
                                    currentWorkFlowDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                    workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, workflowDetails.RecordId, userDetail, comment, StringConstants.AddWork);
                                }
                            }
                            // workFlowDetailLogCollection.Add(workflowDetails);
                            return Tuple.Create<object, object>(workflowDetails, currentWorkFlowDetails);
                        }
                        else
                        {
                            workflowDetails = SaveInitiationWorkFlowDetails(currentWorkFlowDetails, comment, userDetail);
                            if (workflowDetails != null)
                            {
                                if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                {
                                    currentWorkFlowDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                    workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, workflowDetails.RecordId, userDetail, comment, StringConstants.AddWork);
                                }
                            }
                            return Tuple.Create<object, object>(workflowDetails, currentWorkFlowDetails);
                        }
                    }
                    else
                    {
                        return null;
                    }
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


        /// <summary>
        /// this method is used to get the approval action workflow details.
        /// </summary>
        /// <param name="recordId">parent record id.</param>
        /// <param name="actionName">action name</param>
        /// <param name="comment">comment</param>
        /// <param name="userDetails">UserDetails Object</param>
        /// <param name="status">status either true and false.</param>
        /// <returns>Object of workflowlog</returns>
        public WorkFlowLog GetApprovalActionWorkFLow(int recordId, string actionName, string comment, UserDetail userDetails, bool status)
        {
            try
            {
                var workFLowLastDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();
                var workFlowCollection = _workFlowDetailContext.Fetch(x => x.ParentActivityId == workFLowLastDetails.WorkFlowId).ToList();
                if (workFlowCollection.Count() != 0)
                {
                    WorkFlowDetail workFlowCurrentDetails;
                    WorkFlowLog workFlowDetails;
                    if (status)
                    {
                        workFlowCurrentDetails = workFlowCollection.FirstOrDefault(x => x.IsApprovePanel);
                        if (workFlowCurrentDetails != null)
                        {
                            //var workFlowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, incidentReportInfo, userDetails, incidentReportDetails.Comment, StringConstants.ApprovAction);
                            workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);
                            if (workFlowDetails != null)
                            {
                                if (workFlowCurrentDetails.IsAllowOtherWorkFlow)
                                {
                                    workFlowCurrentDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == workFlowCurrentDetails.OtherWorkFlowId);
                                    workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, workFlowDetails.RecordId, userDetails, comment, StringConstants.AddWork);
                                }
                            }
                            return workFlowDetails;
                        }
                        else
                        {
                            return null;
                        }
                    }
                    else
                    {
                        workFlowCurrentDetails = workFlowCollection.FirstOrDefault(x => x.IsRejectPanel);
                        if (workFlowCurrentDetails != null)
                        {
                            workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);
                            if (workFlowDetails != null)
                            {
                                if (workFlowCurrentDetails.IsAllowOtherWorkFlow)
                                {
                                    workFlowCurrentDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == workFlowCurrentDetails.OtherWorkFlowId);
                                    workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, workFlowDetails.RecordId, userDetails, comment, StringConstants.AddWork);
                                }
                            }
                            return workFlowDetails;
                        }
                        else
                        {
                            return null;
                        }
                    }
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


        /// <summary>
        /// this method is used to get the review action workflow details.
        /// </summary>
        /// <param name="recordId">parent record id.</param>
        /// <param name="activityAttributeDetails"></param>
        /// <param name="conditionOperator"></param>
        /// <param name="actionName">action name</param>
        /// <param name="comment">comment</param>
        /// <param name="userDetails">UserDetails object</param>
        /// <returns>Object of workflowlog</returns>
        public WorkFlowLog GetReviewActionWorkFlow(int recordId, object activityAttributeDetails, object conditionOperator, string actionName, string comment, UserDetail userDetails)
        {
            try
            {
                var workFLowLastActionDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();
                WorkFlowDetail workFlowCurrentDetails;
                workFlowCurrentDetails = _workFlowDetailContext.FirstOrDefault(x => x.ParentActivityId == workFLowLastActionDetails.WorkFlowId);
                if (workFlowCurrentDetails != null)
                {
                    WorkFlowLog workFlowDetails;
                    if (workFlowCurrentDetails.IsCondition || workFLowLastActionDetails.WorkFlowDetail.IsCondition)
                    {
                        var workLFowCollection = new List<WorkFlowDetail>();
                        var conditionalCollection = new List<ConditionalOperator>();
                        if (workFLowLastActionDetails.WorkFlowDetail.IsCondition)
                        {
                            workLFowCollection =
                          _workFlowDetailContext.Fetch(x => x.ParentActivityId == workFLowLastActionDetails.WorkFlowDetail.Id)
                              .ToList();
                            conditionalCollection = GetListOfConditionalOperator(workFLowLastActionDetails.WorkFlowDetail.Id);
                        }
                        else
                        {
                            workLFowCollection =
                          _workFlowDetailContext.Fetch(x => x.ParentActivityId == workFlowCurrentDetails.Id)
                              .ToList();
                            conditionalCollection = GetListOfConditionalOperator(workFlowCurrentDetails.Id);
                        }

                        string finalExpression = "";
                        //   List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                        if (conditionalCollection.Any())
                        {
                            foreach (var condition in conditionalCollection)
                            {
                                string condtionOperation = null;
                                if (condition.Condition != null)
                                {

                                    switch (condition.Condition)
                                    {
                                        case "AND":
                                            condtionOperation = "&&";
                                            break;
                                        case "OR":
                                            condtionOperation = "||";
                                            break;
                                    }
                                }

                                string expression;
                                if (condition.IsBoolenCondtion)
                                {
                                    expression = GetConditionBoolenExpression(condition.Variable1, activityAttributeDetails);
                                }
                                else
                                {
                                    expression = GetConditionExpression(condition.Variable1, condition.Variable2, condition.Operator, activityAttributeDetails, conditionOperator);
                                }

                                finalExpression = finalExpression + condtionOperation + expression;
                            }
                        }

                        var e = new Expression(finalExpression);
                        var finalResult = e.Evaluate();
                        if (workFLowLastActionDetails.WorkFlowDetail.IsCondition)
                        {
                            if (Convert.ToBoolean(finalResult))
                                workFlowCurrentDetails = workLFowCollection.FirstOrDefault(x => x.ParentActivityId == workFLowLastActionDetails.WorkFlowDetail.Id && x.IsApprovePanel);
                            else
                                workFlowCurrentDetails = workLFowCollection.FirstOrDefault(x => x.ParentActivityId == workFLowLastActionDetails.WorkFlowDetail.Id && x.IsRejectPanel);
                        }
                        else
                        {
                            if (Convert.ToBoolean(finalResult))
                                workFlowCurrentDetails = workLFowCollection.FirstOrDefault(x => x.ParentActivityId == workFlowCurrentDetails.Id && x.IsApprovePanel);
                            else
                                workFlowCurrentDetails = workLFowCollection.FirstOrDefault(x => x.ParentActivityId == workFlowCurrentDetails.Id && x.IsRejectPanel);
                        }
                        workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);
                        if (workFlowDetails != null)
                        {
                            if (workFlowCurrentDetails.IsAllowOtherWorkFlow)
                            {
                                workFlowCurrentDetails =
                                    _workFlowDetailContext.FirstOrDefault(x => x.Id == workFlowCurrentDetails.OtherWorkFlowId);
                                workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, workFlowDetails.RecordId, userDetails, comment, StringConstants.AddWork);
                            }
                        }
                        return workFlowDetails;
                    }
                    else
                    {
                        workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);
                        if (workFlowDetails != null)
                        {
                            if (workFlowCurrentDetails.IsAllowOtherWorkFlow)
                            {
                                workFlowCurrentDetails =
                                    _workFlowDetailContext.FirstOrDefault(x => x.Id == workFlowCurrentDetails.OtherWorkFlowId);
                                workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, workFlowDetails.RecordId, userDetails, comment, StringConstants.AddWork);
                            }
                        }
                        return workFlowDetails;
                    }
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

        /// <summary>
        /// this method is used to get review action workflow details.
        /// </summary>
        /// <param name="recordId">parent record id.</param>
        /// <param name="activityAttributeDetails"></param>
        /// <param name="conditionOperator"></param>
        /// <param name="actionName">action name</param>
        /// <param name="comment">comment</param>
        /// <param name="userDetails">userdetails object</param>
        /// <returns>Object of workflowlog</returns>
        public WorkFlowLog GetResubmitActionWorkFlow(int recordId, object activityAttributeDetails, object conditionOperator, string actionName, string comment, UserDetail userDetails)
        {
            try
            {
                var workFLowLastActionDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();
                WorkFlowDetail workFlowCurrentDetails;
                workFlowCurrentDetails = _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastActionDetails.WorkFlowDetail.ParentActivityId);
                if (workFlowCurrentDetails != null)
                {
                    WorkFlowLog workFlowDetails = null;
                    if (workFlowCurrentDetails.IsChildCondition)
                    {
                        var currentWorkFlowDetails = _workFlowDetailContext.FirstOrDefault(x => x.Id == workFlowCurrentDetails.ParentActivityId);
                        var workDetailCollection = _workFlowDetailContext.Fetch(x => x.ParentActivityId == currentWorkFlowDetails.Id).ToList();
                        if (currentWorkFlowDetails != null)
                        {
                            WorkFlowLog workflowDetails;
                            if (currentWorkFlowDetails.IsCondition)
                            {
                                var conditionalCollection = GetListOfConditionalOperator(currentWorkFlowDetails.Id);
                                string finalExpression = "";
                                //   List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                                if (conditionalCollection.Any())
                                {
                                    foreach (var condition in conditionalCollection)
                                    {
                                        string condtionOperation = null;

                                        if (condition.Condition != null)
                                        {

                                            switch (condition.Condition)
                                            {
                                                case "AND":
                                                    condtionOperation = "&&";
                                                    break;
                                                case "OR":
                                                    condtionOperation = "||";
                                                    break;
                                            }
                                        }
                                        string expression;
                                        if (condition.IsBoolenCondtion)
                                        {
                                            expression = GetConditionBoolenExpression(condition.Variable1,
                                                activityAttributeDetails);
                                        }
                                        else
                                        {
                                            expression = GetConditionExpression(condition.Variable1, condition.Variable2,
                                                condition.Operator, activityAttributeDetails, conditionOperator);
                                        }
                                        finalExpression = finalExpression + condtionOperation + expression;

                                    }
                                }

                                var e = new Expression(finalExpression);
                                var finalResult = e.Evaluate();
                                if (Convert.ToBoolean(finalResult))
                                    currentWorkFlowDetails =
                                        workDetailCollection.FirstOrDefault(
                                            x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsApprovePanel);
                                else
                                    currentWorkFlowDetails =
                                        workDetailCollection.FirstOrDefault(
                                            x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsRejectPanel);
                                workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, recordId,
                                    userDetails, comment, actionName);
                                if (workflowDetails != null)
                                {
                                    if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                    {
                                        currentWorkFlowDetails =
                                            _workFlowDetailContext.FirstOrDefault(
                                                x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                        workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails,
                                            workflowDetails.RecordId, userDetails, comment, StringConstants.AddWork);
                                    }
                                }
                                return workflowDetails;
                            }
                        }
                    }
                    else
                    {
                        workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);
                    }

                    return workFlowDetails;
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

        /// <summary>
        /// this method is used to get edit action workflow details.
        /// </summary>
        /// <param name="parentActivityName">parent activity name</param>
        /// <param name="childActivityName">child activity name</param>
        /// <param name="userDetail">userdetail object</param>
        /// <param name="companyDetail">company details object</param>
        /// <param name="conditionOperator"></param>
        /// <param name="comment">comment</param>
        /// <param name="activityAttributeDetails"></param>
        /// <param name="recordId">parent record id</param>
        /// <param name="actionName">action name</param>
        /// <returns>Object of workflowlog</returns>
        public WorkFlowLog GetEditActionWorkFlow(string parentActivityName, string childActivityName, UserDetail userDetail, CompanyDetail companyDetail, object conditionOperator, string comment, object activityAttributeDetails, int recordId, string actionName)
        {
            try
            {
                var workDetailCollection = _workFlowDetailContext.Fetch(x => x.ParentPermission.Name == parentActivityName && x.CompanyId == companyDetail.Id).ToList();
                if (workDetailCollection.Count != 0)
                {
                    var currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.InitiatorId == userDetail.RoleId && x.IsParentAction && x.Activity.Name == childActivityName);
                    if (currentWorkFlowDetails != null)
                    {
                        WorkFlowLog workflowDetails;
                        if (currentWorkFlowDetails.IsCondition)
                        {
                            var conditionalCollection = GetListOfConditionalOperator(currentWorkFlowDetails.Id);
                            string finalExpression = "";
                            //   List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                            if (conditionalCollection.Any())
                            {
                                foreach (var condition in conditionalCollection)
                                {
                                    string condtionOperation = null;

                                    if (condition.Condition != null)
                                    {

                                        switch (condition.Condition)
                                        {
                                            case "AND":
                                                condtionOperation = "&&";
                                                break;
                                            case "OR":
                                                condtionOperation = "||";
                                                break;
                                        }
                                    }
                                    string expression;
                                    if (condition.IsBoolenCondtion)
                                    {
                                        expression = GetConditionBoolenExpression(condition.Variable1, activityAttributeDetails);
                                    }
                                    else
                                    {
                                        expression = GetConditionExpression(condition.Variable1, condition.Variable2, condition.Operator, activityAttributeDetails, conditionOperator);
                                    }
                                    finalExpression = finalExpression + condtionOperation + expression;

                                }
                            }

                            var e = new Expression(finalExpression);
                            var finalResult = e.Evaluate();
                            if (Convert.ToBoolean(finalResult))
                                currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsApprovePanel);
                            else
                                currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsRejectPanel);
                            workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, recordId, userDetail, comment, actionName);
                            if (workflowDetails != null)
                            {
                                if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                {
                                    currentWorkFlowDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                    workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, workflowDetails.RecordId, userDetail, comment, StringConstants.AddWork);
                                }
                            }
                            return workflowDetails;
                        }
                        else
                        {
                            workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, recordId, userDetail, comment, actionName);
                            if (workflowDetails != null)
                            {
                                if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                {
                                    currentWorkFlowDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                    workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, workflowDetails.RecordId, userDetail, comment, StringConstants.AddWork);
                                }
                            }
                            return workflowDetails;
                        }
                    }
                    else
                    {
                        return null;
                    }
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


        /// <summary>
        /// this method is used to get delete action workflow details.
        /// </summary>
        /// <param name="parentActivityName">parent activity name</param>
        /// <param name="childActivityName">child activity name</param>
        /// <param name="userDetail">userdetail object</param>
        /// <param name="companyDetail">companydetail object</param>
        /// <param name="conditionOperator"></param>
        /// <param name="comment">comment</param>
        /// <param name="activityAttributeDetails"></param>
        /// <param name="recordId">parent record id</param>
        /// <param name="actionName">action name</param>
        /// <returns>Object of workflowlog</returns>
        public WorkFlowLog GetDeleteActionWorkFlow(string parentActivityName, string childActivityName, UserDetail userDetail,
            CompanyDetail companyDetail, object conditionOperator, string comment, object activityAttributeDetails, int recordId, string actionName)
        {
            try
            {
                var workDetailCollection = _workFlowDetailContext.Fetch(x => x.ParentPermission.Name == parentActivityName && x.CompanyId == companyDetail.Id).ToList();
                if (workDetailCollection.Count != 0)
                {
                    var currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.InitiatorId == userDetail.RoleId && x.IsParentAction && x.Activity.Name == childActivityName);
                    if (currentWorkFlowDetails != null)
                    {
                        WorkFlowLog workflowDetails;
                        if (currentWorkFlowDetails.IsCondition)
                        {
                            var conditionalCollection = GetListOfConditionalOperator(currentWorkFlowDetails.Id);
                            string finalExpression = "";
                            //   List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                            if (conditionalCollection.Any())
                            {
                                foreach (var condition in conditionalCollection)
                                {
                                    string condtionOperation = null;

                                    if (condition.Condition != null)
                                    {

                                        switch (condition.Condition)
                                        {
                                            case "AND":
                                                condtionOperation = "&&";
                                                break;
                                            case "OR":
                                                condtionOperation = "||";
                                                break;
                                        }
                                    }
                                    string expression;
                                    if (condition.IsBoolenCondtion)
                                    {
                                        expression = GetConditionBoolenExpression(condition.Variable1, activityAttributeDetails);
                                    }
                                    else
                                    {
                                        expression = GetConditionExpression(condition.Variable1, condition.Variable2, condition.Operator, activityAttributeDetails, conditionOperator);
                                    }
                                    finalExpression = finalExpression + condtionOperation + expression;

                                }
                            }

                            var e = new Expression(finalExpression);
                            var finalResult = e.Evaluate();
                            if (Convert.ToBoolean(finalResult))
                                currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsApprovePanel);
                            else
                                currentWorkFlowDetails = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == currentWorkFlowDetails.Id && x.IsRejectPanel);
                            workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, recordId, userDetail, comment, actionName);
                            if (workflowDetails != null)
                            {
                                if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                {
                                    currentWorkFlowDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                    workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, workflowDetails.RecordId, userDetail, comment, StringConstants.AddWork);
                                }
                            }
                            return workflowDetails;
                        }
                        else
                        {
                            workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, recordId, userDetail, comment, actionName);
                            if (workflowDetails != null)
                            {
                                if (currentWorkFlowDetails.IsAllowOtherWorkFlow)
                                {
                                    currentWorkFlowDetails =
                                        _workFlowDetailContext.FirstOrDefault(x => x.Id == currentWorkFlowDetails.OtherWorkFlowId);
                                    workflowDetails = SaveWorkFlowApprovalDetails(currentWorkFlowDetails, workflowDetails.RecordId, userDetail, comment, StringConstants.AddWork);
                                }
                            }
                            return workflowDetails;
                        }
                    }
                    else
                    {
                        return null;
                    }
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

        /// <summary>
        ///  this method is used to view the workflow details by the id.
        /// </summary>
        /// <param name="recordId"></param>
        /// <param name="userDetail"></param>
        /// <returns></returns>
        public WorkFlowDetail ViewWorkFlowDetailsById(int recordId, UserDetail userDetail)
        {
            try
            {
                var workFLowLastActionDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();

                if (workFLowLastActionDetails != null)
                {
                    var workFlowCurrentDetails =
                     _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastActionDetails.WorkFlowId && x.AssignedId == userDetail.RoleId);

                    return workFlowCurrentDetails;
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


        /// <summary>
        /// this method is used to view the rejrct action workflow details by the id.
        /// </summary>
        /// <param name="recordId">parent record id</param>
        /// <param name="userDetail">user detail object</param>
        /// <returns></returns>
        public WorkFlowDetail ViewRejectWorkFlowDetailsById(int recordId, UserDetail userDetail)
        {
            try
            {
                var workFLowLastActionDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();

                if (workFLowLastActionDetails != null)
                {
                    var workFlowCurrentDetails =
                     _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastActionDetails.WorkFlowId && x.AssignedId == userDetail.RoleId);
                    return workFlowCurrentDetails;
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

        /// <summary>
        /// this method is used  to get all workflow action list
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns>list of wwork flow action</returns>
        public List<WorkFlowActionAc> GetAllWorkFlowActionList(int recordId)
        {
            try
            {
                var workflowCollection = new List<WorkFlowActionAc>();


                foreach (var workflowInfo in _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList())
                {
                    var workFlowActionAc = new WorkFlowActionAc();
                    workFlowActionAc.Stage = workflowInfo.Stage;
                    workFlowActionAc.Action = workflowInfo.Action;
                    workFlowActionAc.WorkFlowActionId = workflowInfo.Id;
                    workFlowActionAc.RoleName = workflowInfo.RoleDetails.RoleName;
                    workFlowActionAc.Comment = workflowInfo.Comments;
                    workFlowActionAc.IsRejected = workflowInfo.WorkFlowDetail.IsRejectPanel;
                    workFlowActionAc.AssignedRole = workflowInfo.WorkFlowDetail.AssignedRole.RoleName;
                    workFlowActionAc.IsCondition = workflowInfo.WorkFlowDetail.IsCondition;
                    workFlowActionAc.IsReview = workflowInfo.WorkFlowDetail.IsReview;
                    workFlowActionAc.NextActivityId = workflowInfo.WorkFlowDetail.NextActivityId;
                    workFlowActionAc.InitiatorRole = workflowInfo.WorkFlowDetail.InitiatorRole.RoleName;
                    workFlowActionAc.ActionDate = workflowInfo.CreatedDateTime.ToString("dd-MM-yyyy");
                    var userNames = _userDetailContext.FirstOrDefault(x => x.UserId == workflowInfo.UserId);
                    if (userNames != null)
                    {
                        workFlowActionAc.UserName = userNames.UserName;
                    }

                    workflowCollection.Add(workFlowActionAc);
                }

                return workflowCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public WorkFlowLog GetRejectActionActionWorkFlow(int recordId, object activityAttributeDetails, object conditionOperator,
            string actionName, string comment, UserDetail userDetails)
        {
            try
            {
                var workFLowLastActionDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();
                WorkFlowDetail workFlowCurrentDetails;
                var lastWorkFLowDetails = _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastActionDetails.WorkFlowDetail.ParentActivityId);
                if (lastWorkFLowDetails != null)
                {
                    var parentWorkFlowDetails = _workFlowDetailContext.FirstOrDefault(x => x.Id == lastWorkFLowDetails.ParentActivityId);
                    if (parentWorkFlowDetails != null)
                    {
                        WorkFlowLog workFlowDetails;

                        // workFlowDetails = SaveWorkFlowApprovalDetails(parentWorkFlowDetails, recordId, userDetails, comment, actionName);
                        // return workFlowDetails;
                        workFlowCurrentDetails = _workFlowDetailContext.FirstOrDefault(x => x.ParentActivityId == parentWorkFlowDetails.Id && x.IsRejectPanel);
                        if (workFlowCurrentDetails != null)
                        {
                            workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);
                            return workFlowDetails;
                        }
                        else
                        {
                            return null;
                        }
                        //else
                        //{
                        //    workFlowCurrentDetails = _workFlowDetailContext.FirstOrDefault(x => x.Id == parentWorkFlowDetails.ParentActivityId);
                        //     workFlowDetails = SaveWorkFlowApprovalDetails(workFlowCurrentDetails, recordId, userDetails, comment, actionName);

                        //}

                    }
                    else
                    {
                        return null;
                    }
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



        public bool CheckLastActionPerform(int recordId, string actionName, int roleId)
        {
            try
            {
                var workFLowLastDetails = _workFLowLogContext.Fetch(x => x.RecordId == recordId).ToList().Last();
                if (workFLowLastDetails != null && workFLowLastDetails.RoleId == roleId && workFLowLastDetails.Action != actionName)
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private WorkFlowLog SaveWorkFlowApprovalDetails(WorkFlowDetail workFlowCurrentDetails, int recordId, UserDetail userDetails, string comment, string actionName)
        {
            try
            {
                var workFlowLog = new WorkFlowLog
                {
                    Comments = comment,
                    CreatedDateTime = DateTime.UtcNow,
                    RecordId = recordId,
                    RoleId = userDetails.RoleId,
                    UserId = userDetails.UserId,
                    WorkFlowId = workFlowCurrentDetails.Id,
                    Action = actionName,
                    Stage = (userDetails.RoleName) + " " + (workFlowCurrentDetails.Activity != null ? workFlowCurrentDetails.Activity.Name : "")
                };

                _workFLowLogContext.Add(workFlowLog);
                _workFLowLogContext.SaveChanges();

                return workFlowLog;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private WorkFlowLog SaveInitiationWorkFlowDetails(WorkFlowDetail currentWorkFlowDetails, string comment, UserDetail userDetail)
        {
            try
            {
                var parentRecord = new ParentRecord
                {
                    //BranchId = userDetail.BranchId,
                    CreatedDateTime = DateTime.UtcNow,
                    InitiationComment = comment,
                    InitiationDate = DateTime.UtcNow,
                    ModificationDate = DateTime.UtcNow,
                    InitiatorId = userDetail.UserId,
                    ModifiedUserId = userDetail.UserId,
                    WorkFlowId = currentWorkFlowDetails.Id
                };

                _parentRecordContext.Add(parentRecord);
                _parentRecordContext.SaveChanges();


                var workFlowLog = new WorkFlowLog();
                if (parentRecord.Id != 0)
                {

                    workFlowLog.Comments = comment;
                    workFlowLog.CreatedDateTime = DateTime.UtcNow;
                    workFlowLog.RecordId = parentRecord.Id;
                    workFlowLog.RoleId = userDetail.RoleId;
                    workFlowLog.UserId = userDetail.UserId;
                    workFlowLog.WorkFlowId = currentWorkFlowDetails.Id;
                    workFlowLog.Action = StringConstants.Initiation;
                    workFlowLog.Stage = (userDetail.RoleName) + " " +
                                        (currentWorkFlowDetails.Activity != null ? currentWorkFlowDetails.Activity.Name : "");

                    _workFLowLogContext.Add(workFlowLog);
                    _workFLowLogContext.SaveChanges();
                }
                return workFlowLog;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private string GetConditionExpression(string variable1, string variable2, string @operator, object activityAttributeDetails, object conditionOperator)
        {
            try
            {
                string value2 = "";
                string value1 = "";
                value1 = conditionOperator.GetType().GetProperty(variable1).GetValue(conditionOperator, null).ToString();
                value2 = activityAttributeDetails.GetType().GetProperty(variable2).GetValue(activityAttributeDetails, null).ToString();
                string str = (value1 + @operator + value2);
                return str;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private string GetConditionBoolenExpression(string variable1, object activityAttributeDetails)
        {
            try
            {

                string value1 = "";
                value1 = activityAttributeDetails.GetType().GetProperty(variable1).GetValue(activityAttributeDetails, null).ToString();
                string str = (value1);
                return str.ToLower();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private List<ConditionalOperator> GetListOfConditionalOperator(int workFlowId)
        {
            try
            {
                return _conditionalOperatorContext.Fetch(x => x.WorkFlowDetailId == workFlowId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}

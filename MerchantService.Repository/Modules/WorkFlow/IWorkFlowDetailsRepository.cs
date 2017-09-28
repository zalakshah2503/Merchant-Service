using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Customer;

namespace MerchantService.Repository.Modules.WorkFlow
{
    public interface IWorkFlowDetailsRepository : IDisposable
    {
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
        Tuple<object, object> GetInitiationActionWorkFlow(string parentActivityName, string childActivityName, UserDetail userDetail, CompanyDetail companyDetail, object conditionOperator, string comment, object activityAttributeDetails);

        /// <summary>
        /// this method is used to get the approval action workflow details.
        /// </summary>
        /// <param name="recordId">parent record id.</param>
        /// <param name="actionName">action name</param>
        /// <param name="comment">comment</param>
        /// <param name="userDetails">UserDetails Object</param>
        /// <param name="status">status either true and false.</param>
        /// <returns>Object of workflowlog</returns>
        WorkFlowLog GetApprovalActionWorkFLow(int recordId, string actionName, string comment, UserDetail userDetails, bool status);

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
        WorkFlowLog GetReviewActionWorkFlow(int recordId, object activityAttributeDetails, object conditionOperator, string actionName, string comment, UserDetail userDetails);

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
        WorkFlowLog GetResubmitActionWorkFlow(int recordId, object activityAttributeDetails, object conditionOperator, string actionName, string comment, UserDetail userDetails);

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
        WorkFlowLog GetEditActionWorkFlow(string parentActivityName, string childActivityName, UserDetail userDetail, CompanyDetail companyDetail, object conditionOperator, string comment, object activityAttributeDetails, int recordId, string actionName);

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
        WorkFlowLog GetDeleteActionWorkFlow(string parentActivityName, string childActivityName, UserDetail userDetail, CompanyDetail companyDetail, object conditionOperator, string comment, object activityAttributeDetails, int recordId, string actionName);

        /// <summary>
        ///  this method is used to view the workflow details by the id.
        /// </summary>
        /// <param name="recordId">parent record id</param>
        /// <param name="userDetail">user detail object</param>
        /// <returns></returns>

        WorkFlowDetail ViewWorkFlowDetailsById(int recordId, UserDetail userDetail);

        /// <summary>
        /// this method is used to view the rejrct action workflow details by the id.
        /// </summary>
        /// <param name="recordId">parentrecord record id</param>
        /// <param name="userDetail">userdetails object</param>
        /// <returns></returns>
        WorkFlowDetail ViewRejectWorkFlowDetailsById(int recordId, UserDetail userDetail);

        /// <summary>
        /// this method is used  to get all workflow action list
        /// </summary>
        /// <param name="recordId">parent record id</param>
        /// <returns></returns>
        List<WorkFlowActionAc> GetAllWorkFlowActionList(int recordId);

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
        WorkFlowLog GetRejectActionActionWorkFlow(int recordId, object activityAttributeDetails, object conditionOperator, string actionName, string comment, UserDetail userDetails);

        /// <summary>
        /// This method used for last workflow action is perform for current user.   
        /// </summary>
        /// <param name="recordId">pass recordid</param>
        /// <param name="actionName">pass action name</param>
        /// <param name="roleId">pass login user roleid</param>
        /// <returns></returns>
        bool CheckLastActionPerform(int recordId, string actionName, int roleId);

    }
}

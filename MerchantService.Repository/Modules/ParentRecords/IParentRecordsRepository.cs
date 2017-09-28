using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.ParentRecords
{
    public interface IParentRecordsRepository
    {
        /// <summary>
        /// This method used for insert parent Recored and return Primary key. -An
        /// </summary>
        /// <param name="parentRecord">InitiatorId,InitiationDate,InitiationComment,ModifiedUserId,ModificationDate</param>
        /// <returns></returns>
        int AddParentRecords(ParentRecord parentRecord);

        /// <summary>
        /// This method used for get Parent Record By Type Id. -An
        /// </summary>
        /// <param name="typeId">pass type Id.</param>
        /// <returns></returns>
        List<ParentRecord> GetListOfParentRecordByTypeId(int typeId);

        /// <summary>
        /// This method used for add Work Flow Logs and return primary key. -An
        /// </summary>
        /// <param name="workFlowLog">Pass RecordId,RoleId,UserId,Comments</param>
        /// <returns></returns>
        int AddWorkFlowLogs(WorkFlowLog workFlowLog);

        /// <summary>
        /// This method used for Approve Item Offer. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns>if approve suceesfully so pass true and other wise false</returns>
        bool ApproveItemOffer(WorkFlowLog workFlowLog);

        /// <summary>
        /// This method used for get list of work flow log. -An 
        /// </summary>
        /// <param name="itemOfferId">pass recordId</param>
        /// <returns></returns>
        List<WorkFlowLog> GetListOfWorkFlowLogByRecordId(int recordId);

        /// <summary>
        /// This method used for get last work flow detail by record id. -An
        /// </summary>
        /// <param name="recordId">pass recordId.</param>
        /// <returns></returns>
        WorkFlowLog GetLastWorkFlowDetaiByRecordId(int recordId);

        /// <summary>
        /// Get work flow deatil list by work flow id. -An
        /// /// </summary>
        /// <param name="workFlowId">pass workFlowId</param>
        /// <returns></returns>
        List<WorkFlowDetail> GetWorkFlowDetailListByWorkFlowId(int workFlowId,int companyId);

        List<WorkFlowDetail> GetWorkFlowDetailListByParent(string activity, int companyId);

        /// <summary>
        /// Work flow log object by record id. -An
        /// </summary>
        /// <returns></returns>
        WorkFlowLog GetWorkFlowLogLastObjectByRecordId(int recordId);

        /// <summary>
        /// This method used for get WorkFlowDetail list by parent id. -An
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        List<WorkFlowDetail> GetWorkFlowDetailByParnetId(int parentId);

        /// <summary>
        /// This method used for get Eotk Flow Detail by Id. -An
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        WorkFlowDetail GetWorkFlowDetailById(int parentId);

        /// <summary>
        /// This method used for get work flow by record id. -An
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns></returns>
        List<WorkFlowDetail> GetWorkFlowDetailByRecordId(int recordId, int companyId);

    }
}

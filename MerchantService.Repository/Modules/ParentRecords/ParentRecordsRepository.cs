using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.ParentRecords
{
    public class ParentRecordsRepository : IParentRecordsRepository, IDisposable
    {
        #region "Private Variable(s)"

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<ParentRecord> _iParentRecordContext;
        private readonly IDataRepository<WorkFlowLog> _iWorkFlowLogContext;
        private readonly IDataRepository<ItemOffer> _iItemOfferContext;
        private readonly IDataRepository<WorkFlowDetail> _iWorkFlowDetailContext;

        #endregion

        #region "Constructor & Destructor(s)"
        public ParentRecordsRepository(IErrorLog errorLog, IDataRepository<ParentRecord> iParentRecordContext, IDataRepository<WorkFlowLog> iWorkFlowLogContext, IDataRepository<ItemOffer> iItemOfferContext
            , IDataRepository<WorkFlowDetail> iWorkFlowDetailContext)
        {
            _errorLog = errorLog;
            _iItemOfferContext = iItemOfferContext;
            _iWorkFlowLogContext = iWorkFlowLogContext;
            _iParentRecordContext = iParentRecordContext;
            _iWorkFlowDetailContext = iWorkFlowDetailContext;
        }

        #endregion

        #region "Dispose Method(s)"
        /// <summary>
        /// Method disposes the repository context 
        /// </summary>
        public void Dispose()
        {
            try
            {
                _iParentRecordContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
            finally
            {

            }
        }

        #endregion

        #region "Public Method(s)"


        public List<WorkFlowDetail> GetWorkFlowDetailListByParent(string activity, int companyId)
        {
            try
            {
                return _iWorkFlowDetailContext.Fetch(x => x.CompanyId == companyId && x.ParentPermission.Name == activity).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get work flow by record id. -An
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns></returns>
        public List<WorkFlowDetail> GetWorkFlowDetailByRecordId(int recordId, int companyId)
        {
            try
            {
                List<WorkFlowDetail> listOfWorkFlowDetail = new List<WorkFlowDetail>();
                WorkFlowLog workFlowLogObject = _iWorkFlowLogContext.Fetch(x => x.RecordId == recordId).OrderByDescending(x => x.CreatedDateTime).FirstOrDefault();
                if (workFlowLogObject != null)
                {
                    listOfWorkFlowDetail = _iWorkFlowDetailContext.Fetch(x => x.ParentActivityId == workFlowLogObject.WorkFlowId && x.CompanyId == companyId).ToList();
                }
                return listOfWorkFlowDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get Eotk Flow Detail by Id. -An
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public WorkFlowDetail GetWorkFlowDetailById(int parentId)
        {
            try
            {
                return _iWorkFlowDetailContext.FirstOrDefault(x => x.Id == parentId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert parent Recored and return Primary key. -An
        /// </summary>
        /// <param name="parentRecord">TypeId,StatusId,BranchId,InitiatorId,InitiationComment,ModifiedUserId,ModifiedUserId,ModificationDate</param>
        /// <returns></returns>
        public int AddParentRecords(ParentRecord parentRecord)
        {
            try
            {
                _iParentRecordContext.Add(parentRecord);
                _iParentRecordContext.SaveChanges();
                return parentRecord.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get Parent Record By Type Id. -An
        /// </summary>
        /// <param name="typeId">pass type Id.</param>
        /// <returns></returns>
        public List<ParentRecord> GetListOfParentRecordByTypeId(int typeId)
        {
            try
            {
                var list = new List<ParentRecord>();
                return list;
                //work-flow related changes.
                // return _iParentRecordContext.Fetch(x => x.TypeId == typeId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for insert into WorkFlowLog table and return primary key. -An
        /// </summary>
        /// <param name="workFlowLog"></param>
        /// <returns></returns>
        public int AddWorkFlowLogs(WorkFlowLog workFlowLog)
        {
            try
            {
                _iWorkFlowLogContext.Add(workFlowLog);
                _iWorkFlowLogContext.SaveChanges();
                return workFlowLog.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// Work flow log object by record id. -An
        /// </summary>
        /// <returns></returns>
        public WorkFlowLog GetWorkFlowLogLastObjectByRecordId(int recordId)
        {
            try
            {
                return _iWorkFlowLogContext.Fetch(x => x.RecordId == recordId).OrderByDescending(x => x.CreatedDateTime).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get WorkFlowDetail list by parent id. -An
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public List<WorkFlowDetail> GetWorkFlowDetailByParnetId(int parentId)
        {
            try
            {
                return _iWorkFlowDetailContext.Fetch(x => x.ParentActivityId == parentId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        ///<summary>
        /// This method used for Approve Item Offer. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns>if approve suceesfully so pass true and other wise false</returns>
        public bool ApproveItemOffer(WorkFlowLog workFlowLog)
        {
            try
            {
                _iWorkFlowLogContext.Add(workFlowLog);
                _iWorkFlowLogContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of work flow log. -An 
        /// </summary>
        /// <param name="itemOffer">pass record Id</param>
        /// <returns></returns>
        public List<WorkFlowLog> GetListOfWorkFlowLogByRecordId(int recordId)
        {
            try
            {
                return _iWorkFlowLogContext.Fetch(x => x.RecordId == recordId).ToList();

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get last work flow detail by record Id. -An
        /// </summary>
        /// <param name="recordId">pass record Id</param>
        /// <returns></returns>
        public WorkFlowLog GetLastWorkFlowDetaiByRecordId(int recordId)
        {
            try
            {
                return _iWorkFlowLogContext.Fetch(x => x.RecordId == recordId).OrderByDescending(x => x.CreatedDateTime).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// Get work flow deatil list by work flow id. -An
        /// /// </summary>
        /// <param name="workFlowId">pass workFlowId</param>
        /// <returns></returns>
        public List<WorkFlowDetail> GetWorkFlowDetailListByWorkFlowId(int workFlowId, int companyId)
        {
            try
            {
                return _iWorkFlowDetailContext.Fetch(x => x.WorkFlowId == workFlowId && x.CompanyId == companyId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion
    }
}

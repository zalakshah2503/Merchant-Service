using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin.IncidentReport;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Admin.IncidentReports
{
    public class ManageIncidentReportRepository : IManageIncidentReportRepository, IDisposable
    {

        #region Private Variable

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<IncidentReport> _incidentReportContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<CashierIncidentReport> _cashierIncidentReportCotext;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogContext;


        #endregion

        #region Constructor
        public ManageIncidentReportRepository(IDataRepository<IncidentReport> incidentReportContext, IErrorLog errorLog, IDataRepository<ParamType> paramTypeContext,
            IDataRepository<CashierIncidentReport> cashierIncidentReportCotext, IDataRepository<WorkFlowLog> workFlowLogContext)
        {
            _incidentReportContext = incidentReportContext;
            _paramTypeContext = paramTypeContext;
            _workFlowLogContext = workFlowLogContext;
            _errorLog = errorLog;
            _cashierIncidentReportCotext = cashierIncidentReportCotext;
        }
        #endregion

        #region "Dispose Method(s)"

        public void Dispose()
        {
            try
            {
                _incidentReportContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion

        #region Private Methods


        /// <summary>
        /// This method used for get cashier incident report by id. -An.
        /// </summary>
        /// <param name="cashierId"></param>
        /// <returns></returns>
        public List<CashierIncidentReport> GetCashierIncidentListByCashierId(int cashierId)
        {
            try
            {
                return _cashierIncidentReportCotext.Fetch(x => x.UserId == cashierId && x.IsRefreshRequset == false).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update incident report. -An
        /// </summary>
        /// <param name="incidentReport"></param>
        /// <returns></returns>
        public int UpdateIncidentReport(IncidentReport incidentReport)
        {
            try
            {
                incidentReport.ModifiedDateTime = DateTime.UtcNow;
                _incidentReportContext.Update(incidentReport);
                _incidentReportContext.SaveChanges();
                return incidentReport.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public IncidentReport GetIncidentReportById(int id)
        {
            try
            {
                return _incidentReportContext.FirstOrDefault(X => X.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get incident report by company id. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public IncidentReport GetIncidentReportByCompanyId(int companyId)
        {
            try
            {
                return _incidentReportContext.FirstOrDefault(x => x.CompanyId == companyId);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for insert in to incident report and return primary key. -An
        /// </summary>
        /// <param name="incidentReport">incident report contain OperationTypeId,AmountLimit,OperationCounter,Comment,
        /// StatusId,StartDateTime,EndDateTime,DurationTypeId,CompanyId</param>
        /// <returns></returns>
        public int AddIncidentReport(IncidentReport incidentReport)
        {
            try
            {
                _incidentReportContext.Add(incidentReport);
                _incidentReportContext.SaveChanges();
                return incidentReport.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of incident report by param Id. -An
        /// </summary>
        /// <returns></returns>
        public List<ParamType> GetListOfOpration(int ParamId)
        {
            try
            {
                return _paramTypeContext.Fetch(x => x.ParamId == ParamId).ToList();

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        ///This method used for get list of cashier incident report by comapny id. -An 
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<CashierIncidentReport> GetListOfCashierIncidentReportByCompanyId(int companyId)
        {
            try
            {                
                return _cashierIncidentReportCotext.Fetch(x => x.UserDetail.Branch.CompanyId == companyId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get incident report list by compantId. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<IncidentReport> GetIncidentReportList(int companyId)
        {
            try
            {
                return _incidentReportContext.Fetch(x => x.CompanyId == companyId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list Of Incident Report WorkList. -An
        /// </summary>
        /// <returns></returns>
        public List<IncidentReportWorkListAC> listOfIncidentReportWorkListAC(int companyId)
        {
            try
            {
                List<IncidentReportWorkListAC> listOfIncidentReportWorkFlowList = new List<IncidentReportWorkListAC>();
                IncidentReport incidentReport = _incidentReportContext.FirstOrDefault(x => x.CompanyId == companyId);
                if (incidentReport != null)
                {
                    List<CashierIncidentReport> listOfCashierIncidentReport = _cashierIncidentReportCotext.Fetch(x => (x.OperationCounter >= incidentReport.OperationCounter || x.AmountLimit >= incidentReport.AmountLimit) && x.UserDetail.Branch.CompanyId == incidentReport.CompanyId).ToList();
                    foreach (var cashierIncidentReport in listOfCashierIncidentReport)
                    {
                        IncidentReportWorkListAC incidentReportWorkListAc = new IncidentReportWorkListAC();
                        incidentReportWorkListAc.Id = cashierIncidentReport.Id;
                        incidentReportWorkListAc.CashierId = cashierIncidentReport.UserDetail.Id;
                        incidentReportWorkListAc.CashierName = cashierIncidentReport.UserDetail.UserName;

                        if (cashierIncidentReport.ParentRecord != null)
                        {
                            WorkFlowLog workFlowLog = _workFlowLogContext.Fetch(x => x.RecordId == cashierIncidentReport.ParentRecord.Id).OrderBy(x => x.CreatedDateTime).FirstOrDefault();
                            if (workFlowLog != null)
                            {
                                incidentReportWorkListAc.Comment = workFlowLog.Comments;
                            }
                        }
                        incidentReportWorkListAc.ReachedDateTime = cashierIncidentReport.CreatedDateTime;
                        incidentReportWorkListAc.BranchName = cashierIncidentReport.UserDetail.Branch.Name;
                        incidentReportWorkListAc.BranchId = cashierIncidentReport.UserDetail.BranchId != null ? Convert.ToInt32(cashierIncidentReport.UserDetail.BranchId) : 0;
                        listOfIncidentReportWorkFlowList.Add(incidentReportWorkListAc);
                    }
                }
                return listOfIncidentReportWorkFlowList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public CashierIncidentReport InsertDataInCashierIncidnetReport(CashierIncidentReport cashierIncidentReport)
        {
            try
            {
                cashierIncidentReport.CreatedDateTime = DateTime.UtcNow;
                _cashierIncidentReportCotext.Add(cashierIncidentReport);
                _cashierIncidentReportCotext.SaveChanges();
                return cashierIncidentReport;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        public List<CashierIncidentReport> GetCashierIncidentReportByCashierId(int cashierId)
        {
            try
            {
                var cashierRecordObj = _cashierIncidentReportCotext.Fetch(x => x.UserId == cashierId).ToList();
                return cashierRecordObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public CashierIncidentReport UpdateCashierIncidentReportByCashier(CashierIncidentReport cashierIncidentReport)
        {
            try
            {
                cashierIncidentReport.ModifiedDateTime = DateTime.UtcNow;
                _cashierIncidentReportCotext.Update(cashierIncidentReport);
                _cashierIncidentReportCotext.SaveChanges();
                return cashierIncidentReport;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for Get Cashier Incidnet Report By Id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public CashierIncidentReport GetCashierIncidnetReportById(int id)
        {
            try
            {
                return _cashierIncidentReportCotext.FirstOrDefault(x => x.Id == id);
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

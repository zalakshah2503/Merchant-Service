using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin.IncidentReport;
using MerchantService.Repository.ApplicationClasses.IncidentReport;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.IncidentReports;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.ParentRecords;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.ManageIncidentReport
{
    //[DynamicAuthorize]
    [RoutePrefix("api/incidentreport")]
    public class ManageIncidentReportController : BaseController
    {
        #region Private Variables
        private readonly IErrorLog _errorLog;
        private readonly IManageIncidentReportRepository _incidentReportRepository;
        private readonly IUserDetailRepository _iUserDetailReport;
        private readonly IParentRecordsRepository _iParentRecordsRepository;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly int companyId;
        #endregion

        #region Constructor
        public ManageIncidentReportController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IManageIncidentReportRepository incidentReportRepository, IUserDetailRepository iUserDetailReport,
            IParentRecordsRepository iParentRecordsRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _incidentReportRepository = incidentReportRepository;
            _iParentRecordsRepository = iParentRecordsRepository;
            _iUserDetailReport = iUserDetailReport;

            if (MerchantContext.CompanyDetails != null)
            {
                companyId = MerchantContext.CompanyDetails.Id;
            }
        }
        #endregion

        #region "Public Method(s)"

        [HttpGet]
        [Route("getlistofincidentreportworklist")]
        public IHttpActionResult GetIncidentReportWorkList()
        {
            try
            {
                List<IncidentReportWorkListAC> incidentReportWorkList = new List<IncidentReportWorkListAC>();
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    //Get Incident Report By Comapany Id.
                    IncidentReport incidentReport = _incidentReportRepository.GetIncidentReportByCompanyId(companyId);
                    if (incidentReport != null)
                    {
                        //Get Cashier Incident Report BY Company Id.
                        List<CashierIncidentReport> listOfCashierIncidentReport = _incidentReportRepository.GetListOfCashierIncidentReportByCompanyId(companyId);
                        if (listOfCashierIncidentReport.Count > 0)
                        {
                            //Group By Cashier.
                            var cashierIncidentList = listOfCashierIncidentReport.GroupBy(x => x.UserId);
                            foreach (var cashierIncidentReport in cashierIncidentList)
                            {
                                var incidentReportDeatil = GetCashierIncidentReport(cashierIncidentReport.Key, false, listOfCashierIncidentReport);
                                if (incidentReportDeatil.Amount >= incidentReport.AmountLimit || incidentReportDeatil.OperationCount >= incidentReport.OperationCounter)
                                {
                                    IncidentReportWorkListAC incidentReportWorkListAC = new IncidentReportWorkListAC();
                                    incidentReportWorkListAC.Amount = incidentReportDeatil.Amount;
                                    incidentReportWorkListAC.OperationCount = incidentReportDeatil.OperationCount;
                                    incidentReportWorkListAC.ReachedDateTime = incidentReportDeatil.ReachedDateTime;
                                    incidentReportWorkListAC.BranchName = incidentReportDeatil.BranchName;
                                    incidentReportWorkListAC.BranchId = incidentReportDeatil.BranchId;
                                    incidentReportWorkListAC.ModifiedDate = incidentReportDeatil.ModifiedDate;
                                    incidentReportWorkListAC.CashierId = incidentReportDeatil.CashierId;
                                    incidentReportWorkListAC.CashierName = incidentReportDeatil.CashierName;
                                    List<CashierIncidentReport> checkCashierIncidentReportListCount = listOfCashierIncidentReport.Where(x => x.UserId == cashierIncidentReport.Key && x.IsRefreshRequset == true).OrderByDescending(x => x.CreatedDateTime).ToList();
                                    if (checkCashierIncidentReportListCount.Count > 0)
                                    {
                                        incidentReportWorkListAC.HasChildItem = true;
                                        List<SubIncidentReportWorkListAC> listOfSubIncidentReportWorkListAC = GetSubIncidentReportWorkFlowListAC(checkCashierIncidentReportListCount);
                                        incidentReportWorkListAC.ListOfSubIncidentReportWorkListAC = listOfSubIncidentReportWorkListAC;
                                    }
                                    incidentReportWorkList.Add(incidentReportWorkListAC);
                                }
                            }
                        }
                    }
                    return Ok(incidentReportWorkList);
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
        [Route("getincidentreportdetail")]
        public IHttpActionResult GetIncidentReportDetail(int id)
        {
            try
            {
                CashierIncidentReportAC cashierIncidentReportAC = new CashierIncidentReportAC();
                List<CashierIncidentReport> cashierIncidentReportList = _incidentReportRepository.GetCashierIncidentListByCashierId(id);
                if (cashierIncidentReportList.Any() && cashierIncidentReportList[0] != null)
                {
                    cashierIncidentReportAC.BranchName = cashierIncidentReportList[0].UserDetail.Branch.Name;
                    cashierIncidentReportAC.CashierId = cashierIncidentReportList[0].UserId;
                    cashierIncidentReportAC.Cashier = cashierIncidentReportList[0].UserDetail.UserName;
                    cashierIncidentReportAC.ReachedDate = cashierIncidentReportList[0].CreatedDateTime.Date.ToString("dd-MM-yyyy");
                    cashierIncidentReportAC.ReachedTime = cashierIncidentReportList[0].CreatedDateTime.ToString("hh:mm tt");
                    cashierIncidentReportAC.Status = "";
                    cashierIncidentReportAC.Comment = "";
                }
                return Ok(cashierIncidentReportAC);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for getting Incident Report data by Company Id form POS Application -PS
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        [Route("getincidentreportforposbycompanyid")]
        [HttpGet]
        public IHttpActionResult GetIncidentReportForPosByCompanyId(int companyId)
        {
            try
            {
                List<MerchantService.DomainModel.Models.IncidentReport.IncidentReport> listOfIncidentReport = _incidentReportRepository.GetIncidentReportList(companyId);
                List<IncidentReportAC> listOfIncidentReportAC = new List<IncidentReportAC>();
                foreach (var incidentReportObject in listOfIncidentReport)
                {
                    IncidentReportAC incidentReportAc = new IncidentReportAC();
                    incidentReportAc.AmountLimit = incidentReportObject.AmountLimit;
                    incidentReportAc.Comment = incidentReportObject.Comment;

                    if (incidentReportObject.StartDateTime != null)
                        incidentReportAc.StartDateTime = Convert.ToDateTime(incidentReportObject.StartDateTime);
                    if (incidentReportObject.EndDateTime != null)
                        incidentReportAc.EndDateTime = Convert.ToDateTime(incidentReportObject.EndDateTime);
                    if (incidentReportObject.DurationTypeId != null)
                        incidentReportAc.DurationId = Convert.ToInt32(incidentReportObject.DurationTypeId);

                    incidentReportAc.companyId = incidentReportObject.CompanyId;
                    incidentReportAc.DurationTypeId = incidentReportObject.DurationTypeId != null ? Convert.ToInt32(incidentReportObject.DurationTypeId) : 0;
                    incidentReportAc.OperationCounter = incidentReportObject.OperationCounter;
                    incidentReportAc.Status = incidentReportObject.StatusType != null ? incidentReportObject.StatusType.Name : "";
                    incidentReportAc.Operation = incidentReportObject.ParamTypesForOperationType != null ? incidentReportObject.ParamTypesForOperationType.ValueEn : "";
                    incidentReportAc.OperationTypeId = incidentReportObject.OperationTypeId;
                    listOfIncidentReportAC.Add(incidentReportAc);
                }
                return Ok(listOfIncidentReportAC);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for insert data in CashierIncident Reprot. -PS
        /// </summary>
        /// <param name="cashierIncidentReport"></param>
        /// <returns></returns>
        [Route("insertdataincashierincidnetreport")]
        [HttpPost]
        public IHttpActionResult InsertDataInCashierIncidnetReport(CashierIncidentReport cashierIncidentReport)
        {
            try
            {
                var cashierObject = _incidentReportRepository.InsertDataInCashierIncidnetReport(cashierIncidentReport);
                return Ok(cashierObject);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get cashier incident report by cashier id. -An
        /// </summary>
        /// <param name="cashierId"></param>
        /// <returns></returns>
        [Route("getcashierincidentreportbycashierid")]
        [HttpGet]
        public IHttpActionResult GetCashierIncidentReportByCashierId(int cashierId)
        {
            try
            {
                List<CashierIncidentReport> cashierIncidentReportList = _incidentReportRepository.GetCashierIncidentListByCashierId(cashierId);
                if (cashierIncidentReportList.Any())
                {
                    int operationCount = 0;
                    decimal amountLimit = 0;
                    foreach (var cashierIncident in cashierIncidentReportList)
                    {
                        operationCount = operationCount + cashierIncident.OperationCounter;
                        amountLimit = amountLimit + cashierIncident.AmountLimit;
                    }
                    CashierIncidentReportDetailAC cashierIncidentReportDeatilAC = new CashierIncidentReportDetailAC();
                    cashierIncidentReportDeatilAC.AmountLimit = amountLimit;
                    cashierIncidentReportDeatilAC.OperationCounter = operationCount;
                    cashierIncidentReportDeatilAC.CashierId = cashierId;
                    return Ok(cashierIncidentReportDeatilAC);
                }
                return null;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("updatecashierincidentreportbycashier")]
        [HttpGet]
        public IHttpActionResult UpdateCashierIncidentReportByCashier(int cashierId)
        {
            try
            {
                var cashierIncidentRecordsList = _incidentReportRepository.GetCashierIncidentReportByCashierId(cashierId);
                if (cashierIncidentRecordsList != null && cashierIncidentRecordsList.Any())
                {
                    foreach (var item in cashierIncidentRecordsList)
                    {
                        item.IsRefreshRequset = true;
                        item.IsResetRequest = true;
                        item.ModifiedDateTime = DateTime.UtcNow;
                        _incidentReportRepository.UpdateCashierIncidentReportByCashier(item);
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

                throw;
            }
        }


        [HttpGet]
        [Route("approvebutton")]
        public IHttpActionResult ApproveButton(int id)
        {
            try
            {
                List<CashierIncidentReport> cashierIncidentReportList = _incidentReportRepository.GetCashierIncidentListByCashierId(id);

                if (cashierIncidentReportList.Count > 0 && cashierIncidentReportList[cashierIncidentReportList.Count - 1] != null)
                {
                    var userDetial = _iUserDetailReport.GetUserDetailByUserName(HttpContext.Current.User.Identity.Name);
                    if (userDetial != null)
                    {
                        var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(Convert.ToInt32(cashierIncidentReportList[cashierIncidentReportList.Count - 1].RecordId), "Approve", "Approve BY" + userDetial.RoleName, userDetial, true);
                        if (activityWorkFlow.Id != 0)
                        {
                            foreach (var cashierObje in cashierIncidentReportList)
                            {
                                cashierObje.IsResetRequest = true;
                                cashierObje.IsRefreshRequset = true;
                                cashierObje.ModifiedDateTime = DateTime.UtcNow;
                                _incidentReportRepository.UpdateCashierIncidentReportByCashier(cashierObje);
                            }
                            return Ok(new { result = true });
                        }
                    }
                    return Ok(new { result = "IsNotWorkFlow" });
                }
                return Ok(new { result = false });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("resetincident")]
        public IHttpActionResult ResetIncidnetReport(int cashierId)
        {
            try
            {

                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ManageIncidentReportAC manageIncidentReportAC = new ManageIncidentReportAC();
                    List<CashierIncidentReport> cashierIncidentReportList = _incidentReportRepository.GetCashierIncidentListByCashierId(cashierId);

                    if (cashierIncidentReportList.Count > 0 && cashierIncidentReportList[cashierIncidentReportList.Count - 1] != null)
                    {
                        var userDetial = _iUserDetailReport.GetUserDetailByUserName(HttpContext.Current.User.Identity.Name);
                        if (userDetial != null)
                        {
                            if (cashierIncidentReportList[cashierIncidentReportList.Count - 1].IsResetRequest == true)
                            {
                                var workFlowLog = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(Convert.ToInt32(cashierIncidentReportList[cashierIncidentReportList.Count - 1].RecordId));
                                if (workFlowLog != null)
                                {
                                    if (workFlowLog.WorkFlowDetail.IsApproval && workFlowLog.WorkFlowDetail.IsParentAction && workFlowLog.WorkFlowDetail.AssignedId == userDetial.RoleId)
                                        manageIncidentReportAC.IsApproval = true;
                                    return Ok(new { result = manageIncidentReportAC });
                                }
                            }
                            else
                            {
                                List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.IncidentReportParamenter, userDetial.Branch.CompanyId);
                                if (listOfWorkFlowDetail.Any())
                                {
                                    var activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.InitiatorId == userDetial.RoleId && x.IsParentAction);
                                    if (activityWorkFlow != null)
                                    {
                                        ParentRecord parentRecord = new ParentRecord();
                                        parentRecord.BranchId = cashierIncidentReportList[0].UserDetail.BranchId;
                                        parentRecord.CreatedDateTime = DateTime.UtcNow;
                                        parentRecord.WorkFlowId = activityWorkFlow.Id;
                                        parentRecord.ModificationDate = parentRecord.CreatedDateTime;
                                        parentRecord.InitiationDate = parentRecord.ModificationDate;
                                        parentRecord.ModifiedUserId = userDetial.UserId;
                                        parentRecord.InitiatorId = parentRecord.ModifiedUserId;
                                        parentRecord.InitiationComment = "Reset Incident Report By" + userDetial.RoleName;
                                        int recordId = _iParentRecordsRepository.AddParentRecords(parentRecord);
                                        if (recordId != 0)
                                        {
                                            WorkFlowLog workFLowLogDetail = new WorkFlowLog();
                                            workFLowLogDetail.Action = "Reset Incident Report";
                                            workFLowLogDetail.Stage = (activityWorkFlow.Activity != null ? activityWorkFlow.Activity.Name : "") + " By" + (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "");
                                            workFLowLogDetail.UserId = userDetial.UserId;
                                            workFLowLogDetail.WorkFlowId = activityWorkFlow.Id;
                                            workFLowLogDetail.RoleId = userDetial.RoleId;
                                            workFLowLogDetail.CreatedDateTime = DateTime.UtcNow;
                                            workFLowLogDetail.RecordId = recordId;
                                            workFLowLogDetail.Comments = "Reset Incident Report By" + userDetial.RoleName;
                                            int workFlowId = _iParentRecordsRepository.AddWorkFlowLogs(workFLowLogDetail);
                                            if (workFlowId != 0)
                                            {
                                                foreach (var cashierIncidentReport in cashierIncidentReportList)
                                                {
                                                    cashierIncidentReport.RecordId = recordId;
                                                    cashierIncidentReport.ModifiedDateTime = DateTime.UtcNow;
                                                    if (activityWorkFlow.IsClosed)
                                                    {
                                                        cashierIncidentReport.IsResetRequest = true;
                                                        cashierIncidentReport.IsRefreshRequset = true;
                                                    }
                                                    else
                                                    {
                                                        manageIncidentReportAC.IsApproveByBranchSupervisor = true;
                                                        cashierIncidentReport.IsResetRequest = true;
                                                    }
                                                    _incidentReportRepository.UpdateCashierIncidentReportByCashier(cashierIncidentReport);
                                                }
                                                manageIncidentReportAC.IsAddParentRecord = true;
                                                return Ok(new { result = manageIncidentReportAC });
                                            }
                                        }
                                    }
                                }
                                return Ok(new { result = "IsNotWorkFlow" });
                            }
                        }
                        return Ok(new { result = false });
                    }

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

        #endregion

        #region Private Method(s)

        private IncidentReportWorkListAC GetCashierIncidentReport(int userId, bool isReset, List<CashierIncidentReport> listOfCashierIncidentReport)
        {
            try
            {
                IncidentReportWorkListAC incidentReportWorkListAC = new IncidentReportWorkListAC();
                List<CashierIncidentReport> mainCashierIncidentReport = listOfCashierIncidentReport.Where(x => x.UserId == userId && x.IsRefreshRequset == isReset).OrderByDescending(x => x.CreatedDateTime).ToList();
                decimal mainTotalAmount = 0;
                foreach (var mainItem in mainCashierIncidentReport)
                {
                    mainTotalAmount = mainTotalAmount + mainItem.AmountLimit;
                }
                incidentReportWorkListAC.OperationCount = mainCashierIncidentReport.Count;
                incidentReportWorkListAC.Amount = mainTotalAmount;
                if (mainCashierIncidentReport.Count > 0)
                {
                    if (mainCashierIncidentReport[0].UserDetail != null)
                    {
                        incidentReportWorkListAC.BranchId = Convert.ToInt32(mainCashierIncidentReport[0].UserDetail.BranchId);
                        incidentReportWorkListAC.BranchName = mainCashierIncidentReport[0].UserDetail.Branch != null ? mainCashierIncidentReport[0].UserDetail.Branch.Name : "";
                        incidentReportWorkListAC.CashierName = mainCashierIncidentReport[0].UserDetail.UserName;
                    }
                    incidentReportWorkListAC.ReachedDateTime = mainCashierIncidentReport[0].CreatedDateTime;
                    incidentReportWorkListAC.ModifiedDate = mainCashierIncidentReport[0].ModifiedDateTime;
                    incidentReportWorkListAC.CashierId = userId;
                }

                return incidentReportWorkListAC;
            }
            catch (Exception)
            {

                throw;
            }

        }

        private List<SubIncidentReportWorkListAC> GetSubIncidentReportWorkFlowListAC(List<CashierIncidentReport> cashierIncidentReportList)
        {
            try
            {
                List<SubIncidentReportWorkListAC> listSubIncidentReportWorkList = new List<SubIncidentReportWorkListAC>();
                var groupByModifiedDateCashierIncident = cashierIncidentReportList.GroupBy(x => new DateTime(x.ModifiedDateTime.Value.Year, x.ModifiedDateTime.Value.Month, x.ModifiedDateTime.Value.Day, x.ModifiedDateTime.Value.Hour, x.ModifiedDateTime.Value.Minute, 0));
                foreach (var subCashierIncidentReport in groupByModifiedDateCashierIncident)
                {
                    decimal totalAmount = 0;
                    foreach (var subCashierIncident in subCashierIncidentReport)
                    {
                        totalAmount = totalAmount + subCashierIncident.AmountLimit;
                    }
                    SubIncidentReportWorkListAC subIncidentReportWorkListAC = new SubIncidentReportWorkListAC();
                    subIncidentReportWorkListAC.Amount = totalAmount;
                    if (cashierIncidentReportList[0].UserDetail != null)
                    {
                        subIncidentReportWorkListAC.BranchId = Convert.ToInt32(cashierIncidentReportList[0].UserDetail.BranchId);
                        subIncidentReportWorkListAC.BranchName = cashierIncidentReportList[0].UserDetail.Branch != null ? cashierIncidentReportList[0].UserDetail.Branch.Name : "";
                    }
                    subIncidentReportWorkListAC.OperationCount = subCashierIncidentReport.Count();
                    subIncidentReportWorkListAC.ModifiedDate = subCashierIncidentReport.Key;
                    subIncidentReportWorkListAC.ReachedDateTime = Convert.ToDateTime(subCashierIncidentReport.Key).ToString();
                    subIncidentReportWorkListAC.CashierId = cashierIncidentReportList[0].UserId;
                    subIncidentReportWorkListAC.CashierName = cashierIncidentReportList[0].UserDetail.UserName;
                    if (listSubIncidentReportWorkList.Count <= 4)
                        listSubIncidentReportWorkList.Add(subIncidentReportWorkListAC);
                }
                return listSubIncidentReportWorkList;
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

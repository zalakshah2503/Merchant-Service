using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.ApplicationClasses.Admin.IncidentReport;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.Admin.IncidentReports;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Admin.IncidentReport
{
    //[DynamicAuthorize]
    [RoutePrefix("api/ManageIncident")]
    public class ManageIncidentController : ApiController
    {
        #region Private Variables
        private readonly IErrorLog _errorLog;
        private readonly IManageIncidentReportRepository _incidentReportRepository;
        private readonly IUserDetailRepository _userDetailContext;
        private readonly ICompanyRepository _iCompanyRepository;

        private readonly int companyId;
        #endregion

        #region Constructor
        public ManageIncidentController(IErrorLog errorLog, IManageIncidentReportRepository incidentReportRepository, IUserDetailRepository userDetailContext, ICompanyRepository iCompanyRepository)
        {
            _errorLog = errorLog;
            _iCompanyRepository = iCompanyRepository;
            _userDetailContext = userDetailContext;
            companyId = Convert.ToInt32(HttpContext.Current.Session["CompanyId"]);
            _incidentReportRepository = incidentReportRepository;
        }
        #endregion

        #region Public Method


        [Route("getOprationList")]
        [HttpGet]
        public IHttpActionResult GetOprationList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ParamType> listOfParamType = _incidentReportRepository.GetListOfOpration(53);
                    return Ok(listOfParamType);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("insertIncidentReport")]
        [HttpPost]
        public IHttpActionResult InsertIncidentReport(IncidentReportAC incidentReportAc)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userDetail = _userDetailContext.GetUserDetailByUserName(HttpContext.Current.User.Identity.Name);
                    CompanyDetail companyDetail = _iCompanyRepository.GetCompanyDetailByUserId(userDetail.UserId);
                    if (companyDetail != null)
                    {
                        var incidentReportObject = _incidentReportRepository.GetIncidentReportByCompanyId(companyDetail.Id);
                        if (incidentReportObject == null)
                        {
                            MerchantService.DomainModel.Models.IncidentReport.IncidentReport incidentReport = new MerchantService.DomainModel.Models.IncidentReport.IncidentReport();
                            if (incidentReportAc != null)
                            {
                                incidentReport.AmountLimit = incidentReportAc.AmountLimit;
                                incidentReport.CompanyId = companyId;
                                incidentReport.Comment = incidentReportAc.Comment;
                                if (incidentReportAc.OperationTypeId == 52)
                                {
                                    incidentReport.StartDateTime = incidentReportAc.StartDateTime;
                                    incidentReport.EndDateTime = incidentReportAc.EndDateTime;
                                }
                                incidentReport.OperationCounter = incidentReportAc.OperationCounter;
                                incidentReport.OperationTypeId = incidentReportAc.OperationTypeId;
                                incidentReport.StatusId = 4;
                                incidentReport.CreatedDateTime = DateTime.UtcNow;
                                if (incidentReportAc.DurationId != 0)
                                    incidentReport.DurationTypeId = incidentReportAc.DurationId;

                                _incidentReportRepository.AddIncidentReport(incidentReport);
                                return Ok(new { _isResult = true });
                            }
                        }
                        else
                            return Ok(new { _isResult = "AlreadyExists" });
                    }
                    return Ok(new { _isResult = false });
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("updateIncidentReport")]
        [HttpPost]
        public IHttpActionResult UpdateIncidentReport(IncidentReportAC incidentReportAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var incidentReportObject = _incidentReportRepository.GetIncidentReportById(incidentReportAC.Id);
                    if (incidentReportObject != null)
                    {
                        incidentReportObject.OperationCounter = incidentReportAC.OperationCounter;
                        incidentReportObject.AmountLimit = incidentReportAC.AmountLimit;
                        incidentReportObject.Comment = incidentReportAC.Comment;
                        incidentReportObject.OperationTypeId = incidentReportAC.OperationTypeId;
                        incidentReportObject.DurationTypeId = incidentReportAC.DurationId;

                        if (incidentReportAC.StartDateTime != default(DateTime))
                            incidentReportObject.StartDateTime = incidentReportAC.StartDateTime;

                        if (incidentReportAC.EndDateTime != default(DateTime))
                            incidentReportObject.EndDateTime = incidentReportAC.EndDateTime;

                        _incidentReportRepository.UpdateIncidentReport(incidentReportObject);
                        List<CashierIncidentReport> listOfCashierIncidentReport = _incidentReportRepository.GetListOfCashierIncidentReportByCompanyId(incidentReportObject.CompanyId);
                        foreach (var cashierIncidentReport in listOfCashierIncidentReport)
                        {
                            cashierIncidentReport.IsRefreshRequset = true;
                            cashierIncidentReport.IsResetRequest = true;
                            cashierIncidentReport.ModifiedDateTime = DateTime.UtcNow;
                            _incidentReportRepository.UpdateCashierIncidentReportByCashier(cashierIncidentReport);
                        }
                        return Ok(new { _isResult = true });
                    }
                    return Ok(new { _isResult = false });
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [Route("getIncidentReportList")]
        [HttpGet]
        public IHttpActionResult GetIncidentReportList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userDetail = _userDetailContext.GetUserDetailByUserName(HttpContext.Current.User.Identity.Name);
                    List<IncidentReportAC> listOfIncidentReportAC = new List<IncidentReportAC>();
                    CompanyDetail companyDetail = _iCompanyRepository.GetCompanyDetailByUserId(userDetail.UserId);
                    if (companyDetail != null)
                    {
                        List<MerchantService.DomainModel.Models.IncidentReport.IncidentReport> listOfIncidentReport = _incidentReportRepository.GetIncidentReportList(companyDetail.Id);
                        foreach (var incidentReportObject in listOfIncidentReport)
                        {
                            IncidentReportAC incidentReportAc = new IncidentReportAC();
                            incidentReportAc.OperationTypeId = incidentReportObject.OperationTypeId;
                            if (incidentReportObject.StartDateTime != null)
                            {
                                incidentReportAc.StartDateTime = Convert.ToDateTime(incidentReportObject.StartDateTime);
                                incidentReportAc.StartTime = incidentReportAc.StartDateTime.TimeOfDay;
                            }
                            if (incidentReportObject.EndDateTime != null)
                            {
                                incidentReportAc.EndDateTime = Convert.ToDateTime(incidentReportObject.EndDateTime);
                                incidentReportAc.EndTime = incidentReportAc.EndDateTime.TimeOfDay;
                            }
                            incidentReportAc.Id = incidentReportObject.Id;
                            incidentReportAc.AmountLimit = incidentReportObject.AmountLimit;
                            incidentReportAc.DurationId = incidentReportObject.DurationTypeId != null ? Convert.ToInt32(incidentReportObject.DurationTypeId) : 0;
                            incidentReportAc.Comment = incidentReportObject.Comment;
                            incidentReportAc.OperationCounter = incidentReportObject.OperationCounter;
                            incidentReportAc.Status = incidentReportObject.StatusType != null ? incidentReportObject.StatusType.Name : "";
                            incidentReportAc.Operation = incidentReportObject.ParamTypesForOperationType != null ? incidentReportObject.ParamTypesForOperationType.ValueEn : "";
                            listOfIncidentReportAC.Add(incidentReportAc);
                        }
                    }
                    return Ok(listOfIncidentReportAC);
                }
                else
                    return BadRequest();
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

using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.Repository.ApplicationClasses.IncidentReport;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.IncidentReports;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.ManageIncidentReport
{
    //[DynamicAuthorize]
    [RoutePrefix("api/incidentreport")]
    public class IncidentReportController : BaseController
    {
        #region Private Variables
        private readonly IErrorLog _errorLog;
        private readonly IIncidentReportRepository _incidentReportRepository;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        #endregion

        #region Constructor
        public IncidentReportController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository,
            IIncidentReportRepository incidentReportRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _incidentReportRepository = incidentReportRepository;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
        }
        #endregion

        /// <summary>
        /// this method is used to get all incident report list.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getallincidentreportworklist")]
        public IHttpActionResult GetAllIncidentReportWorkList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var incidentReportCollection = _incidentReportRepository.GetAllIncidentReportWorkList(MerchantContext.UserDetails.BranchId, MerchantContext.Permission.IsAllowToAccessAllBranch);
                    return Ok(incidentReportCollection);
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
        [Route("checkifsimilarincidentexists")]
        public IHttpActionResult CheckIfSimilarIncidentExists(int itemId, int incidentType)
        {
            try
            {
                return Ok(_incidentReportRepository.CheckIfAnyActiveIncidentForBarcode(itemId, incidentType));
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get incident report details by id.
        /// </summary>
        /// <param name="incidentId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getincidentreportdetailsbyid")]
        public IHttpActionResult GetIncidentReportDetailsById(int incidentId)
        {
            try
            {
                var incidentDetails = _incidentReportRepository.GetIncidentReportDetailsById(incidentId, MerchantContext.UserDetails, MerchantContext.Permission.IsAllowToAccessAllBranch);
                return Ok(incidentDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this methos is used to get item details by item id.
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("editinformationbyitemid")]
        public IHttpActionResult EditInformationByItemId(int itemId)
        {
            try
            {
                try
                {
                    if (HttpContext.Current.User.Identity.IsAuthenticated)
                    {
                        var itemProfile = _incidentReportRepository.GetItemProfileByItemId(itemId);
                        return Ok(itemProfile);
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
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to update item details.
        /// </summary>
        /// <param name="itemDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("updateitemdetails")]
        public IHttpActionResult UpdateItemDetails(ItemProfileAC itemDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    int posIncidentReportId = _incidentReportRepository.UpdateItemDetails(itemDetails);
                    return Ok(new { posIncidentReportId = posIncidentReportId });
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
        [Route("CheckAlreadyResetIncidentReportByCompanyId")]
        public IHttpActionResult CheckAlreadyResetIncidentReportByCompanyId(int companyId)
        {
            try
            {
                var reset = true;
                List<CashierIncidentReport> listOfCashierIncidentReport = _incidentReportRepository.getCashierIncidentReportList(companyId);
                if (listOfCashierIncidentReport.Count > 0)
                {
                    foreach (var cashierIncidentReport in listOfCashierIncidentReport)
                    {
                        if (!cashierIncidentReport.IsResetRequest)
                        {
                            reset = false;
                            break;
                        }
                    }
                    return Ok(reset);
                }
                else
                    reset = false;
                return Ok(reset);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// Update CashierIncidnetReport and return primary key. - An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("UpdateIncidentReportByCompanyId")]
        public IHttpActionResult UpdateIncidentReportByCompanyId(int companyId)
        {
            try
            {
                List<CashierIncidentReport> listOfCashierIncidentReport = _incidentReportRepository.getCashierIncidentReportList(companyId);
                if (listOfCashierIncidentReport.Count > 0)
                {
                    foreach (var cashierIncidnetReport in listOfCashierIncidentReport)
                    {
                        cashierIncidnetReport.OperationCounter = 0;
                        cashierIncidnetReport.AmountLimit = 0;
                        cashierIncidnetReport.IsRefreshRequset = true;
                        cashierIncidnetReport.IsResetRequest = true;
                        cashierIncidnetReport.ModifiedDateTime = DateTime.UtcNow;
                        _incidentReportRepository.UpdateCashierIncidentReport(cashierIncidnetReport);
                    }

                    return Ok(true);
                }
                return Ok(false);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for insert data in posIncidentReport.
        /// </summary>
        /// <param name="posIncidentReport"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insertposincidentreport")]
        public IHttpActionResult InsertPosIncidentReport(DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport)
        {
            try
            {
                _incidentReportRepository.InsertPosIncidentReport(posIncidentReport);
                return Ok(posIncidentReport);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getAllIncidentReportWorkListForPOS")]
        public IHttpActionResult GetAllIncidentReportWorkList(int branchId)
        {
            try
            {
                var incidentReportCollection = _incidentReportRepository.GetAllIncidentReportWorkList(branchId, MerchantContext.Permission.IsAllowToAccessAllBranch);
                return Ok(incidentReportCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to submit the incident report.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("submitincidentreport")]
        public IHttpActionResult SubmitIncidentReport(PosIncidentReportAc incidentReportDetails)
        {
            try
            {
                if (MerchantContext.Permission.IsAllowedToInitiateIncidentReport)
                {
                    var incidentReportDetail = _incidentReportRepository.SubmitIncidentReport(incidentReportDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
                    return Ok(new { status = incidentReportDetail });
                }
                else
                {
                    return Ok(new { status = "Not Allow Permission" });
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to review the incident report request by the id.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("reviewincidentreportdetails")]
        public IHttpActionResult ReviewIncidentReportDetails(PosIncidentReportAc incidentReportDetails)
        {
            try
            {
                if (MerchantContext.Permission.IsAllowToReview)
                {
                    if (MerchantContext.Permission.IsAllowRecovery)
                    {
                        _incidentReportRepository.UpdateIncidentReportDetails(incidentReportDetails);
                    }
                    var incidentReportDetail = _incidentReportRepository.ReviewIncidentReportDetails(incidentReportDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails);

                    return Ok(new { status = incidentReportDetail });
                }
                else
                {
                    return Ok(new { status = "Not Allow Permission" });
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to either approve or reject the incident request by the id.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("incidentreportapproveandreject")]
        public IHttpActionResult IncidentReportApproval(PosIncidentReportAc incidentReportDetails)
        {
            try
            {
                if (MerchantContext.Permission.IsAllowToReview)
                {
                    if (incidentReportDetails.RecordId != null && _iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(incidentReportDetails.RecordId), StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                        return Ok(new { status = StringConstants.AlreadyActivityProcessed });
               
                    if (MerchantContext.Permission.IsAllowRecovery && incidentReportDetails.IsStatus)
                    {
                        _incidentReportRepository.UpdateIncidentReportDetails(incidentReportDetails);
                    }
                    var incidentReportDetail = _incidentReportRepository.IncidentReportApproval(incidentReportDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails);

                    return Ok(new { status = incidentReportDetail });
                }
                else
                {
                    return Ok(new { status = "Not Allow Permission" });
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}

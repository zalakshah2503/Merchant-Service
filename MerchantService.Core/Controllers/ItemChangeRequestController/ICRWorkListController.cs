using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.ItemChangeRequest;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.ItemChangeRequestController
{
    //[DynamicAuthorize]
    [RoutePrefix("api/icrworklist")]
    public class ICRWorkListController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly IICRWorkListRepository _icrWorkListContext;
        private readonly IICRRepository _icrContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IDataRepository<IcrDetail> _icrDetailContext;
        #endregion

        #region Constructor
        public ICRWorkListController(IICRRepository icrContext, IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IICRWorkListRepository icrWorkListContext,
            IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IDataRepository<IcrDetail> icrDetailContext)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _icrContext = icrContext;
            _icrWorkListContext = icrWorkListContext;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _icrDetailContext = icrDetailContext;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// this method is used for fetching Item Change Request list. - jj
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        [HttpGet]
        [Route("geticrworklist")]
        public IHttpActionResult GetICRWorkList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToAccessAllBranch)
                    {
                        var workList = _icrWorkListContext.GetICRWorkList();
                        return Ok(workList);
                    }
                    else
                    {
                        if (MerchantContext.UserDetails.Branch != null && (MerchantContext.UserDetails.BranchId != null && MerchantContext.UserDetails.BranchId > 0))
                        {
                            var workList = _icrWorkListContext.GetICRWorkListForParticularBranch(MerchantContext.UserDetails.BranchId);
                            return Ok(workList);
                        }
                        else
                            return null;
                    }
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

        /// <summary>
        /// this method is used for fetching Item Change Request Details. - jj
        /// </summary>
        /// <param name="Id">Id of Icr</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        [HttpGet]
        [Route("geticrdetail")]
        public IHttpActionResult GetICRDetail(int Id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var icrDetail = _icrWorkListContext.GetICRDetail(Id, MerchantContext.UserId);
                    return Ok(icrDetail);
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



        /// <summary>
        /// this method is used for resubmiting Item Change Request Details. - jj
        /// </summary>
        /// <param name="Id">Id of Icr</param>
        /// <returns>return status</returns>
        [HttpGet]
        [Route("resubmiticrdetail")]
        public IHttpActionResult ResubmitICRDetail(int Id, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var icrDetail = _icrWorkListContext.GetICRDetail(Id, MerchantContext.UserId);
                    icrDetail.IsResubmit = true;
                    icrDetail.Comment = Comment;

                    if (_iWorkFlowDetailsRepository.CheckLastActionPerform(icrDetail.ParentRecordId, StringConstants.ReturnAction, MerchantContext.UserDetails.RoleId))
                        return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                    var status = _icrContext.UpdateICR(icrDetail, MerchantContext.UserDetails, MerchantContext.CompanyDetails, icrDetail.ParentRecordId);
                    return Ok(new { status = status });
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


        /// <summary>
        /// This method is used for approve Item Change Request. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="user"> Currently logged in userDetail </param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("approvalicr")]
        public IHttpActionResult ApprovalICR(int recordId, string comment, bool status)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {

                    if (MerchantContext.Permission.IsAllowedToApproveICR || MerchantContext.Permission.IsAllowedToReturnICR)
                    {
                        var icrDetail = _icrDetailContext.FirstOrDefault(x => x.RecordId == recordId);
                        if (icrDetail != null && (icrDetail.IsRejected || _iWorkFlowDetailsRepository.CheckLastActionPerform(recordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId)))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var status1 = _icrWorkListContext.ApprovalICR(comment, recordId, MerchantContext.UserDetails, status, MerchantContext.CompanyDetails);
                        return Ok(new { status = status1 });
                    }
                    else
                    {
                        var status1 = StringConstants.PermissionDenied;
                        return Ok(new { status = status1 });
                    }
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


        /// <summary>
        /// This method is used to review Item Change Request. - JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        /// <param name="RecordId">id of ParentRecord</param>
        /// <param name="Comment"></param>
        /// <returns>null</returns>
        [HttpPut]
        [Route("reviewicr")]
        public IHttpActionResult ReviewICR(ItemChangedDetailsAC itemChangedDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowedToReviewICR)
                    {
                        if (_iWorkFlowDetailsRepository.CheckLastActionPerform(itemChangedDetail.ParentRecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var status = _icrWorkListContext.ReviewICR(itemChangedDetail, MerchantContext.UserDetails, MerchantContext.CompanyDetails, itemChangedDetail.ParentRecordId, itemChangedDetail.Comment);
                        return Ok(new { status = status });
                    }
                    else
                    {
                        var status = StringConstants.PermissionDenied;
                        return Ok(new { status = status });
                    }
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


        /// <summary>
        /// this method is used for rejecting Item Change Request Details. - jj
        /// </summary>
        /// <param name="Id">Id of Icr</param>
        /// <returns>list of object of ItemChangedDetailsAC</returns>
        [HttpGet]
        [Route("rejecticrdetail")]
        public IHttpActionResult RejectICRDetail(int Id, int RecordId, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var icrObject = _icrDetailContext.FirstOrDefault(x => x.Id == Id);
                    if (icrObject != null && (icrObject.IsRejected || _iWorkFlowDetailsRepository.CheckLastActionPerform(RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId)))
                        return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                    var status = _icrWorkListContext.RejectICR(Id, RecordId, Comment, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
                    return Ok(new { status = status });
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

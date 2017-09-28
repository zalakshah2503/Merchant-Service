using MerchantService.Core.Global;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Supplier;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Supplier
{
    //[DynamicAuthorize]
    [RoutePrefix("api/supreturnworklistrequest")]
    public class SupReturnWorkListController : BaseController
    {
        #region "Private Member(s)"
        private readonly IErrorLog _errorLog;
        private readonly ISupReturnWorkListRepository _ISupReturnWorkListRepositoryContext;
        private readonly ISupplierReturnRepository _ISupplierReturnRepositoryContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        #endregion

        #region "Constructor"
        public SupReturnWorkListController(ISupplierReturnRepository ISupplierReturnRepositoryContext, IErrorLog errorLog, ISupReturnWorkListRepository ISupReturnWorkListRepositoryContext,
            IMerchantDataRepository merchantDataRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _ISupReturnWorkListRepositoryContext = ISupReturnWorkListRepositoryContext;
            _ISupplierReturnRepositoryContext = ISupplierReturnRepositoryContext;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// This method is used for fetching supplier return request list from database. - JJ
        /// </summary>   
        /// <returns>list of objects of SupplierReturnRequest</returns>
        [HttpGet]
        [Route("getsupreturnworklist")]
        public IHttpActionResult GetSupReturnWorkList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToAccessAllBranch)
                    {
                        var workList = _ISupReturnWorkListRepositoryContext.GetSupReturnWorkList(MerchantContext.CompanyDetails.Id, true, 0);
                        return Ok(workList);
                    }
                    else
                    {
                        var workList = _ISupReturnWorkListRepositoryContext.GetSupReturnWorkList(MerchantContext.CompanyDetails.Id, false, MerchantContext.UserDetails.BranchId);
                        return Ok(workList);
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
        /// This method is used for approving/returning supplier return request list from database. - JJ
        /// </summary>   
        /// <returns>list of objects of SupplierReturnRequest</returns>
        [HttpGet]
        [Route("approvesupplierreturn")]
        public IHttpActionResult ApproveSupplierReturn(int RecordId, string Comment, bool status, int SupplierReturnId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if ((MerchantContext.Permission.IsAllowToApproveSupplierReturnRequest && status) || (!status && MerchantContext.Permission.IsAllowToReturnSupplierReturnRequest))
                    {
                        var supplierReturnRequest = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(SupplierReturnId);
                        if (supplierReturnRequest != null && (supplierReturnRequest.IsRejected || _iWorkFlowDetailsRepository.CheckLastActionPerform(RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId)))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var approvalStatus = _ISupReturnWorkListRepositoryContext.ApprovalSupplierReturn(Comment, RecordId, MerchantContext.UserDetails, status, SupplierReturnId, MerchantContext.CompanyDetails);
                        return Ok(new { status = approvalStatus });
                    }
                    else
                    {
                        var permissionStatus = StringConstants.PermissionDenied;
                        return Ok(new { status = permissionStatus });
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
        /// this method is used for resubmiting Supplier Return Request Details. - jj
        /// </summary>
        /// <param name="Id">Id of Supplier Return Request</param>
        /// <param name="Comment">Comment of the user</param>
        /// <returns>return status</returns>
        [HttpGet]
        [Route("resubmitsupreturnrequest")]
        public IHttpActionResult ResubmitSupReturnRequest(int Id, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var supplierReturnRequest = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(Id);
                    if (supplierReturnRequest != null && (supplierReturnRequest.IsRejected || supplierReturnRequest.IsDeleted || _iWorkFlowDetailsRepository.CheckLastActionPerform(supplierReturnRequest.RecordId, StringConstants.ReturnAction, MerchantContext.UserDetails.RoleId)))
                        return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                    var supReturnDetail = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(Id);
                    supReturnDetail.IsResubmit = true;
                    supReturnDetail.Comment = Comment;
                    var status = _ISupplierReturnRepositoryContext.UpdateSupplierReturnRequest(supReturnDetail, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
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
        /// This method is used for approving/returning supplier return request list from database. - JJ
        /// </summary>   
        /// <returns>list of objects of SupplierReturnRequest</returns>
        [HttpGet]
        [Route("printsupplierreturn")]
        public IHttpActionResult PrintSupplierReturn(string Comment, int SupplierReturnId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var printDetails = _ISupReturnWorkListRepositoryContext.PrintReceipt(Comment, SupplierReturnId, MerchantContext.UserDetails.FullName);
                    return Ok(printDetails);
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
        /// This method is used for fetching supplier return request from database. - JJ
        /// </summary>          
        /// <returns>object of SupplierReturnRequest</returns>
        [HttpGet]
        [Route("getsupreturnrequest")]
        public IHttpActionResult GetSupReturnRequest(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var request = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(id);
                    return Ok(request);
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
        /// This method is used for rejecting supplier return request. - JJ
        /// </summary>          
        /// <param name="id">Id of SupplierReturnDetail</param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("rejectsupreturnrequest")]
        public IHttpActionResult RejectSupReturnRequest(int id, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToRejectSupplierReturnRequest)
                    {
                        var supplierReturnRequest = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(id);
                        if (supplierReturnRequest != null && (supplierReturnRequest.IsRejected || _iWorkFlowDetailsRepository.CheckLastActionPerform(supplierReturnRequest.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId)))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var status = _ISupReturnWorkListRepositoryContext.RejectSupplierReturn(id, MerchantContext.UserDetails.Id, Comment);
                        return Ok(new { status = status });
                    }
                    else
                    {
                        var permissionStatus = StringConstants.PermissionDenied;
                        return Ok(new { status = permissionStatus });
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
        /// This method is used for rejecting supplier return request. - JJ
        /// </summary>          
        /// <param name="id">Id of SupplierReturnDetail</param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("deletesupreturnrequest")]
        public IHttpActionResult DeleteSupReturnRequest(int id, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToDeleteSupplierReturnRequest)
                    {
                        var supplierReturnRequest = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(id);
                        if (supplierReturnRequest != null && (supplierReturnRequest.IsDeleted || supplierReturnRequest.IsRejected || _iWorkFlowDetailsRepository.CheckLastActionPerform(supplierReturnRequest.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId)))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var status = _ISupReturnWorkListRepositoryContext.DeleteSupplierReturn(id, HttpContext.Current.User.Identity.Name, Comment);
                        return Ok(new { status = status });
                    }
                    else
                    {
                        var permissionStatus = StringConstants.PermissionDenied;
                        return Ok(new { status = permissionStatus });
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


        #endregion
    }
}

using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses.Supplier;
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
    [RoutePrefix("api/supplierreturnrequest")]
    public class SupplierReturnRequestController : BaseController
    {
        #region "Private Member(s)"
        private readonly IErrorLog _errorLog;
        private readonly ISupplierReturnRepository _ISupplierReturnRepositoryContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly ISupReturnWorkListRepository _ISupReturnWorkListRepositoryContext;
        #endregion

        #region "Constructor"
        public SupplierReturnRequestController(IErrorLog errorLog, ISupplierReturnRepository ISupplierReturnRepositoryContext, 
            IMerchantDataRepository merchantDataRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, ISupReturnWorkListRepository ISupReturnWorkListRepositoryContext)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _ISupplierReturnRepositoryContext = ISupplierReturnRepositoryContext;
            _iWorkFlowDetailsRepository =iWorkFlowDetailsRepository;
            _ISupReturnWorkListRepositoryContext = ISupReturnWorkListRepositoryContext;
    }
        #endregion

        #region "Public Method(s)"
        /// <summary>
        /// this method is used for saving Supplier Return Request.- JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">object of SupplierReturnRequest</param>
        /// <returns>void</returns>
        [HttpPost]
        [Route("savesupplierreturnrequest")]
        public IHttpActionResult SaveSupplierReturnRequest(SupplierReturnRequest SupplierReturnRequest)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToInitiateSupplierReturnRequest)
                    {
                        var supplierReturnRequest = _ISupplierReturnRepositoryContext.SaveSupplierReturnRequest(SupplierReturnRequest, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
                        return Ok(supplierReturnRequest);
                    }
                    else
                    {
                        SupplierReturnRequest.Status = StringConstants.PermissionDenied;
                        return Ok(SupplierReturnRequest);
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
        /// this method is used for saving Supplier Return Request.- JJ
        /// </summary>
        /// <param name="SupplierReturnRequest">object of SupplierReturnRequest</param>
        /// <returns>void</returns>
        [HttpPut]
        [Route("updatesupplierreturnrequest")]
        public IHttpActionResult UpdateSupplierReturnRequest(SupplierReturnRequest SupplierReturnRequest)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToEditSupplierReturnRequest)
                    {
                        var supplierReturnRequest = _ISupReturnWorkListRepositoryContext.GetSupReturnRequest(SupplierReturnRequest.SupplierReturnId);
                        if (supplierReturnRequest != null && (supplierReturnRequest.IsRejected || supplierReturnRequest.IsDeleted ||_iWorkFlowDetailsRepository.CheckLastActionPerform(supplierReturnRequest.RecordId, StringConstants.ReturnAction, MerchantContext.UserDetails.RoleId)))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var status = _ISupplierReturnRepositoryContext.UpdateSupplierReturnRequest(SupplierReturnRequest, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
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
        /// this method is used for fetching ItemList list.- JJ
        /// </summary>
        /// <returns>list of object of ItemProfile</returns>
        [HttpGet]
        [Route("getitemlist")]
        public IHttpActionResult GetItemList(int BranchId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var itemList = _ISupplierReturnRepositoryContext.GetItemList(MerchantContext.CompanyDetails, BranchId);
                    return Ok(itemList);
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

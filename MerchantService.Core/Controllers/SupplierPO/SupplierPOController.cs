using MerchantService.Core.Global;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.SupplierPO;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.SupplierPO
{
    //[DynamicAuthorize]
    [RoutePrefix("api/supplierpo")]
    public class SupplierPOController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ISupplierPORepository _supplierPOContext;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListContext;
        private readonly IBranchRepository _branchContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPurchaseOrderContext;
        private readonly int companyId;
        #endregion

        #region Constructor
        public SupplierPOController(IErrorLog errorLog, ISupplierPOWorkListRepository supplierPOWorkListContext, IBranchRepository branchContext, ISupplierPORepository supplierPOContext, IDataRepository<UserDetail> userDetailContext, IMerchantDataRepository merchantDataRepository,
            IDataRepository<RolePermission> rolePermissionContext, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IDataRepository<SupplierPurchaseOrder> supplierPurchaseOrderContext)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _supplierPOContext = supplierPOContext;
            _userDetailContext = userDetailContext;
            _branchContext = branchContext;
            _supplierPOWorkListContext = supplierPOWorkListContext;
            companyId = MerchantContext.CompanyDetails.Id;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _supplierPurchaseOrderContext = supplierPurchaseOrderContext;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method is used for getting the logged in user's role and  fetching the branch list accordingly- JJ
        /// </summary>           
        /// <returns>branch List</returns>
        [HttpGet]
        [Route("getbranchlist")]
        public IHttpActionResult GetBranchList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var branchList = _branchContext.GetBranchList(userName, companyId);
                    return Ok(branchList);
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
        /// This method is used for fetching supplier item list from database. - JJ
        /// </summary>   
        /// <param name="SupplierId">id of supplier</param>
        /// <param name="BranchId">id of BRANCH</param>
        /// <returns>list of objects of SupplierItemAC</returns>
        [HttpGet]
        [Route("getitemlist")]
        public IHttpActionResult GetItemList(int SupplierId, int BranchId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var itemList = _supplierPOContext.GetSupplierItemList(SupplierId, userName);
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

        /// <summary>
        /// This method is used for insert new supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="supplierProfile"> object of SupplierPOAC</param>
        /// <returns>null</returns>
        [HttpPost]
        [Route("savesupplierpo")]
        public IHttpActionResult SaveSupplierPO(SupplierPOAC supplierPO)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                if (MerchantContext.Permission.IsAllowToCreateSupplierPurchaseOrder)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var status = _supplierPOContext.SaveSupplierPO(supplierPO, userName, MerchantContext.CompanyDetails);
                    return Ok(new { status = status });
                }
                else
                    return null;
            }
            else
                return BadRequest();
        }

        /// <summary>
        /// This method is used for fetch supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="id">id of spo</param>
        /// <returns>object of SupplierPOAC</returns>
        [HttpGet]
        [Route("getspo")]
        public IHttpActionResult GetSupplierPO(int id)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                var spo = _supplierPOContext.GetSupplierPO(id);
                if (spo != null)
                {
                    spo.SupplierItem = _supplierPOWorkListContext.GetSupplierPOItemList(id, spo.PurchaseOrderNumber);
                }
                return Ok(spo);
            }
            else
                return BadRequest();
        }

        /// <summary>
        /// This method is used to update spo - JJ
        /// </summary>
        /// <param name="supplierPO">object of SupplierPOAC</param>
        /// <returns>null</returns>
        [Route("updatespo")]
        [HttpPut]
        public IHttpActionResult UpdateSPO(SupplierPOAC supplierPO)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToEditSupplierPurchaseOrder)
                    {
                        if (_iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(supplierPO.ParentRecordId), StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var userName = HttpContext.Current.User.Identity.Name;
                        _supplierPOContext.UpdateSPO(supplierPO, userName);
                        return Ok();
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
        /// This method is used for submitting already saved supplier purchase order. - JJ
        /// </summary>
        /// <param name="SupplierPOId">Id of SupplierPO </param>
        /// <param name="Comment">Comment of the initiator</param>
        /// <returns>status</returns>
        [Route("submitspo")]
        [HttpPut]
        public IHttpActionResult SubmitSPO(int SupplierPOId, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToCreateSupplierPurchaseOrder)
                    {
                        var userName = HttpContext.Current.User.Identity.Name;
                        var status = _supplierPOContext.SubmitSupplierPO(SupplierPOId, Comment, userName, MerchantContext.CompanyDetails);
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
        /// This method is used to delete spo - JJ
        /// </summary>
        /// <param name="id">id of spo</param>
        /// <returns>status</returns>
        [Route("deletespo")]
        [HttpPut]
        public IHttpActionResult DeleteSPO(int Id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToDeleteSupplierPurchaseOrder)
                    {
                        var status = _supplierPOContext.DeleteSupplierPO(Id, MerchantContext.UserDetails);
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
        /// This method is used to resubmit spo - JJ
        /// </summary>
        /// <param name="supplierPO">object of SupplierPOAC</param>
        /// <returns>null</returns>
        [Route("resubmitpo")]
        [HttpGet]
        public IHttpActionResult ResubmitSPO(int POId, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToResubmitSupplierPurchaseOrder)
                    {
                        var spo = _supplierPurchaseOrderContext.Fetch(x => x.Id == POId).ToList().LastOrDefault();
                        if (spo != null && _iWorkFlowDetailsRepository.CheckLastActionPerform(Convert.ToInt32(spo.RecordId), StringConstants.Rejected, MerchantContext.UserDetails.RoleId))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var status = _supplierPOContext.ResubmitSPO(POId, Comment, MerchantContext.UserDetails);
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
        /// this method is used for fetching current user details(branch)
        /// </summary>
        /// <returns>current user details</returns>
        [Route("getuserbranch")]
        [HttpGet]
        public IHttpActionResult GetUserBranch()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var currentUser = _userDetailContext.First(x => x.UserName == userName);
                    var branchName = currentUser.Branch.Name;
                    return Ok(new { branchName = branchName, branchId = currentUser.BranchId });
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

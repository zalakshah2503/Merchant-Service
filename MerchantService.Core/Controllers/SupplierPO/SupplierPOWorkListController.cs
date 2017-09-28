using MerchantService.Core.Global;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.SupplierPO;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Text;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.SupplierPO
{
    //[DynamicAuthorize]
    [RoutePrefix("api/supplierpoworklist")]
    public class SupplierPOWorkListController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPOContext;
        #endregion

        #region Constructor
        public SupplierPOWorkListController(IErrorLog errorLog, IDataRepository<UserDetail> userDetailContext, ISupplierPOWorkListRepository supplierPOWorkListContext, IMerchantDataRepository merchantDataRepository,
            IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IDataRepository<SupplierPurchaseOrder> supplierPOContext)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _userDetailContext = userDetailContext;
            _supplierPOWorkListContext = supplierPOWorkListContext;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _supplierPOContext = supplierPOContext;
        }
        #endregion

        #region public methods
        /// <summary>
        /// This method is used for fetching supplier purchase order list from database. - JJ
        /// </summary>   
        /// <param name="username">username of currently logged in user</param>
        /// <returns>list of objects of SupplierPOWorkListAC</returns>
        [HttpGet]
        [Route("getsupplierpoworklist")]
        public IHttpActionResult GetSupplierPOWorkList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    if (MerchantContext.Permission.IsAllowToCreateSupplierPurchaseOrderForOtherBranch || MerchantContext.Permission.IsAllowToAccessAllBranch)
                    {
                        var workList = _supplierPOWorkListContext.GetSupplierPOWorkList(userName, true);
                        return Ok(workList);
                    }
                    else
                    {
                        var workList = _supplierPOWorkListContext.GetSupplierPOWorkList(userName, false);
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
        /// This method is used for review supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        [HttpGet]
        [Route("reviewspo")]
        public IHttpActionResult ReviewSPO(string Comment, int RecordId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReviewSupplierPurchaseOrder)
                    {
                        var status = _supplierPOWorkListContext.ReviewSupplierPO(Comment, RecordId, MerchantContext.UserDetails);
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
        /// This method is used for fetching supplier purchase order list from database. - JJ
        /// </summary>   
        /// <param name="username">username of currently logged in user</param>
        /// <returns>list of objects of SupplierPOWorkListAC</returns>
        [HttpGet]
        [Route("getcurrentuserdetail")]
        public IHttpActionResult GetCurrentUserDetail()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    var rolename = _userDetailContext.FirstOrDefault(x => x.UserName == userName).RoleName;
                    var userId = MerchantContext.UserDetails.Id;
                    return Ok(new { rolename = rolename, userId = userId });
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
        /// This method is used for fetching supplier list from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>list of objects of SupplierItemAC</returns>
        [HttpGet]
        [Route("getsupplierpo")]
        public IHttpActionResult GetSupplierPO(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var spo = _supplierPOWorkListContext.GetSupplierPO(id);
                    return Ok(spo);
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
        /// This method is used for approve supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("approvesupplierpo")]
        public IHttpActionResult ApproveSupplierPO(string Comment, int RecordId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToApprovalSupplierPurchaseOrder)
                    {
                        if (_iWorkFlowDetailsRepository.CheckLastActionPerform(RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var userName = HttpContext.Current.User.Identity.Name;
                        var status = _supplierPOWorkListContext.ApproveSupplierPO(Comment, RecordId, userName);
                        return Ok(new { status = status });
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
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
        /// This method is used for approve supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("sendsupplierpo")]
        public IHttpActionResult SendSupplierPO(string Comment, int RecordId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToSendSupplierPurchaseOrder)
                    {
                        var purchaseOrder = _supplierPOContext.FirstOrDefault(x => x.RecordId == RecordId);
                        if (purchaseOrder != null && purchaseOrder.IsSend)
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var user = MerchantContext.UserDetails;
                        var spoReceipt = _supplierPOWorkListContext.PrintSPOReceipt(Comment, RecordId, user.RoleId, user.RoleName, user.UserName);
                        if (spoReceipt != null)
                        {
                            spoReceipt.EmailSendtoSupplier = false;
                            if (spoReceipt.SupplierEmail != null)
                                spoReceipt.EmailSendtoSupplier = SendEmailToSupplier(spoReceipt);
                        }
                        return Ok(new { spoReceipt = spoReceipt });
                    }
                    else
                        return null;
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


        public bool SendEmailToSupplier(SPOReceipt spoReceipt)
        {
            string subject = "Purchase Order Receipt";
            string path = HttpContext.Current.Server.MapPath(@"\Templates\Supplier\SupplierEmailTemplate.html");
            string items;
            StringBuilder stringBuilder = new StringBuilder();
            foreach (var item in spoReceipt.SupplierItem)
            {
                stringBuilder.Append("<tr><td style=\"text-align:center;padding:10px\">" + item.ItemNameEn + "</td><td style=\"text-align:center;padding:10px\">" + item.FlavourEn + "</td><td style=\"text-align:center\">" + item.Type + "</td><td style=\"text-align:center\">" + item.OrderCostPrice + "</td><td style=\"text-align:center\">" + item.OrderQuantity + "</td></tr>");
            }
            items = stringBuilder.ToString();
            string finalTemplate = System.IO.File.ReadAllText(path);
            finalTemplate = finalTemplate.Replace("${BranchName}$", spoReceipt.BranchName)
                .Replace("${BranchAddress}$", spoReceipt.BranchAddress)
                .Replace("${SupplierName}$", spoReceipt.SupplierName)
                .Replace("${MobileNo}$", spoReceipt.MobileNo)
                .Replace("${IssueDate}$", "" + spoReceipt.IssueDate)
                .Replace("${DueDate}$", "" + spoReceipt.DueDate)
                .Replace("${SPONumber}$", spoReceipt.SPONumber)
                .Replace("${POType}$", spoReceipt.POType)
             .Replace("${items}$", items);
            if (EmailConfig.SendEmail(spoReceipt.SupplierEmail, subject, finalTemplate))
                return true;
            else
                return false;
        }


        /// <summary>
        /// This method is used for reject supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the rejector</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("rejectsupplierpo")]
        public IHttpActionResult RejectSupplierPO(string Comment, int RecordId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToRejectSupplierPurchaseOrder)
                    {
                        if (_iWorkFlowDetailsRepository.CheckLastActionPerform(RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                            return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var userName = HttpContext.Current.User.Identity.Name;
                        var status = _supplierPOWorkListContext.RejectSupplierPO(Comment, RecordId, userName);
                        return Ok(new { status = status });
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
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
        /// This method is used for cancel supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the person who cancels</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("cancelsupplierpo")]
        public IHttpActionResult CancelSupplierPO(string Comment, int RecordId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToCancelSupplierPurchaseOrder)
                    {
                        //if (_iWorkFlowDetailsRepository.CheckLastActionPerform(RecordId, StringConstants.Rejected, MerchantContext.UserDetails.RoleId))
                        //    return Ok(new { status = StringConstants.AlreadyActivityProcessed });

                        var userName = HttpContext.Current.User.Identity.Name;
                        var status = _supplierPOWorkListContext.CancelSupplierPO(Comment, RecordId, userName);
                        return Ok(new { status = status });
                    }
                    else
                        return null;
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

        /// <summary>
        /// This method is used for cancel supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the person who approves cancel</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("approvecancelsupplierpo")]
        public IHttpActionResult ApproveCancelSupplierPO(string Comment, int RecordId, int Status)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    _supplierPOWorkListContext.ApproveCancelSupplierPO(Comment, RecordId, userName, Status);
                    return Ok();
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

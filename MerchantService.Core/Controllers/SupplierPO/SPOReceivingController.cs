using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.SupplierPO;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.SupplierPO
{
    //[DynamicAuthorize]
    [RoutePrefix("api/sporeceiving")]
    public class SPOReceivingController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ISPOReceivingRepository _spoReceivingContext;
        #endregion

        #region Constructor
        public SPOReceivingController(IErrorLog errorLog, ISPOReceivingRepository spoReceivingContext, IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _spoReceivingContext = spoReceivingContext;
        }
        #endregion

        #region Public Method


        /// <summary>
        /// This method is used for fetch SPO Receiving Details from database. - JJ
        /// </summary>
        /// <param name="id"> id of SPO</param>
        /// <returns>object of SPOReceivingAC</returns>
        [HttpGet]
        [Route("getsupplierporeceiving")]
        public IHttpActionResult GetSupplierPOReceiving(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var spoReceiving = _spoReceivingContext.GetSupplierPO(id);
                    return Ok(spoReceiving);
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
        /// This method is used for verifying bill. - JJ
        /// </summary>
        /// <param name="id"> id of bill</param>
        /// <returns>status</returns>
        [HttpGet]
        [Route("verifybill")]
        public IHttpActionResult VerifyBill(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var status = _spoReceivingContext.VerifyBill(id);
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
        /// This method is used for verifying Supplier Purchase Order - JJ
        /// </summary>
        /// <param name="id"> id of Supplier Purchase Order</param>
        /// <returns>status</returns>
        [HttpGet]
        [Route("verifyspo")]
        public IHttpActionResult VerifySPO(int id, string Comment)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var user = MerchantContext.UserDetails;
                    var status = _spoReceivingContext.VerifySPO(id, user.RoleName, Comment, user.UserName);
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
        /// This method is used for insert new SPO bill in database. - JJ
        /// </summary>
        /// <param name="SPOReceivingAC"> object of SPOReceivingAC</param>
        /// <returns>status</returns>
        [HttpPost]
        [Route("savespobill")]
        public IHttpActionResult SaveSPOBillItem(SPOReceivingAC SPOReceivingAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var status = _spoReceivingContext.SaveSupplierPOBill(SPOReceivingAC);
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
        /// This method is used for insert new SPO bill in database. - JJ
        /// </summary>
        /// <param name="SPOReceivingAC"> object of SPOReceivingAC</param>
        /// <returns>status</returns>
        [HttpPost]
        [Route("addbill")]
        public IHttpActionResult AddBill(SPOReceivingBillAC poSupplierBill)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var Id = _spoReceivingContext.AddSupplierBill(poSupplierBill, poSupplierBill.PurchaseOrderId);
                    return Ok(new { Id = Id });
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
        /// This method is used for adding individual supplier purchase order bill. - JJ
        /// </summary>   
        /// <param name="BillID">ID OF Bill</param>
        /// <returns>status</returns>
        [HttpGet]
        [Route("deletespobill")]
        public IHttpActionResult DeleteBill(int BillId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var status = _spoReceivingContext.DeletePOSupplierBill(BillId);
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
        /// This method is used for receive an item of SPO - JJ
        /// </summary>
        /// <param name="SupplierItemAC">object of SupplierItemAC</param>
        /// <returns>null</returns>
        [HttpPost]
        [Route("receivespoitem")]
        public IHttpActionResult ReceiveSPOItem(SupplierItemAC SupplierItemAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var status = _spoReceivingContext.ReceiveSPOItem(SupplierItemAC, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
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
        /// This method is used for receive an item of SPO - JJ
        /// </summary>
        /// <param name="SupplierItemAC">object of SPOReceivingAC</param>
        /// <returns>null</returns>
        [HttpPost]
        [Route("endreceiving")]
        public IHttpActionResult EndReceive(SPOReceivingAC SPOReceivingAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var user = MerchantContext.UserDetails;
                    var status = _spoReceivingContext.EndReceiving(SPOReceivingAC, user.RoleName, user.UserName);
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
        /// This method is used for fetch SPO Receiving Details from database. - JJ
        /// </summary>
        /// <param name="supplierPOBill"> object of SPOReceivingAC</param>
        /// <returns>null</returns>
        [HttpGet]
        [Route("getsupplierpobill")]
        public IHttpActionResult GetSupplierPOBill(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToVerifySupplierPurchaseOrder)
                    {
                        var spoBill = _spoReceivingContext.GetSPOBill(id);
                        return Ok(spoBill);
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

        [HttpGet]
        [Route("getreceivingpurchasorderlist")]
        public IHttpActionResult GetReceivingPurchaseOrderListById(int purchaseOrderId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ReceivingPurchaseOrderAC receivingPurchaseOrderAC = new ReceivingPurchaseOrderAC();
                    receivingPurchaseOrderAC = _spoReceivingContext.GetListOfPurchaseOrderItem(purchaseOrderId);
                    return Ok(receivingPurchaseOrderAC);
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
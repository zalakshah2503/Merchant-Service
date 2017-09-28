using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses.InternalTransferGoods;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.InternalTransferGoods;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.InternalTransferGoods
{
    //[DynamicAuthorize]
    [RoutePrefix("api/internaltransfergoods")]
    public class InternalTransferGoodsController : BaseController
    {
        private readonly IErrorLog _errorLog;
        private readonly IInternalTransferGoodsRepository _internalTransferGoodsRepository;

        public InternalTransferGoodsController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository,
            IInternalTransferGoodsRepository internalTransferGoodsRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _internalTransferGoodsRepository = internalTransferGoodsRepository;
        }
        

        /// <summary>
        /// this method is used to get branch list.
        /// </summary>
        /// <returns></returns>
        [Route("branch")]
        [HttpGet]
        public IHttpActionResult GetAllBranchList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var transferGoodsCollection =
                        _internalTransferGoodsRepository.GetAllBranchList(MerchantContext.UserDetails.BranchId, MerchantContext.CompanyDetails.Id);
                    return Ok(transferGoodsCollection);
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
        /// this method is used to get all request type
        /// </summary>
        /// <returns></returns>
        [Route("getallrequesttype")]
        [HttpGet]
        public IHttpActionResult GetAllRequestType()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    const int paramId = 59;
                    var inventoryColletion = _internalTransferGoodsRepository.GetAllRequestType(paramId);
                    return Ok(inventoryColletion);
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
        /// this method is used to get item list by the branch id.
        /// </summary>
        /// <param name="branchId"></param>
        /// <returns></returns>
        [Route("getitemlistbyid")]
        [HttpGet]
        public IHttpActionResult GetItemListById(int branchId)
        {
            try
            {
                var itemCollection = _internalTransferGoodsRepository.GetItemListById(branchId);
                return Ok(itemCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get  item details by the item barcode.
        /// </summary>
        /// <param name="barcode"></param>
        /// <param name="targetBranchId"></param>
        /// <param name="requestTypeId"></param>
        /// <returns></returns>
        [Route("getitemdetailsbyitembarcode")]
        [HttpGet]
        public IHttpActionResult GetItemDetailsByItemBarcode(string barcode, int targetBranchId, int requestTypeId)
        {
            try
            {
                var itemDetails = _internalTransferGoodsRepository.GetItemDetailsByItemBarcode(barcode, targetBranchId, requestTypeId, MerchantContext.UserDetails.BranchId);
                if (itemDetails != null)
                    return Ok(itemDetails);
                else
                    return Ok(new { IsResultNull = true });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to save interanal transfer goods details.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <returns></returns>
        [Route("submitinventorytranserrequest")]
        [HttpPost]
        public IHttpActionResult SubmitInventoryTranserRequest(InventoryTransferAc transferGoodsDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToInitiateIntrenalTransferGood)
                    {
                        var inventoryDetails = _internalTransferGoodsRepository.SubmitInventoryTranserRequest(transferGoodsDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
                        return Ok(new { status = inventoryDetails });
                    }
                    else
                        return Ok(new { status = "Not Allow Permission" });
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
        /// this method is used to get list of transfer good details.
        /// </summary>
        /// <returns></returns>
        [Route("getallinventorytransferlist")]
        [HttpGet]
        public IHttpActionResult GetAllInventoryTransferList()
        {
            try
            {
                var transferInventoryCollection = _internalTransferGoodsRepository.GetAllInventoryTransferList(MerchantContext.UserDetails.BranchId, MerchantContext.Permission.IsAllowToAccessAllBranch);
                return Ok(transferInventoryCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to view transfer good details by Id.
        /// </summary>
        /// <param name="inventoryTransferId"></param>
        /// <returns></returns>
        [Route("viewinternaltransfergooddetailsbyid")]
        [HttpGet]
        public IHttpActionResult ViewInternalTransferGoodDetailsById(int inventoryTransferId)
        {
            try
            {
                var transferGoodDetails = _internalTransferGoodsRepository.ViewInternalTransferGoodDetailsById(inventoryTransferId, MerchantContext.UserDetails, MerchantContext.Permission.IsAllowToReslovedUnmatchedItem, MerchantContext.Permission.IsAllowToAccessAllBranch, MerchantContext.Permission.IsAllowToReceiveIntranalTransferGood);
                return Ok(transferGoodDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for either approve or reject transfer good request.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("transferinventoryapprovalbyid")]
        public IHttpActionResult TransferInventoryApprovalById(InventoryTransferAc transferGoodsDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        var inventoryDetails = _internalTransferGoodsRepository.TransferInventoryApprovalById(transferGoodsDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails, MerchantContext.Permission.IsAllowToReslovedUnmatchedItem);
                        return Ok(new { status = inventoryDetails });
                    }
                    else
                        return Ok(new { status = "Not Allow Permission" });
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
        /// this method is used to review transfer good request.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("reviewtransferinventorybyid")]
        public IHttpActionResult ReviewTransferInventoryById(InventoryTransferAc transferGoodsDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        var inventoryDetails = _internalTransferGoodsRepository.ReviewTransferInventoryById(transferGoodsDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails, MerchantContext.Permission.IsAllowToReslovedUnmatchedItem);
                        return Ok(new { status = inventoryDetails });
                    }
                    else
                        return Ok(new { status = "Not Allow Permission" });
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
        /// this method is used to re-submit issue stock inventory.
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("resubmittransferinventory")]
        public IHttpActionResult ReSubmitTransferInventory(InventoryTransferAc transferGoodsDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        var inventoryDetails = _internalTransferGoodsRepository.ReSubmitTransferInventory(transferGoodsDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails, MerchantContext.Permission.IsAllowToInitiateIntrenalTransferGood, MerchantContext.Permission.IsAllowToReceiveIntranalTransferGood);
                        return Ok(new { status = inventoryDetails });
                    }
                    else
                        return Ok(new { status = "Not Allow Permission" });
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
        /// this method is used to receive transfer good details. 
        /// </summary>
        /// <param name="transferGoodsDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("receivetransferinventorybyid")]
        public IHttpActionResult ReceiveTransferInventoryById(InventoryTransferAc transferGoodsDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToInitiateIntrenalTransferGood)
                    {
                        var inventoryDetails = _internalTransferGoodsRepository.ReceiveTransferInventoryById(transferGoodsDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails);

                        return Ok(new { status = inventoryDetails });
                    }
                    else
                        return Ok(new { status = "Not Allow Permission" });
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
        /// this method is used to print transfer good details.
        /// </summary>
        /// <param name="inventoryTransferId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("printtransfergoodreceipt")]
        public IHttpActionResult PrintTransferGoodReceipt(int inventoryTransferId)
        {
            try
            {
                var transferGoodsDetails = _internalTransferGoodsRepository.PrintTransferGoodReceipt(inventoryTransferId);
                return Ok(transferGoodsDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}


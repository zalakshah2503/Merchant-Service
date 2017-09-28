using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses.Inventory;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Inventory;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Inventory
{
    //[DynamicAuthorize]
    [RoutePrefix("api/inventory")]
    public class InventoryController : BaseController
    {
        #region Private Variables

        private readonly IErrorLog _errorLog;
        private readonly IInventoryRepository _inventoryRepository;

        #endregion
        public InventoryController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IInventoryRepository inventoryRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _inventoryRepository = inventoryRepository;
        }

        /// <summary>
        /// this method is used to get all inventory types.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getallinvetorytype")]
        public IHttpActionResult GetAllInvetoryTypeList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    const int paramId = 30;
                    var inventoryColletion = _inventoryRepository.GetAllInvetoryTypeList(paramId);
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
        /// this method is used to get all gategory list.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getallcategorylist")]
        public IHttpActionResult GetAllCateGoryList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var categoryCollection = _inventoryRepository.GetAllCateGoryList(MerchantContext.CompanyDetails.Id);
                    return Ok(categoryCollection);
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
        /// this method is used to get all supplier list.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getallsupplierlist")]
        public IHttpActionResult GetAllSupplierList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var supplierCollection = _inventoryRepository.GetAllSupplierList(MerchantContext.CompanyDetails.Id);
                    return Ok(supplierCollection);
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
        /// this method is used to submit issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("submitissuestockinventory")]
        public IHttpActionResult SubmitIssueStockInventory(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var issueInventory = _inventoryRepository.SubmitIssueStockInventory(issueInventoryDetails, MerchantContext.CompanyDetails);
                    return Ok(issueInventory);
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
        /// this method is used to submit issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("submitstockinventory")]
        public IHttpActionResult SubmitStockInventory(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    _inventoryRepository.SubmitStockInventory(issueInventoryDetails, MerchantContext.CompanyDetails);
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


        /// <summary>
        /// this method is used to submit muliple branch issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("submitconflictbranchissueinventory")]
        public IHttpActionResult SubmitConflictBranchIssueInventory(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var inventoryInfo = _inventoryRepository.SubmitConflictBranchIssueInventory(issueInventoryDetails, MerchantContext.CompanyDetails);
                    return Ok(inventoryInfo);
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
        /// this method is used to get all inventory list.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getallinventorylist")]
        public IHttpActionResult GetAllInventoryList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var inventoryCollection =
                         _inventoryRepository.GetAllInventoryList(MerchantContext.UserDetails.BranchId, MerchantContext.Permission.IsAllowToAccessAllBranch);
                    return Ok(inventoryCollection);
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
        /// this method is used to get all recorder list.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getallinventoryrecorderlist")]
        public IHttpActionResult GetAllInventoryRecorderList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowInventoryRecord)
                    {
                        var inventoryCollection = _inventoryRepository.GetAllInventoryRecorderList(MerchantContext.UserDetails.BranchId, MerchantContext.Permission.IsAllowToAccessAllBranch);
                        return Ok(inventoryCollection);
                    }
                    else
                        return BadRequest();
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
        /// this method is used to delete issue stock inventory request.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("deleteissuestockinventorybyid")]
        public IHttpActionResult DeleteIssueStockInventoryById(int issueInventoryId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    _inventoryRepository.DeleteIssueStockInventoryById(issueInventoryId);
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


        /// <summary>
        /// this method is used to view the inventory monitor details by the Id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("viewissuestockinventorymoniterdetailsbyid")]
        public IHttpActionResult ViewIssueStockInventoryMoniterDetailsById(int issueInventoryId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var inventoryDetails = _inventoryRepository.ViewIssueStockInventoryMoniterDetailsById(issueInventoryId);
                    return Ok(inventoryDetails);
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
        /// this method is used to start issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("startissuestockinventory")]
        public IHttpActionResult StartIssueStockInventory(int issueInventoryId)
        {
            try
            {
                _inventoryRepository.StartIssueStockInventory(issueInventoryId);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get iventory record details by id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getinventoryrecorderdetailsbyid")]
        public IHttpActionResult GetInventoryRecorderDetailsById(int issueInventoryId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowInventoryRecord)
                    {
                        var issueInventoryDetails = _inventoryRepository.GetInventoryRecorderDetailsById(issueInventoryId);
                        if (issueInventoryDetails != null)
                            return Ok(issueInventoryDetails);
                        else
                            return Ok(new { IsNullResult = true });
                    }
                    else
                        return BadRequest();
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
        /// this method is used to get item list by the inventory Id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemlistbyissueinventoryid")]
        public IHttpActionResult GetItemListByIssueInventoryId(int issueInventoryId)
        {
            try
            {
                var issueInventoryDetails = _inventoryRepository.GetItemListByIssueInventoryId(issueInventoryId, (int)MerchantContext.UserDetails.CompanyId);
                return Ok(issueInventoryDetails);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get item details by the item barcode.
        /// </summary>
        /// <param name="issueStockInventoryId"></param>
        /// <param name="barcode"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemdetailsbyitembarcode")]
        public IHttpActionResult GetItemDetailsByItemBarcode(int issueStockInventoryId, string barcode)
        {
            try
            {
                var itemDetails = _inventoryRepository.GetItemDetailsByItemBarcode(barcode, issueStockInventoryId);
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
        /// this method is used to add issue inventory recored details.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("addissueinventoryrecorddetails")]
        public IHttpActionResult AddIssueInventoryRecordDetails(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var inventoryRecordDetails = _inventoryRepository.AddIssueInventoryRecordDetails(issueInventoryDetails, MerchantContext.UserDetails.Id, MerchantContext.CompanyDetails);
                    return Ok(inventoryRecordDetails);
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
        /// this method is used to submit issue stock inventory.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("submitissuestockinventorydetails")]
        public IHttpActionResult SubmitIssueStockInventoryDetails(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowReviewStockInventory)
                    {
                        var inventoryDetails = _inventoryRepository.SubmitIssueStockInventoryDetails(issueInventoryDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails);
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
        /// this method is used to view issue stock inventory details by Id.
        /// </summary>
        /// <param name="issueInventoryId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("viewissuestockinventorydetailsbyid")]
        public IHttpActionResult ViewIssueStockInventoryDetailsById(int issueInventoryId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var inventoryDetails = _inventoryRepository.ViewIssueStockInventoryDetailsById(issueInventoryId, MerchantContext.UserDetails, MerchantContext.Permission.IsAllowUnmatchedItemRecover);
                    return Ok(inventoryDetails);
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
        /// this method is used for either approve or reject issue stock inventory details.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("issuestockinventoryapprovalbyid")]
        public IHttpActionResult IssueStockInventoryApprovalById(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        var inventoryDetails = _inventoryRepository.IssueStockInventoryApprovalById(issueInventoryDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails, MerchantContext.Permission.IsAllowUnmatchedItemRecover);
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
        /// this method is used to review issue stock inventory request by Id.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("reviewissuestockinventorybyid")]
        public IHttpActionResult ReviewIssueStockInventoryById(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        var inventoryDetails = _inventoryRepository.ReviewIssueStockInventoryById(issueInventoryDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails, MerchantContext.Permission.IsAllowUnmatchedItemRecover);
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
        /// this method is used to get item details.
        /// </summary>
        /// <param name="paramId"></param>
        /// <param name="detailsId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemdetailsbyid/{paramId}/{detailsId}")]
        public IHttpActionResult GetItemDetailsById(int paramId, int detailsId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var itemDetails = _inventoryRepository.GetItemDetailsById(paramId, detailsId, MerchantContext.UserDetails.CompanyId);
                    return Ok(itemDetails);
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
        /// this method is used to resubmit the issue stock inventory request.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("resubmitissuestockinventory")]
        public IHttpActionResult ReSubmitIssueStockInventory(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview || MerchantContext.Permission.IsAllowReviewStockInventory)
                    {
                        var inventoryDetails = _inventoryRepository.ReSubmitIssueStockInventory(issueInventoryDetails, MerchantContext.UserDetails, MerchantContext.CompanyDetails, MerchantContext.Permission.IsAllowUnmatchedItemRecover);
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
        /// this method is used to update issue stock inventory date.
        /// </summary>
        /// <param name="issueInventoryDetails"></param>
        /// <returns></returns>
        [Route("updateissueinventorydate")]
        [HttpPut]
        public IHttpActionResult UpdateIssueInventoryDate(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                var issueInventory = _inventoryRepository.UpdateIssueInventoryDate(issueInventoryDetails);
                return Ok(new { status = issueInventory });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [Route("updateissuestockinventorydate")]
        [HttpPut]
        public IHttpActionResult UpdateIssueStockInventoryDate(IssueInventoryAc issueInventoryDetails)
        {
            try
            {
                _inventoryRepository.UpdateStockIssueInventoryDate(issueInventoryDetails);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        ///  this method is used to get unmatched item list.
        /// </summary>
        /// <param name="issueStockInventoryId"></param>
        /// <returns></returns>
        [Route("getunmatcheditemlistbyid")]
        [HttpGet]
        public IHttpActionResult GetUnmatchedItemListById(int issueStockInventoryId)
        {
            try
            {
                var unmatchedItemCollection = _inventoryRepository.GetUnmatchedItemListById(issueStockInventoryId, MerchantContext.UserDetails);
                return Ok(unmatchedItemCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to re-record item details.
        /// </summary>
        /// <param name="issueInventoryUnmatchedItem"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("rerecordselecteditemdetails")]
        public IHttpActionResult ReRecordSelectedItemDetails(IssueInventoryUnmatchedItemAc issueInventoryUnmatchedItem)
        {
            try
            {
                _inventoryRepository.ReRecordSelectedItemDetails(issueInventoryUnmatchedItem);
                return Ok(issueInventoryUnmatchedItem);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}

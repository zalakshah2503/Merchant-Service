using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.ApplicationClasses.Sales;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.POS;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.POS
{
    [RoutePrefix("api/returnbill")]
    public class ReturnBillController : BaseController
    {
        private readonly IErrorLog _errorLog;
        private readonly IReturnBillRepository _iReturnBillRepository;
        private readonly IItemRepository _iItemRepository;
        private readonly ICompanyRepository _iCompanyRepository;

        public ReturnBillController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, IReturnBillRepository iReturnBillRepository, IItemRepository iItemRepository, ICompanyRepository iCompanyRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _iReturnBillRepository = iReturnBillRepository;
            _iCompanyRepository = iCompanyRepository;
            _iItemRepository = iItemRepository;
        }


        /// <summary>
        /// This method used for get return bill detial by id. -An
        /// </summary>
        /// <param name="billNumber"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getreturnbilldetailbyid")]
        public IHttpActionResult GetReturnBillDetailById(string billNumber)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    POSBill posBill = _iReturnBillRepository.GetPOSBillByBillNumber(billNumber, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    return GetReturnBill(posBill);
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
        /// This method used for get bill detail by billNumber and branchId. -An
        /// </summary>
        /// <param name="billNumber"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("billdetailbybillnumberbybranch")]
        public IHttpActionResult BillDetailByBillNumberByBranch(string billNumber, int branchId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    POSBill posBill = _iReturnBillRepository.GetPOSBillByBillNumber(billNumber, branchId);
                    return GetReturnBill(posBill);
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
        [Route("getreturnbilldetail")]
        public IHttpActionResult GetReturnBillDetail()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<POSReturnBillListAC> listOfPOSReturnBillListAC = new List<POSReturnBillListAC>();
                    if (MerchantContext.UserDetails.BranchId != null)
                    {
                        List<POSReturnBill> listOfPOSReturnBill = _iReturnBillRepository.GetListOfPOSReturnBillByBranchId(Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                        if (listOfPOSReturnBill.Any())
                        {
                            foreach (var posReturnBill in listOfPOSReturnBill)
                            {
                                POSReturnBillListAC posReturnBillAC = new POSReturnBillListAC();

                                posReturnBillAC.Cash = posReturnBill.ReturnedCash;
                                posReturnBillAC.IsProcessed = posReturnBill.IsProcessed;
                                posReturnBillAC.IssueAt = posReturnBill.BranchDetail.Name;
                                posReturnBillAC.ProcessAt = posReturnBill.ProcessingBranch.Name;
                                posReturnBillAC.ProcessingDate = posReturnBill.ProcessingDate;
                                posReturnBillAC.Processor = posReturnBill.ProcesessorUser.UserName;
                                posReturnBillAC.ReturnBillNumber = posReturnBill.ReturnedBillNo;
                                posReturnBillAC.CustomerName = posReturnBill.POSBill.Customer.Name;
                                posReturnBillAC.MembershipNumber = posReturnBill.POSBill.Customer.MembershipCode;
                                posReturnBillAC.ReturnBy = posReturnBill.UserDetail.UserName;
                                posReturnBillAC.ReturningDate = posReturnBill.ReturningDate;
                                posReturnBillAC.IsDeleted = posReturnBill.IsDeleted;
                                listOfPOSReturnBillListAC.Add(posReturnBillAC);
                            }
                        }
                    }
                    return Ok(listOfPOSReturnBillListAC);
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
        [Route("deletereturnbill")]
        public IHttpActionResult DeleteRetunrBillItem(string billNumber)
        {
            try
            {
                var returnBill = _iReturnBillRepository.GetPosReturnBillDataByReturnBillNo(billNumber);
                if (returnBill != null)
                {
                    if (!returnBill.IsProcessed)
                    {
                        returnBill.IsDeleted = true;
                        if (_iReturnBillRepository.UpdatePosReturnBillForPOs(returnBill))
                        {
                            var returnBillItemList = _iReturnBillRepository.GetListOfPOSReturnBillItemByReturnBillId(returnBill.Id);
                            if (returnBillItemList.Any())
                            {
                                foreach (var returnBillItem in returnBillItemList)
                                {
                                    returnBillItem.IsDeleted = true;
                                    _iReturnBillRepository.UpdatePosReturnBillItem(returnBillItem);
                                    ItemQuantity itemQuantity = _iItemRepository.GetItemQunatityByBranchIdAndItemId(returnBillItem.POSBillItem.ItemID, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                                    if (itemQuantity != null)
                                    {
                                        itemQuantity.ActualQuantity = (itemQuantity.ActualQuantity - returnBillItem.ReturnedQuantity);
                                        _iItemRepository.UpdateItemQunatity(itemQuantity);
                                    }
                                }
                                return Ok(new { isResult = true });
                            }
                        }
                    }
                    return Ok(new { isResult = StringConstants.ReturnBillPaymentAlreadyDone });
                }
                return Ok(new { isResult = false });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getposbilllist")]
        public IHttpActionResult GetPOSBillDeatilList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ReturnBillAC> listOfReturnBillAC = new List<ReturnBillAC>();
                    if (MerchantContext.UserDetails.BranchId != null)
                    {
                        listOfReturnBillAC = GetReturnBillList(Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    }
                    return Ok(listOfReturnBillAC);
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
        [Route("posbilllistbybranchid")]
        public IHttpActionResult GetPOSBillDeatilListByBranchId(int branchId)
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                List<ReturnBillAC> listOfReturnBillAC = new List<ReturnBillAC>();
                if (MerchantContext.UserDetails.BranchId != null)
                {
                    listOfReturnBillAC = GetReturnBillList(branchId);
                }
                return Ok(listOfReturnBillAC);
            }
            else
            {
                return BadRequest();
            }
        }


        /// <summary>
        /// This method used for submit pos bill. -An
        /// </summary>
        /// <param name="posReturnBillAC"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("submitposbill")]
        public IHttpActionResult SubmitPOSBill(POSReturnBillAC posReturnBillAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (posReturnBillAC != null)
                    {
                        int branchId;
                        if (posReturnBillAC.BranchId != 0)
                            branchId = posReturnBillAC.BranchId;
                        else
                            branchId = Convert.ToInt32(MerchantContext.UserDetails.BranchId);

                        POSReturnBill posReturnBill = new POSReturnBill();
                        posReturnBill.CreatedDateTime = DateTime.UtcNow;
                        posReturnBill.IsProcessed = false;
                        posReturnBill.IssuingBranchID = Convert.ToInt32(MerchantContext.UserDetails.BranchId);
                        posReturnBill.POSBillId = posReturnBillAC.POSBillId;
                        posReturnBill.ProcessingBranchID = branchId;
                        posReturnBill.ProcessingDate = posReturnBill.CreatedDateTime;
                        posReturnBill.ProcessorID = MerchantContext.UserDetails.Id;
                        posReturnBill.ReturneBy = posReturnBill.ProcessorID;
                        posReturnBill.ReturnedBillNo = GetReturnBillNumber(posReturnBillAC.ReturnBillNumber);
                        posReturnBill.ReturnedCash = posReturnBillAC.ReturnCashAmount;
                        posReturnBill.ReturningComments = posReturnBillAC.Comment;
                        posReturnBill.ReturningDate = posReturnBill.ProcessingDate;
                        posReturnBill.ReturningType = Convert.ToInt32(POSBillPaymentType.Cash);
                        posReturnBill.SubstituteItemsAmount = posReturnBillAC.ReturnSubtituteItemsAmount;
                        int posReturnBillId = _iReturnBillRepository.AddPOSReturnBill(posReturnBill);
                        if (posReturnBillId != 0)
                        {
                            if (posReturnBillAC.ReturnBillItemList.Any())
                            {
                                foreach (var returnBillItem in posReturnBillAC.ReturnBillItemList) //this foreach used for add pos return bill item.
                                {
                                    if (returnBillItem.ReturnQunatity > 0)
                                    {
                                        POSReturnBillItem posReturnBillItem = new POSReturnBillItem();
                                        posReturnBillItem.CreatedDateTime = DateTime.UtcNow;
                                        posReturnBillItem.POSBiillItemID = returnBillItem.POSBillItemId;
                                        posReturnBillItem.ReturnedBillID = posReturnBillId;
                                        posReturnBillItem.ReturnedQuantity = returnBillItem.ReturnQunatity;
                                        int id = _iReturnBillRepository.AddPOSReturnBillItem(posReturnBillItem);
                                        if (id != 0)
                                        {
                                            POSReturnBillItem returnPOSRetunBillItem = _iReturnBillRepository.GetPOSReturnBillItemById(id);
                                            if (returnPOSRetunBillItem != null)//this for maintain branch item qunatity,when client return quantity add quantity item in actual quantity.
                                            {
                                                var posBillItem = _iReturnBillRepository.GetPOSBillItemById(returnPOSRetunBillItem.POSBiillItemID);
                                                ItemProfile itemProfile = _iItemRepository.GetItemProfileObjectById(posBillItem.ItemID);
                                                ItemQuantity itemQuantity = new ItemQuantity();
                                                if (itemProfile != null)
                                                {
                                                    if (itemProfile.IsParentItem)
                                                    {
                                                        itemQuantity = _iItemRepository.GetItemQunatityByBranchIdAndItemId(posBillItem.ItemID, branchId);
                                                        if (itemQuantity != null)
                                                            itemQuantity.ActualQuantity = (itemQuantity.ActualQuantity + returnBillItem.ReturnQunatity);
                                                    }
                                                    else // for sub item
                                                    {
                                                        itemQuantity = _iItemRepository.GetItemQunatityByBranchIdAndItemId(Convert.ToInt32(itemProfile.ParentItemId), branchId);
                                                        if (itemQuantity != null)
                                                        {
                                                            int systemQuantity = itemQuantity.ActualQuantity + (itemProfile.BaseUnit * returnBillItem.ReturnQunatity);
                                                            itemQuantity.ActualQuantity = systemQuantity > 0 ? systemQuantity : 0;
                                                        }
                                                    }
                                                    _iItemRepository.UpdateItemQunatity(itemQuantity);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return Ok(new { isResult = posReturnBill.ReturnedBillNo });
                        }
                    }
                    return Ok(new { isResult = false });
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
        /// This method used for Get Return Bill List By Bill Number. -An
        /// </summary>
        /// <param name="billNumber"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getreturnbilllistbybillnumber")]
        public IHttpActionResult GetReturnBillListByBillNumber(string billNumber)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<POSReturnBillListAC> listOfPOSReturnBillListAC = new List<POSReturnBillListAC>();
                    if (MerchantContext.UserDetails.BranchId != null)
                    {
                        POSBill posBill = _iReturnBillRepository.GetPOSBillByBillNumber(billNumber, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                        if (posBill != null)
                        {
                            List<POSReturnBill> listOfPOSReturnBill = _iReturnBillRepository.GetListOfPOSReturnBillByPOSBillId(posBill.Id);
                            if (listOfPOSReturnBill.Any())
                            {
                                foreach (var posReturnBill in listOfPOSReturnBill)
                                {
                                    POSReturnBillListAC posReturnBillAC = new POSReturnBillListAC();
                                    posReturnBillAC.Cash = posReturnBill.ReturnedCash;
                                    posReturnBillAC.IsProcessed = posReturnBill.IsProcessed;
                                    posReturnBillAC.IssueAt = posReturnBill.BranchDetail.Name;
                                    posReturnBillAC.ProcessAt = posReturnBill.ProcessingBranch.Name;
                                    posReturnBillAC.ProcessingDate = posReturnBill.ProcessingDate;
                                    posReturnBillAC.Processor = posReturnBill.ProcesessorUser.UserName;
                                    posReturnBillAC.ReturnBillNumber = posReturnBill.ReturnedBillNo;
                                    posReturnBillAC.ReturnBy = posReturnBill.UserDetail.UserName;
                                    posReturnBillAC.ReturningDate = posReturnBill.ReturningDate;
                                    posReturnBillAC.IsDeleted = posReturnBill.IsDeleted;
                                    posReturnBillAC.SubstituteItemsAmount = posReturnBill.SubstituteItemsAmount;
                                    listOfPOSReturnBillListAC.Add(posReturnBillAC);
                                }
                            }
                        }
                    }
                    return Ok(listOfPOSReturnBillListAC);
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
        /// This method is used for getting retunr bill object by returnbill no. -PS
        /// </summary>
        /// <param name="billNo"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getposreturnbilldatabyreturnbillno")]
        public IHttpActionResult GetPosReturnBillDataByReturnBillNo(string billNo)
        {
            try
            {
                var returnBillObj = _iReturnBillRepository.GetPosReturnBillDataByReturnBillNo(billNo);
                return Ok(returnBillObj);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used for update PosReturnBil table after cashier process. -PS
        /// </summary>
        /// <param name="?"></param>
        /// <returns> object of POSReturnBill</returns>
        [HttpPost]
        [Route("updateposreturnbillforpos")]
        public IHttpActionResult UpdatePosReturnBillForPOs(POSReturnBill posReturnBill)
        {
            try
            {
                var result = _iReturnBillRepository.UpdatePosReturnBillForPOs(posReturnBill);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("checkallowtoanotherbranch")]
        public IHttpActionResult CheckAllowToAnotherBranch()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var companyDetails = _iCompanyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    if (companyDetails != null)
                    {
                        if (companyDetails.ReturnItem)
                            return Ok(new { isResult = MerchantContext.UserDetails.BranchId });
                        else
                            return Ok(new { isResult = 0 });
                    }
                    else
                        return Ok(new { isResult = false });
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
        [Route("getreturnbillreceipt")]
        public IHttpActionResult GetReturnBillReceipt(string returnBillNumber)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ReturnBillReceiptAC returnBillReceiptAC = new ReturnBillReceiptAC();
                    POSReturnBill posReturnBill = new POSReturnBill();
                    posReturnBill = _iReturnBillRepository.GetPOSReturnBillByReturnBillNumber(returnBillNumber);
                    if (posReturnBill != null)
                    {
                        returnBillReceiptAC.Date = posReturnBill.ReturningDate.ToString("dd-MM-yyyy hh:mm");
                        returnBillReceiptAC.InvoiceNo = posReturnBill.POSBill.BillNo;
                        returnBillReceiptAC.Invoice = InvoiceToHtml.get39(posReturnBill.POSBill.BillNo, 1.5, 20);
                        returnBillReceiptAC.MemberShipNumber = posReturnBill.POSBill.Customer.MembershipCode;
                        returnBillReceiptAC.ReturnInvoiceNumber = posReturnBill.ReturnedBillNo;

                        List<ReturnBillList> returnBillList = new List<ReturnBillList>();
                        List<POSReturnBillItem> listOfPOSBillItem = new List<POSReturnBillItem>();
                        listOfPOSBillItem = _iReturnBillRepository.GetListOfPOSReturnBillItemByReturnBillId(posReturnBill.Id);
                        decimal totalQunatity = 0;
                        decimal totalPrice = 0;
                        foreach (var posBill in listOfPOSBillItem)
                        {
                            ReturnBillList listOfReturnBill = new ReturnBillList();
                            listOfReturnBill.ItemName = posBill.POSBillItem.ItemProfile.ItemNameEn;
                            listOfReturnBill.ItemNameArebic = posBill.POSBillItem.ItemProfile.ItemNameSl;
                            listOfReturnBill.Price = posBill.POSBillItem.SellPrice;
                            listOfReturnBill.ReturnQuantity = posBill.ReturnedQuantity;
                            listOfReturnBill.Total = (listOfReturnBill.Price * listOfReturnBill.ReturnQuantity);
                            returnBillList.Add(listOfReturnBill);
                            totalQunatity = totalQunatity + listOfReturnBill.ReturnQuantity;
                            totalPrice = totalPrice + listOfReturnBill.Total;
                        }
                        returnBillReceiptAC.TotalQuantity = totalQunatity;
                        returnBillReceiptAC.ReturnAmount = posReturnBill.ReturnedCash;
                        returnBillReceiptAC.ReturnSubtituteAmount = posReturnBill.SubstituteItemsAmount;
                        returnBillReceiptAC.CompanyName = posReturnBill.BranchDetail.Name;
                        returnBillReceiptAC.CompanyAddress = posReturnBill.BranchDetail.Address;

                        returnBillReceiptAC.ListOfReturnBillList = returnBillList;
                    }
                    return Ok(new { isResult = returnBillReceiptAC });
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


        #region Private Method


        /// <summary>
        /// Used to fetch list of return bills
        /// </summary>
        /// <param name="branchId"></param>
        /// <returns></returns>
        private List<ReturnBillAC> GetReturnBillList(int branchId)
        {
            List<ReturnBillAC> listOfReturnBillAC = new List<ReturnBillAC>();
            List<POSBill> listOfPOSBill = _iReturnBillRepository.GetPOSBillListByBranchId(branchId);
            if (listOfPOSBill.Any())
            {
                foreach (var posBill in listOfPOSBill)
                {
                    ReturnBillAC returnBillAC = new ReturnBillAC();
                    returnBillAC.BillId = posBill.Id;
                    returnBillAC.BillNumber = posBill.BillNo;
                    returnBillAC.Amount = posBill.TotalAmount;
                    returnBillAC.BillDate = posBill.BillDate.Date;
                    returnBillAC.Branch = posBill.BranchDetail.Name;
                    returnBillAC.BranchId = posBill.BranchID;
                    returnBillAC.CashierName = posBill.UserDetail.UserName;
                    returnBillAC.CustomerNumber = posBill.Customer.MembershipCode;
                    listOfReturnBillAC.Add(returnBillAC);
                }
            }
            return listOfReturnBillAC;
        }


        /// <summary>
        /// Used to fetch ReturnBill
        /// </summary>
        /// <param name="posBill"></param>
        /// <returns></returns>
        private IHttpActionResult GetReturnBill(POSBill posBill)
        {
            ReturnBillDetailAc returnBillDetailAC;
            if (posBill != null)
            {
                CompanyConfiguration companyConfiguration = _iCompanyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                if (companyConfiguration?.ValidNumberOfDaysForReturnItem != null)
                {
                    DateTime allowDate = posBill.BillDate.AddDays(Convert.ToInt32(companyConfiguration.ValidNumberOfDaysForReturnItem));
                    if (DateTime.UtcNow <= allowDate)
                    {
                        returnBillDetailAC = GetReturnBillDetailAC(posBill);
                        return Ok(new { isResult = returnBillDetailAC });
                    }
                    else
                        return Ok(new { isResult = companyConfiguration.ValidNumberOfDaysForReturnItem });
                }
                return Ok(new { isResult = false });
            }
            return Ok(new { isResult = "NotExists" });
        }


        /// <summary>
        /// This method used for get ReturnBillDetailAC. -An
        /// </summary>
        /// <param name="posBill"></param>
        /// <returns></returns>
        private ReturnBillDetailAc GetReturnBillDetailAC(POSBill posBill)
        {
            try
            {
                ReturnBillDetailAc returnBillDetailAC = new ReturnBillDetailAc();
                List<ReturnBillAC> listOfReturnBillAC = new List<ReturnBillAC>();
                ReturnBillAC retunBillAC = new ReturnBillAC();
                retunBillAC.Amount = posBill.TotalAmount;
                retunBillAC.BillDate = posBill.BillDate;
                retunBillAC.BillId = posBill.Id;
                retunBillAC.BillNumber = posBill.BillNo;
                retunBillAC.Branch = posBill.BranchDetail.Name;
                retunBillAC.CashierName = posBill.UserDetail.UserName;
                retunBillAC.CustomerName = posBill.Customer.Name;
                listOfReturnBillAC.Add(retunBillAC);
                returnBillDetailAC.ReturnBillList = listOfReturnBillAC;
                List<POSBillItem> listOfPOSBillItem = _iReturnBillRepository.GetPOSBillItemListByBillId(posBill.Id);
                if (listOfPOSBillItem.Any())
                {
                    List<RetunrBillItemListAC> listOfRetunrBillItemListAC = new List<RetunrBillItemListAC>();
                    foreach (var posBillItem in listOfPOSBillItem)
                    {
                        RetunrBillItemListAC retunrBillItemListAC = new RetunrBillItemListAC();
                        retunrBillItemListAC.BarCode = posBillItem.ItemProfile.Barcode;
                        retunrBillItemListAC.POSBillItemId = posBillItem.Id;
                        retunrBillItemListAC.BillQunatity = posBillItem.Quantity;
                        retunrBillItemListAC.Flavour = posBillItem.ItemProfile.FlavourEn;
                        retunrBillItemListAC.Name = posBillItem.ItemProfile.ItemNameEn;
                        retunrBillItemListAC.ReturnBillItem = posBillItem.ReturnedQuantity;
                        retunrBillItemListAC.SellPrice = posBillItem.SellPrice;
                        retunrBillItemListAC.Unit = posBillItem.ItemProfile.SystemParameter.ValueEn;
                        retunrBillItemListAC.ReturnQunatity = 0;

                        //this is used for check totale return qunatity
                        List<POSReturnBillItem> listOfPOSReturnBillItem = _iReturnBillRepository.GetListOfPOSRetunBillItemByPOSBillItemId(posBillItem.Id);
                        if (listOfPOSReturnBillItem.Count > 0)
                        {
                            int totalQunatity = 0;
                            foreach (var posRetunrBillItem in listOfPOSReturnBillItem)
                            {
                                totalQunatity = totalQunatity + posRetunrBillItem.ReturnedQuantity;
                            }
                            retunrBillItemListAC.ReturnedQunatity = totalQunatity;
                        }
                        listOfRetunrBillItemListAC.Add(retunrBillItemListAC);
                    }
                    returnBillDetailAC.ReturnBillItemList = listOfRetunrBillItemListAC;
                }
                List<POSBillPayment> listOfPOSBillPayment = _iReturnBillRepository.GetPOSBillPaymentListByBillId(posBill.Id);
                if (listOfPOSBillPayment.Any())
                {
                    List<ReturnBillPaymentTypeListAC> listOfReturnBillPaymentTypeListAC = new List<ReturnBillPaymentTypeListAC>();
                    foreach (var posBillPayment in listOfPOSBillPayment)
                    {
                        ReturnBillPaymentTypeListAC posBillPaymentAC = new ReturnBillPaymentTypeListAC();
                        posBillPaymentAC.BankTransactionNumber = posBillPayment.BankPOSTransNo;
                        posBillPaymentAC.PaymentType = posBillPayment.ParamType.ValueEn;
                        posBillPaymentAC.PaymentId = posBillPayment.Id;
                        if (posBillPaymentAC.PaymentType == "Cash")//when payment type is cash so check how much amount retunr by cashier to customer.
                        {
                            decimal amt = _iReturnBillRepository.GetCustomerPayTotalAmount(posBill.Id);
                            if (amt != posBill.TotalAmount)
                                posBillPaymentAC.Amount = posBillPayment.Amount - (amt - posBill.TotalAmount);
                            else
                                posBillPaymentAC.Amount = posBillPayment.Amount;
                        }
                        else
                            posBillPaymentAC.Amount = posBillPayment.Amount;
                        listOfReturnBillPaymentTypeListAC.Add(posBillPaymentAC);
                    }
                    returnBillDetailAC.ReturnBillPaymentTypeList = listOfReturnBillPaymentTypeListAC;
                }

                return returnBillDetailAC;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// Genrate return bill number. -An
        /// </summary>
        /// <param name="returnBillNumber">pass pos bill number</param>
        /// <returns></returns>
        private string GetReturnBillNumber(string billNumber)
        {
            try
            {
                CompanyConfiguration companyConfiguration = _iCompanyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                if (companyConfiguration != null && MerchantContext.UserDetails.BranchId != null)
                {
                    POSBill posBill = _iReturnBillRepository.GetPOSBillByBillNumber(billNumber, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    if (posBill != null)
                    {
                        List<POSReturnBill> listOfPOSReturnBill = _iReturnBillRepository.GetListOfPOSRetunBill();
                        if (listOfPOSReturnBill.Any())
                        {
                            //genrate return bill numnber.
                            string newReturnNumber = ((billNumber) + (listOfPOSReturnBill.Count() + 1).ToString());
                            return companyConfiguration.ReturnInvoiceNo + newReturnNumber;
                        }
                        else
                        {
                            return companyConfiguration.ReturnInvoiceNo + "" + billNumber + "" + 1;
                        }
                    }
                }
                return string.Empty;
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

using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using MerchantService.Repository.Modules.CustomerPO;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.CustomerPO
{
    //[DynamicAuthorize]
    [RoutePrefix("api/customerpoworklist")]
    public class CustomerPOWorkListController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ICustomerPOWorkListRepository _customerPOWorkListContext;
        private readonly int companyId;
        #endregion

        #region Constructor
        public CustomerPOWorkListController(IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, ICustomerPOWorkListRepository customerPOWorkListContext)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _customerPOWorkListContext = customerPOWorkListContext;
            companyId = MerchantContext.CompanyDetails.Id;
        }
        #endregion

        #region public methods
        /// <summary>
        /// This method is used for fetching customer purchase order list from database. - JJ
        /// </summary>   
        /// <returns>list of objects of </returns>
        [HttpGet]
        [Route("getcustomerpoworklist")]
        public IHttpActionResult GetCustomerPOWorkList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var workList = _customerPOWorkListContext.GetCustomerPOList(companyId);
                    return Ok(workList);
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
        /// This method is used for fetching customer purchase order list from database. - JJ
        /// </summary>   
        /// <param name="username">username of currently logged in user</param>
        /// <returns>list of objects of </returns>
        [HttpGet]
        [Route("getcustomerpo")]
        public IHttpActionResult GetCustomerPO(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var customerPO = _customerPOWorkListContext.GetCustomerPO(id);
                    List<CustomerPurchaseOrderItemAC> listOfCustomerPurchaseOrderItem = new List<CustomerPurchaseOrderItemAC>();
                    List<CPOBill> cpoBillList = _customerPOWorkListContext.GetCPOBillListByPOId(id);
                    foreach (var cpoBill in cpoBillList)
                    {
                        List<POSBillItem> listOfPOSBillItem = _customerPOWorkListContext.getPOsBillItemByBillId(cpoBill.POSBillId);
                        foreach (var posBillItem in listOfPOSBillItem)
                        {
                            CustomerPurchaseOrderItemAC customerPurchaseOrderItemAC = new CustomerPurchaseOrderItemAC();
                            customerPurchaseOrderItemAC.Barcode = posBillItem.ItemProfile.Barcode;
                            customerPurchaseOrderItemAC.ItemName = posBillItem.ItemProfile.ItemNameEn;
                            customerPurchaseOrderItemAC.Price = posBillItem.SellPrice;
                            customerPurchaseOrderItemAC.Quantity = posBillItem.Quantity;
                            listOfCustomerPurchaseOrderItem.Add(customerPurchaseOrderItemAC);
                        }
                    }
                    List<CPOItemAC> listOfCPOItem = new List<CPOItemAC>();
                    foreach (var item in customerPO.CPOItem)
                    {
                        CPOItemAC cpoItemAC = new CPOItemAC();
                        cpoItemAC.ItemName = item.ItemProfile.ItemNameEn;
                        cpoItemAC.Flavour = item.ItemProfile.FlavourEn;
                        cpoItemAC.ItemTotalCost = item.ItemTotalCost;
                        cpoItemAC.OfferSellPrice = item.OfferSellPrice;
                        cpoItemAC.OrderedOfferQuantity = item.OrderedOfferQuantity;
                        cpoItemAC.Quantity = item.Quantity;
                        cpoItemAC.SellPrice = item.SellPrice;
                        cpoItemAC.Unit = item.ItemProfile.SystemParameter.ValueEn;
                        cpoItemAC.Barcode = item.Barcode;

                        var cpoItem = listOfCustomerPurchaseOrderItem.FirstOrDefault(x => x.Barcode == item.Barcode);
                        if (cpoItem == null)
                            cpoItemAC.Status = "Not Collected";
                        else
                        {
                            if (cpoItem.Quantity >= cpoItemAC.Quantity)
                                cpoItemAC.Status = "Collected";
                            else
                                cpoItemAC.Status = "Partial Collected";
                        }
                        listOfCPOItem.Add(cpoItemAC);
                    }
                    customerPO.CPOItemAC = listOfCPOItem;
                    customerPO.listOfCustomerPurchaseOrderItem = listOfCustomerPurchaseOrderItem;
                    return Ok(customerPO);
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
        [Route("getcustomerpodetail")]
        public IHttpActionResult GetCustomerPODetail()
        {
            try
            {
                List<CustomerPurchaseOrderDetailAC> listOfCustomerPurchaseOrderDetailAC = new List<CustomerPurchaseOrderDetailAC>();
                List<CustomerPurchaseOrder> listOfCustomerPurchaseOrder = _customerPOWorkListContext.GetListOfCustomerPurchaseOrderByBranch(Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                foreach (var item in listOfCustomerPurchaseOrder)
                {
                    CustomerPurchaseOrderDetailAC customerPurchaseOrderDetailAc = new CustomerPurchaseOrderDetailAC();
                    customerPurchaseOrderDetailAc.CustomerName = item.CustomerProfile.Name;
                    customerPurchaseOrderDetailAc.Id = item.Id;
                    customerPurchaseOrderDetailAc.IssueDate = item.InitiationDate;
                    customerPurchaseOrderDetailAc.CollectionBranch = item.CollectingBranch.Name;
                    customerPurchaseOrderDetailAc.CollectionDate = item.CollectionDate;
                    customerPurchaseOrderDetailAc.MemberShipCode = item.CustomerProfile.MembershipCode;
                    customerPurchaseOrderDetailAc.OrderNumber = item.PurchaseOrderNo;
                    List<CustomerPurchaseOrderItemAC> listOfCustomerPurchaseOrderItem = new List<CustomerPurchaseOrderItemAC>();
                    List<CPOBill> cpoBillList = _customerPOWorkListContext.GetCPOBillListByPOId(customerPurchaseOrderDetailAc.Id);
                    foreach (var cpoBill in cpoBillList)
                    {
                        List<POSBillItem> listOfPOSBillItem = _customerPOWorkListContext.getPOsBillItemByBillId(cpoBill.POSBillId);
                        foreach (var posBillItem in listOfPOSBillItem)
                        {
                            CustomerPurchaseOrderItemAC customerPurchaseOrderItemAC = new CustomerPurchaseOrderItemAC();
                            customerPurchaseOrderItemAC.Barcode = posBillItem.ItemProfile.Barcode;
                            customerPurchaseOrderItemAC.ItemName = posBillItem.ItemProfile.ItemNameEn;
                            customerPurchaseOrderItemAC.Price = posBillItem.SellPrice;
                            customerPurchaseOrderItemAC.Quantity = posBillItem.Quantity;
                            listOfCustomerPurchaseOrderItem.Add(customerPurchaseOrderItemAC);
                        }
                    }
                    customerPurchaseOrderDetailAc.CustomerPurchaseOrderItemList = listOfCustomerPurchaseOrderItem;
                    if (customerPurchaseOrderDetailAc.CustomerPurchaseOrderItemList.Count > 0)
                        customerPurchaseOrderDetailAc.HasChildItem = true;
                    listOfCustomerPurchaseOrderDetailAC.Add(customerPurchaseOrderDetailAc);
                }
                return Ok(listOfCustomerPurchaseOrderDetailAC);
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

using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SupplierPayment;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.ItemChangeRequest;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public class SPOReceivingRepository : ISPOReceivingRepository
    {

        #region Private Variable
        private readonly IDataRepository<SupplierDaysLimit> _supplierDaysLimitContext;
        private readonly IDataRepository<IcrDetail> _icrDetailContext;
        private readonly IDataRepository<IcrPrice> _icrPriceContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<PurchaseOrderItem> _purchaseOrderItemContext;
        private readonly IDataRepository<PurchaseOrderBranch> _purchaseOrderBranchContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListRepository;
        private readonly IICRRepository _iICRRepository;
        private readonly IDataRepository<POSupplierBill> _poSupplierBillContext;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPOContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public SPOReceivingRepository(IDataRepository<IcrPrice> icrPriceContext,
            IDataRepository<IcrDetail> icrDetailContext, IDataRepository<PurchaseOrderBranch> purchaseOrderBranchContext,
            IDataRepository<SupplierPurchaseOrder> supplierPOContext,
            ISupplierPOWorkListRepository supplierPOWorkListRepository,
             IICRRepository iICRRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository,
             IDataRepository<ItemProfile> itemProfileContext,
             IDataRepository<ItemQuantity> itemQuantityContext,
             IDataRepository<PurchaseOrderItem> purchaseOrderItemContext,
             IDataRepository<SupplierDaysLimit> supplierDaysLimitContext,
             IDataRepository<POSupplierBill> poSupplierBillContext,
             IDataRepository<POBillPayment> poBillPaymentContext, IErrorLog errorLog)
        {
            _poSupplierBillContext = poSupplierBillContext;
            _icrDetailContext = icrDetailContext;
            _icrPriceContext = icrPriceContext;
            _itemProfileContext = itemProfileContext;
            _purchaseOrderBranchContext = purchaseOrderBranchContext;
            _purchaseOrderItemContext = purchaseOrderItemContext;
            _supplierDaysLimitContext = supplierDaysLimitContext;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _supplierPOWorkListRepository = supplierPOWorkListRepository;
            _iICRRepository = iICRRepository;
            _itemQuantityContext = itemQuantityContext;
            _supplierPOContext = supplierPOContext;
            _errorLog = errorLog;
        }

        #endregion

        #region public methods

        /// <summary>
        /// This method is used for fetching supplier purchase order from database. - JJ
        /// </summary>   
        /// <param name="POID">ID OF PO</param>
        /// <returns>object of SPOReceivingAC</returns>
        public SPOReceivingAC GetSupplierPO(int POId)
        {
            try
            {
                if (_supplierPOContext.Fetch(x => x.Id == POId).Any())
                {
                    var supplierPurchaseOrder = _supplierPOContext.Find(POId);
                    var isCashPO = false;
                    var SupplierDaysLimit = new List<DiscountDaysAC>();
                    if (supplierPurchaseOrder.SupplierProfile.SupplierType.ValueEn == "Cash")
                    {
                        isCashPO = true;
                    }
                    else
                    {
                        var daysLimit = _supplierDaysLimitContext.Fetch(x => x.SupplierId == supplierPurchaseOrder.SupplierId).ToList();
                        foreach (var day in daysLimit)
                        {
                            var dayAC = new DiscountDaysAC
                            {
                                CreatedDateTime = day.CreatedDateTime,
                                Days = day.Days,
                                Discount = day.Discount,
                                SupplierId = day.SupplierId
                            };
                            SupplierDaysLimit.Add(dayAC);
                        }
                    }
                    var itemList = _supplierPOWorkListRepository.GetSupplierPOItemList(supplierPurchaseOrder.Id, supplierPurchaseOrder.PurchaseOrderNumber);
                    var branchList = _supplierPOWorkListRepository.GetSPOBranchList(supplierPurchaseOrder.Id);
                    SupplierPOAC supplierPO = new SupplierPOAC();
                    supplierPO.Id = supplierPurchaseOrder.Id;
                    supplierPO.DueDate = supplierPurchaseOrder.DueDate;
                    supplierPO.IsApproved = supplierPurchaseOrder.IsApproved;
                    supplierPO.IsCashPO = isCashPO;
                    supplierPO.IsConfirmed = supplierPurchaseOrder.IsConfirmed;
                    supplierPO.IsRejected = supplierPurchaseOrder.IsRejected;
                    supplierPO.IsCanceled = supplierPurchaseOrder.IsCanceled;
                    supplierPO.IsSend = supplierPurchaseOrder.IsSend;
                    supplierPO.IsPartiallyReceived = supplierPurchaseOrder.IsPartiallyReceived;
                    supplierPO.IsCancelApproved = supplierPurchaseOrder.IsCancelApproved;
                    supplierPO.PurchaseOrderNumber = supplierPurchaseOrder.PurchaseOrderNumber;
                    supplierPO.IssueDate = supplierPurchaseOrder.CreatedDateTime;
                    supplierPO.SupplierId = supplierPurchaseOrder.SupplierId;
                    supplierPO.SupplierName = supplierPurchaseOrder.SupplierProfile.NameEn;
                    supplierPO.SupplierCode = supplierPurchaseOrder.SupplierProfile.Code;
                    supplierPO.SPOBranch = branchList;
                    supplierPO.ParentRecordId = supplierPurchaseOrder.RecordId;
                    if (SupplierDaysLimit.Count > 0)
                    {
                        supplierPO.TotalDaysLimit = supplierPurchaseOrder.SupplierProfile.TotalDaysLimit;
                        supplierPO.DiscountDays = SupplierDaysLimit;
                    }
                    var spoReceiving = new SPOReceivingAC
                    {
                        POItem = itemList,
                        SupplierPOAC = supplierPO,
                        SPOBill = GetSPOBill(POId)
                    };
                    return spoReceiving;
                }
                else
                {
                    return null;
                }
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
        /// <param name="supplierPOBill"> object of SPOReceivingAC</param>
        /// <returns>status</returns>
        public bool SaveSupplierPOBill(SPOReceivingAC SPOReceivingAC)
        {
            try
            {
                var purchaseOrder = _supplierPOContext.Find(SPOReceivingAC.SupplierPOAC.Id);
                purchaseOrder.IsVerified = false;
                purchaseOrder.IsReceived = false;
                purchaseOrder.ModifiedDateTime = DateTime.UtcNow;
                _supplierPOContext.Update(purchaseOrder);
                _supplierPOContext.SaveChanges();
                foreach (var poItem in SPOReceivingAC.POItem)
                {
                    var item = _purchaseOrderItemContext.FirstOrDefault(x => x.ItemId == poItem.ItemId && x.PurchaseOrderId == SPOReceivingAC.SupplierPOAC.Id);
                    if (item != null)
                    {
                        item.ReceivingCostPrice = poItem.ReceiveCostPrice;
                        item.BillCostPrice = poItem.BillCostPrice;
                        item.ReceivingQuantity = poItem.ReceiveQuantity;
                        item.SPOReceivingStatus = poItem.SPOReceivingStatus;
                        item.ModifiedDateTime = DateTime.UtcNow;
                        _purchaseOrderItemContext.Update(item);
                        _purchaseOrderItemContext.SaveChanges();
                    }
                }
                return true;
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
        /// <param name="currentUser">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        /// <returns>receiving status id</returns>
        public int ReceiveSPOItem(SupplierItemAC SupplierItemAC, UserDetail currentUser, CompanyDetail company)
        {
            try
            {
                SupplierPurchaseOrder purchaseOrder = _supplierPOContext.Find(SupplierItemAC.PurchaseOrderId);
                purchaseOrder.IsVerified = false;
                purchaseOrder.IsReceived = false;
                purchaseOrder.ModifiedDateTime = DateTime.UtcNow;
                _supplierPOContext.Update(purchaseOrder);
                _supplierPOContext.SaveChanges();
                PurchaseOrderItem poItem = _purchaseOrderItemContext.Fetch(x => x.ItemId == SupplierItemAC.ItemId && x.PurchaseOrderId == SupplierItemAC.PurchaseOrderId && x.SupplierPurchaseOrder.IsApproved && x.SupplierPurchaseOrder.IsSend).Include(x => x.ItemProfile).FirstOrDefault();
                if (poItem != null)
                {
                    IcrDetail icrDetail = poItem.ICRDetailId != null ? _icrDetailContext.FirstOrDefault(x => !x.IsDeleted && x.Id == (int)poItem.ICRDetailId) : null;
                    List<int> spoBranchIds = _purchaseOrderBranchContext.Fetch(x => x.PurchaseOrderId == purchaseOrder.Id).Select(x => x.BranchId).ToList();
                    //bit indicates whether an ICR is generated for item if it is generated then is it for this POItem.
                    bool IsIcrForPOItem = true;
                    List<ItemQuantity> itemQuantities = _itemQuantityContext.Fetch(x => x.ItemId == poItem.ItemId && spoBranchIds.Contains(x.BranchId)).ToList();
                    if (itemQuantities?.Count > 0)
                        IsIcrForPOItem = !(itemQuantities.Any(x => x.IsICRGenerated));

                    if (IsIcrForPOItem && poItem.ItemProfile.IsItemChangeRequestGenerated)
                    {
                        IsIcrForPOItem = false;
                        if (poItem.Id == icrDetail?.SPOItemId)
                            IsIcrForPOItem = true;
                    }
                    if (IsIcrForPOItem)
                    {
                        if (poItem.ICRDetailId != null)
                        {
                            var icrPrice = _icrPriceContext.Fetch(x => x.IcrId == poItem.ICRDetailId).ToList().LastOrDefault();
                            if (icrPrice != null && icrPrice.ModifyingCostPrice == SupplierItemAC.ReceiveCostPrice)
                            {
                                var icr = _icrDetailContext.FirstOrDefault(x => x.Id == icrPrice.IcrId && !x.IsDeleted);
                                if (icr != null && icr.IsApproved)
                                {
                                    if (poItem.OrderQuantity > SupplierItemAC.ReceiveQuantity)
                                        poItem.SPOReceivingStatus = SPOReceivingStatus.PartiallyReceived;
                                    else
                                        poItem.SPOReceivingStatus = SPOReceivingStatus.Received;
                                }
                                else
                                    poItem.SPOReceivingStatus = SPOReceivingStatus.NotReceived;

                                poItem.ModifiedDateTime = DateTime.UtcNow;
                                _purchaseOrderItemContext.Update(poItem);
                                _purchaseOrderItemContext.SaveChanges();
                                return (int)poItem.SPOReceivingStatus;
                            }
                            return Receive(SupplierItemAC, currentUser, company);
                        }
                        return Receive(SupplierItemAC, currentUser, company);
                    }
                    return 401;
                }
                return 404;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for end receiving SPO in database. - JJ
        /// </summary>
        /// <param name="SPOReceivingAC"> object of SPOReceivingAC</param>
        /// <param name="roleName">user's role</param>
        /// <param name="userName">user's name</param>
        /// <returns>status</returns>
        public bool EndReceiving(SPOReceivingAC SPOReceivingAC, string roleName, string userName)
        {
            try
            {
                var spo = _supplierPOContext.Find(SPOReceivingAC.PurchaseOrderId);
                if (spo != null)
                {
                    spo.IsReceived = true;
                    spo.IsVerified = false;
                    spo.UpdatedDate = DateTime.UtcNow;
                    spo.ModifiedDateTime = DateTime.UtcNow;
                    _supplierPOContext.Update(spo);
                    _supplierPOContext.SaveChanges();
                    if (SPOReceivingAC.Comment == ".")
                    {
                        SPOReceivingAC.Comment = "";
                    }
                    _supplierPOWorkListRepository.SaveSupplierPurchaseOrderLog(StringConstants.ReceiveAction, SPOReceivingAC.Comment, SPOReceivingAC.PurchaseOrderId, spo.RecordId, roleName, "" + roleName + " " + StringConstants.ReceiveSPO, userName);

                    UpdateItem(spo.Id);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for fetching supplier purchase order bills from database. - JJ
        /// </summary>   
        /// <param name="POID">ID OF PO</param>
        /// <returns>list of SPOReceivingBillAC</returns>
        public IList<SPOReceivingBillAC> GetSPOBill(int POId)
        {
            try
            {
                var poBill = _poSupplierBillContext.Fetch(x => x.PurchaseOrderId == POId).ToList();
                var billList = new List<SPOReceivingBillAC>();
                foreach (var bill in poBill)
                {
                    var spoBill = new SPOReceivingBillAC();
                    spoBill.Amount = bill.Amount;
                    spoBill.BillComment = bill.BillComment;
                    spoBill.BillId = bill.Id;
                    spoBill.BillNumber = bill.BillNumber;
                    spoBill.Discount = bill.Discount;
                    spoBill.IsPaid = bill.IsPaid;
                    spoBill.IsPercentageDiscount = bill.IsPercentageDiscount;
                    spoBill.IsVerified = bill.IsVerified;
                    spoBill.VerifiedDate = bill.VerifiedDate;
                    spoBill.TotalDaysLimit = bill.TotalDaysLimit;
                    billList.Add(spoBill);
                }
                return billList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for verifying Bill - JJ
        /// </summary>
        /// <param name="BillId">Id of Bill</param>    
        /// <returns>status</returns>
        public bool VerifyBill(int BillId)
        {
            var bill = _poSupplierBillContext.Find(BillId);
            if (bill != null)
            {
                bill.IsVerified = true;
                bill.VerifiedDate = DateTime.UtcNow;
                bill.ModifiedDateTime = DateTime.UtcNow;
                _poSupplierBillContext.Update(bill);
                _poSupplierBillContext.SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }


        /// <summary>
        /// This method is used for verifying purchase order - JJ
        /// </summary>
        /// <param name="spoId">Id of Supplier Purchase Order</param>    
        /// <returns>status</returns>
        public bool VerifySPO(int SPOId, string roleName, string Comment, string userName)
        {
            var supplierPO = _supplierPOContext.Find(SPOId);
            if (supplierPO != null)
            {
                supplierPO.IsVerified = true;
                supplierPO.IsNotVerified = false;
                supplierPO.ModifiedDateTime = DateTime.UtcNow;
                _supplierPOContext.Update(supplierPO);
                _supplierPOContext.SaveChanges();
                if (Comment == ".")
                {
                    Comment = null;
                }
                _supplierPOWorkListRepository.SaveSupplierPurchaseOrderLog("Verified", Comment, SPOId, supplierPO.RecordId, roleName, "" + roleName + " " + StringConstants.VerifySPO, userName);
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// This method is used for deleting individual supplier purchase order bill. - JJ
        /// </summary>   
        /// <param name="BillID">ID OF Bill</param>
        /// <returns>status</returns>
        public bool DeletePOSupplierBill(int BillId)
        {
            try
            {
                var spoBill = _poSupplierBillContext.Find(BillId);
                if (spoBill != null)
                {
                    _poSupplierBillContext.Delete(BillId);
                    _poSupplierBillContext.SaveChanges();

                    var poItems = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == spoBill.PurchaseOrderId).ToList();
                    foreach (var item in poItems)
                    {
                        item.SPOReceivingStatus = SPOReceivingStatus.NotReceived;
                        item.ModifiedDateTime = DateTime.UtcNow;
                        _purchaseOrderItemContext.Update(item);
                        _purchaseOrderItemContext.SaveChanges();
                    }
                    return true;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used for adding supplier purchase order bill. -JJ
        /// </summary>   
        /// <param name="PurchaseOrderId">ID OF PO</param>
        /// <param name="POSupplierBill">object of POSupplierBill</param>
        /// <returns>status</returns>
        public int AddSupplierBill(SPOReceivingBillAC POSupplierBill, int PurchaseOrderId)
        {
            try
            {
                var count = 0;
                var totalDays = 0;
                bool isBillFound = true;
                var bill = new POSupplierBill();
                //edit method
                if (POSupplierBill.BillId > 0)
                {
                    bill = _poSupplierBillContext.Find(POSupplierBill.BillId);
                    if (bill != null)
                    {
                        var spo = _supplierPOContext.Find(PurchaseOrderId);
                        spo.IsReceived = false;
                        spo.IsVerified = false;
                        spo.ModifiedDateTime = DateTime.UtcNow;
                        _supplierPOContext.Update(spo);
                        _supplierPOContext.SaveChanges();

                        bill.Amount = POSupplierBill.Amount;
                        bill.BillComment = POSupplierBill.BillComment;
                        bill.BillNumber = POSupplierBill.BillNumber;
                        bill.ModifiedDateTime = DateTime.UtcNow;
                        bill.Discount = POSupplierBill.Discount;
                        bill.PresentDiscount = POSupplierBill.Discount;
                        bill.IsPaid = POSupplierBill.IsPaid;
                        bill.IsPercentageDiscount = POSupplierBill.IsPercentageDiscount;
                        bill.IsVerified = POSupplierBill.IsVerified;
                        bill.PurchaseOrderId = PurchaseOrderId;
                        bill.VerifiedDate = POSupplierBill.VerifiedDate;
                        bill.TotalDaysLimit = POSupplierBill.TotalDaysLimit;
                        _poSupplierBillContext.Update(bill);
                        _poSupplierBillContext.SaveChanges();
                    }
                    else
                    {
                        isBillFound = false;
                    }
                }
                //add method
                else
                {
                    bill.Amount = POSupplierBill.Amount;
                    bill.BillComment = POSupplierBill.BillComment;
                    bill.BillNumber = POSupplierBill.BillNumber;
                    bill.CreatedDateTime = DateTime.UtcNow;
                    bill.Discount = POSupplierBill.Discount;
                    bill.PresentDiscount = POSupplierBill.Discount;
                    bill.IsPaid = POSupplierBill.IsPaid;
                    bill.IsPercentageDiscount = POSupplierBill.IsPercentageDiscount;
                    bill.IsVerified = POSupplierBill.IsVerified;
                    bill.PurchaseOrderId = PurchaseOrderId;
                    bill.VerifiedDate = POSupplierBill.VerifiedDate;
                    bill.TotalDaysLimit = POSupplierBill.TotalDaysLimit;
                    _poSupplierBillContext.Add(bill);
                    _poSupplierBillContext.SaveChanges();
                }

                var poItems = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == PurchaseOrderId).ToList();
                foreach (var item in poItems)
                {
                    item.SPOReceivingStatus = SPOReceivingStatus.NotReceived;
                    item.ModifiedDateTime = DateTime.UtcNow;
                    _purchaseOrderItemContext.Update(item);
                    _purchaseOrderItemContext.SaveChanges();
                }

                if (isBillFound && bill.TotalDaysLimit > 0 && bill.IsPercentageDiscount && POSupplierBill.Days > 0)
                {
                    totalDays = totalDays + POSupplierBill.Days;
                    count = 1;
                }
                if (count == 0)
                {
                    var spoBill = _poSupplierBillContext.Find(bill.Id);
                    spoBill.TotalDaysLimit = 0;
                    spoBill.ModifiedDateTime = DateTime.UtcNow;
                    _poSupplierBillContext.Update(spoBill);
                    _poSupplierBillContext.SaveChanges();
                }
                if (isBillFound)
                    return bill.Id;
                else
                    return 0;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get list of purchase order item by purchase order item id.
        /// </summary>
        /// <param name="purchaseOrderItemId"></param>
        /// <returns></returns>
        public ReceivingPurchaseOrderAC GetListOfPurchaseOrderItem(int purchaseOrderId)
        {
            try
            {

                ReceivingPurchaseOrderAC receivingPurchaseOrderAC = new ReceivingPurchaseOrderAC();
                List<RecevingPurchaseOrderList> listOfReceivingPurchaseOrder = new List<RecevingPurchaseOrderList>();
                List<PurchaseOrderItem> listOfPurchaseOrderItem = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == purchaseOrderId).ToList();
                foreach (var item in listOfPurchaseOrderItem)
                {
                    RecevingPurchaseOrderList recevingPurchaseOrderList = new RecevingPurchaseOrderList();
                    recevingPurchaseOrderList.Barcode = item.ItemProfile.Barcode;
                    recevingPurchaseOrderList.Code = item.ItemProfile.Code;
                    recevingPurchaseOrderList.Discount = item.PercentageDiscount;
                    recevingPurchaseOrderList.FreeQuantity = item.FreeQuantity;
                    recevingPurchaseOrderList.ItemName = item.ItemProfile.ItemNameEn;
                    recevingPurchaseOrderList.ReceivingQuantity = item.ReceivingQuantity;
                    recevingPurchaseOrderList.ReceivnigCostPrice = item.ReceivingCostPrice;
                    recevingPurchaseOrderList.SPOReceivingStatus = item.SPOReceivingStatus.ToString();
                    recevingPurchaseOrderList.Unit = item.ItemProfile.SystemParameter.ValueEn;
                    listOfReceivingPurchaseOrder.Add(recevingPurchaseOrderList);
                }
                receivingPurchaseOrderAC.RecevingPurchaseOrderList = listOfReceivingPurchaseOrder;

                SupplierPurchaseOrder supplierPurchaseOrder = new SupplierPurchaseOrder();
                supplierPurchaseOrder = _supplierPOContext.FirstOrDefault(x => x.Id == purchaseOrderId);
                if (supplierPurchaseOrder.IsReceived || supplierPurchaseOrder.IsVerified)
                    receivingPurchaseOrderAC.IsReceived = true;
                return receivingPurchaseOrderAC;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        #region Private Region


        /// <summary>
        /// Update the Item Profiles as per Purchase Order Items - JJ
        /// </summary>
        /// <param name="spoId"></param>
        private void UpdateItem(int spoId)
        {
            SupplierPurchaseOrder spo = _supplierPOContext.Find(spoId);
            List<PurchaseOrderBranch> spoBranches = _purchaseOrderBranchContext.Fetch(x => x.PurchaseOrderId == spoId).ToList();
            List<PurchaseOrderItem> poItems = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == spoId).ToList();

            foreach (PurchaseOrderItem item in poItems)
            {
                ItemProfile itemProfile = _itemProfileContext.Find(item.ItemId);
                itemProfile.PreviousCostPrice = itemProfile.CostPrice;
                itemProfile.CostPrice = GetItemPrice(item, itemProfile, spoBranches);
                var icr = _icrDetailContext.FirstOrDefault(x => x.SPOItemId == item.Id && !x.IsDeleted);
                if (icr != null)
                {
                    var icrPrice = _icrPriceContext.FirstOrDefault(x => x.IcrId == icr.Id);
                    if (icrPrice != null)
                    {
                        itemProfile.SellPrice = icrPrice.ModifyingSellPrice;
                        itemProfile.SellPriceA = icrPrice.ModifyingSellPriceA;
                        itemProfile.SellPriceB = icrPrice.ModifyingSellPriceB;
                        itemProfile.SellPriceC = icrPrice.ModifyingSellPriceC;
                        itemProfile.SellPriceD = icrPrice.ModifyingSellPriceD;
                    }
                }
                _itemProfileContext.Update(itemProfile);
                _itemProfileContext.SaveChanges();

                foreach (PurchaseOrderBranch branch in spoBranches)
                {
                    var itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.ItemId && x.BranchId == branch.BranchId);
                    if (itemQuantity != null)
                    {
                        itemQuantity.ActualQuantity += item.ReceivingQuantity;
                        _itemQuantityContext.Update(itemQuantity);
                        _itemQuantityContext.SaveChanges();
                    }
                    else
                    {
                        var newItemQuantity = new ItemQuantity
                        {
                            ActualQuantity = item.ReceivingQuantity,
                            BranchId = branch.BranchId,
                            CreatedDateTime = DateTime.UtcNow,
                            ItemId = item.ItemId,
                            //client asked to keep test data for the time being
                            MaxQuantity = item.ReceivingQuantity,
                            MinQuantity = item.ReceivingQuantity
                        };
                        _itemQuantityContext.Add(newItemQuantity);
                        _itemQuantityContext.SaveChanges();
                    }
                }
            }
        }


        private decimal GetItemPrice(PurchaseOrderItem poItem, ItemProfile itemProfile, List<PurchaseOrderBranch> poBranches)
        {
            decimal numerator = 0, denominator = 0, price = 0;
            foreach (PurchaseOrderBranch branch in poBranches)
            {
                var itemQuantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == poItem.ItemId && x.BranchId == branch.BranchId);
                if (itemQuantity != null)
                {
                    numerator += (itemProfile.CostPrice * itemQuantity.ActualQuantity);
                    denominator += itemQuantity.ActualQuantity;
                }
            }
            numerator += (poBranches.Count * poItem.ReceivingQuantity) * poItem.ReceivingCostPrice;
            denominator += (poBranches.Count * poItem.ReceivingQuantity);
            if (denominator > 0)
                price = numerator / denominator;
            return price;
        }


        /// <summary>
        /// This method is used for receive an item of SPO. This is a private method called by ReceiveSPOItem - JJ
        /// </summary>
        /// <param name="SupplierItemAC">object of SupplierItemAC</param>
        /// <param name="currentUser">object of UserDetail</param>
        /// <param name="company">object of CompanyDetail</param>
        private int Receive(SupplierItemAC SupplierItemAC, UserDetail currentUser, CompanyDetail company)
        {
            PurchaseOrderItem poItem = _purchaseOrderItemContext.FirstOrDefault(x => x.ItemId == SupplierItemAC.ItemId && x.PurchaseOrderId == SupplierItemAC.PurchaseOrderId && x.SupplierPurchaseOrder.IsApproved && x.SupplierPurchaseOrder.IsSend);
            var status = "";
            bool icrCreated = false;
            poItem.ReceivingCostPrice = SupplierItemAC.ReceiveCostPrice;
            poItem.ReceivingQuantity = SupplierItemAC.ReceiveQuantity;
            poItem.BillCostPrice = SupplierItemAC.BillCostPrice;
            if (SupplierItemAC.ReceiveQuantity > SupplierItemAC.OrderQuantity)
            {
                poItem.SPOReceivingStatus = SPOReceivingStatus.PartiallyReceived;
            }

            var workflowLog = _iWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.SPOReceiving, StringConstants.ReceiveSPO, currentUser, company, poItem, null, poItem);

            if (workflowLog != null)
            {
                IcrDetail prevICR = _icrDetailContext.FirstOrDefault(x => x.SPOItemId == poItem.Id && !x.IsDeleted);
                if (prevICR != null)
                    _iICRRepository.DeleteICR(prevICR.Id);

                WorkFlowLog log = (WorkFlowLog)workflowLog.Item1;
                var workFlowDetail = (WorkFlowDetail)workflowLog.Item2;

                if (workFlowDetail.NextActivity.Id == 3)
                {
                    if (poItem.OrderQuantity > SupplierItemAC.ReceiveQuantity)
                    {
                        poItem.SPOReceivingStatus = SPOReceivingStatus.PartiallyReceived;
                    }
                    else
                    {
                        poItem.SPOReceivingStatus = SPOReceivingStatus.Received;
                    }
                }
                else
                {
                    poItem.SPOReceivingStatus = SPOReceivingStatus.NotReceived;
                }
                if (workFlowDetail.ParentPermission.Name == StringConstants.ItemChangeRequest && poItem.SPOReceivingStatus == SPOReceivingStatus.NotReceived)
                {
                    icrCreated = true;

                    ItemChangedDetailsAC itemChange = new ItemChangedDetailsAC
                    {
                        IsPOItemIcr = true,
                        IsPriceChangeRequest = true,
                        ItemId = SupplierItemAC.ItemId,
                        ModifyingCostPrice = poItem.ReceivingCostPrice,
                        ModifyingSellPrice = poItem.ItemProfile.SellPrice,
                        ModifyingSellPriceA = poItem.ItemProfile.SellPriceA,
                        ModifyingSellPriceB = poItem.ItemProfile.SellPriceB,
                        ModifyingSellPriceC = poItem.ItemProfile.SellPriceC,
                        ModifyingSellPriceD = poItem.ItemProfile.SellPriceD,
                        POItemId = poItem.Id,
                        RequestedDate = DateTime.UtcNow,
                        ParentRecordId = log.RecordId,
                        IsInDirect = true
                    };
                    status = _iICRRepository.SaveICR(itemChange, currentUser, company, workFlowDetail.Id);
                }
                if (status == "ok")
                {
                    var newICR = _icrDetailContext.Fetch(x => x.SPOItemId == poItem.Id && !x.IsDeleted).ToList().LastOrDefault();
                    if (newICR != null)
                    {
                        poItem.ICRDetailId = newICR.Id;
                        if (newICR.IsApproved && poItem.SPOReceivingStatus != SPOReceivingStatus.PartiallyReceived)
                        {
                            poItem.SPOReceivingStatus = SPOReceivingStatus.Received;
                        }
                    }
                }
                poItem.ModifiedDateTime = DateTime.UtcNow;
                _purchaseOrderItemContext.Update(poItem);
                _purchaseOrderItemContext.SaveChanges();
                if (icrCreated)
                    return 300;
                else
                    return (int)poItem.SPOReceivingStatus;
            }
            else
                return 400;
        }

        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _poSupplierBillContext.Dispose();
                _supplierDaysLimitContext.Dispose();
                _icrDetailContext.Dispose();
                _icrPriceContext.Dispose();
                _supplierPOContext.Dispose();
                _purchaseOrderItemContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }
        #endregion
    }
}
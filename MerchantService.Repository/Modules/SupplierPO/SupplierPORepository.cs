using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public class SupplierPORepository : ISupplierPORepository
    {
        #region Private Variable
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemSupplier> _itemSupplierContext;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPOContext;
        private readonly IDataRepository<PurchaseOrderItem> _purchaseOrderItemContext;
        private readonly IDataRepository<PurchaseOrderBranch> _purchaseOrderBranchContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowContext;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogContext;
        private readonly IDataRepository<CompanyConfiguration> _companyConfigurationContext;
        private readonly ISupplierPOWorkListRepository _supplierPOWorkListContext;
        private readonly IWorkFlowDetailsRepository _IWorkFlowDetailsRepository;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public SupplierPORepository(IWorkFlowDetailsRepository IWorkFlowDetailsRepository,
            ISupplierPOWorkListRepository supplierPOWorkListContext,
            IDataRepository<PurchaseOrderBranch> purchaseOrderBranchContext, IDataRepository<CompanyConfiguration> companyConfigurationContext,
            IDataRepository<WorkFlowDetail> workFlowContext, IDataRepository<WorkFlowLog> workFlowLogContext, IErrorLog errorLog,
            IDataRepository<ItemProfile> itemProfileContext, IDataRepository<ItemSupplier> itemSupplierContext, IDataRepository<ParamType> paramTypeContext,
            IDataRepository<UserDetail> userDetailContext, IDataRepository<SupplierPurchaseOrder> supplierPOContext,
            IDataRepository<PurchaseOrderItem> purchaseOrderItemContext)
        {
            _companyConfigurationContext = companyConfigurationContext;
            _paramTypeContext = paramTypeContext;
            _userDetailContext = userDetailContext;
            _itemProfileContext = itemProfileContext;
            _itemSupplierContext = itemSupplierContext;
            _supplierPOContext = supplierPOContext;
            _workFlowContext = workFlowContext;
            _IWorkFlowDetailsRepository = IWorkFlowDetailsRepository;
            _supplierPOWorkListContext = supplierPOWorkListContext;
            _purchaseOrderItemContext = purchaseOrderItemContext;
            _purchaseOrderBranchContext = purchaseOrderBranchContext;
            _workFlowLogContext = workFlowLogContext;
            _errorLog = errorLog;
        }
        #endregion

        #region public methods

        /// <summary>
        /// This method is used for fetching supplier item list from database. - JJ
        /// </summary>   
        /// <param name="SupplierId">id of supplier</param>
        /// <param name="userName">name of user</param>
        /// <returns>list of objects of SupplierItemAC</returns>
        public List<SupplierItemAC> GetSupplierItemList(int SupplierId, string userName)
        {
            try
            {
                var itemList = new List<SupplierItemAC>();
                var categories = _itemSupplierContext.Fetch(x => x.SupplierId == SupplierId && !x.IsDelete && x.SupplierProfile.IsActive).ToList();
                foreach (var category in categories)
                {
                    var items = _itemProfileContext.Fetch(x => x.CategoryId == category.CategoryId && !x.IsDeleted).ToList();
                    foreach (var item in items)
                    {
                        if (item.IsActive && !item.IsDeleted)
                        {
                            SupplierItemAC itemProfile = new SupplierItemAC
                            {
                                SupplierDaysLimit = category.SupplierProfile.TotalDaysLimit,
                                SupplierTypeId = category.SupplierProfile.SupplierTypeId,
                                Barcode = item.Barcode,
                                BaseUnit = item.BaseUnit,
                                Category = item.Category,
                                Code = item.Code,
                                CostPrice = item.CostPrice,
                                FlavourEn = item.FlavourEn,
                                ItemId = item.Id,
                                ItemNameEn = item.ItemNameEn,
                                ActualQuantity = 0,
                                MaxQuantity = 0,
                                Type = item.SystemParameter.ValueEn,
                                UnitParamTypeId = item.UnitParamTypeId
                            };
                            itemList.Add(itemProfile);
                        }
                    }
                }
                return itemList;
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
        /// <param name="supplierPO"> object of SupplierPOAC</param>
        /// <param name="company">object of Company</param>
        /// <param name="userName">current user's username</param>
        /// <returns>status</returns>
        public string SaveSupplierPO(SupplierPOAC supplierPO, string userName, CompanyDetail company)
        {
            try
            {
                var log = new WorkFlowLog();
                var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                var companyConfig = _companyConfigurationContext.First(x => x.CompanyId == company.Id);
                var sponumber = companyConfig.SPOInvoiceNo;
                bool IsApproved = false;
                bool IsConfirmed = false;
                bool IsCanceled = false;
                bool IsRejected = false;
                bool IsPartiallyReceived = false;
                string ponumber = PurchaseOrderNumberGenerator(sponumber, 4);
                if (supplierPO.IsSubmitted)
                {
                    var workFlowLog = _IWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.SupplierPurchaseOrder, StringConstants.CreateSupplierPurchaseOrder, currentUser, company, supplierPO, supplierPO.InitiationComment, supplierPO);
                    if (workFlowLog != null)
                    {
                        log = (WorkFlowLog)workFlowLog.Item1;
                        supplierPO.ParentRecordId = log.RecordId;
                    }
                    else
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }
                    var activityWorkFlow = _workFlowContext.FirstOrDefault(x => x.Id == log.WorkFlowId);
                    if (!activityWorkFlow.NextActivity.IsClosed)
                    {
                        IsApproved = false;
                    }
                    else
                    {
                        IsApproved = true;
                    }
                }

                var supplierType = _paramTypeContext.Fetch(x => x.Param.Key == StringConstants.SupplierType);
                bool isCredit = false;
                foreach (var type in supplierType)
                {
                    if (type.Id == supplierPO.SupplierTypeId && type.ValueEn == StringConstants.Credit)
                        isCredit = true;
                    else
                        isCredit = false;
                }

                var supplierPurchaseOrder = new SupplierPurchaseOrder
                {
                    UserId = currentUser.Id,
                    RecordId = supplierPO.ParentRecordId,
                    SupplierId = supplierPO.SupplierId,
                    InitiationBranchId = supplierPO.InitiationBranchId,
                    IsApproved = IsApproved,
                    IsConfirmed = IsConfirmed,
                    IsNotProcessed = true,
                    IsRejected = IsRejected,
                    IsCanceled = IsCanceled,
                    IsPartiallyReceived = IsPartiallyReceived,
                    IsSend = false,
                    IsSubmitted = supplierPO.IsSubmitted,
                    DueDate = supplierPO.DueDate,
                    CreatedDateTime = DateTime.UtcNow,
                    CreditDaysLimit = supplierPO.SupplierDaysLimit,
                    IsCreditPayment = isCredit,
                    UpdatedDate = DateTime.UtcNow,
                    PurchaseOrderNumber = ponumber
                };
                _supplierPOContext.Add(supplierPurchaseOrder);
                _supplierPOContext.SaveChanges();

                if (supplierPO.IsSubmitted)
                {
                    _supplierPOWorkListContext.SaveSupplierPurchaseOrderLog(log.Action, supplierPO.InitiationComment, supplierPurchaseOrder.Id, log.RecordId, currentUser.RoleName, log.Stage, currentUser.UserName);
                }

                foreach (var branch in supplierPO.SPOBranch)
                {
                    var spoBranch = new PurchaseOrderBranch
                    {
                        CreatedDateTime = DateTime.UtcNow,
                        BranchId = branch.Id,
                        PurchaseOrderId = supplierPurchaseOrder.Id
                    };
                    _purchaseOrderBranchContext.Add(spoBranch);
                    _purchaseOrderBranchContext.SaveChanges();
                }
                foreach (var item in supplierPO.SupplierItem)
                {
                    var poItem = new PurchaseOrderItem
                    {
                        CreatedDateTime = DateTime.UtcNow,
                        FreeQuantity = item.FreeQuantity,
                        ItemId = item.ItemId,
                        OrderCostPrice = item.OrderCostPrice,
                        OrderQuantity = item.OrderQuantity,
                        ReceivingCostPrice = item.OrderCostPrice,
                        BillCostPrice = item.OrderCostPrice,
                        ReceivingQuantity = item.OrderQuantity,
                        SystemParameterId = item.UnitParamTypeId,
                        PercentageDiscount = item.PercentageDiscount,
                        IsPercentageDiscount = true,
                        PurchaseOrderId = supplierPurchaseOrder.Id,
                        ReceivingDate = supplierPO.DueDate,
                        UpdatedDate = DateTime.UtcNow,
                        SPOReceivingStatus = SPOReceivingStatus.NotReceived
                    };
                    _purchaseOrderItemContext.Add(poItem);
                    _purchaseOrderItemContext.SaveChanges();
                }
                return StringConstants.SPOCreated;
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
        /// <param name="company">Object of CompanyDetail</param>
        /// <param name="userName">currently logged in user's name</param>
        /// <returns>status</returns>
        public string SubmitSupplierPO(int SupplierPOId, string Comment, string userName, CompanyDetail company)
        {
            try
            {
                var log = new WorkFlowLog();
                bool IsApproved = false;
                var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                var supplierPO = _supplierPOContext.Find(SupplierPOId);

                if (!supplierPO.IsSubmitted)
                {
                    var workFlowLog = _IWorkFlowDetailsRepository.GetInitiationActionWorkFlow(StringConstants.SupplierPurchaseOrder, StringConstants.CreateSupplierPurchaseOrder, currentUser, company, supplierPO, Comment, supplierPO);
                    if (workFlowLog != null)
                    {
                        log = (WorkFlowLog)workFlowLog.Item1;
                        supplierPO.RecordId = log.RecordId;
                    }
                    else
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }

                    var activityWorkFlow = _workFlowContext.FirstOrDefault(x => x.Id == log.WorkFlowId);
                    if (!activityWorkFlow.NextActivity.IsClosed)
                    {
                        IsApproved = false;
                    }
                    else
                    {
                        IsApproved = true;
                    }

                    supplierPO.ModifiedDateTime = DateTime.UtcNow;
                    supplierPO.IsApproved = IsApproved;
                    supplierPO.IsSubmitted = true;
                    _supplierPOContext.Update(supplierPO);
                    _supplierPOContext.SaveChanges();

                    _supplierPOWorkListContext.SaveSupplierPurchaseOrderLog(log.Action, Comment, supplierPO.Id, log.RecordId, currentUser.RoleName, log.Stage, currentUser.UserName);
                    return "ok";
                }
                else
                {
                    return "Purchase Order is already submitted";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for generating purchase order number. - JJ
        /// </summary>
        /// <param name="SpoInvoiceNumber"></param>
        /// <param name="SPOInvoiceDigit"></param>
        /// <returns>PurchaseOrderNumber</returns>
        string PurchaseOrderNumberGenerator(string SpoInvoiceNumber, int SPOInvoiceDigit)
        {
            string ponumber;
            var checkSPO = "" + SpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyyyy");
            var num = _supplierPOContext.Fetch(x => x.PurchaseOrderNumber.Contains(checkSPO)).Count();
            if (num == 0)
            {
                var numString = (num + 1).ToString();
                var ponum = numString.PadLeft(numString.Length + SPOInvoiceDigit - 1, '0');
                ponumber = "" + SpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyyyy") + "" + ponum;
            }
            else
            {
                var poNum = _supplierPOContext.Fetch().ToList().LastOrDefault().PurchaseOrderNumber;

                var fixedPrefixLen = SpoInvoiceNumber.Length + 8;
                int subSPO = int.Parse(poNum.Substring(fixedPrefixLen));
                string nextSPO = (subSPO + 1).ToString();
                // number of zero required
                int countZero = (SPOInvoiceDigit - nextSPO.Length) >= 0 ? (SPOInvoiceDigit - nextSPO.Length) : 0;
                string sub;
                if (countZero > 0)
                {
                    sub = nextSPO.PadLeft(countZero + 1, '0');
                }
                else
                {
                    sub = nextSPO;
                }
                ponumber = "" + SpoInvoiceNumber + "" + DateTime.UtcNow.ToString("ddMMyyyy") + "" + sub;
            }
            return ponumber;
        }

        /// <summary>
        /// This method is used for fetch supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="id">id of spo</param>
        /// <returns>object of SupplierPOAC</returns>
        public SupplierPOAC GetSupplierPO(int id)
        {
            try
            {
                if (_supplierPOContext.Fetch(x => x.Id == id).Any())
                {
                    var spo = _supplierPOContext.Find(id);
                    SupplierPOAC supplierPOAC = new SupplierPOAC();
                    supplierPOAC.PurchaseOrderNumber = spo.PurchaseOrderNumber;
                    supplierPOAC.Id = spo.Id;
                    supplierPOAC.UserId = spo.UserId;
                    supplierPOAC.SupplierId = spo.SupplierId;
                    supplierPOAC.DueDate = spo.DueDate;
                    supplierPOAC.ReceivingDate = spo.DueDate;
                    supplierPOAC.CreatedDateTime = spo.CreatedDateTime;
                    supplierPOAC.ParentRecordId = spo.RecordId;
                    supplierPOAC.SupplierName = spo.SupplierProfile.NameEn;
                    supplierPOAC.SupplierProfile = spo.SupplierProfile;
                    supplierPOAC.SupplierTypeId = spo.SupplierProfile.SupplierTypeId;
                    supplierPOAC.IsApproved = spo.IsApproved;
                    supplierPOAC.IsCanceled = spo.IsCanceled;
                    supplierPOAC.IsConfirmed = spo.IsConfirmed;
                    supplierPOAC.InitiationBranchId = spo.InitiationBranchId;
                    supplierPOAC.InitiationBranchName = spo.InitiatorBranch.Name;
                    supplierPOAC.IsRejected = spo.IsRejected;
                    supplierPOAC.IsPartiallyReceived = spo.IsPartiallyReceived;
                    supplierPOAC.IsSend = spo.IsSend;
                    supplierPOAC.SPOBranch = _supplierPOWorkListContext.GetSPOBranchList(id);
                    return supplierPOAC;
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
        /// This method is used to update supplierPO - JJ
        /// </summary>
        /// <param name="supplierPO">object of SupplierPOAC</param>
        /// <param name="userName">currently logged in user's user name</param>
        /// <returns>status</returns>
        public string UpdateSPO(SupplierPOAC supplierPO, string userName)
        {

            if (supplierPO.DueDate == DateTime.MinValue)
            {
                supplierPO.DueDate = DateTime.UtcNow.AddDays(2);
            }
            try
            {
                var currentUser = _userDetailContext.FirstOrDefault(x => x.UserName == userName);
                // u will have to change it as there are 2 with these conditions
                // check when edit is called
                //i.e. after getting rejected or before approving
                if (_supplierPOContext.Fetch(x => x.Id == supplierPO.Id).Any())
                {
                    var spo = _supplierPOContext.Find(supplierPO.Id);
                    if (spo.IsSubmitted)
                    {
                        if (supplierPO.IsRejected)
                        {
                            var log = _workFlowLogContext.Fetch(x => x.RecordId == supplierPO.ParentRecordId).ToList().LastOrDefault();
                            if (log.WorkFlowDetail.AssignedId == currentUser.RoleId)
                            {
                                var workFlowLog = _IWorkFlowDetailsRepository.GetResubmitActionWorkFlow((int)supplierPO.ParentRecordId, supplierPO, supplierPO, "Updated", supplierPO.InitiationComment, currentUser);

                                if (workFlowLog != null)
                                {
                                    var workFlowDeatail = _workFlowContext.Find(workFlowLog.WorkFlowId);

                                    _supplierPOWorkListContext.SaveSupplierPurchaseOrderLog(StringConstants.ReSubmitedAction, supplierPO.InitiationComment, supplierPO.Id, workFlowLog.RecordId, currentUser.RoleName, workFlowLog.Stage, userName);

                                    if (workFlowDeatail.IsApproval || workFlowDeatail.IsReview || workFlowDeatail.NextActivity.AcceptPermission == StringConstants.FurtherApproval)
                                    {
                                        supplierPO.IsApproved = false;
                                    }
                                    else
                                    {
                                        supplierPO.IsApproved = true;
                                    }

                                    return EditSPO(supplierPO);
                                }
                                else
                                {
                                    return StringConstants.WorkFlowNotCreated;
                                }
                            }
                            else
                            {
                                return StringConstants.WorkFlowNotCreated;
                            }
                        }
                        else
                        {
                            return EditSPO(supplierPO);
                        }
                    }
                    else
                    {
                        return EditSPO(supplierPO);
                    }
                }
                else
                {
                    return StringConstants.PONotFound;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to resubmit supplierPO - JJ
        /// </summary>
        /// <param name="POId">Id of SPO</param>
        /// <param name="Comment">Comment of the user</param>
        /// <param name="user">Object of UserDetail</param>
        /// <returns>Status</returns>
        public string ResubmitSPO(int POId, string Comment, UserDetail user)
        {
            try
            {
                var spo = _supplierPOContext.Fetch(x => x.Id == POId).ToList().LastOrDefault();
                var log = _workFlowLogContext.Fetch(x => x.RecordId == spo.RecordId).ToList().Last();
                Comment = Comment == "." ? "" : Comment;
                if (log.WorkFlowDetail.AssignedId == user.RoleId)
                {
                    var workFlowLog = _IWorkFlowDetailsRepository.GetResubmitActionWorkFlow((int)spo.RecordId, spo, spo, StringConstants.ReSubmitedAction, Comment, user);

                    if (workFlowLog != null)
                    {
                        var workFlowDeatail = _workFlowContext.Find(workFlowLog.WorkFlowId);

                        _supplierPOWorkListContext.SaveSupplierPurchaseOrderLog(StringConstants.ReSubmitedAction, Comment, POId, workFlowLog.RecordId, user.RoleName, workFlowLog.Stage, user.UserName);

                        if (workFlowDeatail.IsApproval || workFlowDeatail.IsReview || workFlowDeatail.NextActivity.AcceptPermission == StringConstants.FurtherApproval)
                        {
                            spo.IsApproved = false;
                        }
                        else
                        {
                            spo.IsApproved = true;
                        }
                        spo.IsRejected = false;
                        spo.IsNotProcessed = true;
                        spo.ModifiedDateTime = DateTime.UtcNow;
                        _supplierPOContext.Update(spo);
                        _supplierPOContext.SaveChanges();
                        return "ok";
                    }
                    else
                    {
                        return StringConstants.WorkFlowNotCreated;
                    }
                }
                else
                {
                    return StringConstants.WorkFlowNotCreated;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to edit spo and delete item of spo - JJ
        /// </summary>
        /// <param name="supplierPO">object of SupplierPOAC</param>
        /// <returns>status</returns>
        public string EditSPO(SupplierPOAC supplierPO)
        {
            try
            {
                var supplierPurchaseOrder = _supplierPOContext.First(x => x.Id == supplierPO.Id);
                if (supplierPurchaseOrder.DueDate == supplierPO.DueDate)
                {
                    supplierPurchaseOrder.IsNotProcessed = true;
                }
                else
                {
                    supplierPurchaseOrder.IsNotProcessed = false;
                }
                supplierPurchaseOrder.DueDate = supplierPO.DueDate;
                supplierPurchaseOrder.IsRejected = false;
                supplierPurchaseOrder.ModifiedDateTime = DateTime.UtcNow;

                var oldItems = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == supplierPO.Id).ToList();
                var firstCollection = from item in supplierPO.SupplierItem
                                      select new
                                      {
                                          FreeQuantity = item.FreeQuantity,
                                          ItemId = item.ItemId,
                                          OrderCostPrice = item.OrderCostPrice,
                                          OrderQuantity = item.OrderQuantity,
                                          ReceivingCostPrice = item.OrderCostPrice,
                                          ReceivingQuantity = item.OrderQuantity,
                                          PurchaseOrderId = supplierPurchaseOrder.Id,
                                          PercentageDiscount = item.PercentageDiscount
                                      };


                var secCollection = from item in oldItems
                                    select new
                                    {
                                        FreeQuantity = item.FreeQuantity,
                                        ItemId = item.ItemId,
                                        OrderCostPrice = item.OrderCostPrice,
                                        OrderQuantity = item.OrderQuantity,
                                        ReceivingCostPrice = item.OrderCostPrice,
                                        ReceivingQuantity = item.OrderQuantity,
                                        PurchaseOrderId = supplierPurchaseOrder.Id,
                                        PercentageDiscount = item.PercentageDiscount
                                    };

                var except = firstCollection.Except(secCollection);
                var length = except.ToList().Count;
                var except2 = secCollection.Except(firstCollection);
                var length2 = except2.ToList().Count;

                if (length > 0 || length2 > 0)
                {
                    supplierPurchaseOrder.IsNotProcessed = false;
                    DeleteItems(supplierPO.Id);

                    foreach (var item in supplierPO.SupplierItem)
                    {
                        var poItem = new PurchaseOrderItem
                        {
                            CreatedDateTime = DateTime.UtcNow,
                            FreeQuantity = item.FreeQuantity,
                            ItemId = item.ItemId,
                            OrderCostPrice = item.OrderCostPrice,
                            OrderQuantity = item.OrderQuantity,
                            ReceivingCostPrice = item.OrderCostPrice,
                            BillCostPrice = item.OrderCostPrice,
                            ReceivingQuantity = item.OrderQuantity,
                            SystemParameterId = item.UnitParamTypeId,
                            PurchaseOrderId = supplierPurchaseOrder.Id,
                            PercentageDiscount = item.PercentageDiscount,
                            IsPercentageDiscount = true,
                            ReceivingDate = supplierPO.DueDate,
                            UpdatedDate = DateTime.UtcNow,
                            SPOReceivingStatus = SPOReceivingStatus.NotReceived
                        };
                        _purchaseOrderItemContext.Add(poItem);
                        _purchaseOrderItemContext.SaveChanges();
                    }
                }
                else
                {
                    supplierPurchaseOrder.IsNotProcessed = true;
                }
                var oldBranches = _purchaseOrderBranchContext.Fetch(x => x.PurchaseOrderId == supplierPurchaseOrder.Id).ToList();

                var oldBranchList = from branch in oldBranches
                                    select new
                                    {
                                        BranchId = branch.BranchId,
                                    };

                var newBranchList = from branch in supplierPO.SPOBranch
                                    select new
                                    {
                                        BranchId = branch.Id,
                                    };

                var exceptBranch = oldBranchList.Except(newBranchList);
                var blenghth = exceptBranch.ToList().Count;
                var exceptBranch2 = newBranchList.Except(oldBranchList);
                var blength2 = exceptBranch2.ToList().Count;

                if (blenghth > 0 || blength2 > 0)
                {
                    supplierPurchaseOrder.IsNotProcessed = false;
                    DeleteBranches(supplierPO.Id);

                    foreach (var branch in supplierPO.SPOBranch)
                    {
                        var spoBranch = new PurchaseOrderBranch
                        {
                            CreatedDateTime = DateTime.UtcNow,
                            BranchId = branch.Id,
                            PurchaseOrderId = supplierPurchaseOrder.Id
                        };
                        _purchaseOrderBranchContext.Add(spoBranch);
                        _purchaseOrderBranchContext.SaveChanges();
                    }

                }
                else
                {
                    if (supplierPurchaseOrder.IsNotProcessed)
                        supplierPurchaseOrder.IsNotProcessed = true;
                }
                _supplierPOContext.Update(supplierPurchaseOrder);
                _supplierPOContext.SaveChanges();
                return "ok";
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for deleting supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="id">id of spo</param>
        /// <param name="user">object of UserDetail</param>
        /// <returns>status</returns>
        public string DeleteSupplierPO(int id, UserDetail user)
        {
            try
            {
                var supplierPO = _supplierPOContext.Find(id);
                if (supplierPO != null)
                {
                    if (supplierPO.UserId == user.Id)
                    {
                        if (!supplierPO.IsDeleted)
                        {
                            if (!supplierPO.IsSubmitted)
                            {
                                supplierPO.ModifiedDateTime = DateTime.UtcNow;
                                supplierPO.IsDeleted = true;
                                _supplierPOContext.Update(supplierPO);
                                _supplierPOContext.SaveChanges();
                                return "ok";
                            }
                            else
                            {
                                return "Purchase Order cannot be deleted as it is already Submitted.";
                            }
                        }
                        else
                        {
                            return "Purchase Order is already Deleted";
                        }
                    }
                    else
                    {
                        return "Sorry. You are not authorized to delete this Purchase Order";
                    }
                }
                else
                {
                    return StringConstants.PONotFound;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used to delete item of spo - JJ
        /// </summary>
        /// <param name="PurchaseOrderId">id of spo</param>
        /// <returns>null</returns>
        public void DeleteItems(int PurchaseOrderId)
        {
            try
            {
                var items = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == PurchaseOrderId).ToList();
                foreach (var item in items)
                {
                    _purchaseOrderItemContext.Delete(item.Id);
                    _purchaseOrderItemContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to delete branch of spo - JJ
        /// </summary>
        /// <param name="PurchaseOrderId">id of spo</param>
        /// <returns>null</returns>
        public void DeleteBranches(int PurchaseOrderId)
        {
            try
            {
                var branches = _purchaseOrderBranchContext.Fetch(x => x.PurchaseOrderId == PurchaseOrderId).ToList();
                foreach (var branch in branches)
                {
                    _purchaseOrderBranchContext.Delete(branch.Id);
                    _purchaseOrderBranchContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _companyConfigurationContext.Dispose();
                _paramTypeContext.Dispose();
                _userDetailContext.Dispose();
                _itemProfileContext.Dispose();
                _itemSupplierContext.Dispose();
                _supplierPOContext.Dispose();
                _workFlowContext.Dispose();
                _purchaseOrderBranchContext.Dispose();
                _workFlowLogContext.Dispose();
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




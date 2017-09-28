using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public class SupplierPOWorkListRepository : ISupplierPOWorkListRepository
    {
        #region Private Variable

        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPOContext;
        private readonly IDataRepository<PurchaseOrderItem> _purchaseOrderItemContext;
        private readonly IDataRepository<PurchaseOrderBranch> _purchaseOrderBranchContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<IcrDetail> _icrDetailContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowContext;
        private readonly IDataRepository<WorkFlowLog> _workFlowLogContext;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IDataRepository<SupplierPurchaseOrderLog> _supplierPurchaseOrderLogContext;
        private readonly IDataRepository<BranchDetail> _branchDetailContext;
        private readonly IErrorLog _errorLog;

        #endregion

        #region Constructor
        public SupplierPOWorkListRepository(IDataRepository<SupplierPurchaseOrderLog> supplierPurchaseOrderLogContext, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IDataRepository<IcrDetail> icrDetailContext, IDataRepository<BranchDetail> branchDetailContext, IDataRepository<PurchaseOrderBranch> purchaseOrderBranchContext, IDataRepository<WorkFlowDetail> workFlowContext, IDataRepository<WorkFlowLog> workFlowLogContext, IDataRepository<UserDetail> userDetailContext, IDataRepository<ItemProfile> itemProfileContext, IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<SupplierPurchaseOrder> supplierPOContext, IDataRepository<PurchaseOrderItem> purchaseOrderItemContext, IErrorLog errorLog)
        {
            _icrDetailContext = icrDetailContext;
            _userDetailContext = userDetailContext;
            _itemProfileContext = itemProfileContext;
            _itemQuantityContext = itemQuantityContext;
            _supplierPOContext = supplierPOContext;
            _supplierPurchaseOrderLogContext = supplierPurchaseOrderLogContext;
            _purchaseOrderItemContext = purchaseOrderItemContext;
            _purchaseOrderBranchContext = purchaseOrderBranchContext;
            _branchDetailContext = branchDetailContext;
            _workFlowLogContext = workFlowLogContext;
            _workFlowContext = workFlowContext;
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _errorLog = errorLog;
        }
        #endregion

        #region public methods

        /// <summary>
        /// This method is used for fetching supplier purchase order list from database. - JJ
        /// </summary>   
        /// <param name="allow">status whether permission granted to access other branches</param>
        /// <param name="username">username of currently logged in user</param>
        /// <returns>list of objects of SupplierPOWorkListAC</returns>                
        public List<SupplierPOWorkListAC> GetSupplierPOWorkList(string userName, bool allow)
        {
            var spoList = new List<SupplierPOWorkListAC>();
            string action;
            bool add = true;
            var supplierPurchaseOrder = new List<SupplierPurchaseOrder>();
            var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
            if (currentUser != null)
            {
                if (allow)
                {
                    supplierPurchaseOrder = _supplierPOContext.Fetch(x => !x.IsCancelApproved && !x.IsDeleted).OrderByDescending(x => x.CreatedDateTime).ToList();
                }
                else
                {
                    if (currentUser.BranchId != null)
                    {
                        supplierPurchaseOrder = _supplierPOContext.Fetch(x => !x.IsCancelApproved && !x.IsDeleted && x.InitiationBranchId == currentUser.BranchId).OrderByDescending(x => x.CreatedDateTime).ToList();
                    }
                    else
                    {
                        add = false;
                    }
                }
                if (add)
                {
                    foreach (var spo in supplierPurchaseOrder)
                    {

                        action = GetSPOWorkFlowAction(spo.Id);
                        SupplierPOWorkListAC supplierPOList = new SupplierPOWorkListAC
                        {
                            SPOId = spo.Id,
                            UserId = spo.UserId,
                            BranchId = spo.InitiationBranchId,
                            BranchName = spo.InitiatorBranch.Name,
                            DueDate = spo.DueDate,
                            IsApproved = spo.IsApproved,
                            IsConfirmed = spo.IsConfirmed,
                            IsRejected = spo.IsRejected,
                            IsCanceled = spo.IsCanceled,
                            IsSend = spo.IsSend,
                            IsSubmitted = spo.IsSubmitted,
                            Action = action,
                            IsCancelApproved = spo.IsCancelApproved,
                            IsPartiallyReceived = spo.IsPartiallyReceived,
                            PurchaseOrderNumber = spo.PurchaseOrderNumber,
                            IssueDate = spo.CreatedDateTime,
                            SupplierId = spo.SupplierId,
                            IsAutomaticSpo = spo.IsAutomaticSpo
                        };
                        spoList.Add(supplierPOList);
                    }
                }
            }
            return spoList;
        }


        /// <summary>
        /// This method is used for fetching supplier purchase order item list from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        ///<param name="PONum">Purchase Order Number of SPO</param>
        /// <returns>list of objects of SupplierItemAC</returns>
        public List<SupplierItemAC> GetSupplierPOItemList(int? id, string PONum)
        {
            var itemList = new List<SupplierItemAC>();
            List<PurchaseOrderItem> poItems;
            if (id != null && id > 0)
                poItems = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == id).ToList();
            else
                poItems = _purchaseOrderItemContext.Fetch(x => x.SupplierPurchaseOrder.PurchaseOrderNumber == PONum).ToList();

            foreach (var poItem in poItems)
            {
                var items = _itemProfileContext.Fetch(x => x.Id == poItem.ItemId).ToList();
                foreach (var item in items)
                {
                    var isIcrActive = false;
                    var icrdetails = _icrDetailContext.Fetch(x => x.ItemId == item.Id).ToList();
                    foreach (var icr in icrdetails)
                    {
                        var workFlowLog = _workFlowLogContext.Fetch(x => x.RecordId == icr.RecordId).ToList().LastOrDefault();
                        if (workFlowLog != null && !workFlowLog.WorkFlowDetail.NextActivity.IsClosed && !icr.IsRejected && !icr.IsDeleted)
                        {
                            isIcrActive = true;
                            break;
                        }
                    }

                    //for different branches the quantities are diff. so fetch quantity based on branch
                    var Quantity = _itemQuantityContext.FirstOrDefault(x => x.ItemId == item.Id && x.BranchId == poItem.SupplierPurchaseOrder.InitiationBranchId);
                    var actualQuantity = Quantity != null ? Quantity.ActualQuantity : 0;
                    var recordId = (poItem.SupplierPurchaseOrder.RecordId != null && poItem.SupplierPurchaseOrder.RecordId > 0) ? (int)poItem.SupplierPurchaseOrder.RecordId : 0;

                    SupplierItemAC itemProfile = new SupplierItemAC
                    {
                        Barcode = item.Barcode,
                        BaseUnit = item.BaseUnit,
                        Category = item.Category,
                        Code = item.Code,
                        OrderCostPrice = poItem.OrderCostPrice,
                        CostPrice = item.CostPrice,
                        FlavourEn = item.FlavourEn,
                        ItemId = item.Id,
                        ItemNameEn = item.ItemNameEn,
                        ActualQuantity = actualQuantity,
                        UnitParamTypeId = item.UnitParamTypeId,
                        Type = item.SystemParameter.ValueEn,
                        FreeQuantity = poItem.FreeQuantity,
                        IsIcrGenerated = isIcrActive,
                        OrderQuantity = poItem.OrderQuantity,
                        ReceiveQuantity = poItem.ReceivingQuantity,
                        ReceiveCostPrice = poItem.ReceivingCostPrice,
                        BillCostPrice = poItem.BillCostPrice,
                        ParentRecordId = recordId,
                        PercentageDiscount = poItem.PercentageDiscount,
                        SPOReceivingStatus = poItem.SPOReceivingStatus
                    };
                    itemList.Add(itemProfile);
                }
            }
            return itemList;
        }


        /// <summary>
        /// This method is used for fetching branch list from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>list of objects of SPOBranchAC</returns>
        public List<SPOBranchAC> GetSPOBranchList(int id)
        {
            var spoBranchList = new List<SPOBranchAC>();
            var poBranches = _purchaseOrderBranchContext.Fetch(x => x.PurchaseOrderId == id).ToList();
            foreach (var poBranch in poBranches)
            {
                var branches = _branchDetailContext.Fetch(x => x.Id == poBranch.BranchId).ToList();
                foreach (var branch in branches)
                {
                    SPOBranchAC supplierPOBranch = new SPOBranchAC
                    {
                        Id = poBranch.BranchId,
                        Name = branch.Name
                    };
                    spoBranchList.Add(supplierPOBranch);
                }
            }
            return spoBranchList;
        }


        /// <summary>
        /// This method is used for fetching spo workFlowLog from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>list of objects of WorkFlowLog</returns>
        public List<WorkFlowLogAC> GetSPOWorkFlowLog(int id)
        {
            var workFlowLog = new List<WorkFlowLogAC>();
            var list = _supplierPurchaseOrderLogContext.Fetch(x => x.RecordId == id).ToList();
            foreach (var log in list)
            {
                WorkFlowLogAC workFlow = new WorkFlowLogAC
                {
                    Id = log.Id,
                    Stage = log.Stage,
                    Action = log.Action,
                    Comments = log.Comments,
                    RecordId = (int)log.RecordId,
                    RoleName = log.RoleName,
                    UserName = log.UserName,
                    CreatedDateTime = log.CreatedDateTime
                };
                workFlowLog.Add(workFlow);
            }
            return workFlowLog;
        }


        /// <summary>
        /// This method is used for approve supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        public string ApproveSupplierPO(string Comment, int RecordId, string userName)
        {
            try
            {
                var spo = new SupplierPurchaseOrder();
                if (_supplierPOContext.Fetch(x => x.RecordId == RecordId).Any())
                {
                    spo = _supplierPOContext.First(x => x.RecordId == RecordId);
                }
                if (spo != null)
                {
                    var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                    var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                    var prevActivity = log.WorkFlowDetail.NextActivity.AcceptPermission;
                    if (log.WorkFlowDetail.AssignedId == currentUser.RoleId)
                    {
                        Comment = Comment == "." ? "" : Comment;
                        var loger = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(RecordId, StringConstants.ApprovAction, Comment, currentUser, true);
                        if (loger != null)
                        {
                            log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                            SaveSupplierPurchaseOrderLog("Approved", Comment, spo.Id, RecordId, currentUser.RoleName, "" + currentUser.RoleName + " " + log.WorkFlowDetail.Activity.Name, userName);
                            var IsApproved = false;
                            if (prevActivity.Equals(StringConstants.FurtherApproval) && log.WorkFlowDetail.NextActivity.IsClosed)
                            {
                                IsApproved = true;
                            }
                            else
                            {
                                if (log.WorkFlowDetail.IsApproval || log.WorkFlowDetail.IsReview || log.WorkFlowDetail.IsCondition)
                                {
                                    IsApproved = false;
                                }
                                else
                                {
                                    IsApproved = true;
                                }
                            }
                            spo.IsApproved = IsApproved;
                            spo.IsRejected = false;
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
        /// This method is used for review supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        public string ReviewSupplierPO(string Comment, int RecordId, UserDetail user)
        {
            try
            {
                var spo = new SupplierPurchaseOrder();
                if (_supplierPOContext.Fetch(x => x.RecordId == RecordId).Any())
                {
                    spo = _supplierPOContext.First(x => x.RecordId == RecordId);
                }
                if (spo != null)
                {
                    var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                    var prevActivity = log.WorkFlowDetail.NextActivity.AcceptPermission;
                    if (log.WorkFlowDetail.AssignedId == user.RoleId)
                    {
                        if (Comment == ".")
                        {
                            Comment = null;
                        }

                        var loger = _iWorkFlowDetailsRepository.GetReviewActionWorkFlow(RecordId, spo, spo, StringConstants.ReviewAction, Comment, user);
                        if (loger != null)
                        {
                            SaveSupplierPurchaseOrderLog("Reviewed", Comment, spo.Id, loger.RecordId, user.RoleName, loger.Stage, user.UserName);
                            return CheckApproved(RecordId, true, prevActivity);
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
        /// This method is used for reject supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the rejector</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        public string RejectSupplierPO(string Comment, int RecordId, string userName)
        {
            try
            {
                var spo = new SupplierPurchaseOrder();
                if (_supplierPOContext.Fetch(x => x.RecordId == RecordId).Any())
                {
                    spo = _supplierPOContext.First(x => x.RecordId == RecordId);
                }
                if (spo != null)
                {
                    var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                    var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                    if (log.WorkFlowDetail.AssignedId == currentUser.RoleId)
                    {
                        if (Comment == ".")
                        {
                            Comment = "";
                        }
                        var loger = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(RecordId, StringConstants.ApprovAction, Comment, currentUser, false);
                        if (loger != null)
                        {
                            log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                            SaveSupplierPurchaseOrderLog("Rejected", Comment, spo.Id, RecordId, currentUser.RoleName, "" + currentUser.RoleName + " " + log.WorkFlowDetail.Activity.Name, userName);
                            spo.IsApproved = false;
                            spo.IsRejected = true;
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
        /// This method is used for cancel supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the person who cancels</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>null</returns>
        public string CancelSupplierPO(string Comment, int RecordId, string userName)
        {
            var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
            var spo = new SupplierPurchaseOrder();
            if (_supplierPOContext.Fetch(x => x.RecordId == RecordId).Any())
            {
                spo = _supplierPOContext.First(x => x.RecordId == RecordId);
            }
            if (spo != null)
            {
                var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                if (log.WorkFlowDetail.AssignedId == currentUser.RoleId)
                {
                    if (_workFlowContext.Fetch(x => x.Activity.Name == StringConstants.Review && x.ParentActivityId == log.WorkFlowId).Any())
                    {
                        var activityWorkFlow = _workFlowContext.FirstOrDefault(x => x.Activity.Name == StringConstants.Review && x.ParentActivityId == log.WorkFlowId);
                        Comment = Comment == "." ? "" : Comment;

                        var workFlowLog = new WorkFlowLog
                        {
                            Comments = Comment,
                            CreatedDateTime = DateTime.UtcNow,
                            RecordId = RecordId,
                            RoleId = currentUser.RoleId,
                            UserId = currentUser.UserId,
                            WorkFlowId = activityWorkFlow.Id,
                            Action = "Canceled",
                            Stage = "" + currentUser.RoleName + " " + activityWorkFlow.Activity.Name
                        };
                        _workFlowLogContext.Add(workFlowLog);
                        _workFlowLogContext.SaveChanges();
                        SaveSupplierPurchaseOrderLog("Cancelled", Comment, spo.Id, workFlowLog.RecordId, currentUser.RoleName, "" + currentUser.RoleName + " " + activityWorkFlow.Activity.Name, currentUser.UserName);

                        spo.IsCanceled = true;
                        spo.IsCancelApproved = false;
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
            else
            {
                return StringConstants.PONotFound;
            }
        }


        /// <summary>
        /// This method is used for approving cancel supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the person who approves cancel</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>null</returns>
        public void ApproveCancelSupplierPO(string Comment, int RecordId, string userName, int Status)
        {
            var spo = new SupplierPurchaseOrder();
            if (_supplierPOContext.Fetch(x => x.RecordId == RecordId).Any())
            {
                spo = _supplierPOContext.First(x => x.RecordId == RecordId);
            }
            if (spo != null)
            {
                bool isCancelApproved;
                bool approve = Status == 1 ? true : false;
                var currentUser = _userDetailContext.First(x => x.UserName == userName && x.IsDelete == false);
                var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                if (log.WorkFlowDetail.AssignedId == currentUser.RoleId && _workFlowContext.Fetch(x => x.Activity.Name == StringConstants.Review && x.ParentActivityId == log.WorkFlowId).Any())
                {
                    _workFlowContext.Fetch(x => x.Activity.Name == StringConstants.Review && x.ParentActivityId == log.WorkFlowId).ToList();
                    if (approve)
                    {
                        var activityWorkFlow = _workFlowContext.FirstOrDefault(x => x.Activity.Name == StringConstants.Review && x.ParentActivityId == log.WorkFlowId && x.IsApprovePanel);
                        if (Comment == ".")
                        {
                            Comment = "";
                        }
                        var workFlowLog = new WorkFlowLog
                        {
                            Comments = Comment,
                            CreatedDateTime = DateTime.UtcNow,
                            RecordId = RecordId,
                            RoleId = currentUser.RoleId,
                            UserId = currentUser.UserId,
                            WorkFlowId = activityWorkFlow.Id,
                            Action = "Cancel Approved",
                            Stage = "" + currentUser.RoleName + " " + activityWorkFlow.Activity.Name
                        };
                        _workFlowLogContext.Add(workFlowLog);
                        _workFlowLogContext.SaveChanges();

                        SaveSupplierPurchaseOrderLog("Cancel Approved", Comment, spo.Id, workFlowLog.RecordId, currentUser.RoleName, "" + currentUser.RoleName + " " + activityWorkFlow.Activity.Name, currentUser.UserName);
                        isCancelApproved = (activityWorkFlow.IsApproval || activityWorkFlow.IsReview) ? false : true;

                        spo.IsCanceled = true;
                        spo.IsCancelApproved = isCancelApproved;
                        spo.ModifiedDateTime = DateTime.UtcNow;
                        _supplierPOContext.Update(spo);
                        _supplierPOContext.SaveChanges();
                    }
                    else
                    {
                        var activityWorkFlow = _workFlowContext.FirstOrDefault(x => x.Activity.Name == StringConstants.Review && x.ParentActivityId == log.WorkFlowId && x.IsRejectPanel);
                        Comment = (Comment == ".") ? "" : Comment;
                        var workFlowLog = new WorkFlowLog
                        {
                            Comments = Comment,
                            CreatedDateTime = DateTime.UtcNow,
                            RecordId = RecordId,
                            RoleId = currentUser.RoleId,
                            UserId = currentUser.UserId,
                            WorkFlowId = activityWorkFlow.Id,
                            Action = "Rejected Cancel",
                            Stage = "" + currentUser.RoleName + " " + activityWorkFlow.Activity.Name
                        };
                        _workFlowLogContext.Add(workFlowLog);
                        _workFlowLogContext.SaveChanges();
                        SaveSupplierPurchaseOrderLog("Rejected Cancel", Comment, spo.Id, workFlowLog.RecordId, currentUser.RoleName, "" + currentUser.RoleName + " " + activityWorkFlow.Activity.Name, currentUser.UserName);

                        spo.IsCanceled = false;
                        spo.IsCancelApproved = false;
                        spo.ModifiedDateTime = DateTime.UtcNow;
                        _supplierPOContext.Update(spo);
                        _supplierPOContext.SaveChanges();
                    }
                }
            }
        }


        /// <summary>
        /// This method is used for saving data into SupplierPurchaseOrderLog. - JJ
        /// </summary>   
        /// <param name="Action"></param>
        /// <param name="Comment"></param>
        /// <param name="POId"></param>
        /// <param name="RecordId"></param>
        /// <param name="RoleName"></param>
        /// <param name="Stage"></param>
        /// <param name="UserName"></param>
        /// <returns>null</returns>
        public void SaveSupplierPurchaseOrderLog(string Action, string Comment, int POId, int? RecordId, string RoleName, string Stage, string UserName)
        {
            var spoLog = new SupplierPurchaseOrderLog
            {
                Action = Action,
                ActionDate = DateTime.UtcNow,
                Comments = Comment,
                CreatedDateTime = DateTime.UtcNow,
                PurchaseOrderId = POId,
                RecordId = RecordId,
                RoleName = RoleName,
                Stage = Stage,
                UserName = UserName
            };
            _supplierPurchaseOrderLogContext.Add(spoLog);
            _supplierPurchaseOrderLogContext.SaveChanges();
        }


        /// <summary>
        /// This method is used for fetching purchase order details for printing receipt. - JJ
        /// </summary>   
        /// <param name="RecordId">parent record id</param>
        /// <param name="Comment"></param>
        /// <param name="userName">currently logged in user's username</param>
        /// <param name="RoleName">logged in user's rolename</param>
        /// <param name="RoleId">logged in user's role id</param>
        /// <returns>object of SPOReceipt</returns>
        public SPOReceipt PrintSPOReceipt(string Comment, int RecordId, int RoleId, string RoleName, string userName)
        {
            var purchaseOrder = _supplierPOContext.Fetch(x => x.RecordId == RecordId).FirstOrDefault();
            if (purchaseOrder.IsApproved && !purchaseOrder.IsReceived && !purchaseOrder.IsVerified && !purchaseOrder.IsPaid)
            {
                var itemList = new List<SupplierItemAC>();
                var poItemList = _purchaseOrderItemContext.Fetch(x => x.PurchaseOrderId == purchaseOrder.Id).ToList();
                foreach (var item in poItemList)
                {
                    var spoItem = new SupplierItemAC
                    {
                        FlavourEn = item.ItemProfile.FlavourEn,
                        ItemNameEn = item.ItemProfile.ItemNameEn,
                        Type = item.ItemProfile.SystemParameter.ValueEn + "-" + item.ItemProfile.BaseUnit,
                        OrderCostPrice = item.OrderCostPrice,
                        OrderQuantity = item.OrderQuantity,
                        TotalOrderPrice = item.OrderQuantity * item.OrderCostPrice
                    };
                    itemList.Add(spoItem);
                }

                var spoReceipt = new SPOReceipt();
                spoReceipt.BranchAddress = purchaseOrder.InitiatorBranch.Address;
                spoReceipt.BranchName = purchaseOrder.InitiatorBranch.NameSl;
                spoReceipt.Comment = Comment;
                spoReceipt.DueDate = purchaseOrder.DueDate;
                spoReceipt.IssueDate = purchaseOrder.CreatedDateTime;
                spoReceipt.MobileNo = purchaseOrder.SupplierProfile.Phone;
                spoReceipt.POType = purchaseOrder.SupplierProfile.SupplierType.ValueSl;
                spoReceipt.SPONumber = purchaseOrder.PurchaseOrderNumber;
                spoReceipt.SupplierItem = itemList;
                spoReceipt.SupplierName = purchaseOrder.SupplierProfile.NameEn;
                spoReceipt.SupplierEmail = purchaseOrder.SupplierProfile.Email;
                spoReceipt.Invoice = InvoiceToHtml.get39(purchaseOrder.PurchaseOrderNumber, 1, 20);
                purchaseOrder.IsSend = true;
                purchaseOrder.ModifiedDateTime = DateTime.UtcNow;
                _supplierPOContext.Update(purchaseOrder);
                _supplierPOContext.SaveChanges();

                SaveSupplierPurchaseOrderLog(StringConstants.Send, Comment, purchaseOrder.Id, RecordId, RoleName, "" + RoleName + " " + StringConstants.SendSPO, userName);
                return spoReceipt;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// This method is used for fetching supplier purchase order from database. - JJ
        /// </summary>   
        /// <param name="POUD">ID OF PO</param>
        /// <returns>object of SupplierPOAC</returns>
        public SupplierPOAC GetSupplierPO(int POId)
        {
            if (_supplierPOContext.Fetch(x => x.Id == POId).Any())
            {
                var supplierPurchaseOrder = _supplierPOContext.FirstOrDefault(x => x.Id == POId);
                var workLog = new List<WorkFlowLogAC>();
                var lastLog = new WorkFlowLogAC();
                if (supplierPurchaseOrder.RecordId != null && supplierPurchaseOrder.RecordId > 0)
                {
                    workLog = GetSPOWorkFlowLog((int)supplierPurchaseOrder.RecordId);
                    lastLog = GetSPOLog((int)supplierPurchaseOrder.RecordId);
                }
                var itemList = GetSupplierPOItemList(supplierPurchaseOrder.Id, supplierPurchaseOrder.PurchaseOrderNumber);
                var branchList = GetSPOBranchList(supplierPurchaseOrder.Id);

                SupplierPOAC supplierPO = new SupplierPOAC();
                supplierPO.Id = supplierPurchaseOrder.Id;
                supplierPO.DueDate = supplierPurchaseOrder.DueDate;
                supplierPO.IsApproved = supplierPurchaseOrder.IsApproved;
                supplierPO.IsConfirmed = supplierPurchaseOrder.IsConfirmed;
                supplierPO.IsRejected = supplierPurchaseOrder.IsRejected;
                supplierPO.IsCanceled = supplierPurchaseOrder.IsCanceled;
                supplierPO.IsReceived = supplierPurchaseOrder.IsReceived;
                supplierPO.IsSend = supplierPurchaseOrder.IsSend;
                supplierPO.IsSubmitted = supplierPurchaseOrder.IsSubmitted;
                supplierPO.UserId = supplierPurchaseOrder.UserId;
                supplierPO.IsCancelApproved = supplierPurchaseOrder.IsCancelApproved;
                supplierPO.IsPartiallyReceived = supplierPurchaseOrder.IsPartiallyReceived;
                supplierPO.IsCancelApproved = supplierPurchaseOrder.IsCancelApproved;
                supplierPO.PurchaseOrderNumber = supplierPurchaseOrder.PurchaseOrderNumber;
                supplierPO.InitiationBranchId = supplierPurchaseOrder.InitiationBranchId;
                supplierPO.InitiationBranchName = supplierPurchaseOrder.InitiatorBranch.Name;
                supplierPO.IssueDate = supplierPurchaseOrder.CreatedDateTime;
                supplierPO.SupplierId = supplierPurchaseOrder.SupplierId;
                supplierPO.SupplierName = supplierPurchaseOrder.SupplierProfile.NameEn;
                supplierPO.IsVerified = supplierPurchaseOrder.IsVerified;
                supplierPO.SupplierCode = supplierPurchaseOrder.SupplierProfile.Code;
                supplierPO.WorkFlowLog = workLog;
                supplierPO.SupplierItem = itemList;
                supplierPO.SPOBranch = branchList;
                supplierPO.ParentRecordId = supplierPurchaseOrder.RecordId;
                supplierPO.LastLog = lastLog;
                return supplierPO;
            }
            else
            {
                return null;
            }
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// This method is used for fetching Last spo workFlowLog from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>WorkFlowLogAC</returns>
        private WorkFlowLogAC GetSPOLog(int id)
        {
            var userName = "";
            var log = _workFlowLogContext.Fetch(x => x.RecordId == id).ToList().LastOrDefault();
            if (_userDetailContext.Fetch(x => x.UserId == log.UserId).Any())
            {
                userName = _userDetailContext.FirstOrDefault(x => x.UserId == log.UserId).UserName;
            }
            WorkFlowLogAC workFlow = new WorkFlowLogAC
            {
                Id = log.Id,
                Stage = log.Stage,
                Action = log.Action,
                ParentRecord = log.ParentRecord,
                Comments = log.Comments,
                RecordId = log.RecordId,
                RoleId = log.RoleId,
                RoleName = log.RoleDetails.RoleName,
                UserId = log.UserId,
                UserName = userName,
                CreatedDateTime = log.CreatedDateTime,
                WorkFlowDetail = log.WorkFlowDetail,
                WorkFlowId = log.WorkFlowId
            };
            return workFlow;
        }

        /// <summary>
        /// This method is used for fetching last spo workFlow action name from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>last action name</returns>
        private string GetSPOWorkFlowAction(int id)
        {
            var spoLog = _supplierPurchaseOrderLogContext.Fetch(x => x.PurchaseOrderId == id).ToList().LastOrDefault();
            if (spoLog != null)
                return spoLog.Action;
            else
                return "";
        }

        /// <summary>
        /// This method is used to check whether Supplier Purchase Order is approve dor not. - JJ
        /// </summary>   
        /// <param name="prevActivity"></param>
        /// <param name="RecordId">parent record id</param>
        /// <param name="status">Whether approve or reject activity</param>
        /// <returns>status</returns>
        private string CheckApproved(int RecordId, bool status, string prevActivity)
        {
            try
            {
                var log = _workFlowLogContext.Fetch(x => x.RecordId == RecordId).ToList().Last();
                var supplierPO = _supplierPOContext.Fetch(x => x.RecordId == RecordId).ToList().FirstOrDefault();
                if (supplierPO != null)
                {
                    if ((prevActivity != null) && (status && prevActivity.Equals(StringConstants.FurtherApproval) && log.WorkFlowDetail.NextActivity.IsClosed))
                    {
                        if (supplierPO.IsCanceled)
                        {
                            supplierPO.IsCancelApproved = true;
                        }
                        else
                        {
                            supplierPO.IsApproved = true;
                        }
                    }
                    else
                    {
                        supplierPO.IsApproved = false;
                    }
                    supplierPO.ModifiedDateTime = DateTime.UtcNow;
                    _supplierPOContext.Update(supplierPO);
                    _supplierPOContext.SaveChanges();
                    return "ok";
                }
                else
                {
                    return "Error in updating Purchase Order";
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
                _branchDetailContext.Dispose();
                _userDetailContext.Dispose();
                _icrDetailContext.Dispose();
                _itemProfileContext.Dispose();
                _itemQuantityContext.Dispose();
                _supplierPOContext.Dispose();
                _workFlowContext.Dispose();
                _purchaseOrderBranchContext.Dispose();
                _workFlowLogContext.Dispose();
                _purchaseOrderItemContext.Dispose();
                _supplierPurchaseOrderLogContext.Dispose();
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




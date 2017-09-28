using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.Global
{
    public class MerchantDataRepository : IMerchantDataRepository
    {
        #region "Private Member(s)"

        private readonly IDataRepository<Role> _roleContext;
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<RolePermission> _rolePermissionDataRepository;
        private readonly IDataRepository<ChildPermission> _childPermissionDataRepository;
        private readonly IDataRepository<ParentPermission> _parentPermissionDataRepository;
        private readonly IDataRepository<CompanyDetail> _companyDataRepository;
        private readonly IDataRepository<BranchDetail> _branchDataRepository;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDataRepository;

        #endregion


        public MerchantDataRepository(IErrorLog errorLog, IDataRepository<Role> roleContext, IDataRepository<UserDetail> userDetailContext, IDataRepository<RolePermission> rolePermissionDataRepository, IDataRepository<ChildPermission> childPermissionDataRepository, IDataRepository<ParentPermission> parentPermissionDataRepository, IDataRepository<CompanyDetail> companyDataRepository, IDataRepository<BranchDetail> branchDataRepository, IDataRepository<WorkFlowDetail> workFlowDataRepository)
        {
            _roleContext = roleContext;
            _errorLog = errorLog;
            _userDetailContext = userDetailContext;
            _rolePermissionDataRepository = rolePermissionDataRepository;
            _childPermissionDataRepository = childPermissionDataRepository;
            _parentPermissionDataRepository = parentPermissionDataRepository;
            _companyDataRepository = companyDataRepository;
            _branchDataRepository = branchDataRepository;
            _workFlowDataRepository = workFlowDataRepository;
        }

        /// <summary>
        /// this method is used to get permission by the role id.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public Permission GetPermissionByRoleId(int roleId, int companyId)
        {
            try
            {
                var permissionlist = new List<PermissionAc>();
                Permission permission = new Permission();
                foreach (var permissionObject in _parentPermissionDataRepository.GetAll().ToList())
                {
                    var tree = new PermissionAc
                    {
                        PermissionId = permissionObject.Id,
                        Name = permissionObject.Name,
                        Children = ChildPermission(permissionObject.Id)
                    };
                    foreach (var childPermission in tree.Children)
                    {
                        foreach (var rolePermission in _rolePermissionDataRepository.Fetch(x => x.RoleId == roleId && x.CompanyId == companyId).ToList())
                        {
                            if (childPermission.PermissionId == rolePermission.ChildPermissionId)
                            {
                                childPermission.IsChecked = true;
                                switch (rolePermission.ChildPermission.Name)
                                {
                                    case StringConstants.AllowManageSystemParameter:
                                        permission.IsAllowManageSystemParameter = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AllowManageCategory:
                                        permission.IsAllowManageCategory = rolePermission.IsChecked;
                                        break;

                                    case StringConstants.StopItemOffer:
                                        permission.IsAllowedToStopItemOffer = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ResumeItemOffer:
                                        permission.IsAllowedToResumeItemOffer = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CreateNewCustomer:
                                        permission.IsAllowToCreateCustomerProfile = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.Review:
                                        permission.IsAllowToReview = rolePermission.IsChecked;
                                        break;
                                    //case StringConstants.Closed:
                                    //    permission.IsAllowToDeleteCustomer = rolePermission.IsChecked;
                                    //    break;
                                    case StringConstants.CreateNewItemProfile:
                                        permission.IsAllowToCreateItemProfile = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.EditItemProfile:
                                        permission.IsAllowToEditItemProfile = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.DeleteItemProfile:
                                        permission.IsAllowToDeleteItemProfile = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ChangeMainItem:
                                        permission.IsAllowChangeMainItem = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ConvertMainItem:
                                        permission.IsAllowConvertToMainItem = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CreateSupplier:
                                        permission.IsAllowToCreateSupplierProfile = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.EditSupplier:
                                        permission.IsAllowToEditSupplierProfile = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.DeleteSupplier:
                                        permission.IsAllowToDeleteSupplier = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CreateItemOffer:
                                        permission.IsAllowCreateItemOffer = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CreateItemOfferApproval:
                                        permission.IsAllowItemOfferApproval = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CustomerApproval:
                                        permission.IsAllowCustomerApproval = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CreateSupplierPurchaseOrder:
                                        permission.IsAllowToCreateSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.DeleteSupplierPurchaseOrder:
                                        permission.IsAllowToDeleteSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ApprovalSPO:
                                        permission.IsAllowToApprovalSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.RejectSPO:
                                        permission.IsAllowToRejectSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;

                                    case StringConstants.ReviewSPO:
                                        permission.IsAllowToReviewSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.SendSPO:
                                        permission.IsAllowToSendSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;

                                    case StringConstants.VerifySPO:
                                        permission.IsAllowToVerifySupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.EditSupplierPurchaseOrder:
                                        permission.IsAllowToEditSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ResubmitSPO:
                                        permission.IsAllowToResubmitSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;

                                    case StringConstants.CreateSPOForOtherBranch:
                                        permission.IsAllowToCreateSupplierPurchaseOrderForOtherBranch = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CancelSPO:
                                        permission.IsAllowToCancelSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ApproveCancelSPO:
                                        permission.IsAllowToApproveCancelSupplierPurchaseOrder = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.Reconciled:
                                        permission.IsReconciled = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReturnBill:
                                        permission.IsReturnBillApproval = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CreateCPO:
                                        permission.IsAllowedToCreateCPO = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.CancelCPO:
                                        permission.IsAllowedToCancelCPO = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReceiveSPO:
                                        permission.IsAllowedToReceiveSPO = rolePermission.IsChecked;
                                        break;


                                    case StringConstants.InitiateICR:
                                        permission.IsAllowedToInitiateICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ApproveICR:
                                        permission.IsAllowedToApproveICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReviewICR:
                                        permission.IsAllowedToReviewICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.RejectICR:
                                        permission.IsAllowedToRejectICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.EditICR:
                                        permission.IsAllowedToEditICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReturnICR:
                                        permission.IsAllowedToReturnICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InitiateICRForOtherBranches:
                                        permission.IsAllowedToInitiateICRForOtherBranches = rolePermission.IsChecked;
                                        break;


                                    case StringConstants.InitiateIcr:
                                        permission.IsAllowedToInitiateIncidentReport = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AllowRecovery:
                                        permission.IsAllowRecovery = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InitiateStockInventory:
                                        permission.IsAllowToInitiateIssueStockInventory = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InventroyStart:
                                        permission.IsAllowInventoryStart = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InventoryRecord:
                                        permission.IsAllowInventoryRecord = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReviewStockInventory:
                                        permission.IsAllowReviewStockInventory = rolePermission.IsChecked;
                                        break;

                                    case StringConstants.PaySPO:
                                        permission.IsAllowedToPaySPO = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AddIcrApprovalWorkFlow:
                                        permission.IsAllowedToAddApprovalWorkFlowForICR = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ResetIncidentReportRequest:
                                        permission.IsResetIncidentReportRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InitiateSupplierReturnRequest:
                                        permission.IsAllowToInitiateSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ResubmitSupplierReturnRequest:
                                        permission.IsAllowToResubmitSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.EditSupplierReturnRequest:
                                        permission.IsAllowToEditSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ApproveSupplierReturnRequest:
                                        permission.IsAllowToApproveSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReturnSupplierReturnRequest:
                                        permission.IsAllowToReturnSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.RejectSupplierReturnRequest:
                                        permission.IsAllowToRejectSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.DeleteSupplierReturnRequest:
                                        permission.IsAllowToDeleteSupplierReturnRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.DestructionItemRequest:
                                        permission.IsDestructionItemRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.UnmatchedItem:
                                        permission.IsAllowUnmatchedItemRecover = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AllowDestructionToAnotherBranch:
                                        permission.IsAllowToDestructionItemAnotherBranch = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AllowRejectItemDestructionRequest:
                                        permission.IsAllowRejectItemDestructionRequest = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AllowToDeleteItemOffer:
                                        permission.IsAllowToDeleteItemOffer = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AllowUpdateItemOffer:
                                        permission.IsAllowToUpdateItemOffer = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InitiateTransferGoodRequest:
                                        permission.IsAllowToInitiateIntrenalTransferGood = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.AccessAllBranch:
                                        permission.IsAllowToAccessAllBranch = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReslovedUnmatchedItem:
                                        permission.IsAllowToReslovedUnmatchedItem = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.InventoryReRecord:
                                        permission.IsAllowToReRecordIssueInventory = rolePermission.IsChecked;
                                        break;
                                    case StringConstants.ReceiveInternalTransferGood:
                                        permission.IsAllowToReceiveIntranalTransferGood = rolePermission.IsChecked;
                                        break;

                                }
                            }
                        }
                    }
                    permissionlist.Add(tree);
                    permission.RoleId = roleId;
                }
                //if (permissionlist.Count > 0)
                //{
                //    foreach (var item in permissionlist)
                //    {
                //        foreach (var childItem in item.Children)
                //        {
                //            if (!string.IsNullOrEmpty(childItem.Name))
                //            {
                //                switch (childItem.Name)
                //                {
                //                    case StringConstants.CreateNewCustomer:
                //                        permission.IsAllowToCreateCustomerProfile = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.EditCustomerInformation:
                //                        permission.IsAllowToEditCustomerProfile = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.DeleteCustomerInformation:
                //                        permission.IsAllowToDeleteCustomer = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.CreateNewItemProfile:
                //                        permission.IsAllowToCreateItemProfile = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.EditItemProfile:
                //                        permission.IsAllowToEditItemProfile = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.DeleteItemProfile:
                //                        permission.IsAllowToDeleteItemProfile = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.ChangeMainItem:
                //                        permission.IsAllowChangeMainItem = childItem.IsChecked;
                //                        break;
                //                    case StringConstants.ConvertMainItem:
                //                        permission.IsAllowConvertToMainItem = childItem.IsChecked;
                //                        break;
                //                }
                //            }
                //        }
                //    }
                //    permission.RoleId = roleId;
                //}
                return permission;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int GetRoleIdByCustomerName(string userName)
        {
            try
            {
                var user = _userDetailContext.FirstOrDefault(x => x.UserName == userName);
                return user.RoleId;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        public void Dispose()
        {
            _roleContext.Dispose();
            _userDetailContext.Dispose();
        }

        /// <summary>
        /// this method is used to get all child permission
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<PermissionAc> ChildPermission(int id)
        {
            var permissionlist = new List<PermissionAc>();
            var childPermission = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == id).ToList();
            var list = _childPermissionDataRepository.Fetch(x => x.ParentPermissionId == null && !x.IsClosed).ToList();
            childPermission.AddRange(list);
            foreach (var permission in childPermission)
            {
                var permissionAc = new PermissionAc();
                permissionAc.PermissionId = permission.Id;
                permissionAc.Name = permission.Name;
                permissionAc.IsChecked = permission.IsChecked;
                permissionlist.Add(permissionAc);
            }
            return permissionlist;
        }

        public CompanyDetail GetCompanyDetailByUserId(string userId)
        {
            try
            {
                var userDetail = _companyDataRepository.GetAll().Where(x => x.UserId == userId).FirstOrDefault();
                return userDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public int GetBranchId(string userId)
        {
            try
            {
                var branchId = _userDetailContext.FirstOrDefault(x => x.UserId == userId);
                var companyID = _branchDataRepository.GetById(branchId.BranchId);
                return companyID.CompanyId;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public CompanyDetail GetCompanyDetail(int companyId)
        {
            try
            {

                var companyDetails = _companyDataRepository.GetById(companyId);
                return companyDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public List<WorkFlowActivityAc> WorkFlowDetails(int companyId, int roleId)
        {
            try
            {
                var workFLowCollection = new List<WorkFlowActivityAc>();
                var workFlow = _workFlowDataRepository.Fetch(x => x.CompanyId == companyId && x.InitiatorId == roleId).ToList();
                foreach (var workFlowDetails in _workFlowDataRepository.Fetch(x => x.CompanyId == companyId && x.InitiatorId == roleId).ToList())
                {
                    var workFlowActivityAc = new WorkFlowActivityAc();
                    workFlowActivityAc.WorkFlowId = workFlowDetails.Id;
                    workFlowActivityAc.WorkFlowNameId = workFlowDetails.WorkFlowId;
                    workFlowActivityAc.WorkFlowName = workFlowDetails.ParentPermission.Name;
                    workFlowActivityAc.ActivityId = workFlowDetails.ActivityId;
                    workFlowActivityAc.ActivityName = workFlowDetails.Activity.Name;
                    workFlowActivityAc.RoleFromId = workFlowDetails.InitiatorId;
                    workFlowActivityAc.RoleFromName = workFlowDetails.InitiatorRole.RoleName;
                    workFlowActivityAc.RoleToId = workFlowDetails.AssignedId;
                    workFlowActivityAc.RoleToName = workFlowDetails.AssignedRole.RoleName;
                    //workFlowActivityAc.OldStatus = workFlowDetails.OldStatus.Name;
                    //workFlowActivityAc.NewStatus = workFlowDetails.NewStatus.Name;
                    //workFlowActivityAc.IsInitial = workFlowDetails.OldStatus.IsInitial;
                    //workFlowActivityAc.IsClosed = workFlowDetails.NewStatus.IsClosed;
                    //workFlowActivityAc.OldStatusId = workFlowDetails.OldStatusId;
                    //workFlowActivityAc.NewStatusId = workFlowDetails.NewStatusId;
                    workFlowActivityAc.IsApproval = workFlowDetails.IsApproval;
                    workFlowActivityAc.IsReview = workFlowDetails.IsReview;
                    // workFlowActivityAc.Action = workFlowDetails.WorkFlowAction.Name;
                    //workFlowActivityAc.RoleToId = workFlowDetails.RoleTo.RoleName;
                    workFLowCollection.Add(workFlowActivityAc);
                }
                return workFLowCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public UserDetail GetUserDetails(string UserId)
        {
            try
            {
                return _userDetailContext.FirstOrDefault(x => x.UserId == UserId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }
    }
}

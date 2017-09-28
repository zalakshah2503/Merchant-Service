using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Global
{
    public class Permission
    {
        public int RoleId { get; set; }
        /// <summary>
        /// is allow to create customer information
        /// </summary>
        public bool IsAllowToCreateCustomerProfile { get; set; }
        /// <summary>
        /// its allow to edit customer information
        /// </summary>
        public bool IsAllowToEditCustomerProfile { get; set; }
        /// <summary>
        /// its allow to delete customer profile.
        /// </summary>
        public bool IsAllowToDeleteCustomer { get; set; }

        /// <summary>
        /// its allow to create item profile.
        /// </summary>
        public bool IsAllowToCreateItemProfile { get; set; }

        /// <summary>
        /// its allow to edit item profile.
        /// </summary>
        public bool IsAllowToEditItemProfile { get; set; }

        /// <summary>
        /// its allow to delete item profile.
        /// </summary>
        public bool IsAllowToDeleteItemProfile { get; set; }

        /// <summary>
        /// its allow convert to main item.
        /// </summary>
        public bool IsAllowConvertToMainItem { get; set; }

        /// <summary>
        /// its allow change main item.
        /// </summary>
        public bool IsAllowChangeMainItem { get; set; }

        /// <summary>
        /// is allow to create supplier profile
        /// </summary>
        public bool IsAllowToCreateSupplierProfile { get; set; }
        /// <summary>
        /// its allow to edit supplier profile
        /// </summary>
        public bool IsAllowToEditSupplierProfile { get; set; }
        /// <summary>
        /// its allow to delete supplier profile
        /// </summary>
        public bool IsAllowToDeleteSupplier { get; set; }

        /// <summary>
        /// its allow to item offer add
        /// </summary>
        public bool IsAllowCreateItemOffer { get; set; }

        /// <summary>
        /// its allow to is approval for approve and reject
        /// </summary>
        public bool IsAllowItemOfferApproval { get; set; }

        /// <summary>
        /// it allow to approv or reject the request.
        /// </summary>
        public bool IsAllowCustomerApproval { get; set; }

        /// <summary>
        /// is allow to create Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToCreateSupplierPurchaseOrder { get; set; }
        /// <summary>
        /// its allow to edit Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToEditSupplierPurchaseOrder { get; set; }

        /// <summary>
        /// its allow to edit Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToResubmitSupplierPurchaseOrder { get; set; }

        /// <summary>
        /// its allow to delete Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToDeleteSupplierPurchaseOrder { get; set; }
        /// <summary>
        /// is allow to approve Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToApprovalSupplierPurchaseOrder { get; set; }
        /// <summary>
        /// is allow to reject Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToRejectSupplierPurchaseOrder { get; set; }
        /// <summary>
        /// is allow to review Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToReviewSupplierPurchaseOrder { get; set; }

        /// <summary>
        /// its to allow to verify Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToVerifySupplierPurchaseOrder { get; set; }


        /// <summary>
        /// is allow to approve Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToSendSupplierPurchaseOrder { get; set; }

        /// <summary>
        /// its allow to create Supplier PurchaseOrder for other branches
        /// </summary>
        public bool IsAllowToCreateSupplierPurchaseOrderForOtherBranch { get; set; }

        /// <summary>
        /// its allow to cancel Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToCancelSupplierPurchaseOrder { get; set; }

        /// <summary>
        /// its allow to approve cancel Supplier PurchaseOrder
        /// </summary>
        public bool IsAllowToApproveCancelSupplierPurchaseOrder { get; set; }

        /// <summary>
        /// its allow to approve for return bill
        /// </summary>
        public bool IsReturnBillApproval { get; set; }

        /// <summary>
        /// its allow to review 
        /// </summary>
        public bool IsAllowToReview { get; set; }

        /// <summary>
        /// its allow to reconciled by bs
        /// </summary>
        public bool IsReconciled { get; set; }

        /// <summary>
        /// its allow to create CPO
        /// </summary>
        public bool IsAllowedToCreateCPO { get; set; }

        /// <summary>
        /// its allow to cancel CPO
        /// </summary>
        public bool IsAllowedToCancelCPO { get; set; }

        /// <summary>
        /// its allow to receive SPO
        /// </summary>
        public bool IsAllowedToReceiveSPO { get; set; }

        /// <summary>
        /// its allow to pay SPO
        /// </summary>
        public bool IsAllowedToPaySPO { get; set; }

        /// <summary>
        /// its allow to Initiate ICR
        /// </summary>
        public bool IsAllowedToInitiateICR { get; set; }

        /// <summary>
        /// its allow to Initiate ICR
        /// </summary>
        public bool IsAllowedToApproveICR { get; set; }
        /// <summary>
        /// its allow to Initiate ICR
        /// </summary>
        public bool IsAllowedToReviewICR { get; set; }

        /// <summary>
        /// its allow to Initiate ICR
        /// </summary>
        public bool IsAllowedToReturnICR { get; set; }

        /// <summary>
        /// its allow to Initiate ICR
        /// </summary>
        public bool IsAllowedToRejectICR { get; set; }

        /// <summary>
        /// its allow to Initiate ICR
        /// </summary>
        public bool IsAllowedToEditICR { get; set; }


        /// <summary>
        /// its allow to Initiate ICR For Other Branches
        /// </summary>
        public bool IsAllowedToInitiateICRForOtherBranches { get; set; }

        /// <summary>
        /// its allow to Add Approval WorkFlow for ICR
        /// </summary>
        public bool IsAllowedToAddApprovalWorkFlowForICR { get; set; }

        /// <summary>
        /// its allow Initiate Incident report
        /// </summary>
        public bool IsAllowedToInitiateIncidentReport { get; set; }

        /// <summary>
        /// its allow to recver incident report
        /// </summary>
        public bool IsAllowRecovery { get; set; }

        /// <summary>
        /// its allow to review issue stock inventory
        /// </summary>
        public bool IsAllowReviewStockInventory { get; set; }

        /// <summary>
        /// its allow to record issue inventory
        /// </summary>
        public bool IsAllowInventoryRecord { get; set; }

        /// <summary>
        /// its allow to start issue inventory Process
        /// </summary>
        public bool IsAllowInventoryStart { get; set; }
        /// <summary>
        /// its allow to initiate issue stock inventory
        /// </summary>
        public bool IsAllowToInitiateIssueStockInventory { get; set; }

        //to allow for reset incident report
        public bool IsResetIncidentReportRequest { get; set; }

        /// <summary>
        /// its allow to intitiate Supplier Return Request APPROVAL BY PM
        /// </summary>
        public bool IsAllowToInitiateSupplierReturnRequest { get; set; }
        /// <summary>
        /// its allow to intitiate Supplier Return Request APPROVAL BY PM
        /// </summary>
        public bool IsAllowToResubmitSupplierReturnRequest { get; set; }

        ///// <summary> 
        ///// its allow to intitiate Supplier Return Request APPROVAL BY PA
        ///// </summary>
        //public bool IsAllowToInitiateSupplierReturnRequestApprovalByPA { get; set; }

        /// <summary>
        /// its allow to approve Supplier Return Request
        /// </summary>
        public bool IsAllowToApproveSupplierReturnRequest { get; set; }

        /// <summary>
        /// its allow to reject Supplier Return Request
        /// </summary>
        public bool IsAllowToRejectSupplierReturnRequest { get; set; }

        /// <summary>
        /// its allow to delete Supplier Return Request
        /// </summary>
        public bool IsAllowToDeleteSupplierReturnRequest { get; set; }

        /// <summary>
        /// its allow to return Supplier Return Request
        /// </summary>
        public bool IsAllowToReturnSupplierReturnRequest { get; set; }

        /// <summary>
        /// its allow to edit Supplier Return Request
        /// </summary>
        public bool IsAllowToEditSupplierReturnRequest { get; set; }

        //to allow for destruction item request
        public bool IsDestructionItemRequest { get; set; }

        //to allow unmatched item recover
        public bool IsAllowUnmatchedItemRecover { get; set; }

        //to allow to destruction another branch
        public bool IsAllowToDestructionItemAnotherBranch { get; set; }

        //to allow to reject item destruction request.
        public bool IsAllowRejectItemDestructionRequest { get; set; }

        //to allow to set delete item offer.
        public bool IsAllowToDeleteItemOffer { get; set; }


        //to allow t oset update item offer.
        public bool IsAllowToUpdateItemOffer { get; set; }

        /// <summary>
        /// its allow to initiate internal transfer good request.
        /// </summary>
        public bool IsAllowToInitiateIntrenalTransferGood { get; set; }

        /// <summary>
        /// its allow to access all branch .
        /// </summary>
        public bool IsAllowToAccessAllBranch { get; set; }

        /// <summary>
        /// its allow to realoved unmatched Item.
        /// </summary>
        public bool IsAllowToReslovedUnmatchedItem { get; set; }

        /// <summary>
        /// its allow to rerecord issue inventory.
        /// </summary>
        public bool IsAllowToReRecordIssueInventory { get; set; }

        public bool IsAllowToReceiveIntranalTransferGood { get; set; }

        public bool IsAllowedToStopItemOffer { get; set; }
        public bool IsAllowedToResumeItemOffer { get; set; }

        /// <summary>
        /// boolean flag to allow manage system parameter
        /// </summary>
        public bool IsAllowManageSystemParameter { get; set; }

        /// <summary>
        /// boolean flag to allow manage category
        /// </summary>
        public bool IsAllowManageCategory { get; set; }
    }
}



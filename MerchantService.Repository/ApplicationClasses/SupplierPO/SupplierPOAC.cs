using MerchantService.DomainModel.Models.Supplier;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public class SupplierPOAC
    {
        public int UserId { get; set; }
        public int Id { get; set; }
        public string InitiationComment { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierCode { get; set; }
        public int? InitiationBranchId { get; set; }
        public string InitiationBranchName { get; set; }
        public int? ParentRecordId { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime IssueDate { get; set; }
        public int? BranchId { get; set; }
        public string BranchName { get; set; }
        public DateTime ReceivingDate { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int SupplierDaysLimit { get; set; }
        public int SupplierTypeId { get; set; }
        public bool IsApproved { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsRejected { get; set; }
        public bool IsReceived { get; set; }
        public int TotalDaysLimit { get; set; }
        public bool IsCashPO { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsCanceled { get; set; }
        public bool IsVerified { get; set; }
        public bool IsPartiallyReceived { get; set; }
        public bool IsSend { get; set; }
        public bool IsCancelApproved { get; set; }
        public WorkFlowLogAC LastLog { get; set; }
        public virtual List<DiscountDaysAC> DiscountDays { get; set; }
        public SupplierProfile SupplierProfile { get; set; }
        public ICollection<SupplierItemAC> SupplierItem { get; set; }
        public ICollection<SPOBranchAC> SPOBranch { get; set; }
        public List<WorkFlowLogAC> WorkFlowLog { get; set; }

    }
}


using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class SupplierPOWorkListAC
    {
        public int UserId { get; set; }
        public int SPOId { get; set; }
        public int SupplierId { get; set; }
        public string Action { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime IssueDate { get; set; }
        public string BranchName { get; set; }
        public int? BranchId { get; set; }
        public bool IsCanceled { get; set; }
        public bool IsSend { get; set; }
        public bool IsCancelApproved { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsApproved { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsRejected { get; set; }
        public bool IsPartiallyReceived { get; set; }
        public List<WorkFlowLogAC> WorkFlowLog { get; set; }
        public bool IsAutomaticSpo { get; set; }
    }
}

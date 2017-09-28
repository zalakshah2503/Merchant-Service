using MerchantService.DomainModel.Models.SupplierPayment;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class SPOReceivingBillAC
    {
        public int BillId { get; set; }
        public string BillNumber { get; set; }
        public decimal Amount { get; set; }
        public int PurchaseOrderId { get; set; }
        public decimal Discount { get; set; }
        public int TotalDaysLimit { get; set; }
        public bool IsPercentageDiscount { get; set; }
        public string BillComment { get; set; }
        public bool IsVerified { get; set; }
        public bool IsPaid { get; set; }
        public bool IsSelected { get; set; }
        public bool IsCashPO { get; set; }
        public bool CanBePaid { get; set; }
        public bool IsWorkFlowNotCreated { get; set; }
        public bool IsICRCreated { get; set; }
        public bool IsICRAlreadyCreated { get; set; }
        public bool IsBillNotFound { get; set; }
        public string PurchaseOrderNo { get; set; }
        public string SupplierName { get; set; }
        public string SupplierType { get; set; }
        public int SupplierId { get; set; }
        public string BranchName { get; set; }
        public DateTime? VerifiedDate { get; set; }
        public int BillDaysLimitDiscount { get; set; }
        public int Days { get; set; }
        //public ICollection<SPOBillDaysLimit> SPOBillDaysLimit { get; set; }
    }
}

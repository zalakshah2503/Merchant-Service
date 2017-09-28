using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.SupplierPurchaseOrder
{
    public class SupplierPurchaseOrder : MerchantServiceBase
    {
        public int UserId { get; set; }
        public int SupplierId { get; set; }
        public int? RecordId { get; set; }
        public int? InitiationBranchId { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCreditPayment { get; set; }
        [CustomAttribute]
        public bool IsNotProcessed { get; set; }
        public int CreditDaysLimit { get; set; }
        public bool IsApproved { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsNotVerified { get; set; }
        public bool IsSubmitted { get; set; }
        public bool IsSend { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsVerified { get; set; }
        public bool IsPaid { get; set; }
        public bool IsReceived { get; set; }
        public bool IsPartiallyReceived { get; set; }
        public bool IsRejected { get; set; }
        public bool IsCanceled { get; set; }
        public bool IsCancelApproved { get; set; }
        public DateTime UpdatedDate { get; set; }
        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("InitiationBranchId")]
        public virtual BranchDetail InitiatorBranch { get; set; }
        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }

        public bool IsAutomaticSpo { get; set; }

    }
}

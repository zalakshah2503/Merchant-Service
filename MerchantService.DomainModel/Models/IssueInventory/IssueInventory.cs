using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.IssueInventory
{
    public class IssueInventory : MerchantServiceBase
    {
        public int BranchId { get; set; }

        public int? RecordId { get; set; }
        public string InventoryNO { get; set; }
        public int? ParamTypeId { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime? CloseDate { get; set; }
        public string Barcode { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
        [CustomAttribute]
        public decimal SystemAmount { get; set; }
        [CustomAttribute]
        public decimal ShelfAmount { get; set; }

        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }

        [ForeignKey("ParamTypeId")]
        public virtual ParamType ParamType { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }
        public bool IsInventoryUnmatched { get; set; }
        public bool IsInitiate { get; set; }
        public bool IsActive { get; set; }
        public bool IsRecord { get; set; }
        public bool IsReview { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsRejected { get; set; }

        public bool IsRerecord { get; set; }

    }
}

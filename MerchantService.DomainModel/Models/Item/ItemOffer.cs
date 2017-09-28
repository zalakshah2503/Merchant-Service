using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.Branch;


namespace MerchantService.DomainModel.Models.Item
{
    public class ItemOffer : MerchantServiceBase
    {

        public int ItemId { get; set; }

        public int RecordId { get; set; }

        public DateTime StartDateTime { get; set; }

        public DateTime EndDateTime { get; set; }

        public int? SupplierId { get; set; }

        public decimal SellPrice { get; set; }

        public decimal SellPriceA { get; set; }

        public decimal SellPriceB { get; set; }

        public decimal SellPriceC { get; set; }

        public decimal SellPriceD { get; set; }

        [CustomAttribute]
        public decimal Discount { get; set; }

        public int QuantityLimit { get; set; }

        public bool IsSupplierInitiate { get; set; }

        public bool IsActive { get; set; }

        public bool IsStop { get; set; }

        [NotMapped]
        [CustomAttribute]
        public int UpperBound { get; set; }

        public bool IsDeleted { get; set; }

        public int? RemainingQuantity { get; set; }

        [NotMapped]
        [CustomAttribute]
        public int LowerBound { get; set; }

        public int? BranchId { get; set; }

        [NotMapped]
        public int intiatedId { get; set; }

        [NotMapped]
        public DateTime StartTime { get; set; }

        [NotMapped]
        public DateTime EndTime { get; set; }

        [NotMapped]
        public string Comment { get; set; }

        [NotMapped]
        public int AvailableQuantity { get; set; }

        [NotMapped]
        public List<BranchAC> BranchList { get; set; }

        [NotMapped]
        public class BranchAC
        {
            public int Id { get; set; }
        }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }
    }
}

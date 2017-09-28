using MerchantService.DomainModel.Models.Global;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Enums;

namespace MerchantService.DomainModel.Models.SupplierPurchaseOrder
{
    public class PurchaseOrderItem : MerchantServiceBase
    {
        public int ItemId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int? SystemParameterId { get; set; }
        /// <summary>
        /// Indicate SPO Receiving Status
        /// </summary>
        public SPOReceivingStatus SPOReceivingStatus { get; set; }

        public int? ICRDetailId { get; set; }
        public int OrderQuantity { get; set; }
        //[NotMapped]
        [CustomAttribute]
        public decimal OrderCostPrice { get; set; }
        public decimal CostPrice { get; set; }
        //[NotMapped]
        //[CustomAttribute]
        public bool IsCashPO { get; set; }
        //[NotMapped]
        //[CustomAttribute]
        public bool DoesSupplierHasCreditNote { get; set; }

        [CustomAttribute]
        public decimal ReceivingCostPrice { get; set; }
        public int FreeQuantity { get; set; }
        public decimal PercentageDiscount { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int ReceivingQuantity { get; set; }
        public decimal BillCostPrice { get; set; }
        public bool IsPercentageDiscount { get; set; }
        public DateTime ReceivingDate { get; set; }
        public bool IsReceived { get; set; }

        [ForeignKey("SystemParameterId")]
        public virtual SystemParameter SystemParameter { get; set; }

        [ForeignKey("PurchaseOrderId")]
        public virtual SupplierPurchaseOrder SupplierPurchaseOrder { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }

    }
}

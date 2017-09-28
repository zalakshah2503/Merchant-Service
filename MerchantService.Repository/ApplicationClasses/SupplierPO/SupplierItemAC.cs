using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Item;
using System;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class SupplierItemAC
    {
        public int ItemId { get; set; }
        public int PurchaseOrderId { get; set; }
        public string Barcode { get; set; }
        public int ActualQuantity { get; set; }
        public int MaxQuantity { get; set; }
        public int BaseUnit { get; set; }
        public string ItemNameEn { get; set; }
        public string FlavourEn { get; set; }
        public string FlavourSl { get; set; }
        public decimal CostPrice { get; set; }
        public decimal OrderCostPrice { get; set; }
        public decimal ReceiveCostPrice { get; set; }
        public decimal BillCostPrice { get; set; }
        public string Code { get; set; }
        public string BranchName { get; set; }
        public int BranchId { get; set; }
        public int? UnitParamTypeId { get; set; }
        public int SupplierDaysLimit { get; set; }
        public int SupplierTypeId { get; set; }
        public int FreeQuantity { get; set; }
        public int OrderQuantity { get; set; }
        public int ReceiveQuantity { get; set; }
        public int ParentRecordId { get; set; }
        public string Type { get; set; }
        public string Comment { get; set; }
        public bool IsIcrGenerated { get; set; }
        public decimal PercentageDiscount { get; set; }
        public SPOReceivingStatus SPOReceivingStatus { get; set; }
        public Category Category { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalOrderPrice { get; set; }
    }
}






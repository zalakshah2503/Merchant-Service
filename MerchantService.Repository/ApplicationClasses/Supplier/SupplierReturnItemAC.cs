
namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class SupplierReturnItemAC
    {
        public int Id { get; set; }
         public int ItemId { get; set; }
        public string ItemNameEn { get; set; }
        public int ReturnQuantity { get; set; }
        public int? ParentItemId { get; set; }
        public decimal OldRequestQuantity { get; set; }
        public int ReturnCauseId { get; set; }
        public string ReturnCause { get; set; }
        public bool IsParentItem { get; set; }
        public bool HasChildItem { get; set; }
        public decimal CostPrice { get; set; }
        public int ActualQuantity { get; set; }
        public int SystemQuantity { get; set; }
        public string Barcode { get; set; }
        public string FlavourEn { get; set; }
        public string FlavourSl { get; set; }
        public decimal UpdateSystemQunatity { get; set; }
        public string Unit { get; set; }
        public int BaseUnit { get; set; }
        public string ItemType { get; set; }
        public int SupplierId { get; set; }
    }
}

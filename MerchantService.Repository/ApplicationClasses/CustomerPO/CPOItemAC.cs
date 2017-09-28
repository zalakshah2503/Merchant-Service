
namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CPOItemAC
    {
        public string ItemName { get; set; }
        public string Flavour { get; set; }
        public string Type { get; set; }
        public int Quantity { get; set; }
        public decimal SellPrice { get; set; }
        public int OrderedOfferQuantity { get; set; }
        public decimal OfferSellPrice { get; set; }
        public decimal ItemTotalCost { get; set; }
        public string Barcode { get; set; }
        public string Unit { get; set; }
        public string Status { get; set; }
    }
}

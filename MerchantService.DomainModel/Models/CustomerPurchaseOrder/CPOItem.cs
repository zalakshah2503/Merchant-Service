using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CustomerPurchaseOrder
{
    public class CPOItem : MerchantServiceBase
    {
        public int CPOId { get; set; }
        public int ItemId { get; set; }
        public string Barcode { get; set; }
        public int Quantity { get; set; }
        public decimal SellPrice { get; set; }
        public decimal CostPrice { get; set; }
        public decimal ItemTotalCost { get; set; }
        public decimal OfferSellPrice { get; set; }
        public int OrderedOfferQuantity { get; set; }
        [ForeignKey("CPOId")]
        public virtual CustomerPurchaseOrder CustomerPurchaseOrder { get; set; }
        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.IssueInventory;
using MerchantService.DomainModel.Models.Item;

namespace MerchantService.Repository.ApplicationClasses.Inventory
{
   public class InventoryUnmatchedItemAc
    {
        public int InventotyUnmatchedId { get; set; }
        public int IssueInventoryId { get; set; }
        public int ItemId { get; set; }
        public bool IsResolved { get; set; }
        public bool IsResolvedLoss { get; set; }
        public bool IsResolvedGain { get; set; }
        public bool IsResolvedAdjust { get; set; }
        public bool IsResolvedDoNothing { get; set; }
        public DateTime ResolveDate { get; set; }
        public string Comments { get; set; }
        public int ResolvedId { get; set; }
        public decimal SystemQuantity { get; set; }
        public decimal ShelfQuantity { get; set; }
       public string Unit { get; set; }
       public string Barcode { get; set; }
       public string ItemName { get; set; }
       public string UnmatchedItemComment { get; set; }
       public bool IsRecover { get; set; }
       public string FlavorName { get; set; }
       public string CategoryName { get; set; }
       public string SupplierName { get; set; }
       public decimal TotalPrice { get; set; }
       public bool IsRerecord { get; set; }
       public bool IsRecord { get; set; }
       public bool IsRerecordDisabled { get; set; }
    }

    public class IssueInventoryUnmatchedItemAc
    {
        public bool IsRerecord { get; set; }

        public List<InventoryUnmatchedItemAc> UnmatchedItemCollection { get; set; }
    }
}

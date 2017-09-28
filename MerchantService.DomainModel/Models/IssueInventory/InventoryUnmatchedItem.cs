using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.IssueInventory
{
    public class InventoryUnmatchedItem : MerchantServiceBase
    {
        public int IssueInventoryId { get; set; }
        public int ItemId { get; set; }
        public bool IsResolved { get; set; }
        public bool IsResolvedLoss { get; set; }
        public bool IsResolvedGain { get; set; }
        public bool IsResolvedAdjust { get; set; }
        public bool IsResolvedDoNothing { get; set; }
        public int? SystemQuantity { get; set; }
        public DateTime ResolveDate { get; set; }
        public string Comments { get; set; }
        [ForeignKey("IssueInventoryId")]
        public virtual IssueInventory IssueInventory { get; set; }
        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
        public string UnmatchedItemComment { get; set; }
        public bool IsRerecord { get; set; }
    }
}

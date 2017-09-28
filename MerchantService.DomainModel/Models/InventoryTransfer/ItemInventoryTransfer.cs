using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.InventoryTransfer
{
    public class ItemInventoryTransfer : MerchantServiceBase
    {
        public int ItemId { get; set; }
        public int InventoryTransferId { get; set; }
        public int RequestQuantity { get; set; }
        public int ReceivingQuantity { get; set; }
        public bool IsReceivedItem { get; set; }

         public bool IsNotReceivedItem { get; set; }
         public bool IsPartialReceivedItem { get; set; }

        [ForeignKey("InventoryTransferId")]
        public virtual InventoryTransfer InventoryTransfer { get; set; }
        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }

        public bool IsRecover { get; set; }
        public int? ResolvedId { get; set; }
        public bool IsUnmatchedItem { get; set; }
        public bool IsWarningMessage { get; set; }
    }
}

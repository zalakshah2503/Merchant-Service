using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.InternalTransferGoods
{
   public class ItemInventoryTransferAc
    {
        public int ItemId { get; set; }
        public int InventoryTransferId { get; set; }
        public int RequestQuantity { get; set; }
        public int OldRequestQuantity { get; set; }
        public int ReceivingQuantity { get; set; }
        public int ItemInventoryTransferId { get; set; }
        public string ItemName { get; set; }
        public string Barcode { get; set; }
        public string Flavour { get; set; }
        public string Unit { get; set; }
        public int TargetBranchQuantity { get; set; }
        public decimal MinimumQunatity { get; set; }
        public int CurrentBranchQuantity { get; set; }
        public decimal Price { get; set; }
        public bool IsAllowRquestQuantityNull { get; set; }
        public bool IsUnmatchedItem { get; set; }

        public bool IsQuantityRequried { get; set; }
        public bool IsReceivedItem { get; set; }
        public bool IsNotReceivedItem { get; set; }
        public bool IsPartialReceivedItem { get; set; }
        public int? ResolvedId { get; set; }
        public int BaseUnitCount { get; set; }
        public bool IsErrorMessage { get; set; }
        public bool IsWarningMesssage { get; set; }

        public int ParentItemId { get; set; }

        public decimal SystemInfo { get; set; }
        public decimal SystemQuantity { get; set; }
        public bool IsSendInventory { get; set; }

        public int TargetBranchQuantityToolTip { get; set; }
        public int CurrentBranchQunatitytoolTip { get; set; }
        public bool IsParentItem { get; set; }

        public decimal UpdateSystemQunatity { get; set; }
    }
}

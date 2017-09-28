using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.Item;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;

namespace MerchantService.DomainModel.Models.ItemChangeRequest
{
    public class IcrDetail : MerchantServiceBase
    {

        public int ItemId { get; set; }
        public int RecordId { get; set; }
        public bool IsPriceChangeRequest { get; set; }
        public int? SPOItemId { get; set; }
        public bool IsPOItemIcr { get; set; }
        public bool IsAddItemIcr { get; set; }
         public bool IsDeleted { get; set; }
        public bool IsRejected { get; set; }
        public bool IsReturned { get; set; }
        public bool IsApproved { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("SPOItemId")]
        public virtual PurchaseOrderItem PurchaseOrderItem { get; set; }

        //added these comment lines to check deployment issues

    }
}

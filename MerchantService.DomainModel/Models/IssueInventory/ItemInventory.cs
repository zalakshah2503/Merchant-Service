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
    public class ItemInventory : MerchantServiceBase
    {
        public int IssueInventoryId { get; set; }
        public int ItemID { get; set; }
        public int SystemQuantity { get; set; }
        public int ShelfQuantity { get; set; }
        [ForeignKey("IssueInventoryId")]
        public virtual IssueInventory IssueInventory { get; set; }

        [ForeignKey("ItemID")]
        public virtual ItemProfile ItemProfile { get; set; }
    }
}

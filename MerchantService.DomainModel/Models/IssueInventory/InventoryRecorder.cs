using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Item;

namespace MerchantService.DomainModel.Models.IssueInventory
{
    public class InventoryRecorder : MerchantServiceBase
    {
        public int IssueInventoryId { get; set; }
        public int UserId { get; set; }

       public int ItemId { get; set; }
        public int RecordedQuantity { get; set; }

        [ForeignKey("IssueInventoryId")]
        public virtual IssueInventory IssueInventory { get; set; }

        [ForeignKey("UserId")]
        public virtual UserDetail UserDetail { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
    }
}

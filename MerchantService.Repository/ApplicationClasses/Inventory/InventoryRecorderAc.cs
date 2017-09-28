using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.IssueInventory;
using MerchantService.DomainModel.Models.Item;

namespace MerchantService.Repository.ApplicationClasses.Inventory
{
   public class InventoryRecorderAc
    {
        public int IssueInventoryId { get; set; }
        public string UserName { get; set; }
        public int ItemId { get; set; }
        public int RecordedQuantity { get; set; }
        public decimal Process { get; set; }

    }
}

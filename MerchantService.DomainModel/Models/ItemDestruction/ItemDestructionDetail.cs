using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.ItemDestruction
{
    public class ItemDestructionDetail : MerchantServiceBase
    {
        public int DestructionId { get; set; }

        public int ItemId { get; set; }

        public int DestructionQuantity { get; set; }

        public decimal CostPrice { get; set; }

         [ForeignKey("DestructionId")]
         public virtual Destruction Desturction { get; set; }
         [ForeignKey("ItemId")]
         public virtual ItemProfile ItemProfile { get; set; }
    }
}

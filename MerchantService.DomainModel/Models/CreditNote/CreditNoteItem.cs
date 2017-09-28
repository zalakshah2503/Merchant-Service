using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CreditNote
{
    public class CreditNoteItem : MerchantServiceBase
    {
        public int CreditNoteId { get; set; }

        public int ItemId { get; set; }

        public decimal CostPrice { get; set; }

        public int Quantity { get; set; }

         [ForeignKey("CreditNoteId")]
        public virtual CreditNoteDetail CreditNoteDetail { get; set; }

         [ForeignKey("ItemId")]
         public virtual ItemProfile ItemProfile { get; set; }
    }
}

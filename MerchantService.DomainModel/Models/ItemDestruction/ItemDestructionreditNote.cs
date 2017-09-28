using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.ItemDestruction
{
    public class ItemDestructionCreditNote : MerchantServiceBase
    {
        public int DestructionId { get; set; }

        public int CreditNoteId { get; set; }

        [ForeignKey("DestructionId")]
        public virtual Destruction Destruction { get; set; }

        [ForeignKey("CreditNoteId")]
        public virtual CreditNoteDetail CreditNoteDetail { get; set; }
    }
}

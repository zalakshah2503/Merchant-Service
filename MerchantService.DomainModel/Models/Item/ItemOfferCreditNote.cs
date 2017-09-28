using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Supplier;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Item
{
    public class ItemOfferCreditNote : MerchantServiceBase
    {
        public int ItemOfferId { get; set; }

        public int CreditNoteId { get; set; }

        public int SupplierId { get; set; }

        [ForeignKey("ItemOfferId")]
        public virtual ItemOffer ItemOffer { get; set; }
        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }

         [ForeignKey("CreditNoteId")]
        public virtual CreditNoteDetail CreditNoteDetail { get; set; }
    }
}

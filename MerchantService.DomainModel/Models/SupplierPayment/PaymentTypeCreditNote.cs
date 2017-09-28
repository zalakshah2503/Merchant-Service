using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierPayment
{
    public class PaymentTypeCreditNote : MerchantServiceBase
    {
        public int CreditNoteId { get; set; }
        public decimal Amount { get; set; }
        public int PaymentTypeId { get; set; }

        [ForeignKey("CreditNoteId")]
        public virtual CreditNoteDetail CreditNoteDetail { get; set; }

         [ForeignKey("PaymentTypeId")]
        public virtual PaymentType PaymentType { get; set; }
    }
}

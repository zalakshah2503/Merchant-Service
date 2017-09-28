using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SupplierPayment;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CreditNote
{
    public class CreditNotePayment : MerchantServiceBase
    {
        public int CreditNoteId { get; set; }

        public int SupplierPaymentId { get; set; }

        [ForeignKey("CreditNoteId")]
        public virtual CreditNoteDetail CreditNoteDetail { get; set; }

        [ForeignKey("SupplierPaymentId")]
        public virtual SupplierPaymentDetail SupplierPaymentDetail { get; set; }
    }
}

using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierReturn
{
    public class SupplierReturnCreditNote : MerchantServiceBase
    {
        public int CreditNoteId { get; set; }

        public int SuppierReturnId { get; set; }

        [ForeignKey("CreditNoteId")]
        public virtual CreditNoteDetail CreditNoteDetail { get; set; }

        [ForeignKey("SuppierReturnId")]
        public virtual SupplierReturnDetail SupplierReturnDetail { get; set; }   
    }
}

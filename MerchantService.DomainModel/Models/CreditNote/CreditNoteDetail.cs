using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CreditNote
{
    public class CreditNoteDetail : MerchantServiceBase
    {
        public string CreditNoteNo { get; set; }
        public int? RecevingCreditNotePaymentId { get; set; }
        public int? BranchId { get; set; }
        public int TypeId { get; set; }
        public decimal Amount { get; set; }
        public decimal RemainigAmount { get; set; }
        public bool IsCollected { get; set; }
        [NotMapped]
        public decimal ActualAmount { get; set; }
        public DateTime InitiationDate { get; set; }
        public string InitiationComment { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }

        [ForeignKey("TypeId")]
        public virtual ParamType ParamType { get; set; }

        [ForeignKey("RecevingCreditNotePaymentId")]
        public virtual RecevingCreditNotePaymentDetail RecevingCreditNotePaymentDetail { get; set; }
    }
}

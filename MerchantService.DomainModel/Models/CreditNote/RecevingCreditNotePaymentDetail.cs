using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CreditNote
{
    public class RecevingCreditNotePaymentDetail : MerchantServiceBase
    {
        public decimal ChequeAmount { get; set; }
        public decimal CashAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string VoucherNo { get; set; }
        public string ChequeNo { get; set; }
        public string Comments { get; set; }

    }
}

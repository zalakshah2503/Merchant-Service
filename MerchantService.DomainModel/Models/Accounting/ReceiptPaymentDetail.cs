using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class ReceiptPaymentDetail : MerchantServiceBase
    {

        
        public int ReceiptPaymentId { get; set; }
        public int LedgerId { get; set; }
       public decimal Amount { get; set; }
        

       [ForeignKey("ReceiptPaymentId")]
       public virtual ReceiptPaymentVoucher ReceiptPaymentVoucher { get; set; }

       [ForeignKey("LedgerId")]
       public virtual Ledgers Ledgers { get; set; } 

    }
}

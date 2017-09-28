using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
   public class ReceiptPaymentDetailAC
    {
       public int ReceiptPaymentDetailId { get; set; }

       public int ReceiptPaymentVoucherId { get; set; }

       public int LedgerId { get; set; }

       public decimal Amount { get; set; }
   
    }
}

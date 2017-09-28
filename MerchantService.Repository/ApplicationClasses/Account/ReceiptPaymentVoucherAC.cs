using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
   public class ReceiptPaymentVoucherAC
    {
       public int ReceiptPaymentId { get; set; }

       public int BranchId { get; set; }

       public int AccountId { get; set; }

       public decimal TotalAmount { get; set; }

       public string Narration { get; set; }

       public string ChequeNo { get; set; }
       public string BankName { get; set; }
       public string BankBranch { get; set; }
       public DateTime? ChequeDate { get; set; }

       public int ParamTypeId { get; set; }
       //LedgerId used for Bank Transcation
       public int ReceivedFromId { get; set; }

       public bool IsReceipt { get; set; }

       public int? CompanyId { get; set; }
       public List<ReceiptPaymentDetailAC> ReceiptPaymentDetail { get; set; }
    }
}

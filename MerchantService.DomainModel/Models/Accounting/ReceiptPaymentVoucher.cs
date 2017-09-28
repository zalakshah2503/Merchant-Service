using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class ReceiptPaymentVoucher : MerchantServiceBase
    {
        public string Narration { get; set; }
        public int BranchId { get; set; }
        public int AccountId { get; set; }
        public bool IsReceipt { get; set; }
        public decimal TotalAmount { get; set; }
        public string ChequeNo { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public DateTime? ChequeDate { get; set; }

        public int? ParamTypeId { get; set; }

        //LedgerId
        public int? ReceivedFromId { get; set; }

        public int? companyId { get; set; }

        [ForeignKey("AccountId")]
        public virtual Ledgers Ledgers { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail Branch { get; set; }
        
        
        
    }
}

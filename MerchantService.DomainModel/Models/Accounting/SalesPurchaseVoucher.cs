using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.Branch;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class SalesPurchaseVoucher : MerchantServiceBase
    {
        public int PartyAccountId { get; set; }
        public int LedgerId { get; set; }
        public string ReferenaceNo { get; set; }

        public string SupplierInvoiceNo { get; set; }

        public string Narration { get; set; }

        public decimal TotalAmount { get; set; }

        public bool IsSalesVoucher { get; set; }
        public int? ParamTypeId { get; set; }
        public string ChequeNo { get; set; }

        public string BankName { get; set; }
        public string BankBranch { get; set; }

        public DateTime? CheckDate {get;set;}

        public int BranchId { get; set; }


        public int? CompanyId { get; set; }

        [ForeignKey("PartyAccountId")]

        public virtual Ledgers PartyAccount { get; set; }

        [ForeignKey("LedgerId")]
        public virtual Group Group { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }


    }
}

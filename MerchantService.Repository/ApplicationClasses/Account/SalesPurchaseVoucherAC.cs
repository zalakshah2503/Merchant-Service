using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
   public class SalesPurchaseVoucherAC
    {
       public int SalesPurchaseVoucherId { get; set; }
        public int PartyAccountId { get; set; }
        public int LedgerId { get; set; }
        public string ReferenaceNo { get; set; }

        public string SupplierInvoiceNo { get; set; }

        public string Narration { get; set; }

        public decimal TotalAmount { get; set; }

        public bool IsSalesVoucher { get; set; }
        public int ParamTypeId { get; set; }
        public string ChequeNo { get; set; }

        public string BankName { get; set; }
        public string BankBranch { get; set; }

        public DateTime? CheckDate { get; set; }

        public int BranchId { get; set; }

        public int? CompanyId { get; set; }

        public List<SalesPurchaseDetailAC> SalesPurchaseDetail { get; set; }
    }
}

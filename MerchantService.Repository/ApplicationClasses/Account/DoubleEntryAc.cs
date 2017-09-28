using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
   public class DoubleEntryAc
    {
        public int DoubleEntryId { get; set; }
        public int LedgerId { get; set; }

        public decimal Debit { get; set; }
        public string LedgerName { get; set; }
        public decimal Credit { get; set; }
        public string Description { get; set; }
        public string ActivityName { get; set; }
        public DateTime TransactionDate { get; set; }
    }

    public class AccountingAc
    {
        public decimal TotalDebit { get; set; }
        public decimal TotalCredit { get; set; }

        public IEnumerable<DoubleEntryAc> DoubleEntryAc { get; set; }

       
    }
}

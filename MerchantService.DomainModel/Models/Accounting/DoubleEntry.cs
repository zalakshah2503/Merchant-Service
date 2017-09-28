using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class DoubleEntry : MerchantServiceBase
    {
        public int LedgerId { get; set; }

        public decimal Debit { get; set; }

        public decimal Credit { get; set; }
        public string Description { get; set; }
         public string ActivityName { get; set; }
        public DateTime TransactionDate { get; set; }

        [ForeignKey("LedgerId")]
        public virtual Ledgers Ledger { get; set; }


    }
}

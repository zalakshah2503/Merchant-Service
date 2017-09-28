using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
   public class JournalEntryAc
    {
       public int JournalEntryId { get; set; }
       public int LedgerId { get; set; }
       public decimal DebitAmount { get; set; }
       public decimal CreditAmount { get; set; }
       public string Description { get; set; }
       public DateTime JournalDate { get; set; }

       public List<JournalEntryAc> JournalEntryCollection { get; set; } 
    }
}

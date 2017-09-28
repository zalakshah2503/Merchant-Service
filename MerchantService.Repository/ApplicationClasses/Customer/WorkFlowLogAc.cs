using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Customer
{
   public class WorkFlowLogAc
    {
       public int RecordId { get; set; }
       public bool Status { get; set; }
       public string Comment { get; set; }
    }
}

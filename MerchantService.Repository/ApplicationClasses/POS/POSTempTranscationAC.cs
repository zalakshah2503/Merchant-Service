using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
namespace MerchantService.Repository.ApplicationClasses.POS
{
   public class POSTempTranscationAC
    {
       public int POSTempTransId { get; set; }
       public string Reference { get; set; }
       public DateTime TransDate { get; set; }

       public int CustomerId { get; set; }

       public ObservableCollection<POSTempItemAC> POSTempItemForChild { get; set; }
    }
}

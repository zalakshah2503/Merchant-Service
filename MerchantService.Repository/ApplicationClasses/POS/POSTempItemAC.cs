using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.POS
{
   public class POSTempItemAC
    {
       public int POSTempItemId { get; set; }
       public int ItemId { get; set; }
       public string ItemName { get; set; }
       public string Barcode { get; set; }
       public int Quantity { get; set; }
       public decimal ItemPrice{ get; set; }
       public string ItemFlavor { get; set; }
       public string UnitName { get; set; }

       
    }
}

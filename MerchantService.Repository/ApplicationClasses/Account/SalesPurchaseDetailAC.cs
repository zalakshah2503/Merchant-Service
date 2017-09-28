using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
   public class SalesPurchaseDetailAC
    {
       public int SaelsPurchaseDetailId { get; set; }
        public int ItemId { get; set; }
        public int SalesPurchaseVoucherId { get; set; }
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}

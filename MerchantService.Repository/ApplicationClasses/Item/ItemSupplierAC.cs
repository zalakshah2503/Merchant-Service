using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class ItemSupplierAC
    {
        public int ItemSupplierId { get; set; }
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        public DateTime ItemSupplierCreatedDateTime { get; set; }
    }
}

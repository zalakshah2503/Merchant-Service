using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Supplier;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Item
{
    public class ItemSupplier : MerchantServiceBase
    {
        public bool IsDelete { get; set; }
        public int CategoryId { get; set; }

        public int SupplierId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }
    }
}

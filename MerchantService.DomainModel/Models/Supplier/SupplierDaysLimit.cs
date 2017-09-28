using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Supplier
{
    public class SupplierDaysLimit : MerchantServiceBase
    {
        public int SupplierId { get; set; }    

        public decimal Discount { get; set; }

        public int Days { get; set; }

        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }
    }
}

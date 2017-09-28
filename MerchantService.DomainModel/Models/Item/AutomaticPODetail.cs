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
    public class AutomaticPODetail : MerchantServiceBase
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public int SupplierId { get; set; }
        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }
        public int? InitiatorRoleId { get; set; }

        [ForeignKey("InitiatorRoleId")]
        public virtual Role.Role Roles { get; set; }
    }
}

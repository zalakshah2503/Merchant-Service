using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierPurchaseOrder
{
    public class SupplierPurchaseOrderLog : MerchantServiceBase
    {
        public int PurchaseOrderId { get; set; }
        public int? RecordId { get; set; }
        public string Stage { get; set; }
        public string Action { get; set; }
        public string Comments { get; set; }
        public string RoleName { get; set; }
        public string UserName { get; set; }
        public DateTime ActionDate { get; set; }

        [ForeignKey("PurchaseOrderId")]
        public virtual SupplierPurchaseOrder SupplierPurchaseOrder { get; set; }
    }
}

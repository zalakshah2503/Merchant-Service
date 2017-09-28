using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.CustomAttributes;

namespace MerchantService.DomainModel.Models.SupplierPurchaseOrder
{
    public class PurchaseOrderBranch : MerchantServiceBase
    {
        public int PurchaseOrderId { get; set; }
        public int BranchId { get; set; }

        [NotMapped]
        [CustomAttribute]
        public bool IsDiscountChanged { get; set; }

        [ForeignKey("PurchaseOrderId")]
        public virtual SupplierPurchaseOrder SupplierPurchaseOrder { get; set; }
        [ForeignKey("BranchId")]
        public virtual BranchDetail Branch { get; set; }


    }
}

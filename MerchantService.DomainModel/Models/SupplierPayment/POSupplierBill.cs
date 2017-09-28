using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;


namespace MerchantService.DomainModel.Models.SupplierPayment
{
    public class POSupplierBill : MerchantServiceBase
    {
        public int PurchaseOrderId { get; set; }
        public string BillNumber { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal PresentDiscount { get; set; }
        public int? ICRDetailId { get; set; }
        public bool IsPercentageDiscount { get; set; }
        public int TotalDaysLimit { get; set; }
        public string BillComment { get; set; }
        public bool IsVerified { get; set; }
        public bool IsPaid { get; set; }
        [NotMapped]
        public bool CanBePaid { get; set; }
        public DateTime? VerifiedDate { get; set; }

        [ForeignKey("PurchaseOrderId")]
        public virtual SupplierPurchaseOrder.SupplierPurchaseOrder SupplierPurchaseOrder { get; set; }


    }
}

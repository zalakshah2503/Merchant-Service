using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CustomerPurchaseOrder
{
    public class CPOPayment : MerchantServiceBase
    {
        public int CustomerId { get; set; }
        public int CPOId { get; set; }
        public string VoucherNo { get; set; }
        /// <summary>
        /// Indicate Payment Type
        /// </summary>
        public PaymentMode PaymentMode { get; set; }
        /// <summary>
        /// Indicate Payment Purpose
        /// </summary>
        public Purpose Purpose { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ExcessAmount { get; set; }
        public int InitiatorId { get; set; }
        public string Comment { get; set; }
        [ForeignKey("CPOId")]
        public virtual CustomerPurchaseOrder CustomerPurchaseOrder { get; set; }
        [ForeignKey("CustomerId")]
        public virtual CustomerProfile CustomerProfile { get; set; }
        [ForeignKey("InitiatorId")]
        public virtual UserDetail UserDetail { get; set; }
    }
}

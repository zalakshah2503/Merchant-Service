using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.SupplierPayment
{
    public class POBillPayment : MerchantServiceBase
    {
        public string VoucherNo { get; set; }
        public int SupplierPaymentId { get; set; }
        public int POSupplierBillId { get; set; }

        [ForeignKey("SupplierPaymentId")]
        public virtual SupplierPaymentDetail SupplierPaymentDetail { get; set; }

        [ForeignKey("POSupplierBillId")]
        public virtual POSupplierBill POSupplierBill { get; set; }
    }
}

using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierPayment
{
    public class PaymentType : MerchantServiceBase
    {
        public int SupplierPaymentId { get; set; }
        public int TypeId { get; set; }
        public string ChequeNo { get; set; }
        public decimal Amount { get; set; }

        [ForeignKey("SupplierPaymentId")]
        public virtual SupplierPaymentDetail SupplierPaymentDetail { get; set; }

        [ForeignKey("TypeId")]
        public virtual ParamType ParamType { get; set; }
    }
}

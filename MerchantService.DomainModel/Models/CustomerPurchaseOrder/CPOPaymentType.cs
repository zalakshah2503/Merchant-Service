using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CustomerPurchaseOrder
{
    public class CPOPaymentType : MerchantServiceBase
    {
        public int CustomerPaymentId { get; set; }
        public decimal Amount { get; set; }
        public int PaymentTypeId { get; set; }
        public int ReceiptNo { get; set; }
        [ForeignKey("CustomerPaymentId")]
        public virtual CPOPayment CPOPayment { get; set; }
        [ForeignKey("PaymentTypeId")]
        public virtual ParamType ParamType { get; set; }
    }
}

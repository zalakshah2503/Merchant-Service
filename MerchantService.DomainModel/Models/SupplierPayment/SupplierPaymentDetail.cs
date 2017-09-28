using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierPayment
{
    public class SupplierPaymentDetail : MerchantServiceBase
    {
        public decimal Amount { get; set; }

        public bool IsPOBillPayment { get; set; }
    }
}

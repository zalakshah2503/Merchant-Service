using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Enums
{
    public enum POSBillPaymentType
    {
        Cash = 56,
        DebitCard = 57,
        CreditCard = 58,
        Coupon = 59,
        CreditAccount=60,
        Cheque=61,
        DownPayment = 87
    }
}

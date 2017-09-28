using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CustomerPurchaseOrder
{
    public class CPODownPayment : MerchantServiceBase
    {
      //  public int CPOId { get; set; }
        public int CustomerPaymentID { get; set; }
        public decimal Amount { get; set; }
        //[ForeignKey("CPOId")]
        //public virtual CustomerPurchaseOrder CustomerPurchaseOrder { get; set; }
        [ForeignKey("CustomerPaymentID")]
        public virtual CPOPayment CPOPayment { get; set; }
    }
}

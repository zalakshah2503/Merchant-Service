using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.POS;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CustomerPurchaseOrder
{
    public class CPOBill : MerchantServiceBase
    {
        public int CPOId { get; set; }
        public int POSBillId { get; set; }

        [ForeignKey("CPOId")]
        public virtual CustomerPurchaseOrder CustomerPurchaseOrder { get; set; }
        [ForeignKey("POSBillId")]
        public virtual POSBill POSBill { get; set; }
    }
}

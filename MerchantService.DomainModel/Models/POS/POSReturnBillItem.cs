using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSReturnBillItem : MerchantServiceBase
    {
        public int ReturnedBillID { get; set; }
        public int POSBiillItemID { get; set; }
        public int ReturnedQuantity { get; set; }

        public bool IsDeleted { get; set; }

        [ForeignKey("ReturnedBillID")]
        public virtual POSReturnBill POSReturnBill { get; set; }

        [ForeignKey("POSBiillItemID")]
        public virtual POSBillItem POSBillItem { get; set; }

    }
}

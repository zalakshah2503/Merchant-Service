using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSBillItem : MerchantServiceBase
    {
        public int BillID { get; set; }
        public int ItemID { get; set; }
        public int Quantity { get; set; }
        public decimal SellPrice { get; set; }
        public decimal WeightedCostPrice { get; set; }
        public int ReturnedQuantity { get; set; }

        [ForeignKey("BillID")]
        public virtual POSBill POSBill { get; set; }
        [ForeignKey("ItemID")]
        public virtual ItemProfile ItemProfile { get; set; }

    }
}

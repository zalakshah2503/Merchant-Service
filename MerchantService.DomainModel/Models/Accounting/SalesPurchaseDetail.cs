using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class SalesPurchaseDetail : MerchantServiceBase
    {
        
        public int ItemId { get; set; }
        public int SalesPurchaseVoucherId { get; set; }
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
        [ForeignKey("SalesPurchaseVoucherId")]
        public virtual SalesPurchaseVoucher SalesPurchaseVoucher { get; set; }
    }
}

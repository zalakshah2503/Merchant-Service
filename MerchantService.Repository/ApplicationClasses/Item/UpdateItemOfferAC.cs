using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class UpdateItemOfferAC
    {
        public int Id { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string Comment { get; set; }
        public decimal SellPrice { get; set; }
        public decimal SellPriceA { get; set; }
        public decimal SellPriceB { get; set; }
        public decimal SellPriceC { get; set; }
        public decimal SellPriceD { get; set; }
        public decimal QuantityLimit { get; set; }
        public int Discount { get; set; }
    }
}

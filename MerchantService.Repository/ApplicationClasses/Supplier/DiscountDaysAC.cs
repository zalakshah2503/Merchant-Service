using System;

namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class DiscountDaysAC
    {
        public int SupplierId { get; set; }      
        public decimal Discount { get; set; }
        public int Days { get; set; }
        public DateTime CreatedDateTime { get; set; }
    }
}

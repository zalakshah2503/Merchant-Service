using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class SupplierProfileAC
    {
        // supplier
        public int Id { get; set; }
        public string Code { get; set; }
        public string NameEn { get; set; }
        public string NameSl { get; set; }
        public string AddressEn { get; set; }
        public string AddressSl { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string ZipCode { get; set; }
        public string POBox { get; set; }
        public int TotalDaysLimit { get; set; }
        public int SupplierTypeId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
        public bool IsAcceptReturnForExpiredItem { get; set; }
        public DateTime CreatedDateTime { get; set; }

        public int SupplierProfileId { get; set; }
        public decimal Discount { get; set; }
        public int Days { get; set; }
        public virtual ICollection<DiscountDaysAC> DiscountDays { get; set; }


    }
}

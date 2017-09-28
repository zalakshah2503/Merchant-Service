using System;

namespace MerchantService.Repository.ApplicationClasses.Supplier
{
   public class ContactPersonAC
    {
        public int ContactId { get; set; }
        public int SupplierId { get; set; }
        public string ContactNameEn { get; set; }
        public string ContactNameSl { get; set; }
        public string JobTitleEn { get; set; }
        public string JobTitleSl { get; set; }
        public string ContactAddressEn { get; set; }
        public string ContactAddressSl { get; set; }
        public string ContactPhone { get; set; }
        public string PhoneExtension { get; set; }
        public string ContactEmail { get; set; }
        public string ContactFax { get; set; }
        public bool ContactIsDeleted { get; set; }
        public DateTime ContactCreatedDateTime { get; set; }

    }
}


  
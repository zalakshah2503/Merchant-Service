using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Supplier
{
    public class SupplierContactPerson : MerchantServiceBase
    {
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


        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }
    }
}

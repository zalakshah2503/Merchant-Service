using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Item
{
    public class Category : MerchantServiceBase
    {
        [NotMapped]
        public int SupplierCount { get; set; }
        [NotMapped]
        public virtual ICollection<ItemSupplier> ItemSupplier { get; set; }
        public bool IsDelete { get; set; }
        public int GroupParamTypeId { get; set; }
        public int BrandParamTypeId { get; set; }

        public int CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
        [ForeignKey("GroupParamTypeId")]
        public virtual SystemParameter GroupParamType { get; set; }
        [ForeignKey("BrandParamTypeId")]
        public virtual SystemParameter BrandParamType { get; set; }
    }
}

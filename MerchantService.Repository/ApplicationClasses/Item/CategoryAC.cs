using MerchantService.DomainModel.Models.Item;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class CategoryAC
    {
        public int CategoryId { get; set; }
        public int GroupParamTypeId { get; set; }
        public int BrandParamTypeId { get; set; }
        public int SupplierId { get; set; }
        public int SupplierCount { get; set; }
        public DateTime CategoryCreatedDateTime { get; set; }
        public virtual ICollection<ItemSupplier> ItemSupplier { get; set; }
        public string BrandName { get; set; }
        public string GroupName { get; set; }
        public string CategoryName { get; set; }
    }
}

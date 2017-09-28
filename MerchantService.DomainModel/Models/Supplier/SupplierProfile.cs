using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Supplier
{
    public class SupplierProfile : MerchantServiceBase
    {
        public string Code { get; set; }
        public string NameEn { get; set; }
        public string NameSl { get; set; }
        public string AddressEn { get; set; }
        public string AddressSl { get; set; }
        public string Phone { get; set;}
        public string Fax { get; set; }
        public string Email { get; set; }
        public string ZipCode { get; set; }
        public string POBox { get; set; }
        public int TotalDaysLimit { get; set; }
        public int SupplierTypeId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
        public bool IsAcceptReturnForExpiredItem { get; set; }
        public int CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
        [ForeignKey("SupplierTypeId")]
        public virtual ParamType SupplierType { get; set; }
    }
}

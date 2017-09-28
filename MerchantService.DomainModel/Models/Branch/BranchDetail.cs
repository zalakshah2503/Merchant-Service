using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Branch
{
    public class BranchDetail : MerchantServiceBase
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Storename { get; set; }     
        public int CompanyId { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string NameSl { get; set; }      
        public string Zipcode { get; set; }
        public bool IsAutomaticIssueSPO { get; set; }
        public bool IsDelete { get; set; }
        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
    }
}

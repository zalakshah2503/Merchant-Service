using MerchantService.DomainModel.Models.Branch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin
{
  public  class BranchDetailAC
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameSl { get; set; }
        public string Code { get; set; }
        public string Storename { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Zipcode { get; set; }
        public int CityId { get;set;}
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public bool IsAutomaticIssueSPO { get; set; }
        public bool IsDelete { get; set; }
        public int BranchId { get; set; }
        public DateTime CreatedDateTime { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Company;
using System.ComponentModel.DataAnnotations.Schema;
namespace MerchantService.DomainModel.Models.Role
{
   public class Role : MerchantServiceBase
    {
       public string RoleName { get; set; }
       public string RoleNameSl { get; set; }

       public bool IsDeleted { get; set; }

       public int? CompanyId { get; set; }

       
    }
}

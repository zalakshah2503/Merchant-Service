using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin
{
  public class RoleAc
    {
      public int Id { get; set; }

      public string RoleName { get; set; }
      public string RoleNameSl { get; set; }
      public int CompanyId { get; set; }

      public bool IsDeleted { get; set; }
      public bool IsAdminRole { get; set; }
      public int RoleId { get; set; }
    }
}

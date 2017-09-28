using MerchantService.DomainModel.Models.Global;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models.Company;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class RolePermission : MerchantServiceBase
    {
        public int RoleId { get; set; }
        public int ChildPermissionId { get; set; }

        [ForeignKey("ChildPermissionId")]
        public virtual ChildPermission ChildPermission { get; set; }
        public int CompanyId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role.Role Role { get; set; }
        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }
        public bool IsChecked { get; set; }

    }
}

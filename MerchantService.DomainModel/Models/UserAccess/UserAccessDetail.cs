using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Role;

namespace MerchantService.DomainModel.Models.UserAccess
{
    public class UserAccessDetail : MerchantServiceBase
    {
        public int FormId { get; set; }

        public int RoleId { get; set; }

        public bool IsActive { get; set; }

        [ForeignKey("FormId")]
        public virtual Form Form { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role.Role Role { get; set; }
    }
}

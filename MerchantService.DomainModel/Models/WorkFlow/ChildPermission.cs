using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class ChildPermission : MerchantServiceBase
    {
        public string Name { get; set; }
        public string AcceptPermission { get; set; }
        public string RejectPermission { get; set; }
        public int? ParentPermissionId { get; set; }
        public bool IsClosed { get; set; }

        [ForeignKey("ParentPermissionId")]
        public virtual ParentPermission ParentPermission { get; set; }
        public bool IsChecked { get; set; }
        public bool IsCondition { get; set; }
        public bool IsValidActivity { get; set; }
        public bool IsAllowOtherWorkFLow { get; set; }
        public bool IsAllowRolePermission { get; set; }
        public bool IsAllowOtherBranchUser { get; set; }
    }
}

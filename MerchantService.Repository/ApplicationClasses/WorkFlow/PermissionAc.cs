using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.WorkFlow
{
    public class PermissionAc
    {
        public PermissionAc()
        {
            Children = new List<PermissionAc>();
        }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public string Name { get; set; }
        public bool IsCondition { get; set; }
        public bool IsChecked { get; set; }
        public string AcceptPermission { get; set; }
        public string RejectPermission { get; set; }
        public bool IsAllowOtherWorkFLow { get; set; }
        public List<PermissionAc> Children { get; set; }

        public bool IsAllowOtherBranchUser { get; set; }
    }

    public class RolePermissionAc
    {
        public List<PermissionAc> Permission { get; set; }
        public int RoleId { get; set; }
    }
  
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Branch;
using System.ComponentModel.DataAnnotations;

namespace MerchantService.DomainModel.Models
{
    public class UserDetail : MerchantServiceBase
    {
        public string FullName { get; set; }
        public string FullNameSl { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int? BranchId { get; set; }
        public int? CompanyId { get; set; }
        public string EmployeeId { get; set; }
        public int SupervisorId { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime? LeaveDate { get; set; }
        public string TemporaryAddress { get; set; }
        public bool IsSamePermanentAddress { get; set; }
        public string PermanentAddress { get; set; }
        public string MobileNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public string JobTitle { get; set; }
        public bool IsFirstTimeLogin { get; set; }

        // THIS BIT IS CHECKED ONLY DURING LOGIN
        // IF FALSE THEN USER CANNOT LOGIN
        public bool IsActive { get; set; }

        // THIS BIT IS SET TO TRUE WHEN USER IS DELETED
        public bool IsDelete { get; set; }
        public bool IsResetPassword { get; set; }
        public int RoleId { get; set; }
        [NotMapped]
        public string Password { get; set; }
        [NotMapped]
        public string ConfirmPassword { get; set; }
        public string RoleName { get; set; }
        public string UserId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role.Role Role { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail Branch { get; set; }

    }
}

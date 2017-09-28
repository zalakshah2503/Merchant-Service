using MerchantService.DomainModel.Models.Branch;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin
{
    public class UserDetailAc
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string FullNameSl { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int BranchId { get; set; }
        public int CompanyId { get; set; }
        public string EmployeeId { get; set; }
        public string BranchName { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime LeaveDate { get; set; }
        public DateTime BirthDate { get; set; }
        public string TemporaryAddress { get; set; }
        public bool IsSamePermanentAddress { get; set; }
        public string PermanentAddress { get; set; }
        public string MobileNumber { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public int UserId { get; set; }
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public string Department { get; set; }
        public string JobTitle { get; set; }
        public bool IsAdminRole { get; set; }
        public bool IsFirstTimeLogin { get; set; }
    }
}

using MerchantService.DomainModel.Models.UserAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin.UserAccess
{
    public class UserAccessDetailAC
    {
        public string FormName { get; set; }

        public string FormDescription { get; set; }

        public string FormUrl { get; set; }

        public bool IsActive { get; set; }

        public int FormId { get; set; }
        public int UserAccessId { get; set; }

        public int roleId { get; set; }

    }
    
}

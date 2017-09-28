using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
    public class GroupAccountAC
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int? UnderId { get; set; }
        public bool HasBalanced { get; set; }
        public int? CompanyId { get; set; }
    }
}

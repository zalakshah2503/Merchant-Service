using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
    public class UserAccessPageListAC
    {
        public List<string> listOfPageList { get; set; }
        public bool isAdmin { get; set; }
        public int roleId { get; set; }
    }
}

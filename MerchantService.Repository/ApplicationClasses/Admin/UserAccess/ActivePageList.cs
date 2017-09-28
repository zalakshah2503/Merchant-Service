using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin.UserAccess
{
    public class ActivePageList
    {
        public string PageName { get; set; }

        public string Discription { get; set; }

        public List<ActiveChildList> listOfChieldList { get; set; }
    }

    public class ActiveChildList
    {
        public string PageName { get; set; }
        public string Discription { get; set; }
        public List<ActiveSubChildList> listOfSubChieldList { get; set; }

    }

    public class ActiveSubChildList
    {
        public string Discription { get; set; }
        public string pageName { get; set; }
    }

}

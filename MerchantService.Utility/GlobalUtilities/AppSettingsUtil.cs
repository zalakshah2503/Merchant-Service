using System.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MerchantService.Utility.GlobalUtilities
{
   public class AppSettingsUtil
    {
        private static string _currenntDomain;

        public static string CurrentDomain
        {
            get
            {
                if (HttpContext.Current == null)
                    return _currenntDomain;
                return HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
            }
            set { _currenntDomain = value; }
        }


        public static bool LogConfiguration
        {
            get;
            set;
           
        }
        
    }
}

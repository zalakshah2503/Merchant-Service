using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin
{
    public class AdditionalServiceAC
    {
        public int AdditionalServiceId { get; set; }
        public string AdditionalServiceName { get; set; }
        public DateTime CreatedDateTime { get; set; }
    }
}

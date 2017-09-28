using MerchantService.DomainModel.Models.Globalization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Globalization
{
   public class GlobalizationDetailAc
    {
       public List<GlobalizationDetailAc> GlobalizationDetail { get; set; }

       public  ModuleInfo ModuleInfo { get; set; }
        public int Id { get; set; }

        public int ModuleId { get; set; }

        public string Key { get; set; }

        public string ValueEn { get; set; }

        public string ValueSl { get; set; }

        public int CompanyId { get; set; }

    }
}

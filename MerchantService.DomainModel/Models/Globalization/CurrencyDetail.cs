using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Globalization
{
    public class CurrencyDetail : MerchantServiceBase
    {
         [MaxLength(50)]
        public string CurrencyType { get; set; }

         public string CultureInfoValue { get; set; }
    }
}

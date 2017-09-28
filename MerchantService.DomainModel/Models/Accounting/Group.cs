using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class Group : MerchantServiceBase
    {
        public string GroupName { get; set; }

        public int? UnderId { get; set; }

        public string Type { get; set; }

        public bool HasBalanced { get; set; }

        public int? CompanyId { get; set; }
    }
}

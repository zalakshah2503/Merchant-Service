using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class StatusType : MerchantServiceBase
    {
        public string Name { get; set; }
        public bool IsClosed { get; set; }
        public bool IsActiveStatus { get; set; }
        public bool IsInitial { get; set; }
    }
}

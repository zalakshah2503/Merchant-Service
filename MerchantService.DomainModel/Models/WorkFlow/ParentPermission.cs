using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.WorkFlow
{
    public class ParentPermission : MerchantServiceBase
    {
        public string Name { get; set; }
        public bool IsWorkflowEnabled { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin
{
  public  class BranchCPOConfigurationsAC
    {
      public int BranchCPOConfigurationsId { get; set; }
      public int AdditionalServiceId { get; set; }
      public int BranchId { get; set; }
      public int Amount { get; set; }
      public DateTime CreatedDateTime { get; set; }
    }
}

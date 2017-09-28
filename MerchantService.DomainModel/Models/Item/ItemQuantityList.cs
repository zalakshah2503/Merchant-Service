using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Item
{
    public class ItemQuantityList
    {
        public int BranchId { get; set; }

        public int MinimumQuantity { get; set; }

        public int MaximumQuantity { get; set; }

        public int ActualQuantity { get; set; }

        public int ItemId { get; set; }

        public int ItemQuantityId { get; set; }

      

       
    }
}

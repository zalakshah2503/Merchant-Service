using MerchantService.Repository.ApplicationClasses.Item;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.ItemDestruction
{
    public class ItemDestructionRequestAC
    {
        public int destructionId { get; set; }
        public int intiatedId { get; set; }

        public string comment { get; set; }
        public int branchId { get; set; }

        public int destructioCasueId { get; set; }

        public List<ItemProfileAC> listOfItemProfileAC { get; set; }
    }
}

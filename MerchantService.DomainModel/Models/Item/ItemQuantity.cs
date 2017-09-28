using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Item
{
    public class ItemQuantity : MerchantServiceBase
    {
        public int ItemId { get; set; }

        public int BranchId { get; set; }

        public int MinQuantity { get; set; }

        public int MaxQuantity { get; set; }

        public int ActualQuantity { get; set; }
        public bool IsICRGenerated { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail Branch { get; set; }
    }
}

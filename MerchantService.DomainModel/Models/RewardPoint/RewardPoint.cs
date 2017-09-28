using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.RewardPoint
{
    public class RewardPoint : MerchantServiceBase
    {
        public decimal Amount { get; set; } // Reward amount

        public int Point { get; set; } // Reward Point

        public decimal PointAmount { get; set; } // Amount for one Reward Point

        public int? CompanyId { get; set; }

        public int? CategoryId { get; set; }

        public int? ItemId { get; set; }

        public RewardPointType Type { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile Items { get; set; }

        public bool IsActive { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class ItemOfferDetailAC
    {
        public string ItemNameAr { get; set; }
        public string ItemNameEn { get; set; }
        public string FlavourAr { get; set; }
        public string FlavourEn { get; set; }
        public string ItemType { get; set; }
        public string ItemCode { get; set; }
        public string Barcode { get; set; }
        public string UnitType { get; set; }
        public int BaseUnitCount { get; set; }
        public string IsOfferItem { get; set; }
        public decimal SellPrice { get; set; }
        public decimal SellPriceA { get; set; }
        public decimal SellPriceB { get; set; }
        public decimal SellPriceC { get; set; }
        public decimal SellPriceD { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SystemQuantity { get; set; }
        public DateTime StartDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan EndTime { get; set; }
        public decimal NewSellPrice { get; set; }
        public decimal NewSellPriceA { get; set; }
        public decimal NewSellPriceB { get; set; }
        public decimal NewSellPriceC { get; set; }
        public decimal NewSellPriceD { get; set; }
        public decimal QuantityLimit { get; set; }
        public bool IsAllowToUpdate { get; set; }
        public bool IsItemOfferStatusEditPanding { get; set; }
        public decimal MarginProfit { get; set; }
        public bool IsAlreadyValidReject { get; set; }
        public bool IsApprove { get; set; }
        public bool IsStoped { get; set; }
        public bool IsResume { get; set; }
        public bool IsReview { get; set; }
        public decimal Discount { get; set; }
        public decimal PreviousCostPrice { get; set; }
        public string IsActiveItem { get; set; }
        public decimal AverageCostPrice { get; set; }
        public int ItemId { get; set; }
        public bool IsDeletedRequest { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsOfferCreatedBelowCostPrice { get; set; }
        public bool IsExpier { get; set; }
        public bool IsStop { get; set; }
    }
}

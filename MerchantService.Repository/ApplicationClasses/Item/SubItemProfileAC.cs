using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class SubItemProfileAC
    {
        public int Id { get; set; }
        public int? UnitParamTypeId { get; set; }

        public int? CategoryId { get; set; }

        public int? ParentItemId { get; set; }
        public bool IsOfferValid { get; set; }
        public string Barcode { get; set; }

        public string Code { get; set; }

        public decimal OldRequestQuantity { get; set; }
        public bool IsSupplierReturnRequestGenerated { get; set; }
        public string ItemNameEn { get; set; }

        public string ItemNameSl { get; set; }
        public int ItemId { get; set; }
        public int BaseUnit { get; set; }

        public string FlavourEn { get; set; }

        public string FlavourSl { get; set; }

        public bool IsActive { get; set; }

        public bool HasOffer { get; set; }

        public bool IsOfferItem { get; set; }

        public bool IsItemChangeRequestGenerated { get; set; }

        public bool IsParentItem { get; set; }

        public bool IsIcrApproved { get; set; }

        public decimal CostPrice { get; set; }

        public decimal SellPrice { get; set; }

        public decimal SellPriceA { get; set; }

        public decimal SellPriceB { get; set; }

        public decimal SellPriceC { get; set; }

        public decimal SellPriceD { get; set; }

        public decimal PreviousCostPrice { get; set; }

        public decimal AverageCostPrice { get; set; }
        public decimal ActualQuantity { get; set; }

        public int ProfitMargin { get; set; }

        public bool HasChildItem { get; set; }

        public string ItemType { get; set; }

        public string Unit { get; set; }

        public int ItemProfileId { get; set; }

        public string SupplierName { get; set; }

        public int SupplierId { get; set; }

        public decimal SystemQuantity { get; set; }

        public decimal DestructionQuantity { get; set; }

        public decimal UpdateSystemQunatity { get; set; }
        public bool IsIssueInventory { get; set; }
        public string BaseUnitCount { get; set; }
    }
}

using System.Collections.Generic;
using MerchantService.DomainModel.Models.Item;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class ItemProfileAC
    {
        public int Id { get; set; }

        public int? UnitParamTypeId { get; set; }

        public int? CategoryId { get; set; }
        public int BrandId { get; set; }
        public int GroupId { get; set; }

        public int? ParentItemId { get; set; }

        public string Barcode { get; set; }

        public string Code { get; set; }

        public string ItemNameEn { get; set; }
        public int ItemId { get; set; }
        public string ItemNameSl { get; set; }

        public decimal OldRequestQuantity { get; set; }

        public int BaseUnit { get; set; }

        public string FlavourEn { get; set; }

        public string FlavourSl { get; set; }

        public bool IsActive { get; set; }

        public bool HasOffer { get; set; }

        public bool IsOfferItem { get; set; }

        public bool IsParentItem { get; set; }

        public bool IsIcrApproved { get; set; }//Same as "IsAutomaticPO"

        public bool IsOfferValid { get; set; }
        public bool IsItemChangeRequestGenerated { get; set; }
        public bool IsSupplierReturnRequestGenerated { get; set; }
        public decimal UpdateSystemQunatity { get; set; }

        public decimal CostPrice { get; set; }

        public decimal SellPrice { get; set; }

        public decimal SellPriceA { get; set; }

        public decimal SellPriceB { get; set; }

        public decimal SellPriceC { get; set; }

        public decimal SellPriceD { get; set; }

        public decimal PreviousCostPrice { get; set; }

        public decimal AverageCostPrice { get; set; }

        public decimal ActualQuantity { get; set; }

        public decimal OfferSellPrice { get; set; }
        public int OfferLimitQuantity { get; set; }
        public int? OfferRemainingQuantity { get; set; }

        public int ProfitMargin { get; set; }

        public bool HasChildItem { get; set; }

        public string ItemType { get; set; }
        public int ShelfQuantity { get; set; }
        public decimal SystemQuantity { get; set; }
        public string Unit { get; set; }
        public List<SubItemProfileAC> listOfChildProfileAC { get; set; }

        public int ItemProfileId { get; set; }

        public int PosIncidentReportId { get; set; }

        public int CompanyId { get; set; }


        public bool IsDeleted { get; set; }

        public int BranchId { get; set; }
        public bool IsAutomaticPO { get; set; }

        public string BranchName { get; set; }

        public string SupplierName { get; set; }

        public int SupplierId { get; set; }
        public List<ItemQuantityList> ListOfItemQuantityList { get; set; }
        
        public decimal IssueInventoryCount { get; set; }

        public int DestructionQuantity { get; set; }

        public string DestructionCause { get; set; }

        public int ItemRecordCount { get; set; }

        public bool IsIssueInventory { get; set; }
        public string BaseUnitCount { get; set; }
        public bool IsOfferCreatedBelowCostPrice { get; set; }

        public decimal TotalCostPrice { get; set; }
    }
}

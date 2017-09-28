using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Item
{
    public class ItemProfile : MerchantServiceBase
    {
        public int? UnitParamTypeId { get; set; }

        public int? CategoryId { get; set; }

        public int? ParentItemId { get; set; }

        public bool IsActive { get; set; }

        public string Barcode { get; set; }

        public string Code { get; set; }

        public string ItemNameEn { get; set; }

        public string ItemNameSl { get; set; }

        public int CompanyId { get; set; }

        public int BaseUnit { get; set; }

        public string FlavourEn { get; set; }

        public string FlavourSl { get; set; }

        public bool IsDeleted { get; set; }

        public bool HasOffer { get; set; }

        public bool IsOfferItem { get; set; }

        public bool IsParentItem { get; set; }

        public bool IsAutomaticPO { get; set; }
        public bool IsIcrApproved { get; set; }
        public bool IsItemChangeRequestGenerated { get; set; }
        public bool IsSupplierReturnRequestGenerated { get; set; }

        public decimal CostPrice { get; set; }

        public decimal SellPrice { get; set; }

        public decimal SellPriceA { get; set; }

        public decimal SellPriceB { get; set; }

        public decimal SellPriceC { get; set; }

        public decimal SellPriceD { get; set; }

        public decimal PreviousCostPrice { get; set; }

        public decimal AverageCostPrice { get; set; }

        public int ProfitMargin { get; set; }

        [NotMapped]
        public int BranchId { get; set; }

        [NotMapped]
        public int MinimumQuantity { get; set; }

        [NotMapped]
        public int MaximumQuantity { get; set; }

        [NotMapped]
        public ItemOffer ItemOffer { get; set; }
        [NotMapped]
        public int ActualQuantity { get; set; }

        [NotMapped]
        public List<ItemQuantityList> ListOfItemQuantityList { get; set; }

        [NotMapped]
        public int Quantity { get; set; }

        [NotMapped]
        public int AutomaticPOQuantity { get; set; }

        [NotMapped]
        public bool IsCompanyBarcode { get; set; }

        [NotMapped]
        public int SupplierId { get; set; }

        [NotMapped]
        public decimal CustomerPrice { get; set; }

        [NotMapped]
        public string UnitName { get; set; }

        [ForeignKey("UnitParamTypeId")]
        public virtual SystemParameter SystemParameter { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        [ForeignKey("ParentItemId")]
        public virtual ItemProfile ParentItem { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail CompanyDetail { get; set; }

        public bool IsIssueInventory { get; set; }
        public int? InitiatorRoleId { get; set; }
    }


}

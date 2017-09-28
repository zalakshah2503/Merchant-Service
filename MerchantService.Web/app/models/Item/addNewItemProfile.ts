namespace Model {
    export class AddNewItemProfile {
        UnitParamTypeId: number;
        CategoryId: number;
        ParentItemId: number;
        Barcode: number;
        Code: string;
        ItemNameEn: string;
        ItemNameSl: string;
        BaseUnit: number;
        FlavourEn: string;
        FlavourSl: string;
        IsDeleted: boolean;
        HasOffer: boolean;
        IsOfferItem: boolean;
        IsOfferValid: boolean;
        IsParentItem: boolean;
        IsAutomaticPO: boolean;
        CostPrice: number;
        SellPrice: number;
        SellPriceA: number;
        InitiatorRoleId: number;
        SellPriceB: number;
        SellPriceC: number;
        SellPriceD: number;
        PreviousCostPrice: number;
        AverageCostPrice: number;
        ProfitMargin: number;
        QuantityList: any;
        BranchId: number;
        MinimumQuantity: number;
        MaximumQuantity: number;
        ActualQuantity: number;
        ListOfItemQuantityList: any;
        IsSupplierReturnRequestGenerated: boolean;
        IsActive: boolean;
        Id: number;
        SupplierId: number;
        AutomaticPOQuantity: number;
        IsCompanyBarcode: boolean;

    }
}  
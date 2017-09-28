namespace Model {
    export class SupplierReturnItemAC {

        Id: number;
        ItemId: number;
        ItemNameEn: string;
        ActualQuantity: number;
        ReturnQuantity: number;
        SystemQuantity: number;
        ReturnCauseId: number;
        ReturnCause: string;
        CostPrice: number;
        Barcode: string;
        FlavourEn: string;
        FlavourSl: string;
        Unit: string;
        BaseUnit: number;
        ItemType: string;
        ParentItemId: number;
        OldRequestQuantity: number;
        IsParentItem: boolean;
        HasChildItem: boolean;
        UpdateSystemQunatity: number;
        SupplierId: number;
    }
}

  



       
 
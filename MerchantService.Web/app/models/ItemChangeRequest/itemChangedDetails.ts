namespace Model {

    export class ItemChangedDetails {
        Id: number;
        ItemId: number;
        ItemName: string;
        ParentRecordId: number;
        Barcode: string;
        BranchId: number;
        BranchName: string;
        RequestedDate: Date;
        MinQuantity: number;
        MaxQuantity: number;
        ActualQuantity: number;
        IsICRGenerated: boolean;
        CalculatedCostPrice: number;
        ModifyingCostPrice: number;
        ModifyingSellPrice: number;
        ModifyingSellPriceA: number;
        ModifyingSellPriceB: number;
        ModifyingSellPriceC: number;
        ModifyingSellPriceD: number;
        Action: string;
        ItemProfile: AddNewItemProfile;
        IsPriceChangeRequest: boolean;
        IsRejected: boolean;
        IsReturned: boolean;
        IsPOItemIcr: boolean;
        IsAddItemIcr: boolean;
        POItemId: number;
        Comment: string;
        IcrQuantity: any;
        WorkFlowLog: Array<Model.WorkFlowAction>;
    }
}


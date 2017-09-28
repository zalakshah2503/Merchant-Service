namespace Model {
    export class IssueInventoryAc {
        RecordId:number;
        InventoryNO:number;        
        IssueStockInventoryId:number;
        ParamTypeId: number;
        BranchId : number;
        CategoryId : number;
        SupplierId : number;
        Barcode: string;
        ItemDetails: any;
        IsQuantityDisabled : boolean;
        Quantity: any;
        InitiationComment: string;
        IsItemInventory: boolean;
        StartingDate: Date;
        DetailsId: number;
        BranchList: any;
    }
}

namespace Model {
    export class SupplierItem {
        PurchaseOrderId: number;
        ItemId: number;
        Barcode: string;
        ActualQuantity: number;
        MaxQuantity: number;
        CostPrice: number;
        OrderCostPrice: number;
        OrderQuantity: number;
        FreeQuantity: number;
        PercentageDiscount: number;
        BaseUnit: number;
        ItemNameEn: string;
        FlavourEn: string;
        FlavourSl: string;
        Code: number;
        BranchName: string;
        BranchId: number;
        UnitParamTypeId: number;
        Type: string;
        IsIcrGenerated: boolean;
        DueDate: Date;
        ParentRecordId: number;
        Comment: string;
        ReceiveQuantity: number;
        ReceiveCostPrice: number;
        BillCostPrice: number;
        ReceiveDate: Date;
    }
}   
     
        //public int SupplierDaysLimit { get; set; }
        //public int SupplierTypeId { get; set; }     
        //public Category Category { get; set; }
    



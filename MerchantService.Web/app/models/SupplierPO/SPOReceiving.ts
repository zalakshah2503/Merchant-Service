namespace Model {
    export class SPOReceiving {
        PurchaseOrderId: number;
        ReceivingDate: Date;
        Comment: string;
        SupplierPOAC: SupplierPO;
        POItem: Array<Model.SupplierItem>;
        SPOBill: Array<Model.SPOReceivingBill>;
    }
}



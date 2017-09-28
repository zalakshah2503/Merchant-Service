namespace Model {
    export class InventoryTransferAc {
          RecordId : number;
          CurrentBranchId : number;
          RequestNo: string;
          TargetBranchId : number;
          IsSending : boolean;
          IsReceiving : boolean;
          IsReject : boolean;
          IsActive : boolean;
          ItemInventoryTransfer: any; 
          InventoryTransferId: number;
          RequestTypeId: number;
          Barcode: string;
          DueDate: any;

    }
} 
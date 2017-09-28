namespace Model {
    export class SupplierReturnRequest {
        RecordId: number;
      
        SupplierId: number;
        SupplierName: string;
        SupplierCode: string;
        RequestNo: string;
        IsRejected: boolean;
        IsDeleted: boolean;
        SupplierReturnId: number;
        Comment: string;
        Status: string;
        InitiationComment: string;
        Initiator: string;
        InitiatorId: number;
        CreditNoteNo: string;
        BranchId: number;
        BranchName: string;
        Amount: number;
        IsCollected: boolean;
        InitiationDate: Date;
        SupplierReturnItemAC: Array<Model.SupplierReturnItemAC>;
        WorkFlowLog: Array<Model.WorkFlowAction>;
    }
}

  



       
     
namespace Model {
    export class CreditNoteDetail {
        CreditNoteNo: string;
        BranchId: number;
        BranchName: string;
        TypeId: number;
        TypeName: string;
        Amount: number;
        ActualAmount: number;
        IsCollected: boolean;
        InitiationComment: string;
        InitiationDate: Date;
    }
}




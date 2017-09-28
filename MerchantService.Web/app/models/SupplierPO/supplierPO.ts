namespace Model {
    export class SupplierPO {
        SupplierId: number;
        SupplierName: string;
        SupplierProfile: Object;
        SupplierTypeId: number;
        UserId: number;
        IsSubmitted: boolean;
        InitiationComment: string;
        InitiationBranchId: number;
        PurchaseOrderNumber: string;
        ParentRecordId: number;
        DueDate: Date;
        IsApproved: boolean;
        IsConfirmed: boolean;
        IsRejected: boolean;
        IsReceived: boolean;
        IsCashPO: boolean;
        IsCanceled: boolean;
        IsVerified: boolean;
        TotalDaysLimit: boolean;
        IsPartiallyReceived: boolean;
        IsCancelApproved: boolean;
        SupplierItem: Array<Model.SupplierItem>;
        SPOBranch: Array<Model.SpoBranch>;
        DiscountDays: Array<Model.DiscountDays>;
    }
}

 
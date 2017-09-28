namespace Model {

    export class CustomerPO {
        AllowCreditAccountLimit: boolean;
        CPODownPaymentDiscount: number;
        CustomerId: number;
        CustomerName: string;
        CustomerMobile: string;
        CustomerPOId: number;
        PurchaseOrderNo: number;
        InitiationDate: Date;
        InitiationBranchId: number;
        InitiationBranchName: string;
        InitiatorName: string;
        InitiatorId: number;
        Comments: string;
        DueDate: Date;
        DueDateTemp: Date;
        IsCancel: boolean;
        IsSPORequired: boolean;
        IsCollected: boolean;
        CancelationDate: Date;
        CollectingBranchId: number;
        CollectingBranchName: string;
        CollectionDate: Date;
        ModifiedBy: number;
        Barcode: string;
        Total: number;
        PrevTotal: number;
        TotalCPOAmount: number;
        IsEdit: boolean;
        ToCustomer: boolean;
        DownPaymentAmount: number;
        ExcessAmount: number;
        IsReceipt: boolean;
        CPOPaymentAC: CPOPayment;
        CustomerProfile: CustomerProfile;
        CPOItem: Array<Model.CustomerPOItem>;
        CPOItemAC: Array<Model.CpoItemAC>;
        CPOAdditionalCost: Array<Model.CPOAdditionalCost>;
    }
} 


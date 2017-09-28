namespace Model {
    export class SPOReceivingBill {
        Id: number;
        BillId: number;
        BillNumber: string;
        Amount: number;
        PurchaseOrderId: number;
        Discount: number;
        IsPercentageDiscount: boolean;
        IsPercentDis: string;
        TotalDaysLimit: number;
        BillComment: string;
        IsVerified: boolean;
        IsPaid: boolean;
        IsSelected: boolean;
        CanBePaid: boolean;
        IsWorkFlowNotCreated: boolean;
        VerifiedDate: Date;
        BillDaysLimitDiscount: number;
        Days: number;
        SPOBillDaysLimit: Array<Model.BillDiscountDays>;
    }
}
     

   
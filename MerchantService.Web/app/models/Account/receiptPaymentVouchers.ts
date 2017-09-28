namespace Model {
    export class ReceiptPaymentVoucher {
        Id: number;
        BranchId: number;
        AccountId: number;
        IsReceipt: boolean;
        totalAmount: number;
        narration: string;
        ChequeNo: string;
        BankName: string;
        BankBranch: string;
        ParamTypeId: number;
        ChequeDate: string;
        ReceivedFromId:number;
        receiptPaymentDetail: any;

    }
} 
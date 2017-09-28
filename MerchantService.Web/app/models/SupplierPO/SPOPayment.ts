namespace Model {
    export class SPOPayment {
        Amount: number;
        IsPOBillPayment: boolean;
        PurchaseOrderId: number;
        BillNumber: string;
        Cheque: number;
        ChequeNo: string;
        Cash: number;
        Credit: number;
        Comment: string;
        VoucherNo: string;
        CreditNoteDetail: Array<Model.CreditNoteDetail>;
        SPOBill: Array<Model.SPOReceivingBill>;
    }
}



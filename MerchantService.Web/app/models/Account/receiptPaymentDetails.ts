namespace Model {
    export class ReceiptPaymentDetail {
        Id: number;
        ReceiptPaymentId: number;
        LedgerId: number;
        Amount: number;
        
        ReceivedFromId: number;
        LedgerName:string;
    }
} 
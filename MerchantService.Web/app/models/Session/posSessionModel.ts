namespace Model {
    export class PosSessionModel {
        POSSessionId: number;
        POSLoginSessionId: number;
        MismatchResolveTypeID: number;
        ActualCash: number;
        ActualDebitCard: number;
        ActualCreditCard: number;
        ActualCoupon: number;
        ActualCreditAccount: number;
        ActualReturnBill: number;
        ActualSalesTotalIn: number;
        ActualSalesTotalOut: number;
        SystemCash: number;
        SystemDebitCard: number;
        SystemCreditCard: number;
        SystemCoupon: number;
        SystemCreditAccount: number;
        SystemReturnBill: number;
        SystemSalesTotalIn: number;
        SystemSalesTotalOut: number;
        ActualCheque: number;
        SystemCheque: number;
        CashierId: number;
        Comment: any;
        StatusId: number;
    }
}
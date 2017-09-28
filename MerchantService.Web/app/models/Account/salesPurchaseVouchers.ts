namespace Model {
    export class SalesPurchaseVouchers {
        Id: number;
        BranchId: number;
        AccountId: number;
        PartyAccountId: number;
        ReferenaceNo: string;
        SupplierInvoiceNo: string;
        IsSalesVoucher: boolean;
        totalAmount: number;
        narration: string;
        ChequeNo: string;
        BankName: string;
        BankBranch: string;
        ParamTypeId: number;
        ChequeDate: string;
        salesPurchaseDetail: any;
    }
}  
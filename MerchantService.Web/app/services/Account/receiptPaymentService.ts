
interface IreceiptPaymentService {
    getLedgerList: () => void;
    getSelectedLedgerAccount: (ledgerId) => void;
    saveReceiptVoucher: (resource) => void;
    getParamTypeByParamId: (paramId) =>void;
}
class ReceiptPaymentService {
    static serviceId = "ReceiptPaymentService";
    private $resource;
    private $q;
    private $log;
    public getLedger;
    public getBankLegerAccount;
    public getLedgerAccountForReceiptPayment;
    public saveReceiptVoucher;
    public paramTypeByParamId;
    public countReceiptVoucherRecord;
    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
            this.$resource = $resource;
            this.$q = $q;
            this.$log = $log;
        this.getLedger = this.$resource(apiPaths.getReceiptPaymentAccount);
        this.getBankLegerAccount = this.$resource(apiPaths.CheckLedgerAccount);
        this.getLedgerAccountForReceiptPayment = this.$resource(apiPaths.getLedgerAccountForReceiptPayment);
        this.saveReceiptVoucher = this.$resource(apiPaths.saveReceipt, { resource: '@resource' }, { create: { method: "POST" } });
        this.paramTypeByParamId = this.$resource(apiPaths.getParamTypeByParamId);
        this.countReceiptVoucherRecord = this.$resource(apiPaths.CountReceiptVoucherRecord);
    }
    //this method is use for getting list of ledger
    getLedgerList() {
        return this.getLedger.query().$promise;
    }
    //this method is use for geeting list of ledger whose account is bank.
    getSelectedLedgerAccount(ledgerId) {
        return this.getBankLegerAccount.get({ledgerId:ledgerId}).$promise;
    }
    //this method is use for getting list of ledger whose account is neither bank nor cash.
    getLedgerAccountWithoutBankCash() {
        return this.getLedgerAccountForReceiptPayment.query().$promise;
    }
    //this method is use for saving receipt voucher to the database.
    saveReceiptVoucherAccount(resource) {
        return this.saveReceiptVoucher.create(resource).$promise;

    }
    //this method is use for getting list of parameter wohse value is banck transction type.
    getParamTypeByParamId(paramId) {
        return this.paramTypeByParamId.query({ paramId: paramId }).$promise;   
    }
    //this method is use for getting count of receipt voucher.
    getReceiptVoucherCount(isReceipt) {
        return this.countReceiptVoucherRecord.get({ isReceipt: isReceipt}).$promise;
    }
    
}
app.service('ReceiptPaymentService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new ReceiptPaymentService($resource, $q, $log);
}]);
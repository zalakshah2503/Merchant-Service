// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IsalesPurchaseVoucherService {
    getLedgerList: () => void;
    getSaleLedgers: () => void;
    getSelectedLedgerAccount: (ledgerId) => void;
    getItemProfileList: () => void;
    getParamTypeByParamId: (paramId) => void;
    saveSalesVoucher: (resource) => void;
    getPurchasesLedgers: () => void;
}

class SalesPurchaseVoucherService {
    private $resource;
    private $q;
    private $log;
    public getLedger;
    public getSalesLedgers;
    public getBankLegerAccount;
    public getItemList;
    public paramTypeByParamId;
    public countSalesVoucherRecord;
    public saveSalesVoucher;
    public getPurchaseLedgers;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getLedger = this.$resource(apiPaths.getReceiptPaymentAccount);
        this.getSalesLedgers = this.$resource(apiPaths.getSalesLeadger);
        this.getBankLegerAccount = this.$resource(apiPaths.CheckLedgerAccount);
        this.getItemList = this.$resource(apiPaths.getItemProfileList);
        this.paramTypeByParamId = this.$resource(apiPaths.getParamTypeByParamId);
        this.countSalesVoucherRecord = this.$resource(apiPaths.countSalesVoucher);
        this.saveSalesVoucher = this.$resource(apiPaths.saveSalesPuchaseVoucher, { resource: '@resource' }, { create: { method: "POST" } });
        this.getPurchaseLedgers = this.$resource(apiPaths.getPurchaseLedger);
    }

    //this method is use for getting list of ledger -SP
    getLedgerList() {
        return this.getLedger.query().$promise;
    }
    // this method is used for getting sales legers. -SP
    getSaleLedgers() {
        return this.getSalesLedgers.query().$promise;
    }
    // this method is used for getting Purchase legers. -SP
    getPurchasesLedgers() {
        return this.getPurchaseLedgers.query().$promise;
    }
    //this method is use for geeting list of ledger whose account is bank.
    getSelectedLedgerAccount(ledgerId) {
        return this.getBankLegerAccount.get({ ledgerId: ledgerId }).$promise;
    }
       
    //this method is used for getting list of item profile.
    getItemProfileList() {
        return this.getItemList.query().$promise;
    }
    //this method is use for getting list of parameter wohse value is banck transction type.
    getParamTypeByParamId(paramId) {
        return this.paramTypeByParamId.query({ paramId: paramId }).$promise;
    }
    //this method is use for getting count of receipt voucher.
    getSalesVoucherCount(isSales) {
        return this.countSalesVoucherRecord.get({ isSales: isSales }).$promise;
    }

    saveSalesPurchaseVoucherAccount(resource) {
        return this.saveSalesVoucher.create(resource).$promise;
    }

}

app.service('SalesPurchaseVoucherService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SalesPurchaseVoucherService($resource, $q, $log);
}]);

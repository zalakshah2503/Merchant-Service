// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var SalesPurchaseVoucherService = (function () {
    function SalesPurchaseVoucherService($resource, $q, $log) {
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
    SalesPurchaseVoucherService.prototype.getLedgerList = function () {
        return this.getLedger.query().$promise;
    };
    // this method is used for getting sales legers. -SP
    SalesPurchaseVoucherService.prototype.getSaleLedgers = function () {
        return this.getSalesLedgers.query().$promise;
    };
    // this method is used for getting Purchase legers. -SP
    SalesPurchaseVoucherService.prototype.getPurchasesLedgers = function () {
        return this.getPurchaseLedgers.query().$promise;
    };
    //this method is use for geeting list of ledger whose account is bank.
    SalesPurchaseVoucherService.prototype.getSelectedLedgerAccount = function (ledgerId) {
        return this.getBankLegerAccount.get({ ledgerId: ledgerId }).$promise;
    };
    //this method is used for getting list of item profile.
    SalesPurchaseVoucherService.prototype.getItemProfileList = function () {
        return this.getItemList.query().$promise;
    };
    //this method is use for getting list of parameter wohse value is banck transction type.
    SalesPurchaseVoucherService.prototype.getParamTypeByParamId = function (paramId) {
        return this.paramTypeByParamId.query({ paramId: paramId }).$promise;
    };
    //this method is use for getting count of receipt voucher.
    SalesPurchaseVoucherService.prototype.getSalesVoucherCount = function (isSales) {
        return this.countSalesVoucherRecord.get({ isSales: isSales }).$promise;
    };
    SalesPurchaseVoucherService.prototype.saveSalesPurchaseVoucherAccount = function (resource) {
        return this.saveSalesVoucher.create(resource).$promise;
    };
    return SalesPurchaseVoucherService;
}());
app.service('SalesPurchaseVoucherService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SalesPurchaseVoucherService($resource, $q, $log);
    }]);
//# sourceMappingURL=salesPurchaseVoucherService.js.map
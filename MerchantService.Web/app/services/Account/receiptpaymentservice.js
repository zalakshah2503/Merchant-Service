var ReceiptPaymentService = (function () {
    function ReceiptPaymentService($resource, $q, $log) {
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
    ReceiptPaymentService.prototype.getLedgerList = function () {
        return this.getLedger.query().$promise;
    };
    //this method is use for geeting list of ledger whose account is bank.
    ReceiptPaymentService.prototype.getSelectedLedgerAccount = function (ledgerId) {
        return this.getBankLegerAccount.get({ ledgerId: ledgerId }).$promise;
    };
    //this method is use for getting list of ledger whose account is neither bank nor cash.
    ReceiptPaymentService.prototype.getLedgerAccountWithoutBankCash = function () {
        return this.getLedgerAccountForReceiptPayment.query().$promise;
    };
    //this method is use for saving receipt voucher to the database.
    ReceiptPaymentService.prototype.saveReceiptVoucherAccount = function (resource) {
        return this.saveReceiptVoucher.create(resource).$promise;
    };
    //this method is use for getting list of parameter wohse value is banck transction type.
    ReceiptPaymentService.prototype.getParamTypeByParamId = function (paramId) {
        return this.paramTypeByParamId.query({ paramId: paramId }).$promise;
    };
    //this method is use for getting count of receipt voucher.
    ReceiptPaymentService.prototype.getReceiptVoucherCount = function (isReceipt) {
        return this.countReceiptVoucherRecord.get({ isReceipt: isReceipt }).$promise;
    };
    return ReceiptPaymentService;
}());
ReceiptPaymentService.serviceId = "ReceiptPaymentService";
app.service('ReceiptPaymentService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new ReceiptPaymentService($resource, $q, $log);
    }]);
//# sourceMappingURL=receiptpaymentservice.js.map
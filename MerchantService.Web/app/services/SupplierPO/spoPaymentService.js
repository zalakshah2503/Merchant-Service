/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SpoPaymentService = (function () {
    function SpoPaymentService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveSupplierPOPayment = this.$resource(apiPaths.saveSupplierPayment);
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.getBill = this.$resource(apiPaths.getSupplierBillList);
        this.getCreditNote = this.$resource(apiPaths.getCreditNote);
        this.checkSupplierPO = this.$resource(apiPaths.checkSPO, {}, { query: { method: "GET", isArray: false } });
        this.checkConditions = this.$resource(apiPaths.checkCondition, { sPOReceivingBill: "@sPOReceivingBill" }, { update: { method: "PUT", isArray: true } });
    }
    // used to fetch supplier list -jj
    SpoPaymentService.prototype.getSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    // used to fetch supplier list -jj
    SpoPaymentService.prototype.getSupplierBillList = function () {
        return this.getBill.query().$promise;
    };
    //used to save spo bill payment -jj
    SpoPaymentService.prototype.saveSPOPayment = function (resource) {
        return this.saveSupplierPOPayment.save(resource).$promise;
    };
    //used to fetch credit note of selected supplier- jj
    SpoPaymentService.prototype.getCreditNoteList = function (SupplierId) {
        return this.getCreditNote.query({ SupplierId: SupplierId }).$promise;
    };
    //used to check whether spo is verified and not paid- jj
    SpoPaymentService.prototype.checkSPO = function (PONumber) {
        return this.checkSupplierPO.query({ PONumber: PONumber }).$promise;
    };
    //used to check whether discount has changed- jj
    SpoPaymentService.prototype.checkCondition = function (sPOReceivingBill) {
        return this.checkConditions.update(sPOReceivingBill).$promise;
    };
    return SpoPaymentService;
}());
app.service('SpoPaymentService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SpoPaymentService($resource, $q, $log);
    }]);
//# sourceMappingURL=spoPaymentService.js.map
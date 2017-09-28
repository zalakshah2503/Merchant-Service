/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SpoReceivingService = (function () {
    function SpoReceivingService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveSupplierPO = this.$resource(apiPaths.saveSPOBillItem);
        this.fetchSPO = this.$resource(apiPaths.getSpoReceiving, {}, { query: { method: 'GET', isArray: false } });
        this.fetchBranchList = this.$resource(apiPaths.getUserBranch);
        this.receiveSupplierItem = this.$resource(apiPaths.receiveSPOItem);
        this.endReceive = this.$resource(apiPaths.endReceiving);
        this.addBill = this.$resource(apiPaths.addSPOBill);
        this.deleteBill = this.$resource(apiPaths.deleteSPOBill, {}, { query: { method: 'GET', isArray: false } });
    }
    //used to add spo - jj
    SpoReceivingService.prototype.saveSPOBillItem = function (resource) {
        return this.saveSupplierPO.save(resource).$promise;
    };
    //used to add bill - jj
    SpoReceivingService.prototype.addSPOBill = function (poSupplierBill) {
        return this.addBill.save(poSupplierBill).$promise;
    };
    //used to delete SPO Bill - jj
    SpoReceivingService.prototype.deleteSPOBill = function (BillId) {
        return this.deleteBill.query({ BillId: BillId }).$promise;
    };
    //used to get details of current spo - jj
    SpoReceivingService.prototype.getSPO = function (id) {
        return this.fetchSPO.query({ id: id }).$promise;
    };
    //used to fetch branchlist - jj
    SpoReceivingService.prototype.getBranchList = function () {
        return this.fetchBranchList.query().$promise;
    };
    //used to receive spo item - jj
    SpoReceivingService.prototype.receiveSPOItem = function (resource) {
        return this.receiveSupplierItem.save(resource).$promise;
    };
    //used to end receive spo - jj
    SpoReceivingService.prototype.endReceiving = function (resource) {
        return this.endReceive.save(resource).$promise;
    };
    return SpoReceivingService;
}());
app.service('SpoReceivingService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SpoReceivingService($resource, $q, $log);
    }]);
//# sourceMappingURL=spoReceivingService.js.map
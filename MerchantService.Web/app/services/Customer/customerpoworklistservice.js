/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var CustomerPOWorkListService = (function () {
    function CustomerPOWorkListService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.fetchCustomerPOWorkList = this.$resource(apiPaths.getCustomerPOWorkList, {}, { query: { method: 'GET', isArray: true } });
        this.getBranch = this.$resource(apiPaths.getBranchList);
        this.getCPO = this.$resource(apiPaths.getCustomerPO);
        this.cancelCPO = this.$resource(apiPaths.cancelCPO, {}, { query: { method: "GET", isArray: false } });
    }
    // used to fetch customer PO Worklist 
    CustomerPOWorkListService.prototype.getCustomerPOWorkList = function () {
        return this.fetchCustomerPOWorkList.query().$promise;
    };
    //used to fetch branchList
    CustomerPOWorkListService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //used to fetch cpo with the given id
    CustomerPOWorkListService.prototype.getCPODetail = function (id) {
        return this.getCPO.get({ id: id }).$promise;
    };
    //used to cancel CPO
    CustomerPOWorkListService.prototype.cancelCustomerPO = function (CPOId, returnAmount) {
        return this.cancelCPO.query({ CPOId: CPOId, returnAmount: returnAmount }).$promise;
    };
    return CustomerPOWorkListService;
}());
app.service('CustomerPOWorkListService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new CustomerPOWorkListService($resource, $q, $log);
    }]);
//# sourceMappingURL=customerpoworklistservice.js.map
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SupplierReturnWorkListService = (function () {
    function SupplierReturnWorkListService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.fetchCuaseList = this.$resource(apiPaths.getSystemParamterListById);
        this.fetchSupplierReturnList = this.$resource(apiPaths.getSupplierReturnWorkList);
        this.fetchBranchList = this.$resource(apiPaths.getBranchList);
    }
    // used to fetch supplier list 
    SupplierReturnWorkListService.prototype.getSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    //used to fetch Return Cause List
    SupplierReturnWorkListService.prototype.getCauseList = function (id) {
        return this.fetchCuaseList.query({ id: id }).$promise;
    };
    //used to fetch Supplier Return Request List
    SupplierReturnWorkListService.prototype.getSupplierReturnList = function () {
        return this.fetchSupplierReturnList.query().$promise;
    };
    //this is used to fetch branchList of the current Logged-in user's company
    SupplierReturnWorkListService.prototype.getBranchList = function () {
        return this.fetchBranchList.query().$promise;
    };
    return SupplierReturnWorkListService;
}());
app.service('SupplierReturnWorkListService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SupplierReturnWorkListService($resource, $q, $log);
    }]);
//# sourceMappingURL=supplierReturnWorkListService.js.map
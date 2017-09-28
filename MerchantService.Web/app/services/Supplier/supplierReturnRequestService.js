/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SupplierReturnRequestService = (function () {
    function SupplierReturnRequestService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveSRRequest = this.$resource(apiPaths.saveSupplierReturnRequest, {}, { query: { method: "POST", isArray: false } });
        this.fetchBranchList = this.$resource(apiPaths.getBranchList);
        this.editSRRequest = this.$resource(apiPaths.updateSupplierReturnRequest, {}, { query: { method: "PUT", isArray: false } });
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.getItemProfile = this.$resource(apiPaths.fetchItemList);
        this.getCategory = this.$resource(apiPaths.getCategoryList, {}, { query: { method: "GET", isArray: true } });
        this.fetchUnitList = this.$resource(apiPaths.getUnitTypeList);
        this.fetchCuaseList = this.$resource(apiPaths.getSystemParamterListById);
        this.fetchSupplierReturnRequest = this.$resource(apiPaths.getSupReturnRequest, {}, { query: { method: 'GET', isArray: false } });
        this.printReceipt = this.$resource(apiPaths.printReturnReceipt, {}, { query: { method: 'GET', isArray: false } });
        this.getUserBranch = this.$resource(apiPaths.getUserBranchName, {}, { query: { method: "GET", isArray: false } });
    }
    //this is used to fetch branchList of the current Logged-in user's company - jj
    SupplierReturnRequestService.prototype.getBranchList = function () {
        return this.fetchBranchList.query().$promise;
    };
    //used to  save supplier return request-jj
    SupplierReturnRequestService.prototype.saveSupplierReturnRequest = function (SupplierReturnRequest) {
        return this.saveSRRequest.query(SupplierReturnRequest).$promise;
    };
    //used to  save supplier return request-jj
    SupplierReturnRequestService.prototype.updateSupplierReturnRequest = function (SupplierReturnRequest) {
        return this.editSRRequest.query(SupplierReturnRequest).$promise;
    };
    // used to fetch supplier list -jj
    SupplierReturnRequestService.prototype.getSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    //used to fetchbranch name of currently logged in user
    SupplierReturnRequestService.prototype.getUserBranchName = function () {
        return this.getUserBranch.query().$promise;
    };
    //used to fetch supplier return request-jj
    SupplierReturnRequestService.prototype.getSupplierReturnRequest = function (id) {
        return this.fetchSupplierReturnRequest.query({ id: id }).$promise;
    };
    //this service used for get item profile -jj
    SupplierReturnRequestService.prototype.getItemProfileList = function (BranchId) {
        return this.getItemProfile.query({ BranchId: BranchId }).$promise;
    };
    //this service used for get category list.-jj
    SupplierReturnRequestService.prototype.getCategoryList = function () {
        return this.getCategory.query().$promise;
    };
    //this service used for get unit list.-jj
    SupplierReturnRequestService.prototype.getUnitList = function () {
        return this.fetchUnitList.query().$promise;
    };
    //used to fetch Return Cause List-jj
    SupplierReturnRequestService.prototype.getCauseList = function (id) {
        return this.fetchCuaseList.query({ id: id }).$promise;
    };
    //used to get details for printing receipt-jj
    SupplierReturnRequestService.prototype.printReturnReceipt = function (Comment, SupplierReturnId) {
        return this.printReceipt.query({ Comment: Comment, SupplierReturnId: SupplierReturnId }).$promise;
    };
    return SupplierReturnRequestService;
}());
app.service('SupplierReturnRequestService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SupplierReturnRequestService($resource, $q, $log);
    }]);
//# sourceMappingURL=supplierReturnRequestService.js.map
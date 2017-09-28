/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SupplierPOService = (function () {
    function SupplierPOService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getSupplierItem = this.$resource(apiPaths.getSupplierItem);
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.saveSupplierPO = this.$resource(apiPaths.saveSuppliersPO);
        this.getBranch = this.$resource(apiPaths.getUserBranch);
        this.getSPO = this.$resource(apiPaths.getSupplierPO, {}, { query: { method: 'GET', IsArray: false } });
        this.editSPO = this.$resource(apiPaths.updateSPO, {}, { query: { method: 'PUT', IsArray: false } });
        this.getUserBranch = this.$resource(apiPaths.getUserBranchName, {}, { query: { method: "GET", isArray: false } });
        this.getBranchs = this.$resource(apiPaths.getBranchList);
    }
    // used to fetch item list of the given SupplierId
    SupplierPOService.prototype.getItemList = function (SupplierId, BranchId) {
        return this.getSupplierItem.query({ SupplierId: SupplierId, BranchId: BranchId }).$promise;
    };
    // used to fetch supplier list 
    SupplierPOService.prototype.getSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    //used to add spo
    SupplierPOService.prototype.addSupplierPO = function (resource) {
        return this.saveSupplierPO.save(resource).$promise;
    };
    //used to fetch the branches of currently logged in branch 
    //if they have permission to add spo for other branches too
    //then a list would be send
    SupplierPOService.prototype.getUserBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //used to fetch spo of id
    SupplierPOService.prototype.getSupplierPO = function (id) {
        return this.getSPO.query({ id: id }).$promise;
    };
    //used to edit spo
    SupplierPOService.prototype.updateSupplierPO = function (resource) {
        return this.editSPO.query(resource).$promise;
    };
    //used to fetchbranch name of currently logged in user
    SupplierPOService.prototype.getUserBranchName = function () {
        return this.getUserBranch.query().$promise;
    };
    //used to fetch branchlist
    SupplierPOService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    return SupplierPOService;
}());
app.service('SupplierPOService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SupplierPOService($resource, $q, $log);
    }]);
//# sourceMappingURL=supplierPOService.js.map
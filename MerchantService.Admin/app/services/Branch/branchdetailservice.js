/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var BranchDetailService = (function () {
    function BranchDetailService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$log.log('BranchDetailService Call');
        this.getBranch = this.$resource(apiPaths.getBranchList, {}, { query: { method: 'GET', isArray: true } });
        this.addBranch = this.$resource(apiPaths.addBranchDetails);
        this.deleteBranch = this.$resource(apiPaths.deleteBranchDetails, {}, { query: { method: 'GET', isArray: false } });
        this.getCompany = this.$resource(apiPaths.getAllCompanyDetail, {}, { query: { method: 'GET', isArray: true } });
        this.getAdditionalService = this.$resource(apiPaths.getAdditionalServiceList);
        this.getBranchFromId = this.$resource(apiPaths.getBranchById);
        this.updateBranch = this.$resource(apiPaths.updateBranchDetails, {}, { update: { method: "PUT" } });
    }
    // used to get list of all branches whose IsDelete is false 
    BranchDetailService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    // used to add branch to the database
    BranchDetailService.prototype.addBranchDetail = function (resource) {
        return this.addBranch.save(resource).$promise;
    };
    //used to update branch  
    BranchDetailService.prototype.updateBranchDetail = function (branchDetail) {
        return this.updateBranch.update(branchDetail).$promise;
    };
    //
    BranchDetailService.prototype.deleteBranchDetail = function (id) {
        return this.deleteBranch.query({ id: id }).$promise;
    };
    // used to get Company List
    BranchDetailService.prototype.getCompanyList = function () {
        return this.getCompany.query().$promise;
    };
    // used to get Addtional Service List
    BranchDetailService.prototype.getAdditionalServiceList = function () {
        return this.getAdditionalService.query().$promise;
    };
    // used to fetch the Branch Detail of the given id
    BranchDetailService.prototype.getBranchById = function (branchId) {
        return this.getBranchFromId.get({ branchId: branchId }).$promise;
    };
    return BranchDetailService;
}());
BranchDetailService.serviceId = "BranchDetailService";
app.service("BranchDetailService", ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new BranchDetailService($resource, $q, $log);
    }]);
//# sourceMappingURL=branchdetailservice.js.map
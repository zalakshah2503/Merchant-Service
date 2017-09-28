/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var IcrService = (function () {
    function IcrService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.fetchBranchList = this.$resource(apiPaths.getBranchList);
        this.getItemProfile = this.$resource(apiPaths.fetchItemProfileList);
        this.fetchItemQuantityList = this.$resource(apiPaths.getItemQuantityList, {}, { query: { method: 'GET', isArray: true } });
        this.getCategory = this.$resource(apiPaths.getCategoryList, {}, { query: { method: "GET", isArray: true } });
        this.fetchUnitList = this.$resource(apiPaths.getUnitTypeList);
        this.addICR = this.$resource(apiPaths.saveICR);
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.getCompanyConfig = this.$resource(apiPaths.getCompanyConfiguration, {}, { query: { method: "GET", isArray: false } });
        this.editICR = this.$resource(apiPaths.updateICR);
        this.fetchICRDetail = this.$resource(apiPaths.getICRDetail, {}, { query: { method: 'GET', isArray: false } });
        this.getBrandGroupList = this.$resource(apiPaths.getSysParamterListById);
    }
    //this is used to fetch branchList of the current Logged-in user's company - jj
    IcrService.prototype.getBranchList = function () {
        return this.fetchBranchList.query().$promise;
    };
    //this service used for get item profile -jj
    IcrService.prototype.getItemProfileList = function () {
        return this.getItemProfile.query({ PriceCategory: 6 }).$promise;
    };
    // used to fetch supplier list 
    IcrService.prototype.getSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    //used to fetch quantity of the given item id
    IcrService.prototype.getItemQuantityList = function (id) {
        return this.fetchItemQuantityList.query({ id: id }).$promise;
    };
    //this service used for get category list.-jj
    IcrService.prototype.getCategoryList = function () {
        return this.getCategory.query().$promise;
    };
    //this service used for get unit list.-jj
    IcrService.prototype.getUnitList = function () {
        return this.fetchUnitList.query().$promise;
    };
    //used to add Item Change Request
    IcrService.prototype.saveICR = function (resource) {
        return this.addICR.save(resource).$promise;
    };
    //this service used for fetching CompanyConfiguration.-jj
    IcrService.prototype.getCompanyConfiguration = function () {
        return this.getCompanyConfig.query().$promise;
    };
    IcrService.prototype.updateICR = function (resource) {
        return this.editICR.save(resource).$promise;
    };
    //this service used for fetching ICR Detail.-jj
    IcrService.prototype.getICRDetail = function (Id) {
        return this.fetchICRDetail.query({ Id: Id }).$promise;
    };
    //used to fetch list of brands and groups 
    IcrService.prototype.getBrandGroup = function (id) {
        return this.getBrandGroupList.query({ id: id }).$promise;
    };
    return IcrService;
}());
IcrService.serviceId = "ICRService";
app.service('icrService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new IcrService($resource, $q, $log);
    }]);
//# sourceMappingURL=icrService.js.map
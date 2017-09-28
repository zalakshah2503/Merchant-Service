/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var CustomerPOService = (function () {
    function CustomerPOService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getBranch = this.$resource(apiPaths.getBranchList);
        this.fetchAllCustomerList = this.$resource(apiPaths.getCustomerList);
        this.fetchItemList = this.$resource(apiPaths.getItemList);
        this.getCategory = this.$resource(apiPaths.getCategoryList, {}, { query: { method: "GET", isArray: true } });
        this.fetchAddtionalServiceList = this.$resource(apiPaths.getAdditionalServiceList, {}, { query: { method: "GET", isArray: true } });
        this.addCPO = this.$resource(apiPaths.saveCPO);
        this.generateCPONum = this.$resource(apiPaths.generateCPONumber, {}, { query: { method: "GET", isArray: false } });
        this.getCustomer = this.$resource(apiPaths.getCustomerById, {}, { query: { method: "GET", isArray: false } });
        this.getCPOListByCustomerId = this.$resource(apiPaths.getCustomerPOListByCustomerId, {}, { query: { method: "GET", isArray: true } });
        this.fetchCPO = this.$resource(apiPaths.getCustomerPurchaseOrderByCPOId, {}, { query: { method: "GET", isArray: false } });
        this.fetchConfigurables = this.$resource(apiPaths.getConfigurables, {}, { query: { method: "GET", isArray: false } });
        this.getBrandGroupList = this.$resource(apiPaths.getSysParamterListById);
        this.getCustomerPODetail = this.$resource(apiPaths.getCustomerPODetail);
    }
    //used to fetch branchList
    CustomerPOService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    ////used to fetch customer list
    CustomerPOService.prototype.getAllCustomerList = function () {
        return this.fetchAllCustomerList.query().$promise;
    };
    CustomerPOService.prototype.getItemList = function (PriceCategory, BranchId) {
        return this.fetchItemList.query({ PriceCategory: PriceCategory, BranchId: BranchId }).$promise;
    };
    CustomerPOService.prototype.getAdditionalServiceList = function () {
        return this.fetchAddtionalServiceList.query().$promise;
    };
    CustomerPOService.prototype.saveCPO = function (resource) {
        return this.addCPO.save(resource).$promise;
    };
    CustomerPOService.prototype.generateCPONumber = function () {
        return this.generateCPONum.query().$promise;
    };
    //this service used for get customer by id.-jj
    CustomerPOService.prototype.getCustomerById = function (id) {
        return this.getCustomer.query({ id: id }).$promise;
    };
    //this service used for get category list.-jj
    CustomerPOService.prototype.getCategoryList = function () {
        return this.getCategory.query().$promise;
    };
    CustomerPOService.prototype.getCustomerPOListByCustomerId = function (customerId) {
        return this.getCPOListByCustomerId.query({ customerId: customerId }).$promise;
    };
    CustomerPOService.prototype.getCPO = function (cpoId) {
        return this.fetchCPO.query({ cpoId: cpoId }).$promise;
    };
    CustomerPOService.prototype.getConfigurables = function () {
        return this.fetchConfigurables.query().$promise;
    };
    //used to fetch list of brands and groups 
    CustomerPOService.prototype.getBrandGroup = function (id) {
        return this.getBrandGroupList.query({ id: id }).$promise;
    };
    //this service used for get customer PO Details.
    CustomerPOService.prototype.getCustomerPODetailList = function () {
        return this.getCustomerPODetail.query().$promise;
    };
    return CustomerPOService;
}());
app.service('CustomerPOService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new CustomerPOService($resource, $q, $log);
    }]);
//# sourceMappingURL=customerposervice.js.map
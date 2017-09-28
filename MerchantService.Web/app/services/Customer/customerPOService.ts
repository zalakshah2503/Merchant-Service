/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IcustomerPOService {
    getBranchList: () => void;
    getAllCustomerList: () => void;
    getItemList: (PriceCategory, BranchId) => void;
    getAdditionalServiceList: () => void;
    saveCPO: (resource) => void;
    generateCPONumber: () => void;
    getCustomerById: (id) => void;
    getCategoryList: () => void;
    getCustomerPOListByCustomerId: (customerId) => void;
    getCPO: (cpoId) => void;
    getConfigurables: () => void;
    getBrandGroup: (id) => void;
    getCustomerPODetailList: () => void;

}

class CustomerPOService {
    private $resource;
    private $q;
    private $log;
    public getBranch;
    public fetchAllCustomerList;
    public fetchItemList;
    public fetchAddtionalServiceList;
    public addCPO;
    public generateCPONum;
    public getCustomer;
    public getCategory;
    public getCPOListByCustomerId;
    public fetchCPO;
    public fetchConfigurables;
    public getBrandGroupList;
    public getCustomerPODetail;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getBranchList() {
        return this.getBranch.query().$promise;
    }
   
    ////used to fetch customer list
    getAllCustomerList() {
        return this.fetchAllCustomerList.query().$promise;
    }

    getItemList(PriceCategory, BranchId) {
        return this.fetchItemList.query({ PriceCategory: PriceCategory, BranchId: BranchId }).$promise;
    }

    getAdditionalServiceList() {
        return this.fetchAddtionalServiceList.query().$promise;
    }

    saveCPO(resource: Model.CustomerPO) {
        return this.addCPO.save(resource).$promise;
    }

    generateCPONumber() {
        return this.generateCPONum.query().$promise;
    }

    //this service used for get customer by id.-jj
    getCustomerById(id) {
        return this.getCustomer.query({ id: id }).$promise;
    }

    //this service used for get category list.-jj
    getCategoryList() {
        return this.getCategory.query().$promise;
    }

    getCustomerPOListByCustomerId(customerId) {
        return this.getCPOListByCustomerId.query({ customerId: customerId }).$promise;
    }

    getCPO(cpoId) {
        return this.fetchCPO.query({ cpoId: cpoId }).$promise;
    }

    getConfigurables() {
        return this.fetchConfigurables.query().$promise;
    }

    //used to fetch list of brands and groups 
    getBrandGroup(id) {
        return this.getBrandGroupList.query({ id: id }).$promise;
    }

    //this service used for get customer PO Details.
    getCustomerPODetailList() {
        return this.getCustomerPODetail.query().$promise;
    }

}

app.service('CustomerPOService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new CustomerPOService($resource, $q, $log);
}]);
 
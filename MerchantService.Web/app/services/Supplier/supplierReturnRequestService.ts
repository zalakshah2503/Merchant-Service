/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsupplierReturnRequestService {
    saveSupplierReturnRequest: (SupplierReturnRequest) => void;
    updateSupplierReturnRequest: (SupplierReturnRequest) => void;
    getSupplierList: () => void;
    //  getItemProfileList: (SupplierId,BranchId) => void;
    getItemProfileList: () => void;
    getCategoryList: () => void;
    getUnitList: () => void;
    getCauseList: (id) => void;
    getSupplierReturnRequest: (id) => void;
    getBranchList: () => void;
    getUserBranchName: () => void;
    printReturnReceipt: (Comment: string, SupplierReturnId: number) => void;
}

class SupplierReturnRequestService {
    private $resource;
    private $q;
    private $log;

    public saveSRRequest;
    public editSRRequest;
    public getSupplier;
    public fetchSupplierReturnRequest;
    public fetchBranchList;
    public getItemProfile;
    public fetchUnitList;
    public getCategory;
    public fetchCuaseList;
    public printReceipt;
    public getUserBranch;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getBranchList() {
        return this.fetchBranchList.query().$promise;
    }

    //used to  save supplier return request-jj
    saveSupplierReturnRequest(SupplierReturnRequest: Model.SupplierReturnRequest) {
        return this.saveSRRequest.query(SupplierReturnRequest).$promise;
    }

    //used to  save supplier return request-jj
    updateSupplierReturnRequest(SupplierReturnRequest: Model.SupplierReturnRequest) {
        return this.editSRRequest.query(SupplierReturnRequest).$promise;
    }
 
    // used to fetch supplier list -jj
    getSupplierList() {
        return this.getSupplier.query().$promise;
    }


    //used to fetchbranch name of currently logged in user
    getUserBranchName() {
        return this.getUserBranch.query().$promise;
    }

    //used to fetch supplier return request-jj
    getSupplierReturnRequest(id) {
        return this.fetchSupplierReturnRequest.query({ id: id }).$promise;
    }

    //this service used for get item profile -jj
    getItemProfileList(BranchId) {
        return this.getItemProfile.query({ BranchId: BranchId }).$promise;
    }

        
    //this service used for get category list.-jj
    getCategoryList() {
        return this.getCategory.query().$promise;
    }

    //this service used for get unit list.-jj
    getUnitList() {
        return this.fetchUnitList.query().$promise;
    }

    //used to fetch Return Cause List-jj
    getCauseList(id) {
        return this.fetchCuaseList.query({ id: id }).$promise;
    }

    //used to get details for printing receipt-jj
    printReturnReceipt(Comment, SupplierReturnId) {
        return this.printReceipt.query({ Comment: Comment, SupplierReturnId: SupplierReturnId }).$promise;
    }
}

app.service('SupplierReturnRequestService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SupplierReturnRequestService($resource, $q, $log);
}]);
 
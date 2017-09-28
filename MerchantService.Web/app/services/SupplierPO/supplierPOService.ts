/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsupplierPOService {

    getItemList: (SupplierId, BranchId) => void;
    getSupplierList: () => void;
    addSupplierPO: (resource) => void;
    updateSupplierPO: (resource) => void;
    getUserBranchList: () => void;
    getSupplierPO: (id) => void;
    getUserBranchName: () => void;
    getBranchList: () => void;
}

class SupplierPOService {
    private $resource;
    private $q;
    private $log;
    public getSupplierItem;
    public getSupplier;
    public saveSupplierPO;
    public editSPO;
    public getBranch;
    public getSPO;
    public getUserBranch;
    public getBranchs;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getItemList(SupplierId, BranchId) {
        return this.getSupplierItem.query({ SupplierId: SupplierId, BranchId: BranchId }).$promise;
    }

    // used to fetch supplier list 
    getSupplierList() {
        return this.getSupplier.query().$promise;
    }

    //used to add spo
    addSupplierPO(resource: Model.SupplierPO) {
        return this.saveSupplierPO.save(resource).$promise;
    }

    //used to fetch the branches of currently logged in branch 
    //if they have permission to add spo for other branches too
    //then a list would be send
    getUserBranchList() {
        return this.getBranch.query().$promise;
    }

    //used to fetch spo of id
    getSupplierPO(id) {
        return this.getSPO.query({ id: id }).$promise;
    }

    //used to edit spo
    updateSupplierPO(resource: Model.SupplierPO) {
        return this.editSPO.query(resource).$promise;
    }
    //used to fetchbranch name of currently logged in user
    getUserBranchName() {
        return this.getUserBranch.query().$promise;
    }

    //used to fetch branchlist
    getBranchList() {
        return this.getBranch.query().$promise;
    }
}

app.service('SupplierPOService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SupplierPOService($resource, $q, $log);
}]);
 
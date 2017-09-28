/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsupplierReturnWorkListService {
    getSupplierList: () => void;
    getCauseList: (id) => void;
    getSupplierReturnList: () => void;
    getBranchList: () => void;
    
}

class SupplierReturnWorkListService {
    private $resource;
    private $q;
    private $log;
    public getSupplier;
    public fetchCuaseList;
    public fetchSupplierReturnList;
    public fetchBranchList;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;

        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.fetchCuaseList = this.$resource(apiPaths.getSystemParamterListById);
        this.fetchSupplierReturnList = this.$resource(apiPaths.getSupplierReturnWorkList);
        this.fetchBranchList = this.$resource(apiPaths.getBranchList);
    }

    
    // used to fetch supplier list 
    getSupplierList() {
        return this.getSupplier.query().$promise;
    }
  
    //used to fetch Return Cause List
    getCauseList(id) {
        return this.fetchCuaseList.query({ id: id }).$promise;
    }

    //used to fetch Supplier Return Request List
    getSupplierReturnList() {
        return this.fetchSupplierReturnList.query().$promise;
    }

    //this is used to fetch branchList of the current Logged-in user's company
    getBranchList() {
        return this.fetchBranchList.query().$promise;
    }
}

app.service('SupplierReturnWorkListService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SupplierReturnWorkListService($resource, $q, $log);
}]);
 
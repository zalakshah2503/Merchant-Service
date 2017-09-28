/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IcustomerPOWorkListService {
    getCustomerPOWorkList: () => void;
    getBranchList: () => void;
    getCPODetail: (id) => void;
    cancelCustomerPO: (CPOId, returnAmount) => void;

}

class CustomerPOWorkListService {
    private $resource;
    private $q;
    private $log;
    public fetchCustomerPOWorkList;
    public getBranch;
    public getCPO;
    public cancelCPO;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.fetchCustomerPOWorkList = this.$resource(apiPaths.getCustomerPOWorkList, {}, { query: { method: 'GET', isArray: true } });
        this.getBranch = this.$resource(apiPaths.getBranchList);
        this.getCPO = this.$resource(apiPaths.getCustomerPO);
        this.cancelCPO = this.$resource(apiPaths.cancelCPO, {}, { query: { method: "GET", isArray: false } });
    }      
 
    // used to fetch customer PO Worklist 
    getCustomerPOWorkList() {
        return this.fetchCustomerPOWorkList.query().$promise;
    }
    
    //used to fetch branchList
    getBranchList() {
        return this.getBranch.query().$promise;
    }
   
    //used to fetch cpo with the given id
    getCPODetail(id) {
        return this.getCPO.get({ id: id }).$promise;
    }

    //used to cancel CPO
    cancelCustomerPO(CPOId, returnAmount) {
        return this.cancelCPO.query({ CPOId: CPOId, returnAmount: returnAmount }).$promise;
    }
}

app.service('CustomerPOWorkListService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new CustomerPOWorkListService($resource, $q, $log);
}]);
 
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IspoReceivingService {

    saveSPOBillItem: (resource) => void;
    getBranchList: () => void;
    getSPO: (id) => void;
    receiveSPOItem: (resource) => void;
    endReceiving: (resource) => void;
    addSPOBill: (poSupplierBill) => void;
    deleteSPOBill: (BillId) => void;
}

class SpoReceivingService {
    private $resource;
    private $q;
    private $log;
    public saveSupplierPO;
    public fetchBranchList;
    public fetchSPO;
    public receiveSupplierItem;
    public endReceive;
    public addBill;
    public deleteBill;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;

        this.saveSupplierPO = this.$resource(apiPaths.saveSPOBillItem);
        this.fetchSPO = this.$resource(apiPaths.getSpoReceiving, {}, { query: { method: 'GET', isArray: false } });
        this.fetchBranchList = this.$resource(apiPaths.getUserBranch);
        this.receiveSupplierItem = this.$resource(apiPaths.receiveSPOItem);
        this.endReceive = this.$resource(apiPaths.endReceiving);
        this.addBill = this.$resource(apiPaths.addSPOBill);
        this.deleteBill = this.$resource(apiPaths.deleteSPOBill, {}, { query: { method: 'GET', isArray: false } });

    }  
     
   


    //used to add spo - jj
    saveSPOBillItem(resource: Model.SPOReceiving) {
        return this.saveSupplierPO.save(resource).$promise;
    }


    //used to add bill - jj
    addSPOBill(poSupplierBill) {
        return this.addBill.save(poSupplierBill).$promise;
    }

    //used to delete SPO Bill - jj
    deleteSPOBill(BillId) {
        return this.deleteBill.query({ BillId: BillId }).$promise;
    }


    //used to get details of current spo - jj
    getSPO(id) {
        return this.fetchSPO.query({ id: id }).$promise;
    }

    //used to fetch branchlist - jj
    getBranchList() {
        return this.fetchBranchList.query().$promise;
    }

    //used to receive spo item - jj
    receiveSPOItem(resource) {
        return this.receiveSupplierItem.save(resource).$promise;
    }

    //used to end receive spo - jj
    endReceiving(resource) {
        return this.endReceive.save(resource).$promise;
    }
}

app.service('SpoReceivingService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SpoReceivingService($resource, $q, $log);
}]);
 
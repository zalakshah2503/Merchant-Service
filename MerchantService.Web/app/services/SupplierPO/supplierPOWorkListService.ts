/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsupplierPOWorkListService {

    getSupplierPOWorkList: () => void;
    getSupplierList: () => void;
    getBranchList: () => void;
    getSPO: (id) => void;
    getSPOBill: (id) => void;
    verifyBill: (id) => void;
    verifySPO: (id, Comment) => void;
    submitSPO: (SupplierPOId, Comment) => void;
    deleteSPO: (Id) => void;
    approveSPO: (Comment: string, RecordId: number) => void;
    reviewSPO: (Comment: string, RecordId: number) => void;
    resubmitSPO: (POId: number, Comment: string) => void;
    rejectSPO: (Comment: string, RecordId: number) => void;
    cancelSPO: (Comment: string, RecordId: number) => void;
    send: (Comment: string, RecordId: number) => void;
    approveCancelSPO: (Comment: string, RecordId: number, Status: number) => void;
    getCurrentUserDetail;
    getRecevingPurchaseOrderById: (purchaseOrderId: number) => any;

}

class SupplierPOWorkListService {
    private $resource;
    private $q;
    private $log;
    public fetchSupplierPOWorkList;
    public getSupplierProfileList;
    public getBranch;
    public getSPOrder;
    public getWorkFlowLog;
    public approveSupplierPO;
    public reviewSupplierPO;
    public rejectSupplierPO;
    public cancelSupplierPO;
    public approveCancelSupplierPO;
    public getCurrentUser;
    public sendEmail;
    public getBill;
    public verifySPOBill;
    public verifySupplierPO;
    public resubmitSupplierPO;
    public receivingPurchaseOrder;
    public submitSupplierPO;
    public deleteSupplierPO;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.fetchSupplierPOWorkList = this.$resource(apiPaths.getSupplierPOWorkList, {}, { query: { method: 'GET', isArray: true } });
        this.getSupplierProfileList = this.$resource(apiPaths.getSupplierProfileList, {}, { query: { method: 'GET', isArray: true } });
        this.getBranch = this.$resource(apiPaths.getBranchList);
        this.getSPOrder = this.$resource(apiPaths.getSPO, {}, { query: { method: 'GET', isArray: false } });
        this.approveSupplierPO = this.$resource(apiPaths.approveSPO, {}, { query: { method: 'GET', isArray: false } });
        this.reviewSupplierPO = this.$resource(apiPaths.reviewSPO, {}, { query: { method: 'GET', isArray: false } });
        this.resubmitSupplierPO = this.$resource(apiPaths.resubmitSPO, {}, { query: { method: 'GET', isArray: false } });
        this.sendEmail = this.$resource(apiPaths.sendSPO, {}, { query: { method: 'GET', isArray: false } });
        this.rejectSupplierPO = this.$resource(apiPaths.rejectSPO, {}, { query: { method: 'GET', isArray: false } });
        this.cancelSupplierPO = this.$resource(apiPaths.cancelSPO, {}, { query: { method: 'GET', IsArray: false } });
        this.approveCancelSupplierPO = this.$resource(apiPaths.approveCancelSPO);
        this.getCurrentUser = this.$resource(apiPaths.getCurrentUser, {}, { query: { method: 'GET', isArray: false } });
        this.getBill = this.$resource(apiPaths.getSPOBill);
        this.verifySPOBill = this.$resource(apiPaths.verifyBill, {}, { query: { method: 'GET', isArray: false } });
        this.verifySupplierPO = this.$resource(apiPaths.verifySPO, {}, { query: { method: 'GET', isArray: false } });
        this.receivingPurchaseOrder = this.$resource(apiPaths.receivingPurchaseOrder);
        this.submitSupplierPO = this.$resource(apiPaths.submitSPO, { SupplierPOId: "@SupplierPOId", Comment: "@Comment" }, { update: { method: "PUT" } });
        this.deleteSupplierPO = this.$resource(apiPaths.deleteSPO, { Id: "@Id" }, { update: { method: "PUT" } });
    }      
 
    // used to fetch item list of the given SupplierId - jj
    getSPOBill(id) {
        return this.getBill.query({ id: id }).$promise;
    }
    
    // used to verify bill of the given id - jj
    verifyBill(id) {
        return this.verifySPOBill.query({ id: id }).$promise;
    }

    // used to delete spo of the given id - jj
    deleteSPO(Id) {
        return this.deleteSupplierPO.update({ Id: Id }).$promise;
    }

    // used to submit spo of the given id - jj
    submitSPO(SupplierPOId, Comment) {
        return this.submitSupplierPO.update({ SupplierPOId: SupplierPOId, Comment: Comment }).$promise;
    }
    
    // used to verify spo of the given id - jj
    verifySPO(id, Comment) {
        return this.verifySupplierPO.query({ id: id, Comment: Comment }).$promise;
    }

    // used to fetch supplier PO Worklist -jj
    getSupplierPOWorkList() {
        return this.fetchSupplierPOWorkList.query().$promise;
    }

    //used to fetch list of suppliers - jj
    getSupplierList() {
        return this.getSupplierProfileList.query().$promise;
    }

    //used to fetch branchlist - jj
    getBranchList() {
        return this.getBranch.query().$promise;
    }

    //used to fetch spo with given id - jj
    getSPO(id) {
        return this.getSPOrder.query({ id: id }).$promise;
    }

    //used to approve spo - jj
    approveSPO(Comments, RecordId) {
        return this.approveSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    }

    //used to review spo - jj
    reviewSPO(Comments, RecordId) {
        return this.reviewSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    }

    //used to resubmit spo - jj
    resubmitSPO(POId, Comments) {
        return this.resubmitSupplierPO.query({ POId: POId, Comment: Comments }).$promise;
    }

    //used to approve spo -jj
    send(Comments, RecordId) {
        return this.sendEmail.query({ Comment: Comments, RecordId: RecordId }).$promise;
    }

    //used to reject spo - jj
    rejectSPO(Comments, RecordId) {
        return this.rejectSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    }

    //used to cancel spo - jj
    cancelSPO(Comments, RecordId) {
        return this.cancelSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    }

    //used to approve cancellation of spo - jj
    approveCancelSPO(Comments, RecordId, Status) {
        return this.approveCancelSupplierPO.query({ Comment: Comments, RecordId: RecordId, Status: Status }).$promise;
    } 
    
    //used to fetch cuurently logged in user details    - jj
    getCurrentUserDetail() {
        return this.getCurrentUser.query().$promise;
    }

    getRecevingPurchaseOrderById(purchaseOrderId) {
        return this.receivingPurchaseOrder.get({ purchaseOrderId: purchaseOrderId }).$promise;
    }
}

app.service('SupplierPOWorkListService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SupplierPOWorkListService($resource, $q, $log);
}]);
 
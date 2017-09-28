/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsupplierReturnDetailService {

    getSupplierReturnRequest: (id) => void;
    rejectSupReturnRequest: (id, Comment: string) => void;
    deleteSupReturnRequest: (id, Comment: string) => void;
    approveSupReturnRequest: (RecordId: number, Comment: string, status: boolean, SupplierReturnId: number) => void;
    getCurrentUserDetail: () => void;
    printReturnReceipt: (Comment: string, SupplierReturnId: number) => void;
    resubmitSupReturnRequest: (Id: number, Comment: string) => void;
}

class SupplierReturnDetailService {
    private $resource;
    private $q;
    private $log;
    public fetchSupplierReturnRequest;
    public rejectReturnRequest;
    public deleteReturnRequest;
    public approve;
    public getCurrentUser;
    public printReceipt;
    public resubmitSupplierReturnRequest;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;

        this.fetchSupplierReturnRequest = this.$resource(apiPaths.getSupReturnRequest, {}, { query: { method: 'GET', isArray: false } });
        this.rejectReturnRequest = this.$resource(apiPaths.rejectSupReturnRequest, {}, { query: { method: 'GET', isArray: false } });
        this.deleteReturnRequest = this.$resource(apiPaths.deleteSupReturnRequest, {}, { query: { method: 'GET', isArray: false } });
        this.approve = this.$resource(apiPaths.approveSupReturnRequest, {}, { query: { method: 'GET', isArray: false } });
        this.getCurrentUser = this.$resource(apiPaths.getCurrentUser, {}, { query: { method: 'GET', isArray: false } });
        this.resubmitSupplierReturnRequest = this.$resource(apiPaths.resubmitSupReturnRequest, {}, { query: { method: 'GET', isArray: false } });
        this.printReceipt = this.$resource(apiPaths.printReturnReceipt, {}, { query: { method: 'GET', isArray: false } });
    }

       
    //used to fetch supplier return request -jj
    getSupplierReturnRequest(id) {
        return this.fetchSupplierReturnRequest.query({ id: id }).$promise;
    }

    //used to reject Supplier Return Request - jj
    rejectSupReturnRequest(id, Comment) {
        return this.rejectReturnRequest.query({ id: id, Comment: Comment }).$promise;
    }
    
    //used to delete Supplier Return Request - jj
    deleteSupReturnRequest(id, Comment) {
        return this.deleteReturnRequest.query({ id: id, Comment: Comment }).$promise;
    }

    //this service is used to approve Supplier Return Request - jj
    approveSupReturnRequest(RecordId, Comment, status, SupplierReturnId) {
        return this.approve.query({ RecordId: RecordId, Comment: Comment, status: status, SupplierReturnId: SupplierReturnId }).$promise;
    }

    //this service is used to resubmit Supplier Return Request - jj
    resubmitSupReturnRequest(Id, Comment) {
        return this.resubmitSupplierReturnRequest.query({ Id: Id, Comment: Comment }).$promise;
    }

    //used to fetch cuurently logged in user details   
    getCurrentUserDetail() {
        return this.getCurrentUser.query().$promise;
    }

    //used to get details for printing receipt
    printReturnReceipt(Comment, SupplierReturnId) {
        return this.printReceipt.query({ Comment: Comment, SupplierReturnId: SupplierReturnId }).$promise;
    }
}

app.service('SupplierReturnDetailService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SupplierReturnDetailService($resource, $q, $log);
}]);
 
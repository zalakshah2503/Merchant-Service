/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SupplierReturnDetailService = (function () {
    function SupplierReturnDetailService($resource, $q, $log) {
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
    SupplierReturnDetailService.prototype.getSupplierReturnRequest = function (id) {
        return this.fetchSupplierReturnRequest.query({ id: id }).$promise;
    };
    //used to reject Supplier Return Request - jj
    SupplierReturnDetailService.prototype.rejectSupReturnRequest = function (id, Comment) {
        return this.rejectReturnRequest.query({ id: id, Comment: Comment }).$promise;
    };
    //used to delete Supplier Return Request - jj
    SupplierReturnDetailService.prototype.deleteSupReturnRequest = function (id, Comment) {
        return this.deleteReturnRequest.query({ id: id, Comment: Comment }).$promise;
    };
    //this service is used to approve Supplier Return Request - jj
    SupplierReturnDetailService.prototype.approveSupReturnRequest = function (RecordId, Comment, status, SupplierReturnId) {
        return this.approve.query({ RecordId: RecordId, Comment: Comment, status: status, SupplierReturnId: SupplierReturnId }).$promise;
    };
    //this service is used to resubmit Supplier Return Request - jj
    SupplierReturnDetailService.prototype.resubmitSupReturnRequest = function (Id, Comment) {
        return this.resubmitSupplierReturnRequest.query({ Id: Id, Comment: Comment }).$promise;
    };
    //used to fetch cuurently logged in user details   
    SupplierReturnDetailService.prototype.getCurrentUserDetail = function () {
        return this.getCurrentUser.query().$promise;
    };
    //used to get details for printing receipt
    SupplierReturnDetailService.prototype.printReturnReceipt = function (Comment, SupplierReturnId) {
        return this.printReceipt.query({ Comment: Comment, SupplierReturnId: SupplierReturnId }).$promise;
    };
    return SupplierReturnDetailService;
}());
app.service('SupplierReturnDetailService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SupplierReturnDetailService($resource, $q, $log);
    }]);
//# sourceMappingURL=supplierReturnDetailService.js.map
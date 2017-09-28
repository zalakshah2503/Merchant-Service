/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SupplierPOWorkListService = (function () {
    function SupplierPOWorkListService($resource, $q, $log) {
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
    SupplierPOWorkListService.prototype.getSPOBill = function (id) {
        return this.getBill.query({ id: id }).$promise;
    };
    // used to verify bill of the given id - jj
    SupplierPOWorkListService.prototype.verifyBill = function (id) {
        return this.verifySPOBill.query({ id: id }).$promise;
    };
    // used to delete spo of the given id - jj
    SupplierPOWorkListService.prototype.deleteSPO = function (Id) {
        return this.deleteSupplierPO.update({ Id: Id }).$promise;
    };
    // used to submit spo of the given id - jj
    SupplierPOWorkListService.prototype.submitSPO = function (SupplierPOId, Comment) {
        return this.submitSupplierPO.update({ SupplierPOId: SupplierPOId, Comment: Comment }).$promise;
    };
    // used to verify spo of the given id - jj
    SupplierPOWorkListService.prototype.verifySPO = function (id, Comment) {
        return this.verifySupplierPO.query({ id: id, Comment: Comment }).$promise;
    };
    // used to fetch supplier PO Worklist -jj
    SupplierPOWorkListService.prototype.getSupplierPOWorkList = function () {
        return this.fetchSupplierPOWorkList.query().$promise;
    };
    //used to fetch list of suppliers - jj
    SupplierPOWorkListService.prototype.getSupplierList = function () {
        return this.getSupplierProfileList.query().$promise;
    };
    //used to fetch branchlist - jj
    SupplierPOWorkListService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //used to fetch spo with given id - jj
    SupplierPOWorkListService.prototype.getSPO = function (id) {
        return this.getSPOrder.query({ id: id }).$promise;
    };
    //used to approve spo - jj
    SupplierPOWorkListService.prototype.approveSPO = function (Comments, RecordId) {
        return this.approveSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    };
    //used to review spo - jj
    SupplierPOWorkListService.prototype.reviewSPO = function (Comments, RecordId) {
        return this.reviewSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    };
    //used to resubmit spo - jj
    SupplierPOWorkListService.prototype.resubmitSPO = function (POId, Comments) {
        return this.resubmitSupplierPO.query({ POId: POId, Comment: Comments }).$promise;
    };
    //used to approve spo -jj
    SupplierPOWorkListService.prototype.send = function (Comments, RecordId) {
        return this.sendEmail.query({ Comment: Comments, RecordId: RecordId }).$promise;
    };
    //used to reject spo - jj
    SupplierPOWorkListService.prototype.rejectSPO = function (Comments, RecordId) {
        return this.rejectSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    };
    //used to cancel spo - jj
    SupplierPOWorkListService.prototype.cancelSPO = function (Comments, RecordId) {
        return this.cancelSupplierPO.query({ Comment: Comments, RecordId: RecordId }).$promise;
    };
    //used to approve cancellation of spo - jj
    SupplierPOWorkListService.prototype.approveCancelSPO = function (Comments, RecordId, Status) {
        return this.approveCancelSupplierPO.query({ Comment: Comments, RecordId: RecordId, Status: Status }).$promise;
    };
    //used to fetch cuurently logged in user details    - jj
    SupplierPOWorkListService.prototype.getCurrentUserDetail = function () {
        return this.getCurrentUser.query().$promise;
    };
    SupplierPOWorkListService.prototype.getRecevingPurchaseOrderById = function (purchaseOrderId) {
        return this.receivingPurchaseOrder.get({ purchaseOrderId: purchaseOrderId }).$promise;
    };
    return SupplierPOWorkListService;
}());
app.service('SupplierPOWorkListService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SupplierPOWorkListService($resource, $q, $log);
    }]);
//# sourceMappingURL=supplierpoworklistservice.js.map
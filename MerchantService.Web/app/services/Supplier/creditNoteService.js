var CreditNoteService = (function () {
    function CreditNoteService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.supplierList = $resource(apiPaths.getSupplierProfileList);
        this.getCreditNote = $resource(apiPaths.getCreditNoteList);
        this.submitReceivigCreditNoteDetail = $resource(apiPaths.submitReceivigCreditNoteDetail);
    }
    //this service used for get supplier list.
    CreditNoteService.prototype.getSupplierList = function () {
        return this.supplierList.query().$promise;
    };
    //this service used for get 
    CreditNoteService.prototype.getCreditNoteList = function (supplierId) {
        return this.getCreditNote.query({ supplierId: supplierId }).$promise;
    };
    CreditNoteService.prototype.submitReceivigCreditNote = function (resource) {
        return this.submitReceivigCreditNoteDetail.save(resource).$promise;
    };
    return CreditNoteService;
}());
app.service('CreditNoteService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new CreditNoteService($resource, $q, $log);
    }]);
//# sourceMappingURL=creditNoteService.js.map
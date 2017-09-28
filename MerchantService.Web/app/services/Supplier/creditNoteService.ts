interface IcreditNoteService {
    getSupplierList: () => void;
    getCreditNoteList: (supplierId) => void;
    submitReceivigCreditNote: (resource) => void;
}

class CreditNoteService implements IcreditNoteService {
    private $resource;
    private $q;
    private $log;
    public supplierList;
    public getCreditNote;
    public submitReceivigCreditNoteDetail;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.supplierList = $resource(apiPaths.getSupplierProfileList);
        this.getCreditNote = $resource(apiPaths.getCreditNoteList);
        this.submitReceivigCreditNoteDetail = $resource(apiPaths.submitReceivigCreditNoteDetail);
    }

    //this service used for get supplier list.
    getSupplierList() {
        return this.supplierList.query().$promise;
    }

    //this service used for get 
    getCreditNoteList(supplierId) {
        return this.getCreditNote.query({ supplierId: supplierId }).$promise;
    }

    submitReceivigCreditNote(resource: Model.RecevingCreditNote) {
        return this.submitReceivigCreditNoteDetail.save(resource).$promise;
    }
}

app.service('CreditNoteService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new CreditNoteService($resource, $q, $log);
}]);
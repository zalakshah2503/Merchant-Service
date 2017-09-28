/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IspoPaymentService {
    saveSPOPayment: (resource) => void;
    getSupplierList: () => void;
    getSupplierBillList: () => void;
    getCreditNoteList: (SupplierId) => void;
    checkCondition: (sPOReceivingBill) => void;
    checkSPO: (PONumber) => void;
}

class SpoPaymentService {
    private $resource;
    private $q;
    private $log;
    public saveSupplierPOPayment;
    public getSupplier;
    public getBill;
    public getCreditNote;
    public checkConditions;
    public checkSupplierPO;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;

        this.saveSupplierPOPayment = this.$resource(apiPaths.saveSupplierPayment);
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.getBill = this.$resource(apiPaths.getSupplierBillList);
        this.getCreditNote = this.$resource(apiPaths.getCreditNote);
        this.checkSupplierPO = this.$resource(apiPaths.checkSPO, {}, { query: { method: "GET", isArray: false } });
        this.checkConditions = this.$resource(apiPaths.checkCondition, { sPOReceivingBill: "@sPOReceivingBill" }, { update: { method: "PUT", isArray: true } });
    }  
     
    // used to fetch supplier list -jj
    getSupplierList() {
        return this.getSupplier.query().$promise;
    }

    // used to fetch supplier list -jj
    getSupplierBillList() {
        return this.getBill.query().$promise;
    }

    //used to save spo bill payment -jj
    saveSPOPayment(resource) {
        return this.saveSupplierPOPayment.save(resource).$promise;
    }

    //used to fetch credit note of selected supplier- jj
    getCreditNoteList(SupplierId) {
        return this.getCreditNote.query({ SupplierId: SupplierId }).$promise;
    }

    //used to check whether spo is verified and not paid- jj
    checkSPO(PONumber) {
        return this.checkSupplierPO.query({ PONumber: PONumber }).$promise;
    }

    //used to check whether discount has changed- jj
    checkCondition(sPOReceivingBill) {
        return this.checkConditions.update(sPOReceivingBill).$promise;
    }
}

app.service('SpoPaymentService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SpoPaymentService($resource, $q, $log);
}]);
 
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsupplierProfileService {
    saveSupplierProfile: (resource) => void;
    getSupplierList: () => void;
    deleteSupplierProfile: (id) => void;
    updateSupplier: (resource) => void;
    getDaysDiscountList: (id) => void;
    getSupplierTypeList: () => void;
    checkSPOExist: (id) => void;

    getContactList: (id) => void;
    saveContactPerson: (resource) => void;
    deleteContactPerson: (id) => void;
    updateContactPerson: (resource) => void;
}

class SupplierProfileService {
    private $resource;
    private $q;
    private $log;
    public saveSupplier;
    public getSupplierProfileList;
    public deleteSupplier;
    public updateSupplierProfile;
    public getDaysLimitList;
    public getSupplierType;
    public supplierUsed;

    public getContactPersonList;
    public saveContact;
    public deleteContact;
    public updateContact;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveSupplier = this.$resource(apiPaths.saveSupplierProfile);
        this.getSupplierProfileList = this.$resource(apiPaths.getSupplierProfileList);
        this.deleteSupplier = this.$resource(apiPaths.deleteSupplier, {}, { query: { method: 'GET', isArray: false } });
        this.updateSupplierProfile = this.$resource(apiPaths.updateSupplier, { resource: "@resource" }, { update: { method: "PUT" } });
        this.getDaysLimitList = this.$resource(apiPaths.getDaysLimitList, {}, { query: { method: 'GET', isArray: true } });
        this.getSupplierType = this.$resource(apiPaths.getSupplierTypeList);
        this.supplierUsed = this.$resource(apiPaths.checkSPOExist, {}, { query: { method: 'GET', isArray: false } });

        this.getContactPersonList = this.$resource(apiPaths.getContactPersonList);
        this.saveContact = this.$resource(apiPaths.saveContactPerson);
        this.deleteContact = this.$resource(apiPaths.deleteContactPerson);
        this.updateContact = this.$resource(apiPaths.updateContactPerson, { resource: "@resource" }, { update: { method: "PUT" } });
    }

    //used to save supplier
    saveSupplierProfile(resource: Model.SupplierProfile) {
        return this.saveSupplier.save(resource).$promise;
    }

    //used to check whether supplier is involved in some other activity
    checkSPOExist(id) {
        return this.supplierUsed.query({ id: id }).$promise;
    }

    // used to get supplier list from database
    getSupplierList() {
        return this.getSupplierProfileList.query().$promise;
    }

    // used to delete supplier
    deleteSupplierProfile(id) {
        return this.deleteSupplier.query({ id: id }).$promise;
    }

    //used to update supplier
    updateSupplier(resource: Model.SupplierProfile) {
        return this.updateSupplierProfile.update(resource).$promise;
    }

    //used to fetch supplier type list
    getSupplierTypeList() {
        return this.getSupplierType.query().$promise;
    }

    // used to get contact list of the given supplierId
    getContactList(id) {
        return this.getContactPersonList.query({ id: id }).$promise;
    }

    // used to add contact person to the database
    saveContactPerson(resource: Model.ContactPerson) {
        return this.saveContact.save(resource).$promise;
    }

    //used to delete contact person
    deleteContactPerson(id) {
        return this.deleteContact.query({ id: id }).$promise;
    }

    // used to update contact person
    updateContactPerson(resource: Model.ContactPerson) {
        return this.updateContact.update(resource).$promise;
    }

    // used to fetch discount and days list of the given SupplierId
    getDaysDiscountList(id) {
        return this.getDaysLimitList.query({ id: id }).$promise;
    }

}

app.service('SupplierProfileService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new SupplierProfileService($resource, $q, $log);
}]);
 
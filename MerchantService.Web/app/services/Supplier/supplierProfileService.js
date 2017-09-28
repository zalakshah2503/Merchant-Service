/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SupplierProfileService = (function () {
    function SupplierProfileService($resource, $q, $log) {
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
    SupplierProfileService.prototype.saveSupplierProfile = function (resource) {
        return this.saveSupplier.save(resource).$promise;
    };
    //used to check whether supplier is involved in some other activity
    SupplierProfileService.prototype.checkSPOExist = function (id) {
        return this.supplierUsed.query({ id: id }).$promise;
    };
    // used to get supplier list from database
    SupplierProfileService.prototype.getSupplierList = function () {
        return this.getSupplierProfileList.query().$promise;
    };
    // used to delete supplier
    SupplierProfileService.prototype.deleteSupplierProfile = function (id) {
        return this.deleteSupplier.query({ id: id }).$promise;
    };
    //used to update supplier
    SupplierProfileService.prototype.updateSupplier = function (resource) {
        return this.updateSupplierProfile.update(resource).$promise;
    };
    //used to fetch supplier type list
    SupplierProfileService.prototype.getSupplierTypeList = function () {
        return this.getSupplierType.query().$promise;
    };
    // used to get contact list of the given supplierId
    SupplierProfileService.prototype.getContactList = function (id) {
        return this.getContactPersonList.query({ id: id }).$promise;
    };
    // used to add contact person to the database
    SupplierProfileService.prototype.saveContactPerson = function (resource) {
        return this.saveContact.save(resource).$promise;
    };
    //used to delete contact person
    SupplierProfileService.prototype.deleteContactPerson = function (id) {
        return this.deleteContact.query({ id: id }).$promise;
    };
    // used to update contact person
    SupplierProfileService.prototype.updateContactPerson = function (resource) {
        return this.updateContact.update(resource).$promise;
    };
    // used to fetch discount and days list of the given SupplierId
    SupplierProfileService.prototype.getDaysDiscountList = function (id) {
        return this.getDaysLimitList.query({ id: id }).$promise;
    };
    return SupplierProfileService;
}());
app.service('SupplierProfileService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new SupplierProfileService($resource, $q, $log);
    }]);
//# sourceMappingURL=supplierProfileService.js.map
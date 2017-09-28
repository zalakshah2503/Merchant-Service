/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var CategoryService = (function () {
    function CategoryService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getBrandGroupList = this.$resource(apiPaths.getSysParamterListById);
        this.getSupplierList = this.$resource(apiPaths.getSupplierProfileList);
        this.addCategory = this.$resource(apiPaths.saveCategory);
        this.getCategoryList = this.$resource(apiPaths.getCategoryList);
        this.addItemSupplier = this.$resource(apiPaths.saveItemSupplier);
        this.removeCategory = this.$resource(apiPaths.deleteCategory, {}, { update: { method: "PUT" } });
        this.removeItemSupplier = this.$resource(apiPaths.deleteItemSupplier);
        this.canRemoveItemSupplier = this.$resource(apiPaths.canDeleteItemSupplier, {}, { query: { method: "GET", isArray: false } });
    }
    //used to fetch list of brands and groups 
    CategoryService.prototype.getBrandGroup = function (id) {
        return this.getBrandGroupList.query({ id: id }).$promise;
    };
    // used to fetch list of suppliers
    CategoryService.prototype.getSupplier = function () {
        return this.getSupplierList.query().$promise;
    };
    // used to save category
    CategoryService.prototype.saveCategory = function (resource) {
        return this.addCategory.save(resource).$promise;
    };
    // used to get list of category
    CategoryService.prototype.getCategory = function () {
        return this.getCategoryList.query().$promise;
    };
    //used to save supplier of category
    CategoryService.prototype.saveItemSupplier = function (resource) {
        return this.addItemSupplier.save(resource).$promise;
    };
    // used to delete category
    CategoryService.prototype.deleteCategory = function (resource) {
        return this.removeCategory.update(resource).$promise;
    };
    //used to delete supplier of category
    CategoryService.prototype.deleteItemSupplier = function (supplierId) {
        return this.removeItemSupplier.query({ supplierId: supplierId }).$promise;
    };
    //used to check whether item supploer can be deleted or not
    CategoryService.prototype.canDeleteItemSupplier = function (categoryId, supplierId) {
        return this.canRemoveItemSupplier.query({ categoryId: categoryId, supplierId: supplierId }).$promise;
    };
    return CategoryService;
}());
CategoryService.serviceId = "categoryService";
app.service('categoryService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new CategoryService($resource, $q, $log);
    }]);
//# sourceMappingURL=categoryservice.js.map
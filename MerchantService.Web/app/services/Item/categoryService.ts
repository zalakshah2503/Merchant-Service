/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IcategoryService {
    getBrandGroup: (id) => void;
    getSupplier: () => void;
    saveCategory: (resource) => void;
    getCategory: () => void;
    saveItemSupplier: (resource) => void;
    deleteCategory: (resource) => void;
    deleteItemSupplier: (supplierId) => void;
    canDeleteItemSupplier: (categoryId, supplierId) => any;
}

class CategoryService {
    static serviceId = "categoryService";
    private $resource;
    private $q;
    private $log;
    public getBrandGroupList;
    public getSupplierList;
    public addCategory;
    public getCategoryList;
    public addItemSupplier;
    public removeCategory;
    public removeItemSupplier;
    public canRemoveItemSupplier;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getBrandGroup(id) {
        return this.getBrandGroupList.query({ id: id }).$promise;
    }

    // used to fetch list of suppliers
    getSupplier() {
        return this.getSupplierList.query().$promise;
    }

    // used to save category
    saveCategory(resource: Model.Category) {
        return this.addCategory.save(resource).$promise;
    }

    // used to get list of category
    getCategory() {
        return this.getCategoryList.query().$promise;
    }

    //used to save supplier of category
    saveItemSupplier(resource: Model.ItemSupplier) {
        return this.addItemSupplier.save(resource).$promise;
    }

    // used to delete category
    deleteCategory(resource: Model.Category) {
        return this.removeCategory.update(resource).$promise;
    }

    //used to delete supplier of category
    deleteItemSupplier(supplierId) {
        return this.removeItemSupplier.query({ supplierId: supplierId }).$promise;
    }
    //used to check whether item supploer can be deleted or not
    canDeleteItemSupplier(categoryId, supplierId) {
        return this.canRemoveItemSupplier.query({ categoryId: categoryId, supplierId: supplierId }).$promise;
    }
}

app.service('categoryService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new CategoryService($resource, $q, $log);
}]);

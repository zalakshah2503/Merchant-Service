/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/categoryservice.ts" />
var CategoryController = (function () {
    function CategoryController($scope, $log, categoryService, ngToast, $rootScope, apiPath, filterFilter, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.categoryService = categoryService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$scope.category = new Model.Category;
        this.$scope.itemSupplier = new Model.ItemSupplier;
        this.$scope.addCategorys = function () { return _this.addCategorys(); };
        this.$scope.addSupplier = function (id) { return _this.addSupplier(id); };
        this.$scope.getBrandList = function () { return _this.getBrandList(); };
        this.$scope.getGroupList = function () { return _this.getGroupList(); };
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.saveCategory = function (category) { return _this.saveCategory(category); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.getCategoryList = function () { return _this.getCategoryList(); };
        this.$scope.saveItemSupplier = function (itemSupplier) { return _this.saveItemSupplier(itemSupplier); };
        this.$scope.deleteCategory = function (category) { return _this.deleteCategory(category); };
        this.$scope.deleteItemSupplier = function (supplierId) { return _this.deleteItemSupplier(supplierId); };
        this.$scope.openDeleteCategoryPopup = function (category) { return _this.openDeleteCategoryPopup(category); };
        this.$scope.closeDeleteCategoryPopup = function () { return _this.closeDeleteCategoryPopup(); };
        this.$scope.openDeleteItemSupplierPopup = function (id) { return _this.openDeleteItemSupplierPopup(id); };
        this.$scope.closeDeleteItemSupplierPopup = function () { return _this.closeDeleteItemSupplierPopup(); };
        this.$scope.isCategoryDeleteFailed = false;
        this.$scope.noCategoryFound = stringConstants.noCategoryFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.openDeleteCategoryFailurePopup = function () { return _this.openDeleteCategoryFailurePopup(); };
        this.$scope.closeDeleteCategoryFailurePopup = function () { return _this.closeDeleteCategoryFailurePopup(); };
        this.$scope.categoryDeleteFailed = stringConstants.categoryDeleteFailed;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.searchCategory = function () { return _this.searchCategory(); };
        this.$scope.supplierFormClear = function () { return _this.supplierFormClear(); };
        this.$scope.categoryFormClear = function () { return _this.categoryFormClear(); };
        this.$scope.onSeacrhSupplierNameChanged = function () { return _this.onSeacrhSupplierNameChanged(); };
        this.$scope.onSeacrhSupplierCodeChanged = function () { return _this.onSeacrhSupplierCodeChanged(); };
        this.$scope.brandList = [];
        this.$scope.groupList = [];
        this.$scope.supplierList = [];
        this.$scope.categoryList = [];
        this.$scope.itemSupplierList = [];
        this.$scope.isAddSupplierVisible = false;
        this.$scope.isAddCategoryVisible = false;
        this.$scope.categoryExists = false;
        this.$scope.supplierExists = false;
        this.$scope.categoryErrorMessageDisplay = false;
        this.$scope.isBrandSearchVisible = false;
        //pagination for category
        this.$scope.totalCollections = [];
        this.$scope.catList = [];
        this.$scope.search = [];
        this.$scope.categoryTotalCollection = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        //pagination for itemSupplier
        this.$scope.TotalCollection = [];
        this.$scope.itemsupList = [];
        this.$scope.supplierTotalCollection = [];
        this.$scope.supplierItemsPerPage = 5;
        this.$scope.supplierCurrentPage = 1;
        this.$scope.supplierMaxSize = 10;
        this.$scope.supplierEntryLimit = 10;
        this.$scope.testCollection = [];
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollections = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollections = _this.$scope.catList.slice(begin, end);
        });
        //let supplierPage = this.$scope.$watch("supplierCurrentPage + supplierItemPerCurrentPage", () => {
        //    this.$scope.TotalCollection = [];
        //    let begin = ((this.$scope.supplierCurrentPage - 1) * this.$scope.supplierItemsPerPage),
        //        end = begin + this.$scope.supplierItemsPerPage;
        //    this.$scope.TotalCollection = this.$scope.itemsupList.slice(begin, end);
        //});
        this.$scope.groupRequired = stringConstants.groupRequired;
        this.$scope.brandRequired = stringConstants.brandRequired;
        this.$scope.supplierRequired = stringConstants.supplierRequired;
        this.$scope.supplierNameRequired = stringConstants.supplierNameRequired;
        this.$scope.supplierUnique = stringConstants.supplierUnique;
        this.$scope.categoryUnique = stringConstants.categoryUnique;
        this.initialize();
        this.$scope.closeCanDeleteSupplierValidationBox = function () { return _this.closeCanDeleteSupplierValidationBox(); };
        this.$scope.canDeleteItemSupplierHeaderMessage = stringConstants.canDeleteItemSupplier;
        this.$scope.canDeleteItemSupplierMessage = stringConstants.canDeleteItemSupplierMessage;
    }
    CategoryController.prototype.initialize = function () {
        this.getBrandList();
        this.getSupplierList();
        this.getCategoryList();
    };
    //used to make the add category panel visible
    CategoryController.prototype.addCategorys = function () {
        var controllerScope = this.$scope;
        this.categoryFormClear();
        controllerScope.isAddCategoryVisible = true;
        controllerScope.isAddSupplierVisible = false;
    };
    //used to make the add supplier panel visible
    CategoryController.prototype.addSupplier = function (id) {
        var controllerScope = this.$scope;
        controllerScope.isAddSupplierVisible = true;
        controllerScope.isAddCategoryVisible = false;
        controllerScope.categoryId = id;
        controllerScope.TotalCollection = [];
        controllerScope.itemsupList = [];
        controllerScope.catList = [];
        var supplierCollection = controllerScope.itemsupList;
        for (var i = 0; i < controllerScope.categoryList.length; i++) {
            if (id === controllerScope.categoryList[i].Id) {
                for (var j = 0; j < controllerScope.categoryList[i].ItemSupplier.length; j++) {
                    supplierCollection[j] = controllerScope.categoryList[i].ItemSupplier[j];
                    // pagination
                    // controllerScope.supplierTotalCollection = supplierCollection;
                    //let that = this;
                    //let begin = ((that.$scope.supplierCurrentPage - 1) * that.$scope.supplierItemsPerPage),
                    //    end = begin + that.$scope.supplierItemsPerPage;
                    //controllerScope.TotalCollection = supplierCollection.slice(begin, end);            
                    ///* init pagination with $scope.list */
                    //controllerScope.supplierTotalItems = controllerScope.itemsupList.length;
                    // pagination
                    controllerScope.categoryTotalCollection = supplierCollection;
                    controllerScope.catList = supplierCollection;
                    var that = this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollections = supplierCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.catList.length;
                }
            }
        }
    };
    // used to get brand list
    CategoryController.prototype.getBrandList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.categoryService.getBrandGroup(1);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.brandList.push({ BrandId: result[i].Id, BrandName: result[i].ValueEn });
            }
            controllerRootScope.isLoading = false;
            _this.getGroupList();
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to get group list
    CategoryController.prototype.getGroupList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.categoryService.getBrandGroup(2);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.groupList.push({ GroupId: result[i].Id, GroupName: result[i].ValueEn });
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to fetch supplier list
    CategoryController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.categoryService.getSupplier();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to add new Category 
    CategoryController.prototype.saveCategory = function (category) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.categoryService.saveCategory(category);
        promise.then(function (result) {
            if (result.isCategoryExist) {
                controllerScope.categoryExists = result.isCategoryExist;
            }
            else {
                _this.getCategoryList();
                controllerScope.category = new Model.Category();
                controllerScope.isAddCategoryVisible = false;
                _this.categoryFormClear();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    CategoryController.prototype.cancel = function () {
        var controllerScope = this.$scope;
        controllerScope.category = new Model.Category();
        controllerScope.itemSupplier = new Model.ItemSupplier();
        controllerScope.isAddCategoryVisible = false;
        controllerScope.isAddSupplierVisible = false;
        this.categoryFormClear();
        this.supplierFormClear();
        //////  this.formClear();
        //addItemSupplier.$setPristine();
        ////controllerScope.addGroup.$setValidity();
        //addItemSupplier.$setUntouched();
        this.getCategoryList();
    };
    //used to get category list from database
    CategoryController.prototype.getCategoryList = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        if (controllerScope.brandSearch === 1) {
            controllerScope.isBrandSearchVisible = true;
        }
        controllerRootScope.isLoading = true;
        controllerScope.totalCollections = [];
        controllerScope.catList = [];
        controllerScope.testCollection = [];
        var categoryCollection = controllerScope.testCollection;
        var promise = this.categoryService.getCategory();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                categoryCollection.push({ Id: result[i].Id, Brand: result[i].BrandParamType.ValueEn, BrandArabic: result[i].BrandParamType.ValueSl, Group: result[i].GroupParamType.ValueEn, GropArabic: result[i].GroupParamType.ValueSl, SupplierCount: result[i].SupplierCount, ItemSupplier: result[i].ItemSupplier });
                // pagination
                controllerScope.categoryTotalCollection = categoryCollection;
                controllerScope.catList = categoryCollection;
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollections = categoryCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.catList.length;
            }
            //for brand search page
            if (controllerScope.totalCollections.length > 0) {
                controllerScope.categoryErrorMessageDisplay = false;
            }
            else {
                controllerScope.categoryErrorMessageDisplay = true;
                controllerScope.isBrandSearchVisible = false;
            }
            controllerScope.categoryList = categoryCollection;
            if (controllerScope.isAddSupplierVisible === true) {
                _this.addSupplier(controllerScope.categoryId);
            }
            else {
                controllerScope.itemSupplierList = [];
            }
            controllerRootScope.isLoading = false;
            controllerScope.search = [];
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // used to save supplier of a category
    CategoryController.prototype.saveItemSupplier = function (itemSupplier) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        itemSupplier.CategoryId = controllerScope.categoryId;
        var promise = this.categoryService.saveItemSupplier(itemSupplier);
        promise.then(function (result) {
            if (result.isItemSupplierExist) {
                controllerRootScope.isLoading = false;
                controllerScope.supplierExists = true;
                return;
            }
            else {
                controllerScope.itemSupplier = new Model.ItemSupplier();
                _this.getCategoryList();
                controllerRootScope.isLoading = false;
            }
            _this.supplierFormClear();
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // used to delete category
    CategoryController.prototype.deleteCategory = function (category) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        this.closeDeleteCategoryPopup();
        controllerRootScope.isLoading = true;
        var promise = this.categoryService.deleteCategory(category);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            controllerScope.isAddSupplierVisible = false;
            if (result.status === "") {
                _this.getCategoryList();
            }
            else {
                controllerScope.deleteFailureMsg = result.status;
                _this.openDeleteCategoryFailurePopup();
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // used to deletdeleteItemSuppliere supplier
    CategoryController.prototype.deleteItemSupplier = function (supplierId) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.categoryService.deleteItemSupplier(supplierId);
        promise.then(function (result) {
            _this.getCategoryList();
            controllerRootScope.isLoading = false;
            _this.closeDeleteItemSupplierPopup();
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // open the DeleteCategoryPopup
    CategoryController.prototype.openDeleteCategoryPopup = function (category) {
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        this.deleteCategoryPopup = this.$modal.open({
            templateUrl: 'DeleteCategoryPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.category = category;
    };
    //closing  the DeleteCategoryPopup
    CategoryController.prototype.closeDeleteCategoryPopup = function () {
        this.deleteCategoryPopup.dismiss('cancel');
    };
    // open the DeleteItemSupplierPopup
    CategoryController.prototype.openDeleteItemSupplierPopup = function (supplier) {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.categoryService.canDeleteItemSupplier(this.$scope.categoryId, supplier.SupplierId);
        promise.then(function (result) {
            if (result.canDelete) {
                _this.deleteItemSupplierPopup = _this.$modal.open({
                    templateUrl: 'DeleteItemSupplierPopup',
                    backdrop: 'static',
                    keyboard: true,
                    scope: _this.$scope,
                });
                controllerScope.itemSupplier.Id = supplier.Id;
            }
            else {
                _this.openCanDeleteSupplierValidationBox = _this.$modal.open({
                    templateUrl: 'CanDeleteItemSupplierPopup',
                    backdrop: 'static',
                    keyboard: true,
                    scope: _this.$scope,
                });
            }
        });
    };
    //closing  the DeleteItemSupplierPopup
    CategoryController.prototype.closeDeleteItemSupplierPopup = function () {
        this.deleteItemSupplierPopup.dismiss('cancel');
    };
    // open the DeleteCategoryFailurePopup
    CategoryController.prototype.openDeleteCategoryFailurePopup = function () {
        var controllerScope = this.$scope;
        this.deleteCategoryFailurePopup = this.$modal.open({
            templateUrl: 'DeleteCategoryFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //closing  the DeleteCategoryFailurePopup
    CategoryController.prototype.closeDeleteCategoryFailurePopup = function () {
        this.deleteCategoryFailurePopup.dismiss('cancel');
    };
    // used to search category
    CategoryController.prototype.searchCategory = function () {
        var controllerScope = this.$scope;
        controllerScope.isBrandSearchVisible = true;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.catList = this.filterFilter((controllerScope.categoryTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.catList.length === 0) {
            controllerScope.categoryErrorMessageDisplay = true;
            controllerScope.isBrandSearchVisible = false;
            controllerScope.totalCollections = [];
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollections = controllerScope.catList.slice(begin, end);
            controllerScope.totalItems = controllerScope.catList.length;
            controllerScope.categoryErrorMessageDisplay = false;
        }
        controllerScope.search = [];
    };
    CategoryController.prototype.supplierFormClear = function () {
        var controllerScope = this.$scope;
        controllerScope.addItemSupplier.$setPristine();
        controllerScope.addItemSupplier.$setValidity();
        controllerScope.addItemSupplier.$setUntouched();
        this.$scope.supplierExists = false;
    };
    CategoryController.prototype.categoryFormClear = function () {
        var controllerScope = this.$scope;
        controllerScope.addCategory.$setPristine();
        controllerScope.addCategory.$setValidity();
        controllerScope.addCategory.$setUntouched();
        this.$scope.categoryExists = false;
    };
    //called whenever either supplierName  is selected
    CategoryController.prototype.onSeacrhSupplierNameChanged = function () {
        var controllerScope = this.$scope;
        controllerScope.itemSupplier.Supplier = "";
        for (var i = 0; i < controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === controllerScope.itemSupplier.SupplierId) {
                controllerScope.itemSupplier.SupplierCode = controllerScope.supplierList[i].Id;
                break;
            }
        }
    };
    //called whenever either supplierCode  is selected
    CategoryController.prototype.onSeacrhSupplierCodeChanged = function () {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === controllerScope.itemSupplier.SupplierCode) {
                controllerScope.itemSupplier.SupplierId = controllerScope.supplierList[i].Id;
            }
        }
    };
    CategoryController.prototype.closeCanDeleteSupplierValidationBox = function () {
        this.openCanDeleteSupplierValidationBox.dismiss('cancel');
    };
    return CategoryController;
}());
CategoryController.controllerId = "categoryController";
app.controller(CategoryController.controllerId, ['$scope', '$log', 'categoryService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', function ($scope, $log, categoryService, ngToast, $rootSoope, apiPath, filterFilter, $modal) {
        return new CategoryController($scope, $log, categoryService, ngToast, $rootSoope, apiPath, filterFilter, $modal);
    }]);
//# sourceMappingURL=categoryController.js.map
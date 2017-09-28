/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/categoryservice.ts" />

interface IcategoryControllerScope extends ng.IScope {
    category: any;
    itemSupplier: any;
    addCategorys: Function;
    saveCategory: Function;
    getBrandList: Function;
    getGroupList: Function;
    getSupplierList: Function;
    addSupplier: Function;
    cancel: Function;
    getCategoryList: Function;
    saveItemSupplier: Function;
    deleteCategory: Function;
    deleteItemSupplier: Function;
    openDeleteCategoryPopup: Function;
    closeDeleteCategoryPopup: Function;
    openDeleteItemSupplierPopup: Function;
    closeDeleteItemSupplierPopup: Function;
    searchCategory: Function;
    noCategoryFound: any;

    openDeleteCategoryFailurePopup: Function;
    closeDeleteCategoryFailurePopup: Function;
    deleteFailureMsg: string;
    isCategoryDeleteFailed: boolean;
    isAddCategoryButtonVisible: boolean;

    categoryFormClear: Function;
    supplierFormClear: Function;

    onSeacrhSupplierNameChanged: Function;
    onSeacrhSupplierCodeChanged: Function;

    brandList: any;
    groupList: any;
    supplierList: any;
    categoryList: any;
    itemSupplierList: any;
    categoryId: any;
    categoryExists: any;
    supplierExists: any;

    isAddCategoryVisible: boolean;
    isAddSupplierVisible: boolean;

    brandSearch: any;
    isBrandSearchVisible: boolean;

    //search
    search: any;
    serachFilter: any;

    //pagination of category
    totalCollections: any;
    catList: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    entryLimit: any;
    categoryErrorMessageDisplay: boolean;
    categoryTotalCollection: any;

    //pagination of itemsupplier
    TotalCollection: any;
    itemsupList: any;
    supplierTotalItems: number;
    supplierItemsPerPage: number;
    supplierCurrentPage: any;
    supplierMaxSize: number;
    supplierEntryLimit: any;
    supplierErrorMessageDisplay: boolean;
    supplierTotalCollection: any;
    deleteConfirmation: any;
    categoryDeleteFailed: any;

    groupRequired: any;
    brandRequired: any;
    supplierRequired: any;
    supplierNameRequired: any;
    supplierUnique: any;
    categoryUnique: any;
    testCollection: any;
    deleteConfirmMessage: any;

    canDeleteItemSupplierHeaderMessage: any;
    canDeleteItemSupplierMessage: any;

    closeCanDeleteSupplierValidationBox: Function;
}

interface IcategoryController {
}

class CategoryController implements IcategoryController {
    static controllerId = "categoryController";
    public deleteCategoryPopup;
    public deleteItemSupplierPopup;
    public deleteCategoryFailurePopup;
    public openCanDeleteSupplierValidationBox;

    constructor(private $scope: IcategoryControllerScope, private $log: ng.ILocaleService, private categoryService: CategoryService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $modal) {
        this.$scope.category = new Model.Category;
        this.$scope.itemSupplier = new Model.ItemSupplier;

        this.$scope.addCategorys = () => this.addCategorys();
        this.$scope.addSupplier = (id) => this.addSupplier(id);
        this.$scope.getBrandList = () => this.getBrandList();
        this.$scope.getGroupList = () => this.getGroupList();
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.saveCategory = (category: Model.Category) => this.saveCategory(category);
        this.$scope.cancel = () => this.cancel();
        this.$scope.getCategoryList = () => this.getCategoryList();
        this.$scope.saveItemSupplier = (itemSupplier: Model.ItemSupplier) => this.saveItemSupplier(itemSupplier);
        this.$scope.deleteCategory = (category: Model.Category) => this.deleteCategory(category);
        this.$scope.deleteItemSupplier = (supplierId) => this.deleteItemSupplier(supplierId);
        this.$scope.openDeleteCategoryPopup = (category) => this.openDeleteCategoryPopup(category);
        this.$scope.closeDeleteCategoryPopup = () => this.closeDeleteCategoryPopup();
        this.$scope.openDeleteItemSupplierPopup = (id) => this.openDeleteItemSupplierPopup(id);
        this.$scope.closeDeleteItemSupplierPopup = () => this.closeDeleteItemSupplierPopup();
        this.$scope.isCategoryDeleteFailed = false;
        this.$scope.noCategoryFound = stringConstants.noCategoryFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.openDeleteCategoryFailurePopup = () => this.openDeleteCategoryFailurePopup();
        this.$scope.closeDeleteCategoryFailurePopup = () => this.closeDeleteCategoryFailurePopup();
        this.$scope.categoryDeleteFailed = stringConstants.categoryDeleteFailed;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.searchCategory = () => this.searchCategory();

        this.$scope.supplierFormClear = () => this.supplierFormClear();
        this.$scope.categoryFormClear = () => this.categoryFormClear();

        this.$scope.onSeacrhSupplierNameChanged = () => this.onSeacrhSupplierNameChanged();
        this.$scope.onSeacrhSupplierCodeChanged = () => this.onSeacrhSupplierCodeChanged();

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
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollections = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollections = this.$scope.catList.slice(begin, end);
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

        this.$scope.closeCanDeleteSupplierValidationBox = () => this.closeCanDeleteSupplierValidationBox();
        this.$scope.canDeleteItemSupplierHeaderMessage = stringConstants.canDeleteItemSupplier;
        this.$scope.canDeleteItemSupplierMessage = stringConstants.canDeleteItemSupplierMessage;

    }

    private initialize() {

        this.getBrandList();
        this.getSupplierList();
        this.getCategoryList();
    }

    //used to make the add category panel visible
    private addCategorys() {
        let controllerScope = this.$scope;
        this.categoryFormClear();

        controllerScope.isAddCategoryVisible = true;
        controllerScope.isAddSupplierVisible = false;
    }


    //used to make the add supplier panel visible
    private addSupplier(id) {
        let controllerScope = this.$scope;
        controllerScope.isAddSupplierVisible = true;
        controllerScope.isAddCategoryVisible = false;
        controllerScope.categoryId = id;
        controllerScope.TotalCollection = [];
        controllerScope.itemsupList = [];
        controllerScope.catList = [];
        let supplierCollection = controllerScope.itemsupList;
        for (let i = 0; i < controllerScope.categoryList.length; i++) {
            if (id === controllerScope.categoryList[i].Id) {
                for (let j = 0; j < controllerScope.categoryList[i].ItemSupplier.length; j++) {
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
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollections = supplierCollection.slice(begin, end);

                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.catList.length;
                }
            }
        }
    }


    // used to get brand list
    private getBrandList() {
        let controllerScope = this.$scope;

        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.categoryService.getBrandGroup(1);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.brandList.push({ BrandId: result[i].Id, BrandName: result[i].ValueEn });
            }
            controllerRootScope.isLoading = false;
            this.getGroupList();
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });

    }

    // used to get group list
    private getGroupList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.categoryService.getBrandGroup(2);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.groupList.push({ GroupId: result[i].Id, GroupName: result[i].ValueEn });
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }

    // used to fetch supplier list
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.categoryService.getSupplier();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
            }

            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }

    //used to add new Category 
    private saveCategory(category) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;

        let promise = this.categoryService.saveCategory(category);
        promise.then((result) => {
            if (result.isCategoryExist) {
                controllerScope.categoryExists = result.isCategoryExist;

                //  return;
            }
            else {
                this.getCategoryList();
                controllerScope.category = new Model.Category();
                controllerScope.isAddCategoryVisible = false;
                this.categoryFormClear();
            }

            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    private cancel() {
        let controllerScope = this.$scope;
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
    }


    //used to get category list from database
    private getCategoryList() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        if (controllerScope.brandSearch === 1) {
            controllerScope.isBrandSearchVisible = true;
        }

        controllerRootScope.isLoading = true;
        controllerScope.totalCollections = [];
        controllerScope.catList = [];
        controllerScope.testCollection = [];
        let categoryCollection = controllerScope.testCollection;
        let promise = this.categoryService.getCategory();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                categoryCollection.push({ Id: result[i].Id, Brand: result[i].BrandParamType.ValueEn, BrandArabic: result[i].BrandParamType.ValueSl, Group: result[i].GroupParamType.ValueEn, GropArabic: result[i].GroupParamType.ValueSl, SupplierCount: result[i].SupplierCount, ItemSupplier: result[i].ItemSupplier });

                // pagination
                controllerScope.categoryTotalCollection = categoryCollection;
                controllerScope.catList = categoryCollection;
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
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
                this.addSupplier(controllerScope.categoryId);
            }
            else {
                controllerScope.itemSupplierList = [];
            }
            controllerRootScope.isLoading = false;
            controllerScope.search = [];
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    // used to save supplier of a category
    private saveItemSupplier(itemSupplier) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        itemSupplier.CategoryId = controllerScope.categoryId;
        let promise = this.categoryService.saveItemSupplier(itemSupplier);
        promise.then((result) => {
            if (result.isItemSupplierExist) {
                controllerRootScope.isLoading = false;
                controllerScope.supplierExists = true;
                return;
            }
            else {
                controllerScope.itemSupplier = new Model.ItemSupplier();
                this.getCategoryList();
                controllerRootScope.isLoading = false;
            }
            this.supplierFormClear();
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    // used to delete category
    private deleteCategory(category) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        this.closeDeleteCategoryPopup();
        controllerRootScope.isLoading = true;
        let promise = this.categoryService.deleteCategory(category);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            controllerScope.isAddSupplierVisible = false;
            if (result.status === "") {
                this.getCategoryList();
            }
            else {
                controllerScope.deleteFailureMsg = result.status;
                this.openDeleteCategoryFailurePopup();
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    // used to deletdeleteItemSuppliere supplier
    private deleteItemSupplier(supplierId) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        let promise = this.categoryService.deleteItemSupplier(supplierId);
        promise.then((result) => {
            this.getCategoryList();
            controllerRootScope.isLoading = false;
            this.closeDeleteItemSupplierPopup();
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }


    // open the DeleteCategoryPopup
    private openDeleteCategoryPopup(category) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        this.deleteCategoryPopup = this.$modal.open({
            templateUrl: 'DeleteCategoryPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.category = category;

    }


    //closing  the DeleteCategoryPopup
    private closeDeleteCategoryPopup() {
        this.deleteCategoryPopup.dismiss('cancel');
    }

    // open the DeleteItemSupplierPopup
    private openDeleteItemSupplierPopup(supplier) {
        let controllerScope = this.$scope;
        let promise = this.categoryService.canDeleteItemSupplier(this.$scope.categoryId, supplier.SupplierId);
        promise.then((result) => {
            if (result.canDelete) {
                this.deleteItemSupplierPopup = this.$modal.open({
                    templateUrl: 'DeleteItemSupplierPopup',
                    backdrop: 'static',
                    keyboard: true,
                    scope: this.$scope,
                });
                controllerScope.itemSupplier.Id = supplier.Id;
            }
            else {
                this.openCanDeleteSupplierValidationBox = this.$modal.open({
                    templateUrl: 'CanDeleteItemSupplierPopup',
                    backdrop: 'static',
                    keyboard: true,
                    scope: this.$scope,
                });
            }
        });
    }

    //closing  the DeleteItemSupplierPopup
    private closeDeleteItemSupplierPopup() {
        this.deleteItemSupplierPopup.dismiss('cancel');
    }


    // open the DeleteCategoryFailurePopup
    private openDeleteCategoryFailurePopup() {
        let controllerScope = this.$scope;
        this.deleteCategoryFailurePopup = this.$modal.open({
            templateUrl: 'DeleteCategoryFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //closing  the DeleteCategoryFailurePopup
    private closeDeleteCategoryFailurePopup() {
        this.deleteCategoryFailurePopup.dismiss('cancel');
    }

    // used to search category
    private searchCategory() {
        let controllerScope = this.$scope;
        controllerScope.isBrandSearchVisible = true;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.catList = this.filterFilter((controllerScope.categoryTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.catList.length === 0) {
            controllerScope.categoryErrorMessageDisplay = true;
            controllerScope.isBrandSearchVisible = false;
            controllerScope.totalCollections = [];
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollections = controllerScope.catList.slice(begin, end);
            controllerScope.totalItems = controllerScope.catList.length;
            controllerScope.categoryErrorMessageDisplay = false;
        }
        controllerScope.search = [];
    }

    private supplierFormClear() {
        let controllerScope: any = this.$scope;
        controllerScope.addItemSupplier.$setPristine();
        controllerScope.addItemSupplier.$setValidity();
        controllerScope.addItemSupplier.$setUntouched();
        this.$scope.supplierExists = false;
    }

    private categoryFormClear() {
        let controllerScope: any = this.$scope;
        controllerScope.addCategory.$setPristine();
        controllerScope.addCategory.$setValidity();
        controllerScope.addCategory.$setUntouched();
        this.$scope.categoryExists = false;
    }


    //called whenever either supplierName  is selected
    private onSeacrhSupplierNameChanged() {
        let controllerScope = this.$scope;
        controllerScope.itemSupplier.Supplier = "";
        for (let i = 0; i < controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === controllerScope.itemSupplier.SupplierId) {
                controllerScope.itemSupplier.SupplierCode = controllerScope.supplierList[i].Id;
                break;
            }
        }
    }


    //called whenever either supplierCode  is selected
    private onSeacrhSupplierCodeChanged() {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === controllerScope.itemSupplier.SupplierCode) {
                controllerScope.itemSupplier.SupplierId = controllerScope.supplierList[i].Id;
            }
        }
    }
    private closeCanDeleteSupplierValidationBox() {
        this.openCanDeleteSupplierValidationBox.dismiss('cancel');
    }
}

app.controller(CategoryController.controllerId, ['$scope', '$log', 'categoryService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', ($scope, $log, categoryService, ngToast, $rootSoope, apiPath, filterFilter, $modal) => {
    return new CategoryController($scope, $log, categoryService, ngToast, $rootSoope, apiPath, filterFilter, $modal);
}]);


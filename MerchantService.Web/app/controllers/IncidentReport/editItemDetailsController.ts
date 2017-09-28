// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IeditItemDetailsControllerScope extends ng.IScope {
    addNewItemProfile: any;
    itemType: string;
    editInformationByItemId: Function;
    isSellPriceNotValid: boolean;
    branchList: any;
    unitList: any;

    itemTypePopup: () => void;
    cancelItemPopup: () => void;
    compareMaxMinWithIndex: Function;
    gridBinding: Function;
    brandList: any;
    serachFilter: number;
    currentPage;
    itemsPerPage;
    categoryErrorMessageDisplay: boolean;
    gridClickForItemPoup: Function;
    isSaveButtonDisabled: boolean;
    cancelButtonEvent: Function;
    updateItemDetails: Function;
    isDataLoading: boolean;
    checkIntegerMin: Function;
    checkIntegerMax: Function;
    checkIntegerActual: Function;
    itemNameEnRequired: any;
    itemFlavourEnRequired: any;
    barCodeRequired: any;
    barcodeExists: any;
    unitTypeRequired: any;
    validBaseUnitCount: any;
    itemValidProfitMargin: any;
    itemValidSellPrice: any;
    itemValidSellPriceA: any;
    itemValidSellPriceB: any;
    itemValidSellPriceC: any;
    itemValidSellPriceD: any;
    validCostPriceError: any;
    itemTypeRequired: any;
    profitMarginRequired: any;
    itemNameSlRequired: any;
    itemFlavourSlRequired: any;
    itemCodeRequired: any;
    sellPriceNotValid: any;
    sellPriceANotValid: any;
    sellPriceBNotValid: any;
    sellPriceCNotValid: any;
    sellPriceDNotValid: any;
    sellPriceRequired: any;
    costPriceRequired: any;
    branchNameExists: any;
    itemCodeisExists: any;
    validActualQuantityError: any;
    validMaximumQuantityError: any;
    validMinimumQuantityError: any;
}

interface IeditItemDetailsController {

}

class EditItemDetailsController implements IeditItemDetailsController {
    static controllerId = "editItemDetailsController";
    public itemBrandSearchPopup;
    constructor(private $scope: IeditItemDetailsControllerScope, private $log: ng.ILogService, public $rootScope, public apiPath, public ngToast, public $location, public $modal, public filterFilter, public $routeParams, private addNewItemProfileService: AddNewItemProfileService, private categoryService: CategoryService) {
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.itemType = "";
        this.$scope.editInformationByItemId = () => this.editInformationByItemId();
        this.$scope.isSellPriceNotValid = false;
        this.$scope.branchList = [];
        this.$scope.unitList = [];

        this.$scope.itemTypePopup = () => this.itemTypePopup();
        this.$scope.cancelItemPopup = () => this.cancelItemPopup();
        this.$scope.compareMaxMinWithIndex = (miniMum: any, maxiMum: any, $index: any) => this.compareMaxMinWithIndex(miniMum, maxiMum, $index);
        this.$scope.gridBinding = () => this.gridBinding();
        this.$scope.brandList = [];
        this.$scope.categoryErrorMessageDisplay = false;
        let page = this.$rootScope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$rootScope.totalCollection = [];
            let begin = ((this.$rootScope.currentPage - 1) * this.$rootScope.itemsPerPage),
                end = begin + this.$rootScope.itemsPerPage;
            this.$rootScope.totalCollection = this.$rootScope.categoryListCollections.slice(begin, end);
        });
        this.$scope.gridClickForItemPoup = (id: number) => this.gridClickForItemPoup(id);
        this.$scope.cancelButtonEvent = (incidentId: number) => this.cancelButtonEvent(incidentId);
        this.$scope.updateItemDetails = (addNewItemProfile: any) => this.updateItemDetails(addNewItemProfile);
        this.$scope.isDataLoading = false;
        this.$scope.checkIntegerMin = (miniMum, index) => this.checkIntegerMin(miniMum, index);
        this.$scope.checkIntegerMax = (maxiMum, index) => this.checkIntegerMax(maxiMum, index);
        this.$scope.checkIntegerActual = (actual, index) => this.checkIntegerActual(actual, index);
        // String Constants
        this.$scope.itemNameEnRequired = stringConstants.itemNameEnRequired;
        this.$scope.itemFlavourEnRequired = stringConstants.itemFlavourEnRequired;
        this.$scope.barCodeRequired = stringConstants.barCodeRequired;
        this.$scope.unitTypeRequired = stringConstants.unitTypeRequired;
        this.$scope.itemTypeRequired = stringConstants.itemTypeRequired;
        this.$scope.profitMarginRequired = stringConstants.profitMarginRequired;
        this.$scope.itemNameSlRequired = stringConstants.itemNameArRequired;
        this.$scope.itemFlavourSlRequired = stringConstants.itemFlavourArRequired;
        this.$scope.itemCodeRequired = stringConstants.itemCodeRequired;
        this.$scope.sellPriceNotValid = stringConstants.sellPriceIsNotValid;
        this.$scope.sellPriceANotValid = stringConstants.sellPriceAIsNotValid;
        this.$scope.sellPriceBNotValid = stringConstants.sellPriceBIsNotValid;
        this.$scope.sellPriceCNotValid = stringConstants.sellPriceCIsNotValid;
        this.$scope.sellPriceDNotValid = stringConstants.sellPriceDIsNotValid;
        this.$scope.sellPriceRequired = stringConstants.sellPriceRequired;
        this.$scope.barcodeExists = stringConstants.barcodeExists;
        this.$scope.costPriceRequired = stringConstants.costPriceRequired;
        this.$scope.branchNameExists = stringConstants.sameBranchName;
        this.$scope.itemCodeisExists = stringConstants.itemCodeExists;
        this.$scope.itemValidProfitMargin = stringConstants.itemValidProfitMargin;
        this.$scope.itemValidSellPrice = stringConstants.itemValidSellPrice;
        this.$scope.itemValidSellPriceA = stringConstants.itemValidSellPriceA;
        this.$scope.itemValidSellPriceB = stringConstants.itemValidSellPriceB;
        this.$scope.itemValidSellPriceC = stringConstants.itemValidSellPriceC;
        this.$scope.itemValidSellPriceD = stringConstants.itemValidSellPriceD;
        this.$scope.validCostPriceError = stringConstants.validCostPriceError;
        this.$scope.validActualQuantityError = stringConstants.validActualQuantityError;
        this.$scope.validMaximumQuantityError = stringConstants.validMaximumQuantityError;
        this.$scope.validMinimumQuantityError = stringConstants.validMinimumQuantityError;
        this.initialization();
    }

    private initialization() {
        //  this.getBranchList();
        this.getUnitTypeList();
        this.editInformationByItemId();
    }

    private editInformationByItemId() {
        let controllerScope = this.$scope;

        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        //to get unit type list
        let promise = this.addNewItemProfileService.editInformationByItemId(this.$routeParams.id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                controllerScope.addNewItemProfile = result;
                controllerScope.itemType = result.ItemType;
                controllerScope.isDataLoading = false;
            }
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        this.$scope.isSellPriceNotValid = false;
        //To get branch list
        let promise = this.addNewItemProfileService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this funciton used for get unit type.-An
    private getUnitTypeList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        let promise = this.addNewItemProfileService.getUnitList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }



    //this funciton used for open popup -An
    private itemTypePopup() {
        this.itemBrandSearchPopup = this.$modal.open({
            templateUrl: 'BrandSearch',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        let controllerrootScope = this.$rootScope;
        controllerrootScope.itemsPerPage = 2;
        controllerrootScope.currentPage = 1;
        controllerrootScope.maxSize = 10;
        controllerrootScope.isLoading = true;
        this.gridBinding();
        this.getBrandList();
    }

    //this funciton used for grid binding in item popup -An
    private gridBinding() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        this.$scope.serachFilter = 0;
        controllerRootScope.categoryListCollections = [];
        let category = controllerRootScope.categoryListCollections;
        let promise = this.categoryService.getCategory();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                category.push({ Id: result[i].Id, Brand: result[i].BrandParamType.ValueEn, BrandArabic: result[i].BrandParamType.ValueSl, Group: result[i].GroupParamType.ValueEn, GropArabic: result[i].GroupParamType.ValueSl, SupplierCount: result[i].SupplierCount, ItemSupplier: result[i].ItemSupplier });
            }

            /* init pagination with $scope.list */
            let that = this;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage);
            let end = begin + that.$scope.itemsPerPage;
            controllerRootScope.totalCollection = category.slice(begin, end);
            /* init pagination with $scope.list */
            controllerRootScope.totalItems = controllerRootScope.categoryListCollections.length;

            //for brand search page
            if (controllerRootScope.totalCollection.length > 0)
                controllerScope.categoryErrorMessageDisplay = false;
            else
                controllerScope.categoryErrorMessageDisplay = true;

            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }


    //this funciton used to get brand list -An
    private getBrandList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.categoryService.getBrandGroup(1);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.brandList.push({ BrandId: result[i].Id, BrandName: result[i].ValueEn });
            }
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
        controllerRootScope.isLoading = false;
    }


    //this funciton used for close the popup -An
    private cancelItemPopup() {
        this.itemBrandSearchPopup.dismiss('cancel');
    }

    private compareMaxMinWithIndex(miniMum, maxiMum, index) {
        let controllerScope = this.$scope;
        if (miniMum === "" || maxiMum === "") {
            this.$log.log("max and minimum quantity zero");
            controllerScope.isSaveButtonDisabled = true;

        } else {
            controllerScope.isSaveButtonDisabled = false;
            if (parseFloat(miniMum) > parseFloat(maxiMum)) {
                controllerScope.addNewItemProfile.ListOfItemQuantityList[index].MinimumQuantity = 0;
            }
        }
    }


    //this funciton used for grid click event. -An
    private gridClickForItemPoup(id) {
        let controllerRootScope = this.$rootScope;
        let categoryTotalCollection = controllerRootScope.categoryListCollections;
        for (let i = 0; i <= categoryTotalCollection.length; i++) {
            if (categoryTotalCollection[i].Id === id) {
                this.$scope.addNewItemProfile.CategoryId = categoryTotalCollection[i].Id;
                this.$scope.itemType = categoryTotalCollection[i].Brand + '-' + categoryTotalCollection[i].Group;
                break;
            }
        }
        this.itemBrandSearchPopup.dismiss('cancel');
    }

    private updateItemDetails(itemDetails) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.addNewItemProfileService.updateItemDetails(itemDetails);
        promise.then((result) => {
            this.$location.path("/IncidentReportDetail/" + result.posIncidentReportId);
            controllerRootScope.isLoading = false;
        });
    }

    private cancelButtonEvent(incidentId) {
        this.$location.path("/IncidentReportDetail/" + incidentId);
    }

    private checkIntegerActual(actual, index) {
        let controllerScope: any = this.$scope;
        if (actual !== "" && actual !== undefined && actual !== null) {
            if (isNaN(actual)) {
                controllerScope.addNewItem.$invalid = true;
                return true;
            }
            else {
                if (Math.round(actual) === parseInt(actual, 10)) {
                    return false;
                }
                else {
                    controllerScope.addNewItem.$invalid = true;
                    return true;
                }
            }
        }
    }

    private checkIntegerMin(miniMum, index) {
        let controllerScope: any = this.$scope;
        if (miniMum !== "" && miniMum !== undefined && miniMum !== null) {
            if (isNaN(miniMum)) {
                controllerScope.addNewItem.$invalid = true;
                return true;
            }
            else {
                if (Math.round(miniMum) === parseInt(miniMum, 10)) {
                    return false;
                }
                else {
                    controllerScope.addNewItem.$invalid = true;
                    return true;
                }
            }
        }
    }

    private checkIntegerMax(maxiMum, index) {
        let controllerScope: any = this.$scope;
        if (maxiMum !== "" && maxiMum !== undefined && maxiMum !== null) {
            if (isNaN(maxiMum)) {
                controllerScope.addNewItem.$invalid = true;
                return true;
            }
            else {
                if (Math.round(maxiMum) === parseInt(maxiMum, 10)) {
                    return false;
                }
                else {
                    controllerScope.addNewItem.$invalid = true;
                    return true;
                }
            }
        }
    }
}

app.controller(EditItemDetailsController.controllerId, ['$scope', '$log', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', 'addNewItemProfileService', 'categoryService', ($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, addNewItemProfileService, categoryService) => {
    return new EditItemDetailsController($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, addNewItemProfileService, categoryService);
}]);

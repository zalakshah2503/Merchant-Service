/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../models/item/addnewitemprofile.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
/// <reference path="../../services/item/categoryservice.ts" />


interface IaddNewItemProfileControllerScope extends ng.IScope {
    addNewItemProfile: Model.AddNewItemProfile;
    branchList: any;
    catagoryList: any;
    unitList: any;
    itemTypePopup: Function;
    submitNewItem: Function;
    itemType: any;
    prevCategoryId: any;
    isSumbit: boolean;
    isUpdate: boolean;
    //string constants
    itemNameEnRequired: string;
    itemFlavourEnRequired: string;
    barCodeRequired: string;
    unitTypeRequired: string;
    itemTypeRequired: string;
    profitMarginRequired: string;
    itemNameSlRequired: string;
    itemFlavourSlRequired: string;
    itemCodeRequired: string;
    sellPriceRequired: string;
    sellPriceARequired: string;
    sellPriceBRequired: string;
    sellPriceCRequired: string;
    sellPriceDRequired: string;
    costPriceRequired: string;
    branchNameRequired: string;
    barcodeExists: string;
    isbarcodeExists: boolean;
    isbranchNameExists: boolean;
    branchNameExists: string;
    isItemCodeExists: boolean;
    itemCodeisExists: string;
    marginProfit: number;
    itemPage: string;
    brandList: any;
    searchCategory: Function;
    //search
    search: any;
    serachFilter: any;
    addElements: Function;
    cancelButtonEvent: Function;

    //pagination of category
    totalCollection: any;
    categoryListCollections: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;

    //entryLimit: any;
    categoryErrorMessageDisplay: boolean;
    gridBinding: Function;
    gridClickForItemPoup: Function;
    cancelItemPopup: Function;
    //totlae item type of list
    totalItemList: any;
    isSellPriceNotValid: boolean;
    sellPriceNotValid: string;
    isSellPriceANotValid: boolean;
    sellPriceANotValid: string;
    isSellPriceBNotValid: boolean;
    sellPriceBNotValid: string;
    isSellPriceCNotValid: boolean;
    sellPriceCNotValid: string;
    isSellPriceDNotValid: boolean;
    sellPriceDNotValid: string;
    validMinimumAndMaximumValue: string;
    removeElement: Function;
    isSellPriceDisabled: boolean;
    isBarcodeDisabled: boolean;
    isSellPriceADisabled: boolean;
    isSellPriceBDisabled: boolean;
    isSellPriceCDisabled: boolean;
    isSellPriceDDisabled: boolean;
    isCostPriceDisabled: boolean;
    openAutomaticPOPopup: Function;
    closeAutomaticPOPopup: Function;
    isPreviousCostPriceDisabled: boolean;
    isActive: boolean;
    isAutomaticPo: boolean;
    clickOnSelectLinkForChangeMainItem: Function;
    //checkSellPrice: Function;
    compareMaxMiniValue: Function;
    compareMaxMinWithIndex: Function;
    checkIntegerMin: Function;
    checkIntegerMax: Function;
    checkIntegerActual: Function;
    isFocusIn: boolean;
    barCodeNotValid: string;
    isBarCodeNotValid: boolean;
    isFirstClick: boolean;
    onChangeIsAutomaticPO: Function;
    getSupplierList: Function;
    supplierList: any;
    initiatorOfSpoCollection: any;
    initiatorRequired: string;
    GenrateBarcode: Function;
    companyBarcodeButtonText: string;
    isGenratedBarcodeButton: boolean;
    AutomaticPOPopup: any;
    itemBarcodeValid: any;
    itemBaseUnitCount: any;
    itemValidProfitMargin: any;
    itemValidSellPrice: any;
    itemValidSellPriceA: any;
    itemValidSellPriceB: any;
    itemValidSellPriceC: any;
    itemValidSellPriceD: any;
    validCostPriceError: any;
    validActualQuantityError: any;
    validMaximumQuantityError: any;
    validMinimumQuantityError: any;
    validQuantityError: any;
}

interface IaddNewItemProfileController {


}

class AddNewItemProfileController implements IaddNewItemProfileController {
    static controllerId = "addNewItemProfileController";
    public itemBrandSearchPopup;
    public automaticPOPopup;
    constructor(private $scope: IaddNewItemProfileControllerScope, private $log: ng.ILogService, public $rootScope, private addNewItemProfileService: AddNewItemProfileService, private categoryService: CategoryService, public apiPath, public ngToast, public listOfAccessPages, public authenticationPath, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.itemTypePopup = () => this.itemTypePopup();
        this.$scope.branchList = [];
        this.$scope.submitNewItem = (addNewItemProfile, isAdd) => this.submitNewItem(addNewItemProfile, isAdd);

        //string constants
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
        this.$scope.validMinimumAndMaximumValue = stringConstants.validMinMaxValue;
        this.$scope.sellPriceARequired = stringConstants.sellPriceARequired;
        this.$scope.sellPriceBRequired = stringConstants.sellPriceBRequired;
        this.$scope.sellPriceCRequired = stringConstants.sellPriceCRequired;
        this.$scope.sellPriceDRequired = stringConstants.sellPriceDRequired;
        this.$scope.barcodeExists = stringConstants.barcodeExists;
        this.$scope.costPriceRequired = stringConstants.costPriceRequired;
        this.$scope.branchNameRequired = stringConstants.branchNameRequired;
        this.$scope.branchNameExists = stringConstants.sameBranchName;
        this.$scope.itemCodeisExists = stringConstants.itemCodeExists;
        this.$scope.AutomaticPOPopup = stringConstants.AutomaticPOPopup;
        this.$scope.brandList = [];
        this.$scope.searchCategory = () => this.searchCategory();
        this.$scope.gridBinding = () => this.gridBinding();
        this.$scope.cancelButtonEvent = () => this.cancelButtonEvent();
        this.$scope.categoryErrorMessageDisplay = false;
        this.$scope.isBarCodeNotValid = false;
        //pagination for category
        this.$scope.totalCollection = [];
        this.$scope.barCodeNotValid = stringConstants.barcodeValid;
        this.$scope.itemType = '';
        this.$scope.categoryListCollections = [];
        this.$scope.search = [];
        this.$scope.unitList = [];
        this.$scope.serachFilter = 0;
        this.$scope.gridClickForItemPoup = (id) => this.gridClickForItemPoup(id);
        // this.$scope.checkSellPrice = () => this.checkSellPrice();
        this.$scope.openAutomaticPOPopup = () => this.openAutomaticPOPopup();
        this.$scope.closeAutomaticPOPopup = () => this.closeAutomaticPOPopup();
        //  this.$scope.onChangeIsAutomaticPO = () => this.onChangeIsAutomaticPO();
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.supplierList = [];
        this.$scope.cancelItemPopup = () => this.cancelItemPopup();
        this.$scope.totalItemList = [];
        this.$scope.addElements = () => this.addElements();
        this.$scope.addNewItemProfile.ListOfItemQuantityList = [];
        this.$scope.removeElement = (index: number) => this.removeElement(index);
        this.$scope.isbarcodeExists = false;
        this.$scope.isbranchNameExists = false;
        this.$scope.isSellPriceNotValid = false;
        this.$scope.isSellPriceANotValid = false;
        this.$scope.isSellPriceBNotValid = false;
        this.$scope.isSellPriceCNotValid = false;
        this.$scope.isSellPriceDNotValid = false;
        this.$scope.isSumbit = true;
        this.$scope.isUpdate = false;
        this.$scope.isSellPriceDisabled = false;
        this.$scope.isBarcodeDisabled = false;
        this.$scope.isSellPriceADisabled = false;
        this.$scope.isSellPriceBDisabled = false;
        this.$scope.isSellPriceCDisabled = false;
        this.$scope.isSellPriceDDisabled = false;
        this.$scope.isCostPriceDisabled = false;
        this.$scope.isPreviousCostPriceDisabled = false;
        this.$scope.isActive = false;
        this.$scope.isAutomaticPo = false;
        this.$scope.isItemCodeExists = false;
        this.$scope.isFirstClick = false;
        this.$scope.itemPage = "";
        this.$scope.marginProfit = 0;
        this.$scope.compareMaxMiniValue = (miniMum, maxiMum) => this.compareMaxMiniValue(miniMum, maxiMum);
        this.$scope.compareMaxMinWithIndex = (miniMum, maxiMum, index) => this.compareMaxMinWithIndex(miniMum, maxiMum, index);
        this.$scope.checkIntegerMin = (miniMum, index) => this.checkIntegerMin(miniMum, index);
        this.$scope.checkIntegerMax = (maxiMum, index) => this.checkIntegerMax(maxiMum, index);
        this.$scope.checkIntegerActual = (actual, index) => this.checkIntegerActual(actual, index);
        this.$scope.companyBarcodeButtonText = stringConstants.genrateCompanyBarcode;
        this.$scope.GenrateBarcode = () => this.GenrateBarcode();
        this.$scope.addNewItemProfile.IsCompanyBarcode = false;
        this.$scope.isGenratedBarcodeButton = false;
        this.initialize();
        this.$rootScope.isFocusIn = true;
        let userPage = this.$rootScope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$rootScope.totalCollection = [];
            let begin = ((this.$rootScope.currentPage - 1) * this.$rootScope.itemsPerPage),
                end = begin + this.$rootScope.itemsPerPage;
            this.$rootScope.totalCollection = this.$rootScope.categoryListCollections.slice(begin, end);
        });
        this.$scope.initiatorRequired = stringConstants.initiatorRequired;
        this.$scope.itemBarcodeValid = stringConstants.itemBarcodeValid;
        this.$scope.itemBaseUnitCount = stringConstants.itemBaseUnitCount;
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
        this.$scope.validQuantityError = stringConstants.validQuantityError;
    }

    private initialize() {
        this.getAllInitiatorOfSpo();
        this.getBranchList();
        this.getUnitTypeList();
        this.getMarginProfit();

        //to check login user authorize for create Item Profile.
        if (this.$rootScope.merchatSettings.IsAllowToCreateItemProfile) {
            this.$scope.isActive = true;
            this.$scope.addNewItemProfile.IsActive = true;
            this.$scope.itemPage = "addnewitem";

        }
        else {
            this.$location.replace(this.authenticationPath);
        }

        //to check login user authorize for edit Item Profile.
        if (this.$rootScope.merchatSettings.IsAllowToEditItemProfile) {
            if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {

                this.bindDataInAddItemProfilePage(this.$routeParams.id);
                this.$scope.isUpdate = true;
                this.$scope.isSumbit = false;
                this.$scope.isBarcodeDisabled = true;
                this.$scope.isGenratedBarcodeButton = true;
                this.$scope.isSellPriceDisabled = true;
                this.$scope.isSellPriceADisabled = true;
                this.$scope.isSellPriceBDisabled = true;
                this.$scope.isSellPriceCDisabled = true;
                this.$scope.isSellPriceDDisabled = true;
                this.$scope.isCostPriceDisabled = true;
                this.$scope.isPreviousCostPriceDisabled = true;
                this.$scope.isActive = false;
                this.$scope.itemPage = "edititem";
            }
        }
        else {
            this.$location.replace(this.authenticationPath);
        }
    }

    private GenrateBarcode() {
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        this.$scope.isbarcodeExists = false;
        this.$scope.isBarCodeNotValid = false;
        if (!this.$scope.isGenratedBarcodeButton) {
            if (this.$scope.companyBarcodeButtonText === stringConstants.clearCompanyBarcode) {
                this.$scope.companyBarcodeButtonText = stringConstants.genrateCompanyBarcode;
                this.$scope.addNewItemProfile.Barcode = null;
                this.$scope.addNewItemProfile.IsCompanyBarcode = false;
                this.$scope.isBarcodeDisabled = false;
                controllerRootScope.isLoading = false;
            }
            else {
                let promise = this.addNewItemProfileService.genrateBarcode();
                promise.then((result) => {
                    if (result._isResult !== null) {
                        this.$scope.addNewItemProfile.Barcode = result._isResult;
                        this.$scope.isBarcodeDisabled = true;
                        this.$scope.companyBarcodeButtonText = stringConstants.clearCompanyBarcode;
                        this.$scope.addNewItemProfile.IsCompanyBarcode = true;

                    }
                    else {
                        this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.companyBarcodeNotGernated
                        });
                    }
                    controllerRootScope.isLoading = false;
                })

            }
        }
        else {
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.barcodeIsNotEditable
            });
            controllerRootScope.isLoading = false;
        }
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

    private getAllInitiatorOfSpo() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.initiatorOfSpoCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.addNewItemProfileService.getAllInitiatorOfSpo();

        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.initiatorOfSpoCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
        })
            .catch((error) => {
                controllerRootScope.isLoading = false;
                this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
    }

    private compareMaxMiniValue(miniMum, maxiMum) {
        if (miniMum !== "" && maxiMum !== "") {
            if (parseFloat(miniMum) > parseFloat(maxiMum)) {
                this.$scope.addNewItemProfile.MinimumQuantity = 0;
            }
        }
    }

    private compareMaxMinWithIndex(miniMum, maxiMum, index) {
        //   if (miniMum === parseInt(miniMum, 10))

        if (miniMum !== "" && maxiMum !== "") {
            if (parseFloat(miniMum) > parseFloat(maxiMum)) {
                this.$scope.addNewItemProfile.ListOfItemQuantityList[index].MinimumQuantity = 0;
            }
        }
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

    //this function used for bind data in add item profile page.-An
    private bindDataInAddItemProfilePage(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        let promise = this.addNewItemProfileService.getItemDetailById(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                controllerScope.addNewItemProfile = result;
                controllerScope.isAutomaticPo = controllerScope.addNewItemProfile.IsAutomaticPO;
                //     controllerScope.addNewItemProfile.AutomaticPOQuantity = result.AutomaticPOQuantity
                controllerScope.itemType = result.Category.BrandParamType.ValueEn + "-" + result.Category.GroupParamType.ValueEn;
                this.getSupplierList();
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

    //this function used for submit/update main item profile. -An
    private submitNewItem(addNewItemProfile, isAdd) {
        if (!this.$scope.isFirstClick) {
            this.$scope.isFirstClick = true;
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerScope.isbarcodeExists = false;
            controllerScope.isbranchNameExists = false;
            controllerScope.isSellPriceNotValid = false;
            controllerScope.isSellPriceANotValid = false;
            controllerScope.isSellPriceBNotValid = false;
            controllerScope.isBarCodeNotValid = false;
            controllerScope.isSellPriceCNotValid = false;
            controllerScope.isSellPriceDNotValid = false;
            controllerScope.isItemCodeExists = false;
            controllerRootScope.isLoading = true;
            //to insert item profile
            this.$scope.addNewItemProfile.IsParentItem = true;
            //this condition used for check this function call for add or update. 
            if (isAdd) {
                //to check sell price is valid or not.
                let d = ((parseFloat(addNewItemProfile.CostPrice) * parseFloat(addNewItemProfile.ProfitMargin)) / 100);
                let total = d + parseFloat(addNewItemProfile.CostPrice);
                let isCheckValidSellPrice = this.checkValidSellPriceOrNot(addNewItemProfile, total);
                if (isCheckValidSellPrice) {
                    let promise = this.addNewItemProfileService.insertItemProfile(addNewItemProfile);
                    promise.then((result) => {
                        if (((result._isResult.NormalBarcodeFrom === undefined) && (result._isResult.NormalBarcodeTo === undefined))) {
                            if (result._isResult !== 0) {
                                if (result._isResult !== -1) {//check barcode is exists
                                    if (result._isResult !== -2) {//check item code is exists
                                        this.ngToast.create(stringConstants.addedItemProfileSuccessfully);
                                        this.$location.path('/ItemProfile');
                                    }
                                    else
                                        this.$scope.isItemCodeExists = true;
                                }
                                else
                                    this.$scope.isbranchNameExists = true;
                            }
                            else
                                this.$scope.isbarcodeExists = true;
                        }
                        else {
                            this.$scope.barCodeNotValid = this.$scope.barCodeNotValid.replace("{{BalnceBarcoedFrom}}", result._isResult.NormalBarcodeFrom).replace("{{BalnceBarcoedTo}}", result._isResult.NormalBarcodeTo);
                            this.$scope.isBarCodeNotValid = true;
                        }
                        controllerRootScope.isLoading = false;
                    }).catch((error) => {
                        controllerRootScope.isLoading = false;
                        this.$log.log(error);
                        if (error.status !== 500) {
                            //if user is not authenticated that time it will redirect to the login page.
                            location.replace(this.apiPath);
                        }
                    });
                }
            }
            else {
                let promise = this.addNewItemProfileService.updateItemProfile(addNewItemProfile);
                promise.then((result) => {
                    if ((result._isResult.BalanceBarcodeFrom === undefined || result._isResult.BalanceBarcodeFrom === null) && (result._isResult.BalanceBarcodeTo === undefined || result._isResult.BalanceBarcodeTo === null)) {
                        if (result._isResult !== 0) {
                            if (result._isResult !== -1) {//check barcode is exists
                                if (result._isResult !== -2) {//check item code is exists
                                    if (result._isResult !== -3) {//check icr genrated or not.
                                        if (result._isResult !== -4) {//check issue invetory is created or not.
                                            this.ngToast.create(stringConstants.updateItemProfileSucessfully);
                                            this.$location.path('/ItemProfile');
                                        }
                                        else {
                                            this.ngToast.create({
                                                className: 'danger',
                                                content: stringConstants.issueInventoryUpdatedItem
                                            });
                                        }
                                    }
                                    else {
                                        this.ngToast.create({
                                            className: 'danger',
                                            content: stringConstants.itemProfileNotCreatedBecauseICRGenrated
                                        });
                                    }
                                }
                                else
                                    this.$scope.isItemCodeExists = true;
                            }
                            else
                                this.$scope.isbranchNameExists = true;
                        }
                        else {
                            this.$scope.isbarcodeExists = true;
                        }
                    }
                    else {
                        this.$scope.barCodeNotValid = this.$scope.barCodeNotValid.replace("{{BalnceBarcoedFrom}}", result._isResult.BalanceBarcodeFrom).replace("{{BalnceBarcoedTo}}", result._isResult.BalanceBarcodeTo);
                        this.$scope.isBarCodeNotValid = true;
                    }
                    controllerRootScope.isLoading = false;
                }).catch((error) => {
                    controllerRootScope.isLoading = false;
                    this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(this.apiPath);
                    }
                });
            }
            controllerRootScope.isLoading = false;
            this.$scope.isFirstClick = false;
        }
    }

    private checkValidSellPriceOrNot(addNewItemProfile, total) {
        if (addNewItemProfile.SellPrice !== undefined && addNewItemProfile.SellPrice !== null && addNewItemProfile.SellPrice !== "") {
            if (parseFloat(addNewItemProfile.SellPrice) < total) {
                this.$scope.isSellPriceNotValid = true;
                return false;
            }
        }
        if (addNewItemProfile.SellPriceA !== undefined && addNewItemProfile.SellPriceA !== null && addNewItemProfile.SellPriceA !== "") {
            if (parseFloat(addNewItemProfile.SellPriceA) < total) {
                this.$scope.isSellPriceANotValid = true;
                return false;
            }
        }
        if (addNewItemProfile.SellPriceB !== undefined && addNewItemProfile.SellPriceB !== null && addNewItemProfile.SellPriceB !== "") {
            if (parseFloat(addNewItemProfile.SellPriceB) < total) {
                this.$scope.isSellPriceBNotValid = true;
                return false;
            }
        }
        if (addNewItemProfile.SellPriceC !== undefined && addNewItemProfile.SellPriceC !== null && addNewItemProfile.SellPriceC !== "") {
            if (parseFloat(addNewItemProfile.SellPriceC) < total) {
                this.$scope.isSellPriceCNotValid = true;
                return false;
            }
        }
        if (addNewItemProfile.SellPriceD !== undefined && addNewItemProfile.SellPriceD !== null && addNewItemProfile.SellPriceD !== "") {
            if (parseFloat(addNewItemProfile.SellPriceD) < total) {
                this.$scope.isSellPriceDNotValid = true;
                return false;
            }
        }

        return true;
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

    //this method used forsearch category -An
    private searchCategory() {
        let controllerScope = this.$scope;
        let controllerrootScope = this.$rootScope;
        let that = this;
        let categoryList = this.filterFilter((controllerrootScope.categoryListCollections), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (categoryList === 0) {
            controllerScope.categoryErrorMessageDisplay = true;
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerrootScope.totalCollection = categoryList.slice(begin, end);
            controllerrootScope.totalItems = categoryList.length;
            controllerrootScope.categoryErrorMessageDisplay = false;
        }
    }

    //this funciton used to get brand list -An
    private getBrandList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
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

    //this funciton used for grid binding in item popup -An
    private gridBinding() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
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
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerRootScope.totalCollection = category.slice(begin, end);
            /* init pagination with $scope.list */
            controllerRootScope.totalItems = controllerRootScope.categoryListCollections.length;

            //for brand search page
            if (controllerRootScope.totalCollection.length > 0)
                controllerScope.categoryErrorMessageDisplay = false;
            else
                controllerScope.categoryErrorMessageDisplay = true;

        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    //this funciton used for grid click event. -An
    private gridClickForItemPoup(id) {
        let controllerRootScope = this.$rootScope;

        for (let i = 0; i <= controllerRootScope.categoryListCollections.length; i++) {
            if (controllerRootScope.categoryListCollections[i].Id === id) {
                this.$scope.addNewItemProfile.CategoryId = controllerRootScope.categoryListCollections[i].Id;
                this.$scope.itemType = controllerRootScope.categoryListCollections[i].Brand + '-' + controllerRootScope.categoryListCollections[i].Group;
                break;
            }
        }
        if (id !== this.$scope.prevCategoryId) {
            this.$scope.addNewItemProfile.SupplierId = 0;
            this.$scope.addNewItemProfile.InitiatorRoleId = 0;
            this.$scope.addNewItemProfile.AutomaticPOQuantity = 0;
            this.getSupplierList();
        }
        this.$scope.prevCategoryId = id;
        this.itemBrandSearchPopup.dismiss('cancel');
    }

    //this funciton used for close the popup -An
    private cancelItemPopup() {
        this.itemBrandSearchPopup.dismiss('cancel');
    }

    //this funciton used for redirect to item profile. -An
    private cancelButtonEvent() {
        this.$location.path('/ItemProfile');
    }

    //this function used for add Elements -An
    private addElements() {
        let controllerScope = this.$scope;
        //for set scroll position
        let section_pos = angular.element("#other-item").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top + 50 }, 300);
        controllerScope.addNewItemProfile.ListOfItemQuantityList.push({});
    }

    //this funciton used for minus Elements -An
    private removeElement(index) {
        this.$scope.addNewItemProfile.ListOfItemQuantityList.splice(index, 1);
    }

    //this function used for margin profit -An
    private getMarginProfit() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        let promise = this.addNewItemProfileService.getMarginProfit();
        promise.then((result) => {
            if (result.isResult !== null && result.isResult !== undefined) {
                this.$scope.addNewItemProfile.ProfitMargin = result.isResult;
                this.$scope.marginProfit = result.isResult;
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


    // used for opening the AutomaticPOPopup-jj
    private openAutomaticPOPopup() {
        let controllerScope = this.$scope;
        if (controllerScope.addNewItemProfile.IsAutomaticPO) {
            //this.automaticPOPopup = this.$modal.open({
            //    templateUrl: 'AutomaticPOPopup',
            //    backdrop: 'static',
            //    keyboard: true,
            //    scope: this.$scope,
            //});
            if (controllerScope.initiatorOfSpoCollection.length === 0) {
                this.automaticPOPopup = this.$modal.open({
                    templateUrl: 'AutomaticPOPopup',
                    backdrop: 'static',
                    keyboard: true,
                    scope: this.$scope,
                });
            } else {
                if (controllerScope.supplierList.length > 0) {
                }
                else {
                    this.getSupplierList();
                }
            }
        }
        else {
            controllerScope.addNewItemProfile.SupplierId = 0;
            controllerScope.addNewItemProfile.AutomaticPOQuantity = 0;
        }
    }

    //used for closing  the AutomaticPOPopup-jj
    private closeAutomaticPOPopup() {
        let controllerScope = this.$scope;
        this.automaticPOPopup.dismiss('cancel');
        controllerScope.addNewItemProfile.IsAutomaticPO = false;
    }


    // used to fetch supplier list - jj
    private getSupplierList() {
        let controllerScope = this.$scope;
        controllerScope.supplierList = [];
        //if (controllerScope.supplierList.length > 0) {
        //}
        //else {
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.addNewItemProfileService.getSupplierList(controllerScope.addNewItemProfile.CategoryId);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            //if (error.status == 500) {
            //    controllerRootScope.isLoading = false;
            //}
            //else {
            //    location.replace(this.apiPath);
            //}
        });
        //  }
        //if (controllerScope.addNewItemProfile.IsAutomaticPO) {
        //    this.openAutomaticPOPopup();
        //}
    }
}

app.controller(AddNewItemProfileController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'categoryService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, $rootScope, addNewItemProfileService, categoryService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter, $routeParams) => {
    return new AddNewItemProfileController($scope, $log, $rootScope, addNewItemProfileService, categoryService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter, $routeParams);
}]);


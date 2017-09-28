/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />

interface IaddSubItemProfileControllerScope extends ng.IScope {
    addNewItemProfile: Model.AddNewItemProfile;
    unitList: any;
    itemType: any;
    submitNewSubItem: Function;
    cancelButtonEvent: Function;
    isAdd: boolean;
    itemNameEnRequired: string;
    itemFlavourEnRequired: string;
    barCodeRequired: string;
    unitTypeRequired: string;
    itemTypeRequired: string;
    profitMarginRequired: string;
    itemNameArRequired: string;
    itemFlavourArRequired: string;
    itemCodeRequired: string;
    sellPriceRequired: string;
    sellPriceARequired: string;
    sellPriceBRequired: string;
    sellPriceCRequired: string;
    sellPriceDRequired: string;
    costPriceRequired: string;
    baseUnitCount: string;
    barcodeExists: string;
    itemCodeisExists: string;
    sellPriceNotValid: string;
    isSellPriceNotValid: boolean;
    isItemCodeExists: boolean;
    isbarcodeExists: boolean;

    isSellPriceANotValid: boolean;
    sellPriceANotValid: string;
    isSellPriceBNotValid: boolean;
    sellPriceBNotValid: string;
    isSellPriceCNotValid: boolean;
    sellPriceCNotValid: string;
    isSellPriceDNotValid: boolean;
    sellPriceDNotValid: string;

    isSellPriceDisabled: boolean;
    isSellPriceADisabled: boolean;
    isSellPriceBDisabled: boolean;
    isSellPriceCDisabled: boolean;
    isSellPriceDDisabled: boolean;
    isCostPriceDisabled: boolean;
    isPreviousCostPriceDisabled: boolean;
    isActivate: boolean;
    subItemPageHeader: string;
    isBaseUnitCount: boolean;
    isConvertAndChangeToMainItemLink: boolean;
    openConvertMainItemPopup: Function;
    convertToMainItem: Function;
    openChangeMainItem: Function;
    cancelConvertMainItemPopup: Function;
    cancelButtonForChangeMainItem: Function;
    itemProfileCollectionList: any;
    itemProfileErrorMessageDisplay: boolean;
    clickOnSelectLinkForChangeMainItem: Function;
    searchEvent: Function;
    marginProfit: number;
    isFocusIn: boolean;
    barCodeNotValid: string;
    isBarCodeNotValid: boolean;
    compareMaxMiniValue: Function;
    compareMaxMinWithIndex: Function;
    addElements: Function;
    openAutomaticPOPopup: Function;
    closeAutomaticPOPopup: Function;
    removeElement: Function;
    supplierList: any;
    isFirstClick: boolean;
    initiatorOfSpoCollection: any;
    initiatorRequired: string;
    GenrateBarcode: Function;
    companyBarcodeButtonText: string;
    isGenratedBarcodeButton: boolean;
    isBarcodeDisabled: boolean;
    itemBarcodeValid: any;
    itemBaseUnitCount: any;
    itemValidProfitMargin: any;
    itemValidSellPrice: any;
    itemValidSellPriceA: any;
    itemValidSellPriceB: any;
    itemValidSellPriceC: any;
    itemValidSellPriceD: any;
    validCostPriceError: any;
    validQuantityError: any;
    ConvertConfirmationMessage: any;
    noCategoryFound: any;
}

interface IaddSubItemProfileController {

}


class AddSubItemProfileController implements IaddSubItemProfileController {
    static controllerId = "addSubItemProfileController";
    public convertMainItemPopup;
    public changeMainItemPopup;
    public automaticPOPopup;
    constructor(private $scope: IaddSubItemProfileControllerScope, private $log: ng.ILogService, public $rootScope, private addNewItemProfileService: AddNewItemProfileService, private userAccessService: UserAccessService, public apiPath, public ngToast, public listOfAccessPages, public authenticationPath, public $location, public $modal, public $routeParams, public filterFilter) {
        // this.$scope.parentsId = 0;
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.unitList = [];
        this.$scope.itemType = '';
        this.$scope.itemNameEnRequired = stringConstants.itemNameEnRequired;
        this.$scope.addNewItemProfile.ListOfItemQuantityList = [];
        this.$scope.itemFlavourEnRequired = stringConstants.itemFlavourEnRequired;
        this.$scope.barCodeRequired = stringConstants.barCodeRequired;
        this.$scope.unitTypeRequired = stringConstants.unitTypeRequired;
        this.$scope.itemTypeRequired = stringConstants.itemTypeRequired;
        this.$scope.baseUnitCount = stringConstants.baseUnitCount;
        this.$scope.profitMarginRequired = stringConstants.profitMarginRequired;
        this.$scope.itemNameArRequired = stringConstants.itemNameArRequired;
        this.$scope.itemFlavourArRequired = stringConstants.itemFlavourArRequired;
        this.$scope.itemCodeRequired = stringConstants.itemCodeRequired;
        this.$scope.sellPriceNotValid = stringConstants.sellPriceIsNotValid;
        this.$scope.sellPriceANotValid = stringConstants.sellPriceAIsNotValid;
        this.$scope.sellPriceBNotValid = stringConstants.sellPriceBIsNotValid;
        this.$scope.sellPriceCNotValid = stringConstants.sellPriceCIsNotValid;
        this.$scope.sellPriceDNotValid = stringConstants.sellPriceDIsNotValid;
        this.$scope.sellPriceRequired = stringConstants.sellPriceRequired;
        this.$scope.sellPriceARequired = stringConstants.sellPriceARequired;
        this.$scope.sellPriceBRequired = stringConstants.sellPriceBRequired;
        this.$scope.sellPriceCRequired = stringConstants.sellPriceCRequired;
        this.$scope.sellPriceDRequired = stringConstants.sellPriceDRequired;
        this.$scope.itemCodeisExists = stringConstants.itemCodeExists;
        this.$scope.barcodeExists = stringConstants.barcodeExists;
        this.$scope.costPriceRequired = stringConstants.costPriceRequired;
        this.$scope.isAdd = true;
        this.$scope.submitNewSubItem = (addNewItemProfile, isAdd) => this.submitNewSubItem(addNewItemProfile, isAdd);
        this.$scope.cancelButtonEvent = () => this.cancleButtonEvent();
        this.$scope.openConvertMainItemPopup = () => this.openConvertMainItemPopup();
        this.$scope.convertToMainItem = () => this.convertMainItem();
        this.$scope.openChangeMainItem = () => this.openChangeMainItem();
        this.$scope.barCodeNotValid = stringConstants.barcodeValid;
        this.$scope.isBarCodeNotValid = false;
        this.$scope.isFirstClick = false;
        this.$scope.isSellPriceNotValid = false;
        this.$scope.isSellPriceANotValid = false;
        this.$scope.isSellPriceBNotValid = false;
        this.$scope.isSellPriceCNotValid = false;
        this.$scope.isSellPriceDNotValid = false;
        this.$scope.isItemCodeExists = false;
        this.$scope.isbarcodeExists = false;
        this.$scope.isSellPriceDisabled = false;
        this.$scope.isSellPriceADisabled = false;
        this.$scope.isSellPriceBDisabled = false;
        this.$scope.isSellPriceCDisabled = false;
        this.$scope.isSellPriceDDisabled = false;
        this.$scope.isCostPriceDisabled = false;
        this.$scope.isPreviousCostPriceDisabled = false;
        this.$scope.addNewItemProfile.IsCompanyBarcode = false;
        this.$scope.isActivate = true;
        this.$scope.isBaseUnitCount = false;
        this.$scope.isConvertAndChangeToMainItemLink = false;
        this.$scope.cancelConvertMainItemPopup = () => this.cancelConvertMainItemPopup();
        this.$scope.cancelButtonForChangeMainItem = () => this.cancelButtonForChangeMainItem();
        this.$scope.supplierList = [];
        this.$scope.openAutomaticPOPopup = () => this.openAutomaticPOPopup();
        this.$scope.closeAutomaticPOPopup = () => this.closeAutomaticPOPopup();
        this.$scope.itemProfileErrorMessageDisplay = true;
        this.$scope.clickOnSelectLinkForChangeMainItem = (id) => this.clickOnSelectLinkForChangeMainItem(id);
        this.$scope.marginProfit = 0;
        this.$scope.subItemPageHeader = "";
        this.$scope.companyBarcodeButtonText = stringConstants.genrateCompanyBarcode;
        this.$scope.GenrateBarcode = () => this.GenrateBarcode();
        this.$scope.isBarcodeDisabled = false;
        this.$scope.isGenratedBarcodeButton = false;
        this.initialize();
        this.$rootScope.isFocusIn = true;
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
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.ConvertConfirmationMessage = stringConstants.ConvertConfirmationMessage;
        this.$scope.noCategoryFound = stringConstants.noCategoryFound;
    }
    private initialize() {
        this.getAllInitiatorOfSpo();
        this.getUnitTypeList();

        if (this.$routeParams.parentsId !== null && this.$routeParams.parentsId !== undefined && this.$routeParams.parentsId !== "") {
            this.$scope.subItemPageHeader = "addsubitem";
            this.binDataInAddSubItemPage(this.$routeParams.parentsId);
        }
        else if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.$scope.subItemPageHeader = "editsubitem";
            this.EditSubItem(this.$routeParams.id);
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
                this.$scope.isBarcodeDisabled = false;
                controllerRootScope.isLoading = false;
                this.$scope.addNewItemProfile.IsCompanyBarcode = false;
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

    //this funciton used for get unit type.  -An
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

    //When click on edit link for sub items this function will call for binding data. -An
    private EditSubItem(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isAdd = false;
        controllerRootScope.isLoading = true;
        controllerScope.isConvertAndChangeToMainItemLink = true;
        controllerScope.isSellPriceDisabled = true;
        controllerScope.isBarcodeDisabled = true;
        controllerScope.isGenratedBarcodeButton = true;
        controllerScope.isSellPriceADisabled = true;
        controllerScope.isSellPriceBDisabled = true;
        controllerScope.isSellPriceCDisabled = true;
        controllerScope.isSellPriceDDisabled = true;
        controllerScope.isCostPriceDisabled = true;
        controllerScope.isPreviousCostPriceDisabled = true;
        controllerScope.isActivate = false;
        //to get unit type list
        let promise = this.addNewItemProfileService.getItemDetailById(id);
        promise.then((result) => {
            if (result !== null) {
                controllerScope.addNewItemProfile = result;
                controllerScope.itemType = result.Category.BrandParamType.ValueEn + "-" + result.Category.GroupParamType.ValueEn;
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

    //this function used for open the Convert to main item popup. -An
    private openConvertMainItemPopup() {
        this.convertMainItemPopup = this.$modal.open({
            templateUrl: 'convertToMainItemPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });

    }

    //this funciton used for close convert to main item popup. -An
    private cancelConvertMainItemPopup() {
        this.convertMainItemPopup.dismiss('cancel');
    }

    //this function used for open popup for change main item. -An
    private openChangeMainItem() {
        this.changeMainItemPopup = this.$modal.open({
            templateUrl: 'changeMainItem',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'itemProfileListController',
            scope: this.$scope,
        });

    }

    //this funciton used for close change main item popup. -An
    private cancelButtonForChangeMainItem() {
        this.changeMainItemPopup.dismiss('cancel');
    }

    //this funciton used for bind add data sub item page and diable some text box.  -An
    private binDataInAddSubItemPage(parentsId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        let promise = this.addNewItemProfileService.getItemProfileObjectById(parentsId);
        promise.then((result) => {
            if (result.length !== 0) {
                controllerScope.addNewItemProfile.ItemNameEn = result.ItemNameEn;
                controllerScope.addNewItemProfile.ItemNameSl = result.ItemNameSl;
                controllerScope.addNewItemProfile.FlavourEn = result.FlavourEn;
                controllerScope.addNewItemProfile.FlavourSl = result.FlavourSl;
                controllerScope.addNewItemProfile.CategoryId = result.CategoryId;
                controllerScope.itemType = result.ItemType;
                controllerScope.addNewItemProfile.IsActive = result.IsActive;
                controllerScope.addNewItemProfile.IsAutomaticPO = result.IsAutomaticPO;
                controllerScope.addNewItemProfile.IsParentItem = false;
                controllerScope.addNewItemProfile.ParentItemId = result.Id;
                //controllerScope.addNewItemProfile.BaseUnit = result.BaseUnit;
                controllerScope.addNewItemProfile.ProfitMargin = result.ProfitMargin;
                this.$scope.marginProfit = result.ProfitMargin;
                controllerScope.addNewItemProfile.IsActive = result.IsActive;
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

    //this function used for submit new subItem. -An
    private submitNewSubItem(addNewItemProfile, isAdd) {
        if (!this.$scope.isFirstClick) {
            this.$scope.isFirstClick = true;
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.isSellPriceNotValid = false;
            controllerScope.isBarCodeNotValid = false;
            controllerScope.isSellPriceANotValid = false;
            controllerScope.isSellPriceBNotValid = false;
            controllerScope.isSellPriceCNotValid = false;
            controllerScope.isSellPriceDNotValid = false;
            controllerScope.isItemCodeExists = false;
            controllerScope.isbarcodeExists = false;
            if (isAdd) {
                //to check sell price is valid or not.
                let d = ((parseFloat(addNewItemProfile.CostPrice) * parseFloat(addNewItemProfile.ProfitMargin)) / 100);
                let total = d + parseFloat(addNewItemProfile.CostPrice);
                let isCheckValidSellPrice = this.checkValidSellPriceOrNot(addNewItemProfile, total);
                if (isCheckValidSellPrice) {
                    addNewItemProfile.IsParentItem = false;
                    let promise = this.addNewItemProfileService.insertSubItem(addNewItemProfile);
                    promise.then((result) => {
                        if (result._isResult.NormalBarcodeFrom === undefined && result._isResult.NormalBarcodeTo === undefined) {
                            if (result._isResult !== 0) {//check barcode is exists
                                if (result._isResult !== -2) {//check item code is exists
                                    this.ngToast.create(stringConstants.addedSubItem);
                                    this.$location.path('/ItemProfile');
                                }
                                else
                                    controllerScope.isItemCodeExists = true;

                            } else
                                controllerScope.isbarcodeExists = true;
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
                let promise = this.addNewItemProfileService.updateSubItem(addNewItemProfile);
                promise.then((result) => {
                    if ((result._isResult.BalanceBarcodeFrom === undefined || result._isResult.BalanceBarcodeFrom === null) && (result._isResult.BalanceBarcodeTo === undefined || result._isResult.BalanceBarcodeTo === null)) {
                        if (result._isResult !== 0) {//check barcode is exists 
                            if (result._isResult !== -2) {//check item code is exists
                                if (result._isResult !== -3) {//check icr genrated or not.
                                    if (result._isResult !== -4) {//check issue invetory is created or not.
                                        this.ngToast.create(stringConstants.updateSubItemProfileSucessfully);
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
                                controllerScope.isItemCodeExists = true;
                        } else
                            controllerScope.isbarcodeExists = true;
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
            this.$scope.isFirstClick = false;
            controllerRootScope.isLoading = false;
        }
    }

    private checkValidSellPriceOrNot(addNewItemProfile, total) {
        if (parseFloat(addNewItemProfile.SellPrice) >= total) {
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
        }
        else {
            this.$scope.isSellPriceNotValid = true;
            return false;
        }
        return true;
    }

    //this funciton used for change main Item
    private clickOnSelectLinkForChangeMainItem(id) {
        let controllerscope = this.$scope;
        let controllerrootscope = this.$rootScope;
        controllerrootscope.isloading = true;
        let promise = this.addNewItemProfileService.changeMainItem(id, this.$routeParams.id);
        promise.then((result) => {
            this.changeMainItemPopup.dismiss('cancel');
            this.ngToast.create(stringConstants.changeMainItem);
            this.$location.path('/ItemProfile');
        }).catch((error) => {
            controllerrootscope.isloading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for cancle button event. -An
    private cancleButtonEvent() {
        this.$location.path('/ItemProfile');
    }

    //this function used for Convert To Main Item -An 
    private convertMainItem() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.addNewItemProfileService.convertToMainItem(controllerScope.addNewItemProfile.Id);
        promise.then((result) => {
            if (result._isResult !== 0) {//check barcode is exists 
                this.convertMainItemPopup.dismiss('cancel');
                this.ngToast.create(stringConstants.convertSubItemToMainItemSuccessfully);
                this.$location.path('/ItemProfile');
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

app.controller(AddSubItemProfileController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'UserAccessService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', '$routeParams', 'filterFilter', ($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, $routeParams, filterFilter) => {
    return new AddSubItemProfileController($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, $routeParams, filterFilter);
}]);


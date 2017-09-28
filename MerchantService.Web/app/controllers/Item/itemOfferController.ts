/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/itemofferservice.ts" />
/// <reference path="../../models/item/itemoffer.ts" />

interface IitemOfferControllerScope extends ng.IScope {
    itemOfferModel: Model.ItemOffer;
    search: any;
    itemsPerPage: number;
    currentPage: any;
    totalItems: number;
    maxSize: number;
    totalCollection: any;
    itemProfileCollection: any;
    errorMessageDisplayForBlankList: boolean;
    isItemGrid: boolean;
    searchEvent: Function;
    isItemDetails: boolean;
    getSubItemList: Function;
    branchList: any;
    openStartDatePickerDate: Function;
    openEndDatePickerDate: Function;
    isStartPickerDateOpened: boolean;
    isEndPickerDateOpened: boolean;
    viewItemDetail: Function;
    itemName: string;
    itemFlavour: string;
    itemType: string;
    itemCode: string;
    barocde: string;
    unitType: string;
    baseUnitCount: number;
    isOfferItem: string;
    sellPrice: number;
    sellPriceA: number;
    sellPriceB: number;
    sellPriceC: number;
    sellPriceD: number;
    costPrice: number;
    marginProfit: number;
    systemQuantity: number;
    startTime: any;
    endTime: any;
    showMeridian: boolean;
    showMeridianEndTime: boolean;
    initiatedList: any;
    submitItemOffer: Function;

    //string constant
    branchRequired: string;
    initiatedRequired: string;
    startDateRequired: string;
    startDateHigher: string;
    startTimeRequired: string;
    endDateRequired: string;
    endTimeRequired: string;
    quantiryLimitRequired: string;
    sellPriceRequired: string;
    sellPriceARequired: string;
    sellPriceBRequired: string;
    sellPriceCRequired: string;
    sellPriceDRequired: string;
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
    sellPriceNotValidForOldPrice: string;
    isSellPriceNotValidForOldPrice: boolean;
    sellPriceANotValidForOldPrice: string;
    isSellPriceANotValidForOldPrice: boolean;
    sellPriceBNotValidForOldPrice: string;
    isSellPriceBNotValidForOldPrice: boolean;
    sellPriceCNotValidForOldPrice: string;
    isSellPriceCNotValidForOldPrice: boolean;
    sellPriceDNotValidForOldPrice: string;
    isSellPriceDNotValidForOldPrice: boolean;
    isStartDate: boolean;
    isStartDateHigher: boolean;
    isStartTime: boolean;
    isendDate: boolean;
    isendTime: boolean;
    updateSellPrice: Function;
    openItemListPopup: Function;
    cancelButtonForItemPopup: Function;
    StartDate: Date;
    EndDate: Date;
    collectionOfAction: any;
    cancleButtonEvent: Function;
    isNotValidQunatityLimit: boolean;
    qunatityLimitNotValid: string;
    isQunatityLimitGreaterThenZero: boolean;
    qunatityLimitGreaterThenZero: string;
    branchModel: any;
    errorMessageList: any;
    clickOnClose: Function;
    isSupplierRequired: boolean;
    isSupplierDisplay: boolean;
    supplierList: any;
    changeInitiateDropDown: Function;
    supplierProfileRequired: string;
    isOfferCreatedBelowCostPrice: boolean;
    changeSellPrice: Function;
    isAllowSellPriceLowerCostPrice: boolean;
    isAllowSellPriceLowerMarginProfit: boolean;
    allowSellPriceLowerCostPrice: string;
    allowSellPriceLowerMarginProfit: string;
    isAllowSellPriceALowerCostPrice: boolean;
    isAllowSellPriceALowerMarginProfit: boolean;
    isAllowSellPriceBLowerCostPrice: boolean;
    isAllowSellPriceBLowerMarginProfit: boolean;
    isAllowSellPriceCLowerCostPrice: boolean;
    isAllowSellPriceCLowerMarginProfit: boolean;
    isAllowSellPriceDLowerCostPrice: boolean;
    isAllowSellPriceDLowerMarginProfit: boolean;
    isBranchRequired: boolean;
    totalItemProfileCollection: any;
    isFirstClick: boolean;
    isDataLoading: boolean;
    noItemFound: any;
    validQuantityLimit: any;
    itemValidSellPrice: any;
    itemValidSellPriceA: any;
    itemValidSellPriceB: any;
    itemValidSellPriceC: any;
    itemValidSellPriceD: any;
}

interface IitemOfferController {

}

class ItemOfferController implements IitemOfferController {
    static controllerId = "itemOfferController";
    public itemListPopup;
    public itemOfferResponse;

    constructor(private $scope: IitemOfferControllerScope, private $log: ng.ILogService, public $rootScope, private itemOfferService: ItemOfferService, public apiPath, public ngToast, public authenticationPath, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.search = [];
        this.$scope.totalCollection = [];
        this.$scope.supplierList = [];
        this.$scope.totalItemProfileCollection = [];
        this.$scope.itemProfileCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.isItemGrid = false;
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 10;
        this.$scope.maxSize = 100;
        this.$scope.isItemDetails = false;
        this.$scope.searchEvent = () => this.searchEvent();
        this.$scope.getSubItemList = (parentId) => this.getSubItemList(parentId);
        this.$scope.itemOfferModel = new Model.ItemOffer();
        this.$scope.branchList = [];
        this.$scope.openStartDatePickerDate = (event) => this.openStartDatePickerDate(event);
        this.$scope.openEndDatePickerDate = (event) => this.openEndDatePickerDate(event);
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.viewItemDetail = (id) => this.viewItemDetail(id);
        this.$scope.itemName = "";
        this.$scope.itemFlavour = "";
        this.$scope.itemType = "";
        this.$scope.itemCode = "";
        this.$scope.barocde = "";
        this.$scope.unitType = "";
        this.$scope.baseUnitCount = 0;
        this.$scope.isOfferItem = "";
        this.$scope.sellPrice = 0;
        this.$scope.sellPriceA = 0;
        this.$scope.sellPriceB = 0;
        this.$scope.sellPriceC = 0;
        this.$scope.sellPriceD = 0;
        this.$scope.branchModel = [];
        this.$scope.costPrice = 0;
        this.$scope.marginProfit = 0;
        this.$scope.systemQuantity = 0;
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.showMeridian = true;
        this.$scope.showMeridianEndTime = true;
        this.$scope.isSupplierDisplay = false;
        this.$scope.isSupplierRequired = false;
        this.$scope.initiatedList = stringConstants.initiatedList;
        this.$scope.clickOnClose = () => this.clickOnClose();
        this.$scope.submitItemOffer = () => this.submitItemOffer();
        this.$scope.branchRequired = stringConstants.branchNameRequired;
        this.$scope.initiatedRequired = stringConstants.initiatedRequired;
        this.$scope.startDateRequired = stringConstants.startDateRequired;
        this.$scope.startDateHigher = stringConstants.startDateHigher;
        this.$scope.startTimeRequired = stringConstants.startTimeRequired;
        this.$scope.endDateRequired = stringConstants.endDateRequired;
        this.$scope.endTimeRequired = stringConstants.endTimeRequired;
        this.$scope.quantiryLimitRequired = stringConstants.quantityLimitRequired;
        this.$scope.sellPriceRequired = stringConstants.sellPriceRequired;
        this.$scope.sellPriceARequired = stringConstants.sellPriceARequired;
        this.$scope.sellPriceBRequired = stringConstants.sellPriceBRequired;
        this.$scope.sellPriceCRequired = stringConstants.sellPriceCRequired;
        this.$scope.sellPriceDRequired = stringConstants.sellPriceDRequired;
        this.$scope.sellPriceNotValid = stringConstants.sellPriceIsNotValid;
        this.$scope.sellPriceANotValid = stringConstants.sellPriceAIsNotValid;
        this.$scope.sellPriceBNotValid = stringConstants.sellPriceBIsNotValid;
        this.$scope.sellPriceCNotValid = stringConstants.sellPriceCIsNotValid;
        this.$scope.sellPriceDNotValid = stringConstants.sellPriceDIsNotValid;
        this.$scope.sellPriceNotValidForOldPrice = stringConstants.sellPriceIsNotGreaterForMainPrice;
        this.$scope.sellPriceANotValidForOldPrice = stringConstants.sellPriceAIsNotGreaterForMainPrice;
        this.$scope.sellPriceBNotValidForOldPrice = stringConstants.sellPriceBIsNotGreaterForMainPrice;
        this.$scope.sellPriceCNotValidForOldPrice = stringConstants.sellPriceCIsNotGreaterForMainPrice;
        this.$scope.sellPriceDNotValidForOldPrice = stringConstants.sellPriceDIsNotGreaterForMainPrice;
        this.$scope.supplierProfileRequired = stringConstants.supplierRequired;
        this.$scope.qunatityLimitGreaterThenZero = stringConstants.quantityGreaterThanzero;
        this.$scope.isSellPriceNotValidForOldPrice = false;
        this.$scope.isSellPriceANotValidForOldPrice = false;
        this.$scope.isSellPriceBNotValidForOldPrice = false;
        this.$scope.isSellPriceCNotValidForOldPrice = false;
        this.$scope.isSellPriceDNotValidForOldPrice = false;
        this.$scope.isSellPriceNotValid = false;
        this.$scope.isSellPriceANotValid = false;
        this.$scope.isSellPriceBNotValid = false;
        this.$scope.isSellPriceCNotValid = false;
        this.$scope.isSellPriceDNotValid = false;
        this.$scope.isQunatityLimitGreaterThenZero = false;
        this.$scope.isStartDate = false;
        this.$scope.isStartDateHigher = false;
        this.$scope.isStartTime = false;
        this.$scope.isendDate = false;
        this.$scope.isendTime = false;
        this.$scope.updateSellPrice = () => this.updateSellPrice();
        this.$scope.openItemListPopup = () => this.openItemListPopup();
        this.$scope.cancelButtonForItemPopup = () => this.cancelButtonForItemPopup();
        this.$scope.cancleButtonEvent = () => this.cancleButtonEvent();
        this.$scope.isNotValidQunatityLimit = false;
        this.$scope.qunatityLimitNotValid = stringConstants.notValidQunatityLimit;
        this.$scope.errorMessageList = [];
        this.$scope.changeInitiateDropDown = () => this.changeInitiateDropDown();
        this.$scope.changeSellPrice = () => this.changeSellPrice();
        this.$scope.isOfferCreatedBelowCostPrice = false;
        this.$scope.allowSellPriceLowerCostPrice = stringConstants.allowSellPriceLowerCostPrice;
        this.$scope.allowSellPriceLowerMarginProfit = stringConstants.allowSellPriceLowerMarginProfit;
        this.$scope.isAllowSellPriceLowerCostPrice = false;
        this.$scope.isAllowSellPriceLowerMarginProfit = false;
        this.$scope.isAllowSellPriceALowerCostPrice = false;
        this.$scope.isAllowSellPriceALowerMarginProfit = false;
        this.$scope.isAllowSellPriceBLowerCostPrice = false;
        this.$scope.isAllowSellPriceBLowerMarginProfit = false;
        this.$scope.isAllowSellPriceCLowerCostPrice = false;
        this.$scope.isAllowSellPriceCLowerMarginProfit = false;
        this.$scope.isAllowSellPriceDLowerCostPrice = false;
        this.$scope.isAllowSellPriceDLowerMarginProfit = false;
        this.$scope.isDataLoading = false;
        this.$scope.isFirstClick = false;
        this.$scope.isBranchRequired = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validQuantityLimit = stringConstants.validQuantityLimit;
        this.$scope.itemValidSellPrice = stringConstants.itemValidSellPrice;
        this.$scope.itemValidSellPriceA = stringConstants.itemValidSellPriceA;
        this.$scope.itemValidSellPriceB = stringConstants.itemValidSellPriceB;
        this.$scope.itemValidSellPriceC = stringConstants.itemValidSellPriceC;
        this.$scope.itemValidSellPriceD = stringConstants.itemValidSellPriceD;

        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.itemProfileCollection.slice(begin, end);
        });

        this.initialization();
    }

    //this function used initializion -An
    private initialization() {
        this.getItemProfileList();
        this.getBranchList();
    }

    //this function used for open popup for change main item. -An
    private openItemListPopup() {
        this.itemListPopup = this.$modal.open({
            templateUrl: 'itemListPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'itemCollectionController',
            scope: this.$scope,
        });

    }

    private changeSellPrice() {
        let controllerScope = this.$scope;
        this.$scope.isAllowSellPriceLowerMarginProfit = false;
        this.$scope.isAllowSellPriceALowerMarginProfit = false;
        this.$scope.isAllowSellPriceBLowerMarginProfit = false;
        this.$scope.isAllowSellPriceCLowerMarginProfit = false;
        this.$scope.isAllowSellPriceDLowerMarginProfit = false;
        this.$scope.isAllowSellPriceLowerCostPrice = false;
        this.$scope.isAllowSellPriceALowerCostPrice = false;
        this.$scope.isAllowSellPriceBLowerCostPrice = false;
        this.$scope.isAllowSellPriceCLowerCostPrice = false;
        this.$scope.isAllowSellPriceDLowerCostPrice = false;

        if (controllerScope.isOfferCreatedBelowCostPrice) {
            let isValid = this.AllowSellPriceLowerMarginProfit();
            if (isValid) {
                if (controllerScope.itemOfferModel.SellPrice < controllerScope.costPrice) {
                    this.$scope.isAllowSellPriceLowerCostPrice = true;
                }

                if (controllerScope.itemOfferModel.SellPriceA < controllerScope.costPrice) {
                    this.$scope.isAllowSellPriceALowerCostPrice = true;
                }

                if (controllerScope.itemOfferModel.SellPriceB < controllerScope.costPrice) {
                    this.$scope.isAllowSellPriceBLowerCostPrice = true;
                }

                if (controllerScope.itemOfferModel.SellPriceC < controllerScope.costPrice) {
                    this.$scope.isAllowSellPriceCLowerCostPrice = true;
                }

                if (controllerScope.itemOfferModel.SellPriceD < controllerScope.costPrice) {
                    this.$scope.isAllowSellPriceDLowerCostPrice = true;
                }
            }
        }
    }

    private AllowSellPriceLowerMarginProfit() {
        let controllerScope = this.$scope;
        let valid = true;
        //to check sell price is valid or not.
        let d = ((controllerScope.costPrice * controllerScope.marginProfit) / 100);
        let total = d + controllerScope.costPrice;
        if (controllerScope.itemOfferModel.SellPrice <= total) {
            this.$scope.isAllowSellPriceLowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferModel.SellPriceA <= total) {
            this.$scope.isAllowSellPriceALowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferModel.SellPriceB <= total) {
            this.$scope.isAllowSellPriceBLowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferModel.SellPriceC <= total) {
            this.$scope.isAllowSellPriceCLowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferModel.SellPriceD <= total) {
            this.$scope.isAllowSellPriceDLowerMarginProfit = true;
            valid = false;
        }
        return valid;
    }

    private clickOnClose() {

        angular.element('.modal-backdrop').removeClass('in');
        angular.element('.modal').removeClass('in');
        this.itemOfferResponse.dismiss('cancel');

        this.$scope.isItemDetails = false;
        let controllerScope: any = this.$scope;
        controllerScope.itemOfferModel = new Model.ItemOffer();
        controllerScope.itemOffer.$setPristine();
        controllerScope.itemOffer.$setValidity();
        controllerScope.itemOffer.$setUntouched();
        this.$location.path('/ItemOfferWorkList');
    }

    private changeInitiateDropDown() {
        if (+this.$scope.itemOfferModel.intiatedId === 1)
            this.$scope.isSupplierDisplay = true;
        else {
            this.$scope.itemOfferModel.SupplierId = undefined;
            this.$scope.isSupplierDisplay = false;
        }
    }

    //this funciton used update Sell Price -An
    private updateSellPrice() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (controllerScope.itemOfferModel.Discount >= 0) {
            if (controllerScope.itemOfferModel.Discount <= 100) {
                let discount = controllerScope.itemOfferModel.Discount;
                let discountPrice = ((controllerScope.sellPrice * discount) / 100);
                let discountPriceA = ((controllerScope.sellPriceA * discount) / 100);
                let discountPriceB = ((controllerScope.sellPriceB * discount) / 100);
                let discountPriceC = ((controllerScope.sellPriceC * discount) / 100);
                let discountPriceD = ((controllerScope.sellPriceD * discount) / 100);

                if ((controllerScope.sellPrice - discountPrice) >= 0)
                    controllerScope.itemOfferModel.SellPrice = (controllerScope.sellPrice - discountPrice);
                else
                    controllerScope.itemOfferModel.SellPrice = 0;
                if ((controllerScope.sellPriceA - discountPriceA) >= 0)
                    controllerScope.itemOfferModel.SellPriceA = (controllerScope.sellPriceA - discountPriceA);
                else
                    controllerScope.itemOfferModel.SellPriceA = 0;
                if ((controllerScope.sellPriceB - discountPriceB) >= 0)
                    controllerScope.itemOfferModel.SellPriceB = (controllerScope.sellPriceB - discountPriceB);
                else
                    controllerScope.itemOfferModel.SellPriceB = 0;
                if ((controllerScope.sellPriceC - discountPriceC) >= 0)
                    controllerScope.itemOfferModel.SellPriceC = (controllerScope.sellPriceC - discountPriceC);
                else
                    controllerScope.itemOfferModel.SellPriceC = 0;
                if ((controllerScope.sellPriceD - discountPriceD) >= 0)
                    controllerScope.itemOfferModel.SellPriceD = (controllerScope.sellPriceD - discountPriceD);
                else
                    controllerScope.itemOfferModel.SellPriceD = 0;
            }
            else {
                controllerScope.itemOfferModel.SellPrice = 0;
                controllerScope.itemOfferModel.SellPriceA = 0;
                controllerScope.itemOfferModel.SellPriceB = 0;
                controllerScope.itemOfferModel.SellPriceC = 0;
                controllerScope.itemOfferModel.SellPriceD = 0;
                controllerScope.itemOfferModel.Discount = 0;
            }
        }

        this.changeSellPrice();
    }

    //this function used for get item profile list -An
    private getItemProfileList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        let itemProfileList = controllerScope.itemProfileCollection;
        let promise = this.itemOfferService.getItemProfileList();
        promise.then((result) => {
            if (result.length > 0) {
                controllerScope.isItemGrid = true;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].IsActive)
                        result[i].IsActive = stringConstants.yes;
                    else
                        result[i].IsActive = stringConstants.no;
                    if (result[i].listOfChildProfileAC !== null && result[i].listOfChildProfileAC !== undefined) {
                        for (let j = 0; j < result[i].listOfChildProfileAC.length; j++) {
                            if (result[i].listOfChildProfileAC[j].IsActive)
                                result[i].listOfChildProfileAC[j].IsActive = stringConstants.yes;
                            else
                                result[i].listOfChildProfileAC[j].IsActive = stringConstants.no;
                        }
                    }
                    itemProfileList.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = itemProfileList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.itemProfileCollection.length;
                controllerScope.totalItemProfileCollection = this.$scope.itemProfileCollection;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isItemGrid = false;
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

    //this funciton used for submit item offer. -An
    private submitItemOffer() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (!controllerScope.isFirstClick) {
            controllerScope.isDataLoading = true;
            controllerScope.isFirstClick = true;
            let isValidForSupplier = true;
            controllerScope.isStartTime = false;
            this.$scope.isAllowSellPriceLowerMarginProfit = false;
            this.$scope.isAllowSellPriceALowerMarginProfit = false;
            this.$scope.isAllowSellPriceBLowerMarginProfit = false;
            this.$scope.isAllowSellPriceCLowerMarginProfit = false;
            this.$scope.isAllowSellPriceDLowerMarginProfit = false;
            controllerScope.isendTime = false;
            controllerScope.isendDate = false;
            controllerScope.isStartDate = false;
            controllerScope.isBranchRequired = false;
            controllerScope.isNotValidQunatityLimit = false;
            controllerScope.isSellPriceNotValid = false;
            controllerScope.isSellPriceANotValid = false;
            controllerScope.isSellPriceBNotValid = false;
            controllerScope.isSellPriceCNotValid = false;
            controllerScope.isQunatityLimitGreaterThenZero = false;
            controllerScope.isSellPriceDNotValid = false;
            controllerScope.isSupplierRequired = false;
            controllerScope.itemOfferModel.StartTime = controllerScope.startTime;
            controllerScope.itemOfferModel.EndTime = controllerScope.endTime;
            if (controllerScope.itemOfferModel.intiatedId === 1) {
                if (controllerScope.itemOfferModel.SupplierId !== undefined && controllerScope.itemOfferModel.SupplierId !== null && controllerScope.itemOfferModel.SupplierId !== 0) {
                    isValidForSupplier = true;
                }
                else
                    isValidForSupplier = false;
            }
            if (isValidForSupplier) {
                if (controllerScope.StartDate !== undefined && controllerScope.StartDate !== null) {//check startdate,enddate,start time and end time was enter or not.
                    if (controllerScope.EndDate !== undefined && controllerScope.EndDate !== null) {
                        if (controllerScope.endTime !== undefined && controllerScope.endTime !== null) {
                            if (controllerScope.startTime !== undefined && controllerScope.startTime !== null) {
                                let isValid = this.checkSellPriceValidOrNot(controllerScope.itemOfferModel);//to checsell price is valid or not.
                                if (isValid) {
                                    if (this.$scope.itemOfferModel.QuantityLimit > 0) {
                                        //to combine date and time
                                        controllerScope.itemOfferModel.StartDateTime = new Date(controllerScope.StartDate.getFullYear(), controllerScope.StartDate.getMonth(), controllerScope.StartDate.getDate(), controllerScope.itemOfferModel.StartTime.getHours(), controllerScope.itemOfferModel.StartTime.getMinutes());
                                        //to combine date and time
                                        controllerScope.itemOfferModel.EndDateTime = new Date(controllerScope.EndDate.getFullYear(), controllerScope.EndDate.getMonth(), controllerScope.EndDate.getDate(), controllerScope.itemOfferModel.EndTime.getHours(), controllerScope.itemOfferModel.EndTime.getMinutes());
                                        if (controllerScope.itemOfferModel.StartDateTime.getTime() <= controllerScope.itemOfferModel.EndDateTime.getTime()) {
                                            this.$scope.isStartDateHigher = false;
                                            controllerScope.itemOfferModel.BranchList = controllerScope.branchModel;
                                            if (controllerScope.itemOfferModel.BranchList.length > 0) {
                                                let promise = this.itemOfferService.insertItemOffer(controllerScope.itemOfferModel);
                                                promise.then((result) => {
                                                    if (result._isResult.length > 0) {
                                                        for (let i = 0; i < result._isResult.length; i++) {
                                                            this.$scope.errorMessageList.push(result._isResult[i]);
                                                        }
                                                        this.itemOfferResponse = this.$modal.open({
                                                            templateUrl: 'itemOfferMessage',
                                                            backdrop: 'static',
                                                            keyboard: true,
                                                            size: 'md',
                                                            scope: this.$scope,
                                                        });
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
                                            else
                                                controllerScope.isBranchRequired = true;
                                        }
                                        else {
                                            this.$scope.isStartDateHigher = true;
                                        }
                                    }
                                    else
                                        controllerScope.isQunatityLimitGreaterThenZero = true;
                                }
                            }
                            else
                                controllerScope.isStartTime = true;
                        }
                        else
                            controllerScope.isendTime = true;

                    } else
                        controllerScope.isendDate = true;

                } else
                    controllerScope.isStartDate = true;
            }
            else
                controllerScope.isSupplierRequired = true;
            controllerScope.isFirstClick = false;
        }
        controllerScope.isDataLoading = false;
    }

    //this function used for dispaly item detail. -An
    private viewItemDetail(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isQunatityLimitGreaterThenZero = false;
        controllerScope.isDataLoading = true;
        controllerScope.itemOfferModel.ItemId = id;
        this.$scope.isItemDetails = true;
        this.getSupplierList(id);
        let promise = this.itemOfferService.getItemProfileObjectById(id);
        promise.then((result) => {
            if (result !== null && result !== undefined && result !== 0) {
                controllerScope.itemName = result.ItemNameEn;
                controllerScope.itemFlavour = result.FlavourEn;
                controllerScope.itemType = result.ItemType;
                controllerScope.itemCode = result.Code;
                controllerScope.barocde = result.Barcode;
                controllerScope.unitType = result.Unit;
                controllerScope.baseUnitCount = result.BaseUnit;
                controllerScope.isOfferItem = result.IsOfferItem;
                controllerScope.sellPrice = result.SellPrice;
                controllerScope.sellPriceA = result.SellPriceA;
                controllerScope.sellPriceB = result.SellPriceB;
                controllerScope.sellPriceC = result.SellPriceC;
                controllerScope.sellPriceD = result.SellPriceD;
                controllerScope.costPrice = result.CostPrice;
                controllerScope.marginProfit = result.ProfitMargin;
                controllerScope.systemQuantity = result.SystemQuantity;
                controllerScope.isOfferCreatedBelowCostPrice = result.IsOfferCreatedBelowCostPrice;
            }
            controllerScope.isDataLoading = false;
            this.itemListPopup.dismiss('cancel');
        });
    }

    private getSupplierList(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;        //To get branch list
        let promise = this.itemOfferService.getSupplierListByItemId(id);
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn });
                }
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


    //this functin used for check sell price is valid or not. -An
    private checkSellPriceValidOrNot(itemOffer) {
        let controllerScope = this.$scope;
        if (controllerScope.isOfferCreatedBelowCostPrice)
            return true;
        //to check sell price is valid or not.
        let d = ((controllerScope.costPrice * controllerScope.marginProfit) / 100);
        let total = d + controllerScope.costPrice;
        if (itemOffer.SellPrice >= total) {
            if (itemOffer.SellPriceA >= total) {

                if (itemOffer.SellPriceB >= total) {

                    if (itemOffer.SellPriceC >= total) {

                        if (itemOffer.SellPriceD >= total) {
                            return true;
                        }
                        else
                            controllerScope.isSellPriceDNotValid = true;
                    }
                    else
                        controllerScope.isSellPriceCNotValid = true;
                }
                else
                    controllerScope.isSellPriceBNotValid = true;
            }
            else
                controllerScope.isSellPriceANotValid = true;
        }
        else
            controllerScope.isSellPriceNotValid = true;
        return false;
    }

    // this function used for chec current sell price is greater than to old price. -An
    private checkSellPriceValidForOldPrice(itemOffer) {
        let controllerScope = this.$scope;
        if (controllerScope.isOfferCreatedBelowCostPrice)
            return true;
        if (itemOffer.SellPrice < controllerScope.costPrice) {
            if (itemOffer.SellPriceA < controllerScope.costPrice) {

                if (itemOffer.SellPriceB < controllerScope.costPrice) {

                    if (itemOffer.SellPriceC < controllerScope.costPrice) {

                        if (itemOffer.SellPriceD < controllerScope.costPrice) {
                            return true;
                        }
                        else
                            controllerScope.isSellPriceDNotValidForOldPrice = true;
                    }
                    else
                        controllerScope.isSellPriceCNotValidForOldPrice = true;
                }
                else
                    controllerScope.isSellPriceBNotValidForOldPrice = true;
            }
            else
                controllerScope.isSellPriceANotValidForOldPrice = true;
        }
        else
            controllerScope.isSellPriceNotValidForOldPrice = true;
        return false;
    }

    //This funciton used for search funcitonality. -An
    private searchEvent() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.errorMessageDisplayForBlankList = false;

        //create sub Item Search List;
        let subItemSearch = [];
        if (controllerScope.totalItemProfileCollection.length > 0) {
            for (let i = 0; i < controllerScope.totalItemProfileCollection.length; i++) {
                if (controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== null && controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== undefined) {
                    for (let j = 0; j < controllerScope.totalItemProfileCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.totalItemProfileCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }

        let searching = this.filterFilter((subItemSearch), controllerScope.search);
        this.$scope.itemProfileCollection = this.filterFilter((controllerScope.totalItemProfileCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (this.$scope.itemProfileCollection === 0 && searching === 0) {//check searching and searchList set 0.
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
            controllerScope.isItemGrid = false;
        }
        else if (this.$scope.itemProfileCollection !== 0) {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = this.$scope.itemProfileCollection.slice(begin, end);
            controllerScope.totalItems = this.$scope.itemProfileCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
            controllerScope.isItemGrid = true;
        }
        else {
            for (let i = 0; i < controllerScope.itemProfileCollection.length; i++) {
                for (let j = 0; j < searching.length; j++) {
                    if (controllerScope.itemProfileCollection[i].Id === searching[j].ParentItemId) {
                        let isAlreadyExists = true;
                        for (let k = 0; k < controllerScope.itemProfileCollection.length; k++) {
                            if (controllerScope.itemProfileCollection[k].Id === controllerScope.itemProfileCollection[i].Id)
                                isAlreadyExists = false;
                        }
                        if (isAlreadyExists)
                            this.$scope.itemProfileCollection.push(controllerScope.itemProfileCollection[i]);
                    }
                }
            }

            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = this.$scope.itemProfileCollection.slice(begin, end);
            controllerScope.totalItems = this.$scope.itemProfileCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
            controllerScope.isItemGrid = true;
            controllerScope.search = [];
        }
        controllerScope.search = [];
    }

    //This function used for get sub item list. -An
    private getSubItemList(parentId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        let getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {//to check click on pluse or minus icon.
            angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
            angular.element("#subChild" + parentId).removeClass('isHide').addClass('isShowRow');
            angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');

            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
        }
        else {
            angular.element("#subChild" + parentId).removeClass('isShowRow').addClass('isHide');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
        }
        controllerScope.isDataLoading = false;
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope; //To get branch list
        let promise = this.itemOfferService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
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

    //this method used for Start Date Picker -An
    private openStartDatePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    }

    //this method used for end date Picker -An
    private openEndDatePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    }

    //This funciton used for cancel button for Item Popup. -An 
    private cancelButtonForItemPopup() {
        this.itemListPopup.dismiss('cancel');
    }

    private cancleButtonEvent() {
        this.$scope.isItemDetails = false;
        let controllerScope: any = this.$scope;
        controllerScope.itemOfferModel = new Model.ItemOffer();
        controllerScope.itemOffer.$setPristine();
        controllerScope.itemOffer.$setValidity();
        controllerScope.itemOffer.$setUntouched();
        this.$scope.StartDate = null;
        this.$scope.EndDate = null;
    }
}

app.controller(ItemOfferController.controllerId, ['$scope', '$log', '$rootScope', 'itemOfferService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) => {
    return new ItemOfferController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
}]);
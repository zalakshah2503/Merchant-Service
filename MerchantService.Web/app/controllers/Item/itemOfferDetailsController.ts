/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/itemofferservice.ts" />
/// <reference path="../../models/item/itemoffer.ts" />
/// <reference path="../../models/item/workflowforitemoffer.ts" />

interface IitemOfferDetailControllerScope extends ng.IScope {
    itemOfferModel: Model.ItemOffer;
    workFlowLogModel: Model.WorkFlowForItemOffer;
    itemOfferDetail: any;
    approveItemOffer: Function;
    rejectItemOffer: Function;
    actionList: any;
    isStartPickerDateOpened: boolean;
    isEndPickerDateOpened: boolean;
    openStartDatePickerDate: Function;
    openEndDatePickerDate: Function;
    isAprroveReject: boolean;
    isDisableStartDateIcon: boolean;
    isDisableEndDateIcon: boolean;
    isAllowToAprroveAndReject: boolean;
    isQuantityLimit: boolean;
    isSellprice: boolean;
    isSellpriceA: boolean;
    isSellpriceB: boolean;
    isSellpriceC: boolean;
    isSellpriceD: boolean;
    //sell price
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
    isUpdateVisible: boolean;
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
    isStartTime: boolean;
    isendDate: boolean;
    isendTime: boolean;
    startDateRequired: string;
    startTimeRequired: string;
    endDateRequired: string;
    endTimeRequired: string;
    quantiryLimitRequired: string;
    isEndTimeEditing: boolean;
    isStartTimeEditing: boolean;
    startTime: any;
    endTime: any;
    updateItemOffer: Function;
    isStartDateIcon: boolean;
    isEndDateIcon: boolean;
    cancleButtonEvent: Function;
    isApproveButton: boolean;
    isRejectButton: boolean;
    isResumeStoped: boolean;
    isUpdate: boolean;
    stoppedOffer: Function;
    resumeOffer: Function;
    isStopButton: boolean;
    isResumeButton: boolean;
    isNotValidQunatityLimit: boolean;
    qunatityLimitNotValid: string;
    isReview: boolean;
    isDiscount: boolean;
    changeEventForDiscount: Function;
    deleteButtonClick: Function;
    isDeleted: boolean;
    isEdit; boolean;
    isOfferCreatedBelowCostPrice: boolean;
    minEndDate: any;
    minStartDate: any;
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
    changeSellPrice: Function;
    deleteItemOffer: Function;
    cancelDeleteItemOfferPopup: Function;
    qunatityLimitGreaterThenZero: string;
    isQunatityLimitGreaterThenZero: boolean;
    startDateTime: Date;
    isNotValidDate: boolean;
    notValidItemOfferStartDate: string;
    isStartDateHigher: boolean;
    startDateHigher: string;
    validBaseUnitCount: any;
    validQuantityError: any;
    ValidDiscountMessage: any;
    itemValidSellPrice: any;
    itemValidSellPriceA: any;
    itemValidSellPriceB: any;
    itemValidSellPriceC: any;
    itemValidSellPriceD: any;
}

interface IitemOfferDetailController {

}

class ItemOfferDetailsController implements IitemOfferDetailController {
    static controllerId = "itemOfferDetailsController";
    public deleteItemOfferDetail;
    constructor(private $scope: IitemOfferDetailControllerScope, private $log: ng.ILogService, public $rootScope, private itemOfferService: ItemOfferService, public apiPath, public ngToast, public authenticationPath, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.itemOfferDetail = [];
        this.$scope.itemOfferModel = new Model.ItemOffer();
        this.$scope.workFlowLogModel = new Model.WorkFlowForItemOffer();
        this.$scope.approveItemOffer = () => this.approveItemOffer();
        this.$scope.rejectItemOffer = () => this.rejectItemOffer();
        this.$scope.actionList = [];
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.isDisableStartDateIcon = true;
        this.$scope.isDisableEndDateIcon = true;
        this.$scope.isAllowToAprroveAndReject = true;
        this.$scope.isAprroveReject = true;
        this.$scope.isSellprice = true;
        this.$scope.isSellpriceA = true;
        this.$scope.isSellpriceB = true;
        this.$scope.isSellpriceC = true;
        this.$scope.isSellpriceD = true;
        this.$scope.isQuantityLimit = true;
        this.$scope.isUpdateVisible = true;
        this.$scope.isNotValidDate = false;
        this.$scope.openStartDatePickerDate = (event) => this.openStartDatePickerDate(event);
        this.$scope.openEndDatePickerDate = (event) => this.openEndDatePickerDate(event);
        this.$scope.notValidItemOfferStartDate = stringConstants.startDateNotValid;
        this.$scope.sellPriceRequired = stringConstants.sellPriceRequired;
        this.$scope.startDateHigher = stringConstants.startDateHigher;
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
        this.$scope.startDateRequired = stringConstants.startDateRequired;
        this.$scope.startTimeRequired = stringConstants.startTimeRequired;
        this.$scope.endDateRequired = stringConstants.endDateRequired;
        this.$scope.endTimeRequired = stringConstants.endTimeRequired;
        this.$scope.quantiryLimitRequired = stringConstants.quantityLimitRequired;
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
        this.$scope.isStartDate = false;
        this.$scope.isStartTime = false;
        this.$scope.isendDate = false;
        this.$scope.isendTime = false;
        this.$scope.isEndTimeEditing = true;
        this.$scope.isStartTimeEditing = true;
        this.$scope.updateItemOffer = () => this.updateItemOffer();
        this.$scope.cancleButtonEvent = () => this.cancleButtonEvent();
        this.$scope.isEndDateIcon = true;
        this.$scope.isStartDateIcon = true;
        this.$scope.isApproveButton = false;
        this.$scope.isRejectButton = false;
        this.$scope.isUpdate = false;
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.startDateTime = new Date();
        this.$scope.isResumeStoped = false;
        this.$scope.stoppedOffer = () => this.stoppedOffer();
        this.$scope.resumeOffer = () => this.resumeOffer();
        this.$scope.changeEventForDiscount = () => this.changeEventForDiscount();
        this.$scope.isStopButton = true;
        this.$scope.isResumeButton = true;
        this.$scope.isNotValidQunatityLimit = false;
        this.$scope.isReview = false;
        this.$scope.isDiscount = true;
        this.$scope.isDeleted = false;
        this.$scope.isEdit = false;
        this.$scope.minEndDate = new Date();
        this.$scope.minStartDate = new Date();
        this.$scope.isOfferCreatedBelowCostPrice = false;
        this.$scope.deleteButtonClick = () => this.deleteButtonClick();
        this.$scope.qunatityLimitNotValid = stringConstants.notValidQunatityLimit;
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
        this.$scope.changeSellPrice = () => this.changeSellPrice();
        this.$scope.deleteItemOffer = () => this.deleteItemOffer();
        this.$scope.cancelDeleteItemOfferPopup = () => this.cancelDeleteItemOfferPopup();
        this.$scope.qunatityLimitGreaterThenZero = stringConstants.quantityGreaterThanzero;
        this.$scope.isQunatityLimitGreaterThenZero = false;
        this.$scope.isStartDateHigher = false;
        this.$scope.validBaseUnitCount = stringConstants.validBaseUnitCount;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.ValidDiscountMessage = stringConstants.ValidDiscountMessage;
        this.$scope.itemValidSellPrice = stringConstants.itemValidSellPrice;
        this.$scope.itemValidSellPriceA = stringConstants.itemValidSellPrice;
        this.$scope.itemValidSellPriceB = stringConstants.itemValidSellPrice;
        this.$scope.itemValidSellPriceC = stringConstants.itemValidSellPrice;
        this.$scope.itemValidSellPriceD = stringConstants.itemValidSellPrice;
        this.initialization();
    }

    //this function is call in page load. -An
    private initialization() {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getItemOfferAllDetail(this.$routeParams.id);
            this.actionList(this.$routeParams.id);
        }
    }

    //this function used for get item offer all detail by id. -An
    private getItemOfferAllDetail(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.itemOfferService.getItemOfferDetailById(id);
        promise.then((result) => {
            if (!result.IsDeleted) {
                if (result.IsAllowToUpdate && result.IsItemOfferStatusEditPanding) {
                    //this.$scope.isDeleted = true;
                    this.$scope.isUpdate = true;
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = false;
                    this.UpdateItemOfferMode(result);
                }
                else if (result.IsAlreadyValidReject) {    //When Already Approve,Reject offer so this conditon is satisfied.
                    this.$scope.isApproveButton = true;
                    this.$scope.isRejectButton = true;
                }
                if (result.IsStoped) {//This condition is setisfied after resume item offer 
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = true;
                    this.$scope.isStopButton = false;
                    this.$scope.isResumeButton = true;
                    this.$scope.isDeleted = true;
                    this.UpdateItemOfferMode(result);
                }
                if (result.IsResume) {//This condition is setisfied after stop item offer 
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = true;
                    this.$scope.isStopButton = true;
                    this.$scope.isResumeButton = false;
                    this.$scope.isDeleted = true;
                    this.UpdateItemOfferMode(result);
                }
                if (result.IsStop) {
                    this.$scope.isUpdateVisible = false;
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = true;
                    this.$scope.isStopButton = false;
                    this.$scope.isResumeButton = true;
                    this.$scope.isDeleted = true;
                    this.UpdateItemOfferMode(result);
                }


                if (!result.IsApprove && !result.IsAlreadyValidReject && !result.IsAllowToUpdate && !result.IsItemOfferStatusEditPanding && !result.IsStoped && !result.IsResume)
                    this.$scope.isAprroveReject = false;
            }
            else {
                this.$scope.isAprroveReject = false;
                this.$scope.isUpdate = false;
                this.$scope.isResumeStoped = false;
                this.$scope.isDeleted = false;
            }

            controllerScope.itemOfferDetail.StartTime = result.StartTime;
            controllerScope.itemOfferDetail.EndTime = result.EndTime;
            controllerScope.itemOfferDetail.ItemNameEn = result.ItemNameEn;
            controllerScope.itemOfferDetail.FlavourEn = result.FlavourEn;
            controllerScope.itemOfferDetail.ItemType = result.ItemType;
            controllerScope.itemOfferDetail.ItemCode = result.ItemCode;
            controllerScope.itemOfferDetail.Barcode = result.Barcode;
            controllerScope.itemOfferDetail.UnitType = result.UnitType;
            controllerScope.itemOfferDetail.UnitCount = result.BaseUnitCount;
            controllerScope.itemOfferDetail.IsOfferItem = result.IsOfferItem;
            controllerScope.itemOfferDetail.SellPrice = result.SellPrice;
            controllerScope.itemOfferDetail.SellPriceA = result.SellPriceA;
            controllerScope.itemOfferDetail.SellPriceB = result.SellPriceB;
            controllerScope.itemOfferDetail.SellPriceC = result.SellPriceC;
            controllerScope.itemOfferDetail.SellPriceD = result.SellPriceD;
            controllerScope.itemOfferDetail.CostPrice = result.CostPrice;
            controllerScope.itemOfferDetail.SystemQunatity = result.SystemQuantity;
            controllerScope.itemOfferDetail.StartDate = result.StartDate;
            controllerScope.itemOfferDetail.EndDate = result.EndDate;
            controllerScope.itemOfferDetail.NewSellPrice = result.NewSellPrice;
            controllerScope.itemOfferDetail.NewSellPriceA = result.NewSellPriceA;
            controllerScope.itemOfferDetail.NewSellPriceB = result.NewSellPriceB;
            controllerScope.itemOfferDetail.NewSellPriceC = result.NewSellPriceC;
            controllerScope.itemOfferDetail.NewSellPriceD = result.NewSellPriceD;
            controllerScope.itemOfferDetail.QuantityLimit = result.QuantityLimit;
            controllerScope.itemOfferDetail.MarginProfit = result.MarginProfit;
            controllerScope.itemOfferDetail.Discount = result.Discount;
            controllerScope.startDateTime = result.StartDate;
            controllerScope.isOfferCreatedBelowCostPrice = result.IsOfferCreatedBelowCostPrice;

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

    private deleteButtonClick() {
        this.deleteItemOfferDetail = this.$modal.open({
            templateUrl: 'deleteItemOffer',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    }


    private deleteItemOffer() {
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        let promise = this.itemOfferService.deletedItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.deleteItemSuceessfully);
                this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
        this.cancelDeleteItemOfferPopup();

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
                if (controllerScope.itemOfferDetail.NewSellPrice < controllerScope.itemOfferDetail.CostPrice) {
                    this.$scope.isAllowSellPriceLowerCostPrice = true;
                }

                if (controllerScope.itemOfferDetail.NewSellPriceA < controllerScope.itemOfferDetail.CostPrice) {
                    this.$scope.isAllowSellPriceALowerCostPrice = true;
                }

                if (controllerScope.itemOfferDetail.NewSellPriceB < controllerScope.itemOfferDetail.CostPrice) {
                    this.$scope.isAllowSellPriceBLowerCostPrice = true;
                }

                if (controllerScope.itemOfferDetail.NewSellPriceC < controllerScope.itemOfferDetail.CostPrice) {
                    this.$scope.isAllowSellPriceCLowerCostPrice = true;
                }

                if (controllerScope.itemOfferDetail.NewSellPriceD < controllerScope.itemOfferDetail.CostPrice) {
                    this.$scope.isAllowSellPriceDLowerCostPrice = true;
                }
            }
        }
    }

    private AllowSellPriceLowerMarginProfit() {
        let controllerScope = this.$scope;
        let valid = true;
        //to check sell price is valid or not.
        let d = ((controllerScope.itemOfferDetail.CostPrice * controllerScope.itemOfferDetail.MarginProfit) / 100);
        let total = d + controllerScope.itemOfferDetail.CostPrice;
        if (controllerScope.itemOfferDetail.NewSellPrice <= total) {
            this.$scope.isAllowSellPriceLowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferDetail.NewSellPriceA <= total) {
            this.$scope.isAllowSellPriceALowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferDetail.NewSellPriceB <= total) {
            this.$scope.isAllowSellPriceBLowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferDetail.NewSellPriceC <= total) {
            this.$scope.isAllowSellPriceCLowerMarginProfit = true;
            valid = false;
        }
        if (controllerScope.itemOfferDetail.NewSellPriceD <= total) {
            this.$scope.isAllowSellPriceDLowerMarginProfit = true;
            valid = false;
        }
        return valid;
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

    //this function used for update item offer. -An
    private updateItemOffer() {
        this.$rootScope.isLoading = true;
        this.$scope.isSellPriceNotValid = false;
        this.$scope.isSellPriceANotValid = false;
        this.$scope.isSellPriceBNotValid = false;
        this.$scope.isSellPriceCNotValid = false;
        this.$scope.isSellPriceDNotValid = false;
        this.$scope.isStartTime = false;
        this.$scope.isendTime = false;
        this.$scope.isQunatityLimitGreaterThenZero = false;
        this.$scope.isStartDate = false;
        this.$scope.isendDate = false;
        this.$scope.isNotValidDate = false;
        this.$scope.isNotValidQunatityLimit = false;
        let itemOfferDetail = this.$scope.itemOfferDetail;
        this.$scope.itemOfferDetail.StartTime = this.$scope.startTime;
        this.$scope.itemOfferDetail.EndTime = this.$scope.endTime;
        if (this.$scope.itemOfferDetail.StartDate !== undefined && this.$scope.itemOfferDetail.StartDate !== null) {//check startdate,enddate,starttime and endtime was enter or not.
            if (this.$scope.itemOfferDetail.EndDate !== undefined && this.$scope.itemOfferDetail.EndDate !== null) {
                if (this.$scope.endTime !== undefined && this.$scope.endTime !== null) {
                    if (this.$scope.startTime !== undefined && this.$scope.startTime !== null) {
                        let isValid = this.checkSellPriceValidOrNot(this.$scope.itemOfferDetail);//to check sell price is valid or not.
                        if (isValid) {
                            if (this.$scope.itemOfferDetail.QuantityLimit > 0) {
                                let validStartDate = true;
                                if (this.$scope.itemOfferDetail.SystemQunatity >= this.$scope.itemOfferDetail.QuantityLimit) {
                                    if (this.$scope.itemOfferDetail.StartDate !== this.$scope.startDateTime) {
                                        let today = new Date();
                                        if (today > this.$scope.itemOfferDetail.StartDate)
                                            validStartDate = false;
                                    }
                                    if (validStartDate) {
                                        this.$scope.itemOfferModel = new Model.ItemOffer();
                                        let dateStartDate = new Date(this.$scope.itemOfferDetail.StartDate);
                                        let dateEndDate = new Date(this.$scope.itemOfferDetail.EndDate);
                                        //to combine date and time
                                        this.$scope.itemOfferModel.StartDateTime = new Date(dateStartDate.getFullYear(), dateStartDate.getMonth(), dateStartDate.getDate(), this.$scope.itemOfferDetail.StartTime.getHours(), this.$scope.itemOfferDetail.StartTime.getMinutes());
                                        //to combine date and time
                                        this.$scope.itemOfferModel.EndDateTime = new Date(dateEndDate.getFullYear(), dateEndDate.getMonth(), dateEndDate.getDate(), this.$scope.itemOfferDetail.EndTime.getHours(), this.$scope.itemOfferDetail.EndTime.getMinutes());
                                        if (this.$scope.itemOfferModel.StartDateTime.getTime() <= this.$scope.itemOfferModel.EndDateTime.getTime()) {
                                            this.$scope.isStartDateHigher = false;
                                            this.$scope.itemOfferModel.Comment = this.$scope.itemOfferDetail.Comments;
                                            this.$scope.itemOfferModel.QuantityLimit = this.$scope.itemOfferDetail.QuantityLimit;
                                            this.$scope.itemOfferModel.SellPrice = this.$scope.itemOfferDetail.NewSellPrice;
                                            this.$scope.itemOfferModel.SellPriceA = this.$scope.itemOfferDetail.NewSellPriceA;
                                            this.$scope.itemOfferModel.SellPriceB = this.$scope.itemOfferDetail.NewSellPriceB;
                                            this.$scope.itemOfferModel.SellPriceC = this.$scope.itemOfferDetail.NewSellPriceC;
                                            this.$scope.itemOfferModel.SellPriceD = this.$scope.itemOfferDetail.NewSellPriceD;
                                            this.$scope.itemOfferModel.Discount = this.$scope.itemOfferDetail.Discount;
                                            this.$scope.itemOfferModel.Id = this.$routeParams.id;
                                            let promise = this.itemOfferService.updateItemOfferDetail(this.$scope.itemOfferModel);
                                            promise.then((result) => {
                                                if (result._isResult === true) {
                                                    this.ngToast.create(stringConstants.updatedItemOffer);
                                                    this.$location.path("/ItemOfferWorkList");
                                                }
                                                else if (result._isResult === "IsNotWorkFlow") {
                                                    this.ngToast.create(
                                                        {
                                                            className: 'danger',
                                                            content: stringConstants.workFlowNotCreated
                                                        });
                                                }
                                                else if (result._isResult === "IsExists") {
                                                    this.ngToast.create(
                                                        {
                                                            className: 'danger',
                                                            content: stringConstants.itemOfferAlreadyExists
                                                        });
                                                }
                                                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                                                    this.ngToast.create(
                                                        {
                                                            className: 'danger',
                                                            content: stringConstants.alreadyActivityDone
                                                        });
                                                }
                                                else {
                                                    //if user is not authenticated that time it will redirect to the login page.
                                                    location.replace(this.apiPath);
                                                }
                                                this.$rootScope.isLoading = false;
                                            }).catch((error) => {
                                                this.$rootScope.isLoading = false;
                                                this.$log.log(error);
                                                if (error.status !== 500) {
                                                    //if user is not authenticated that time it will redirect to the login page.
                                                    location.replace(this.apiPath);
                                                }
                                            });
                                        }
                                        else {
                                            this.$scope.isStartDateHigher = true;
                                        }
                                    }
                                    else {
                                        this.$scope.isNotValidDate = true;
                                        let section_pos = angular.element(".start-date-div").offset();
                                        angular.element('html,body').animate({ scrollTop: section_pos.top - 200 }, 300);
                                    }
                                }
                                else
                                    this.$scope.isNotValidQunatityLimit = true;
                            }
                            else
                                this.$scope.isQunatityLimitGreaterThenZero = true;
                        }
                    }
                    else
                        this.$scope.isStartTime = true;
                }
                else
                    this.$scope.isendTime = true;

            } else
                this.$scope.isendDate = true;

        }
        else
            this.$scope.isStartDate = true;
        this.$rootScope.isLoading = false;
    }

    //this funciton used for redirect to item offer work list. -An
    private cancleButtonEvent() {
        this.$location.path('/ItemOfferWorkList');
    }

    //this functin used for check sell price is valid or not. -An
    private checkSellPriceValidOrNot(itemOfferDetail) {

        if (this.$scope.isOfferCreatedBelowCostPrice)
            return true;
        //to check sell price is valid or not.
        let d = ((itemOfferDetail.CostPrice * itemOfferDetail.MarginProfit) / 100);
        let total = d + itemOfferDetail.CostPrice;
        if (itemOfferDetail.NewSellPrice >= total) {
            if (itemOfferDetail.NewSellPriceA >= total) {

                if (itemOfferDetail.NewSellPriceB >= total) {

                    if (itemOfferDetail.NewSellPriceC >= total) {

                        if (itemOfferDetail.NewSellPriceD >= total) {
                            return true;
                        }
                        else
                            this.$scope.isSellPriceDNotValid = true;
                    }
                    else
                        this.$scope.isSellPriceCNotValid = true;
                }
                else
                    this.$scope.isSellPriceBNotValid = true;
            }
            else
                this.$scope.isSellPriceANotValid = true;
        }
        else
            this.$scope.isSellPriceNotValid = true;
        return false;
    }

    // this function used for chec current sell price is greater than to old price. -An
    private checkSellPriceValidForOldPrice(itemOfferDetail) {
        if (itemOfferDetail.CostPrice < itemOfferDetail.NewSellPrice) {
            if (itemOfferDetail.CostPrice < itemOfferDetail.NewSellPriceA) {

                if (itemOfferDetail.CostPrice < itemOfferDetail.NewSellPriceB) {

                    if (itemOfferDetail.CostPrice < itemOfferDetail.NewSellPriceC) {

                        if (itemOfferDetail.CostPrice < itemOfferDetail.NewSellPriceD) {
                            return true;
                        }
                        else
                            this.$scope.isSellPriceDNotValidForOldPrice = true;
                    }
                    else
                        this.$scope.isSellPriceCNotValidForOldPrice = true;
                }
                else
                    this.$scope.isSellPriceBNotValidForOldPrice = true;
            }
            else
                this.$scope.isSellPriceANotValidForOldPrice = true;
        }
        else
            this.$scope.isSellPriceNotValidForOldPrice = true;
        return false;
    }

    //this funciton used for chnage event for discount. -An
    private changeEventForDiscount() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (controllerScope.itemOfferDetail.Discount >= 0) {
            if (controllerScope.itemOfferDetail.Discount <= 100) {
                let discount = controllerScope.itemOfferDetail.Discount;
                let discountPrice = ((controllerScope.itemOfferDetail.SellPrice * discount) / 100);
                let discountPriceA = ((controllerScope.itemOfferDetail.SellPriceA * discount) / 100);
                let discountPriceB = ((controllerScope.itemOfferDetail.SellPriceB * discount) / 100);
                let discountPriceC = ((controllerScope.itemOfferDetail.SellPriceC * discount) / 100);
                let discountPriceD = ((controllerScope.itemOfferDetail.SellPriceD * discount) / 100);

                if ((controllerScope.itemOfferDetail.SellPrice - discountPrice) >= 0)
                    controllerScope.itemOfferDetail.NewSellPrice = (controllerScope.itemOfferDetail.SellPrice - discountPrice);
                else
                    controllerScope.itemOfferDetail.NewSellPrice = 0;
                if ((controllerScope.itemOfferDetail.SellPriceA - discountPriceA) >= 0)
                    controllerScope.itemOfferDetail.NewSellPriceA = (controllerScope.itemOfferDetail.SellPriceA - discountPriceA);
                else
                    controllerScope.itemOfferDetail.NewSellPriceA = 0;
                if ((controllerScope.itemOfferDetail.SellPriceB - discountPriceB) >= 0)
                    controllerScope.itemOfferDetail.NewSellPriceB = (controllerScope.itemOfferDetail.SellPriceB - discountPriceB);
                else
                    controllerScope.itemOfferDetail.NewSellPriceB = 0;
                if ((controllerScope.itemOfferDetail.SellPriceC - discountPriceC) >= 0)
                    controllerScope.itemOfferDetail.NewSellPriceC = (controllerScope.itemOfferDetail.SellPriceC - discountPriceC);
                else
                    controllerScope.itemOfferDetail.NewSellPriceC = 0;
                if ((controllerScope.itemOfferDetail.SellPriceD - discountPriceD) >= 0)
                    controllerScope.itemOfferDetail.NewSellPriceD = (controllerScope.itemOfferDetail.SellPriceD - discountPriceD);
                else
                    controllerScope.itemOfferDetail.NewSellPriceD = 0;
            }
            else {
                controllerScope.itemOfferDetail.NewSellPrice = 0;
                controllerScope.itemOfferDetail.NewSellPriceA = 0;
                controllerScope.itemOfferDetail.NewSellPriceB = 0;
                controllerScope.itemOfferDetail.NewSellPriceC = 0;
                controllerScope.itemOfferDetail.NewSellPriceD = 0;
                controllerScope.itemOfferDetail.Discount = 0;
            }
            this.changeSellPrice();
        }
    }

    //this function used for get item offer all detail by id. -An
    private isResumeStoped(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.itemOfferService.getItemOfferDetailById(id);
        promise.then((result) => {
            if (!result.IsDeleted) {
                if (result.IsAllowToUpdate && result.IsItemOfferStatusEditPanding) {
                    this.$scope.isDeleted = true;
                    this.$scope.isUpdate = true;
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = false;
                    this.UpdateItemOfferMode(result);
                }
                else if (result.IsAlreadyValidReject) {    //When Already Approve,Reject offer so this conditon is satisfied.
                    this.$scope.isApproveButton = true;
                    this.$scope.isRejectButton = true;
                }
                if (result.IsStoped) {//This condition is setisfied after resume item offer 
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = true;
                    this.$scope.isStopButton = false;
                    this.$scope.isResumeButton = true;
                    this.$scope.isDeleted = true;
                    this.UpdateItemOfferMode(result);
                }
                if (result.IsResume) {//This condition is setisfied after stop item offer 
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = true;
                    this.$scope.isStopButton = true;
                    this.$scope.isResumeButton = false;
                    this.$scope.isDeleted = true;
                    this.UpdateItemOfferMode(result);
                }
                if (result.IsStop) {
                    this.$scope.isAprroveReject = false;
                    this.$scope.isResumeStoped = true;
                    this.$scope.isStopButton = false;
                    this.$scope.isResumeButton = true;
                    this.$scope.isDeleted = true;
                    this.$scope.isUpdateVisible = false;
                    this.UpdateItemOfferMode(result);
                }
                if (!result.IsApprove && !result.IsAlreadyValidReject && !result.IsAllowToUpdate && !result.IsItemOfferStatusEditPanding && !result.IsStoped && !result.IsResume)
                    this.$scope.isAprroveReject = false;
            }
            else {
                this.$scope.isAprroveReject = false;
                this.$scope.isUpdate = false;
                this.$scope.isResumeStoped = false;
                this.$scope.isDeleted = false;
            }

            controllerScope.itemOfferDetail.StartTime = result.StartTime;
            controllerScope.itemOfferDetail.EndTime = result.EndTime;
            controllerScope.itemOfferDetail.ItemNameEn = result.ItemNameEn;
            controllerScope.itemOfferDetail.FlavourEn = result.FlavourEn;
            controllerScope.itemOfferDetail.ItemType = result.ItemType;
            controllerScope.itemOfferDetail.ItemCode = result.ItemCode;
            controllerScope.itemOfferDetail.Barcode = result.Barcode;
            controllerScope.itemOfferDetail.UnitType = result.UnitType;
            controllerScope.itemOfferDetail.UnitCount = result.BaseUnitCount;
            controllerScope.itemOfferDetail.IsOfferItem = result.IsOfferItem;
            controllerScope.itemOfferDetail.SellPrice = result.SellPrice;
            controllerScope.itemOfferDetail.SellPriceA = result.SellPriceA;
            controllerScope.itemOfferDetail.SellPriceB = result.SellPriceB;
            controllerScope.itemOfferDetail.SellPriceC = result.SellPriceC;
            controllerScope.itemOfferDetail.SellPriceD = result.SellPriceD;
            controllerScope.itemOfferDetail.CostPrice = result.CostPrice;
            controllerScope.itemOfferDetail.SystemQunatity = result.SystemQuantity;
            controllerScope.itemOfferDetail.StartDate = result.StartDate;
            controllerScope.itemOfferDetail.EndDate = result.EndDate;
            controllerScope.itemOfferDetail.NewSellPrice = result.NewSellPrice;
            controllerScope.itemOfferDetail.NewSellPriceA = result.NewSellPriceA;
            controllerScope.itemOfferDetail.NewSellPriceB = result.NewSellPriceB;
            controllerScope.itemOfferDetail.NewSellPriceC = result.NewSellPriceC;
            controllerScope.itemOfferDetail.NewSellPriceD = result.NewSellPriceD;
            controllerScope.itemOfferDetail.QuantityLimit = result.QuantityLimit;
            controllerScope.itemOfferDetail.MarginProfit = result.MarginProfit;
            controllerScope.itemOfferDetail.Discount = result.Discount;
            controllerScope.isOfferCreatedBelowCostPrice = result.IsOfferCreatedBelowCostPrice;

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


    private UpdateItemOfferMode(result) {
        this.$scope.isDisableStartDateIcon = false;
        this.$scope.isDisableEndDateIcon = false;
        this.$scope.isSellprice = false;
        this.$scope.isSellpriceA = false;
        this.$scope.isSellpriceB = false;
        this.$scope.isSellpriceC = false;
        this.$scope.isSellpriceD = false;
        this.$scope.isDiscount = false;
        this.$scope.isQuantityLimit = false;
        this.$scope.isEndTimeEditing = false;
        this.$scope.isStartTimeEditing = false;
        this.$scope.isEndDateIcon = false;
        this.$scope.isStartDateIcon = false;
        this.$scope.startTime = new Date("1-11-2015" + " " + result.StartTime);//add tempory date for connvert string to date formate
        this.$scope.endTime = new Date("1-11-2015" + " " + result.EndTime);
    }

    //this method used for approve item offer. -An
    private approveItemOffer() {
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        let promise = this.itemOfferService.approveItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.approveSuccessfully);
                this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

        });
    }

    //this function used for reject item offer. -An
    private rejectItemOffer() {
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        let promise = this.itemOfferService.rejectItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.rejectSuccessfully);
                this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for get action list. -An
    private actionList(itemOfferId) {
        this.$rootScope.isLoading = true;
        let promise = this.itemOfferService.actionList(itemOfferId);
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.actionList.push(result[i]);
                }
            }
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

        });

    }

    //this function used for stopped offer. -An
    private stoppedOffer() {
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        let promise = this.itemOfferService.stopItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.stopItemSuccessfully);
                this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

        });
    }

    //this function used for resume offer. -An
    private resumeOffer() {
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        let promise = this.itemOfferService.resumeItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.resumeItemSuccessfully);
                this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

        });
    }


    private cancelDeleteItemOfferPopup() {
        this.deleteItemOfferDetail.dismiss('cancel');
    }

}

app.controller(ItemOfferDetailsController.controllerId, ['$scope', '$log', '$rootScope', 'itemOfferService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) => {
    return new ItemOfferDetailsController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
}]);
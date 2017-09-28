/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/itemofferservice.ts" />
/// <reference path="../../models/item/itemoffer.ts" />
/// <reference path="../../models/item/workflowforitemoffer.ts" />
var ItemOfferDetailsController = (function () {
    function ItemOfferDetailsController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.itemOfferService = itemOfferService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.$scope.itemOfferDetail = [];
        this.$scope.itemOfferModel = new Model.ItemOffer();
        this.$scope.workFlowLogModel = new Model.WorkFlowForItemOffer();
        this.$scope.approveItemOffer = function () { return _this.approveItemOffer(); };
        this.$scope.rejectItemOffer = function () { return _this.rejectItemOffer(); };
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
        this.$scope.openStartDatePickerDate = function (event) { return _this.openStartDatePickerDate(event); };
        this.$scope.openEndDatePickerDate = function (event) { return _this.openEndDatePickerDate(event); };
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
        this.$scope.updateItemOffer = function () { return _this.updateItemOffer(); };
        this.$scope.cancleButtonEvent = function () { return _this.cancleButtonEvent(); };
        this.$scope.isEndDateIcon = true;
        this.$scope.isStartDateIcon = true;
        this.$scope.isApproveButton = false;
        this.$scope.isRejectButton = false;
        this.$scope.isUpdate = false;
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.startDateTime = new Date();
        this.$scope.isResumeStoped = false;
        this.$scope.stoppedOffer = function () { return _this.stoppedOffer(); };
        this.$scope.resumeOffer = function () { return _this.resumeOffer(); };
        this.$scope.changeEventForDiscount = function () { return _this.changeEventForDiscount(); };
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
        this.$scope.deleteButtonClick = function () { return _this.deleteButtonClick(); };
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
        this.$scope.changeSellPrice = function () { return _this.changeSellPrice(); };
        this.$scope.deleteItemOffer = function () { return _this.deleteItemOffer(); };
        this.$scope.cancelDeleteItemOfferPopup = function () { return _this.cancelDeleteItemOfferPopup(); };
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
    ItemOfferDetailsController.prototype.initialization = function () {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getItemOfferAllDetail(this.$routeParams.id);
            this.actionList(this.$routeParams.id);
        }
    };
    //this function used for get item offer all detail by id. -An
    ItemOfferDetailsController.prototype.getItemOfferAllDetail = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.itemOfferService.getItemOfferDetailById(id);
        promise.then(function (result) {
            if (!result.IsDeleted) {
                if (result.IsAllowToUpdate && result.IsItemOfferStatusEditPanding) {
                    //this.$scope.isDeleted = true;
                    _this.$scope.isUpdate = true;
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = false;
                    _this.UpdateItemOfferMode(result);
                }
                else if (result.IsAlreadyValidReject) {
                    _this.$scope.isApproveButton = true;
                    _this.$scope.isRejectButton = true;
                }
                if (result.IsStoped) {
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = true;
                    _this.$scope.isStopButton = false;
                    _this.$scope.isResumeButton = true;
                    _this.$scope.isDeleted = true;
                    _this.UpdateItemOfferMode(result);
                }
                if (result.IsResume) {
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = true;
                    _this.$scope.isStopButton = true;
                    _this.$scope.isResumeButton = false;
                    _this.$scope.isDeleted = true;
                    _this.UpdateItemOfferMode(result);
                }
                if (result.IsStop) {
                    _this.$scope.isUpdateVisible = false;
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = true;
                    _this.$scope.isStopButton = false;
                    _this.$scope.isResumeButton = true;
                    _this.$scope.isDeleted = true;
                    _this.UpdateItemOfferMode(result);
                }
                if (!result.IsApprove && !result.IsAlreadyValidReject && !result.IsAllowToUpdate && !result.IsItemOfferStatusEditPanding && !result.IsStoped && !result.IsResume)
                    _this.$scope.isAprroveReject = false;
            }
            else {
                _this.$scope.isAprroveReject = false;
                _this.$scope.isUpdate = false;
                _this.$scope.isResumeStoped = false;
                _this.$scope.isDeleted = false;
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemOfferDetailsController.prototype.deleteButtonClick = function () {
        this.deleteItemOfferDetail = this.$modal.open({
            templateUrl: 'deleteItemOffer',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    ItemOfferDetailsController.prototype.deleteItemOffer = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        var promise = this.itemOfferService.deletedItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.deleteItemSuceessfully);
                _this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
        this.cancelDeleteItemOfferPopup();
    };
    ItemOfferDetailsController.prototype.changeSellPrice = function () {
        var controllerScope = this.$scope;
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
            var isValid = this.AllowSellPriceLowerMarginProfit();
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
    };
    ItemOfferDetailsController.prototype.AllowSellPriceLowerMarginProfit = function () {
        var controllerScope = this.$scope;
        var valid = true;
        //to check sell price is valid or not.
        var d = ((controllerScope.itemOfferDetail.CostPrice * controllerScope.itemOfferDetail.MarginProfit) / 100);
        var total = d + controllerScope.itemOfferDetail.CostPrice;
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
    };
    //this method used for Start Date Picker -An
    ItemOfferDetailsController.prototype.openStartDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    };
    //this method used for end date Picker -An
    ItemOfferDetailsController.prototype.openEndDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    };
    //this function used for update item offer. -An
    ItemOfferDetailsController.prototype.updateItemOffer = function () {
        var _this = this;
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
        var itemOfferDetail = this.$scope.itemOfferDetail;
        this.$scope.itemOfferDetail.StartTime = this.$scope.startTime;
        this.$scope.itemOfferDetail.EndTime = this.$scope.endTime;
        if (this.$scope.itemOfferDetail.StartDate !== undefined && this.$scope.itemOfferDetail.StartDate !== null) {
            if (this.$scope.itemOfferDetail.EndDate !== undefined && this.$scope.itemOfferDetail.EndDate !== null) {
                if (this.$scope.endTime !== undefined && this.$scope.endTime !== null) {
                    if (this.$scope.startTime !== undefined && this.$scope.startTime !== null) {
                        var isValid = this.checkSellPriceValidOrNot(this.$scope.itemOfferDetail); //to check sell price is valid or not.
                        if (isValid) {
                            if (this.$scope.itemOfferDetail.QuantityLimit > 0) {
                                var validStartDate = true;
                                if (this.$scope.itemOfferDetail.SystemQunatity >= this.$scope.itemOfferDetail.QuantityLimit) {
                                    if (this.$scope.itemOfferDetail.StartDate !== this.$scope.startDateTime) {
                                        var today = new Date();
                                        if (today > this.$scope.itemOfferDetail.StartDate)
                                            validStartDate = false;
                                    }
                                    if (validStartDate) {
                                        this.$scope.itemOfferModel = new Model.ItemOffer();
                                        var dateStartDate = new Date(this.$scope.itemOfferDetail.StartDate);
                                        var dateEndDate = new Date(this.$scope.itemOfferDetail.EndDate);
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
                                            var promise = this.itemOfferService.updateItemOfferDetail(this.$scope.itemOfferModel);
                                            promise.then(function (result) {
                                                if (result._isResult === true) {
                                                    _this.ngToast.create(stringConstants.updatedItemOffer);
                                                    _this.$location.path("/ItemOfferWorkList");
                                                }
                                                else if (result._isResult === "IsNotWorkFlow") {
                                                    _this.ngToast.create({
                                                        className: 'danger',
                                                        content: stringConstants.workFlowNotCreated
                                                    });
                                                }
                                                else if (result._isResult === "IsExists") {
                                                    _this.ngToast.create({
                                                        className: 'danger',
                                                        content: stringConstants.itemOfferAlreadyExists
                                                    });
                                                }
                                                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                                                    _this.ngToast.create({
                                                        className: 'danger',
                                                        content: stringConstants.alreadyActivityDone
                                                    });
                                                }
                                                else {
                                                    //if user is not authenticated that time it will redirect to the login page.
                                                    location.replace(_this.apiPath);
                                                }
                                                _this.$rootScope.isLoading = false;
                                            }).catch(function (error) {
                                                _this.$rootScope.isLoading = false;
                                                _this.$log.log(error);
                                                if (error.status !== 500) {
                                                    //if user is not authenticated that time it will redirect to the login page.
                                                    location.replace(_this.apiPath);
                                                }
                                            });
                                        }
                                        else {
                                            this.$scope.isStartDateHigher = true;
                                        }
                                    }
                                    else {
                                        this.$scope.isNotValidDate = true;
                                        var section_pos = angular.element(".start-date-div").offset();
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
            }
            else
                this.$scope.isendDate = true;
        }
        else
            this.$scope.isStartDate = true;
        this.$rootScope.isLoading = false;
    };
    //this funciton used for redirect to item offer work list. -An
    ItemOfferDetailsController.prototype.cancleButtonEvent = function () {
        this.$location.path('/ItemOfferWorkList');
    };
    //this functin used for check sell price is valid or not. -An
    ItemOfferDetailsController.prototype.checkSellPriceValidOrNot = function (itemOfferDetail) {
        if (this.$scope.isOfferCreatedBelowCostPrice)
            return true;
        //to check sell price is valid or not.
        var d = ((itemOfferDetail.CostPrice * itemOfferDetail.MarginProfit) / 100);
        var total = d + itemOfferDetail.CostPrice;
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
    };
    // this function used for chec current sell price is greater than to old price. -An
    ItemOfferDetailsController.prototype.checkSellPriceValidForOldPrice = function (itemOfferDetail) {
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
    };
    //this funciton used for chnage event for discount. -An
    ItemOfferDetailsController.prototype.changeEventForDiscount = function () {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (controllerScope.itemOfferDetail.Discount >= 0) {
            if (controllerScope.itemOfferDetail.Discount <= 100) {
                var discount = controllerScope.itemOfferDetail.Discount;
                var discountPrice = ((controllerScope.itemOfferDetail.SellPrice * discount) / 100);
                var discountPriceA = ((controllerScope.itemOfferDetail.SellPriceA * discount) / 100);
                var discountPriceB = ((controllerScope.itemOfferDetail.SellPriceB * discount) / 100);
                var discountPriceC = ((controllerScope.itemOfferDetail.SellPriceC * discount) / 100);
                var discountPriceD = ((controllerScope.itemOfferDetail.SellPriceD * discount) / 100);
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
    };
    //this function used for get item offer all detail by id. -An
    ItemOfferDetailsController.prototype.isResumeStoped = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.itemOfferService.getItemOfferDetailById(id);
        promise.then(function (result) {
            if (!result.IsDeleted) {
                if (result.IsAllowToUpdate && result.IsItemOfferStatusEditPanding) {
                    _this.$scope.isDeleted = true;
                    _this.$scope.isUpdate = true;
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = false;
                    _this.UpdateItemOfferMode(result);
                }
                else if (result.IsAlreadyValidReject) {
                    _this.$scope.isApproveButton = true;
                    _this.$scope.isRejectButton = true;
                }
                if (result.IsStoped) {
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = true;
                    _this.$scope.isStopButton = false;
                    _this.$scope.isResumeButton = true;
                    _this.$scope.isDeleted = true;
                    _this.UpdateItemOfferMode(result);
                }
                if (result.IsResume) {
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = true;
                    _this.$scope.isStopButton = true;
                    _this.$scope.isResumeButton = false;
                    _this.$scope.isDeleted = true;
                    _this.UpdateItemOfferMode(result);
                }
                if (result.IsStop) {
                    _this.$scope.isAprroveReject = false;
                    _this.$scope.isResumeStoped = true;
                    _this.$scope.isStopButton = false;
                    _this.$scope.isResumeButton = true;
                    _this.$scope.isDeleted = true;
                    _this.$scope.isUpdateVisible = false;
                    _this.UpdateItemOfferMode(result);
                }
                if (!result.IsApprove && !result.IsAlreadyValidReject && !result.IsAllowToUpdate && !result.IsItemOfferStatusEditPanding && !result.IsStoped && !result.IsResume)
                    _this.$scope.isAprroveReject = false;
            }
            else {
                _this.$scope.isAprroveReject = false;
                _this.$scope.isUpdate = false;
                _this.$scope.isResumeStoped = false;
                _this.$scope.isDeleted = false;
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemOfferDetailsController.prototype.UpdateItemOfferMode = function (result) {
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
        this.$scope.startTime = new Date("1-11-2015" + " " + result.StartTime); //add tempory date for connvert string to date formate
        this.$scope.endTime = new Date("1-11-2015" + " " + result.EndTime);
    };
    //this method used for approve item offer. -An
    ItemOfferDetailsController.prototype.approveItemOffer = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        var promise = this.itemOfferService.approveItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.approveSuccessfully);
                _this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for reject item offer. -An
    ItemOfferDetailsController.prototype.rejectItemOffer = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        var promise = this.itemOfferService.rejectItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.rejectSuccessfully);
                _this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for get action list. -An
    ItemOfferDetailsController.prototype.actionList = function (itemOfferId) {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.itemOfferService.actionList(itemOfferId);
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.actionList.push(result[i]);
                }
            }
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for stopped offer. -An
    ItemOfferDetailsController.prototype.stoppedOffer = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        var promise = this.itemOfferService.stopItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.stopItemSuccessfully);
                _this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for resume offer. -An
    ItemOfferDetailsController.prototype.resumeOffer = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.workFlowLogModel.ItemOfferId = this.$routeParams.id;
        this.$scope.workFlowLogModel.Comment = this.$scope.itemOfferDetail.Comments;
        var promise = this.itemOfferService.resumeItemOfferRequest(this.$scope.workFlowLogModel);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.resumeItemSuccessfully);
                _this.$location.path('/ItemOfferWorkList');
            }
            else if (result._isResult === "IsNotWorkFlow") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemOfferDetailsController.prototype.cancelDeleteItemOfferPopup = function () {
        this.deleteItemOfferDetail.dismiss('cancel');
    };
    return ItemOfferDetailsController;
}());
ItemOfferDetailsController.controllerId = "itemOfferDetailsController";
app.controller(ItemOfferDetailsController.controllerId, ['$scope', '$log', '$rootScope', 'itemOfferService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        return new ItemOfferDetailsController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=itemOfferDetailsController.js.map
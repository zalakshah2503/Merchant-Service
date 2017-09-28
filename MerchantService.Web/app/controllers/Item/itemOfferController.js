/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/itemofferservice.ts" />
/// <reference path="../../models/item/itemoffer.ts" />
var ItemOfferController = (function () {
    function ItemOfferController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
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
        this.$scope.searchEvent = function () { return _this.searchEvent(); };
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        this.$scope.itemOfferModel = new Model.ItemOffer();
        this.$scope.branchList = [];
        this.$scope.openStartDatePickerDate = function (event) { return _this.openStartDatePickerDate(event); };
        this.$scope.openEndDatePickerDate = function (event) { return _this.openEndDatePickerDate(event); };
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.viewItemDetail = function (id) { return _this.viewItemDetail(id); };
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
        this.$scope.clickOnClose = function () { return _this.clickOnClose(); };
        this.$scope.submitItemOffer = function () { return _this.submitItemOffer(); };
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
        this.$scope.updateSellPrice = function () { return _this.updateSellPrice(); };
        this.$scope.openItemListPopup = function () { return _this.openItemListPopup(); };
        this.$scope.cancelButtonForItemPopup = function () { return _this.cancelButtonForItemPopup(); };
        this.$scope.cancleButtonEvent = function () { return _this.cancleButtonEvent(); };
        this.$scope.isNotValidQunatityLimit = false;
        this.$scope.qunatityLimitNotValid = stringConstants.notValidQunatityLimit;
        this.$scope.errorMessageList = [];
        this.$scope.changeInitiateDropDown = function () { return _this.changeInitiateDropDown(); };
        this.$scope.changeSellPrice = function () { return _this.changeSellPrice(); };
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
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.itemProfileCollection.slice(begin, end);
        });
        this.initialization();
    }
    //this function used initializion -An
    ItemOfferController.prototype.initialization = function () {
        this.getItemProfileList();
        this.getBranchList();
    };
    //this function used for open popup for change main item. -An
    ItemOfferController.prototype.openItemListPopup = function () {
        this.itemListPopup = this.$modal.open({
            templateUrl: 'itemListPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'itemCollectionController',
            scope: this.$scope,
        });
    };
    ItemOfferController.prototype.changeSellPrice = function () {
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
    };
    ItemOfferController.prototype.AllowSellPriceLowerMarginProfit = function () {
        var controllerScope = this.$scope;
        var valid = true;
        //to check sell price is valid or not.
        var d = ((controllerScope.costPrice * controllerScope.marginProfit) / 100);
        var total = d + controllerScope.costPrice;
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
    };
    ItemOfferController.prototype.clickOnClose = function () {
        angular.element('.modal-backdrop').removeClass('in');
        angular.element('.modal').removeClass('in');
        this.itemOfferResponse.dismiss('cancel');
        this.$scope.isItemDetails = false;
        var controllerScope = this.$scope;
        controllerScope.itemOfferModel = new Model.ItemOffer();
        controllerScope.itemOffer.$setPristine();
        controllerScope.itemOffer.$setValidity();
        controllerScope.itemOffer.$setUntouched();
        this.$location.path('/ItemOfferWorkList');
    };
    ItemOfferController.prototype.changeInitiateDropDown = function () {
        if (+this.$scope.itemOfferModel.intiatedId === 1)
            this.$scope.isSupplierDisplay = true;
        else {
            this.$scope.itemOfferModel.SupplierId = undefined;
            this.$scope.isSupplierDisplay = false;
        }
    };
    //this funciton used update Sell Price -An
    ItemOfferController.prototype.updateSellPrice = function () {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (controllerScope.itemOfferModel.Discount >= 0) {
            if (controllerScope.itemOfferModel.Discount <= 100) {
                var discount = controllerScope.itemOfferModel.Discount;
                var discountPrice = ((controllerScope.sellPrice * discount) / 100);
                var discountPriceA = ((controllerScope.sellPriceA * discount) / 100);
                var discountPriceB = ((controllerScope.sellPriceB * discount) / 100);
                var discountPriceC = ((controllerScope.sellPriceC * discount) / 100);
                var discountPriceD = ((controllerScope.sellPriceD * discount) / 100);
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
    };
    //this function used for get item profile list -An
    ItemOfferController.prototype.getItemProfileList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var itemProfileList = controllerScope.itemProfileCollection;
        var promise = this.itemOfferService.getItemProfileList();
        promise.then(function (result) {
            if (result.length > 0) {
                controllerScope.isItemGrid = true;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].IsActive)
                        result[i].IsActive = stringConstants.yes;
                    else
                        result[i].IsActive = stringConstants.no;
                    if (result[i].listOfChildProfileAC !== null && result[i].listOfChildProfileAC !== undefined) {
                        for (var j = 0; j < result[i].listOfChildProfileAC.length; j++) {
                            if (result[i].listOfChildProfileAC[j].IsActive)
                                result[i].listOfChildProfileAC[j].IsActive = stringConstants.yes;
                            else
                                result[i].listOfChildProfileAC[j].IsActive = stringConstants.no;
                        }
                    }
                    itemProfileList.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = itemProfileList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.itemProfileCollection.length;
                controllerScope.totalItemProfileCollection = _this.$scope.itemProfileCollection;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isItemGrid = false;
            }
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this funciton used for submit item offer. -An
    ItemOfferController.prototype.submitItemOffer = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (!controllerScope.isFirstClick) {
            controllerScope.isDataLoading = true;
            controllerScope.isFirstClick = true;
            var isValidForSupplier = true;
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
                if (controllerScope.StartDate !== undefined && controllerScope.StartDate !== null) {
                    if (controllerScope.EndDate !== undefined && controllerScope.EndDate !== null) {
                        if (controllerScope.endTime !== undefined && controllerScope.endTime !== null) {
                            if (controllerScope.startTime !== undefined && controllerScope.startTime !== null) {
                                var isValid = this.checkSellPriceValidOrNot(controllerScope.itemOfferModel); //to checsell price is valid or not.
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
                                                var promise = this.itemOfferService.insertItemOffer(controllerScope.itemOfferModel);
                                                promise.then(function (result) {
                                                    if (result._isResult.length > 0) {
                                                        for (var i = 0; i < result._isResult.length; i++) {
                                                            _this.$scope.errorMessageList.push(result._isResult[i]);
                                                        }
                                                        _this.itemOfferResponse = _this.$modal.open({
                                                            templateUrl: 'itemOfferMessage',
                                                            backdrop: 'static',
                                                            keyboard: true,
                                                            size: 'md',
                                                            scope: _this.$scope,
                                                        });
                                                    }
                                                }).catch(function (error) {
                                                    controllerScope.isDataLoading = false;
                                                    _this.$log.log(error);
                                                    if (error.status !== 500) {
                                                        //if user is not authenticated that time it will redirect to the login page.
                                                        location.replace(_this.apiPath);
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
                    }
                    else
                        controllerScope.isendDate = true;
                }
                else
                    controllerScope.isStartDate = true;
            }
            else
                controllerScope.isSupplierRequired = true;
            controllerScope.isFirstClick = false;
        }
        controllerScope.isDataLoading = false;
    };
    //this function used for dispaly item detail. -An
    ItemOfferController.prototype.viewItemDetail = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isQunatityLimitGreaterThenZero = false;
        controllerScope.isDataLoading = true;
        controllerScope.itemOfferModel.ItemId = id;
        this.$scope.isItemDetails = true;
        this.getSupplierList(id);
        var promise = this.itemOfferService.getItemProfileObjectById(id);
        promise.then(function (result) {
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
            _this.itemListPopup.dismiss('cancel');
        });
    };
    ItemOfferController.prototype.getSupplierList = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope; //To get branch list
        var promise = this.itemOfferService.getSupplierListByItemId(id);
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn });
                }
                controllerScope.isDataLoading = false;
            }
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this functin used for check sell price is valid or not. -An
    ItemOfferController.prototype.checkSellPriceValidOrNot = function (itemOffer) {
        var controllerScope = this.$scope;
        if (controllerScope.isOfferCreatedBelowCostPrice)
            return true;
        //to check sell price is valid or not.
        var d = ((controllerScope.costPrice * controllerScope.marginProfit) / 100);
        var total = d + controllerScope.costPrice;
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
    };
    // this function used for chec current sell price is greater than to old price. -An
    ItemOfferController.prototype.checkSellPriceValidForOldPrice = function (itemOffer) {
        var controllerScope = this.$scope;
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
    };
    //This funciton used for search funcitonality. -An
    ItemOfferController.prototype.searchEvent = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.errorMessageDisplayForBlankList = false;
        //create sub Item Search List;
        var subItemSearch = [];
        if (controllerScope.totalItemProfileCollection.length > 0) {
            for (var i = 0; i < controllerScope.totalItemProfileCollection.length; i++) {
                if (controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== null && controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== undefined) {
                    for (var j = 0; j < controllerScope.totalItemProfileCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.totalItemProfileCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }
        var searching = this.filterFilter((subItemSearch), controllerScope.search);
        this.$scope.itemProfileCollection = this.filterFilter((controllerScope.totalItemProfileCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (this.$scope.itemProfileCollection === 0 && searching === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
            controllerScope.isItemGrid = false;
        }
        else if (this.$scope.itemProfileCollection !== 0) {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = this.$scope.itemProfileCollection.slice(begin, end);
            controllerScope.totalItems = this.$scope.itemProfileCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
            controllerScope.isItemGrid = true;
        }
        else {
            for (var i = 0; i < controllerScope.itemProfileCollection.length; i++) {
                for (var j = 0; j < searching.length; j++) {
                    if (controllerScope.itemProfileCollection[i].Id === searching[j].ParentItemId) {
                        var isAlreadyExists = true;
                        for (var k = 0; k < controllerScope.itemProfileCollection.length; k++) {
                            if (controllerScope.itemProfileCollection[k].Id === controllerScope.itemProfileCollection[i].Id)
                                isAlreadyExists = false;
                        }
                        if (isAlreadyExists)
                            this.$scope.itemProfileCollection.push(controllerScope.itemProfileCollection[i]);
                    }
                }
            }
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = this.$scope.itemProfileCollection.slice(begin, end);
            controllerScope.totalItems = this.$scope.itemProfileCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
            controllerScope.isItemGrid = true;
            controllerScope.search = [];
        }
        controllerScope.search = [];
    };
    //This function used for get sub item list. -An
    ItemOfferController.prototype.getSubItemList = function (parentId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        var getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {
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
    };
    //this funciton used for get branch list -An
    ItemOfferController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope; //To get branch list
        var promise = this.itemOfferService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerScope.isDataLoading = false;
            }
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this method used for Start Date Picker -An
    ItemOfferController.prototype.openStartDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    };
    //this method used for end date Picker -An
    ItemOfferController.prototype.openEndDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    };
    //This funciton used for cancel button for Item Popup. -An 
    ItemOfferController.prototype.cancelButtonForItemPopup = function () {
        this.itemListPopup.dismiss('cancel');
    };
    ItemOfferController.prototype.cancleButtonEvent = function () {
        this.$scope.isItemDetails = false;
        var controllerScope = this.$scope;
        controllerScope.itemOfferModel = new Model.ItemOffer();
        controllerScope.itemOffer.$setPristine();
        controllerScope.itemOffer.$setValidity();
        controllerScope.itemOffer.$setUntouched();
        this.$scope.StartDate = null;
        this.$scope.EndDate = null;
    };
    return ItemOfferController;
}());
ItemOfferController.controllerId = "itemOfferController";
app.controller(ItemOfferController.controllerId, ['$scope', '$log', '$rootScope', 'itemOfferService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        return new ItemOfferController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=itemOfferController.js.map
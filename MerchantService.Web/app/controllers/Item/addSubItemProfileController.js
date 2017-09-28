/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
var AddSubItemProfileController = (function () {
    function AddSubItemProfileController($scope, $log, $rootScope, addNewItemProfileService, userAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, $routeParams, filterFilter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.addNewItemProfileService = addNewItemProfileService;
        this.userAccessService = userAccessService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.$routeParams = $routeParams;
        this.filterFilter = filterFilter;
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
        this.$scope.submitNewSubItem = function (addNewItemProfile, isAdd) { return _this.submitNewSubItem(addNewItemProfile, isAdd); };
        this.$scope.cancelButtonEvent = function () { return _this.cancleButtonEvent(); };
        this.$scope.openConvertMainItemPopup = function () { return _this.openConvertMainItemPopup(); };
        this.$scope.convertToMainItem = function () { return _this.convertMainItem(); };
        this.$scope.openChangeMainItem = function () { return _this.openChangeMainItem(); };
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
        this.$scope.cancelConvertMainItemPopup = function () { return _this.cancelConvertMainItemPopup(); };
        this.$scope.cancelButtonForChangeMainItem = function () { return _this.cancelButtonForChangeMainItem(); };
        this.$scope.supplierList = [];
        this.$scope.openAutomaticPOPopup = function () { return _this.openAutomaticPOPopup(); };
        this.$scope.closeAutomaticPOPopup = function () { return _this.closeAutomaticPOPopup(); };
        this.$scope.itemProfileErrorMessageDisplay = true;
        this.$scope.clickOnSelectLinkForChangeMainItem = function (id) { return _this.clickOnSelectLinkForChangeMainItem(id); };
        this.$scope.marginProfit = 0;
        this.$scope.subItemPageHeader = "";
        this.$scope.companyBarcodeButtonText = stringConstants.genrateCompanyBarcode;
        this.$scope.GenrateBarcode = function () { return _this.GenrateBarcode(); };
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
    AddSubItemProfileController.prototype.initialize = function () {
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
    };
    AddSubItemProfileController.prototype.GenrateBarcode = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
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
                var promise = this.addNewItemProfileService.genrateBarcode();
                promise.then(function (result) {
                    if (result._isResult !== null) {
                        _this.$scope.addNewItemProfile.Barcode = result._isResult;
                        _this.$scope.isBarcodeDisabled = true;
                        _this.$scope.companyBarcodeButtonText = stringConstants.clearCompanyBarcode;
                        _this.$scope.addNewItemProfile.IsCompanyBarcode = true;
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.companyBarcodeNotGernated
                        });
                    }
                    controllerRootScope.isLoading = false;
                });
            }
        }
        else {
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.barcodeIsNotEditable
            });
            controllerRootScope.isLoading = false;
        }
    };
    AddSubItemProfileController.prototype.getAllInitiatorOfSpo = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.initiatorOfSpoCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.addNewItemProfileService.getAllInitiatorOfSpo();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.initiatorOfSpoCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
        })
            .catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this funciton used for get unit type.  -An
    AddSubItemProfileController.prototype.getUnitTypeList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        var promise = this.addNewItemProfileService.getUnitList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //When click on edit link for sub items this function will call for binding data. -An
    AddSubItemProfileController.prototype.EditSubItem = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
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
        var promise = this.addNewItemProfileService.getItemDetailById(id);
        promise.then(function (result) {
            if (result !== null) {
                controllerScope.addNewItemProfile = result;
                controllerScope.itemType = result.Category.BrandParamType.ValueEn + "-" + result.Category.GroupParamType.ValueEn;
            }
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
    //this function used for open the Convert to main item popup. -An
    AddSubItemProfileController.prototype.openConvertMainItemPopup = function () {
        this.convertMainItemPopup = this.$modal.open({
            templateUrl: 'convertToMainItemPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    //this funciton used for close convert to main item popup. -An
    AddSubItemProfileController.prototype.cancelConvertMainItemPopup = function () {
        this.convertMainItemPopup.dismiss('cancel');
    };
    //this function used for open popup for change main item. -An
    AddSubItemProfileController.prototype.openChangeMainItem = function () {
        this.changeMainItemPopup = this.$modal.open({
            templateUrl: 'changeMainItem',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'itemProfileListController',
            scope: this.$scope,
        });
    };
    //this funciton used for close change main item popup. -An
    AddSubItemProfileController.prototype.cancelButtonForChangeMainItem = function () {
        this.changeMainItemPopup.dismiss('cancel');
    };
    //this funciton used for bind add data sub item page and diable some text box.  -An
    AddSubItemProfileController.prototype.binDataInAddSubItemPage = function (parentsId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        var promise = this.addNewItemProfileService.getItemProfileObjectById(parentsId);
        promise.then(function (result) {
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
                _this.$scope.marginProfit = result.ProfitMargin;
                controllerScope.addNewItemProfile.IsActive = result.IsActive;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for submit new subItem. -An
    AddSubItemProfileController.prototype.submitNewSubItem = function (addNewItemProfile, isAdd) {
        var _this = this;
        if (!this.$scope.isFirstClick) {
            this.$scope.isFirstClick = true;
            var controllerScope_1 = this.$scope;
            var controllerRootScope_1 = this.$rootScope;
            controllerRootScope_1.isLoading = true;
            controllerScope_1.isSellPriceNotValid = false;
            controllerScope_1.isBarCodeNotValid = false;
            controllerScope_1.isSellPriceANotValid = false;
            controllerScope_1.isSellPriceBNotValid = false;
            controllerScope_1.isSellPriceCNotValid = false;
            controllerScope_1.isSellPriceDNotValid = false;
            controllerScope_1.isItemCodeExists = false;
            controllerScope_1.isbarcodeExists = false;
            if (isAdd) {
                //to check sell price is valid or not.
                var d = ((parseFloat(addNewItemProfile.CostPrice) * parseFloat(addNewItemProfile.ProfitMargin)) / 100);
                var total = d + parseFloat(addNewItemProfile.CostPrice);
                var isCheckValidSellPrice = this.checkValidSellPriceOrNot(addNewItemProfile, total);
                if (isCheckValidSellPrice) {
                    addNewItemProfile.IsParentItem = false;
                    var promise = this.addNewItemProfileService.insertSubItem(addNewItemProfile);
                    promise.then(function (result) {
                        if (result._isResult.NormalBarcodeFrom === undefined && result._isResult.NormalBarcodeTo === undefined) {
                            if (result._isResult !== 0) {
                                if (result._isResult !== -2) {
                                    _this.ngToast.create(stringConstants.addedSubItem);
                                    _this.$location.path('/ItemProfile');
                                }
                                else
                                    controllerScope_1.isItemCodeExists = true;
                            }
                            else
                                controllerScope_1.isbarcodeExists = true;
                        }
                        else {
                            _this.$scope.barCodeNotValid = _this.$scope.barCodeNotValid.replace("{{BalnceBarcoedFrom}}", result._isResult.NormalBarcodeFrom).replace("{{BalnceBarcoedTo}}", result._isResult.NormalBarcodeTo);
                            _this.$scope.isBarCodeNotValid = true;
                        }
                        controllerRootScope_1.isLoading = false;
                    }).catch(function (error) {
                        controllerRootScope_1.isLoading = false;
                        _this.$log.log(error);
                        if (error.status !== 500) {
                            //if user is not authenticated that time it will redirect to the login page.
                            location.replace(_this.apiPath);
                        }
                    });
                }
            }
            else {
                var promise = this.addNewItemProfileService.updateSubItem(addNewItemProfile);
                promise.then(function (result) {
                    if ((result._isResult.BalanceBarcodeFrom === undefined || result._isResult.BalanceBarcodeFrom === null) && (result._isResult.BalanceBarcodeTo === undefined || result._isResult.BalanceBarcodeTo === null)) {
                        if (result._isResult !== 0) {
                            if (result._isResult !== -2) {
                                if (result._isResult !== -3) {
                                    if (result._isResult !== -4) {
                                        _this.ngToast.create(stringConstants.updateSubItemProfileSucessfully);
                                        _this.$location.path('/ItemProfile');
                                    }
                                    else {
                                        _this.ngToast.create({
                                            className: 'danger',
                                            content: stringConstants.issueInventoryUpdatedItem
                                        });
                                    }
                                }
                                else {
                                    _this.ngToast.create({
                                        className: 'danger',
                                        content: stringConstants.itemProfileNotCreatedBecauseICRGenrated
                                    });
                                }
                            }
                            else
                                controllerScope_1.isItemCodeExists = true;
                        }
                        else
                            controllerScope_1.isbarcodeExists = true;
                    }
                    else {
                        _this.$scope.barCodeNotValid = _this.$scope.barCodeNotValid.replace("{{BalnceBarcoedFrom}}", result._isResult.BalanceBarcodeFrom).replace("{{BalnceBarcoedTo}}", result._isResult.BalanceBarcodeTo);
                        _this.$scope.isBarCodeNotValid = true;
                    }
                    controllerRootScope_1.isLoading = false;
                }).catch(function (error) {
                    controllerRootScope_1.isLoading = false;
                    _this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(_this.apiPath);
                    }
                });
            }
            this.$scope.isFirstClick = false;
            controllerRootScope_1.isLoading = false;
        }
    };
    AddSubItemProfileController.prototype.checkValidSellPriceOrNot = function (addNewItemProfile, total) {
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
    };
    //this funciton used for change main Item
    AddSubItemProfileController.prototype.clickOnSelectLinkForChangeMainItem = function (id) {
        var _this = this;
        var controllerscope = this.$scope;
        var controllerrootscope = this.$rootScope;
        controllerrootscope.isloading = true;
        var promise = this.addNewItemProfileService.changeMainItem(id, this.$routeParams.id);
        promise.then(function (result) {
            _this.changeMainItemPopup.dismiss('cancel');
            _this.ngToast.create(stringConstants.changeMainItem);
            _this.$location.path('/ItemProfile');
        }).catch(function (error) {
            controllerrootscope.isloading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for cancle button event. -An
    AddSubItemProfileController.prototype.cancleButtonEvent = function () {
        this.$location.path('/ItemProfile');
    };
    //this function used for Convert To Main Item -An 
    AddSubItemProfileController.prototype.convertMainItem = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.addNewItemProfileService.convertToMainItem(controllerScope.addNewItemProfile.Id);
        promise.then(function (result) {
            if (result._isResult !== 0) {
                _this.convertMainItemPopup.dismiss('cancel');
                _this.ngToast.create(stringConstants.convertSubItemToMainItemSuccessfully);
                _this.$location.path('/ItemProfile');
            }
        });
    };
    // used for opening the AutomaticPOPopup-jj
    AddSubItemProfileController.prototype.openAutomaticPOPopup = function () {
        var controllerScope = this.$scope;
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
            }
            else {
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
    };
    //used for closing  the AutomaticPOPopup-jj
    AddSubItemProfileController.prototype.closeAutomaticPOPopup = function () {
        var controllerScope = this.$scope;
        this.automaticPOPopup.dismiss('cancel');
        controllerScope.addNewItemProfile.IsAutomaticPO = false;
    };
    // used to fetch supplier list - jj
    AddSubItemProfileController.prototype.getSupplierList = function () {
        var controllerScope = this.$scope;
        //if (controllerScope.supplierList.length > 0) {
        //}
        //else {
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.addNewItemProfileService.getSupplierList(controllerScope.addNewItemProfile.CategoryId);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
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
    };
    return AddSubItemProfileController;
}());
AddSubItemProfileController.controllerId = "addSubItemProfileController";
app.controller(AddSubItemProfileController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'UserAccessService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', '$routeParams', 'filterFilter', function ($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, $routeParams, filterFilter) {
        return new AddSubItemProfileController($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, $routeParams, filterFilter);
    }]);
//# sourceMappingURL=addSubItemProfileController.js.map
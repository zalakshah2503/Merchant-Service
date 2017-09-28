/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../models/item/addnewitemprofile.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
/// <reference path="../../services/item/categoryservice.ts" />
var AddNewItemProfileController = (function () {
    function AddNewItemProfileController($scope, $log, $rootScope, addNewItemProfileService, categoryService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.addNewItemProfileService = addNewItemProfileService;
        this.categoryService = categoryService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.itemTypePopup = function () { return _this.itemTypePopup(); };
        this.$scope.branchList = [];
        this.$scope.submitNewItem = function (addNewItemProfile, isAdd) { return _this.submitNewItem(addNewItemProfile, isAdd); };
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
        this.$scope.searchCategory = function () { return _this.searchCategory(); };
        this.$scope.gridBinding = function () { return _this.gridBinding(); };
        this.$scope.cancelButtonEvent = function () { return _this.cancelButtonEvent(); };
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
        this.$scope.gridClickForItemPoup = function (id) { return _this.gridClickForItemPoup(id); };
        // this.$scope.checkSellPrice = () => this.checkSellPrice();
        this.$scope.openAutomaticPOPopup = function () { return _this.openAutomaticPOPopup(); };
        this.$scope.closeAutomaticPOPopup = function () { return _this.closeAutomaticPOPopup(); };
        //  this.$scope.onChangeIsAutomaticPO = () => this.onChangeIsAutomaticPO();
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.supplierList = [];
        this.$scope.cancelItemPopup = function () { return _this.cancelItemPopup(); };
        this.$scope.totalItemList = [];
        this.$scope.addElements = function () { return _this.addElements(); };
        this.$scope.addNewItemProfile.ListOfItemQuantityList = [];
        this.$scope.removeElement = function (index) { return _this.removeElement(index); };
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
        this.$scope.compareMaxMiniValue = function (miniMum, maxiMum) { return _this.compareMaxMiniValue(miniMum, maxiMum); };
        this.$scope.compareMaxMinWithIndex = function (miniMum, maxiMum, index) { return _this.compareMaxMinWithIndex(miniMum, maxiMum, index); };
        this.$scope.checkIntegerMin = function (miniMum, index) { return _this.checkIntegerMin(miniMum, index); };
        this.$scope.checkIntegerMax = function (maxiMum, index) { return _this.checkIntegerMax(maxiMum, index); };
        this.$scope.checkIntegerActual = function (actual, index) { return _this.checkIntegerActual(actual, index); };
        this.$scope.companyBarcodeButtonText = stringConstants.genrateCompanyBarcode;
        this.$scope.GenrateBarcode = function () { return _this.GenrateBarcode(); };
        this.$scope.addNewItemProfile.IsCompanyBarcode = false;
        this.$scope.isGenratedBarcodeButton = false;
        this.initialize();
        this.$rootScope.isFocusIn = true;
        var userPage = this.$rootScope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$rootScope.totalCollection = [];
            var begin = ((_this.$rootScope.currentPage - 1) * _this.$rootScope.itemsPerPage), end = begin + _this.$rootScope.itemsPerPage;
            _this.$rootScope.totalCollection = _this.$rootScope.categoryListCollections.slice(begin, end);
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
    AddNewItemProfileController.prototype.initialize = function () {
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
    };
    AddNewItemProfileController.prototype.GenrateBarcode = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
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
    //this funciton used for get branch list -An
    AddNewItemProfileController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        this.$scope.isSellPriceNotValid = false;
        //To get branch list
        var promise = this.addNewItemProfileService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
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
    AddNewItemProfileController.prototype.getAllInitiatorOfSpo = function () {
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
    AddNewItemProfileController.prototype.compareMaxMiniValue = function (miniMum, maxiMum) {
        if (miniMum !== "" && maxiMum !== "") {
            if (parseFloat(miniMum) > parseFloat(maxiMum)) {
                this.$scope.addNewItemProfile.MinimumQuantity = 0;
            }
        }
    };
    AddNewItemProfileController.prototype.compareMaxMinWithIndex = function (miniMum, maxiMum, index) {
        //   if (miniMum === parseInt(miniMum, 10))
        if (miniMum !== "" && maxiMum !== "") {
            if (parseFloat(miniMum) > parseFloat(maxiMum)) {
                this.$scope.addNewItemProfile.ListOfItemQuantityList[index].MinimumQuantity = 0;
            }
        }
    };
    AddNewItemProfileController.prototype.checkIntegerActual = function (actual, index) {
        var controllerScope = this.$scope;
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
    };
    AddNewItemProfileController.prototype.checkIntegerMin = function (miniMum, index) {
        var controllerScope = this.$scope;
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
    };
    AddNewItemProfileController.prototype.checkIntegerMax = function (maxiMum, index) {
        var controllerScope = this.$scope;
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
    };
    //this function used for bind data in add item profile page.-An
    AddNewItemProfileController.prototype.bindDataInAddItemProfilePage = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        var promise = this.addNewItemProfileService.getItemDetailById(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                controllerScope.addNewItemProfile = result;
                controllerScope.isAutomaticPo = controllerScope.addNewItemProfile.IsAutomaticPO;
                //     controllerScope.addNewItemProfile.AutomaticPOQuantity = result.AutomaticPOQuantity
                controllerScope.itemType = result.Category.BrandParamType.ValueEn + "-" + result.Category.GroupParamType.ValueEn;
                _this.getSupplierList();
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
    //this funciton used for get unit type.-An
    AddNewItemProfileController.prototype.getUnitTypeList = function () {
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
    //this function used for submit/update main item profile. -An
    AddNewItemProfileController.prototype.submitNewItem = function (addNewItemProfile, isAdd) {
        var _this = this;
        if (!this.$scope.isFirstClick) {
            this.$scope.isFirstClick = true;
            var controllerScope = this.$scope;
            var controllerRootScope_1 = this.$rootScope;
            controllerScope.isbarcodeExists = false;
            controllerScope.isbranchNameExists = false;
            controllerScope.isSellPriceNotValid = false;
            controllerScope.isSellPriceANotValid = false;
            controllerScope.isSellPriceBNotValid = false;
            controllerScope.isBarCodeNotValid = false;
            controllerScope.isSellPriceCNotValid = false;
            controllerScope.isSellPriceDNotValid = false;
            controllerScope.isItemCodeExists = false;
            controllerRootScope_1.isLoading = true;
            //to insert item profile
            this.$scope.addNewItemProfile.IsParentItem = true;
            //this condition used for check this function call for add or update. 
            if (isAdd) {
                //to check sell price is valid or not.
                var d = ((parseFloat(addNewItemProfile.CostPrice) * parseFloat(addNewItemProfile.ProfitMargin)) / 100);
                var total = d + parseFloat(addNewItemProfile.CostPrice);
                var isCheckValidSellPrice = this.checkValidSellPriceOrNot(addNewItemProfile, total);
                if (isCheckValidSellPrice) {
                    var promise = this.addNewItemProfileService.insertItemProfile(addNewItemProfile);
                    promise.then(function (result) {
                        if (((result._isResult.NormalBarcodeFrom === undefined) && (result._isResult.NormalBarcodeTo === undefined))) {
                            if (result._isResult !== 0) {
                                if (result._isResult !== -1) {
                                    if (result._isResult !== -2) {
                                        _this.ngToast.create(stringConstants.addedItemProfileSuccessfully);
                                        _this.$location.path('/ItemProfile');
                                    }
                                    else
                                        _this.$scope.isItemCodeExists = true;
                                }
                                else
                                    _this.$scope.isbranchNameExists = true;
                            }
                            else
                                _this.$scope.isbarcodeExists = true;
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
                var promise = this.addNewItemProfileService.updateItemProfile(addNewItemProfile);
                promise.then(function (result) {
                    if ((result._isResult.BalanceBarcodeFrom === undefined || result._isResult.BalanceBarcodeFrom === null) && (result._isResult.BalanceBarcodeTo === undefined || result._isResult.BalanceBarcodeTo === null)) {
                        if (result._isResult !== 0) {
                            if (result._isResult !== -1) {
                                if (result._isResult !== -2) {
                                    if (result._isResult !== -3) {
                                        if (result._isResult !== -4) {
                                            _this.ngToast.create(stringConstants.updateItemProfileSucessfully);
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
                                    _this.$scope.isItemCodeExists = true;
                            }
                            else
                                _this.$scope.isbranchNameExists = true;
                        }
                        else {
                            _this.$scope.isbarcodeExists = true;
                        }
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
            controllerRootScope_1.isLoading = false;
            this.$scope.isFirstClick = false;
        }
    };
    AddNewItemProfileController.prototype.checkValidSellPriceOrNot = function (addNewItemProfile, total) {
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
    };
    //this funciton used for open popup -An
    AddNewItemProfileController.prototype.itemTypePopup = function () {
        this.itemBrandSearchPopup = this.$modal.open({
            templateUrl: 'BrandSearch',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        var controllerrootScope = this.$rootScope;
        controllerrootScope.itemsPerPage = 2;
        controllerrootScope.currentPage = 1;
        controllerrootScope.maxSize = 10;
        controllerrootScope.isLoading = true;
        this.gridBinding();
        this.getBrandList();
    };
    //this method used forsearch category -An
    AddNewItemProfileController.prototype.searchCategory = function () {
        var controllerScope = this.$scope;
        var controllerrootScope = this.$rootScope;
        var that = this;
        var categoryList = this.filterFilter((controllerrootScope.categoryListCollections), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (categoryList === 0) {
            controllerScope.categoryErrorMessageDisplay = true;
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerrootScope.totalCollection = categoryList.slice(begin, end);
            controllerrootScope.totalItems = categoryList.length;
            controllerrootScope.categoryErrorMessageDisplay = false;
        }
    };
    //this funciton used to get brand list -An
    AddNewItemProfileController.prototype.getBrandList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var promise = this.categoryService.getBrandGroup(1);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.brandList.push({ BrandId: result[i].Id, BrandName: result[i].ValueEn });
            }
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
        controllerRootScope.isLoading = false;
    };
    //this funciton used for grid binding in item popup -An
    AddNewItemProfileController.prototype.gridBinding = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        this.$scope.serachFilter = 0;
        controllerRootScope.categoryListCollections = [];
        var category = controllerRootScope.categoryListCollections;
        var promise = this.categoryService.getCategory();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                category.push({ Id: result[i].Id, Brand: result[i].BrandParamType.ValueEn, BrandArabic: result[i].BrandParamType.ValueSl, Group: result[i].GroupParamType.ValueEn, GropArabic: result[i].GroupParamType.ValueSl, SupplierCount: result[i].SupplierCount, ItemSupplier: result[i].ItemSupplier });
            }
            /* init pagination with $scope.list */
            var that = _this;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerRootScope.totalCollection = category.slice(begin, end);
            /* init pagination with $scope.list */
            controllerRootScope.totalItems = controllerRootScope.categoryListCollections.length;
            //for brand search page
            if (controllerRootScope.totalCollection.length > 0)
                controllerScope.categoryErrorMessageDisplay = false;
            else
                controllerScope.categoryErrorMessageDisplay = true;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    //this funciton used for grid click event. -An
    AddNewItemProfileController.prototype.gridClickForItemPoup = function (id) {
        var controllerRootScope = this.$rootScope;
        for (var i = 0; i <= controllerRootScope.categoryListCollections.length; i++) {
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
    };
    //this funciton used for close the popup -An
    AddNewItemProfileController.prototype.cancelItemPopup = function () {
        this.itemBrandSearchPopup.dismiss('cancel');
    };
    //this funciton used for redirect to item profile. -An
    AddNewItemProfileController.prototype.cancelButtonEvent = function () {
        this.$location.path('/ItemProfile');
    };
    //this function used for add Elements -An
    AddNewItemProfileController.prototype.addElements = function () {
        var controllerScope = this.$scope;
        //for set scroll position
        var section_pos = angular.element("#other-item").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top + 50 }, 300);
        controllerScope.addNewItemProfile.ListOfItemQuantityList.push({});
    };
    //this funciton used for minus Elements -An
    AddNewItemProfileController.prototype.removeElement = function (index) {
        this.$scope.addNewItemProfile.ListOfItemQuantityList.splice(index, 1);
    };
    //this function used for margin profit -An
    AddNewItemProfileController.prototype.getMarginProfit = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        var promise = this.addNewItemProfileService.getMarginProfit();
        promise.then(function (result) {
            if (result.isResult !== null && result.isResult !== undefined) {
                _this.$scope.addNewItemProfile.ProfitMargin = result.isResult;
                _this.$scope.marginProfit = result.isResult;
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
    // used for opening the AutomaticPOPopup-jj
    AddNewItemProfileController.prototype.openAutomaticPOPopup = function () {
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
    AddNewItemProfileController.prototype.closeAutomaticPOPopup = function () {
        var controllerScope = this.$scope;
        this.automaticPOPopup.dismiss('cancel');
        controllerScope.addNewItemProfile.IsAutomaticPO = false;
    };
    // used to fetch supplier list - jj
    AddNewItemProfileController.prototype.getSupplierList = function () {
        var controllerScope = this.$scope;
        controllerScope.supplierList = [];
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
    return AddNewItemProfileController;
}());
AddNewItemProfileController.controllerId = "addNewItemProfileController";
app.controller(AddNewItemProfileController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'categoryService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, $rootScope, addNewItemProfileService, categoryService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        return new AddNewItemProfileController($scope, $log, $rootScope, addNewItemProfileService, categoryService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=addNewItemProfileController.js.map
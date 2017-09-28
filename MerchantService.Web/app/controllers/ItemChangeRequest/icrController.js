var IcrController = (function () {
    function IcrController($scope, $log, icrService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, userAccessService, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.icrService = icrService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$location = $location;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.userAccessService = userAccessService;
        this.$routeParams = $routeParams;
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.IcrQuantity = new Model.IcrQuantity();
        this.$scope.getItemProfileList = function () { return _this.getItemProfileList(); };
        this.$scope.addItem = function (id) { return _this.addItem(id); };
        this.$scope.cancelEdit = function () { return _this.cancelEdit(); };
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        this.$scope.saveICR = function (itemDetails) { return _this.saveICR(itemDetails); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.itemQuantityList = [];
        this.$scope.IsDetailVisible = false;
        this.$scope.choiceList = stringConstants.choiceList;
        this.$scope.search = [];
        this.$scope.branchList = [];
        this.$scope.brandList = [];
        this.$scope.parentIdList = [];
        this.$scope.searchItem = function () { return _this.searchItem(); };
        this.$scope.getCategoryList = function () { return _this.getCategoryList(); };
        this.$scope.categoryList = [];
        this.$scope.supplierList = [];
        this.$scope.supplier = [];
        this.$scope.getUnitList = function () { return _this.getUnitList(); };
        this.$scope.unitList = [];
        this.$scope.isItemListVisible = false;
        this.$scope.itemNotFoundError = false;
        this.$scope.isQuantityChange = true;
        this.$scope.isSellPriceANotValid = false;
        this.$scope.isPOItemICR = false;
        this.$scope.isSellPriceBNotValid = false;
        this.$scope.isSellPriceCNotValid = false;
        this.$scope.isSellPriceDNotValid = false;
        this.$scope.isSellPriceNotValid = false;
        this.$scope.errorMessage = "";
        this.$scope.isSPLessConfirmed = false;
        this.$scope.choice = [];
        this.$scope.setChange = function () { return _this.setChange(); };
        this.$scope.getCompanyConfiguration = function (itemDetails) { return _this.getCompanyConfiguration(itemDetails); };
        this.$scope.spLessConfirmation = function () { return _this.spLessConfirmation(); };
        this.$scope.IsICRCreatedBelowCostPrice = true;
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.getICRDetail = function () { return _this.getICRDetail(); };
        this.$scope.isEdit = false;
        this.$scope.checkItemQuantity = function () { return _this.checkItemQuantity(); };
        this.$scope.checkItemPrice = function (itemChangedDetails) { return _this.checkItemPrice(itemChangedDetails); };
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.openSPlessThanCPPopup = function () { return _this.openSPlessThanCPPopup(); };
        this.$scope.closeSPlessThanCPPopup = function () { return _this.closeSPlessThanCPPopup(); };
        this.$scope.checkModifyingPrice = function () { return _this.checkModifyingPrice(); };
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.entryLimit = 10;
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            if (_this.$scope.itemList !== null) {
                if (_this.$scope.itemList.length > 0) {
                    _this.$scope.totalCollection = _this.$scope.itemList.slice(begin, end);
                }
            }
        });
        this.initialize();
    }
    IcrController.prototype.initialize = function () {
        //if (this.$routeParams.id == null && this.$routeParams.id == "") {
        this.getItemProfileList();
    };
    //used to fetch BranchList - jj
    IcrController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrService.getBranchList();
        promise.then(function (result) {
            controllerScope.branchList = result;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingBranch
            });
        });
    };
    //this function used for get item profile list -jj
    IcrController.prototype.getItemProfileList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.subItemCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var itemProfileList = controllerScope.itemProfileCollection;
        var promise = this.icrService.getItemProfileList();
        promise.then(function (result) {
            if (result !== null) {
                if (result.length > 0) {
                    itemProfileList = result;
                    controllerScope.itemProfileCollection = itemProfileList;
                    controllerScope.itemTotalCollection = itemProfileList;
                    controllerRootScope.isLoading = false;
                    if (_this.$routeParams.id !== null && _this.$routeParams.id !== undefined && _this.$routeParams.id !== "") {
                        _this.getICRDetail();
                    }
                    else {
                        _this.getCategoryList();
                    }
                }
                else {
                    controllerScope.errorMessageDisplayForBlankList = true;
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ItemNotFetched
            });
        });
    };
    // used to get brand list - jj
    IcrController.prototype.getBrandList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrService.getBrandGroup(1);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.brandList.push({ BrandId: result[i].Id, BrandName: result[i].ValueEn });
            }
            _this.getSupplierList();
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to fetch supplier list
    IcrController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrService.getSupplierList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get sub item list. -An
    IcrController.prototype.getSubItemList = function (parentId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var list = [];
        var getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {
            angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
            angular.element("#subChild" + parentId).removeClass('isHide').addClass('isShowRow');
            angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
            controllerScope.parentIdList.push({ Id: parentId });
        }
        else {
            angular.element("#subChild" + parentId).removeClass('isShowRow').addClass('isHide');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
            for (var i = 0; i < controllerScope.parentIdList.length; i++) {
                if (controllerScope.parentIdList[i].Id === parentId) {
                }
                else {
                    list.push({ Id: controllerScope.parentIdList[i].Id });
                }
            }
            controllerScope.parentIdList = [];
            controllerScope.parentIdList = list;
        }
        controllerRootScope.isLoading = false;
    };
    IcrController.prototype.addItem = function (item) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.IsDetailVisible = false;
        controllerScope.isQuantityChange = true;
        controllerScope.choice.Change = "Quantity";
        if (item.IsOfferValid) {
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.ICRNotInitiated
            });
        }
        else {
            if (item.IsItemChangeRequestGenerated) {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.IPCRAlreadyGenerated
                });
            }
            // else {
            controllerRootScope.isLoading = true;
            controllerScope.addNewItemProfile = item;
            controllerScope.itemChangedDetails = new Model.ItemChangedDetails();
            var promise = this.icrService.getItemQuantityList(item.Id);
            promise.then(function (result) {
                controllerScope.isItemListVisible = false;
                controllerScope.IsDetailVisible = true;
                if (result !== null && result !== undefined) {
                    if (result.length > 0) {
                        controllerScope.itemQuantityList = result;
                        if (controllerScope.itemQuantityList.length > 0) {
                        }
                        else {
                            controllerScope.isQuantityChange = false;
                            controllerScope.choice.Change = "Price";
                        }
                    }
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                controllerRootScope.isLoading = false;
                if (error.status !== 500) {
                    location.replace(_this.apiPath);
                }
            });
        }
        // }
    };
    //used to search Item - jj
    IcrController.prototype.searchItem = function () {
        var controllerScope = this.$scope;
        var parentItemIdList = [];
        controllerScope.itemProfileCollection = [];
        controllerScope.itemProfileCollection = controllerScope.itemTotalCollection;
        var itemList = this.filterFilter((controllerScope.itemTotalCollection), controllerScope.search);
        for (var c = 0; c < itemList.length; c++) {
            parentItemIdList.push({ Id: itemList[c].ItemId });
        }
        for (var j = 0; j < controllerScope.parentIdList.length; j++) {
            this.getSubItemList(controllerScope.parentIdList[j].Id);
        }
        //   if (itemList.length == 0) {
        var searchList = [];
        for (var i = 0; i < controllerScope.itemTotalCollection.length; i++) {
            searchList.push(controllerScope.itemTotalCollection[i]);
            var isParentSelected = false;
            for (var c = 0; c < parentItemIdList.length; c++) {
                if (controllerScope.itemTotalCollection[i].ItemId === parentItemIdList[c].Id) {
                    isParentSelected = true;
                }
            }
            if (controllerScope.itemTotalCollection[i].HasChildItem && !isParentSelected) {
                for (var j = 0; j < controllerScope.itemTotalCollection[i].listOfChildProfileAC.length; j++) {
                    searchList.push(controllerScope.itemTotalCollection[i].listOfChildProfileAC[j]);
                }
            }
        }
        itemList = [];
        itemList = this.filterFilter((searchList), controllerScope.search);
        // }
        var catList = [];
        controllerScope.itemProfileCollection = itemList;
        if (controllerScope.itemProfileCollection.length > 0) {
            if (controllerScope.supplierList !== undefined && controllerScope.supplierList !== null && controllerScope.supplierList.length > 0 && controllerScope.supplier.SupplierId !== undefined && controllerScope.supplier.SupplierId !== null && controllerScope.supplier.SupplierId > 0) {
                for (var c = 0; c < controllerScope.categoryList.length; c++) {
                    for (var s = 0; s < controllerScope.categoryList[c].ItemSupplier.length; s++) {
                        if (controllerScope.categoryList[c].ItemSupplier[s].SupplierProfile.Id === controllerScope.supplier.SupplierId) {
                            catList.push({ Id: controllerScope.categoryList[c].Id });
                        }
                    }
                }
                if (catList.length > 0) {
                    itemList = [];
                    for (var d = 0; d < catList.length; d++) {
                        for (var y = 0; y < controllerScope.itemProfileCollection.length; y++) {
                            if (catList[d].Id === controllerScope.itemProfileCollection[y].CategoryId) {
                                itemList.push(controllerScope.itemProfileCollection[y]);
                            }
                        }
                    }
                    controllerScope.itemProfileCollection = [];
                    if (itemList.length > 0) {
                        controllerScope.itemProfileCollection = itemList;
                        controllerScope.isItemListVisible = true;
                        controllerScope.itemNotFoundError = false;
                    }
                    else {
                        controllerScope.itemProfileCollection = [];
                        controllerScope.isItemListVisible = false;
                        controllerScope.itemNotFoundError = true;
                    }
                }
                else {
                    controllerScope.itemProfileCollection = [];
                    controllerScope.isItemListVisible = false;
                    controllerScope.itemNotFoundError = true;
                }
            }
            else {
                controllerScope.isItemListVisible = true;
                controllerScope.itemNotFoundError = false;
            }
        }
        else {
            controllerScope.itemProfileCollection = [];
            controllerScope.isItemListVisible = false;
            controllerScope.itemNotFoundError = true;
        }
        controllerScope.search = [];
        controllerScope.supplier = [];
    };
    //This function used for get category list. - jj
    IcrController.prototype.getCategoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrService.getCategoryList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    result[i].Name = result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn;
                    controllerScope.categoryList.push(result[i]);
                }
                _this.getUnitList();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.CategoryListNotFetched
            });
        });
    };
    //used to get unit list 
    IcrController.prototype.getUnitList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrService.getUnitList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                controllerRootScope.isLoading = false;
            }
            _this.getBrandList();
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.UnitListNotFetch
            });
        });
    };
    //used to hide/show  price n quantity change details
    IcrController.prototype.setChange = function () {
        var controllerScope = this.$scope;
        if (controllerScope.itemChangedDetails !== null) {
            controllerScope.itemChangedDetails.ModifyingSellPrice = controllerScope.addNewItemProfile.SellPrice;
            controllerScope.itemChangedDetails.ModifyingSellPriceA = controllerScope.addNewItemProfile.SellPriceA;
            controllerScope.itemChangedDetails.ModifyingSellPriceB = controllerScope.addNewItemProfile.SellPriceB;
            controllerScope.itemChangedDetails.ModifyingSellPriceC = controllerScope.addNewItemProfile.SellPriceC;
            controllerScope.itemChangedDetails.ModifyingSellPriceD = controllerScope.addNewItemProfile.SellPriceD;
            controllerScope.itemChangedDetails.ModifyingCostPrice = controllerScope.addNewItemProfile.CostPrice;
        }
        var tempList = controllerScope.itemQuantityList;
        controllerScope.itemQuantityList = [];
        var i = 0;
        for (i = 0; i < tempList.length; i++) {
            if (tempList[i].IsICRGenerated) {
                controllerScope.itemQuantityList.push(tempList[i]);
            }
            else {
                controllerScope.itemQuantityList.push({
                    Id: tempList[i].Id, ItemId: tempList[i].ItemId, Barcode: tempList[i].Barcode, ItemName: tempList[i].ItemName,
                    BranchId: tempList[i].BranchId, BranchName: tempList[i].BranchName, RequestedDate: tempList[i].RequestedDate,
                    MinQuantity: tempList[i].MinQuantity, MaxQuantity: tempList[i].MaxQuantity, ActualQuantity: tempList[i].ActualQuantity,
                    IsPOItemIcr: tempList[i].IsPOItemIcr, IsAddItemIcr: tempList[i].IsAddItemIcr, ItemProfile: tempList[i].ItemProfile, IcrQuantity: tempList[i].IcrQuantity
                });
            }
        }
        if (controllerScope.choice.Change === "Quantity") {
            controllerScope.isQuantityChange = true;
        }
        else {
            controllerScope.isQuantityChange = false;
        }
    };
    //used to save ICR - jj
    // changed to accomodate acc to requirement
    //3
    IcrController.prototype.saveICR = function (itemChangedDetail) {
        var controllerScope = this.$scope;
        var itemChangedDetails = new Model.ItemChangedDetails();
        var isCheckValidSellPrice = true;
        if (itemChangedDetail !== undefined && itemChangedDetail !== null) {
            itemChangedDetails = itemChangedDetail;
        }
        controllerScope.isSellPriceNotValid = false;
        controllerScope.isSellPriceANotValid = false;
        controllerScope.isSellPriceBNotValid = false;
        controllerScope.isSellPriceCNotValid = false;
        controllerScope.isSellPriceDNotValid = false;
        if (controllerScope.isQuantityChange) {
            itemChangedDetails.IsPriceChangeRequest = false;
            isCheckValidSellPrice = true;
            controllerScope.isSPLessConfirmed = true;
            this.saveItemChangeRequest(itemChangedDetails);
        }
        else {
            itemChangedDetails.IsPriceChangeRequest = true;
            var calculatedCP = ((parseFloat("" + itemChangedDetails.ModifyingCostPrice) * parseFloat("" + controllerScope.addNewItemProfile.ProfitMargin)) / 100);
            var total = calculatedCP + parseFloat("" + itemChangedDetails.ModifyingCostPrice);
            isCheckValidSellPrice = this.checkValidSellPriceOrNot(itemChangedDetails, total);
            if (!controllerScope.IsICRCreatedBelowCostPrice) {
                controllerScope.isSPLessConfirmed = false;
                if (isCheckValidSellPrice) {
                    this.saveItemChangeRequest(itemChangedDetails);
                }
                else {
                    isCheckValidSellPrice = this.checkValidSellPriceOrNot(itemChangedDetails, itemChangedDetails.ModifyingCostPrice);
                    if (isCheckValidSellPrice) {
                        this.saveItemChangeRequest(itemChangedDetails);
                    }
                    else {
                        var ModifyingCostPrice = itemChangedDetails.ModifyingCostPrice;
                        controllerScope.errorMessage = stringConstants.CompareCostSellPrice.replace(/{ModifyingCostPrice}/, ModifyingCostPrice.toString());
                        this.openSPlessThanCPPopup();
                    }
                }
            }
            else {
                if (isCheckValidSellPrice || controllerScope.isSPLessConfirmed) {
                    this.saveItemChangeRequest(itemChangedDetails);
                }
                else {
                    if (this.checkValidSellPriceOrNot(itemChangedDetails, itemChangedDetails.ModifyingCostPrice)) {
                        controllerScope.errorMessage = stringConstants.CompareCostSellProfitPrice.replace(/{ModifyingCostPrice}/, itemChangedDetails.ModifyingCostPrice.toString());
                        this.openSPlessThanCPPopup();
                    }
                    else {
                        controllerScope.errorMessage = stringConstants.CompareCostSellPriceContinue.replace(/{ModifyingCostPrice}/, itemChangedDetails.ModifyingCostPrice.toString());
                        this.openSPlessThanCPPopup();
                    }
                }
            }
        }
    };
    IcrController.prototype.saveItemChangeRequest = function (itemChangedDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var tempList = [];
        for (var i = 0; i < controllerScope.itemQuantityList.length; i++) {
            var itemQuantity = new Model.IcrQuantity();
            itemQuantity.BranchId = controllerScope.itemQuantityList[i].BranchId;
            itemQuantity.ModifyingQuantity = controllerScope.itemQuantityList[i].ModifyingQuantity;
            itemQuantity.ActualQuantity = controllerScope.itemQuantityList[i].ActualQuantity;
            if (controllerScope.itemQuantityList[i].Action === 1) {
                itemQuantity.IsAddOperation = true;
            }
            else {
                itemQuantity.IsAddOperation = false;
            }
            tempList[i] = itemQuantity;
        }
        itemChangedDetails.IcrQuantity = tempList;
        if (!controllerScope.isEdit) {
            itemChangedDetails.ItemId = controllerScope.addNewItemProfile.Id;
            var promise = this.icrService.saveICR(itemChangedDetails);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    if (result.status === "ok") {
                        _this.ngToast.create(stringConstants.ICRInitiatedSuccessful);
                        _this.$location.path("/ICRWorkList");
                    }
                    else if (result.status !== undefined && result.status !== null) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.$location.path("/ICRWorkList");
                    }
                    else {
                    }
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.ICRInitiatedFailed
                });
                controllerRootScope.isLoading = false;
            });
        }
        else {
            var promise = this.icrService.updateICR(itemChangedDetails);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    if (result.status === "ok") {
                        _this.ngToast.create(stringConstants.ICRUpdetedSuccessfully);
                        _this.$location.path("/ICRWorkList");
                    }
                    else if (result.status !== undefined && result.status !== null) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.$location.path("/ICRWorkList");
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.ICRUpdeteFailed
                        });
                    }
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.ICRUpdeteFailed
                });
                controllerRootScope.isLoading = false;
            });
        }
    };
    //used to check whether Valid Sell Price or not - jj
    IcrController.prototype.checkValidSellPriceOrNot = function (itemChangedDetails, total) {
        var controllerScope = this.$scope;
        if (controllerScope.isQuantityChange) {
            return true;
        }
        else {
            if (parseFloat(itemChangedDetails.ModifyingSellPrice) >= total) {
                if (itemChangedDetails.ModifyingSellPriceA !== undefined && itemChangedDetails.ModifyingSellPriceA !== null && itemChangedDetails.ModifyingSellPriceA !== "") {
                    if (parseFloat(itemChangedDetails.ModifyingSellPriceA) < total) {
                        this.$scope.isSellPriceANotValid = true;
                        return false;
                    }
                }
                if (itemChangedDetails.ModifyingSellPriceB !== undefined && itemChangedDetails.ModifyingSellPriceB !== null && itemChangedDetails.ModifyingSellPriceB !== "") {
                    if (parseFloat(itemChangedDetails.ModifyingSellPriceB) < total) {
                        this.$scope.isSellPriceBNotValid = true;
                        return false;
                    }
                }
                if (itemChangedDetails.ModifyingSellPriceC !== undefined && itemChangedDetails.ModifyingSellPriceC !== null && itemChangedDetails.ModifyingSellPriceC !== "") {
                    if (parseFloat(itemChangedDetails.ModifyingSellPriceC) < total) {
                        this.$scope.isSellPriceCNotValid = true;
                        return false;
                    }
                }
                if (itemChangedDetails.ModifyingSellPriceD !== undefined && itemChangedDetails.ModifyingSellPriceD !== null && itemChangedDetails.ModifyingSellPriceD !== "") {
                    if (parseFloat(itemChangedDetails.ModifyingSellPriceD) < total) {
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
    };
    //used to fetch Company Configuration - jj
    IcrController.prototype.getCompanyConfiguration = function (itemChangedDetail) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrService.getCompanyConfiguration();
        promise.then(function (result) {
            controllerScope.IsICRCreatedBelowCostPrice = result.IsIcrCreatedBelowCostPrice;
            controllerRootScope.isLoading = false;
            _this.saveICR(itemChangedDetail);
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.CompanyConfigNotMatched
            });
        });
    };
    //used to fetch Detail of ICR - jj
    IcrController.prototype.getICRDetail = function () {
        var id = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isEdit = true;
        controllerScope.isItemListVisible = false;
        var promise = this.icrService.getICRDetail(this.$routeParams.id);
        promise.then(function (result) {
            controllerScope.itemChangedDetails = result;
            controllerScope.IsDetailVisible = true;
            if (result.POItemId > 0)
                controllerScope.isPOItemICR = true;
            controllerScope.itemQuantityList = controllerScope.itemChangedDetails.IcrQuantity;
            controllerScope.isQuantityChange = !(result.IsPriceChangeRequest);
            if (controllerScope.isQuantityChange) {
                controllerScope.choice.Change = "Quantity";
                for (var j = 0; j < controllerScope.itemQuantityList.length; j++) {
                    if (controllerScope.itemQuantityList[j].ModifyingQuantity > 0) {
                        if (controllerScope.itemQuantityList[j].IsAddOperation) {
                            controllerScope.itemQuantityList[j].Action = 1;
                        }
                        else {
                            controllerScope.itemQuantityList[j].Action = 2;
                        }
                    }
                }
            }
            else {
                controllerScope.choice.Change = "Price";
            }
            for (var i = 0; i < controllerScope.itemProfileCollection.length; i++) {
                if (result.ItemId === controllerScope.itemProfileCollection[i].Id) {
                    controllerScope.addNewItemProfile = controllerScope.itemProfileCollection[i];
                }
                else {
                    if (controllerScope.itemProfileCollection[i].HasChildItem) {
                        for (var b = 0; b < controllerScope.itemProfileCollection[i].listOfChildProfileAC.length; b++) {
                            if (result.ItemId === controllerScope.itemProfileCollection[i].listOfChildProfileAC[b].Id) {
                                controllerScope.addNewItemProfile = controllerScope.itemProfileCollection[i].listOfChildProfileAC[b];
                            }
                        }
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // used for opening the SPlessThanCPPopup-jj
    IcrController.prototype.openSPlessThanCPPopup = function () {
        var controllerScope = this.$scope;
        this.spLessThanCP = this.$modal.open({
            templateUrl: 'SPlessThanCPPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the SPlessThanCPPopup-jj
    IcrController.prototype.closeSPlessThanCPPopup = function () {
        this.spLessThanCP.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    };
    //used to get user's confirmation
    IcrController.prototype.spLessConfirmation = function () {
        var controllerScope = this.$scope;
        controllerScope.isSPLessConfirmed = true;
        this.saveICR(controllerScope.itemChangedDetails);
        this.spLessThanCP.dismiss('cancel');
        controllerScope.errorMessage = "";
    };
    //used to reset page
    IcrController.prototype.cancel = function () {
        var controllerScope = this.$scope;
        controllerScope.addNewItemProfile = new Model.AddNewItemProfile();
        controllerScope.isItemListVisible = false;
        controllerScope.IsDetailVisible = false;
        if (controllerScope.itemChangedDetails !== null && controllerScope.itemChangedDetails !== undefined) {
            controllerScope.itemChangedDetails.ModifyingSellPrice = 0;
            controllerScope.itemChangedDetails.ModifyingSellPriceA = 0;
            controllerScope.itemChangedDetails.ModifyingSellPriceB = 0;
            controllerScope.itemChangedDetails.ModifyingSellPriceC = 0;
            controllerScope.itemChangedDetails.ModifyingSellPriceD = 0;
            controllerScope.itemChangedDetails.ModifyingCostPrice = 0;
        }
        var tempList = controllerScope.itemQuantityList;
        controllerScope.itemQuantityList = [];
        var i = 0;
        for (i = 0; i < tempList.length; i++) {
            controllerScope.itemQuantityList.push({
                Id: tempList[i].Id, ItemId: tempList[i].ItemId, Barcode: tempList[i].Barcode, ItemName: tempList[i].ItemName,
                BranchId: tempList[i].BranchId, BranchName: tempList[i].BranchName, RequestedDate: tempList[i].RequestedDate,
                MinQuantity: tempList[i].MinQuantity, MaxQuantity: tempList[i].MaxQuantity, ActualQuantity: tempList[i].ActualQuantity,
                IsPOItemIcr: tempList[i].IsPOItemIcr, IsAddItemIcr: tempList[i].IsAddItemIcr, ItemProfile: tempList[i].ItemProfile, IcrQuantity: tempList[i].IcrQuantity
            });
        }
    };
    IcrController.prototype.checkItemPrice = function (itemChangedDetails) {
        var controllerScope = this.$scope;
        if (itemChangedDetails !== undefined && itemChangedDetails !== null) {
            if (itemChangedDetails.ModifyingSellPrice > 0 && itemChangedDetails.ModifyingSellPriceA > 0 && itemChangedDetails.ModifyingSellPriceB > 0 && itemChangedDetails.ModifyingSellPriceC > 0 && itemChangedDetails.ModifyingSellPriceD > 0 && itemChangedDetails.ModifyingCostPrice > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    IcrController.prototype.checkItemQuantity = function () {
        var controllerScope = this.$scope;
        var count = 0;
        for (var i = 0; i < controllerScope.itemQuantityList.length; i++) {
            if (controllerScope.itemQuantityList[i].ModifyingQuantity > 0) {
                if (controllerScope.itemQuantityList[i].Action !== undefined && controllerScope.itemQuantityList[i].Action !== null) {
                    if (controllerScope.itemQuantityList[i].Action === 2) {
                        if (parseFloat(controllerScope.itemQuantityList[i].ModifyingQuantity) > controllerScope.itemQuantityList[i].ActualQuantity) {
                            count = 0;
                            break;
                        }
                        else {
                            if ((parseFloat(controllerScope.itemQuantityList[i].ModifyingQuantity)) === (Math.round(parseFloat(controllerScope.itemQuantityList[i].ModifyingQuantity)))) {
                                count = 1;
                            }
                            else {
                                count = 0;
                                break;
                            }
                        }
                    }
                    else {
                        if ((parseFloat(controllerScope.itemQuantityList[i].ModifyingQuantity)) === (Math.round(parseFloat(controllerScope.itemQuantityList[i].ModifyingQuantity)))) {
                            count = 1;
                        }
                        else {
                            count = 0;
                            break;
                        }
                    }
                }
                else {
                    count = 0;
                    break;
                }
            }
        }
        if (count === 1) {
            return false;
        }
        else {
            return true;
        }
    };
    //used to rediredt to Item Change Request Worklist - jj
    IcrController.prototype.cancelEdit = function () {
        this.$location.path("/ICRWorkList");
    };
    IcrController.prototype.checkModifyingPrice = function () {
        var controllerScope = this.$scope;
        controllerScope.isSPLessConfirmed = false;
    };
    return IcrController;
}());
IcrController.controllerId = "icrController";
app.controller(IcrController.controllerId, ['$scope', '$log', 'icrService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', '$routeParams', function ($scope, $log, icrService, ngToast, $rootSoope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, UserAccessService, $routeParams) {
        return new IcrController($scope, $log, icrService, ngToast, $rootSoope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, UserAccessService, $routeParams);
    }]);
//# sourceMappingURL=icrController.js.map
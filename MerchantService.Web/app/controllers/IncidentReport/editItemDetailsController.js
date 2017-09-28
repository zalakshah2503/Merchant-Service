// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var EditItemDetailsController = (function () {
    function EditItemDetailsController($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, addNewItemProfileService, categoryService) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.addNewItemProfileService = addNewItemProfileService;
        this.categoryService = categoryService;
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.itemType = "";
        this.$scope.editInformationByItemId = function () { return _this.editInformationByItemId(); };
        this.$scope.isSellPriceNotValid = false;
        this.$scope.branchList = [];
        this.$scope.unitList = [];
        this.$scope.itemTypePopup = function () { return _this.itemTypePopup(); };
        this.$scope.cancelItemPopup = function () { return _this.cancelItemPopup(); };
        this.$scope.compareMaxMinWithIndex = function (miniMum, maxiMum, $index) { return _this.compareMaxMinWithIndex(miniMum, maxiMum, $index); };
        this.$scope.gridBinding = function () { return _this.gridBinding(); };
        this.$scope.brandList = [];
        this.$scope.categoryErrorMessageDisplay = false;
        var page = this.$rootScope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$rootScope.totalCollection = [];
            var begin = ((_this.$rootScope.currentPage - 1) * _this.$rootScope.itemsPerPage), end = begin + _this.$rootScope.itemsPerPage;
            _this.$rootScope.totalCollection = _this.$rootScope.categoryListCollections.slice(begin, end);
        });
        this.$scope.gridClickForItemPoup = function (id) { return _this.gridClickForItemPoup(id); };
        this.$scope.cancelButtonEvent = function (incidentId) { return _this.cancelButtonEvent(incidentId); };
        this.$scope.updateItemDetails = function (addNewItemProfile) { return _this.updateItemDetails(addNewItemProfile); };
        this.$scope.isDataLoading = false;
        this.$scope.checkIntegerMin = function (miniMum, index) { return _this.checkIntegerMin(miniMum, index); };
        this.$scope.checkIntegerMax = function (maxiMum, index) { return _this.checkIntegerMax(maxiMum, index); };
        this.$scope.checkIntegerActual = function (actual, index) { return _this.checkIntegerActual(actual, index); };
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
    EditItemDetailsController.prototype.initialization = function () {
        //  this.getBranchList();
        this.getUnitTypeList();
        this.editInformationByItemId();
    };
    EditItemDetailsController.prototype.editInformationByItemId = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        //to get unit type list
        var promise = this.addNewItemProfileService.editInformationByItemId(this.$routeParams.id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                controllerScope.addNewItemProfile = result;
                controllerScope.itemType = result.ItemType;
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
    //this funciton used for get branch list -An
    EditItemDetailsController.prototype.getBranchList = function () {
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
    //this funciton used for get unit type.-An
    EditItemDetailsController.prototype.getUnitTypeList = function () {
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
    //this funciton used for open popup -An
    EditItemDetailsController.prototype.itemTypePopup = function () {
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
    //this funciton used for grid binding in item popup -An
    EditItemDetailsController.prototype.gridBinding = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
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
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage);
            var end = begin + that.$scope.itemsPerPage;
            controllerRootScope.totalCollection = category.slice(begin, end);
            /* init pagination with $scope.list */
            controllerRootScope.totalItems = controllerRootScope.categoryListCollections.length;
            //for brand search page
            if (controllerRootScope.totalCollection.length > 0)
                controllerScope.categoryErrorMessageDisplay = false;
            else
                controllerScope.categoryErrorMessageDisplay = true;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    //this funciton used to get brand list -An
    EditItemDetailsController.prototype.getBrandList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
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
    //this funciton used for close the popup -An
    EditItemDetailsController.prototype.cancelItemPopup = function () {
        this.itemBrandSearchPopup.dismiss('cancel');
    };
    EditItemDetailsController.prototype.compareMaxMinWithIndex = function (miniMum, maxiMum, index) {
        var controllerScope = this.$scope;
        if (miniMum === "" || maxiMum === "") {
            this.$log.log("max and minimum quantity zero");
            controllerScope.isSaveButtonDisabled = true;
        }
        else {
            controllerScope.isSaveButtonDisabled = false;
            if (parseFloat(miniMum) > parseFloat(maxiMum)) {
                controllerScope.addNewItemProfile.ListOfItemQuantityList[index].MinimumQuantity = 0;
            }
        }
    };
    //this funciton used for grid click event. -An
    EditItemDetailsController.prototype.gridClickForItemPoup = function (id) {
        var controllerRootScope = this.$rootScope;
        var categoryTotalCollection = controllerRootScope.categoryListCollections;
        for (var i = 0; i <= categoryTotalCollection.length; i++) {
            if (categoryTotalCollection[i].Id === id) {
                this.$scope.addNewItemProfile.CategoryId = categoryTotalCollection[i].Id;
                this.$scope.itemType = categoryTotalCollection[i].Brand + '-' + categoryTotalCollection[i].Group;
                break;
            }
        }
        this.itemBrandSearchPopup.dismiss('cancel');
    };
    EditItemDetailsController.prototype.updateItemDetails = function (itemDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.addNewItemProfileService.updateItemDetails(itemDetails);
        promise.then(function (result) {
            _this.$location.path("/IncidentReportDetail/" + result.posIncidentReportId);
            controllerRootScope.isLoading = false;
        });
    };
    EditItemDetailsController.prototype.cancelButtonEvent = function (incidentId) {
        this.$location.path("/IncidentReportDetail/" + incidentId);
    };
    EditItemDetailsController.prototype.checkIntegerActual = function (actual, index) {
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
    EditItemDetailsController.prototype.checkIntegerMin = function (miniMum, index) {
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
    EditItemDetailsController.prototype.checkIntegerMax = function (maxiMum, index) {
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
    return EditItemDetailsController;
}());
EditItemDetailsController.controllerId = "editItemDetailsController";
app.controller(EditItemDetailsController.controllerId, ['$scope', '$log', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', 'addNewItemProfileService', 'categoryService', function ($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, addNewItemProfileService, categoryService) {
        return new EditItemDetailsController($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, addNewItemProfileService, categoryService);
    }]);
//# sourceMappingURL=editItemDetailsController.js.map
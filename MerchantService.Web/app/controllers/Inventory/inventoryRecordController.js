// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var InventoryRecordController = (function () {
    function InventoryRecordController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, inventoryHubServices) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$location = $location;
        this.issueStockInventoryService = issueStockInventoryService;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.ngToast = ngToast;
        this.inventoryHubServices = inventoryHubServices;
        this.$scope.getAllInvetoryType = function () { return _this.getAllInvetoryType(); };
        this.$scope.inventoryTypeCollection = [];
        this.$scope.issueInventoryDetails = new Model.IssueInventoryAc();
        this.$scope.supplierCollection = [];
        this.$scope.categoryCollection = [];
        this.$scope.isErrorMessageDisplay = false;
        this.$scope.errorMessage = "";
        this.$scope.branchList = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.getAllInventoryList = function () { return _this.getAllInventoryList(); };
        this.$scope.viewIssueStockInventoryRecordDetailsById = function (issueInventoryId) { return _this.viewIssueStockInventoryRecordDetailsById(issueInventoryId); };
        this.$scope.cancelIssueInventory = function () { return _this.cancelIssueInventory(); };
        this.$scope.itemSearchCollection = [];
        this.$scope.customInventoryCollection = [];
        this.$scope.search = new Model.IssueInventoryAc();
        this.$scope.getInventoryRecorderDetailsById = function () { return _this.getInventoryRecorderDetailsById(); };
        this.$scope.getItemListByIssueInventoryId = function (issueInventoryId) { return _this.getItemListByIssueInventoryId(issueInventoryId); };
        this.$scope.itemCollection = [];
        this.$scope.closeItemDetailModelDialogBox = function () { return _this.closeItemDetailModelDialogBox(); };
        this.$scope.searchIssueInventoryDetails = function () { return _this.searchIssueInventoryDetails(); };
        this.$scope.getItemDetailsByItemBarcode = function (issueInventoryDetails) { return _this.getItemDetailsByItemBarcode(issueInventoryDetails); };
        this.$scope.isDisabledItemDetails = true;
        this.$scope.isDialogBoxOpen = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.itemBarcodeValid = stringConstants.itemBarcodeValid;
        this.$scope.validBaseUnitCount = stringConstants.validBaseUnitCount;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.$scope.serchItemDetails = function () { return _this.serchItemDetails(); };
        this.$scope.$on("addIssueInventoryRecord", function (event, data) {
            _this.addIssueInventoryRecordDetails();
            _this.$log.log("broadcast issue inventory record");
        });
        this.$scope.isAllowEnterKey = true;
        this.$scope.closeUnmatchedItemWarnigDialogBox = function () { return _this.closeUnmatchedItemWarnigDialogBox(); };
        this.$scope.unmatchedItemDetails = "";
        this.$scope.isDataLoading = false;
        this.$scope.issueInventoryDetails.Quantity = "";
        this.$scope.itemErrorMessage = false;
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        this.$scope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
        this.$scope.inventoryRecordErrorMessage = false;
        this.initialize();
    }
    InventoryRecordController.prototype.initialize = function () {
        this.getAllSupplierList();
        this.getBranchList();
    };
    InventoryRecordController.prototype.getAllSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            }
            else {
                controllerScope.isErrorMessageDisplay = false;
                _this.$log.log("get supplier succssfully");
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }
                _this.getAllCateGoryList();
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    InventoryRecordController.prototype.getAllCateGoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.categoryCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.getAllCateGoryList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.errorMessage = stringConstants.errorMessage;
            }
            else {
                controllerScope.isErrorMessageDisplay = false;
                _this.$log.log("get category succssfully");
                for (var i = 0; i < result.length; i++) {
                    controllerScope.categoryCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    InventoryRecordController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.branchList = [];
        //To get branch list
        var promise = this.issueStockInventoryService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ BranchId: result[i].Id, Name: result[i].Name });
                }
                _this.getAllInvetoryType();
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
    InventoryRecordController.prototype.getAllInventoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryColletion = [];
        controllerScope.customInventoryCollection = [];
        var promise = this.issueStockInventoryService.getAllInventoryRecorderList();
        promise.then(function (result) {
            _this.$log.log("get all incident report succssfully");
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.inventoryColletion.push(result[i]);
                }
                controllerScope.customInventoryCollection = controllerScope.inventoryColletion;
                controllerScope.isDataLoading = false;
            }
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                _this.$log.log(error);
            }
            _this.$log.log(error);
        });
    };
    InventoryRecordController.prototype.searchIssueInventoryDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.inventoryColletion = this.filterFilter((controllerScope.customInventoryCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.inventoryColletion.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.search = new Model.IssueInventoryAc();
        }
        else {
            controllerScope.search = new Model.IssueInventoryAc();
            controllerScope.errorMessageDisplayForBlankList = false;
        }
    };
    InventoryRecordController.prototype.serchItemDetails = function () {
        var searching = [];
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.itemErrorMessage = false;
        //create sub Item Search List;
        var subItemSearch = [];
        if (controllerScope.itemSearchCollection.length > 0) {
            for (var i = 0; i < controllerScope.itemSearchCollection.length; i++) {
                if (controllerScope.itemSearchCollection[i].listOfChildProfileAC !== null && controllerScope.itemSearchCollection[i].listOfChildProfileAC !== undefined) {
                    for (var j = 0; j < controllerScope.itemSearchCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.itemSearchCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }
        if (controllerScope.itemSearch.ItemNameEn !== "" || controllerScope.itemSearch.Barcode !== "" || controllerScope.itemSearch.Code !== "" || controllerScope.itemSearch.FlavourEn !== "") {
            searching = this.filterFilter((subItemSearch), controllerScope.itemSearch);
            controllerScope.itemCollection = this.filterFilter((controllerScope.itemSearchCollection), controllerScope.itemSearch);
        }
        else {
            controllerScope.itemCollection = controllerScope.itemSearchCollection;
        }
        if (controllerScope.itemCollection.length === 0 && searching.length === 0) {
            controllerScope.itemErrorMessage = true;
        }
        else {
            if (searching !== undefined && searching !== null && searching.length !== 0) {
                for (var i = 0; i < controllerScope.itemSearchCollection.length; i++) {
                    for (var j = 0; j < searching.length; j++) {
                        if (controllerScope.itemSearchCollection[i].Id === searching[j].ParentItemId) {
                            var isAlreadyExists = true;
                            for (var k = 0; k < controllerScope.itemCollection.length; k++) {
                                if (controllerScope.itemCollection[k].Id === controllerScope.itemSearchCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemCollection.push(controllerScope.itemSearchCollection[i]);
                        }
                    }
                }
            }
            controllerScope.itemErrorMessage = false;
        }
        controllerScope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
    };
    InventoryRecordController.prototype.getAllInvetoryType = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.inventoryTypeCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.getAllInvetoryType();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerRootScope.isLoading = false;
            }
            else {
                _this.$log.log("get inventory type succssfully");
                for (var i = 0; i < result.length; i++) {
                    controllerScope.inventoryTypeCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerRootScope.isLoading = false;
                _this.$log.log(error);
            }
            _this.$log.log(error);
        });
    };
    InventoryRecordController.prototype.cancelIssueInventory = function () {
        var controllerScope = this.$scope;
        this.$location.path("/InventoryRecorderWorkList/");
    };
    InventoryRecordController.prototype.viewIssueStockInventoryRecordDetailsById = function (issueInventoryId) {
        var controllerScope = this.$scope;
        this.$location.path("/InventoryRecorder/" + issueInventoryId);
    };
    InventoryRecordController.prototype.getInventoryRecorderDetailsById = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var issueInventoryId = this.$routeParams.id;
        controllerScope.isDataLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        var promise = this.issueStockInventoryService.getInventoryRecorderDetailsById(issueInventoryId);
        promise.then(function (result) {
            if (result.IsNullResult) {
                controllerScope.inventoryRecordErrorMessage = true;
            }
            else {
                controllerScope.inventoryRecordErrorMessage = false;
                controllerScope.issueInventoryDetails = result;
                controllerScope.issueInventoryDetails.Quantity = "";
                controllerScope.issueInventoryDetails.Barcode = "";
            }
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
        });
    };
    InventoryRecordController.prototype.getItemListByIssueInventoryId = function (issueInventoryId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemCollection = [];
        controllerScope.itemSearchCollection = [];
        var promise = this.issueStockInventoryService.getItemListByIssueInventoryId(issueInventoryId);
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.itemErrorMessage = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.itemCollection.push(result[i]);
                }
                controllerScope.itemErrorMessage = false;
                controllerScope.issueInventoryDetails.Barcode = "";
                controllerScope.issueInventoryDetails.ItemDetails = null;
                controllerScope.itemSearchCollection = controllerScope.itemCollection;
                _this.itemDetailsModelDialogBox = _this.$modal.open({
                    templateUrl: 'itemDetailsDialogBox',
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    scope: _this.$scope
                });
                controllerScope.isDialogBoxOpen = true;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerRootScope.isLoading = false;
                _this.$log.log(error);
            }
            _this.$log.log(error);
        });
    };
    InventoryRecordController.prototype.closeItemDetailModelDialogBox = function () {
        this.itemDetailsModelDialogBox.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.issueInventoryDetails.Barcode = "";
    };
    InventoryRecordController.prototype.getItemDetailsByItemBarcode = function (barcode) {
        var _this = this;
        if (!(isNaN(barcode))) {
            var controllerScope_1 = this.$scope;
            var controllerRootScope = this.$rootScope;
            controllerScope_1.isDataLoading = true;
            controllerScope_1.issueInventoryDetails.Barcode = barcode;
            controllerScope_1.issueInventoryDetails.ItemDetails = null;
            var promise = this.issueStockInventoryService.getItemDetailsByItemBarcode(controllerScope_1.issueInventoryDetails);
            promise.then(function (result) {
                if (controllerScope_1.isDialogBoxOpen) {
                    controllerScope_1.issueInventoryDetails.Barcode = "";
                    _this.closeItemDetailModelDialogBox();
                }
                controllerScope_1.isDialogBoxOpen = false;
                if (result.IsResultNull) {
                    controllerScope_1.isDataLoading = false;
                    controllerScope_1.errorMessageDisplayForBlankList = true;
                    controllerScope_1.errorMessage = stringConstants.errorMessage;
                }
                else {
                    controllerScope_1.errorMessageDisplayForBlankList = false;
                    controllerScope_1.isDataLoading = false;
                    controllerScope_1.issueInventoryDetails.ItemDetails = result;
                    controllerScope_1.issueInventoryDetails.IsQuantityDisabled = false;
                    controllerScope_1.issueInventoryDetails.Barcode = result.Barcode;
                    _this.$log.log("get item details Succssfully");
                }
            }).catch(function (error) {
                location.replace(_this.apiPath);
                _this.$log.log(error);
            });
        }
    };
    InventoryRecordController.prototype.addIssueInventoryRecordDetails = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (controllerScope.issueInventoryDetails.Quantity !== "" && !isNaN(controllerScope.issueInventoryDetails.Quantity)) {
            if (controllerScope.isAllowEnterKey) {
                if (controllerScope.issueInventoryDetails.Barcode === null || controllerScope.issueInventoryDetails.Barcode === undefined || controllerScope.issueInventoryDetails.Barcode === "") {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.SelectItemorBarcode
                    });
                }
                else {
                    controllerScope.isAllowEnterKey = false;
                    controllerRootScope.isLoading = true;
                    controllerScope.unmatchedItemDetails = "";
                    var promise = this.issueStockInventoryService.addIssueInventoryRecordDetails(controllerScope.issueInventoryDetails);
                    promise.then(function (result) {
                        var moniterPath = "#/InventoryMonitor/" + controllerScope.issueInventoryDetails.IssueStockInventoryId;
                        _this.$log.log("add issue inventory recored successfully", result);
                        _this.inventoryHubServices.viewInventoryDetails(controllerScope.issueInventoryDetails.IssueStockInventoryId, moniterPath);
                        controllerScope.isAllowEnterKey = true;
                        controllerScope.issueInventoryDetails.ItemDetails.ItemRecordCount = result.ItemDetails.ItemRecordCount;
                        controllerScope.issueInventoryDetails.Quantity = "";
                        controllerRootScope.isLoading = false;
                    }).catch(function (error) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.SelectItemorBarcode
                        });
                        _this.$log.log(error);
                    });
                }
            }
        }
        else {
            return;
        }
    };
    InventoryRecordController.prototype.closeUnmatchedItemWarnigDialogBox = function () {
        this.openUnmatchedItemWarnigDialogBox.dismiss('cancel');
    };
    InventoryRecordController.prototype.getSubItemList = function (parentId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
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
        controllerRootScope.isLoading = false;
    };
    return InventoryRecordController;
}());
InventoryRecordController.controllerId = "inventoryRecordController";
app.controller(InventoryRecordController.controllerId, ['$scope', '$log', '$location', 'issueStockInventoryService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', 'inventoryHubServices', function ($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, inventoryHubServices) {
        return new InventoryRecordController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, inventoryHubServices);
    }]);
//# sourceMappingURL=inventoryRecordController.js.map
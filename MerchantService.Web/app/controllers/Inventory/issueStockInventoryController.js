// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var IssueStockInventoryController = (function () {
    function IssueStockInventoryController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, $route) {
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
        this.$route = $route;
        this.$scope.getAllInvetoryType = function () { return _this.getAllInvetoryType(); };
        this.$scope.inventoryTypeCollection = [];
        this.$scope.issueInventoryDetails = new Model.IssueInventoryAc();
        this.$scope.supplierCollection = [];
        this.$scope.categoryCollection = [];
        this.$scope.isErrorMessageDisplay = false;
        this.$scope.errorMessage = "";
        this.$scope.branchList = [];
        this.$scope.changeInventoryType = function (inventoryType) { return _this.changeInventoryType(inventoryType); };
        this.$scope.closeInventoryDetailDialogBox = function () { return _this.closeInventoryDetailDialogBox(); };
        this.$scope.isSupplierPanelVisible = false;
        this.$scope.inventoryDetailsCollection = [];
        this.$scope.itemsPerPage = 1;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$rootScope.ParamId = 0;
        this.$scope.isCategoryPanelVisible = false;
        this.$scope.isItemPanelVisible = false;
        this.$scope.itemCollection = [];
        this.$scope.subItemCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.isItemGrid = false;
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        this.$scope.addSupplierName = function (supplierId) { return _this.addSupplierName(supplierId); };
        this.$scope.addItemBarcode = function (barcode, detailsId) { return _this.addItemBarcode(barcode, detailsId); };
        this.$scope.addCategoryName = function (categoryId) { return _this.addCategoryName(categoryId); };
        this.$scope.isIssueButtonDisabled = true;
        this.$scope.submitIssueStockInventory = function (issueInventoryDetails) { return _this.submitIssueStockInventory(issueInventoryDetails); };
        this.$scope.addIssueStockInventory = function () { return _this.addIssueStockInventory(); };
        this.$scope.getAllInventoryList = function () { return _this.getAllInventoryList(); };
        this.$scope.deleteIssueStockInventoryById = function (issueInventoryId) { return _this.deleteIssueStockInventoryById(issueInventoryId); };
        this.$scope.viewIssueStockInventoryDetailsById = function () { return _this.viewIssueStockInventoryDetailsById(); };
        this.$scope.deleteIssueStockInventory = function (issueInventoryDetails) { return _this.deleteIssueStockInventory(issueInventoryDetails); };
        this.$scope.closeIssueInventoryDeleteDialogBox = function () { return _this.closeIssueInventoryDeleteDialogBox(); };
        this.$scope.viewIssueStockInventoryDetails = function (issueInventoryId) { return _this.viewIssueStockInventoryDetails(issueInventoryId); };
        this.$scope.viewIssueStockInventoryMoniterDetails = function (issueInventoryId) { return _this.viewIssueStockInventoryMoniterDetails(issueInventoryId); };
        this.$scope.viewIssueStockInventoryMoniterDetailsById = function () { return _this.viewIssueStockInventoryMoniterDetailsById(); };
        this.$scope.cancelIssueInventory = function () { return _this.cancelIssueInventory(); };
        this.$scope.startIssueStockInventory = function (issueInventoryId) { return _this.startIssueStockInventory(issueInventoryId); };
        this.$scope.search = [];
        this.$scope.searchIssueInventoryDetails = function () { return _this.searchIssueInventoryDetails(); };
        this.$scope.customInventoryCollection = [];
        this.$scope.chartObject = [];
        this.$scope.isDispalyChartSection = false;
        this.$scope.isDisplayItemDetails = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.issuestockDeleteConfirmationMessage = stringConstants.issuestockDeleteConfirmationMessage;
        this.$scope.unmatchedItemResolvedCollection = stringConstants.unmatchedItemResolvedCollection;
        this.$rootScope.$on("innventoryMonitering", function (event, data) {
            if (location.hash === data.MoniterPath) {
                _this.viewIssueInventoryMoniterDetails(data.IssueInventoryId);
            }
            else {
                _this.$log.log("Invalid Url");
            }
        });
        this.$scope.reviewIssueStockInventoryById = function (issueInventoryDetails) { return _this.reviewIssueStockInventoryById(issueInventoryDetails); };
        this.$scope.issueStockInventoryApprovalById = function (issueInventoryDetails, status) { return _this.issueStockInventoryApprovalById(issueInventoryDetails, status); };
        this.$scope.submitIssueStockInventoryDetails = function (issueInventoryDetails) { return _this.submitIssueStockInventoryDetails(issueInventoryDetails); };
        this.$scope.reSubmitIssueStockInventory = function (issueInventoryDetails, status) { return _this.reSubmitIssueStockInventory(issueInventoryDetails, status); };
        this.$scope.inventoryItemCollection = [];
        this.$scope.isDataLoading = false;
        this.$scope.updateIssueInventoryDate = function (issueInventoryDetails) { return _this.updateIssueInventoryDate(issueInventoryDetails); };
        this.$scope.openStartDateFromModel = function (event) { return _this.openStartDateFromModel(event); };
        this.$scope.isOpenStartDateFromModel = false;
        this.$scope.serchSupllierDetails = function () { return _this.serchSupllierDetails(); };
        this.$scope.serchCategoryDetails = function () { return _this.serchCategoryDetails(); };
        this.$scope.supplierErrorMessage = false;
        this.$scope.categoryErrorMessage = false;
        this.$scope.itemErrorMessage = false;
        this.$scope.serchItemDetails = function () { return _this.serchItemDetails(); };
        this.$scope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "" };
        this.$scope.minStartDate = new Date();
        this.$scope.submitStockInventory = function () { return _this.submitStockInventory(); };
        this.$scope.updateIssueStockInventoryDate = function () { return _this.updateIssueStockInventoryDate(); };
        this.$scope.getUnmatchedItemListById = function (issueStockInventoryId) { return _this.getUnmatchedItemListById(issueStockInventoryId); };
        this.$scope.unmatchedItemCollection = [];
        this.$scope.unmatchedItemErrorMessage = false;
        this.$scope.closeUnmatchedItemDetailsModelDialogBox = function () { return _this.closeUnmatchedItemDetailsModelDialogBox(); };
        this.$scope.closeupdateInventoryDateDetailDialogBox = function () { return _this.closeupdateInventoryDateDetailDialogBox(); };
        this.$scope.isDateAlreadyExist = false;
        this.$scope.isCurrentDateAlreadyExist = false;
        this.$scope.isFullInventoryAlreadyExist = false;
        this.$scope.inventoryErrorMessage = "";
        this.$scope.branchModel = [];
        this.$scope.isBranchConflict = false;
        this.$scope.checkConflictBranchSelectedOrNot = function () { return _this.checkConflictBranchSelectedOrNot(); };
        this.$scope.submitConflictBranchIssueInventory = function (issueInventoryDetails) { return _this.submitConflictBranchIssueInventory(issueInventoryDetails); };
        this.$scope.issueInventoryDetails.StartingDate = new Date();
        this.$scope.isAllowToReRecord = false;
        this.$scope.reRecordSelectedItemDetails = function () { return _this.reRecordSelectedItemDetails(); };
        this.$scope.issueInventoryUnmatchedItem = new Model.IssueInventoryUnmatchedItemAc();
        this.$scope.checkRerecordItem = function () { return _this.checkRerecordItem(); };
        this.$scope.clearIssueInventory = function () { return _this.clearIssueInventory(); };
        this.initialize();
    }
    IssueStockInventoryController.prototype.initialize = function () {
        this.getBranchList();
        this.getSupplierList();
        this.getCateGoryList();
    };
    //this method used for issue date to date Picker 
    IssueStockInventoryController.prototype.openStartDateFromModel = function (event) {
        var controllerScope = this.$scope;
        event.preventDefault();
        event.stopPropagation();
        controllerScope.isOpenStartDateFromModel = true;
    };
    IssueStockInventoryController.prototype.getAllInvetoryType = function () {
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
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerScope.supplierOtherCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.supplierErrorMessage = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            }
            else {
                controllerScope.supplierErrorMessage = false;
                _this.$log.log("get supplier succssfully");
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }
                controllerScope.supplierOtherCollection = controllerScope.supplierCollection;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getAllSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerScope.supplierOtherCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.supplierErrorMessage = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            }
            else {
                controllerScope.supplierErrorMessage = false;
                _this.$log.log("get supplier succssfully");
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }
                controllerScope.supplierOtherCollection = controllerScope.supplierCollection;
                controllerRootScope.isLoading = false;
                _this.openModelDialogBox();
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getAllCateGoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.categoryCollection = [];
        controllerScope.categoryOtherCollection = [];
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
                controllerScope.categoryOtherCollection = controllerScope.categoryCollection;
                controllerRootScope.isLoading = false;
                _this.openModelDialogBox();
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getCateGoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.categoryCollection = [];
        controllerScope.categoryOtherCollection = [];
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
                controllerScope.categoryOtherCollection = controllerScope.categoryCollection;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.issueStockInventoryService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name, BranchId: result[i].Id });
                }
                _this.$log.log("get branch list successfully");
                _this.getAllInvetoryType();
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
    IssueStockInventoryController.prototype.changeInventoryType = function (inventoryType) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isIssueButtonDisabled = true;
        controllerScope.inventoryItemCollection = [];
        controllerScope.issueInventoryDetails.CategoryId = "";
        controllerScope.issueInventoryDetails.SupplierId = "";
        controllerScope.issueInventoryDetails.Barcode = "";
        for (var i = 0; i < controllerScope.inventoryTypeCollection.length; i++) {
            if (controllerScope.inventoryTypeCollection[i].ParamTypeId === inventoryType) {
                if (controllerScope.inventoryTypeCollection[i].ValueEn === "Supplier Inventory") {
                    controllerScope.isSupplierPanelVisible = true;
                    controllerScope.isCategoryPanelVisible = false;
                    controllerScope.isItemPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getAllSupplierList();
                    break;
                }
                else if (controllerScope.inventoryTypeCollection[i].ValueEn === "Category Inventory") {
                    controllerScope.isCategoryPanelVisible = true;
                    controllerScope.isItemPanelVisible = false;
                    controllerScope.isSupplierPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getAllCateGoryList();
                    break;
                }
                else if (controllerScope.inventoryTypeCollection[i].ValueEn === "Item Inventory") {
                    controllerScope.isItemPanelVisible = true;
                    controllerScope.isCategoryPanelVisible = false;
                    controllerScope.isSupplierPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getAllItemList();
                    break;
                }
                else {
                    controllerScope.isItemPanelVisible = false;
                    controllerScope.isCategoryPanelVisible = false;
                    controllerScope.isIssueButtonDisabled = false;
                    controllerScope.isSupplierPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getItemDetailsById(controllerRootScope.ParamId, 0);
                    break;
                }
            }
        }
    };
    IssueStockInventoryController.prototype.openModelDialogBox = function () {
        this.inventoryDetailModelDialogBox = this.$modal.open({
            templateUrl: 'inventoryTypeDetails',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            scope: this.$scope
        });
    };
    IssueStockInventoryController.prototype.closeInventoryDetailDialogBox = function () {
        this.inventoryDetailModelDialogBox.dismiss('cancel');
    };
    IssueStockInventoryController.prototype.getAllItemList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        controllerScope.itemCollection = [];
        controllerScope.subItemCollection = [];
        controllerScope.itemOtherCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var promise = this.issueStockInventoryService.getItemProfileList();
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
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
                        controllerScope.itemCollection.push(result[i]);
                    }
                    controllerScope.itemOtherCollection = controllerScope.itemCollection;
                    controllerScope.isDataLoading = false;
                    _this.openModelDialogBox();
                }
                else {
                    controllerScope.itemErrorMessage = true;
                    controllerScope.isItemGrid = false;
                    controllerScope.isDataLoading = false;
                }
            }
            else {
                controllerScope.itemErrorMessage = true;
                controllerScope.isItemGrid = false;
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
    IssueStockInventoryController.prototype.getSubItemList = function (parentId) {
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
    IssueStockInventoryController.prototype.addSupplierName = function (supplierId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails.SupplierId = supplierId;
        controllerScope.issueInventoryDetails.CategoryId = "";
        controllerScope.issueInventoryDetails.Barcode = "";
        controllerScope.isIssueButtonDisabled = false;
        this.getItemDetailsById(controllerRootScope.ParamId, supplierId);
        this.closeInventoryDetailDialogBox();
    };
    IssueStockInventoryController.prototype.addItemBarcode = function (barcode, detailsId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails.Barcode = barcode;
        controllerScope.issueInventoryDetails.SupplierId = "";
        controllerScope.issueInventoryDetails.CategoryId = "";
        controllerScope.isIssueButtonDisabled = false;
        this.getItemDetailsById(controllerRootScope.ParamId, detailsId);
        this.closeInventoryDetailDialogBox();
    };
    IssueStockInventoryController.prototype.addCategoryName = function (categoryId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails.CategoryId = categoryId;
        controllerScope.issueInventoryDetails.SupplierId = "";
        controllerScope.issueInventoryDetails.Barcode = "";
        controllerScope.isIssueButtonDisabled = false;
        this.getItemDetailsById(controllerRootScope.ParamId, categoryId);
        this.closeInventoryDetailDialogBox();
    };
    IssueStockInventoryController.prototype.submitIssueStockInventory = function (issueInventoryDetails) {
        var _this = this;
        var that = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isBranchConflict = false;
        this.$log.log("submit issue stockinventory", issueInventoryDetails);
        issueInventoryDetails.StartingDate = new Date(issueInventoryDetails.StartingDate.getFullYear(), issueInventoryDetails.StartingDate.getMonth(), issueInventoryDetails.StartingDate.getDate(), issueInventoryDetails.StartingDate.getHours(), issueInventoryDetails.StartingDate.getMinutes());
        issueInventoryDetails.BranchList = controllerScope.branchModel;
        var promise = this.issueStockInventoryService.submitIssueStockInventory(issueInventoryDetails);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.$log.log("submit issue stock inventory successfully", result);
            if (result.CompletedStatus === "Branch conflict") {
                controllerScope.isBranchConflict = true;
                controllerScope.issueInventoryDetails.BranchList = result.BranchList;
            }
            else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.initiateInventory
                });
                controllerScope.isDisplayItemDetails = false;
                _this.$location.path("/StockInventory/");
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
    IssueStockInventoryController.prototype.addIssueStockInventory = function () {
        this.$location.path("/IssueStockInventory/");
    };
    IssueStockInventoryController.prototype.getAllInventoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryColletion = [];
        controllerScope.customInventoryCollection = [];
        var promise = this.issueStockInventoryService.getAllInventoryList();
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
    IssueStockInventoryController.prototype.searchIssueInventoryDetails = function () {
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
    IssueStockInventoryController.prototype.deleteIssueStockInventoryById = function (issueInventoryId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.deleteIssueStockInventoryById(issueInventoryId);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.$log.log("delete issue stock inventory request successfully");
            _this.closeIssueInventoryDeleteDialogBox();
            _this.getAllInventoryList();
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.viewIssueStockInventoryDetailsById = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var issueInventoryId = this.$routeParams.id;
        controllerScope.isDataLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        var promise = this.issueStockInventoryService.viewIssueStockInventoryDetailsById(issueInventoryId);
        promise.then(function (result) {
            controllerScope.issueInventoryDetails = result;
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.deleteIssueStockInventory = function (issueInventoryDetails) {
        var controllerScope = this.$scope;
        this.inventoryDeleteModelDialogBox = this.$modal.open({
            templateUrl: 'deleteIssueInventory',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        controllerScope.issueInventoryDetails = issueInventoryDetails;
    };
    IssueStockInventoryController.prototype.closeIssueInventoryDeleteDialogBox = function () {
        this.inventoryDeleteModelDialogBox.dismiss('cancel');
    };
    IssueStockInventoryController.prototype.viewIssueStockInventoryDetails = function (issueInventoryId) {
        this.$location.path("/InventoryInvestigation/" + issueInventoryId);
    };
    IssueStockInventoryController.prototype.viewIssueStockInventoryMoniterDetails = function (issueInventoryId) {
        this.$location.path("/InventoryMonitorDetails/" + issueInventoryId);
    };
    IssueStockInventoryController.prototype.viewIssueInventoryMoniterDetails = function (issueInventoryId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        var promise = this.issueStockInventoryService.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        promise.then(function (result) {
            controllerScope.issueInventoryDetails = result;
            controllerScope.chartObject.type = "ColumnChart";
            var chartCollection = [];
            if (result.InventoryRecorderCollection !== null && result.InventoryRecorderCollection !== undefined) {
                controllerScope.isDispalyChartSection = true;
                for (var i = 0; i < result.InventoryRecorderCollection.length; i++) {
                    var chartobj = {};
                    chartobj.c = [];
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].UserName });
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].Process });
                    chartCollection.push(chartobj);
                }
                controllerScope.chartObject.data = {
                    "cols": [
                        { id: "t", label: stringConstants.ChartLabelUsername, type: "string" },
                        { id: "s", label: stringConstants.ChartLabelQtyProgress, type: "number" }
                    ],
                    "rows": chartCollection
                };
            }
            else {
                _this.$log.log("No Record Found");
                controllerScope.isDispalyChartSection = false;
            }
            _this.$log.log("get the issue inventory detail succssfully");
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.viewInventoryMoniterDetails = function (issueInventoryId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        var promise = this.issueStockInventoryService.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        promise.then(function (result) {
            controllerScope.issueInventoryDetails = result;
            controllerScope.chartObject.type = "ColumnChart";
            var chartCollection = [];
            if (result.InventoryRecorderCollection !== null && result.InventoryRecorderCollection !== undefined) {
                controllerScope.isDispalyChartSection = true;
                for (var i = 0; i < result.InventoryRecorderCollection.length; i++) {
                    var chartobj = {};
                    chartobj.c = [];
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].UserName });
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].Process });
                    chartCollection.push(chartobj);
                }
                controllerScope.chartObject.data = {
                    "cols": [
                        { id: "t", label: stringConstants.ChartLabelUsername, type: "string" },
                        { id: "s", label: stringConstants.ChartLabelQtyProgress, type: "number" }
                    ],
                    "rows": chartCollection
                };
            }
            else {
                _this.$log.log("No Record Found");
                controllerScope.isDispalyChartSection = false;
            }
            controllerRootScope.isLoading = false;
            _this.$log.log("get the issue inventory detail succssfully");
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.viewIssueStockInventoryMoniterDetailsById = function () {
        var _this = this;
        var issueInventoryId = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        var promise = this.issueStockInventoryService.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        promise.then(function (result) {
            controllerScope.issueInventoryDetails = result;
            controllerScope.chartObject.type = "ColumnChart";
            var chartCollection = [];
            if (result.InventoryRecorderCollection !== null && result.InventoryRecorderCollection !== undefined) {
                controllerScope.isDispalyChartSection = true;
                for (var i = 0; i < result.InventoryRecorderCollection.length; i++) {
                    var chartobj = {};
                    chartobj.c = [];
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].UserName });
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].Process });
                    chartCollection.push(chartobj);
                }
                controllerScope.chartObject.data = {
                    "cols": [
                        { id: "t", label: stringConstants.ChartLabelUsername, type: "string" },
                        { id: "s", label: stringConstants.ChartLabelQtyProgress, type: "number" }
                    ], "rows": chartCollection
                };
            }
            else {
                controllerScope.isDispalyChartSection = false;
                _this.$log.log("No Record Found");
            }
            controllerScope.isDataLoading = false;
            _this.$log.log("get the issue inventory detail succssfully");
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.cancelIssueInventory = function () {
        var that = this;
        var currentPath = that.$location.path().split('/');
        if (currentPath[1] === "InventoryMonitor") {
            this.$location.path("/InventoryMonitorWorkList/");
        }
        else {
            this.$location.path("/StockInventory/");
        }
    };
    IssueStockInventoryController.prototype.startIssueStockInventory = function (issueInventoryId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.startIssueStockInventory(issueInventoryId);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.$log.log("start issue stock inventory request successfully");
            _this.$location.path("/StockInventory/");
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.submitIssueStockInventoryDetails = function (issueInventoryDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var that = this;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.submitIssueStockInventoryDetails(issueInventoryDetails);
        promise.then(function (result) {
            _this.$log.log("submit issue stock inventory successfully", result);
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.submitInventory
                });
                that.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            location.replace(_this.apiPath);
        });
    };
    IssueStockInventoryController.prototype.reviewIssueStockInventoryById = function (issueInventoryDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var that = this;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.reviewIssueStockInventoryById(issueInventoryDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIssueInventory
                });
                that.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.issueStockInventoryApprovalById = function (issueInventoryDetails, status) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        issueInventoryDetails.IsStatus = status;
        var promise = this.issueStockInventoryService.issueStockInventoryApprovalById(issueInventoryDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                if (status) {
                    _this.ngToast.create({
                        className: 'success',
                        content: stringConstants.approvalIssueInventory
                    });
                }
                else {
                    _this.ngToast.create({
                        className: 'success',
                        content: stringConstants.rejectIssueInventory
                    });
                }
                _this.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getItemDetailsById = function (paramId, detailsId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.inventoryItemCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.getItemDetailsById(paramId, detailsId);
        promise.then(function (result) {
            _this.$log.log("get item details successfully", result);
            if (result.length !== 0) {
                controllerScope.isDisplayItemDetails = true;
                for (var i = 0; i < result.length; i++) {
                    controllerScope.inventoryItemCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
            else {
                controllerScope.isDisplayItemDetails = false;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.reSubmitIssueStockInventory = function (issueInventoryDetails, status) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        issueInventoryDetails.IsStatus = status;
        var promise = this.issueStockInventoryService.reSubmitIssueStockInventory(issueInventoryDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                _this.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIssueInventory
                });
                _this.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.updateIssueInventoryDate = function (issueInventoryDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        var startDate = new Date(issueInventoryDetails.StartDate);
        controllerScope.isDateAlreadyExist = false;
        controllerScope.isCurrentDateAlreadyExist = false;
        controllerScope.isFullInventoryAlreadyExist = false;
        if (issueInventoryDetails.StartedDate === startDate.toLocaleDateString().split("/").join("-")) {
            controllerScope.isDataLoading = false;
            return;
        }
        else {
            issueInventoryDetails.StartDate = new Date(issueInventoryDetails.StartDate.getFullYear(), issueInventoryDetails.StartDate.getMonth(), issueInventoryDetails.StartDate.getDate(), issueInventoryDetails.StartDate.getHours(), issueInventoryDetails.StartDate.getMinutes());
            var promise = this.issueStockInventoryService.updateIssueInventoryDate(issueInventoryDetails);
            promise.then(function (result) {
                _this.$log.log("update date successfully", result);
                _this.$log.log("submit issue stock inventory successfully", result);
                if (result.status === "Already Exist") {
                    controllerScope.isDateAlreadyExist = true;
                    _this.openUpdateInventoryDateDetailDialogBox();
                    controllerScope.inventoryErrorMessage = stringConstants.dateAlreadyExist;
                }
                else if (result.status === "Current Date Already Exist") {
                    controllerScope.isCurrentDateAlreadyExist = true;
                    controllerScope.inventoryErrorMessage = stringConstants.currentDateAlreadyExist;
                }
                else if (result.status === "FullInventory Exist") {
                    controllerScope.isFullInventoryAlreadyExist = true;
                    controllerScope.inventoryErrorMessage = stringConstants.fullInventoryAlreadyExist;
                }
                else {
                    _this.viewIssueStockInventoryMoniterDetailsById();
                }
                controllerScope.isDataLoading = false;
            }).catch(function (error) {
                if (error.data === "") {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
                _this.$log.log(error);
            });
        }
    };
    IssueStockInventoryController.prototype.openUpdateInventoryDateDetailDialogBox = function () {
        this.updateInventoryDateDetailsModel = this.$modal.open({
            templateUrl: 'updateInventoryDateDetails',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
    };
    IssueStockInventoryController.prototype.serchSupllierDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.supplierCollection = this.filterFilter((controllerScope.supplierOtherCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.supplierCollection.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.supplierErrorMessage = true;
            controllerScope.search = [];
        }
        else {
            controllerScope.search = [];
            controllerScope.supplierErrorMessage = false;
        }
    };
    IssueStockInventoryController.prototype.serchCategoryDetails = function () {
        var controllerScope = this.$scope;
        controllerScope.categoryCollection = this.filterFilter((controllerScope.categoryOtherCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.categoryCollection.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.categoryErrorMessage = true;
            controllerScope.search = [];
        }
        else {
            controllerScope.search = [];
            controllerScope.categoryErrorMessage = false;
        }
    };
    IssueStockInventoryController.prototype.serchItemDetails = function () {
        var searching = [];
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.itemErrorMessage = false;
        //create sub Item Search List;
        var subItemSearch = [];
        if (controllerScope.itemOtherCollection.length > 0) {
            for (var i = 0; i < controllerScope.itemOtherCollection.length; i++) {
                if (controllerScope.itemOtherCollection[i].listOfChildProfileAC !== null && controllerScope.itemOtherCollection[i].listOfChildProfileAC !== undefined) {
                    for (var j = 0; j < controllerScope.itemOtherCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.itemOtherCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }
        if (controllerScope.itemSearch.ItemNameEn !== "" || controllerScope.itemSearch.Barcode !== "" || controllerScope.itemSearch.Code !== "") {
            searching = this.filterFilter((subItemSearch), controllerScope.itemSearch);
            controllerScope.itemCollection = this.filterFilter((controllerScope.itemOtherCollection), controllerScope.itemSearch);
        }
        else {
            controllerScope.itemCollection = controllerScope.itemOtherCollection;
        }
        if (controllerScope.itemCollection.length === 0 && searching.length === 0) {
            controllerScope.itemErrorMessage = true;
            controllerScope.isItemGrid = false;
        }
        else {
            if (searching !== undefined && searching !== null && searching.length !== 0) {
                for (var i = 0; i < controllerScope.itemOtherCollection.length; i++) {
                    for (var j = 0; j < searching.length; j++) {
                        if (controllerScope.itemOtherCollection[i].Id === searching[j].ParentItemId) {
                            var isAlreadyExists = true;
                            for (var k = 0; k < controllerScope.itemCollection.length; k++) {
                                if (controllerScope.itemCollection[k].Id === controllerScope.itemOtherCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemCollection.push(controllerScope.itemOtherCollection[i]);
                        }
                    }
                }
            }
            controllerScope.itemErrorMessage = false;
            controllerScope.isItemGrid = true;
        }
        controllerScope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "" };
    };
    IssueStockInventoryController.prototype.submitStockInventory = function () {
        var _this = this;
        var that = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var issueInventoryDetails = controllerScope.issueInventoryDetails;
        var promise = this.issueStockInventoryService.submitStockInventory(issueInventoryDetails);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.$log.log("submit issue stock inventory successfully", result);
            _this.$location.path("/StockInventory/");
            controllerScope.isDisplayItemDetails = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    IssueStockInventoryController.prototype.submitConflictBranchIssueInventory = function (issueInventoryDetails) {
        var _this = this;
        var that = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.issueStockInventoryService.submitConflictBranchIssueInventory(issueInventoryDetails);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.$log.log("submit issue stock inventory successfully", result);
            _this.$location.path("/StockInventory/");
            controllerScope.isDisplayItemDetails = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    IssueStockInventoryController.prototype.closeupdateInventoryDateDetailDialogBox = function () {
        var that = this;
        var controllerScope = this.$scope;
        that.updateInventoryDateDetailsModel.dismiss('cancel');
        if (controllerScope.isFullInventoryAlreadyExist || controllerScope.isCurrentDateAlreadyExist || controllerScope.isDateAlreadyExist) {
            this.viewIssueStockInventoryMoniterDetailsById();
        }
    };
    IssueStockInventoryController.prototype.updateIssueStockInventoryDate = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        var issueInventoryDetails = controllerScope.issueInventoryDetails;
        issueInventoryDetails.StartDate = new Date(issueInventoryDetails.StartDate.getFullYear(), issueInventoryDetails.StartDate.getMonth(), issueInventoryDetails.StartDate.getDate(), issueInventoryDetails.StartDate.getHours(), issueInventoryDetails.StartDate.getMinutes());
        var promise = this.issueStockInventoryService.updateIssueStockInventoryDate(issueInventoryDetails);
        promise.then(function (result) {
            _this.$log.log("update date successfully", result);
            controllerScope.isDateAlreadyExist = false;
            controllerScope.isCurrentDateAlreadyExist = false;
            controllerScope.isFullInventoryAlreadyExist = false;
            _this.viewIssueStockInventoryMoniterDetailsById();
            _this.closeupdateInventoryDateDetailDialogBox();
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.getUnmatchedItemListById = function (issueStockInventoryId) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        controllerScope.unmatchedItemCollection = [];
        var promise = this.issueStockInventoryService.getUnmatchedItemListById(issueStockInventoryId);
        promise.then(function (result) {
            _this.$log.log("get unmatchde item successfully", result);
            if (result.length === 0) {
                controllerScope.unmatchedItemErrorMessage = true;
            }
            else {
                controllerScope.unmatchedItemErrorMessage = false;
                controllerScope.isAllowToReRecord = result.IsRerecord;
                for (var i = 0; i < result.UnmatchedItemCollection.length; i++) {
                    controllerScope.unmatchedItemCollection.push(result.UnmatchedItemCollection[i]);
                }
            }
            _this.unmatchedItemModelDialogBox = _this.$modal.open({
                templateUrl: 'unmatchedItemDetails',
                backdrop: 'static',
                keyboard: true,
                scope: _this.$scope,
                size: 'lg'
            });
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IssueStockInventoryController.prototype.reRecordSelectedItemDetails = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var issueInventoryUnmatchedItem = controllerScope.issueInventoryUnmatchedItem;
        issueInventoryUnmatchedItem.IsRerecord = controllerScope.isAllowToReRecord;
        issueInventoryUnmatchedItem.UnmatchedItemCollection = controllerScope.unmatchedItemCollection;
        var promise = this.issueStockInventoryService.reRecordSelectedItemDetails(issueInventoryUnmatchedItem);
        promise.then(function (result) {
            _this.$log.log("re-record successfully", result);
            _this.closeUnmatchedItemDetailsModelDialogBox();
            controllerRootScope.isLoading = false;
            _this.$location.path("/InventoryRecorder/" + _this.$routeParams.id);
        });
    };
    IssueStockInventoryController.prototype.closeUnmatchedItemDetailsModelDialogBox = function () {
        this.unmatchedItemModelDialogBox.dismiss('cancel');
    };
    IssueStockInventoryController.prototype.checkConflictBranchSelectedOrNot = function () {
        var flag = false;
        var controllerScope = this.$scope;
        if (controllerScope.isBranchConflict) {
            if (controllerScope.issueInventoryDetails.BranchList.length !== 0) {
                for (var i = 0; i < controllerScope.issueInventoryDetails.BranchList.length; i++) {
                    if (!controllerScope.issueInventoryDetails.BranchList[i].IsAlreadyExist) {
                        if (controllerScope.issueInventoryDetails.BranchList[i].IsInventorySelected === true && controllerScope.issueInventoryDetails.BranchList[i].IsInventorySelected !== undefined
                            && controllerScope.issueInventoryDetails.BranchList[i].IsInventorySelected !== null) {
                            flag = true;
                            break;
                        }
                        else {
                            flag = false;
                        }
                    }
                }
            }
            return flag;
        }
    };
    IssueStockInventoryController.prototype.checkRerecordItem = function () {
        var flag = false;
        var controllerScope = this.$scope;
        if (controllerScope.unmatchedItemCollection.length !== 0) {
            for (var i = 0; i < controllerScope.unmatchedItemCollection.length; i++) {
                if (controllerScope.unmatchedItemCollection[i].IsRerecord === true && controllerScope.unmatchedItemCollection[i].IsRerecord !== undefined
                    && controllerScope.unmatchedItemCollection[i].IsRerecord !== null) {
                    flag = true;
                    break;
                }
                else {
                    flag = false;
                }
            }
        }
        return flag;
    };
    IssueStockInventoryController.prototype.clearIssueInventory = function () {
        this.$route.reload();
    };
    return IssueStockInventoryController;
}());
IssueStockInventoryController.controllerId = "issueStockInventoryController";
app.controller(IssueStockInventoryController.controllerId, ['$scope', '$log', '$location', 'issueStockInventoryService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', '$route', function ($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, $route) {
        return new IssueStockInventoryController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, $route);
    }]);
//# sourceMappingURL=issueStockInventoryController.js.map
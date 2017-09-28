// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var InventoryMoniterController = (function () {
    function InventoryMoniterController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast) {
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
        this.$scope.isAllowMoniterView = false;
        this.$scope.viewIssueStockInventoryMoniterDetailsById = function (issueInventoryId) { return _this.viewIssueStockInventoryMoniterDetailsById(issueInventoryId); };
        this.$scope.cancelIssueInventory = function () { return _this.cancelIssueInventory(); };
        this.$scope.customInventoryCollection = [];
        this.$scope.search = new Model.IssueInventoryAc();
        this.$scope.searchIssueInventoryDetails = function () { return _this.searchIssueInventoryDetails(); };
        this.$scope.isDataLoading = false;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.initialize();
    }
    InventoryMoniterController.prototype.initialize = function () {
        this.getAllSupplierList();
        this.getBranchList();
    };
    InventoryMoniterController.prototype.getAllSupplierList = function () {
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
    InventoryMoniterController.prototype.getAllCateGoryList = function () {
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
    InventoryMoniterController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
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
    InventoryMoniterController.prototype.getAllInventoryList = function () {
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
    InventoryMoniterController.prototype.searchIssueInventoryDetails = function () {
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
    InventoryMoniterController.prototype.getAllInvetoryType = function () {
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
    InventoryMoniterController.prototype.cancelIssueInventory = function () {
        var controllerScope = this.$scope;
        this.$location.path("/InventoryMonitorWorkList/");
    };
    InventoryMoniterController.prototype.viewIssueStockInventoryMoniterDetailsById = function (issueInventoryId) {
        var controllerScope = this.$scope;
        this.$location.path("/InventoryMonitor/" + issueInventoryId);
    };
    return InventoryMoniterController;
}());
InventoryMoniterController.controllerId = "inventoryMoniterController";
app.controller(InventoryMoniterController.controllerId, ['$scope', '$log', '$location', 'issueStockInventoryService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', function ($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast) {
        return new InventoryMoniterController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast);
    }]);
//# sourceMappingURL=inventoryMoniterController.js.map
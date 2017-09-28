var ItemDestructionRequestWorkListController = (function () {
    function ItemDestructionRequestWorkListController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.ItemDestructionService = ItemDestructionService;
        this.ngToast = ngToast;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$scope.branchList = [];
        this.$scope.search = [];
        this.$scope.supplierList = [];
        this.$scope.tempList = [];
        this.$scope.requestDate = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.itemDestructionWorkListCollection = [];
        this.$scope.maxSize = 10;
        this.$scope.isEndFromRequestDateOpened = false;
        this.$scope.editItemDestructionWorkList = function (destructionId) { return _this.editItemDestructionWorkList(destructionId); };
        this.$scope.isEndToRequestDateOpened = false;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.searchClick = function () { return _this.searchClick(); };
        this.$scope.openRequestDateFromPickerDate = function () { return _this.openRequestDateFromPickerDate(); };
        this.$scope.openRequestDateToPickerDate = function () { return _this.openRequestDateToPickerDate(); };
        this.$scope.destructioCasueList = stringConstants.destructioCasueList;
        this.$scope.noItemFound = stringConstants.noItemFound;
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.itemDestructionWorkListCollection.slice(begin, end);
        });
        this.initialization();
    }
    ItemDestructionRequestWorkListController.prototype.initialization = function () {
        this.getBranchList();
        this.getSupplierList();
        this.getItemDestructionWorkList();
    };
    //this function used for search click. -An
    ItemDestructionRequestWorkListController.prototype.searchClick = function () {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.errorMessageDisplayForBlankList = false;
        var requestEndFromDate;
        if (controllerScope.requestDate.requestEndFromDate !== undefined && controllerScope.requestDate.requestEndFromDate !== null) {
            var nowFrom = new Date(controllerScope.requestDate.requestEndFromDate); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
            requestEndFromDate = new Date(nowFrom.getTime() - nowFrom.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        var requestEndToDate;
        if (controllerScope.requestDate.requestEndToDate !== undefined && controllerScope.requestDate.requestEndToDate !== null) {
            var nowTo = new Date(controllerScope.requestDate.requestEndToDate);
            requestEndToDate = new Date(nowTo.getTime() - nowTo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        if (controllerScope.totalItemDestructionWorkListList.length > 0) {
            if (requestEndFromDate !== undefined && requestEndToDate !== undefined && requestEndFromDate !== null && requestEndToDate !== null) {
                for (var i = 0; i < controllerScope.totalItemDestructionWorkListList.length; i++) {
                    if (requestEndFromDate <= new Date(controllerScope.totalItemDestructionWorkListList[i].RequestedDate).toISOString().substr(0, 10)
                        && requestEndToDate >= new Date(controllerScope.totalItemDestructionWorkListList[i].RequestedDate).toISOString().substr(0, 10)) {
                        controllerScope.tempList.push(controllerScope.totalItemDestructionWorkListList[i]);
                    }
                }
            }
        }
        if (requestEndFromDate !== undefined && requestEndToDate !== undefined && requestEndFromDate !== null && requestEndToDate !== null) {
            if ((controllerScope.search.RequestNo !== undefined && controllerScope.search.RequestNo !== null) ||
                (controllerScope.search.BranchId !== undefined && controllerScope.search.BranchId !== null) ||
                (controllerScope.search.SupplierId !== undefined && controllerScope.search.SupplierId !== null) ||
                (controllerScope.search.CauseId !== undefined && controllerScope.search.CauseId !== null)) {
                controllerScope.itemDestructionWorkListCollection = this.filterFilter((controllerScope.tempList), controllerScope.search);
            }
            else
                controllerScope.itemDestructionWorkListCollection = controllerScope.tempList;
        }
        else {
            controllerScope.itemDestructionWorkListCollection = this.filterFilter((controllerScope.totalItemDestructionWorkListList), controllerScope.search);
        }
        if (controllerScope.itemDestructionWorkListCollection.length === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            var that = this;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.itemDestructionWorkListCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.itemDestructionWorkListCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
        controllerScope.tempList = [];
        controllerScope.requestDate = [];
        controllerRootScope.isLoading = false;
    };
    //this funciton used for get branch list -An
    ItemDestructionRequestWorkListController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.ItemDestructionService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
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
    //This function used for get supplier list. -An
    ItemDestructionRequestWorkListController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var promise = this.ItemDestructionService.getSupplierList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn });
                }
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
    //This function used for open request date from picker date. -An
    ItemDestructionRequestWorkListController.prototype.openRequestDateFromPickerDate = function () {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndFromRequestDateOpened = true;
    };
    //This funcion used for open request date to picker date. -An
    ItemDestructionRequestWorkListController.prototype.openRequestDateToPickerDate = function () {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndToRequestDateOpened = true;
    };
    //This fucniton used for get item destruction work list. -An
    ItemDestructionRequestWorkListController.prototype.getItemDestructionWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        this.$scope.errorMessageDisplayForBlankList = false;
        var controllerRootScope = this.$rootScope;
        controllerScope.itemDestructionWorkListCollection = [];
        var itemDestruction = controllerScope.itemDestructionWorkListCollection;
        //To get branch list
        var promise = this.ItemDestructionService.getItemDestructionRequest();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    itemDestruction.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = itemDestruction.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.itemDestructionWorkListCollection.length;
                controllerScope.totalItemDestructionWorkListList = controllerScope.itemDestructionWorkListCollection;
            }
            else
                _this.$scope.errorMessageDisplayForBlankList = true;
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
    //This funciton used for edit item destruction work list. -An
    ItemDestructionRequestWorkListController.prototype.editItemDestructionWorkList = function (destructionId) {
        this.$location.path("/ItemDestructionDetails/" + destructionId);
    };
    return ItemDestructionRequestWorkListController;
}());
ItemDestructionRequestWorkListController.controllerId = "ItemDestructionRequestWorkListController";
app.controller(ItemDestructionRequestWorkListController.controllerId, ['$scope', '$log', '$rootScope', 'ItemDestructionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', function ($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        return new ItemDestructionRequestWorkListController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
    }]);
//# sourceMappingURL=ItemDestructionRequestWorkListController.js.map
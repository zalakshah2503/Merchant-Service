var SupplierReturnWorkListController = (function () {
    function SupplierReturnWorkListController($scope, $log, supplierReturnWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $modal, $location) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.supplierReturnWorkListService = supplierReturnWorkListService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$filter = $filter;
        this.$modal = $modal;
        this.$location = $location;
        this.$scope.supplierReturnRequest = new Model.SupplierReturnRequest();
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.getCauseList = function () { return _this.getCauseList(); };
        this.$scope.supplierList = [];
        this.$scope.causeList = [];
        this.$scope.supplierReturnWorkList = [];
        this.$scope.supplierReturnList = [];
        this.$scope.getSupplierReturnWorkList = function () { return _this.getSupplierReturnWorkList(); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.branchList = [];
        this.$scope.searchWorkList = function () { return _this.searchWorkList(); };
        this.$scope.search = [];
        this.$scope.dateSearch = [];
        this.$scope.srrNotFound = stringConstants.srrNotFound;
        this.$scope.rejected = stringConstants.rejected;
        this.$scope.deleted = stringConstants.deleted;
        this.$scope.viewDetail = function (id) { return _this.viewDetail(id); };
        this.$scope.isRequestedDateFromPickerOpened = false;
        this.$scope.openRequestedDateFromPicker = function (event) { return _this.openRequestedDateFromPicker(event); };
        this.$scope.isRequestedDateToPickerOpened = false;
        this.$scope.openRequestedDateToPicker = function (event) { return _this.openRequestedDateToPicker(event); };
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 3;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.initialize();
    }
    SupplierReturnWorkListController.prototype.initialize = function () {
        this.getSupplierReturnWorkList();
        this.getSupplierList();
    };
    // used to fetch supplier list - jj
    SupplierReturnWorkListController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnWorkListService.getSupplierList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            _this.getCauseList();
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to fetch BranchList - jj
    SupplierReturnWorkListController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.supplierReturnWorkListService.getBranchList();
        promise.then(function (result) {
            controllerScope.branchList = result;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingBranch
            });
        });
    };
    //used to fetch list of return cause - jj
    SupplierReturnWorkListController.prototype.getCauseList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnWorkListService.getCauseList(35);
        promise.then(function (result) {
            controllerScope.causeList = result;
            _this.getBranchList();
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingReturnCauseList
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to fetch supplier return request workList - jj
    SupplierReturnWorkListController.prototype.getSupplierReturnWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnWorkListService.getSupplierReturnList();
        promise.then(function (result) {
            controllerScope.supplierReturnWorkList = result;
            controllerScope.supplierReturnList = result;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingSRRList
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to search supplier return request worklist- jj
    SupplierReturnWorkListController.prototype.searchWorkList = function () {
        var controllerScope = this.$scope;
        var count = 0;
        var list = [];
        var requestedDateFrom;
        var requestedDateTo;
        if (controllerScope.dateSearch.RequestedDateFrom !== null && controllerScope.dateSearch.RequestedDateFrom !== undefined) {
            requestedDateFrom = this.$filter('date')(controllerScope.dateSearch.RequestedDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.RequestedDateTo !== null && controllerScope.dateSearch.RequestedDateTo !== undefined) {
            requestedDateTo = this.$filter('date')(controllerScope.dateSearch.RequestedDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        controllerScope.supplierReturnWorkList = this.filterFilter(controllerScope.supplierReturnList, controllerScope.search);
        list = controllerScope.supplierReturnWorkList;
        controllerScope.supplierReturnWorkList = [];
        //if i create  list1 which contains list where initiationdate are greater than fromdate and then from list2 which dates are
        //less than todate , i have to run the loop twice, thus i am using a diff method
        if (count === 1) {
            for (var i = 0; i < list.length; i++) {
                var initiationDate = this.$filter('date')(list[i].InitiationDate, 'yyyy/MM/dd');
                if (requestedDateFrom !== null && requestedDateFrom !== undefined && requestedDateTo !== null && requestedDateTo !== undefined) {
                    if (requestedDateFrom <= initiationDate && requestedDateTo >= initiationDate) {
                        controllerScope.supplierReturnWorkList.push(list[i]);
                    }
                }
                else {
                    if ((requestedDateFrom <= initiationDate) || (requestedDateTo >= initiationDate)) {
                        controllerScope.supplierReturnWorkList.push(list[i]);
                    }
                }
            }
        }
        else {
            controllerScope.supplierReturnWorkList = list;
        }
        controllerScope.search = [];
        controllerScope.dateSearch = [];
    };
    // datepicker for search -jj
    SupplierReturnWorkListController.prototype.openRequestedDateFromPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateFromPickerOpened = true;
    };
    SupplierReturnWorkListController.prototype.openRequestedDateToPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateToPickerOpened = true;
    };
    //used to redirect to detail page - jj
    SupplierReturnWorkListController.prototype.viewDetail = function (id) {
        this.$location.path("/SupplierReturnRequestDetails/" + id);
    };
    return SupplierReturnWorkListController;
}());
SupplierReturnWorkListController.controllerId = "SupplierReturnWorkListController";
app.controller(SupplierReturnWorkListController.controllerId, ['$scope', '$log', 'SupplierReturnWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$modal', '$location', function ($scope, $log, SupplierReturnWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $modal, $location) {
        return new SupplierReturnWorkListController($scope, $log, SupplierReturnWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $modal, $location);
    }]);
//# sourceMappingURL=supplierReturnWorkListController.js.map
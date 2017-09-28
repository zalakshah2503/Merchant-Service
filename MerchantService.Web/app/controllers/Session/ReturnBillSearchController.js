var ReturnBillSearchController = (function () {
    function ReturnBillSearchController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.ReturnBillService = ReturnBillService;
        this.ngToast = ngToast;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.printer = printer;
        this.$scope.returnBillTotalCollection = [];
        this.$scope.tempList = [];
        this.$scope.returnDate = [];
        this.$scope.errorMessageDisplay = true;
        this.$scope.search = [];
        this.$scope.maxSize = 10;
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.printReturnBill = function (returnBillNumber) { return _this.printReturnBill(returnBillNumber); };
        this.$scope.openDateFromPickerDate = function (event) { return _this.openDateFromPickerDate(event); };
        this.$scope.openDateToPickerDate = function (event) { return _this.openDateToPickerDate(event); };
        this.$scope.isReturningDateFrom = false;
        this.$scope.isReturningDateTo = false;
        this.$scope.searchButtonClick = function () { return _this.searchButtonClick(); };
        this.$scope.noItemFound = stringConstants.noItemFound;
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.returnBillCollection.slice(begin, end);
        });
        this.initialization();
    }
    ReturnBillSearchController.prototype.initialization = function () {
        this.getReturnBillList();
    };
    ReturnBillSearchController.prototype.openDateFromPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isReturningDateFrom = true;
    };
    ReturnBillSearchController.prototype.openDateToPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isReturningDateTo = true;
    };
    ReturnBillSearchController.prototype.searchButtonClick = function () {
        var controllerScope = this.$scope;
        this.$rootScope.isLoading = true;
        controllerScope.errorMessageDisplay = false;
        var resturningFromDate;
        if (controllerScope.returnDate.resturningDateFrom !== undefined && controllerScope.returnDate.resturningDateFrom !== null) {
            var nowFrom = new Date(controllerScope.returnDate.resturningDateFrom); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
            resturningFromDate = new Date(nowFrom.getTime() - nowFrom.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        var resturningToDate;
        if (controllerScope.returnDate.resturningDateTo !== undefined && controllerScope.returnDate.resturningDateTo !== null) {
            var nowTo = new Date(controllerScope.returnDate.resturningDateTo);
            resturningToDate = new Date(nowTo.getTime() - nowTo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        if (controllerScope.returnBillTotalCollection.length > 0) {
            if (resturningFromDate !== undefined && resturningToDate !== undefined
                && resturningFromDate !== null && resturningToDate !== null) {
                for (var i = 0; i < controllerScope.returnBillTotalCollection.length; i++) {
                    if (resturningFromDate <= new Date(controllerScope.returnBillTotalCollection[i].ReturningDate).toISOString().substr(0, 10)
                        && resturningToDate >= new Date(controllerScope.returnBillTotalCollection[i].ReturningDate).toISOString().substr(0, 10)) {
                        controllerScope.tempList.push(controllerScope.returnBillTotalCollection[i]);
                    }
                }
            }
        }
        if (resturningFromDate !== undefined && resturningToDate !== undefined &&
            resturningFromDate !== null && resturningToDate !== null) {
            if ((controllerScope.search.CustomerName !== null && controllerScope.search.CustomerName !== undefined) ||
                (controllerScope.search.MembershipNumber !== null && controllerScope.search.MembershipNumber !== undefined) ||
                (controllerScope.search.ReturnBillNumber !== null && controllerScope.search.ReturnBillNumber !== undefined)) {
                controllerScope.returnBillCollection = this.filterFilter((controllerScope.tempList), controllerScope.search);
            }
            else
                controllerScope.returnBillCollection = controllerScope.tempList;
        }
        else {
            controllerScope.returnBillCollection = this.filterFilter((controllerScope.returnBillTotalCollection), controllerScope.search);
        }
        if (controllerScope.returnBillCollection.length === 0) {
            controllerScope.errorMessageDisplay = true;
            controllerScope.totalCollection = [];
        }
        else {
            var that = this;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.returnBillCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.returnBillCollection.length;
            controllerScope.errorMessageDisplay = false;
        }
        controllerScope.tempList = [];
        controllerScope.search = [];
        controllerScope.returnDate = [];
        this.$rootScope.isLoading = false;
    };
    //get return bill list.-An
    ReturnBillSearchController.prototype.getReturnBillList = function () {
        var _this = this;
        this.$scope.returnBillCollection = [];
        this.$rootScope.isLoading = true;
        var returnBill = this.$scope.returnBillCollection;
        var promise = this.ReturnBillService.getReturnBillDetailList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    returnBill.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                _this.$scope.totalCollection = returnBill.slice(begin, end);
                /* init pagination with $scope.list */
                _this.$scope.totalItems = _this.$scope.returnBillCollection.length;
                _this.$scope.returnBillTotalCollection = _this.$scope.returnBillCollection;
                _this.$scope.errorMessageDisplay = false;
            }
            else
                _this.$scope.errorMessageDisplay = true;
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This method usd for print return bill. -An
    ReturnBillSearchController.prototype.printReturnBill = function (returnBillNumber) {
        var _this = this;
        var promise = this.ReturnBillService.getReturnBillRecipt(returnBillNumber);
        promise.then(function (result) {
            if (result.isResult !== null && result.isResult !== undefined) {
                _this.printer.print("/Templates/Sales/ReturnBillReceipt.html", result.isResult);
            }
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    return ReturnBillSearchController;
}());
ReturnBillSearchController.controllerId = "ReturnBillSearchController";
app.controller(ReturnBillSearchController.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', function ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        return new ReturnBillSearchController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
    }]);
//# sourceMappingURL=ReturnBillSearchController.js.map
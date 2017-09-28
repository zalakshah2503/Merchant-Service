var BillSearchContoller = (function () {
    function BillSearchContoller($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, id) {
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
        this.id = id;
        this.$scope.openStartDatePickerDate = function (event) { return _this.openStartDatePickerDate(event); };
        this.$scope.openEndDatePickerDate = function (event) { return _this.openEndDatePickerDate(event); };
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.errorMessageDisplay = false;
        this.$scope.searchList = [];
        this.$scope.clickOnsearchButton = function () { return _this.clickOnsearchButton(); };
        this.$scope.search = [];
        this.$scope.branchList = [];
        this.$scope.templist = [];
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 8;
        this.$scope.maxSize = 10;
        this.$scope.searchForDateAmount = [];
        this.initialize();
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.billSearchCollection.slice(begin, end);
        });
    }
    BillSearchContoller.prototype.initialize = function () {
        this.getbillList();
        this.getBranchList();
    };
    //this method used for Start Date Picker -An
    BillSearchContoller.prototype.openStartDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    };
    //this method used for end date Picker -An
    BillSearchContoller.prototype.openEndDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    };
    //this funciton used for get branch list. -An
    BillSearchContoller.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.ReturnBillService.getBranchList();
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
    //this function used for get bill list. -An
    BillSearchContoller.prototype.getbillList = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.errorMessageDisplay = false;
        if (this.id !== undefined && this.id !== null && this.id !== 0) {
            var promise = this.ReturnBillService.getPOSBillListByBranchId(this.id);
            promise.then(function (result) {
                _this.GetPOSBillList(result);
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
        else {
            var promise = this.ReturnBillService.getPOSBillList();
            promise.then(function (result) {
                _this.GetPOSBillList(result);
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
    };
    //This method used for get pos bill list. -An
    BillSearchContoller.prototype.GetPOSBillList = function (result) {
        this.$scope.billSearchCollection = [];
        var billDetialList = this.$scope.billSearchCollection;
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                billDetialList.push(result[i]);
            }
            this.$scope.billTotalCollection = billDetialList;
            var that = this;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            this.$scope.totalCollection = billDetialList.slice(begin, end);
            /* init pagination with $scope.list */
            this.$scope.totalItems = this.$scope.billSearchCollection.length;
        }
        else {
            this.$scope.errorMessageDisplay = true;
        }
        this.$rootScope.isLoading = false;
    };
    //this function used for click on search button. -An
    BillSearchContoller.prototype.clickOnsearchButton = function () {
        var controllerScope = this.$scope;
        controllerScope.templist = [];
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        var that = this;
        var isNoSearch = false;
        var StartDate;
        if (controllerScope.searchForDateAmount.StartDate !== null && controllerScope.searchForDateAmount.StartDate !== undefined) {
            var startDate = new Date(controllerScope.searchForDateAmount.StartDate);
            startDate.setTime(startDate.getTime() + (330 * 60 * 1000));
            StartDate = startDate.toISOString().substr(0, 10);
        }
        var EndDate;
        if (controllerScope.searchForDateAmount.EndDate !== null && controllerScope.searchForDateAmount.EndDate !== undefined) {
            var endDate = new Date(controllerScope.searchForDateAmount.EndDate);
            endDate.setTime(endDate.getTime() + (330 * 60 * 1000));
            EndDate = endDate.toISOString().substr(0, 10);
        }
        if (controllerScope.billTotalCollection.length > 0) {
            if (controllerScope.searchForDateAmount.FromAmount !== undefined && controllerScope.searchForDateAmount.ToAmount !== undefined &&
                controllerScope.searchForDateAmount.FromAmount !== null && controllerScope.searchForDateAmount.ToAmount !== null) {
                for (var i = 0; i < controllerScope.billTotalCollection.length; i++) {
                    if (controllerScope.billTotalCollection[i].Amount >= controllerScope.searchForDateAmount.FromAmount &&
                        controllerScope.billTotalCollection[i].Amount <= controllerScope.searchForDateAmount.ToAmount) {
                        controllerScope.templist.push(controllerScope.billTotalCollection[i]);
                    }
                }
                if (StartDate !== undefined && EndDate !== undefined && StartDate !== null && EndDate !== null) {
                    var listOfItem = [];
                    for (var i = 0; i < controllerScope.templist.length; i++) {
                        if (new Date(controllerScope.templist[i].BillDate).toISOString().substr(0, 10) >= StartDate && new Date(controllerScope.templist[i].BillDate).toISOString().substr(0, 10) <= EndDate)
                            listOfItem.push(controllerScope.templist[i]);
                    }
                    if (listOfItem.length > 0)
                        controllerScope.templist = listOfItem;
                }
            }
            else if (StartDate !== undefined && EndDate !== undefined && StartDate !== null && EndDate !== null) {
                for (var i = 0; i < controllerScope.billTotalCollection.length; i++) {
                    if (new Date(controllerScope.billTotalCollection[i].BillDate).toISOString().substr(0, 10) >= StartDate && new Date(controllerScope.billTotalCollection[i].BillDate).toISOString().substr(0, 10) <= EndDate)
                        controllerScope.templist.push(controllerScope.billTotalCollection[i]);
                }
            }
        }
        if (controllerScope.templist.length > 0) {
            if ((controllerScope.searchList.CustomerNumber !== undefined && controllerScope.searchList.CustomerNumber !== null) ||
                (controllerScope.searchList.BranchId !== undefined && controllerScope.searchList.BranchId !== null))
                controllerScope.billSearchCollection = this.filterFilter((controllerScope.templist), controllerScope.searchList);
            else
                controllerScope.billSearchCollection = controllerScope.templist;
        }
        else {
            if ((controllerScope.searchForDateAmount.FromAmount === undefined || controllerScope.searchForDateAmount.FromAmount === null) &&
                (controllerScope.searchForDateAmount.ToAmount === undefined || controllerScope.searchForDateAmount.ToAmount === null) &&
                (controllerScope.searchForDateAmount.StartDate === undefined || controllerScope.searchForDateAmount.StartDate === null) &&
                (controllerScope.searchForDateAmount.EndDate === undefined || controllerScope.searchForDateAmount.EndDate === null))
                controllerScope.billSearchCollection = this.filterFilter((controllerScope.billTotalCollection), controllerScope.searchList);
            else
                isNoSearch = true;
        }
        if (isNoSearch) {
            controllerScope.errorMessageDisplay = true;
            controllerScope.totalCollection = [];
        }
        else {
            /* change pagination with $scope.filtered */
            if (controllerScope.billSearchCollection.length === 0) {
                //check searching and searchList set 0.
                controllerScope.errorMessageDisplay = true;
                controllerScope.totalCollection = [];
            }
            else {
                var begin = ((controllerScope.currentPage - 1) * controllerScope.itemsPerPage), end = begin + controllerScope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.billSearchCollection.slice(begin, end);
                controllerScope.totalItems = controllerScope.billSearchCollection.length;
                controllerScope.errorMessageDisplay = false;
            }
        }
        controllerScope.searchList = [];
        controllerScope.searchForDateAmount = [];
    };
    return BillSearchContoller;
}());
BillSearchContoller.controllerId = "BillSearchContoller";
app.controller(BillSearchContoller.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'id', function ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, id) {
        return new BillSearchContoller($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, id);
    }]);
//# sourceMappingURL=BillSearchContoller.js.map
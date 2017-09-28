/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/session/possessionservice.ts" />
var POSSessionWorkListController = (function () {
    function POSSessionWorkListController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.POSSessionService = POSSessionService;
        this.ngToast = ngToast;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$scope.search = [];
        this.$scope.clickOnsearchButton = function () { return _this.clickOnsearchButton(); };
        this.$scope.cashierList = [];
        this.$scope.branchList = [];
        this.$scope.templist = [];
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 5;
        this.$scope.maxSize = 10;
        this.$scope.tempSearch = [];
        this.$scope.totalPosSessionWorkListCollection = [];
        this.$scope.cashierWorkFLowListDetailCollection;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.viewSeesionVerification = function (id) { return _this.viewSeesionVerification(id); };
        this.$scope.isEndToPickerDateOpened = false;
        this.$scope.isEndFromPickerDateOpened = false;
        this.$scope.openEndDateFromPickerDate = function () { return _this.openEndDateFromPickerDate(event); };
        this.$scope.openEndDateToPickerDate = function () { return _this.openEndDateToPickerDate(event); };
        this.$scope.openStartDateFromPickerDate = function () { return _this.openStartDateFromPickerDate(event); };
        this.$scope.openStartDateToPickerDate = function () { return _this.openStartDateToPickerDate(event); };
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.isStartFromPickerDateOpened = false;
        this.$scope.isStartToPickerDateOpened = false;
        this.$scope.statusTypeList = stringConstants.statusTypeList;
        this.$scope.resolveTypeList = stringConstants.statusList;
        this.Initialize();
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.posSessionWorkListCollection.slice(begin, end);
        });
    }
    POSSessionWorkListController.prototype.Initialize = function () {
        this.GetCashierList();
        this.getBranchList();
        this.getPOSSessionWork();
    };
    //this function used for open end date picker. -An
    POSSessionWorkListController.prototype.openEndDateFromPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndFromPickerDateOpened = true;
    };
    //this function used for open end date date picker. -An
    POSSessionWorkListController.prototype.openEndDateToPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndToPickerDateOpened = true;
    };
    POSSessionWorkListController.prototype.openStartDateFromPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartFromPickerDateOpened = true;
    };
    POSSessionWorkListController.prototype.openStartDateToPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartToPickerDateOpened = true;
    };
    //this function used for click on search button. -An
    POSSessionWorkListController.prototype.clickOnsearchButton = function () {
        var controllerScope = this.$scope;
        controllerScope.templist = [];
        var that = this;
        var isNoSearch = false;
        var EndDateFrom;
        if (controllerScope.search.EndDateFrom !== null && controllerScope.search.EndDateFrom !== undefined) {
            EndDateFrom = new Date(controllerScope.search.EndDateFrom).toISOString().substr(0, 10);
        }
        var EndDateTo;
        if (controllerScope.search.EndDateTo !== null && controllerScope.search.EndDateTo !== undefined) {
            EndDateTo = new Date(controllerScope.search.EndDateTo).toISOString().substr(0, 10);
        }
        var StartDateFrom;
        if (controllerScope.search.StartDateFrom !== null && controllerScope.search.StartDateFrom !== undefined) {
            StartDateFrom = new Date(controllerScope.search.StartDateFrom).toISOString().substr(0, 10);
        }
        var StartDateTo;
        if (controllerScope.search.StartDateTo !== null && controllerScope.search.StartDateTo !== undefined) {
            StartDateTo = new Date(controllerScope.search.StartDateTo).toISOString().substr(0, 10);
        }
        if (controllerScope.totalPosSessionWorkListCollection.length > 0) {
            for (var i = 0; i < controllerScope.totalPosSessionWorkListCollection.length; i++) {
                if ((controllerScope.totalPosSessionWorkListCollection[i].EndDate >= EndDateFrom && controllerScope.totalPosSessionWorkListCollection[i].EndDate <= EndDateTo)
                    || (controllerScope.totalPosSessionWorkListCollection[i].StartDate >= StartDateFrom && controllerScope.totalPosSessionWorkListCollection[i].StartDate <= StartDateTo)
                    || (controllerScope.totalPosSessionWorkListCollection[i].MisMatchValue >= controllerScope.search.MisMatchValueFrom &&
                        controllerScope.totalPosSessionWorkListCollection[i].MisMatchValue <= controllerScope.search.MisMatchValueTo)) {
                    controllerScope.templist.push(controllerScope.totalPosSessionWorkListCollection[i]);
                }
            }
        }
        if (controllerScope.templist.length > 0) {
            controllerScope.posSessionWorkListCollection = this.filterFilter((controllerScope.templist), controllerScope.tempSearch);
        }
        else {
            if ((controllerScope.search.MisMatchValueFrom === undefined || controllerScope.search.MisMatchValueFrom === null) &&
                (controllerScope.search.MisMatchValueTo === undefined || controllerScope.search.MisMatchValueTo === null) &&
                (controllerScope.search.EndDateFrom === undefined || controllerScope.search.EndDateFrom === null) &&
                (controllerScope.search.EndDateTo === undefined || controllerScope.search.EndDateTo === null) &&
                (controllerScope.search.StartDateFrom === undefined || controllerScope.search.StartDateFrom === null) &&
                (controllerScope.search.StartDateTo === undefined || controllerScope.search.StartDateTo === null))
                controllerScope.posSessionWorkListCollection = this.filterFilter((controllerScope.totalPosSessionWorkListCollection), controllerScope.tempSearch);
            else
                isNoSearch = true;
        }
        if (isNoSearch) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            /* change pagination with $scope.filtered */
            if (controllerScope.posSessionWorkListCollection.length === 0) {
                //check searching and searchList set 0.
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.totalCollection = [];
            }
            else {
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.posSessionWorkListCollection.slice(begin, end);
                controllerScope.totalItems = controllerScope.posSessionWorkListCollection.length;
                controllerScope.errorMessageDisplayForBlankList = false;
            }
        }
        controllerScope.search = [];
        controllerScope.tempSearch = [];
    };
    //this function used for get cashier list. -An
    POSSessionWorkListController.prototype.GetCashierList = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.getCashierListByBranch();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.cashierList.push({ cashierId: result[i].Id, Name: result[i].UserName });
                }
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
    //this funciton used for get branch list -An
    POSSessionWorkListController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        //To get branch list
        var promise = this.POSSessionService.getBranchList();
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
    //this function used for get pos session work list. -An
    POSSessionWorkListController.prototype.getPOSSessionWork = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        //controllerRootScope.isLoading = true;
        controllerScope.posSessionWorkListCollection = [];
        var posSessionWorkList = controllerScope.posSessionWorkListCollection;
        //To get branch list
        var promise = this.POSSessionService.getPOSSessionWorkList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].MisMatchValue < 0)
                        result[i].MisMatchValue = Math.abs(result[i].MisMatchValue);
                    if (result[i].ResolvedTypeId === 1)
                        result[i].ResolvedAd = "-";
                    if (result[i].IsMatched === true)
                        result[i].IsMatched = stringConstants.yes;
                    else
                        result[i].IsMatched = stringConstants.no;
                    posSessionWorkList.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = posSessionWorkList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.posSessionWorkListCollection.length;
                controllerScope.totalPosSessionWorkListCollection = controllerScope.posSessionWorkListCollection;
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
    //this function used for redirect to verifcation form. -An
    POSSessionWorkListController.prototype.viewSeesionVerification = function (id) {
        this.$location.path("/SessionClosingVarification/" + id);
    };
    return POSSessionWorkListController;
}());
POSSessionWorkListController.controllerId = "POSSessionWorkListController";
app.controller(POSSessionWorkListController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', function ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        return new POSSessionWorkListController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
    }]);
//# sourceMappingURL=POSSessionWorkListController.js.map
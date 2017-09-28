/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/incidentreport/incidentreportworklistservice.ts" />
var IncidentRportWorklistController = (function () {
    function IncidentRportWorklistController($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.IncidentReportWorklistService = IncidentReportWorklistService;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.$scope.cashierList = [];
        this.$scope.branchList = [];
        this.$scope.totalincidentWorkListCollection = [];
        this.$scope.search = [];
        this.$scope.itemsPerPage = 2;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.actionClickEvent = function (cashierId) { return _this.actionClickEvent(cashierId); };
        this.$scope.resetPopup = function () { return _this.resetPopup(); };
        this.$scope.incidentReportWorkListCollection = [];
        this.$scope.searchClick = function () { return _this.searchClick(); };
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.Initialize();
        var incidentReport = this.$scope.$watch("currentPage + itemsPerPage", function () {
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.incidentWorkListCollection.slice(begin, end);
        });
    }
    IncidentRportWorklistController.prototype.Initialize = function () {
        this.getCashierList();
        this.getBranchList();
        this.getIncidentReportWorkList();
    };
    //This function used for get sub item list. -An
    IncidentRportWorklistController.prototype.getSubItemList = function (parentId) {
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
    //This function used for search Click event. -An
    IncidentRportWorklistController.prototype.searchClick = function () {
        var controllerScope = this.$scope;
        controllerScope.incidentWorkListCollection = this.filterFilter((controllerScope.totalincidentWorkListCollection), controllerScope.search);
        if (controllerScope.incidentWorkListCollection.length === 0) {
            //check searching and searchList set 0.
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            var begin = ((controllerScope.currentPage - 1) * controllerScope.itemsPerPage), end = begin + controllerScope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.incidentWorkListCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.incidentWorkListCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
    };
    //This function used for get cashier list. -An
    IncidentRportWorklistController.prototype.getCashierList = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        //To get branch list
        var promise = this.IncidentReportWorklistService.getCashierList();
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
    //this function used for open popup for reset. -An
    IncidentRportWorklistController.prototype.resetPopup = function () {
        this.resetInvetoryPopup = this.$modal.open({
            templateUrl: 'resetPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    //this function used for get branch list -An
    IncidentRportWorklistController.prototype.getBranchList = function () {
        var _this = this;
        //To get branch list
        var promise = this.IncidentReportWorklistService.getBranchListFunction();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.branchList.push({ branchId: result[i].Id, Name: result[i].Name });
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
    //this function used for get incident report work list- An
    IncidentRportWorklistController.prototype.getIncidentReportWorkList = function () {
        var _this = this;
        this.$scope.incidentWorkListCollection = [];
        var incidentReportWorkList = this.$scope.incidentWorkListCollection;
        var promise = this.IncidentReportWorklistService.getIncidentReportWorkListFunciton();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    incidentReportWorkList.push(result[i]);
                }
                _this.$scope.incidentReportWorkListCollection = incidentReportWorkList;
                _this.$scope.totalincidentWorkListCollection = incidentReportWorkList;
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                _this.$scope.totalCollection = incidentReportWorkList.slice(begin, end);
                /* init pagination with $scope.list */
                _this.$scope.totalItems = _this.$scope.incidentWorkListCollection.length;
            }
            else {
                _this.$scope.errorMessageDisplayForBlankList = true;
            }
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
    //this function redirect to approval page.- An 
    IncidentRportWorklistController.prototype.actionClickEvent = function (cashierId) {
        var _this = this;
        this.$rootScope.isLoading = true;
        //To get branch list
        var promise = this.IncidentReportWorklistService.resetIncidentReport(cashierId);
        promise.then(function (result) {
            if (result.result === "IsNotWorkFlow") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.result.IsApproval === false && result.result.IsAddParentRecord === false) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.resetRequestAlreadyExists
                });
            }
            else if (result.result.IsAddParentRecord === true) {
                _this.getIncidentReportWorkList();
                if (result.result.IsApproveByBranchSupervisor)
                    _this.ngToast.create(stringConstants.resetRequestSucessfully);
                else
                    _this.ngToast.create(stringConstants.resetSucessfully);
            }
            else if (result.result.IsApproval === true) {
                _this.$location.path("/ManageIncidentReportApproval/" + cashierId);
            }
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
    return IncidentRportWorklistController;
}());
IncidentRportWorklistController.controllerId = "IncidentReportWorklistController";
app.controller(IncidentRportWorklistController.controllerId, ['$scope', '$log', 'incidentReportWorklistService', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams) {
        return new IncidentRportWorklistController($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=IncidentRportWorklistController.js.map
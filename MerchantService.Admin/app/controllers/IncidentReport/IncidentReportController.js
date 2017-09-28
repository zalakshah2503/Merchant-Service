/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/incidentreport/incidentreportservice.ts" />
/// <reference path="../../models/incidentreport/incidentreportmodel.ts" />
var IncidentReportController = (function () {
    function IncidentReportController($scope, $location, $log, incidentReportService, $rootScope, $routeParams, apiPath, ngToast, $modal, filterFilter) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.$log = $log;
        this.incidentReportService = incidentReportService;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$scope.oprationList = [];
        this.$scope.incidentReportModel = new Model.IncidentReportModel();
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.showMeridian = true;
        this.$scope.showMeridianEndTime = true;
        this.$scope.openFromDatePickerDate = function (event) { return _this.openFromDatePickerDate(event); };
        this.$scope.openToDatePickerDate = function (event) { return _this.openToDatePickerDate(event); };
        this.$scope.operationChangeEvent = function (operationTypeId) { return _this.operationChangeEvent(operationTypeId); };
        this.$scope.submitButtonEvent = function () { return _this.submitButtonEvent(); };
        this.$scope.cancelButtonEvent = function () { return _this.cancelButtonEvent(); };
        this.$scope.isPerPeriodOfTime = false;
        this.$scope.itemsPerPage = 2;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.operationRequired = stringConstants.OperationRequired;
        this.$scope.fromDateRequired = stringConstants.FormDateRequired;
        this.$scope.isFromDate = false;
        this.$scope.toDateRequired = stringConstants.ToDateRequired;
        this.$scope.isToDate = false;
        this.$scope.duration = [];
        this.$scope.duration.DurationId = "55";
        this.$scope.clickOnAction = function (id) { return _this.clickOnAction(id); };
        this.$scope.search = [];
        this.$scope.isSubmit = true;
        this.$scope.updateButtonEvent = function () { return _this.updateButtonEvent(); };
        this.$scope.closeCashierIncidentReportPopup = function () { return _this.closeCashierIncidentReportPopup(); };
        this.$scope.updateCashierIncidentReport = function () { return _this.updateCashierIncidentReport(); };
        this.$scope.oldOperationTypeId = 0;
        this.initialization();
        var incidentReport = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.incidentReportCollection.slice(begin, end);
        });
    }
    IncidentReportController.prototype.initialization = function () {
        this.getOperationList();
        this.getIncidentReportList();
    };
    //this function used for close the upadate conformation popup. -An
    IncidentReportController.prototype.closeCashierIncidentReportPopup = function () {
        this.cashierIncidentReportConfirmationPopup.dismiss('cancel');
    };
    //this function used for update cashier incident report after conformation. -An
    IncidentReportController.prototype.updateCashierIncidentReport = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.incidentReportModel.Id = this.$scope.search.Id;
        var isValid = true;
        if (this.$scope.incidentReportModel.OperationTypeId === 52)
            isValid = this.checkValidationForDateTime();
        if (isValid) {
            this.$scope.incidentReportModel.DurationId = this.$scope.duration.DurationId;
            var promise = this.incidentReportService.updateIncidentReport(this.$scope.incidentReportModel);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.incidnetReportUpdateSucceesfully);
                    _this.getIncidentReportList();
                    _this.closeCashierIncidentReportPopup();
                    _this.$scope.isPerPeriodOfTime = false;
                    var controllerScope = _this.$scope;
                    _this.$scope.isSubmit = true;
                    controllerScope.incidentReportModel = new Model.IncidentReportModel();
                    controllerScope.manageIncedientReport.$setPristine();
                    controllerScope.manageIncedientReport.$setValidity();
                    controllerScope.manageIncedientReport.$setUntouched();
                }
                _this.$rootScope.isLoading = false;
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$log.log(error);
            });
        }
    };
    //this function used for display data in edit mood. -An
    IncidentReportController.prototype.clickOnAction = function (id) {
        this.$rootScope.isLoading = true;
        this.$scope.search.Id = id;
        var searchList = this.filterFilter(this.$scope.incidentReportCollection, this.$scope.search);
        if (searchList.length !== 0) {
            this.$scope.incidentReportModel.OperationTypeId = searchList[0].OperationTypeId;
            this.$scope.oldOperationTypeId = searchList[0].OperationTypeId;
            this.$scope.incidentReportModel.OperationCounter = searchList[0].OperationCounter;
            this.$scope.incidentReportModel.AmountLimit = searchList[0].AmountLimit;
            this.$scope.incidentReportModel.Comment = searchList[0].Comment;
            if (searchList[0].OperationTypeId === 52) {
                if (searchList[0].DurationId) {
                    this.$scope.duration.DurationId = searchList[0].DurationId;
                }
                this.$scope.isPerPeriodOfTime = true;
                this.$scope.incidentReportModel.StartDateTime = searchList[0].StartDateTime;
                this.$scope.incidentReportModel.EndDateTime = searchList[0].EndDateTime;
                this.$scope.startTime = this.getTimeForTimePickerFromDate(new Date(searchList[0].StartDateTime));
                this.$scope.endTime = this.getTimeForTimePickerFromDate(new Date(searchList[0].EndDateTime));
            }
            else {
                this.$scope.isPerPeriodOfTime = false;
            }
        }
        this.$rootScope.isLoading = false;
        this.$scope.isSubmit = false;
    };
    IncidentReportController.prototype.getTimeForTimePickerFromDate = function (date) {
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        return date;
    };
    //this function usd fo clear all data. -An
    IncidentReportController.prototype.cancelButtonEvent = function () {
        var controllerScope = this.$scope;
        this.$scope.isSubmit = true;
        controllerScope.incidentReportModel = new Model.IncidentReportModel();
        //controllerScope.manageIncedientReport.$setPristine();
        //controllerScope.manageIncedientReport.$setValidity();
        //controllerScope.manageIncedientReport.$setUntouched();
        this.$scope.isPerPeriodOfTime = false;
    };
    //this funciton used for submit buuton event for incident report.-An
    IncidentReportController.prototype.submitButtonEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.isToDate = false;
        this.$scope.isFromDate = false;
        var isValid = true;
        if (this.$scope.incidentReportModel.OperationTypeId === 52)
            isValid = this.checkValidationForDateTime();
        if (isValid) {
            this.$scope.incidentReportModel.DurationId = this.$scope.duration.DurationId;
            var promise = this.incidentReportService.submitIncidentReport(this.$scope.incidentReportModel);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.incidnetReportInsertSucceesfully);
                    _this.getIncidentReportList();
                    _this.$scope.isPerPeriodOfTime = false;
                    var controllerScope = _this.$scope;
                    controllerScope.incidentReportModel = new Model.IncidentReportModel();
                }
                else if (result._isResult === "AlreadyExists") {
                    _this.ngToast.create({
                        className: 'danger',
                        content: 'Incident Report already Exists.'
                    });
                }
                else if (result._isResult === false) {
                }
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$log.log(error);
            });
        }
        this.$rootScope.isLoading = false;
    };
    //this funciton used for update button event for incident report. -An
    IncidentReportController.prototype.updateButtonEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        if (this.$scope.oldOperationTypeId === this.$scope.incidentReportModel.OperationTypeId) {
            this.$scope.incidentReportModel.Id = this.$scope.search.Id;
            var isValid = true;
            if (this.$scope.incidentReportModel.OperationTypeId === 52)
                isValid = this.checkValidationForDateTime();
            if (isValid) {
                this.$scope.incidentReportModel.DurationId = this.$scope.duration.DurationId;
                var promise = this.incidentReportService.updateIncidentReport(this.$scope.incidentReportModel);
                promise.then(function (result) {
                    if (result._isResult === true) {
                        _this.ngToast.create(stringConstants.incidnetReportUpdateSucceesfully);
                        _this.getIncidentReportList();
                        _this.$scope.isPerPeriodOfTime = false;
                        var controllerScope = _this.$scope;
                        _this.$scope.isSubmit = true;
                        controllerScope.incidentReportModel = new Model.IncidentReportModel();
                    }
                    _this.$rootScope.isLoading = false;
                }).catch(function (error) {
                    _this.$rootScope.isLoading = false;
                    _this.$log.log(error);
                });
            }
        }
        else {
            this.$rootScope.isLoading = false;
            this.cashierIncidentReportConfirmationPopup = this.$modal.open({
                templateUrl: 'cashierIncidentReportConformationPopup',
                backdrop: 'static',
                keyboard: true,
                size: 'md',
                scope: this.$scope,
            });
        }
    };
    IncidentReportController.prototype.checkValidationForDateTime = function () {
        if (this.$scope.incidentReportModel.StartDateTime !== undefined && this.$scope.incidentReportModel.StartDateTime !== null) {
            if (this.$scope.startTime !== undefined && this.$scope.startTime !== null) {
                var startDate = new Date(this.$scope.incidentReportModel.StartDateTime);
                var startTime = new Date(this.$scope.startTime);
                this.$scope.incidentReportModel.StartDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());
            }
            if (this.$scope.incidentReportModel.EndDateTime !== undefined && this.$scope.incidentReportModel.EndDateTime !== null) {
                if (this.$scope.endTime !== undefined && this.$scope.endTime !== null) {
                    var endDate = new Date(this.$scope.incidentReportModel.EndDateTime);
                    var endTime = new Date(this.$scope.endTime);
                    this.$scope.incidentReportModel.EndDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes());
                    return true;
                }
            }
            else
                this.$scope.isToDate = true;
        }
        else
            this.$scope.isFromDate = true;
        return false;
    };
    //this function used for get operation list.- An 
    IncidentReportController.prototype.getOperationList = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.incidentReportService.getOperationList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.oprationList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    IncidentReportController.prototype.operationChangeEvent = function (operationTypeId) {
        this.$rootScope.isLoading = true;
        this.$scope.incidentReportModel = new Model.IncidentReportModel();
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        if (operationTypeId === 52) {
            this.$scope.isPerPeriodOfTime = true;
        }
        else {
            this.$scope.isPerPeriodOfTime = false;
        }
        this.$scope.incidentReportModel.OperationTypeId = operationTypeId;
        this.$rootScope.isLoading = false;
    };
    //This function used for get incident report by. -An
    IncidentReportController.prototype.getIncidentReportList = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.incidentReportCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        var incidentReport = this.$scope.incidentReportCollection;
        var promise = this.incidentReportService.getIncidentReportList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    incidentReport.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                _this.$scope.totalCollection = incidentReport.slice(begin, end);
                /* init pagination with $scope.list */
                _this.$scope.totalItems = _this.$scope.incidentReportCollection.length;
            }
            else {
                _this.$scope.errorMessageDisplayForBlankList = true;
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //this method used for From Date Picker. -An
    IncidentReportController.prototype.openFromDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    };
    //this method used for End date Picker. -An
    IncidentReportController.prototype.openToDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    };
    return IncidentReportController;
}());
IncidentReportController.controllerId = "IncidentReportController";
app.controller(IncidentReportController.controllerId, [
    '$scope', '$location', '$log', 'IncidentReportService', '$rootScope', '$routeParams', 'apiPath', 'ngToast', '$modal', 'filterFilter', function ($scope, $location, $log, incidentReportService, $rootScope, $routeParams, apiPath, ngToast, $modal, filterFilter) {
        return new IncidentReportController($scope, $location, $log, incidentReportService, $rootScope, $routeParams, apiPath, ngToast, $modal, filterFilter);
    }
]);
//# sourceMappingURL=IncidentReportController.js.map
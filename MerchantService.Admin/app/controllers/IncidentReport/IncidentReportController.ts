/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/incidentreport/incidentreportservice.ts" />
/// <reference path="../../models/incidentreport/incidentreportmodel.ts" />


interface IIncidentReportControllerScope extends ng.IScope {
    incidentReportModel: Model.IncidentReportModel;
    oprationList: any;
    isStartPickerDateOpened: boolean;
    isEndPickerDateOpened: boolean;
    operationChangeEvent: Function;
    openFromDatePickerDate: Function;
    openToDatePickerDate: Function;
    isPerPeriodOfTime: boolean;
    submitButtonEvent: Function;
    cancelButtonEvent: Function;
    totalCollection: any;
    currentPage: number;
    itemsPerPage: number;
    maxSize: number;
    totalItems: number;
    incidentReportCollection: any;
    errorMessageDisplayForBlankList: boolean;
    startTime: any;
    showMeridian: boolean;
    endTime: any;
    showMeridianEndTime: boolean;
    operationRequired: string;
    fromDateRequired: string;
    isFromDate: boolean;
    toDateRequired: string;
    isToDate: boolean;
    duration: any;
    clickOnAction: Function;
    search: any;
    isSubmit: boolean;
    updateButtonEvent: Function;
    closeCashierIncidentReportPopup: Function;
    updateCashierIncidentReport: Function;
    oldOperationTypeId: number;
}

interface IIncidentReportController {

}

class IncidentReportController implements IIncidentReportController {
    static controllerId = "IncidentReportController";
    public cashierIncidentReportConfirmationPopup;
    constructor(private $scope: IIncidentReportControllerScope, private $location: ng.ILocaleService, private $log: ng.ILogService, private incidentReportService: IncidentReportService, public $rootScope, public $routeParams, private apiPath, public ngToast, public $modal, public filterFilter) {
        this.$scope.oprationList = [];
        this.$scope.incidentReportModel = new Model.IncidentReportModel();
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.showMeridian = true;
        this.$scope.showMeridianEndTime = true;
        this.$scope.openFromDatePickerDate = (event) => this.openFromDatePickerDate(event);
        this.$scope.openToDatePickerDate = (event) => this.openToDatePickerDate(event);
        this.$scope.operationChangeEvent = (operationTypeId) => this.operationChangeEvent(operationTypeId);
        this.$scope.submitButtonEvent = () => this.submitButtonEvent();
        this.$scope.cancelButtonEvent = () => this.cancelButtonEvent();
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
        this.$scope.clickOnAction = (id) => this.clickOnAction(id);
        this.$scope.search = [];
        this.$scope.isSubmit = true;
        this.$scope.updateButtonEvent = () => this.updateButtonEvent();
        this.$scope.closeCashierIncidentReportPopup = () => this.closeCashierIncidentReportPopup();
        this.$scope.updateCashierIncidentReport = () => this.updateCashierIncidentReport();
        this.$scope.oldOperationTypeId = 0;

        this.initialization();

        let incidentReport = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.incidentReportCollection.slice(begin, end);
        });
    }

    private initialization() {
        this.getOperationList();
        this.getIncidentReportList();
    }

    //this function used for close the upadate conformation popup. -An
    private closeCashierIncidentReportPopup() {
        this.cashierIncidentReportConfirmationPopup.dismiss('cancel');
    }

    //this function used for update cashier incident report after conformation. -An
    private updateCashierIncidentReport() {
        this.$rootScope.isLoading = true;
        this.$scope.incidentReportModel.Id = this.$scope.search.Id;
        let isValid = true;
        if (this.$scope.incidentReportModel.OperationTypeId === 52)
            isValid = this.checkValidationForDateTime();
        if (isValid) {
            this.$scope.incidentReportModel.DurationId = this.$scope.duration.DurationId;
            let promise = this.incidentReportService.updateIncidentReport(this.$scope.incidentReportModel);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.incidnetReportUpdateSucceesfully);
                    this.getIncidentReportList();
                    this.closeCashierIncidentReportPopup();
                    this.$scope.isPerPeriodOfTime = false;
                    let controllerScope: any = this.$scope;
                    this.$scope.isSubmit = true;
                    controllerScope.incidentReportModel = new Model.IncidentReportModel();
                    controllerScope.manageIncedientReport.$setPristine();
                    controllerScope.manageIncedientReport.$setValidity();
                    controllerScope.manageIncedientReport.$setUntouched();
                }
                this.$rootScope.isLoading = false;
            }).catch((error) => {
                this.$rootScope.isLoading = false;
                this.$log.log(error);
            });
        }
    }


    //this function used for display data in edit mood. -An
    private clickOnAction(id) {
        this.$rootScope.isLoading = true;
        this.$scope.search.Id = id;
        let searchList = this.filterFilter(this.$scope.incidentReportCollection, this.$scope.search);
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
    }

    private getTimeForTimePickerFromDate(date: Date) {
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        return date;
    }

    //this function usd fo clear all data. -An
    private cancelButtonEvent() {
        let controllerScope: any = this.$scope;
        this.$scope.isSubmit = true;
        controllerScope.incidentReportModel = new Model.IncidentReportModel();
        //controllerScope.manageIncedientReport.$setPristine();
        //controllerScope.manageIncedientReport.$setValidity();
        //controllerScope.manageIncedientReport.$setUntouched();
        this.$scope.isPerPeriodOfTime = false;
    }

    //this funciton used for submit buuton event for incident report.-An
    private submitButtonEvent() {
        this.$rootScope.isLoading = true;
        this.$scope.isToDate = false;
        this.$scope.isFromDate = false;
        let isValid = true;
        if (this.$scope.incidentReportModel.OperationTypeId === 52)
            isValid = this.checkValidationForDateTime();
        if (isValid) {
            this.$scope.incidentReportModel.DurationId = this.$scope.duration.DurationId;
            let promise = this.incidentReportService.submitIncidentReport(this.$scope.incidentReportModel);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.incidnetReportInsertSucceesfully);
                    this.getIncidentReportList();
                    this.$scope.isPerPeriodOfTime = false;
                    let controllerScope: any = this.$scope;
                    controllerScope.incidentReportModel = new Model.IncidentReportModel();
                    //controllerScope.manageIncedientReport.$setPristine();
                    //controllerScope.manageIncedientReport.$setValidity();
                    //controllerScope.manageIncedientReport.$setUntouched();
                }
                else if (result._isResult === "AlreadyExists") {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: 'Incident Report already Exists.'
                        });
                }
                else if (result._isResult === false) {

                }
            }).catch((error) => {
                this.$rootScope.isLoading = false;
                this.$log.log(error);
            });
        }
        this.$rootScope.isLoading = false;
    }

    //this funciton used for update button event for incident report. -An
    private updateButtonEvent() {
        this.$rootScope.isLoading = true;
        if (this.$scope.oldOperationTypeId === this.$scope.incidentReportModel.OperationTypeId) {
            this.$scope.incidentReportModel.Id = this.$scope.search.Id;
            let isValid = true;
            if (this.$scope.incidentReportModel.OperationTypeId === 52)
                isValid = this.checkValidationForDateTime();
            if (isValid) {
                this.$scope.incidentReportModel.DurationId = this.$scope.duration.DurationId;
                let promise = this.incidentReportService.updateIncidentReport(this.$scope.incidentReportModel);
                promise.then((result) => {
                    if (result._isResult === true) {
                        this.ngToast.create(stringConstants.incidnetReportUpdateSucceesfully);
                        this.getIncidentReportList();
                        this.$scope.isPerPeriodOfTime = false;
                        let controllerScope: any = this.$scope;
                        this.$scope.isSubmit = true;
                        controllerScope.incidentReportModel = new Model.IncidentReportModel();
                        //controllerScope.manageIncedientReport.$setPristine();
                        //controllerScope.manageIncedientReport.$setValidity();
                        //controllerScope.manageIncedientReport.$setUntouched();
                    }
                    this.$rootScope.isLoading = false;
                }).catch((error) => {
                    this.$rootScope.isLoading = false;
                    this.$log.log(error);
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
    }

    private checkValidationForDateTime() {
        if (this.$scope.incidentReportModel.StartDateTime !== undefined && this.$scope.incidentReportModel.StartDateTime !== null) {
            if (this.$scope.startTime !== undefined && this.$scope.startTime !== null) {
                let startDate = new Date(this.$scope.incidentReportModel.StartDateTime);
                let startTime = new Date(this.$scope.startTime);
                this.$scope.incidentReportModel.StartDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes());
            }
            if (this.$scope.incidentReportModel.EndDateTime !== undefined && this.$scope.incidentReportModel.EndDateTime !== null) {
                if (this.$scope.endTime !== undefined && this.$scope.endTime !== null) {
                    let endDate = new Date(this.$scope.incidentReportModel.EndDateTime);
                    let endTime = new Date(this.$scope.endTime);
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
    }

    //this function used for get operation list.- An 
    private getOperationList() {
        this.$rootScope.isLoading = true;
        let promise = this.incidentReportService.getOperationList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.oprationList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    private operationChangeEvent(operationTypeId) {
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

    }

    //This function used for get incident report by. -An
    private getIncidentReportList() {
        this.$rootScope.isLoading = true;
        this.$scope.incidentReportCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        let incidentReport = this.$scope.incidentReportCollection;
        let promise = this.incidentReportService.getIncidentReportList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    incidentReport.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                this.$scope.totalCollection = incidentReport.slice(begin, end);
                /* init pagination with $scope.list */
                this.$scope.totalItems = this.$scope.incidentReportCollection.length;
            }
            else {
                this.$scope.errorMessageDisplayForBlankList = true;
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    //this method used for From Date Picker. -An
    private openFromDatePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    }

    //this method used for End date Picker. -An
    private openToDatePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    }

}

app.controller(IncidentReportController.controllerId, [
    '$scope', '$location', '$log', 'IncidentReportService', '$rootScope', '$routeParams', 'apiPath', 'ngToast', '$modal', 'filterFilter', ($scope, $location, $log, incidentReportService, $rootScope, $routeParams, apiPath, ngToast, $modal, filterFilter) => {
        return new IncidentReportController($scope, $location, $log, incidentReportService, $rootScope, $routeParams, apiPath, ngToast, $modal, filterFilter);
    }]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/session/possessionservice.ts" />

interface IPOSSessionWorkListControllerScope extends ng.IScope {
    search: any;
    cashierList: any;
    branchList: any;
    posSessionWorkListCollection: any;
    totalPosSessionWorkListCollection: any;
    totalCollection: any;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    maxSize: number;
    errorMessageDisplayForBlankList: boolean;
    viewSeesionVerification: Function;
    isEndFromPickerDateOpened: boolean;
    isEndToPickerDateOpened: boolean;
    isStartFromPickerDateOpened: boolean;
    isStartToPickerDateOpened: boolean;
    openEndDateFromPickerDate: Function;
    openEndDateToPickerDate: Function;
    openStartDateFromPickerDate: Function;
    openStartDateToPickerDate: Function;
    statusTypeList: any;
    resolveTypeList: any;
    clickOnsearchButton: Function;
    cashierWorkFLowListDetailCollection: any;
    templist: any;
    tempSearch: any;
    noItemFound: any;
}


interface IPOSSessionWorkListController {

}

class POSSessionWorkListController implements IPOSSessionWorkListController {
    static controllerId = "POSSessionWorkListController";
    constructor(private $scope: IPOSSessionWorkListControllerScope, private $log: ng.ILogService, public $rootScope, private POSSessionService: POSSessionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal) {
        this.$scope.search = [];
        this.$scope.clickOnsearchButton = () => this.clickOnsearchButton();
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
        this.$scope.viewSeesionVerification = (id) => this.viewSeesionVerification(id);
        this.$scope.isEndToPickerDateOpened = false;
        this.$scope.isEndFromPickerDateOpened = false;
        this.$scope.openEndDateFromPickerDate = () => this.openEndDateFromPickerDate(event);
        this.$scope.openEndDateToPickerDate = () => this.openEndDateToPickerDate(event);
        this.$scope.openStartDateFromPickerDate = () => this.openStartDateFromPickerDate(event);
        this.$scope.openStartDateToPickerDate = () => this.openStartDateToPickerDate(event);
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.isStartFromPickerDateOpened = false;
        this.$scope.isStartToPickerDateOpened = false;
        this.$scope.statusTypeList = stringConstants.statusTypeList;
        this.$scope.resolveTypeList = stringConstants.statusList;

        this.Initialize();

        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.posSessionWorkListCollection.slice(begin, end);
        });
    }

    private Initialize() {
        this.GetCashierList();
        this.getBranchList();
        this.getPOSSessionWork();
    }

    //this function used for open end date picker. -An
    private openEndDateFromPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndFromPickerDateOpened = true;
    }

    //this function used for open end date date picker. -An
    private openEndDateToPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndToPickerDateOpened = true;
    }

    private openStartDateFromPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartFromPickerDateOpened = true;
    }

    private openStartDateToPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartToPickerDateOpened = true;
    }

    //this function used for click on search button. -An
    private clickOnsearchButton() {
        let controllerScope = this.$scope;
        controllerScope.templist = [];
        let that = this;
        let isNoSearch = false;
        let EndDateFrom;
        if (controllerScope.search.EndDateFrom !== null && controllerScope.search.EndDateFrom !== undefined) {
            EndDateFrom = new Date(controllerScope.search.EndDateFrom).toISOString().substr(0, 10);
        }
        let EndDateTo;
        if (controllerScope.search.EndDateTo !== null && controllerScope.search.EndDateTo !== undefined) {
            EndDateTo = new Date(controllerScope.search.EndDateTo).toISOString().substr(0, 10);
        }
        let StartDateFrom;
        if (controllerScope.search.StartDateFrom !== null && controllerScope.search.StartDateFrom !== undefined) {
            StartDateFrom = new Date(controllerScope.search.StartDateFrom).toISOString().substr(0, 10);
        }
        let StartDateTo;
        if (controllerScope.search.StartDateTo !== null && controllerScope.search.StartDateTo !== undefined) {
            StartDateTo = new Date(controllerScope.search.StartDateTo).toISOString().substr(0, 10);
        }

        if (controllerScope.totalPosSessionWorkListCollection.length > 0) {
            for (let i = 0; i < controllerScope.totalPosSessionWorkListCollection.length; i++) {
                if ((controllerScope.totalPosSessionWorkListCollection[i].EndDate >= EndDateFrom && controllerScope.totalPosSessionWorkListCollection[i].EndDate <= EndDateTo)
                    || (controllerScope.totalPosSessionWorkListCollection[i].StartDate >= StartDateFrom && controllerScope.totalPosSessionWorkListCollection[i].StartDate <= StartDateTo)
                    || (controllerScope.totalPosSessionWorkListCollection[i].MisMatchValue >= controllerScope.search.MisMatchValueFrom &&
                        controllerScope.totalPosSessionWorkListCollection[i].MisMatchValue <= controllerScope.search.MisMatchValueTo)) {
                    controllerScope.templist.push(controllerScope.totalPosSessionWorkListCollection[i]);
                }
            }
        }

        if (controllerScope.templist.length > 0) {//this function used for get data between from and to date and amount. 
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

        if (isNoSearch) {//when between amount and date is not assign then its set true otherwise false
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
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.posSessionWorkListCollection.slice(begin, end);
                controllerScope.totalItems = controllerScope.posSessionWorkListCollection.length;
                controllerScope.errorMessageDisplayForBlankList = false;
            }
        }
        controllerScope.search = [];
        controllerScope.tempSearch = [];
    }

    //this function used for get cashier list. -An
    private GetCashierList() {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.getCashierListByBranch();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.cashierList.push({ cashierId: result[i].Id, Name: result[i].UserName });
                }
            }
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        //To get branch list
        let promise = this.POSSessionService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for get pos session work list. -An
    private getPOSSessionWork() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        //controllerRootScope.isLoading = true;
        controllerScope.posSessionWorkListCollection = [];
        let posSessionWorkList = controllerScope.posSessionWorkListCollection;
        //To get branch list
        let promise = this.POSSessionService.getPOSSessionWorkList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
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
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = posSessionWorkList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.posSessionWorkListCollection.length;
                controllerScope.totalPosSessionWorkListCollection = controllerScope.posSessionWorkListCollection;
            }
            else
                this.$scope.errorMessageDisplayForBlankList = true;

            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for redirect to verifcation form. -An
    private viewSeesionVerification(id) {
        this.$location.path("/SessionClosingVarification/" + id);
    }

}
app.controller(POSSessionWorkListController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) => {
    return new POSSessionWorkListController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
}]);

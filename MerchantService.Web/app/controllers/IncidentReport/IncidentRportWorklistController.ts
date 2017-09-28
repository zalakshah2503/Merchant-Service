
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/incidentreport/incidentreportworklistservice.ts" />

interface IIncidentRportWorklistControllerScope extends ng.IScope {
    cashierList: any;
    branchList: any;
    search: any;
    errorMessageDisplayForBlankList: any;
    totalCollection: any;
    currentPage: number;
    itemsPerPage: number;
    maxSize: number;
    totalItems: number;
    incidentWorkListCollection: any;
    totalincidentWorkListCollection: any;
    actionClickEvent: Function;
    resetPopup: Function;
    cancelEvent: Function;
    incidentReportWorkListTotleCollection: any;
    incidentReportWorkListCollection: any;
    searchClick: Function;
    getSubItemList: Function;
    noItemFound: any;
}

interface IIncidentRportWorklistController {

}

class IncidentRportWorklistController implements IIncidentRportWorklistController {
    static controllerId = "IncidentReportWorklistController";
    public resetInvetoryPopup;
    constructor(private $scope: IIncidentRportWorklistControllerScope, private $log: ng.ILogService, private IncidentReportWorklistService: IncidentReportWorklistService, public $rootScope, public apiPath, public ngToast, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.cashierList = [];
        this.$scope.branchList = [];
        this.$scope.totalincidentWorkListCollection = [];
        this.$scope.search = [];
        this.$scope.itemsPerPage = 2;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.actionClickEvent = (cashierId) => this.actionClickEvent(cashierId);
        this.$scope.resetPopup = () => this.resetPopup();
        this.$scope.incidentReportWorkListCollection = [];
        this.$scope.searchClick = () => this.searchClick();
        this.$scope.getSubItemList = (parentId) => this.getSubItemList(parentId);
        this.$scope.noItemFound = stringConstants.noItemFound;

        this.Initialize();
        let incidentReport = this.$scope.$watch("currentPage + itemsPerPage", () => {
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.incidentWorkListCollection.slice(begin, end);
        });
    }

    private Initialize() {
        this.getCashierList();
        this.getBranchList();
        this.getIncidentReportWorkList();
    }


    //This function used for get sub item list. -An
    private getSubItemList(parentId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {//to check click on pluse or minus icon.
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
    }

    //This function used for search Click event. -An
    private searchClick() {
        let controllerScope = this.$scope;
        controllerScope.incidentWorkListCollection = this.filterFilter((controllerScope.totalincidentWorkListCollection), controllerScope.search);
        if (controllerScope.incidentWorkListCollection.length === 0) {
            //check searching and searchList set 0.
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            let begin = ((controllerScope.currentPage - 1) * controllerScope.itemsPerPage),
                end = begin + controllerScope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.incidentWorkListCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.incidentWorkListCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
    }

    //This function used for get cashier list. -An
    private getCashierList() {
        this.$rootScope.isLoading = true;
        //To get branch list
        let promise = this.IncidentReportWorklistService.getCashierList();
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

    //this function used for open popup for reset. -An
    private resetPopup() {
        this.resetInvetoryPopup = this.$modal.open({
            templateUrl: 'resetPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });

    }

    //this function used for get branch list -An
    private getBranchList() {
        //To get branch list
        let promise = this.IncidentReportWorklistService.getBranchListFunction();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.branchList.push({ branchId: result[i].Id, Name: result[i].Name });
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

    //this function used for get incident report work list- An
    private getIncidentReportWorkList() {
        this.$scope.incidentWorkListCollection = [];
        let incidentReportWorkList = this.$scope.incidentWorkListCollection;
        let promise = this.IncidentReportWorklistService.getIncidentReportWorkListFunciton();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    incidentReportWorkList.push(result[i]);
                }
                this.$scope.incidentReportWorkListCollection = incidentReportWorkList;
                this.$scope.totalincidentWorkListCollection = incidentReportWorkList;
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                this.$scope.totalCollection = incidentReportWorkList.slice(begin, end);
                /* init pagination with $scope.list */
                this.$scope.totalItems = this.$scope.incidentWorkListCollection.length;
            }
            else {
                this.$scope.errorMessageDisplayForBlankList = true;
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });

    }

    //this function redirect to approval page.- An 
    private actionClickEvent(cashierId) {
        this.$rootScope.isLoading = true;
        //To get branch list
        let promise = this.IncidentReportWorklistService.resetIncidentReport(cashierId);
        promise.then((result) => {
            if (result.result === "IsNotWorkFlow") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            else if (result.result.IsApproval === false && result.result.IsAddParentRecord === false) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.resetRequestAlreadyExists
                    });
            }
            else if (result.result.IsAddParentRecord === true) {
                this.getIncidentReportWorkList();
                if (result.result.IsApproveByBranchSupervisor)
                    this.ngToast.create(stringConstants.resetRequestSucessfully);
                else
                    this.ngToast.create(stringConstants.resetSucessfully);
            }
            else if (result.result.IsApproval === true) {
                this.$location.path("/ManageIncidentReportApproval/" + cashierId);
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

}

app.controller(IncidentRportWorklistController.controllerId, ['$scope', '$log', 'incidentReportWorklistService', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams) => {
    return new IncidentRportWorklistController($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams);
}]);

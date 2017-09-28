// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IincidentReportControllerScope extends ng.IScope {
    getAllIncidentReportWorkList: Function;
    totalCollection: any;
    incidentReportCollection: any;
    errorMessageDisplayForBlankList: boolean;
    itemsPerPage: number;
    currentPage: number;
    maxSize: number;
    serachFilter: number;
    entryLimit: number;
    totalItems: any;
    getIncidentReportDetailsById: Function;
    getIncidentDetailsById: Function;
    incidentReportDetail: any;
    editItemInformation: Function;
    cancelButtonEvent: Function;
    submitIncidentReport: Function;
    reviewIncidentReportDetails: Function;
    incidentReportApproveAndReject: Function;
    branchList: any;
    incidentReportTotalCollection: any;
    search: any;
    searchIncidentDetails: Function;
    isDataLoading: boolean;
    noItemFound: any;
    validIncidentQuantity: any;
    validQuantityError: any;
}

interface IincidentReportController {

}

class IncidentReportController implements IincidentReportController {
    static controllerId = "incidentReportController";
    public itemDetailModelDialogBox;
    constructor(private $scope: IincidentReportControllerScope, private $log: ng.ILogService, public $rootScope, public apiPath, public ngToast, public $location, public $modal, public filterFilter, public $routeParams, private incidentReportService: IncidentReportService, private addNewItemProfileService: AddNewItemProfileService) {

        this.$scope.getAllIncidentReportWorkList = () => this.getAllIncidentReportWorkList();
        this.$scope.totalCollection = [];
        this.$scope.incidentReportCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.search = [];
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.totalCollection = [];
        let reportPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.incidentReportCollection.slice(begin, end);
        });

        this.$scope.getIncidentReportDetailsById = () => this.getIncidentReportDetailsById();
        this.$scope.getIncidentDetailsById = (incidentId: number) => this.getIncidentDetailsById(incidentId);
        this.$scope.incidentReportDetail = new Model.PosIncidentReportAc();
        this.$scope.editItemInformation = (itemId: number) => this.editItemInformation(itemId);
        this.$scope.cancelButtonEvent = () => this.cancelButtonEvent();
        this.$scope.submitIncidentReport = (incidentReportDetails: Model.PosIncidentReportAc) => this.submitIncidentReport(incidentReportDetails);
        this.$scope.reviewIncidentReportDetails = (incidentReportDetails: Model.PosIncidentReportAc) => this.reviewIncidentReportDetails(incidentReportDetails);
        this.$scope.incidentReportApproveAndReject = (incidentReportDetails: Model.PosIncidentReportAc, status: boolean) => this.incidentReportApproveAndReject(incidentReportDetails, status);
        this.$scope.branchList = [];
        this.$scope.incidentReportTotalCollection = [];
        this.$scope.searchIncidentDetails = () => this.searchIncidentDetails();
        this.$scope.isDataLoading = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validIncidentQuantity = stringConstants.validIncidentQuantity;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialize();
    }

    private initialize() {

        this.getBranchList();
    }


    //incident detail search panel.
    private searchIncidentDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.incidentReportCollection = this.filterFilter((controllerScope.incidentReportTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.incidentReportCollection.length === 0) {
            //   this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.search = [];
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.incidentReportCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.incidentReportCollection.length;
            controllerScope.search = [];
            controllerScope.errorMessageDisplayForBlankList = false;
        }
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        //To get branch list
        let promise = this.addNewItemProfileService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ BranchId: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
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

    private getAllIncidentReportWorkList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let promise = this.incidentReportService.getAllIncidentReportWorkList();
        controllerScope.incidentReportCollection = [];
        controllerScope.incidentReportTotalCollection = [];
        controllerScope.isDataLoading = true;
        promise.then((result) => {
            this.$log.log("get all incident report succssfully");
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            } else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.incidentReportCollection.push(result[i]);
                }

                controllerScope.incidentReportTotalCollection = controllerScope.incidentReportCollection;
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.incidentReportCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.incidentReportCollection.length;
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isDataLoading = false;
            }
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                this.$log.log(error);

            }

            this.$log.log(error);
        });
    }

    private getIncidentReportDetailsById() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        let incidentId = this.$routeParams.id;
        let promise = this.incidentReportService.getIncidentReportDetailsById(incidentId);
        promise.then((result) => {
            this.$log.log("get incident report details succssfully", result);
            controllerScope.incidentReportDetail = result;
            if (result.ShelfQuantity === 0) {
                controllerScope.incidentReportDetail.ShelfQuantity = "";
            }
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                this.$log.log(error);

            }

            this.$log.log(error);
        });
    }

    private getIncidentDetailsById(incidentId) {
        this.$location.path("/IncidentReportDetail/" + incidentId);
    }

    private editItemInformation(itemId) {
        this.$location.path("/EditItemDetail/" + itemId);
    }

    private cancelButtonEvent() {
        this.$location.path("/IncidentReport/");
    }

    private submitIncidentReport(incidentReportDetails) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.incidentReportService.submitIncidentReport(incidentReportDetails);
        promise.then((result) => {

            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            }
            else {
                this.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.incidentReport
                    });
                this.$location.path("/IncidentReport/");
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

            this.$log.log(error);
        });
    }

    private reviewIncidentReportDetails(incidentReportDetails) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.incidentReportService.reviewIncidentReportDetails(incidentReportDetails);
        promise.then((result) => {

            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            } else {
                this.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.reviewIncidentReport
                    });
                this.$location.path("/IncidentReport/");
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

            this.$log.log(error);
        });
    }

    private incidentReportApproveAndReject(incidentReportDetails, status) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        incidentReportDetails.IsStatus = status;
        let promise = this.incidentReportService.incidentReportApproveAndReject(incidentReportDetails);
        promise.then((result) => {

            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            }
            else if (result.status === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
            }
            else {
                if (status) {
                    this.ngToast.create(
                        {
                            className: 'success',
                            content: stringConstants.incidentReportApproval
                        });
                } else {
                    this.ngToast.create(
                        {
                            className: 'success',
                            content: stringConstants.incidentReportReject
                        });
                }

                this.$location.path("/IncidentReport/");
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }

            this.$log.log(error);
        });
    }
}

app.controller(IncidentReportController.controllerId, ['$scope', '$log', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', 'incidentReportService', 'addNewItemProfileService', ($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, incidentReportService, addNewItemProfileService) => {
    return new IncidentReportController($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, incidentReportService, addNewItemProfileService);
}]);

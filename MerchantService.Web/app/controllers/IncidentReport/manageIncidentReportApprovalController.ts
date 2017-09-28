interface ImanageIncidentReportApprovalControllerScope extends ng.IScope {
    manageIncidentReportList: any;
    approveButtonClick: Function;
    cancelButtonClick: Function;

}

interface ImanageIncidentReportApprovalController {

}

class ManageIncidentReportApprovalController implements ImanageIncidentReportApprovalController {
    static controllerId = "manageIncidentReportApprovalController";
    constructor(private $scope: ImanageIncidentReportApprovalControllerScope, private $log: ng.ILogService, private IncidentReportWorklistService: IncidentReportWorklistService, public $rootScope, public apiPath, public ngToast, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.manageIncidentReportList = [];
        this.$scope.approveButtonClick = () => this.approveButtonClick();
        this.$scope.cancelButtonClick = () => this.cancelButtonClick();
        this.Initialize();

    }

    private Initialize() {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.$rootScope.isLoading = true;
            //To get branch list
            let promise = this.IncidentReportWorklistService.getIncidentReportDetialById(this.$routeParams.id);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    this.$scope.manageIncidentReportList.CashierId = result.CashierId;
                    this.$scope.manageIncidentReportList.Cashier = result.Cashier;
                    this.$scope.manageIncidentReportList.BranchName = result.BranchName;
                    this.$scope.manageIncidentReportList.LimitReachedDate = result.ReachedDate;
                    this.$scope.manageIncidentReportList.LimitReachedTime = result.ReachedTime;
                    this.$scope.manageIncidentReportList.Comment = result.Comment;
                    this.$scope.manageIncidentReportList.Status = result.Status;
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

    private approveButtonClick() {
        this.$rootScope.isLoading = true;
        let promise = this.IncidentReportWorklistService.approveButtonClick(this.$scope.manageIncidentReportList.CashierId);
        promise.then((result) => {
            if (result.result === true) {
                this.ngToast.create(stringConstants.manageIncidentReportApproveSuccesfully);
                this.$location.path("/ManageIncidentReportWorklist/");
            }
            else if (result.result === false) {
                if (result.status === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                }
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

    private cancelButtonClick() {
        this.$location.path("/ManageIncidentReportWorklist/");
    }
}

app.controller(ManageIncidentReportApprovalController.controllerId, ['$scope', '$log', 'incidentReportWorklistService', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams) => {
    return new ManageIncidentReportApprovalController($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams);
}]);

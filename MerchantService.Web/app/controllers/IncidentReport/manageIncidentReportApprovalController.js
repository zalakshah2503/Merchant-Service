var ManageIncidentReportApprovalController = (function () {
    function ManageIncidentReportApprovalController($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams) {
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
        this.$scope.manageIncidentReportList = [];
        this.$scope.approveButtonClick = function () { return _this.approveButtonClick(); };
        this.$scope.cancelButtonClick = function () { return _this.cancelButtonClick(); };
        this.Initialize();
    }
    ManageIncidentReportApprovalController.prototype.Initialize = function () {
        var _this = this;
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.$rootScope.isLoading = true;
            //To get branch list
            var promise = this.IncidentReportWorklistService.getIncidentReportDetialById(this.$routeParams.id);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    _this.$scope.manageIncidentReportList.CashierId = result.CashierId;
                    _this.$scope.manageIncidentReportList.Cashier = result.Cashier;
                    _this.$scope.manageIncidentReportList.BranchName = result.BranchName;
                    _this.$scope.manageIncidentReportList.LimitReachedDate = result.ReachedDate;
                    _this.$scope.manageIncidentReportList.LimitReachedTime = result.ReachedTime;
                    _this.$scope.manageIncidentReportList.Comment = result.Comment;
                    _this.$scope.manageIncidentReportList.Status = result.Status;
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
        }
    };
    ManageIncidentReportApprovalController.prototype.approveButtonClick = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.IncidentReportWorklistService.approveButtonClick(this.$scope.manageIncidentReportList.CashierId);
        promise.then(function (result) {
            if (result.result === true) {
                _this.ngToast.create(stringConstants.manageIncidentReportApproveSuccesfully);
                _this.$location.path("/ManageIncidentReportWorklist/");
            }
            else if (result.result === false) {
                if (result.status === stringConstants.alreadyActivityProcessed) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
                }
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
    ManageIncidentReportApprovalController.prototype.cancelButtonClick = function () {
        this.$location.path("/ManageIncidentReportWorklist/");
    };
    return ManageIncidentReportApprovalController;
}());
ManageIncidentReportApprovalController.controllerId = "manageIncidentReportApprovalController";
app.controller(ManageIncidentReportApprovalController.controllerId, ['$scope', '$log', 'incidentReportWorklistService', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams) {
        return new ManageIncidentReportApprovalController($scope, $log, IncidentReportWorklistService, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=manageIncidentReportApprovalController.js.map
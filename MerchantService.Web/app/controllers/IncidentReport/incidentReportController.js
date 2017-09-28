// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var IncidentReportController = (function () {
    function IncidentReportController($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, incidentReportService, addNewItemProfileService) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.incidentReportService = incidentReportService;
        this.addNewItemProfileService = addNewItemProfileService;
        this.$scope.getAllIncidentReportWorkList = function () { return _this.getAllIncidentReportWorkList(); };
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
        var reportPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.incidentReportCollection.slice(begin, end);
        });
        this.$scope.getIncidentReportDetailsById = function () { return _this.getIncidentReportDetailsById(); };
        this.$scope.getIncidentDetailsById = function (incidentId) { return _this.getIncidentDetailsById(incidentId); };
        this.$scope.incidentReportDetail = new Model.PosIncidentReportAc();
        this.$scope.editItemInformation = function (itemId) { return _this.editItemInformation(itemId); };
        this.$scope.cancelButtonEvent = function () { return _this.cancelButtonEvent(); };
        this.$scope.submitIncidentReport = function (incidentReportDetails) { return _this.submitIncidentReport(incidentReportDetails); };
        this.$scope.reviewIncidentReportDetails = function (incidentReportDetails) { return _this.reviewIncidentReportDetails(incidentReportDetails); };
        this.$scope.incidentReportApproveAndReject = function (incidentReportDetails, status) { return _this.incidentReportApproveAndReject(incidentReportDetails, status); };
        this.$scope.branchList = [];
        this.$scope.incidentReportTotalCollection = [];
        this.$scope.searchIncidentDetails = function () { return _this.searchIncidentDetails(); };
        this.$scope.isDataLoading = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validIncidentQuantity = stringConstants.validIncidentQuantity;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialize();
    }
    IncidentReportController.prototype.initialize = function () {
        this.getBranchList();
    };
    //incident detail search panel.
    IncidentReportController.prototype.searchIncidentDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.incidentReportCollection = this.filterFilter((controllerScope.incidentReportTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.incidentReportCollection.length === 0) {
            //   this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.search = [];
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.incidentReportCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.incidentReportCollection.length;
            controllerScope.search = [];
            controllerScope.errorMessageDisplayForBlankList = false;
        }
    };
    //this funciton used for get branch list -An
    IncidentReportController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.addNewItemProfileService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ BranchId: result[i].Id, Name: result[i].Name });
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
    IncidentReportController.prototype.getAllIncidentReportWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var promise = this.incidentReportService.getAllIncidentReportWorkList();
        controllerScope.incidentReportCollection = [];
        controllerScope.incidentReportTotalCollection = [];
        controllerScope.isDataLoading = true;
        promise.then(function (result) {
            _this.$log.log("get all incident report succssfully");
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.incidentReportCollection.push(result[i]);
                }
                controllerScope.incidentReportTotalCollection = controllerScope.incidentReportCollection;
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.incidentReportCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.incidentReportCollection.length;
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isDataLoading = false;
            }
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                _this.$log.log(error);
            }
            _this.$log.log(error);
        });
    };
    IncidentReportController.prototype.getIncidentReportDetailsById = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        var incidentId = this.$routeParams.id;
        var promise = this.incidentReportService.getIncidentReportDetailsById(incidentId);
        promise.then(function (result) {
            _this.$log.log("get incident report details succssfully", result);
            controllerScope.incidentReportDetail = result;
            if (result.ShelfQuantity === 0) {
                controllerScope.incidentReportDetail.ShelfQuantity = "";
            }
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                _this.$log.log(error);
            }
            _this.$log.log(error);
        });
    };
    IncidentReportController.prototype.getIncidentDetailsById = function (incidentId) {
        this.$location.path("/IncidentReportDetail/" + incidentId);
    };
    IncidentReportController.prototype.editItemInformation = function (itemId) {
        this.$location.path("/EditItemDetail/" + itemId);
    };
    IncidentReportController.prototype.cancelButtonEvent = function () {
        this.$location.path("/IncidentReport/");
    };
    IncidentReportController.prototype.submitIncidentReport = function (incidentReportDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.incidentReportService.submitIncidentReport(incidentReportDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                _this.ngToast.create({
                    className: 'success',
                    content: stringConstants.incidentReport
                });
                _this.$location.path("/IncidentReport/");
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IncidentReportController.prototype.reviewIncidentReportDetails = function (incidentReportDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.incidentReportService.reviewIncidentReportDetails(incidentReportDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                _this.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIncidentReport
                });
                _this.$location.path("/IncidentReport/");
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    IncidentReportController.prototype.incidentReportApproveAndReject = function (incidentReportDetails, status) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        incidentReportDetails.IsStatus = status;
        var promise = this.incidentReportService.incidentReportApproveAndReject(incidentReportDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else if (result.status === stringConstants.alreadyActivityProcessed) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            else {
                if (status) {
                    _this.ngToast.create({
                        className: 'success',
                        content: stringConstants.incidentReportApproval
                    });
                }
                else {
                    _this.ngToast.create({
                        className: 'success',
                        content: stringConstants.incidentReportReject
                    });
                }
                _this.$location.path("/IncidentReport/");
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    return IncidentReportController;
}());
IncidentReportController.controllerId = "incidentReportController";
app.controller(IncidentReportController.controllerId, ['$scope', '$log', '$rootScope', 'apiPath', 'ngToast', '$location', '$modal', 'filterFilter', '$routeParams', 'incidentReportService', 'addNewItemProfileService', function ($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, incidentReportService, addNewItemProfileService) {
        return new IncidentReportController($scope, $log, $rootScope, apiPath, ngToast, $location, $modal, filterFilter, $routeParams, incidentReportService, addNewItemProfileService);
    }]);
//# sourceMappingURL=incidentReportController.js.map
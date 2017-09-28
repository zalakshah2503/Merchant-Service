var statusController = (function () {
    function statusController($scope, $log, statusService, $rootScope, $location, $routeParams, $modal, apiPath) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.statusService = statusService;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$modal = $modal;
        this.apiPath = apiPath;
        this.$scope.getallStatus = function () { return _this.getallStatus(); };
        this.$scope.statusCollection = [];
        this.$scope.statusErrorErrorMessageDisplay = false;
        this.$scope.addNewStatus = function () { return _this.addNewStatus(); };
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessage = "";
        var status = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.statusCollection.slice(begin, end);
        });
        this.$scope.statusTypeDetails = new Model.StatusType();
        this.$scope.editStatus = function (statusId) { return _this.editStatus(statusId); };
        this.$scope.newStatusPanel = false;
        this.$scope.isFocusIn = true;
        this.$scope.cancelStatusDetails = function () { return _this.cancelStatusDetails(); };
        this.$scope.updateStatusDetails = function (statusType) { return _this.updateStatusDetails(statusType); };
        this.$scope.isUpdateStatus = false;
        this.$scope.isStatusNameExist = false;
        this.$scope.statusErrorMessage = "";
        this.$scope.saveStatusDetails = function (statusType) { return _this.saveStatusDetails(statusType); };
    }
    statusController.prototype.getallStatus = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.statusCollection = [];
        var statusCollection = controllerScope.statusCollection;
        var promise = this.statusService.getallStatus();
        promise.then(function (result) {
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.statusErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    statusCollection.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = statusCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.statusCollection.length;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.statusErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
        ;
    };
    statusController.prototype.addNewStatus = function () {
        var controllerScope = this.$scope;
        controllerScope.newStatusPanel = true;
    };
    statusController.prototype.editStatus = function (statusId) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.statusCollection.length; i++) {
            if (controllerScope.statusCollection[i].StatusId == statusId) {
                controllerScope.newStatusPanel = true;
                controllerScope.isUpdateStatus = true;
                controllerScope.statusTypeDetails = controllerScope.statusCollection[i];
                break;
            }
        }
    };
    statusController.prototype.cancelStatusDetails = function () {
        var controllerScope = this.$scope;
        controllerScope.newStatusPanel = false;
        controllerScope.isUpdateStatus = false;
        controllerScope.status.$setPristine();
        controllerScope.status.$setValidity();
        controllerScope.status.$setUntouched();
    };
    statusController.prototype.updateStatusDetails = function (statusType) {
        var _this = this;
        var controllerScope = this.$scope;
        var contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        var promise = this.statusService.updateStatusDetails(statusType);
        promise.then(function (result) {
            _this.$log.log("update status successfully");
            controllerScope.newStatusPanel = false;
            controllerScope.statusTypeDetails = new Model.StatusType();
            for (var i = 0; i < controllerScope.totalCollection.length; i++) {
                if (controllerScope.statusCollection[i].StatusId == result.StatusId) {
                    controllerScope.newStatusPanel = false;
                    controllerScope.isUpdateStatus = false;
                    controllerScope.statusCollection[i].Name = result.Name;
                    break;
                }
            }
            contollerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data == "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerScope.isStatusNameExist = true;
                controllerScope.statusErrorMessage = error.data.ExceptionMessage;
            }
            contollerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    statusController.prototype.saveStatusDetails = function (statusType) {
        var _this = this;
        var controllerScope = this.$scope;
        var contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        var promise = this.statusService.saveStatusDetails(statusType);
        promise.then(function (result) {
            _this.$log.log("save status successfully.");
            contollerRootScope.isLoading = false;
            controllerScope.newStatusPanel = false;
            controllerScope.isUpdateStatus = false;
            _this.getallStatus();
        }).catch(function (error) {
            if (error.data == "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                controllerScope.isStatusNameExist = true;
                controllerScope.statusErrorMessage = error.data.ExceptionMessage;
            }
            contollerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    return statusController;
}());
statusController.controllerId = "statusController";
app.controller(statusController.controllerId, ['$scope', '$log', 'statusService', '$rootScope', '$location', '$routeParams', '$modal', 'apiPath', function ($scope, $log, statusService, $rootScope, $location, $routeParams, $modal, apiPath) {
        return new statusController($scope, $log, statusService, $rootScope, $location, $routeParams, $modal, apiPath);
    }]);
//# sourceMappingURL=statusController.js.map
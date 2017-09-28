/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var ResetPasswordController = (function () {
    function ResetPasswordController($scope, $log, resetPasswordService, $rootScope, $location, $routeParams, $modal, filterFilter, apiPath) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.resetPasswordService = resetPasswordService;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.apiPath = apiPath;
        this.$scope.userDetail = new Model.UserDetail();
        this.$scope.search = "";
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.userName = "";
        this.$scope.resetUserPassword = function (userId) { return _this.resetUserPassword(userId); };
        this.$scope.closeResetPasswordDialogbox = function () { return _this.closeResetPasswordDialogbox(); };
        this.$scope.openResetPasswordDialogbox = function (user) { return _this.openResetPasswordDialogbox(user); };
        this.$scope.getAllUserList = function () { return _this.getAllUserList(); };
        this.$scope.isPasswordVisible = false;
        this.$scope.userPassword = "";
        this.$scope.closeOtpDailogbox = function () { return _this.closeOtpDailogbox(); };
        this.$scope.totalCollection = [];
        this.$scope.userList = [];
        this.$scope.userDetail = new Model.UserDetail();
        /* init pagination with current page and item per page.*/
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.userList.slice(begin, end);
        });
        this.$scope.errorMessage = "";
        this.$scope.userErrorMessageDisplay = false;
        this.$scope.userTotalCollection = [];
        this.$scope.searchUserDetails = function () { return _this.searchUserDetails(); };
        this.$scope.isResetSucceeded = false;
        this.$scope.isFocusIn = true;
    }
    //reset password confirmation dialog box.
    ResetPasswordController.prototype.openResetPasswordDialogbox = function (user) {
        var controllerScope = this.$scope;
        controllerScope.isPasswordVisible = false;
        this.resetPasswordModal = this.$modal.open({
            templateUrl: 'resetPasswordConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.userDetail = user;
    };
    //Reset one time user password.
    ResetPasswordController.prototype.resetUserPassword = function (userId) {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.resetPasswordService.resetUserPassword(userId);
        promise.then(function (result) {
            controllerScope.isPasswordVisible = true;
            controllerScope.isResetSucceeded = result.Succeeded;
            controllerScope.userPassword = result.ResetPassword;
        }).catch(function (error) {
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(_this.apiPath);
        });
    };
    //close the OTP dialog box.
    ResetPasswordController.prototype.closeOtpDailogbox = function () {
        var controllerScope = this.$scope;
        this.closeResetPasswordDialogbox();
        this.getAllUserList();
    };
    //closing reset password dialog box.
    ResetPasswordController.prototype.closeResetPasswordDialogbox = function () {
        this.resetPasswordModal.dismiss('cancel');
    };
    //get all user list
    ResetPasswordController.prototype.getAllUserList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.userList = [];
        var userCollection = controllerScope.userList;
        var promise = this.resetPasswordService.getAllUserList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    userCollection.push(result[i]);
                }
                controllerScope.userTotalCollection = userCollection;
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = userCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.userList.length;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //user detail search panel.
    ResetPasswordController.prototype.searchUserDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.userList = this.filterFilter((controllerScope.userTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.userList.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.userErrorMessageDisplay = true;
            controllerScope.search = "";
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.userList.slice(begin, end);
            controllerScope.totalItems = controllerScope.userList.length;
            controllerScope.search = "";
            controllerScope.userErrorMessageDisplay = false;
        }
    };
    return ResetPasswordController;
}());
ResetPasswordController.controllerId = "ResetPasswordController";
app.controller(ResetPasswordController.controllerId, ['$scope', '$log', 'ResetPasswordService', '$rootScope', '$location', '$routeParams', '$modal', 'filterFilter', 'apiPath', function ($scope, $log, resetPasswordService, $rootScope, $location, $routeParams, $modal, filterFilter, apiPath) {
        return new ResetPasswordController($scope, $log, resetPasswordService, $rootScope, $location, $routeParams, $modal, filterFilter, apiPath);
    }]);
//# sourceMappingURL=resetPasswordController.js.map
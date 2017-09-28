/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IResetPasswordControllerScope extends ng.IScope {
    search: string;
    itemsPerPage: number;
    currentPage: number;
    maxSize: number;
    serachFilter: number;
    entryLimit: number;
    totalCollection: any;
    userList: any;
    userDetail: Model.UserDetail;
    errorMessage: string;
    userErrorMessageDisplay: boolean;
    userTotalCollection: any;
    totalItems: any;
    resetUserPassword: Function;
    userName: string;
    closeResetPasswordDialogbox: Function;
    openResetPasswordDialogbox: Function;
    getAllUserList: Function;
    isPasswordVisible: boolean;
    userPassword: any;
    closeOtpDailogbox: Function;
    searchUserDetails: Function;
    isResetSucceeded: boolean;
    isFocusIn: boolean;
}

interface IResetPasswordController {

}

class ResetPasswordController implements IResetPasswordController {
    static controllerId = "ResetPasswordController";
    public resetPasswordModal;

    constructor(private $scope: IResetPasswordControllerScope, private $log: ng.ILogService, private resetPasswordService: ResetPasswordService, public $rootScope, public $location: ng.ILocationService, public $routeParams, public $modal, public filterFilter, private apiPath) {
        this.$scope.userDetail = new Model.UserDetail();
        this.$scope.search = "";
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.userName = "";
        this.$scope.resetUserPassword = (userId: number) => this.resetUserPassword(userId);
        this.$scope.closeResetPasswordDialogbox = () => this.closeResetPasswordDialogbox();
        this.$scope.openResetPasswordDialogbox = (user: Model.UserDetail) => this.openResetPasswordDialogbox(user);
        this.$scope.getAllUserList = () => this.getAllUserList();
        this.$scope.isPasswordVisible = false;
        this.$scope.userPassword = "";
        this.$scope.closeOtpDailogbox = () => this.closeOtpDailogbox();
        this.$scope.totalCollection = [];
        this.$scope.userList = [];
        this.$scope.userDetail = new Model.UserDetail();
        /* init pagination with current page and item per page.*/
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.userList.slice(begin, end);
        });
        this.$scope.errorMessage = "";
        this.$scope.userErrorMessageDisplay = false;
        this.$scope.userTotalCollection = [];
        this.$scope.searchUserDetails = () => this.searchUserDetails();
        this.$scope.isResetSucceeded = false;
        this.$scope.isFocusIn = true;
    }

    //reset password confirmation dialog box.
    private openResetPasswordDialogbox(user) {
        let controllerScope = this.$scope;
        controllerScope.isPasswordVisible = false;
        this.resetPasswordModal = this.$modal.open({
            templateUrl: 'resetPasswordConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.userDetail = user;
    }
    //Reset one time user password.
    private resetUserPassword(userId) {
        let controllerScope = this.$scope;
        let promise = this.resetPasswordService.resetUserPassword(userId);
        promise.then((result) => {
            controllerScope.isPasswordVisible = true;
            controllerScope.isResetSucceeded = result.Succeeded;
            controllerScope.userPassword = result.ResetPassword;
        }).catch((error) => {
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(this.apiPath);
        });
    }

    //close the OTP dialog box.
    private closeOtpDailogbox() {
        let controllerScope = this.$scope;
        this.closeResetPasswordDialogbox();
        this.getAllUserList();
    }

    //closing reset password dialog box.
    private closeResetPasswordDialogbox() {
        this.resetPasswordModal.dismiss('cancel');
    }

    //get all user list
    private getAllUserList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.userList = [];
        let userCollection = controllerScope.userList;
        let promise = this.resetPasswordService.getAllUserList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            } else {
                for (let i = 0; i < result.length; i++) {
                    userCollection.push(result[i]);
                }
                controllerScope.userTotalCollection = userCollection;
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = userCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.userList.length;
                controllerRootScope.isLoading = false;
            }

        }).catch((error) => {
            this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //user detail search panel.
    private searchUserDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.userList = this.filterFilter((controllerScope.userTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.userList.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.userErrorMessageDisplay = true;
            controllerScope.search = "";
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.userList.slice(begin, end);
            controllerScope.totalItems = controllerScope.userList.length;
            controllerScope.search = "";
            controllerScope.userErrorMessageDisplay = false;
        }
    }

}

app.controller(ResetPasswordController.controllerId, ['$scope', '$log', 'ResetPasswordService', '$rootScope', '$location', '$routeParams', '$modal', 'filterFilter', 'apiPath', ($scope, $log, resetPasswordService, $rootScope, $location, $routeParams, $modal, filterFilter, apiPath) => {
    return new ResetPasswordController($scope, $log, resetPasswordService, $rootScope, $location, $routeParams, $modal, filterFilter, apiPath);
}]);

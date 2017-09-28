/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />

/// <reference path="../services/userDetailService.ts" />

interface IUserDetailControllerScope extends ng.IScope {
    userDetail: Model.UserDetail;
    addUserDetail: Function;
    addUser: Function;
    getBranchList: Function;
    getRoleList: Function;
    getUserList: Function;
    editUser: Function;
    clearChecks: Function;
    deleteUser: Function;
    getDate: Function;
    getUserById: Function;
    openDeleteUserPopup: Function;
    closeDeleteUserPopup: Function;
    changeIsPermanentAddress: Function;
    cancel: Function;
    branchFilter: Function;
    dateChanged: Function;
    onlyRead: any;
    dateError: boolean;
    empId: any;
    userList: any;
    user: any;
    userId: any;
    branchList: any;
    tempBranchList: any;
    roleList: any;
    selectedBranch: any;
    opened: boolean;
    isLoading: boolean;
    isDeletePopupVisible: boolean;
    isUserEmailExist: boolean;
    isUserNameExist: boolean;
    isMobileNoExist: boolean;
    isEmployeeIdExist: boolean;
    isAddUserDisabled: boolean;
    joinLeaveDateError: any;
    isBranchIdNull: boolean;
    updated: boolean;
    isAdd: boolean;
    searchUserDetails: Function;
    search: any;
    totalCollection: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    serachFilter: any;
    entryLimit: any;
    errorMessage: string;
    userErrorMessageDisplay: boolean;
    userTotalCollection: any;
    userNameRequired: any;
    userNameUnique: any;
    emailRequired: any;
    emailUnique: any;
    tempAddressLong: any;
    departmentList: any;
    jobTitleList: any;
    emailInvalid: any;
    roleSelectRequired: any;
    branchSelectRequired: any;
    employeeIdSelectRequired: any;
    employeeIdUnique: any;
    adminRoleId: string;
    mobileUnique: any;
    mobileRequired: any;
    mobileInvalid: any;
    mobileMinlength: any;
    contactInvalid: any;
    contactMinlength: string;
    isJointPickerDateOpened: boolean;
    openJointPickerDate: Function;
    isLeavePickerDateOpened: boolean;
    openLeavePickerDate: Function;
    isBirthPickerDateOpened: boolean;
    openBirthPickerDate: Function;
    superAdminRole: boolean;
    isAdminRole: boolean;
    displayEmployeeId: boolean;
    isFocusIn: boolean;
    tempAddressMoreLines: boolean;
    changePermanentAddress: Function;
    permanentAddressMoreLines: boolean;
    datecheck: any;
}
interface IUserDetailController {

}
class UserDetailController implements IUserDetailController {
    static controllerId = "UserDetailController";
    public deleteUserPopup;

    constructor(private $scope: IUserDetailControllerScope, private $log: ng.ILogService, private userDetailService: UserDetailService, public ngToast, public $rootScope, public $window, public $location: ng.ILocationService, public $routeParams, public $modal, public filterFilter, private $timeout, private apiPath, private adminName, private $filter) {
        this.$scope.userDetail = new Model.UserDetail();

        this.$scope.addUserDetail = () => this.addUserDetail();
        this.$scope.addUser = () => this.addUser();
        this.$scope.getUserById = () => this.getUserById();
        this.$scope.editUser = (name) => this.editUser(name);
        this.$scope.deleteUser = (id) => this.deleteUser(id);
        this.$scope.clearChecks = () => this.clearChecks();
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.getRoleList = () => this.getRoleList();
        this.$scope.getUserList = () => this.getUserList();
        this.$scope.getDate = () => this.getDate();
        this.$scope.cancel = () => this.cancel();
        this.$scope.dateChanged = () => this.dateChanged();
        this.$scope.changePermanentAddress = () => this.changePermanentAddress();
        this.$scope.searchUserDetails = () => this.searchUserDetails();
        this.$scope.openDeleteUserPopup = (user: Model.UserDetail) => this.openDeleteUserPopup(user);
        this.$scope.closeDeleteUserPopup = () => this.closeDeleteUserPopup();
        this.$scope.branchFilter = () => this.branchFilter();
        this.$scope.changeIsPermanentAddress = () => this.changeIsPermanentAddress();
        this.$scope.totalCollection = [];
        this.$scope.userList = [];
        this.$scope.branchList = [];
        this.$scope.tempBranchList = [];
        this.$scope.dateError = false;
        this.$scope.roleList = [];
        this.$scope.onlyRead = false;
        this.$scope.isBranchIdNull = false;
        this.$scope.empId = 1;
        this.$scope.search = "";
        this.$scope.opened = false;
        this.$scope.selectedBranch = "";
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.errorMessage = "";
        this.$scope.userErrorMessageDisplay = false;
        this.$scope.tempAddressMoreLines = false;
        this.$scope.permanentAddressMoreLines = false;
        this.$scope.isAddUserDisabled = true;
        this.$scope.userTotalCollection = [];
        this.$scope.userNameRequired = stringConstants.userNameRequired;
        this.$scope.userNameUnique = stringConstants.userNameUnique;
        this.$scope.emailUnique = stringConstants.emailUnique;
        this.$scope.tempAddressLong = stringConstants.tempAddressLong;
        this.$scope.emailInvalid = stringConstants.emailInvalid;
        this.$scope.emailRequired = stringConstants.emailRequired;
        this.$scope.adminRoleId = stringConstants.adminRoleId;
        this.$scope.roleSelectRequired = stringConstants.roleSelectRequired;
        this.$scope.branchSelectRequired = stringConstants.branchSelectRequired;
        this.$scope.employeeIdSelectRequired = stringConstants.employeeIdSelectRequired;
        this.$scope.employeeIdUnique = stringConstants.employeeIdUnique;
        this.$scope.mobileUnique = stringConstants.mobileUnique;
        this.$scope.joinLeaveDateError = stringConstants.joinLeaveDateError;
        this.$scope.mobileRequired = stringConstants.mobileRequired;
        this.$scope.mobileInvalid = stringConstants.mobileInvalid;
        this.$scope.mobileMinlength = stringConstants.mobileMinlength;
        this.$scope.contactInvalid = stringConstants.contactInvalid;
        this.$scope.contactMinlength = stringConstants.contactMinlength;
        this.$scope.jobTitleList = stringConstants.jobTitleList;
        this.$scope.departmentList = stringConstants.departmentList;
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.userList.slice(begin, end);
        });
        this.$scope.isJointPickerDateOpened = false;
        this.$scope.openJointPickerDate = (event) => this.openJointPickerDate(event);
        this.$scope.isLeavePickerDateOpened = false;
        this.$scope.openLeavePickerDate = (event) => this.openLeavePickerDate(event);
        this.$scope.isBirthPickerDateOpened = false;
        this.$scope.openBirthPickerDate = (event) => this.openBirthPickerDate(event);
        this.$scope.isAdminRole = false;
        this.$scope.displayEmployeeId = false;
        this.$scope.isFocusIn = true;
        this.initialize();
    }

    // used to redirect to AddUser page - jj
    private addUser = function () {
        let scope = this.$scope;
        scope.onlyRead = false;
        let today = new Date();
        scope.userDetail.JoinDate = today.getDate();
        window.location.assign('#AddUser');
    };

    //called in AddUser page - jj
    private initialize() {
        //window.onload = function () {
        //    let input = document.getElementById("userName").focus();
        //}
        this.getBranchList();
        if (this.adminName !== "SuperAdmin") {
            this.$scope.superAdminRole = false;
        }
        else {
            //   this.getRoleList();
            this.$scope.isAddUserDisabled = false;
            this.$scope.superAdminRole = true;
        }

        //this.getEmployeeId();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getUserById();
        }
    }

    // used for opening the DeleteUserPopup-jj
    private openDeleteUserPopup(user) {
        let controllerScope = this.$scope;
        this.deleteUserPopup = this.$modal.open({
            templateUrl: 'DeleteUserPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.userDetail = user;
    }

    //used for closing  the DeleteUserPopup-jj
    private closeDeleteUserPopup() {
        this.deleteUserPopup.dismiss('cancel');
    }

    // ON changing the selection of checkbox(ispermanentaddress) this method would be called and if the checkbox is checked
    // then the value of permanent address would be the same as permanent address. - jj
    private changeIsPermanentAddress() {
        let controllerScope = this.$scope;
        controllerScope.tempAddressMoreLines = false;
        if (controllerScope.userDetail.TemporaryAddress !== "" && controllerScope.userDetail.TemporaryAddress !== null && controllerScope.userDetail.TemporaryAddress !== undefined) {
            $("input.chkSameAsTempAdd").removeAttr('disabled');
        }
        else {
            $("input.chkSameAsTempAdd").attr('disabled', 'disabled');
        }
        if (controllerScope.userDetail.IsSamePermanentAddress === true) {
            controllerScope.userDetail.PermanentAddress = controllerScope.userDetail.TemporaryAddress;
        }
        else {
            controllerScope.userDetail.PermanentAddress = controllerScope.userDetail.PermanentAddress;
        }

        let newLines = controllerScope.userDetail.TemporaryAddress.split("\n").length;
        if (newLines > 12) {
            controllerScope.tempAddressMoreLines = true;
        }
        this.changePermanentAddress();
    }

    //called when the Permanent Address changes - JJ
    private changePermanentAddress() {
        let controllerScope = this.$scope;
        controllerScope.permanentAddressMoreLines = false;
        if (controllerScope.userDetail.PermanentAddress !== "" && controllerScope.userDetail.PermanentAddress !== null && controllerScope.userDetail.PermanentAddress !== undefined) {
            let newLines = controllerScope.userDetail.PermanentAddress.split("\n").length;
            if (newLines > 12) {
                controllerScope.permanentAddressMoreLines = true;
            }
        }
    }

    private dateChanged() {
        let controllerScope = this.$scope;
        controllerScope.dateError = false;
        if (controllerScope.onlyRead) {
            let joinDate = this.$filter('date')(controllerScope.userDetail.JoinDate, 'yyyy/MM/dd');
            let leaveDate = this.$filter('date')(controllerScope.userDetail.LeaveDate, 'yyyy/MM/dd');
            if (joinDate > leaveDate) {
                controllerScope.dateError = true;
            }
        }
    }

    //used to delete user - jj
    private deleteUser(id) {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.userDetailService.deleteUser(id);
        promise.then((result) => {
            this.closeDeleteUserPopup();
            if (result.status === 1) {
                this.getUserList();
                this.ngToast.create(stringConstants.userDetailDeleted);
            }
            else if (result.status === 2) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: "User could not be deleted as there are workflow/s assigned to the user."
                    });
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: "User could not be deleted."
                    });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            // this.$log.log(error);
        });
    }


    ///clear the flags set for checks - jj
    private clearChecks() {
        let scope = this.$scope;
        scope.isMobileNoExist = false;
        scope.isUserEmailExist = false;
        scope.isUserNameExist = false;
        this.$rootScope.isLoading = false;
    }

    //used to get branch list - jj
    private getBranchList() {
        let scope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.userDetailService.getBranchList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                scope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
            }
            scope.tempBranchList = scope.branchList;
            controllerRootScope.isLoading = false;
            this.getRoleList();
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    // used to get role list - jj
    public getRoleList() {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.userDetailService.getRoleList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                scope.roleList.push(result[i]);
            }
            this.getUserList();
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
        });
    }

    // used to get user list - jj
    private getUserList() {
        let scope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.$rootScope.isLoading = true;
        if (scope.roleList.length > 0) {
            for (let j = 0; j < scope.roleList.length; j++) {
                if (!scope.roleList[j].IsAdminRole) {
                    if (!scope.superAdminRole) {
                        if (scope.roleList.length === 1 && scope.roleList[j].Name === "Admin") {
                            scope.isAddUserDisabled = true;
                        }
                        else {
                            scope.isAddUserDisabled = false;
                        }
                    }
                }
                else {
                    scope.isAddUserDisabled = false;
                    scope.superAdminRole = true;
                    scope.userDetail.RoleId = scope.adminRoleId;
                }
            }
        }
        scope.totalCollection = [];
        scope.userList = [];
        let userCollection = scope.userList;
        let promise = this.userDetailService.getUsersList();
        promise.then((result) => {
            if (result.length === 0) {
                scope.errorMessage = stringConstants.errorMessage;
                scope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (let i = 0; i < result.length; i++) {
                    //         userCollection.push({ Id: result[i].Id, FullName: result[i].FullName, UserName: result[i].UserName, BranchId: result[i].BranchId, Branch: result[i].Branch.Name, Department: result[i].Department, JobTitle: result[i].JobTitle, RoleName: result[i].RoleName , MobileNumber: result[i].MobileNumber, EmployeeId: result[i].EmployeeId});
                    userCollection.push(result[i]);
                    scope.isAdminRole = result[i].IsAdminRole;
                    scope.userTotalCollection = userCollection;
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    scope.totalCollection = userCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    scope.totalItems = scope.userList.length;
                    //if (result[i].RoleName === "Supervisor") {
                    //    scope.supervisorList.push({ Id: result[i].Id, FullName: result[i].FullName });
                    //}
                    controllerRootScope.isLoading = false;
                }
            }
        }).catch((error) => {
            //this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                scope.errorMessage = stringConstants.errorMessage;
                scope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    // used to get user with id obtained as route parameter - jj
    private getUserById() {
        let userid = this.$routeParams.id;
        let scope = this.$scope;
        scope.displayEmployeeId = true;
        this.$rootScope.isLoading = true;
        let promise = this.userDetailService.getUserById(userid);
        promise.then((result) => {
            scope.userDetail = result;
            if (userid !== null && userid !== undefined) {
                scope.onlyRead = true;
            }
            this.$rootScope.isLoading = false;

        }).catch((error) => {
            this.$rootScope.isLoading = false;
            //this.$log.log(error);
        });

        if (!userid) {
            scope.userDetail.EmployeeId = scope.empId;
            this.$rootScope.isLoading = false;
        }
    }


    // used to add or update user in database - jj
    private addUserDetail() {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.isAdd = (scope.userDetail.Id === undefined && scope.userDetail.Id === null) ? true : false;
        if (scope.superAdminRole) {
        }
        else {
            if (scope.userDetail.BranchId === null && scope.userDetail.BranchId === undefined) {
                scope.isBranchIdNull = true;
            }
        }

        let promise = this.userDetailService.saveUser(scope.userDetail);
        promise.then((result) => {

            this.clearChecks();
            if (result.IsUserEmailExist) {
                scope.isUserEmailExist = true;

            }
            else if (result.IsUserNameExist) {
                scope.isUserNameExist = true;

            }
            else if (result.IsEmployeeIdExist) {
                scope.isEmployeeIdExist = true;
            }
            else if (result.IsMobileNoExist) {
                scope.isMobileNoExist = true;
            }
            else if (result.status === 0) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: "User could not be found."
                    });
            }
            else if (result.status === 2) {
                window.location.assign('#ManageUser');
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: "User has been updated as an Active user as there are workflows assigned to the user"
                    });
            }
            else {
                if (scope.isAdd) {
                    scope.userList = result;
                    window.location.assign('#ManageUser');
                    this.ngToast.create(stringConstants.userDetailAdded);
                }
                else {
                    window.location.assign('#ManageUser');
                    this.ngToast.create(stringConstants.userDetailUpdated);
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            if (error.status === 0 || error.status === 500) {
            }
            else {
                location.replace('/');
            }
            scope.isLoading = false;
        });

    }

    // datepicker
    private getDate() {
        let scope = this.$scope;
        scope.opened = true;
    }


    // used to redirect to AddUser page - jj
    private editUser(name) {
        let scope = this.$scope;
        scope.isLoading = true;
        scope.userDetail.FullName = name;
        scope.onlyRead = true;
        let x = this;
        x.$location.path("/AddUser/" + name.Id);
    }

    private cancel() {
        window.location.assign('#ManageUser');
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
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.userList.slice(begin, end);
            controllerScope.totalItems = controllerScope.userList.length;
            controllerScope.userErrorMessageDisplay = false;
        }
        controllerScope.search = [];
    }

    private openJointPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isJointPickerDateOpened = true;
    }

    private openLeavePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isLeavePickerDateOpened = true;
    }

    private openBirthPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isBirthPickerDateOpened = true;
    }

    private branchFilter() {
        let controllerScope = this.$scope;
        controllerScope.branchList = this.filterFilter((controllerScope.tempBranchList), controllerScope.search);
    }
}
app.controller(UserDetailController.controllerId, ['$scope', '$log', 'UserDetailService', 'ngToast', '$rootScope', '$window', '$location', '$routeParams', '$modal', 'filterFilter', '$timeout', 'apiPath', 'adminName', '$filter', ($scope, $log, userDetailService, ngToast, $rootScope, $window, $location, $routeParams, $modal, filterFilter, $timeout, apiPath, adminName, $filter) => {

    return new UserDetailController($scope, $log, userDetailService, ngToast, $rootScope, $window, $location, $routeParams, $modal, filterFilter, $timeout, apiPath, adminName, $filter);

}]);  
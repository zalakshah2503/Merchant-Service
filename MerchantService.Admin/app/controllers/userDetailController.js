/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../services/userDetailService.ts" />
var UserDetailController = (function () {
    function UserDetailController($scope, $log, userDetailService, ngToast, $rootScope, $window, $location, $routeParams, $modal, filterFilter, $timeout, apiPath, adminName, $filter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.userDetailService = userDetailService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$timeout = $timeout;
        this.apiPath = apiPath;
        this.adminName = adminName;
        this.$filter = $filter;
        // used to redirect to AddUser page - jj
        this.addUser = function () {
            var scope = this.$scope;
            scope.onlyRead = false;
            var today = new Date();
            scope.userDetail.JoinDate = today.getDate();
            window.location.assign('#AddUser');
        };
        this.$scope.userDetail = new Model.UserDetail();
        this.$scope.addUserDetail = function () { return _this.addUserDetail(); };
        this.$scope.addUser = function () { return _this.addUser(); };
        this.$scope.getUserById = function () { return _this.getUserById(); };
        this.$scope.editUser = function (name) { return _this.editUser(name); };
        this.$scope.deleteUser = function (id) { return _this.deleteUser(id); };
        this.$scope.clearChecks = function () { return _this.clearChecks(); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.getRoleList = function () { return _this.getRoleList(); };
        this.$scope.getUserList = function () { return _this.getUserList(); };
        this.$scope.getDate = function () { return _this.getDate(); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.dateChanged = function () { return _this.dateChanged(); };
        this.$scope.changePermanentAddress = function () { return _this.changePermanentAddress(); };
        this.$scope.searchUserDetails = function () { return _this.searchUserDetails(); };
        this.$scope.openDeleteUserPopup = function (user) { return _this.openDeleteUserPopup(user); };
        this.$scope.closeDeleteUserPopup = function () { return _this.closeDeleteUserPopup(); };
        this.$scope.branchFilter = function () { return _this.branchFilter(); };
        this.$scope.changeIsPermanentAddress = function () { return _this.changeIsPermanentAddress(); };
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
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.userList.slice(begin, end);
        });
        this.$scope.isJointPickerDateOpened = false;
        this.$scope.openJointPickerDate = function (event) { return _this.openJointPickerDate(event); };
        this.$scope.isLeavePickerDateOpened = false;
        this.$scope.openLeavePickerDate = function (event) { return _this.openLeavePickerDate(event); };
        this.$scope.isBirthPickerDateOpened = false;
        this.$scope.openBirthPickerDate = function (event) { return _this.openBirthPickerDate(event); };
        this.$scope.isAdminRole = false;
        this.$scope.displayEmployeeId = false;
        this.$scope.isFocusIn = true;
        this.initialize();
    }
    //called in AddUser page - jj
    UserDetailController.prototype.initialize = function () {
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
    };
    // used for opening the DeleteUserPopup-jj
    UserDetailController.prototype.openDeleteUserPopup = function (user) {
        var controllerScope = this.$scope;
        this.deleteUserPopup = this.$modal.open({
            templateUrl: 'DeleteUserPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.userDetail = user;
    };
    //used for closing  the DeleteUserPopup-jj
    UserDetailController.prototype.closeDeleteUserPopup = function () {
        this.deleteUserPopup.dismiss('cancel');
    };
    // ON changing the selection of checkbox(ispermanentaddress) this method would be called and if the checkbox is checked
    // then the value of permanent address would be the same as permanent address. - jj
    UserDetailController.prototype.changeIsPermanentAddress = function () {
        var controllerScope = this.$scope;
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
        var newLines = controllerScope.userDetail.TemporaryAddress.split("\n").length;
        if (newLines > 12) {
            controllerScope.tempAddressMoreLines = true;
        }
        this.changePermanentAddress();
    };
    //called when the Permanent Address changes - JJ
    UserDetailController.prototype.changePermanentAddress = function () {
        var controllerScope = this.$scope;
        controllerScope.permanentAddressMoreLines = false;
        if (controllerScope.userDetail.PermanentAddress !== "" && controllerScope.userDetail.PermanentAddress !== null && controllerScope.userDetail.PermanentAddress !== undefined) {
            var newLines = controllerScope.userDetail.PermanentAddress.split("\n").length;
            if (newLines > 12) {
                controllerScope.permanentAddressMoreLines = true;
            }
        }
    };
    UserDetailController.prototype.dateChanged = function () {
        var controllerScope = this.$scope;
        controllerScope.dateError = false;
        if (controllerScope.onlyRead) {
            var joinDate = this.$filter('date')(controllerScope.userDetail.JoinDate, 'yyyy/MM/dd');
            var leaveDate = this.$filter('date')(controllerScope.userDetail.LeaveDate, 'yyyy/MM/dd');
            if (joinDate > leaveDate) {
                controllerScope.dateError = true;
            }
        }
    };
    //used to delete user - jj
    UserDetailController.prototype.deleteUser = function (id) {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.userDetailService.deleteUser(id);
        promise.then(function (result) {
            _this.closeDeleteUserPopup();
            if (result.status === 1) {
                _this.getUserList();
                _this.ngToast.create(stringConstants.userDetailDeleted);
            }
            else if (result.status === 2) {
                _this.ngToast.create({
                    className: 'danger',
                    content: "User could not be deleted as there are workflow/s assigned to the user."
                });
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: "User could not be deleted."
                });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            // this.$log.log(error);
        });
    };
    ///clear the flags set for checks - jj
    UserDetailController.prototype.clearChecks = function () {
        var scope = this.$scope;
        scope.isMobileNoExist = false;
        scope.isUserEmailExist = false;
        scope.isUserNameExist = false;
        this.$rootScope.isLoading = false;
    };
    //used to get branch list - jj
    UserDetailController.prototype.getBranchList = function () {
        var _this = this;
        var scope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.userDetailService.getBranchList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                scope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
            }
            scope.tempBranchList = scope.branchList;
            controllerRootScope.isLoading = false;
            _this.getRoleList();
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // used to get role list - jj
    UserDetailController.prototype.getRoleList = function () {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.userDetailService.getRoleList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                scope.roleList.push(result[i]);
            }
            _this.getUserList();
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
        });
    };
    // used to get user list - jj
    UserDetailController.prototype.getUserList = function () {
        var _this = this;
        var scope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.$rootScope.isLoading = true;
        if (scope.roleList.length > 0) {
            for (var j = 0; j < scope.roleList.length; j++) {
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
        var userCollection = scope.userList;
        var promise = this.userDetailService.getUsersList();
        promise.then(function (result) {
            if (result.length === 0) {
                scope.errorMessage = stringConstants.errorMessage;
                scope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    //         userCollection.push({ Id: result[i].Id, FullName: result[i].FullName, UserName: result[i].UserName, BranchId: result[i].BranchId, Branch: result[i].Branch.Name, Department: result[i].Department, JobTitle: result[i].JobTitle, RoleName: result[i].RoleName , MobileNumber: result[i].MobileNumber, EmployeeId: result[i].EmployeeId});
                    userCollection.push(result[i]);
                    scope.isAdminRole = result[i].IsAdminRole;
                    scope.userTotalCollection = userCollection;
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    scope.totalCollection = userCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    scope.totalItems = scope.userList.length;
                    //if (result[i].RoleName === "Supervisor") {
                    //    scope.supervisorList.push({ Id: result[i].Id, FullName: result[i].FullName });
                    //}
                    controllerRootScope.isLoading = false;
                }
            }
        }).catch(function (error) {
            //this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                scope.errorMessage = stringConstants.errorMessage;
                scope.userErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    // used to get user with id obtained as route parameter - jj
    UserDetailController.prototype.getUserById = function () {
        var _this = this;
        var userid = this.$routeParams.id;
        var scope = this.$scope;
        scope.displayEmployeeId = true;
        this.$rootScope.isLoading = true;
        var promise = this.userDetailService.getUserById(userid);
        promise.then(function (result) {
            scope.userDetail = result;
            if (userid !== null && userid !== undefined) {
                scope.onlyRead = true;
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            //this.$log.log(error);
        });
        if (!userid) {
            scope.userDetail.EmployeeId = scope.empId;
            this.$rootScope.isLoading = false;
        }
    };
    // used to add or update user in database - jj
    UserDetailController.prototype.addUserDetail = function () {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.isAdd = (scope.userDetail.Id === undefined && scope.userDetail.Id === null) ? true : false;
        if (scope.superAdminRole) {
        }
        else {
            if (scope.userDetail.BranchId === null && scope.userDetail.BranchId === undefined) {
                scope.isBranchIdNull = true;
            }
        }
        var promise = this.userDetailService.saveUser(scope.userDetail);
        promise.then(function (result) {
            _this.clearChecks();
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
                _this.ngToast.create({
                    className: 'danger',
                    content: "User could not be found."
                });
            }
            else if (result.status === 2) {
                window.location.assign('#ManageUser');
                _this.ngToast.create({
                    className: 'danger',
                    content: "User has been updated as an Active user as there are workflows assigned to the user"
                });
            }
            else {
                if (scope.isAdd) {
                    scope.userList = result;
                    window.location.assign('#ManageUser');
                    _this.ngToast.create(stringConstants.userDetailAdded);
                }
                else {
                    window.location.assign('#ManageUser');
                    _this.ngToast.create(stringConstants.userDetailUpdated);
                }
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 0 || error.status === 500) {
            }
            else {
                location.replace('/');
            }
            scope.isLoading = false;
        });
    };
    // datepicker
    UserDetailController.prototype.getDate = function () {
        var scope = this.$scope;
        scope.opened = true;
    };
    // used to redirect to AddUser page - jj
    UserDetailController.prototype.editUser = function (name) {
        var scope = this.$scope;
        scope.isLoading = true;
        scope.userDetail.FullName = name;
        scope.onlyRead = true;
        var x = this;
        x.$location.path("/AddUser/" + name.Id);
    };
    UserDetailController.prototype.cancel = function () {
        window.location.assign('#ManageUser');
    };
    //user detail search panel.
    UserDetailController.prototype.searchUserDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.userList = this.filterFilter((controllerScope.userTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.userList.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.userErrorMessageDisplay = true;
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.userList.slice(begin, end);
            controllerScope.totalItems = controllerScope.userList.length;
            controllerScope.userErrorMessageDisplay = false;
        }
        controllerScope.search = [];
    };
    UserDetailController.prototype.openJointPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isJointPickerDateOpened = true;
    };
    UserDetailController.prototype.openLeavePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isLeavePickerDateOpened = true;
    };
    UserDetailController.prototype.openBirthPickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isBirthPickerDateOpened = true;
    };
    UserDetailController.prototype.branchFilter = function () {
        var controllerScope = this.$scope;
        controllerScope.branchList = this.filterFilter((controllerScope.tempBranchList), controllerScope.search);
    };
    return UserDetailController;
}());
UserDetailController.controllerId = "UserDetailController";
app.controller(UserDetailController.controllerId, ['$scope', '$log', 'UserDetailService', 'ngToast', '$rootScope', '$window', '$location', '$routeParams', '$modal', 'filterFilter', '$timeout', 'apiPath', 'adminName', '$filter', function ($scope, $log, userDetailService, ngToast, $rootScope, $window, $location, $routeParams, $modal, filterFilter, $timeout, apiPath, adminName, $filter) {
        return new UserDetailController($scope, $log, userDetailService, ngToast, $rootScope, $window, $location, $routeParams, $modal, filterFilter, $timeout, apiPath, adminName, $filter);
    }]);
//# sourceMappingURL=userDetailController.js.map
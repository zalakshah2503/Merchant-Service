/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/useraccess/manageuseraccessservice.ts" />
var ManageUserAccessController = (function () {
    function ManageUserAccessController($scope, $log, manageUserAccessService, $rootScope, apiPath, ngToast) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.manageUserAccessService = manageUserAccessService;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.$scope.userAcessDetail = new Model.UserAcessDetail();
        this.$scope.roleList = [];
        this.$scope.userAccessList = [];
        this.$scope.chekBoxMessage = false;
        this.$scope.roleNameRequired = stringConstants.roleNameRequired;
        this.$scope.checkBoxSelectionRequired = stringConstants.checkBoxSelectionRequired;
        this.$scope.getRoleList = function () { return _this.getRoleList(); };
        this.$scope.getUserAccesListByRoleId = function (roleId) { return _this.getUserAccesListByRoleId(roleId); };
        this.$scope.updateUserAccessDetail = function (userAccessList) { return _this.updateUserAccessDetail(userAccessList); };
        this.$scope.updateUserAccessTable = function (userAccessList) { return _this.updateUserAccessTable(userAccessList); };
        this.$scope.cancleUpdateAccessDetail = function () { return _this.cancleUpdateAccessDetail(); };
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.totalCollectionList = [];
        this.$scope.allCheckBoxChekedEvent = function () { return _this.allCheckBoxChekedEvent(); };
        this.$scope.singleCheckBoxChekedEvent = function () { return _this.singleCheckBoxChekedEvent(); };
        this.$scope.totalCollection = [];
        // this.$scope.paggingEvent = () => this.paggingEvent();
        // this.$scope.userAccessListCollection = [];
        /* init pagination with current page and item per page.*/
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.userAccessList.slice(begin, end);
        });
    }
    //This function used of get role List -An
    ManageUserAccessController.prototype.getRoleList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        var promise = this.manageUserAccessService.getRoleList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.roleList.push({ Id: result[i].Id, RoleName: result[i].RoleName });
                }
            }
            contollerRootScope.isLoading = false;
        }).catch(function (error) {
            contollerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get all form list and also decide which page is active or not.-An
    ManageUserAccessController.prototype.getUserAccesListByRoleId = function (roleId) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.chekBoxMessage = false;
        controllerScope.itemsPerPage = 15;
        controllerScope.currentPage = 1;
        controllerScope.maxSize = 10;
        controllerScope.userAccessList = [];
        controllerScope.totalCollectionList = [];
        var userCollection = controllerScope.userAccessList;
        var contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        var promise = this.manageUserAccessService.getUserAccesListByRoleId(roleId);
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    userCollection.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = userCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.userAccessList.length;
                _this.$scope.singleCheckBoxChekedEvent();
            }
            contollerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.companyErrorMessageDisplay = true;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            contollerRootScope.isLoading = false;
        });
    };
    //This function used for update and insert user access detail in user access table.-An
    ManageUserAccessController.prototype.updateUserAccessDetail = function (userAccessList) {
        var _this = this;
        if (userAccessList.length !== 0) {
            var controllerScope_1 = this.$scope;
            var isActive = false;
            var contollerRootScope_1 = this.$rootScope;
            contollerRootScope_1.isLoading = true;
            for (var i = 0; i < userAccessList.length; i++) {
                if (userAccessList[i].IsActive === true)
                    isActive = true;
            }
            //to check atleast one check box is checked or not.
            if (isActive === false) {
                //This method used for check user access page is exists in table or not using role id.
                var promise = this.manageUserAccessService.getUserAccessByRoleId(userAccessList[0].roleId);
                promise.then(function (result) {
                    if (result.IsResult === true) {
                        controllerScope_1.updateUserAccessTable(userAccessList);
                        controllerScope_1.chekBoxMessage = false;
                    }
                    else {
                        controllerScope_1.chekBoxMessage = true;
                    }
                    contollerRootScope_1.isLoading = false;
                }).catch(function (error) {
                    contollerRootScope_1.isLoading = false;
                    _this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(_this.apiPath);
                    }
                });
            }
            else {
                controllerScope_1.chekBoxMessage = false;
                controllerScope_1.updateUserAccessTable(userAccessList);
            }
        }
    };
    //this function is sub method of insert/update user access detail method.-An
    ManageUserAccessController.prototype.updateUserAccessTable = function (userAccessList) {
        var _this = this;
        var contollerRootScope = this.$rootScope;
        var promise = this.manageUserAccessService.updateUserAccessDetail(userAccessList);
        promise.then(function (result) {
            if (result.IsResult === true) {
                _this.ngToast.create(stringConstants.updateUserAcces);
            }
            contollerRootScope.isLoading = false;
        }).catch(function (error) {
            contollerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //This function used for reset the form -An
    ManageUserAccessController.prototype.cancleUpdateAccessDetail = function () {
        var controllerScope = this.$scope;
        controllerScope.userAcessDetail = new Model.UserAcessDetail();
        this.$scope.chekBoxMessage = false;
        controllerScope.userAccessList = [];
        controllerScope.totalCollection = [];
        controllerScope.totalCollectionList = [];
        controllerScope.userAccess.$setPristine();
        controllerScope.userAccess.$setValidity();
        controllerScope.userAccess.$setUntouched();
        controllerScope.hasChecked = false;
        controllerScope.userAccess.$invalid = true;
    };
    //This function used cheked/unchecked for all chekbox.-An
    ManageUserAccessController.prototype.allCheckBoxChekedEvent = function () {
        for (var i = 0; i < this.$scope.totalCollection.length; i++) {
            if (this.$scope.hasChecked)
                this.$scope.totalCollection[i].IsActive = true;
            else
                this.$scope.totalCollection[i].IsActive = false;
        }
        this.$scope.$apply();
    };
    //This function used for check current page all checkbox is cheked/uncheked(When all chekbox is cheked so all select checkBox is checked other wise unchecked)-An
    ManageUserAccessController.prototype.singleCheckBoxChekedEvent = function () {
        var isActive = true;
        for (var i = 0; i < this.$scope.totalCollection.length; i++) {
            if (this.$scope.totalCollection[i].IsActive === false) {
                isActive = false;
            }
        }
        if (isActive) {
            this.$scope.hasChecked = true;
        }
        else {
            this.$scope.hasChecked = false;
        }
    };
    return ManageUserAccessController;
}());
ManageUserAccessController.controllerId = "ManageUserAccessController";
app.controller(ManageUserAccessController.controllerId, [
    '$scope', '$log', 'ManageUserAccessService', '$rootScope', 'apiPath', 'ngToast', function ($scope, $log, manageUserAccessService, $rootScope, apiPath, ngToast) {
        return new ManageUserAccessController($scope, $log, manageUserAccessService, $rootScope, apiPath, ngToast);
    }
]);
//# sourceMappingURL=manageUserAccessController.js.map
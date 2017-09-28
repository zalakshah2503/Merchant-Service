/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../services/roleservice.ts" />
var RoleController = (function () {
    function RoleController($scope, $log, roleService, ngToast, $rootScope, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.roleService = roleService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$modal = $modal;
        this.$scope.role = new Model.Role();
        this.$scope.addRole = function () { return _this.addRole(); };
        this.$scope.roleList = [];
        this.$scope.getRoleList = function () { return _this.getRoleList(); };
        this.$scope.addNewRole = function () { return _this.addNewRole(); };
        this.$scope.cancelRole = function () { return _this.cancelRole(); };
        this.$scope.editRole = function (id, roleName, roleNameSl) { return _this.editRole(id, roleName, roleNameSl); };
        this.$scope.roleRequired = stringConstants.roleRequired;
        this.$scope.roleNameExist = stringConstants.roleNameExist;
        this.$scope.isRoleListGridVisible = true;
        this.$scope.deleteRole = function (id) { return _this.deleteRole(id); };
        this.$scope.roleNotDeleted = stringConstants.roleNotDeleted;
        this.$scope.deleteError = false;
        this.$scope.checkCompanyCreated = function () { return _this.checkCompanyCreated(); };
        this.$scope.openDeleteRolePopup = function (role) { return _this.openDeleteRolePopup(role); };
        this.$scope.closeDeleteRolePopup = function () { return _this.closeDeleteRolePopup(); };
        this.$scope.isCompanyCreated = true;
        this.initialization();
    }
    RoleController.prototype.initialization = function () {
        this.checkCompanyCreated();
    };
    RoleController.prototype.checkCompanyCreated = function () {
        var controllerScope = this.$scope;
        var promise = this.roleService.CheckCompanyCreatedOrNot();
        promise.then(function (result) {
            if (result.CompanyId === 0) {
                controllerScope.isCompanyCreated = true;
            }
            else {
                controllerScope.isCompanyCreated = false;
            }
        }).catch(function (error) {
        });
    };
    ///display add role panel
    RoleController.prototype.addNewRole = function () {
        var scope = this.$scope;
        scope.isAdd = true;
        scope.isAddRolePanelVisible = true;
        scope.isRoleListGridVisible = false;
    };
    ///clear role textbox and close add role panel
    RoleController.prototype.cancelRole = function () {
        var scope = this.$scope;
        scope.role = new Model.Role();
        scope.isAddRolePanelVisible = false;
        scope.isRoleListGridVisible = true;
        scope.submitted = false;
        scope.isRoleNameExist = false;
        this.$rootScope.isLoading = false;
    };
    ///add role in database
    RoleController.prototype.addRole = function () {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.roleService.saveRoleInfo(scope.role);
        promise.then(function (result) {
            if (result.isRoleNameExist !== undefined && result.isRoleNameExist !== null) {
                scope.isRoleNameExist = true;
                _this.$rootScope.isLoading = false;
                return;
            }
            if (scope.isAdd) {
                scope.roleList.push({ Id: result.Id, RoleName: result.RoleName, RoleNameSl: result.RoleNameSl });
                _this.cancelRole();
                _this.ngToast.create(stringConstants.roleAdded);
            }
            else {
                for (var i = 0; i < scope.roleList.length; i++) {
                    if (result.Id === scope.roleList[i].Id) {
                        scope.roleList[i].RoleName = result.RoleName;
                        scope.roleList[i].RoleNameSl = result.RoleNameSl;
                        _this.cancelRole();
                        _this.ngToast.create(stringConstants.roleUpdated);
                    }
                }
            }
        }).catch(function (error) {
            if (error.status === 0 || error.status === 500) {
            }
            else {
                location.replace('/');
            }
            //  scope.isLoading = false;
            _this.$log.log(error);
        });
        this.$rootScope.isLoading = false;
    };
    ///bind data for edit role
    RoleController.prototype.editRole = function (id, roleName, roleNameSl) {
        var scope = this.$scope;
        scope.isAdd = false;
        scope.isAddRolePanelVisible = true;
        scope.isRoleListGridVisible = false;
        scope.role.Id = id;
        scope.role.RoleName = roleName;
        scope.role.RoleNameSl = roleNameSl;
    };
    //get role list
    RoleController.prototype.getRoleList = function () {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.roleService.getRoleList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                scope.roleList.push({ Id: result[i].Id, RoleName: result[i].RoleName, RoleNameSl: result[i].RoleNameSl });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            _this.$rootScope.isLoading = false;
        });
    };
    RoleController.prototype.deleteRole = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.roleService.deleteRole(id);
        promise.then(function (result) {
            var i = 0;
            if (result.DeleteError === "error") {
                controllerScope.deleteError = true;
                _this.ngToast.create("Role Cannot Be Deleted");
            }
            else if (result.DeleteError === "") {
                _this.ngToast.create("Role Deleted");
            }
            else {
                controllerScope.deleteError = true;
                _this.ngToast.create(result.DeleteError);
            }
            _this.$rootScope.isLoading = false;
            _this.closeDeleteRolePopup();
            window.location.assign('#ManageRole');
        }).catch(function (error) {
            _this.$log.log(error);
            _this.$rootScope.isLoading = false;
        });
    };
    RoleController.prototype.openDeleteRolePopup = function (role) {
        var controllerScope = this.$scope;
        this.deleteRolePopup = this.$modal.open({
            templateUrl: 'DeleteRolePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.role = role;
    };
    RoleController.prototype.closeDeleteRolePopup = function () {
        this.deleteRolePopup.dismiss('cancel');
    };
    return RoleController;
}());
RoleController.controllerId = "RoleController";
app.controller(RoleController.controllerId, ['$scope', '$log', 'RoleService', 'ngToast', '$rootScope', '$modal', function ($scope, $log, roleService, ngToast, $rootScope, $modal) {
        return new RoleController($scope, $log, roleService, ngToast, $rootScope, $modal);
    }]);
//# sourceMappingURL=roleController.js.map
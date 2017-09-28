// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var RolePermissionController = (function () {
    function RolePermissionController($scope, $log, rolePermissionService, $rootScope, $location, $routeParams, $modal, apiPath) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.rolePermissionService = rolePermissionService;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$modal = $modal;
        this.apiPath = apiPath;
        this.$scope.permissionDetails = new Model.Permission();
        this.$scope.getAllRolePermissionlist = function () { return _this.getAllRolePermissionlist(); };
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.totalCollection = [];
        this.$scope.roleCollection = [];
        var rolePage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.roleCollection.slice(begin, end);
        });
        this.$scope.addNewRoleAndPermission = function () { return _this.addNewRoleAndPermission(); };
        this.$scope.getAllPermissionsList = function () { return _this.getAllPermissionsList(); };
        this.$scope.permissionCollection = [];
        this.$scope.getAllRoleList = function () { return _this.getAllRoleList(); };
        this.$scope.roleList = [];
        this.$scope.saveRoleAndPermissionDetails = function (permission, roleId) { return _this.saveRoleAndPermissionDetails(permission, roleId); };
        this.$scope.roleDetails = new Model.Role();
        this.$scope.checkRoleAndPermission = function (roleId) { return _this.checkRoleAndPermission(roleId); };
        this.$scope.errorMessage = "";
        this.$scope.permissionErrorErrorMessageDisplay = false;
        this.$scope.isAddRoleAndPermissionButtonDisabled = false;
        this.$scope.editRoelAndPermission = function (roleId) { return _this.editRoelAndPermission(roleId); };
        this.$scope.isAdminRoleDisabled = false;
        this.inialization();
    }
    RolePermissionController.prototype.inialization = function () {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.editRoelAndPermissionDetails();
        }
        else {
            this.getAllPermissionsList();
        }
        this.getAllRoleList();
    };
    RolePermissionController.prototype.getAllRolePermissionlist = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.roleCollection = [];
        var rolelist = controllerScope.roleCollection;
        var promise = this.rolePermissionService.getAllRolePermissionlist();
        promise.then(function (result) {
            _this.$log.log("get all role permissions successfully.");
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.permissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    rolelist.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = rolelist.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.roleCollection.length;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.permissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    RolePermissionController.prototype.addNewRoleAndPermission = function () {
        this.$location.path("/AddRolesandPermissions");
    };
    RolePermissionController.prototype.getAllPermissionsList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.permissionCollection = [];
        var permissionList = controllerScope.permissionCollection;
        var promise = this.rolePermissionService.getAllPermissionsList();
        promise.then(function (result) {
            _this.$log.log("get all permissions list successfully.");
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.permissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    permissionList.push(result[i]);
                    controllerRootScope.isLoading = false;
                }
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.permissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    RolePermissionController.prototype.getAllRoleList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.roleList = [];
        var roleCollection = controllerScope.roleList;
        var promise = this.rolePermissionService.getAllRoleList();
        promise.then(function (result) {
            _this.$log.log("get all role list successfully.");
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.permissionErrorErrorMessageDisplay = true;
                controllerScope.isAddRoleAndPermissionButtonDisabled = true;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    roleCollection.push(result[i]);
                }
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.permissionErrorErrorMessageDisplay = true;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    RolePermissionController.prototype.saveRoleAndPermissionDetails = function (permission, roleId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.permissionDetails = permission;
        controllerScope.permissionDetails.RoleId = roleId.Id;
        controllerRootScope.isLoading = true;
        var promise = this.rolePermissionService.saveRoleAndPermissionDetails(controllerScope.permissionDetails);
        promise.then(function (result) {
            _this.$log.log("save role and permission successfully.");
            controllerRootScope.isLoading = true;
            _this.$location.path("/RolesandPermissions");
        }).catch(function (error) {
            _this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(_this.apiPath);
        });
    };
    RolePermissionController.prototype.checkRoleAndPermission = function (roleId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.permissionCollection = [];
        var permissionList = controllerScope.permissionCollection;
        var promise = this.rolePermissionService.checkRoleAndPermission(roleId);
        promise.then(function (result) {
            _this.$log.log("check role and permission", result);
            for (var i = 0; i < result.length; i++) {
                permissionList.push(result[i]);
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(_this.apiPath);
        });
    };
    RolePermissionController.prototype.editRoelAndPermission = function (roleId) {
        this.$location.path("/EditRolesandPermissions/" + roleId);
    };
    RolePermissionController.prototype.editRoelAndPermissionDetails = function () {
        var _this = this;
        var roleId = this.$routeParams.id;
        var controllerScope = this.$scope;
        controllerScope.isAdminRoleDisabled = true;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.permissionCollection = [];
        var permissionList = controllerScope.permissionCollection;
        var promise = this.rolePermissionService.checkRoleAndPermission(roleId);
        promise.then(function (result) {
            _this.$log.log("check role and permission", result);
            controllerScope.roleDetails.Id = roleId;
            for (var i = 0; i < result.length; i++) {
                permissionList.push(result[i]);
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(_this.apiPath);
        });
    };
    return RolePermissionController;
}());
RolePermissionController.controllerId = "RolePermissionController";
app.controller(RolePermissionController.controllerId, ['$scope', '$log', 'RolePermissionService', '$rootScope', '$location', '$routeParams', '$modal', 'apiPath', function ($scope, $log, rolePermissionService, $rootScope, $location, $routeParams, $modal, apiPath) {
        return new RolePermissionController($scope, $log, rolePermissionService, $rootScope, $location, $routeParams, $modal, apiPath);
    }]);
//# sourceMappingURL=rolePermissionController.js.map
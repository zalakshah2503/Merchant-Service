/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var RolePermissionService = (function () {
    function RolePermissionService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.getRolePermission = this.$resource(apiPaths.getAllRolePermissionlist);
        this.getRole = this.$resource(apiPaths.getAllPermissionsList);
        this.getRoleList = this.$resource(apiPaths.getAllRoleList);
        this.saveRoleAndPermission = this.$resource(apiPaths.saveRoleAndPermissionDetails);
        this.roleAndPermission = this.$resource(apiPaths.roleAndPermission, {}, { query: { method: 'GET', isArray: true } });
    }
    RolePermissionService.prototype.getAllRolePermissionlist = function () {
        return this.getRolePermission.query().$promise;
    };
    RolePermissionService.prototype.getAllPermissionsList = function () {
        return this.getRole.query().$promise;
    };
    RolePermissionService.prototype.getAllRoleList = function () {
        return this.getRoleList.query().$promise;
    };
    RolePermissionService.prototype.saveRoleAndPermissionDetails = function (permission) {
        return this.saveRoleAndPermission.save(permission).$promise;
    };
    RolePermissionService.prototype.checkRoleAndPermission = function (roleId) {
        return this.roleAndPermission.query({ roleId: roleId }).$promise;
    };
    return RolePermissionService;
}());
app.service("RolePermissionService", ['$resource', '$log', function ($resource, $log) {
        return new RolePermissionService($resource, $log);
    }]);
//# sourceMappingURL=rolePermissionService.js.map
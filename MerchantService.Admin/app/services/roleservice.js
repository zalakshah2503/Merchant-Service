/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
var RoleService = (function () {
    function RoleService($resource) {
        this.$resource = $resource;
        this.saveRole = this.$resource(apiPaths.saveRoleInfo);
        this.getRole = this.$resource(apiPaths.getRoleList);
        this.deleteRoleById = this.$resource(apiPaths.deleteRole, {}, { query: { method: 'GET', isArray: false } });
        this.CompanyCreated = this.$resource(apiPaths.getCompanyByUserId, {}, { query: { method: 'GET', isArray: false } });
    }
    RoleService.prototype.CheckCompanyCreatedOrNot = function () {
        return this.CompanyCreated.query().$promise;
    };
    RoleService.prototype.saveRoleInfo = function (resource) {
        return this.saveRole.save(resource).$promise;
    };
    RoleService.prototype.getRoleList = function () {
        return this.getRole.query().$promise;
    };
    RoleService.prototype.deleteRole = function (id) {
        return this.deleteRoleById.query({ id: id }).$promise;
    };
    return RoleService;
}());
RoleService.serviceId = "RoleService";
app.service('RoleService', ['$resource', function ($resource) {
        return new RoleService($resource);
    }]);
//# sourceMappingURL=roleservice.js.map
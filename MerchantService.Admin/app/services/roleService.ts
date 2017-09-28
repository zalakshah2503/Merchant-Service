/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IRoleService {
    saveRoleInfo: (resource) => void;
    getRoleList: () => void;
    deleteRole: (id) => void;
    CheckCompanyCreatedOrNot: () => void;
}
class RoleService implements IRoleService {
    static serviceId = "RoleService";
    private $resource;
    public saveRole;
    public getRole;
    public deleteRoleById;
    public CompanyCreated;

    constructor($resource: ng.resource.IResourceService) {

        this.$resource = $resource;
        this.saveRole = this.$resource(apiPaths.saveRoleInfo);
        this.getRole = this.$resource(apiPaths.getRoleList);
        this.deleteRoleById = this.$resource(apiPaths.deleteRole, {}, { query: { method: 'GET', isArray: false } });
        this.CompanyCreated = this.$resource(apiPaths.getCompanyByUserId, {}, { query: {method: 'GET', isArray: false}});
    }

    CheckCompanyCreatedOrNot() {
        return this.CompanyCreated.query().$promise;
    }

    saveRoleInfo(resource: Model.Role) {
        return this.saveRole.save(resource).$promise;
    }

    getRoleList() {
        return this.getRole.query().$promise;
    }
    deleteRole(id) {
        return this.deleteRoleById.query({ id: id }).$promise;
    }
}

app.service('RoleService', ['$resource',  ($resource) => {
    return new RoleService($resource);
}]); 
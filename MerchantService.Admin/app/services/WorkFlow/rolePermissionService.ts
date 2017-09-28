
// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
    interface IRolePermissionService {
        getAllRolePermissionlist: () => void;
        getAllPermissionsList: () => void;
        getAllRoleList: () => void;
        saveRoleAndPermissionDetails: (permission : Model.Permission) => void;
        checkRoleAndPermission: (roleId) => void;
    }
    
    class RolePermissionService implements IRolePermissionService {
        public getRolePermission;
        public getRole;
        public getRoleList;
        public saveRoleAndPermission;
        public roleAndPermission;

        constructor(private $resource: ng.resource.IResourceService,private $log:ng.ILogService) {

            this.getRolePermission = this.$resource(apiPaths.getAllRolePermissionlist);
            this.getRole = this.$resource(apiPaths.getAllPermissionsList);
            this.getRoleList = this.$resource(apiPaths.getAllRoleList);
            this.saveRoleAndPermission = this.$resource(apiPaths.saveRoleAndPermissionDetails);
            this.roleAndPermission = this.$resource(apiPaths.roleAndPermission, {}, { query: { method: 'GET', isArray: true } });
        }

        getAllRolePermissionlist() {
            return this.getRolePermission.query().$promise;
        }
        
        getAllPermissionsList() {
            return this.getRole.query().$promise;
        }

        getAllRoleList() {
            return this.getRoleList.query().$promise;
        }

        saveRoleAndPermissionDetails(permission:Model.Permission) {
            return this.saveRoleAndPermission.save(permission).$promise;
        }

        checkRoleAndPermission(roleId) {
            return this.roleAndPermission.query({roleId : roleId}).$promise;
        }
    }

    app.service("RolePermissionService", ['$resource', '$log', ($resource, $log) => {
        return new RolePermissionService($resource,$log);
    }]);
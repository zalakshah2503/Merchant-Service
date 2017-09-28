/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
var UserDetailService = (function () {
    function UserDetailService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$log.log('userDetailService Call');
        this.saveUserDetail = this.$resource(apiPaths.saveUserDetailPath);
        this.getBranch = this.$resource(apiPaths.getBranchList, {}, { query: { method: 'GET', isArray: true } });
        this.getRole = this.$resource(apiPaths.getRoleList);
        this.getUser = this.$resource(apiPaths.getUserList);
        this.getUserFromId = this.$resource(apiPaths.getUserById);
        this.deleteUserById = this.$resource(apiPaths.deleteUser, {}, { query: { method: 'GET', isArray: false } });
    }
    // used save user detail to database - jj
    UserDetailService.prototype.saveUser = function (resource) {
        return this.saveUserDetail.save(resource).$promise;
    };
    //used to fetch branch list from database - jj
    UserDetailService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    // used to fetch list of roles from database- jj
    UserDetailService.prototype.getRoleList = function () {
        return this.getRole.query().$promise;
    };
    // used to fetch list of users from database- jj
    UserDetailService.prototype.getUsersList = function () {
        return this.getUser.query().$promise;
    };
    // used to delete user with the given id- jj
    UserDetailService.prototype.deleteUser = function (id) {
        return this.deleteUserById.query({ id: id }).$promise;
    };
    // used to fetch user with the given id- jj
    UserDetailService.prototype.getUserById = function (userId) {
        return this.getUserFromId.get({ userId: userId }).$promise;
    };
    return UserDetailService;
}());
UserDetailService.serviceId = "UserDetailService";
app.service('UserDetailService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new UserDetailService($resource, $q, $log);
    }]);
//# sourceMappingURL=userDetailService.js.map
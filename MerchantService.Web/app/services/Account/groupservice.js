/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var GroupService = (function () {
    function GroupService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveGroup = this.$resource(apiPaths.saveGroupAccount);
        this.getGroup = this.$resource(apiPaths.getGroupList);
        this.updateGroup = this.$resource(apiPaths.updateGroupAccount, { resource: "@resource" }, { update: { method: "PUT" } });
    }
    //This method is use for store group in database.
    GroupService.prototype.saveGroupAccount = function (resource) {
        return this.saveGroup.save(resource).$promise;
    };
    //This method is use getting list of gorup.
    GroupService.prototype.getGroupList = function () {
        return this.getGroup.query().$promise;
    };
    //This method is use for updating group value.
    GroupService.prototype.updateGroupAccount = function (resource) {
        return this.updateGroup.update(resource).$promise;
    };
    return GroupService;
}());
app.service('GroupService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new GroupService($resource, $q, $log);
    }]);
//# sourceMappingURL=groupservice.js.map
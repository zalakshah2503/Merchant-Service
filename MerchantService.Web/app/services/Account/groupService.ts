/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IgroupService {
    saveGroupAccount: (resource) => void;
    getGroupList: () => void;
    updateGroup: (resource) => void;
}

class GroupService {
    private $resource;
    private $q;
    private $log;
    public saveGroup;
    public getGroup;
    public updateGroup;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveGroup = this.$resource(apiPaths.saveGroupAccount);
        this.getGroup = this.$resource(apiPaths.getGroupList);
        this.updateGroup = this.$resource(apiPaths.updateGroupAccount, { resource: "@resource" }, { update: { method: "PUT" } });

    }
    //This method is use for store group in database.
    saveGroupAccount(resource: Model.GroupAccount) {
        return this.saveGroup.save(resource).$promise;
    }
    //This method is use getting list of gorup.
    getGroupList() {
        return this.getGroup.query().$promise;
    }

    //This method is use for updating group value.
    updateGroupAccount(resource: Model.GroupAccount) {
        return this.updateGroup.update(resource).$promise;
    }

}

app.service('GroupService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new GroupService($resource, $q, $log);
}]);
 
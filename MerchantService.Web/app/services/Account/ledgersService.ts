/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IledgersService {
    saveLedgerAccount: (resource) => any;
    getLedgerList: () => any;
    getGroupList: () => any;
    updateLedgerAccount: (resource) => any;
    getLedgerWithChildLedger: () => any;
    getGroupTypeByGroupId: (groupId: number) => any;
    updateLedgersAccount: (resource) => any;
}

class LedgersService {
    private $resource;
    private $q;
    private $log;
    public getLedger;
    public getGroup;
    public saveLedger;
    public updateLedger;
    public getLedgerWithChild;
    public getGroupTypeList;
    public updateLedgers;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.saveLedger = this.$resource(apiPaths.saveLedgerAccount);
        this.getLedger = this.$resource(apiPaths.getLedgerList);
        this.getGroup = this.$resource(apiPaths.getGroupList);
        this.updateLedger = this.$resource(apiPaths.updateLedgerAccount, { resource: "@resource" }, { update: { method: "PUT" } });
        this.getLedgerWithChild = this.$resource(apiPaths.getLedegerWithChild);
        this.getGroupTypeList = this.$resource(apiPaths.getGroupTypeList);
        this.updateLedgers = this.$resource(apiPaths.updateLedgerAccount);
    }
    //this method is use for saving ledger account data
    saveLedgerAccount(resource: Model.LedgersAccount) {
        return this.saveLedger.save(resource).$promise;
    }
    //this method is use for geeting list of ledger
    getLedgerList() {
        return this.getLedger.query().$promise;
    }
    //this method is use for getting list of group.
    getGroupList() {
        return this.getGroup.query().$promise;
    }
    //this method is use for update ledger.
    updateLedgerAccount(resource: Model.LedgersAccount) {
        return this.updateLedger.update(resource).$promise;
    }

    //this method used for get ledeger with chile ledgers. -An
    getLedgerWithChildLedger() {
        return this.getLedgerWithChild.query().$promise;
    }

    //this method used for get group type by group id. -An
    getGroupTypeByGroupId(groupId) {
        return this.getGroupTypeList.query({ groupId: groupId }).$promise;
    }

    updateLedgersAccount(resource: Model.LedgersAccount) {
        return this.updateLedgers.save(resource).$promise;
    }
}

app.service('LedgersService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new LedgersService($resource, $q, $log);
}]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var LedgersService = (function () {
    function LedgersService($resource, $q, $log) {
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
    LedgersService.prototype.saveLedgerAccount = function (resource) {
        return this.saveLedger.save(resource).$promise;
    };
    //this method is use for geeting list of ledger
    LedgersService.prototype.getLedgerList = function () {
        return this.getLedger.query().$promise;
    };
    //this method is use for getting list of group.
    LedgersService.prototype.getGroupList = function () {
        return this.getGroup.query().$promise;
    };
    //this method is use for update ledger.
    LedgersService.prototype.updateLedgerAccount = function (resource) {
        return this.updateLedger.update(resource).$promise;
    };
    //this method used for get ledeger with chile ledgers. -An
    LedgersService.prototype.getLedgerWithChildLedger = function () {
        return this.getLedgerWithChild.query().$promise;
    };
    //this method used for get group type by group id. -An
    LedgersService.prototype.getGroupTypeByGroupId = function (groupId) {
        return this.getGroupTypeList.query({ groupId: groupId }).$promise;
    };
    LedgersService.prototype.updateLedgersAccount = function (resource) {
        return this.updateLedgers.save(resource).$promise;
    };
    return LedgersService;
}());
app.service('LedgersService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new LedgersService($resource, $q, $log);
    }]);
//# sourceMappingURL=ledgersService.js.map
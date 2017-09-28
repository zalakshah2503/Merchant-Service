/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var IcrWorkListService = (function () {
    function IcrWorkListService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        // this.fetchItemList = this.$resource(apiPaths.getItemList);
        this.fetchICRWorkList = this.$resource(apiPaths.getICRWorkList);
        this.fetchICRDetail = this.$resource(apiPaths.getICRDetail, {}, { query: { method: 'GET', isArray: false } });
        this.approveICRequest = this.$resource(apiPaths.approveICR, {}, { query: { method: 'GET', isArray: false } });
        this.reviewICRequest = this.$resource(apiPaths.reviewICR, { itemChangedDetail: "@itemChangedDetail" }, { update: { method: 'PUT', isArray: false } });
        this.getCurrentUser = this.$resource(apiPaths.getCurrentUser, {}, { query: { method: 'GET', isArray: false } });
        this.rejectICRequest = this.$resource(apiPaths.rejectICR, {}, { query: { method: 'GET', isArray: false } });
        this.resubmitICRequest = this.$resource(apiPaths.resubmitICR, {}, { query: { method: 'GET', isArray: false } });
    }
    //this service used for fetching ICR Work list.-jj
    IcrWorkListService.prototype.getICRWorkList = function () {
        return this.fetchICRWorkList.query().$promise;
    };
    //this service used for resubmitting ICR Detail.-jj
    IcrWorkListService.prototype.resubmitICR = function (Id, Comment) {
        return this.resubmitICRequest.query({ Id: Id, Comment: Comment }).$promise;
    };
    //this service used for fetching ICR Detail.-jj
    IcrWorkListService.prototype.getICRDetail = function (Id) {
        return this.fetchICRDetail.query({ Id: Id }).$promise;
    };
    //this service is used to approve ICR
    IcrWorkListService.prototype.approveICR = function (RecordId, Comment, status) {
        return this.approveICRequest.query({ RecordId: RecordId, Comment: Comment, status: status }).$promise;
    };
    //this service is used to review ICR
    IcrWorkListService.prototype.reviewICR = function (itemChangedDetail) {
        return this.reviewICRequest.update(itemChangedDetail).$promise;
    };
    //used to fetch cuurently logged in user details   
    IcrWorkListService.prototype.getCurrentUserDetail = function () {
        return this.getCurrentUser.query().$promise;
    };
    //this service is used to reject ICR
    IcrWorkListService.prototype.rejectICR = function (Id, RecordId, Comment) {
        return this.rejectICRequest.query({ Id: Id, RecordId: RecordId, Comment: Comment }).$promise;
    };
    return IcrWorkListService;
}());
IcrWorkListService.serviceId = "icrWorkListService";
app.service('icrWorkListService', ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new IcrWorkListService($resource, $q, $log);
    }]);
//# sourceMappingURL=icrWorkListService.js.map
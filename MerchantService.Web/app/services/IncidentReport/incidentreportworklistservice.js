/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var IncidentReportWorklistService = (function () {
    function IncidentReportWorklistService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getCashier = this.$resource(apiPaths.getCashierList);
        this.getBranch = this.$resource(apiPaths.getBranchList);
        this.getIncidentReportWorkList = this.$resource(apiPaths.getIncientReportList);
        this.getIncidentReportDetial = this.$resource(apiPaths.getIncidentReportDetial);
        this.approve = this.$resource(apiPaths.approveButton);
        this.resetIncident = this.$resource(apiPaths.resetIncident);
    }
    //this service used for get cashier list. -An
    IncidentReportWorklistService.prototype.getCashierList = function () {
        return this.getCashier.query().$promise;
    };
    //this service used for get branch list. -An
    IncidentReportWorklistService.prototype.getBranchListFunction = function () {
        return this.getBranch.query().$promise;
    };
    //this service used for get incident report work list. -An
    IncidentReportWorklistService.prototype.getIncidentReportWorkListFunciton = function () {
        return this.getIncidentReportWorkList.query().$promise;
    };
    IncidentReportWorklistService.prototype.getIncidentReportDetialById = function (id) {
        return this.getIncidentReportDetial.get({ id: id }).$promise;
    };
    IncidentReportWorklistService.prototype.approveButtonClick = function (id) {
        return this.approve.get({ id: id }).$promise;
    };
    IncidentReportWorklistService.prototype.resetIncidentReport = function (cashierId) {
        return this.resetIncident.get({ cashierId: cashierId }).$promise;
    };
    return IncidentReportWorklistService;
}());
IncidentReportWorklistService.serviceId = "incidentReportWorklistService";
app.service(IncidentReportWorklistService.serviceId, ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new IncidentReportWorklistService($resource, $q, $log);
    }]);
//# sourceMappingURL=incidentreportworklistservice.js.map
// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var IncidentReportService = (function () {
    function IncidentReportService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.getIncidentReport = this.$resource(apiPaths.getAllIncidentReportWorkList);
        this.getIncidentReportById = this.$resource(apiPaths.getIncidentReportDetailsById);
        this.saveIncidentReport = this.$resource(apiPaths.submitIncidentReport, { incidentReportDetails: "@incidentReportDetails" }, { update: { method: "PUT" } });
        this.reviewIncidentReport = this.$resource(apiPaths.reviewIncidentReportDetails, { incidentReportDetails: "@incidentReportDetails" }, { update: { method: "PUT" } });
        this.incidentReportApproval = this.$resource(apiPaths.incidentReportApproveAndReject, { incidentReportDetails: "@incidentReportDetails" }, { update: { method: "PUT" } });
    }
    IncidentReportService.prototype.getAllIncidentReportWorkList = function () {
        return this.getIncidentReport.query().$promise;
    };
    IncidentReportService.prototype.getIncidentReportDetailsById = function (incidentId) {
        return this.getIncidentReportById.get({ incidentId: incidentId }).$promise;
    };
    IncidentReportService.prototype.submitIncidentReport = function (incidentReportDetails) {
        return this.saveIncidentReport.update(incidentReportDetails).$promise;
    };
    IncidentReportService.prototype.reviewIncidentReportDetails = function (incidentReportDetails) {
        return this.reviewIncidentReport.update(incidentReportDetails).$promise;
    };
    IncidentReportService.prototype.incidentReportApproveAndReject = function (incidentReportDetails) {
        return this.incidentReportApproval.update(incidentReportDetails).$promise;
    };
    return IncidentReportService;
}());
app.service("incidentReportService", ['$resource', '$log', function ($resource, $log) {
        return new IncidentReportService($resource, $log);
    }]);
//# sourceMappingURL=incidentReportService.js.map
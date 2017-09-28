var IncidentReportService = (function () {
    function IncidentReportService($resource, $q, $log) {
        this.$resource = $resource;
        this.oprationList = this.$resource(apiPaths.getOprationList);
        this.incidentReport = this.$resource(apiPaths.submitIncidentReport);
        this.incidentReportList = this.$resource(apiPaths.getIncidnetReport);
        this.updateIncident = this.$resource(apiPaths.updateIncidentReport);
    }
    //this service used for get operation list. -An
    IncidentReportService.prototype.getOperationList = function () {
        return this.oprationList.query().$promise;
    };
    //this service used for insert incident report. -An
    IncidentReportService.prototype.submitIncidentReport = function (resource) {
        return this.incidentReport.save(resource).$promise;
    };
    //this service used for get incident report list. -An
    IncidentReportService.prototype.getIncidentReportList = function () {
        return this.incidentReportList.query().$promise;
    };
    IncidentReportService.prototype.updateIncidentReport = function (resource) {
        return this.updateIncident.save(resource).$promise;
    };
    return IncidentReportService;
}());
IncidentReportService.serviceId = "IncidentReportService";
app.service(IncidentReportService.serviceId, [
    '$resource', '$q', '$log', function ($resource, $q, $log) {
        return new IncidentReportService($resource, $q, $log);
    }
]);
//# sourceMappingURL=incidentreportservice.js.map


interface IIncidentReportService {
    getOperationList: () => void;
    submitIncidentReport: (resource) => void;
    getIncidentReportList: () => void;
    updateIncidentReport: (resource) => void;
}

class IncidentReportService implements IIncidentReportService {
    static serviceId = "IncidentReportService";
    private $resource;
    public oprationList;
    public incidentReportList;
    public incidentReport;
    public updateIncident;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.oprationList = this.$resource(apiPaths.getOprationList);
        this.incidentReport = this.$resource(apiPaths.submitIncidentReport);
        this.incidentReportList = this.$resource(apiPaths.getIncidnetReport);
        this.updateIncident = this.$resource(apiPaths.updateIncidentReport);
    }

    //this service used for get operation list. -An
    getOperationList() {
        return this.oprationList.query().$promise;
    }

    //this service used for insert incident report. -An
    submitIncidentReport(resource: Model.IncidentReportModel) {
        return this.incidentReport.save(resource).$promise;
    }

    //this service used for get incident report list. -An
    getIncidentReportList() {
        return this.incidentReportList.query().$promise;
    }

    updateIncidentReport(resource: Model.IncidentReportModel) {
        return this.updateIncident.save(resource).$promise;
    }

}

app.service(IncidentReportService.serviceId, [
    '$resource', '$q', '$log', ($resource, $q, $log) => {
        return new IncidentReportService($resource, $q, $log);
    }]);
// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

    interface IincidentReportService {
        getAllIncidentReportWorkList: () => void;
        getIncidentReportDetailsById: (incidentId) => void;
        submitIncidentReport: (incidentReportDetails) => void;
        reviewIncidentReportDetails: (incidentReportDetails) => void;
        incidentReportApproveAndReject:(incidentReportDetails)=> void;

    }
    
    class IncidentReportService implements IincidentReportService {
     
        public getIncidentReport;
        public getIncidentReportById;
        public saveIncidentReport;
        public reviewIncidentReport;
        public incidentReportApproval ;
        constructor(private $resource: ng.resource.IResourceService,private  $log: ng.ILogService) {
            this.getIncidentReport = this.$resource(apiPaths.getAllIncidentReportWorkList);
            this.getIncidentReportById = this.$resource(apiPaths.getIncidentReportDetailsById);
            this.saveIncidentReport = this.$resource(apiPaths.submitIncidentReport, { incidentReportDetails: "@incidentReportDetails" }, { update: { method: "PUT" } });
            this.reviewIncidentReport = this.$resource(apiPaths.reviewIncidentReportDetails, { incidentReportDetails: "@incidentReportDetails" }, { update: { method: "PUT" } });
            this.incidentReportApproval = this.$resource(apiPaths.incidentReportApproveAndReject, { incidentReportDetails:"@incidentReportDetails"},{update:{method:"PUT"}});
        }

        getAllIncidentReportWorkList() {
            return this.getIncidentReport.query().$promise;
        }
        
        getIncidentReportDetailsById(incidentId) {
            return this.getIncidentReportById.get({ incidentId: incidentId}).$promise;
        }

        submitIncidentReport(incidentReportDetails) {
            return this.saveIncidentReport.update(incidentReportDetails).$promise;
        }

        reviewIncidentReportDetails(incidentReportDetails) {
            return this.reviewIncidentReport.update(incidentReportDetails).$promise;
        }

        incidentReportApproveAndReject(incidentReportDetails) {
            return this.incidentReportApproval.update(incidentReportDetails).$promise;
        }
    }

    app.service("incidentReportService", ['$resource', '$log', ($resource,$log) => {
        return new IncidentReportService($resource, $log);
    }]);

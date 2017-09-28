/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IIncidentReportWorklistService {
    getCashierList: () => void;
    getBranchListFunction: () => void;
    getIncidentReportWorkListFunciton: () => void;
    getIncidentReportDetialById: (id: number) => void;
    approveButtonClick: (id: number) => void;
    resetIncidentReport: (cashierId: number) => void;
}

class IncidentReportWorklistService {
    static serviceId = "incidentReportWorklistService";
    public getCashier;
    public getBranch;
    public $resource;
    public $q;
    public $log;
    public getIncidentReportWorkList;
    public getIncidentReportDetial;
    public approve;
    public resetIncident;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getCashierList() {
        return this.getCashier.query().$promise;
    }

    //this service used for get branch list. -An
    getBranchListFunction() {
        return this.getBranch.query().$promise;
    }

    //this service used for get incident report work list. -An
    getIncidentReportWorkListFunciton() {
        return this.getIncidentReportWorkList.query().$promise;
    }

    getIncidentReportDetialById(id) {
        return this.getIncidentReportDetial.get({ id: id }).$promise;
    }

    approveButtonClick(id) {
        return this.approve.get({ id: id }).$promise;
    }

    resetIncidentReport(cashierId) {
        return this.resetIncident.get({ cashierId: cashierId }).$promise;
    }

}

app.service(IncidentReportWorklistService.serviceId, ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new IncidentReportWorklistService($resource, $q, $log);
}]);
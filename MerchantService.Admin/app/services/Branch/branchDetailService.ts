
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IBranchDetailService {
    getBranchList: () => void;
    getBranchById: (branchId) => void;
    addBranchDetail: (resource) => void;
    updateBranchDetail: (branchDetail: Model.BranchDetail) => void;
    deleteBranchDetail: (id) => void;
   // deleteBranchCPOConfiguration: (id) => void;
    getCompanyList: () => void;
    getAdditionalServiceList: () => void;
}

class BranchDetailService implements IBranchDetailService {
    static serviceId = "BranchDetailService";
    private $resource;
    private $q;
    private $log;

    public getBranch;
    public addBranch;
    public updateBranch;
    public deleteBranch;
    public getCompany;

    public getUser;
    public getAdditionalService;
    public getBranchFromId;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$log.log('BranchDetailService Call');
        this.getBranch = this.$resource(apiPaths.getBranchList, {}, { query: { method: 'GET', isArray: true } });
        this.addBranch = this.$resource(apiPaths.addBranchDetails);
        this.deleteBranch = this.$resource(apiPaths.deleteBranchDetails, {}, { query: { method: 'GET', isArray: false } });
        this.getCompany = this.$resource(apiPaths.getAllCompanyDetail, {}, { query: { method: 'GET', isArray: true } });

        this.getAdditionalService = this.$resource(apiPaths.getAdditionalServiceList);
        this.getBranchFromId = this.$resource(apiPaths.getBranchById);
        this.updateBranch = this.$resource(apiPaths.updateBranchDetails, {}, { update: { method: "PUT" } });
    }

    // used to get list of all branches whose IsDelete is false 
    getBranchList() {
        return this.getBranch.query().$promise;
    }

    // used to add branch to the database
    addBranchDetail(resource: Model.BranchDetail) {
        return this.addBranch.save(resource).$promise;
    }

    //used to update branch  
    updateBranchDetail(branchDetail) {
        return this.updateBranch.update(branchDetail).$promise;
    }

    //
    deleteBranchDetail(id) {
        return this.deleteBranch.query({ id: id }).$promise;
    }

    // used to get Company List
    getCompanyList() {
        return this.getCompany.query().$promise;
    }

    // used to get Addtional Service List
    getAdditionalServiceList() {
        return this.getAdditionalService.query().$promise;
    }

    // used to fetch the Branch Detail of the given id
    getBranchById(branchId) {
        return this.getBranchFromId.get({ branchId: branchId }).$promise;
    }
}

app.service("BranchDetailService", ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new BranchDetailService($resource, $q, $log);
}]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IicrWorkListService {

    getICRWorkList: () => void;
    getICRDetail: (Id) => void;
    approveICR: (RecordId: number, Comment: string, status: boolean) => void;
    reviewICR: (itemChangedDetail: Model.ItemChangedDetails) => void;
    rejectICR: (Id, RecordId: number, Comment: string) => void;
    getCurrentUserDetail;
    resubmitICR: (Id, Comment) => void;
}

class IcrWorkListService {
    static serviceId = "icrWorkListService";
    private $resource;
    private $q;
    private $log;

    public fetchICRWorkList;
    public fetchICRDetail;
    public approveICRequest;
    public reviewICRequest;
    public getCurrentUser;
    public rejectICRequest;
    public resubmitICRequest;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getICRWorkList() {
        return this.fetchICRWorkList.query().$promise;
    }


    //this service used for resubmitting ICR Detail.-jj
    resubmitICR(Id, Comment) {
        return this.resubmitICRequest.query({ Id: Id, Comment: Comment }).$promise;
    }

    //this service used for fetching ICR Detail.-jj
    getICRDetail(Id) {
        return this.fetchICRDetail.query({ Id: Id }).$promise;
    }

    //this service is used to approve ICR
    approveICR(RecordId, Comment, status) {
        return this.approveICRequest.query({ RecordId: RecordId, Comment: Comment, status: status }).$promise;
    }

    //this service is used to review ICR
    reviewICR(itemChangedDetail) {
        return this.reviewICRequest.update(itemChangedDetail).$promise;
    }

    //used to fetch cuurently logged in user details   
    getCurrentUserDetail() {
        return this.getCurrentUser.query().$promise;
    }

    //this service is used to reject ICR
    rejectICR(Id,RecordId, Comment) {
        return this.rejectICRequest.query({ Id: Id, RecordId: RecordId, Comment: Comment}).$promise;
    }
}

app.service('icrWorkListService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new IcrWorkListService($resource, $q, $log);
}]);
  
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IicrService {
    getItemQuantityList: (id) => void;
    getItemProfileList: () => void;
    getCategoryList: () => void;
    getUnitList: () => void;
    saveICR: (resource) => void;
    updateICR: (resource) => void;
    getCompanyConfiguration: () => void;
    getICRDetail: (Id) => void;
    getBranchList: (BranchId) => void;
    getBrandGroup: (id) => void;
    getSupplierList: () => void;
}

class IcrService {
    static serviceId = "ICRService";
    private $resource;
    private $q;
    private $log;

    public fetchBranchList;
    public getItemProfile;
    public fetchUnitList;
    public fetchItemQuantityList;
    public getCategory;
    public addICR;
    public getCompanyConfig;
    public editICR;
    public fetchICRDetail;
    public getBrandGroupList;
    public getSupplier;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;

        this.fetchBranchList = this.$resource(apiPaths.getBranchList);
        this.getItemProfile = this.$resource(apiPaths.fetchItemProfileList);
        this.fetchItemQuantityList = this.$resource(apiPaths.getItemQuantityList, {}, { query: { method: 'GET', isArray: true } });
        this.getCategory = this.$resource(apiPaths.getCategoryList, {}, { query: { method: "GET", isArray: true } });
        this.fetchUnitList = this.$resource(apiPaths.getUnitTypeList);
        this.addICR = this.$resource(apiPaths.saveICR);
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.getCompanyConfig = this.$resource(apiPaths.getCompanyConfiguration, {}, { query: { method: "GET", isArray: false } });
        this.editICR = this.$resource(apiPaths.updateICR);
        this.fetchICRDetail = this.$resource(apiPaths.getICRDetail, {}, { query: { method: 'GET', isArray: false } });
        this.getBrandGroupList = this.$resource(apiPaths.getSysParamterListById);
    }

    //this is used to fetch branchList of the current Logged-in user's company - jj
    getBranchList() {
        return this.fetchBranchList.query().$promise;
    }
  
    //this service used for get item profile -jj
    getItemProfileList() {
        return this.getItemProfile.query({ PriceCategory: 6 }).$promise;
    }

    // used to fetch supplier list 
    getSupplierList() {
        return this.getSupplier.query().$promise;
    }

    //used to fetch quantity of the given item id
    getItemQuantityList(id) {
        return this.fetchItemQuantityList.query({ id: id }).$promise;
    }

    //this service used for get category list.-jj
    getCategoryList() {
        return this.getCategory.query().$promise;
    }

    //this service used for get unit list.-jj
    getUnitList() {
        return this.fetchUnitList.query().$promise;
    }

    //used to add Item Change Request
    saveICR(resource: Model.ItemChangedDetails) {
        return this.addICR.save(resource).$promise;
    }

    //this service used for fetching CompanyConfiguration.-jj
    getCompanyConfiguration() {
        return this.getCompanyConfig.query().$promise;
    }

    updateICR(resource: Model.ItemChangedDetails) {
        return this.editICR.save(resource).$promise;
    }

    //this service used for fetching ICR Detail.-jj
    getICRDetail(Id) {
        return this.fetchICRDetail.query({ Id: Id }).$promise;
    }

    //used to fetch list of brands and groups 
    getBrandGroup(id) {
        return this.getBrandGroupList.query({ id: id }).$promise;
    }
}

app.service('icrService', ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new IcrService($resource, $q, $log);
}]);
  
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var CompanyService = (function () {
    function CompanyService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$log.log('Company Services Call');
        this.getCompany = this.$resource(apiPaths.addCompanyDetail);
        this.getCompanyDetail = this.$resource(apiPaths.getAllCompanyDetail);
        this.companyDetail = this.$resource(apiPaths.getCompanyDetailsById);
        this.updateDetail = this.$resource(apiPaths.updateCompanyDetail, { companyDetail: "@companyDetail" }, { update: { method: 'PUT' } });
        this.getLanguage = this.$resource(apiPaths.getAllLanguage);
        this.deleteCompanyInfo = this.$resource(apiPaths.deleteCompanyDetails);
        this.addSystemSetting = this.$resource(apiPaths.addSystemSetting);
        this.fetchsSystemSetting = this.$resource(apiPaths.getSystemSetting, {}, { query: { method: 'GET', isArray: false } });
        //  this.fetchsSystemSetting == this.$resource(apiPaths.getSystemSetting);
        this.getCurrency = this.$resource(apiPaths.getAllCurrencyDetail);
    }
    CompanyService.prototype.addCompanyDetail = function (companyDetail) {
        return this.getCompany.save(companyDetail).$promise;
    };
    CompanyService.prototype.getAllCompanyDetail = function () {
        return this.getCompanyDetail.query().$promise;
    };
    CompanyService.prototype.getCompanyDetailsById = function (companyId) {
        return this.companyDetail.get({ companyId: companyId }).$promise;
    };
    CompanyService.prototype.updateCompanyDetail = function (companyDetail) {
        return this.updateDetail.update(companyDetail).$promise;
    };
    CompanyService.prototype.getAllLanguage = function () {
        return this.getLanguage.query().$promise;
    };
    CompanyService.prototype.deleteCompanyDetails = function (companyId) {
        return this.deleteCompanyInfo.get({ companyId: companyId }).$promise;
    };
    //used to save System Setting into database
    CompanyService.prototype.saveSystemSetting = function (systemSetting) {
        return this.addSystemSetting.save(systemSetting).$promise;
    };
    // used to fetch System Setting from database
    CompanyService.prototype.getSystemSetting = function () {
        return this.fetchsSystemSetting.query().$promise;
    };
    CompanyService.prototype.getAllCurrencyDetail = function () {
        return this.getCurrency.query().$promise;
    };
    return CompanyService;
}());
CompanyService.serviceId = "CompanyService";
app.service("CompanyService", ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new CompanyService($resource, $q, $log);
    }]);
//# sourceMappingURL=companyService.js.map
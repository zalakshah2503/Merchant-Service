/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


    interface ICompanyService {
        addCompanyDetail: (companyDetail: Model.CompanyDetail) => void;
        getAllCompanyDetail: () => void;
        getCompanyDetailsById: (company) => void;
        updateCompanyDetail: (companyDetail: Model.CompanyDetail) => void;
        getAllLanguage: () => void;
        deleteCompanyDetails: (companyId) => void;
        getAllCurrencyDetail: () => void;
        saveSystemSetting: (systemSetting) => void;
        getSystemSetting: () => void;
    }
    
    class CompanyService implements ICompanyService {
        static serviceId = "CompanyService";
        private $resource;
        private $q;
        private $log;
        public getCompany;
        public getCompanyDetail;
        public companyDetail;
        public updateDetail;
        public getLanguage;
        public deleteCompanyInfo;
        public getCurrency;
        public addSystemSetting;
        public fetchsSystemSetting;

        constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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

      
        addCompanyDetail(companyDetail : Model.CompanyDetail) {
            return this.getCompany.save(companyDetail).$promise;
        }

        getAllCompanyDetail() {
            return this.getCompanyDetail.query().$promise;
        }

        getCompanyDetailsById(companyId) {
            return this.companyDetail.get({ companyId: companyId }).$promise;
        }

        updateCompanyDetail(companyDetail) {
            return this.updateDetail.update(companyDetail).$promise;
        }


        getAllLanguage() {
            return this.getLanguage.query().$promise;
        }

        deleteCompanyDetails(companyId) {
            return this.deleteCompanyInfo.get({companyId:companyId}).$promise;
        }

        //used to save System Setting into database
        saveSystemSetting(systemSetting : Model.SystemSetting) {
            return this.addSystemSetting.save(systemSetting).$promise;
        }

        // used to fetch System Setting from database
        getSystemSetting() {
            return this.fetchsSystemSetting.query().$promise;
        }

        getAllCurrencyDetail() {
            return this.getCurrency.query().$promise;
        }
    }

    app.service("CompanyService", ['$resource','$q','$log', ($resource,$q,$log) => {
        return new CompanyService($resource,$q,$log);
    }]);

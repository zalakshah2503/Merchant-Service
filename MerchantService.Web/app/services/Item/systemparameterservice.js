/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SystemParameterService = (function () {
    function SystemParameterService($resource) {
        //this.constantList = this.$resource(apiPaths.getConstantList);
        //this.parameterList = this.$resource(apiPaths.getSystemParamterListById);
        //this.saveParamList = this.$resource(apiPaths.saveParameterName);
        //this.editParameter = this.$resource(apiPaths.editSystemParameterData);
        //this.deleteParameter = this.$resource(apiPaths.deleteSystemParameter, { paramTypeId: "@paramTypeId" }, { query: { method: "POST" } });
        this.$resource = $resource;
        this.constantList = this.$resource(apiPaths.getConstantList);
        this.parameterList = this.$resource(apiPaths.getSysParamterListById);
        this.saveParamList = this.$resource(apiPaths.saveSystemParameterName);
        this.editParameter = this.$resource(apiPaths.editSysParameterData);
        this.deleteParameter = this.$resource(apiPaths.deleteSysParameter, { systemParameterId: "@systemParameterId" }, { query: { method: "POST" } });
    }
    SystemParameterService.prototype.getConstantList = function () {
        return this.constantList.query().$promise;
    };
    SystemParameterService.prototype.getsystemParameterList = function (id) {
        return this.parameterList.query({ id: id }).$promise;
    };
    SystemParameterService.prototype.addSystemParameter = function (resource) {
        return this.saveParamList.save(resource).$promise;
    };
    SystemParameterService.prototype.editSystemParameter = function (id) {
        return this.editParameter.get({ id: id }).$promise;
    };
    SystemParameterService.prototype.deleteSystemParameter = function (systemParameterId) {
        return this.deleteParameter.query({ systemParameterId: systemParameterId }).$promise;
    };
    return SystemParameterService;
}());
SystemParameterService.serviceId = "systemParameterService";
app.service(SystemParameterService.serviceId, ['$resource', function ($resource) {
        return new SystemParameterService($resource);
    }]);
//# sourceMappingURL=systemparameterservice.js.map
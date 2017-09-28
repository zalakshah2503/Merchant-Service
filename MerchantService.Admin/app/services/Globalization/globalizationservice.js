/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
var GlobalizationService = (function () {
    function GlobalizationService($resource) {
        this.$resource = $resource;
        this.$resource = $resource;
        this.getModule = this.$resource(apiPaths.getModuleList);
        this.getLabel = this.$resource(apiPaths.getLabelList);
        this.saveLabel = this.$resource(apiPaths.addListOfLabel);
    }
    GlobalizationService.prototype.getModuleList = function () {
        return this.getModule.get().$promise;
    };
    GlobalizationService.prototype.getLabelList = function (id) {
        return this.getLabel.query({ id: id }).$promise;
    };
    GlobalizationService.prototype.saveLabelList = function (labelList) {
        return this.saveLabel.save({ GlobalizationDetail: labelList }).$promise;
    };
    return GlobalizationService;
}());
GlobalizationService.serviceId = "GlobalizationService";
app.service('GlobalizationService', ['$resource', function ($resource) {
        return new GlobalizationService($resource);
    }]);
//# sourceMappingURL=globalizationservice.js.map
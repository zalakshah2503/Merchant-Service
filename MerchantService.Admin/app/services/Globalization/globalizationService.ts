/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />


interface IGlobalizationService {
    getModuleList: () => void;
    getLabelList: (id) => void;
    saveLabelList: (labelList) => void;
}

class GlobalizationService implements IGlobalizationService {
    static serviceId = "GlobalizationService";
    public getModule;
    public getLabel;
    public saveLabel;

    constructor(private $resource: ng.resource.IResourceService) {
        this.$resource = $resource;
        this.getModule = this.$resource(apiPaths.getModuleList);
        this.getLabel = this.$resource(apiPaths.getLabelList);
        this.saveLabel = this.$resource(apiPaths.addListOfLabel);
    }

    getModuleList() {
        return this.getModule.get().$promise;
    }

    getLabelList(id) {
        return this.getLabel.query({id : id}).$promise;
    }

    saveLabelList(labelList ) {
        return this.saveLabel.save({ GlobalizationDetail: labelList}).$promise;
    }
}


app.service('GlobalizationService', ['$resource', ($resource) => {
    return new GlobalizationService($resource);
}]);

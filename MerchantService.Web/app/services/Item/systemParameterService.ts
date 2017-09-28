/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />



interface IsystemParameterService {

    getConstantList: () => void;
    getsystemParameterList: (id) => void;
    addSystemParameter: (resource) => void;
    editSystemParameter: (id) => void;
    deleteSystemParameter: (systemParameterId) => void;
}

class SystemParameterService implements IsystemParameterService {
    static serviceId: string = "systemParameterService";
    public constantList;
    public parameterList;
    public saveParamList;
    public editParameter;
    public deleteParameter;
    constructor(private $resource: ng.resource.IResourceService) {

        //this.constantList = this.$resource(apiPaths.getConstantList);
        //this.parameterList = this.$resource(apiPaths.getSystemParamterListById);
        //this.saveParamList = this.$resource(apiPaths.saveParameterName);
        //this.editParameter = this.$resource(apiPaths.editSystemParameterData);
        //this.deleteParameter = this.$resource(apiPaths.deleteSystemParameter, { paramTypeId: "@paramTypeId" }, { query: { method: "POST" } });



        this.constantList = this.$resource(apiPaths.getConstantList);
        this.parameterList = this.$resource(apiPaths.getSysParamterListById);
        this.saveParamList = this.$resource(apiPaths.saveSystemParameterName);
        this.editParameter = this.$resource(apiPaths.editSysParameterData);
        this.deleteParameter = this.$resource(apiPaths.deleteSysParameter, { systemParameterId: "@systemParameterId" }, { query: { method: "POST" } });
    }

    getConstantList() {
        return this.constantList.query().$promise;
    }

    getsystemParameterList(id) {
        return this.parameterList.query({id: id}).$promise;
    }

    addSystemParameter(resource : Model.ParamType) {
        return this.saveParamList.save(resource).$promise;
    }

    editSystemParameter(id) {
        return this.editParameter.get({id : id}).$promise;
    }

    deleteSystemParameter(systemParameterId) {
        return this.deleteParameter.query({ systemParameterId: systemParameterId}).$promise;
    }
}

app.service(SystemParameterService.serviceId, ['$resource', ($resource) => {
    return new SystemParameterService($resource);
}]);

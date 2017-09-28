/// <reference path="../../services/globalization/globalizationservice.ts" />


interface IGlobalizationControllerScope extends ng.IScope {
    getModuleList: Function;
    moduleList: any;
    isListPanelVisible: boolean;
    getLabelListById: Function;
    labelList: any;
    saveLabel: Function;
    closePanel: Function;
    moduleInfo: any;
    isLanguageAdded: boolean;
}

interface IGlobalizationController {

}

class GlobalizationController implements IGlobalizationController {
    static controllerId = "GlobalizationController";
    
    constructor(private $scope: IGlobalizationControllerScope, private $resource: ng.resource.IResourceService, private globalizationService: GlobalizationService, private $log: ng.ILogService, private $rootScope,public ngToast) {
        this.$scope.getModuleList = () => this.getModuleList();
        this.$scope.moduleList = [];
        this.$scope.isListPanelVisible = false;
        this.$scope.getLabelListById = (id) => this.getLabelListById(id);
        this.$scope.labelList = [];
        this.$scope.saveLabel = (labelList) => this.saveLabel(labelList);
        this.$scope.closePanel = () => this.closePanel();
        this.$scope.moduleInfo = [];


    }

    //method is used for get module list in database. - ps
    public getModuleList() {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.globalizationService.getModuleList();
        promise.then((result) => {
            if (result.isLanguageAdded !== undefined && result.isLanguageAdded !== null) {
                scope.isLanguageAdded = false;
                this.$rootScope.isLoading = false;
                return;
            }
            for (let i = 0; i < result.moduleInfo.length; i++) {
                scope.moduleList.push({ Id: result.moduleInfo[i].Id, ModuleName: result.moduleInfo[i].ModuleName});
               
            } 
            this.$rootScope.isLoading = false;
            this.$scope.isLanguageAdded = true;
            this.$log.log(scope.moduleList);
        }).catch((error) => {


            });
    }

    //get label list according to module id. - ps
    public getLabelListById(moduleDetail) {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.labelList = []; 
        let promise = this.globalizationService.getLabelList(moduleDetail.selected.Id);
        promise.then((result) => {
                for (let i = 0; i < result.length; i++) {
                    scope.labelList.push(result[i]);

                }
            
            scope.isListPanelVisible = true;
            this.$rootScope.isLoading = false;
            this.$log.log(scope.labelList);
        }).catch((error) => {


            });
    }

    //save label value in secondary language. - ps
    public saveLabel(labelList) {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.labelList = labelList;
        let promise = this.globalizationService.saveLabelList(scope.labelList);
        promise.then((result) => {
            
            this.ngToast.create(stringConstants.labelUpdated);
            this.closePanel();
           
        }).catch((error) => { });

    }

    //close panel. - ps
    public closePanel() {
        let scope = this.$scope;
        scope.isListPanelVisible = false;
        scope.labelList = [];
        scope.moduleInfo.selected = undefined;
        this.$rootScope.isLoading = false;
    }
}


app.controller(GlobalizationController.controllerId, ['$scope', '$resource', 'GlobalizationService', '$log', '$rootScope', 'ngToast', ($scope, $resource, globalizationService, $log, $rootScope, ngToast) => {
    return new GlobalizationController($scope, $resource, globalizationService, $log, $rootScope, ngToast);
}]);

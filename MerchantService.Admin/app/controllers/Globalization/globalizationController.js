/// <reference path="../../services/globalization/globalizationservice.ts" />
var GlobalizationController = (function () {
    function GlobalizationController($scope, $resource, globalizationService, $log, $rootScope, ngToast) {
        var _this = this;
        this.$scope = $scope;
        this.$resource = $resource;
        this.globalizationService = globalizationService;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.$scope.getModuleList = function () { return _this.getModuleList(); };
        this.$scope.moduleList = [];
        this.$scope.isListPanelVisible = false;
        this.$scope.getLabelListById = function (id) { return _this.getLabelListById(id); };
        this.$scope.labelList = [];
        this.$scope.saveLabel = function (labelList) { return _this.saveLabel(labelList); };
        this.$scope.closePanel = function () { return _this.closePanel(); };
        this.$scope.moduleInfo = [];
    }
    //method is used for get module list in database. - ps
    GlobalizationController.prototype.getModuleList = function () {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.globalizationService.getModuleList();
        promise.then(function (result) {
            if (result.isLanguageAdded !== undefined && result.isLanguageAdded !== null) {
                scope.isLanguageAdded = false;
                _this.$rootScope.isLoading = false;
                return;
            }
            for (var i = 0; i < result.moduleInfo.length; i++) {
                scope.moduleList.push({ Id: result.moduleInfo[i].Id, ModuleName: result.moduleInfo[i].ModuleName });
            }
            _this.$rootScope.isLoading = false;
            _this.$scope.isLanguageAdded = true;
            _this.$log.log(scope.moduleList);
        }).catch(function (error) {
        });
    };
    //get label list according to module id. - ps
    GlobalizationController.prototype.getLabelListById = function (moduleDetail) {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.labelList = [];
        var promise = this.globalizationService.getLabelList(moduleDetail.selected.Id);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                scope.labelList.push(result[i]);
            }
            scope.isListPanelVisible = true;
            _this.$rootScope.isLoading = false;
            _this.$log.log(scope.labelList);
        }).catch(function (error) {
        });
    };
    //save label value in secondary language. - ps
    GlobalizationController.prototype.saveLabel = function (labelList) {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.labelList = labelList;
        var promise = this.globalizationService.saveLabelList(scope.labelList);
        promise.then(function (result) {
            _this.ngToast.create(stringConstants.labelUpdated);
            _this.closePanel();
        }).catch(function (error) { });
    };
    //close panel. - ps
    GlobalizationController.prototype.closePanel = function () {
        var scope = this.$scope;
        scope.isListPanelVisible = false;
        scope.labelList = [];
        scope.moduleInfo.selected = undefined;
        this.$rootScope.isLoading = false;
    };
    return GlobalizationController;
}());
GlobalizationController.controllerId = "GlobalizationController";
app.controller(GlobalizationController.controllerId, ['$scope', '$resource', 'GlobalizationService', '$log', '$rootScope', 'ngToast', function ($scope, $resource, globalizationService, $log, $rootScope, ngToast) {
        return new GlobalizationController($scope, $resource, globalizationService, $log, $rootScope, ngToast);
    }]);
//# sourceMappingURL=globalizationController.js.map
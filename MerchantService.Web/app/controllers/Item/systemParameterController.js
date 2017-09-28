/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/systemparameterservice.ts" />
var SystemParameterController = (function () {
    function SystemParameterController($scope, systemParameterService, $rootScope, ngToast, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.systemParameterService = systemParameterService;
        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.$modal = $modal;
        this.$scope.getConstantList = function () { return _this.getConstantList(); };
        this.$scope.constant = [];
        this.$scope.constantList = [];
        this.$scope.parameterList = [];
        this.$scope.paramType = new Model.ParamType;
        this.$scope.getParameterListById = function (constant) { return _this.getParameterListById(constant); };
        this.$scope.noDataFound = stringConstants.errorMessage;
        this.$scope.cancelParameterPanel = function () { return _this.cancelParameterPanel(); };
        this.$scope.saveParameterName = function (paramType) { return _this.saveParameterName(paramType); };
        this.$scope.editSystemParameterName = function (paramTypeId) { return _this.editSystemParameterName(paramTypeId); };
        this.$scope.parameterValueExist = stringConstants.parameterNameEnExist;
        this.$scope.categoryDeleteFailed = stringConstants.categoryDeleteFailed;
        this.$scope.valueRequired = stringConstants.valueRequired;
        this.$scope.resetValidation = function () { return _this.resetValidation(); };
        this.$scope.invalidName = stringConstants.invalidValue;
        this.$scope.openDeletePopup = function (id) { return _this.openDeletePopup(id); };
        this.$scope.closeDeletePopup = function () { return _this.closeDeletePopup(); };
        this.$scope.deleteSystemParameter = function (paramTypeId) { return _this.deleteSystemParameter(paramTypeId); };
        this.$scope.isFocusIn = false;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.openDeleteFailurePopup = function () { return _this.openDeleteFailurePopup(); };
        this.$scope.closeDeleteFailurePopup = function () { return _this.closeDeleteFailurePopup(); };
        this.$scope.deleteFailureMsg = "";
    }
    ///get system constant list from database. - ps
    SystemParameterController.prototype.getConstantList = function () {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.systemParameterService.getConstantList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                scope.constantList.push({ Id: result[i].Id, Value: result[i].Value });
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
        });
    };
    ///get system parameter list for database according to dropdown selection value. - ps
    SystemParameterController.prototype.getParameterListById = function (constant) {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.isConstantPanelVisible = true;
        var promise = this.systemParameterService.getsystemParameterList(constant.selected.Id);
        promise.then(function (result) {
            scope.parameterList = [];
            if (result.length !== '0') {
                for (var i = 0; i < result.length; i++) {
                    scope.parameterList.push({ Id: result[i].Id, ValueEn: result[i].ValueEn, ValueSl: result[i].ValueSl });
                }
                scope.isErrorMessageDisplay = false;
                _this.resetValidation();
                _this.$rootScope.isLoading = false;
                return;
            }
            _this.resetValidation();
            _this.$rootScope.isLoading = false;
            scope.isErrorMessageDisplay = true;
        }).catch(function (error) { });
        this.$scope.isFocusIn = true;
    };
    ///cancel system parameter panel. - ps
    SystemParameterController.prototype.cancelParameterPanel = function () {
        var scope = this.$scope;
        scope.isConstantPanelVisible = false;
        scope.isErrorMessageDisplay = false;
        scope.isParameterValueEnExist = false;
        scope.isParameterValueSlExist = false;
        scope.constant.selected = undefined;
        scope.paramType = new Model.ParamType();
        this.resetValidation();
    };
    ///reset validation. - ps
    SystemParameterController.prototype.resetValidation = function () {
        var scope = this.$scope;
        scope.systemparameter.$setPristine();
        scope.systemparameter.$setValidity();
        scope.systemparameter.$setUntouched();
    };
    ///save system parameter name in database. - ps
    SystemParameterController.prototype.saveParameterName = function (paramType) {
        var _this = this;
        var scope = this.$scope;
        scope.isAddSystemParameter = (paramType.Id === undefined || paramType.Id === null) ? true : false;
        scope.paramType = paramType;
        scope.paramType.ParamId = scope.constant.selected.Id;
        this.$rootScope.isLoading = true;
        scope.isParameterValueEnExist = false;
        scope.isParameterValueSlExist = false;
        var promise = this.systemParameterService.addSystemParameter(paramType);
        promise.then(function (result) {
            if (result.isParameterValueSlExist !== undefined && result.isParameterValueSlExist !== null && result.isParameterValueEnExist !== undefined && result.isParameterValueEnExist !== null) {
                scope.isParameterValueEnExist = result.isParameterValueEnExist;
                scope.isParameterValueSlExist = result.isParameterValueSlExist;
                _this.$rootScope.isLoading = false;
                return;
            }
            if (scope.isAddSystemParameter) {
                scope.parameterList.push({ Id: result.Id, ValueEn: result.ValueEn, ValueSl: result.ValueSl });
                scope.paramType = new Model.ParamType();
                _this.$rootScope.isLoading = false;
                _this.ngToast.create(scope.constant.selected.Value + " " + stringConstants.addedSuccessfully);
            }
            else {
                for (var i = 0; i < scope.parameterList.length; i++) {
                    if (scope.parameterList[i].Id === result.Id) {
                        scope.parameterList[i].ValueEn = result.ValueEn;
                        scope.parameterList[i].ValueSl = result.ValueSl;
                        scope.paramType = new Model.ParamType();
                        _this.$rootScope.isLoading = false;
                        _this.ngToast.create(stringConstants.updatedSuccessfully);
                    }
                }
            }
            _this.resetValidation();
        }).catch(function (error) { });
    };
    ///edit system parameter name. -ps
    SystemParameterController.prototype.editSystemParameterName = function (paramTypeId) {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.systemParameterService.editSystemParameter(paramTypeId);
        promise.then(function (result) {
            scope.paramType.Id = result.Id;
            scope.paramType.ParamId = result.ParamId;
            scope.paramType.ValueEn = result.ValueEn;
            scope.paramType.ValueSl = result.ValueSl;
            _this.$rootScope.isLoading = false;
        }).catch(function (error) { });
    };
    ///open delete popup. - ps
    SystemParameterController.prototype.openDeletePopup = function (paramTypeId) {
        var scope = this.$scope;
        scope.paramTypeId = paramTypeId;
        this.deletePopup = this.$modal.open({
            templateUrl: 'DeletePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    ///close delete popup. - ps
    SystemParameterController.prototype.closeDeletePopup = function () {
        this.deletePopup.dismiss('cancel');
    };
    ///delte system parameter. -ps
    SystemParameterController.prototype.deleteSystemParameter = function (paramTypeId) {
        var _this = this;
        var scope = this.$scope;
        this.$rootScope.isLoading = true;
        var promise = this.systemParameterService.deleteSystemParameter(paramTypeId);
        promise.then(function (result) {
            if (result.status === "") {
                for (var i = 0; i < scope.parameterList.length; i++) {
                    if (scope.parameterList[i].Id === paramTypeId) {
                        scope.parameterList.splice(i, 1);
                    }
                }
                _this.$rootScope.isLoading = false;
                _this.closeDeletePopup();
            }
            else {
                _this.$rootScope.isLoading = false;
                _this.closeDeletePopup();
                scope.deleteFailureMsg = result.status;
                _this.openDeleteFailurePopup();
            }
        }).catch(function (error) { });
    };
    ///open delete failure popup. - jj
    SystemParameterController.prototype.openDeleteFailurePopup = function () {
        var scope = this.$scope;
        this.deleteFailurePopup = this.$modal.open({
            templateUrl: 'DeleteFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    ///close delete failure popup. - jj
    SystemParameterController.prototype.closeDeleteFailurePopup = function () {
        this.deleteFailurePopup.dismiss('cancel');
    };
    return SystemParameterController;
}());
SystemParameterController.controllerId = "systemParameterController";
app.controller(SystemParameterController.controllerId, ['$scope', 'systemParameterService', '$rootScope', 'ngToast', '$modal', function ($scope, systemParameterService, $rootScope, ngToast, $modal) {
        return new SystemParameterController($scope, systemParameterService, $rootScope, ngToast, $modal);
    }]);
//# sourceMappingURL=systemParameterController.js.map
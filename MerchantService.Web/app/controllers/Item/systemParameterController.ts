/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/systemparameterservice.ts" />


interface IsystemParameterControllerScope extends ng.IScope {
    getConstantList: Function;
    isConstantPanelVisible: boolean;
    constantList: any;
    constant: any;
    getParameterListById: Function;
    parameterList: any;
    noDataFound: any;
    isErrorMessageDisplay: boolean;
    cancelParameterPanel: Function;
    paramType: any;
    saveParameterName: Function;
    editSystemParameterName: Function;
    isAddSystemParameter: boolean;
    isParameterValueEnExist: boolean;
    isParameterValueSlExist: boolean;
    parameterValueExist: any;
    valueRequired: any;
    resetValidation: Function;
    invalidName: any;
    openDeletePopup: Function;
    closeDeletePopup: Function;
    deleteSystemParameter: Function;
    paramTypeId: any;
    isFocusIn: boolean;
    deleteFailureMsg: string;
    openDeleteFailurePopup: Function;
    closeDeleteFailurePopup: Function;
    deleteConfirmMessage: any;
    deleteConfirmation: any;
    categoryDeleteFailed: any;
}

interface IsystemParameterController {
    
}

class SystemParameterController implements IsystemParameterController {
    static controllerId: string = "systemParameterController";
    public deletePopup;
    public deleteFailurePopup;
    constructor(private $scope: IsystemParameterControllerScope, private systemParameterService: SystemParameterService, public $rootScope, private ngToast, public $modal) {
        this.$scope.getConstantList = () => this.getConstantList();
        this.$scope.constant = [];
        this.$scope.constantList = [];
        this.$scope.parameterList = [];
        this.$scope.paramType = new Model.ParamType;
        this.$scope.getParameterListById = (constant) => this.getParameterListById(constant);
        this.$scope.noDataFound = stringConstants.errorMessage;
        this.$scope.cancelParameterPanel = () => this.cancelParameterPanel();
        this.$scope.saveParameterName = (paramType) => this.saveParameterName(paramType);
        this.$scope.editSystemParameterName = (paramTypeId) => this.editSystemParameterName(paramTypeId);
        this.$scope.parameterValueExist = stringConstants.parameterNameEnExist;
        this.$scope.categoryDeleteFailed = stringConstants.categoryDeleteFailed;
        this.$scope.valueRequired = stringConstants.valueRequired;
        this.$scope.resetValidation = () => this.resetValidation();
        this.$scope.invalidName = stringConstants.invalidValue;
        this.$scope.openDeletePopup = (id) => this.openDeletePopup(id);
        this.$scope.closeDeletePopup = () => this.closeDeletePopup();
        this.$scope.deleteSystemParameter = (paramTypeId) => this.deleteSystemParameter(paramTypeId);
        this.$scope.isFocusIn = false;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.openDeleteFailurePopup = () => this.openDeleteFailurePopup();
        this.$scope.closeDeleteFailurePopup = () => this.closeDeleteFailurePopup();
        this.$scope.deleteFailureMsg = "";
    }

    ///get system constant list from database. - ps
    public getConstantList() {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.systemParameterService.getConstantList();
            promise.then((result) => {
                for (let i = 0; i < result.length; i++) {
                    scope.constantList.push({Id : result[i].Id,Value: result[i].Value});
                }
                this.$rootScope.isLoading = false;
            }).catch((error) => {
            });
    }
  
    ///get system parameter list for database according to dropdown selection value. - ps
    public getParameterListById(constant) {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        scope.isConstantPanelVisible = true;
        let promise = this.systemParameterService.getsystemParameterList(constant.selected.Id);
        promise.then((result) => {
            scope.parameterList = [];
            if (result.length !== '0') {
                for (let i = 0; i < result.length; i++) {
                    scope.parameterList.push({ Id: result[i].Id, ValueEn: result[i].ValueEn , ValueSl : result[i].ValueSl });
                }
               
                scope.isErrorMessageDisplay = false;
                this.resetValidation();
                this.$rootScope.isLoading = false;
                return;
            }
            this.resetValidation();    
            this.$rootScope.isLoading = false;
            scope.isErrorMessageDisplay = true;


            }).catch((error) => { });
        this.$scope.isFocusIn= true;
    }

    ///cancel system parameter panel. - ps
    public cancelParameterPanel() {
        let scope = this.$scope;
        scope.isConstantPanelVisible = false;
        scope.isErrorMessageDisplay = false;
        scope.isParameterValueEnExist = false;
        scope.isParameterValueSlExist = false;
        scope.constant.selected = undefined;
        scope.paramType = new Model.ParamType();
        this.resetValidation();

    }

    ///reset validation. - ps
    public resetValidation() {
        let scope: any = this.$scope;
        scope.systemparameter.$setPristine();
        scope.systemparameter.$setValidity();
        scope.systemparameter.$setUntouched();
    }

    ///save system parameter name in database. - ps
    private saveParameterName(paramType) {
        let scope = this.$scope;
        scope.isAddSystemParameter = (paramType.Id === undefined || paramType.Id === null ) ? true : false;
        scope.paramType = paramType;
        scope.paramType.ParamId = scope.constant.selected.Id;
        this.$rootScope.isLoading = true;
        scope.isParameterValueEnExist = false;
        scope.isParameterValueSlExist = false;
        let promise = this.systemParameterService.addSystemParameter(paramType);
        promise.then((result) => {
            if (result.isParameterValueSlExist !== undefined && result.isParameterValueSlExist !== null && result.isParameterValueEnExist !== undefined && result.isParameterValueEnExist !== null) {
                scope.isParameterValueEnExist = result.isParameterValueEnExist;
                scope.isParameterValueSlExist = result.isParameterValueSlExist;
                this.$rootScope.isLoading = false;
                return;
            }
            if (scope.isAddSystemParameter) {
                scope.parameterList.push({ Id: result.Id, ValueEn: result.ValueEn, ValueSl: result.ValueSl });
                scope.paramType = new Model.ParamType();
                this.$rootScope.isLoading = false;    
                this.ngToast.create(scope.constant.selected.Value+" "+stringConstants.addedSuccessfully);
            }

            else {
                for (let i = 0; i < scope.parameterList.length; i++) {
                    if (scope.parameterList[i].Id === result.Id) {
                        scope.parameterList[i].ValueEn = result.ValueEn;
                        scope.parameterList[i].ValueSl = result.ValueSl;
                        scope.paramType = new Model.ParamType();
                        this.$rootScope.isLoading = false;
                        this.ngToast.create(stringConstants.updatedSuccessfully);

                    }
                }
            }
            this.resetValidation();

        }).catch((error) => { });
    }


    ///edit system parameter name. -ps
    private editSystemParameterName(paramTypeId) {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.systemParameterService.editSystemParameter(paramTypeId);
        promise.then((result) => {
            scope.paramType.Id = result.Id;
            scope.paramType.ParamId = result.ParamId;
            scope.paramType.ValueEn = result.ValueEn;
            scope.paramType.ValueSl = result.ValueSl;
            this.$rootScope.isLoading = false;

        }).catch((error) => { });


    }

    ///open delete popup. - ps
    private openDeletePopup(paramTypeId) {
        let scope = this.$scope;
        scope.paramTypeId = paramTypeId;
        this.deletePopup = this.$modal.open({
            templateUrl: 'DeletePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        
    }

    ///close delete popup. - ps
    private closeDeletePopup() {
        this.deletePopup.dismiss('cancel');
    }

    ///delte system parameter. -ps
    private deleteSystemParameter(paramTypeId) {
        let scope = this.$scope;
        this.$rootScope.isLoading = true;
        let promise = this.systemParameterService.deleteSystemParameter(paramTypeId);
            promise.then((result) => {
                if (result.status === "") {
                    for (let i = 0; i < scope.parameterList.length; i++) {
                        if (scope.parameterList[i].Id === paramTypeId) {
                            scope.parameterList.splice(i, 1);
                        }
                    }
                    this.$rootScope.isLoading = false;
                    this.closeDeletePopup();

                }
                else {
                    this.$rootScope.isLoading = false;
                    this.closeDeletePopup();
                    scope.deleteFailureMsg = result.status;
                    this.openDeleteFailurePopup();
                }
        }).catch((error) => { });
    }


    ///open delete failure popup. - jj
    private openDeleteFailurePopup() {
        let scope = this.$scope;      
        this.deleteFailurePopup = this.$modal.open({
            templateUrl: 'DeleteFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });

    }

    ///close delete failure popup. - jj
    private closeDeleteFailurePopup() {
        this.deleteFailurePopup.dismiss('cancel');
    }
}


app.controller(SystemParameterController.controllerId, ['$scope', 'systemParameterService', '$rootScope', 'ngToast', '$modal', ($scope, systemParameterService, $rootScope, ngToast, $modal) => {
    return new SystemParameterController($scope, systemParameterService, $rootScope, ngToast, $modal);
}]);

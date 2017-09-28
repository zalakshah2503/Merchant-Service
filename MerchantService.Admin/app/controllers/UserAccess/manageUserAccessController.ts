/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/useraccess/manageuseraccessservice.ts" />


interface IManageUserAccessControllerScope extends ng.IScope {
    userAcessDetail: Model.UserAcessDetail;
    roleList: any;
    userAccessList: any;
    getRoleList: Function;
    updateUserAccessDetail: Function;
    getUserAccesListByRoleId: Function;
    cancleUpdateAccessDetail: Function;
    chekBoxMessage: boolean;
    updateUserAccessTable: Function;
    errorMessage: string;
    dropDownMessage: boolean;
    companyErrorMessageDisplay: boolean;
    roleNameRequired: string;
    checkBoxSelectionRequired: string;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalCollectionList: any;
    allCheckBoxChekedEvent: Function;
    totalItems: number;
    hasChecked: boolean;
    singleCheckBoxChekedEvent: Function;
    paggingEvent: Function;
    totalCollection: any;
}

interface IManageUserAccessController {
}

class ManageUserAccessController implements IManageUserAccessController {
    static controllerId = "ManageUserAccessController";

    constructor(private $scope: IManageUserAccessControllerScope, private $log: ng.ILogService, private manageUserAccessService: ManageUserAccessService, public $rootScope, public apiPath, public ngToast) {
        this.$scope.userAcessDetail = new Model.UserAcessDetail();
        this.$scope.roleList = [];
        this.$scope.userAccessList = [];
        this.$scope.chekBoxMessage = false;
        this.$scope.roleNameRequired = stringConstants.roleNameRequired;
        this.$scope.checkBoxSelectionRequired = stringConstants.checkBoxSelectionRequired;
        this.$scope.getRoleList = () => this.getRoleList();
        this.$scope.getUserAccesListByRoleId = (roleId: number) => this.getUserAccesListByRoleId(roleId);
        this.$scope.updateUserAccessDetail = (userAccessList: any) => this.updateUserAccessDetail(userAccessList);
        this.$scope.updateUserAccessTable = (userAccessList: any) => this.updateUserAccessTable(userAccessList);
        this.$scope.cancleUpdateAccessDetail = () => this.cancleUpdateAccessDetail();
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.totalCollectionList = [];
        this.$scope.allCheckBoxChekedEvent = () => this.allCheckBoxChekedEvent();
        this.$scope.singleCheckBoxChekedEvent = () => this.singleCheckBoxChekedEvent();
        this.$scope.totalCollection = [];
        // this.$scope.paggingEvent = () => this.paggingEvent();
        // this.$scope.userAccessListCollection = [];

        /* init pagination with current page and item per page.*/
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.userAccessList.slice(begin, end);
        });
    }
    
    //This function used of get role List -An
    private getRoleList() {
        let controllerScope = this.$scope;
        let contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        let promise = this.manageUserAccessService.getRoleList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.roleList.push({ Id: result[i].Id, RoleName: result[i].RoleName });
                }
            }
            contollerRootScope.isLoading = false;
        }).catch((error) => {
            contollerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This function used for get all form list and also decide which page is active or not.-An
    private getUserAccesListByRoleId(roleId) {
        let controllerScope = this.$scope;
        controllerScope.chekBoxMessage = false;
        controllerScope.itemsPerPage = 15;
        controllerScope.currentPage = 1;
        controllerScope.maxSize = 10;
        controllerScope.userAccessList = [];
        controllerScope.totalCollectionList = [];
        let userCollection = controllerScope.userAccessList;
        let contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        let promise = this.manageUserAccessService.getUserAccesListByRoleId(roleId);
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    userCollection.push(result[i]);

                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = userCollection.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.userAccessList.length;
                this.$scope.singleCheckBoxChekedEvent();
            }
            contollerRootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.companyErrorMessageDisplay = true;
            } else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            contollerRootScope.isLoading = false;
        });
    }

    //This function used for update and insert user access detail in user access table.-An
    private updateUserAccessDetail(userAccessList) {
        if (userAccessList.length !== 0) {
            let controllerScope = this.$scope;
            let isActive = false;
            let contollerRootScope = this.$rootScope;
            contollerRootScope.isLoading = true;

            for (let i = 0; i < userAccessList.length; i++) {
                if (userAccessList[i].IsActive === true)
                    isActive = true;
            }
            //to check atleast one check box is checked or not.
            if (isActive === false) {
                //This method used for check user access page is exists in table or not using role id.
                let promise = this.manageUserAccessService.getUserAccessByRoleId(userAccessList[0].roleId);
                promise.then((result) => {
                    if (result.IsResult === true) {
                        controllerScope.updateUserAccessTable(userAccessList);
                        controllerScope.chekBoxMessage = false;
                    }
                    else {
                        controllerScope.chekBoxMessage = true;
                    }
                    contollerRootScope.isLoading = false;
                }).catch((error) => {
                    contollerRootScope.isLoading = false;
                    this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(this.apiPath);
                    }
                });
            }
            else {
                controllerScope.chekBoxMessage = false;
                controllerScope.updateUserAccessTable(userAccessList);
            }
        }
    }

    //this function is sub method of insert/update user access detail method.-An
    private updateUserAccessTable(userAccessList) {
        let contollerRootScope = this.$rootScope;
        let promise = this.manageUserAccessService.updateUserAccessDetail(userAccessList);
        promise.then((result) => {
            if (result.IsResult === true) {
                this.ngToast.create(stringConstants.updateUserAcces);
            }
            contollerRootScope.isLoading = false;
        }).catch((error) => {
            contollerRootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    //This function used for reset the form -An
    private cancleUpdateAccessDetail() {
        let controllerScope: any = this.$scope;
        controllerScope.userAcessDetail = new Model.UserAcessDetail();
        this.$scope.chekBoxMessage = false;
        controllerScope.userAccessList = [];
        controllerScope.totalCollection = [];
        controllerScope.totalCollectionList = [];
        controllerScope.userAccess.$setPristine();
        controllerScope.userAccess.$setValidity();
        controllerScope.userAccess.$setUntouched();
        controllerScope.hasChecked = false;
        controllerScope.userAccess.$invalid = true;
    }

    //This function used cheked/unchecked for all chekbox.-An
    private allCheckBoxChekedEvent() {
        for (let i = 0; i < this.$scope.totalCollection.length; i++) {
            if (this.$scope.hasChecked)
                this.$scope.totalCollection[i].IsActive = true;
            else
                this.$scope.totalCollection[i].IsActive = false;
        }
        this.$scope.$apply();
    }

    //This function used for check current page all checkbox is cheked/uncheked(When all chekbox is cheked so all select checkBox is checked other wise unchecked)-An
    private singleCheckBoxChekedEvent() {
        let isActive = true;
        for (let i = 0; i < this.$scope.totalCollection.length; i++) {
            if (this.$scope.totalCollection[i].IsActive === false) {
                isActive = false;
            }
        }

        if (isActive) {
            this.$scope.hasChecked = true;
        }
        else {
            this.$scope.hasChecked = false;
        }
    }
}

app.controller(ManageUserAccessController.controllerId, [
    '$scope', '$log', 'ManageUserAccessService', '$rootScope', 'apiPath', 'ngToast', ($scope, $log, manageUserAccessService, $rootScope, apiPath, ngToast) => {
        return new ManageUserAccessController($scope, $log, manageUserAccessService, $rootScope, apiPath, ngToast);
    }]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/Account/groupservice.ts" />
/// <reference path="../userauthentication/useraccesscontroller.ts" />
 

interface IgroupControllerScope extends ng.IScope {

    group: any;
    isAdd: boolean;
    isGroupNameExist: boolean;
    groupList: any;
    isLoading: boolean;
    getGroupList: Function;
    addGroupName: Function;
    groupErrorMessage: string;
    newGroupPanel: boolean;
    addNewGroup: Function;
    editGroupDetails: Function;
    isUpdateGroup: boolean;
    cancelGroupDetails: Function;
    updateGroup: Function;
    errorMessage: string;
    groupErrorMessageDisplay: boolean;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalGroupList: any;
    totalCollection: any;
    totalItems: number;
    groupNameRequired: string;
    groupExists: string;
    isFocusIn: boolean;
    groupUnderList: any;
}

interface IgroupController {
}

class GroupController implements IgroupController {
    static controllerId = "GroupController";

    constructor(private $scope: IgroupControllerScope, private $log: ng.ILogService, private groupService: GroupService, private userAccessService: UserAccessService, public ngToast, public $rootScope, public apiPath, public $location, public listOfAccessPages, public authenticationPath) {
        this.$scope.group = new Model.GroupAccount;
        this.$scope.groupList = [];
        this.$scope.getGroupList = () => this.getGroupList();
        this.$scope.addGroupName = (group: Model.GroupAccount) => this.addGroupName(group);
        this.$scope.groupErrorMessage = "";
        this.$scope.isGroupNameExist = false;
        this.$scope.newGroupPanel = false;
        this.$scope.addNewGroup = () => this.addNewGroup();
        this.$scope.editGroupDetails = (groupId: number) => this.editGroupDetails(groupId);
        this.$scope.isUpdateGroup = false;
        this.$scope.cancelGroupDetails = () => this.cancelGroupDetails();
        this.$scope.updateGroup = (group: Model.GroupAccount) => this.updateGroup(group);
        this.$scope.errorMessage = "";
        this.$scope.groupErrorMessageDisplay = false;
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.totalCollection = [];
        this.$scope.totalGroupList = [];
        this.$scope.groupNameRequired = stringConstants.groupNameRequired;
        this.$scope.groupExists = stringConstants.groupExists;
        this.$scope.isFocusIn = false;
        this.$scope.groupUnderList = [];

        //for pagging 
        let groupPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.groupList = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.groupList = this.$scope.totalGroupList.slice(begin, end);
        });
    }

    private addNewGroup() {
        this.$scope.isGroupNameExist = false;
        this.$scope.newGroupPanel = true;
        this.$scope.isUpdateGroup = false;
        this.$scope.group = new Model.GroupAccount();
        this.$scope.isFocusIn = true;
    }
    //Add new group in database-SP
    private addGroupName(group) {
        let controlerScope: any = this.$scope;
        let contollerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        contollerRootScope.isLoading = true;
        let promise = this.groupService.saveGroupAccount(group);
        promise.then((result) => {
            controllerScope.groupList.push(result);
            controlerScope.groupList.sort();
            contollerRootScope.isLoading = false;
            controllerScope.newGroupPanel = false;
            controllerScope.group = new Model.GroupAccount();
            this.ngToast.create(stringConstants.groupAdded);
        }).catch((error) => {
            contollerRootScope.isLoading = false;
            controllerScope.isGroupNameExist = true;
            controllerScope.groupErrorMessage = error.data.ExceptionMessage;
            this.$log.log(error);
            });
        controlerScope.addGroup.$setPristine();
        controlerScope.addGroup.$setUntouched();
    }

    //Update Group in database.-SP
    private updateGroup(group) {
        let controllerScope = this.$scope;
        let contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        let promise = this.groupService.updateGroupAccount(group);
        promise.then((result) => {
            for (let i = 0; i < controllerScope.groupList.length; i++) {
                if (controllerScope.groupList[i].GroupId === result.Id) {
                    controllerScope.groupList[i].GroupName = result.GroupName;
                    controllerScope.groupList[i].UnderId = result.UnderId;
                    break;
                }
            }
            contollerRootScope.isLoading = false;
            controllerScope.newGroupPanel = false;
            controllerScope.group = new Model.GroupAccount();
            this.ngToast.create(stringConstants.groupUpdated);

        }).catch((error) => {
            contollerRootScope.isLoading = false;
            controllerScope.isGroupNameExist = true;
            controllerScope.groupErrorMessage = error.data.ExceptionMessage;
            this.$log.log(error);
        });

    }

    //this method is usedf ro geeting list of Group. -SP
    private getGroupList() {
        let contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        let location = this.$location.path();
       
                let controllerScope = this.$scope;
                controllerScope.totalGroupList = [];
                let groupColletion = controllerScope.totalGroupList;
                let promise = this.groupService.getGroupList();
                promise.then((result) => {
                    if (result.length === 0) {
                        controllerScope.errorMessage = stringConstants.errorMessage;
                        controllerScope.groupErrorMessageDisplay = true;
                        contollerRootScope.isLoading = false;
                    }
                    else {
                        for (let i = 0; i < result.length; i++) {
                           controllerScope.groupUnderList.push(result[i]);
                            groupColletion.push(result[i]);
                            contollerRootScope.isLoading = false;
                            controllerScope.groupErrorMessageDisplay = false;
                            let that = this;
                            //for pagging and create page number as per number of record
                            controllerScope.totalItems = controllerScope.totalGroupList.length;
                            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                                end = begin + that.$scope.itemsPerPage;
                            controllerScope.groupList = groupColletion.slice(begin, end);
                        }
                    }

                }).catch((error) => {
                    //IF data not found, then it will sohow message.
                    if (error.status === 500) {
                        controllerScope.errorMessage = stringConstants.errorMessage;
                        controllerScope.groupErrorMessageDisplay = true;
                        contollerRootScope.isLoading = false;
                        this.$log.log(error);
                    }
                    else {
                        location.replace(this.apiPath);
                    }
                });
    }

    //this method is used for fill the control on edit button.-SP
    private editGroupDetails(groupId) {
        this.$scope.newGroupPanel = true;
        let controllerScope = this.$scope;
        controllerScope.isUpdateGroup = true;
        for (let i = 0; i <= controllerScope.groupList.length; i++) {
            if (controllerScope.groupList[i].GroupId === groupId) {
                controllerScope.group.GroupName = controllerScope.groupList[i].GroupName;
                controllerScope.group.UnderId = controllerScope.groupList[i].UnderId;
                controllerScope.group.GroupId = controllerScope.groupList[i].GroupId;
                break;
            }
        }
    }

    //This method is used for clear control and enable the grid panel. -SP
    private cancelGroupDetails() {
        let controllerScope: any = this.$scope;
        controllerScope.newGroupPanel = false;
        controllerScope.isUpdateGroup = false;
        controllerScope.group = new Model.GroupAccount();

        controllerScope.addGroup.$setPristine();
        controllerScope.addGroup.$setUntouched();

    }
}

app.controller(GroupController.controllerId, ['$scope', '$log', 'GroupService', 'UserAccessService', 'ngToast', '$rootScope', 'apiPath', '$location', 'listOfAccessPages', 'authenticationPath', ($scope, $log, GroupService, UserAccessService, ngToast, $rootSoope, apiPath, $location, listOfAccessPages, authenticationPath) => {
    return new GroupController($scope, $log, GroupService, UserAccessService, ngToast, $rootSoope, apiPath, $location, listOfAccessPages, authenticationPath);
}]);

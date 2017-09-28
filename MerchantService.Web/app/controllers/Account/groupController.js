/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/Account/groupservice.ts" />
/// <reference path="../userauthentication/useraccesscontroller.ts" />
var GroupController = (function () {
    function GroupController($scope, $log, groupService, userAccessService, ngToast, $rootScope, apiPath, $location, listOfAccessPages, authenticationPath) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.groupService = groupService;
        this.userAccessService = userAccessService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.$location = $location;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.$scope.group = new Model.GroupAccount;
        this.$scope.groupList = [];
        this.$scope.getGroupList = function () { return _this.getGroupList(); };
        this.$scope.addGroupName = function (group) { return _this.addGroupName(group); };
        this.$scope.groupErrorMessage = "";
        this.$scope.isGroupNameExist = false;
        this.$scope.newGroupPanel = false;
        this.$scope.addNewGroup = function () { return _this.addNewGroup(); };
        this.$scope.editGroupDetails = function (groupId) { return _this.editGroupDetails(groupId); };
        this.$scope.isUpdateGroup = false;
        this.$scope.cancelGroupDetails = function () { return _this.cancelGroupDetails(); };
        this.$scope.updateGroup = function (group) { return _this.updateGroup(group); };
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
        var groupPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.groupList = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.groupList = _this.$scope.totalGroupList.slice(begin, end);
        });
    }
    GroupController.prototype.addNewGroup = function () {
        this.$scope.isGroupNameExist = false;
        this.$scope.newGroupPanel = true;
        this.$scope.isUpdateGroup = false;
        this.$scope.group = new Model.GroupAccount();
        this.$scope.isFocusIn = true;
    };
    //Add new group in database-SP
    GroupController.prototype.addGroupName = function (group) {
        var _this = this;
        var controlerScope = this.$scope;
        var contollerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        contollerRootScope.isLoading = true;
        var promise = this.groupService.saveGroupAccount(group);
        promise.then(function (result) {
            controllerScope.groupList.push(result);
            controlerScope.groupList.sort();
            contollerRootScope.isLoading = false;
            controllerScope.newGroupPanel = false;
            controllerScope.group = new Model.GroupAccount();
            _this.ngToast.create(stringConstants.groupAdded);
        }).catch(function (error) {
            contollerRootScope.isLoading = false;
            controllerScope.isGroupNameExist = true;
            controllerScope.groupErrorMessage = error.data.ExceptionMessage;
            _this.$log.log(error);
        });
        controlerScope.addGroup.$setPristine();
        controlerScope.addGroup.$setUntouched();
    };
    //Update Group in database.-SP
    GroupController.prototype.updateGroup = function (group) {
        var _this = this;
        var controllerScope = this.$scope;
        var contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        var promise = this.groupService.updateGroupAccount(group);
        promise.then(function (result) {
            for (var i = 0; i < controllerScope.groupList.length; i++) {
                if (controllerScope.groupList[i].GroupId === result.Id) {
                    controllerScope.groupList[i].GroupName = result.GroupName;
                    controllerScope.groupList[i].UnderId = result.UnderId;
                    break;
                }
            }
            contollerRootScope.isLoading = false;
            controllerScope.newGroupPanel = false;
            controllerScope.group = new Model.GroupAccount();
            _this.ngToast.create(stringConstants.groupUpdated);
        }).catch(function (error) {
            contollerRootScope.isLoading = false;
            controllerScope.isGroupNameExist = true;
            controllerScope.groupErrorMessage = error.data.ExceptionMessage;
            _this.$log.log(error);
        });
    };
    //this method is usedf ro geeting list of Group. -SP
    GroupController.prototype.getGroupList = function () {
        var _this = this;
        var contollerRootScope = this.$rootScope;
        contollerRootScope.isLoading = true;
        var location = this.$location.path();
        var controllerScope = this.$scope;
        controllerScope.totalGroupList = [];
        var groupColletion = controllerScope.totalGroupList;
        var promise = this.groupService.getGroupList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.groupErrorMessageDisplay = true;
                contollerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.groupUnderList.push(result[i]);
                    groupColletion.push(result[i]);
                    contollerRootScope.isLoading = false;
                    controllerScope.groupErrorMessageDisplay = false;
                    var that = _this;
                    //for pagging and create page number as per number of record
                    controllerScope.totalItems = controllerScope.totalGroupList.length;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.groupList = groupColletion.slice(begin, end);
                }
            }
        }).catch(function (error) {
            //IF data not found, then it will sohow message.
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.groupErrorMessageDisplay = true;
                contollerRootScope.isLoading = false;
                _this.$log.log(error);
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    //this method is used for fill the control on edit button.-SP
    GroupController.prototype.editGroupDetails = function (groupId) {
        this.$scope.newGroupPanel = true;
        var controllerScope = this.$scope;
        controllerScope.isUpdateGroup = true;
        for (var i = 0; i <= controllerScope.groupList.length; i++) {
            if (controllerScope.groupList[i].GroupId === groupId) {
                controllerScope.group.GroupName = controllerScope.groupList[i].GroupName;
                controllerScope.group.UnderId = controllerScope.groupList[i].UnderId;
                controllerScope.group.GroupId = controllerScope.groupList[i].GroupId;
                break;
            }
        }
    };
    //This method is used for clear control and enable the grid panel. -SP
    GroupController.prototype.cancelGroupDetails = function () {
        var controllerScope = this.$scope;
        controllerScope.newGroupPanel = false;
        controllerScope.isUpdateGroup = false;
        controllerScope.group = new Model.GroupAccount();
        controllerScope.addGroup.$setPristine();
        controllerScope.addGroup.$setUntouched();
    };
    return GroupController;
}());
GroupController.controllerId = "GroupController";
app.controller(GroupController.controllerId, ['$scope', '$log', 'GroupService', 'UserAccessService', 'ngToast', '$rootScope', 'apiPath', '$location', 'listOfAccessPages', 'authenticationPath', function ($scope, $log, GroupService, UserAccessService, ngToast, $rootSoope, apiPath, $location, listOfAccessPages, authenticationPath) {
        return new GroupController($scope, $log, GroupService, UserAccessService, ngToast, $rootSoope, apiPath, $location, listOfAccessPages, authenticationPath);
    }]);
//# sourceMappingURL=groupController.js.map
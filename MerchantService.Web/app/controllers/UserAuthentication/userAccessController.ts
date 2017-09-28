/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/userauthentication/useraccessservice.ts" />

 
interface IuserAccessControllerScope extends ng.IScope {
}

interface IuserAccessController {

}

class UserAccessController implements IuserAccessController {
    static controllerId = "UserAccessController";


    constructor(private $scope: IuserAccessControllerScope, private $log: ng.ILogService, public $rootScope, private userAccessService: UserAccessService, public apiPath, public listOfAccessPages) {
        this.$rootScope.listOfActivePages = listOfAccessPages;
    }
  
}

app.controller(UserAccessController.controllerId, ['$scope', '$log', '$rootScope', 'UserAccessService', 'apiPath', 'listOfAccessPages', ($scope, $log, $rootScope, UserAccessService, apipath, listOfAccessPages) => {
    return new UserAccessController($scope, $log, $rootScope, UserAccessService, apipath, listOfAccessPages);
}]);
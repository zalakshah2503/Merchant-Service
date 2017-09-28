/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/userauthentication/useraccessservice.ts" />
var UserAccessController = (function () {
    function UserAccessController($scope, $log, $rootScope, userAccessService, apiPath, listOfAccessPages) {
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.userAccessService = userAccessService;
        this.apiPath = apiPath;
        this.listOfAccessPages = listOfAccessPages;
        this.$rootScope.listOfActivePages = listOfAccessPages;
    }
    return UserAccessController;
}());
UserAccessController.controllerId = "UserAccessController";
app.controller(UserAccessController.controllerId, ['$scope', '$log', '$rootScope', 'UserAccessService', 'apiPath', 'listOfAccessPages', function ($scope, $log, $rootScope, UserAccessService, apipath, listOfAccessPages) {
        return new UserAccessController($scope, $log, $rootScope, UserAccessService, apipath, listOfAccessPages);
    }]);
//# sourceMappingURL=useraccesscontroller.js.map
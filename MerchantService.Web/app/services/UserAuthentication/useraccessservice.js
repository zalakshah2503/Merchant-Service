var UserAccessService = (function () {
    function UserAccessService($resource, $q, $log, $rootScope, merchatSettings) {
        this.$rootScope = $rootScope;
        this.merchatSettings = merchatSettings;
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$rootScope.merchatSettings = merchatSettings;
        this.checkCurrentUserAccessPage = this.$resource(apiPaths.checkCurrentUserAccess + '/:roleId/:pageName', { roleId: 'roleId', pageName: 'pageName' }, { getdetail: { method: "GET" } });
        this.userAccessActivePageList = this.$resource(apiPaths.userAccessActivePageList + '/:roleId', { roleId: 'roleId' }, { getdetail: { method: "GET" } });
    }
    UserAccessService.prototype.userAccessPageList = function (roleId) {
        return this.userAccessActivePageList.getdetail({ roleId: roleId }).$promise;
    };
    UserAccessService.prototype.checkToAllowPageAccessForCurrentUser = function (roleId, pageName) {
        return this.checkCurrentUserAccessPage.getdetail({ roleId: roleId, pageName: pageName }).$promise;
    };
    return UserAccessService;
}());
UserAccessService.serviceId = "UserAccessService";
app.service(UserAccessService.serviceId, ['$resource', '$q', '$log', '$rootScope', 'merchatSettings', function ($resource, $q, $log, $rootScope, merchatSettings) {
        return new UserAccessService($resource, $q, $log, $rootScope, merchatSettings);
    }]);
//# sourceMappingURL=useraccessservice.js.map
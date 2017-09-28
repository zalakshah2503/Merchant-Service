interface IuserAccessService {
    userAccessPageList: (roleId) => void;
    checkToAllowPageAccessForCurrentUser: (roleId, pageName) => void;
}

class UserAccessService {
    static serviceId = "UserAccessService";
    private $resource;
    private $q;
    private $log;
    public userAccessActivePageList;
    public checkCurrentUserAccessPage;
    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService, private $rootScope: IGlobalRootScope,private merchatSettings) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.$rootScope.merchatSettings = merchatSettings;
        this.checkCurrentUserAccessPage = this.$resource(apiPaths.checkCurrentUserAccess + '/:roleId/:pageName', { roleId: 'roleId', pageName: 'pageName' }, { getdetail: { method: "GET" } });
        this.userAccessActivePageList = this.$resource(apiPaths.userAccessActivePageList + '/:roleId', { roleId: 'roleId' }, { getdetail: {method : "GET"}});
    }

    userAccessPageList(roleId) {
        return this.userAccessActivePageList.getdetail({ roleId : roleId}).$promise;
    }


    checkToAllowPageAccessForCurrentUser(roleId, pageName) {
        return this.checkCurrentUserAccessPage.getdetail({ roleId: roleId, pageName: pageName }).$promise;
    }


}

app.service(UserAccessService.serviceId, ['$resource', '$q', '$log', '$rootScope','merchatSettings', ($resource, $q, $log, $rootScope, merchatSettings) => {
    return new UserAccessService($resource, $q, $log, $rootScope , merchatSettings);
}]);
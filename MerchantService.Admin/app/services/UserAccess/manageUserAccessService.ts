interface IManageUserAccessService {
    getRoleList: () => void;
    getUserAccesListByRoleId: (roleId) => void;
    updateUserAccessDetail: (updateUserAccessDetail) => void;
    getUserAccessByRoleId: (roleId:string) => void;

}

class ManageUserAccessService implements IManageUserAccessService {
    static serviceId = "ManageUserAccessService";
    private $resource;
    private $q;
    private $log;
    public getAllRole;
    public getAllUserAccessList;
    public updateUserAccess;
    public checkUserAccessExistsByRoleId;
    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getAllRole = this.$resource(apiPaths.getRoleList);
        this.getAllUserAccessList = this.$resource(apiPaths.getUserAccessList);
        this.checkUserAccessExistsByRoleId = this.$resource(apiPaths.getUserAccessByRoleId);
        this.updateUserAccess = this.$resource(apiPaths.updateUserAccessDetail, { updateUserAccessDetail: "@updateUserAccessDetail" }, { update: { method: "PUT" } });
    }

    //this service used for get user roles.-An
    getRoleList() {
        return this.getAllRole.query().$promise;
    }

    //This service used for get all form and also decide which form is active or not.-An
    getUserAccesListByRoleId(roleId) {
        return this.getAllUserAccessList.query({ roleId: roleId }).$promise;
    }

    //This service used for update/insert user access detail -An
    updateUserAccessDetail(updateUserAccessDetail) {
        return this.updateUserAccess.update(updateUserAccessDetail).$promise;
    }

    //This service used for check atleast one data is exitst in user access table.-An
    getUserAccessByRoleId(roleId) {
        return this.checkUserAccessExistsByRoleId.get({ roleId: roleId }).$promise;
    }
}

app.service(ManageUserAccessService.serviceId, ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new ManageUserAccessService($resource, $q, $log);
}]);
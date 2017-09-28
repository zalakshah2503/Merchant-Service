var ManageUserAccessService = (function () {
    function ManageUserAccessService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getAllRole = this.$resource(apiPaths.getRoleList);
        this.getAllUserAccessList = this.$resource(apiPaths.getUserAccessList);
        this.checkUserAccessExistsByRoleId = this.$resource(apiPaths.getUserAccessByRoleId);
        this.updateUserAccess = this.$resource(apiPaths.updateUserAccessDetail, { updateUserAccessDetail: "@updateUserAccessDetail" }, { update: { method: "PUT" } });
    }
    //this service used for get user roles.-An
    ManageUserAccessService.prototype.getRoleList = function () {
        return this.getAllRole.query().$promise;
    };
    //This service used for get all form and also decide which form is active or not.-An
    ManageUserAccessService.prototype.getUserAccesListByRoleId = function (roleId) {
        return this.getAllUserAccessList.query({ roleId: roleId }).$promise;
    };
    //This service used for update/insert user access detail -An
    ManageUserAccessService.prototype.updateUserAccessDetail = function (updateUserAccessDetail) {
        return this.updateUserAccess.update(updateUserAccessDetail).$promise;
    };
    //This service used for check atleast one data is exitst in user access table.-An
    ManageUserAccessService.prototype.getUserAccessByRoleId = function (roleId) {
        return this.checkUserAccessExistsByRoleId.get({ roleId: roleId }).$promise;
    };
    return ManageUserAccessService;
}());
ManageUserAccessService.serviceId = "ManageUserAccessService";
app.service(ManageUserAccessService.serviceId, ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new ManageUserAccessService($resource, $q, $log);
    }]);
//# sourceMappingURL=manageuseraccessservice.js.map
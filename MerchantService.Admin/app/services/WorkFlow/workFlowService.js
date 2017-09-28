var workFlowService = (function () {
    function workFlowService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.getRolePermission = this.$resource(apiPaths.getAllRolePermissionlist);
        this.getWorkFlowName = this.$resource(apiPaths.getAllWorkFlowName);
        this.chekRole = this.$resource(apiPaths.checkPermissionRole);
        //this.addWorkFlow = this.$resource(apiPaths.addWorkFlowDetails + '/:permissionId/:roleId', { permissionId: 'permissionId', roleId: 'roleId' }, { query : { method: "GET" } });
        this.addWorkFlow = this.$resource(apiPaths.addWorkFlowDetails);
        this.saveWorkFlow = this.$resource(apiPaths.saveWorkFlowDetails);
        //this.getPermission = this.$resource(apiPaths.getChildPermission);
        this.getAllWorkFlow = this.$resource(apiPaths.getAllWorkFlowList);
        this.getWorkFlowAction = this.$resource(apiPaths.getAllWorkFlowAcionList);
        this.treeView = this.$resource(apiPaths.getWorkFlowDetailsForTreeViewByActivityId);
        this.getWorkFlowInfo = this.$resource(apiPaths.editWorkFlowInformationById);
        this.editWorkFlow = this.$resource(apiPaths.editWorkFlowPermission);
        this.getAllActivity = this.$resource(apiPaths.getAllActivityList);
        this.treeViewCollection = this.$resource(apiPaths.getWorkFlowDetailTreeViewByActivityId);
        this.deleteInformation = this.$resource(apiPaths.deleteWorkFlowInformation);
        this.getvariableList = this.$resource(apiPaths.getvariableListByActivityId);
        this.deleteCondtion = this.$resource(apiPaths.deleteConditionalOperator);
        this.checkWorkFlowName = this.$resource(apiPaths.workFLowNameAlreadyExistOrNot);
        this.workflowList = this.$resource(apiPaths.getAllWorkFlowNameList);
        this.getBoolenList = this.$resource(apiPaths.getAllBoolenOperatorListByActivityId);
    }
    workFlowService.prototype.getAllRolePermissionlist = function () {
        return this.getRolePermission.query().$promise;
    };
    workFlowService.prototype.getAllWorkFlowName = function () {
        return this.getWorkFlowName.query().$promise;
    };
    workFlowService.prototype.checkPermissionRole = function (permissionId) {
        return this.chekRole.query({ permissionId: permissionId }).$promise;
    };
    //addWorkFlowDetails(permissionId,roleId) {
    //    return this.addWorkFlow.query({permissionId : permissionId, roleId : roleId}).$promise;
    //}
    //getChildPermission(activityId) {
    //    return this.getPermission.query({ activityId: activityId }).$promise;
    //}
    workFlowService.prototype.addWorkFlowDetails = function (permissionId) {
        return this.addWorkFlow.query({ permissionId: permissionId }).$promise;
    };
    workFlowService.prototype.editWorkFlowPermission = function (permissionId) {
        return this.editWorkFlow.query({ permissionId: permissionId }).$promise;
    };
    workFlowService.prototype.saveWorkFlowDetails = function (workFlowDetails) {
        return this.saveWorkFlow.save(workFlowDetails).$promise;
    };
    workFlowService.prototype.deleteWorkFlowInformation = function (workFlowActionId) {
        return this.deleteInformation.get({ workFlowActionId: workFlowActionId }).$promise;
    };
    workFlowService.prototype.getAllWorkFlowList = function () {
        return this.getAllWorkFlow.query().$promise;
    };
    workFlowService.prototype.getAllWorkFlowAcionList = function (permissionId) {
        return this.getWorkFlowAction.query({ permissionId: permissionId }).$promise;
    };
    workFlowService.prototype.getWorkFlowDetailsForTreeViewByActivityId = function (activityId) {
        return this.treeView.query({ activityId: activityId }).$promise;
    };
    workFlowService.prototype.editWorkFlowInformationById = function (workFlowId) {
        return this.getWorkFlowInfo.get({ workFlowId: workFlowId }).$promise;
    };
    workFlowService.prototype.getAllActivityList = function () {
        return this.getAllActivity.query().$promise;
    };
    workFlowService.prototype.getWorkFlowDetailTreeViewByActivityId = function (activityId) {
        return this.treeViewCollection.query({ activityId: activityId }).$promise;
    };
    workFlowService.prototype.getAttributeListByActivityId = function (activityId) {
        return this.getvariableList.query({ activityId: activityId }).$promise;
    };
    workFlowService.prototype.getAllBoolenOperatorListByActivityId = function (activityId) {
        return this.getBoolenList.query({ activityId: activityId }).$promise;
    };
    workFlowService.prototype.deleteConditionalOperator = function (conditionalOperatorId) {
        return this.deleteCondtion.get({ conditionalOperatorId: conditionalOperatorId }).$promise;
    };
    workFlowService.prototype.workFLowNameAlreadyExistOrNot = function (workFlowDetails) {
        return this.checkWorkFlowName.save(workFlowDetails).$promise;
    };
    workFlowService.prototype.getAllWorkFlowNameList = function () {
        return this.workflowList.query().$promise;
    };
    return workFlowService;
}());
app.service("workFlowService", ['$resource', '$log', function ($resource, $log) {
        return new workFlowService($resource, $log);
    }]);
//# sourceMappingURL=workFlowService.js.map
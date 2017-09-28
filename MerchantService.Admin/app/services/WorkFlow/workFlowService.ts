// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
    interface IworkFlowService {
        getAllRolePermissionlist: () => void;
        getAllWorkFlowName: () => void;
        checkPermissionRole: (permissionId) => void;
        //addWorkFlowDetails: (permissionId,roleId) => void;
        addWorkFlowDetails: (permissionId) => void;
        saveWorkFlowDetails: (workFlowDetails: Model.WorkFlow) => void;
        getAllWorkFlowAcionList: (permissionId) => void;
       // getChildPermission: (activityId) => void;
        getWorkFlowDetailsForTreeViewByActivityId: (activityId) => void;
        editWorkFlowInformationById: (workFlowId) => void;
        editWorkFlowPermission: (permissionId) => void;
        getAllActivityList: () => void;
        getWorkFlowDetailTreeViewByActivityId: (activityId) => void;
        deleteWorkFlowInformation: (workFlowActionId) => void;
        getAttributeListByActivityId: (activityId) => void;
        deleteConditionalOperator: (conditionalOperatorId) => void;
        workFLowNameAlreadyExistOrNot: (workFLowDetails) => void;
        getAllWorkFlowNameList: () => void;
     getAllBoolenOperatorListByActivityId:(activityId) => void;
    }
    
    class workFlowService implements IworkFlowService {
  
        public getRolePermission;
        public getWorkFlowName;
        public chekRole;
        public addWorkFlow;
        public saveWorkFlow;
        public getAllWorkFlow;
        public getWorkFlowAction;
        public treeView;
        public getWorkFlowInfo;
        public editWorkFlow;
        public getAllActivity;
        public treeViewCollection;
        public deleteInformation;
        public getvariableList;
        public deleteCondtion;
        public checkWorkFlowName;
        public workflowList;
        public getBoolenList;

        constructor(private $resource: ng.resource.IResourceService, private $log: ng.ILogService) {

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

        getAllRolePermissionlist() {
            return this.getRolePermission.query().$promise;
        }

        getAllWorkFlowName() {
            return this.getWorkFlowName.query().$promise;
        }

        checkPermissionRole(permissionId) {
            return this.chekRole.query({ permissionId: permissionId}).$promise;
        }

        //addWorkFlowDetails(permissionId,roleId) {
        //    return this.addWorkFlow.query({permissionId : permissionId, roleId : roleId}).$promise;
        //}

        //getChildPermission(activityId) {
        //    return this.getPermission.query({ activityId: activityId }).$promise;
        //}
        addWorkFlowDetails(permissionId) {
            return this.addWorkFlow.query({ permissionId: permissionId}).$promise;
        }

        editWorkFlowPermission(permissionId) {
            return this.editWorkFlow.query({ permissionId: permissionId }).$promise;
        }

        saveWorkFlowDetails(workFlowDetails) {
            return this.saveWorkFlow.save(workFlowDetails).$promise;
        }

        deleteWorkFlowInformation(workFlowActionId) {
            return this.deleteInformation.get({ workFlowActionId: workFlowActionId}).$promise;
        }

        getAllWorkFlowList() {
            return this.getAllWorkFlow.query().$promise;
        }

        getAllWorkFlowAcionList(permissionId) {
            return this.getWorkFlowAction.query({ permissionId: permissionId}).$promise;
        }

        getWorkFlowDetailsForTreeViewByActivityId(activityId) {
            return this.treeView.query({activityId:activityId }).$promise;
        }

        editWorkFlowInformationById(workFlowId) {
            return this.getWorkFlowInfo.get({workFlowId : workFlowId}).$promise;
        }

        getAllActivityList() {
            return this.getAllActivity.query().$promise;
        }

        getWorkFlowDetailTreeViewByActivityId(activityId) {
            return this.treeViewCollection.query({ activityId: activityId }).$promise;
        }

        getAttributeListByActivityId(activityId) {
            return this.getvariableList.query({ activityId: activityId }).$promise;
        }
        getAllBoolenOperatorListByActivityId(activityId) {
            return this.getBoolenList.query({ activityId: activityId }).$promise;
        }
        deleteConditionalOperator(conditionalOperatorId) {
            return this.deleteCondtion.get({ conditionalOperatorId :conditionalOperatorId}).$promise;
        }

        workFLowNameAlreadyExistOrNot(workFlowDetails) {
            return this.checkWorkFlowName.save(workFlowDetails).$promise;
        }

        getAllWorkFlowNameList() {
            return this.workflowList.query().$promise;
        }
    }

app.service("workFlowService", ['$resource','$log', ($resource,$log) => {
    return new workFlowService($resource,$log);
}]);

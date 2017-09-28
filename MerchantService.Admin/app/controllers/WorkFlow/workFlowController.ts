// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
interface IworkFlowControllerScope extends ng.IScope {
    addWorkFlowAction: Function;
    workFlowCollection: any;
    removeWorkFlowAction: Function;
    getAllRolePermissionlist: Function;
    roleCollection: any;
    errorMessage: string;
    rolepermissionErrorErrorMessageDisplay: boolean;
    addWorkFlow: Function;
    isAddWorkFlow: boolean;
    cancelWorkFlow: Function;
    workFlowNameCollection: any;
    checkPermissionRole: Function;
    roleChangeEvent: Function;
    isModuleName: boolean;
    workFlowDetails: any;
    saveWorkFlowDetails: Function;
    statusCollection: any;
    permissionCollection: any;
    roleList: any;
    isWorkFlowPanelDisabled: boolean;
    isWorkFlowPanelDisplay: boolean;
    checkConditon: Function;
    workFlowConditionDetails: any;
    isDisplayCondiotionPanel: boolean;
    changNewStatus: Function;
    isWorkFLowButtonEnable: boolean;
    isWorkFlowAdded: boolean;
    getAllWorkFlowList: Function;
    workFlowDetailsCollection: any;
    getChildActivityList: Function;
    errorMessageDisplayForBlankWorkFlowList: boolean;
    addNewWorkFlow: Function;
    stepList: any;
    treeworkflowList: any;
    isGroup: any;
    data: any;
    workFlowActionCollection: any;
    workFlowCondition: any;
    workFlowPanelActionPanel1: boolean;
    workFlowPanelActionPanel2: boolean;
    workFlowPanelRole: any;
    isExpand: boolean;
    isWorkFlowPanelView: boolean;
    removeWorkFlowPanel1: Function;
    removeWorkFlowPanel2: Function;
    isSubmitButtonEnable: boolean;
    editWorkFlowInformationById: Function;
    editWorkFlowInformation: Function;
    getChildWorkFlow: Function;
    showDetails: boolean;
}

interface IworkFlowController {

}

class workFlowController implements IworkFlowController {
    static controllerId = "workFlowController";

    constructor(private $scope: IworkFlowControllerScope, public $rootScope, private $log: ng.ILogService, private workFlowService: workFlowService, private apiPath, private statusService: statusService, private rolePermissionService: RolePermissionService, private $location: ng.ILocationService) {
        this.$scope.addWorkFlowAction = (workFlowDetails: Model.WorkFlow) => this.addWorkFlowAction(workFlowDetails);
        this.$scope.removeWorkFlowAction = (index: any) => this.removeWorkFlowAction(index);
        this.$scope.workFlowCollection = [];
        this.$scope.errorMessage = "";
        this.$scope.rolepermissionErrorErrorMessageDisplay = false;
        //  this.$scope.getAllRolePermissionlist = () => this.getAllRolePermissionlist();
        this.$scope.addWorkFlow = (workFlowDetails: Model.WorkFlow) => this.addWorkFlow(workFlowDetails);
        this.$scope.isAddWorkFlow = false;
        this.$scope.cancelWorkFlow = () => this.cancelWorkFlow();
        this.$scope.workFlowNameCollection = [];
        this.$scope.checkPermissionRole = (permissionId: number) => this.checkPermissionRole(permissionId);
        this.$scope.roleChangeEvent = () => this.roleChangeEvent();

        this.$scope.workFlowDetails = new Model.WorkFlow();
        //workFlowCondition, workFlowConditionDetails
        this.$scope.saveWorkFlowDetails = (workFlowDetails: Model.WorkFlow, workFlowCondition: any, workFlowConditionDetails: any) => this.saveWorkFlowDetails(workFlowDetails, workFlowCondition, workFlowConditionDetails);
        this.$scope.statusCollection = [];
        this.$scope.permissionCollection = [];
        this.$scope.roleList = [];
        this.$scope.isWorkFlowPanelDisabled = true;
        this.$scope.isWorkFlowPanelDisplay = false;
        this.$scope.isModuleName = false;
        this.$scope.checkConditon = (workFLowDetails: Model.WorkFlow) => this.checkConditon(workFLowDetails);
        this.$scope.workFlowConditionDetails = new Model.WorkFlow();
        this.$scope.isDisplayCondiotionPanel = false;
        this.$scope.changNewStatus = () => this.changNewStatus();
        this.$scope.isWorkFLowButtonEnable = false;
        this.$scope.isWorkFlowAdded = false;
        this.$scope.getAllWorkFlowList = () => this.getAllWorkFlowList();
        this.$scope.workFlowDetailsCollection = [];
        this.$scope.getChildActivityList = (workFlowId: number) => this.getChildActivityList(workFlowId);
        this.$scope.errorMessageDisplayForBlankWorkFlowList = false;
        this.$scope.addNewWorkFlow = () => this.addNewWorkFlow();
        this.$scope.workFlowActionCollection = [];
        this.$scope.isExpand = false;
        this.$scope.workFlowPanelActionPanel1 = false;
        this.$scope.workFlowPanelActionPanel2 = false;
        this.$scope.isSubmitButtonEnable = false;
        this.$scope.showDetails = true;
        this.initialization();
        this.$rootScope.treeworkflowList = [];
        this.$scope.workFlowCondition = new Model.WorkFlow();
        this.$scope.editWorkFlowInformationById = (childInfo: any) => this.editWorkFlowInformationById(childInfo);
        this.$scope.editWorkFlowInformation = (childInfo: any) => this.editWorkFlowInformation(childInfo);
        //this.$scope.stepList = {
        //    ActivityName: "Action",
        //    children: [{
        //        ActivityName: "Approve",
        //        children: []
        //    }, {
        //            name: "Reject",
        //            children: [{
        //                name: "Do action1",
        //                children: []
        //            }, {
        //                    name: "Do action2",
        //                    children: []
        //                }]
        //        }]
        //};
        //this.$scope.data = {
        //    "Part 1": {
        //        "Group 1": {},
        //        "Group 2": {
        //            "Link 3": "href3"
        //        }
        //    },
        //    "Part 2": {
        //        "Group 12": {},
        //        "Group 22": {
        //            "Link 3": "href3"
        //        }
        //    }
        //};
        this.$scope.isWorkFlowPanelView= false;
        this.$scope.isGroup = function (item) {
            return item.indexOf('Group') == 0;
        };

        //removeWorkFlowPanel1: Function;
        //removeWorkFlowPanel2: Function;

        this.$scope.removeWorkFlowPanel1 = () => this.removeWorkFlowPanel1();
        this.$scope.removeWorkFlowPanel2 = () => this.removeWorkFlowPanel2();
        this.$scope.getChildWorkFlow = (workFlowActivityId : number) => this.getChildWorkFlow(workFlowActivityId);
    }

    private editWorkFlowInformation(childInfo) {

        this.$location.path("/EditWorkFlow/" + childInfo.WorkFlowId);
        // childInfo.WorkFlowId;
         
    }
    private removeWorkFlowPanel1() {
        var controllerScope = this.$scope;
        controllerScope.workFlowPanelActionPanel1 = false;
        if (!controllerScope.workFlowPanelActionPanel2){
            controllerScope.isSubmitButtonEnable = false;
        }

    }

    private removeWorkFlowPanel2() {
        var controllerScope = this.$scope;
        controllerScope.workFlowPanelActionPanel2 = false;
        if (!controllerScope.workFlowPanelActionPanel1) {
            controllerScope.isSubmitButtonEnable = false;
        }
    }

    private initialization() {
        this.getAllWorkFlowName();
        this.getallStatus();
        this.getAllRoleList();
    }
    private addWorkFlowAction(workFlowDetails) {

        var controllerScope = this.$scope;
        //var promise = this.workFlowService.getChildPermission(workFlowDetails.ActivityId);
        //promise.then((result) => {

        //});

        if (!controllerScope.isWorkFlowAdded) {
            controllerScope.isWorkFlowAdded = true;
            if (controllerScope.isDisplayCondiotionPanel) {
                controllerScope.workFlowCollection.push(workFlowDetails);
                controllerScope.workFlowCollection.push(controllerScope.workFlowConditionDetails.Permission);
                controllerScope.workFlowDetails.Permission = new Model.WorkFlow();
                controllerScope.workFlowConditionDetails.Permission = new Model.WorkFlow();
                controllerScope.isDisplayCondiotionPanel = false;
                this.$rootScope.treeworkflowList.push(workFlowDetails);
            }
            else {
                controllerScope.workFlowCollection.push(workFlowDetails);
                this.$rootScope.treeworkflowList.push(workFlowDetails);
                controllerScope.workFlowDetails.Permission = new Model.WorkFlow();
            }
            controllerScope.isWorkFlowAdded = false;
        }
    }

    private removeWorkFlowAction(index) {
        var controllerScope = this.$scope;
        controllerScope.workFlowCollection.splice(index, 1);
    }

    //private getAllRolePermissionlist() {
    //    var controllerScope = this.$scope;
    //    var controllerRootScope = this.$rootScope;
    //    controllerRootScope.isLoading = true;
    //    controllerScope.roleCollection = [];
    //    var rolelist = controllerScope.roleCollection;
    //    var promise = this.workFlowService.getAllRolePermissionlist();
    //    promise.then((result) => {
    //        this.$log.log("get all role permissions successfully.");
    //        if (result.length == 0) {
    //            controllerScope.errorMessage = stringConstants.errorMessage;
    //            controllerScope.rolepermissionErrorErrorMessageDisplay = true;
    //            controllerRootScope.isLoading = false;
    //        }
    //        else {
    //            for (var i = 0; i < result.length; i++) {
    //                rolelist.push(result[i]);
    //            }
    //            this.getAllWorkFlowName();
    //            controllerRootScope.isLoading = false;
    //        }
    //    }).catch((error) => {
    //        this.$log.log(error);
    //        if (error.status == 500) {
    //            //it shown "no record found" error messsage.
    //            controllerScope.errorMessage = stringConstants.errorMessage;
    //            controllerScope.rolepermissionErrorErrorMessageDisplay = true;
    //            controllerRootScope.isLoading = false;
    //        }
    //        else {
    //            //if user is not authenticated that time it will redirect to the login page.
    //            location.replace(this.apiPath);
    //        }
    //    });
    //}

    private getAllWorkFlowName() {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.workFlowNameCollection = [];
        var nameCollection = controllerScope.workFlowNameCollection;

        var promise = this.workFlowService.getAllWorkFlowName();
        promise.then((result) => {
            for (var i = 0; i < result.length; i++) {
                nameCollection.push(result[i]);
            }
            controllerScope.isAddWorkFlow = false;
            controllerRootScope.isLoading = false;



        }).catch((error) => {
            this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }


    private addWorkFlow(workFlowDetails) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.permissionCollection = [];
        var permissionCollection = controllerScope.permissionCollection;
        //var promise = this.workFlowService.addWorkFlowDetails(workFlowDetails.PermissionId,workFlowDetails.RoleId);
        var promise = this.workFlowService.addWorkFlowDetails(workFlowDetails.PermissionId);
        promise.then((result) => {
            controllerScope.isWorkFlowPanelDisplay = true;
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.isAddWorkFlow = true;
                controllerRootScope.isLoading = false;
                controllerScope.isModuleName = false;
                controllerScope.isExpand = true;
                this.getWorkFlowDetailsForTreeViewByActivityId(workFlowDetails.PermissionId);
              //  controllerScope.isWorkFlowPanelView = false;
            }
            else {
              
                for (var i = 0; i < result.length; i++) {
                    permissionCollection.push(result[i]);
                }
                //controllerScope.isWorkFlowPanelView = true;
                //this.checkPermissionRole(workFlowDetails.PermissionId);
                this.$log.log("add work Flow successfullty", result);
                    var promise = this.workFlowService.getAllWorkFlowAcionList(workFlowDetails.PermissionId);
                    promise.then((result) => {
                        controllerScope.workFlowActionCollection = [];
                        for (var i = 0; i < result.length; i++) {
                            controllerScope.workFlowActionCollection.push(result[i]);
                            this.$log.log('get all work flow action successfully');
                         
                        }
                        this.getWorkFlowDetailsForTreeViewByActivityId(workFlowDetails.PermissionId); 
              
                controllerScope.workFlowCollection = [];
                //controllerRootScope.isLoading = false;
                controllerScope.isModuleName = true;
                controllerScope.isAddWorkFlow = false;
            });
                   
            }

        });

    }

    private cancelWorkFlow() {
        var controllerScope = this.$scope;
        controllerScope.isAddWorkFlow = true;
        controllerScope.isModuleName = false;
        controllerScope.isWorkFlowPanelDisplay = false;
        controllerScope.workFlowDetails = new Model.WorkFlow();
        controllerScope.workFlowConditionDetails = new Model.WorkFlow();
        controllerScope.isWorkFLowButtonEnable = false;
        controllerScope.workFlowCondition = new Model.WorkFlow();
        controllerScope.isSubmitButtonEnable = false;
       // controllerScope.workFlowPanelActionPanel1 = false;
       // controllerScope.workFlowPanelActionPanel2 = false;
    }

    private checkPermissionRole(permissionId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.roleCollection = [];
        var rolelist = controllerScope.roleCollection;
        var promise = this.workFlowService.checkPermissionRole(permissionId);
        promise.then((result) => {
            this.$log.log("Get All Role And Permission Successfully.");
            for (var i = 0; i < result.length; i++) {
                rolelist.push(result[i]);

            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.isAddWorkFlow = false;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private roleChangeEvent() {
        var controllerScope = this.$scope;

    }

    private saveWorkFlowDetails(workFlowDetails, workFlowCondition, workFlowConditionDetails) {
        var controllerScope = this.$scope;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var permissionDetails = [];
        permissionDetails.push(workFlowDetails.Permission);
        if (controllerScope.workFlowPanelActionPanel2) {
            permissionDetails.push(workFlowCondition.Permission);
        }
        if (controllerScope.workFlowPanelActionPanel1) {
            permissionDetails.push(workFlowConditionDetails.Permission);
        }
      
      
        var workFlowAction = new Model.WorkFlow();
        workFlowAction.PermissionId = workFlowDetails.PermissionId;
        workFlowAction.ActivityId = workFlowDetails.Permission.ActivityId;
        workFlowAction.Permission = permissionDetails;
        workFlowAction.workFlowActionId = workFlowDetails.workFlowActionId;
        var promise = this.workFlowService.saveWorkFlowDetails(workFlowAction);
        promise.then((result) => {

            this.$log.log("workFlow save succesfully", result);
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowDetails.Permission =[] ;
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            this.getWorkFlowDetailsForTreeViewByActivityId(result.PermissionId);
           // controllerRootScope.isLoading = false;
            controllerScope.workFlowPanelActionPanel1 = false;
            controllerScope.workFlowPanelActionPanel2 = false;
            controllerScope.isSubmitButtonEnable = false;
            //this.$location.path("/WorkFlowList");
        });
        this.$log.log(workFlowDetails);
    }

    private getWorkFlowDetailsForTreeViewByActivityId(activityId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.stepList = [];
        var promise = this.workFlowService.getWorkFlowDetailsForTreeViewByActivityId(activityId);
        promise.then((result) => {
            this.$log.log("tree View", result);
            //this.getWorkFlowDetailsForTreeViewByActivityId(result.ActivityId);
            //this.$location.path("/WorkFlowList");
            

            for (var i = 0; i < result.length; i++) {
                controllerScope.stepList.push(result[i]);

            }
            controllerScope.isExpand = true;
            controllerRootScope.isLoading = false;
        });
    }
    private getallStatus() {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.statusCollection = [];
        var statusCollection = controllerScope.statusCollection;
        var promise = this.statusService.getallStatus();
        promise.then((result) => {
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                // controllerScope.statusErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    statusCollection.push(result[i]);
                }

            }
        }).catch((error) => {
            this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                //controllerScope.statusErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });;
    }

    private getAllRoleList() {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.roleList = [];
        var roleCollection = controllerScope.roleList;
        var promise = this.rolePermissionService.getAllRoleList();
        promise.then((result) => {
            this.$log.log("get all role list successfully.");
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
                // controllerScope.isAddRoleAndPermissionButtonDisabled = true;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    roleCollection.push(result[i]);
                }
            }
        }).catch((error) => {
            this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private checkConditon(workFlowDetails) {
        var controllerScope = this.$scope;

        if (workFlowDetails.IsConditionChecked) {
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.isWorkFLowButtonEnable = true;
            var conditionDetails = [];
            var workFlowCondition = [];
            conditionDetails.push({ ActivityId: workFlowDetails.ActivityId, OldStatus: workFlowDetails.NewStatus, RoleFromId: workFlowDetails.RoleToId, IsApprovePanel : true});
            workFlowCondition.push({ ActivityId: workFlowDetails.ActivityId, OldStatus: workFlowDetails.NewStatus, RoleFromId: workFlowDetails.RoleToId, IsRejectPanel : true});
            controllerScope.workFlowPanelActionPanel1 = true;
            controllerScope.workFlowPanelActionPanel2 = true;
            controllerScope.isSubmitButtonEnable = true;
            controllerScope.workFlowConditionDetails.Permission = conditionDetails[0];
            controllerScope.workFlowCondition.Permission = workFlowCondition[0];
            //controllerScope.workFlowConditionDetails.Permission.push(workFlowDetails.RoleToId);
            controllerScope.isDisplayCondiotionPanel = true;
        } else {
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowPanelActionPanel1 = false;
            controllerScope.workFlowPanelActionPanel2 = false;
            controllerScope.isSubmitButtonEnable = false;
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
        }

        this.$log.log("check condition", workFlowDetails);
    }

    private changNewStatus() {
        var controllerScope = this.$scope;
        controllerScope.isWorkFLowButtonEnable = false;
    }

    private getAllWorkFlowList() {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.workFlowDetailsCollection = [];
        var workFlowDetailsCollection = controllerScope.workFlowDetailsCollection;
        var promise = this.workFlowService.getAllWorkFlowList();
        promise.then((result) => {
            this.$log.log("get workFlow list successfully.");
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.errorMessageDisplayForBlankWorkFlowList = true;
                controllerRootScope.isLoading = false;
                //controllerScope.permissionErrorErrorMessageDisplay = true;
                // controllerScope.isAddRoleAndPermissionButtonDisabled = true;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    workFlowDetailsCollection.push(result[i]);
                }
             
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.errorMessageDisplayForBlankWorkFlowList = true;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            controllerRootScope.isLoading();
        });
    }

    private getChildActivityList(workFlowId) {
        var controllerScope = this.$scope;
        this.getWorkFlowDetailTreeViewByActivityId(workFlowId);
        for (var i = 0; i < controllerScope.workFlowDetailsCollection.length; i++) {
            if (controllerScope.workFlowDetailsCollection[i].WorkFlowId == workFlowId) {
                if (controllerScope.workFlowDetailsCollection[i].HasChildActivity) {
                    controllerScope.workFlowDetailsCollection[i].HasChildActivity = false;
                } else {
                    controllerScope.workFlowDetailsCollection[i].HasChildActivity = true;
                }
            }
            else {
                controllerScope.workFlowDetailsCollection[i].HasChildActivity = false;
            }
        }
    }

    private getWorkFlowDetailTreeViewByActivityId(activityId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.stepList = [];
        var promise = this.workFlowService.getWorkFlowDetailTreeViewByActivityId(activityId);
        promise.then((result) => {
            this.$log.log("tree View", result);
            //this.getWorkFlowDetailsForTreeViewByActivityId(result.ActivityId);
            //this.$location.path("/WorkFlowList");
            

            for (var i = 0; i < result.length; i++) {
                controllerScope.stepList.push(result[i]);

            }
            controllerScope.isExpand = true;
            controllerRootScope.isLoading = false;
        });
    }

    private addNewWorkFlow() {
        this.$location.path("/AddWorkFlow");
    }

    private editWorkFlowInformationById(childInfo) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

       // childInfo.WorkFlowId;
        var promise = this.workFlowService.editWorkFlowInformationById(childInfo.WorkFlowId);
        promise.then((result) => {
            this.$log.log("get workflow details successfully", result);
           
            //controllerScope.workFlowDetails.workFlowActionId = childInfo.WorkFlowId;
            //result.Permission.length
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.workFlowDetails = new Model.WorkFlow();
            for (var j = 0; j < result.Permission.length; j++) {
              
                controllerScope.isWorkFLowButtonEnable = true;         
              
               // controllerScope.isSubmitButtonEnable = true;
                controllerScope.isExpand = false;
                controllerScope.showDetails = false;
                //controllerScope.workFlowConditionDetails.Permission.push(workFlowDetails.RoleToId);
                controllerScope.workFlowDetails.ActivityId = result.ActivityId;
                controllerScope.workFlowDetails.PermissionId = result.PermissionId;
                controllerScope.isSubmitButtonEnable = result.Permission[j].IsChild;
                //this.$scope.$apply();
                if (result.Permission[j].IsApprovePanel) {
                    controllerScope.workFlowConditionDetails.Permission = result.Permission[j];
                    controllerScope.workFlowPanelActionPanel1 = true;
                }
                else if (result.Permission[j].IsRejectPanel) {
                    controllerScope.workFlowPanelActionPanel2 = true;
                   // controllerScope.workFlowDetails.workFlowActionId
                    controllerScope.workFlowCondition.Permission = result.Permission[j];
                }
                else {
                    controllerScope.workFlowDetails.Permission = result.Permission[j];
                  
                   
                }
            }
         
          //  controllerScope.workFlowDetails = new Model.workFlow();
            controllerScope.workFlowDetails.workFlowActionId = childInfo.WorkFlowId;
         
          
           // controllerScope.workFlowDetails.Permission = result.Permission[j];
            controllerScope.permissionCollection = [];
            var permissionCollection = controllerScope.permissionCollection;
         
            var promise = this.workFlowService.editWorkFlowPermission(controllerScope.workFlowDetails.PermissionId);
            promise.then((activityResult) => {
                controllerScope.isWorkFlowPanelDisplay = true;
                if (activityResult.length == 0) {
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    controllerScope.isAddWorkFlow = true;
                    controllerRootScope.isLoading = false;
                    controllerScope.isModuleName = false;
                    controllerScope.isExpand = true;
                    controllerScope.showDetails = false;
                    //this.getWorkFlowDetailsForTreeViewByActivityId(controllerScope.workFlowDetails.PermissionId);
                    //  controllerScope.isWorkFlowPanelView = false;
                }
                else {

                    for (var i = 0; i < activityResult.length; i++) {
                        permissionCollection.push(activityResult[i]);
                    }
                    //controllerScope.isWorkFlowPanelView = true;
                    //this.checkPermissionRole(workFlowDetails.PermissionId);
                    this.$log.log("add work Flow successfullty", activityResult);
                    var promise = this.workFlowService.getAllWorkFlowAcionList(controllerScope.workFlowDetails.PermissionId);
                    promise.then((workFlowActionresult) => {
                        controllerScope.workFlowActionCollection = [];
                        for (var i = 0; i < workFlowActionresult.length; i++) {
                            controllerScope.workFlowActionCollection.push(workFlowActionresult[i]);
                            this.$log.log('get all work flow action successfully');

                        }
                      //  this.getWorkFlowDetailsForTreeViewByActivityId(controllerScope.workFlowDetails.PermissionId);

                       
                    });

                }

            });
            
            controllerRootScope.isLoading = false;
        });
    }

    private editInformationById(permisssionId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        // childInfo.WorkFlowId;
        var promise = this.workFlowService.editWorkFlowInformationById(permisssionId);
        promise.then((result) => {
            this.$log.log("get workflow details successfully", result);
           
            //controllerScope.workFlowDetails.workFlowActionId = childInfo.WorkFlowId;
            //result.Permission.length
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.workFlowDetails = new Model.WorkFlow();
            for (var j = 0; j < result.Permission.length; j++) {

                controllerScope.isWorkFLowButtonEnable = true;         
              
                // controllerScope.isSubmitButtonEnable = true;
                controllerScope.isExpand = false;
                //controllerScope.workFlowConditionDetails.Permission.push(workFlowDetails.RoleToId);
                controllerScope.workFlowDetails.ActivityId = result.ActivityId;
                controllerScope.workFlowDetails.PermissionId = result.PermissionId;
                controllerScope.isSubmitButtonEnable = result.Permission[j].IsChild;
                //this.$scope.$apply();
                if (result.Permission[j].IsApproval) {
                    controllerScope.workFlowConditionDetails.Permission = result.Permission[j];
                    controllerScope.workFlowPanelActionPanel1 = true;
                }
                else if (result.Permission[j].IsReview) {
                    controllerScope.workFlowPanelActionPanel2 = true;
                    // controllerScope.workFlowDetails.workFlowActionId
                    controllerScope.workFlowCondition.Permission = result.Permission[j];
                }
                else {
                    controllerScope.workFlowDetails.Permission = result.Permission[j];


                }
            }
         
            //  controllerScope.workFlowDetails = new Model.workFlow();
            controllerScope.workFlowDetails.workFlowActionId = permisssionId;
         
          
            // controllerScope.workFlowDetails.Permission = result.Permission[j];
            controllerScope.permissionCollection = [];
            var permissionCollection = controllerScope.permissionCollection;

            var promise = this.workFlowService.editWorkFlowPermission(controllerScope.workFlowDetails.PermissionId);
            promise.then((activityResult) => {
                controllerScope.isWorkFlowPanelDisplay = true;
                if (activityResult.length == 0) {
                    controllerScope.errorMessage = stringConstants.errorMessage;
                    //  controllerScope.isAddWorkFlow = true;
                    controllerRootScope.isLoading = false;
                    controllerScope.isModuleName = false;
                    controllerScope.isExpand = true;
                    //this.getWorkFlowDetailsForTreeViewByActivityId(controllerScope.workFlowDetails.PermissionId);
                    //  controllerScope.isWorkFlowPanelView = false;
                }
                else {

                    for (var i = 0; i < activityResult.length; i++) {
                        permissionCollection.push(activityResult[i]);
                    }
                    //controllerScope.isWorkFlowPanelView = true;
                    //this.checkPermissionRole(workFlowDetails.PermissionId);
                    this.$log.log("add work Flow successfullty", activityResult);
                    var promise = this.workFlowService.getAllWorkFlowAcionList(controllerScope.workFlowDetails.PermissionId);
                    promise.then((workFlowActionresult) => {
                        controllerScope.workFlowActionCollection = [];
                        for (var i = 0; i < workFlowActionresult.length; i++) {
                            controllerScope.workFlowActionCollection.push(workFlowActionresult[i]);
                            this.$log.log('get all work flow action successfully');

                        }
                        //  this.getWorkFlowDetailsForTreeViewByActivityId(controllerScope.workFlowDetails.PermissionId);

                       
                    });

                }

            });

            controllerRootScope.isLoading = false;
        });
    }

    private  getChildWorkFlow(workFlowActivityId) {
        var controllerScope = this.$scope;
      //  this.getWorkFlowDetailsForTreeViewByActivityId(workFlowId);
        for (var i = 0; i < controllerScope.stepList.length; i++) {
            if (controllerScope.stepList[i].WorkFlowId == workFlowActivityId) {
                if (controllerScope.stepList[i].IsCollapseActive) {
                    controllerScope.stepList[i].IsCollapseActive = false;
                } else {
                    controllerScope.stepList[i].IsCollapseActive = true;
                }
            }
            else {
                controllerScope.stepList[i].IsCollapseActive = false;
            }
        }
    }
}

app.controller(workFlowController.controllerId, ['$scope', '$rootScope', '$log', 'workFlowService', 'apiPath', 'statusService', 'RolePermissionService', '$location', ($scope, $rootScope, $log, workFlowService, apiPath, statusService, rolePermissionService, $location) => {
    return new workFlowController($scope, $rootScope, $log, workFlowService, apiPath, statusService, rolePermissionService, $location);
}]);

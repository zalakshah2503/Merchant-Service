// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

interface IdynamicWorkFlowControllerScope extends ng.IScope {
    workFlowNameCollection: any;
    errorMessage: string;
    rolepermissionErrorErrorMessageDisplay: boolean;
    permissionCollection: any;
    isWorkFlowPanelDisplay: boolean;
    isModuleName: boolean;
    isExpand: boolean;
    workFlowActionCollection: any;
    roleList: any;
    workFlowDetails: any;
    workFlowConditionDetails: any;
    addWorkFlow: Function;
    checkPermissionRole: Function;
    permissionRoleCollection: any;
    getAllActivityList: Function;
    activityCollection: any;
    checkApprovalConditon: Function;
    workFlowCondition: Model.WorkFlow;
    workFlowPanelActionPanel: boolean;
    isSubmitButtonEnable: boolean;
    isDisplayCondiotionPanel: boolean;
    isWorkFLowButtonEnable: boolean;
    checkReviewCondition: Function;
    saveWorkFlowDetails: Function;
    editWorkFlowInformation: Function;
    cancelWorkFlow: Function;
    isEditWorkFlow: boolean;
    onAcceptPermissionChangeEvent: Function;
    onRejectPermissionChangeEvent: Function;
    onReviewPermissionChangeEvent: Function;
    isAcceptRoleDisabled: boolean;
    isRejectRoleDisabled: boolean;
    isReviewRoleDisabled: boolean;
    stepList: any;
    getChildWorkFlow: Function;
    checkActivityCloseOrNot: Function;
    isSubmitButtonEnabled: boolean;
    editWorkFlowInformationById: Function;
    openWarningDialogBox: Function;
    closeWarningDialogBox: Function;
    isCheckedApproval: boolean;
    deleteWorkFlowInformation: Function;
    isEditInformation: boolean;
    approvalDeleteInformation: any;
    reviewDeleteInformation: any;
    showDetails: boolean;
    reviewCollectionDetails: any;
    isReviewEnabled: boolean;
    isApproveEnabled: boolean;
    isWorkFlowPanelView: boolean;
    isDeleteButtonVisible: boolean;
    closeDeleteWorkFlowDialogDialogBox: Function;
    openDeleteWorkFlowDialogbox: Function;
    isCheckBoxVisible: boolean;
    changeUserRole: Function;
    isAssignedRoleDisabled: boolean;
    operatorList: any;
    isCoditionalOperator: boolean;
    changeActivityName: Function;
    isInitiatorRoleDisabled: boolean;
    attributeCollection: any;
    changeAssignedUserRoleName: Function;
    isNextActivityDisabled: boolean;
    onTruePermissionChangeEvent: Function;
    onFalsePermissionChangeEvent: Function;
    changeAttributeValue: Function;
    isDisabledVariableValue: boolean;
    otherAttributeCollection: any;
    checkConditionalOperator: Function;
    customActivityCollection: any;
    isShowCoditionalCheckBox: boolean;
    clearInformation: Function;
    conditionalOperatorCollection: any;
    addConditionalOperator: Function;
    removeConditionalOperator: Function;
    changeAttribute: Function;
    isDisabledAddConditionalButton: boolean;
    isShowConditionalOperatorCollection: boolean;
    operatorCollection: any;
    isConditionOptioShow: boolean;
    isConditonalOperatorDisadbled: boolean;
    changeConditionValue: Function;
    isOperatorPanelVisible: boolean;
    isAllowAddCondtion: boolean;
    checkWorkFlowNameAlreadyExistOrNot: Function;
    isWorkFlowNameExist: boolean;
    isWorkFlowTypeDisabled: boolean;
    workFlowCollection: any;
    isAcceptCondtionAllowOtherWorkFlow: boolean;
    isRejectCondtionAllowOtherWorkFlow: boolean;
    isReviewCondtionAllowOtherWorkFlow: boolean;
    isTrueCondtionAllowOtherWorkFlow: boolean;
    isFalseCondtionAllowOtherWorkFlow: boolean;
    changeWorkFlowName: Function;
    onAcceptChangeWorkFlowName: Function;
    onRejectChangeWorkFlowName: Function;
    onReviewChangeWorkFlowName: Function;
    onTrueChangeWorkFlowName: Function;
    onFalseChangeWorkFlowName: Function;
    assignedRoleCollection: any;
    isInitiateActivityEnabled: boolean;
    isShowConditionalOperator: boolean;
    customConditionalOperator: any;
    changeConditionalOperator: Function;
    isBoolenCondtion: boolean;
    myValue: boolean;
    getAllBoolenOperatorListByActivityId: Function;
    boolenConditionCollection: any;
    isAllowBoolenCondition: boolean;
    boolenAttributeCollection: any;
    otherBoolenAttributeCollection: any;
    isAllowOtherWorkFlowCondition: boolean;
    otherWorkFlowActivityCollection: any;
    isWorkFlowNameDisabled: boolean;
    customCollection: any;
    isParentAction: boolean;
    isAllowOtherBranchUser: boolean;
}

interface IdynamicWorkFlowController {

}

class dynamicWorkFlowController implements IdynamicWorkFlowController {
    static controllerId = "dynamicWorkFlowController";
    public warningDialogModel;
    public deleteWorkFLowModel;
    constructor(private $scope: IdynamicWorkFlowControllerScope, public $rootScope, private $log: ng.ILogService, private workFlowService: workFlowService, private apiPath, private statusService: statusService, private rolePermissionService: RolePermissionService, private $location: ng.ILocationService, public $routeParams, public $modal, public $route) {
        // this.$scope.addWorkFlowAction = (workFlowDetails: Model.workFlow) => this.addWorkFlowAction(workFlowDetails);
        //this.$scope.removeWorkFlowAction = (index: any) => this.removeWorkFlowAction(index);
        //this.$scope.workFlowCollection = [];
        this.$scope.errorMessage = "";
        this.$scope.rolepermissionErrorErrorMessageDisplay = false;
        //  this.$scope.getAllRolePermissionlist = () => this.getAllRolePermissionlist();
        this.$scope.addWorkFlow = (workFlowDetails: Model.WorkFlow) => this.addWorkFlow(workFlowDetails);
        this.$scope.cancelWorkFlow = () => this.cancelWorkFlow();
        this.$scope.workFlowNameCollection = [];
        this.$scope.checkPermissionRole = (permissionId: number) => this.checkPermissionRole(permissionId);
        //   this.$scope.roleChangeEvent = () => this.roleChangeEvent();

        this.$scope.workFlowDetails = new Model.WorkFlow();
        this.$scope.saveWorkFlowDetails = (workFlowDetails: Model.WorkFlow, workFlowCondition: any, workFlowConditionDetails: any, reviewCollectionDetails: any, conditionalOperatorCollection: any) => this.saveWorkFlowDetails(workFlowDetails, workFlowCondition, workFlowConditionDetails, reviewCollectionDetails, conditionalOperatorCollection);

        this.$scope.permissionCollection = [];
        this.$scope.roleList = [];
        this.$scope.isWorkFlowPanelDisplay = false;
        this.$scope.isModuleName = false;
        this.$scope.checkApprovalConditon = (workFLowDetails: Model.WorkFlow) => this.checkApprovalConditon(workFLowDetails);
        this.$scope.checkReviewCondition = (workFLowDetails: Model.WorkFlow) => this.checkReviewCondition(workFLowDetails);
        this.$scope.workFlowConditionDetails = new Model.WorkFlow();
        this.$scope.workFlowActionCollection = [];
        this.$scope.isExpand = false;
        this.$scope.workFlowPanelActionPanel = false;

        this.$rootScope.treeworkflowList = [];
        this.$scope.activityCollection = [];
        this.$scope.workFlowCondition = new Model.WorkFlow();
        this.$scope.editWorkFlowInformation = (childInfo: any) => this.editWorkFlowInformation(childInfo);
        this.$scope.isSubmitButtonEnabled = false;
        this.$scope.isEditWorkFlow = false;
        this.$scope.isAcceptRoleDisabled = false;
        this.$scope.isRejectRoleDisabled = false;
        this.$scope.isReviewRoleDisabled = false;
        this.$scope.onAcceptPermissionChangeEvent = (permission: any, workFlowDetails: any) => this.onAcceptPermissionChangeEvent(permission, workFlowDetails);
        this.$scope.onRejectPermissionChangeEvent = (permission: any, workFlowDetails: any) => this.onRejectPermissionChangeEvent(permission, workFlowDetails);
        this.$scope.onReviewPermissionChangeEvent = (permission: any, workFlowDetails: any) => this.onReviewPermissionChangeEvent(permission, workFlowDetails);
        this.$scope.getChildWorkFlow = (activityId: number) => this.getChildWorkFlow(activityId);
        this.$scope.checkActivityCloseOrNot = (activityId: number) => this.checkActivityCloseOrNot(activityId);
        this.$scope.editWorkFlowInformationById = (item: any) => this.editWorkFlowInformationById(item);
        this.$scope.openWarningDialogBox = () => this.openWarningDialogBox();
        this.$scope.closeWarningDialogBox = () => this.closeWarningDialogBox();
        this.$scope.isCheckedApproval = true;
        this.$scope.deleteWorkFlowInformation = (workflowDetails: any) => this.deleteWorkFlowInformation(workflowDetails);
        this.$scope.isEditInformation = false;
        this.$scope.showDetails = true;
        this.$scope.approvalDeleteInformation = [];
        this.$scope.reviewDeleteInformation = [];
        this.$scope.reviewCollectionDetails = new Model.WorkFlow();
        this.$scope.isApproveEnabled = false;
        this.$scope.workFlowDetails.IsUpdate = true;
        this.$scope.isWorkFlowPanelView = false;
        this.$scope.isDeleteButtonVisible = false;
        this.$scope.closeDeleteWorkFlowDialogDialogBox = () => this.closeDeleteWorkFlowDialogDialogBox();
        this.$scope.openDeleteWorkFlowDialogbox = (workflowdetails: any) => this.openDeleteWorkFlowDialogbox(workflowdetails);
        this.$scope.editWorkFlowInformation = (permissionId: any) => this.editWorkFlowInformation(permissionId);
        this.$scope.isCheckBoxVisible = false;
        this.$scope.changeUserRole = () => this.changeUserRole();
        this.$scope.isAssignedRoleDisabled = true;
        this.$scope.isCoditionalOperator = false;
        this.$scope.operatorList = [
            { value: '==' }, { value: '!=' }, { value: '>' }, { value: '<' }, { value: '>=' }, { value: '<=' }];
        this.$scope.isInitiatorRoleDisabled = true;
        this.$scope.changeActivityName = (activityId: number) => this.changeActivityName(activityId);
        this.$scope.attributeCollection = [];
        this.$scope.changeAssignedUserRoleName = () => this.changeAssignedUserRoleName();
        this.$scope.isNextActivityDisabled = true;
        this.$scope.onTruePermissionChangeEvent = (permission: any, workFlowDetails: any) => this.onTruePermissionChangeEvent(permission, workFlowDetails);
        this.$scope.onFalsePermissionChangeEvent = (permission: any, workFlowDetails: any) => this.onFalsePermissionChangeEvent(permission, workFlowDetails);
        this.$scope.changeAttributeValue = (value: string) => this.changeAttributeValue(value);
        this.$scope.isDisabledVariableValue = true;
        this.$scope.otherAttributeCollection = [];
        this.$scope.checkConditionalOperator = (workFlowDetails: Model.WorkFlow) => this.checkConditionalOperator(workFlowDetails);
        this.$scope.customActivityCollection = [];
        this.$scope.isShowCoditionalCheckBox = false;
        this.$scope.clearInformation = () => this.clearInformation();
        this.$scope.conditionalOperatorCollection = [];
        this.$scope.addConditionalOperator = (conditionInfo: any) => this.addConditionalOperator(conditionInfo);
        this.$scope.removeConditionalOperator = (index: any) => this.removeConditionalOperator(index);
        this.$scope.changeAttribute = () => this.changeAttribute();
        this.$scope.isDisabledAddConditionalButton = true;
        this.$scope.isShowConditionalOperatorCollection = false;
        this.$scope.operatorCollection = [{ value: 'AND', Name: 'AND' }, { value: 'OR', Name: 'OR' }];
        this.$scope.isConditionOptioShow = false;
        this.$scope.isConditonalOperatorDisadbled = false;
        this.$scope.changeConditionValue = () => this.changeConditionValue();
        this.$scope.isOperatorPanelVisible = false;
        this.$scope.isAllowAddCondtion = false;
        this.$scope.checkWorkFlowNameAlreadyExistOrNot = (workFlowDetails: Model.WorkFlow) => this.checkWorkFlowNameAlreadyExistOrNot(workFlowDetails);
        this.$scope.isWorkFlowNameExist = false;
        this.$scope.isWorkFlowTypeDisabled = true;
        this.$scope.workFlowCollection = [];
        this.$scope.isAcceptCondtionAllowOtherWorkFlow = false;
        this.$scope.isRejectCondtionAllowOtherWorkFlow = false;
        this.$scope.isReviewCondtionAllowOtherWorkFlow = false;
        this.$scope.isTrueCondtionAllowOtherWorkFlow = false;
        this.$scope.isFalseCondtionAllowOtherWorkFlow = false;
        //this.$scope.changeWorkFlowName = (workFlowDetails: Model.workFlow) => this.changeWorkFlowName(workFlowDetails);
        this.$scope.onAcceptChangeWorkFlowName = (workflowDetails: any) => this.onAcceptChangeWorkFlowName(workflowDetails);
        this.$scope.onRejectChangeWorkFlowName = (workflowDetails: any) => this.onRejectChangeWorkFlowName(workflowDetails);
        this.$scope.onReviewChangeWorkFlowName = (workflowDetails: any) => this.onReviewChangeWorkFlowName(workflowDetails);
        this.$scope.onTrueChangeWorkFlowName = (workflowDetails: any) => this.onTrueChangeWorkFlowName(workflowDetails);
        this.$scope.onFalseChangeWorkFlowName = (workflowDetails: any) => this.onFalseChangeWorkFlowName(workflowDetails);
        this.$scope.isInitiateActivityEnabled = false;
        this.$scope.isShowConditionalOperator = false;
        this.$scope.customConditionalOperator = [{ value: true, name: "Boolen Conditional" }, { value: false, name: "Operator Conditional" }];
        this.$scope.assignedRoleCollection = [];
        this.$scope.getAllBoolenOperatorListByActivityId = (activityId: number) => this.getAllBoolenOperatorListByActivityId(activityId);
        //: Function;
        //: Function;
        //: Function;
        //: Function;
        this.$scope.boolenAttributeCollection = [];
        this.$scope.otherBoolenAttributeCollection = [];
        this.$scope.myValue = false;
        this.$scope.isAllowBoolenCondition = false;
        this.$scope.boolenAttributeCollection = [];
        this.$scope.isAllowOtherWorkFlowCondition = false;
        this.$scope.otherWorkFlowActivityCollection = [];
        this.$scope.changeConditionalOperator = (condition: any) => this.changeConditionalOperator(condition);
        this.$scope.isWorkFlowNameDisabled = false;
        this.$scope.customCollection = [];
        this.$scope.isParentAction = false;
        this.$scope.isAllowOtherBranchUser = false;
        this.initialization();

    }

    private initialization() {
        this.getAllActivityList();
        this.getAllWorkFlowName();
        this.getAllRoleList();

    }

    private changeConditionalOperator(condition) {
        var controllerScope = this.$scope;
        var conditionDetails = [];
        //   for (var i = 0; i < controllerScope.customConditionalOperator.length; i++) {
        if (condition) {
            //  conditionDetails.push({ ConditionalOperator: [{ IsBoolenCondtion: true }] });
            // controllerScope.workFlowDetails.Permission.push({ ConditionalOperator: [{ IsBoolenCondtion: true }] });
            controllerScope.isBoolenCondtion = true;
            controllerScope.isShowConditionalOperator = true;
            controllerScope.isSubmitButtonEnable = true;
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.conditionalOperatorCollection = [];
            controllerScope.isConditionOptioShow = false;
            controllerScope.isConditonalOperatorDisadbled = false;
            controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
        } else {
            controllerScope.isBoolenCondtion = false;
            controllerScope.isShowConditionalOperator = true;
            controllerScope.isSubmitButtonEnable = true;
            controllerScope.conditionalOperatorCollection = [];
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.isConditionOptioShow = false;
            controllerScope.isConditonalOperatorDisadbled = false;
            controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
        }
    }

    private changeUserRole() {
        var controllerScope = this.$scope;
        if (controllerScope.workFlowDetails.Permission.IsClosed) {
            controllerScope.assignedRoleCollection = [];
            controllerScope.assignedRoleCollection = controllerScope.roleList;
            controllerScope.workFlowDetails.Permission.AssignedId = controllerScope.workFlowDetails.Permission.InitiatorId;
            controllerScope.isAssignedRoleDisabled = true;
            controllerScope.isCheckedApproval = false;
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isCoditionalOperator = false;
            controllerScope.isShowConditionalOperator = false;
        }
        else if (controllerScope.workFlowDetails.Permission.IsCondition) {
            controllerScope.assignedRoleCollection = [];
            controllerScope.assignedRoleCollection = controllerScope.roleList;
            controllerScope.workFlowDetails.Permission.AssignedId = controllerScope.workFlowDetails.Permission.InitiatorId;
            controllerScope.isAssignedRoleDisabled = false;
            var workFlowDetails = controllerScope.workFlowDetails.Permission;
            controllerScope.isDisplayCondiotionPanel = true;
            controllerScope.isShowConditionalOperator = true;
            controllerScope.isCoditionalOperator = true;
            controllerScope.isWorkFlowPanelView = false;
            if (this.$routeParams.id != null && this.$routeParams.id != "") {
                controllerScope.isSubmitButtonEnable = false;
                controllerScope.workFlowPanelActionPanel = false;
            } else {
                if (controllerScope.boolenAttributeCollection.length == 0) {

                    controllerScope.isBoolenCondtion = false;
                    controllerScope.isAllowBoolenCondition = false;
                } else {
                    controllerScope.isBoolenCondtion = true;

                    controllerScope.myValue = true;
                    if (controllerScope.attributeCollection.length == 0) {
                        controllerScope.isAllowBoolenCondition = false;
                    } else {
                        controllerScope.isAllowBoolenCondition = true;
                    }

                }
                for (var i = 0; i < controllerScope.activityCollection.length; i++) {
                    controllerScope.workFlowConditionDetails = new Model.WorkFlow();
                    controllerScope.workFlowCondition = new Model.WorkFlow();
                    var conditionDetails = [];
                    var workFlowCondition = [];
                    conditionDetails.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsApprovePanel: true });
                    workFlowCondition.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsRejectPanel: true });
                    controllerScope.workFlowConditionDetails.Permission = conditionDetails[0];
                    controllerScope.workFlowCondition.Permission = workFlowCondition[0];
                    controllerScope.isSubmitButtonEnable = true;
                    controllerScope.workFlowPanelActionPanel = true;
                    //if (controllerScope.activityCollection[i].IsCondition == controllerScope.workFlowDetails.Permission.IsCondition) {
                    //    controllerScope.activityCollection.splice(i);
                    //    break;

                    //}

                }
            }


        }
        else {
            controllerScope.assignedRoleCollection = [];

            if (controllerScope.isAllowOtherBranchUser) {
                controllerScope.assignedRoleCollection = controllerScope.roleList;
            }
            else {
                for (var j = 0; j < controllerScope.roleList.length; j++) {
                    if (controllerScope.roleList[j].Id != controllerScope.workFlowDetails.Permission.InitiatorId) {
                        controllerScope.assignedRoleCollection.push(controllerScope.roleList[j]);
                    }
                }
            }

            controllerScope.isAssignedRoleDisabled = false;
            controllerScope.isCheckedApproval = true;
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isCoditionalOperator = false;
            controllerScope.isAssignedRoleDisabled = false;
            controllerScope.workFlowDetails.Permission.AssignedId = "";
            controllerScope.isShowConditionalOperator = false;
        }
    }

    private changeAssignedUserRoleName() {

        var controllerScope = this.$scope;
        if (controllerScope.workFlowDetails.Permission.IsCondition) {
            var workFlowDetails = controllerScope.workFlowDetails.Permission;
            controllerScope.isDisplayCondiotionPanel = true;
            controllerScope.isCoditionalOperator = true;
            controllerScope.isWorkFlowPanelView = true;
            for (var i = 0; i < controllerScope.activityCollection.length; i++) {
                controllerScope.workFlowConditionDetails = new Model.WorkFlow();
                controllerScope.workFlowCondition = new Model.WorkFlow();
                var conditionDetails = [];
                var workFlowCondition = [];
                conditionDetails.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsApprovePanel: true });
                workFlowCondition.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsRejectPanel: true });
                controllerScope.workFlowConditionDetails.Permission = conditionDetails[0];
                controllerScope.workFlowCondition.Permission = workFlowCondition[0];
                controllerScope.isSubmitButtonEnable = true;
                controllerScope.workFlowPanelActionPanel = true;

            }
        }
    }

    private getAllRoleList() {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.roleList = [];
        var roleCollection = controllerScope.roleList;
        controllerScope.assignedRoleCollection = [];
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
                controllerScope.assignedRoleCollection = controllerScope.roleList;
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
        controllerScope.showDetails = false;
        controllerScope.permissionCollection = [];
        var permissionCollection = controllerScope.permissionCollection;
        var promise = this.workFlowService.addWorkFlowDetails(workFlowDetails.PermissionId);
        promise.then((result) => {
            controllerScope.isWorkFlowPanelDisplay = true;
            controllerScope.isSubmitButtonEnabled = false;
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.isModuleName = false;
                controllerScope.isExpand = true;
            }
            else {

                for (var i = 0; i < result.length; i++) {
                    permissionCollection.push(result[i]);

                }

                controllerScope.workFlowDetails.Permission = "";
                controllerScope.isAssignedRoleDisabled = true;
                controllerScope.isCheckedApproval = false;
                controllerScope.isDisplayCondiotionPanel = false;
                controllerScope.isCoditionalOperator = false;
                controllerScope.isAssignedRoleDisabled = true;
                controllerScope.isShowConditionalOperator = false;
                controllerScope.isWorkFlowPanelView = false;
                controllerScope.workFlowConditionDetails = new Model.WorkFlow();
                controllerScope.workFlowCondition = new Model.WorkFlow();
                controllerScope.isSubmitButtonEnable = true;
                controllerScope.workFlowPanelActionPanel = true;
                controllerScope.isCheckedApproval = true;
                controllerRootScope.isLoading = false;
                controllerScope.isModuleName = true;
                this.getAllActivityList();
                //});

            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status == 500) {
                //it shown "no record found" error messsage.
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.isModuleName = false;
                controllerScope.isExpand = true;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });

    }

    private editWorkFlowInformation(childInfo) {

        this.$location.path("/EditWorkFlow/" + childInfo.WorkFlowId);
        this.$route.reload();


    }
    //editWorkFlowInformation

    private editWorkFlowInformationById(permisssionId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.showDetails = false;

        var promise = this.workFlowService.editWorkFlowInformationById(permisssionId);
        promise.then((result) => {
            // this.changeActivityName(result.ParentActivityId);
            controllerScope.isWorkFlowNameDisabled = true;
            if (result.status) {
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            } else {


                //if (controllerScope.workFlowCollection.length == 0) {
                //    for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
                //        if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                //            controllerScope.customActivityCollection.splice(i, 1);
                //            break;
                //        }
                //    }
                //}

                //06-04-2016 changes.
                //if (controllerScope.workFlowCollection.length == 0) {
                //    for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
                //        if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                //            controllerScope.customActivityCollection.splice(i, 1);
                //            break;
                //        }
                //    }
                //} else {
                //    for (var q = 0; q < controllerScope.workFlowCollection.length; q++) {
                //        if (controllerScope.workFlowCollection[q].WorkFlowId == result.WorkFlowDetailParentId) {
                //            controllerScope.workFlowCollection.splice(q, 1);
                //        }
                //    }


                //}

                controllerScope.isInitiateActivityEnabled = true;
                this.getWorkFlowDetailTreeViewByActivityId(permisssionId);
                controllerScope.isNextActivityDisabled = false;
                controllerScope.isAssignedRoleDisabled = false;
                controllerScope.isInitiatorRoleDisabled = false;

                this.$log.log("get workflow details successfully", result);
                controllerScope.isModuleName = true;
                controllerScope.isEditInformation = true;
                if (result.IsAllowOtherBranchUser) {
                    controllerScope.isAllowOtherBranchUser = true;

                }
                // controllerScope.isSubmitButtonEnable = true;
                //controllerScope.workFlowDetails.workFlowActionId = childInfo.WorkFlowId;
                //result.Permission.length
                controllerScope.workFlowConditionDetails = new Model.WorkFlow();
                controllerScope.workFlowCondition = new Model.WorkFlow();
                controllerScope.workFlowDetails = new Model.WorkFlow();
                controllerScope.reviewCollectionDetails = new Model.WorkFlow();
                for (var j = 0; j < result.Permission.length; j++) {

                    controllerScope.isWorkFLowButtonEnable = true;

                    // controllerScope.isSubmitButtonEnable = true;
                    controllerScope.isExpand = false;
                    //controllerScope.workFlowConditionDetails.Permission.push(workFlowDetails.RoleToId);
                    controllerScope.workFlowDetails.ActivityId = result.ActivityId;
                    controllerScope.workFlowDetails.PermissionId = result.PermissionId;
                    controllerScope.workFlowDetails.WorkFLowName = result.WorkFlowName;
                    controllerScope.workFlowDetails.WorkFlowDetailParentId = result.WorkFlowDetailParentId;


                    //this.$scope.$apply();
                    controllerScope.isWorkFlowPanelView = false;

                    if (result.Permission[j].Children.length == 0) {
                        controllerScope.workFlowDetails.Permission = result.Permission[j];
                        controllerScope.isDisplayCondiotionPanel = false;

                        if (controllerScope.workFlowDetails.Permission.IsActivityClose) {
                            controllerScope.isAssignedRoleDisabled = true;
                            //for (var r = 0; r < controllerScope.customActivityCollection.length; r++) {
                            //    if (controllerScope.customActivityCollection[r].IsAllowOtherWorkFLow) {
                            //        controllerScope.customActivityCollection.splice(r, 1);
                            //        break;
                            //    }
                            //}
                        }
                        //06-4-2016(allow other work flow related chnages.)
                        else if (controllerScope.workFlowDetails.Permission.IsAllowOtherWorkFlow) {
                            controllerScope.isAllowOtherWorkFlowCondition = true;
                            controllerScope.activityCollection = controllerScope.customActivityCollection;
                        }
                        else {
                            controllerScope.isAssignedRoleDisabled = false;
                            //for (var s = 0; s < controllerScope.customActivityCollection.length; s++) {
                            //    if (controllerScope.customActivityCollection[s].IsAllowOtherWorkFLow) {
                            //        controllerScope.customActivityCollection.splice(s, 1);
                            //        break;
                            //    }
                            //}
                        }
                        if (result.Permission[j].ParentActivityId != 0) {
                            controllerScope.isEditWorkFlow = true;
                            controllerScope.isParentAction = false;
                            for (var e = 0; e < controllerScope.activityCollection.length; e++) {
                                if (controllerScope.activityCollection[e].IsCondition) {
                                    controllerScope.activityCollection.splice(e, 1);
                                }
                                //else if (controllerScope.activityCollection[e].IsAllowOtherWorkFlow) {
                                //    controllerScope.isAllowOtherWorkFlowCondition = true;
                                //    controllerScope.otherWorkFlowActivityCollection = controllerScope.activityCollection;

                                //}
                            }

                        } else {
                            controllerScope.isEditWorkFlow = false;
                            controllerScope.isAssignedRoleDisabled = true;
                            controllerScope.isParentAction = true;

                        }
                        //   controllerScope.isEditWorkFlow = result.Permission[j].IsParentAction;
                        controllerScope.isSubmitButtonEnabled = false;
                        controllerScope.isSubmitButtonEnable = false;
                        controllerScope.isDeleteButtonVisible = false;
                        //  controllerScope.isShowCoditionalCheckBox = false;
                        // controllerScope.isEditWorkFlow = true;
                        for (var x = 0; x < controllerScope.activityCollection.length; x++) {
                            if (controllerScope.activityCollection[x].PermissionId == controllerScope.workFlowDetails.Permission.NextActivityId) {
                                if (controllerScope.activityCollection[x].IsCondition == true) {
                                    var workFlowDetails = controllerScope.workFlowDetails.Permission;
                                    controllerScope.workFlowDetails.Permission.IsCondition = true;
                                    controllerScope.isDisplayCondiotionPanel = true;
                                    controllerScope.isCoditionalOperator = true;
                                    // controllerScope.isWorkFlowPanelView = true;

                                    controllerScope.workFlowConditionDetails = new Model.WorkFlow();
                                    controllerScope.workFlowCondition = new Model.WorkFlow();
                                    var conditionDetails = [];
                                    var workFlowCondition = [];
                                    conditionDetails.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsApprovePanel: true });
                                    workFlowCondition.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsRejectPanel: true });
                                    controllerScope.workFlowConditionDetails.Permission = conditionDetails[0];
                                    controllerScope.workFlowCondition.Permission = workFlowCondition[0];
                                    controllerScope.isSubmitButtonEnable = true;
                                    controllerScope.workFlowPanelActionPanel = true;
                                    // controllerScope.isEditWorkFlow = result.Permission[j].IsParentAction;

                                    controllerScope.isOperatorPanelVisible = false;
                                    controllerScope.isDeleteButtonVisible = false;
                                    controllerScope.isShowCoditionalCheckBox = false;
                                    break;


                                }

                            }
                        }


                    } else {

                        controllerScope.isNextActivityDisabled = true;
                        if (result.WorkFlowParentActivityId != 0) {
                            controllerScope.isEditWorkFlow = true;
                            //activityCollection
                            for (var b = 0; b < controllerScope.activityCollection.length; b++) {
                                if (controllerScope.activityCollection[b].IsCondition) {
                                    controllerScope.activityCollection.splice(b, 1);
                                }
                            }
                            controllerScope.isParentAction = false;
                        } else {
                            controllerScope.isParentAction = true;
                            controllerScope.isEditWorkFlow = false;
                            controllerScope.isAssignedRoleDisabled = true;
                            controllerScope.isInitiatorRoleDisabled = true;
                        }

                        controllerScope.isDisplayCondiotionPanel = true;
                        controllerScope.isSubmitButtonEnable = true;
                        if (result.Permission[j].IsParentAction) {
                            //controllerScope.isEditWorkFlow = false;
                            controllerScope.isDeleteButtonVisible = true;
                            controllerScope.isCheckBoxVisible = true;
                        } else {
                            // controllerScope.isEditWorkFlow = true;
                            controllerScope.isDeleteButtonVisible = false;

                        }

                        if (result.Permission[j].IsApproval) {
                            controllerScope.workFlowDetails.Permission = result.Permission[j];
                            for (var k = 0; k < result.Permission[j].Children.length; k++) {

                                if (result.Permission[j].Children[k].IsApprovePanel) {
                                    controllerScope.workFlowPanelActionPanel = true;
                                    controllerScope.workFlowConditionDetails.Permission = result.Permission[j].Children[k];
                                    if (controllerScope.workFlowConditionDetails.Permission.IsActivityClose) {
                                        controllerScope.isAcceptRoleDisabled = true;
                                        controllerScope.isAcceptCondtionAllowOtherWorkFlow = false;
                                    } else if (controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFlow) {
                                        controllerScope.isAcceptRoleDisabled = true;
                                        controllerScope.isAcceptCondtionAllowOtherWorkFlow = true;
                                    } else {
                                        controllerScope.isAcceptRoleDisabled = false;
                                        controllerScope.isAcceptCondtionAllowOtherWorkFlow = false;
                                    }

                                } else {

                                    // controllerScope.workFlowPanelActionPanel = false;
                                    controllerScope.workFlowCondition.Permission = result.Permission[j].Children[k];
                                    if (controllerScope.workFlowCondition.Permission.IsActivityClose) {
                                        controllerScope.isRejectRoleDisabled = true;
                                        controllerScope.isRejectCondtionAllowOtherWorkFlow = false;
                                    } else if (controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFlow) {
                                        controllerScope.isRejectRoleDisabled = true;
                                        controllerScope.isRejectCondtionAllowOtherWorkFlow = true;
                                    } else {
                                        controllerScope.isRejectRoleDisabled = false;
                                        controllerScope.isRejectCondtionAllowOtherWorkFlow = false;
                                    }
                                }
                            }
                            controllerScope.isSubmitButtonEnabled = true;
                            controllerScope.isShowCoditionalCheckBox = false;
                        } else if (result.Permission[j].IsCondition) {
                            controllerScope.workFlowDetails.Permission = result.Permission[j];


                            // this.changeActivityName(result.ActivityId);
                            controllerScope.workFlowPanelActionPanel = true;
                            controllerScope.isCoditionalOperator = true;
                            controllerScope.conditionalOperatorCollection = [];
                            controllerScope.isShowConditionalOperator = true;
                            for (var a = 0; a < result.Permission[j].ConditionalOperator.length; a++) {
                                controllerScope.myValue = result.Permission[j].ConditionalOperator[a].IsBoolenCondtion;
                                controllerScope.conditionalOperatorCollection.push(result.Permission[j].ConditionalOperator[a]);
                            }

                            if (controllerScope.conditionalOperatorCollection.length == 0) {
                                controllerScope.isShowConditionalOperatorCollection = false;

                                //work flow condtion edit related changes.
                                controllerScope.isDisabledVariableValue = false;
                                controllerScope.isConditionOptioShow = false;
                                controllerScope.isConditonalOperatorDisadbled = false;
                                controllerScope.isOperatorPanelVisible = true;
                                controllerScope.isSubmitButtonEnabled = false;
                                controllerScope.isAllowAddCondtion = true;
                                //
                            } else {
                                controllerScope.isShowConditionalOperatorCollection = true;

                                //work flow condtion edit related changes.
                                controllerScope.isDisabledVariableValue = true;
                                controllerScope.isConditionOptioShow = true;
                                controllerScope.isConditonalOperatorDisadbled = true;
                                controllerScope.isOperatorPanelVisible = true;
                                controllerScope.isSubmitButtonEnabled = true;
                                controllerScope.isAllowAddCondtion = true;
                                //
                            }


                            for (var z = 0; z < result.Permission[j].Children.length; z++) {

                                if (result.Permission[j].Children[z].IsApprovePanel) {
                                    controllerScope.workFlowPanelActionPanel = true;
                                    controllerScope.isCoditionalOperator = true;
                                    controllerScope.workFlowConditionDetails.Permission = result.Permission[j].Children[z];
                                    if (controllerScope.workFlowConditionDetails.Permission.IsActivityClose) {
                                        controllerScope.isAcceptRoleDisabled = true;
                                        controllerScope.isTrueCondtionAllowOtherWorkFlow = false;
                                    } else if (controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFlow) {
                                        controllerScope.isAcceptRoleDisabled = true;
                                        controllerScope.isTrueCondtionAllowOtherWorkFlow = true;
                                    } else {
                                        controllerScope.isAcceptRoleDisabled = false;
                                        controllerScope.isTrueCondtionAllowOtherWorkFlow = false;
                                    }

                                } else {

                                    // controllerScope.workFlowPanelActionPanel = false;
                                    controllerScope.workFlowCondition.Permission = result.Permission[j].Children[z];
                                    if (controllerScope.workFlowCondition.Permission.IsActivityClose) {
                                        controllerScope.isRejectRoleDisabled = true;
                                        controllerScope.isFalseCondtionAllowOtherWorkFlow = false;
                                    } else if (controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFlow) {
                                        controllerScope.isRejectRoleDisabled = true;
                                        controllerScope.isFalseCondtionAllowOtherWorkFlow = true;
                                    } else {
                                        controllerScope.isRejectRoleDisabled = false;
                                        controllerScope.isFalseCondtionAllowOtherWorkFlow = false;
                                    }
                                }
                            }

                            controllerScope.workFlowDetails.Permission.ConditionalOperator = "";
                        } else {
                            controllerScope.workFlowPanelActionPanel = false;
                            controllerScope.workFlowDetails.Permission = result.Permission[j];
                            controllerScope.reviewCollectionDetails.Permission = result.Permission[j].Children[0];
                            if (controllerScope.reviewCollectionDetails.Permission.IsAllowOtherBranchUser) {
                                controllerScope.isAllowOtherBranchUser = true;
                            }
                            controllerScope.isSubmitButtonEnabled = true;
                            controllerScope.isShowCoditionalCheckBox = false;
                            if (controllerScope.reviewCollectionDetails.Permission.IsActivityClose) {
                                controllerScope.isReviewRoleDisabled = true;
                                controllerScope.isReviewCondtionAllowOtherWorkFlow = false;
                            } else if (controllerScope.reviewCollectionDetails.Permission.IsAllowOtherWorkFlow) {
                                controllerScope.isReviewRoleDisabled = true;
                                controllerScope.isReviewCondtionAllowOtherWorkFlow = true;
                            } else {
                                controllerScope.isReviewRoleDisabled = false;
                                controllerScope.isReviewCondtionAllowOtherWorkFlow = false;
                            }
                        }
                    }


                }

                controllerScope.isCheckedApproval = false;
                //  controllerScope.workFlowDetails = new Model.workFlow();
                controllerScope.workFlowDetails.workFlowActionId = permisssionId;


                // controllerScope.workFlowDetails.Permission = result.Permission[j];
                controllerScope.permissionCollection = [];
                var permissionCollection = controllerScope.permissionCollection;

                var activitypromise = this.workFlowService.editWorkFlowPermission(controllerScope.workFlowDetails.PermissionId);
                activitypromise.then((activityResult) => {
                    controllerScope.isWorkFlowPanelDisplay = true;
                    if (activityResult.length == 0) {
                        controllerScope.errorMessage = stringConstants.errorMessage;
                        //  controllerScope.isAddWorkFlow = true;
                        //controllerRootScope.isLoading = false;
                        controllerScope.isModuleName = false;
                        controllerScope.isExpand = true;
                        //this.getWorkFlowDetailsForTreeViewByActivityId(controllerScope.workFlowDetails.PermissionId);
                        //  controllerScope.isWorkFlowPanelView = false;
                    } else {

                        for (var s = 0; s < activityResult.length; s++) {
                            permissionCollection.push(activityResult[s]);
                        }
                        //controllerScope.isWorkFlowPanelView = true;
                        //this.checkPermissionRole(workFlowDetails.PermissionId);
                        this.$log.log("add work Flow successfullty", activityResult);


                    }

                });

                controllerScope.attributeCollection = [];
                var attributeCollection = controllerScope.attributeCollection;

                var attributepromise = this.workFlowService.getAttributeListByActivityId(result.ParentActivityId);
                attributepromise.then((attributeresult) => {
                    if (result.length == 0) {
                        for (var p = 0; p < controllerScope.activityCollection.length; p++) {
                            //   controllerScope.isNextActivityDisabled = false;
                            //if (controllerScope.activityCollection[p].IsCondition == true) {
                            //    controllerScope.activityCollection.splice(p);
                            //    controllerScope.isShowCoditionalCheckBox = false;
                            //    break;

                            //}
                        }
                        controllerRootScope.isLoading = false;
                    } else {
                        this.$log.log("get variable list succssfully", result);
                        for (var d = 0; d < attributeresult.length; d++) {
                            controllerScope.attributeCollection.push(attributeresult[d]);
                        }
                        if (controllerScope.attributeCollection.length == 0) {
                            controllerScope.isShowCoditionalCheckBox = false;
                        } else {
                            controllerScope.isShowCoditionalCheckBox = true;
                        }
                        controllerScope.otherAttributeCollection = controllerScope.attributeCollection;
                        // controllerScope.isNextActivityDisabled = false;

                        controllerRootScope.isLoading = false;
                    }
                    this.getAllBoolenOperatorListByActivityId(result.ParentActivityId);
                });

                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(this.apiPath);

        });
    }

    private editInfo(permisssionId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;

        controllerRootScope.isLoading = true;
        controllerScope.showDetails = false;
        // childInfo.WorkFlowId;
        var promise = this.workFlowService.editWorkFlowInformationById(permisssionId);
        promise.then((result) => {
            this.getWorkFlowDetailTreeViewByActivityId(permisssionId);
            this.$log.log("get workflow details successfully", result);
            controllerScope.isModuleName = true;
            controllerScope.isEditInformation = true;
            this.changeActivityName(result.ParentActivityId);
            // controllerScope.isSubmitButtonEnable = true;
            //controllerScope.workFlowDetails.workFlowActionId = childInfo.WorkFlowId;
            //result.Permission.length
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.workFlowDetails = new Model.WorkFlow();
            controllerScope.reviewCollectionDetails = new Model.WorkFlow();
            for (var j = 0; j < result.Permission.length; j++) {

                controllerScope.isWorkFLowButtonEnable = true;

                // controllerScope.isSubmitButtonEnable = true;
                controllerScope.isExpand = false;
                //controllerScope.workFlowConditionDetails.Permission.push(workFlowDetails.RoleToId);
                controllerScope.workFlowDetails.ActivityId = result.ActivityId;
                controllerScope.workFlowDetails.PermissionId = result.PermissionId;
                controllerScope.workFlowDetails.WorkFlowDetailParentId = result.WorkFlowDetailParentId;


                //this.$scope.$apply();
                controllerScope.isWorkFlowPanelView = false;
                if (result.Permission[j].Children.length == 0) {
                    controllerScope.workFlowDetails.Permission = result.Permission[j];
                    controllerScope.isDisplayCondiotionPanel = false;
                    controllerScope.isEditWorkFlow = false;
                    controllerScope.isSubmitButtonEnable = false;
                    controllerScope.isDeleteButtonVisible = false;
                } else {
                    controllerScope.isInitiateActivityEnabled = true;
                    controllerScope.isDisplayCondiotionPanel = true;
                    controllerScope.isSubmitButtonEnable = true;
                    if (result.Permission[j].IsParentAction) {
                        controllerScope.isEditWorkFlow = false;
                        controllerScope.isDeleteButtonVisible = true;
                    } else {
                        controllerScope.isEditWorkFlow = true;
                        controllerScope.isDeleteButtonVisible = false;

                    }
                    if (result.Permission[j].IsApproval) {
                        controllerScope.workFlowDetails.Permission = result.Permission[j];
                        for (var k = 0; k < result.Permission[j].Children.length; k++) {

                            if (result.Permission[j].Children[k].IsApprovePanel) {
                                controllerScope.workFlowPanelActionPanel = true;
                                controllerScope.workFlowConditionDetails.Permission = result.Permission[j].Children[k];
                            } else {

                                // controllerScope.workFlowPanelActionPanel = false;
                                controllerScope.workFlowCondition.Permission = result.Permission[j].Children[k];
                            }
                        }

                    }
                    else if (result.Permission[j].IsCondition) {
                        controllerScope.workFlowDetails.Permission = result.Permission[j];

                        for (var z = 0; z < result.Permission[j].Children.length; z++) {

                            if (result.Permission[j].Children[z].IsApprovePanel) {
                                controllerScope.workFlowPanelActionPanel = true;
                                controllerScope.isCoditionalOperator = true;
                                controllerScope.workFlowConditionDetails.Permission = result.Permission[j].Children[z];
                            } else {

                                // controllerScope.workFlowPanelActionPanel = false;
                                controllerScope.workFlowCondition.Permission = result.Permission[j].Children[z];
                            }
                        }
                    }
                    else {
                        controllerScope.workFlowPanelActionPanel = false;
                        controllerScope.workFlowDetails.Permission = result.Permission[j];
                        controllerScope.reviewCollectionDetails.Permission = result.Permission[j].Children[0];
                    }
                }


            }
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.isCheckedApproval = false;
            //  controllerScope.workFlowDetails = new Model.workFlow();
            controllerScope.workFlowDetails.workFlowActionId = permisssionId;


            // controllerScope.workFlowDetails.Permission = result.Permission[j];
            controllerScope.permissionCollection = [];
            var permissionCollection = controllerScope.permissionCollection;

            var activitypromise = this.workFlowService.editWorkFlowPermission(controllerScope.workFlowDetails.PermissionId);
            activitypromise.then((activityResult) => {
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


                }

            });

            controllerRootScope.isLoading = false;
        });
    }

    private checkPermissionRole(permissionId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.permissionRoleCollection = [];
        var rolelist = controllerScope.permissionRoleCollection;
        var promise = this.workFlowService.checkPermissionRole(permissionId);
        promise.then((result) => {
            if (result.length == 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.rolepermissionErrorErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;

                //  controllerScope.isWorkFlowPanelView = false;
            } else {


                this.$log.log("Get All Role And Permission Successfully.");
                for (var i = 0; i < result.length; i++) {
                    rolelist.push(result[i]);

                }
                controllerRootScope.isLoading = false;
            }
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

    private getAllActivityList() {
        var controllerScope = this.$scope;
        //controllerScope.workFlowConditionDetails = new Model.workFlow();
        //controllerScope.workFlowCondition = new Model.workFlow();
        controllerScope.activityCollection = [];
        controllerScope.customActivityCollection = [];
        var promise = this.workFlowService.getAllActivityList();
        promise.then((result) => {
            this.$log.log("get all Activity Successfully", result);
            for (var i = 0; i < result.length; i++) {

                controllerScope.activityCollection.push(result[i]);

                if (!result[i].IsCondition) {
                    controllerScope.customActivityCollection.push(result[i]);

                }


            }
            this.getAllWorkFlowNameList();
            //if (result[i].IsChecked) {
            //    controllerScope.workFlowCondition.Permission.NextActivityId = result[i].PermissionId;
            //    controllerScope.workFlowConditionDetails.Permission.NextActivityId = result[i].PermissionId;
            //}
            controllerScope.customCollection = controllerScope.activityCollection;
            controllerScope.otherWorkFlowActivityCollection = controllerScope.customActivityCollection;
            if (this.$routeParams.id != null && this.$routeParams.id != "") {
                this.editWorkFlowInformationById(this.$routeParams.id);
                for (var k = 0; k < controllerScope.activityCollection.length; k++) {

                    if (controllerScope.activityCollection[k].IsAllowOtherWorkFLow == true) {
                        controllerScope.activityCollection.splice(k, 1);
                        break;

                    }
                }

            }
        });

    }

    private getActivityList() {
        var controllerScope = this.$scope;
        //controllerScope.workFlowConditionDetails = new Model.workFlow();
        //controllerScope.workFlowCondition = new Model.workFlow();
        controllerScope.activityCollection = [];
        controllerScope.customActivityCollection = [];
        var promise = this.workFlowService.getAllActivityList();
        promise.then((result) => {
            this.$log.log("get all Activity Successfully", result);
            for (var i = 0; i < result.length; i++) {

                controllerScope.activityCollection.push(result[i]);

                if (!result[i].IsCondition) {
                    controllerScope.customActivityCollection.push(result[i]);

                }


            }
            this.getAllWorkFlowNameList();
            //if (result[i].IsChecked) {
            //    controllerScope.workFlowCondition.Permission.NextActivityId = result[i].PermissionId;
            //    controllerScope.workFlowConditionDetails.Permission.NextActivityId = result[i].PermissionId;
            //}
            controllerScope.customCollection = controllerScope.activityCollection;
            controllerScope.otherWorkFlowActivityCollection = controllerScope.customActivityCollection;

            controllerScope.activityCollection = [];
            if (controllerScope.isParentAction) {
                for (var p = 0; p < controllerScope.customCollection.length; p++) {
                    if (controllerScope.attributeCollection.length != 0 && controllerScope.boolenAttributeCollection.length != 0) {
                        if (!controllerScope.customCollection[p].IsAllowOtherWorkFLow) {
                            controllerScope.activityCollection.push(controllerScope.customCollection[p]);

                        }
                    } else {
                        if (!controllerScope.customCollection[p].IsAllowOtherWorkFLow && !controllerScope.customCollection[p].IsCondition) {
                            controllerScope.activityCollection.push(controllerScope.customCollection[p]);

                        }
                    }

                }
            } else {
                for (var k = 0; k < controllerScope.customCollection.length; k++) {

                    if (!controllerScope.customCollection[k].IsAllowOtherWorkFLow && !controllerScope.customCollection[k].IsCondition) {
                        controllerScope.activityCollection.push(controllerScope.customCollection[k]);

                    }
                }
            }



        });

    }
    private getAllWorkFlowNameList() {
        var controllerScope = this.$scope;
        var that = this;
        var promise = this.workFlowService.getAllWorkFlowNameList();
        promise.then((result) => {
            this.$log.log("get all work flow succssfully");
            if (result.length == 0) {
                for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
                    if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                        controllerScope.customActivityCollection.splice(i, 1);
                        break;
                    }
                }
            } else {
                controllerScope.workFlowCollection = [];
                for (var j = 0; j < result.length; j++) {
                    controllerScope.workFlowCollection.push(result[j]);
                }

                if (that.$routeParams.id != null && that.$routeParams.id != "") {
                    //this.editWorkFlowInformationById(this.$routeParams.id);

                    for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
                        if (controllerScope.workFlowCollection[k].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
                            controllerScope.workFlowCollection.splice(k, 1);

                            if (controllerScope.workFlowCollection.length == 0) {
                                for (var z = 0; z < controllerScope.customActivityCollection.length; z++) {
                                    if (controllerScope.customActivityCollection[z].IsAllowOtherWorkFLow) {
                                        controllerScope.customActivityCollection.splice(z, 1);
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }

                }
            }
        });

    }

    private checkReviewCondition(workFlowDetails) {
        var controllerScope = this.$scope;
        var that = this;
        if (that.$routeParams.id != null && that.$routeParams.id != "") {
            ////this.editWorkFlowInformationById(this.$routeParams.id);
            ////for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
            ////    if (controllerScope.workFlowCollection[k].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
            ////        controllerScope.workFlowCollection.splice(k, 1);
            ////    }
            ////}

            //controllerScope.customActivityCollection = [];
            //controllerScope.customActivityCollection = controllerScope.otherWorkFlowActivityCollection;
            //if (controllerScope.workFlowCollection.length == 0) {
            //    for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            //        if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
            //            controllerScope.customActivityCollection.splice(i, 1);
            //            break;
            //        }
            //    }
            //} else {
            //    for (var q = 0; q < controllerScope.workFlowCollection.length; q++) {
            //        if (controllerScope.workFlowCollection[q].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
            //            controllerScope.workFlowCollection.splice(q, 1);

            //            if (controllerScope.workFlowCollection.length == 0) {
            //                for (var j = 0; j < controllerScope.customActivityCollection.length; j++) {
            //                    if (controllerScope.customActivityCollection[j].IsAllowOtherWorkFLow) {
            //                        controllerScope.customActivityCollection.splice(j, 1);
            //                        break;
            //                    }
            //                }
            //            }
            //        }
            //    }


            //}
            this.getActivityList();
        }
        if (workFlowDetails.IsReview) {

            var workFlowCondition = [];
            controllerScope.reviewCollectionDetails = new Model.WorkFlow();
            workFlowCondition.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsApprovePanel: true, IsAllowOtherBranchUser: false });
            controllerScope.reviewCollectionDetails.Permission = workFlowCondition[0];
            //  controllerScope.reviewCollectionDetails.Permission.push(workFlowDetails.RoleToId);
            controllerScope.workFlowDetails.Permission.IsApproval = false;
            controllerScope.workFlowPanelActionPanel = false;
            controllerScope.isSubmitButtonEnable = true;
            controllerScope.isDisplayCondiotionPanel = true;
            controllerScope.isWorkFlowPanelView = true;
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.isCheckedApproval = false;
            controllerScope.isAllowBoolenCondition = false;
            //if (controllerScope.attributeCollection.length == 0) {
            //    for (var j = 0; j < controllerScope.activityCollection.length; j++) {

            //        if (controllerScope.activityCollection[j].IsCondition == true) {
            //            controllerScope.activityCollection.splice(j);
            //            break;

            //        }
            //    }

            //}
        }
        else {
            controllerScope.isAllowBoolenCondition = false;
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowPanelActionPanel = false;
            controllerScope.isSubmitButtonEnable = false;
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.isWorkFlowPanelView = false;
            controllerScope.reviewCollectionDetails = new Model.WorkFlow();
            //controllerScope.isCheckedApproval = false;
            if (controllerScope.workFlowDetails.Permission.IsClosed) {
                controllerScope.isAssignedRoleDisabled = true;
                controllerScope.isCheckedApproval = false;
            } else {
                controllerScope.isAssignedRoleDisabled = false;
                controllerScope.isCheckedApproval = true;
            }

        }
    }

    private checkConditionalOperator(workFlowDetails) {

        var controllerScope = this.$scope;
        var that = this;
        if (that.$routeParams.id != null && that.$routeParams.id != "") {
            ////this.editWorkFlowInformationById(this.$routeParams.id);

            ////for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
            ////    if (controllerScope.workFlowCollection[k].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
            ////        controllerScope.workFlowCollection.splice(k, 1);
            ////    }
            ////}

            //controllerScope.customActivityCollection = [];
            //controllerScope.customActivityCollection = controllerScope.otherWorkFlowActivityCollection;
            //if (controllerScope.workFlowCollection.length == 0) {
            //    for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            //        if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
            //            controllerScope.customActivityCollection.splice(i, 1);
            //            break;
            //        }
            //    }
            //} else {
            //    for (var q = 0; q < controllerScope.workFlowCollection.length; q++) {
            //        if (controllerScope.workFlowCollection[q].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
            //            controllerScope.workFlowCollection.splice(q, 1);

            //            if (controllerScope.workFlowCollection.length == 0) {
            //                for (var j = 0; j < controllerScope.customActivityCollection.length; j++) {
            //                    if (controllerScope.customActivityCollection[j].IsAllowOtherWorkFLow) {
            //                        controllerScope.customActivityCollection.splice(j, 1);
            //                        break;
            //                    }
            //                }
            //            }
            //        }
            //    }


            //}
            this.getActivityList();
        }
        if (workFlowDetails.IsCondition) {
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            var conditionDetails = [];
            var workFlowCondition = [];
            conditionDetails.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsApprovePanel: true, IsAllowOtherBranchUser: false });
            workFlowCondition.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsRejectPanel: true, IsAllowOtherBranchUser: false });
            controllerScope.workFlowConditionDetails.Permission = conditionDetails[0];
            controllerScope.workFlowCondition.Permission = workFlowCondition[0];
            controllerScope.isDisplayCondiotionPanel = true;
            controllerScope.isCoditionalOperator = true;
            controllerScope.isWorkFlowPanelView = true;
            controllerScope.isSubmitButtonEnable = true;
            controllerScope.workFlowPanelActionPanel = true;
            controllerScope.isAssignedRoleDisabled = true;



            controllerScope.isShowConditionalOperator = true;



            if (controllerScope.boolenAttributeCollection.length == 0) {
                controllerScope.isAllowBoolenCondition = false;


            } else {
                controllerScope.isAllowBoolenCondition = true;

            }
        } else {
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.isCheckedApproval = false;
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isCoditionalOperator = false;
            controllerScope.isWorkFlowPanelView = false;
            controllerScope.isSubmitButtonEnable = false;
            controllerScope.workFlowPanelActionPanel = false;
            controllerScope.isAllowBoolenCondition = false;
        }
    }

    private checkApprovalConditon(workFlowDetails) {
        var controllerScope = this.$scope;
        var that = this;
        if (that.$routeParams.id != null && that.$routeParams.id != "") {
            ////this.editWorkFlowInformationById(this.$routeParams.id);

            ////for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
            ////    if (controllerScope.workFlowCollection[k].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
            ////        controllerScope.workFlowCollection.splice(k, 1);
            ////    }
            ////}
            //controllerScope.customActivityCollection = [];
            //controllerScope.customActivityCollection = controllerScope.otherWorkFlowActivityCollection;
            //if (controllerScope.workFlowCollection.length == 0) {
            //    for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            //        if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
            //            controllerScope.customActivityCollection.splice(i, 1);
            //            break;
            //        }
            //    }
            //} else {
            //    for (var q = 0; q < controllerScope.workFlowCollection.length; q++) {
            //        if (controllerScope.workFlowCollection[q].WorkFlowId == controllerScope.workFlowDetails.WorkFlowDetailParentId) {
            //            controllerScope.workFlowCollection.splice(q, 1);

            //            if (controllerScope.workFlowCollection.length == 0) {
            //                for (var j = 0; j < controllerScope.customActivityCollection.length; j++) {
            //                    if (controllerScope.customActivityCollection[j].IsAllowOtherWorkFLow) {
            //                        controllerScope.customActivityCollection.splice(j, 1);
            //                        break;
            //                    }
            //                }
            //            }
            //        }
            //    }


            //}
            this.getActivityList();
        }
        if (workFlowDetails.IsApproval) {

            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            var conditionDetails = [];
            var workFlowCondition = [];
            conditionDetails.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsApprovePanel: true, IsAllowOtherBranchUser: false });
            workFlowCondition.push({ InitiatorId: workFlowDetails.InitiatorId, ActivityId: workFlowDetails.NextActivityId, IsRejectPanel: true, IsAllowOtherBranchUser: false });
            controllerScope.workFlowConditionDetails.Permission = conditionDetails[0];
            controllerScope.workFlowCondition.Permission = workFlowCondition[0];
            //controllerScope.workFlowConditionDetails.Permission.push(workFlowDetails.RoleToId);

            controllerScope.workFlowDetails.Permission.IsReview = false;
            controllerScope.isAllowBoolenCondition = false;
            controllerScope.workFlowPanelActionPanel = true;
            controllerScope.isSubmitButtonEnable = true;

            //if (controllerScope.isEditInformation) {

            //}
            controllerScope.isDisplayCondiotionPanel = true;
            controllerScope.isWorkFlowPanelView = true;
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.isCheckedApproval = false;
            //if (controllerScope.attributeCollection.length == 0) {
            //    for (var j = 0; j < controllerScope.activityCollection.length; j++) {

            //        if (controllerScope.activityCollection[j].IsCondition == true) {
            //            controllerScope.activityCollection.splice(j);
            //            break;

            //        }
            //    }

            //}

        } else {
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowPanelActionPanel = false;
            controllerScope.isWorkFlowPanelView = false;
            controllerScope.isSubmitButtonEnable = false;
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.isSubmitButtonEnabled = false;
            controllerScope.isCheckedApproval = false;
            if (controllerScope.workFlowDetails.Permission.IsClosed) {
                controllerScope.isAssignedRoleDisabled = true;
                controllerScope.isCheckedApproval = false;
            } else {
                controllerScope.isAssignedRoleDisabled = false;
                controllerScope.isCheckedApproval = true;
            }
            controllerScope.isAllowBoolenCondition = false;
        }
        this.$log.log("check condition", workFlowDetails);
    }

    private saveWorkFlowDetails(workFlowDetails, workFlowCondition, workFlowConditionDetails, reviewCollectionDetails, conditionalOperatorCollection) {
        var controllerScope = this.$scope;

        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var permissionDetails = [];
        if (workFlowDetails.Permission.IsCondition) {
            // workFlowDetails.Permission.Children = null;
            workFlowDetails.Permission.ConditionalOperator = conditionalOperatorCollection;
            permissionDetails.push(workFlowDetails.Permission);
        } else {
            permissionDetails.push(workFlowDetails.Permission);
        }

        if (controllerScope.workFlowPanelActionPanel) {
            permissionDetails.push(workFlowCondition.Permission);
            permissionDetails.push(workFlowConditionDetails.Permission);
        } else {

            permissionDetails.push(reviewCollectionDetails.Permission);
        }
        var workFlowAction = new Model.WorkFlow();
        workFlowAction.WorkFlowDetailParentId = workFlowDetails.WorkFlowDetailParentId;
        workFlowAction.PermissionId = workFlowDetails.PermissionId;
        workFlowAction.WorkFLowName = workFlowDetails.WorkFLowName;
        workFlowAction.ActivityId = workFlowDetails.Permission.ActivityId;
        workFlowAction.Permission = permissionDetails;
        workFlowAction.workFlowActionId = workFlowDetails.workFlowActionId;
        var promise = this.workFlowService.saveWorkFlowDetails(workFlowAction);
        promise.then((result) => {
            controllerScope.isWorkFlowNameDisabled = false;
            controllerScope.isAllowOtherWorkFlowCondition = false;
            controllerScope.conditionalOperatorCollection = [];
            controllerScope.workFlowDetails.Permission.ConditionalOperator = "";
            controllerScope.isOperatorPanelVisible = false;
            controllerScope.isReviewEnabled = false;
            controllerScope.isApproveEnabled = false;
            this.$log.log("workFlow save succesfully", result);
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isWorkFlowPanelView = false;
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowDetails.Permission = [];
            controllerScope.isConditionOptioShow = false;
            controllerScope.isParentAction = false;
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            //if (controllerScope.isEditWorkFlow) {
            //   // this.getWorkFlowDetailTreeViewByActivityId(result.WorkFlowDetailParentId);
            //    controllerScope.isEditWorkFlow = false;
            //  ///  controllerScope.showDetails = true;
            //} else {

            //    this.getWorkFlowDetailTreeViewByActivityId(result.PermissionId);
            //}
            if (controllerScope.isEditInformation) {
                controllerScope.showDetails = true;
            }
            // controllerRootScope.isLoading = false;
            controllerScope.workFlowPanelActionPanel = false;
            controllerScope.isDeleteButtonVisible = false;
            //controllerScope.workFlowPanelActionPanel2 = false;
            controllerScope.isSubmitButtonEnable = false;
            controllerRootScope.isLoading = false;
            controllerScope.workFlowDetails = new Model.WorkFlow();
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.reviewCollectionDetails = new Model.WorkFlow();
            controllerScope.isModuleName = false;
            controllerScope.isShowCoditionalCheckBox = false;

            // controllerScope.isSubmitButtonEnable = false;
            //   controllerScope.isDisplayCondiotionPanel = false;
            //    controllerScope.isWorkFLowButtonEnable = false;

            controllerScope.isEditInformation = false;
            controllerScope.workFlowPanelActionPanel = false;
            if (this.$routeParams.id != null && this.$routeParams.id != "") {
                this.editWorkFlowInformationById(result.workFlowActionId);
            } else {
                this.getWorkFlowDetailTreeViewByActivityId(result.PermissionId);
            }

        }).catch((error) => {
            if (error.data == "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                this.openWarningDialogBox();
                controllerRootScope.isLoading = false;
            }

        });
        this.$log.log(workFlowDetails);
    }

    private getWorkFlowDetailsForTreeViewByActivityId(permissionId) {

        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.stepList = [];
        var promise = this.workFlowService.getWorkFlowDetailsForTreeViewByActivityId(permissionId);
        promise.then((result) => {
            this.$log.log("work flow tree View", result);
            //this.getWorkFlowDetailsForTreeViewByActivityId(result.ActivityId);
            //this.$location.path("/WorkFlowList");


            for (var i = 0; i < result.length; i++) {
                controllerScope.stepList.push(result[i]);

            }
            controllerScope.isExpand = true;
            controllerRootScope.isLoading = false;
        });
    }
    private cancelWorkFlow() {
        var controllerScope = this.$scope;
        if (this.$routeParams.id != null && this.$routeParams.id != "") {
            this.$location.path("/WorkFlowList");
        } else {
            // controllerScope.isAddWorkFlow = true;
            controllerScope.isModuleName = false;
            controllerScope.isWorkFlowPanelDisplay = false;
            controllerScope.workFlowDetails = new Model.WorkFlow();
            controllerScope.workFlowConditionDetails = new Model.WorkFlow();
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.workFlowCondition = new Model.WorkFlow();
            controllerScope.reviewCollectionDetails = new Model.WorkFlow();
            controllerScope.isSubmitButtonEnable = false;
            controllerScope.isDisplayCondiotionPanel = false;
            controllerScope.isWorkFlowPanelView = false;
            controllerScope.isWorkFLowButtonEnable = false;
            controllerScope.isParentAction = false;
            controllerScope.workFlowPanelActionPanel = false;
            this.$location.path("/WorkFlowList");
        }

        //controllerScope.isSubmitButtonEnable = false;
        // controllerScope.workFlowPanelActionPanel1 = false;
        // controllerScope.workFlowPanelActionPanel2 = false;
    }

    private clearInformation() {
        this.$route.reload();
    }
    private onTruePermissionChangeEvent(permission, workFlowDetails) {
        var controllerScope = this.$scope;
        var that = this;
        for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            if (controllerScope.isAllowAddCondtion) {
                controllerScope.isSubmitButtonEnabled = true;
            } else {
                controllerScope.isSubmitButtonEnabled = false;
            }

            if (controllerScope.customActivityCollection[i].PermissionId == permission.PermissionId) {
                if (controllerScope.customActivityCollection[i].IsChecked) {
                    controllerScope.workFlowConditionDetails.Permission.AssignedId = workFlowDetails.InitiatorId;
                    controllerScope.isAcceptRoleDisabled = true;
                    controllerScope.isTrueCondtionAllowOtherWorkFlow = false;
                    controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFLow = false;
                    // controllerScope.isOnTrueAllowWorkFlowName = false;
                    controllerScope.workFlowConditionDetails.Permission.OtherWorkFlowId = "";
                    break;
                }
                else if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                    controllerScope.workFlowConditionDetails.Permission.AssignedId = "";
                    controllerScope.isAcceptRoleDisabled = true;
                    controllerScope.isTrueCondtionAllowOtherWorkFlow = true;
                    controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFLow = true;
                    if (that.$routeParams.id != null && that.$routeParams.id != "") {
                        //this.editWorkFlowInformationById(this.$routeParams.id);

                        for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
                            if (controllerScope.workFlowCollection[k].WorkFlowId == parseInt(this.$routeParams.id)) {
                                controllerScope.workFlowCollection.splice(k, 1);
                            }
                        }

                    }
                    //  controllerScope.isOnTrueAllowWorkFlowName = true;
                    controllerScope.workFlowConditionDetails.Permission.OtherWorkFlowId = "";

                    break;
                }
                else {
                    controllerScope.workFlowConditionDetails.Permission.AssignedId = "";
                    controllerScope.isAcceptRoleDisabled = false;
                    controllerScope.isTrueCondtionAllowOtherWorkFlow = false;
                    controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFLow = false;
                    //controllerScope.isOnTrueAllowWorkFlowName = false;
                    controllerScope.workFlowConditionDetails.Permission.OtherWorkFlowId = "";
                }
            }
        }
    }

    private onFalsePermissionChangeEvent(permission, workFlowDetails) {
        var controllerScope = this.$scope;
        var that = this;
        for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {

            if (controllerScope.isAllowAddCondtion) {
                controllerScope.isSubmitButtonEnabled = true;
            } else {
                controllerScope.isSubmitButtonEnabled = false;
            }
            if (controllerScope.customActivityCollection[i].PermissionId == permission.PermissionId) {
                if (controllerScope.customActivityCollection[i].IsChecked) {
                    controllerScope.workFlowCondition.Permission.AssignedId = workFlowDetails.InitiatorId;
                    controllerScope.isRejectRoleDisabled = true;
                    controllerScope.isFalseCondtionAllowOtherWorkFlow = false;
                    controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFLow = false;
                    //controllerScope.isOnFalseAllowWorkFlowName = false;
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                    break;
                }
                else if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                    controllerScope.workFlowCondition.Permission.AssignedId = "";
                    controllerScope.isRejectRoleDisabled = true;
                    controllerScope.isFalseCondtionAllowOtherWorkFlow = true;
                    controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFLow = true;
                    if (that.$routeParams.id != null && that.$routeParams.id != "") {
                        //this.editWorkFlowInformationById(this.$routeParams.id);

                        for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
                            if (controllerScope.workFlowCollection[k].WorkFlowId == parseInt(this.$routeParams.id)) {
                                controllerScope.workFlowCollection.splice(k, 1);
                            }
                        }

                    }
                    // controllerScope.isOnFalseAllowWorkFlowName = true;
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                    break;
                }
                else {
                    controllerScope.workFlowCondition.Permission.AssignedId = "";
                    controllerScope.isRejectRoleDisabled = false;
                    controllerScope.isFalseCondtionAllowOtherWorkFlow = false;
                    controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFLow = false;
                    // controllerScope.isOnFalseAllowWorkFlowName = false;
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                }
            }
        }
    }

    private onAcceptPermissionChangeEvent(permission, workFlowDetails) {
        var controllerScope = this.$scope;
        var that = this;
        for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            controllerScope.isSubmitButtonEnabled = true;
            if (controllerScope.customActivityCollection[i].PermissionId == permission.PermissionId) {
                if (controllerScope.customActivityCollection[i].IsChecked) {
                    controllerScope.workFlowConditionDetails.Permission.AssignedId = workFlowDetails.InitiatorId;
                    controllerScope.isAcceptRoleDisabled = true;
                    controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFLow = false;
                    controllerScope.isAcceptCondtionAllowOtherWorkFlow = false;
                    // controllerScope.isOnAcceptAllowWorkFlowName = false;
                    controllerScope.workFlowConditionDetails.Permission.OtherWorkFlowId = "";
                    break;
                }
                else if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                    controllerScope.workFlowConditionDetails.Permission.AssignedId = "";
                    controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFLow = true;
                    controllerScope.isAcceptRoleDisabled = true;
                    controllerScope.isAcceptCondtionAllowOtherWorkFlow = true;
                    if (that.$routeParams.id != null && that.$routeParams.id != "") {
                        //this.editWorkFlowInformationById(this.$routeParams.id);

                        for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
                            if (controllerScope.workFlowCollection[k].WorkFlowId == parseInt(this.$routeParams.id)) {
                                controllerScope.workFlowCollection.splice(k, 1);
                            }
                        }

                    }
                    //controllerScope.isOnAcceptAllowWorkFlowName = true;
                    controllerScope.workFlowConditionDetails.Permission.OtherWorkFlowId = "";
                    break;
                }
                else {
                    controllerScope.workFlowConditionDetails.Permission.AssignedId = "";
                    controllerScope.isAcceptRoleDisabled = false;
                    controllerScope.workFlowConditionDetails.Permission.IsAllowOtherWorkFLow = false;
                    controllerScope.isAcceptCondtionAllowOtherWorkFlow = false;
                    //  controllerScope.isOnAcceptAllowWorkFlowName = false;
                    controllerScope.workFlowConditionDetails.Permission.OtherWorkFlowId = "";
                }
            }
        }
    }

    private onRejectPermissionChangeEvent(permission, workFlowDetails) {
        var that = this;
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            controllerScope.isSubmitButtonEnabled = true;
            if (controllerScope.customActivityCollection[i].PermissionId == permission.PermissionId) {
                if (controllerScope.customActivityCollection[i].IsChecked) {
                    controllerScope.workFlowCondition.Permission.AssignedId = workFlowDetails.InitiatorId;
                    controllerScope.isRejectRoleDisabled = true;
                    controllerScope.isRejectCondtionAllowOtherWorkFlow = false;
                    controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFLow = false;
                    // controllerScope.isOnRejectAllowWorkFlowName = false;
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                    break;
                }
                else if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                    controllerScope.workFlowCondition.Permission.AssignedId = "";
                    controllerScope.isRejectRoleDisabled = true;
                    controllerScope.isRejectCondtionAllowOtherWorkFlow = true;
                    controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFLow = true;
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                    //  controllerScope.isOnRejectAllowWorkFlowName = true;
                    if (that.$routeParams.id != null && that.$routeParams.id != "") {
                        //this.editWorkFlowInformationById(this.$routeParams.id);

                        for (var k = 0; k < controllerScope.workFlowCollection.length; k++) {
                            if (controllerScope.workFlowCollection[k].WorkFlowId == parseInt(this.$routeParams.id)) {
                                controllerScope.workFlowCollection.splice(k, 1);
                            }
                        }

                    }
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                    break;
                }
                else {
                    controllerScope.workFlowCondition.Permission.AssignedId = "";
                    controllerScope.isRejectRoleDisabled = false;
                    controllerScope.isRejectCondtionAllowOtherWorkFlow = false;
                    controllerScope.workFlowCondition.Permission.IsAllowOtherWorkFLow = false;
                    // controllerScope.isOnRejectAllowWorkFlowName = false;
                    controllerScope.workFlowCondition.Permission.OtherWorkFlowId = "";
                }
            }
        }
    }

    private onReviewPermissionChangeEvent(permission, workFlowDetails) {
        var controllerScope = this.$scope;
        var that = this;
        for (var i = 0; i < controllerScope.customActivityCollection.length; i++) {
            controllerScope.isSubmitButtonEnabled = true;
            if (controllerScope.customActivityCollection[i].PermissionId == permission.PermissionId) {
                if (controllerScope.customActivityCollection[i].IsChecked) {
                    controllerScope.reviewCollectionDetails.Permission.AssignedId = workFlowDetails.InitiatorId;
                    controllerScope.reviewCollectionDetails.Permission.IsAllowOtherWorkFLow = false;
                    controllerScope.isReviewCondtionAllowOtherWorkFlow = false;
                    controllerScope.isReviewRoleDisabled = true;
                    //   controllerScope.isOnReviewAllowWorkFlowName = false;
                    controllerScope.reviewCollectionDetails.Permission.OtherWorkFlowId = "";
                    break;
                }
                else if (controllerScope.customActivityCollection[i].IsAllowOtherWorkFLow) {
                    controllerScope.reviewCollectionDetails.Permission.AssignedId = "";
                    controllerScope.isReviewRoleDisabled = true;
                    controllerScope.isReviewCondtionAllowOtherWorkFlow = true;
                    controllerScope.reviewCollectionDetails.Permission.IsAllowOtherWorkFLow = true;
                    //  controllerScope.isOnReviewAllowWorkFlowName = true;
                    controllerScope.reviewCollectionDetails.Permission.OtherWorkFlowId = "";
                    break;
                }
                else {
                    controllerScope.reviewCollectionDetails.Permission.AssignedId = "";
                    controllerScope.isReviewRoleDisabled = false;
                    controllerScope.isReviewCondtionAllowOtherWorkFlow = false;
                    controllerScope.reviewCollectionDetails.Permission.IsAllowOtherWorkFLow = false;
                    //  controllerScope.isOnReviewAllowWorkFlowName = false;
                    controllerScope.reviewCollectionDetails.Permission.OtherWorkFlowId = "";
                }
            }
        }
    }

    private getChildWorkFlow(workFlowActivityId) {
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

    private checkActivityCloseOrNot(activityId) {
        var controllerScope = this.$scope;

        for (var i = 0; i < controllerScope.activityCollection.length; i++) {

            if (controllerScope.activityCollection[i].PermissionId == activityId) {

                if (controllerScope.activityCollection[i].IsChecked) {
                    //  controllerScope.workFlowCondition.Permission.AssignedId = workFlowDetails.InitiatorId;
                    //controllerScope.isReviewRoleDisabled = true;
                    var workFlowDetails = controllerScope.workFlowDetails;
                    controllerScope.workFlowDetails.Permission.IsClosed = true;
                    controllerScope.workFlowDetails.Permission.IsCondition = false;
                    controllerScope.isSubmitButtonEnabled = true;
                    controllerScope.isAssignedRoleDisabled = true;
                    controllerScope.isCheckedApproval = false;
                    controllerScope.isDisplayCondiotionPanel = false;
                    controllerScope.workFlowDetails.Permission.AssignedId = "";
                    controllerScope.workFlowDetails.Permission.InitiatorId = "";
                    controllerScope.isCoditionalOperator = false;
                    if (controllerScope.isEditInformation) {
                        controllerScope.isAssignedRoleDisabled = false;
                    } else {
                        controllerScope.isInitiatorRoleDisabled = false;
                    }

                    controllerScope.isSubmitButtonEnable = false;
                    break;
                }
                else if (controllerScope.activityCollection[i].IsCondition) {
                    controllerScope.workFlowDetails.Permission.IsCondition = true;
                    controllerScope.workFlowDetails.Permission.IsClosed = false;
                    //controllerScope.isDisplayCondiotionPanel = true;
                    //controllerScope.isCoditionalOperator = true;
                    //controllerScope.isInitiatorRoleDisabled = false;
                    if (controllerScope.isEditInformation) {
                        controllerScope.isAssignedRoleDisabled = false;
                        controllerScope.isShowCoditionalCheckBox = false;
                    } else {
                        controllerScope.isInitiatorRoleDisabled = false;
                    }
                    controllerScope.isSubmitButtonEnabled = false;
                    controllerScope.workFlowDetails.Permission.AssignedId = "";
                    controllerScope.workFlowDetails.Permission.InitiatorId = "";
                    //controllerScope.workFlowDetails.Permission.InitiatorId = "";
                    //controllerScope.isAssignedRoleDisabled = false;
                    controllerScope.isSubmitButtonEnable = false;

                    if (this.$routeParams.id != null && this.$routeParams.id != "") {
                        if (controllerScope.isParentAction) {
                            controllerScope.isShowCoditionalCheckBox = false;
                        }
                    }

                    break;
                }
                else {
                    //controllerScope.workFlowCondition.Permission.AssignedId = "";
                    //controllerScope.isReviewRoleDisabled = false;
                    controllerScope.workFlowDetails.Permission.IsClosed = false;
                    controllerScope.workFlowDetails.Permission.IsCondition = false;
                    controllerScope.workFlowDetails.Permission.AssignedId = "";
                    controllerScope.workFlowDetails.Permission.InitiatorId = "";
                    // controllerScope.workFlowDetails.Permission.InitiatorId = "";
                    //controllerScope.isAssignedRoleDisabled = false;
                    controllerScope.isSubmitButtonEnabled = false;
                    controllerScope.isCheckedApproval = true;
                    controllerScope.isDisplayCondiotionPanel = false;
                    controllerScope.isCoditionalOperator = false;
                    if (controllerScope.isEditInformation) {
                        controllerScope.isAssignedRoleDisabled = false;
                    } else {
                        controllerScope.isInitiatorRoleDisabled = false;
                    }
                    // controllerScope.isInitiatorRoleDisabled = false;
                    controllerScope.isSubmitButtonEnable = false;
                }
            }
        }
    }

    private openWarningDialogBox() {
        var controllerScope = this.$scope;
        this.warningDialogModel = this.$modal.open({
            templateUrl: 'warningConfirmationDialog',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    private closeWarningDialogBox() {
        var controllerScope = this.$scope;
        controllerScope.isInitiatorRoleDisabled = false;
        controllerScope.isWorkFlowPanelView = false;
        controllerScope.isInitiateActivityEnabled = false;
        this.warningDialogModel.dismiss('cancel');
    }

    private deleteWorkFlowInformation(workflowDetails) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.workFlowService.deleteWorkFlowInformation(workflowDetails.workFlowActionId);
        promise.then((result) => {
            this.$log.log("Delete information successfully");
            controllerRootScope.isLoading = false;
            controllerScope.isNextActivityDisabled = false;
            this.$route.reload();
            //  this.getWorkFlowDetailTreeViewByActivityId(workflowDetails.workFlowActionId);

            //controllerScope.isDisplayCondiotionPanel = false;
            //controllerScope.isWorkFLowButtonEnable = false;
            //controllerScope.workFlowPanelActionPanel = false;
            //controllerScope.isWorkFlowPanelView = false;
            //controllerScope.isSubmitButtonEnable = false;
            //controllerScope.workFlowConditionDetails = new Model.workFlow();
            //controllerScope.workFlowCondition = new Model.workFlow();
            //controllerScope.isSubmitButtonEnabled = false;
            //controllerScope.isCheckedApproval = true;
            //controllerScope.isDisplayCondiotionPanel = false;
            //controllerScope.isWorkFLowButtonEnable = false;
            //controllerScope.reviewCollectionDetails = new Model.workFlow();
            //controllerScope.workFlowDetails.Permission.IsReview = false;
            //controllerScope.workFlowDetails.Permission.IsApproval = false;
            //controllerScope.workFlowDetails.Permission.IsCondition = false;
            //if (controllerScope.workFlowDetails.Permission.IsClosed) {
            //    controllerScope.isAssignedRoleDisabled = true;
            //    controllerScope.isCheckedApproval = false;
            //    controllerScope.isDisplayCondiotionPanel = false;
            //    controllerScope.isCoditionalOperator = false;
            //}
            //controllerScope.isCoditionalOperator = false;

            //controllerScope.isCheckBoxVisible = false;

            this.closeDeleteWorkFlowDialogDialogBox();

        }).catch((error) => {
            this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(this.apiPath);

        });
    }

    private closeDeleteWorkFlowDialogDialogBox() {
        this.deleteWorkFLowModel.dismiss('cancel');
    }
    private openDeleteWorkFlowDialogbox(workflowdetails) {
        var controllerScope = this.$scope;
        this.deleteWorkFLowModel = this.$modal.open({
            templateUrl: 'deleteWorkFLowConfirmationDialog',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    private changeActivityName(activityId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        // this.getAllActivityList();
        controllerRootScope.isLoading = true;
        controllerScope.attributeCollection = [];
        var attributeCollection = controllerScope.attributeCollection;
        //getvariableListByActivityId ;
        var promise = this.workFlowService.getAttributeListByActivityId(activityId);
        promise.then((result) => {
            this.$log.log("change activity name successfully", result.length);

            if (result.length == 0) {
                controllerScope.isNextActivityDisabled = false;
                for (var k = 0; k < controllerScope.activityCollection.length; k++) {

                    if (controllerScope.activityCollection[k].IsAllowOtherWorkFLow == true) {
                        controllerScope.activityCollection.splice(k, 1);
                        break;

                    }
                }
                controllerRootScope.isLoading = false;
            } else {
                this.$log.log("get variable list succssfully", result);
                for (var i = 0; i < result.length; i++) {
                    controllerScope.attributeCollection.push(result[i]);
                }
                for (var p = 0; p < controllerScope.activityCollection.length; p++) {

                    if (controllerScope.activityCollection[p].IsAllowOtherWorkFLow == true) {
                        controllerScope.activityCollection.splice(p, 1);
                        break;

                    }
                }


                controllerScope.otherAttributeCollection = controllerScope.attributeCollection;
                controllerScope.isNextActivityDisabled = false;

                controllerRootScope.isLoading = false;
            }
            if (controllerScope.permissionCollection.length != 0) {

                for (var j = 0; j < controllerScope.permissionCollection.length; j++) {
                    if (controllerScope.permissionCollection[j].PermissionId == activityId) {
                        if (controllerScope.permissionCollection[j].IsAllowOtherBranchUser) {
                            controllerScope.isAllowOtherBranchUser = true;
                        } else {
                            controllerScope.isAllowOtherBranchUser = false;
                        }
                        break;
                    }
                }
            }
            this.getAllBoolenOperatorListByActivityId(activityId);
        });
    }

    private changeAttributeValue(value) {
        var controllerScope = this.$scope;
        controllerScope.isDisabledVariableValue = false;
        controllerScope.otherAttributeCollection = [];
        //otherAttributeCollection
        //VariableName as attribute in attributeCollection
        if (controllerScope.isBoolenCondtion) {
            controllerScope.isDisabledAddConditionalButton = false;
        } else {


            for (var i = 0; i < controllerScope.attributeCollection.length; i++) {
                if (controllerScope.attributeCollection[i].VariableName != value) {
                    controllerScope.otherAttributeCollection.push(controllerScope.attributeCollection[i]);
                }
            }
        }

    }

    //private changeBoolenAttributeValue(value) {
    //    var controllerScope = this.$scope;
    //    controllerScope.isDisabledVariableValue = false;
    //    controllerScope.boolenAttributeCollection = [];
    //    //otherAttributeCollection
    //    //VariableName as attribute in attributeCollection
    //    for (var i = 0; i < controllerScope.boolenAttributeCollection.length; i++) {
    //        if (controllerScope.boolenAttributeCollection[i].VariableName != value) {
    //            controllerScope.otherBoolenAttributeCollection.push(controllerScope.boolenAttributeCollection[i]);
    //        }
    //    }
    //}

    //private removeBoolenConditionalOperator(index) {
    //    var controllerScope = this.$scope;
    //    if (controllerScope.isOperatorPanelVisible) {
    //        if (controllerScope.conditionalOperatorCollection[index].IsActiveConditional) {

    //            var promise = this.workFlowService.deleteConditionalOperator(controllerScope.conditionalOperatorCollection[index].ConditionalOperatorId);
    //            promise.then((result) => {
    //                this.$log.log("Delete conditional operator successfully");
    //                controllerScope.conditionalOperatorCollection.splice(index, 1);
    //                controllerScope.isDisabledAddConditionalButton = true;
    //                controllerScope.isDisabledVariableValue = true;
    //                if (controllerScope.conditionalOperatorCollection.length == 0) {
    //                    controllerScope.isConditionOptioShow = false;
    //                    controllerScope.isSubmitButtonEnabled = false;
    //                    controllerScope.isConditonalOperatorDisadbled = false;
    //                } else {
    //                    controllerScope.isConditionOptioShow = true;
    //                    controllerScope.isSubmitButtonEnabled = true;
    //                }


    //                controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
    //            });
    //        } else {
    //            controllerScope.conditionalOperatorCollection.splice(index, 1);
    //            controllerScope.isDisabledAddConditionalButton = true;
    //            controllerScope.isDisabledVariableValue = true;
    //            //controllerScope.isConditionOptioShow = false;
    //            //controllerScope.isSubmitButtonEnabled = false;
    //            controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
    //            if (controllerScope.conditionalOperatorCollection.length == 0) {
    //                controllerScope.isConditionOptioShow = false;
    //                controllerScope.isSubmitButtonEnabled = false;
    //                controllerScope.isConditonalOperatorDisadbled = false;
    //            } else {
    //                controllerScope.isConditionOptioShow = true;
    //                controllerScope.isSubmitButtonEnabled = true;
    //            }
    //        }

    //    } else {
    //        controllerScope.conditionalOperatorCollection.splice(index, 1);
    //        controllerScope.isDisabledAddConditionalButton = true;
    //        controllerScope.isDisabledVariableValue = true;
    //        //controllerScope.isConditionOptioShow = false;
    //        //controllerScope.isSubmitButtonEnabled = false;
    //        controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
    //        if (controllerScope.conditionalOperatorCollection.length == 0) {
    //            controllerScope.isConditionOptioShow = false;
    //            controllerScope.isSubmitButtonEnabled = false;
    //            controllerScope.isConditonalOperatorDisadbled = false;
    //        } else {
    //            controllerScope.isConditionOptioShow = true;
    //            controllerScope.isSubmitButtonEnabled = true;
    //        }
    //    }
    //}
    private removeConditionalOperator(index) {
        var controllerScope = this.$scope;
        if (controllerScope.isOperatorPanelVisible) {
            if (controllerScope.conditionalOperatorCollection[index].IsActiveConditional) {

                var promise = this.workFlowService.deleteConditionalOperator(controllerScope.conditionalOperatorCollection[index].ConditionalOperatorId);
                promise.then((result) => {
                    this.$log.log("Delete conditional operator successfully");
                    controllerScope.conditionalOperatorCollection.splice(index, 1);
                    controllerScope.isDisabledAddConditionalButton = true;
                    controllerScope.isDisabledVariableValue = true;
                    if (controllerScope.conditionalOperatorCollection.length == 0) {
                        controllerScope.isConditionOptioShow = false;
                        controllerScope.isSubmitButtonEnabled = false;
                        controllerScope.isConditonalOperatorDisadbled = false;
                        controllerScope.conditionalOperatorCollection = [];
                    } else {
                        controllerScope.isConditionOptioShow = true;
                        controllerScope.isSubmitButtonEnabled = true;
                    }


                    controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
                });
            } else {
                controllerScope.conditionalOperatorCollection.splice(index, 1);
                controllerScope.isDisabledAddConditionalButton = true;
                controllerScope.isDisabledVariableValue = true;
                //controllerScope.isConditionOptioShow = false;
                //controllerScope.isSubmitButtonEnabled = false;
                controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
                if (controllerScope.conditionalOperatorCollection.length == 0) {
                    controllerScope.isConditionOptioShow = false;
                    controllerScope.isSubmitButtonEnabled = false;
                    controllerScope.isConditonalOperatorDisadbled = false;
                    controllerScope.conditionalOperatorCollection = [];
                } else {
                    controllerScope.isConditionOptioShow = true;
                    controllerScope.isSubmitButtonEnabled = true;
                }
            }

        } else {
            controllerScope.conditionalOperatorCollection.splice(index, 1);
            controllerScope.isDisabledAddConditionalButton = true;
            controllerScope.isDisabledVariableValue = true;
            //controllerScope.isConditionOptioShow = false;
            //controllerScope.isSubmitButtonEnabled = false;
            controllerScope.workFlowDetails.Permission.ConditionalOperator.Condition = "";
            if (controllerScope.conditionalOperatorCollection.length == 0) {
                controllerScope.isConditionOptioShow = false;
                controllerScope.isSubmitButtonEnabled = false;
                controllerScope.isConditonalOperatorDisadbled = false;
            } else {
                controllerScope.isConditionOptioShow = true;
                controllerScope.isSubmitButtonEnabled = true;
            }
        }


    }

    private addConditionalOperator(conditionInfo) {
        var controllerScope = this.$scope;
        //workFlowDetails.Permission.ConditionalOperator.Operator

        controllerScope.isShowConditionalOperatorCollection = true;
        conditionInfo.IsBoolenCondtion = controllerScope.isBoolenCondtion;
        if (controllerScope.isOperatorPanelVisible) {
            controllerScope.conditionalOperatorCollection.push(conditionInfo);
            controllerScope.workFlowDetails.Permission.ConditionalOperator = "";
            controllerScope.isDisabledAddConditionalButton = true;
            controllerScope.isDisabledVariableValue = true;
            controllerScope.isConditionOptioShow = true;
            controllerScope.isConditonalOperatorDisadbled = true;
            controllerScope.isSubmitButtonEnabled = true;
            controllerScope.isAllowAddCondtion = true;
        } else {
            controllerScope.conditionalOperatorCollection.push(conditionInfo);
            controllerScope.workFlowDetails.Permission.ConditionalOperator = "";
            controllerScope.isDisabledAddConditionalButton = true;
            controllerScope.isDisabledVariableValue = true;
            controllerScope.isConditionOptioShow = true;
            controllerScope.isConditonalOperatorDisadbled = true;
            controllerScope.isSubmitButtonEnabled = true;
            controllerScope.isAllowAddCondtion = true;
        }


    }
    private changeConditionValue() {
        var controllerScope = this.$scope;
        controllerScope.isConditonalOperatorDisadbled = false;
        controllerScope.isSubmitButtonEnabled = false;
        controllerScope.isAllowAddCondtion = false;
    }

    private changeAttribute() {
        var controllerScope = this.$scope;
        controllerScope.isDisabledAddConditionalButton = false;


    }

    private checkWorkFlowNameAlreadyExistOrNot(workFlowDetails) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        // this.getAllActivityList();
        if (workFlowDetails.WorkFLowName != null) {

            controllerScope.isWorkFlowNameExist = false;
            controllerRootScope.isLoading = true;
            var promise = this.workFlowService.workFLowNameAlreadyExistOrNot(workFlowDetails);
            promise.then((result) => {
                if (result.status) {
                    controllerScope.isWorkFlowNameExist = true;
                    controllerScope.isWorkFlowTypeDisabled = true;
                    controllerScope.errorMessage = stringConstants.workFlowAlreadyExist;
                    angular.element("html,body").scrollTop(0);
                } else {
                    controllerScope.isWorkFlowNameExist = false;
                    controllerScope.isWorkFlowTypeDisabled = false;
                }
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                this.$log.log(error);
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);

            });
        } else {
            controllerScope.isWorkFlowNameExist = true;
            controllerScope.isWorkFlowTypeDisabled = true;
            controllerScope.errorMessage = stringConstants.workFlowRequried;
        }
    }

    //private changeWorkFlowName(workFlowDetails) {
    //    var controllerScope = this.$scope;         
    //        for (var i = 0; i < controllerScope.workFlowCollection.length; i++) {
    //            if (controllerScope.workFlowCollection[i].WorkFlowId == workFlowDetails) {
    //                //controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;
    //                if (controllerScope.isOnAcceptAllowWorkFlowName) {
    //                    controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;

    //                }
    //                else if (controllerScope.isOnRejectAllowWorkFlowName) {
    //                    controllerScope.workFlowCondition.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;
    //                }
    //                else if (controllerScope.isOnReviewAllowWorkFlowName) {
    //                    controllerScope.reviewCollectionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;
    //                }
    //                else if (controllerScope.isOnTrueAllowWorkFlowName) {
    //                    controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;
    //                }
    //                else {
    //                    controllerScope.workFlowCondition.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;
    //                }
    //                break;
    //            }

    //    }
    //}

    private onAcceptChangeWorkFlowName(workFlowDetails) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.workFlowCollection.length; i++) {
            if (controllerScope.workFlowCollection[i].WorkFlowId == workFlowDetails) {
                //controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;

                controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;


                break;
            }

        }
    }
    private onRejectChangeWorkFlowName(workFlowDetails) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.workFlowCollection.length; i++) {
            if (controllerScope.workFlowCollection[i].WorkFlowId == workFlowDetails) {

                controllerScope.workFlowCondition.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;


                break;
            }

        }
    }
    private onReviewChangeWorkFlowName(workFlowDetails) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.workFlowCollection.length; i++) {
            if (controllerScope.workFlowCollection[i].WorkFlowId == workFlowDetails) {

                controllerScope.reviewCollectionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;

                break;
            }

        }
    }
    private onTrueChangeWorkFlowName(workFlowDetails) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.workFlowCollection.length; i++) {
            if (controllerScope.workFlowCollection[i].WorkFlowId == workFlowDetails) {
                controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;

                break;
            }

        }
    }
    private onFalseChangeWorkFlowName(workFlowDetails) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.workFlowCollection.length; i++) {
            if (controllerScope.workFlowCollection[i].WorkFlowId == workFlowDetails) {
                //controllerScope.workFlowConditionDetails.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;

                controllerScope.workFlowCondition.Permission.AssignedId = controllerScope.workFlowCollection[i].InitiatorId;

                break;
            }

        }
    }

    private getAllBoolenOperatorListByActivityId(activityId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.boolenAttributeCollection = [];
        var promise = this.workFlowService.getAllBoolenOperatorListByActivityId(activityId);
        controllerRootScope.isLoading = true;
        promise.then((result) => {
            console.log("boolen successfull", result);
            if (result.length == 0) {
                controllerScope.isAllowBoolenCondition = false;
                controllerRootScope.isLoading = false;
                if (controllerScope.attributeCollection.length == 0) {
                    for (var j = 0; j < controllerScope.activityCollection.length; j++) {

                        if (controllerScope.activityCollection[j].IsCondition == true) {
                            controllerScope.activityCollection.splice(j, 1);
                            break;

                        }
                    }

                    //for (var s = 0; s < controllerScope.activityCollection.length; s++) {

                    //    if (controllerScope.activityCollection[s].IsAllowOtherWorkFLow == true) {
                    //        controllerScope.activityCollection.splice(s, 1);
                    //        break;

                    //    }
                    //}
                    if (this.$routeParams.id != null && this.$routeParams.id != "") {
                        controllerScope.isShowCoditionalCheckBox = false;
                    }
                } else {
                    if (this.$routeParams.id != null && this.$routeParams.id != "") {
                        controllerScope.isShowCoditionalCheckBox = true;
                    }
                }

            } else {
                controllerScope.isAllowBoolenCondition = true;
                for (var i = 0; i < result.length; i++) {
                    controllerScope.boolenAttributeCollection.push(result[i]);
                }

                controllerScope.activityCollection = [];
                controllerScope.activityCollection = controllerScope.customCollection;
                for (var k = 0; k < controllerScope.activityCollection.length; k++) {

                    if (controllerScope.activityCollection[k].IsAllowOtherWorkFLow == true) {
                        controllerScope.activityCollection.splice(k, 1);
                        break;

                    }
                }
                // 
                if (this.$routeParams.id != null && this.$routeParams.id != "") {

                    if (controllerScope.attributeCollection.length == 0) {

                        controllerScope.isShowCoditionalCheckBox = true;
                    } else {
                        controllerScope.isShowCoditionalCheckBox = true;
                    }
                }
                controllerRootScope.isLoading = false;
            }
        });
    }

    private getAllActivityActionList() {
        var controllerScope = this.$scope;
        //controllerScope.workFlowConditionDetails = new Model.workFlow();
        //controllerScope.workFlowCondition = new Model.workFlow();
        controllerScope.activityCollection = [];
        controllerScope.customActivityCollection = [];
        var promise = this.workFlowService.getAllActivityList();
        promise.then((result) => {
            this.$log.log("get all Activity Successfully", result);
            for (var i = 0; i < result.length; i++) {

                controllerScope.activityCollection.push(result[i]);

                if (!result[i].IsCondition) {
                    controllerScope.customActivityCollection.push(result[i]);

                }

                //  this.getAllWorkFlowNameList();
                //if (result[i].IsChecked) {
                //    controllerScope.workFlowCondition.Permission.NextActivityId = result[i].PermissionId;
                //    controllerScope.workFlowConditionDetails.Permission.NextActivityId = result[i].PermissionId;
                //}
            }

            //if (this.$routeParams.id != null && this.$routeParams.id != "") {
            // //   this.editWorkFlowInformationById(this.$routeParams.id);
            //    for (var k = 0; k < controllerScope.activityCollection.length; k++) {

            //        if (controllerScope.activityCollection[k].IsAllowOtherWorkFLow == true) {
            //            controllerScope.activityCollection.splice(k, 1);
            //            break;

            //        }
            //    }

            //}
        });

    }
}
//  app.controller("dynamicWorkFlowController", dynamicWorkFlowController);
app.controller(dynamicWorkFlowController.controllerId, ['$scope', '$rootScope', '$log', 'workFlowService', 'apiPath', 'statusService', 'RolePermissionService', '$location', '$routeParams', '$modal', '$route', ($scope, $rootScope, $log, workFlowService, apiPath, statusService, rolePermissionService, $location, $routeParams, $modal, $route) => {
    return new dynamicWorkFlowController($scope, $rootScope, $log, workFlowService, apiPath, statusService, rolePermissionService, $location, $routeParams, $modal, $route);
}]);
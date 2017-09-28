interface IsupplierReturnDetailControllerScope extends ng.IScope {
    supplierReturnRequest: Model.SupplierReturnRequest;
    approveSupReturnRequest: Function;
    returnSupReturnRequest: Function;
    cancel: Function;
    getCurrentUser: Function;
    userRoleName: string;
    isApproveVisible: boolean;
    isEditVisible: boolean;
    isDeleteVisible: boolean;
    edit: Function;
    userId: number;
    isCommentVisible: boolean;
    getSupplierReturnRequest: Function;
    rejectSupplierReturnRequest: Function;
    openRejectSRRPopup: Function;
    closeRejectSRRPopup: Function;
    openSummaryCNPopup: Function;
    closeSummaryCNPopup: Function;
    rejectConfirm: any;
    deleteConfirmation: any;
    rejectConfirmation: any;
    deleteConfirmMessage: string;
    printReceipt: Function;
    deleteSupplierReturnRequest: Function;
    resubmitSupReturnRequest: Function;
    receiptDetails: any;
}

interface IsupplierReturnDetailController {

}


class SupplierReturnDetailController implements IsupplierReturnDetailController {
    static controllerId = "SupplierReturnDetailController";
    public rejectSRRPopup;
    public summaryCNPopup;

    constructor(private $scope: IsupplierReturnDetailControllerScope, private $log: ng.ILocaleService, private supplierReturnDetailService: SupplierReturnDetailService, public ngToast, public $rootScope, public apiPath, public $routeParams, public $modal, public $location, public printer, public $filter) {

        this.$scope.supplierReturnRequest = new Model.SupplierReturnRequest();
        this.$scope.approveSupReturnRequest = () => this.approveSupReturnRequest();
        this.$scope.returnSupReturnRequest = () => this.returnSupReturnRequest();
        this.$scope.getSupplierReturnRequest = () => this.getSupplierReturnRequest();
        this.$scope.rejectSupplierReturnRequest = () => this.rejectSupplierReturnRequest();
        this.$scope.cancel = () => this.cancel();
        this.$scope.getCurrentUser = () => this.getCurrentUser();
        this.$scope.isApproveVisible = false;
        this.$scope.isEditVisible = false;
        this.$scope.isDeleteVisible = false;
        this.$scope.edit = () => this.edit();
        this.$scope.isCommentVisible = true;
        this.$scope.receiptDetails = [];
        this.$scope.userId = 0;
        this.$scope.rejectConfirm = stringConstants.rejectConfirm;
        this.$scope.rejectConfirmation = stringConstants.rejectConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.openRejectSRRPopup = () => this.openRejectSRRPopup();
        this.$scope.closeRejectSRRPopup = () => this.closeRejectSRRPopup();
        this.$scope.openSummaryCNPopup = () => this.openSummaryCNPopup();
        this.$scope.closeSummaryCNPopup = () => this.closeSummaryCNPopup();
        this.$scope.resubmitSupReturnRequest = () => this.resubmitSupReturnRequest();
        this.$scope.deleteSupplierReturnRequest = () => this.deleteSupplierReturnRequest();
        this.$scope.printReceipt = (receiptDetails) => this.printReceipt(receiptDetails);
        this.initialize();
    }

    private initialize() {
        this.getCurrentUser();
    }


    private getCurrentUser() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnDetailService.getCurrentUserDetail();
        promise.then((result) => {
            controllerScope.userRoleName = result.rolename;
            controllerScope.userId = result.userId;
            this.getSupplierReturnRequest();
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorFromOurSide
                });
        });
    }


    //used for fetching supplier return request - jj
    private getSupplierReturnRequest() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnDetailService.getSupplierReturnRequest(this.$routeParams.id);
        promise.then((result) => {
            controllerScope.supplierReturnRequest = result;
            controllerScope.supplierReturnRequest.InitiationDate = this.$filter('date')(controllerScope.supplierReturnRequest.InitiationDate, 'dd-MM-yyyy');
            for (let i = controllerScope.supplierReturnRequest.WorkFlowLog.length - 1; i < controllerScope.supplierReturnRequest.WorkFlowLog.length; i++) {
                if (controllerScope.supplierReturnRequest.WorkFlowLog[i].NextActivityId !== 3 && !result.IsRejected && !result.IsDeleted) {
                    if (controllerScope.userRoleName === controllerScope.supplierReturnRequest.WorkFlowLog[i].AssignedRole) {
                        if (controllerScope.supplierReturnRequest.WorkFlowLog[i].IsRejected) {
                            if (controllerScope.userId === result.InitiatorId) {
                                controllerScope.isDeleteVisible = true;
                            }
                            controllerScope.isEditVisible = true;
                            controllerScope.isCommentVisible = true;
                            controllerScope.isApproveVisible = false;
                        }
                        else {
                            controllerScope.isApproveVisible = true;
                            controllerScope.isEditVisible = false;
                        }
                    }
                    else {
                        controllerScope.isCommentVisible = false;
                        controllerScope.isApproveVisible = false;
                        controllerScope.isEditVisible = false;
                    }
                }
                else {
                    controllerScope.isCommentVisible = false;
                    controllerScope.isApproveVisible = false;
                    controllerScope.isEditVisible = false;
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingSRRList
                });
            controllerRootScope.isLoading = false;
        });
    }


    //used to reject supplier return Request - jj
    private rejectSupplierReturnRequest() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closeRejectSRRPopup();
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        let promise = this.supplierReturnDetailService.rejectSupReturnRequest(controllerScope.supplierReturnRequest.SupplierReturnId, controllerScope.supplierReturnRequest.InitiationComment);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.SRRRejectedSuccessfully);
                    this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: result.status
                            });
                        this.cancel();
                    }
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SRRRejectFailed
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to delete supplier return Request - jj
    private deleteSupplierReturnRequest() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closeRejectSRRPopup();
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        let promise = this.supplierReturnDetailService.deleteSupReturnRequest(controllerScope.supplierReturnRequest.SupplierReturnId, controllerScope.supplierReturnRequest.InitiationComment);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.SRRDeletedSuccessfully);
                    this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: result.status
                            });
                        this.cancel();
                    }
                }
                else {
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SRRDeleteFailed
                });
            controllerRootScope.isLoading = false;
        });
    }

    // used for opening the RejectSRRPopup-jj
    private openRejectSRRPopup() {
        let controllerScope = this.$scope;
        this.rejectSRRPopup = this.$modal.open({
            templateUrl: 'RejectSRRPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the RejectSRRPopup-jj
    private closeRejectSRRPopup() {
        this.rejectSRRPopup.dismiss('cancel');
    }

    //used to return Supplier Return Request - jj 
    private returnSupReturnRequest() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        let promise = this.supplierReturnDetailService.approveSupReturnRequest(controllerScope.supplierReturnRequest.RecordId, controllerScope.supplierReturnRequest.InitiationComment, false, controllerScope.supplierReturnRequest.SupplierReturnId);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.SRRReturnSuccessfully);
                    this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: result.status
                            });
                        this.cancel();
                    }
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SRRReturnFailed
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to approve Supplier Return Request - jj
    private approveSupReturnRequest() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        let promise = this.supplierReturnDetailService.approveSupReturnRequest(controllerScope.supplierReturnRequest.RecordId, controllerScope.supplierReturnRequest.InitiationComment, true, controllerScope.supplierReturnRequest.SupplierReturnId);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.SRRApprovalSuccessful);
                    this.cancel();
                }
                else if (result.status === "print") {
                    this.ngToast.create(stringConstants.SRRApprovalSuccessful);
                    let promise = this.supplierReturnDetailService.printReturnReceipt(controllerScope.supplierReturnRequest.InitiationComment, controllerScope.supplierReturnRequest.SupplierReturnId);
                    promise.then((result1) => {
                        controllerScope.receiptDetails = result1;
                        this.openSummaryCNPopup();
                    }).catch((error) => {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.SRRReceiptGenerationFailed
                            });
                        controllerRootScope.isLoading = false;
                    });

                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: result.status
                            });
                        this.cancel();
                    }
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SRRApprovalFailed
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to redirect to Supplier Return Request WorkList page-jj
    private cancel() {
        this.$location.path("/SupplierReturnRequestWorkList");
    }

    //used to redirect to supplier Return request page-jj
    private edit() {
        let controllerScope = this.$scope;
        this.$location.path("/SupplierReturnRequest/" + controllerScope.supplierReturnRequest.SupplierReturnId);
    }


    // used for opening the SummaryCNPopup-jj
    private openSummaryCNPopup() {
        let controllerScope = this.$scope;
        this.summaryCNPopup = this.$modal.open({
            templateUrl: 'SummaryCN',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the SummaryCNPopup-jj
    private closeSummaryCNPopup() {
        this.summaryCNPopup.dismiss('cancel');
    }

    //used to resubmit supplier return request - jj
    private resubmitSupReturnRequest() {
        let id = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        let promise = this.supplierReturnDetailService.resubmitSupReturnRequest(this.$routeParams.id, controllerScope.supplierReturnRequest.InitiationComment);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.SRRResubmitSuccessfully);
                    this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: result.status
                            });
                        this.cancel();
                    }
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.SRRResubmitFailed
                        });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SRRResubmitFailed
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to print receipt - jj
    private printReceipt(receiptDetails) {
        receiptDetails.TotalQuantity = 0;
        receiptDetails.TotalCostPrice = 0;
        this.closeSummaryCNPopup();
        for (let i = 0; i < receiptDetails.SupplierReturnItemAC.length; i++) {
            receiptDetails.SupplierReturnItemAC[i].TotalCostPrice = (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice);
            receiptDetails.TotalQuantity = receiptDetails.TotalQuantity + parseFloat("" + receiptDetails.SupplierReturnItemAC[i].ReturnQuantity);
            receiptDetails.TotalCostPrice = receiptDetails.TotalCostPrice + parseFloat("" + (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice));
        }
        this.printer.print("/Templates/Supplier/SupplierReturnReceipt.html", receiptDetails);
        this.cancel();
    }
}

app.controller(SupplierReturnDetailController.controllerId, ['$scope', '$log', 'SupplierReturnDetailService', 'ngToast', '$rootScope', 'apiPath', '$routeParams', '$modal', '$location', 'printer', '$filter', ($scope, $log, SupplierReturnDetailService, ngToast, $rootScope, apiPath, $routeParams, $modal, $location, printer, $filter) => {
    return new SupplierReturnDetailController($scope, $log, SupplierReturnDetailService, ngToast, $rootScope, apiPath, $routeParams, $modal, $location, printer, $filter);
}]);


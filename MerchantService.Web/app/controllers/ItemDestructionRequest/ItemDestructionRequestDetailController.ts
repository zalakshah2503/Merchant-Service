interface IItemDestructionRequestDetailControllerScope extends ng.IScope {
    itemDestructionRequestDetail: any;
    totalCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItemDestructionRequestCollection: any;
    totalItems: number;
    actionList: any;
    isApproval: boolean;
    approveButtonClick: Function;
    rejectButtonClick: Function;
    returnButtonClick: Function;
    cancleButtonClick: Function;
    ItemDestructionDetailApprovalAC: Model.ItemDestuctionDetailModel;
    isEdit: boolean;
    editButtonEvent: Function;
    supplierName: string;
    creditNoteNumber: string;
    amount: number;
    closeCreditNotePopup: Function;
    clickOnOkButton: Function;
    itemDestructionReceiptDetail: any;
    isDeleted: boolean;
    totalQuantity: number;
    totalCost: number;
    reSubmitEvent: Function;
    rejectItemDestruction: Function;
    closeRejectPopup: Function;
    itemDestructionReceipt: any;
    rejectConfirm: any;
    rejectConfirmation: any;
}

interface IItemDestructionRequestDetailController {

}

class ItemDestructionRequestDetailController implements IItemDestructionRequestDetailController {
    static controllerId = "ItemDestructionRequestDetailController";
    public popupCreditNote;
    public popupRejectItemDestruction;
    constructor(private $scope: IItemDestructionRequestDetailControllerScope, private $log: ng.ILogService, public $rootScope, private ItemDestructionService: ItemDestructionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal, public printer) {
        this.$scope.itemDestructionRequestDetail = [];
        this.$scope.totalItemDestructionRequestCollection = [];
        this.$scope.actionList = [];
        this.$scope.itemDestructionReceiptDetail = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.amount = 0;
        this.$scope.ItemDestructionDetailApprovalAC = new Model.ItemDestuctionDetailModel();
        this.$scope.maxSize = 10;
        this.$scope.currentPage = 1;
        this.$scope.totalQuantity = 0;
        this.$scope.totalCost = 0;
        this.$scope.isEdit = false;
        this.$scope.isDeleted = false;
        this.$scope.isApproval = false;
        this.$scope.approveButtonClick = () => this.approveButtonClick();
        this.$scope.rejectButtonClick = () => this.rejectButtonClick();
        this.$scope.returnButtonClick = () => this.returnButtonClick();
        this.$scope.cancleButtonClick = () => this.cancleButtonClick();
        this.$scope.editButtonEvent = () => this.editButtonEvent();
        this.$scope.closeCreditNotePopup = () => this.closeCreditNotePopup();
        this.$scope.clickOnOkButton = () => this.clickOnOkButton();
        this.$scope.reSubmitEvent = () => this.reSubmitEvent();
        this.$scope.rejectItemDestruction = () => this.rejectItemDestruction();
        this.$scope.closeRejectPopup = () => this.closeRejectPopup();
        this.$scope.itemDestructionReceipt = stringConstants.itemDestructionReceipt;
        this.$scope.rejectConfirm = stringConstants.rejectConfirm;
        this.$scope.rejectConfirmation = stringConstants.rejectConfirmation;
        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.totalItemDestructionRequestCollection.slice(begin, end);
        });
        this.initialization();
    }

    private initialization() {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getItemDestructionList(this.$routeParams.id);
            this.getActionList(this.$routeParams.id);
        }
    }

    //this method used for close the reject item detruction popup. -An
    private closeRejectPopup() {
        this.popupRejectItemDestruction.dismiss('cancel');
    }

    //this method used for open the reject item detruction. -An
    private rejectItemDestruction() {
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        let promise = this.ItemDestructionService.rejectRequest(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.itemDestructionRequestRejectSucessfully);
                    this.$location.path("/ItemDestructionWorkList");
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                }
            }
            this.popupRejectItemDestruction.dismiss('cancel');
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private reSubmitEvent() {
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        let promise = this.ItemDestructionService.reSubmitItemDestruction(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.itemDestructionRequestResubmitSucessfully);
                    this.$location.path("/ItemDestructionWorkList");
                }
                else if (result._isResult === "NotExists") {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                }
            }
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
        this.$rootScope.isLoading = false;
    }

    //This method used for edit button event. -An
    private editButtonEvent() {
        this.$location.path("/ItemDestructionRequest/" + this.$routeParams.id);
    }

    private closeCreditNotePopup() {
        this.popupCreditNote.dismiss('cancel');
    }

    private clickOnOkButton() {
        this.$location.path("/ItemDestructionWorkList");
        this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", this.$scope.itemDestructionReceiptDetail);
        this.popupCreditNote.dismiss('cancel');
    }

    //This method used for approve button click event. -An
    private approveButtonClick() {
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        let promise = this.ItemDestructionService.approveRequest(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result._isResult.IsResult === "NotExists") {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                }
                else {
                    if (result._isResult.IsResult === "true") {
                        if (result._isResult.SupplierName !== undefined && result._isResult.SupplierName !== null && result._isResult.CreditNoteNumber !== undefined && result._isResult.Amount !== undefined
                            && result._isResult.CreditNoteNumber !== null && result._isResult.Amount !== null) {
                            this.$scope.supplierName = result._isResult.SupplierName;
                            this.$scope.creditNoteNumber = result._isResult.CreditNoteNumber;
                            this.$scope.amount = result._isResult.Amount;
                            this.$scope.itemDestructionReceiptDetail = result._isResult;
                            this.creditNotePopup();
                        }
                        else {
                            this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", result._isResult);
                        }
                    }
                    this.ngToast.create(stringConstants.itemDestructionRequestApproveSucessfully);
                    this.$location.path("/ItemDestructionWorkList");
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //Open the credit not popup
    private creditNotePopup() {
        this.popupCreditNote = this.$modal.open({
            templateUrl: 'popupCreditNoteDetail',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    }

    //This method used for return button click event. -An
    private returnButtonClick() {
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        let promise = this.ItemDestructionService.returnRequest(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.itemDestructionRequestReturnSucessfully);
                    this.$location.path("/ItemDestructionWorkList");
                }
                else if (result._isResult === "NotExists") {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This method used for reject button click event. -An
    private rejectButtonClick() {
        this.popupRejectItemDestruction = this.$modal.open({
            templateUrl: 'rejectItemDestructionPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    }

    //This method used for cancel button click event. -An
    private cancleButtonClick() {
        this.$location.path("/ItemDestructionWorkList");
    }

    //This method used for get item destruction list. -An
    private getItemDestructionList(id) {
        this.$rootScope.isLoading = true;
        this.$scope.totalItemDestructionRequestCollection = [];
        let destructionItemList = this.$scope.totalItemDestructionRequestCollection;
        let promise = this.ItemDestructionService.getItemDestructionList(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                this.$scope.totalQuantity = result.TotalQuantity;
                this.$scope.totalCost = result.TotalCostPrice;
                this.$scope.itemDestructionRequestDetail.RequestNo = result.RequestNo;
                this.$scope.itemDestructionRequestDetail.SupplierName = result.SupplierName;
                this.$scope.itemDestructionRequestDetail.SupplierCode = result.SupplierCode;
                this.$scope.itemDestructionRequestDetail.Branch = result.Branch;
                this.$scope.itemDestructionRequestDetail.RequestedDate = result.RequestedDate;
                this.$scope.itemDestructionRequestDetail.Cause = result.Cause;
                this.$scope.itemDestructionRequestDetail.initiatedBy = result.InitiatedBy;
                if (result.IsDeleted) {
                    this.$scope.isDeleted = true;
                }
                else {
                    if (result.IsPandingApproval) {
                        if (result.IsAllowApproval)
                            this.$scope.isApproval = true;
                    }
                    else {
                        if (result.IsAllowApproval)
                            this.$scope.isApproval = true;
                    }
                    if (result.IsClosed) {
                        this.$scope.isApproval = false;
                        this.$scope.isApproval = false;
                        this.$scope.isDeleted = true;
                    }
                    //after approve
                    if (result.IsApproval) {
                        this.$scope.isApproval = true;
                        this.$scope.isEdit = false;
                    }
                    //after reject
                    else if (result.IsReject) {
                        this.$scope.isApproval = false;
                        this.$scope.isDeleted = false;
                        this.$scope.isEdit = true;
                    }
                }

                if (result.listOfItemProfileAC.length > 0) {
                    for (let i = 0; i < result.listOfItemProfileAC.length; i++) {
                        destructionItemList.push(result.listOfItemProfileAC[i]);
                    }
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    this.$scope.totalCollection = destructionItemList.slice(begin, end);
                    /* init pagination with $scope.list */
                    this.$scope.totalItems = this.$scope.totalItemDestructionRequestCollection.length;
                }
            }
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This method used for get action list. -An
    private getActionList(id) {
        let promise = this.ItemDestructionService.getActionList(id);
        promise.then((result) => {
            if (result.length > 0) {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        this.$scope.actionList.push(result[i]);
                    }
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
}

app.controller(ItemDestructionRequestDetailController.controllerId, ['$scope', '$log', '$rootScope', 'ItemDestructionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', ($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) => {
    return new ItemDestructionRequestDetailController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
}]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/supplierpo/supplierpoworklistservice.ts" />

interface IsupplierPOWorkListControllerScope extends ng.IScope {

    getSupplierPOWorkList: Function;
    getSupplierList: Function;
    getBranchList: Function;
    searchSupplierPOWorkList: Function;
    approveSPO: Function;
    reviewSPO: Function;
    rejectSPO: Function;
    cancelSPO: Function;
    deleteSPO: Function;
    submitSPO: Function;
    approveCancelSPO: Function;
    getUserDetail: Function;
    roleName: string;
    userId: number;
    cancel: Function;
    isReviewVisible: any;
    edit: Function;
    receiveSPORedirect: Function;
    send: Function;
    viewDetail: Function;
    getPODetails: Function;
    noPOFound: any;
    getSPOBill: Function;
    verifyBill: Function;
    verifySPO: Function;
    resubmitSPO: Function;
    isResubmitVisible: any;
    displayConfirm: boolean;
    isEditDisplay: boolean;
    branchModel: any;
    poWorkList: any;
    supplierList: any;
    branchList: any;
    poDetail: any;
    poItemList: any;
    spoWorkLog: any;
    comment: any;
    isCanceled: boolean;
    isCancel: boolean;
    isReceiveVisible: boolean;
    savedSPOList: any;
    search: any;
    dateSearch: any;
    openPODeletePopup: Function;
    closePODeletePopup: Function;
    totalCollection: any;
    supplierPOList: any;
    errorMessage: string;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    serachFilter: any;
    entryLimit: any;
    supplierErrorMessageDisplay: boolean;
    supplierPOTotalCollection: any;
    receivePODetails: any;
    billList: any;
    noItemFound: any;
    deleteConfirmMessage: any;
    deleteConfirmation: any;
    isButtonsVisible: boolean;
    //datepicker
    isIssueDateFromPickerOpened: any;
    openIssueDateFromPicker: Function;
    isIssueDateToPickerOpened: any;
    openIssueDateToPicker: Function;
    isDueDateFromPickerOpened: any;
    openDueDateFromPicker: Function;
    isDueDateToPickerOpened: any;
    openDueDateToPicker: Function;
    dateFormat: any;
    clickOnOpenRecivingPopup: Function;
    recevingPurchaseOrderList: any;
    errorMessageDisplayForBlankList: boolean;
    isDisplayRecevingSPOButton: boolean;
    cancelReceivedPurchaseOrderDetail: Function;
}

interface IsupplierPOWorkListController {
}

class SupplierPOWorkListController implements IsupplierPOWorkListController {
    static controllerId = "SupplierPOWorkListController";
    public recevingPurchaseOrderPopup;
    public poDeletePopup;

    constructor(private $scope: IsupplierPOWorkListControllerScope, private $log: ng.ILocaleService, private supplierPOWorkListService: SupplierPOWorkListService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $filter, public $location, public $routeParams, public printer, public $modal) {
        this.$scope.getSupplierPOWorkList = () => this.getSupplierPOWorkList();
        this.$scope.clickOnOpenRecivingPopup = () => this.clickOnOpenRecivingPopup();
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.searchSupplierPOWorkList = () => this.searchSupplierPOWorkList();
        this.$scope.viewDetail = (id) => this.viewDetail(id);
        this.$scope.getPODetails = () => this.getPODetails();
        this.$scope.cancel = () => this.cancel();
        this.$scope.roleName = "";
        this.$scope.userId = 0;
        this.$scope.approveSPO = (Comment, RecordId) => this.approveSPO(Comment, RecordId);
        this.$scope.reviewSPO = (Comment, RecordId) => this.reviewSPO(Comment, RecordId);
        this.$scope.resubmitSPO = () => this.resubmitSPO();
        this.$scope.rejectSPO = (Comment, RecordId) => this.rejectSPO(Comment, RecordId);
        this.$scope.cancelSPO = (Comment, RecordId) => this.cancelSPO(Comment, RecordId);
        this.$scope.approveCancelSPO = (Status) => this.approveCancelSPO(Status);
        this.$scope.edit = (id) => this.edit(id);
        this.$scope.receiveSPORedirect = (id) => this.receiveSPORedirect(id);
        this.$scope.send = (Comment, RecordId) => this.send(Comment, RecordId);
        this.$scope.getSPOBill = (id) => this.getSPOBill(id);
        this.$scope.verifyBill = (id) => this.verifyBill(id);
        this.$scope.verifySPO = (id) => this.verifySPO(id);
        this.$scope.noPOFound = stringConstants.noPOFound;
        this.$scope.deleteSPO = (id) => this.deleteSPO(id);
        this.$scope.submitSPO = (id, comment) => this.submitSPO(id, comment);
        this.$scope.poWorkList = [];
        this.$scope.savedSPOList = [];
        this.$scope.isResubmitVisible = false;
        this.$scope.isButtonsVisible = false;
        this.$scope.displayConfirm = false;
        this.$scope.isCancel = false;
        this.$scope.isCanceled = false;
        this.$scope.isEditDisplay = false;
        this.$scope.isReceiveVisible = false;
        this.$scope.billList = [];
        this.$scope.isReviewVisible = false;
        this.$scope.supplierList = [];
        this.$scope.branchList = [];
        this.$scope.poItemList = [];
        this.$scope.spoWorkLog = [];
        this.$scope.comment = [];
        this.$scope.branchModel = [];
        this.$scope.openPODeletePopup = () => this.openPODeletePopup();
        this.$scope.closePODeletePopup = () => this.closePODeletePopup();
        //string constants
        this.$scope.receivePODetails = stringConstants.receivePODetails;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.supplierPOList = [];
        this.$scope.search = [];
        this.$scope.dateSearch = [];
        this.$scope.supplierPOTotalCollection = [];
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 15;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 15;
        this.$scope.errorMessage = "";
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.supplierList.slice(begin, end);
            //i think the last line shud be like this
        });
        // datepicker
        this.$scope.isIssueDateFromPickerOpened = false;
        this.$scope.openIssueDateFromPicker = (event) => this.openIssueDateFromPicker(event);
        this.$scope.isIssueDateToPickerOpened = false;
        this.$scope.openIssueDateToPicker = (event) => this.openIssueDateToPicker(event);
        this.$scope.isDueDateFromPickerOpened = false;
        this.$scope.openDueDateFromPicker = (event) => this.openDueDateFromPicker(event);
        this.$scope.isDueDateToPickerOpened = false;
        this.$scope.openDueDateToPicker = (event) => this.openDueDateToPicker(event);
        this.$scope.recevingPurchaseOrderList = [];
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.isDisplayRecevingSPOButton = false;
        this.$scope.cancelReceivedPurchaseOrderDetail = () => this.cancelReceivedPurchaseOrderDetail();
        this.initialize();
    }

    private initialize() {
        this.getSupplierList();
        this.getBranchList();
        this.getReceivingPurchaseOrders();
    }

    private getReceivingPurchaseOrders() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (this.$routeParams.id !== undefined && this.$routeParams.id !== null) {
            let promise = this.supplierPOWorkListService.getRecevingPurchaseOrderById(this.$routeParams.id);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    if (result.RecevingPurchaseOrderList.length > 0) {
                        for (let i = 0; i < result.RecevingPurchaseOrderList.length; i++) {
                            this.$scope.recevingPurchaseOrderList.push(result.RecevingPurchaseOrderList[i]);
                        }
                        this.$scope.errorMessageDisplayForBlankList = false;
                    }
                    else
                        this.$scope.errorMessageDisplayForBlankList = true;

                    if (result.IsReceived)
                        this.$scope.isDisplayRecevingSPOButton = true;
                }
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                controllerRootScope.isLoading = false;
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }
    }


    // used to fetch supplier purchase order worklist - jj
    private getSupplierPOWorkList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.supplierPOList = [];
        let supplierPOCollection = controllerScope.supplierPOList;
        let promise = this.supplierPOWorkListService.getSupplierPOWorkList();
        promise.then((result) => {
            let status = "";
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < controllerScope.supplierList.length; j++) {
                        if (controllerScope.supplierList[j].Id === result[i].SupplierId) {
                            result[i].DueDate = new Date(result[i].DueDate).toISOString().substr(0, 10);
                            result[i].IssueDate = new Date(result[i].IssueDate).toISOString().substr(0, 10);
                            if (result[i].IsSubmitted) {
                                supplierPOCollection.push({
                                    Id: result[i].SPOId,
                                    PurchaseOrderNumber: result[i].PurchaseOrderNumber, DueDate: result[i].DueDate, IssueDate: result[i].IssueDate,
                                    SupplierName: controllerScope.supplierList[j].NameEn, SupplierCode: controllerScope.supplierList[j].Code,
                                    BranchName: result[i].BranchName, BranchId: result[i].BranchId, Status: status, WorkFlowLog: result[i].WorkFlowLog,
                                    IsApproved: result[i].IsApproved, IsConfirmed: result[i].IsConfirmed, IsRejected: result[i].IsRejected,
                                    IsCanceled: result[i].IsCanceled, IsCancelApproved: result[i].IsCancelApproved, IsPartiallyReceived: result[i].IsPartiallyReceived,
                                    Action: result[i].Action, IsSubmitted: result[i].IsSubmitted, UserId: result[i].UserId, IsAutomaticSpo: result[i].IsAutomaticSpo
                                });
                            }
                            else {
                                if (controllerScope.userId === result[i].UserId) {
                                    controllerScope.savedSPOList.push({
                                        Id: result[i].SPOId,
                                        PurchaseOrderNumber: result[i].PurchaseOrderNumber, DueDate: result[i].DueDate, IssueDate: result[i].IssueDate,
                                        SupplierName: controllerScope.supplierList[j].NameEn, SupplierCode: controllerScope.supplierList[j].Code,
                                        BranchName: result[i].BranchName, BranchId: result[i].BranchId, Status: status, WorkFlowLog: result[i].WorkFlowLog,
                                        IsApproved: result[i].IsApproved, IsConfirmed: result[i].IsConfirmed, IsRejected: result[i].IsRejected,
                                        IsCanceled: result[i].IsCanceled, IsCancelApproved: result[i].IsCancelApproved, IsPartiallyReceived: result[i].IsPartiallyReceived,
                                        Action: result[i].Action, IsSubmitted: result[i].IsSubmitted, UserId: result[i].UserId, IsAutomaticSpo: result[i].IsAutomaticSpo
                                    });
                                }
                            }
                        }
                    }
                    controllerScope.supplierPOTotalCollection = supplierPOCollection;
                    controllerScope.totalCollection = supplierPOCollection;
                    controllerScope.totalItems = controllerScope.supplierPOList.length;
                }
            }
            controllerRootScope.isLoading = false;;
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    //used to receiving purchase order popup.
    private clickOnOpenRecivingPopup() {
        this.recevingPurchaseOrderPopup = this.$modal.open({
            templateUrl: 'recevingPurchaseOrder',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            scope: this.$scope,
        });


    }


    private cancelReceivedPurchaseOrderDetail() {
        this.recevingPurchaseOrderPopup.dismiss("cancel");
    }

    //used to fetch supplier list - jj
    private getSupplierList() {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        let promise = this.supplierPOWorkListService.getSupplierList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push(result[i]);
                }
            }
            rootScope.isLoading = false;
            this.getUserDetail();
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            rootScope.isLoading = false;
        });
    }

    //used to get branchlist - jj
    private getBranchList() {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        let promise = this.supplierPOWorkListService.getBranchList();
        promise.then((result) => {
            if (result.length === 0) {

            }
            else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
            rootScope.isLoading = false;
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            rootScope.isLoading = false;
        });
    }


    //version 2
    //supplier purchase order worklist search panel. - jj
    private searchSupplierPOWorkList() {
        let controllerScope: any;
        controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        let DueDateFrom;
        let DueDateTo;
        let IssueDateFrom;
        let IssueDateTo;
        let count = 0;
        if (controllerScope.dateSearch.IssueDateFrom !== null && controllerScope.dateSearch.IssueDateFrom !== undefined) {
            IssueDateFrom = this.$filter('date')(controllerScope.dateSearch.IssueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateFrom !== null && controllerScope.dateSearch.DueDateFrom !== undefined) {
            DueDateFrom = this.$filter('date')(controllerScope.dateSearch.DueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.IssueDateTo !== null && controllerScope.dateSearch.IssueDateTo !== undefined) {
            IssueDateTo = this.$filter('date')(controllerScope.dateSearch.IssueDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateTo !== null && controllerScope.dateSearch.DueDateTo !== undefined) {
            DueDateTo = this.$filter('date')(controllerScope.dateSearch.DueDateTo, 'yyyy/MM/dd');
            count = 1;
        }

        controllerScope.supplierPOList = this.filterFilter((controllerScope.supplierPOTotalCollection), controllerScope.search);

        let tempList = [];
        tempList = controllerScope.supplierPOList;
        controllerScope.supplierPOList = [];
        if (tempList.length === 0) {
            controllerScope.totalCollection = [];
        }
        else {
            for (let i = 0; i < tempList.length; i++) {
                let DueDate = this.$filter('date')(tempList[i].DueDate, 'yyyy/MM/dd');
                let IssueDate = this.$filter('date')(tempList[i].IssueDate, 'yyyy/MM/dd');
                if (DueDateFrom !== null && DueDateFrom !== undefined && DueDateTo !== null && DueDateTo !== undefined) {
                    if (DueDate >= DueDateFrom && DueDate <= (DueDateTo)) {
                        controllerScope.supplierPOList.push(tempList[i]);
                    }
                }
                else {
                    if ((DueDate >= (DueDateFrom)) || (DueDate <= DueDateTo) || (IssueDate >= IssueDateFrom) || (IssueDate <= IssueDateTo)) {
                        controllerScope.supplierPOList.push(tempList[i]);
                    }
                }
            }

            if (count === 0) {
                controllerScope.supplierPOList = tempList;
            }
            let secondList = [];
            secondList = controllerScope.supplierPOList;
            controllerScope.supplierPOList = [];
            for (let k = 0; k < secondList.length; k++) {
                let DueDate = this.$filter('date')(secondList[k].DueDate, 'yyyy/MM/dd');
                let IssueDate = this.$filter('date')(secondList[k].IssueDate, 'yyyy/MM/dd');
                if (secondList.length !== 0) {
                    if (IssueDateTo !== null && IssueDateFrom !== null && IssueDateTo !== undefined && IssueDateFrom !== undefined) {
                        if (IssueDate >= (IssueDateFrom) && IssueDate <= (IssueDateTo)) {
                            controllerScope.supplierPOList.push(secondList[k]);
                        }
                    }
                    else {
                        if ((DueDate >= DueDateFrom) || (DueDate <= DueDateTo) || (IssueDate >= IssueDateFrom) || (IssueDate <= IssueDateTo)) {
                            controllerScope.supplierPOList.push(secondList[k]);
                        }
                    }
                }
            }
            if (count === 0) {
                controllerScope.supplierPOList = secondList;
            }
            //used to resolve pagination
            controllerScope.totalCollection = controllerScope.supplierPOList;
        }
        controllerScope.search = [];
        controllerScope.dateSearch = [];
    }

    //open datepicker
    private openIssueDateFromPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateFromPickerOpened = true;
    }

    private openIssueDateToPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateToPickerOpened = true;
    }

    private openDueDateToPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateToPickerOpened = true;
    }

    private openDueDateFromPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateFromPickerOpened = true;
    }

    // used to redirect to Details page
    private viewDetail(spoWorkList) {
        let controllerScope = this.$scope;
        let x = this;
        let id = spoWorkList.Id;
        x.$location.path("/SupplierPODetails/" + id);
    }

    // used to check whether current user is the initiator of the po - jj


    private getUserDetail() {
        let controllerScope = this.$scope;
        let roortScope = this.$rootScope;
        roortScope.isLoading = true;
        let display = "";

        let promise = this.supplierPOWorkListService.getCurrentUserDetail();
        promise.then((result) => {
            controllerScope.userId = result.userId;
            controllerScope.roleName = result.rolename;

            if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
                this.getPODetails();
            }
            else {
                this.getSupplierPOWorkList();
            }


            roortScope.isLoading = false;
        }).catch((error) => {
            if (error.status !== 400) {
                location.replace(this.apiPath);
            }
        });
    }

    // used to get the details of particular purchase order - jj
    private getPODetails() {
        let poId = this.$routeParams.id;
        // let scope = this.$scope;
        let fetchBill = false;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierPOWorkListService.getSPO(poId);
        promise.then((result) => {
            controllerScope.isButtonsVisible = true;
            controllerScope.poDetail = result;
            controllerScope.poDetail.IssueDate = this.$filter('date')(controllerScope.poDetail.IssueDate, 'dd-MM-yyyy');
            controllerScope.poDetail.DueDate = this.$filter('date')(controllerScope.poDetail.DueDate, 'dd-MM-yyyy');

            for (let i = 0; i < controllerScope.poDetail.SPOBranch.length; i++) {
                controllerScope.branchModel.push({ Id: controllerScope.poDetail.SPOBranch[i].Id });
            }
            controllerRootScope.RecordId = controllerScope.poDetail.ParentRecordId;

            controllerScope.poDetail.LastLog.CreatedDateTime = new Date(controllerScope.poDetail.LastLog.CreatedDateTime).toISOString().substr(0, 10);

            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.IsRejected === false && !controllerScope.poDetail.IsApproved && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                if (controllerScope.poDetail.LastLog.WorkFlowDetail.IsReview || controllerScope.poDetail.LastLog.WorkFlowDetail.IsCondition) {
                    controllerScope.isReviewVisible = true;
                    controllerScope.displayConfirm = false;
                }
                else {
                    if (!controllerScope.poDetail.LastLog.WorkFlowDetail.IsRejectPanel) {
                        controllerScope.isReviewVisible = false;
                        controllerScope.displayConfirm = true;
                    }
                }
            }
            else {
                controllerScope.displayConfirm = false;
            }
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.IsCanceled === true && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                controllerScope.isCanceled = true;
            }
            else {
                controllerScope.isCanceled = false;
            }
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.IsRejected === true && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                controllerScope.isCancel = true;
            }
            else {
                controllerScope.isCancel = false;
            }
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && !controllerScope.poDetail.IsSend && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                controllerScope.isEditDisplay = true;
            }
            else {
                controllerScope.isEditDisplay = false;
            }
            if (controllerScope.poDetail.IsSend === true && !controllerScope.poDetail.IsReceived) {
                controllerScope.isReceiveVisible = true;
            }
            else {
                controllerScope.isReceiveVisible = false;
                if (!controllerScope.poDetail.IsVerified && controllerScope.poDetail.IsReceived) {
                    fetchBill = true;
                }
            }

            if (!controllerScope.poDetail.IsCancelApproved && !controllerScope.poDetail.IsApproved && (controllerScope.poDetail.IsRejected || controllerScope.poDetail.LastLog.WorkFlowDetail.IsRejectPanel) && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                    controllerScope.isResubmitVisible = true;
                }
            }
            else {
                controllerScope.isResubmitVisible = false;
            }

            if (fetchBill && controllerRootScope.merchatSettings.IsAllowToVerifySupplierPurchaseOrder) {
                this.getSPOBill(this.$routeParams.id);
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    //used to approve spo - jj
    private approveSPO(Comment, RecordId) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }

        let promise = this.supplierPOWorkListService.approveSPO(Comment, rootScope.RecordId);
        promise.then((result) => {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {

                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                    // window.location.assign('#SupplierPOWorkList');
                    this.ngToast.create(stringConstants.SPOApproved);
                }
                else if (result.status === stringConstants.alreadyActivityProcessed) {
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

                }
                rootScope.isLoading = false;
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SPOApprovedFailed
                    });
                rootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SPOApprovedFailed
                });
            rootScope.isLoading = false;
        });
    }

    //used to review spo - jj
    private reviewSPO(Comment, RecordId) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }

        let promise = this.supplierPOWorkListService.reviewSPO(Comment, rootScope.RecordId);
        promise.then((result) => {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    rootScope.isLoading = false;
                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                    // window.location.assign('#SupplierPOWorkList');
                    this.ngToast.create(stringConstants.SPOReviewedSuccessfully);
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: result.status
                        });
                    rootScope.isLoading = false;
                }
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SPOReviewedFailed
                    });
                rootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SPOReviewedFailed
                });
            rootScope.isLoading = false;
        });
    }

    //used to resubmit spo - jj
    private resubmitSPO() {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        let Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        let promise = this.supplierPOWorkListService.resubmitSPO(controllerScope.poDetail.Id, Comment);
        promise.then((result) => {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                    this.ngToast.create(stringConstants.SPOResubmittedSuccessfully);
                }
                else if (result.status === stringConstants.alreadyActivityProcessed) {
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
                }
                rootScope.isLoading = false;
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.spoResubmitFail
                    });
                rootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.spoResubmitFail
                });
            rootScope.isLoading = false;
        });
    }

    //used to send spo - jj
    private send(Comment, RecordId) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        let totalQuantity = 0;
        let totalOrderCP = 0;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        let promise = this.supplierPOWorkListService.send(Comment, rootScope.RecordId);
        promise.then((result) => {
            if (result !== null || result !== undefined) {
                if (result.status === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                }
                else {
                    if (!result.spoReceipt.EmailSendtoSupplier) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.SPONotEmit
                            });
                    }
                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                    if (result.spoReceipt.SupplierItem.length > 0) {
                        for (let i = 0; i < result.spoReceipt.SupplierItem.length; i++) {
                            totalOrderCP = totalOrderCP + parseFloat("" + (result.spoReceipt.SupplierItem[i].OrderCostPrice * result.spoReceipt.SupplierItem[i].OrderQuantity));
                            totalQuantity = totalQuantity + parseFloat("" + result.spoReceipt.SupplierItem[i].OrderQuantity);
                        }
                        result.spoReceipt.TotalQuantity = totalQuantity;
                        result.spoReceipt.TotalCostPrice = totalOrderCP;
                        this.printer.print("/Templates/Supplier/SupplierPurchaseOrderReceipt.html", result.spoReceipt);
                    }
                }
                rootScope.isLoading = false;
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SPONotSend
                    });
                rootScope.isLoading = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SPONotSend
                });
            rootScope.isLoading = false;
        });
    }

    // used to reject spo - jj
    private rejectSPO(Comment, RecordId) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        let promise = this.supplierPOWorkListService.rejectSPO(Comment, rootScope.RecordId);
        promise.then((result) => {
            if (result.status === "ok") {
                this.ngToast.create(stringConstants.SPORejected);
                let x = this;
                x.$location.path("/SupplierPOWorkList/");
            }
            else if (result.status === stringConstants.alreadyActivityProcessed) {
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
            }
            rootScope.isLoading = false;
            //  window.location.assign('#SupplierPOWorkList');
        }).catch((error) => {
            rootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }


    // used to cancel spo
    private cancelSPO(Comment, RecordId) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        let promise = this.supplierPOWorkListService.cancelSPO(Comment, rootScope.RecordId);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.SPOCancelled);
                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                }
                else if (result.status === stringConstants.alreadyActivityProcessed) {
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
                }
                rootScope.isLoading = false;
            }
            else {
                rootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SPONotCancelled
                    });
            }
            //  window.location.assign('#SupplierPOWorkList');
        }).catch((error) => {
            rootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    // used to approve cancelaltion of spo
    private approveCancelSPO(Status) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        let Comment = controllerScope.comment.Comment;
        //   let approve = true;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        let promise = this.supplierPOWorkListService.approveCancelSPO(Comment, rootScope.RecordId, Status);
        promise.then((result) => {
            rootScope.isLoading = false;
            if (Status === 1) {
                this.ngToast.create(stringConstants.SPOCancelledApproved);
            }
            else {
                this.ngToast.create(stringConstants.SPOCancelledRejected);
            }
            let x = this;
            x.$location.path("/SupplierPOWorkList/");
            // window.location.assign('#SupplierPOWorkList');
        }).catch((error) => {
            rootScope.isLoading = false;
            if (Status === 1) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SPOCancelledApprovedFailed
                    });
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.SPOCancelledRejectedFailed
                    });
            }
        });
    }

    // used to redirect to workflow list page
    private cancel() {
        let x = this;
        x.$location.path("/SupplierPOWorkList/");
        // window.location.assign('#SupplierPOWorkList');
    }

    // used to redirect to AddUser page - jj
    private edit(id) {
        //  let RootScope = this.$rootScope;
        let x = this;
        x.$location.path("/SupplierPO/" + id);
    }

    //used to redirect to SPOReceiving page
    private receiveSPORedirect(id) {
        let x = this;
        x.$location.path("/SupplierPOReceiving/" + id);
    }


    private getSPOBill(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierPOWorkListService.getSPOBill(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.billList = result;
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.BillListNotFetched
                        });
                }
                controllerRootScope.isLoading = false;
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.BillListNotFetched
                    });
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.BillListNotFetched
                });
        });
    }

    //Used to verify bill - jj
    private verifyBill(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierPOWorkListService.verifyBill(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status) {
                    this.ngToast.create(stringConstants.BillVerified);
                    this.updateBill(id);
                    controllerRootScope.isLoading = false;
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.verifyBillFail
                        });
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                controllerRootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.verifyBillFail
                    });
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.verifyBillFail
                });
        });
    }


    private updateBill(id) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.billList.length; i++) {
            if (controllerScope.billList[i].BillId === id) {
                controllerScope.billList[i].IsVerified = true;
            }
        }
    }
    //Used to verify spo - jj
    private verifySPO(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        let Comment = controllerScope.comment.Comment;
        //   let approve = true;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        let isAllVerified = true;
        for (let i = 0; i < controllerScope.billList.length; i++) {
            if (!controllerScope.billList[i].IsVerified) {
                isAllVerified = false;
                break;
            }
        }
        if (isAllVerified) {
            let promise = this.supplierPOWorkListService.verifySPO(id, Comment);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    if (result.status) {
                        this.ngToast.create(stringConstants.SPOVerified);
                        this.cancel();
                        controllerRootScope.isLoading = false;
                    }
                    else {
                        controllerRootScope.isLoading = false;
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.verifySPOFail
                            });
                    }
                }
                else {
                    controllerRootScope.isLoading = false;
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.verifySPOFail
                        });
                }
            }).catch((error) => {
                controllerRootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.verifySPOFail
                    });
            });
        }
        else {
            controllerRootScope.isLoading = false;
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.VerifyFirst
                });
        }
    }



    //this function is used to submit an spo of the given id - jj
    private submitSPO(id, comment) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (comment === null || comment === undefined) {
            comment = ".";
        }
        let promise = this.supplierPOWorkListService.submitSPO(id, comment);
        promise.then((result) => {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    controllerRootScope.isLoading = false;
                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                    // window.location.assign('#SupplierPOWorkList');
                    this.ngToast.create(stringConstants.spoSubmitSuccess);
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: result.status
                        });
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.spoSubmitFailed
                    });
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.spoSubmitFailed
                });
        });
    }


    //this function is used to soft delete an spo of the given id - jj
    private deleteSPO(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closePODeletePopup();
        controllerRootScope.isLoading = true;
        let promise = this.supplierPOWorkListService.deleteSPO(id);
        promise.then((result) => {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    controllerRootScope.isLoading = false;
                    let x = this;
                    x.$location.path("/SupplierPOWorkList/");
                    this.ngToast.create(stringConstants.spoDeleteSuccess);
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: result.status
                        });
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.spoDeleteFailed
                    });
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.spoDeleteFailed
                });
        });
    }


    //used to open PODeletePopup - jj
    private openPODeletePopup() {
        let controllerScope = this.$scope;
        this.poDeletePopup = this.$modal.open({
            templateUrl: 'PODeletePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close PODeletePopup - jj
    private closePODeletePopup() {
        this.poDeletePopup.dismiss('cancel');
    }
}

app.controller(SupplierPOWorkListController.controllerId, ['$scope', '$log', 'SupplierPOWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$routeParams', 'printer', '$modal', ($scope, $log, SupplierPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $routeParams, printer, $modal) => {
    return new SupplierPOWorkListController($scope, $log, SupplierPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $routeParams, printer, $modal);
}]);



interface IicrWorkListControllerScope extends ng.IScope {
    addNewItemProfile: Model.AddNewItemProfile;
    itemChangedDetails: Model.ItemChangedDetails;
    getICRWorkList: Function;
    viewDetail: Function;
    getCurrentUser: Function;
    icrWorkList: any;
    getICRDetail: Function;
    resubmitICRDetail: Function;
    search: any;
    searchICRList: Function;
    cancel: Function;
    editICR: Function;
    updateICR: Function;
    approveICR: Function;
    returnICR: Function;
    rejectICR: Function;
    reviewICR: Function;
    dateSearch: any;
    isApproval: boolean;
    isEditVisible: boolean;
    isReviewVisible: boolean;
    userRoleName: string;

    isRequestedDateFromPickerOpened: any;
    openRequestedDateFromPicker: Function;

    isRequestedDateToPickerOpened: any;
    openRequestedDateToPicker: Function;

    openRejectICRPopup: Function;
    closeRejectICRPopup: Function;

    totalCollection: any;
    errorMessage: string;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    entryLimit: any;
    rejectConfirmation: any;
    rejectConfirm: any;
    priceChangeRequest: any;
    quantityChangeRequest: any;
    noICRFound: any;
    rejected: any;
    icrTotalCollection: any;
}

interface IicrWorkListController {

}


class IcrWorkListController implements IicrWorkListController {
    static controllerId = "icrWorkListController";
    public rejectICRPopup;


    constructor(private $scope: IicrWorkListControllerScope, private $log: ng.ILocaleService, private icrWorkListService: IcrWorkListService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $modal, public $location, public $routeParams, public $filter) {

        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.itemChangedDetails = new Model.ItemChangedDetails();
        this.$scope.getICRWorkList = () => this.getICRWorkList();
        this.$scope.icrWorkList = [];
        this.$scope.getICRDetail = () => this.getICRDetail();
        this.$scope.viewDetail = (icr) => this.viewDetail(icr);
        this.$scope.search = [];
        this.$scope.searchICRList = () => this.searchICRList();
        this.$scope.cancel = () => this.cancel();
        this.$scope.editICR = () => this.editICR();
        this.$scope.approveICR = () => this.approveICR();
        this.$scope.returnICR = () => this.returnICR();
        this.$scope.rejectICR = () => this.rejectICR();
        this.$scope.reviewICR = () => this.reviewICR();
        this.$scope.resubmitICRDetail = () => this.resubmitICRDetail();
        this.$scope.getCurrentUser = () => this.getCurrentUser();
        this.$scope.openRejectICRPopup = () => this.openRejectICRPopup();
        this.$scope.closeRejectICRPopup = () => this.closeRejectICRPopup();
        this.$scope.openRequestedDateFromPicker = (event) => this.openRequestedDateFromPicker(event);
        this.$scope.isRequestedDateFromPickerOpened = false;
        this.$scope.dateSearch = [];
        this.$scope.isApproval = false;
        this.$scope.isEditVisible = false;
        this.$scope.isReviewVisible = false;
        this.$scope.userRoleName = "";
        //string constants
        this.$scope.rejectConfirmation = stringConstants.rejectConfirmation;
        this.$scope.rejectConfirm = stringConstants.rejectConfirm;
        this.$scope.noICRFound = stringConstants.noICRFound;
        this.$scope.priceChangeRequest = stringConstants.priceChangeRequest;
        this.$scope.quantityChangeRequest = stringConstants.quantityChangeRequest;
        this.$scope.rejected = stringConstants.rejected;

        this.$scope.openRequestedDateToPicker = (event) => this.openRequestedDateToPicker(event);
        this.$scope.isRequestedDateToPickerOpened = false;
        //pagination
        this.$scope.totalCollection = [];

        this.$scope.icrTotalCollection = [];

        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.entryLimit = 10;
        this.$scope.errorMessage = "";

        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.icrWorkList.slice(begin, end);
        });

        this.initialize();
    }

    private initialize() {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getCurrentUser();
            //this.getICRDetail();
        }
        else {
            this.getICRWorkList();
        }
    }

    private getCurrentUser() {
        let controllerScope = this.$scope;
        let promise = this.icrWorkListService.getCurrentUserDetail();
        promise.then((result) => {
            controllerScope.userRoleName = result.rolename;
            this.getICRDetail();
        }).catch((error) => {

        });
    }


    //this service used for fetching ICR Work list.-jj
    private getICRWorkList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.icrWorkListService.getICRWorkList();
        promise.then((result) => {
            if (result.length > 0) {
                controllerScope.icrWorkList = result;
                controllerRootScope.isLoading = false;
                controllerScope.icrTotalCollection = controllerScope.icrWorkList;
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.icrWorkList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.icrWorkList.length;
            }
            else {
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    //used to redirect to ICRDetail page
    private viewDetail(icr) {
        this.$location.path("/ICRDetails/" + icr.Id);
    }

    //used to fetch Detail of ICR
    private getICRDetail() {
        let id = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //   let currentRole = "PM";
        let promise = this.icrWorkListService.getICRDetail(this.$routeParams.id);
        promise.then((result) => {
            controllerScope.itemChangedDetails = result;
            if (controllerScope.itemChangedDetails.IsRejected) {
                controllerScope.isApproval = false;
                controllerScope.isEditVisible = false;
                controllerScope.isReviewVisible = false;
            } else {
                for (let i = controllerScope.itemChangedDetails.WorkFlowLog.length - 1; i < controllerScope.itemChangedDetails.WorkFlowLog.length; i++) {
                    if (controllerScope.itemChangedDetails.WorkFlowLog[i].NextActivityId !== 3) {
                        if (controllerScope.userRoleName === controllerScope.itemChangedDetails.WorkFlowLog[i].AssignedRole && !controllerScope.itemChangedDetails.WorkFlowLog[i].IsCondition) {
                            //if (controllerScope.itemChangedDetails.WorkFlowLog[i].IsRejected && controllerScope.itemChangedDetails.WorkFlowLog[i].InitiatorRole == controllerScope.userRoleName) {
                            if (controllerScope.itemChangedDetails.IsReturned) {
                                controllerScope.isApproval = false;
                                controllerScope.isEditVisible = true;
                                controllerScope.isReviewVisible = false;
                            }
                            else {
                                if (controllerScope.itemChangedDetails.WorkFlowLog[i].IsReview) {
                                    controllerScope.isApproval = false;
                                    controllerScope.isEditVisible = false;
                                    controllerScope.isReviewVisible = true;
                                }
                                else {
                                    controllerScope.isApproval = true;
                                    controllerScope.isEditVisible = false;
                                    controllerScope.isReviewVisible = false;
                                }
                            }
                        }
                        else if (controllerScope.userRoleName === controllerScope.itemChangedDetails.WorkFlowLog[i].AssignedRole && controllerScope.itemChangedDetails.WorkFlowLog[i].IsCondition) {
                            //else if (controllerScope.itemChangedDetails.WorkFlowLog[i].IsReview) {
                            controllerScope.isApproval = false;
                            controllerScope.isEditVisible = false;
                            controllerScope.isReviewVisible = true;
                        }
                    }
                    else {
                        controllerScope.isApproval = false;
                        controllerScope.isEditVisible = false;
                        controllerScope.isReviewVisible = false;
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    //used to resubmit Detail of ICR - jj
    private resubmitICRDetail() {
        let id = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //   let currentRole = "PM";
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        let promise = this.icrWorkListService.resubmitICR(this.$routeParams.id, controllerScope.itemChangedDetails.Comment);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.ICRResubmitted);
                    this.$location.path("/ICRWorkList");
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
                        this.$location.path("/ICRWorkList");
                    }
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.ICRFailedResubmit
                        });
                }
            }

            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ICRFailedResubmit
                });
            controllerRootScope.isLoading = false;
        });
    }


    //used to search ICR Worklist
    private searchICRList() {
        let controllerScope = this.$scope;
        let count = 0;
        let InitiationDateFrom;
        let InitiationDateTo;
        if (controllerScope.dateSearch.InitiationDateFrom !== null && controllerScope.dateSearch.InitiationDateFrom !== undefined) {
            // let IssueDateFrom = new Date(controllerScope.dateSearch.IssueDateFrom).toISOString().substr(0, 10);
            InitiationDateFrom = this.$filter('date')(controllerScope.dateSearch.InitiationDateFrom, 'yyyy/MM/dd');
            //   alert(InitiationDateFrom);
            count = 1;
        }
        if (controllerScope.dateSearch.InitiationDateTo !== null && controllerScope.dateSearch.InitiationDateTo !== undefined) {
            //  let DueDateFrom = new Date(controllerScope.dateSearch.DueDateFrom).toISOString().substr(0, 10);
            InitiationDateTo = this.$filter('date')(controllerScope.dateSearch.InitiationDateTo, 'yyyy/MM/dd');
            // alert(InitiationDateTo);
            count = 1;
        }
        let tempList = [];
        controllerScope.icrWorkList = this.filterFilter(controllerScope.icrTotalCollection, controllerScope.search);
        tempList = controllerScope.icrWorkList;
        controllerScope.icrWorkList = [];
        for (let i = 0; i < tempList.length; i++) {
            let RequestDate = this.$filter('date')(tempList[i].RequestedDate, 'yyyy/MM/dd');
            if (InitiationDateFrom !== null && InitiationDateFrom !== undefined && InitiationDateTo !== null && InitiationDateTo !== undefined) {
                if (RequestDate >= InitiationDateFrom && RequestDate <= InitiationDateTo) {
                    controllerScope.icrWorkList.push(tempList[i]);
                }
            }
            else {
                if ((RequestDate >= InitiationDateFrom) || (RequestDate <= InitiationDateTo)) {
                    controllerScope.icrWorkList.push(tempList[i]);
                }
            }
        }
        if (count === 0) {
            controllerScope.icrWorkList = tempList;
        }

        let that = this;
        let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
            end = begin + that.$scope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.icrWorkList.slice(begin, end);
        /* init pagination with $scope.list */
        controllerScope.totalItems = controllerScope.icrWorkList.length;
        controllerScope.search = [];
        controllerScope.dateSearch = [];
    }

    //used to return to ICRWorkList page
    private cancel() {
        this.$location.path("/ICRWorkList");
    }

    //used to redirect to edit page
    private editICR() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        //controllerRootScope.icrDetails = controllerScope.itemChangedDetails;
        this.$location.path("/InitiateICR/" + controllerScope.itemChangedDetails.Id);
    }


    //USED TO APPROVE ICR - JJ
    private approveICR() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        let promise = this.icrWorkListService.approveICR(controllerScope.itemChangedDetails.ParentRecordId, controllerScope.itemChangedDetails.Comment, true);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.ICRApprovalSuccessful);
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
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ICRApprovalFailed
                });
            controllerRootScope.isLoading = false;
        });
    }


    //USED TO APPROVE ICR - JJ
    private reviewICR() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        let details = controllerScope.itemChangedDetails;
        controllerScope.itemChangedDetails = new Model.ItemChangedDetails();
        controllerScope.itemChangedDetails = details;
        let promise = this.icrWorkListService.reviewICR(controllerScope.itemChangedDetails);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.ICRReviewSuccessful);
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
            }
            controllerRootScope.isLoading = false;

        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ICRReviewFailed
                });
            controllerRootScope.isLoading = false;
        });
    }


    //USED TO return ICR - JJ
    private returnICR() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        let promise = this.icrWorkListService.approveICR(controllerScope.itemChangedDetails.ParentRecordId, controllerScope.itemChangedDetails.Comment, false);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.ICRReturnedSuccessful);
                    this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    } else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: result.status
                            });
                        this.cancel();
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ICRReturnedFailed
                });
            controllerRootScope.isLoading = false;
        });
    }


    //USED TO REJECT ICR - JJ
    private rejectICR() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        this.closeRejectICRPopup();
        controllerRootScope.isLoading = true;
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        let promise = this.icrWorkListService.rejectICR(controllerScope.itemChangedDetails.Id, controllerScope.itemChangedDetails.ParentRecordId, controllerScope.itemChangedDetails.Comment);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    this.ngToast.create(stringConstants.ICRRejectedSuccessful);
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
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ICRRejectedFailed
                });
            controllerRootScope.isLoading = false;
        });
    }


    // used for opening the RejectICRPopup-jj
    private openRejectICRPopup() {
        let controllerScope = this.$scope;
        this.rejectICRPopup = this.$modal.open({
            templateUrl: 'RejectICRPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the RejectICRPopup-jj
    private closeRejectICRPopup() {
        this.rejectICRPopup.dismiss('cancel');
    }

    // datepicker for search
    private openRequestedDateFromPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateFromPickerOpened = true;
    }

    private openRequestedDateToPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateToPickerOpened = true;
    }
}

app.controller(IcrWorkListController.controllerId, ['$scope', '$log', 'icrWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', '$routeParams', '$filter', ($scope, $log, icrWorkListService, ngToast, $rootSoope, apiPath, filterFilter, $modal, $location, $routeParams, $filter) => {
    return new IcrWorkListController($scope, $log, icrWorkListService, ngToast, $rootSoope, apiPath, filterFilter, $modal, $location, $routeParams, $filter);
}]);


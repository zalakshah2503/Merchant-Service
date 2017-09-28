
interface ISessionClosingVarificationControllerScope extends ng.IScope {
    isOpenSales: boolean;
    clickOnSalesTransaction: Function;
    clickOnNonSalesTransaction: Function;
    errorMessageDisplayForBlankList: boolean;
    nonSalesTransactionCollection: any;
    totalCollection: any;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    maxSize: number;
    sessionClosingVarificationModel: any;
    clickOnEditButton: Function;
    clickOnCloseButton: Function;
    approveSessionClosing: Function;
    rejectSession: Function;
    isVarificationPortion: boolean;
    clickOnVarification: Function;
    clickOnCancleButton: Function;
    isApproval: boolean;
    actionList: any;
    sessionClosingVarificaitonObject: any;
    POSApprovalObject: Model.POSApprovalModel;
    statusList: any;
    isResolvingStatus: boolean;
    clickOnPOSSessionBill: Function;
    totalPOSSessionBillCollection: any;
    errorMessageDisplayForBlank: boolean;
    clickOnClose: Function;
    cashierId: number;
    getSubItemList: Function;
    resolvingStatus: boolean;
    resolvingStatusRequired: string;
    SalesTransaction: any;
    NonSalesTransaction: any;
    noItemFound: any;
}

interface ISessionClosingVarificationController {

}

class SessionClosingVarificationController implements ISessionClosingVarificationController {
    static controllerId = "SessionClosingVarificationController";
    public sessionBillPopup;
    constructor(private $scope: ISessionClosingVarificationControllerScope, private $log: ng.ILogService, public $rootScope, private POSSessionService: POSSessionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal) {
        this.Initialize();
        this.$scope.POSApprovalObject = new Model.POSApprovalModel();
        this.$scope.clickOnSalesTransaction = () => this.clickOnSalesTransaction();
        this.$scope.clickOnNonSalesTransaction = () => this.clickOnNonSalesTransaction();
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 5;
        this.$scope.cashierId = 0;
        this.$scope.maxSize = 10;
        this.$scope.sessionClosingVarificationModel = [];
        this.$scope.clickOnEditButton = (id) => this.clickOnEditButton(id);
        this.$scope.clickOnCloseButton = () => this.clickOnCloseButton();
        this.$scope.approveSessionClosing = () => this.approveSessionClosing();
        this.$scope.rejectSession = () => this.rejectSession();
        this.$scope.clickOnVarification = () => this.clickOnVarification();
        this.$scope.clickOnCancleButton = () => this.clickOnCancleButton();
        this.$scope.isVarificationPortion = false;
        this.$scope.actionList = [];
        this.$scope.sessionClosingVarificaitonObject = [];
        this.$scope.clickOnPOSSessionBill = () => this.clickOnPOSSessionBill();
        this.$scope.isApproval = false;
        this.$scope.errorMessageDisplayForBlank = false;
        this.$scope.clickOnClose = () => this.clickOnClose();
        this.$scope.resolvingStatus = false;
        this.$scope.resolvingStatusRequired = stringConstants.resolvingStatusRequird;
        this.$scope.getSubItemList = (parentId, event) => this.getSubItemList(parentId, event);
        this.$scope.isResolvingStatus = false;
        this.$scope.statusList = stringConstants.statusList;
        this.$scope.SalesTransaction = stringConstants.SalesTransaction;
        this.$scope.NonSalesTransaction = stringConstants.NonSalesTransaction;
        this.$scope.noItemFound = stringConstants.noItemFound;
        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.nonSalesTransactionCollection.slice(begin, end);
        });
    }

    private Initialize() {
        if (this.$routeParams.id !== undefined && this.$routeParams.id !== null && this.$routeParams.id !== "") {
            this.GetSessionClosingVarification(this.$routeParams.id);
            // this.getNonSalesTransactionList(this.$routeParams.id);
            this.getActionList(this.$routeParams.id);
            this.$scope.isOpenSales = true;
        }
    }

    //this function used for close popup. -An
    private clickOnClose() {
        this.sessionBillPopup.dismiss('cancel');
    }

    //this funciton used for session closing
    private clickOnPOSSessionBill() {
        this.$rootScope.isLoading = true;
        this.$scope.totalPOSSessionBillCollection = [];
        this.$scope.errorMessageDisplayForBlank = false;
        let posSessionBill = this.$scope.totalPOSSessionBillCollection;
        let promise = this.POSSessionService.getListOfPOSSessionBillCashierId(this.$routeParams.id, false);
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    posSessionBill.push(result[i]);
                }
            }
            else {
                this.$scope.errorMessageDisplayForBlank = true;
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

        this.sessionBillPopup = this.$modal.open({
            templateUrl: 'SessionBill',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'lg',
        });
    }

    //This function used for get sub item list. -An
    private getSubItemList(parentId, event) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let getClass = angular.element(event.target).hasClass('fa-plus');
        if (getClass === true) {//to check click on pluse or minus icon.
            angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
            angular.element("#subChild" + parentId).removeClass('isHide').addClass('isShowRow');
            angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');
            angular.element(event.target).removeClass('fa-plus').addClass('fa-minus');
        }
        else {
            angular.element("#subChild" + parentId).removeClass('isShowRow').addClass('isHide');
            angular.element(event.target).removeClass('fa-minus').addClass('fa-plus');
        }
        controllerRootScope.isLoading = false;
    }

    //this funciton used for cancel button. -An
    private clickOnCancleButton() {
        this.$scope.isVarificationPortion = false;
    }

    //this function used for varification. -An
    private clickOnVarification() {
        this.$rootScope.isLoading = true;
        this.$scope.resolvingStatus = false;
        this.$scope.POSApprovalObject.POSSessionId = this.$routeParams.id;
        if (this.$scope.POSApprovalObject.StatusId !== 0 && this.$scope.POSApprovalObject.StatusId !== 1) {
            let promise = this.POSSessionService.varificationButtonEvent(this.$scope.POSApprovalObject);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.sessionVarificationBillClosingSucessfully);
                    this.$location.path("/SessionWorkList");
                }
                else if (result._isResult === "WorkFlowNotExists") {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
                }
                this.$rootScope.isLoading = false;
            }).catch((error) => {
                this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }
        else {
            this.$scope.resolvingStatus = true;
        }
        this.$rootScope.isLoading = false;
    }

    //this method used for get action list. -An
    private getActionList(id) {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.getActionList(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        this.$scope.actionList.push(result[i]);
                    }
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$rootScope.isLoading = false;
        });
    }

    //this function used for redirect session worklist.
    private clickOnCloseButton() {
        this.$location.path("/SessionWorkList");
    }

    //this function used for redirect session closing page.
    private clickOnEditButton(id) {
        this.$location.path("/SessionClosing/" + id);
    }

    //this funciton used for approve session closing. -An 
    private approveSessionClosing() {
        this.$rootScope.isLoading = true;
        this.$scope.POSApprovalObject.POSSessionId = this.$routeParams.id;
        let promise = this.POSSessionService.approvePOSSession(this.$scope.POSApprovalObject);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.sessionApproveBillClosingSucessfully);
                this.$location.path("/SessionWorkList");
            }
            else if (result._isResult === "WorkFlowNotExists") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$rootScope.isLoading = false;
        });
    }

    //this funciton used for reject session. -An
    private rejectSession() {
        this.$rootScope.isLoading = true;
        this.$scope.POSApprovalObject.POSSessionId = this.$routeParams.id;
        let promise = this.POSSessionService.rejectPOSSession(this.$scope.POSApprovalObject);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.sessionRejectBillClosingSucessfully);
                this.$location.path("/SessionWorkList");
            }
            else if (result._isResult === "WorkFlowNotExists") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$rootScope.isLoading = false;
        });
    }

    //this function used for get session closing detail for varification. -An 
    private GetSessionClosingVarification(id) {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.getSessionClosingVarification(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                this.$scope.cashierId = result.CashierId;
                this.$scope.sessionClosingVarificationModel.StartDate = result.SessionStartDate;
                this.$scope.sessionClosingVarificationModel.EndDate = result.SessionEndDate;
                this.$scope.sessionClosingVarificationModel.SessionStatus = result.SessionStatus;
                this.$scope.sessionClosingVarificationModel.Branch = result.Branch;
                this.$scope.sessionClosingVarificationModel.Cashier = result.Cashier;
                this.$scope.sessionClosingVarificationModel.MisMatchStatus = result.MsMatcheStatus;
                this.$scope.sessionClosingVarificationModel.MismatchValue = result.MsMatchValue;
                this.$scope.sessionClosingVarificationModel.ActualCash = result.ActualSalesCash;
                this.$scope.sessionClosingVarificationModel.SystemCash = result.SystemSalesCash;
                this.$scope.sessionClosingVarificationModel.ActualDebitCard = result.ActualSalesDebitCard;
                this.$scope.sessionClosingVarificationModel.SystemDebitCard = result.SystemSalesDebitCard;
                this.$scope.sessionClosingVarificationModel.ActualCreditCard = result.ActualSalesCreditCard;
                this.$scope.sessionClosingVarificationModel.SystemCreditCard = result.SystemSalesCreditCard;
                this.$scope.sessionClosingVarificationModel.ActualCoupon = result.ActualSalesCoupon;
                this.$scope.sessionClosingVarificationModel.SystemCoupon = result.SystemSalesCoupon;
                this.$scope.sessionClosingVarificationModel.ActualCreditAccount = result.ActualSalesCreditAccount;
                this.$scope.sessionClosingVarificationModel.SystemCreditAccount = result.SystemSalesCreditAccount;
                this.$scope.sessionClosingVarificationModel.ActualReturnBill = result.ActualSalesReturnBill;
                this.$scope.sessionClosingVarificationModel.SystemReturnBill = result.SystemSalesReturnBill;
                this.$scope.sessionClosingVarificationModel.ActualTotalIn = result.ActualSalesTotalIn;
                this.$scope.sessionClosingVarificationModel.SystemTotalIn = result.SystemSalesTotalIn;
                this.$scope.sessionClosingVarificationModel.ActualTotalOut = result.ActualSalesReturnBill;
                this.$scope.sessionClosingVarificationModel.SystemTotalOut = result.SystemSalesReturnBill;
                this.$scope.sessionClosingVarificationModel.ActualCheque = result.ActualCheque;
                this.$scope.sessionClosingVarificationModel.SystemCheque = result.SystemCheque;
                this.$scope.sessionClosingVarificationModel.SessionId = result.POSSessionId;
                if (result.IsApproval) {
                    this.$scope.isApproval = true;
                    this.$scope.isVarificationPortion = false;
                    this.$scope.isResolvingStatus = true;
                }
                else if (result.IsRiview) {
                    this.$scope.isApproval = false;
                    this.$scope.isVarificationPortion = true;
                    this.$scope.isResolvingStatus = false;
                }

                if (result.MismatchResolveTypeID !== 0 && result.MismatchResolveTypeID !== 1) {
                    this.$scope.POSApprovalObject.StatusId = result.MismatchResolveTypeID;
                }
                else {
                    this.$scope.isResolvingStatus = false;
                }

                //this section for non slaes transaction. -An
                this.$scope.nonSalesTransactionCollection = [];
                let nonSalesTransaction = this.$scope.nonSalesTransactionCollection;
                this.$scope.errorMessageDisplayForBlankList = false;
                if (result.listOfPOSNonSalesTransactionListAC.length > 0) {
                    for (let i = 0; i < result.listOfPOSNonSalesTransactionListAC.length; i++) {
                        nonSalesTransaction.push(result.listOfPOSNonSalesTransactionListAC[i]);
                    }
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    this.$scope.totalCollection = nonSalesTransaction.slice(begin, end);
                    /* init pagination with $scope.list */
                    this.$scope.totalItems = this.$scope.nonSalesTransactionCollection.length;
                }
                else {
                    this.$scope.errorMessageDisplayForBlankList = true;
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$rootScope.isLoading = false;
        });
    }

    //this function used for display sales transaction portion. -An
    private clickOnSalesTransaction() {
        this.$scope.isOpenSales = true;
    }

    //this function used for display non sales transaction portion. -An
    private clickOnNonSalesTransaction() {
        this.$scope.isOpenSales = false;
    }

}

app.controller(SessionClosingVarificationController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) => {
    return new SessionClosingVarificationController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
}]);
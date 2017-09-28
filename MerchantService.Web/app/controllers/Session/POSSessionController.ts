/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/session/possessionservice.ts" />
/// <reference path="../../models/session/posnonsaletransactionmodel.ts" />


interface IPOSSessionControllerScope extends ng.IScope {
    posSessionModelDetail: Model.PosSessionModel;
    cashierName: string;
    nonSalesTransactionModelDetail: Model.PosNonSaleTransactionModel;
    cashierList: any;
    transactionTypeList: any;
    cashierChangeEvent: Function;
    cashierDetailObject: any;
    actualSales: number;
    differenceForActualAndSystemSales: number;
    systemSales: number;
    radioButtonsDetailList: any;
    radionChangeEvent: Function;
    plusButtonEvent: Function;
    minuesButtonEvent: Function;
    amount: any;
    isCash: boolean;
    isDebitCard: boolean;
    isCreditCard: boolean;
    isCoupon: boolean;
    isCreditAccount: boolean;
    isRetturnedBill: boolean;
    isPluseMinues: boolean;
    calculateButtonEvent: Function;
    transactionTypeRequired: string;
    amountRequired: string;
    remarkRequired: string;
    addNonSalesTransaction: Function;

    nonSalesTransactionCollection: any;
    totalItems: number;
    totalCollection: any;
    errorMessageDisplayForBlankList: boolean;
    errorMessageDisplayForBlank: boolean;
    sessionId: number;
    cashierRequired: string;
    submitBttonEvent: Function;
    saveButtonEvent: Function;
    deleteNonSalesTransaction: Function;
    clickOnSalesTransaction: Function;
    clickOnNonSalesTransaction: Function;
    isOpenSales: boolean;
    isOpenNonSales: boolean;
    isCashier: boolean;
    isShowForSubmit: boolean;
    clickOnUpdateButton: Function;
    clickOnCloseButton: Function;
    isSessionOpen: boolean;
    clickOnSessionBills: Function;
    statusList: any;
    isResolvingStatus: boolean;
    totalPOSSessionBillCollection: any;
    clickOnClose: Function;
    getSubItemList: Function;
    resolvingStatus: boolean;
    resolvingStatusRequired: string;
    isCheque: boolean;
    isProfit: number;
    SalesTransaction: any;
    NonSalesTransaction: any;
    validAmountError: any;
    noItemFound: any;
}

interface IPOSSessionController { }

class POSSessionController implements IPOSSessionController {
    static controllerId = "POSSessionController";
    public sessionBillPopup;
    constructor(private $scope: IPOSSessionControllerScope, private $log: ng.ILogService, public $rootScope, private POSSessionService: POSSessionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal) {
        this.$scope.cashierList = [];
        this.$scope.transactionTypeList = [];
        this.$scope.cashierChangeEvent = () => this.cashierChangeEvent();
        this.$scope.cashierDetailObject = [];
        this.$scope.actualSales = 0;
        this.$scope.differenceForActualAndSystemSales = 0;
        this.$scope.systemSales = 0;
        this.$scope.radioButtonsDetailList = [];
        this.$scope.isResolvingStatus = false;
        this.$scope.radionChangeEvent = (value) => this.radionChangeEvent(value);
        this.$scope.posSessionModelDetail = new Model.PosSessionModel();
        this.$scope.plusButtonEvent = () => this.plusButtonEvent();
        this.$scope.minuesButtonEvent = () => this.minuesButtonEvent();
        this.$scope.transactionTypeRequired = stringConstants.transactionTypeRequired;
        this.$scope.amountRequired = stringConstants.nonTransactionAmountRequired;
        this.$scope.remarkRequired = stringConstants.remarkRequired;
        this.$scope.cashierRequired = stringConstants.cashierNameRequired;
        this.$scope.nonSalesTransactionModelDetail = new Model.PosNonSaleTransactionModel();
        this.$scope.addNonSalesTransaction = () => this.addNonSalesTransaction();
        this.$scope.isCash = false;
        this.$scope.isDebitCard = false;
        this.$scope.isCreditCard = false;
        this.$scope.resolvingStatusRequired = stringConstants.resolvingStatusRequird;
        this.$scope.resolvingStatus = false;
        this.$scope.isCoupon = false;
        this.$scope.isCreditAccount = false;
        this.$scope.isRetturnedBill = false;
        this.$scope.isPluseMinues = true;
        this.$scope.calculateButtonEvent = () => this.calculateButtonEvent();
        this.$scope.clickOnClose = () => this.clickOnClose();
        this.$scope.cashierName = "";
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.sessionId = 0;
        this.$scope.submitBttonEvent = () => this.submitBttonEvent();
        this.$scope.saveButtonEvent = () => this.saveButtonEvent();
        this.$scope.deleteNonSalesTransaction = (id) => this.deleteNonSalesTransaction(id);
        this.$scope.clickOnSalesTransaction = () => this.clickOnSalesTransaction();
        this.$scope.clickOnNonSalesTransaction = () => this.clickOnNonSalesTransaction();
        this.$scope.isOpenSales = true;
        this.$scope.isOpenNonSales = false;
        this.$scope.isCashier = true;
        this.$scope.isShowForSubmit = true;
        this.$scope.isSessionOpen = true;
        this.$scope.clickOnUpdateButton = () => this.clickOnUpdateButton();
        this.$scope.clickOnCloseButton = () => this.clickOnCloseButton();
        this.$scope.clickOnSessionBills = () => this.clickOnSessionBills();
        this.$scope.getSubItemList = (parentId, event) => this.getSubItemList(parentId, event);
        this.$scope.errorMessageDisplayForBlank = false;
        this.$scope.isProfit = 0;
        this.$scope.isCheque = false;
        this.$scope.statusList = stringConstants.statusList;
        this.$scope.SalesTransaction = stringConstants.SalesTransaction;
        this.$scope.NonSalesTransaction = stringConstants.NonSalesTransaction;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.Initialize();
    }

    private Initialize() {
        this.GetCashierList();
        this.GetTransactionType();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.$scope.sessionId = this.$routeParams.id;
            this.$scope.isCashier = false;
            this.getSessionClosingBySessionId(this.$routeParams.id);
            this.$scope.isResolvingStatus = true;
            this.getNonSalesTransactionList();
        }
        else
            this.$scope.isResolvingStatus = false;
    }

    private clickOnSessionBills() {
        if (this.$scope.posSessionModelDetail.CashierId !== null && this.$scope.posSessionModelDetail.CashierId !== undefined)
            this.GetPOSSessionBillByCashier(this.$scope.posSessionModelDetail.CashierId);
        else
            this.GetPOSSessionBill();

        this.sessionBillPopup = this.$modal.open({
            templateUrl: 'SessionBill',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'lg',
        });
    }

    //this funcion usd for get pos seesion bill list. -An
    private GetPOSSessionBill() {
        this.$rootScope.isLoading = true;
        this.$scope.errorMessageDisplayForBlank = false;
        this.$scope.totalPOSSessionBillCollection = [];
        let posSessionBill = this.$scope.totalPOSSessionBillCollection;
        let promise = this.POSSessionService.getListOfPOSSessionBill();
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
    }

    //this funcion used for get pos session bill list by cashier. -An
    private GetPOSSessionBillByCashier(id) {
        this.$rootScope.isLoading = true;
        this.$scope.totalPOSSessionBillCollection = [];
        this.$scope.errorMessageDisplayForBlank = false;
        let posSessionBill = this.$scope.totalPOSSessionBillCollection;
        let promise = this.POSSessionService.getListOfPOSSessionBillCashierId(id, true);
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


    private clickOnCloseButton() {
        this.$location.path("/SessionClosingVarification/" + this.$scope.sessionId);
    }

    //this function used for close popup. -An
    private clickOnClose() {
        this.sessionBillPopup.dismiss('cancel');
    }

    //this function used for update pos session controller. -An
    private clickOnUpdateButton() {
        this.$scope.resolvingStatus = false;
        if (this.$scope.posSessionModelDetail.MismatchResolveTypeID !== 0 && this.$scope.posSessionModelDetail.MismatchResolveTypeID !== 1) {
            this.$rootScope.isLoading = true;
            let promise = this.POSSessionService.updateSessionClosing(this.$scope.posSessionModelDetail);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.sessionUpdateBillClosingSucessfully);
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
                this.$rootScope.isLoading = false;
                this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        } else {
            this.$scope.resolvingStatus = true;
        }
    }

    //this function used for get session closing by seesion id. -An
    private getSessionClosingBySessionId(id) {
        this.$rootScope.isLoading = true;
        this.$scope.isShowForSubmit = false;
        let promise = this.POSSessionService.getSessionClosingVarification(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                this.$scope.cashierDetailObject.sessionStartDate = result.SessionStartDate;
                this.$scope.cashierDetailObject.sessionEndDate = result.SessionEndDate;
                this.$scope.cashierDetailObject.sessionStatus = result.SessionStatus;
                this.$scope.posSessionModelDetail.ActualCash = result.ActualSalesCash;
                this.$scope.posSessionModelDetail.ActualCheque = result.ActualCheque;
                this.$scope.posSessionModelDetail.ActualCoupon = result.ActualSalesCoupon;
                this.$scope.posSessionModelDetail.ActualCreditAccount = result.ActualSalesCreditAccount;
                this.$scope.posSessionModelDetail.ActualCreditCard = result.ActualSalesCreditCard;
                this.$scope.posSessionModelDetail.ActualDebitCard = result.ActualSalesDebitCard;
                this.$scope.posSessionModelDetail.ActualReturnBill = result.ActualSalesReturnBill;
                this.$scope.posSessionModelDetail.ActualSalesTotalIn = result.ActualSalesTotalIn;
                this.$scope.posSessionModelDetail.ActualSalesTotalOut = result.ActualSalesReturnBill;
                this.$scope.posSessionModelDetail.CashierId = result.CashierId;
                this.$scope.posSessionModelDetail.POSLoginSessionId = result.POSSessionLoginId;
                this.$scope.posSessionModelDetail.POSSessionId = result.POSSessionId;
                this.$scope.posSessionModelDetail.SystemCash = result.SystemSalesCash;
                this.$scope.posSessionModelDetail.SystemCoupon = result.SystemSalesCoupon;
                this.$scope.posSessionModelDetail.SystemCreditAccount = result.SystemSalesCreditAccount;
                this.$scope.posSessionModelDetail.SystemCreditCard = result.SystemSalesCreditCard;
                this.$scope.posSessionModelDetail.SystemDebitCard = result.SystemSalesDebitCard;
                this.$scope.posSessionModelDetail.SystemReturnBill = result.SystemSalesReturnBill;
                this.$scope.posSessionModelDetail.SystemCheque = result.SystemCheque;
                this.$scope.posSessionModelDetail.SystemSalesTotalIn = result.SystemSalesTotalIn;
                this.$scope.posSessionModelDetail.SystemSalesTotalOut = result.SystemSalesReturnBill;
                this.$scope.cashierName = result.Cashier;
                this.$scope.systemSales = (this.$scope.posSessionModelDetail.SystemCheque + this.$scope.posSessionModelDetail.SystemCash + this.$scope.posSessionModelDetail.SystemCoupon + this.$scope.posSessionModelDetail.SystemCreditAccount + this.$scope.posSessionModelDetail.SystemCreditCard + this.$scope.posSessionModelDetail.SystemDebitCard + this.$scope.posSessionModelDetail.SystemReturnBill) - this.$scope.posSessionModelDetail.SystemSalesTotalOut;
                this.$scope.actualSales = (this.$scope.posSessionModelDetail.ActualCheque + this.$scope.posSessionModelDetail.ActualCash + this.$scope.posSessionModelDetail.ActualDebitCard + this.$scope.posSessionModelDetail.ActualCreditCard + this.$scope.posSessionModelDetail.ActualCoupon + this.$scope.posSessionModelDetail.ActualCreditAccount + this.$scope.posSessionModelDetail.ActualReturnBill) - this.$scope.posSessionModelDetail.ActualSalesTotalOut;

                let diffrent = (this.$scope.systemSales - this.$scope.actualSales);
                this.$scope.isProfit = diffrent;
                if (diffrent > 0) {
                    this.$scope.differenceForActualAndSystemSales = diffrent;
                }
                else {
                    this.$scope.differenceForActualAndSystemSales = Math.abs(diffrent);
                }
                if (result.MismatchResolveTypeID !== undefined && result.MismatchResolveTypeID !== null && result.MismatchResolveTypeID !== 0) {
                    this.$scope.posSessionModelDetail.MismatchResolveTypeID = result.MismatchResolveTypeID;
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

    //this funcion used submit pos session closing. -An 
    private submitBttonEvent() {
        this.$rootScope.isLoading = true;
        if (this.$scope.sessionId !== 0) {
            this.$scope.posSessionModelDetail.POSSessionId = this.$scope.sessionId;
            let promise = this.POSSessionService.submitPOSSessionCosing(this.$scope.posSessionModelDetail);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.$location.path("/SessionWorkList");
                    this.ngToast.create(stringConstants.sessionSubmitBillClosingSucessfully);
                }
                else if (result._isResult === "IsNotWorkFlow") {
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
                this.$rootScope.isLoading = false;
                this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }
    }

    //this function used for sales transaction.-An
    private clickOnSalesTransaction() {
        this.$scope.isOpenSales = true;
        this.$scope.isOpenNonSales = false;
    }

    //this function used ofr non sales transaction. -An
    private clickOnNonSalesTransaction() {
        this.$scope.isOpenSales = false;
    }

    //this funcion used for delete non sales transaction. -An
    private deleteNonSalesTransaction(id) {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.deleteNonSalesTransaction(id);
        promise.then((result) => {
            if (result._isResult === true) {
                this.ngToast.create(stringConstants.deltedNonSalesTransactionSucessfully);
                this.getNonSalesTransactionList();
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

    //this function used for save pos session closing. -An
    private saveButtonEvent() {
        this.$rootScope.isLoading = true;
        if (this.$scope.sessionId !== 0) {
            this.$scope.posSessionModelDetail.POSSessionId = this.$scope.sessionId;
            let promise = this.POSSessionService.savePOSSessionClosing(this.$scope.posSessionModelDetail);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.$scope.posSessionModelDetail.Comment = "";
                    this.ngToast.create(stringConstants.sessionBillClosingSucessfully);
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
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

    //this function used for get cashier list. -An
    private GetCashierList() {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.getCashierList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.cashierList.push({ cashierId: result[i].Id, Name: result[i].UserName });
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

    //this funciton used get transaction type. -An
    private GetTransactionType() {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.getAllTransactionType();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.transactionTypeList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                this.$rootScope.isLoading = false;
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

    //this funciton used for radio button change event. -An
    private radionChangeEvent(value) {
        this.$scope.isCash = false;
        this.$scope.isDebitCard = false;
        this.$scope.isCreditCard = false;
        this.$scope.isCheque = false;
        this.$scope.isCoupon = false;
        this.$scope.isCreditAccount = false;
        this.$scope.isRetturnedBill = false;
        if (value !== "0") {
            if (value === "1") {
                this.$scope.isCash = true;
            }
            else if (value === "2") {
                this.$scope.isDebitCard = true;
            }
            else if (value === "3") {
                this.$scope.isCreditCard = true;
            }
            else if (value === "4") {
                this.$scope.isCoupon = true;
            }
            else if (value === "5") {
                this.$scope.isCreditAccount = true;
            }
            else if (value === "6") {
                this.$scope.isRetturnedBill = true;
            }
            else if (value === "7") {
                this.$scope.isCheque = true;
            }
            this.$scope.isPluseMinues = false;
        }
    }

    //this function used fo plus actual amount. -An
    private plusButtonEvent() {
        if (this.$scope.amount !== "") {
            if (this.$scope.isCash)
                this.$scope.posSessionModelDetail.ActualCash = (this.$scope.posSessionModelDetail.ActualCash + parseFloat(this.$scope.amount));

            else if (this.$scope.isDebitCard)
                this.$scope.posSessionModelDetail.ActualDebitCard = (this.$scope.posSessionModelDetail.ActualDebitCard + parseFloat(this.$scope.amount));

            else if (this.$scope.isCreditCard)
                this.$scope.posSessionModelDetail.ActualCreditCard = (this.$scope.posSessionModelDetail.ActualCreditCard + parseFloat(this.$scope.amount));

            else if (this.$scope.isCoupon)
                this.$scope.posSessionModelDetail.ActualCoupon = (this.$scope.posSessionModelDetail.ActualCoupon + parseFloat(this.$scope.amount));

            else if (this.$scope.isCreditAccount)
                this.$scope.posSessionModelDetail.ActualCreditAccount = (this.$scope.posSessionModelDetail.ActualCreditAccount + parseFloat(this.$scope.amount));

            else if (this.$scope.isRetturnedBill)
                this.$scope.posSessionModelDetail.ActualReturnBill = (this.$scope.posSessionModelDetail.ActualReturnBill + parseFloat(this.$scope.amount));

            else if (this.$scope.isCheque)
                this.$scope.posSessionModelDetail.ActualCheque = (this.$scope.posSessionModelDetail.ActualCheque + parseFloat(this.$scope.amount));

            this.$scope.posSessionModelDetail.ActualSalesTotalIn = (this.$scope.posSessionModelDetail.ActualCheque + this.$scope.posSessionModelDetail.ActualCash + this.$scope.posSessionModelDetail.ActualDebitCard + this.$scope.posSessionModelDetail.ActualCreditCard + this.$scope.posSessionModelDetail.ActualCoupon + this.$scope.posSessionModelDetail.ActualCreditAccount);
            let totalOut = this.$scope.posSessionModelDetail.ActualSalesTotalOut + this.$scope.posSessionModelDetail.ActualReturnBill;
            this.$scope.posSessionModelDetail.ActualSalesTotalOut = totalOut > 0 ? totalOut : 0;
            this.$scope.amount = "";
        }
    }

    //this function used for minues actual sales amount. -An
    private minuesButtonEvent() {
        if (this.$scope.amount !== "") {
            if (this.$scope.isCash) {
                let actualCash = (this.$scope.posSessionModelDetail.ActualCash - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCash = actualCash > 0 ? actualCash : 0;
            }
            else if (this.$scope.isDebitCard) {
                let actualDebitCard = (this.$scope.posSessionModelDetail.ActualDebitCard - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualDebitCard = actualDebitCard > 0 ? actualDebitCard : 0;
            }
            else if (this.$scope.isCreditCard) {
                let actualCreditCard = (this.$scope.posSessionModelDetail.ActualCreditCard - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCreditCard = actualCreditCard > 0 ? actualCreditCard : 0;
            }
            else if (this.$scope.isCoupon) {
                let actualCoupon = (this.$scope.posSessionModelDetail.ActualCoupon - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCoupon = actualCoupon > 0 ? actualCoupon : 0;
            }
            else if (this.$scope.isCreditAccount) {
                let creditAccount = (this.$scope.posSessionModelDetail.ActualCreditAccount - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCreditAccount = creditAccount > 0 ? creditAccount : 0;
            }
            else if (this.$scope.isRetturnedBill) {
                let retturnedBill = (this.$scope.posSessionModelDetail.ActualReturnBill - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualReturnBill = retturnedBill > 0 ? retturnedBill : 0;
            }
            else if (this.$scope.isCheque) {
                let cheque = (this.$scope.posSessionModelDetail.ActualCheque - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCheque = cheque > 0 ? cheque : 0;
            }
            this.$scope.posSessionModelDetail.ActualSalesTotalIn = (this.$scope.posSessionModelDetail.ActualCheque + this.$scope.posSessionModelDetail.ActualCash + this.$scope.posSessionModelDetail.ActualDebitCard + this.$scope.posSessionModelDetail.ActualCreditCard + this.$scope.posSessionModelDetail.ActualCoupon + this.$scope.posSessionModelDetail.ActualCreditAccount);

            let totalOut = this.$scope.posSessionModelDetail.ActualSalesTotalOut - this.$scope.posSessionModelDetail.ActualReturnBill;
            this.$scope.posSessionModelDetail.ActualSalesTotalOut = totalOut > 0 ? totalOut : 0;

            this.$scope.amount = "";
        }
    }

    //this function used for cashier change evnt. -An
    private cashierChangeEvent() {
        this.$rootScope.isLoading = true;
        let promise = this.POSSessionService.getcashierDetial(this.$scope.posSessionModelDetail.CashierId);
        promise.then((result) => {
            if (result._isResult !== false) {
                if (result._isResult !== "NotExists") {
                    this.$scope.cashierDetailObject.posSessionLoginId = result._isResult.POSSessionLoginId;
                    this.$scope.cashierDetailObject.sessionStatus = result._isResult.Status;
                    this.$scope.cashierDetailObject.sessionStartDate = result._isResult.SessionStartDate;
                    this.$scope.cashierDetailObject.sessionEndDate = result._isResult.SessionEndDate;
                    this.$scope.posSessionModelDetail.SystemCash = result._isResult.SystemSalesCash;
                    this.$scope.posSessionModelDetail.SystemDebitCard = result._isResult.SystemSalesDebitCard;
                    this.$scope.posSessionModelDetail.SystemCreditCard = result._isResult.SystemSalesCreditCard;
                    this.$scope.posSessionModelDetail.SystemCoupon = result._isResult.SystemSalesCoupon;
                    this.$scope.posSessionModelDetail.SystemCreditAccount = result._isResult.SystemSalesCreditAccount;
                    this.$scope.posSessionModelDetail.SystemReturnBill = result._isResult.SystemSalesReturnBill;
                    this.$scope.posSessionModelDetail.SystemSalesTotalIn = result._isResult.SystemSalesTotalIn;
                    this.$scope.posSessionModelDetail.ActualCash = result._isResult.ActualSalesCash;
                    this.$scope.posSessionModelDetail.ActualCoupon = result._isResult.ActualSalesCoupon;
                    this.$scope.posSessionModelDetail.ActualCreditAccount = result._isResult.ActualSalesCreditAccount;
                    this.$scope.posSessionModelDetail.ActualCreditCard = result._isResult.ActualSalesCreditCard;
                    this.$scope.posSessionModelDetail.ActualDebitCard = result._isResult.ActualSalesDebitCard;
                    this.$scope.posSessionModelDetail.ActualReturnBill = result._isResult.ActualSalesReturnBill;
                    this.$scope.posSessionModelDetail.ActualSalesTotalIn = result._isResult.ActualSalesTotalIn;
                    this.$scope.posSessionModelDetail.SystemSalesTotalOut = result._isResult.SystemSalesReturnBill;
                    this.$scope.posSessionModelDetail.ActualSalesTotalOut = result._isResult.ActualSalesReturnBill;
                    this.$scope.posSessionModelDetail.ActualCheque = result._isResult.ActualCheque;
                    this.$scope.posSessionModelDetail.SystemCheque = result._isResult.SystemCheque;
                    this.$scope.sessionId = result._isResult.POSSessionId;
                    this.$scope.actualSales = this.$scope.posSessionModelDetail.ActualSalesTotalIn;
                    this.$scope.systemSales = this.$scope.posSessionModelDetail.SystemSalesTotalIn;
                    let diffrent = (this.$scope.systemSales - this.$scope.actualSales);
                    this.$scope.isProfit = diffrent;
                    if (diffrent > 0) {
                        this.$scope.differenceForActualAndSystemSales = diffrent;
                    }
                    else {
                        this.$scope.differenceForActualAndSystemSales = Math.abs(diffrent);
                    }
                    if (result._isResult.IsSessionEnd)
                        this.$scope.isSessionOpen = false;
                    else
                        this.$scope.isSessionOpen = true;
                    this.getNonSalesTransactionList();
                }
                else {

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

    //this function used for calulate the diffrent between actual and system sales. -An
    private calculateButtonEvent() {
        this.$scope.actualSales = this.$scope.posSessionModelDetail.ActualSalesTotalIn;
        let diffrent = (this.$scope.systemSales - this.$scope.actualSales);
        this.$scope.isProfit = diffrent;
        if (diffrent > 0) {
            this.$scope.differenceForActualAndSystemSales = diffrent;
        }
        else {
            this.$scope.differenceForActualAndSystemSales = Math.abs(diffrent);
        }
    }

    //this funciton used for add non slaes transaction amount. -An
    private addNonSalesTransaction() {
        this.$rootScope.isLoading = true;
        if (this.$scope.sessionId !== 0) {
            this.$scope.nonSalesTransactionModelDetail.POSSessionId = this.$scope.sessionId;
            let promise = this.POSSessionService.addNewNonSalesTransaction(this.$scope.nonSalesTransactionModelDetail);
            promise.then((result) => {
                if (result._isResult !== 0) {
                    this.ngToast.create(stringConstants.nonSalesTransactionAddedsucessfully);
                    this.$scope.nonSalesTransactionModelDetail.Amount = 0;
                    this.$scope.nonSalesTransactionModelDetail.Remark = "";
                    this.$scope.nonSalesTransactionModelDetail.TransactionTypeId = undefined;
                    this.getNonSalesTransactionList();
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

    //this function used for get non sales transaction list. -An
    private getNonSalesTransactionList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.nonSalesTransactionCollection = [];
        let nonSalesTransaction = controllerScope.nonSalesTransactionCollection;
        controllerScope.errorMessageDisplayForBlankList = false;
        let promise = this.POSSessionService.getNonSalesTransactionList(this.$scope.sessionId);
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    nonSalesTransaction.push(result[i]);
                }
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
}

app.controller(POSSessionController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) => {
    return new POSSessionController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
}]);
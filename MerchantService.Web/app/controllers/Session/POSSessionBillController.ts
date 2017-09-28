/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/session/possessionservice.ts" />

interface IPOSSessionBillControllerScope extends ng.IScope {
    itemsPerPage: number;
    currentPage: number;
    maxSize: number;
    totalItems: number;
    totalCollection: any;
    totalPOSSessionBillCollection: any;
    posSessionBillFinalCollection: any;
    errorMessageDisplayForBlankList: boolean;
    getSubItemList: Function;
    currentPaymentObject: any;
    newPaymentObject: Model.POSSessionBillModel;
    viewSessionBill: Function;
    changePaymentEvent: Function;
    newAmount: number;
    cancleButtonEvent: Function;
    posSessionBillId: number;
    isMatchedForCurrentPayment: boolean;
    matchedForCurrentPayment: string;
    updateBillAmount: Function;
    getBranch: Function;
    backButtonEvent: Function;
    isBackSessionClosing: boolean;
    clickOnSearch: Function;
    billNumber: number;
    search: any;
    noItemFound: any;
    ValidCashMessage: any;
    ValidDebitCardAmt: any;
    ValidCreditCardAmt: any;
    ValidChequeAmt: any;
}

interface IPOSSessionBillController {

}

class POSSessionBillController implements IPOSSessionBillController {
    static controllerId = "POSSessionBillController";
    constructor(private $scope: IPOSSessionBillControllerScope, private $log: ng.ILogService, public $rootScope, private POSSessionService: POSSessionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal) {
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.getSubItemList = (parentId, event) => this.getSubItemList(parentId, event);
        this.$scope.currentPaymentObject = [];
        this.$scope.newPaymentObject = new Model.POSSessionBillModel();
        this.$scope.viewSessionBill = (id) => this.viewSessionBill(id);
        this.$scope.changePaymentEvent = () => this.changePaymentEvent();
        this.$scope.cancleButtonEvent = () => this.cancleButtonEvent();
        this.$scope.isMatchedForCurrentPayment = false;
        this.$scope.matchedForCurrentPayment = stringConstants.matchedForCurrentPayment;
        this.$scope.updateBillAmount = () => this.updateBillAmount();
        this.$scope.posSessionBillId = 0;
        this.$scope.newAmount = 0;
        this.$scope.backButtonEvent = () => this.backButtonEvent();
        this.$scope.isBackSessionClosing = false;
        this.$scope.clickOnSearch = () => this.clickOnSearch();
        this.$scope.posSessionBillFinalCollection = [];
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.ValidCashMessage = stringConstants.ValidCashMessage;
        this.$scope.ValidDebitCardAmt = stringConstants.ValidDebitCardAmt;
        this.$scope.ValidCreditCardAmt = stringConstants.ValidCreditCardAmt;
        this.$scope.ValidChequeAmt = stringConstants.ValidChequeAmt;
        this.$scope.search = [];

        this.Initialize();

        let posSessionBill = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.totalPOSSessionBillCollection.slice(begin, end);
        });
    }

    private Initialize() {
        this.GetPOSSessionBill();
    }

    private backButtonEvent() {
        this.$location.path("/SessionClosing/");
    }

    private updateBillAmount() {
        let cash, credit, coupon, debit, cheque = 0;
        if (this.$scope.newPaymentObject.Cash === undefined || this.$scope.newPaymentObject.Cash === null || this.$scope.newPaymentObject.Cash === "")
            cash = 0;
        else
            cash = this.$scope.newPaymentObject.Cash;
        if (this.$scope.newPaymentObject.Coupon === undefined || this.$scope.newPaymentObject.Coupon === null || this.$scope.newPaymentObject.Coupon === "")
            coupon = 0;
        else
            coupon = this.$scope.newPaymentObject.Coupon;
        if (this.$scope.newPaymentObject.CreditCard === undefined || this.$scope.newPaymentObject.CreditCard === null || this.$scope.newPaymentObject.CreditCard === "")
            credit = 0;
        else
            credit = this.$scope.newPaymentObject.CreditCard;
        if (this.$scope.newPaymentObject.DebitCard === undefined || this.$scope.newPaymentObject.DebitCard === null || this.$scope.newPaymentObject.DebitCard === "")
            debit = 0;
        else
            debit = this.$scope.newPaymentObject.DebitCard;
        if (this.$scope.newPaymentObject.Cheque === undefined || this.$scope.newPaymentObject.Cheque === null || this.$scope.newPaymentObject.Cheque === "")
            cheque = 0;
        else
            cheque = this.$scope.newPaymentObject.Cheque;
        this.$scope.newPaymentObject.BillAmount = (parseFloat(cash) + parseFloat(coupon) + parseFloat(credit) + parseFloat(debit) + parseFloat(cheque.toString()));
        this.$scope.newAmount = this.$scope.newPaymentObject.BillAmount;
    }

    private cancleButtonEvent() {
        this.$scope.currentPaymentObject.Cash = 0;
        this.$scope.currentPaymentObject.DebitCard = 0;
        this.$scope.currentPaymentObject.Coupon = 0;
        this.$scope.currentPaymentObject.CreditCard = 0;
        this.$scope.currentPaymentObject.ReceiptNoDebitCard = 0;
        this.$scope.currentPaymentObject.CouponNo = 0;
        this.$scope.currentPaymentObject.ReceiptNoCreditCard = 0;
        this.$scope.currentPaymentObject.billAmount = 0;
        this.$scope.currentPaymentObject.Cheque = 0;
        this.$scope.currentPaymentObject.ChequeNo = 0;
        this.$scope.billNumber = 0;
        this.$scope.newPaymentObject = new Model.POSSessionBillModel();
    }

    //This function used for change patment button event. -An
    private changePaymentEvent() {
        this.$rootScope.isLoading = true;
        this.$scope.isMatchedForCurrentPayment = false;
        if (this.$scope.currentPaymentObject.billAmount === this.$scope.newAmount) {
            this.$scope.newPaymentObject.POSSeesionBillId = this.$scope.posSessionBillId;
            let promise = this.POSSessionService.changePaymentEvent(this.$scope.newPaymentObject);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.$scope.currentPaymentObject.Cash = 0;
                    this.$scope.currentPaymentObject.DebitCard = 0;
                    this.$scope.currentPaymentObject.Coupon = 0;
                    this.$scope.currentPaymentObject.CreditCard = 0;
                    this.$scope.currentPaymentObject.ReceiptNoDebitCard = 0;
                    this.$scope.currentPaymentObject.CouponNo = 0;
                    this.$scope.currentPaymentObject.ReceiptNoCreditCard = 0;
                    this.$scope.currentPaymentObject.billAmount = 0;
                    this.$scope.currentPaymentObject.Cheque = 0;
                    this.$scope.currentPaymentObject.ChequeNo = 0;
                    this.$scope.billNumber = 0;
                    this.$scope.newPaymentObject = new Model.POSSessionBillModel();
                    this.ngToast.create(stringConstants.sessionBillPaymentMethodChangeSuccesfully);
                }
                else {
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
        else
            this.$scope.isMatchedForCurrentPayment = true;
        this.$rootScope.isLoading = false;
    }

    private GetPOSSessionBill() {
        this.$rootScope.isLoading = true;
        this.$scope.totalPOSSessionBillCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        let posSessionBill = this.$scope.totalPOSSessionBillCollection;
        let promise = this.POSSessionService.getListOfPOSSessionBill();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    posSessionBill.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                this.$scope.totalCollection = posSessionBill.slice(begin, end);
                /* init pagination with $scope.list */
                this.$scope.totalItems = this.$scope.totalPOSSessionBillCollection.length;
                this.$scope.posSessionBillFinalCollection = this.$scope.totalPOSSessionBillCollection;
            }
            else {
                this.$scope.errorMessageDisplayForBlankList = true;
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

    //This function used for display session bill payment detail. -An
    private viewSessionBill(id) {
        this.$rootScope.isLoading = true;
        this.$scope.posSessionBillId = id;
        let promise = this.POSSessionService.viewSessionBillPaymentDetail(id);
        promise.then((result) => {
            if (result.length !== 0) {
                this.$scope.billNumber = result[0].BillNo;
                this.$scope.currentPaymentObject.Cash = 0;
                this.$scope.currentPaymentObject.DebitCard = 0;
                this.$scope.currentPaymentObject.Coupon = 0;
                this.$scope.currentPaymentObject.CreditCard = 0;
                this.$scope.currentPaymentObject.Cheque = 0;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].PaymentType === "Cash") {
                        this.$scope.currentPaymentObject.Cash = result[i].Amount;
                    }
                    else if (result[i].PaymentType === "DebitCard") {
                        this.$scope.currentPaymentObject.DebitCard = result[i].Amount;
                        this.$scope.currentPaymentObject.ReceiptNoDebitCard = result[i].BankPOSTransNo;
                    }
                    else if (result[i].PaymentType === "Coupon") {
                        this.$scope.currentPaymentObject.Coupon = result[i].Amount;
                        this.$scope.currentPaymentObject.CouponNo = result[i].BankPOSTransNo;
                    }
                    else if (result[i].PaymentType === "CreditCard") {
                        this.$scope.currentPaymentObject.CreditCard = result[i].Amount;
                        this.$scope.currentPaymentObject.ReceiptNoCreditCard = result[i].BankPOSTransNo;
                    }
                    else if (result[i].PaymentType === "Cheque") {
                        this.$scope.currentPaymentObject.Cheque = result[i].Amount;
                        this.$scope.currentPaymentObject.ChequeNo = result[i].BankPOSTransNo;
                    }
                }
                this.$scope.currentPaymentObject.billAmount = (this.$scope.currentPaymentObject.Cash + this.$scope.currentPaymentObject.DebitCard + this.$scope.currentPaymentObject.Coupon + this.$scope.currentPaymentObject.CreditCard + this.$scope.currentPaymentObject.Cheque);
            }
            else {

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

    private clickOnSearch() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalPOSSessionBillCollection = this.filterFilter((controllerScope.posSessionBillFinalCollection), controllerScope.search);
        if (controllerScope.totalPOSSessionBillCollection.length === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.totalPOSSessionBillCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.totalPOSSessionBillCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
    }
}

app.controller(POSSessionBillController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) => {
    return new POSSessionBillController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
}]);
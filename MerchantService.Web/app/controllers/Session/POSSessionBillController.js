/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/session/possessionservice.ts" />
var POSSessionBillController = (function () {
    function POSSessionBillController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.POSSessionService = POSSessionService;
        this.ngToast = ngToast;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.getSubItemList = function (parentId, event) { return _this.getSubItemList(parentId, event); };
        this.$scope.currentPaymentObject = [];
        this.$scope.newPaymentObject = new Model.POSSessionBillModel();
        this.$scope.viewSessionBill = function (id) { return _this.viewSessionBill(id); };
        this.$scope.changePaymentEvent = function () { return _this.changePaymentEvent(); };
        this.$scope.cancleButtonEvent = function () { return _this.cancleButtonEvent(); };
        this.$scope.isMatchedForCurrentPayment = false;
        this.$scope.matchedForCurrentPayment = stringConstants.matchedForCurrentPayment;
        this.$scope.updateBillAmount = function () { return _this.updateBillAmount(); };
        this.$scope.posSessionBillId = 0;
        this.$scope.newAmount = 0;
        this.$scope.backButtonEvent = function () { return _this.backButtonEvent(); };
        this.$scope.isBackSessionClosing = false;
        this.$scope.clickOnSearch = function () { return _this.clickOnSearch(); };
        this.$scope.posSessionBillFinalCollection = [];
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.ValidCashMessage = stringConstants.ValidCashMessage;
        this.$scope.ValidDebitCardAmt = stringConstants.ValidDebitCardAmt;
        this.$scope.ValidCreditCardAmt = stringConstants.ValidCreditCardAmt;
        this.$scope.ValidChequeAmt = stringConstants.ValidChequeAmt;
        this.$scope.search = [];
        this.Initialize();
        var posSessionBill = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.totalPOSSessionBillCollection.slice(begin, end);
        });
    }
    POSSessionBillController.prototype.Initialize = function () {
        this.GetPOSSessionBill();
    };
    POSSessionBillController.prototype.backButtonEvent = function () {
        this.$location.path("/SessionClosing/");
    };
    POSSessionBillController.prototype.updateBillAmount = function () {
        var cash, credit, coupon, debit, cheque = 0;
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
    };
    POSSessionBillController.prototype.cancleButtonEvent = function () {
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
    };
    //This function used for change patment button event. -An
    POSSessionBillController.prototype.changePaymentEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.isMatchedForCurrentPayment = false;
        if (this.$scope.currentPaymentObject.billAmount === this.$scope.newAmount) {
            this.$scope.newPaymentObject.POSSeesionBillId = this.$scope.posSessionBillId;
            var promise = this.POSSessionService.changePaymentEvent(this.$scope.newPaymentObject);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.$scope.currentPaymentObject.Cash = 0;
                    _this.$scope.currentPaymentObject.DebitCard = 0;
                    _this.$scope.currentPaymentObject.Coupon = 0;
                    _this.$scope.currentPaymentObject.CreditCard = 0;
                    _this.$scope.currentPaymentObject.ReceiptNoDebitCard = 0;
                    _this.$scope.currentPaymentObject.CouponNo = 0;
                    _this.$scope.currentPaymentObject.ReceiptNoCreditCard = 0;
                    _this.$scope.currentPaymentObject.billAmount = 0;
                    _this.$scope.currentPaymentObject.Cheque = 0;
                    _this.$scope.currentPaymentObject.ChequeNo = 0;
                    _this.$scope.billNumber = 0;
                    _this.$scope.newPaymentObject = new Model.POSSessionBillModel();
                    _this.ngToast.create(stringConstants.sessionBillPaymentMethodChangeSuccesfully);
                }
                else {
                }
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
        else
            this.$scope.isMatchedForCurrentPayment = true;
        this.$rootScope.isLoading = false;
    };
    POSSessionBillController.prototype.GetPOSSessionBill = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.totalPOSSessionBillCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        var posSessionBill = this.$scope.totalPOSSessionBillCollection;
        var promise = this.POSSessionService.getListOfPOSSessionBill();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    posSessionBill.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                _this.$scope.totalCollection = posSessionBill.slice(begin, end);
                /* init pagination with $scope.list */
                _this.$scope.totalItems = _this.$scope.totalPOSSessionBillCollection.length;
                _this.$scope.posSessionBillFinalCollection = _this.$scope.totalPOSSessionBillCollection;
            }
            else {
                _this.$scope.errorMessageDisplayForBlankList = true;
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get sub item list. -An
    POSSessionBillController.prototype.getSubItemList = function (parentId, event) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var getClass = angular.element(event.target).hasClass('fa-plus');
        if (getClass === true) {
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
    };
    //This function used for display session bill payment detail. -An
    POSSessionBillController.prototype.viewSessionBill = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.posSessionBillId = id;
        var promise = this.POSSessionService.viewSessionBillPaymentDetail(id);
        promise.then(function (result) {
            if (result.length !== 0) {
                _this.$scope.billNumber = result[0].BillNo;
                _this.$scope.currentPaymentObject.Cash = 0;
                _this.$scope.currentPaymentObject.DebitCard = 0;
                _this.$scope.currentPaymentObject.Coupon = 0;
                _this.$scope.currentPaymentObject.CreditCard = 0;
                _this.$scope.currentPaymentObject.Cheque = 0;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].PaymentType === "Cash") {
                        _this.$scope.currentPaymentObject.Cash = result[i].Amount;
                    }
                    else if (result[i].PaymentType === "DebitCard") {
                        _this.$scope.currentPaymentObject.DebitCard = result[i].Amount;
                        _this.$scope.currentPaymentObject.ReceiptNoDebitCard = result[i].BankPOSTransNo;
                    }
                    else if (result[i].PaymentType === "Coupon") {
                        _this.$scope.currentPaymentObject.Coupon = result[i].Amount;
                        _this.$scope.currentPaymentObject.CouponNo = result[i].BankPOSTransNo;
                    }
                    else if (result[i].PaymentType === "CreditCard") {
                        _this.$scope.currentPaymentObject.CreditCard = result[i].Amount;
                        _this.$scope.currentPaymentObject.ReceiptNoCreditCard = result[i].BankPOSTransNo;
                    }
                    else if (result[i].PaymentType === "Cheque") {
                        _this.$scope.currentPaymentObject.Cheque = result[i].Amount;
                        _this.$scope.currentPaymentObject.ChequeNo = result[i].BankPOSTransNo;
                    }
                }
                _this.$scope.currentPaymentObject.billAmount = (_this.$scope.currentPaymentObject.Cash + _this.$scope.currentPaymentObject.DebitCard + _this.$scope.currentPaymentObject.Coupon + _this.$scope.currentPaymentObject.CreditCard + _this.$scope.currentPaymentObject.Cheque);
            }
            else {
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    POSSessionBillController.prototype.clickOnSearch = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalPOSSessionBillCollection = this.filterFilter((controllerScope.posSessionBillFinalCollection), controllerScope.search);
        if (controllerScope.totalPOSSessionBillCollection.length === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.totalPOSSessionBillCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.totalPOSSessionBillCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
    };
    return POSSessionBillController;
}());
POSSessionBillController.controllerId = "POSSessionBillController";
app.controller(POSSessionBillController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', function ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        return new POSSessionBillController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
    }]);
//# sourceMappingURL=POSSessionBillController.js.map
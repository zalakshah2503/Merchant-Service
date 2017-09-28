/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/session/possessionservice.ts" />
/// <reference path="../../models/session/posnonsaletransactionmodel.ts" />
var POSSessionController = (function () {
    function POSSessionController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
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
        this.$scope.cashierList = [];
        this.$scope.transactionTypeList = [];
        this.$scope.cashierChangeEvent = function () { return _this.cashierChangeEvent(); };
        this.$scope.cashierDetailObject = [];
        this.$scope.actualSales = 0;
        this.$scope.differenceForActualAndSystemSales = 0;
        this.$scope.systemSales = 0;
        this.$scope.radioButtonsDetailList = [];
        this.$scope.isResolvingStatus = false;
        this.$scope.radionChangeEvent = function (value) { return _this.radionChangeEvent(value); };
        this.$scope.posSessionModelDetail = new Model.PosSessionModel();
        this.$scope.plusButtonEvent = function () { return _this.plusButtonEvent(); };
        this.$scope.minuesButtonEvent = function () { return _this.minuesButtonEvent(); };
        this.$scope.transactionTypeRequired = stringConstants.transactionTypeRequired;
        this.$scope.amountRequired = stringConstants.nonTransactionAmountRequired;
        this.$scope.remarkRequired = stringConstants.remarkRequired;
        this.$scope.cashierRequired = stringConstants.cashierNameRequired;
        this.$scope.nonSalesTransactionModelDetail = new Model.PosNonSaleTransactionModel();
        this.$scope.addNonSalesTransaction = function () { return _this.addNonSalesTransaction(); };
        this.$scope.isCash = false;
        this.$scope.isDebitCard = false;
        this.$scope.isCreditCard = false;
        this.$scope.resolvingStatusRequired = stringConstants.resolvingStatusRequird;
        this.$scope.resolvingStatus = false;
        this.$scope.isCoupon = false;
        this.$scope.isCreditAccount = false;
        this.$scope.isRetturnedBill = false;
        this.$scope.isPluseMinues = true;
        this.$scope.calculateButtonEvent = function () { return _this.calculateButtonEvent(); };
        this.$scope.clickOnClose = function () { return _this.clickOnClose(); };
        this.$scope.cashierName = "";
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.sessionId = 0;
        this.$scope.submitBttonEvent = function () { return _this.submitBttonEvent(); };
        this.$scope.saveButtonEvent = function () { return _this.saveButtonEvent(); };
        this.$scope.deleteNonSalesTransaction = function (id) { return _this.deleteNonSalesTransaction(id); };
        this.$scope.clickOnSalesTransaction = function () { return _this.clickOnSalesTransaction(); };
        this.$scope.clickOnNonSalesTransaction = function () { return _this.clickOnNonSalesTransaction(); };
        this.$scope.isOpenSales = true;
        this.$scope.isOpenNonSales = false;
        this.$scope.isCashier = true;
        this.$scope.isShowForSubmit = true;
        this.$scope.isSessionOpen = true;
        this.$scope.clickOnUpdateButton = function () { return _this.clickOnUpdateButton(); };
        this.$scope.clickOnCloseButton = function () { return _this.clickOnCloseButton(); };
        this.$scope.clickOnSessionBills = function () { return _this.clickOnSessionBills(); };
        this.$scope.getSubItemList = function (parentId, event) { return _this.getSubItemList(parentId, event); };
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
    POSSessionController.prototype.Initialize = function () {
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
    };
    POSSessionController.prototype.clickOnSessionBills = function () {
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
    };
    //this funcion usd for get pos seesion bill list. -An
    POSSessionController.prototype.GetPOSSessionBill = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.errorMessageDisplayForBlank = false;
        this.$scope.totalPOSSessionBillCollection = [];
        var posSessionBill = this.$scope.totalPOSSessionBillCollection;
        var promise = this.POSSessionService.getListOfPOSSessionBill();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    posSessionBill.push(result[i]);
                }
            }
            else {
                _this.$scope.errorMessageDisplayForBlank = true;
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
    //this funcion used for get pos session bill list by cashier. -An
    POSSessionController.prototype.GetPOSSessionBillByCashier = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.totalPOSSessionBillCollection = [];
        this.$scope.errorMessageDisplayForBlank = false;
        var posSessionBill = this.$scope.totalPOSSessionBillCollection;
        var promise = this.POSSessionService.getListOfPOSSessionBillCashierId(id, true);
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    posSessionBill.push(result[i]);
                }
            }
            else {
                _this.$scope.errorMessageDisplayForBlank = true;
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
    POSSessionController.prototype.getSubItemList = function (parentId, event) {
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
    POSSessionController.prototype.clickOnCloseButton = function () {
        this.$location.path("/SessionClosingVarification/" + this.$scope.sessionId);
    };
    //this function used for close popup. -An
    POSSessionController.prototype.clickOnClose = function () {
        this.sessionBillPopup.dismiss('cancel');
    };
    //this function used for update pos session controller. -An
    POSSessionController.prototype.clickOnUpdateButton = function () {
        var _this = this;
        this.$scope.resolvingStatus = false;
        if (this.$scope.posSessionModelDetail.MismatchResolveTypeID !== 0 && this.$scope.posSessionModelDetail.MismatchResolveTypeID !== 1) {
            this.$rootScope.isLoading = true;
            var promise = this.POSSessionService.updateSessionClosing(this.$scope.posSessionModelDetail);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.sessionUpdateBillClosingSucessfully);
                    _this.$location.path("/SessionWorkList");
                }
                else if (result._isResult === "WorkFlowNotExists") {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
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
        }
        else {
            this.$scope.resolvingStatus = true;
        }
    };
    //this function used for get session closing by seesion id. -An
    POSSessionController.prototype.getSessionClosingBySessionId = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.isShowForSubmit = false;
        var promise = this.POSSessionService.getSessionClosingVarification(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                _this.$scope.cashierDetailObject.sessionStartDate = result.SessionStartDate;
                _this.$scope.cashierDetailObject.sessionEndDate = result.SessionEndDate;
                _this.$scope.cashierDetailObject.sessionStatus = result.SessionStatus;
                _this.$scope.posSessionModelDetail.ActualCash = result.ActualSalesCash;
                _this.$scope.posSessionModelDetail.ActualCheque = result.ActualCheque;
                _this.$scope.posSessionModelDetail.ActualCoupon = result.ActualSalesCoupon;
                _this.$scope.posSessionModelDetail.ActualCreditAccount = result.ActualSalesCreditAccount;
                _this.$scope.posSessionModelDetail.ActualCreditCard = result.ActualSalesCreditCard;
                _this.$scope.posSessionModelDetail.ActualDebitCard = result.ActualSalesDebitCard;
                _this.$scope.posSessionModelDetail.ActualReturnBill = result.ActualSalesReturnBill;
                _this.$scope.posSessionModelDetail.ActualSalesTotalIn = result.ActualSalesTotalIn;
                _this.$scope.posSessionModelDetail.ActualSalesTotalOut = result.ActualSalesReturnBill;
                _this.$scope.posSessionModelDetail.CashierId = result.CashierId;
                _this.$scope.posSessionModelDetail.POSLoginSessionId = result.POSSessionLoginId;
                _this.$scope.posSessionModelDetail.POSSessionId = result.POSSessionId;
                _this.$scope.posSessionModelDetail.SystemCash = result.SystemSalesCash;
                _this.$scope.posSessionModelDetail.SystemCoupon = result.SystemSalesCoupon;
                _this.$scope.posSessionModelDetail.SystemCreditAccount = result.SystemSalesCreditAccount;
                _this.$scope.posSessionModelDetail.SystemCreditCard = result.SystemSalesCreditCard;
                _this.$scope.posSessionModelDetail.SystemDebitCard = result.SystemSalesDebitCard;
                _this.$scope.posSessionModelDetail.SystemReturnBill = result.SystemSalesReturnBill;
                _this.$scope.posSessionModelDetail.SystemCheque = result.SystemCheque;
                _this.$scope.posSessionModelDetail.SystemSalesTotalIn = result.SystemSalesTotalIn;
                _this.$scope.posSessionModelDetail.SystemSalesTotalOut = result.SystemSalesReturnBill;
                _this.$scope.cashierName = result.Cashier;
                _this.$scope.systemSales = (_this.$scope.posSessionModelDetail.SystemCheque + _this.$scope.posSessionModelDetail.SystemCash + _this.$scope.posSessionModelDetail.SystemCoupon + _this.$scope.posSessionModelDetail.SystemCreditAccount + _this.$scope.posSessionModelDetail.SystemCreditCard + _this.$scope.posSessionModelDetail.SystemDebitCard + _this.$scope.posSessionModelDetail.SystemReturnBill) - _this.$scope.posSessionModelDetail.SystemSalesTotalOut;
                _this.$scope.actualSales = (_this.$scope.posSessionModelDetail.ActualCheque + _this.$scope.posSessionModelDetail.ActualCash + _this.$scope.posSessionModelDetail.ActualDebitCard + _this.$scope.posSessionModelDetail.ActualCreditCard + _this.$scope.posSessionModelDetail.ActualCoupon + _this.$scope.posSessionModelDetail.ActualCreditAccount + _this.$scope.posSessionModelDetail.ActualReturnBill) - _this.$scope.posSessionModelDetail.ActualSalesTotalOut;
                var diffrent = (_this.$scope.systemSales - _this.$scope.actualSales);
                _this.$scope.isProfit = diffrent;
                if (diffrent > 0) {
                    _this.$scope.differenceForActualAndSystemSales = diffrent;
                }
                else {
                    _this.$scope.differenceForActualAndSystemSales = Math.abs(diffrent);
                }
                if (result.MismatchResolveTypeID !== undefined && result.MismatchResolveTypeID !== null && result.MismatchResolveTypeID !== 0) {
                    _this.$scope.posSessionModelDetail.MismatchResolveTypeID = result.MismatchResolveTypeID;
                }
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
    //this funcion used submit pos session closing. -An 
    POSSessionController.prototype.submitBttonEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        if (this.$scope.sessionId !== 0) {
            this.$scope.posSessionModelDetail.POSSessionId = this.$scope.sessionId;
            var promise = this.POSSessionService.submitPOSSessionCosing(this.$scope.posSessionModelDetail);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.$location.path("/SessionWorkList");
                    _this.ngToast.create(stringConstants.sessionSubmitBillClosingSucessfully);
                }
                else if (result._isResult === "IsNotWorkFlow") {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
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
        }
    };
    //this function used for sales transaction.-An
    POSSessionController.prototype.clickOnSalesTransaction = function () {
        this.$scope.isOpenSales = true;
        this.$scope.isOpenNonSales = false;
    };
    //this function used ofr non sales transaction. -An
    POSSessionController.prototype.clickOnNonSalesTransaction = function () {
        this.$scope.isOpenSales = false;
    };
    //this funcion used for delete non sales transaction. -An
    POSSessionController.prototype.deleteNonSalesTransaction = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.deleteNonSalesTransaction(id);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.deltedNonSalesTransactionSucessfully);
                _this.getNonSalesTransactionList();
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
    //this function used for save pos session closing. -An
    POSSessionController.prototype.saveButtonEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        if (this.$scope.sessionId !== 0) {
            this.$scope.posSessionModelDetail.POSSessionId = this.$scope.sessionId;
            var promise = this.POSSessionService.savePOSSessionClosing(this.$scope.posSessionModelDetail);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.$scope.posSessionModelDetail.Comment = "";
                    _this.ngToast.create(stringConstants.sessionBillClosingSucessfully);
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
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
        }
    };
    //this function used for get cashier list. -An
    POSSessionController.prototype.GetCashierList = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.getCashierList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.cashierList.push({ cashierId: result[i].Id, Name: result[i].UserName });
                }
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
    //this funciton used get transaction type. -An
    POSSessionController.prototype.GetTransactionType = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.getAllTransactionType();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.transactionTypeList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                _this.$rootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this funciton used for radio button change event. -An
    POSSessionController.prototype.radionChangeEvent = function (value) {
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
    };
    //this function used fo plus actual amount. -An
    POSSessionController.prototype.plusButtonEvent = function () {
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
            var totalOut = this.$scope.posSessionModelDetail.ActualSalesTotalOut + this.$scope.posSessionModelDetail.ActualReturnBill;
            this.$scope.posSessionModelDetail.ActualSalesTotalOut = totalOut > 0 ? totalOut : 0;
            this.$scope.amount = "";
        }
    };
    //this function used for minues actual sales amount. -An
    POSSessionController.prototype.minuesButtonEvent = function () {
        if (this.$scope.amount !== "") {
            if (this.$scope.isCash) {
                var actualCash = (this.$scope.posSessionModelDetail.ActualCash - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCash = actualCash > 0 ? actualCash : 0;
            }
            else if (this.$scope.isDebitCard) {
                var actualDebitCard = (this.$scope.posSessionModelDetail.ActualDebitCard - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualDebitCard = actualDebitCard > 0 ? actualDebitCard : 0;
            }
            else if (this.$scope.isCreditCard) {
                var actualCreditCard = (this.$scope.posSessionModelDetail.ActualCreditCard - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCreditCard = actualCreditCard > 0 ? actualCreditCard : 0;
            }
            else if (this.$scope.isCoupon) {
                var actualCoupon = (this.$scope.posSessionModelDetail.ActualCoupon - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCoupon = actualCoupon > 0 ? actualCoupon : 0;
            }
            else if (this.$scope.isCreditAccount) {
                var creditAccount = (this.$scope.posSessionModelDetail.ActualCreditAccount - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCreditAccount = creditAccount > 0 ? creditAccount : 0;
            }
            else if (this.$scope.isRetturnedBill) {
                var retturnedBill = (this.$scope.posSessionModelDetail.ActualReturnBill - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualReturnBill = retturnedBill > 0 ? retturnedBill : 0;
            }
            else if (this.$scope.isCheque) {
                var cheque = (this.$scope.posSessionModelDetail.ActualCheque - parseFloat(this.$scope.amount));
                this.$scope.posSessionModelDetail.ActualCheque = cheque > 0 ? cheque : 0;
            }
            this.$scope.posSessionModelDetail.ActualSalesTotalIn = (this.$scope.posSessionModelDetail.ActualCheque + this.$scope.posSessionModelDetail.ActualCash + this.$scope.posSessionModelDetail.ActualDebitCard + this.$scope.posSessionModelDetail.ActualCreditCard + this.$scope.posSessionModelDetail.ActualCoupon + this.$scope.posSessionModelDetail.ActualCreditAccount);
            var totalOut = this.$scope.posSessionModelDetail.ActualSalesTotalOut - this.$scope.posSessionModelDetail.ActualReturnBill;
            this.$scope.posSessionModelDetail.ActualSalesTotalOut = totalOut > 0 ? totalOut : 0;
            this.$scope.amount = "";
        }
    };
    //this function used for cashier change evnt. -An
    POSSessionController.prototype.cashierChangeEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.getcashierDetial(this.$scope.posSessionModelDetail.CashierId);
        promise.then(function (result) {
            if (result._isResult !== false) {
                if (result._isResult !== "NotExists") {
                    _this.$scope.cashierDetailObject.posSessionLoginId = result._isResult.POSSessionLoginId;
                    _this.$scope.cashierDetailObject.sessionStatus = result._isResult.Status;
                    _this.$scope.cashierDetailObject.sessionStartDate = result._isResult.SessionStartDate;
                    _this.$scope.cashierDetailObject.sessionEndDate = result._isResult.SessionEndDate;
                    _this.$scope.posSessionModelDetail.SystemCash = result._isResult.SystemSalesCash;
                    _this.$scope.posSessionModelDetail.SystemDebitCard = result._isResult.SystemSalesDebitCard;
                    _this.$scope.posSessionModelDetail.SystemCreditCard = result._isResult.SystemSalesCreditCard;
                    _this.$scope.posSessionModelDetail.SystemCoupon = result._isResult.SystemSalesCoupon;
                    _this.$scope.posSessionModelDetail.SystemCreditAccount = result._isResult.SystemSalesCreditAccount;
                    _this.$scope.posSessionModelDetail.SystemReturnBill = result._isResult.SystemSalesReturnBill;
                    _this.$scope.posSessionModelDetail.SystemSalesTotalIn = result._isResult.SystemSalesTotalIn;
                    _this.$scope.posSessionModelDetail.ActualCash = result._isResult.ActualSalesCash;
                    _this.$scope.posSessionModelDetail.ActualCoupon = result._isResult.ActualSalesCoupon;
                    _this.$scope.posSessionModelDetail.ActualCreditAccount = result._isResult.ActualSalesCreditAccount;
                    _this.$scope.posSessionModelDetail.ActualCreditCard = result._isResult.ActualSalesCreditCard;
                    _this.$scope.posSessionModelDetail.ActualDebitCard = result._isResult.ActualSalesDebitCard;
                    _this.$scope.posSessionModelDetail.ActualReturnBill = result._isResult.ActualSalesReturnBill;
                    _this.$scope.posSessionModelDetail.ActualSalesTotalIn = result._isResult.ActualSalesTotalIn;
                    _this.$scope.posSessionModelDetail.SystemSalesTotalOut = result._isResult.SystemSalesReturnBill;
                    _this.$scope.posSessionModelDetail.ActualSalesTotalOut = result._isResult.ActualSalesReturnBill;
                    _this.$scope.posSessionModelDetail.ActualCheque = result._isResult.ActualCheque;
                    _this.$scope.posSessionModelDetail.SystemCheque = result._isResult.SystemCheque;
                    _this.$scope.sessionId = result._isResult.POSSessionId;
                    _this.$scope.actualSales = _this.$scope.posSessionModelDetail.ActualSalesTotalIn;
                    _this.$scope.systemSales = _this.$scope.posSessionModelDetail.SystemSalesTotalIn;
                    var diffrent = (_this.$scope.systemSales - _this.$scope.actualSales);
                    _this.$scope.isProfit = diffrent;
                    if (diffrent > 0) {
                        _this.$scope.differenceForActualAndSystemSales = diffrent;
                    }
                    else {
                        _this.$scope.differenceForActualAndSystemSales = Math.abs(diffrent);
                    }
                    if (result._isResult.IsSessionEnd)
                        _this.$scope.isSessionOpen = false;
                    else
                        _this.$scope.isSessionOpen = true;
                    _this.getNonSalesTransactionList();
                }
                else {
                }
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
    //this function used for calulate the diffrent between actual and system sales. -An
    POSSessionController.prototype.calculateButtonEvent = function () {
        this.$scope.actualSales = this.$scope.posSessionModelDetail.ActualSalesTotalIn;
        var diffrent = (this.$scope.systemSales - this.$scope.actualSales);
        this.$scope.isProfit = diffrent;
        if (diffrent > 0) {
            this.$scope.differenceForActualAndSystemSales = diffrent;
        }
        else {
            this.$scope.differenceForActualAndSystemSales = Math.abs(diffrent);
        }
    };
    //this funciton used for add non slaes transaction amount. -An
    POSSessionController.prototype.addNonSalesTransaction = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        if (this.$scope.sessionId !== 0) {
            this.$scope.nonSalesTransactionModelDetail.POSSessionId = this.$scope.sessionId;
            var promise = this.POSSessionService.addNewNonSalesTransaction(this.$scope.nonSalesTransactionModelDetail);
            promise.then(function (result) {
                if (result._isResult !== 0) {
                    _this.ngToast.create(stringConstants.nonSalesTransactionAddedsucessfully);
                    _this.$scope.nonSalesTransactionModelDetail.Amount = 0;
                    _this.$scope.nonSalesTransactionModelDetail.Remark = "";
                    _this.$scope.nonSalesTransactionModelDetail.TransactionTypeId = undefined;
                    _this.getNonSalesTransactionList();
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
        }
    };
    //this function used for get non sales transaction list. -An
    POSSessionController.prototype.getNonSalesTransactionList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.nonSalesTransactionCollection = [];
        var nonSalesTransaction = controllerScope.nonSalesTransactionCollection;
        controllerScope.errorMessageDisplayForBlankList = false;
        var promise = this.POSSessionService.getNonSalesTransactionList(this.$scope.sessionId);
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    nonSalesTransaction.push(result[i]);
                }
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    return POSSessionController;
}());
POSSessionController.controllerId = "POSSessionController";
app.controller(POSSessionController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', function ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        return new POSSessionController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
    }]);
//# sourceMappingURL=POSSessionController.js.map
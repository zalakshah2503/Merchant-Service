var SessionClosingVarificationController = (function () {
    function SessionClosingVarificationController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
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
        this.Initialize();
        this.$scope.POSApprovalObject = new Model.POSApprovalModel();
        this.$scope.clickOnSalesTransaction = function () { return _this.clickOnSalesTransaction(); };
        this.$scope.clickOnNonSalesTransaction = function () { return _this.clickOnNonSalesTransaction(); };
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 5;
        this.$scope.cashierId = 0;
        this.$scope.maxSize = 10;
        this.$scope.sessionClosingVarificationModel = [];
        this.$scope.clickOnEditButton = function (id) { return _this.clickOnEditButton(id); };
        this.$scope.clickOnCloseButton = function () { return _this.clickOnCloseButton(); };
        this.$scope.approveSessionClosing = function () { return _this.approveSessionClosing(); };
        this.$scope.rejectSession = function () { return _this.rejectSession(); };
        this.$scope.clickOnVarification = function () { return _this.clickOnVarification(); };
        this.$scope.clickOnCancleButton = function () { return _this.clickOnCancleButton(); };
        this.$scope.isVarificationPortion = false;
        this.$scope.actionList = [];
        this.$scope.sessionClosingVarificaitonObject = [];
        this.$scope.clickOnPOSSessionBill = function () { return _this.clickOnPOSSessionBill(); };
        this.$scope.isApproval = false;
        this.$scope.errorMessageDisplayForBlank = false;
        this.$scope.clickOnClose = function () { return _this.clickOnClose(); };
        this.$scope.resolvingStatus = false;
        this.$scope.resolvingStatusRequired = stringConstants.resolvingStatusRequird;
        this.$scope.getSubItemList = function (parentId, event) { return _this.getSubItemList(parentId, event); };
        this.$scope.isResolvingStatus = false;
        this.$scope.statusList = stringConstants.statusList;
        this.$scope.SalesTransaction = stringConstants.SalesTransaction;
        this.$scope.NonSalesTransaction = stringConstants.NonSalesTransaction;
        this.$scope.noItemFound = stringConstants.noItemFound;
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.nonSalesTransactionCollection.slice(begin, end);
        });
    }
    SessionClosingVarificationController.prototype.Initialize = function () {
        if (this.$routeParams.id !== undefined && this.$routeParams.id !== null && this.$routeParams.id !== "") {
            this.GetSessionClosingVarification(this.$routeParams.id);
            // this.getNonSalesTransactionList(this.$routeParams.id);
            this.getActionList(this.$routeParams.id);
            this.$scope.isOpenSales = true;
        }
    };
    //this function used for close popup. -An
    SessionClosingVarificationController.prototype.clickOnClose = function () {
        this.sessionBillPopup.dismiss('cancel');
    };
    //this funciton used for session closing
    SessionClosingVarificationController.prototype.clickOnPOSSessionBill = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.totalPOSSessionBillCollection = [];
        this.$scope.errorMessageDisplayForBlank = false;
        var posSessionBill = this.$scope.totalPOSSessionBillCollection;
        var promise = this.POSSessionService.getListOfPOSSessionBillCashierId(this.$routeParams.id, false);
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
        this.sessionBillPopup = this.$modal.open({
            templateUrl: 'SessionBill',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'lg',
        });
    };
    //This function used for get sub item list. -An
    SessionClosingVarificationController.prototype.getSubItemList = function (parentId, event) {
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
    //this funciton used for cancel button. -An
    SessionClosingVarificationController.prototype.clickOnCancleButton = function () {
        this.$scope.isVarificationPortion = false;
    };
    //this function used for varification. -An
    SessionClosingVarificationController.prototype.clickOnVarification = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.resolvingStatus = false;
        this.$scope.POSApprovalObject.POSSessionId = this.$routeParams.id;
        if (this.$scope.POSApprovalObject.StatusId !== 0 && this.$scope.POSApprovalObject.StatusId !== 1) {
            var promise = this.POSSessionService.varificationButtonEvent(this.$scope.POSApprovalObject);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.sessionVarificationBillClosingSucessfully);
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
        this.$rootScope.isLoading = false;
    };
    //this method used for get action list. -An
    SessionClosingVarificationController.prototype.getActionList = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.getActionList(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        _this.$scope.actionList.push(result[i]);
                    }
                }
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$rootScope.isLoading = false;
        });
    };
    //this function used for redirect session worklist.
    SessionClosingVarificationController.prototype.clickOnCloseButton = function () {
        this.$location.path("/SessionWorkList");
    };
    //this function used for redirect session closing page.
    SessionClosingVarificationController.prototype.clickOnEditButton = function (id) {
        this.$location.path("/SessionClosing/" + id);
    };
    //this funciton used for approve session closing. -An 
    SessionClosingVarificationController.prototype.approveSessionClosing = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.POSApprovalObject.POSSessionId = this.$routeParams.id;
        var promise = this.POSSessionService.approvePOSSession(this.$scope.POSApprovalObject);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.sessionApproveBillClosingSucessfully);
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
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$rootScope.isLoading = false;
        });
    };
    //this funciton used for reject session. -An
    SessionClosingVarificationController.prototype.rejectSession = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.POSApprovalObject.POSSessionId = this.$routeParams.id;
        var promise = this.POSSessionService.rejectPOSSession(this.$scope.POSApprovalObject);
        promise.then(function (result) {
            if (result._isResult === true) {
                _this.ngToast.create(stringConstants.sessionRejectBillClosingSucessfully);
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
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$rootScope.isLoading = false;
        });
    };
    //this function used for get session closing detail for varification. -An 
    SessionClosingVarificationController.prototype.GetSessionClosingVarification = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.POSSessionService.getSessionClosingVarification(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                _this.$scope.cashierId = result.CashierId;
                _this.$scope.sessionClosingVarificationModel.StartDate = result.SessionStartDate;
                _this.$scope.sessionClosingVarificationModel.EndDate = result.SessionEndDate;
                _this.$scope.sessionClosingVarificationModel.SessionStatus = result.SessionStatus;
                _this.$scope.sessionClosingVarificationModel.Branch = result.Branch;
                _this.$scope.sessionClosingVarificationModel.Cashier = result.Cashier;
                _this.$scope.sessionClosingVarificationModel.MisMatchStatus = result.MsMatcheStatus;
                _this.$scope.sessionClosingVarificationModel.MismatchValue = result.MsMatchValue;
                _this.$scope.sessionClosingVarificationModel.ActualCash = result.ActualSalesCash;
                _this.$scope.sessionClosingVarificationModel.SystemCash = result.SystemSalesCash;
                _this.$scope.sessionClosingVarificationModel.ActualDebitCard = result.ActualSalesDebitCard;
                _this.$scope.sessionClosingVarificationModel.SystemDebitCard = result.SystemSalesDebitCard;
                _this.$scope.sessionClosingVarificationModel.ActualCreditCard = result.ActualSalesCreditCard;
                _this.$scope.sessionClosingVarificationModel.SystemCreditCard = result.SystemSalesCreditCard;
                _this.$scope.sessionClosingVarificationModel.ActualCoupon = result.ActualSalesCoupon;
                _this.$scope.sessionClosingVarificationModel.SystemCoupon = result.SystemSalesCoupon;
                _this.$scope.sessionClosingVarificationModel.ActualCreditAccount = result.ActualSalesCreditAccount;
                _this.$scope.sessionClosingVarificationModel.SystemCreditAccount = result.SystemSalesCreditAccount;
                _this.$scope.sessionClosingVarificationModel.ActualReturnBill = result.ActualSalesReturnBill;
                _this.$scope.sessionClosingVarificationModel.SystemReturnBill = result.SystemSalesReturnBill;
                _this.$scope.sessionClosingVarificationModel.ActualTotalIn = result.ActualSalesTotalIn;
                _this.$scope.sessionClosingVarificationModel.SystemTotalIn = result.SystemSalesTotalIn;
                _this.$scope.sessionClosingVarificationModel.ActualTotalOut = result.ActualSalesReturnBill;
                _this.$scope.sessionClosingVarificationModel.SystemTotalOut = result.SystemSalesReturnBill;
                _this.$scope.sessionClosingVarificationModel.ActualCheque = result.ActualCheque;
                _this.$scope.sessionClosingVarificationModel.SystemCheque = result.SystemCheque;
                _this.$scope.sessionClosingVarificationModel.SessionId = result.POSSessionId;
                if (result.IsApproval) {
                    _this.$scope.isApproval = true;
                    _this.$scope.isVarificationPortion = false;
                    _this.$scope.isResolvingStatus = true;
                }
                else if (result.IsRiview) {
                    _this.$scope.isApproval = false;
                    _this.$scope.isVarificationPortion = true;
                    _this.$scope.isResolvingStatus = false;
                }
                if (result.MismatchResolveTypeID !== 0 && result.MismatchResolveTypeID !== 1) {
                    _this.$scope.POSApprovalObject.StatusId = result.MismatchResolveTypeID;
                }
                else {
                    _this.$scope.isResolvingStatus = false;
                }
                //this section for non slaes transaction. -An
                _this.$scope.nonSalesTransactionCollection = [];
                var nonSalesTransaction = _this.$scope.nonSalesTransactionCollection;
                _this.$scope.errorMessageDisplayForBlankList = false;
                if (result.listOfPOSNonSalesTransactionListAC.length > 0) {
                    for (var i = 0; i < result.listOfPOSNonSalesTransactionListAC.length; i++) {
                        nonSalesTransaction.push(result.listOfPOSNonSalesTransactionListAC[i]);
                    }
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    _this.$scope.totalCollection = nonSalesTransaction.slice(begin, end);
                    /* init pagination with $scope.list */
                    _this.$scope.totalItems = _this.$scope.nonSalesTransactionCollection.length;
                }
                else {
                    _this.$scope.errorMessageDisplayForBlankList = true;
                }
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$rootScope.isLoading = false;
        });
    };
    //this function used for display sales transaction portion. -An
    SessionClosingVarificationController.prototype.clickOnSalesTransaction = function () {
        this.$scope.isOpenSales = true;
    };
    //this function used for display non sales transaction portion. -An
    SessionClosingVarificationController.prototype.clickOnNonSalesTransaction = function () {
        this.$scope.isOpenSales = false;
    };
    return SessionClosingVarificationController;
}());
SessionClosingVarificationController.controllerId = "SessionClosingVarificationController";
app.controller(SessionClosingVarificationController.controllerId, ['$scope', '$log', '$rootScope', 'POSSessionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', function ($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        return new SessionClosingVarificationController($scope, $log, $rootScope, POSSessionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
    }]);
//# sourceMappingURL=SessionClosingVarificationController.js.map
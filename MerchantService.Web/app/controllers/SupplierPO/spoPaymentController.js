var SpoPaymentController = (function () {
    function SpoPaymentController($scope, $log, spoPaymentService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location, filterFilter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.spoPaymentService = spoPaymentService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.spoPayment = new Model.SPOPayment();
        this.$scope.spoReceivingBill = new Model.SPOReceivingBill();
        this.$scope.getBillList = function () { return _this.getBillList(); };
        this.$scope.creditNoteSelect = function () { return _this.creditNoteSelect(); };
        this.$scope.searchBill = function () { return _this.searchBill(); };
        this.$scope.saveSPOPayment = function () { return _this.saveSPOPayment(); };
        this.$scope.refreshSPO = function () { return _this.refreshSPO(); };
        this.$scope.emptyBillList = false;
        this.$scope.isBillVisible = false;
        this.$scope.isPaymentVisible = false;
        this.$scope.supplierList = [];
        this.$scope.billList = [];
        this.$scope.search = [];
        this.$scope.actualDifference = 1;
        this.$scope.isCashPO = false;
        this.$scope.billTotalList = [];
        this.$scope.poItemList = [];
        this.$scope.comment = [];
        this.$scope.creditNoteList = [];
        this.$scope.billNotFound = stringConstants.billNotFound;
        this.$scope.calculateDifference = function () { return _this.calculateDifference(); };
        this.$scope.totalPayment = 0;
        this.$scope.billTotal = 0;
        this.$scope.difference = 0;
        this.$scope.billSelect = function () { return _this.billSelect(); };
        this.$scope.getCreditNoteList = function (SupplierId) { return _this.getCreditNoteList(SupplierId); };
        this.$scope.allowPayment = function () { return _this.allowPayment(); };
        this.$scope.isPayButtonDisabled = function () { return _this.isPayButtonDisabled(); };
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.initialize();
    }
    SpoPaymentController.prototype.initialize = function () {
        this.getSupplierList();
        this.getBillList();
    };
    // used to fetch supplier list
    SpoPaymentController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.spoPaymentService.getSupplierList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to fetch Supplier Bill List - jj
    SpoPaymentController.prototype.getBillList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var list = [];
        var promise = this.spoPaymentService.getSupplierBillList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    result[i].IsSelected = false;
                    if (!result[i].IsPaid) {
                        list.push(result[i]);
                    }
                }
                controllerScope.billList = list;
                controllerScope.billTotalList = list;
                controllerScope.emptyBillList = false;
            }
            else {
                controllerScope.emptyBillList = true;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to search - jj
    SpoPaymentController.prototype.searchBill = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.billTotal = 0;
        controllerScope.creditNoteList = [];
        this.allowPayment();
        controllerRootScope.isLoading = true;
        var promise = this.spoPaymentService.checkSPO(controllerScope.search.PurchaseOrderNo);
        promise.then(function (result) {
            if (result.poItemList !== undefined && result.poItemList !== null) {
                controllerRootScope.isLoading = false;
                controllerScope.billList = _this.filterFilter((controllerScope.billTotalList), controllerScope.search);
                _this.getCreditNoteList(controllerScope.search.SupplierId);
                controllerScope.poItemList = [];
                controllerScope.poItemList = result.poItemList;
                if (controllerScope.billList.length > 0) {
                    for (var j = 0; j < controllerScope.billList.length; j++) {
                        controllerScope.billList[j].IsSelected = false;
                    }
                    controllerScope.isBillVisible = true;
                    controllerScope.emptyBillList = false;
                }
                else {
                    controllerScope.isBillVisible = false;
                    controllerScope.emptyBillList = true;
                }
            }
            else {
                controllerRootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: result.status
                });
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.BillNotFound
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to select a particular bill from the billList - jj
    SpoPaymentController.prototype.billSelect = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var count = 0;
        var list = [];
        var IsICRCreated = false;
        var IsWorkFlowNotCreated = false;
        for (var j = 0; j < controllerScope.billList.length; j++) {
            if (controllerScope.billList[j].IsSelected) {
                controllerScope.billList[j].CanBePaid = false;
                controllerScope.billList[j].IsWorkFlowNotCreated = false;
                controllerScope.spoReceivingBill = controllerScope.billList[j];
                list.push(controllerScope.spoReceivingBill);
            }
        }
        controllerRootScope.isLoading = true;
        var promise = this.spoPaymentService.checkCondition(list);
        promise.then(function (result) {
            if (result.length > 0) {
                for (var a = 0; a < result.length; a++) {
                    for (var b = 0; b < controllerScope.billList.length; b++) {
                        if (result[a].BillId === controllerScope.billList[b].BillId) {
                            controllerScope.billList[b] = result[a];
                        }
                    }
                }
                controllerScope.spoPayment.Amount = 0;
                for (var i = 0; i < controllerScope.billList.length; i++) {
                    if (controllerScope.billList[i].IsSelected && controllerScope.billList[i].CanBePaid && controllerScope.billList[i].SupplierId === controllerScope.search.SupplierId) {
                        count = 1;
                        controllerScope.spoPayment.Amount = parseFloat("" + controllerScope.spoPayment.Amount) + parseFloat("" + controllerScope.billList[i].Amount);
                        if (controllerScope.billList[i].IsCashPO) {
                            controllerScope.isCashPO = true;
                        }
                    }
                    else {
                        if (controllerScope.billList[i].IsWorkFlowNotCreated) {
                            IsWorkFlowNotCreated = true;
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.workFlowNotCreated
                            });
                        }
                        else if (controllerScope.billList[i].IsBillNotFound) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.BillNoNotFound.replace(/{Billno}/, controllerScope.billList[i].BillNumber)
                            });
                        }
                        else {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.BillNoNotPaid.replace(/{BillNo}/, controllerScope.billList[i].BillNumber)
                            });
                        }
                    }
                    if (controllerScope.billList[i].IsICRCreated) {
                        IsICRCreated = true;
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.ICRGenerated.replace(/{BillNo}/, controllerScope.billList[i].BillNumber)
                        });
                    }
                    else if (controllerScope.billList[i].IsICRAlreadyCreated) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.ICRAlreadyGenerated
                        });
                    }
                }
                for (var c = 0; c < controllerScope.billList.length; c++) {
                    if (IsWorkFlowNotCreated) {
                        controllerScope.billList[c].IsSelected = false;
                        count = 0;
                    }
                }
                if (count === 1) {
                    controllerScope.isPaymentVisible = true;
                }
                else {
                    _this.allowPayment();
                    controllerRootScope.isLoading = false;
                    controllerScope.isPaymentVisible = false;
                }
                _this.calculateDifference();
                controllerRootScope.isLoading = false;
            }
            else {
                _this.allowPayment();
                controllerRootScope.isLoading = false;
                controllerScope.isPaymentVisible = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.BillNotPaid
            });
            controllerRootScope.isLoading = false;
        });
    };
    SpoPaymentController.prototype.calculateDifference = function () {
        var controllerScope = this.$scope;
        var credit = 0;
        var cash = 0;
        var cheque = 0;
        if (controllerScope.spoPayment.Credit !== "" && controllerScope.spoPayment.Credit !== undefined && controllerScope.spoPayment.Credit !== null) {
            credit = controllerScope.spoPayment.Credit;
        }
        if (controllerScope.spoPayment.Cheque !== "" && controllerScope.spoPayment.Cheque !== undefined && controllerScope.spoPayment.Cheque !== null) {
            cheque = controllerScope.spoPayment.Cheque;
        }
        if (controllerScope.spoPayment.Cash !== "" && controllerScope.spoPayment.Cash !== undefined && controllerScope.spoPayment.Cash !== null) {
            cash = controllerScope.spoPayment.Cash;
        }
        controllerScope.difference = controllerScope.spoPayment.Amount - ((parseFloat("" + credit)) + (parseFloat("" + cash)) + (parseFloat("" + cheque)));
        controllerScope.difference = this.roundToTow(controllerScope.difference);
        controllerScope.actualDifference = controllerScope.difference;
        if (controllerScope.difference < 0) {
            controllerScope.difference = 0;
        }
    };
    //Method to Round value upto 2 decimal digits
    SpoPaymentController.prototype.roundToTow = function (value) {
        if (value !== null && value !== undefined) {
            return (Math.round((value + 0.00001) * 100) / 100);
        }
        return value;
    };
    //used to fetch Credit Note List - jj
    SpoPaymentController.prototype.getCreditNoteList = function (SupplierId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.spoPaymentService.getCreditNoteList(SupplierId);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                result[i].IsSelected = false;
            }
            controllerScope.creditNoteList = result;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.CNNotFetched
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to select credit Note - jj
    SpoPaymentController.prototype.creditNoteSelect = function () {
        var controllerScope = this.$scope;
        controllerScope.spoPayment.Credit = 0;
        for (var i = 0; i < controllerScope.creditNoteList.length; i++) {
            if (controllerScope.creditNoteList[i].IsSelected) {
                controllerScope.spoPayment.Credit = parseFloat("" + controllerScope.spoPayment.Credit) + parseFloat("" + controllerScope.creditNoteList[i].ActualAmount);
            }
        }
        if ((controllerScope.spoPayment.Amount - controllerScope.spoPayment.Credit) > 0) {
        }
        else {
            controllerScope.spoPayment.Credit = controllerScope.spoPayment.Amount;
        }
        controllerScope.spoPayment.Credit = this.roundToTow(controllerScope.spoPayment.Credit);
        this.calculateDifference();
    };
    //used to make the payment - jj
    SpoPaymentController.prototype.saveSPOPayment = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var list = [];
        for (var j = 0; j < controllerScope.billList.length; j++) {
            if (controllerScope.billList[j].CanBePaid) {
                controllerScope.spoReceivingBill = controllerScope.billList[j];
                list.push(controllerScope.spoReceivingBill);
            }
        }
        controllerScope.spoPayment.SPOBill = list;
        list = [];
        for (var j = 0; j < controllerScope.creditNoteList.length; j++) {
            if (controllerScope.creditNoteList[j].IsSelected) {
                list.push(controllerScope.creditNoteList[j]);
            }
        }
        var Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        controllerScope.spoPayment.Comment = Comment;
        controllerScope.spoPayment.CreditNoteDetail = list;
        var promise = this.spoPaymentService.saveSPOPayment(controllerScope.spoPayment);
        promise.then(function (result) {
            if (result.status === "ok") {
                _this.$location.path("/SupplierPurchaseOrderBillPayment/");
                _this.ngToast.create(stringConstants.SPOPAymentDone);
            }
            else if (result !== "") {
                _this.ngToast.create(result.status);
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.PaymentNotDone
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to refresh the page - jj
    SpoPaymentController.prototype.refreshSPO = function () {
        var controllerScope = this.$scope;
        this.allowPayment();
        controllerScope.isBillVisible = false;
        controllerScope.search = [];
    };
    SpoPaymentController.prototype.allowPayment = function () {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.creditNoteList.length; i++) {
            controllerScope.creditNoteList[i].IsSelected = false;
        }
        controllerScope.spoPayment.Credit = 0;
        if (controllerScope.isCashPO) {
            controllerScope.spoPayment.Cash = 0;
        }
        else {
            controllerScope.spoPayment.Cheque = 0;
            controllerScope.spoPayment.ChequeNo = 0;
        }
        controllerScope.spoPayment.VoucherNo = 0;
        controllerScope.spoPayment.Amount = 0;
        controllerScope.difference = 0;
    };
    SpoPaymentController.prototype.isPayButtonDisabled = function () {
        var controllerScope = this.$scope;
        if (controllerScope.isPaymentVisible) {
            if (controllerScope.actualDifference === 0) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };
    return SpoPaymentController;
}());
SpoPaymentController.controllerId = "SpoPaymentController";
app.controller(SpoPaymentController.controllerId, ['$scope', '$log', 'SpoPaymentService', 'ngToast', '$rootScope', 'apiPath', '$modal', '$routeParams', '$location', 'filterFilter', function ($scope, $log, SpoPaymentService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location, filterFilter) {
        return new SpoPaymentController($scope, $log, SpoPaymentService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location, filterFilter);
    }]);
//# sourceMappingURL=spoPaymentController.js.map
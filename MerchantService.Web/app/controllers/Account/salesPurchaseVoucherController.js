/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var SalesPurchaseVoucherController = (function () {
    function SalesPurchaseVoucherController($scope, $log, salesPurchaseVoucherService, userAccessService, ngToast, $rootScope, $location, listOfAccessPages, authenticationPath) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.salesPurchaseVoucherService = salesPurchaseVoucherService;
        this.userAccessService = userAccessService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.$scope.salesPurchaseDetail = new Model.SalesPurchaseDetail();
        this.$scope.salesPurchaseVouchers = new Model.SalesPurchaseVouchers();
        this.$scope.ledgerList = [];
        this.$scope.isSales = false;
        this.$scope.getLedgerList = function (isSales) { return _this.getLedgerList(isSales); };
        this.$scope.getSalesLedger = function () { return _this.getSalesLedger(); };
        this.$scope.salesLedger = [];
        this.$scope.getSelectedAccount = function (id) { return _this.getSelectedAccount(id); };
        this.$scope.panelBank = false;
        this.$scope.itemList = [];
        this.$scope.getItemProfileList = function () { return _this.getItemProfileList(); };
        this.$scope.salesLedgerRequired = stringConstants.salesLedgerRequired;
        this.$scope.partyAccountRequired = stringConstants.partyAccountRequired;
        this.$scope.isSelected = false;
        this.$scope.isAmount = false;
        this.$scope.amount = "";
        this.$scope.amounts = [];
        this.$scope.isValidAmount = true;
        this.$scope.addNewLedger = function (Id, amount) { return _this.addNewLedger(Id, amount); };
        this.$scope.isAmountZero = false;
        this.$scope.salesPurchaseDetails = [];
        this.$scope.itemName = "";
        this.$scope.receiptLedgerSelectedChange = function (index, accountId, ledgerName) { return _this.receiptLedgerSelectedChange(index, accountId, ledgerName); };
        this.$scope.selectedLedgerList = [];
        this.$scope.isDatePikcerOpened = false;
        this.$scope.openDatePicker = function (event) { return _this.openDatePicker(event); };
        this.$scope.receivedFrom = "";
        this.$scope.paramTypes = [];
        this.$scope.changeReceivedFromLedger = function (ledgerName, receivedFromId) { return _this.changeReceivedFromLedger(ledgerName, receivedFromId); };
        this.$scope.removeLedger = function (index) { return _this.removeLedger(index); };
        this.$scope.isItemExists = false;
        this.$scope.itemExists = stringConstants.itemExists;
        this.$scope.itemRequired = stringConstants.itemRequired;
        this.$scope.amountRequired = stringConstants.amountRequired;
        this.$scope.checkIntegerAmount = function (amount, index) { return _this.checkIntegerAmount(amount, index); };
        this.$scope.amountZero = stringConstants.amountZero;
        this.$scope.countSalesVoucherRecord = function (isSales) { return _this.countSalesVoucherRecord(isSales); };
        this.$scope.salesVoucherCount = 0;
        this.$scope.isTranscationType = false;
        this.$scope.transcationTypeRequired = stringConstants.transcationTypeRequired;
        this.$scope.totalAmount = "";
        this.$scope.saveSalesPurchaseVoucher = function (salesPurchaseVoucher, salesPurchaseDetail, isSales) { return _this.saveSalesPurchaseVoucher(salesPurchaseVoucher, salesPurchaseDetail, isSales); };
        this.$scope.ClearControl = function () { return _this.ClearControl(); };
        this.$scope.selectPurchaseLedger = stringConstants.selectPurchaseLedger;
        this.$scope.getPurchaseLedger = function () { return _this.getPurchaseLedger(); };
        this.$scope.purchaseLedgerList = [];
        this.$scope.isAddItem = false;
        this.$scope.addItem = stringConstants.addItem;
        this.$scope.isFocusIn = true;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.initialization();
    }
    SalesPurchaseVoucherController.prototype.initialization = function () {
        this.getItemProfileList();
        this.getParamTypeByParamId();
    };
    // get the list of ledger from database -SP
    SalesPurchaseVoucherController.prototype.getLedgerList = function (isSales) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerScope.isSales = isSales;
        var location = this.$location.path();
        //if Sales voucher then it get list of sales ledger otherwise get the list of purchase leadger.
        if (isSales) {
            this.getSalesLedger();
        }
        else {
            this.getPurchaseLedger();
        }
        this.countSalesVoucherRecord(controllerScope.isSales);
        var promise = this.salesPurchaseVoucherService.getLedgerList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.ledgerList.push(result[i]);
            }
        }).catch(function (error) {
            _this.$log.log(error);
        });
    };
    SalesPurchaseVoucherController.prototype.getSalesLedger = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var promise = this.salesPurchaseVoucherService.getSaleLedgers();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.salesLedger.push(result[i]);
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            //IF data not found, then it will sohow message.
            if (error.status === 500) {
                _this.$log.log(error);
            }
            controllerRootScope.isLoading = false;
        });
    };
    //This method is used for getting Bank and Cash related account-SP
    SalesPurchaseVoucherController.prototype.getSelectedAccount = function (ledgers) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.salesPurchaseVoucherService.getSelectedLedgerAccount(ledgers.PartyAccountId);
        promise.then(function (result) {
            if (result.IsBankAccount === true) {
                controllerScope.panelBank = true;
            }
            else {
                controllerScope.panelBank = false;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //This method is used for getting list of item profile.
    SalesPurchaseVoucherController.prototype.getItemProfileList = function () {
        var _this = this;
        var controllScope = this.$scope;
        var controllRootScope = this.$rootScope;
        var promise = this.salesPurchaseVoucherService.getItemProfileList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllScope.itemList.push(result[i]);
            }
            controllRootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            controllRootScope.isLoading = false;
        });
    };
    // This method is used for adding control -SP
    SalesPurchaseVoucherController.prototype.addNewLedger = function (ItemId, amount) {
        var controllerScope = this.$scope;
        controllerScope.isAddItem = false;
        controllerScope.isValidAmount = true;
        var totalAmount = controllerScope.salesPurchaseVouchers.totalAmount;
        if (totalAmount === undefined || totalAmount === null) {
            totalAmount = 0;
        }
        if ((ItemId === undefined || ItemId === null) && amount === "") {
            controllerScope.isSelected = true;
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        }
        else if (ItemId === undefined || ItemId === null) {
            controllerScope.isSelected = true;
            controllerScope.isAmountZero = false;
        }
        else if (amount === "") {
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        }
        else if (isNaN(amount)) {
            controllerScope.isValidAmount = false;
        }
        else {
            //check for duplicate Ledger Account
            if (controllerScope.salesPurchaseDetails.length > 0) {
                for (var i = 0; i < controllerScope.salesPurchaseDetails.length; i++) {
                    if (controllerScope.salesPurchaseDetails[i].ItemId === ItemId) {
                        controllerScope.isItemExists = true;
                        return;
                    }
                }
            }
            controllerScope.isSelected = false;
            var salesPurchase = new Model.SalesPurchaseDetail();
            salesPurchase.ItemId = ItemId;
            salesPurchase.Amount = amount;
            salesPurchase.ItemName = controllerScope.itemName;
            controllerScope.salesPurchaseDetails.push(salesPurchase);
            controllerScope.amount = "";
            controllerScope.salesPurchaseDetail = new Model.SalesPurchaseDetail();
            controllerScope.amounts.push(amount);
            controllerScope.salesPurchaseVouchers.totalAmount = (Number(totalAmount) + Number(amount));
            controllerScope.isAmount = false;
            controllerScope.isSelected = false;
        }
    };
    //This method is used for stroe the selecte ledger name in list -SP
    SalesPurchaseVoucherController.prototype.receiptLedgerSelectedChange = function (index, accountId, ledgerName) {
        var controllerScope = this.$scope;
        controllerScope.isSelected = false;
        controllerScope.itemName = ledgerName;
        if (index === undefined || index === null) {
            controllerScope.selectedLedgerList[0] = accountId;
        }
        else {
            controllerScope.selectedLedgerList[index + 1] = accountId;
        }
    };
    // this method is used for open datepicker -SP
    SalesPurchaseVoucherController.prototype.openDatePicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDatePikcerOpened = true;
    };
    // this is used for set the label for Received from in Bank detail-SP
    SalesPurchaseVoucherController.prototype.changeReceivedFromLedger = function (ledgerName, receivedFromId) {
        var controllerScope = this.$scope;
        controllerScope.receivedFrom = ledgerName;
    };
    //get the list of ParamType value for all Transcation Type.-SP
    SalesPurchaseVoucherController.prototype.getParamTypeByParamId = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        var promise = this.salesPurchaseVoucherService.getParamTypeByParamId(50);
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.paramTypes.push(result[i]);
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    // This method is used for remove newly added control .-SP
    SalesPurchaseVoucherController.prototype.removeLedger = function (index) {
        var controllerScope = this.$scope;
        controllerScope.isItemExists = false;
        controllerScope.salesPurchaseDetails.splice(index, 1);
        if (controllerScope.amounts.length > 0) {
            controllerScope.salesPurchaseVouchers.totalAmount = (Number(controllerScope.salesPurchaseVouchers.totalAmount) - Number(controllerScope.amounts[index]));
            controllerScope.amounts.splice(index, 1);
            controllerScope.selectedLedgerList.splice(index, 1);
        }
        controllerScope.isAmount = false;
        controllerScope.isSelected = false;
    };
    //this method is use getting sales voucher count
    SalesPurchaseVoucherController.prototype.countSalesVoucherRecord = function (isSales) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.salesPurchaseVoucherService.getSalesVoucherCount(isSales);
        promise.then(function (result) {
            controllerScope.salesVoucherCount = Number(result.recordCount) + 1;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //Save Sales and Purchase Voucher Record to database.-SP
    SalesPurchaseVoucherController.prototype.saveSalesPurchaseVoucher = function (salesPurchaseVoucher, salesPurchaseDetail, isSales) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isSelected = false;
        controllerScope.isAmount = false;
        if (salesPurchaseDetail.length === 0) {
            controllerScope.isAddItem = true;
            controllerRootScope.isLoading = false;
            return;
        }
        //check amount is 0 (zero) or not
        for (var i = 0; i < salesPurchaseDetail.length; i++) {
            if (salesPurchaseDetail[i].Amount === 0 || salesPurchaseDetail[i].Amount === undefined || salesPurchaseDetail[i].Amount === null) {
                controllerScope.amountZero = stringConstants.amountZero;
                controllerScope.isAmountZero = true;
                controllerRootScope.isLoading = false;
                return;
            }
        }
        //Check Ledger and Transcation type are selected or not for bank ledger.
        if (controllerScope.panelBank === true) {
            if (salesPurchaseVoucher.ParamTypeId === undefined || salesPurchaseVoucher.ParamTypeId === null) {
                controllerScope.isTranscationType = true;
                controllerRootScope.isLoading = false;
                return;
            }
        }
        controllerScope.isTranscationType = false;
        controllerScope.salesPurchaseVouchers.IsSalesVoucher = isSales;
        controllerScope.salesPurchaseVouchers.salesPurchaseDetail = salesPurchaseDetail;
        var promise = this.salesPurchaseVoucherService.saveSalesPurchaseVoucherAccount(salesPurchaseVoucher);
        promise.then(function (result) {
            _this.countSalesVoucherRecord(controllerScope.isSales);
            controllerScope.salesPurchaseDetails = [];
            controllerScope.salesPurchaseVouchers.totalAmount = 0;
            controllerScope.salesPurchaseVouchers.narration = "";
            controllerScope.ledgerList.selected = undefined;
            controllerScope.itemList.selected = undefined;
            controllerScope.salesPurchaseDetail = new Model.SalesPurchaseDetail;
            controllerScope.salesPurchaseVouchers = new Model.SalesPurchaseVouchers;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
        var controlerScope = this.$scope;
        controlerScope.addSales.$setPristine();
        controlerScope.addSales.$setUntouched();
        controllerScope.isItemExists = false;
        controllerScope.totalAmount = 0;
        controllerScope.amount = "";
        controllerScope.panelBank = false;
    };
    //set to default form property
    SalesPurchaseVoucherController.prototype.ClearControl = function () {
        var controllerScope = this.$scope;
        controllerScope.salesPurchaseDetail = new Model.SalesPurchaseDetail();
        controllerScope.salesPurchaseVouchers = new Model.SalesPurchaseVouchers();
        controllerScope.salesPurchaseDetails = [];
        controllerScope.amountZero = "";
        controllerScope.isAmountZero = false;
        controllerScope.isValidAmount = true;
        controllerScope.isItemExists = false;
        controllerScope.isTranscationType = false;
        controllerScope.isReceivedFrom = false;
        controllerScope.isSelected = false;
        controllerScope.isAmount = false;
        controllerScope.amount = "";
        controllerScope.totalAmount = 0;
        controllerScope.receivedFrom = "";
        controllerScope.panelBank = false;
        controllerScope.isAddItem = false;
        controllerScope.addSales.$setPristine();
        controllerScope.addSales.$setUntouched();
    };
    SalesPurchaseVoucherController.prototype.getPurchaseLedger = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var promise = this.salesPurchaseVoucherService.getPurchasesLedgers();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.purchaseLedgerList.push(result[i]);
            }
        }).catch(function (error) {
            //IF data not found, then it will sohow message.
            if (error.status === 500) {
                _this.$log.log(error);
            }
            controllerRootScope.isLoading = false;
        });
    };
    SalesPurchaseVoucherController.prototype.checkIntegerAmount = function (actual, index) {
        var controllerScope = this.$scope;
        if (actual !== "" && actual !== undefined && actual !== null) {
            if (isNaN(actual)) {
                controllerScope.addSales.$invalid = true;
                return true;
            }
            else {
                return false;
            }
        }
    };
    return SalesPurchaseVoucherController;
}());
SalesPurchaseVoucherController.controllerId = "SalesPurchaseVoucherController";
app.controller(SalesPurchaseVoucherController.controllerId, ['$scope', '$log', 'SalesPurchaseVoucherService', 'UserAccessService', 'ngToast', '$rootScope', '$location', 'listOfAccessPages', 'authenticationPath', function ($scope, $log, SalesPurchaseVoucherService, UserAccessService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath) {
        return new SalesPurchaseVoucherController($scope, $log, SalesPurchaseVoucherService, UserAccessService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath);
    }]);
//# sourceMappingURL=salesPurchaseVoucherController.js.map
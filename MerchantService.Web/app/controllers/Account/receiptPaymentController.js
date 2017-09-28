/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/account/receiptpaymentservice.ts" />
var ReceiptPaymentController = (function () {
    function ReceiptPaymentController($scope, $log, receiptPaymentService, ngToast, $rootScope, $location, listOfAccessPages, authenticationPath, userAccessService) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.receiptPaymentService = receiptPaymentService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.userAccessService = userAccessService;
        this.$scope.receiptPaymentDetail = new Model.ReceiptPaymentDetail;
        this.$scope.receiptPaymentVoucher = new Model.ReceiptPaymentVoucher;
        this.$scope.ledgerList = [];
        this.$scope.isLoading = false;
        this.$scope.getLedgerList = function (isReceipt) { return _this.getLedgerList(isReceipt); };
        this.$scope.getSelectedAccount = function (id) { return _this.getSelectedAccount(id); };
        this.$scope.panelBank = false;
        this.$scope.receiptPaymentDetails = [];
        this.$scope.addNewLedger = function (accountId, amount) { return _this.addNewLedger(accountId, amount); };
        this.$scope.removeLedger = function (index) { return _this.removeLedger(index); };
        this.$scope.totalAmount = "";
        this.$scope.calculateAmount = function (amount, index) { return _this.calculateAmount(amount, index); };
        this.$scope.amounts = [];
        this.$scope.getLedgerAccountWithoutBankAndCash = function () { return _this.getLedgerAccountWithoutBankAndCash(); };
        this.$scope.receiptPaymentLedgerList = [];
        this.$scope.saveReceiptVoucher = function (receiptPaymentVoucher, receiptPaymentDetail, isReceipt) { return _this.saveReceiptVoucher(receiptPaymentVoucher, receiptPaymentDetail, isReceipt); };
        this.$scope.receiptLedgerSelectedChange = function (index, accountId, ledgerName) { return _this.receiptLedgerSelectedChange(index, accountId, ledgerName); };
        this.$scope.selectedLedgerList = [];
        this.$scope.isSelected = false;
        this.$scope.isAmount = false;
        this.$scope.isAmountValid = true;
        this.$scope.checkIntegerAmount = function (amount, index) { return _this.checkIntegerAmount(amount, index); };
        this.$scope.amount = "";
        this.$scope.getParamTypeByParamId = function () { return _this.getParamTypeByParamId(); };
        this.$scope.paramTypes = [];
        this.$scope.openDatePicker = function (event) { return _this.openDatePicker(event); };
        this.$scope.isDatePikcerOpened = false;
        this.$scope.ledgerName = "";
        this.$scope.receivedFrom = "";
        this.$scope.changeReceivedFromLedger = function (ledgerName, receivedFromId) { return _this.changeReceivedFromLedger(ledgerName, receivedFromId); };
        this.$scope.accountRequired = stringConstants.accountRequired;
        this.$scope.ledgerAccountRequired = stringConstants.ledgerAccountRequired;
        this.$scope.amountRequired = stringConstants.amountRequired;
        this.$scope.amountZero = "";
        this.$scope.isAmountZero = false;
        this.$scope.countReceiptVoucherRecord = function (isReceipt) { return _this.countReceiptVoucherRecord(isReceipt); };
        this.$scope.receiptVoucherCount = 0;
        this.$scope.ledgerAccountExsits = stringConstants.ledgerAccountExsits;
        this.$scope.isLedgerExists = false;
        this.$scope.transcationTypeRequired = stringConstants.transcationTypeRequired;
        this.$scope.isTranscationType = false;
        this.$scope.isReceivedFrom = false;
        this.$scope.ClearControl = function () { return _this.ClearControl(); };
        this.$scope.addLedgerAccont = stringConstants.addLedgerAccont;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialization();
    }
    ReceiptPaymentController.prototype.initialization = function () {
        this.getLedgerAccountWithoutBankAndCash();
        this.getParamTypeByParamId();
    };
    // get the list of ledger from database -SP
    ReceiptPaymentController.prototype.getLedgerList = function (isReceipt) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isReceipt = isReceipt;
        this.countReceiptVoucherRecord(controllerScope.isReceipt);
        var promise = this.receiptPaymentService.getLedgerList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.ledgerList.push(result[i]);
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            controllerRootScope.isLoading = false;
        });
    };
    //This method is used for getting Bank and Cash related account-SP
    ReceiptPaymentController.prototype.getSelectedAccount = function (ledgers) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.receiptPaymentService.getSelectedLedgerAccount(ledgers.AccountId);
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
    // This method is used for adding control -SP
    ReceiptPaymentController.prototype.addNewLedger = function (accountId, amount) {
        var controllerScope = this.$scope;
        controllerScope.isAmountValid = true;
        controllerScope.isLedgerExists = false;
        controllerScope.isAmount = false;
        controllerScope.isAddLedgerAccount = false;
        var totalAmount = controllerScope.receiptPaymentVoucher.totalAmount;
        if (totalAmount === undefined || totalAmount === null || totalAmount === "") {
            totalAmount = 0;
        }
        if (accountId === undefined && amount === "" && accountId === null) {
            controllerScope.isSelected = true;
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        }
        else if (accountId === undefined) {
            controllerScope.isSelected = true;
            controllerScope.isAmountZero = false;
        }
        else if (amount === "") {
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        }
        else if (isNaN(amount)) {
            controllerScope.isAmountValid = false;
        }
        else {
            //check for duplicate Ledger Account
            if (controllerScope.receiptPaymentDetails.length > 0) {
                for (var i = 0; i < controllerScope.receiptPaymentDetails.length; i++) {
                    if (controllerScope.receiptPaymentDetails[i].LedgerId === accountId) {
                        controllerScope.isLedgerExists = true;
                        return;
                    }
                }
            }
            controllerScope.isLedgerExists = false;
            controllerScope.isSelected = false;
            var receiptPayment = new Model.ReceiptPaymentDetail();
            receiptPayment.LedgerId = accountId;
            receiptPayment.Amount = amount;
            receiptPayment.LedgerName = controllerScope.ledgerName;
            controllerScope.receiptPaymentDetails.push(receiptPayment);
            controllerScope.amount = "";
            controllerScope.receiptPaymentDetail = new Model.ReceiptPaymentDetail();
            controllerScope.amounts.push(amount);
            controllerScope.receiptPaymentVoucher.totalAmount = (Number(totalAmount) + Number(amount));
            controllerScope.isAmount = false;
            controllerScope.isSelected = false;
        }
    };
    // This method is used for remove newly added control .-SP
    ReceiptPaymentController.prototype.removeLedger = function (index) {
        var controllerScope = this.$scope;
        controllerScope.receiptPaymentDetails.splice(index, 1);
        if (controllerScope.amounts.length > 0) {
            controllerScope.receiptPaymentVoucher.totalAmount = (Number(controllerScope.receiptPaymentVoucher.totalAmount) - Number(controllerScope.amounts[index]));
            controllerScope.amounts.splice(index, 1);
            controllerScope.selectedLedgerList.splice(index, 1);
        }
    };
    //This method is used for calculating Total amount.-SP
    ReceiptPaymentController.prototype.calculateAmount = function (amount, index) {
        var controllerScope = this.$scope;
        controllerScope.isAmountZero = false;
        amount = parseFloat(amount);
        var totalAmount = controllerScope.receiptPaymentVoucher.totalAmount;
        if (totalAmount === undefined || totalAmount === null) {
            totalAmount = 0;
        }
        if (amount !== "") {
            if (controllerScope.amounts.length !== 0) {
                //amount is added in array
                totalAmount = (Number(totalAmount) - Number(controllerScope.amounts[index]));
                if (isNaN(amount)) {
                    amount = 0;
                    controllerScope.amounts.splice(index, 1);
                }
                else {
                    controllerScope.amounts[index] = amount;
                }
            }
            else {
                // first time insert in array
                controllerScope.amounts.push(amount);
            }
            //calculate the total amount.
            controllerScope.receiptPaymentVoucher.totalAmount = (Number(totalAmount) + Number(amount));
        }
        else {
            if (index === undefined || index === null) {
                //if select defaul dropdown value.
                controllerScope.receiptPaymentVoucher.totalAmount = (Number(controllerScope.receiptPaymentVoucher.totalAmount) - Number(controllerScope.amounts[0]));
                controllerScope.amounts.splice(0, 1);
            }
            else {
                controllerScope.receiptPaymentVoucher.totalAmount = (Number(controllerScope.receiptPaymentVoucher.totalAmount) - Number(controllerScope.amounts[index + 1]));
                controllerScope.amounts.splice(index + 1, 1);
            }
        }
    };
    //get the list of ledger except Bank and Cash.-SP
    ReceiptPaymentController.prototype.getLedgerAccountWithoutBankAndCash = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.receiptPaymentService.getLedgerAccountWithoutBankCash();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.receiptPaymentLedgerList.push(result[i]);
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //Save Receipt Voucher Record to database.-SP
    ReceiptPaymentController.prototype.saveReceiptVoucher = function (receiptPaymentVoucher, receiptPaymentDetail, isReceipt) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isAmount = false;
        controllerScope.isSelected = false;
        if (receiptPaymentDetail.length === 0) {
            controllerScope.isAddLedgerAccount = true;
            controllerRootScope.isLoading = false;
            return;
        }
        //check amount is 0 (zero) or not
        for (var i = 0; i < receiptPaymentDetail.length; i++) {
            if (receiptPaymentDetail[i].Amount === 0 || receiptPaymentDetail[i].Amount === undefined || receiptPaymentDetail[i].Amount === null) {
                controllerScope.amountZero = stringConstants.amountZero;
                controllerScope.isAmountZero = true;
                controllerRootScope.isLoading = false;
                return;
            }
        }
        //Check Ledger and Transcation type are selected or not for bank ledger.
        if (controllerScope.panelBank === true) {
            if ((receiptPaymentVoucher.ReceivedFromId === undefined || receiptPaymentVoucher.ReceivedFromId === null) && (receiptPaymentVoucher.ParamTypeId === undefined || receiptPaymentVoucher.ParamTypeId === null)) {
                controllerScope.isReceivedFrom = true;
                controllerScope.isTranscationType = true;
                controllerRootScope.isLoading = false;
                return;
            }
            if (receiptPaymentVoucher.ReceivedFromId === undefined || receiptPaymentVoucher.ReceivedFromId === null) {
                controllerScope.isReceivedFrom = true;
                controllerRootScope.isLoading = false;
                return;
            }
            if (receiptPaymentVoucher.ParamTypeId === undefined || receiptPaymentVoucher.ParamTypeId === null) {
                controllerScope.isTranscationType = true;
                controllerRootScope.isLoading = false;
                return;
            }
        }
        controllerScope.isReceivedFrom = false;
        controllerScope.isTranscationType = false;
        controllerScope.receiptPaymentVoucher.IsReceipt = isReceipt;
        controllerScope.receiptPaymentVoucher.receiptPaymentDetail = receiptPaymentDetail;
        var promise = this.receiptPaymentService.saveReceiptVoucherAccount(receiptPaymentVoucher);
        promise.then(function (result) {
            _this.countReceiptVoucherRecord(controllerScope.isReceipt);
            controllerScope.receiptPaymentDetails = [];
            controllerScope.receiptPaymentVoucher.totalAmount = 0;
            controllerScope.receiptPaymentVoucher.narration = "";
            controllerScope.ledgerList.selected = undefined;
            controllerScope.receiptPaymentLedgerList.selected = undefined;
            controllerScope.receiptPaymentDetail = new Model.ReceiptPaymentDetail;
            controllerScope.receiptPaymentVoucher = new Model.ReceiptPaymentVoucher;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
        var controlerScope = this.$scope;
        controlerScope.addReceipt.$setPristine();
        controlerScope.addReceipt.$setUntouched();
        controllerScope.isLedgerExists = false;
        controllerScope.totalAmount = 0;
        controllerScope.amount = "";
        controllerScope.panelBank = false;
    };
    //This method is used for stroe the selecte ledger name in list -SP
    ReceiptPaymentController.prototype.receiptLedgerSelectedChange = function (index, accountId, ledgerName) {
        var controllerScope = this.$scope;
        controllerScope.isSelected = false;
        controllerScope.ledgerName = ledgerName;
        if (index === undefined || index === null) {
            controllerScope.selectedLedgerList[0] = accountId;
        }
        else {
            controllerScope.selectedLedgerList[index + 1] = accountId;
        }
    };
    //get the list of ParamType value for all Transcation Type.-SP
    ReceiptPaymentController.prototype.getParamTypeByParamId = function () {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.receiptPaymentService.getParamTypeByParamId(50);
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
    // this method is used for open datepicker -SP
    ReceiptPaymentController.prototype.openDatePicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDatePikcerOpened = true;
    };
    // this is used for set the label for Received from in Bank detail-SP
    ReceiptPaymentController.prototype.changeReceivedFromLedger = function (ledgerName, receivedFromId) {
        var controllerScope = this.$scope;
        controllerScope.receivedFrom = ledgerName;
    };
    //this method is use getting receipt voucher count
    ReceiptPaymentController.prototype.countReceiptVoucherRecord = function (isReceipt) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        var promise = this.receiptPaymentService.getReceiptVoucherCount(isReceipt);
        promise.then(function (result) {
            controllerScope.receiptVoucherCount = Number(result.recordCount) + 1;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //set to default form property.
    ReceiptPaymentController.prototype.ClearControl = function () {
        var controllerScope = this.$scope;
        controllerScope.receiptPaymentDetail = new Model.ReceiptPaymentDetail();
        controllerScope.receiptPaymentVoucher = new Model.ReceiptPaymentVoucher();
        controllerScope.receiptPaymentDetails = [];
        controllerScope.amountZero = "";
        controllerScope.isAmountZero = false;
        controllerScope.isLedgerExists = false;
        controllerScope.isTranscationType = false;
        controllerScope.isReceivedFrom = false;
        controllerScope.isSelected = false;
        controllerScope.isAmount = false;
        controllerScope.amount = "";
        controllerScope.totalAmount = 0;
        controllerScope.receivedFrom = "";
        controllerScope.panelBank = false;
        controllerScope.isAddLedgerAccount = false;
        controllerScope.isAmountValid = true;
        controllerScope.addReceipt.$setPristine();
        controllerScope.addReceipt.$setUntouched();
    };
    ReceiptPaymentController.prototype.checkIntegerAmount = function (amount, index) {
        var controllerScope = this.$scope;
        if (amount !== "" && amount !== undefined && amount !== null) {
            if (isNaN(amount)) {
                controllerScope.addReceipt.$invalid = true;
                return true;
            }
            else {
                return false;
            }
        }
    };
    return ReceiptPaymentController;
}());
ReceiptPaymentController.controllerId = "ReceiptPaymentController";
app.controller(ReceiptPaymentController.controllerId, ['$scope', '$log', 'ReceiptPaymentService', 'ngToast', '$rootScope', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', function ($scope, $log, ReceiptPaymentService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService) {
        return new ReceiptPaymentController($scope, $log, ReceiptPaymentService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService);
    }]);
//# sourceMappingURL=receiptPaymentController.js.map
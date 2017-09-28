// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var AccountingController = (function () {
    function AccountingController($scope, $log, ledgersService, ngToast, $rootScope, $location, apiPath, $modal, accountingService, $route) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.ledgersService = ledgersService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.accountingService = accountingService;
        this.$route = $route;
        this.$scope.journalEntryDetails = new Model.JournalEntryAc();
        this.$scope.journalEntryCollection = [{ LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" },
            { LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" },
            { LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" },
            { LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" }
        ];
        this.$scope.totalDebitAmount = 0;
        this.$scope.totalCreditAmount = 0;
        this.$scope.isJournalEntryOpen = false;
        this.$scope.journalEntryDetails.JournalDate = new Date();
        this.$scope.openJournalDateModel = function (event) { return _this.openJournalDateModel(event); };
        this.$scope.listOfLedgers = [];
        this.$scope.changeDebitAmount = function (index) { return _this.changeDebitAmount(index); };
        this.$scope.changeCreditAmount = function (index) { return _this.changeCreditAmount(index); };
        this.$scope.checkAccountSelectedOrNot = function () { return _this.checkAccountSelectedOrNot(); };
        this.$scope.changeAccountName = function (index) { return _this.changeAccountName(index); };
        this.$scope.addNewJournalEntry = function (index) { return _this.addNewJournalEntry(index); };
        this.$scope.removeJounalEntry = function (index) { return _this.removeJounalEntry(index); };
        this.$scope.saveAccountingJournalEntry = function () { return _this.saveAccountingJournalEntry(); };
        this.$scope.clearJournalEntry = function () { return _this.clearJournalEntry(); };
        this.$scope.ledgerAccountId = 0;
        this.$scope.journalIndex = 0;
        this.$scope.cancleAddLedgerPopup = function () { return _this.cancleAddLedgerPopup(); };
        this.$scope.isDataLoading = false;
        this.$scope.accountingEntryCollection = [];
        this.$scope.errorMessageDisplay = false;
        this.$scope.errorMessage = "";
        this.$rootScope.$on("closeAccountLedgersPopup", function (event, data) {
            _this.getAllLedgersList();
            _this.closeAddLedgerPopup(data);
            _this.$scope.ledgerAccountId = data;
        });
        this.$scope.getAllAccountingEntry = function () { return _this.getAllAccountingEntry(); };
        this.initialization();
        this.$scope.checNullkDescription = function () { return _this.checNullkDescription(); };
        this.$scope.isNullDescription = true;
    }
    AccountingController.prototype.initialization = function () {
        this.getAllLedgersList();
    };
    AccountingController.prototype.openJournalDateModel = function (event) {
        var controllerScope = this.$scope;
        event.preventDefault();
        event.stopPropagation();
        controllerScope.isJournalEntryOpen = true;
    };
    AccountingController.prototype.getAllLedgersList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.listOfLedgers = [];
        controllerScope.listOfLedgers.push({ LedgerId: "0", LedgerName: "Add new", IsAddNewAccount: true, Name: "Add new" });
        var promise = this.ledgersService.getLedgerWithChildLedger();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.listOfLedgers.push(result[i]);
                }
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
    AccountingController.prototype.changeDebitAmount = function (index) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
            if (i === index) {
                controllerScope.addNewJournalEntry(index);
                if (controllerScope.totalDebitAmount === 0 && controllerScope.totalCreditAmount === 0) {
                    if (controllerScope.journalEntryCollection[i].DebitAmount !== undefined && controllerScope.journalEntryCollection[i].DebitAmount !== 0 && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== "") {
                        controllerScope.totalDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                        controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                    }
                    else {
                        controllerScope.totalDebitAmount = 0;
                        controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                    }
                    break;
                }
                else {
                    if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 && controllerScope.journalEntryCollection[i].DebitAmount !== undefined && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== "") {
                        if (controllerScope.journalEntryCollection[i].OldDebitAmount !== 0 && controllerScope.journalEntryCollection[i].OldDebitAmount !== "" && controllerScope.journalEntryCollection[i].OldDebitAmount !== undefined && controllerScope.journalEntryCollection[i].OldDebitAmount !== null) {
                            controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldDebitAmount);
                        }
                        controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) + parseInt(controllerScope.journalEntryCollection[i].DebitAmount);
                        controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                        if (controllerScope.journalEntryCollection[i].CreditAmount !== 0 && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null && controllerScope.journalEntryCollection[i].CreditAmount !== "") {
                            controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].CreditAmount);
                            controllerScope.journalEntryCollection[i].CreditAmount = "";
                            controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                        }
                    }
                    else {
                        if (controllerScope.journalEntryCollection[i].OldDebitAmount !== 0 && controllerScope.journalEntryCollection[i].OldDebitAmount !== undefined && controllerScope.journalEntryCollection[i].OldDebitAmount !== "" && controllerScope.journalEntryCollection[i].OldDebitAmount !== null) {
                            controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldDebitAmount);
                            controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                        }
                    }
                    break;
                }
            }
        }
    };
    AccountingController.prototype.changeCreditAmount = function (index) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
            if (i === index) {
                controllerScope.addNewJournalEntry(index);
                if (controllerScope.totalDebitAmount === 0 && controllerScope.totalCreditAmount === 0) {
                    if (controllerScope.journalEntryCollection[i].CreditAmount !== 0 && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null && controllerScope.journalEntryCollection[i].CreditAmount !== "") {
                        controllerScope.totalCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                        controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                    }
                    else {
                        controllerScope.totalCreditAmount = 0;
                        controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                    }
                    break;
                }
                else {
                    if (controllerScope.journalEntryCollection[i].CreditAmount !== 0 && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null && controllerScope.journalEntryCollection[i].CreditAmount !== "") {
                        if (controllerScope.journalEntryCollection[i].OldCreditAmount !== 0 && controllerScope.journalEntryCollection[i].OldCreditAmount !== undefined && controllerScope.journalEntryCollection[i].OldCreditAmount !== "" && controllerScope.journalEntryCollection[i].OldCreditAmount !== null) {
                            controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldCreditAmount);
                        }
                        controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) + parseInt(controllerScope.journalEntryCollection[i].CreditAmount);
                        controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                        if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 && controllerScope.journalEntryCollection[i].DebitAmount !== undefined && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== "") {
                            controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].DebitAmount);
                            controllerScope.journalEntryCollection[i].DebitAmount = "";
                            controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                        }
                    }
                    else {
                        if (controllerScope.journalEntryCollection[i].OldCreditAmount !== 0 && controllerScope.journalEntryCollection[i].OldCreditAmount !== undefined && controllerScope.journalEntryCollection[i].OldCreditAmount !== "" && controllerScope.journalEntryCollection[i].OldCreditAmount !== null) {
                            controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldCreditAmount);
                            controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                        }
                    }
                    break;
                }
            }
        }
    };
    AccountingController.prototype.checNullkDescription = function () {
        var controllerScope = this.$scope;
        if (controllerScope.journalEntryCollection.length !== 0) {
            for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 || controllerScope.journalEntryCollection[i].CreditAmount !== 0) {
                    if ((controllerScope.journalEntryCollection[i].LedgerId !== "" && controllerScope.journalEntryCollection[i].LedgerId !== undefined && controllerScope.journalEntryCollection[i].LedgerId !== null)) {
                        if (controllerScope.journalEntryCollection[i].Description === "") {
                            controllerScope.isNullDescription = true;
                            break;
                        }
                        else {
                            controllerScope.isNullDescription = false;
                        }
                    }
                }
            }
        }
    };
    AccountingController.prototype.checkAccountSelectedOrNot = function () {
        var flag = false;
        var controllerScope = this.$scope;
        if (controllerScope.journalEntryCollection.length !== 0) {
            for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 || controllerScope.journalEntryCollection[i].CreditAmount !== 0) {
                    if ((controllerScope.journalEntryCollection[i].LedgerId !== "" && controllerScope.journalEntryCollection[i].LedgerId !== undefined && controllerScope.journalEntryCollection[i].LedgerId !== null)) {
                        flag = true;
                    }
                    else {
                        flag = false;
                        break;
                    }
                }
                return flag;
            }
        }
    };
    AccountingController.prototype.adNewLedgers = function () {
        var controllerRootScope = this.$rootScope;
        this.ledgerAddPopup = this.$modal.open({
            templateUrl: 'ledgerAddPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'AddLedgerController',
            scope: this.$scope,
        });
        controllerRootScope.isAccountLedger = true;
    };
    AccountingController.prototype.changeAccountName = function (index) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
            if (i === index) {
                controllerScope.journalIndex = index;
                if (controllerScope.journalEntryCollection[i].LedgerId === "0") {
                    this.adNewLedgers();
                    break;
                }
                else {
                    if (controllerScope.journalEntryCollection[i].Description === "") {
                        controllerScope.isNullDescription = true;
                    }
                    else {
                        controllerScope.isNullDescription = false;
                    }
                    if (controllerScope.journalEntryCollection[i].CreditAmount === 0 || controllerScope.journalEntryCollection[i].DebitAmount === 0) {
                        if (controllerScope.totalCreditAmount === controllerScope.totalDebitAmount) {
                            if (controllerScope.journalEntryCollection[i].DebitAmount === "") {
                                controllerScope.journalEntryCollection[i].DebitAmount = "";
                                controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                            }
                            if (controllerScope.journalEntryCollection[i].CreditAmount === "") {
                                controllerScope.journalEntryCollection[i].CreditAmount = "";
                                controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                            }
                            break;
                        }
                        else if (controllerScope.totalCreditAmount < controllerScope.totalDebitAmount) {
                            if (controllerScope.journalEntryCollection[i].CreditAmount === "") {
                                if (controllerScope.journalEntryCollection[i].DebitAmount === "") {
                                    controllerScope.journalEntryCollection[i].CreditAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.totalCreditAmount.toString());
                                    controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) + controllerScope.journalEntryCollection[i].CreditAmount;
                                    controllerScope.journalEntryCollection[i].DebitAmount = "";
                                    controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                                    controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                                }
                            }
                            break;
                        }
                        else if (controllerScope.totalCreditAmount > controllerScope.totalDebitAmount) {
                            if (controllerScope.journalEntryCollection[i].DebitAmount === "") {
                                if (controllerScope.journalEntryCollection[i].CreditAmount === "") {
                                    controllerScope.journalEntryCollection[i].DebitAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.totalDebitAmount.toString());
                                    controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) + controllerScope.journalEntryCollection[i].DebitAmount;
                                    controllerScope.journalEntryCollection[i].CreditAmount = "";
                                    controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                                    controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                                }
                            }
                            break;
                        }
                        else {
                            controllerScope.totalCreditAmount = 0;
                            controllerScope.totalDebitAmount = 0;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    };
    AccountingController.prototype.closeAddLedgerPopup = function (ledgerId) {
        var controllerRootScope = this.$rootScope;
        this.ledgerAddPopup.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.ledgersAccount = new Model.LedgersAccount();
        controllerRootScope.isAccountLedger = false;
        for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
            if (i === controllerScope.journalIndex) {
                controllerScope.journalEntryCollection[i].LedgerId = ledgerId;
            }
        }
    };
    AccountingController.prototype.cancleAddLedgerPopup = function () {
        var controllerRootScope = this.$rootScope;
        this.ledgerAddPopup.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.ledgersAccount = new Model.LedgersAccount();
        controllerRootScope.isAccountLedger = false;
        for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
            if (i === controllerScope.journalIndex) {
                controllerScope.journalEntryCollection[i].LedgerId = "";
            }
        }
    };
    AccountingController.prototype.addNewJournalEntry = function (index) {
        var controllerScope = this.$scope;
        if (controllerScope.journalEntryCollection.length === index + 1) {
            controllerScope.journalEntryCollection.push({ LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" });
        }
    };
    AccountingController.prototype.removeJounalEntry = function (index) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.journalEntryCollection.length; i++) {
            if (i === index) {
                if (controllerScope.journalEntryCollection[i].CreditAmount !== "" && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null) {
                    controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].CreditAmount);
                }
                if (controllerScope.journalEntryCollection[i].DebitAmount !== "" && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== undefined) {
                    controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].DebitAmount);
                }
                controllerScope.journalEntryCollection[i].LedgerId = "";
                controllerScope.journalEntryCollection[i].DebitAmount = "";
                controllerScope.journalEntryCollection[i].CreditAmount = "";
                controllerScope.journalEntryCollection[i].Description = "";
                controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                controllerScope.journalEntryCollection.splice(index, 1);
                break;
            }
        }
    };
    AccountingController.prototype.saveAccountingJournalEntry = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.journalEntryDetails.JournalEntryCollection = controllerScope.journalEntryCollection;
        var promise = this.accountingService.saveAccountingJournalEntry(controllerScope.journalEntryDetails);
        promise.then(function (result) {
            _this.$log.log("save accounting journal entry successfully");
            _this.clearJournalEntry();
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    AccountingController.prototype.clearJournalEntry = function () {
        this.$route.reload();
    };
    AccountingController.prototype.getAllAccountingEntry = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.accountingEntryCollection = [];
        var promise = this.accountingService.getAllAccountingEntry();
        promise.then(function (result) {
            _this.$log.log("get inventory transfer list susscussfully", result.length);
            controllerScope.errorMessageDisplay = false;
            controllerScope.accountingEntryCollection = result;
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    return AccountingController;
}());
AccountingController.controllerId = "AccountingController";
app.controller(AccountingController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'apiPath', '$modal', 'AccountingService', '$route', function ($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal, AccountingService, $route) {
        return new AccountingController($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal, AccountingService, $route);
    }]);
//# sourceMappingURL=accountingController.js.map
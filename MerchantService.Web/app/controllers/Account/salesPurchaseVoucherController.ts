/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />


interface IsalesPurchaseVoucherControllerScope extends ng.IScope {
    salesPurchaseDetail: Model.SalesPurchaseDetail;
    salesPurchaseVouchers: Model.SalesPurchaseVouchers;
    getLedgerList: Function;
    ledgerList: any;
    isSales: boolean;
    getSalesLedger: Function;
    salesLedger: any;
    panelBank: boolean;
    getSelectedAccount: Function;
    itemList: any;
    getItemProfileList: Function;
    salesLedgerRequired: string;
    partyAccountRequired: string;
    addNewLedger: Function;
    isSelected: boolean;
    isAmount: boolean;
    amount: string;
    isAmountZero: boolean;
    isValidAmount: boolean;
    salesPurchaseDetails: any;
    itemName: string;
    amounts: any;
    checkIntegerAmount: Function;
    receiptLedgerSelectedChange: Function;
    selectedLedgerList: any;
    isDatePikcerOpened: boolean;
    openDatePicker: Function;
    receivedFrom: string;
    changeReceivedFromLedger: Function;
    paramTypes: any;
    removeLedger: Function;
    isItemExists: boolean;
    itemExists: string;
    itemRequired: string;
    amountRequired: string;
    amountZero: string;
    countSalesVoucherRecord: Function;
    salesVoucherCount: number;
    isTranscationType: boolean;
    transcationTypeRequired: string;
    totalAmount: any;
    saveSalesPurchaseVoucher: Function;
    ClearControl: Function;
    selectPurchaseLedger: string;
    getPurchaseLedger: Function;
    purchaseLedgerList: any;
    isAddItem: boolean;
    addItem: string;
    isFocusIn: boolean;
    validAmountError: any;
}

interface IsalesPurchaseVoucherController {

}

class SalesPurchaseVoucherController implements IsalesPurchaseVoucherController {
    static controllerId = "SalesPurchaseVoucherController";

    constructor(private $scope: IsalesPurchaseVoucherControllerScope, private $log: ng.ILogService, private salesPurchaseVoucherService: SalesPurchaseVoucherService, private userAccessService: UserAccessService, public ngToast, public $rootScope, public $location, public listOfAccessPages, public authenticationPath) {
        this.$scope.salesPurchaseDetail = new Model.SalesPurchaseDetail();
        this.$scope.salesPurchaseVouchers = new Model.SalesPurchaseVouchers();
        this.$scope.ledgerList = [];
        this.$scope.isSales = false;
        this.$scope.getLedgerList = (isSales: boolean) => this.getLedgerList(isSales);
        this.$scope.getSalesLedger = () => this.getSalesLedger();
        this.$scope.salesLedger = [];
        this.$scope.getSelectedAccount = (id) => this.getSelectedAccount(id);
        this.$scope.panelBank = false;
        this.$scope.itemList = [];
        this.$scope.getItemProfileList = () => this.getItemProfileList();
        this.$scope.salesLedgerRequired = stringConstants.salesLedgerRequired;
        this.$scope.partyAccountRequired = stringConstants.partyAccountRequired;
        this.$scope.isSelected = false;
        this.$scope.isAmount = false;
        this.$scope.amount = "";
        this.$scope.amounts = [];
        this.$scope.isValidAmount = true;
        this.$scope.addNewLedger = (Id: number, amount: number) => this.addNewLedger(Id, amount);
        this.$scope.isAmountZero = false;
        this.$scope.salesPurchaseDetails = [];
        this.$scope.itemName = "";
        this.$scope.receiptLedgerSelectedChange = (index: number, accountId: number, ledgerName: string) => this.receiptLedgerSelectedChange(index, accountId, ledgerName);
        this.$scope.selectedLedgerList = [];
        this.$scope.isDatePikcerOpened = false;
        this.$scope.openDatePicker = (event) => this.openDatePicker(event);
        this.$scope.receivedFrom = "";
        this.$scope.paramTypes = [];
        this.$scope.changeReceivedFromLedger = (ledgerName: string, receivedFromId: number) => this.changeReceivedFromLedger(ledgerName, receivedFromId);
        this.$scope.removeLedger = (index: number) => this.removeLedger(index);
        this.$scope.isItemExists = false;
        this.$scope.itemExists = stringConstants.itemExists;
        this.$scope.itemRequired = stringConstants.itemRequired;
        this.$scope.amountRequired = stringConstants.amountRequired;
        this.$scope.checkIntegerAmount = (amount, index) => this.checkIntegerAmount(amount, index);
        this.$scope.amountZero = stringConstants.amountZero;
        this.$scope.countSalesVoucherRecord = (isSales: boolean) => this.countSalesVoucherRecord(isSales);
        this.$scope.salesVoucherCount = 0;
        this.$scope.isTranscationType = false;
        this.$scope.transcationTypeRequired = stringConstants.transcationTypeRequired;
        this.$scope.totalAmount = "";
        this.$scope.saveSalesPurchaseVoucher = (salesPurchaseVoucher: Model.SalesPurchaseVouchers, salesPurchaseDetail: Model.SalesPurchaseDetail, isSales: boolean) => this.saveSalesPurchaseVoucher(salesPurchaseVoucher, salesPurchaseDetail, isSales);
        this.$scope.ClearControl = () => this.ClearControl();
        this.$scope.selectPurchaseLedger = stringConstants.selectPurchaseLedger;
        this.$scope.getPurchaseLedger = () => this.getPurchaseLedger();
        this.$scope.purchaseLedgerList = [];
        this.$scope.isAddItem = false;
        this.$scope.addItem = stringConstants.addItem;
        this.$scope.isFocusIn = true;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.initialization();

    }

    private initialization() {
        this.getItemProfileList();
        this.getParamTypeByParamId();
    }

    // get the list of ledger from database -SP
    private getLedgerList(isSales) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerScope.isSales = isSales;
        let location = this.$location.path();

        //if Sales voucher then it get list of sales ledger otherwise get the list of purchase leadger.
        if (isSales) {
            this.getSalesLedger();
        }
        else {
            this.getPurchaseLedger();
        }

        this.countSalesVoucherRecord(controllerScope.isSales);
        let promise = this.salesPurchaseVoucherService.getLedgerList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.ledgerList.push(result[i]);
            }
        }).catch((error) => {
            this.$log.log(error);
        });
    }

    private getSalesLedger() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let promise = this.salesPurchaseVoucherService.getSaleLedgers();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.salesLedger.push(result[i]);
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            //IF data not found, then it will sohow message.
            if (error.status === 500) {
                this.$log.log(error);
            }
            controllerRootScope.isLoading = false;
        });
    }

    //This method is used for getting Bank and Cash related account-SP
    private getSelectedAccount(ledgers) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;

        let promise = this.salesPurchaseVoucherService.getSelectedLedgerAccount(ledgers.PartyAccountId);
        promise.then((result) => {
            if (result.IsBankAccount === true) {
                controllerScope.panelBank = true;
            } else {
                controllerScope.panelBank = false;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });

    }

    //This method is used for getting list of item profile.
    private getItemProfileList() {
        let controllScope = this.$scope;
        let controllRootScope = this.$rootScope;
        let promise = this.salesPurchaseVoucherService.getItemProfileList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllScope.itemList.push(result[i]);
            }
            controllRootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            controllRootScope.isLoading = false;
        });

    }

    // This method is used for adding control -SP
    private addNewLedger(ItemId, amount) {
        let controllerScope: any = this.$scope;
        controllerScope.isAddItem = false;
        controllerScope.isValidAmount = true;
        let totalAmount = controllerScope.salesPurchaseVouchers.totalAmount;
        if (totalAmount === undefined || totalAmount === null) {
            totalAmount = 0;
        }

        if ((ItemId === undefined || ItemId === null) && amount === "") {
            controllerScope.isSelected = true;
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        } else if (ItemId === undefined || ItemId === null) {
            controllerScope.isSelected = true;
            controllerScope.isAmountZero = false;
        } else if (amount === "") {
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        }
        else if (isNaN(amount)) {
            controllerScope.isValidAmount = false;
        }
        else {

            //check for duplicate Ledger Account
            if (controllerScope.salesPurchaseDetails.length > 0) {
                for (let i = 0; i < controllerScope.salesPurchaseDetails.length; i++) {
                    if (controllerScope.salesPurchaseDetails[i].ItemId === ItemId) {
                        controllerScope.isItemExists = true;
                        return;
                    }
                }
            }

            controllerScope.isSelected = false;
            let salesPurchase = new Model.SalesPurchaseDetail();
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

    }

    //This method is used for stroe the selecte ledger name in list -SP
    private receiptLedgerSelectedChange(index, accountId, ledgerName) {
        let controllerScope = this.$scope;
        controllerScope.isSelected = false;
        controllerScope.itemName = ledgerName;
        if (index === undefined || index === null) {
            controllerScope.selectedLedgerList[0] = accountId;

        } else {
            controllerScope.selectedLedgerList[index + 1] = accountId;
        }

    }

    // this method is used for open datepicker -SP
    private openDatePicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDatePikcerOpened = true;
    }

    // this is used for set the label for Received from in Bank detail-SP
    private changeReceivedFromLedger(ledgerName, receivedFromId) {
        let controllerScope = this.$scope;
        controllerScope.receivedFrom = ledgerName;
    }

    //get the list of ParamType value for all Transcation Type.-SP
    private getParamTypeByParamId() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        let promise = this.salesPurchaseVoucherService.getParamTypeByParamId(50);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.paramTypes.push(result[i]);
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    // This method is used for remove newly added control .-SP
    private removeLedger(index) {
        let controllerScope = this.$scope;
        controllerScope.isItemExists = false;
        controllerScope.salesPurchaseDetails.splice(index, 1);
        if (controllerScope.amounts.length > 0) {
            controllerScope.salesPurchaseVouchers.totalAmount = (Number(controllerScope.salesPurchaseVouchers.totalAmount) - Number(controllerScope.amounts[index]));
            controllerScope.amounts.splice(index, 1);
            controllerScope.selectedLedgerList.splice(index, 1);
        }
        controllerScope.isAmount = false;
        controllerScope.isSelected = false;
    }

    //this method is use getting sales voucher count
    private countSalesVoucherRecord(isSales) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        let promise = this.salesPurchaseVoucherService.getSalesVoucherCount(isSales);
        promise.then((result) => {
            controllerScope.salesVoucherCount = Number(result.recordCount) + 1;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    //Save Sales and Purchase Voucher Record to database.-SP
    private saveSalesPurchaseVoucher(salesPurchaseVoucher, salesPurchaseDetail, isSales) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isSelected = false;
        controllerScope.isAmount = false;
        if (salesPurchaseDetail.length === 0) {
            controllerScope.isAddItem = true;
            controllerRootScope.isLoading = false;
            return;
        }
        //check amount is 0 (zero) or not
        for (let i = 0; i < salesPurchaseDetail.length; i++) {
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
        let promise = this.salesPurchaseVoucherService.saveSalesPurchaseVoucherAccount(salesPurchaseVoucher);
        promise.then((result) => {
            this.countSalesVoucherRecord(controllerScope.isSales);
            controllerScope.salesPurchaseDetails = [];
            controllerScope.salesPurchaseVouchers.totalAmount = 0;
            controllerScope.salesPurchaseVouchers.narration = "";
            controllerScope.ledgerList.selected = undefined;
            controllerScope.itemList.selected = undefined;
            controllerScope.salesPurchaseDetail = new Model.SalesPurchaseDetail;
            controllerScope.salesPurchaseVouchers = new Model.SalesPurchaseVouchers;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
        let controlerScope: any = this.$scope;
        controlerScope.addSales.$setPristine();
        controlerScope.addSales.$setUntouched();
        controllerScope.isItemExists = false;

        controllerScope.totalAmount = 0;
        controllerScope.amount = "";
        controllerScope.panelBank = false;
    }

    //set to default form property
    private ClearControl() {
        let controllerScope: any = this.$scope;

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

    }

    private getPurchaseLedger() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let promise = this.salesPurchaseVoucherService.getPurchasesLedgers();

        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.purchaseLedgerList.push(result[i]);
            }
        }).catch((error) => {
            //IF data not found, then it will sohow message.
            if (error.status === 500) {
                this.$log.log(error);
            }
            controllerRootScope.isLoading = false;
        });
    }

    private checkIntegerAmount(actual, index) {
        let controllerScope: any = this.$scope;
        if (actual !== "" && actual !== undefined && actual !== null) {
            if (isNaN(actual)) {
                controllerScope.addSales.$invalid = true;
                return true;
            }
            else {
                return false;
            }
        }
    }

}

app.controller(SalesPurchaseVoucherController.controllerId, ['$scope', '$log', 'SalesPurchaseVoucherService', 'UserAccessService', 'ngToast', '$rootScope', '$location', 'listOfAccessPages', 'authenticationPath', ($scope, $log, SalesPurchaseVoucherService, UserAccessService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath) => {
    return new SalesPurchaseVoucherController($scope, $log, SalesPurchaseVoucherService, UserAccessService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath);
}]);


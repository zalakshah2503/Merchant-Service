/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/account/receiptpaymentservice.ts" />

interface IreceiptPaymentControllerScope extends ng.IScope {
    receiptPaymentDetail: Model.ReceiptPaymentDetail;
    receiptPaymentVoucher: Model.ReceiptPaymentVoucher;
    ledgerList: any;
    isLoading: boolean;
    getSelectedAccount: Function;
    getLedgerList: Function;
    panelBank: boolean;
    receiptPaymentDetails: any;
    addNewLedger: Function;
    removeLedger: Function;
    totalAmount: any;
    calculateAmount: Function;
    amounts: any;
    getLedgerAccountWithoutBankAndCash: Function;
    receiptPaymentLedgerList: any;
    saveReceiptVoucher: Function;
    receiptLedgerSelectedChange: Function;
    checkIntegerAmount: Function;
    selectedLedgerList: any;
    isSelected: boolean;
    isAmount: boolean;
    isAmountValid: boolean;
    amount: string;
    getParamTypeByParamId: Function;
    paramTypes: any;
    openDatePicker: Function;
    isDatePikcerOpened: boolean;
    ledgerName: string;
    receivedFrom: string;
    changeReceivedFromLedger: Function;
    accountRequired: string;
    ledgerAccountRequired: string;
    amountRequired: string;
    amountZero: string;
    isAmountZero: boolean;
    countReceiptVoucherRecord: Function;
    receiptVoucherCount: number;
    isReceipt: boolean;
    isLedgerExists: boolean;
    ledgerAccountExsits: string;
    isTranscationType: boolean;
    isReceivedFrom: boolean;
    transcationTypeRequired: string;
    ClearControl: Function;
    isAddLedgerAccount: boolean;
    addLedgerAccont: string;
    validAmountError: any;
    validQuantityError: any;
}

interface IreceiptPaymentController {

}

class ReceiptPaymentController implements IreceiptPaymentController {
    static controllerId = "ReceiptPaymentController";
    constructor(private $scope: IreceiptPaymentControllerScope, private $log: ng.ILogService, private receiptPaymentService: ReceiptPaymentService, public ngToast, public $rootScope, public $location, public listOfAccessPages, public authenticationPath, private userAccessService: UserAccessService) {
        this.$scope.receiptPaymentDetail = new Model.ReceiptPaymentDetail;
        this.$scope.receiptPaymentVoucher = new Model.ReceiptPaymentVoucher;
        this.$scope.ledgerList = [];
        this.$scope.isLoading = false;
        this.$scope.getLedgerList = (isReceipt: boolean) => this.getLedgerList(isReceipt);
        this.$scope.getSelectedAccount = (id) => this.getSelectedAccount(id);
        this.$scope.panelBank = false;
        this.$scope.receiptPaymentDetails = [];
        this.$scope.addNewLedger = (accountId: number, amount: number) => this.addNewLedger(accountId, amount);
        this.$scope.removeLedger = (index: number) => this.removeLedger(index);
        this.$scope.totalAmount = "";
        this.$scope.calculateAmount = (amount: number, index: number) => this.calculateAmount(amount, index);
        this.$scope.amounts = [];
        this.$scope.getLedgerAccountWithoutBankAndCash = () => this.getLedgerAccountWithoutBankAndCash();
        this.$scope.receiptPaymentLedgerList = [];
        this.$scope.saveReceiptVoucher = (receiptPaymentVoucher: Model.ReceiptPaymentVoucher, receiptPaymentDetail: Model.ReceiptPaymentDetail, isReceipt: boolean) => this.saveReceiptVoucher(receiptPaymentVoucher, receiptPaymentDetail, isReceipt);
        this.$scope.receiptLedgerSelectedChange = (index: number, accountId: number, ledgerName: string) => this.receiptLedgerSelectedChange(index, accountId, ledgerName);
        this.$scope.selectedLedgerList = [];
        this.$scope.isSelected = false;
        this.$scope.isAmount = false;
        this.$scope.isAmountValid = true;
        this.$scope.checkIntegerAmount = (amount, index) => this.checkIntegerAmount(amount, index);
        this.$scope.amount = "";
        this.$scope.getParamTypeByParamId = () => this.getParamTypeByParamId();
        this.$scope.paramTypes = [];
        this.$scope.openDatePicker = (event) => this.openDatePicker(event);
        this.$scope.isDatePikcerOpened = false;
        this.$scope.ledgerName = "";
        this.$scope.receivedFrom = "";
        this.$scope.changeReceivedFromLedger = (ledgerName: string, receivedFromId: number) => this.changeReceivedFromLedger(ledgerName, receivedFromId);
        this.$scope.accountRequired = stringConstants.accountRequired;
        this.$scope.ledgerAccountRequired = stringConstants.ledgerAccountRequired;
        this.$scope.amountRequired = stringConstants.amountRequired;
        this.$scope.amountZero = "";
        this.$scope.isAmountZero = false;
        this.$scope.countReceiptVoucherRecord = (isReceipt: boolean) => this.countReceiptVoucherRecord(isReceipt);
        this.$scope.receiptVoucherCount = 0;
        this.$scope.ledgerAccountExsits = stringConstants.ledgerAccountExsits;
        this.$scope.isLedgerExists = false;
        this.$scope.transcationTypeRequired = stringConstants.transcationTypeRequired;
        this.$scope.isTranscationType = false;
        this.$scope.isReceivedFrom = false;
        this.$scope.ClearControl = () => this.ClearControl();
        this.$scope.addLedgerAccont = stringConstants.addLedgerAccont;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialization();

    }
    private initialization() {
        this.getLedgerAccountWithoutBankAndCash();
        this.getParamTypeByParamId();

    }

    // get the list of ledger from database -SP
    private getLedgerList(isReceipt) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isReceipt = isReceipt;

       this.countReceiptVoucherRecord(controllerScope.isReceipt);
        let promise = this.receiptPaymentService.getLedgerList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.ledgerList.push(result[i]);
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            this.$log.log(error);
            controllerRootScope.isLoading = false;
        });

    }

    //This method is used for getting Bank and Cash related account-SP
    private getSelectedAccount(ledgers) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        let promise = this.receiptPaymentService.getSelectedLedgerAccount(ledgers.AccountId);
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
    // This method is used for adding control -SP
    private addNewLedger(accountId, amount) {
        let controllerScope: any = this.$scope;
        controllerScope.isAmountValid = true;
        controllerScope.isLedgerExists = false;
        controllerScope.isAmount = false;
        controllerScope.isAddLedgerAccount = false;
        let totalAmount = controllerScope.receiptPaymentVoucher.totalAmount;
        if (totalAmount === undefined || totalAmount === null || totalAmount === "") {
            totalAmount = 0;
        }
        if (accountId === undefined && amount === "" && accountId === null) {
            controllerScope.isSelected = true;
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        } else if (accountId === undefined) {
            controllerScope.isSelected = true;
            controllerScope.isAmountZero = false;
        } else if (amount === "") {
            controllerScope.isAmount = true;
            controllerScope.isAmountZero = false;
        }
        else if (isNaN(amount)) {
            controllerScope.isAmountValid = false;
        }
        else {

            //check for duplicate Ledger Account
            if (controllerScope.receiptPaymentDetails.length > 0) {
                for (let i = 0; i < controllerScope.receiptPaymentDetails.length; i++) {
                    if (controllerScope.receiptPaymentDetails[i].LedgerId === accountId) {
                        controllerScope.isLedgerExists = true;
                        return;
                    }
                }
            }
            controllerScope.isLedgerExists = false;
            controllerScope.isSelected = false;
            let receiptPayment = new Model.ReceiptPaymentDetail();
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

          }
    // This method is used for remove newly added control .-SP
    private removeLedger(index) {
        let controllerScope = this.$scope;
        controllerScope.receiptPaymentDetails.splice(index, 1);
        if (controllerScope.amounts.length > 0) {
            controllerScope.receiptPaymentVoucher.totalAmount = (Number(controllerScope.receiptPaymentVoucher.totalAmount) - Number(controllerScope.amounts[index]));
            controllerScope.amounts.splice(index, 1);
            controllerScope.selectedLedgerList.splice(index, 1);
        }
    }

    //This method is used for calculating Total amount.-SP
    private calculateAmount(amount, index) {
        let controllerScope = this.$scope;
        controllerScope.isAmountZero = false;
        amount = parseFloat(amount);
        let totalAmount = controllerScope.receiptPaymentVoucher.totalAmount;
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
                } else {
                    controllerScope.amounts[index] = amount;
                }

            } else {
                // first time insert in array
                controllerScope.amounts.push(amount);
            }
            //calculate the total amount.
            controllerScope.receiptPaymentVoucher.totalAmount = (Number(totalAmount) + Number(amount));
        } else {
            if (index === undefined || index === null) {
                //if select defaul dropdown value.
                controllerScope.receiptPaymentVoucher.totalAmount = (Number(controllerScope.receiptPaymentVoucher.totalAmount) - Number(controllerScope.amounts[0]));
                controllerScope.amounts.splice(0, 1);
            } else {
                controllerScope.receiptPaymentVoucher.totalAmount = (Number(controllerScope.receiptPaymentVoucher.totalAmount) - Number(controllerScope.amounts[index + 1]));
                controllerScope.amounts.splice(index + 1, 1);
            }
        }
    }

    //get the list of ledger except Bank and Cash.-SP
    private getLedgerAccountWithoutBankAndCash() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        let promise = this.receiptPaymentService.getLedgerAccountWithoutBankCash();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.receiptPaymentLedgerList.push(result[i]);
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });

    }

    //Save Receipt Voucher Record to database.-SP
    private saveReceiptVoucher(receiptPaymentVoucher, receiptPaymentDetail, isReceipt) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isAmount = false;
        controllerScope.isSelected = false;
        if (receiptPaymentDetail.length === 0) {
            controllerScope.isAddLedgerAccount = true;
            controllerRootScope.isLoading = false;
            return;
        }
        //check amount is 0 (zero) or not
        for (let i = 0; i < receiptPaymentDetail.length; i++) {
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
        let promise = this.receiptPaymentService.saveReceiptVoucherAccount(receiptPaymentVoucher);
        promise.then((result) => {
            this.countReceiptVoucherRecord(controllerScope.isReceipt);
            controllerScope.receiptPaymentDetails = [];
            controllerScope.receiptPaymentVoucher.totalAmount = 0;
            controllerScope.receiptPaymentVoucher.narration = "";
            controllerScope.ledgerList.selected = undefined;
            controllerScope.receiptPaymentLedgerList.selected = undefined;
            controllerScope.receiptPaymentDetail = new Model.ReceiptPaymentDetail;
            controllerScope.receiptPaymentVoucher = new Model.ReceiptPaymentVoucher;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
        let controlerScope: any = this.$scope;
        controlerScope.addReceipt.$setPristine();
        controlerScope.addReceipt.$setUntouched();
        controllerScope.isLedgerExists = false;
        controllerScope.totalAmount = 0;
        controllerScope.amount = "";
        controllerScope.panelBank = false;
    }
    
    //This method is used for stroe the selecte ledger name in list -SP
    private receiptLedgerSelectedChange(index, accountId, ledgerName) {
        let controllerScope = this.$scope;
        controllerScope.isSelected = false;
        controllerScope.ledgerName = ledgerName;
        if (index === undefined || index === null) {
            controllerScope.selectedLedgerList[0] = accountId;

        } else {
            controllerScope.selectedLedgerList[index + 1] = accountId;
        }

    }

    //get the list of ParamType value for all Transcation Type.-SP
    private getParamTypeByParamId() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        let promise = this.receiptPaymentService.getParamTypeByParamId(50);
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

    //this method is use getting receipt voucher count
    private countReceiptVoucherRecord(isReceipt) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        let promise = this.receiptPaymentService.getReceiptVoucherCount(isReceipt);
        promise.then((result) => {
            controllerScope.receiptVoucherCount = Number(result.recordCount) + 1;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    //set to default form property.
    private ClearControl() {
        let controllerScope: any = this.$scope;

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
    }

    private checkIntegerAmount(amount, index) {
        let controllerScope: any = this.$scope;
        if (amount !== "" && amount !== undefined && amount !== null) {
            if (isNaN(amount)) {
                controllerScope.addReceipt.$invalid = true;
                return true;
            }
            else {
                return false;
            }
        }
    }

}
app.controller(ReceiptPaymentController.controllerId, ['$scope', '$log', 'ReceiptPaymentService', 'ngToast', '$rootScope', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', ($scope, $log, ReceiptPaymentService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService) => {
    return new ReceiptPaymentController($scope, $log, ReceiptPaymentService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService);
}]);

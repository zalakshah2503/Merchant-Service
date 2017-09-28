interface IcreditNoteControllerScope extends ng.IScope {
    supplierList: any;
    totalCollection: any;
    creditListCollection: any;
    totalCreditListCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    search: any;
    errorMessageDisplayForBlankList: boolean;
    recevingCreditNote: Model.RecevingCreditNote;
    checkIntegerCheque: Function;
    checkIntegerCash: Function;
    receiveClick: Function;
    cancelClick: Function;
    chekBoxEvent: Function;
    changeCashCheque: Function;
    hasChecked: boolean;
    checkbox: any;
    IsActive: boolean;
    isChequeNo: boolean;
    chequeNoRequired: string;
    supplierChangeEvent: Function;
    noItemFound: any;
    validAmountError: any;
}

interface IcreditNoteController {

}

class CreditNoteController implements IcreditNoteController {
    static controllerId = "CreditNoteController";
    constructor(private $scope: IcreditNoteControllerScope, private $log: ng.ILocaleService, private creditNoteService: CreditNoteService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $modal, public $location, public authenticationPath) {

        this.$scope.supplierList = [];
        this.$scope.changeCashCheque = () => this.changeCashCheque();
        this.$scope.checkbox = [];
        this.$scope.chekBoxEvent = (creditNote) => this.chekBoxEvent(creditNote);
        this.$scope.hasChecked = false;
        this.$scope.search = [];
        this.$scope.totalCreditListCollection = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.recevingCreditNote = new Model.RecevingCreditNote();
        this.$scope.recevingCreditNote.Cash = 0;
        this.$scope.recevingCreditNote.TotalAmount = 0;
        this.$scope.recevingCreditNote.Cheque = 0;
        this.$scope.recevingCreditNote.ListOfCreditNotes = [];
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.isChequeNo = false;
        this.$scope.chequeNoRequired = stringConstants.chequeNoRequired;
        this.$scope.receiveClick = () => this.receiveClick();
        this.$scope.cancelClick = () => this.cancelClick();
        this.$scope.supplierChangeEvent = () => this.supplierChangeEvent();
        this.$scope.checkIntegerCheque = (amount) => this.checkIntegerCheque(amount);
        this.$scope.checkIntegerCash = (amount) => this.checkIntegerCash(amount);
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validAmountError = stringConstants.validAmountError;
        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.creditListCollection.slice(begin, end);
        });

        this.Initialize();
    }


    private Initialize() {
        this.getSupplierList();
    }

    private changeCashCheque() {
        if (this.$scope.recevingCreditNote.Cheque !== undefined && this.$scope.recevingCreditNote.Cheque !== null && this.$scope.recevingCreditNote.Cash !== undefined && this.$scope.recevingCreditNote.Cash !== null) {
            if (this.$scope.recevingCreditNote.Cheque.toString() !== "" && this.$scope.recevingCreditNote.Cash.toString() !== "")
                this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (parseFloat(this.$scope.recevingCreditNote.Cheque.toString()) + parseFloat(this.$scope.recevingCreditNote.Cash.toString())));
            else {
                if (this.$scope.recevingCreditNote.Cheque.toString() !== "")
                    this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (parseFloat(this.$scope.recevingCreditNote.Cheque.toString())));
                else if (this.$scope.recevingCreditNote.Cash.toString() !== "")
                    this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (parseFloat(this.$scope.recevingCreditNote.Cash.toString())));
                else
                    this.$scope.recevingCreditNote.Diffrents = this.$scope.recevingCreditNote.TotalAmount;
            }
        }
    }

    private supplierChangeEvent() {
        this.$scope.recevingCreditNote.Cash = 0;
        this.$scope.recevingCreditNote.Cheque = 0;
        this.$scope.recevingCreditNote.ChequeNo = "";
        this.$scope.recevingCreditNote.VoucharNo = "";
        this.$scope.recevingCreditNote.TotalAmount = 0;
        this.$scope.recevingCreditNote.Diffrents = 0;
        this.$scope.recevingCreditNote.ListOfCreditNotes = [];
        this.$scope.recevingCreditNote.Comments = "";
        this.getCreditNoteList(this.$scope.search.SupplierId);
    }

    //this method used for check box event. -An
    private chekBoxEvent(creditNote) {
        this.$rootScope.isLoading = true;
        let cheque = this.$scope.recevingCreditNote.Cheque.toString();
        let cash = this.$scope.recevingCreditNote.Cash.toString();
        if (creditNote.checked === true) {
            this.$scope.recevingCreditNote.TotalAmount = this.$scope.recevingCreditNote.TotalAmount + (creditNote.RemaningAmount === 0 ? creditNote.Amount : creditNote.RemaningAmount);
            this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (cheque !== "" ? parseFloat(cheque) : 0 + cash !== "" ? parseFloat(cash) : 0));
            this.$scope.recevingCreditNote.ListOfCreditNotes.push(creditNote);
        }
        else {
            this.$scope.recevingCreditNote.TotalAmount = this.$scope.recevingCreditNote.TotalAmount - (creditNote.RemaningAmount === 0 ? creditNote.Amount : creditNote.RemaningAmount);
            this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (cheque !== "" ? parseFloat(cheque) : 0 + cash !== "" ? parseFloat(cash) : 0));

            for (let i = 0; i < this.$scope.recevingCreditNote.ListOfCreditNotes.length; i++) {
                if (this.$scope.recevingCreditNote.ListOfCreditNotes[i] === creditNote) {
                    this.$scope.recevingCreditNote.ListOfCreditNotes.splice(i, 1);
                }
            }
        }
        this.$rootScope.isLoading = false;
    }


    //this method used for get supplier list.
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.creditNoteService.getSupplierList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.supplierList.push({ Name: result[i].NameEn, Id: result[i].Id });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });

    }

    private getCreditNoteList(supplierId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        this.$scope.creditListCollection = [];
        let creditNote = this.$scope.creditListCollection;
        let promise = this.creditNoteService.getCreditNoteList(supplierId);
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    creditNote.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = creditNote.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.creditListCollection.length;
                controllerScope.totalCreditListCollection = controllerScope.creditListCollection;
                controllerScope.errorMessageDisplayForBlankList = false;
            }
            else
                controllerScope.errorMessageDisplayForBlankList = true;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private receiveClick() {
        this.$rootScope.isLoading = true;
        this.$scope.isChequeNo = false;
        this.$scope.isChequeNo = false;
        let isValid = true;
        if (this.$scope.recevingCreditNote.Cheque !== undefined && this.$scope.recevingCreditNote.Cheque !== null && this.$scope.recevingCreditNote.Cheque !== 0) {
            if (this.$scope.recevingCreditNote.ChequeNo === undefined || this.$scope.recevingCreditNote.ChequeNo === null || this.$scope.recevingCreditNote.ChequeNo === "")
                isValid = false;
        }
        if (isValid) {
            let promise = this.creditNoteService.submitReceivigCreditNote(this.$scope.recevingCreditNote);
            promise.then((result) => {
                if (result._isResult === true) {
                    this.ngToast.create(stringConstants.recevingCreditNoteSuccessfully);
                    this.cancelClick();
                }
                this.$rootScope.isLoading = false;
            }).catch((error) => {
                this.$rootScope.isLoading = false;
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }
        else {
            this.$scope.isChequeNo = true;
            this.$rootScope.isLoading = false;
        }

    }

    private cancelClick() {
        this.$scope.recevingCreditNote = new Model.RecevingCreditNote();
        this.$scope.totalCollection = [];
        this.$scope.search.SupplierId = undefined;
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.isChequeNo = false;
    }

    private checkIntegerCash(cashAmount) {
        let controllerScope = this.$scope;
        if (cashAmount !== "" && cashAmount !== undefined && cashAmount !== null ) {
            if (isNaN(cashAmount)) {

                return true;
            }
            else {
                if (Math.round(cashAmount) === parseInt(cashAmount, 10)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }

    private checkIntegerCheque(chequeAmount) {
        if (chequeAmount !== "" && chequeAmount !== undefined && chequeAmount !== null) {
            if (isNaN(chequeAmount)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

app.controller(CreditNoteController.controllerId, ['$scope', '$log', 'CreditNoteService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', 'authenticationPath', ($scope, $log, CreditNoteService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath) => {
    return new CreditNoteController($scope, $log, CreditNoteService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, authenticationPath);
}]);
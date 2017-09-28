
interface IspoPaymentControllerScope extends ng.IScope {
    getSupplierList: Function;
    getBillList: Function;
    searchBill: Function;
    isCashPO: boolean;
    getCreditNoteList: Function;
    isBillVisible: boolean;
    emptyBillList: boolean;
    isPaymentVisible: boolean;
    creditNoteList: any;
    spoReceivingBill: any;
    actualDifference: any;
    saveSPOPayment: Function;
    refreshSPO: Function;
    search: any;
    billList: any;
    billTotalList: any;
    comment: any;
    supplierList: any;
    totalPayment: number;
    poItemList: any;
    billSelect: Function;
    billTotal: number;
    calculateDifference: Function;
    difference: number;
    creditNoteSelect: Function;
    spoPayment: any;
    allowPayment: Function;
    billNotFound: any;
    isPayButtonDisabled: Function;
    validAmountError: any;
}

interface IspoPaymentController {
}

class SpoPaymentController implements IspoPaymentController {
    static controllerId = "SpoPaymentController";

    constructor(private $scope: IspoPaymentControllerScope, private $log: ng.ILocaleService, private spoPaymentService: SpoPaymentService, public ngToast, public $rootScope, public apiPath, public $modal, public $routeParams, public $location, public filterFilter) {
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.spoPayment = new Model.SPOPayment();
        this.$scope.spoReceivingBill = new Model.SPOReceivingBill();
        this.$scope.getBillList = () => this.getBillList();
        this.$scope.creditNoteSelect = () => this.creditNoteSelect();
        this.$scope.searchBill = () => this.searchBill();
        this.$scope.saveSPOPayment = () => this.saveSPOPayment();
        this.$scope.refreshSPO = () => this.refreshSPO();
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
        this.$scope.calculateDifference = () => this.calculateDifference();
        this.$scope.totalPayment = 0;
        this.$scope.billTotal = 0;
        this.$scope.difference = 0;
        this.$scope.billSelect = () => this.billSelect();
        this.$scope.getCreditNoteList = (SupplierId) => this.getCreditNoteList(SupplierId);
        this.$scope.allowPayment = () => this.allowPayment();
        this.$scope.isPayButtonDisabled = () => this.isPayButtonDisabled();
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.initialize();
    }

    private initialize() {
        this.getSupplierList();
        this.getBillList();
    }

    // used to fetch supplier list
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.spoPaymentService.getSupplierList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }


    //used to fetch Supplier Bill List - jj
    private getBillList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let list = [];
        let promise = this.spoPaymentService.getSupplierBillList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
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
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }

    // used to search - jj
    private searchBill() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.billTotal = 0;
        controllerScope.creditNoteList = [];
        this.allowPayment();
        controllerRootScope.isLoading = true;
        let promise = this.spoPaymentService.checkSPO(controllerScope.search.PurchaseOrderNo);
        promise.then((result) => {
            if (result.poItemList !== undefined && result.poItemList !== null) {
                controllerRootScope.isLoading = false;
                controllerScope.billList = this.filterFilter((controllerScope.billTotalList), controllerScope.search);
                this.getCreditNoteList(controllerScope.search.SupplierId);
                controllerScope.poItemList = [];
                controllerScope.poItemList = result.poItemList;
                if (controllerScope.billList.length > 0) {
                    for (let j = 0; j < controllerScope.billList.length; j++) {
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
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: result.status
                    });
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.BillNotFound
                });
            controllerRootScope.isLoading = false;
        });
    }


    //used to select a particular bill from the billList - jj
    private billSelect() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let count = 0;
        let list = [];
        let IsICRCreated = false;
        let IsWorkFlowNotCreated = false;
        for (let j = 0; j < controllerScope.billList.length; j++) {
            if (controllerScope.billList[j].IsSelected) {
                controllerScope.billList[j].CanBePaid = false;
                controllerScope.billList[j].IsWorkFlowNotCreated = false;
                controllerScope.spoReceivingBill = controllerScope.billList[j];
                list.push(controllerScope.spoReceivingBill);
            }
        }
        controllerRootScope.isLoading = true;
        let promise = this.spoPaymentService.checkCondition(list);
        promise.then((result) => {
            if (result.length > 0) {
                for (let a = 0; a < result.length; a++) {
                    for (let b = 0; b < controllerScope.billList.length; b++) {
                        if (result[a].BillId === controllerScope.billList[b].BillId) {
                            controllerScope.billList[b] = result[a];
                        }
                    }
                }
                controllerScope.spoPayment.Amount = 0;
                for (let i = 0; i < controllerScope.billList.length; i++) {
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
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.workFlowNotCreated
                                });
                        }
                        else if (controllerScope.billList[i].IsBillNotFound) {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.BillNoNotFound.replace(/{Billno}/, controllerScope.billList[i].BillNumber)
                                });
                        }
                        else {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.BillNoNotPaid.replace(/{BillNo}/, controllerScope.billList[i].BillNumber)
                                });
                        }
                    }

                    if (controllerScope.billList[i].IsICRCreated) {
                        IsICRCreated = true;
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.ICRGenerated.replace(/{BillNo}/, controllerScope.billList[i].BillNumber)
                            });
                    }
                    else if (controllerScope.billList[i].IsICRAlreadyCreated) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.ICRAlreadyGenerated
                            });
                    }
                }

                for (let c = 0; c < controllerScope.billList.length; c++) {
                    if (IsWorkFlowNotCreated) {
                        controllerScope.billList[c].IsSelected = false;
                        count = 0;
                    }
                }
                if (count === 1) {
                    controllerScope.isPaymentVisible = true;
                }
                else {
                    this.allowPayment();
                    controllerRootScope.isLoading = false;
                    controllerScope.isPaymentVisible = false;
                }
                this.calculateDifference();
                controllerRootScope.isLoading = false;
            }
            else {
                this.allowPayment();
                controllerRootScope.isLoading = false;
                controllerScope.isPaymentVisible = false;
            }
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.BillNotPaid
                });
            controllerRootScope.isLoading = false;
        });
    }

    private calculateDifference() {
        let controllerScope = this.$scope;
        let credit = 0;
        let cash = 0;
        let cheque = 0;
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
    }

    //Method to Round value upto 2 decimal digits
    private roundToTow(value) {
        if (value !== null && value !== undefined) {
            return (Math.round((value + 0.00001) * 100) / 100);
        }
        return value;
    }


    //used to fetch Credit Note List - jj
    private getCreditNoteList(SupplierId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.spoPaymentService.getCreditNoteList(SupplierId);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                result[i].IsSelected = false;
            }
            controllerScope.creditNoteList = result;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.CNNotFetched
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to select credit Note - jj
    private creditNoteSelect() {
        let controllerScope = this.$scope;
        controllerScope.spoPayment.Credit = 0;
        for (let i = 0; i < controllerScope.creditNoteList.length; i++) {
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
    }


    //used to make the payment - jj
    private saveSPOPayment() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let list = [];
        for (let j = 0; j < controllerScope.billList.length; j++) {
            if (controllerScope.billList[j].CanBePaid) {
                controllerScope.spoReceivingBill = controllerScope.billList[j];
                list.push(controllerScope.spoReceivingBill);
            }
        }
        controllerScope.spoPayment.SPOBill = list;
        list = [];
        for (let j = 0; j < controllerScope.creditNoteList.length; j++) {
            if (controllerScope.creditNoteList[j].IsSelected) {
                list.push(controllerScope.creditNoteList[j]);
            }
        }
        let Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        controllerScope.spoPayment.Comment = Comment;
        controllerScope.spoPayment.CreditNoteDetail = list;
        let promise = this.spoPaymentService.saveSPOPayment(controllerScope.spoPayment);
        promise.then((result) => {
            if (result.status === "ok") {
                this.$location.path("/SupplierPurchaseOrderBillPayment/");
                this.ngToast.create(stringConstants.SPOPAymentDone);
            }
            else if (result !== "") {
                this.ngToast.create(result.status);
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.PaymentNotDone
                });
            controllerRootScope.isLoading = false;
        });

    }

    //used to refresh the page - jj
    private refreshSPO() {
        let controllerScope = this.$scope;
        this.allowPayment();
        controllerScope.isBillVisible = false;
        controllerScope.search = [];
    }


    private allowPayment() {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.creditNoteList.length; i++) {
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
    }


    private isPayButtonDisabled() {
        let controllerScope = this.$scope;
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
    }
}

app.controller(SpoPaymentController.controllerId, ['$scope', '$log', 'SpoPaymentService', 'ngToast', '$rootScope', 'apiPath', '$modal', '$routeParams', '$location', 'filterFilter', ($scope, $log, SpoPaymentService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location, filterFilter) => {
    return new SpoPaymentController($scope, $log, SpoPaymentService, ngToast, $rootScope, apiPath, $modal, $routeParams, $location, filterFilter);
}]);



interface IReturnBillControllerScope extends ng.IScope {
    billNumber: any;
    existsbillNumber: any;
    clickOnGetBill: Function;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    billList: any;
    paymentTypeList: any;
    totalCollection: any;
    returnBillItemListCollection: any;
    clickOnCancelButton: Function;
    clickOnSubmitButton: Function;
    returningAmountChangeEvent: Function;
    checkIntegerReturnQuantity: Function;
    search: any;
    errorMessageDisplayForBlankList: boolean;
    clickOnSearchBillButton: Function;
    viewItemDetail: Function;
    returnBillModel: Model.POSReturnBillModel;
    retunBillList: any;
    isAnchorTagDisplay: boolean;
    totalCountForAnchorTag: number;
    clickOnCloseButton: Function;
    branchList: any;
    showDetails: boolean;
    isBranch: boolean;
    clickOnCancelButtonForPOSBillExpier: Function;
    daysOfLimit: number;
    isReturnQunatity: boolean;
    checkReturningItem: Function;
    deleteReturnBill: Function;
    deletedReturnBillItemNumber: string;
    deleteReturnBillButtonEvent: Function;
    cancelDeleteReturnBillItem: Function;
    deleted: any;
    processed: any;
    noItemFound: any;
    ValidReturningQty: any;
    ValidReturnItemAmt: any;
    validAmountError: any;
    noCategoryFound: any;
    deleteConfirmMessage: any;
}

interface IReturnBillController {

}

class ReturnBillController implements IReturnBillController {
    static controllerId = "ReturnBillController";
    public billSearchPopup;
    public posBillExpierDate;
    public deleteReturnItemBill;
    constructor(private $scope: IReturnBillControllerScope, private $log: ng.ILogService, public $rootScope, private ReturnBillService: ReturnBillService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal, public printer) {
        this.$scope.billNumber = "";
        this.$scope.clickOnGetBill = () => this.clickOnGetBill();
        this.$scope.billList = [];
        this.$scope.paymentTypeList = [];
        this.$scope.search = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.clickOnCancelButton = () => this.clickOnCancelButton();
        this.$scope.clickOnSubmitButton = () => this.clickOnSubmitButton();
        this.$scope.returningAmountChangeEvent = () => this.returningAmountChangeEvent();
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.clickOnSearchBillButton = () => this.clickOnSearchBillButton();
        this.$scope.viewItemDetail = (id) => this.viewItemDetail(id);
        this.$scope.returnBillModel = new Model.POSReturnBillModel();
        this.$scope.isAnchorTagDisplay = false;
        this.$scope.retunBillList = [];
        this.$scope.clickOnCloseButton = () => this.clickOnCloseButton();
        this.$scope.branchList = [];
        this.$scope.daysOfLimit = 0;
        this.$scope.clickOnCancelButtonForPOSBillExpier = () => this.clickOnCancelButtonForPOSBillExpier();
        this.$scope.showDetails = false;
        this.$scope.isBranch = false;
        this.$scope.isReturnQunatity = true;
        this.$scope.checkReturningItem = () => this.checkReturningItem();
        this.$scope.deletedReturnBillItemNumber = "";
        this.$scope.existsbillNumber = "";
        this.$scope.checkIntegerReturnQuantity = (quantity, index) => this.checkIntegerReturnQuantity(quantity, index);
        this.$scope.deleteReturnBill = (billNumber) => this.deleteReturnBill(billNumber);
        this.$scope.deleteReturnBillButtonEvent = () => this.deleteReturnBillButtonEvent();
        this.$scope.cancelDeleteReturnBillItem = () => this.cancelDeleteReturnBillItem();
        this.$scope.totalCountForAnchorTag = 0;
        this.$scope.deleted = stringConstants.deleted;
        this.$scope.processed = stringConstants.processed;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.ValidReturningQty = stringConstants.ValidReturningQty;
        this.$scope.ValidReturnItemAmt = stringConstants.ValidReturnItemAmt;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.noCategoryFound = stringConstants.noCategoryFound;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.returnBillItemListCollection.slice(begin, end);
        });

        this.initialize();
    }



    //this method used for get initialize method. -An
    private clickOnCancelButtonForPOSBillExpier() {
        this.posBillExpierDate.dismiss('cancel');
    }

    private deleteReturnBillButtonEvent() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.ReturnBillService.deleteReturnBillItem(this.$scope.deletedReturnBillItemNumber);
        promise.then((result) => {
            if (result.isResult === true) {
                this.deleteReturnItemBill.dismiss('cancel');
                this.ngToast.create(stringConstants.deletePOSSessionReturnBill);
                //this.getReturnBillList(this.$scope.existsbillNumber);
                this.$scope.billNumber = this.$scope.existsbillNumber;
                this.clickOnGetBill();
            }
            else if (result.isResult !== false) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: result.isResult
                    });
                this.deleteReturnItemBill.dismiss('cancel');
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private cancelDeleteReturnBillItem() {
        this.deleteReturnItemBill.dismiss('cancel');
    }

    private deleteReturnBill(billNumber) {
        this.deleteReturnItemBill = this.$modal.open({
            templateUrl: 'deleteReturnItemBill',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
        this.$scope.deletedReturnBillItemNumber = billNumber;
    }

    //this method used for check returning item. -An
    private checkReturningItem() {
        if (this.$scope.returnBillItemListCollection !== undefined || this.$scope.returnBillItemListCollection !== null) {
            if (this.$scope.returnBillItemListCollection.length > 0) {
                for (let i = 0; i < this.$scope.returnBillItemListCollection.length; i++) {
                    if (this.$scope.returnBillItemListCollection[i].ReturnQunatity !== 0 && this.$scope.returnBillItemListCollection[i].ReturnQunatity !== "")
                        return true;
                }
            }
        }
        return false;
    }

    //this method used for get initialize method. -An 
    private initialize() {
        this.getBranchList();
        this.$rootScope.isLoading = true;
        let promise = this.ReturnBillService.checkAllowReturnToAnotherBranch();
        promise.then((result) => {
            if (result.isResult !== 0) {
                this.$scope.isBranch = true;
                this.$scope.returnBillModel.BranchId = result.isResult;
            }
            else
                this.$scope.isBranch = false;
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for click on close button for clsoe popup.-An
    private clickOnCloseButton() {
        this.billSearchPopup.dismiss('cancel');
    }

    //this funciton used for get bill detail list  click on get bill button. -An
    private clickOnGetBill() {
        this.$rootScope.isLoading = true;
        this.$scope.showDetails = false;
        this.$scope.deletedReturnBillItemNumber = this.$scope.billNumber;
        this.$scope.existsbillNumber = this.$scope.billNumber;
        if (this.$scope.billNumber !== 0) {
            if (this.$scope.returnBillModel.BranchId !== undefined && this.$scope.returnBillModel.BranchId !== null && this.$scope.returnBillModel.BranchId !== 0) {
                let promise = this.ReturnBillService.getBillDetailByBillNumberByBranchId(this.$scope.billNumber, this.$scope.returnBillModel.BranchId);
                promise.then((result) => {
                    this.GetReturnBillDetail(result);
                }).catch((error) => {
                    this.$rootScope.isLoading = false;
                    this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(this.apiPath);
                    }
                });
            }
            else {
                let promise = this.ReturnBillService.getBillDetailByBillNumber(this.$scope.billNumber);
                promise.then((result) => {
                    this.GetReturnBillDetail(result);
                }).catch((error) => {
                    this.$rootScope.isLoading = false;
                    this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(this.apiPath);
                    }
                });
            }
            this.getReturnBillList(this.$scope.billNumber);
        }
    }

    private GetReturnBillDetail(result) {
        this.$scope.returnBillItemListCollection = [];
        this.$scope.billList = [];
        this.$scope.paymentTypeList = [];
        let returnItemBill = this.$scope.returnBillItemListCollection;
        this.$scope.billNumber = "";
        if (result.isResult === "NotExists") {
            this.$scope.errorMessageDisplayForBlankList = true;
        }
        else if ((result.isResult.ReturnBillItemList !== null && result.isResult.ReturnBillItemList !== undefined) ||
            (result.isResult.ReturnBillList !== null && result.isResult.ReturnBillList !== undefined) ||
            (result.isResult.ReturnBillPaymentTypeList !== null && result.isResult.ReturnBillPaymentTypeList !== undefined)) {
            this.$scope.errorMessageDisplayForBlankList = false;
            this.$scope.returnBillModel.ReturnCashAmount = 0;

            if (result.isResult.ReturnBillList !== null && result.isResult.ReturnBillList !== undefined) {
                if (result.isResult.ReturnBillList.length !== 0) {
                    for (let i = 0; i < result.isResult.ReturnBillList.length; i++) {
                        this.$scope.billList.push(result.isResult.ReturnBillList[i]);
                    }
                }
                if (result.isResult.ReturnBillPaymentTypeList !== null && result.isResult.ReturnBillPaymentTypeList !== undefined) {
                    if (result.isResult.ReturnBillPaymentTypeList.length !== 0) {
                        for (let i = 0; i < result.isResult.ReturnBillPaymentTypeList.length; i++) {
                            this.$scope.paymentTypeList.push(result.isResult.ReturnBillPaymentTypeList[i]);
                        }
                    }
                }
                if (result.isResult.ReturnBillItemList !== null && result.isResult.ReturnBillItemList !== undefined) {
                    if (result.isResult.ReturnBillItemList.length > 0) {
                        for (let i = 0; i < result.isResult.ReturnBillItemList.length; i++) {
                            returnItemBill.push(result.isResult.ReturnBillItemList[i]);
                        }
                        let that = this;
                        let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                            end = begin + that.$scope.itemsPerPage;
                        this.$scope.totalCollection = returnItemBill.slice(begin, end);
                        /* init pagination with $scope.list */
                        this.$scope.totalItems = this.$scope.returnBillItemListCollection.length;
                    }
                }
            }
        }
        else if (result.isResult !== 0) {
            this.posBillExpierDate = this.$modal.open({
                templateUrl: 'PosBillDateExpier',
                backdrop: 'static',
                keyboard: true,
                size: 'sm',
                scope: this.$scope,
            });
            this.$scope.errorMessageDisplayForBlankList = true;
            this.$scope.daysOfLimit = result.isResult;
        }
        this.$rootScope.isLoading = false;
    }

    //this function used for get return bill list by billnumber. -An
    private getReturnBillList(returnBillNumber) {
        this.$rootScope.isLoading = true;
        this.$scope.retunBillList = [];
        let promise = this.ReturnBillService.getReturnBillListByBillNumber(returnBillNumber);
        promise.then((result) => {
            if (result.length !== 0) {
                this.$scope.isReturnQunatity = true;
                for (let i = 0; i < result.length; i++) {
                    this.$scope.retunBillList.push(result[i]);
                }
                this.$scope.totalCountForAnchorTag = this.$scope.retunBillList.length;
                this.$scope.isAnchorTagDisplay = true;
            }
            else {
                this.$scope.isReturnQunatity = false;
                this.$scope.isAnchorTagDisplay = false;
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for click on search button. -An
    private clickOnSearchBillButton() {
        let branchId = this.$scope.returnBillModel.BranchId;
        this.billSearchPopup = this.$modal.open({
            templateUrl: 'billSearch',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'BillSearchContoller',
            scope: this.$scope,
            resolve: {
                id: function () {
                    return branchId;
                }
            }
        });
        this.$scope.showDetails = false;
    }

    //this function used for returning amount change event. -An
    private returningAmountChangeEvent() {
        if (this.$scope.returnBillItemListCollection.length > 0) {
            this.$scope.returnBillModel.ReturnCashAmount = 0;
            for (let i = 0; i < this.$scope.returnBillItemListCollection.length; i++) {
                let retunAmount = 0;
                if (this.$scope.returnBillItemListCollection[i].ReturnQunatity > 0) {
                    retunAmount = (parseFloat(this.$scope.returnBillItemListCollection[i].ReturnQunatity) * this.$scope.returnBillItemListCollection[i].SellPrice);
                    let totaleAlreadyQuantity = (parseFloat(this.$scope.returnBillItemListCollection[i].ReturnQunatity) + parseFloat(this.$scope.returnBillItemListCollection[i].ReturnedQunatity));
                    if (totaleAlreadyQuantity <= this.$scope.returnBillItemListCollection[i].BillQunatity) {
                        this.$scope.returnBillModel.ReturnCashAmount = this.$scope.returnBillModel.ReturnCashAmount + retunAmount;
                    }
                    else {
                        this.$scope.returnBillItemListCollection[i].ReturnQunatity = 0;
                        this.$scope.returnBillModel.ReturnSubtituteItemsAmount = 0;
                    }
                }
            }

            if (this.$scope.returnBillModel.ReturnSubtituteItemsAmount !== 0) {
                if (this.$scope.returnBillModel.ReturnCashAmount !== 0) {
                    if (this.$scope.returnBillModel.ReturnCashAmount >= this.$scope.returnBillModel.ReturnSubtituteItemsAmount) {
                        this.$scope.returnBillModel.ReturnCashAmount = (this.$scope.returnBillModel.ReturnCashAmount - this.$scope.returnBillModel.ReturnSubtituteItemsAmount);
                    }
                    else
                        this.$scope.returnBillModel.ReturnSubtituteItemsAmount = 0;
                }
            }
        }
    }

    //this function used for submit button event. -An
    private clickOnSubmitButton() {
        this.$scope.returnBillModel.ReturnBillItemList = this.$scope.returnBillItemListCollection;
        this.$scope.returnBillModel.ReturnBillNumber = this.$scope.billList[0].BillNumber;
        this.$scope.returnBillModel.POSBillId = this.$scope.billList[0].BillId;
        let posBillId = this.$scope.billList[0].BillId;
        this.$rootScope.isLoading = true;
        let promise = this.ReturnBillService.submitPOSBill(this.$scope.returnBillModel);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.isResult !== false) {
                    this.ngToast.create(stringConstants.returnBillSubmitedSucessfully);
                    this.$scope.returnBillModel = new Model.POSReturnBillModel();
                    this.$scope.billList = [];
                    this.$scope.paymentTypeList = [];
                    this.$scope.billNumber = "";
                    this.$scope.errorMessageDisplayForBlankList = true;
                    this.$rootScope.isLoading = false;
                    this.printReturnBill(result.isResult);
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }


    //This method usd for print return bill. -An
    private printReturnBill(id) {
        let promise = this.ReturnBillService.getReturnBillRecipt(id);
        promise.then((result) => {
            if (result.isResult !== null && result.isResult !== undefined) {
                this.printer.print("/Templates/Sales/ReturnBillReceipt.html", result.isResult);
            }
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //this function used for click on cancel button event. -An
    private clickOnCancelButton() {
        this.$scope.returnBillModel = new Model.POSReturnBillModel();
        this.$scope.billList = [];
        this.$scope.paymentTypeList = [];
        this.$scope.billNumber = "";
        this.$scope.errorMessageDisplayForBlankList = true;
    }

    //this function used for view item detail event. -An
    private viewItemDetail(id) {
        this.$scope.billNumber = id;
        this.clickOnGetBill();
        this.billSearchPopup.dismiss('cancel');
    }

    //this funciton used for get branch list. -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.ReturnBillService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }


    private checkIntegerReturnQuantity(quantity, index) {
        let controllerScope: any = this.$scope;
        if (quantity !== "" && quantity !== undefined && quantity !== null) {
            if (isNaN(quantity)) {
                controllerScope.returnBill.$invalid = true;
                return true;
            }
            else {
                if (Math.round(quantity) === parseInt(quantity, 10)) {
                    return false;
                }
                else {
                    controllerScope.returnBill.$invalid = true;
                    return true;
                }
            }
        }
    }
}

app.controller(ReturnBillController.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) => {
    return new ReturnBillController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
}]);
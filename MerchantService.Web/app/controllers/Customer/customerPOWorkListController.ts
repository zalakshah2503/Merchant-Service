/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/customer/customerpoworklistservice.ts" />


interface IcustomerPOWorkListControllerScope extends ng.IScope {
    customerPO: any;
    getCustomerPOWorkList: Function;
    getBranchList: Function;
    searchCustomerPOWorkList: Function;
    closeCancelPopup: Function;
    poWorkList: any;
    branchList: any;
    isCreditCustomer: boolean;
    isAmountSearchVisible: boolean;
    isDateSearchVisible: boolean;
    onChangeSearchPreference: Function;
    preference: any;
    isAdditionalCostReturnVisible: boolean;
    returnAmount: number;
    //datepicker
    isIssueDateFromPickerOpened: any;
    openIssueDateFromPicker: Function;
    isIssueDateToPickerOpened: any;
    openIssueDateToPicker: Function;
    isDueDateFromPickerOpened: any;
    openDueDateFromPicker: Function;
    isDueDateToPickerOpened: any;
    openDueDateToPicker: Function;
    getCPODetail: Function;
    fetchCPODetail: Function;
    close: Function;
    cancelCPO: Function;
    editCPO: Function;
    additionalCostReturned: any;
    totalReceived: number;
    totalAdditionalCost: number;
    openCancelCPOModal: Function;
    closeCancelCPOPopup: Function;
    cancelConfirm: Function;
    isCancelConfirm: boolean;
    onCancelAdditionalCostChange: Function;
    onChangeAdditionalCostSetting: Function;
    search: any;
    dateSearch: any;
    amountSearch: any;
    totalCollection: any;
    customerPOList: any;
    errorMessage: string;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    serachFilter: any;
    entryLimit: any;
    customerErrorMessageDisplay: boolean;
    customerPOTotalCollection: any;
    notFoundItem: boolean;
    totalCPOItemList: any;
    openCPODetailListPopup: Function;
    isCollected: boolean;
    //string constants
    downPaymentNotFound: any;
    deleteConfirmation: any;
    cpoDeleteConfirmation: any;
    cpoItem: any;
    cpoNotFound: any;
    validAmountError: any;
}

interface IcustomerPOWorkListController {
}

class CustomerPOWorkListController implements IcustomerPOWorkListController {
    static controllerId = "CustomerPOWorkListController";
    public cancelCPOPopup;
    public cpoDetailListPopup;

    constructor(private $scope: IcustomerPOWorkListControllerScope, private $log: ng.ILocaleService, private customerPOWorkListService: CustomerPOWorkListService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $filter, public $location, public $modal, public $routeParams) {
        this.$scope.getCustomerPOWorkList = () => this.getCustomerPOWorkList();
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.searchCustomerPOWorkList = () => this.searchCustomerPOWorkList();
        this.$scope.customerPO = [];
        this.$scope.poWorkList = [];
        this.$scope.totalCPOItemList = [];
        this.$scope.notFoundItem = true;
        this.$scope.branchList = [];
        this.$scope.isAmountSearchVisible = false;
        this.$scope.isDateSearchVisible = false;
        this.$scope.onChangeSearchPreference = () => this.onChangeSearchPreference();
        this.$scope.preference = [];
        this.$scope.closeCancelPopup = () => this.closeCancelPopup();
        //string constants
        this.$scope.downPaymentNotFound = stringConstants.downPaymentNotFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.cpoDeleteConfirmation = stringConstants.cpoDeleteConfirmation;
        this.$scope.cpoItem = stringConstants.cpoItem;
        this.$scope.cpoNotFound = stringConstants.cpoNotFound;
        this.$scope.validAmountError = stringConstants.validAmountError;
        // datepicker
        this.$scope.isIssueDateFromPickerOpened = false;
        this.$scope.openIssueDateFromPicker = (event) => this.openIssueDateFromPicker(event);
        this.$scope.isIssueDateToPickerOpened = false;
        this.$scope.openIssueDateToPicker = (event) => this.openIssueDateToPicker(event);
        this.$scope.isDueDateFromPickerOpened = false;
        this.$scope.openDueDateFromPicker = (event) => this.openDueDateFromPicker(event);
        this.$scope.isDueDateToPickerOpened = false;
        this.$scope.openDueDateToPicker = (event) => this.openDueDateToPicker(event);
        this.$scope.getCPODetail = () => this.getCPODetail();
        this.$scope.fetchCPODetail = (id) => this.fetchCPODetail(id);
        this.$scope.close = () => this.close();
        this.$scope.cancelCPO = (returnAmount, additionalCostReturned, isAdditionalCostReturn) => this.cancelCPO(returnAmount, additionalCostReturned, isAdditionalCostReturn);
        this.$scope.additionalCostReturned = [];
        this.$scope.editCPO = () => this.editCPO();
        this.$scope.returnAmount = 0;
        this.$scope.isAdditionalCostReturnVisible = false;
        this.$scope.onCancelAdditionalCostChange = (cost, isAdditionalCostReturnVisible) => this.onCancelAdditionalCostChange(cost, isAdditionalCostReturnVisible);
        this.$scope.onChangeAdditionalCostSetting = (cost, status) => this.onChangeAdditionalCostSetting(cost, status);
        this.$scope.openCancelCPOModal = () => this.openCancelCPOModal();
        this.$scope.closeCancelCPOPopup = () => this.closeCancelCPOPopup();
        this.$scope.cancelConfirm = () => this.cancelConfirm();
        this.$scope.isCancelConfirm = false;
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.customerPOList = [];
        this.$scope.search = [];
        this.$scope.dateSearch = [];
        this.$scope.amountSearch = [];
        this.$scope.customerPOTotalCollection = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 5;
        this.$scope.errorMessage = "";
        this.$scope.notFoundItem = false;
        this.$scope.isCollected = false;
        this.$scope.openCPODetailListPopup = () => this.openCPODetailListPopup();
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.customerPOList.slice(begin, end);
        });
        this.initialize();
    }


    private initialize() {

        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getCPODetail();
        }
        else {
            this.getCustomerPOWorkList();
            this.getBranchList();
        }
    }


    //used to check which search parameters are selected
    private onChangeSearchPreference() {
        let controllerScope = this.$scope;
        controllerScope.isAmountSearchVisible = controllerScope.preference.Amount;
        controllerScope.isDateSearchVisible = controllerScope.preference.Date;
    }


    // used to fetch customer purchase order worklist
    private getCustomerPOWorkList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.customerPOList = [];
        controllerRootScope.cpoInfo = [];
        controllerRootScope.isCustomerDetailsVisible = false;
        controllerRootScope.isCPOAdded = false;
        controllerRootScope.customerProfile = [];
        let customerPOCollection = controllerScope.customerPOList;
        let promise = this.customerPOWorkListService.getCustomerPOWorkList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    result[i].DueDate = new Date(result[i].DueDate).toISOString().substr(0, 10);
                    result[i].InitiationDate = new Date(result[i].InitiationDate).toISOString().substr(0, 10);
                    if (result[i].IsCollected) {
                        result[i].Status = stringConstants.OrderCollected;
                    }
                    else {
                        result[i].Status = stringConstants.PendingCollection;
                    }
                    customerPOCollection.push(result[i]);
                    controllerScope.customerPOTotalCollection = customerPOCollection;
                    controllerScope.customerPOList = customerPOCollection;
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = customerPOCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.customerPOList.length;
                }
            }
            controllerRootScope.isLoading = false;;
        }).catch((error) => {
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    // used to fetch list of branches
    private getBranchList() {
        let controllerScope = this.$scope;
        let promise = this.customerPOWorkListService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push(result[i]);
                }
            }
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }
    
    //used to search customer
    private searchCustomerPOWorkList() {
        let controllerScope: any;
        controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        let count = 0;
        let IssueDateFrom;
        let DueDateFrom;
        let IssueDateTo;
        let DueDateTo;
        if (controllerScope.dateSearch.IssueDateFrom !== null && controllerScope.dateSearch.IssueDateFrom !== undefined) {
            IssueDateFrom = this.$filter('date')(controllerScope.dateSearch.IssueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateFrom !== null && controllerScope.dateSearch.DueDateFrom !== undefined) {
            DueDateFrom = this.$filter('date')(controllerScope.dateSearch.DueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.IssueDateTo !== null && controllerScope.dateSearch.IssueDateTo !== undefined) {
            IssueDateTo = this.$filter('date')(controllerScope.dateSearch.IssueDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateTo !== null && controllerScope.dateSearch.DueDateTo !== undefined) {
            DueDateTo = this.$filter('date')(controllerScope.dateSearch.DueDateTo, 'yyyy/MM/dd');
            count = 1;
        }

        controllerScope.customerPOList = this.filterFilter((controllerScope.customerPOTotalCollection), controllerScope.search);

        let tempList = [];
        tempList = controllerScope.customerPOList;
        controllerScope.customerPOList = [];
        /* change pagination with $scope.filtered */
        if (tempList.length === 0) {
            controllerScope.totalCollection = [];
        } else {
            for (let i = 0; i < tempList.length; i++) {
                let DueDate = (this.$filter('date')(tempList[i].DueDate, 'yyyy/MM/dd'));
                let InitiationDate = (this.$filter('date')(tempList[i].InitiationDate, 'yyyy/MM/dd'));

                if (DueDateFrom !== null && DueDateTo !== null && DueDateFrom !== undefined && DueDateTo !== undefined) {
                    if (DueDate >= DueDateFrom && DueDate <= DueDateTo) {
                        controllerScope.customerPOList.push(tempList[i]);
                    }
                }
                else {
                    if ((DueDate >= DueDateFrom) || (DueDate <= DueDateTo) || (InitiationDate >= IssueDateFrom) || (InitiationDate <= IssueDateTo)) {
                        controllerScope.customerPOList.push(tempList[i]);
                    }
                }
            }
            if (count === 0) {
                controllerScope.customerPOList = tempList;
            }

            let secondList = [];
            secondList = controllerScope.customerPOList;
            controllerScope.customerPOList = [];
            for (let k = 0; k < secondList.length; k++) {
                let DueDate = (this.$filter('date')(secondList[k].DueDate, 'yyyy/MM/dd'));
                let InitiationDate = (this.$filter('date')(secondList[k].InitiationDate, 'yyyy/MM/dd'));

                if (secondList.length !== 0) {
                    if (IssueDateTo !== null && IssueDateFrom !== null && IssueDateTo !== undefined && IssueDateFrom !== undefined) {
                        if (InitiationDate >= (IssueDateFrom) && InitiationDate <= (IssueDateTo)) {
                            controllerScope.customerPOList.push(secondList[k]);
                        }
                    }
                    else {
                        if ((DueDate >= DueDateFrom) || (DueDate <= DueDateTo) || (InitiationDate >= IssueDateFrom) || (InitiationDate <= IssueDateTo)) {
                            controllerScope.customerPOList.push(secondList[k]);
                        }
                    }
                }

            }
            if (count === 0) {
                controllerScope.customerPOList = secondList;
            }
        }


        let finalList = [];
        let finalCount = 0;
        finalList = controllerScope.customerPOList;
        if (controllerScope.amountSearch.AmountTo === "") {
            controllerScope.amountSearch.AmountTo = null;
        }
        if (controllerScope.amountSearch.AmountFrom === "") {
            controllerScope.amountSearch.AmountFrom = null;
        }
        controllerScope.customerPOList = [];
        if (finalList.length === 0) {
        }
        else {
            for (let j = 0; j < finalList.length; j++) {
                if (controllerScope.amountSearch.AmountTo !== null && controllerScope.amountSearch.AmountFrom !== null && controllerScope.amountSearch.AmountTo !== undefined && controllerScope.amountSearch.AmountFrom !== undefined) {
                    finalCount = 1;
                    if (finalList[j].Total <= controllerScope.amountSearch.AmountTo && finalList[j].Total >= controllerScope.amountSearch.AmountFrom) {
                        controllerScope.customerPOList.push(finalList[j]);
                    }
                }
                else {
                    if ((controllerScope.amountSearch.AmountTo !== null && controllerScope.amountSearch.AmountTo !== undefined)
                        || (controllerScope.amountSearch.AmountFrom !== null && controllerScope.amountSearch.AmountFrom !== undefined)) {
                        finalCount = 1;
                        if ((finalList[j].Total <= controllerScope.amountSearch.AmountTo) || (finalList[j].Total >= controllerScope.amountSearch.AmountFrom)) {
                            controllerScope.customerPOList.push(finalList[j]);
                        }
                    }
                }
            }
        }
        if (finalCount === 0) {
            controllerScope.customerPOList = finalList;
        }
        let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
            end = begin + that.$scope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.customerPOList.slice(begin, end);
        controllerScope.totalItems = controllerScope.customerPOList.length;
        controllerScope.search = [];
        controllerScope.dateSearch = [];
        controllerScope.amountSearch = [];
    }


    // datepicker for search
    private openIssueDateFromPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateFromPickerOpened = true;
    }

    private openIssueDateToPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateToPickerOpened = true;
    }

    private openDueDateToPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateToPickerOpened = true;
    }

    private openDueDateFromPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateFromPickerOpened = true;
    }

    //used to redirect to cpodetail page
    private getCPODetail() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let id = this.$routeParams.id;
        let promise = this.customerPOWorkListService.getCPODetail(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                result.DueDate = new Date(result.DueDate).toISOString().substr(0, 10);
                result.InitiationDate = new Date(result.InitiationDate).toISOString().substr(0, 10);
                for (let i = 0; i < result.CPOPayment.length; i++) {

                    result.CPOPayment[i].CreatedDateTime = new Date(result.CPOPayment[i].CreatedDateTime).toISOString().substr(0, 10);
                    for (let j = 0; j < stringConstants.paymentModeList.length; j++) {
                        if (result.CPOPayment[i].PaymentMode === stringConstants.paymentModeList[j].Id) {
                            result.CPOPayment[i].Mode = stringConstants.paymentModeList[j].Name;
                        }
                    }
                }
                controllerScope.customerPO = result;
                if (controllerScope.customerPO.Customer.BalanceAmount > 0) {
                    controllerScope.customerPO.Customer.BalanceAmt = controllerScope.customerPO.Customer.BalanceAmount - controllerScope.customerPO.Customer.TransactionAmount;
                }
                else if (controllerScope.customerPO.Customer.AmountLimit > 0) {
                    controllerScope.customerPO.Customer.LimitAmt = controllerScope.customerPO.Customer.AmountLimit - controllerScope.customerPO.Customer.TransactionAmount;
                }
                else {
                }
                controllerRootScope.PriceCategory = controllerScope.customerPO.Customer.PriceCategory;

                for (let k = 0; k < stringConstants.priceCategoryList.length; k++) {
                    if (controllerScope.customerPO.Customer.PriceCategory === stringConstants.priceCategoryList[k].Id) {
                        controllerScope.customerPO.Customer.PriceCategoryName = stringConstants.priceCategoryList[k].Name;
                    }
                }
                if (controllerScope.customerPO.Customer.IsCreditCustomer) {
                    controllerScope.isCreditCustomer = true;
                }
                else {
                    controllerScope.isCreditCustomer = false;
                }

                this.BindPopupGrid(result.listOfCustomerPurchaseOrderItem);
                this.$scope.isCollected = result.IsCollected;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            controllerRootScope.isLoading = false;
        });
    }


    //this funciton used for bind CPO Detail Popup. -An
    private BindPopupGrid(listOfCustomerPurchaseOrderItem) {
        if (listOfCustomerPurchaseOrderItem.length > 0) {
            for (let i = 0; i < listOfCustomerPurchaseOrderItem.length; i++) {
                this.$scope.totalCPOItemList.push(listOfCustomerPurchaseOrderItem[i]);
            }
            this.$scope.notFoundItem = false;
        }
        else
            this.$scope.notFoundItem = true;
    }

    //this funcion used for close CPO Detail Popup. -An
    private closeCancelPopup() {
        this.cpoDetailListPopup.dismiss('cancel');
    }
    //this function used for open CPO Detail Popup. -An
    private openCPODetailListPopup() {
        this.cpoDetailListPopup = this.$modal.open({
            templateUrl: 'cpoItemDetailList',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            scope: this.$scope,
        });
    }

    // used to redirect to cpo detail page
    private fetchCPODetail(id) {
        let x = this;
        x.$location.path("/CustomerPODetail/" + id);
    }

    //used to redirect to worklist
    private close() {
        //  window.location.assign('#CustomerPOWorkList');
        let x = this;
        x.$location.path("/CustomerPOWorkList/");
    }

    // used to cancel CPO
    private cancelCPO(returnAmount, additionalCostReturned, isAdditionalCostReturn) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.customerPOWorkListService.cancelCustomerPO(controllerScope.customerPO.CustomerPOId, returnAmount);
        promise.then((result) => {
            if (result.status === undefined || result.status === null) {
                this.closeCancelCPOPopup();
                let x = this;
                x.$location.path("/CustomerPOWorkList/");
                this.ngToast.create(stringConstants.CPOCanceled);
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.permissionDenied
                    });
            }
        }).catch((error) => {
            if (error.status !== 400) {
                location.replace(this.apiPath);
            }
        });
    }

    // used to redirect to CustomerPO page - jj
    private editCPO() {
        let x = this;
        let controllerScope = this.$scope;
        x.$location.path("/CustomerPO/" + controllerScope.customerPO.CustomerPOId);
    }


    // used for opening the CancelCPOPopup-jj
    private openCancelCPOModal() {
        let controllerScope = this.$scope;
        controllerScope.returnAmount = 0;
        controllerScope.additionalCostReturned.additionalCostReturned = 0;
        controllerScope.totalAdditionalCost = 0;
        controllerScope.totalReceived = 0;
        for (let i = 0; i < controllerScope.customerPO.CPOPayment.length; i++) {
            if (controllerScope.customerPO.CPOPayment[i].PaymentMode === 0) {
                controllerScope.totalReceived = controllerScope.totalReceived + controllerScope.customerPO.CPOPayment[i].TotalAmount;
            }
            else {
                controllerScope.totalReceived = controllerScope.totalReceived - controllerScope.customerPO.CPOPayment[i].TotalAmount;
            }
        }
        for (let j = 0; j < controllerScope.customerPO.CPOAdditionalCost.length; j++) {
            controllerScope.totalAdditionalCost = controllerScope.totalAdditionalCost + controllerScope.customerPO.CPOAdditionalCost[j].Amount;
        }
        controllerScope.isAdditionalCostReturnVisible = true;
        if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
            controllerScope.returnAmount = controllerScope.totalReceived;
            controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalReceived;
        }
        else {
            controllerScope.returnAmount = controllerScope.totalReceived;
            controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalAdditionalCost;
        }
        this.openCancelPopUp();
    }


    private openCancelPopUp() {
        this.cancelCPOPopup = this.$modal.open({
            templateUrl: 'CancelCPOModal',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope

        });
    }

    // used for closing  the DeleteAdditionalCostPopup-jj
    private closeCancelCPOPopup() {
        let controllerScope = this.$scope;
        controllerScope.isCancelConfirm = false;
        this.cancelCPOPopup.dismiss('cancel');
    }

    private cancelConfirm() {
        this.closeCancelCPOPopup();
        let controllerScope = this.$scope;
        controllerScope.isCancelConfirm = true;
        this.openCancelPopUp();
    }


    //used to change return amount-jj
    private onCancelAdditionalCostChange(cost, isAdditionalCostReturnVisible) {
        let controllerScope = this.$scope;
        if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
            if (isAdditionalCostReturnVisible) {
                controllerScope.returnAmount = cost;
            }
        }
        else {
            if (isAdditionalCostReturnVisible) {
                if (cost >= 0 && cost !== "") {
                    controllerScope.returnAmount = controllerScope.totalReceived - parseFloat("" + controllerScope.totalAdditionalCost) + parseFloat("" + cost);
                }
                else {
                    controllerScope.returnAmount = controllerScope.totalReceived - parseFloat("" + controllerScope.totalAdditionalCost);
                }
            }
        }
    }


    private onChangeAdditionalCostSetting(cost, status) {
        let controllerScope = this.$scope;
        if (status) {
            if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
                controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalReceived;
                controllerScope.returnAmount = controllerScope.totalReceived;
            }
            else {
                controllerScope.returnAmount = controllerScope.totalReceived;
                controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalAdditionalCost;
            }
        }
        else {
            controllerScope.additionalCostReturned.additionalCostReturned = 0;
            if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
                controllerScope.returnAmount = controllerScope.totalReceived;
            }
            else {
                controllerScope.returnAmount = controllerScope.totalReceived - controllerScope.totalAdditionalCost;
            }
        }
    }
}

app.controller(CustomerPOWorkListController.controllerId, ['$scope', '$log', 'CustomerPOWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$modal', '$routeParams', ($scope, $log, CustomerPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams) => {
    return new CustomerPOWorkListController($scope, $log, CustomerPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams);
}]);


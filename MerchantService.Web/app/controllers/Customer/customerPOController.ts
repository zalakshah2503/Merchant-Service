/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/customer/customerposervice.ts" />

interface IcustomerPOControllerScope extends ng.IScope {
    customerPO: Model.CustomerPO;
    CPOPayment: Model.CPOPayment;
    CPODownPayment: Model.CPODownPayment;
    customerProfile: Model.CustomerProfile;
    addtionalCost: Model.CPOAdditionalCost;
    getBranchList: Function;
    getCustomerList: Function;
    customerChange: Function;
    getItemList: Function;
    addCPOItem: Function;
    deleteCPOItem: Function;
    deleteAdditionalCost: Function;
    getAdditionalServiceList: Function;
    generateCustomerPONum: Function;
    addItemByBarcode: Function;
    searchItem: Function;
    addAttionalService: Function;
    saveCPO: Function;
    findCustomer: Function;
    openDeleteItemPopup: Function;
    closeDeleteItemPopup: Function;
    openDueDatePicker: Function;
    openItemSearchPopup: Function;
    closeItemSearchPopup: Function;
    openSummaryCPOPopup: Function;
    closeSummaryCPOPopup: Function;
    openItemAddErrorPopup: Function;
    closeItemAddErrorPopup: Function;
    onAmountChange: Function;
    cancel: Function;
    getCPO: Function;
    updateCPO: Function;
    checkItem: Function;
    getBrandList: Function;
    getGroupList: Function;
    isCustomerListVisible: boolean;
    category: any;
    isCPOPayment: boolean;
    totalQuantity: number;
    totalCost: number;
    Item: any;
    cpoItemTotal: number;
    amtPaid: number;
    differenceAmt: number;
    differenceAmtToCustomer: number;
    differenceAmtFromCustomer: number;
    currentlyPaid: number;
    isEdit: boolean;
    isCPOFetched: boolean;
    isCustomerSearched: boolean;
    date: any;
    cpoInfo: any;
    isCPOAdded: boolean;
    collectingBranchName: string;
    collectingBranch: any;
    customerDetail: any;
    brandList: any;
    groupList: any;
    itemFetched: boolean;
    branchList: any;
    minStartDate: any;
    customerList: any;
    itemList: any;
    additionalServiceList: any;
    addtionalCostList: any;
    additionalElementList: any;
    isAddtionalServiceListAvailable: boolean;
    customerInfo: any;
    mobileNo: string;
    membershipCode: number;
    isDueDatePickerOpened: any;
    priceCategoryList: any;
    tempCategoryList: any;
    AllowCreditAccountLimit: boolean;
    cpoList: any;
    paymentCPOList: any;
    isAddCPOItem;
    isCPOFilled;
    isAddAdditionalService: any;
    categoryList: any;
    itemProfileCollection: any;
    totalCollection: any;
    subItemCollection: any;
    isItemGrid: boolean;
    userErrorMessageDisplay: boolean;
    isExcessAmtApprove: boolean;
    search: any;
    find: any;
    payment: any;
    errorMessage: string;
    errorMessageDisplayForBlankList: boolean;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    entryLimit: any;
    itemTotalCollection: any;
    //used for payment
    checkQuantity: Function;
    excessAmtApprove: Function;
    openItemQuantityErrorPopup: Function;
    closeItemQuantityErrorPopup: Function;
    openNotFoundErrorPopup: Function;
    closeNotFoundErrorPopup: Function;
    openLimitBalanceErrorPopup: Function;
    closeLimitBalanceErrorPopup: Function;
    openExcessAmountErrorPopup: Function;
    closeExcessAmountErrorPopup: Function;
    openDeleteAdditionalCostPopup: Function;
    closeDeleteAdditionalCostPopup: Function;
    openDownPaymentBalanceErrorPopup: Function;
    closeDownPaymentBalanceErrorPopup: Function;
    clearPaymentDetails: Function;
    itemNotFound: boolean;
    customerNotFound: boolean;
    InActiveCustomer: boolean;
    downPayment: any;
    AdditionalCostId: any;
    isLimit: boolean;
    isBalance: boolean;
    amount: any;
    actualQuantity: any;
    isCreatePage: boolean;
    isCreditCustomer: boolean;
    //multiple down payment
    isCustomerDetailsVisible: boolean;
    customerSearch: Function;
    customerSelect: Function;
    cpoSelect: Function;
    onAmtChangeCount: number;
    //used only during multiple down payment
    isCPOListVisible: boolean;
    isPaymentDetailVisible: boolean;
    cpoDownPaymnetList: any;
    isfirstPayment: boolean;
    //pagination on payment page
    totalCPOs: number;
    currentCPOPage: any;
    totalCPOCollection: any;
    cpoTotalCollection: any;
    cpoData: any;
    cpoListEmptyError: any;
    noDataFound: any;
    branchSelectError: any;
    dueDateError: any;
    validAmountError: any;
    itemAddedTOPOList: any;
    addCostAddedError: any;
    noItemAddedToPO: any;
    quantityLimitError: any;
    validQuantityError: any;
    customerNotFind: any;
    itemNotFind: any;
    inActiveCustomerError: any;
    deleteConfirmation: any;
    deleteConfirmMessage: any;
    cpoNotFound: any;
    custNotFound: any;
    excessCPOAmountError: any;
    payDownPayment: any;
    yourBalIs: any;
    plsPayRemainingAmt: any;
    only: any;
    available: any;
    pagination: Function;
}

interface IcustomerPOController {
}

class CustomerPOController implements IcustomerPOController {
    static controllerId = "CustomerPOController";
    public customerItemSearchPopup;
    public itemAddErrorPopup;
    public itemQuantityErrorPopup;
    public limitBalanceErrorPopup;
    public excessAmountErrorPopup;
    public notFoundErrorPopup;
    public deleteItemPopup;
    public deleteAdditionalCostPopup;
    public deleteDownPaymentBalanceErrorPopup;
    public summaryCPOPopup;


    constructor(private $scope: IcustomerPOControllerScope, private $log: ng.ILocaleService, private customerPOService: CustomerPOService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $filter, public $location, public $modal, public $routeParams, public printer) {

        this.$scope.customerPO = new Model.CustomerPO();
        this.$scope.addtionalCost = new Model.CPOAdditionalCost();
        this.$scope.CPOPayment = new Model.CPOPayment();
        this.$scope.CPODownPayment = new Model.CPODownPayment();
        this.$scope.isCustomerListVisible = false;
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.minStartDate = new Date();
        this.$scope.getCustomerList = () => this.getCustomerList();
        this.$scope.customerChange = (id) => this.customerChange(id);
        this.$scope.getItemList = () => this.getItemList();
        this.$scope.addCPOItem = (itemId) => this.addCPOItem(itemId);
        this.$scope.deleteCPOItem = (itemId) => this.deleteCPOItem(itemId);
        this.$scope.deleteAdditionalCost = (id) => this.deleteAdditionalCost(id);
        this.$scope.getAdditionalServiceList = () => this.getAdditionalServiceList();
        this.$scope.addAttionalService = (search) => this.addAttionalService(search);
        this.$scope.saveCPO = () => this.saveCPO();
        this.$scope.minStartDate = new Date();
        this.$scope.generateCustomerPONum = () => this.generateCustomerPONum();
        this.$scope.isCreatePage = false;
        this.$scope.cancel = () => this.cancel();
        this.$scope.getCPO = () => this.getCPO();
        this.$scope.addItemByBarcode = (Barcode) => this.addItemByBarcode(Barcode);
        this.$scope.isEdit = false;
        this.$scope.priceCategoryList = [];
        this.$scope.tempCategoryList = [];
        this.$scope.brandList = [];
        this.$scope.groupList = [];
        this.$scope.AdditionalCostId = 0;
        this.$scope.onAmtChangeCount = 0;
        this.$scope.userErrorMessageDisplay = false;
        this.$scope.checkItem = () => this.checkItem();
        this.$scope.excessAmtApprove = () => this.excessAmtApprove();
        this.$scope.isExcessAmtApprove = false;
        this.$scope.totalQuantity = 0;
        this.$scope.totalCost = 0;
        this.$scope.findCustomer = () => this.findCustomer();
        this.$scope.isDueDatePickerOpened = false;
        this.$scope.openDueDatePicker = (event) => this.openDueDatePicker(event);
        this.$scope.openItemSearchPopup = () => this.openItemSearchPopup();
        this.$scope.closeItemSearchPopup = () => this.closeItemSearchPopup();
        this.$scope.openItemAddErrorPopup = () => this.openItemAddErrorPopup();
        this.$scope.closeItemAddErrorPopup = () => this.closeItemAddErrorPopup();
        this.$scope.closeSummaryCPOPopup = () => this.closeSummaryCPOPopup();
        this.$scope.openDeleteItemPopup = (id) => this.openDeleteItemPopup(id);
        this.$scope.closeDeleteItemPopup = () => this.closeDeleteItemPopup();
        this.$scope.openDeleteAdditionalCostPopup = (id) => this.openDeleteAdditionalCostPopup(id);
        this.$scope.closeDeleteAdditionalCostPopup = () => this.closeDeleteAdditionalCostPopup();
        this.$scope.openDownPaymentBalanceErrorPopup = () => this.openDownPaymentBalanceErrorPopup();
        this.$scope.closeDownPaymentBalanceErrorPopup = () => this.closeDownPaymentBalanceErrorPopup();
        this.$scope.onAmountChange = (amt) => this.onAmountChange(amt);
        this.$scope.category = [];
        this.$scope.amtPaid = 0;
        this.$scope.currentlyPaid = 0;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.cpoList = [];
        this.$scope.paymentCPOList = [];
        this.$scope.isAddCPOItem = true;
        this.$scope.isCPOFilled = true;
        this.$scope.isAddAdditionalService = true;
        this.$scope.itemFetched = false;
        this.$scope.search = [];
        this.$scope.find = [];
        this.$scope.collectingBranch = [];
        this.$scope.customerDetail = [];
        this.$scope.categoryList = [];
        this.$scope.AllowCreditAccountLimit = false;
        this.$scope.branchList = [];
        this.$scope.customerList = [];
        this.$scope.customerInfo = [];
        this.$scope.itemList = [];
        this.$scope.additionalServiceList = [];
        this.$scope.addtionalCostList = [];
        this.$scope.payment = [];
        this.$scope.isAddtionalServiceListAvailable = true;
        this.$scope.isItemGrid = false;
        this.$scope.isCPOFetched = false;
        this.$scope.isCustomerSearched = false;
        this.$scope.customerSelect = (customer) => this.customerSelect(customer);
        this.$scope.searchItem = () => this.searchItem();
        this.$scope.cpoData = [];
        this.$scope.pagination = (currentpg) => this.pagination(currentpg);
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.entryLimit = 10;
        //used for payment
        this.$scope.checkQuantity = (cpo) => this.checkQuantity(cpo);
        this.$scope.openItemQuantityErrorPopup = () => this.openItemQuantityErrorPopup();
        this.$scope.closeItemQuantityErrorPopup = () => this.closeItemQuantityErrorPopup();
        this.$scope.openNotFoundErrorPopup = () => this.openNotFoundErrorPopup();
        this.$scope.closeNotFoundErrorPopup = () => this.closeNotFoundErrorPopup();
        this.$scope.itemNotFound = false;
        this.$scope.customerNotFound = false;
        this.$scope.InActiveCustomer = false;
        this.$scope.clearPaymentDetails = () => this.clearPaymentDetails();
        this.$scope.openLimitBalanceErrorPopup = (amount) => this.openLimitBalanceErrorPopup(amount);
        this.$scope.closeLimitBalanceErrorPopup = () => this.closeLimitBalanceErrorPopup();
        this.$scope.openExcessAmountErrorPopup = () => this.openExcessAmountErrorPopup();
        this.$scope.closeExcessAmountErrorPopup = () => this.closeExcessAmountErrorPopup();
        this.$scope.isLimit = false;
        this.$scope.isBalance = false;
        this.$scope.actualQuantity = "";
        //string constants
        this.$scope.cpoListEmptyError = stringConstants.cpoListEmptyError;
        this.$scope.noDataFound = stringConstants.noDataFound;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.branchSelectError = stringConstants.branchSelectError;
        this.$scope.dueDateError = stringConstants.dueDateError;
        this.$scope.itemAddedTOPOList = stringConstants.itemAddedTOPOList;
        this.$scope.addCostAddedError = stringConstants.addCostAddedError;
        this.$scope.noItemAddedToPO = stringConstants.noItemAddedToPO;
        this.$scope.quantityLimitError = stringConstants.quantityLimitError;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.customerNotFind = stringConstants.customerNotFound;
        this.$scope.itemNotFind = stringConstants.itemNotFound;
        this.$scope.inActiveCustomerError = stringConstants.inActiveCustomerError;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.cpoNotFound = stringConstants.cpoNotFound;
        this.$scope.custNotFound = stringConstants.customerNotFound;
        this.$scope.excessCPOAmountError = stringConstants.excessCPOAmountError;
        this.$scope.payDownPayment = stringConstants.payDownPayment;
        this.$scope.yourBalIs = stringConstants.yourBalIs;
        this.$scope.plsPayRemainingAmt = stringConstants.plsPayRemainingAmt;
        this.$scope.only = stringConstants.only;
        this.$scope.available = stringConstants.available;
        //used for multiple down payment
        this.$scope.customerSearch = () => this.customerSearch();
        this.$scope.cpoSelect = (id) => this.cpoSelect(id);
        this.$scope.isCPOPayment = false;
        this.$scope.isCPOListVisible = false;
        this.$scope.isPaymentDetailVisible = true;
        this.$scope.isfirstPayment = false;
        this.$scope.cpoDownPaymnetList = [];
        this.$scope.totalCPOCollection = [];
        this.$scope.cpoTotalCollection = [];
        this.$scope.currentCPOPage = 1;
        this.initialize();
    }

    private initialize() {

        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getBranchList();
            this.getAdditionalServiceList();
        }
        else {
            this.getBranchList();
            this.getCustomerList();
            this.getAdditionalServiceList();
        }
    }

    private pagination(currentpg) {
        let controllerScope = this.$scope;
        controllerScope.totalCollection = [];
        let begin = ((currentpg - 1) * controllerScope.itemsPerPage),
            end = begin + controllerScope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.itemTotalCollection.slice(begin, end);
    }

    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let today = new Date();
        controllerScope.date = today;
        if (controllerRootScope.customerProfile !== null && controllerRootScope.customerProfile !== undefined) {
            if (controllerRootScope.customerProfile.IsCreditCustomer || (controllerRootScope.customerProfile.BalanceAmount > 0 || controllerRootScope.customerProfile.AmountLimit > 0)) {
                controllerRootScope.isCreditCustomer = true;
            }
            else {
                controllerRootScope.isCreditCustomer = false;
            }
        }
        if (controllerRootScope.isCPOAdded) {
            controllerRootScope.isCustomerDetailsVisible = true;
        }
        else {
            controllerRootScope.isCustomerDetailsVisible = false;
        }
        let promise = this.customerPOService.getBranchList();
        promise.then((result) => {
            if (result.length === 0) {
            }
            else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    //used to fetch customer list
    private getCustomerList() {
        let controllerScope = this.$scope;
        let promise = this.customerPOService.getAllCustomerList();
        promise.then((result) => {
            if (result.length === 0) {
            }
            else {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].BalanceAmount > 0) {
                        result[i].RemainingAmount = result[i].BalanceAmount - result[i].TransactionAmount;

                    }
                    else if (result[i].AmountLimit > 0) {
                        result[i].RemainingAmount = result[i].AmountLimit - result[i].TransactionAmount;
                    }
                    else {
                        result[i].RemainingAmount = 0;
                    }
                    //  result[i].RemainingAmount = parseFloat("" + result[i].RemainingAmount.tofixed(3));
                    controllerScope.customerList.push(result[i]);
                }
                controllerScope.tempCategoryList = controllerScope.customerList;
                controllerScope.priceCategoryList = stringConstants.priceCategoryList;
            }
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    // used to fetch item list - jj
    private getItemList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.itemList = [];
        let itemCollection = controllerScope.itemList;
        let promise;
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            promise = this.customerPOService.getItemList(6, controllerScope.collectingBranch.BranchId);
        }
        else {
            promise = this.customerPOService.getItemList(6, controllerScope.collectingBranch.Branch.Id);
        }
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.itemFetched = true;
                    controllerScope.isItemGrid = true;
                    controllerRootScope.PriceCategory = "";
                    for (let i = 0; i < result.length; i++) {
                        result[i].ItemTotalCost = 0;
                        itemCollection.push(result[i]);
                    }
                    controllerScope.itemTotalCollection = itemCollection;
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = itemCollection.slice(begin, end);
                    /* init pagination  */
                    controllerScope.totalItems = controllerScope.itemList.length;

                    if (controllerScope.customerPO.CPOItem !== undefined && controllerScope.customerPO.CPOItem !== null && controllerScope.customerPO.CPOItem.length > 0) {
                        for (let i = 0; i < controllerScope.customerPO.CPOItem.length; i++) {
                            for (let j = 0; j < controllerScope.itemTotalCollection.length; j++) {
                                if (controllerScope.customerPO.CPOItem[i].ItemId === controllerScope.itemTotalCollection[j].Id) {
                                    let actualQuantity = this.getActaulQuantity(controllerScope.customerPO.CPOItem[i].ItemId);
                                    controllerScope.cpoList.push({
                                        Id: controllerScope.customerPO.CPOItem[i].ItemId, Barcode: controllerScope.customerPO.CPOItem[i].Barcode, ItemNameEn: controllerScope.itemTotalCollection[j].ItemNameEn,
                                        FlavourEn: controllerScope.itemTotalCollection[j].FlavourEn, Unit: controllerScope.itemTotalCollection[j].Unit,
                                        SellPrice: controllerScope.itemTotalCollection[j].SellPrice, Quantity: controllerScope.customerPO.CPOItem[i].Quantity,
                                        ActualQuantity: actualQuantity, BaseUnit: controllerScope.itemTotalCollection[j].BaseUnit,
                                        CostPrice: controllerScope.itemTotalCollection[j].CostPrice, OfferSellPrice: controllerScope.itemTotalCollection[j].OfferSellPrice,
                                        OfferRemainingQuantity: controllerScope.itemTotalCollection[j].OfferRemainingQuantity, ItemTotalCost: controllerScope.customerPO.CPOItem[i].ItemTotalCost,
                                        OfferLimitQuantity: controllerScope.itemTotalCollection[j].OfferLimitQuantity
                                    });
                                    controllerScope.totalQuantity = controllerScope.totalQuantity + controllerScope.customerPO.CPOItem[i].Quantity;
                                    controllerScope.totalCost = controllerScope.totalCost + controllerScope.customerPO.CPOItem[i].ItemTotalCost;
                                    controllerScope.totalCost = this.roundToTow(controllerScope.totalCost);
                                }
                            }
                        }
                    }
                    controllerRootScope.isLoading = false;
                }
                else {
                    controllerScope.errorMessageDisplayForBlankList = true;
                    controllerScope.isItemGrid = false;
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isItemGrid = false;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }


    // used to fetch addtional services list -jj
    private getAdditionalServiceList() {
        let controllerScope = this.$scope;
        let promise = this.customerPOService.getAdditionalServiceList();
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.isItemGrid = true;
                    for (let i = 0; i < result.length; i++) {
                        controllerScope.additionalServiceList.push({ Name: result[i].Name, Id: result[i].Id, IsSelected: false, Amount: 0 });
                        controllerScope.isAddtionalServiceListAvailable = true;
                    }
                    if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "" && controllerScope.isCPOFetched === false) {
                        this.getCPO();
                    }
                    else {
                    }
                }
                else {
                    controllerScope.isAddtionalServiceListAvailable = false;
                }
            }
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }


    //used to fill itemgrid with the selected items-jj
    private addAttionalService(search) {
        let controllerScope = this.$scope;
        for (let j = 0; j < controllerScope.addtionalCostList.length; j++) {
            if (controllerScope.addtionalCostList[j].Id === search.Id) {
                controllerScope.isAddAdditionalService = false;
            }
        }
        if (controllerScope.isAddAdditionalService) {
            for (let i = 0; i < controllerScope.additionalServiceList.length; i++) {
                if (controllerScope.additionalServiceList[i].Id === search.Id) {
                    controllerScope.additionalServiceList[i].IsSelected = true;
                    controllerScope.additionalServiceList[i].Amount = search.Amount;
                    if (controllerScope.additionalServiceList[i].IsSelected) {
                        controllerScope.addtionalCostList.push(controllerScope.additionalServiceList[i]);
                    }
                }
            }
        }
        else {
            this.openItemAddErrorPopup();
        }
        controllerScope.search = [];
    }


    //used to fill itemgrid with the selected items-jj
    // uncomment the above code if anything goes wrong with the below written code
    // i wrote another code below just for performance improvement
    private addCPOItem(item) {
        let controllerScope = this.$scope;
        //for set scroll position
        let section_pos = angular.element("#item-grid").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top + 50 }, 300);
        this.closeItemSearchPopup();
        for (let j = 0; j < controllerScope.cpoList.length; j++) {
            if (controllerScope.cpoList[j].Id === item.Id) {
                controllerScope.isAddCPOItem = false;
            }
        }
        if (controllerScope.isAddCPOItem) {
            controllerScope.cpoList.push(item);
        }
        else {
            this.openItemAddErrorPopup();
        }
    }


    //used to delete item from grid - jj
    private deleteCPOItem(item) {
        let controllerScope = this.$scope;
        let tempList = controllerScope.cpoList;
        controllerScope.cpoList = [];
        this.closeDeleteItemPopup();

        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].Id === item.Id) {
                tempList[i].Quantity = "";
                tempList[i].ItemTotalCost = 0;
            }
            else {
                controllerScope.cpoList.push(tempList[i]);
            }
        }
        this.calculateQuantityPrice();
    }


    //used to calculate total quantity of items and total cost price
    private calculateQuantityPrice() {
        let controllerScope = this.$scope;
        controllerScope.totalQuantity = 0;
        controllerScope.totalCost = 0;
        for (let i = 0; i < controllerScope.cpoList.length; i++) {
            if (controllerScope.cpoList[i].Quantity > 0) {
                controllerScope.totalQuantity = parseFloat("" + controllerScope.totalQuantity) + parseFloat("" + controllerScope.cpoList[i].Quantity);
                controllerScope.totalCost = parseFloat("" + controllerScope.totalCost) + parseFloat("" + (controllerScope.cpoList[i].ItemTotalCost));
            }
        }
        controllerScope.totalCost = this.roundToTow(controllerScope.totalCost);
    }

    // used to delete addtional cost from grid
    private deleteAdditionalCost(id) {
        let controllerScope = this.$scope;
        let tempList = controllerScope.addtionalCostList;
        controllerScope.addtionalCostList = [];
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].Id === id) {
            }
            else {
                controllerScope.addtionalCostList.push(tempList[i]);
            }
        }
        this.closeDeleteAdditionalCostPopup();
    }


    // USED TO ADD CPO TO DATABASE - JJ  
    //after client changes
    private saveCPO() {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerScope.cpoData = controllerRootScope.cpoInfo;
        let approval = 0;
        controllerScope.cpoData.ExcessAmount = controllerScope.differenceAmtToCustomer;
        //  controllerScope.cpoData.ExcessAmount = parseFloat(controllerScope.cpoData.ExcessAmount.tofixed(3));
        if (controllerScope.differenceAmtToCustomer > 0) {
            if (controllerScope.isExcessAmtApprove) {
            }
            else {
                if (controllerScope.currentlyPaid > 0) {
                    approval = 1;
                    this.openExcessAmountErrorPopup();
                }
            }
        }

        if (approval === 0) {
            controllerRootScope.isLoading = true;
            if (controllerScope.cpoData.CustomerPOId > 0 && controllerScope.isCPOPayment === false) {
                controllerScope.cpoData.IsEdit = true;
            }
            else {
                controllerScope.cpoData.IsEdit = false;
            }
            controllerScope.cpoData.CPOPaymentAC = controllerScope.CPOPayment;
            let downPayment = (controllerScope.cpoData.TotalCPOAmount * controllerScope.cpoData.CPODownPaymentDiscount) / 100;
            if (controllerScope.amtPaid === 0) {
                controllerScope.amtPaid = controllerScope.cpoData.DownPaymentAmount;
            }

            if ((controllerScope.isCPOPayment) || (controllerScope.currentlyPaid > 0 && (controllerScope.amtPaid >= controllerRootScope.downPayment))) {
                controllerScope.cpoData.ToCustomer = false;
                this.saveCustomerPOData(controllerScope.cpoData);
            }
            else {
                if (controllerScope.cpoData.IsEdit === true && controllerScope.cpoData.TotalCPOAmount < controllerScope.cpoData.DownPaymentAmount) {
                    controllerScope.cpoData.ToCustomer = true;
                    this.saveCustomerPOData(controllerScope.cpoData);
                }
                else if ((controllerScope.cpoData.IsEdit === true && (controllerScope.cpoData.DownPaymentAmount >= downPayment)) || downPayment === 0) {
                    this.saveCustomerPOData(controllerScope.cpoData);
                }
                else {
                    controllerRootScope.isLoading = false;
                    this.openLimitBalanceErrorPopup(controllerScope.currentlyPaid);
                }
            }
        }
    }

    private saveCustomerPOData(copData) {
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let onlyPay = 0;
        if (copData.CustomerId > 0) {
            onlyPay = 1;
        }
        else {
            if (copData.IsEdit === false) {
                copData.Customer = copData.CustomerProfile;
                copData.Customer.Id = copData.CustomerProfile.CustomerId;
            }
            else {
                copData.Customer = copData.CustomerProfile;
            }
        }
        let promise = this.customerPOService.saveCPO(copData);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.status === undefined || result.status === null) {
                    controllerRootScope.isCPOAdded = false;
                    controllerRootScope.cpoInfo.ToCustomer = false;
                    if (controllerRootScope.cpoInfo.IsEdit) {
                        this.ngToast.create(stringConstants.CPOUpdated);
                        this.$location.path("/CustomerPOWorkList");
                    }
                    else {
                        if (onlyPay > 0) {
                            this.ngToast.create(stringConstants.CPOPaymentDone);
                            this.$location.path("/CustomerPOWorkList");
                        }
                        else {
                            this.ngToast.create(stringConstants.CPOCreated);
                            this.$location.path("/CustomerPOWorkList");
                        }
                    }
                    if (result.IsReceipt && !result.ToCustomer) {
                        this.$location.path("/CustomerPOWorkList");
                        if (result.TotalCPOAmount >= result.DownPaymentAmount) {
                            result.AmtRemaining = 0;
                        }
                        else {
                            result.AmtRemaining = parseFloat(result.DownPaymentAmount) - parseFloat(result.TotalCPOAmount);
                        }
                        this.printer.print("/Templates/Customer/CustomerPurchaseOrderReceipt.html", result);
                    }
                    controllerRootScope.cpoInfo = [];
                    controllerRootScope.cpoInfo.IsEdit = false;
                }
                else {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.permissionDenied
                        });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            controllerRootScope.isLoading = false;
        });
    }

    //used to generate customer purchase order number    
    private generateCustomerPONum() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let count = 0;
        if (controllerScope.cpoList.length === 0) {
            controllerScope.isCPOFilled = false;
            this.openItemAddErrorPopup();
            controllerRootScope.isLoading = false;
        }
        else {
            for (let n = 0; n < controllerScope.cpoList.length; n++) {
                if (controllerScope.cpoList[n].Quantity <= 0) {
                    controllerScope.actualQuantity = 1;
                    count = 1;
                }
            }
            if (count === 0) {
                controllerRootScope.isLoading = true;
                let temp = [];
                let itemTotalAmt = 0;
                let additionalCostTotalAmt = 0;
                for (let i = 0; i < controllerScope.addtionalCostList.length; i++) {
                    temp.push({ AdditionalServiceId: controllerScope.addtionalCostList[i].Id, Amount: controllerScope.addtionalCostList[i].Amount });
                    additionalCostTotalAmt = additionalCostTotalAmt + parseFloat("" + controllerScope.addtionalCostList[i].Amount);
                }
                controllerScope.customerPO.CPOAdditionalCost = temp;
                temp = [];
                for (let j = 0; j < controllerScope.cpoList.length; j++) {
                    temp.push({
                        ItemId: controllerScope.cpoList[j].Id, Barcode: controllerScope.cpoList[j].Barcode,
                        SellPrice: controllerScope.cpoList[j].SellPrice, CostPrice: controllerScope.cpoList[j].CostPrice,
                        Quantity: controllerScope.cpoList[j].Quantity, ItemTotalCost: controllerScope.cpoList[j].ItemTotalCost,
                        OrderedOfferQuantity: controllerScope.cpoList[j].OrderedOfferQuantity, OfferSellPrice: controllerScope.cpoList[j].OfferSellPrice
                    });
                    itemTotalAmt = itemTotalAmt + parseFloat("" + controllerScope.cpoList[j].ItemTotalCost);
                    if (controllerScope.cpoList[j].ActualQuantity < controllerScope.cpoList[j].Quantity) {
                        controllerScope.customerPO.IsSPORequired = true;
                    }
                }
                controllerScope.customerPO.CPOItem = temp;
                if (!controllerScope.isEdit) {
                    controllerRootScope.collectingBranchName = controllerScope.collectingBranch.Branch.Name;
                    controllerScope.customerPO.CollectingBranchId = controllerScope.collectingBranch.Branch.Id;
                    controllerScope.customerPO.CollectingBranchName = controllerScope.collectingBranch.Branch.Name;
                }
                else {
                    controllerRootScope.collectingBranchName = "";
                    controllerScope.customerPO.CollectingBranchId = controllerScope.collectingBranch.BranchId;
                    for (let k = 0; k < controllerScope.branchList.length; k++) {
                        if (controllerScope.branchList[k].Id === controllerScope.customerPO.CollectingBranchId) {
                            controllerRootScope.collectingBranchName = controllerScope.branchList[k].Name;
                            controllerScope.customerPO.CollectingBranchName = controllerScope.branchList[k].Name;;
                        }
                    }
                }
                controllerScope.customerPO.TotalCPOAmount = (additionalCostTotalAmt + itemTotalAmt);
                controllerRootScope.customerProfile = controllerScope.customerPO.CustomerProfile;
                if (controllerRootScope.customerProfile.BalanceAmount > 0) {
                    controllerRootScope.customerProfile.BalanceAmt = controllerRootScope.customerProfile.BalanceAmount - controllerRootScope.customerProfile.TransactionAmount;
                }
                else if (controllerRootScope.customerProfile.AmountLimit > 0) {
                    controllerRootScope.customerProfile.LimitAmt = controllerRootScope.customerProfile.AmountLimit - controllerRootScope.customerProfile.TransactionAmount;
                }
                else {
                    controllerRootScope.customerProfile.BalLimitAmt = 0;
                }
                controllerRootScope.paymentCPOList = controllerScope.customerPO;
                if (!controllerScope.isEdit) {
                    let promise = this.customerPOService.generateCPONumber();
                    promise.then((result) => {
                        if (result.length === 0) {
                            controllerRootScope.isLoading = false;
                        }
                        else {
                            controllerRootScope.isCPOAdded = true;
                            controllerScope.customerPO.PurchaseOrderNo = result.PurchaseOrderNo;
                            controllerScope.customerPO.InitiationBranchId = result.branchId;
                            controllerScope.customerPO.InitiationDate = result.date;
                            controllerScope.customerPO.InitiationBranchName = result.branchName;
                            controllerScope.customerPO.InitiatorName = result.userName;
                            controllerScope.customerPO.CPODownPaymentDiscount = result.CPODownPaymentDiscount;
                            controllerScope.customerPO.AllowCreditAccountLimit = result.AllowCreditAccountLimit;
                            controllerRootScope.downPayment = (controllerScope.customerPO.TotalCPOAmount * controllerScope.customerPO.CPODownPaymentDiscount) / 100;
                            if (controllerRootScope.downPayment < 0) {
                                controllerRootScope.downPayment = 0;
                            }
                            //in server side it goes like dd/MM/yy format
                            controllerScope.customerPO.DueDateTemp = controllerScope.customerPO.DueDate;
                            controllerScope.customerPO.DueDate = this.$filter('date')(controllerScope.customerPO.DueDate, 'yyyy/MM/dd');
                            controllerRootScope.cpoInfo = controllerScope.customerPO;

                            controllerRootScope.isLoading = false;
                            controllerScope.isCreatePage = true;
                            this.onAmountChange(0);
                            this.openSummaryCPOPopup();
                        }
                    }).catch((error) => {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.OopsErrorMessage
                            });
                        controllerRootScope.isLoading = false;
                    });
                }
                else {
                    let promise = this.customerPOService.getConfigurables();
                    promise.then((result) => {
                        if (result.length === 0) {
                            controllerRootScope.isLoading = false;
                        }
                        else {
                            controllerScope.customerPO.CPODownPaymentDiscount = result.CPODownPaymentDiscount;
                            controllerScope.customerPO.AllowCreditAccountLimit = result.AllowCreditAccountLimit;
                            controllerRootScope.downPayment = ((controllerScope.customerPO.TotalCPOAmount - controllerScope.customerPO.PrevTotal) * controllerScope.customerPO.CPODownPaymentDiscount) / 100;
                            if (controllerRootScope.downPayment < 0) {
                                controllerRootScope.downPayment = 0;
                            }
                            controllerRootScope.isCPOAdded = true;
                            controllerRootScope.isLoading = false;
                            controllerRootScope.cpoInfo = controllerScope.customerPO;
                            controllerScope.isCreatePage = true;
                            this.onAmountChange(0);
                            this.openSummaryCPOPopup();
                        }
                    }).catch((error) => {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.OopsErrorMessage
                            });
                    });
                }
                for (let k = 0; k < stringConstants.priceCategoryList.length; k++) {
                    if (controllerRootScope.customerProfile.PriceCategory === stringConstants.priceCategoryList[k].Id) {
                        controllerRootScope.customerProfile.PriceCategoryName = stringConstants.priceCategoryList[k].Name;
                    }
                }
                controllerRootScope.cpoInfo = controllerScope.customerPO;
                if (controllerRootScope.cpoInfo.DownPaymentAmount > 0) {
                    if (controllerRootScope.cpoInfo.TotalCPOAmount > controllerRootScope.cpoInfo.DownPaymentAmount) {
                        controllerRootScope.differenceAmt = controllerRootScope.cpoInfo.TotalCPOAmount - controllerRootScope.cpoInfo.DownPaymentAmount;
                    }
                    else {
                        controllerRootScope.differenceAmt = controllerRootScope.cpoInfo.TotalCPOAmount;
                        controllerRootScope.differenceAmtToCustomer = controllerRootScope.cpoInfo.DownPaymentAmount - controllerRootScope.cpoInfo.TotalCPOAmount;
                    }
                }
                else {
                    controllerRootScope.differenceAmt = 0;
                }
            }
            else {
                controllerRootScope.isLoading = false;
                this.openItemQuantityErrorPopup();
            }
        }
    }


    // called when customer selection is changed - jj
    private customerChange(id) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.customerList.length; i++) {
            if (controllerScope.customerList[i].CustomerId === id) {
                controllerScope.customerInfo.membershipCode = controllerScope.customerList[i].MembershipCode;
            }
        }
    }

    //used to find customer based on parameters
    private findCustomer() {
        let controllerScope = this.$scope;
        controllerScope.isCustomerListVisible = true;
        let that = this;
        controllerScope.customerList = controllerScope.tempCategoryList;
        controllerScope.customerList = this.filterFilter((controllerScope.customerList), controllerScope.find);
        controllerScope.find = [];
    }

    //open date picker - jj
    private openDueDatePicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDatePickerOpened = true;
    }

    // used for opening the DeleteUserPopup-jj
    private openItemSearchPopup() {
        let controllerScope = this.$scope;
        if (!controllerScope.itemFetched) {
            this.getBrandList();
            this.getCategoryList();
        }
        else {
            this.pagination(1);
        }
        this.customerItemSearchPopup = this.$modal.open({
            templateUrl: 'CustomerItemSearch',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'lg'
        });
    }

    //used for closing  the DeleteUserPopup-jj
    private closeItemSearchPopup() {
        this.customerItemSearchPopup.dismiss('cancel');
        this.$scope.find = [];
    }



    // used for opening the DeleteUserPopup-jj
    private openItemAddErrorPopup() {
        let controllerScope = this.$scope;
        this.itemAddErrorPopup = this.$modal.open({
            templateUrl: 'AddItemErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the DeleteUserPopup-jj
    private closeItemAddErrorPopup() {
        this.itemAddErrorPopup.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.isAddCPOItem = true;
        controllerScope.isAddAdditionalService = true;
        controllerScope.isCPOFilled = true;
    }

    //This function used for get category list.-jj
    private getCategoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.customerPOService.getCategoryList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;

            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    //new 1
    //called when the down payment amount is entered or changed by the user-jj
    private onAmountChange(amt) {
        let controllerScope = this.$scope;
        if (controllerScope.onAmtChangeCount === 0) {
            controllerScope.cpoData = this.$rootScope.cpoInfo;
            controllerScope.amtPaid = 0;
            controllerScope.differenceAmt = 0;
            controllerScope.differenceAmtToCustomer = 0;
            controllerScope.differenceAmtFromCustomer = 0;
            if (controllerScope.CPOPayment.Cash) {
                controllerScope.amtPaid = controllerScope.amtPaid + parseFloat("" + (controllerScope.CPOPayment.Cash));
            }
            if (controllerScope.CPOPayment.CreditAccountAmount) {
                let countLimit = 0;
                let countBal = 0;
                let creditAmount = parseFloat("" + controllerScope.CPOPayment.CreditAccountAmount);
                if (controllerScope.customerProfile.AmountLimit > 0) {
                    countLimit = 1;
                    if (controllerScope.customerProfile.LimitAmt !== null && controllerScope.customerProfile.LimitAmt !== undefined && creditAmount > controllerScope.customerProfile.LimitAmt) {
                        controllerScope.isLimit = true;
                        this.openLimitBalanceErrorPopup(controllerScope.customerProfile.LimitAmt);
                        controllerScope.CPOPayment.CreditAccountAmount = 0;
                    }
                }
                else if (controllerScope.customerProfile.BalanceAmount > 0) {
                    countBal = 1;
                    if (controllerScope.customerProfile.BalanceAmt !== null && controllerScope.customerProfile.BalanceAmt !== undefined && creditAmount > controllerScope.customerProfile.BalanceAmt) {
                        controllerScope.isBalance = true;
                        this.openLimitBalanceErrorPopup(controllerScope.customerProfile.BalanceAmt);
                        controllerScope.CPOPayment.CreditAccountAmount = 0;
                    }
                }
                else {
                }
                controllerScope.amtPaid = controllerScope.amtPaid + parseFloat("" + controllerScope.CPOPayment.CreditAccountAmount);
            }
            if (controllerScope.CPOPayment.CreditCardAmount) {
                controllerScope.amtPaid = controllerScope.amtPaid + parseFloat("" + controllerScope.CPOPayment.CreditCardAmount);
            }
            if (controllerScope.CPOPayment.DebitCardAmount) {
                controllerScope.amtPaid = controllerScope.amtPaid + parseFloat("" + controllerScope.CPOPayment.DebitCardAmount);
            }
            if (controllerScope.CPOPayment.CouponAmount) {
                controllerScope.amtPaid = controllerScope.amtPaid + parseFloat("" + controllerScope.CPOPayment.CouponAmount);
            }
            controllerScope.currentlyPaid = controllerScope.amtPaid;
            if (controllerScope.cpoData.DownPaymentAmount > 0) {
            }
            else {
                controllerScope.cpoData.DownPaymentAmount = 0;
            }
            controllerScope.amtPaid = controllerScope.amtPaid + controllerScope.cpoData.DownPaymentAmount;
            if (controllerScope.cpoData.TotalCPOAmount < controllerScope.amtPaid) {
                controllerScope.differenceAmt = 0;
                controllerScope.differenceAmtToCustomer = controllerScope.amtPaid - controllerScope.cpoData.TotalCPOAmount;
                this.$rootScope.differenceAmtToCustomer = controllerScope.differenceAmtToCustomer;
                controllerScope.differenceAmtFromCustomer = 0;
                if (controllerScope.isExcessAmtApprove || controllerScope.isCreatePage === true) {
                }
                else {
                    this.openExcessAmountErrorPopup();
                }
            }
            else {
                controllerScope.differenceAmtToCustomer = 0;
                controllerScope.differenceAmtFromCustomer = controllerScope.cpoData.TotalCPOAmount - controllerScope.amtPaid;
                this.$rootScope.differenceAmtFromCustomer = controllerScope.differenceAmtFromCustomer;
                controllerScope.differenceAmt = controllerScope.cpoData.TotalCPOAmount - controllerScope.amtPaid;
                controllerScope.differenceAmt = parseFloat(controllerScope.differenceAmt.toFixed(2));
            }
        }
        if (controllerScope.differenceAmtFromCustomer === 0) {
            this.$rootScope.differenceAmtFromCustomer = 0;
        }
        if (controllerScope.differenceAmtToCustomer === 0) {
            this.$rootScope.differenceAmtToCustomer = 0;
        }

        controllerScope.differenceAmtFromCustomer = this.roundToTow(controllerScope.differenceAmtFromCustomer);
        controllerScope.differenceAmtToCustomer = this.roundToTow(controllerScope.differenceAmtToCustomer);
    }
    
    //used to fetch details of customer selected 
    private customerSearch() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isPaymentDetailVisible = false;
        let count = 0;
        for (let j = 0; j < controllerScope.customerList.length; j++) {
            if (controllerScope.customerInfo.membershipCode === controllerScope.customerList[j].MembershipCode) {
                controllerScope.customerProfile = controllerScope.customerList[j];
                count = 1;
            }
        }
        if (count === 1) {
            controllerScope.userErrorMessageDisplay = false;
            if (controllerScope.customerProfile.IsCreditCustomer) {
                controllerScope.isCreditCustomer = true;
            }
            else {
                controllerScope.isCreditCustomer = false;
            }

            if (controllerScope.customerProfile.BalanceAmount > 0) {
                controllerScope.customerProfile.BalanceAmt = controllerScope.customerProfile.BalanceAmount - controllerScope.customerProfile.TransactionAmount;
            }
            else if (controllerScope.customerProfile.AmountLimit > 0) {
                controllerScope.customerProfile.LimitAmt = controllerScope.customerProfile.AmountLimit - controllerScope.customerProfile.TransactionAmount;
            }
            else {
            }
            controllerRootScope.isCustomerDetailsVisible = true;
            controllerScope.totalCollection = [];
            controllerScope.cpoDownPaymnetList = [];
            let cpoCollection = controllerScope.cpoDownPaymnetList;
            let promise = this.customerPOService.getCustomerPOListByCustomerId(controllerScope.customerProfile.CustomerId);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    if (result.length > 0) {
                        controllerScope.isCPOListVisible = true;
                        for (let i = 0; i < result.length; i++) {
                            cpoCollection[i] = result[i];
                        }
                        for (let k = 0; k < stringConstants.priceCategoryList.length; k++) {
                            if (controllerScope.customerProfile.PriceCategory === stringConstants.priceCategoryList[k].Id) {
                                controllerScope.customerProfile.PriceCategoryName = stringConstants.priceCategoryList[k].Name;
                            }
                        }
                        controllerScope.cpoTotalCollection = cpoCollection;
                        let that = this;
                        let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                            end = begin + that.$scope.itemsPerPage;
                        controllerScope.totalCollection = cpoCollection.slice(begin, end);
                        /* init pagination  */
                        controllerScope.totalItems = controllerScope.cpoTotalCollection.length;
                        controllerScope.itemList = controllerScope.cpoDownPaymnetList;
                    }
                    else {
                        controllerScope.errorMessageDisplayForBlankList = true;
                    }
                }
                else {
                    controllerScope.errorMessageDisplayForBlankList = true;
                }
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                controllerRootScope.isLoading = false;

                if (error.status !== 500) {
                    location.replace(this.apiPath);
                }
            });
        }
        else {
            controllerScope.userErrorMessageDisplay = true;
            controllerRootScope.isLoading = false;
        }
    }


    //2
    //used to select particular cpo
    private cpoSelect(cpo) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isExcessAmtApprove = false;
        this.clearPaymentDetails();
        if (cpo.Total > cpo.DownPaymentAmount) {
            controllerRootScope.isLoading = true;
            let promise = this.customerPOService.getConfigurables();
            promise.then((result) => {
                if (result === null || result === undefined) {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.OopsErrorMessage
                        });
                }
                else {
                    controllerScope.AllowCreditAccountLimit = result.AllowCreditAccountLimit;
                    controllerScope.isPaymentDetailVisible = true;
                    controllerScope.isCPOPayment = true;
                    let temp = [];
                    let i = 0;
                    for (let j = 0; j < controllerScope.cpoDownPaymnetList.length; j++) {
                        if (controllerScope.cpoDownPaymnetList[j].CustomerPOId === cpo.CustomerPOId) {
                            controllerScope.cpoDownPaymnetList[j].TotalCPOAmount = controllerScope.cpoDownPaymnetList[j].Total;
                            controllerRootScope.cpoInfo = controllerScope.cpoDownPaymnetList[j];
                            i++;
                        }
                        else {
                        }
                    }
                    controllerScope.differenceAmt = cpo.Total - cpo.DownPaymentAmount;
                    controllerScope.differenceAmtFromCustomer = this.roundToTow(controllerScope.differenceAmtFromCustomer);
                }
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.OopsErrorMessage
                    });
                controllerRootScope.isLoading = false;
            });
        }
        else {
            this.ngToast.create(stringConstants.AlreadyPaymentdoneCPO);
            controllerScope.isPaymentDetailVisible = false;
        }
    }


    //used to check whether requested quantity available
    private checkQuantity(cpo) {
        let controllerScope = this.$scope;
        if (cpo.Quantity <= 0 || cpo.Quantity === null || cpo.Quantity === undefined) {
            controllerScope.actualQuantity = 1;
            this.openItemQuantityErrorPopup();
            cpo.Quantity = "";
        }
        else {
            let normalQuantity = cpo.Quantity - cpo.OfferRemainingQuantity;

            cpo.ItemTotalCost = parseFloat("" + (normalQuantity * cpo.SellPrice)).toFixed(2);
            cpo.OrderedOfferQuantity = cpo.OfferRemainingQuantity;
            if (cpo.OrderedOfferQuantity < 0) {
                cpo.OrderedOfferQuantity = 0;
            }

        }
        this.calculateQuantityPrice();
    }


    //used to open ItemQuantityErrorPopup
    private openItemQuantityErrorPopup() {
        let controllerScope = this.$scope;
        this.itemQuantityErrorPopup = this.$modal.open({
            templateUrl: 'ItemQuantityErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close ItemQuantityErrorPopup
    private closeItemQuantityErrorPopup() {
        this.itemQuantityErrorPopup.dismiss('cancel');
    }

    //used to open ItemQuantityErrorPopup
    private openNotFoundErrorPopup() {
        let controllerScope = this.$scope;
        this.notFoundErrorPopup = this.$modal.open({
            templateUrl: 'NotFoundErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close ItemQuantityErrorPopup
    private closeNotFoundErrorPopup() {
        this.$scope.customerNotFound = false;
        this.$scope.itemNotFound = false;
        this.$scope.InActiveCustomer = false;
        this.notFoundErrorPopup.dismiss('cancel');
    }

    //used to clear the payment fields
    private clearPaymentDetails() {
        let controllerScope = this.$scope;
        controllerScope.differenceAmt = 0;
        controllerScope.differenceAmtFromCustomer = 0;
        controllerScope.differenceAmtToCustomer = 0;
        controllerScope.CPOPayment = new Model.CPOPayment();
        controllerScope.amtPaid = 0;
    }

    //used to open LimitBalanceErrorPopup
    private openLimitBalanceErrorPopup(amount) {
        let controllerScope = this.$scope;
        this.limitBalanceErrorPopup = this.$modal.open({
            templateUrl: 'LimitBalanceErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.amount = amount;
    }

    //used to close LimitBalanceErrorPopup
    private closeLimitBalanceErrorPopup() {
        this.limitBalanceErrorPopup.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.isLimit = false;
        controllerScope.isBalance = false;
    }

    //used to open ExcessAmountErrorPopup
    private openExcessAmountErrorPopup() {
        let controllerScope = this.$scope;
        this.excessAmountErrorPopup = this.$modal.open({
            templateUrl: 'excessAmountErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used to close ExcessAmountErrorPopup
    private closeExcessAmountErrorPopup() {
        this.excessAmountErrorPopup.dismiss('cancel');
    }

    //used to reset the page
    private cancel() {
        this.$rootScope.cpoInfo = [];
        let x = this;
        x.$location.path("/CustomerPOWorkList/");
    }

    //used to fetch a customer purchase order by id
    private getCPO() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isCustomerListVisible = false;
        controllerRootScope.isCustomerDetailsVisible = true;
        controllerScope.cpoList = [];
        let cpoId = this.$routeParams.id;
        let promise = this.customerPOService.getCPO(cpoId);
        controllerScope.isEdit = true;
        controllerScope.isCustomerSearched = true;
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            controllerScope.isCPOFetched = true;
            controllerScope.customerPO = result;
            controllerScope.customerPO.PrevTotal = controllerScope.customerPO.Total;
            controllerScope.customerPO.CustomerProfile = result.Customer;
            if (controllerScope.customerPO.CustomerProfile.BalanceAmount > 0) {
                controllerScope.customerPO.CustomerProfile.BalanceAmt = controllerScope.customerPO.CustomerProfile.BalanceAmount - controllerScope.customerPO.CustomerProfile.TransactionAmount;
            }
            else if (controllerScope.customerPO.CustomerProfile.AmountLimit > 0) {
                controllerScope.customerPO.CustomerProfile.LimitAmt = controllerScope.customerPO.CustomerProfile.AmountLimit - controllerScope.customerPO.CustomerProfile.TransactionAmount;
            }
            for (let k = 0; k < stringConstants.priceCategoryList.length; k++) {
                if (controllerScope.customerPO.CustomerProfile.PriceCategory === stringConstants.priceCategoryList[k].Id) {
                    controllerScope.customerPO.CustomerProfile.PriceCategoryName = stringConstants.priceCategoryList[k].Name;
                }
            }
            for (let a = 0; a < result.CPOAdditionalCost.length; a++) {
                controllerScope.addtionalCostList.push({ Id: result.CPOAdditionalCost[a].AdditionalService.Id, Name: result.CPOAdditionalCost[a].AdditionalService.Name, Amount: result.CPOAdditionalCost[a].Amount });
            }
            controllerScope.customerInfo.membershipCode = result.Customer.MembershipCode;
            controllerScope.collectingBranch.BranchId = result.CollectingBranchId;
            controllerScope.totalQuantity = 0;
            controllerScope.totalCost = 0;
            if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
                this.getItemList();
            }
            else {
            }
        }).catch((error) => {
            if (error.status !== 400) {
                location.replace(this.apiPath);
            }
            controllerRootScope.isLoading = false;
        });;
    }


    private getActaulQuantity(itemId) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.itemList.length; i++) {
            if (controllerScope.itemList[i].Id === itemId) {
                return controllerScope.itemList[i].ActualQuantity;
            }
        }
    }



    //used to add item using Barcode
    private addItemByBarcode(Barcode) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.itemList.length === 0) {
            let branchId = 0;
            if (controllerScope.isEdit) {
                branchId = controllerScope.collectingBranch.BranchId;
            }
            else {
                branchId = controllerScope.collectingBranch.Branch.Id;
            }
            let promise = this.customerPOService.getItemList(controllerScope.customerPO.CustomerProfile.PriceCategory, branchId);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    if (result.length > 0) {
                        controllerScope.itemList = result;
                        controllerRootScope.isLoading = false;
                        this.addItem(Barcode);
                    }
                }
            }).catch((error) => {
                controllerRootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: "Sorry Some Error in Fetching Items"
                    });
            });;
        }
        else {

            controllerRootScope.isLoading = false;
            this.addItem(Barcode);
        }
    }

    //used to add item
    private addItem(Barcode) {
        let controllerScope = this.$scope;
        let found = 0;
        if (controllerScope.itemList.length !== 0) {
            for (let j = 0; j < controllerScope.cpoList.length; j++) {
                if (controllerScope.cpoList[j].Barcode === Barcode) {
                    controllerScope.isAddCPOItem = false;
                }
            }
            if (controllerScope.isAddCPOItem) {
                for (let i = 0; i < controllerScope.itemList.length; i++) {
                    if (controllerScope.itemList[i].Barcode === Barcode) {
                        controllerScope.cpoList.push(controllerScope.itemList[i]);
                        found = 1;
                    }
                }
            }
            else {
                this.openItemAddErrorPopup();
            }
            if (found === 0 && controllerScope.isAddCPOItem === true) {
                controllerScope.itemNotFound = true;
                this.openNotFoundErrorPopup();
            }
            controllerScope.customerPO.Barcode = "";
        }
        else {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.SorryNoItems
                });
        }
    }

    //used in customerpo for selecting customers
    private customerSelect(customer) {
        let controllerScope = this.$scope;
        controllerScope.isCustomerListVisible = false;
        if (customer.IsActive === false) {
            controllerScope.InActiveCustomer = true;
            this.openNotFoundErrorPopup();
        }
        else {
            controllerScope.customerPO.CustomerProfile = customer;
            if (controllerScope.customerPO.CustomerProfile.BalanceAmount > 0) {
                controllerScope.customerPO.CustomerProfile.BalanceAmt = controllerScope.customerPO.CustomerProfile.BalanceAmount - controllerScope.customerPO.CustomerProfile.TransactionAmount;
            }
            else if (controllerScope.customerPO.CustomerProfile.AmountLimit > 0) {
                controllerScope.customerPO.CustomerProfile.LimitAmt = controllerScope.customerPO.CustomerProfile.AmountLimit - controllerScope.customerPO.CustomerProfile.TransactionAmount;
            }
            else {
            }
            for (let k = 0; k < stringConstants.priceCategoryList.length; k++) {
                if (controllerScope.customerPO.CustomerProfile.PriceCategory === stringConstants.priceCategoryList[k].Id) {
                    controllerScope.customerPO.CustomerProfile.PriceCategoryName = stringConstants.priceCategoryList[k].Name;
                }
            }
            controllerScope.isCustomerSearched = true;
        }
    }

    //used to search items based on category
    //supplier profile search panel.
    private searchItem() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        let itemCollection = this.filterFilter((controllerScope.itemTotalCollection), controllerScope.category);
        controllerScope.totalCollection = [];
        /* change pagination with $scope.filtered */
        if (itemCollection === 0) {
            controllerScope.totalCollection = [];
        }
        else {
            let that = this;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = itemCollection.slice(begin, end);
            /* init pagination  */
            controllerScope.totalItems = itemCollection.length;
        }
        controllerScope.category = [];
    }

    // used for opening the DeleteItemPopup-jj
    private openDeleteItemPopup(item) {
        let controllerScope = this.$scope;
        this.deleteItemPopup = this.$modal.open({
            templateUrl: 'DeleteItemPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.Item = item;
    }

    //used for closing  the DeleteItemPopup-jj
    private closeDeleteItemPopup() {
        this.deleteItemPopup.dismiss('cancel');
    }

    // used for opening the DeleteAdditionalCostPopup-jj
    private openDeleteAdditionalCostPopup(id) {
        let controllerScope = this.$scope;
        this.deleteAdditionalCostPopup = this.$modal.open({
            templateUrl: 'DeleteAdditionalCostPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.AdditionalCostId = id;
    }

    //used for closing  the DeleteAdditionalCostPopup-jj
    private closeDeleteAdditionalCostPopup() {
        this.deleteAdditionalCostPopup.dismiss('cancel');
    }

    // used for opening the DeleteAdditionalCostPopup-jj
    private openDownPaymentBalanceErrorPopup() {
        let controllerScope = this.$scope;
        this.deleteAdditionalCostPopup = this.$modal.open({
            templateUrl: 'DownPaymentBalanceErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the DeleteAdditionalCostPopup-jj
    private closeDownPaymentBalanceErrorPopup() {
        this.deleteDownPaymentBalanceErrorPopup.dismiss('cancel');
    }

    //used to check whether item quantity is empty
    private checkItem() {
        let controllerScope = this.$scope;
        let count = 0;
        if (controllerScope.cpoList.length > 0) {
            for (let i = 0; i < controllerScope.cpoList.length; i++) {
                if (controllerScope.cpoList[i].Quantity === undefined || controllerScope.cpoList[i].Quantity === null || controllerScope.cpoList[i].Quantity <= 0 || controllerScope.cpoList[i].Quantity === "") {
                    count = 1;
                }
            }
            if (count === 0) {
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

    private excessAmtApprove() {
        let controllerScope = this.$scope;
        controllerScope.isExcessAmtApprove = true;
        this.closeExcessAmountErrorPopup();
    }

    //used to open SummaryCPOPopup -jj
    private openSummaryCPOPopup() {
        let controllerScope = this.$scope;
        this.summaryCPOPopup = this.$modal.open({
            templateUrl: 'SummaryCPOPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'lg'
        });
    }

    //used to close SummaryCPOPopup -jj
    private closeSummaryCPOPopup() {
        this.summaryCPOPopup.dismiss('cancel');
        let x = this;
        x.$location.path("/CustomerPOPayment/");
    }

    // used to get brand list - jj
    private getBrandList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.customerPOService.getBrandGroup(1);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.brandList.push({ BrandId: result[i].Id, BrandName: result[i].ValueEn });
            }
            this.getGroupList();
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });

    }

    // used to get group list - jj
    private getGroupList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.customerPOService.getBrandGroup(2);
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.groupList.push({ GroupId: result[i].Id, GroupName: result[i].ValueEn });
            }
            this.getItemList();
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }

    private roundToTow(value) {
        if (value !== null && value !== undefined) {
            return (Math.round((value + 0.00001) * 100) / 100);
        }
        return value;
    }
}

app.controller(CustomerPOController.controllerId, ['$scope', '$log', 'CustomerPOService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$modal', '$routeParams', 'printer', ($scope, $log, CustomerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams, printer) => {
    return new CustomerPOController($scope, $log, CustomerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams, printer);
}]);


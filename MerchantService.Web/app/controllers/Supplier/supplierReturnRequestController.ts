interface IsupplierReturnRequestControllerScope extends ng.IScope {
    supplierReturnRequest: Model.SupplierReturnRequest;
    getItemProfileList: Function;
    addItem: Function;
    getCategoryList: Function;
    getCauseList: Function;
    causeList: any;
    categoryList: any;
    getUnitList: Function;
    unitList: any;
    getSupplierList: Function;
    supplierList: any;
    pagination: Function;
    itemProfileCollection: any;
    subItemCollection: any;
    clear: Function;
    Item: any;
    getBranchList: Function;
    receiptDetails: any;
    noItemFound: string;
    isItemListEmpty: boolean;
    itemSearch: Function;
    isEmptyItemList: any;
    isItemListFetched: any;
    returnItemList: any;
    search: any;
    itemList: any;
    returnItem: any;
    selectedBranch: string;
    openSummaryCNPopup: Function;
    closeSummaryCNPopup: Function;
    printReceipt: Function;
    openItemAddRepeatPopup: Function;
    closeItemAddRepeatPopup: Function;
    openDeleteSRRItemPopup: Function;
    closeDeleteSRRItemPopup: Function;
    branchList: any;
    errorMessage: string;
    warning: string;
    saveReturnItem: Function;
    deleteConfirmation: string;
    deleteConfirmMessage: string;
    cancel: Function;
    getSubItemList: Function;
    deleteReturnItem: Function;
    updateReturnItemList: Function;
    srrExists: string;
    openAddSRRItemPopup: Function;
    closeAddSRRItemPopup: Function;
    check: Function;
    isItemDetailsVisible: boolean;
    changeQuantity: Function;
    getSupplierReturnRequest: Function;
    totalCollection: any;
    checkReturnQuantityValid: Function;
    totalItems: number;
    itemsPerPage: number;
    isEdit: boolean;
    itemTotalCollection: any;
    returnId: number;
    itemId: number;
    ValidReturnQuantity: any;
    validQuantityError: any;
}

interface IsupplierReturnRequestController {

}

class SupplierReturnRequestController implements IsupplierReturnRequestController {
    static controllerId = "SupplierReturnRequestController";
    public itemAddRepeat;
    public summaryCNPopup;
    public addSRRItemPopup;

    constructor(private $scope: IsupplierReturnRequestControllerScope, private $log: ng.ILocaleService, private supplierReturnRequestService: SupplierReturnRequestService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $modal, public $location, public $routeParams, public printer) {
        this.$scope.supplierReturnRequest = new Model.SupplierReturnRequest();
        this.$scope.getCategoryList = () => this.getCategoryList();
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.getItemProfileList = (branchId) => this.getItemProfileList(branchId);
        this.$scope.getUnitList = () => this.getUnitList();
        this.$scope.selectedBranch = "";
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.pagination = (currentpg) => this.pagination(currentpg);
        this.$scope.itemSearch = () => this.itemSearch();
        this.$scope.addItem = (id, supplierId, isParentItem) => this.addItem(id, supplierId, isParentItem);
        this.$scope.saveReturnItem = () => this.saveReturnItem();
        this.$scope.returnItemList = [];
        this.$scope.search = [];
        this.$scope.getSubItemList = (parentItemId, SupplierId) => this.getSubItemList(parentItemId, SupplierId);
        this.$scope.cancel = () => this.cancel();
        this.$scope.updateReturnItemList = () => this.updateReturnItemList();
        this.$scope.openAddSRRItemPopup = () => this.openAddSRRItemPopup();
        this.$scope.closeAddSRRItemPopup = () => this.closeAddSRRItemPopup();
        this.$scope.receiptDetails = [];
        this.$scope.itemList = [];
        this.$scope.branchList = [];
        this.$scope.openItemAddRepeatPopup = () => this.openItemAddRepeatPopup();
        this.$scope.closeItemAddRepeatPopup = () => this.closeItemAddRepeatPopup();
        this.$scope.openDeleteSRRItemPopup = (Item) => this.openDeleteSRRItemPopup(Item);
        this.$scope.closeDeleteSRRItemPopup = () => this.closeDeleteSRRItemPopup();
        this.$scope.getCauseList = () => this.getCauseList();
        this.$scope.deleteReturnItem = (item) => this.deleteReturnItem(item);
        this.$scope.check = () => this.check();
        this.$scope.causeList = [];
        this.$scope.returnItem = [];
        this.$scope.isItemListEmpty = false;
        this.$scope.isItemDetailsVisible = false;
        this.$scope.changeQuantity = (item) => this.changeQuantity(item);
        this.$scope.getSupplierReturnRequest = () => this.getSupplierReturnRequest();
        this.$scope.clear = () => this.clear();
        this.$scope.checkReturnQuantityValid = (quantity) => this.checkReturnQuantityValid(quantity);
        this.$scope.isEdit = false;
        this.$scope.openSummaryCNPopup = () => this.openSummaryCNPopup();
        this.$scope.closeSummaryCNPopup = () => this.closeSummaryCNPopup();
        this.$scope.printReceipt = (receiptDetails) => this.printReceipt(receiptDetails);
        this.$scope.supplierList = [];
        this.$scope.itemProfileCollection = [];
        this.$scope.subItemCollection = [];
        this.$scope.unitList = [];
        this.$scope.categoryList = [];
        this.$scope.isEmptyItemList = false;
        this.$scope.isItemListFetched = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.warning = stringConstants.warning;
        this.$scope.srrExists = stringConstants.srrExists;
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 3;
        this.$scope.returnId = 0;
        this.$scope.itemId = 0;
        this.$scope.ValidReturnQuantity = stringConstants.ValidReturnQuantity;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialize();
    }

    private initialize() {
        this.getBranchList();
        this.getSupplierList();
        this.getCauseList();
    }

    private pagination(currentpg) {
        let controllerScope = this.$scope;
        controllerScope.totalCollection = [];
        let begin = ((currentpg - 1) * controllerScope.itemsPerPage),
            end = begin + controllerScope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.itemProfileCollection.slice(begin, end);
        controllerScope.totalItems = controllerScope.itemProfileCollection.length;
    }

    //used to fetch BranchList - jj
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (this.$routeParams.id !== null && this.$routeParams.id !== "" && this.$routeParams.id !== undefined) {
            controllerScope.isEdit = true;
        }
        if (controllerRootScope.merchatSettings.IsAllowToAccessAllBranch || controllerScope.isEdit) {
            let promise = this.supplierReturnRequestService.getBranchList();
            promise.then((result) => {
                controllerScope.branchList = result;
                controllerRootScope.isLoading = false;
                if (this.$routeParams.id !== null && this.$routeParams.id !== "" && this.$routeParams.id !== undefined) {
                    this.getSupplierReturnRequest();
                }
            }).catch((error) => {
                controllerRootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.ErrorinFetchingBranch
                    });
            });
        }
        else {
            let promise = this.supplierReturnRequestService.getUserBranchName();
            promise.then((result) => {
                controllerScope.branchList = result;
                controllerRootScope.isLoading = false;
                if (result.branchName !== null && result.branchName !== undefined) {
                    controllerScope.selectedBranch = result.branchName;
                    controllerScope.supplierReturnRequest.BranchId = result.branchId;
                    this.getItemProfileList(controllerScope.supplierReturnRequest.BranchId);
                }

                if (this.$routeParams.id !== null && this.$routeParams.id !== "" && this.$routeParams.id !== undefined) {
                    this.getSupplierReturnRequest();
                }
            }).catch((error) => {
                controllerRootScope.isLoading = false;
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.ErrorinFetchingBranch
                    });
            });
        }
    }

    //this function used for get item profile list -jj
    private getItemProfileList(branchId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isItemDetailsVisible = false;
        if (this.$routeParams.id === null && this.$routeParams.id === "" && this.$routeParams.id === undefined) {
            controllerScope.returnItemList = [];
        }
        controllerScope.itemProfileCollection = [];
        controllerScope.subItemCollection = [];
        let itemProfileList = controllerScope.itemProfileCollection;
        let promise = this.supplierReturnRequestService.getItemProfileList(branchId);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.isItemDetailsVisible = true;
                    for (let i = 0; i < result.length; i++) {
                        itemProfileList.push(result[i]);
                    }
                    controllerScope.isItemListFetched = true;
                    controllerScope.isItemListEmpty = false;
                    controllerScope.itemProfileCollection = itemProfileList;
                    controllerScope.itemList = itemProfileList;
                    controllerRootScope.isLoading = false;
                }
                else {
                    controllerScope.isEmptyItemList = true;
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                controllerScope.isEmptyItemList = true;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingItems
                });
        });
    }


    //This function used for get sub item list. -An
    private getSubItemList(parentId, supplierId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        if (parentId !== 0 && parentId !== undefined && parentId !== null && supplierId !== 0 && supplierId !== undefined && supplierId !== null) {
            let parent = parseFloat((parentId.toString() + supplierId.toString()));
            controllerRootScope.isLoading = true;
            let getClass = angular.element("#" + parent).find('i.action-icon').hasClass('fa-plus');
            if (getClass === true) {//to check click on pluse or minus icon.
                angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
                angular.element("#subChild" + parent).removeClass('isHide').addClass('isShowRow');
                angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');
                angular.element("#" + parent).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
            }
            else {
                angular.element("#subChild" + parent).removeClass('isShowRow').addClass('isHide');
                angular.element("#" + parent).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
            }
        }
        controllerRootScope.isLoading = false;
    }

    //used to fetch list of return cause - jj
    private getCauseList() {
        let controllerScope = this.$scope;
        let promise = this.supplierReturnRequestService.getCauseList(35);
        promise.then((result) => {
            controllerScope.causeList = result;
            this.getCategoryList();
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingReturnCauseList
                });
        });
    }

    // used to fetch supplier list
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnRequestService.getSupplierList();
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

    //This function used for get category list.
    private getCategoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnRequestService.getCategoryList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
                controllerScope.unitList = [];
                this.getUnitList();
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    //used to get unit list 
    private getUnitList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnRequestService.getUnitList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
        });
    }

    //used to search item
    private itemSearch() {
        let controllerScope = this.$scope;
        let itemList = [];
        controllerScope.isItemDetailsVisible = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.itemProfileCollection = controllerScope.itemList;
        itemList = this.filterFilter(controllerScope.itemList, controllerScope.search);
        let parentIdList = [];
        for (let j = 0; j < itemList.length; j++) {
            parentIdList.push({ Id: itemList[j].ItemId });
        }
        let searchList = [];
        for (let i = 0; i < controllerScope.itemList.length; i++) {
            searchList.push(controllerScope.itemList[i]);
            let isParentSelected = false;
            for (let c = 0; c < parentIdList.length; c++) {
                if (controllerScope.itemList[i].ItemId === parentIdList[c].Id) {
                    isParentSelected = true;
                }
            }
            if (controllerScope.itemList[i].HasChildItem && !isParentSelected) {
                for (let j = 0; j < controllerScope.itemList[i].listOfChildProfileAC.length; j++) {
                    searchList.push(controllerScope.itemList[i].listOfChildProfileAC[j]);
                }
            }
        }
        itemList = [];
        itemList = this.filterFilter((searchList), controllerScope.search);
        if (itemList.length > 0) {
            controllerScope.isItemListEmpty = false;
        }
        else {
            controllerScope.isItemListEmpty = true;
        }
        controllerScope.itemProfileCollection = itemList;
        controllerScope.search = [];
    }

    //used to add selected item to the return item list - jj
    private addItem(id, supplierId, isParentItem) {
        let controllerScope = this.$scope;
        let isAllowed = 0;
        let IsSupplierAllowed = true;
        let section_pos = angular.element(".return-grid-section").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top }, 300);
        if (controllerScope.returnItemList.length === 0) {
            controllerScope.supplierReturnRequest.SupplierId = supplierId;
        }
        if (controllerScope.supplierReturnRequest.SupplierId === supplierId) {
            IsSupplierAllowed = true;
        }
        else {
            IsSupplierAllowed = false;
        }

        if (IsSupplierAllowed) {
            for (let j = 0; j < controllerScope.returnItemList.length; j++) {
                if (id === controllerScope.returnItemList[j].ItemId && supplierId === controllerScope.returnItemList[j].SupplierId) {
                    isAllowed = 1;
                }
            }
            if (isAllowed === 0) {
                for (let i = 0; i < controllerScope.itemProfileCollection.length; i++) {
                    if (isParentItem) {
                        if (id === controllerScope.itemProfileCollection[i].ItemId && supplierId === controllerScope.itemProfileCollection[i].SupplierId) {

                            if (controllerScope.itemProfileCollection[i].IsSupplierReturnRequestGenerated) {
                                controllerScope.returnItem = controllerScope.itemProfileCollection[i];
                                this.openAddSRRItemPopup();
                            }
                            else {
                                controllerScope.itemProfileCollection[i].OldRequestQuantity = 0;
                                controllerScope.returnItemList.push(controllerScope.itemProfileCollection[i]);
                                this.updateNewlyAddedItemQunatity(controllerScope.itemProfileCollection[i]);
                            }
                        }
                    }
                    else {
                        for (let c = 0; c < controllerScope.itemProfileCollection[i].listOfChildProfileAC.length; c++) {
                            if (id === controllerScope.itemProfileCollection[i].listOfChildProfileAC[c].ItemId && supplierId === controllerScope.itemProfileCollection[i].listOfChildProfileAC[c].SupplierId) {

                                if (controllerScope.itemProfileCollection[i].listOfChildProfileAC[c].IsSupplierReturnRequestGenerated) {
                                    controllerScope.returnItem = controllerScope.itemProfileCollection[i].listOfChildProfileAC[c];
                                    this.openAddSRRItemPopup();
                                }
                                else {
                                    controllerScope.itemProfileCollection[i].listOfChildProfileAC[c].OldRequestQuantity = 0;
                                    controllerScope.returnItemList.push(controllerScope.itemProfileCollection[i].listOfChildProfileAC[c]);
                                    this.updateNewlyAddedItemQunatity(controllerScope.itemProfileCollection[i].listOfChildProfileAC[c]);
                                }
                            }
                        }
                    }
                }
            }
            else {
                controllerScope.errorMessage = stringConstants.alreadyAddedtoReturnedList;
                this.openItemAddRepeatPopup();
            }
        }
        else {
            controllerScope.errorMessage = stringConstants.ReturnSameSupplierItem;
            this.openItemAddRepeatPopup();
        }
    }


    private updateReturnItemList() {
        let controllerScope = this.$scope;
        this.closeAddSRRItemPopup();
        controllerScope.returnItem.OldRequestQuantity = 0;
        controllerScope.returnItemList.push(controllerScope.returnItem);
        this.updateNewlyAddedItemQunatity(controllerScope.returnItem);
    }


    // used for opening the AddSRRItemPopup-jj
    private openAddSRRItemPopup() {
        let controllerScope = this.$scope;
        this.addSRRItemPopup = this.$modal.open({
            templateUrl: 'AddSRRItemPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the AddItemRepeatPopup-jj
    private closeAddSRRItemPopup() {
        this.addSRRItemPopup.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    }


    // used for opening the AddItemRepeatPopup-jj
    private openItemAddRepeatPopup() {
        let controllerScope = this.$scope;
        this.itemAddRepeat = this.$modal.open({
            templateUrl: 'AddItemRepeatPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the AddItemRepeatPopup-jj
    private closeItemAddRepeatPopup() {
        this.itemAddRepeat.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    }

    // used for opening the DeleteSRRItemPopup-jj
    private openDeleteSRRItemPopup(Item) {
        let controllerScope = this.$scope;
        this.itemAddRepeat = this.$modal.open({
            templateUrl: 'DeleteSRRItemPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.Item = Item;
    }

    //used for closing  the DeleteSRRItemPopup-jj
    private closeDeleteSRRItemPopup() {
        this.itemAddRepeat.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    }

    //used to save Return Request - jj
    private saveReturnItem() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let list = [];
        if (controllerScope.returnItemList.length !== 0) {
            for (let i = 0; i < controllerScope.returnItemList.length; i++) {
                list.push({
                    ItemId: controllerScope.returnItemList[i].ItemId,
                    ItemName: controllerScope.returnItemList[i].ItemNameEn,
                    CostPrice: controllerScope.returnItemList[i].CostPrice,
                    ReturnQuantity: controllerScope.returnItemList[i].ReturnQuantity,
                    ReturnCauseId: controllerScope.returnItemList[i].ReturnCauseId
                });
            }
            controllerScope.supplierReturnRequest.SupplierReturnItemAC = list;
            if (this.$routeParams.id !== null && this.$routeParams.id !== "" && this.$routeParams.id !== undefined) {
                let promise = this.supplierReturnRequestService.updateSupplierReturnRequest(controllerScope.supplierReturnRequest);
                promise.then((result) => {
                    if (result.status === "ok") {
                        this.ngToast.create(stringConstants.SRRUpdetedSuccessfully);
                        this.$location.path("/SupplierReturnRequestWorkList");
                    }
                    else if (result.status !== undefined && result.status !== null) {
                        if (result.status === stringConstants.alreadyActivityProcessed) {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.alreadyActivityDone
                                });
                        }
                        else {
                            controllerScope.errorMessage = result.status;
                            this.openItemAddRepeatPopup();
                        }
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.ErrorinUpdatingSRR
                            });
                    }
                    controllerRootScope.isLoading = false;
                }).catch((error) => {
                    controllerRootScope.isLoading = false;
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.ErrorinUpdatingSRR
                        });
                });
            }
            else {
                let promise = this.supplierReturnRequestService.saveSupplierReturnRequest(controllerScope.supplierReturnRequest);
                promise.then((result) => {
                    if (result.Status === "ok") {
                        this.ngToast.create(stringConstants.SRRSavedSucceessfully);
                        this.$location.path("/SupplierReturnRequestWorkList");
                    }
                    else if (result.Status === "print") {
                        this.ngToast.create(stringConstants.SRRCompletedSucceessfully);
                        let promise = this.supplierReturnRequestService.printReturnReceipt("", result.SupplierReturnId);
                        promise.then((result1) => {
                            controllerScope.receiptDetails = result1;
                            this.openSummaryCNPopup();
                        }).catch((error) => {
                            this.ngToast.create(
                                {
                                    className: 'danger',
                                    content: stringConstants.SRRReceiptGenerationFailed
                                });
                            controllerRootScope.isLoading = false;
                        });
                    }
                    else if (result.Status !== undefined && result.Status !== null) {
                        controllerScope.errorMessage = result.Status;
                        this.openItemAddRepeatPopup();
                    }
                    else {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.ErrorinSavingSRR
                            });
                    }
                    controllerRootScope.isLoading = false;
                }).catch((error) => {
                    controllerRootScope.isLoading = false;
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.ErrorinSavingSRR
                        });
                });
            }
        }
        else {
            controllerScope.errorMessage = stringConstants.AddReturnedItem;
            this.openItemAddRepeatPopup();
        }
    }

    // used for opening the SummaryCNPopup-jj
    private openSummaryCNPopup() {
        let controllerScope = this.$scope;
        this.summaryCNPopup = this.$modal.open({
            templateUrl: 'SummaryCN',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the SummaryCNPopup-jj
    private closeSummaryCNPopup() {
        this.summaryCNPopup.dismiss('cancel');
    }

    //used to redirect to worklist page - jj
    private cancel() {
        this.$location.path("/SupplierReturnRequestWorkList");
    }

    //used to print receipt - jj
    private printReceipt(receiptDetails) {
        receiptDetails.TotalQuantity = 0;
        receiptDetails.TotalCostPrice = 0;
        this.closeSummaryCNPopup();
        for (let i = 0; i < receiptDetails.SupplierReturnItemAC.length; i++) {
            receiptDetails.SupplierReturnItemAC[i].TotalCostPrice = (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice);
            receiptDetails.TotalQuantity = receiptDetails.TotalQuantity + parseFloat("" + receiptDetails.SupplierReturnItemAC[i].ReturnQuantity);
            receiptDetails.TotalCostPrice = receiptDetails.TotalCostPrice + parseFloat("" + (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice));
        }
        this.printer.print("/Templates/Supplier/SupplierReturnReceipt.html", receiptDetails);
        this.$location.path("/SupplierReturnRequestWorkList");
    }

    //used to delete items selected to be returned - jj
    private deleteReturnItem(item) {
        let controllerScope = this.$scope;
        let list = [];
        this.removeItemQunatity(item);
        for (let i = 0; i < controllerScope.returnItemList.length; i++) {
            if (item.Id === controllerScope.returnItemList[i].ItemId && item.SupplierId === controllerScope.returnItemList[i].SupplierId) {
                controllerScope.returnItemList[i].ReturnCauseId = "";
                controllerScope.returnItemList[i].ReturnQuantity = "";
            }
            else {
                list.push(controllerScope.returnItemList[i]);
                controllerScope.supplierReturnRequest.SupplierId = controllerScope.returnItemList[i].SupplierId;
            }
        }
        controllerScope.returnItemList = [];
        controllerScope.returnItemList = list;
        if (controllerScope.returnItemList.length === 0) {
            this.getItemProfileList(controllerScope.supplierReturnRequest.BranchId);
        }
        this.closeDeleteSRRItemPopup();
    }

    //used to check whether quantity of the returned item is added - jj
    private check() {
        let status = 0;
        let controllerScope = this.$scope;
        if (controllerScope.returnItemList.length === 0) {
            status = 1;
        }
        else {
            for (let i = 0; i < controllerScope.returnItemList.length; i++) {
                if (controllerScope.returnItemList[i].ReturnQuantity === undefined || controllerScope.returnItemList[i].ReturnQuantity === null || controllerScope.returnItemList[i].ReturnCauseId === undefined || controllerScope.returnItemList[i].ReturnCauseId === null) {
                    status = 1;
                }
                else {
                    if (controllerScope.returnItemList[i].ReturnQuantity > 0 && controllerScope.returnItemList[i].ReturnCauseId > 0) {

                    }
                    else {
                        status = 1;
                    }
                }
            }
        }
        if (status === 1) {
            return true;
        }
        else {
            return false;
        }
    }

    //used to check return quantity - jj
    private changeQuantity(item) {
        let controllerScope = this.$scope;
        let count = 0;
        if (!(this.checkReturnQuantityValid(item.ReturnQuantity))) {
            if (item.ActualQuantity < item.ReturnQuantity) {
                controllerScope.errorMessage = stringConstants.NotReturnMoreQauntity;
                item.ReturnQuantity = "";
                this.removeItemQunatity(item);
                this.openItemAddRepeatPopup();
            }
            else {
                if (item.ReturnQuantity === undefined || item.ReturnQuantity === null || item.ReturnQuantity === "" || item.ReturnQuantity <= 0) {
                    this.removeItemQunatity(item);
                }
                else {
                    this.updateItemQunatity(item);
                }
            }
        }
    }

    //used for fetching supplier return request - jj
    private getSupplierReturnRequest() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnRequestService.getSupplierReturnRequest(this.$routeParams.id);
        promise.then((result) => {
            controllerScope.supplierReturnRequest = result;
            controllerScope.returnItemList = controllerScope.supplierReturnRequest.SupplierReturnItemAC;
            for (let j = 0; j < controllerScope.returnItemList.length; j++) {
                this.updateItemQunatity(controllerScope.returnItemList[j]);
            }
            controllerScope.isItemDetailsVisible = true;
            controllerRootScope.isLoading = false;
            this.getItemProfileList(controllerScope.supplierReturnRequest.BranchId);
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingSRRList
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to clear all data - jj
    private clear() {
        let controllerScope = this.$scope;
        controllerScope.returnItemList = [];
    }

    //this function used for remove item quantity. - jj
    private removeItemQunatity(item) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let isParentItem = false;
        let parentItemQunatity = 0;
        let oldQuantity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.returnId = item.Id;
        }
        //condition for sub-item
        else {
            controllerScope.returnId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.returnItemList.length; i++) {
            if (controllerScope.returnItemList[i].Id === controllerScope.returnId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) { //check selcted item old request is exists or not ?
                    let itemCount = item.BaseUnit * item.OldRequestQuantity;
                    if (item.IsParentItem) {//cehck item is parent item or not.
                        controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity + itemCount;
                        controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                        parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                    //condition for sub-item
                    else {
                        controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity + itemCount;
                        parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                }
            }
        }
        if (isParentItem) {
            for (let j = 0; j < controllerScope.returnItemList.length; j++) {
                if (controllerScope.returnItemList[j].Id !== controllerScope.returnId) {
                    if (controllerScope.returnItemList[j].ParentItemId === controllerScope.returnId) {
                        if (controllerScope.returnItemList[j].Id === item.Id) {
                            controllerScope.returnItemList[j].OldRequestQuantity = item.ReturnQuantity;
                            controllerScope.returnItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.returnItemList[j].BaseUnit);
                        }
                        else {
                            controllerScope.returnItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.returnItemList[j].BaseUnit);
                        }
                        controllerScope.returnItemList[j].UpdateSystemQunatity = parentItemQunatity;
                    }
                }

            }
        }
        else {
            let updateItemQuantity = 0;
            for (let k = 0; k < controllerScope.returnItemList.length; k++) {
                if (controllerScope.returnItemList[k].Id === item.Id) {
                    //UpdateSystemQunatity
                    controllerScope.returnItemList[k].UpdateSystemQunatity = controllerScope.returnItemList[k].UpdateSystemQunatity + (item.OldRequestQuantity * item.BaseUnit);
                    updateItemQuantity = controllerScope.returnItemList[k].UpdateSystemQunatity;
                    oldQuantity = controllerScope.returnItemList[k].OldRequestQuantity;
                    controllerScope.returnItemList[k].OldRequestQuantity = item.ReturnQuantity;
                    break;
                }
            }
            if (oldQuantity !== 0 && oldQuantity !== undefined && oldQuantity !== null) {
                for (let p = 0; p < controllerScope.returnItemList.length; p++) {
                    if (controllerScope.returnItemList[p].ParentItemId === controllerScope.returnId) {
                        controllerScope.returnItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.returnItemList[p].BaseUnit);
                        controllerScope.returnItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }

    }


    //this function used for update item quanity.- jj
    private updateItemQunatity(item) {
        let controllerScope = this.$scope;
        let itemCount = item.BaseUnit * item.ReturnQuantity;
        let isParentItem = false;
        let parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.returnId = item.Id;
        }
        //condition for sub-item
        else {
            controllerScope.returnId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.returnItemList.length; i++) {
            if (controllerScope.returnItemList[i].Id === controllerScope.returnId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    if (item.OldRequestQuantity !== item.ReturnQuantity) {
                        if (item.OldRequestQuantity < item.ReturnQuantity) {
                            let requestDiff = item.ReturnQuantity - item.OldRequestQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity - itemCount;
                                controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                            //condition for sub-item
                            else {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity - itemCount;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                        else {
                            let requestDiff = item.OldRequestQuantity - item.ReturnQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity + itemCount;
                                controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                            //condition for sub-item
                            else {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity + itemCount;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    if (item.IsParentItem) {
                        controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity - itemCount;
                        parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                        controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                        isParentItem = true;
                        break;
                    }
                    //condition for sub-item
                    else {
                        controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity - itemCount;
                        parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.returnItemList.length; j++) {
                if (controllerScope.returnItemList[j].Id !== controllerScope.returnId) {
                    if (controllerScope.returnItemList[j].ParentItemId === controllerScope.returnId) {
                        if (controllerScope.returnItemList[j].Id === item.Id) {
                            controllerScope.returnItemList[j].OldRequestQuantity = item.ReturnQuantity;
                            controllerScope.returnItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.returnItemList[j].BaseUnit);
                        }
                        else {
                            controllerScope.returnItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.returnItemList[j].BaseUnit);
                        }
                    }
                }

            }
        }
        else {
            if (item.OldRequestQuantity !== item.ReturnQuantity) {
                let updateItemQuantity = 0;
                for (let k = 0; k < controllerScope.returnItemList.length; k++) {
                    if (controllerScope.returnItemList[k].ParentItemId === controllerScope.returnId) {
                        //UpdateSystemQunatity
                        if (controllerScope.returnItemList[k].Id !== item.ParentItemId) {
                            if (controllerScope.returnItemList[k].Id === item.Id) {
                                controllerScope.returnItemList[k].UpdateSystemQunatity = controllerScope.returnItemList[k].UpdateSystemQunatity - (item.ReturnQuantity * item.BaseUnit);
                                updateItemQuantity = controllerScope.returnItemList[k].UpdateSystemQunatity;
                                controllerScope.returnItemList[k].OldRequestQuantity = item.ReturnQuantity;
                                break;
                            }
                        }
                    }
                }
                for (let p = 0; p < controllerScope.returnItemList.length; p++) {
                    if (controllerScope.returnItemList[p].ParentItemId === controllerScope.returnId) {
                        controllerScope.returnItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.returnItemList[p].BaseUnit);
                        controllerScope.returnItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }
    }


    // this function used for update item quantity when add new main and sub item.- jj
    private updateNewlyAddedItemQunatity(item) {
        let controllerScope = this.$scope;
        let isParentItem = false;
        let parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        //condition for sub-item
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.returnItemList.length; i++) {
            if (controllerScope.returnItemList[i].ParentItemId === controllerScope.returnId) {
                if (!item.IsParentItem) {
                    if (controllerScope.returnItemList[i].Id === controllerScope.returnId) {
                        parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                }
            }
        }
        if (isParentItem) {
            for (let j = 0; j < controllerScope.returnItemList.length; j++) {
                if (controllerScope.returnItemList[j].Id === item.Id) {
                    controllerScope.returnItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.returnItemList[j].BaseUnit);
                }
            }
        }
        else {
            let updateItemQunatity = 0;
            let itemExist = false;
            for (let k = 0; k < controllerScope.returnItemList.length; k++) {
                if (controllerScope.returnItemList[k].ParentItemId === controllerScope.returnId) {
                    if (controllerScope.returnItemList[k].Id !== item.Id) {
                        updateItemQunatity = controllerScope.returnItemList[k].UpdateSystemQunatity;
                        itemExist = true;
                        break;
                    }
                }
            }
            for (let p = 0; p < controllerScope.returnItemList.length; p++) {
                if (controllerScope.returnItemList[p].Id === item.Id) {
                    if (itemExist) {
                        controllerScope.returnItemList[p].SystemQuantity = Math.floor(updateItemQunatity / controllerScope.returnItemList[p].BaseUnit);
                        controllerScope.returnItemList[p].UpdateSystemQunatity = updateItemQunatity;
                    }
                }
            }
        }
    }

    private checkReturnQuantityValid(quantity) {
        let controllerScope: any = this.$scope;
        if (quantity !== "" && quantity !== undefined && quantity !== null) {
            if (isNaN(quantity)) {
                return true;
            }
            else {
                if (Math.round(quantity) === parseInt(quantity, 10)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }
}

app.controller(SupplierReturnRequestController.controllerId, ['$scope', '$log', 'SupplierReturnRequestService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', '$routeParams', 'printer', ($scope, $log, SupplierReturnRequestService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, $routeParams, printer) => {
    return new SupplierReturnRequestController($scope, $log, SupplierReturnRequestService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, $routeParams, printer);
}]);


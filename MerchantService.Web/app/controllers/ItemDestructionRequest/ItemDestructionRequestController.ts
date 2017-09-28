interface IItemDestructionRequestControllerScope extends ng.IScope {
    unitList: any;
    categoryList: any;
    search: any;
    supplierList: any;
    totalCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    itemSupplierCollection: any;
    totalItemSupplierList: any;
    totalItems: number;
    errorMessageDisplayForBlankList: boolean;
    getSubItemList: Function;
    openItemListPopup: Function;
    cancelButtonForItemPopup: Function;
    viewItemDetail: Function;
    searchButton: Function;
    destructioCasueList: any;
    branchList: any;
    destructionItemList: any;
    errorMessageForNotAddedDestructionItem: boolean;
    deletedestructionItem: Function;
    closeItemAddErrorPopup: Function;
    closeDeleteItemPopup: Function;
    deleteDestructionItem: Function;
    itemId: number;
    initiatedList: any;
    submitButton: Function;
    clickCancelButton: Function;
    ItemDestructionRequestModel: Model.ItemDestructionRequestModel;
    ItemDestructionSearchModel: Model.ItemDestructionSearchModel;
    destructionCauseRequired: string;
    branchNameRequired: string;
    initiatedRequired: string;
    compareSystemQuantityWithIndex: Function;
    isSubmit: boolean;
    updateButton: Function;
    isRequestDetail: boolean;
    isDestructionQuantityRequired: boolean;
    DestructionQuantityRequired: string;
    branchChangeEvent: Function;
    selectAll: Function;
    selectedAll: any;
    viewItemList: Function;
    supplierPopupOk: Function;
    isSameSupplierInList: boolean;
    closeAlreadyExistsItemDestructionPopup: Function;
    closeSupplierExpireReturnAcceptPopup: Function;
    clickOnYesButtonForItemDestruction: Function;
    itemNameList; string;
    closeCreditNotePopup: Function;
    clickOnOkButton: Function;
    itemDestructionReceiptDetail: any;
    supplierName: string;
    creditNoteNumber: string;
    amount: number;
    tempSearch: any;
    filterList: any;
    destructionItemId: number;
    checkValidDestructionQuantity: Function;
    isDataLoading: boolean;
    isFirstClick: boolean;
    noItemFound: any;
    validDestructionQuantity: any;
    itemAddedToRIMessage: any;
    deleteConfirmation: any;
    deleteConfirmMessage: any;
    ItemDestructed: any;
    notAcceptExpiredItem: any;
    DestructionExists: any;
    itemDestructionReceipt: any;
}

interface IItemDestructionRequestController {

}

class ItemDestructionRequestController implements IItemDestructionRequestController {
    static controllerId = "ItemDestructionRequestController";
    public itemListPopup;
    public deletePopup;
    public itemAddErrorPopup;
    public itemDestructionSameSupplierPopup;
    public alreadyExistsItemDestructionPopup;
    public supplierExpireReturnAcceptPopup;
    public popupCreditNote;
    constructor(private $scope: IItemDestructionRequestControllerScope, private $log: ng.ILogService, public $rootScope, private ItemDestructionService: ItemDestructionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal, public printer) {
        this.$scope.unitList = [];
        this.$scope.filterList = [];
        this.$scope.itemNameList = "";
        this.$scope.ItemDestructionSearchModel = new Model.ItemDestructionSearchModel();
        this.$scope.isRequestDetail = false;
        this.$scope.isDestructionQuantityRequired = false;
        this.$scope.DestructionQuantityRequired = stringConstants.DestructionQuantityRequired;
        this.$scope.destructionCauseRequired = stringConstants.destructionCauseRequired;
        this.$scope.branchNameRequired = stringConstants.branchNameRequired;
        this.$scope.initiatedRequired = stringConstants.initiatedRequired;
        this.$scope.categoryList = [];
        this.$scope.itemId = 0;
        this.$scope.destructionItemId = 0;
        this.$scope.search = [];
        this.$scope.tempSearch = [];
        this.$scope.supplierList = [];
        this.$scope.totalItemSupplierList = [];
        this.$scope.closeItemAddErrorPopup = () => this.closeItemAddErrorPopup();
        this.$scope.destructionItemList = [];
        this.$scope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
        this.$scope.itemsPerPage = 5;
        this.$scope.isSameSupplierInList = true;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.getSubItemList = (parentId, supplierId) => this.getSubItemList(parentId, supplierId);
        this.$scope.openItemListPopup = () => this.openItemListPopup();
        this.$scope.cancelButtonForItemPopup = () => this.cancelButtonForItemPopup();
        this.$scope.viewItemDetail = (item) => this.viewItemDetail(item);
        this.$scope.searchButton = () => this.searchButton();
        this.$scope.deletedestructionItem = (id) => this.deletedestructionItem(id);
        this.$scope.closeDeleteItemPopup = () => this.closeDeleteItemPopup();
        this.$scope.branchList = [];
        this.$scope.errorMessageForNotAddedDestructionItem = true;
        this.$scope.deleteDestructionItem = () => this.deleteDestructionItem();
        this.$scope.compareSystemQuantityWithIndex = (systemQuantity, destructionQuantity, index) => this.compareSystemQuantityWithIndex(systemQuantity, destructionQuantity, index);
        this.$scope.submitButton = () => this.submitButton();
        this.$scope.clickCancelButton = () => this.clickCancelButton();
        this.$scope.updateButton = () => this.updateButton();
        this.$scope.isSubmit = true;
        this.$scope.branchChangeEvent = (branchId) => this.branchChangeEvent(branchId);
        this.$scope.selectAll = () => this.selectAll();
        this.$scope.viewItemList = () => this.viewItemList();
        this.$scope.supplierPopupOk = () => this.supplierPopupOk();
        this.$scope.closeAlreadyExistsItemDestructionPopup = () => this.closeAlreadyExistsItemDestructionPopup();
        this.$scope.closeSupplierExpireReturnAcceptPopup = () => this.closeSupplierExpireReturnAcceptPopup();
        this.$scope.clickOnYesButtonForItemDestruction = () => this.clickOnYesButtonForItemDestruction();
        this.$scope.closeCreditNotePopup = () => this.closeCreditNotePopup();
        this.$scope.clickOnOkButton = () => this.clickOnOkButton();
        this.$scope.itemDestructionReceiptDetail = [];
        this.$scope.isFirstClick = true;
        this.$scope.isDataLoading = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validDestructionQuantity = stringConstants.validDestructionQuantity;
        this.$scope.itemAddedToRIMessage = stringConstants.itemAddedToRIMessage;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.ItemDestructed = stringConstants.ItemDestructed;
        this.$scope.notAcceptExpiredItem = stringConstants.notAcceptExpiredItem;
        this.$scope.DestructionExists = stringConstants.DestructionExists;
        this.$scope.itemDestructionReceipt = stringConstants.itemDestructionReceipt;
        this.$scope.destructioCasueList = stringConstants.destructioCasueList;
        this.initialization();

        this.$scope.initiatedList = stringConstants.initiatedList;

        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.itemSupplierCollection.slice(begin, end);
        });
    }


    private initialization() {
        this.getUnitTypeList();
        this.getCategoryList();
        this.getBranchList();
        this.getSupplierList();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getItemDestructionRequestDetailById(this.$routeParams.id);
            this.$scope.isSubmit = false;
        }
    }

    private clickOnOkButton() {
        this.$location.path("/ItemDestructionWorkList");
        this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", this.$scope.itemDestructionReceiptDetail);
        this.popupCreditNote.dismiss('cancel');
    }

    private supplierPopupOk() {
        this.itemDestructionSameSupplierPopup.dismiss('cancel');
    }

    private closeAlreadyExistsItemDestructionPopup() {
        this.alreadyExistsItemDestructionPopup.dismiss('cancel');
    }

    private closeSupplierExpireReturnAcceptPopup() {
        this.supplierExpireReturnAcceptPopup.dismiss('cancel');
    }

    private closeCreditNotePopup() {
        this.popupCreditNote.dismiss('cancel');
    }

    private clickOnYesButtonForItemDestruction() {
        this.$scope.isDataLoading = true;
        this.alreadyExistsItemDestructionPopup.dismiss('cancel');
        let promise = this.ItemDestructionService.SubmitDestructionItemRequest(this.$scope.ItemDestructionRequestModel);
        promise.then((result) => {
            if (result._isResult.IsResult === "true") {
                if (result._isResult.SupplierName !== undefined && result._isResult.CreditNoteNumber !== undefined && result._isResult.Amount !== undefined &&
                    result._isResult.SupplierName !== null && result._isResult.CreditNoteNumber !== null && result._isResult.Amount !== null) {
                    this.$scope.supplierName = result._isResult.SupplierName;
                    this.$scope.creditNoteNumber = result._isResult.CreditNoteNumber;
                    this.$scope.amount = result._isResult.Amount;
                    this.$scope.itemDestructionReceiptDetail = result._isResult;
                    this.creditNotePopup();
                }
                else {
                    this.$location.path("/ItemDestructionWorkList");
                    this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", result._isResult);
                }
            }
            else if (result._isResult.IsResult === "NotExists") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result._isResult.IsResult === "false") {
                this.ngToast.create(stringConstants.itemDestructionRequestSucessfully);
                this.$location.path("/ItemDestructionWorkList");
            }
            this.$scope.isDataLoading = false;
        }).catch((error) => {
            this.$scope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private clickCancelButton() {
        this.$scope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel;
        this.searchButton();
        this.$scope.isRequestDetail = false;
        this.$scope.destructionItemList = [];
        this.$scope.isDestructionQuantityRequired = false;
    }

    private viewItemList() {
        let section_pos = angular.element(".request-section").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top - 200 }, 300);
        this.$scope.isRequestDetail = true;
        this.$scope.errorMessageForNotAddedDestructionItem = false;
    }

    private selectAll() {
        this.$scope.destructionItemList = [];
        if (this.$scope.totalItemSupplierList.length > 0) {
            if (this.$scope.selectedAll) {//to checked all
                for (let i = 0; i < this.$scope.totalItemSupplierList.length; i++) {
                    if (this.$scope.totalItemSupplierList[i].SystemQuantity > 0) {
                        this.$scope.totalItemSupplierList[i].Checked = true;
                        this.$scope.destructionItemList.push(this.$scope.totalItemSupplierList[i]);
                    }
                    if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== undefined) {
                        for (let j = 0; j < this.$scope.totalItemSupplierList[i].listOfChildProfileAC.length; j++) {
                            if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].SystemQuantity > 0) {
                                this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].Checked = true;
                                this.$scope.destructionItemList.push(this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j]);
                            }
                        }
                    }
                }
            }
            else {   //to un checked all
                for (let i = 0; i < this.$scope.totalItemSupplierList.length; i++) {
                    this.$scope.totalItemSupplierList[i].Checked = false;
                    this.$scope.destructionItemList.splice(i, 1);
                    if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== undefined) {
                        for (let j = 0; j < this.$scope.totalItemSupplierList[i].listOfChildProfileAC.length; j++) {
                            this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].Checked = false;
                            this.$scope.destructionItemList.splice(j, 1);
                        }
                    }
                }
                if (this.$scope.destructionItemList.length <= 0) {
                    let controllerScope: any = this.$scope;
                    controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
                    controllerScope.itemDestructionRequest.$setPristine();
                    controllerScope.itemDestructionRequest.$setValidity();
                    controllerScope.itemDestructionRequest.$setUntouched();
                    this.$scope.isRequestDetail = false;
                }
            }
        }
    }

    private branchChangeEvent(branchId) {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel;
        controllerScope.destructionItemList = [];
        this.$scope.isRequestDetail = false;
        controllerScope.isDestructionQuantityRequired = false;
        controllerScope.itemSupplierCollection = [];
        let itemSupplierList = controllerScope.itemSupplierCollection;
        let promise = this.ItemDestructionService.getSupplierItemListByBranchId(branchId);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                this.$scope.ItemDestructionRequestModel.branchId = result.BranchId;
                if (result.listOfItemProfileAC.length > 0) {
                    for (let i = 0; i < result.listOfItemProfileAC.length; i++) {
                        itemSupplierList.push(result.listOfItemProfileAC[i]);
                    }
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = itemSupplierList.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.itemSupplierCollection.length;
                    controllerScope.totalItemSupplierList = controllerScope.itemSupplierCollection;
                }
                else {
                    this.$scope.errorMessageDisplayForBlankList = true;
                }
            }
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private closeDeleteItemPopup() {
        this.deletePopup.dismiss('cancel');
    }

    private getItemDestructionRequestDetailById(id) {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        this.$scope.errorMessageForNotAddedDestructionItem = true;
        this.$scope.isRequestDetail = true;
        //To get branch list
        let promise = this.ItemDestructionService.getItemDestructionRequestById(id);
        promise.then((result) => {
            if (result._isResult !== false) {
                this.$scope.ItemDestructionRequestModel.intiatedId = result._isResult.intiatedId;
                this.$scope.ItemDestructionRequestModel.branchId = result._isResult.branchId;
                this.$scope.ItemDestructionRequestModel.destructioCasueId = result._isResult.destructioCasueId;
                this.$scope.errorMessageForNotAddedDestructionItem = false;
                if (result._isResult.listOfItemProfileAC.length > 0) {
                    for (let i = 0; i < result._isResult.listOfItemProfileAC.length; i++) {
                        this.$scope.destructionItemList.push(result._isResult.listOfItemProfileAC[i]);
                    }
                    this.BindItemDestruction(this.$scope.destructionItemList);
                }
            }
            else {
                controllerScope.isDataLoading = false;
            }

        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });

    }

    private BindItemDestruction(destructionList) {
        if (destructionList.length > 0) {
            for (let i = 0; i < destructionList.length; i++) {
                if (this.$scope.totalItemSupplierList.length > 0) {
                    for (let j = 0; j < this.$scope.totalItemSupplierList.length; j++) {
                        if (destructionList[i].Id === this.$scope.totalItemSupplierList[j].Id) {
                            this.$scope.totalItemSupplierList[j].Checked = true;
                        }
                        if (this.$scope.totalItemSupplierList[j].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[j].listOfChildProfileAC !== undefined) {
                            for (let k = 0; k < this.$scope.totalItemSupplierList[j].listOfChildProfileAC.length; k++) {
                                if (destructionList[i].Id === this.$scope.totalItemSupplierList[j].listOfChildProfileAC[k].Id)
                                    this.$scope.totalItemSupplierList[j].listOfChildProfileAC[k].Checked = true;
                            }
                        }
                    }
                }
                this.updateItemQunatity(this.$scope.destructionItemList[i]);
            }
        }
        this.$scope.isDataLoading = false;
    }

    //this funciton usedvi for cancel button for item popup. - An
    private viewItemDetail(item) {
        let isAlreadyExistsItem = false;
        let isNotSameSupplier = false;
        if (item !== undefined && item !== null) {
            if (item.Checked === true) {
                for (let j = 0; j < this.$scope.destructionItemList.length; j++) {
                    if (this.$scope.destructionItemList[j].SupplierId !== item.SupplierId) {
                        isNotSameSupplier = true;
                    }
                    else if (this.$scope.destructionItemList[j].Id === item.Id) {
                        isAlreadyExistsItem = true;
                    }
                }
                if (!isAlreadyExistsItem && !isNotSameSupplier) {
                    this.$scope.destructionItemList.push(item);
                    this.$scope.destructionItemId = 0;
                    this.updateNewlyAddedItemQunatity(item);
                    this.$scope.errorMessageForNotAddedDestructionItem = false;
                }
                else {
                    item.Checked = false;
                    if (isNotSameSupplier) {
                        this.itemDestructionSameSupplierPopup = this.$modal.open({
                            templateUrl: 'supplierAlreadyExists',
                            backdrop: 'static',
                            keyboard: true,
                            size: 'sm',
                            scope: this.$scope,
                        });
                    }
                    else if (isAlreadyExistsItem) {
                        this.openItemAddErrorPopup();
                    }
                }
            }
            else {
                for (let i = 0; i < this.$scope.destructionItemList.length; i++) {
                    if (this.$scope.destructionItemList[i].Id === item.Id) {
                        this.$scope.destructionItemList[i].DestructionQuantity = 0;
                        this.removeItemQunatity(this.$scope.destructionItemList[i]);
                        this.$scope.destructionItemList.splice(i, 1);
                    }
                }
            }
        }
        if (this.$scope.destructionItemList.length <= 0) {
            let controllerScope: any = this.$scope;
            controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
            controllerScope.itemDestructionRequest.$setPristine();
            controllerScope.itemDestructionRequest.$setValidity();
            controllerScope.itemDestructionRequest.$setUntouched();
            this.$scope.destructionItemList = [];
            this.$scope.isRequestDetail = false;
            this.$scope.selectedAll = false;
            this.searchButton();
        }
    }

    private closeItemAddErrorPopup() {
        this.itemAddErrorPopup.dismiss('cancel');
    }

    private submitButton() {
        this.$scope.isDataLoading = true;
        if (this.$scope.isFirstClick) {
            let isValid = true;
            if (this.$scope.destructionItemList.length > 0) {
                isValid = this.CheckIfSupplierAcceptsReturnForExpireItems(this.$scope.destructionItemList[0].SupplierId);
                if (!isValid) {
                    this.$scope.isDataLoading = false;
                    return;
                }
            }
            this.$scope.isFirstClick = false;
            isValid = true;
            let isDestructionQuantityValid = true;
            this.$scope.isDestructionQuantityRequired = false;
            for (let i = 0; i < this.$scope.destructionItemList.length; i++) {
                if (this.$scope.destructionItemList[i].DestructionQuantity <= 0 ||
                    this.$scope.destructionItemList[i].DestructionQuantity === "")
                    isValid = false;
                else if (this.$scope.destructionItemList[i].ActualQuantity < this.$scope.destructionItemList[i].DestructionQuantity)
                    isDestructionQuantityValid = false;
            }
            if (isValid) {
                if (isDestructionQuantityValid) {
                    this.$scope.ItemDestructionRequestModel.listOfItemProfileAC = this.$scope.destructionItemList;
                    let promise = this.ItemDestructionService.checkItemAlreadyDestructed(this.$scope.ItemDestructionRequestModel);
                    promise.then((result) => {
                        if (result._isResult === true) {
                            let promise = this.ItemDestructionService.SubmitDestructionItemRequest(this.$scope.ItemDestructionRequestModel);
                            promise.then((result) => {
                                if (result._isResult !== null && result._isResult !== undefined) {
                                    if (result._isResult.IsResult === "true") {
                                        if (result._isResult.SupplierName !== undefined && result._isResult.CreditNoteNumber !== undefined && result._isResult.Amount !== undefined &&
                                            result._isResult.SupplierName !== null && result._isResult.CreditNoteNumber !== null && result._isResult.Amount !== null) {
                                            this.$scope.supplierName = result._isResult.SupplierName;
                                            this.$scope.creditNoteNumber = result._isResult.CreditNoteNumber;
                                            this.$scope.amount = result._isResult.Amount;
                                            this.$scope.itemDestructionReceiptDetail = result._isResult;
                                            this.creditNotePopup();
                                        }
                                        else {
                                            this.$location.path("/ItemDestructionWorkList");
                                            this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", result._isResult);
                                        }
                                    }
                                    else if (result._isResult.IsResult === "NotExists") {
                                        this.ngToast.create({
                                            className: 'danger',
                                            content: stringConstants.workFlowNotCreated
                                        });
                                    }
                                    else if (result._isResult.IsResult === "false") {
                                        this.ngToast.create(stringConstants.itemDestructionRequestSucessfully);
                                        this.$location.path("/ItemDestructionWorkList");
                                    }
                                }
                                this.$scope.isFirstClick = true;
                                this.$scope.isDataLoading = false;
                            }).catch((error) => {
                                this.$scope.isDataLoading = false;
                                this.$log.log(error);
                                if (error.status !== 500) {
                                    //if user is not authenticated that time it will redirect to the login page.
                                    location.replace(this.apiPath);
                                }
                            });
                        }
                        else {
                            this.$scope.itemNameList = result._isResult;
                            this.OpenPoupForAlreadyItemDesturcionExists();
                            this.$scope.isDataLoading = false;
                            this.$scope.isFirstClick = true;
                        }
                    }).catch((error) => {
                        this.$scope.isDataLoading = false;
                        this.$log.log(error);
                        if (error.status !== 500) {
                            //if user is not authenticated that time it will redirect to the login page.
                            location.replace(this.apiPath);
                        }
                    });
                }
            }
            else {
                this.$scope.isFirstClick = true;
                this.$scope.isDestructionQuantityRequired = true;
            }
            this.$scope.isDataLoading = false;
        }
    }

    //Open the credit not popup
    private creditNotePopup() {
        this.popupCreditNote = this.$modal.open({
            templateUrl: 'popupCreditNoteDetail',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    }

    private OpenPoupForAlreadyItemDesturcionExists() {
        this.alreadyExistsItemDestructionPopup = this.$modal.open({
            templateUrl: 'alreadyExistsItemDestruciton',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    }

    private CheckIfSupplierAcceptsReturnForExpireItems(id) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === id) {
                let supplier = controllerScope.supplierList[i];
                if (supplier.IsAcceptReturnForExpiredItem === false) {
                    if (this.$scope.ItemDestructionRequestModel.destructioCasueId === 75 &&
                        this.$scope.ItemDestructionRequestModel.intiatedId === 1) {
                        this.supplierExpireReturnAcceptPopup = this.$modal.open({
                            templateUrl: 'supplierExpireReturnAcceptPopup',
                            backdrop: 'static',
                            keyboard: true,
                            size: 'sm',
                            scope: this.$scope,
                        });
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private updateButton() {
        this.$scope.isDataLoading = true;
        let isDestructionQuantityValid = true;
        this.$scope.isDestructionQuantityRequired = false;
        let isValid = true;
        if (this.$scope.destructionItemList.length > 0) {
            isValid = this.CheckIfSupplierAcceptsReturnForExpireItems(this.$scope.destructionItemList[0].SupplierId);
            if (!isValid) {
                this.$scope.isDataLoading = false;
                return;
            }
        }
        for (let i = 0; i < this.$scope.destructionItemList.length; i++) {
            if (this.$scope.destructionItemList[i].DestructionQuantity <= 0 || this.$scope.destructionItemList[i].DestructionQuantity === "")
                isValid = false;
            else if (this.$scope.destructionItemList[i].SystemQuantity < this.$scope.destructionItemList[i].DestructionQuantity)
                isDestructionQuantityValid = false;
        }
        if (isValid) {
            if (isDestructionQuantityValid) {
                this.$scope.ItemDestructionRequestModel.listOfItemProfileAC = this.$scope.destructionItemList;
                this.$scope.ItemDestructionRequestModel.destructionId = this.$routeParams.id;
                let promise = this.ItemDestructionService.UpdateDestructionItemRequest(this.$scope.ItemDestructionRequestModel);
                promise.then((result) => {
                    if (result._isResult === true) {
                        this.ngToast.create(stringConstants.itemDestructionRequestUpdateSucessfully);
                        this.$location.path("/ItemDestructionWorkList");
                    }
                    else if (result._isResult === "NotExists") {
                        this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.workFlowNotCreated
                        });
                    }
                    else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                    }
                    else if (result._isResult === false) {
                    }
                }).catch((error) => {
                    this.$scope.isDataLoading = false;
                    this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(this.apiPath);
                    }
                });
            }
        }
        else {
            this.$scope.isDestructionQuantityRequired = true;
        }
        this.$scope.isDataLoading = false;
    }

    private compareSystemQuantityWithIndex(systemQuantity, item, index) {

        if (item.DestructionQuantity === "" || isNaN(parseInt(item.DestructionQuantity)) || item.DestructionQuantity.indexOf('.') !== -1 || parseInt(item.DestructionQuantity) < 0)
            item.DestructionQuantity = 0;

        if (parseFloat(item.ActualQuantity) >= parseFloat(item.DestructionQuantity)) {
            item.DestructionQuantity = parseInt(item.DestructionQuantity);
            if (item.DestructionQuantity === "" || item.DestructionQuantity === null || item.DestructionQuantity === 0) {
                item.DestructionQuantity = 0;
                this.removeItemQunatity(item);
            }
            else
                this.updateItemQunatity(item);
            item.isShowDestructionQuantity = false;
        }
        else {
            if (item.DestructionQuantity !== "")
                item.isShowDestructionQuantity = true;
            else
                item.isShowDestructionQuantity = false;
        }
    }

    //this function used for remove item quantity.
    private removeItemQunatity(item) {
        let controllerScope = this.$scope;
        let isParentItem = false;
        let parentItemQunatity = 0;
        let oldQuantity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.destructionItemId = item.Id;
        }
        //condition for sub-item
        else {
            controllerScope.destructionItemId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.destructionItemList.length; i++) {
            if (controllerScope.destructionItemList[i].Id === controllerScope.destructionItemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) { //check selcted item old request is exists or not ?
                    let itemCount = item.BaseUnit * item.OldRequestQuantity;
                    if (item.IsParentItem) {//cehck item is parent item or not.
                        controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity + itemCount;
                        controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                        parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                    //condition for sub-item
                    else {
                        controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity + itemCount;
                        parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.destructionItemList.length; j++) {
                if (controllerScope.destructionItemList[j].Id !== controllerScope.destructionItemId) {
                    if (controllerScope.destructionItemList[j].ParentItemId === controllerScope.destructionItemId) {
                        if (controllerScope.destructionItemList[j].Id === item.Id) {
                            controllerScope.destructionItemList[j].OldRequestQuantity = item.DestructionQuantity;
                            controllerScope.destructionItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.destructionItemList[j].BaseUnit);
                        }
                        else {
                            controllerScope.destructionItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.destructionItemList[j].BaseUnit);
                        }
                        controllerScope.destructionItemList[j].UpdateSystemQunatity = parentItemQunatity;
                    }
                }
            }
        }
        else {
            let updateItemQuantity = 0;
            for (let k = 0; k < controllerScope.destructionItemList.length; k++) {
                if (controllerScope.destructionItemList[k].Id === item.Id) {
                    //UpdateSystemQunatity
                    controllerScope.destructionItemList[k].UpdateSystemQunatity = controllerScope.destructionItemList[k].UpdateSystemQunatity + (item.OldRequestQuantity * item.BaseUnit);
                    updateItemQuantity = controllerScope.destructionItemList[k].UpdateSystemQunatity;
                    oldQuantity = controllerScope.destructionItemList[k].OldRequestQuantity;
                    controllerScope.destructionItemList[k].OldRequestQuantity = item.DestructionQuantity;
                    break;
                }
            }
            if (oldQuantity !== 0 && oldQuantity !== undefined && oldQuantity !== null) {
                for (let p = 0; p < controllerScope.destructionItemList.length; p++) {
                    if (controllerScope.destructionItemList[p].ParentItemId === controllerScope.destructionItemId) {
                        controllerScope.destructionItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.destructionItemList[p].BaseUnit);
                        controllerScope.destructionItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }
    }

    //this function used for update item quanity.
    private updateItemQunatity(item) {
        let controllerScope = this.$scope;
        let itemCount = item.BaseUnit * item.DestructionQuantity;
        let isParentItem = false;
        let parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.destructionItemId = item.Id;
        }
        //condition for sub-item
        else {
            controllerScope.destructionItemId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.destructionItemList.length; i++) {
            if (controllerScope.destructionItemList[i].Id === controllerScope.destructionItemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    if (item.OldRequestQuantity !== item.DestructionQuantity) {
                        if (item.OldRequestQuantity < item.DestructionQuantity) {
                            let requestDiff = item.DestructionQuantity - item.OldRequestQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity - itemCount;
                                controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                            //condition for sub-item
                            else {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity - itemCount;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                        else {
                            let requestDiff = item.OldRequestQuantity - item.DestructionQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity + itemCount;
                                controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                            //condition for sub-item
                            else {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity + itemCount;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    if (item.IsParentItem) {
                        controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity - itemCount;
                        parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                        controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                        isParentItem = true;
                        break;
                    }
                    //condition for sub-item
                    else {
                        controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity - itemCount;
                        parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.destructionItemList.length; j++) {
                if (controllerScope.destructionItemList[j].Id !== controllerScope.destructionItemId) {
                    if (controllerScope.destructionItemList[j].ParentItemId === controllerScope.destructionItemId) {
                        if (controllerScope.destructionItemList[j].Id === item.Id) {
                            controllerScope.destructionItemList[j].OldRequestQuantity = item.DestructionQuantity;
                            controllerScope.destructionItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.destructionItemList[j].BaseUnit);
                        }
                        else {
                            controllerScope.destructionItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.destructionItemList[j].BaseUnit);
                        }
                    }
                }
            }
        }
        else {
            if (item.OldRequestQuantity !== item.DestructionQuantity) {
                let updateItemQuantity = 0;
                for (let k = 0; k < controllerScope.destructionItemList.length; k++) {
                    if (controllerScope.destructionItemList[k].ParentItemId === controllerScope.destructionItemId) {
                        //UpdateSystemQunatity
                        if (controllerScope.destructionItemList[k].Id !== item.ParentItemId) {
                            if (controllerScope.destructionItemList[k].Id === item.Id) {
                                controllerScope.destructionItemList[k].UpdateSystemQunatity = (controllerScope.destructionItemList[k].UpdateSystemQunatity + (controllerScope.destructionItemList[k].OldRequestQuantity * item.BaseUnit)) - (item.DestructionQuantity * item.BaseUnit);
                                updateItemQuantity = controllerScope.destructionItemList[k].UpdateSystemQunatity;
                                controllerScope.destructionItemList[k].OldRequestQuantity = item.DestructionQuantity;
                                break;
                            }
                        }
                    }
                }
                for (let p = 0; p < controllerScope.destructionItemList.length; p++) {
                    if (controllerScope.destructionItemList[p].ParentItemId === controllerScope.destructionItemId) {
                        controllerScope.destructionItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.destructionItemList[p].BaseUnit);
                        controllerScope.destructionItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }

    }

    // this function used for update item quantity when add new main and sub item.
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
        for (let i = 0; i < controllerScope.destructionItemList.length; i++) {
            if (controllerScope.destructionItemList[i].ParentItemId === controllerScope.destructionItemId) {
                if (!item.IsParentItem) {
                    if (controllerScope.destructionItemList[i].Id === controllerScope.destructionItemId) {
                        parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
                }
            }
        }
        if (isParentItem) {
            for (let j = 0; j < controllerScope.destructionItemList.length; j++) {
                if (controllerScope.destructionItemList[j].Id === item.Id) {
                    controllerScope.destructionItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.destructionItemList[j].BaseUnit);
                }
            }
        }
        else {
            let updateItemQunatity = 0;
            let itemExist = false;
            for (let k = 0; k < controllerScope.destructionItemList.length; k++) {
                if (controllerScope.destructionItemList[k].ParentItemId === controllerScope.destructionItemId) {
                    if (controllerScope.destructionItemList[k].Id !== item.Id) {
                        updateItemQunatity = controllerScope.destructionItemList[k].UpdateSystemQunatity;
                        itemExist = true;
                        break;
                    }
                }
            }

            for (let p = 0; p < controllerScope.destructionItemList.length; p++) {
                if (controllerScope.destructionItemList[p].Id === item.Id) {
                    if (itemExist) {
                        controllerScope.destructionItemList[p].SystemQuantity = Math.floor(updateItemQunatity / controllerScope.destructionItemList[p].BaseUnit);
                        controllerScope.destructionItemList[p].UpdateSystemQunatity = updateItemQunatity;
                    }
                }
            }
        }
    }

    //this method used for open popu when add already exists item.
    private openItemAddErrorPopup() {
        this.itemAddErrorPopup = this.$modal.open({
            templateUrl: 'AddItemErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'sm'
        });
    }

    private deletedestructionItem(id) {
        this.$scope.itemId = id;
        this.deletePopup = this.$modal.open({
            templateUrl: 'DeleteItemPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    }

    private deleteDestructionItem() {
        if (this.$scope.itemId !== 0 && this.$scope.itemId !== undefined && this.$scope.itemId !== null) {
            for (let i = 0; i < this.$scope.destructionItemList.length; i++) {
                if (this.$scope.destructionItemList[i].Id === this.$scope.itemId) {
                    this.$scope.destructionItemList[i].DestructionQuantity = 0;
                    this.removeItemQunatity(this.$scope.destructionItemList[i]);
                    this.$scope.destructionItemList.splice(i, 1);
                }
            }

            if (this.$scope.totalItemSupplierList.length > 0) {
                for (let i = 0; i < this.$scope.totalItemSupplierList.length; i++) {
                    if (this.$scope.totalItemSupplierList[i].Id === this.$scope.itemId) {
                        this.$scope.totalItemSupplierList[i].Checked = false;
                    }
                    if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== undefined) {
                        for (let j = 0; j < this.$scope.totalItemSupplierList[i].listOfChildProfileAC.length; j++) {
                            if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].Id === this.$scope.itemId) {
                                this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].Checked = false;
                            }
                        }
                    }
                }
            }
        }

        this.deletePopup.dismiss('cancel');

        if (this.$scope.destructionItemList.length <= 0) {
            let controllerScope: any = this.$scope;
            controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
            controllerScope.itemDestructionRequest.$setPristine();
            controllerScope.itemDestructionRequest.$setValidity();
            controllerScope.itemDestructionRequest.$setUntouched();
            this.$scope.isRequestDetail = false;
            this.$scope.destructionItemList = [];
            this.$scope.selectedAll = false;
            this.searchButton();
        }
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        //To get branch list
        let promise = this.ItemDestructionService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private searchButton() {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        if (controllerScope.ItemDestructionRequestModel.branchId !== undefined && controllerScope.ItemDestructionRequestModel.branchId !== null)
            controllerScope.ItemDestructionSearchModel.BranchId = controllerScope.ItemDestructionRequestModel.branchId;
        controllerScope.itemSupplierCollection = [];
        let itemSupplierList = controllerScope.itemSupplierCollection;
        let promise = this.ItemDestructionService.getSupplierItemListSearch(controllerScope.ItemDestructionSearchModel);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                this.$scope.ItemDestructionRequestModel.branchId = result.BranchId;
                if (result.listOfItemProfileAC.length > 0) {
                    for (let i = 0; i < result.listOfItemProfileAC.length; i++) {
                        itemSupplierList.push(result.listOfItemProfileAC[i]);
                    }
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = itemSupplierList.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.itemSupplierCollection.length;
                    controllerScope.totalItemSupplierList = controllerScope.itemSupplierCollection;
                    this.checkSupplierSameOrNot(controllerScope.totalItemSupplierList);
                    this.$scope.errorMessageDisplayForBlankList = false;
                }
                else {
                    this.$scope.errorMessageDisplayForBlankList = true;
                }
                this.$scope.ItemDestructionSearchModel = new Model.ItemDestructionSearchModel();
            }
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private checkSupplierSameOrNot(totalItemSupplierList) {
        this.$scope.isSameSupplierInList = true;
        let itemList = [];
        for (let i = 0; i < totalItemSupplierList.length; i++) {
            if (itemList.length > 0) {
                if (totalItemSupplierList[i].SupplierId === itemList[0].SupplierId) {
                    itemList.push(totalItemSupplierList[i]);
                }
                else {
                    this.$scope.isSameSupplierInList = false;
                    break;
                }
            }
            else {
                itemList.push(totalItemSupplierList[i]);
            }
        }
    }

    //this funciton used for cancel button for item popup. -An
    private cancelButtonForItemPopup() {
        this.itemListPopup.dismiss('cancel');
    }

    //this function used for open popup for change main item. -An
    private openItemListPopup() {
        this.itemListPopup = this.$modal.open({
            templateUrl: 'itemListPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'itemCollectionController',
            scope: this.$scope,
        });
    }

    private getSubItemList(parentId, supplierId) {
        let controllerScope = this.$scope;
        if (parentId !== 0 && parentId !== undefined && parentId !== null && supplierId !== 0 && supplierId !== undefined && supplierId !== null) {
            let parent = parseFloat((parentId.toString() + supplierId.toString()));
            controllerScope.isDataLoading = true;
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
        controllerScope.isDataLoading = false;
    }

    //This function used for get supplier list.
    private getSupplierList() {
        let controllerScope = this.$scope;
        let promise = this.ItemDestructionService.getSupplierList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, IsAcceptReturnForExpiredItem: result[i].IsAcceptReturnForExpiredItem });
                }
            }
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This function used for get category list.
    private getCategoryList() {
        let controllerScope = this.$scope;
        let promise = this.ItemDestructionService.getCategoryList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
            }
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This funciton used for get unit type.
    private getUnitTypeList() {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        //to get unit type list
        let promise = this.ItemDestructionService.getUnitList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
            }
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
}
app.controller(ItemDestructionRequestController.controllerId, ['$scope', '$log', '$rootScope', 'ItemDestructionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', ($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) => {
    return new ItemDestructionRequestController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
}]);

interface IsupplierPOControllerScope extends ng.IScope {
    itemProfile: any;
    supplierPO: any;
    getSupplierItem: Function;
    getSupplierList: Function;
    addPurchaseOrderGrid: Function;
    openItemSearchPopup: Function;
    closeItemSearchPopup: Function;
    openItemAddtoSPOPopup: Function;
    closeItemAddtoSPOPopup: Function;
    searchItems: Function;
    deletePurchaseOrderGrid: Function;
    saveSupplierPO: Function;
    getUserBranchList: Function;
    getSPO: Function;
    updateSPO; Function;
    close: Function;
    selectAll: Function;
    minStartDate: any;
    deSelectOneItem: Function;
    itemSelection: any;
    poItemId: any;
    cpoListEmptyError: any;
    bulkItemList: any;
    branchList: any;
    supplier: any;
    validQuantityError: any;
    isEdit: boolean;
    isEmptyItemList: boolean;
    isEmptyItemQuantity: boolean;
    validCostPriceError: any;
    itemList: any;
    branchNameRequired: any;
    supplierList: any;
    purchaseOrderList: any;
    item: any;
    supplierName: any;
    noItemFound: any;
    isDueDatePickerOpened: any;
    openDueDatePicker: Function;
    serachFilter: any;
    itemDetailList: any;
    totalCollection: any;
    search: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    entryLimit: any;
    userErrorMessageDisplay: boolean;
    itemTotalCollection: any;
    ownBranchSelectError: any;
    noItemAddedToPO: any;
    supplierRequired: any;
    actualQuantity: any;
    checkQuantity: Function;
    openItemQuantityErrorPopup: Function;
    closeItemQuantityErrorPopup: Function;
    quantityCPError: any;
    itemAddedError: any;
    openPOItemDeletePopup: Function;
    closePOItemDeletePopup: Function;
    userBranch: any;
    userBranchId: any;
    onQuantityChange: Function;
    branchRequired: boolean;
    lessQuantityPlease: any;
    examplemodel: any;
    selectsettings: any;
    deleteConfirmation: any;
    branchModel: any;
    branchError: any;
    deleteConfirmMessage: any;
    getBranchList: Function;
    ValidDiscountMessage: any;
}

interface IsupplierPOController {
}

class SupplierPOController implements IsupplierPOController {
    static controllerId = "SupplierPOController";
    public itemSearchPopup;
    public addItemtoSPOPopup;
    public itemQuantityErrorPopup;
    public poItemDeletePopup;


    constructor(private $scope: IsupplierPOControllerScope, private $log: ng.ILocaleService, private supplierPOService: SupplierPOService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $modal, public $routeParams, public $location, public $filter) {
        this.$scope.itemProfile = new Model.AddNewItemProfile();
        this.$scope.supplierPO = new Model.SupplierPO();
        this.$scope.poItemId = 0;

        this.$scope.getSupplierItem = (id) => this.getSupplierItem(id);
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.getUserBranchList = () => this.getUserBranchList();
        this.$scope.addPurchaseOrderGrid = () => this.addPurchaseOrderGrid();
        this.$scope.minStartDate = new Date();
        this.$scope.deletePurchaseOrderGrid = (id) => this.deletePurchaseOrderGrid(id);
        this.$scope.saveSupplierPO = (supplierPO: Model.SupplierPO, isSubmit: number) => this.saveSupplierPO(supplierPO, isSubmit);
        this.$scope.getSPO = () => this.getSPO();
        this.$scope.updateSPO = (supplierPO: Model.SupplierPO) => this.updateSPO(supplierPO);
        this.$scope.close = () => this.close();
        this.$scope.itemSelection = [];
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.cpoListEmptyError = stringConstants.cpoListEmptyError;
        this.$scope.openItemSearchPopup = () => this.openItemSearchPopup();
        this.$scope.closeItemSearchPopup = () => this.closeItemSearchPopup();
        this.$scope.validCostPriceError = stringConstants.validCostPriceError;
        this.$scope.openItemAddtoSPOPopup = () => this.openItemAddtoSPOPopup();
        this.$scope.closeItemAddtoSPOPopup = () => this.closeItemAddtoSPOPopup();
        this.$scope.checkQuantity = (po) => this.checkQuantity(po);
        this.$scope.selectAll = () => this.selectAll();
        this.$scope.deSelectOneItem = (id) => this.deSelectOneItem(id);
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.branchList = [];
        this.$scope.bulkItemList = [];
        this.$scope.supplier = [];
        this.$scope.branchError = false;
        this.$scope.isEdit = false;
        this.$scope.isEmptyItemList = false;
        this.$scope.isEmptyItemQuantity = false;
        this.$scope.branchNameRequired = stringConstants.branchNameRequired;
        this.$scope.ownBranchSelectError = stringConstants.ownBranchSelectError;
        this.$scope.noItemAddedToPO = stringConstants.noItemAddedToPO;
        this.$scope.quantityCPError = stringConstants.quantityCPError;
        this.$scope.itemAddedError = stringConstants.itemAddedError;
        this.$scope.lessQuantityPlease = stringConstants.lessQuantityPlease;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.supplierList = [];
        this.$scope.purchaseOrderList = [];
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.isDueDatePickerOpened = false;
        this.$scope.openDueDatePicker = (event) => this.openDueDatePicker(event);
        this.$scope.search = [];
        this.$scope.itemDetailList = [];
        this.$scope.searchItems = () => this.searchItems();
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            if (this.$scope.itemList !== null && this.$scope.itemList !== undefined) {
                this.$scope.totalCollection = this.$scope.itemList.slice(begin, end);
            }
        });
        this.$scope.ValidDiscountMessage = stringConstants.ValidDiscountMessage;
        this.$scope.supplierRequired = stringConstants.supplierRequired;
        this.$scope.openItemQuantityErrorPopup = (actualQuantity) => this.openItemQuantityErrorPopup(actualQuantity);
        this.$scope.closeItemQuantityErrorPopup = () => this.closeItemQuantityErrorPopup();
        this.$scope.userBranch = "";
        this.$scope.openPOItemDeletePopup = (poItemId) => this.openPOItemDeletePopup(poItemId);
        this.$scope.closePOItemDeletePopup = () => this.closePOItemDeletePopup();
        this.$scope.userBranchId = 0;
        this.$scope.onQuantityChange = (item) => this.onQuantityChange(item);
        this.$scope.branchRequired = true;
        this.$scope.branchModel = [];
        this.$scope.selectsettings = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true
        };
        this.initialize();
    }

    private initialize() {
        this.$scope.supplierPO.DueDate = new Date();
        this.getSupplierList();
        this.getUserBranchList();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getSPO();
        }
    }


    //used to fetch branchlist of user's company - jj
    private getUserBranchList() {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        let promise = this.supplierPOService.getUserBranchList();
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length !== 0) {
                    for (let i = 0; i < result.length; i++) {
                        controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                    }
                    if (this.$rootScope.merchatSettings.IsAllowToCreateSupplierPurchaseOrderForOtherBranch || this.$rootScope.merchatSettings.IsAllowToAccessAllBranch) {
                    }
                    else {
                        let promise = this.supplierPOService.getUserBranchName();
                        promise.then((result) => {
                            if (result.branchName !== null && result.branchName !== undefined) {
                                controllerScope.userBranch = result.branchName;
                                controllerScope.userBranchId = result.branchId;
                                controllerScope.branchRequired = false;
                                let isBranchModelSet = false;
                                if (controllerScope.branchModel !== undefined && controllerScope.branchModel !== null && controllerScope.branchModel.length > 0) {
                                    for (let b = 0; b < controllerScope.branchModel.length; b++) {
                                        if (controllerScope.branchModel[b].Id > 0) {
                                            isBranchModelSet = true;
                                        }
                                    }
                                }
                                if (!isBranchModelSet) {
                                    controllerScope.branchModel.push({ Id: controllerScope.userBranchId });
                                }
                                controllerScope.supplierPO.InitiationBranchId;
                            }
                            rootScope.isLoading = false;
                        }).catch((error) => {
                            if (error.status !== 500) {
                                location.replace(this.apiPath);
                            }
                            rootScope.isLoading = false;
                        });
                    }
                }
            }
            rootScope.isLoading = false;
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            rootScope.isLoading = false;
        });
    }


    //after editting for branch related change - jj
    // used to fetch Item List of the supplier
    private getSupplierItem(supplier) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
        }
        else {
            controllerScope.purchaseOrderList = [];
            controllerScope.itemSelection.Select = false;
        }
        if (controllerScope.branchModel !== null && controllerScope.branchModel !== undefined) {
            if (controllerScope.branchModel.length !== 0) {
                controllerRootScope.isLoading = true;
                controllerScope.totalCollection = [];
                controllerScope.itemTotalCollection = [];
                controllerScope.itemList = [];
                let itemCollection = controllerScope.itemList;
                if (controllerScope.isEdit) {
                    controllerScope.supplierName = controllerScope.supplierPO.SupplierName;
                }
                else {
                    controllerScope.supplierName = controllerScope.supplierPO.supplier.Name;
                }
                let branchId = 0;
                if (controllerScope.supplierPO.BranchId === null || controllerScope.supplierPO.BranchId === undefined) {
                    branchId = 0;
                }
                else {
                    branchId = controllerScope.supplierPO.BranchId;
                }

                let promise = this.supplierPOService.getItemList(supplier.Id, branchId);
                promise.then((result) => {
                    if (result.length === 0) {
                        controllerRootScope.isLoading = false;
                    }
                    else {
                        for (let i = 0; i < result.length; i++) {
                            result[i].IsSelected = false;
                            itemCollection.push(result[i]);
                            controllerScope.itemTotalCollection = itemCollection;
                            let that = this;
                            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                                end = begin + that.$scope.itemsPerPage;
                            controllerScope.totalCollection = itemCollection.slice(begin, end);
                            /* init pagination  */
                            controllerScope.totalItems = controllerScope.itemList.length;
                        }
                        this.setSelectedItems();
                        if (this.$rootScope.merchatSettings.IsAllowToCreateSupplierPurchaseOrderForOtherBranch || this.$rootScope.merchatSettings.IsAllowToAccessAllBranch) {
                        }
                        else {
                            controllerScope.supplierPO.InitiationBranchId = controllerScope.userBranchId;
                        }
                        controllerRootScope.isLoading = false;
                    }
                }).catch((error) => {
                    if (error.status !== 500) {
                        location.replace(this.apiPath);
                    }
                    controllerRootScope.isLoading = false;
                });
            }
            else {
                controllerScope.branchError = true;
                this.openItemQuantityErrorPopup(34);
            }
        }
        else {
            controllerScope.branchError = true;
            this.openItemQuantityErrorPopup(34);
        }
    }



    // used to fetch supplier list
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierPOService.getSupplierList();
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


    //after edit
    private addPurchaseOrderGrid() {
        let controllerScope = this.$scope;
        //for set scroll position
        let section_pos = angular.element("#polist-section").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top - 200 }, 300);
        for (let i = 0; i < controllerScope.purchaseOrderList.length; i++) {
            for (let j = 0; j < controllerScope.itemTotalCollection.length; j++) {
                if (controllerScope.itemTotalCollection[j].IsSelected) {

                }
                else if (controllerScope.itemTotalCollection[j].ItemId === controllerScope.purchaseOrderList[i].ItemId) {
                    controllerScope.purchaseOrderList[i].OrderCostPrice = "";
                    controllerScope.purchaseOrderList[i].OrderQuantity = "";
                    controllerScope.purchaseOrderList[i].FreeQuantity = "";
                    controllerScope.purchaseOrderList[i].PercentageDiscount = "";
                }
            }
        }
        controllerScope.purchaseOrderList = [];
        for (let n = 0; n < controllerScope.itemTotalCollection.length; n++) {
            if (controllerScope.itemTotalCollection[n].IsSelected) {
                if (controllerScope.itemTotalCollection[n].OrderCostPrice === "") {
                    controllerScope.itemTotalCollection[n].OrderCostPrice = controllerScope.itemTotalCollection[n].CostPrice;
                }
                controllerScope.purchaseOrderList.push(controllerScope.itemTotalCollection[n]);
            }
            else {
                controllerScope.itemSelection.Select = false;
            }
        }
    }


    //used to open date picker
    private openDueDatePicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDatePickerOpened = true;
    }

    // used for opening the DeleteUserPopup-jj
    private openItemSearchPopup() {
        let controllerScope = this.$scope;
        this.itemSearchPopup = this.$modal.open({
            templateUrl: 'ItemSearch',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the DeleteUserPopup-jj
    private closeItemSearchPopup() {
        this.itemSearchPopup.dismiss('cancel');
    }

    //supplier profile search panel.
    private searchItems() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.itemList = this.filterFilter((controllerScope.itemTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.itemList.length === 0) {

        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.itemList.slice(begin, end);
            controllerScope.totalItems = controllerScope.itemList.length;
        }
        controllerScope.search = [];
    }


    //after edit
    //used to remoce item from selected item list - jj
    private deletePurchaseOrderGrid(id) {
        let controllerScope = this.$scope;
        this.closePOItemDeletePopup();
        let temp = [];
        //  temp = controllerScope.purchaseOrderList;
        for (let i = 0; i < controllerScope.purchaseOrderList.length; i++) {
            if (controllerScope.purchaseOrderList[i].ItemId === id) {
                controllerScope.purchaseOrderList[i].OrderCostPrice = "";
                controllerScope.purchaseOrderList[i].OrderQuantity = "";
                controllerScope.purchaseOrderList[i].FreeQuantity = "";
                controllerScope.purchaseOrderList[i].PercentageDiscount = "";
                this.uncheckedSelectedItem(id);
            }
            else {
                temp.push({
                    ItemId: controllerScope.purchaseOrderList[i].ItemId, ActualQuantity: controllerScope.purchaseOrderList[i].ActualQuantity,
                    OrderQuantity: controllerScope.purchaseOrderList[i].OrderQuantity,
                    FreeQuantity: controllerScope.purchaseOrderList[i].FreeQuantity,
                    ItemNameEn: controllerScope.purchaseOrderList[i].ItemNameEn, OrderCostPrice: controllerScope.purchaseOrderList[i].OrderCostPrice,
                    Barcode: controllerScope.purchaseOrderList[i].Barcode, Type: controllerScope.purchaseOrderList[i].Type,
                    Code: controllerScope.purchaseOrderList[i].Code, FlavourEn: controllerScope.purchaseOrderList[i].FlavourEn,
                    CostPrice: controllerScope.purchaseOrderList[i].CostPrice, Select: false
                });
            }
        }
        controllerScope.purchaseOrderList = temp;
        for (let l = 0; l < controllerScope.itemList.length; l++) {
            if (controllerScope.itemList[l].Id === id) {
                controllerScope.itemList[l].Select = false;
            }
        }
    }


    private uncheckedSelectedItem(data) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.itemTotalCollection.length; i++) {
            if (controllerScope.itemTotalCollection[i].ItemId === data) {
                controllerScope.itemTotalCollection[i].IsSelected = false;
                break;
            }
        }
    }

    //used to create supplier PO - jj
    private saveSupplierPO(supplierPO, isSubmit) {
        let controllerScope = this.$scope;
        let controllerRootscope = this.$rootScope;
        controllerRootscope.isLoading = true;
        if (controllerScope.branchModel !== null && controllerScope.branchModel !== undefined) {
            controllerScope.branchError = false;
            if (controllerScope.branchModel.length !== 0) {
                supplierPO.SPOBranch = controllerScope.branchModel;
                let count = 0;
                controllerRootscope.isLoading = true;
                if (controllerScope.purchaseOrderList.length === 0) {
                    this.openItemAddtoSPOPopup();
                    controllerRootscope.isLoading = false;
                    controllerScope.isEmptyItemList = true;
                    controllerScope.isEmptyItemQuantity = false;
                }
                else {
                    for (let j = 0; j < controllerScope.purchaseOrderList.length; j++) {
                        if (controllerScope.purchaseOrderList[j].OrderQuantity <= 0 || controllerScope.purchaseOrderList[j].OrderCostPrice <= 0) {
                            controllerScope.purchaseOrderList[j].FreeQuantity = "";
                            controllerScope.purchaseOrderList[j].OrderCostPrice = "";
                            count++;
                        }
                    }
                    if (count === 0) {
                        supplierPO.SupplierItem = [];
                        for (let i = 0; i < controllerScope.purchaseOrderList.length; i++) {
                            if (controllerScope.purchaseOrderList[i] !== null && controllerScope.purchaseOrderList[i] !== undefined) {
                                supplierPO.SupplierItem.push({
                                    ItemId: controllerScope.purchaseOrderList[i].ItemId, ItemNameEn: controllerScope.purchaseOrderList[i].ItemNameEn,
                                    CostPrice: controllerScope.purchaseOrderList[i].CostPrice, OrderQuantity: controllerScope.purchaseOrderList[i].OrderQuantity,
                                    BranchId: controllerScope.purchaseOrderList[i].BranchId, OrderCostPrice: controllerScope.purchaseOrderList[i].OrderCostPrice,
                                    UnitParamTypeId: controllerScope.purchaseOrderList[i].UnitParamTypeId, Code: controllerScope.purchaseOrderList[i].Code,
                                    PercentageDiscount: controllerScope.purchaseOrderList[i].PercentageDiscount, FreeQuantity: controllerScope.purchaseOrderList[i].FreeQuantity
                                });
                                supplierPO.SupplierId = controllerScope.supplierPO.supplier.Id;
                                supplierPO.SupplierDaysLimit = controllerScope.purchaseOrderList[i].SupplierDaysLimit;
                                supplierPO.SupplierTypeId = controllerScope.purchaseOrderList[i].SupplierTypeId;
                            }
                        }
                        if (!controllerRootscope.isLoading) {
                        }
                        else {
                            if (isSubmit === 1) {
                                supplierPO.IsSubmitted = true;
                            }
                            else {
                                supplierPO.IsSubmitted = false;
                            }
                            let promise = this.supplierPOService.addSupplierPO(supplierPO);
                            promise.then((result) => {
                                if (result.status === "SPO Created") {
                                    controllerRootscope.isLoading = false;
                                    let x = this;
                                    x.$location.path("/SupplierPOWorkList/");
                                    if (isSubmit === 1) {
                                        this.ngToast.create(stringConstants.spoCreated);
                                    }
                                    else {
                                        this.ngToast.create(stringConstants.SPOSavedSuccessfully);
                                    }
                                }
                                else {
                                    controllerRootscope.isLoading = false;
                                    this.ngToast.create(
                                        {
                                            className: 'danger',
                                            content: stringConstants.workFlowNotCreated
                                        });
                                }
                            }).catch((error) => {
                                this.ngToast.create(
                                    {
                                        className: 'danger',
                                        content: stringConstants.spoNotCreated
                                    });
                                controllerRootscope.isLoading = false;
                            });
                        }
                    }
                    else {
                        this.openItemAddtoSPOPopup();
                        controllerRootscope.isLoading = false;
                        controllerScope.isEmptyItemList = false;
                        controllerScope.isEmptyItemQuantity = true;
                    }
                }
            }
            else {
                controllerScope.branchError = true;
                controllerRootscope.isLoading = false;
                this.openItemQuantityErrorPopup(34);
            }
        }
        else {
            controllerScope.branchError = true;
            controllerRootscope.isLoading = false;
            this.openItemQuantityErrorPopup(34);
        }
    }

    //USED TO FETCH SPO OF THE GIVEN ID - jj
    private getSPO() {
        let id = this.$routeParams.id;
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        controllerScope.isEdit = true;
        if (controllerScope.isEdit && rootScope.merchatSettings.IsAllowToCreateSupplierPurchaseOrderForOtherBranch) {
            controllerScope.branchRequired = false;
        }
        let promise = this.supplierPOService.getSupplierPO(id);
        promise.then((result) => {
            controllerScope.supplierPO = result;
            controllerScope.branchModel = [];
            for (let i = 0; i < controllerScope.supplierPO.SPOBranch.length; i++) {
                controllerScope.branchModel.push({ Id: controllerScope.supplierPO.SPOBranch[i].Id });
            }
            controllerScope.purchaseOrderList = controllerScope.supplierPO.SupplierItem;
            controllerScope.supplierPO.SupplierProfile = controllerScope.supplierPO.SupplierProfile;
            controllerScope.supplierPO.supplier = controllerScope.supplierPO.SupplierProfile;
            controllerScope.supplierName = controllerScope.supplierPO.SupplierName;
            rootScope.isLoading = false;
            this.getSupplierItem(controllerScope.supplierPO.SupplierProfile);
            this.setSelectedItems();
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            rootScope.isLoading = false;
        });
    }


    //used to set selected items - jj
    private setSelectedItems() {
        let controllerScope = this.$scope;
        if (controllerScope.purchaseOrderList !== null && controllerScope.purchaseOrderList !== undefined && controllerScope.purchaseOrderList.length > 0) {
            if (controllerScope.itemTotalCollection !== null && controllerScope.itemTotalCollection !== undefined && controllerScope.itemTotalCollection.length > 0) {
                for (let i = 0; i < controllerScope.purchaseOrderList.length; i++) {
                    for (let j = 0; j < controllerScope.itemTotalCollection.length; j++) {
                        if (controllerScope.purchaseOrderList[i].ItemId === controllerScope.itemTotalCollection[j].ItemId) {
                            controllerScope.itemTotalCollection[j].IsSelected = true;
                            controllerScope.itemTotalCollection[j].OrderCostPrice = controllerScope.purchaseOrderList[i].OrderCostPrice;
                            controllerScope.itemTotalCollection[j].OrderQuantity = controllerScope.purchaseOrderList[i].OrderQuantity;
                            controllerScope.itemTotalCollection[j].FreeQuantity = controllerScope.purchaseOrderList[i].FreeQuantity;
                            controllerScope.itemTotalCollection[j].PercentageDiscount = controllerScope.purchaseOrderList[i].PercentageDiscount;
                        }
                    }
                }
            }
        }
    }


    //USED TO EDIT SPO - jj
    private updateSPO(supplierPO) {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        supplierPO.SPOBranch = controllerScope.branchModel;
        if (controllerScope.branchModel !== null && controllerScope.branchModel !== undefined) {
            controllerScope.branchError = false;
            if (controllerScope.branchModel.length !== 0) {
                supplierPO.SPOBranch = controllerScope.branchModel;
                let count = 0;
                if (controllerScope.purchaseOrderList.length === 0) {
                    this.openItemAddtoSPOPopup();
                    rootScope.isLoading = false;
                    controllerScope.isEmptyItemList = true;
                    controllerScope.isEmptyItemQuantity = false;
                }
                else {
                    for (let j = 0; j < controllerScope.purchaseOrderList.length; j++) {
                        if (controllerScope.purchaseOrderList[j].OrderQuantity <= 0) {
                            count++;
                        }
                    }
                    if (count === 0) {
                        supplierPO.SupplierItem = [];
                        for (let i = 0; i < controllerScope.purchaseOrderList.length; i++) {
                            if (controllerScope.purchaseOrderList[i] !== null && controllerScope.purchaseOrderList[i] !== undefined) {
                                supplierPO.SupplierItem.push({
                                    ItemId: controllerScope.purchaseOrderList[i].ItemId, ItemNameEn: controllerScope.purchaseOrderList[i].ItemNameEn,
                                    CostPrice: controllerScope.purchaseOrderList[i].CostPrice, OrderQuantity: controllerScope.purchaseOrderList[i].OrderQuantity,
                                    BranchId: controllerScope.purchaseOrderList[i].BranchId, OrderCostPrice: controllerScope.purchaseOrderList[i].OrderCostPrice,
                                    FreeQuantity: controllerScope.purchaseOrderList[i].FreeQuantity,
                                    UnitParamTypeId: controllerScope.purchaseOrderList[i].UnitParamTypeId, Code: controllerScope.purchaseOrderList[i].Code,
                                    PercentageDiscount: controllerScope.purchaseOrderList[i].PercentageDiscount
                                });
                                supplierPO.SupplierId = controllerScope.supplierPO.supplier.Id;
                                supplierPO.SupplierDaysLimit = controllerScope.purchaseOrderList[i].SupplierDaysLimit;
                                supplierPO.SupplierTypeId = controllerScope.purchaseOrderList[i].SupplierTypeId;
                            }
                        }
                        let promise = this.supplierPOService.updateSupplierPO(supplierPO);
                        promise.then((result) => {
                            if (result.status !== null && result.status !== undefined) {
                                if (result.status === stringConstants.alreadyActivityProcessed) {
                                    this.ngToast.create(
                                        {
                                            className: 'danger',
                                            content: stringConstants.alreadyActivityDone
                                        });
                                }
                                else {
                                    this.ngToast.create(
                                        {
                                            className: 'danger',
                                            content: result.status
                                        });
                                }
                            }
                            else {
                                this.ngToast.create(stringConstants.spoUpdated);
                                let x = this;
                                x.$location.path("/SupplierPOWorkList/");
                            }
                            rootScope.isLoading = false;
                        }).catch((error) => {
                            this.ngToast.create(stringConstants.spoNotUpdated);
                            rootScope.isLoading = false;
                        });
                    }
                    else {
                        this.openItemAddtoSPOPopup();
                        rootScope.isLoading = false;
                        controllerScope.isEmptyItemList = false;
                        controllerScope.isEmptyItemQuantity = true;
                    }
                }
            }
            else {
                rootScope.isLoading = false;
                controllerScope.branchError = true;
                this.openItemQuantityErrorPopup(34);
            }
        }
        else {
            rootScope.isLoading = false;
            controllerScope.branchError = true;
            this.openItemQuantityErrorPopup(34);
        }
    }


    //used to redirect to worklist - jj
    private close() {
        let x = this;
        x.$location.path("/SupplierPOWorkList/");
    }

    // used for opening the DeleteUserPopup-jj
    private openItemAddtoSPOPopup() {
        let controllerScope = this.$scope;
        this.addItemtoSPOPopup = this.$modal.open({
            templateUrl: 'AddItemtoSPOPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //used for closing  the DeleteUserPopup-jj
    private closeItemAddtoSPOPopup() {
        this.addItemtoSPOPopup.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.isEmptyItemList = false;
        controllerScope.isEmptyItemQuantity = false;
    }

    //used to check whether requested quantity available - jj
    private checkQuantity(po) {
        let controllerScope = this.$scope;
        let total = parseInt("" + po.ActualQuantity) + parseInt("" + po.MaxQuantity);
        if (po.OrderQuantity > total) {
            controllerScope.branchError = false;
            this.openItemQuantityErrorPopup(total);
            po.OrderQuantity = total;
            controllerScope.actualQuantity = total;
        }
    }

    //used to open ItemQuantityErrorPopup - jj
    private openItemQuantityErrorPopup(actualQuantity) {
        let controllerScope = this.$scope;
        this.itemQuantityErrorPopup = this.$modal.open({
            templateUrl: 'ItemQuantityErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.actualQuantity = actualQuantity;
    }

    //used to close ItemQuantityErrorPopup - jj
    private closeItemQuantityErrorPopup() {
        this.itemQuantityErrorPopup.dismiss('cancel');
    }


    //used to open POItemDeletePopup - jj
    private openPOItemDeletePopup(poItemId) {
        let controllerScope = this.$scope;
        this.poItemDeletePopup = this.$modal.open({
            templateUrl: 'POItemDeletePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.poItemId = poItemId;
    }

    //used to close POItemDeletePopup - jj
    private closePOItemDeletePopup() {
        this.poItemDeletePopup.dismiss('cancel');
    }

    //used to fetch branchlist - jj
    private getBranchList() {
        let controllerScope = this.$scope;
        let rootScope = this.$rootScope;
        rootScope.isLoading = true;
        let promise = this.supplierPOService.getBranchList();
        promise.then((result) => {
            if (result.length === 0) {
            }
            else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
            rootScope.isLoading = false;
        }).catch((error) => {
            if (error.status !== 500) {
                location.replace(this.apiPath);
            }
            rootScope.isLoading = false;
        });
    }

    //used to calculate percentage discount based on free quantity - jj
    private onQuantityChange(item) {
        let controllerScope = this.$scope;
        let orderQuantity = parseInt(item.OrderQuantity);
        let freeQuantity = parseInt(item.FreeQuantity);
        let costPrice = parseInt(item.OrderCostPrice);
        let totalQuantity = orderQuantity + freeQuantity;
        let totalAmountPayable = orderQuantity * costPrice;
        item.PercentageDiscount = parseFloat((((costPrice - (totalAmountPayable / totalQuantity)) * 100) / costPrice).toFixed(2));
    }


    //used to select or deselect all the items in the itemList - jj
    private selectAll() {
        let controllerScope = this.$scope;
        if (controllerScope.itemSelection.Select) {
            for (let i = 0; i < controllerScope.itemTotalCollection.length; i++) {
                controllerScope.itemTotalCollection[i].IsSelected = true;
            }
        }
        else {
            for (let i = 0; i < controllerScope.itemTotalCollection.length; i++) {
                controllerScope.itemTotalCollection[i].IsSelected = false;
            }
        }
    }


    //used to deselect an item - jj
    private deSelectOneItem(id) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.purchaseOrderList.length; i++) {
            if (controllerScope.purchaseOrderList[i].ItemId = id) {

            }
        }
    }

}

app.controller(SupplierPOController.controllerId, ['$scope', '$log', 'SupplierPOService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$routeParams', '$location', '$filter', ($scope, $log, SupplierPOService, ngToast, $rootScope, apiPath, filterFilter, $modal, $routeParams, $location, $filter) => {
    return new SupplierPOController($scope, $log, SupplierPOService, ngToast, $rootScope, apiPath, filterFilter, $modal, $routeParams, $location, $filter);
}]);


// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

interface IissueStockInventoryControllerScope extends ng.IScope {
    getAllInvetoryType: Function;
    inventoryTypeCollection: any;
    issueInventoryDetails: any;
    supplierCollection: any;
    categoryCollection: any;
    isErrorMessageDisplay: boolean;
    errorMessage: string;
    branchList: any;
    changeInventoryType: Function;
    closeInventoryDetailDialogBox: Function;
    isSupplierPanelVisible: boolean;
    totalCollection: any;
    currentPage: number;
    itemsPerPage: number;
    inventoryDetailsCollection: any;
    maxSize: number;
    entryLimit: number;
    serachFilter: number;
    totalItems: any;
    isCategoryPanelVisible: boolean;
    isItemPanelVisible: boolean;
    itemCollection: any;
    getAllItemList: Function;
    subItemCollection: any;
    errorMessageDisplayForBlankList: boolean;
    isItemGrid: boolean;
    getSubItemList: Function;
    addSupplierName: Function;
    addItemBarcode: Function;
    addCategoryName: Function;
    isIssueButtonDisabled: boolean;
    submitIssueStockInventory: Function;
    addIssueStockInventory: Function;
    getAllInventoryList: Function;
    inventoryColletion: any;
    deleteIssueStockInventoryById: Function;
    viewIssueStockInventoryDetailsById: Function;
    deleteIssueStockInventory: Function;
    closeIssueInventoryDeleteDialogBox: Function;
    viewIssueStockInventoryDetails: Function;
    viewIssueStockInventoryMoniterDetails: Function;
    viewIssueStockInventoryMoniterDetailsById: Function;
    cancelIssueInventory: Function;
    startIssueStockInventory: Function;
    search: any;
    searchIssueInventoryDetails: Function;
    customInventoryCollection: any;
    chartObject: any;
    isDispalyChartSection: boolean;
    submitIssueStockInventoryDetails: Function;
    reviewIssueStockInventoryById: Function;
    issueStockInventoryApprovalById: Function;
    inventoryItemCollection: any;
    isDisplayItemDetails: boolean;
    unmatchedItemResolvedCollection: any;
    reSubmitIssueStockInventory: Function;
    isDataLoading: boolean;
    updateIssueInventoryDate: Function;
    openStartDateFromModel: Function;
    isOpenStartDateFromModel: boolean;
    serchSupllierDetails: Function;
    serchCategoryDetails: Function;
    categoryOtherCollection: any;
    supplierOtherCollection: any;
    supplierErrorMessage: boolean;
    categoryErrorMessage: boolean;
    itemErrorMessage: boolean;
    serchItemDetails: Function;
    itemOtherCollection: any;
    itemSearch: any;
    minStartDate: any;
    submitStockInventory: Function;
    updateIssueStockInventoryDate: Function;
    getUnmatchedItemListById: Function;
    unmatchedItemCollection: any;
    unmatchedItemErrorMessage: boolean;
    closeUnmatchedItemDetailsModelDialogBox: Function;
    closeupdateInventoryDateDetailDialogBox: Function;
    isDateAlreadyExist: boolean;
    isCurrentDateAlreadyExist: boolean;
    isFullInventoryAlreadyExist: boolean;
    inventoryErrorMessage: string;
    branchModel: any;
    isBranchConflict: boolean;
    checkConflictBranchSelectedOrNot: Function;
    submitConflictBranchIssueInventory: Function;
    isAllowToReRecord: boolean;
    reRecordSelectedItemDetails: Function;
    issueInventoryUnmatchedItem: any;
    checkRerecordItem: Function;
    clearIssueInventory: Function;
    noItemFound: any;
    deleteConfirmation: any;
    issuestockDeleteConfirmationMessage: any;
    noRecordFound: any;
}

interface IissueStockInventoryController {

}


class IssueStockInventoryController implements IissueStockInventoryController {
    static controllerId = "issueStockInventoryController";
    public inventoryDetailModelDialogBox;
    public inventoryDeleteModelDialogBox;
    public updateInventoryDateDetailsModel;
    public unmatchedItemModelDialogBox;
    constructor(private $scope: IissueStockInventoryControllerScope, private $log: ng.ILogService, private $location: ng.ILocationService, private issueStockInventoryService: IssueStockInventoryService, public $rootScope, public $routeParams, private apiPath, public $modal, public filterFilter, public ngToast, public $route) {
        this.$scope.getAllInvetoryType = () => this.getAllInvetoryType();
        this.$scope.inventoryTypeCollection = [];
        this.$scope.issueInventoryDetails = new Model.IssueInventoryAc();
        this.$scope.supplierCollection = [];
        this.$scope.categoryCollection = [];
        this.$scope.isErrorMessageDisplay = false;
        this.$scope.errorMessage = "";
        this.$scope.branchList = [];
        this.$scope.changeInventoryType = (inventoryType: any) => this.changeInventoryType(inventoryType);
        this.$scope.closeInventoryDetailDialogBox = () => this.closeInventoryDetailDialogBox();
        this.$scope.isSupplierPanelVisible = false;
        this.$scope.inventoryDetailsCollection = [];
        this.$scope.itemsPerPage = 1;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$rootScope.ParamId = 0;

        this.$scope.isCategoryPanelVisible = false;
        this.$scope.isItemPanelVisible = false;
        this.$scope.itemCollection = [];
        this.$scope.subItemCollection = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.isItemGrid = false;
        this.$scope.getSubItemList = (parentId: number) => this.getSubItemList(parentId);
        this.$scope.addSupplierName = (supplierId: number) => this.addSupplierName(supplierId);
        this.$scope.addItemBarcode = (barcode: string, detailsId: number) => this.addItemBarcode(barcode, detailsId);
        this.$scope.addCategoryName = (categoryId: number) => this.addCategoryName(categoryId);
        this.$scope.isIssueButtonDisabled = true;
        this.$scope.submitIssueStockInventory = (issueInventoryDetails: Model.IssueInventoryAc) => this.submitIssueStockInventory(issueInventoryDetails);
        this.$scope.addIssueStockInventory = () => this.addIssueStockInventory();
        this.$scope.getAllInventoryList = () => this.getAllInventoryList();
        this.$scope.deleteIssueStockInventoryById = (issueInventoryId: number) => this.deleteIssueStockInventoryById(issueInventoryId);
        this.$scope.viewIssueStockInventoryDetailsById = () => this.viewIssueStockInventoryDetailsById();
        this.$scope.deleteIssueStockInventory = (issueInventoryDetails: any) => this.deleteIssueStockInventory(issueInventoryDetails);
        this.$scope.closeIssueInventoryDeleteDialogBox = () => this.closeIssueInventoryDeleteDialogBox();
        this.$scope.viewIssueStockInventoryDetails = (issueInventoryId: number) => this.viewIssueStockInventoryDetails(issueInventoryId);
        this.$scope.viewIssueStockInventoryMoniterDetails = (issueInventoryId: number) => this.viewIssueStockInventoryMoniterDetails(issueInventoryId);
        this.$scope.viewIssueStockInventoryMoniterDetailsById = () => this.viewIssueStockInventoryMoniterDetailsById();
        this.$scope.cancelIssueInventory = () => this.cancelIssueInventory();
        this.$scope.startIssueStockInventory = (issueInventoryId: number) => this.startIssueStockInventory(issueInventoryId);
        this.$scope.search = [];
        this.$scope.searchIssueInventoryDetails = () => this.searchIssueInventoryDetails();
        this.$scope.customInventoryCollection = [];
        this.$scope.chartObject = [];
        this.$scope.isDispalyChartSection = false;
        this.$scope.isDisplayItemDetails = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.issuestockDeleteConfirmationMessage = stringConstants.issuestockDeleteConfirmationMessage;
        this.$scope.unmatchedItemResolvedCollection = stringConstants.unmatchedItemResolvedCollection;
        this.$rootScope.$on("innventoryMonitering", (event, data) => {
            if (location.hash === data.MoniterPath) {
                this.viewIssueInventoryMoniterDetails(data.IssueInventoryId);
            } else {
                this.$log.log("Invalid Url");
            }
        });
        this.$scope.reviewIssueStockInventoryById = (issueInventoryDetails: Model.IssueInventoryAc) => this.reviewIssueStockInventoryById(issueInventoryDetails);
        this.$scope.issueStockInventoryApprovalById = (issueInventoryDetails: Model.IssueInventoryAc, status: boolean) => this.issueStockInventoryApprovalById(issueInventoryDetails, status);
        this.$scope.submitIssueStockInventoryDetails = (issueInventoryDetails: Model.IssueInventoryAc) => this.submitIssueStockInventoryDetails(issueInventoryDetails);
        this.$scope.reSubmitIssueStockInventory = (issueInventoryDetails: Model.IssueInventoryAc, status: boolean) => this.reSubmitIssueStockInventory(issueInventoryDetails, status);
        this.$scope.inventoryItemCollection = [];
        this.$scope.isDataLoading = false;
        this.$scope.updateIssueInventoryDate = (issueInventoryDetails) => this.updateIssueInventoryDate(issueInventoryDetails);
        this.$scope.openStartDateFromModel = (event: any) => this.openStartDateFromModel(event);
        this.$scope.isOpenStartDateFromModel = false;
        this.$scope.serchSupllierDetails = () => this.serchSupllierDetails();
        this.$scope.serchCategoryDetails = () => this.serchCategoryDetails();
        this.$scope.supplierErrorMessage = false;
        this.$scope.categoryErrorMessage = false;
        this.$scope.itemErrorMessage = false;
        this.$scope.serchItemDetails = () => this.serchItemDetails();
        this.$scope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "" };
        this.$scope.minStartDate = new Date();
        this.$scope.submitStockInventory = () => this.submitStockInventory();
        this.$scope.updateIssueStockInventoryDate = () => this.updateIssueStockInventoryDate();
        this.$scope.getUnmatchedItemListById = (issueStockInventoryId: number) => this.getUnmatchedItemListById(issueStockInventoryId);
        this.$scope.unmatchedItemCollection = [];
        this.$scope.unmatchedItemErrorMessage = false;
        this.$scope.closeUnmatchedItemDetailsModelDialogBox = () => this.closeUnmatchedItemDetailsModelDialogBox();
        this.$scope.closeupdateInventoryDateDetailDialogBox = () => this.closeupdateInventoryDateDetailDialogBox();
        this.$scope.isDateAlreadyExist = false;
        this.$scope.isCurrentDateAlreadyExist = false;
        this.$scope.isFullInventoryAlreadyExist = false;
        this.$scope.inventoryErrorMessage = "";
        this.$scope.branchModel = [];
        this.$scope.isBranchConflict = false;
        this.$scope.checkConflictBranchSelectedOrNot = () => this.checkConflictBranchSelectedOrNot();
        this.$scope.submitConflictBranchIssueInventory = (issueInventoryDetails: Model.IssueInventoryAc) => this.submitConflictBranchIssueInventory(issueInventoryDetails);
        this.$scope.issueInventoryDetails.StartingDate = new Date();
        this.$scope.isAllowToReRecord = false;
        this.$scope.reRecordSelectedItemDetails = () => this.reRecordSelectedItemDetails();
        this.$scope.issueInventoryUnmatchedItem = new Model.IssueInventoryUnmatchedItemAc();
        this.$scope.checkRerecordItem = () => this.checkRerecordItem();
        this.$scope.clearIssueInventory = () => this.clearIssueInventory();
        this.initialize();
    }

    private initialize() {
        this.getBranchList();
        this.getSupplierList();
        this.getCateGoryList();

    }

    //this method used for issue date to date Picker 
    private openStartDateFromModel(event) {
        let controllerScope = this.$scope;
        event.preventDefault();
        event.stopPropagation();
        controllerScope.isOpenStartDateFromModel = true;

    }


    private getAllInvetoryType() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.inventoryTypeCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllInvetoryType();
        promise.then((result) => {
            if (result.length === 0) {
                controllerRootScope.isLoading = false;
            } else {
                this.$log.log("get inventory type succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.inventoryTypeCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }


    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerScope.supplierOtherCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.supplierErrorMessage = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            } else {
                controllerScope.supplierErrorMessage = false;
                this.$log.log("get supplier succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }

                controllerScope.supplierOtherCollection = controllerScope.supplierCollection;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private getAllSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerScope.supplierOtherCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.supplierErrorMessage = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            } else {
                controllerScope.supplierErrorMessage = false;
                this.$log.log("get supplier succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }

                controllerScope.supplierOtherCollection = controllerScope.supplierCollection;
                controllerRootScope.isLoading = false;
                this.openModelDialogBox();
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private getAllCateGoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.categoryCollection = [];
        controllerScope.categoryOtherCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllCateGoryList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.errorMessage = stringConstants.errorMessage;
            } else {
                controllerScope.isErrorMessageDisplay = false;
                this.$log.log("get category succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryCollection.push(result[i]);
                }
                controllerScope.categoryOtherCollection = controllerScope.categoryCollection;
                controllerRootScope.isLoading = false;
                this.openModelDialogBox();
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private getCateGoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.categoryCollection = [];
        controllerScope.categoryOtherCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllCateGoryList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.errorMessage = stringConstants.errorMessage;
            } else {
                controllerScope.isErrorMessageDisplay = false;
                this.$log.log("get category succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryCollection.push(result[i]);
                }
                controllerScope.categoryOtherCollection = controllerScope.categoryCollection;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        //To get branch list
        let promise = this.issueStockInventoryService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name, BranchId: result[i].Id });
                }
                this.$log.log("get branch list successfully");
                this.getAllInvetoryType();
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

    private changeInventoryType(inventoryType) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isIssueButtonDisabled = true;
        controllerScope.inventoryItemCollection = [];
        controllerScope.issueInventoryDetails.CategoryId = "";
        controllerScope.issueInventoryDetails.SupplierId = "";
        controllerScope.issueInventoryDetails.Barcode = "";
        for (let i = 0; i < controllerScope.inventoryTypeCollection.length; i++) {
            if (controllerScope.inventoryTypeCollection[i].ParamTypeId === inventoryType) {
                if (controllerScope.inventoryTypeCollection[i].ValueEn === "Supplier Inventory") {
                    controllerScope.isSupplierPanelVisible = true;
                    controllerScope.isCategoryPanelVisible = false;
                    controllerScope.isItemPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getAllSupplierList();
                    break;
                } else if (controllerScope.inventoryTypeCollection[i].ValueEn === "Category Inventory") {
                    controllerScope.isCategoryPanelVisible = true;
                    controllerScope.isItemPanelVisible = false;
                    controllerScope.isSupplierPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getAllCateGoryList();
                    break;
                } else if (controllerScope.inventoryTypeCollection[i].ValueEn === "Item Inventory") {
                    controllerScope.isItemPanelVisible = true;
                    controllerScope.isCategoryPanelVisible = false;
                    controllerScope.isSupplierPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getAllItemList();
                    break;
                } else {
                    controllerScope.isItemPanelVisible = false;
                    controllerScope.isCategoryPanelVisible = false;
                    controllerScope.isIssueButtonDisabled = false;
                    controllerScope.isSupplierPanelVisible = false;
                    controllerRootScope.ParamId = controllerScope.inventoryTypeCollection[i].ParamTypeId;
                    this.getItemDetailsById(controllerRootScope.ParamId, 0);
                    break;
                }
            }
        }
    }

    private openModelDialogBox() {
        this.inventoryDetailModelDialogBox = this.$modal.open({
            templateUrl: 'inventoryTypeDetails',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            scope: this.$scope
        });
    }

    private closeInventoryDetailDialogBox() {
        this.inventoryDetailModelDialogBox.dismiss('cancel');
    }

    private getAllItemList() {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        controllerScope.itemCollection = [];
        controllerScope.subItemCollection = [];
        controllerScope.itemOtherCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        let promise = this.issueStockInventoryService.getItemProfileList();
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.isItemGrid = true;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].IsActive)
                            result[i].IsActive = stringConstants.yes;
                        else
                            result[i].IsActive = stringConstants.no;
                        if (result[i].listOfChildProfileAC !== null && result[i].listOfChildProfileAC !== undefined) {
                            for (let j = 0; j < result[i].listOfChildProfileAC.length; j++) {
                                if (result[i].listOfChildProfileAC[j].IsActive)
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.yes;
                                else
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.no;
                            }
                        }
                        controllerScope.itemCollection.push(result[i]);
                    }

                    controllerScope.itemOtherCollection = controllerScope.itemCollection;
                    controllerScope.isDataLoading = false;
                    this.openModelDialogBox();
                }
                else {
                    controllerScope.itemErrorMessage = true;
                    controllerScope.isItemGrid = false;
                    controllerScope.isDataLoading = false;
                }
            }
            else {
                controllerScope.itemErrorMessage = true;
                controllerScope.isItemGrid = false;
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

    private getSubItemList(parentId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {//to check click on pluse or minus icon.
            angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
            angular.element("#subChild" + parentId).removeClass('isHide').addClass('isShowRow');
            angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
        }
        else {
            angular.element("#subChild" + parentId).removeClass('isShowRow').addClass('isHide');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
        }
        controllerRootScope.isLoading = false;
    }

    private addSupplierName(supplierId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails.SupplierId = supplierId;
        controllerScope.issueInventoryDetails.CategoryId = "";
        controllerScope.issueInventoryDetails.Barcode = "";
        controllerScope.isIssueButtonDisabled = false;
        this.getItemDetailsById(controllerRootScope.ParamId, supplierId);
        this.closeInventoryDetailDialogBox();
    }

    private addItemBarcode(barcode, detailsId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails.Barcode = barcode;
        controllerScope.issueInventoryDetails.SupplierId = "";
        controllerScope.issueInventoryDetails.CategoryId = "";
        controllerScope.isIssueButtonDisabled = false;
        this.getItemDetailsById(controllerRootScope.ParamId, detailsId);
        this.closeInventoryDetailDialogBox();
    }

    private addCategoryName(categoryId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails.CategoryId = categoryId;
        controllerScope.issueInventoryDetails.SupplierId = "";
        controllerScope.issueInventoryDetails.Barcode = "";
        controllerScope.isIssueButtonDisabled = false;
        this.getItemDetailsById(controllerRootScope.ParamId, categoryId);
        this.closeInventoryDetailDialogBox();
    }

    private submitIssueStockInventory(issueInventoryDetails) {
        let that = this;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isBranchConflict = false;
        this.$log.log("submit issue stockinventory", issueInventoryDetails);
        issueInventoryDetails.StartingDate = new Date(issueInventoryDetails.StartingDate.getFullYear(), issueInventoryDetails.StartingDate.getMonth(), issueInventoryDetails.StartingDate.getDate(), issueInventoryDetails.StartingDate.getHours(), issueInventoryDetails.StartingDate.getMinutes());
        issueInventoryDetails.BranchList = controllerScope.branchModel;
        let promise = this.issueStockInventoryService.submitIssueStockInventory(issueInventoryDetails);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            this.$log.log("submit issue stock inventory successfully", result);
            if (result.CompletedStatus === "Branch conflict") {
                controllerScope.isBranchConflict = true;
                controllerScope.issueInventoryDetails.BranchList = result.BranchList;
            }
            else {
                that.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.initiateInventory
                    });
                controllerScope.isDisplayItemDetails = false;
                this.$location.path("/StockInventory/");
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

    private addIssueStockInventory() {
        this.$location.path("/IssueStockInventory/");
    }

    private getAllInventoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryColletion = [];
        controllerScope.customInventoryCollection = [];
        let promise = this.issueStockInventoryService.getAllInventoryList();
        promise.then((result) => {
            this.$log.log("get all incident report succssfully");
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            } else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.inventoryColletion.push(result[i]);
                }
                controllerScope.customInventoryCollection = controllerScope.inventoryColletion;
                controllerScope.isDataLoading = false;
            }
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                this.$log.log(error);
            }
            this.$log.log(error);
        });
    }

    private searchIssueInventoryDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.inventoryColletion = this.filterFilter((controllerScope.customInventoryCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.inventoryColletion.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.search = new Model.IssueInventoryAc();
        } else {
            controllerScope.search = new Model.IssueInventoryAc();
            controllerScope.errorMessageDisplayForBlankList = false;
        }
    }

    private deleteIssueStockInventoryById(issueInventoryId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.deleteIssueStockInventoryById(issueInventoryId);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            this.$log.log("delete issue stock inventory request successfully");
            this.closeIssueInventoryDeleteDialogBox();
            this.getAllInventoryList();
        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private viewIssueStockInventoryDetailsById() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let issueInventoryId = this.$routeParams.id;
        controllerScope.isDataLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        let promise = this.issueStockInventoryService.viewIssueStockInventoryDetailsById(issueInventoryId);
        promise.then((result) => {
            controllerScope.issueInventoryDetails = result;
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private deleteIssueStockInventory(issueInventoryDetails) {
        let controllerScope = this.$scope;
        this.inventoryDeleteModelDialogBox = this.$modal.open({
            templateUrl: 'deleteIssueInventory',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        controllerScope.issueInventoryDetails = issueInventoryDetails;
    }

    private closeIssueInventoryDeleteDialogBox() {
        this.inventoryDeleteModelDialogBox.dismiss('cancel');
    }

    private viewIssueStockInventoryDetails(issueInventoryId) {
        this.$location.path("/InventoryInvestigation/" + issueInventoryId);
    }

    private viewIssueStockInventoryMoniterDetails(issueInventoryId) {
        this.$location.path("/InventoryMonitorDetails/" + issueInventoryId);
    }

    private viewIssueInventoryMoniterDetails(issueInventoryId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        let promise = this.issueStockInventoryService.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        promise.then((result) => {
            controllerScope.issueInventoryDetails = result;
            controllerScope.chartObject.type = "ColumnChart";

            let chartCollection = [];
            if (result.InventoryRecorderCollection !== null && result.InventoryRecorderCollection !== undefined) {
                controllerScope.isDispalyChartSection = true;
                for (let i = 0; i < result.InventoryRecorderCollection.length; i++) {
                    let chartobj: any = {};
                    chartobj.c = [];
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].UserName });
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].Process });
                    chartCollection.push(chartobj);
                }

                controllerScope.chartObject.data = {
                    "cols": [
                        { id: "t", label: stringConstants.ChartLabelUsername, type: "string" },
                        { id: "s", label: stringConstants.ChartLabelQtyProgress, type: "number" }
                    ],
                    "rows": chartCollection
                };
            } else {
                this.$log.log("No Record Found");
                controllerScope.isDispalyChartSection = false;
            }
            this.$log.log("get the issue inventory detail succssfully");
        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private viewInventoryMoniterDetails(issueInventoryId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        let promise = this.issueStockInventoryService.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        promise.then((result) => {
            controllerScope.issueInventoryDetails = result;
            controllerScope.chartObject.type = "ColumnChart";
            let chartCollection = [];
            if (result.InventoryRecorderCollection !== null && result.InventoryRecorderCollection !== undefined) {
                controllerScope.isDispalyChartSection = true;
                for (let i = 0; i < result.InventoryRecorderCollection.length; i++) {
                    let chartobj: any = {};
                    chartobj.c = [];
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].UserName });
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].Process });
                    chartCollection.push(chartobj);
                }
                controllerScope.chartObject.data = {
                    "cols": [
                        { id: "t", label: stringConstants.ChartLabelUsername, type: "string" },
                        { id: "s", label: stringConstants.ChartLabelQtyProgress, type: "number" }
                    ],
                    "rows": chartCollection
                };
            } else {
                this.$log.log("No Record Found");
                controllerScope.isDispalyChartSection = false;
            }
            controllerRootScope.isLoading = false;
            this.$log.log("get the issue inventory detail succssfully");
        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private viewIssueStockInventoryMoniterDetailsById() {
        let issueInventoryId = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        let promise = this.issueStockInventoryService.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        promise.then((result) => {
            controllerScope.issueInventoryDetails = result;
            controllerScope.chartObject.type = "ColumnChart";
            let chartCollection = [];
            if (result.InventoryRecorderCollection !== null && result.InventoryRecorderCollection !== undefined) {
                controllerScope.isDispalyChartSection = true;
                for (let i = 0; i < result.InventoryRecorderCollection.length; i++) {
                    let chartobj: any = {};
                    chartobj.c = [];
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].UserName });
                    chartobj.c.push({ v: result.InventoryRecorderCollection[i].Process });
                    chartCollection.push(chartobj);
                }
                controllerScope.chartObject.data = {
                    "cols": [
                        { id: "t", label: stringConstants.ChartLabelUsername, type: "string" },
                        { id: "s", label: stringConstants.ChartLabelQtyProgress, type: "number" }

                    ], "rows": chartCollection
                };
            } else {
                controllerScope.isDispalyChartSection = false;
                this.$log.log("No Record Found");
            }
            controllerScope.isDataLoading = false;
            this.$log.log("get the issue inventory detail succssfully");
        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private cancelIssueInventory() {
        let that = this;
        let currentPath = that.$location.path().split('/');
        if (currentPath[1] === "InventoryMonitor") {
            this.$location.path("/InventoryMonitorWorkList/");
        } else {
            this.$location.path("/StockInventory/");
        }
    }

    private startIssueStockInventory(issueInventoryId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.startIssueStockInventory(issueInventoryId);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            this.$log.log("start issue stock inventory request successfully");
            this.$location.path("/StockInventory/");
        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private submitIssueStockInventoryDetails(issueInventoryDetails) {
        let controllerScope = this.$scope;
        let that = this;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.submitIssueStockInventoryDetails(issueInventoryDetails);
        promise.then((result) => {
            this.$log.log("submit issue stock inventory successfully", result);
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            }
            else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            }
            else {
                that.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.submitInventory
                    });
                that.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;

        }).catch((error) => {
            this.$log.log(error);
            location.replace(this.apiPath);
        });
    }

    private reviewIssueStockInventoryById(issueInventoryDetails) {
        let controllerScope = this.$scope;
        let that = this;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.reviewIssueStockInventoryById(issueInventoryDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            } else {
                that.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.reviewIssueInventory
                    });
                that.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$log.log(error);
        });
    }

    private issueStockInventoryApprovalById(issueInventoryDetails, status) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        issueInventoryDetails.IsStatus = status;
        let promise = this.issueStockInventoryService.issueStockInventoryApprovalById(issueInventoryDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            } else {
                if (status) {
                    this.ngToast.create(
                        {
                            className: 'success',
                            content: stringConstants.approvalIssueInventory
                        });
                } else {
                    this.ngToast.create(
                        {
                            className: 'success',
                            content: stringConstants.rejectIssueInventory
                        });
                }
                this.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$log.log(error);
        });
    }

    private getItemDetailsById(paramId, detailsId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.inventoryItemCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getItemDetailsById(paramId, detailsId);
        promise.then((result) => {
            this.$log.log("get item details successfully", result);
            if (result.length !== 0) {
                controllerScope.isDisplayItemDetails = true;
                for (let i = 0; i < result.length; i++) {
                    controllerScope.inventoryItemCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            } else {
                controllerScope.isDisplayItemDetails = false;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private reSubmitIssueStockInventory(issueInventoryDetails, status) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        issueInventoryDetails.IsStatus = status;
        let promise = this.issueStockInventoryService.reSubmitIssueStockInventory(issueInventoryDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            } else {
                this.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.reviewIssueInventory
                    });
                this.cancelIssueInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$log.log(error);
        });
    }

    private updateIssueInventoryDate(issueInventoryDetails) {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        let startDate = new Date(issueInventoryDetails.StartDate);
        controllerScope.isDateAlreadyExist = false;
        controllerScope.isCurrentDateAlreadyExist = false;
        controllerScope.isFullInventoryAlreadyExist = false;
        if (issueInventoryDetails.StartedDate === startDate.toLocaleDateString().split("/").join("-")) {
            controllerScope.isDataLoading = false;
            return;
        } else {
            issueInventoryDetails.StartDate = new Date(issueInventoryDetails.StartDate.getFullYear(), issueInventoryDetails.StartDate.getMonth(), issueInventoryDetails.StartDate.getDate(), issueInventoryDetails.StartDate.getHours(), issueInventoryDetails.StartDate.getMinutes());
            let promise = this.issueStockInventoryService.updateIssueInventoryDate(issueInventoryDetails);
            promise.then((result) => {
                this.$log.log("update date successfully", result);
                this.$log.log("submit issue stock inventory successfully", result);
                if (result.status === "Already Exist") {
                    controllerScope.isDateAlreadyExist = true;
                    this.openUpdateInventoryDateDetailDialogBox();
                    controllerScope.inventoryErrorMessage = stringConstants.dateAlreadyExist;
                }
                else if (result.status === "Current Date Already Exist") {
                    controllerScope.isCurrentDateAlreadyExist = true;
                    controllerScope.inventoryErrorMessage = stringConstants.currentDateAlreadyExist;
                }
                else if (result.status === "FullInventory Exist") {
                    controllerScope.isFullInventoryAlreadyExist = true;
                    controllerScope.inventoryErrorMessage = stringConstants.fullInventoryAlreadyExist;
                }
                else {
                    this.viewIssueStockInventoryMoniterDetailsById();
                }
                controllerScope.isDataLoading = false;

            }).catch((error) => {
                if (error.data === "") {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
                this.$log.log(error);
            });
        }
    }

    private openUpdateInventoryDateDetailDialogBox() {
        this.updateInventoryDateDetailsModel = this.$modal.open({
            templateUrl: 'updateInventoryDateDetails',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
    }

    private serchSupllierDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.supplierCollection = this.filterFilter((controllerScope.supplierOtherCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.supplierCollection.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.supplierErrorMessage = true;
            controllerScope.search = [];
        } else {
            controllerScope.search = [];
            controllerScope.supplierErrorMessage = false;
        }
    }

    private serchCategoryDetails() {
        let controllerScope = this.$scope;
        controllerScope.categoryCollection = this.filterFilter((controllerScope.categoryOtherCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.categoryCollection.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.categoryErrorMessage = true;
            controllerScope.search = [];
        } else {
            controllerScope.search = [];
            controllerScope.categoryErrorMessage = false;
        }
    }

    private serchItemDetails() {
        let searching = [];
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.itemErrorMessage = false;

        //create sub Item Search List;
        let subItemSearch = [];
        if (controllerScope.itemOtherCollection.length > 0) {
            for (let i = 0; i < controllerScope.itemOtherCollection.length; i++) {
                if (controllerScope.itemOtherCollection[i].listOfChildProfileAC !== null && controllerScope.itemOtherCollection[i].listOfChildProfileAC !== undefined) {
                    for (let j = 0; j < controllerScope.itemOtherCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.itemOtherCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }

        if (controllerScope.itemSearch.ItemNameEn !== "" || controllerScope.itemSearch.Barcode !== "" || controllerScope.itemSearch.Code !== "") {
            searching = this.filterFilter((subItemSearch), controllerScope.itemSearch);
            controllerScope.itemCollection = this.filterFilter((controllerScope.itemOtherCollection), controllerScope.itemSearch);
        }
        else {
            controllerScope.itemCollection = controllerScope.itemOtherCollection;
        }

        if (controllerScope.itemCollection.length === 0 && searching.length === 0) {
            controllerScope.itemErrorMessage = true;
            controllerScope.isItemGrid = false;
        }
        else {
            if (searching !== undefined && searching !== null && searching.length !== 0) {
                for (let i = 0; i < controllerScope.itemOtherCollection.length; i++) {
                    for (let j = 0; j < searching.length; j++) {
                        if (controllerScope.itemOtherCollection[i].Id === searching[j].ParentItemId) {
                            let isAlreadyExists = true;
                            for (let k = 0; k < controllerScope.itemCollection.length; k++) {
                                if (controllerScope.itemCollection[k].Id === controllerScope.itemOtherCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemCollection.push(controllerScope.itemOtherCollection[i]);
                        }
                    }
                }
            }
            controllerScope.itemErrorMessage = false;
            controllerScope.isItemGrid = true;
        }
        controllerScope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "" };
    }

    private submitStockInventory() {
        let that = this;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let issueInventoryDetails = controllerScope.issueInventoryDetails;
        let promise = this.issueStockInventoryService.submitStockInventory(issueInventoryDetails);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            this.$log.log("submit issue stock inventory successfully", result);
            this.$location.path("/StockInventory/");
            controllerScope.isDisplayItemDetails = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private submitConflictBranchIssueInventory(issueInventoryDetails) {
        let that = this;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        let promise = this.issueStockInventoryService.submitConflictBranchIssueInventory(issueInventoryDetails);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            this.$log.log("submit issue stock inventory successfully", result);
            this.$location.path("/StockInventory/");
            controllerScope.isDisplayItemDetails = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
    private closeupdateInventoryDateDetailDialogBox() {
        let that = this;
        let controllerScope = this.$scope;
        that.updateInventoryDateDetailsModel.dismiss('cancel');
        if (controllerScope.isFullInventoryAlreadyExist || controllerScope.isCurrentDateAlreadyExist || controllerScope.isDateAlreadyExist) {
            this.viewIssueStockInventoryMoniterDetailsById();
        }
    }


    private updateIssueStockInventoryDate() {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        let issueInventoryDetails = controllerScope.issueInventoryDetails;
        issueInventoryDetails.StartDate = new Date(issueInventoryDetails.StartDate.getFullYear(), issueInventoryDetails.StartDate.getMonth(), issueInventoryDetails.StartDate.getDate(), issueInventoryDetails.StartDate.getHours(), issueInventoryDetails.StartDate.getMinutes());

        let promise = this.issueStockInventoryService.updateIssueStockInventoryDate(issueInventoryDetails);
        promise.then((result) => {
            this.$log.log("update date successfully", result);
            controllerScope.isDateAlreadyExist = false;
            controllerScope.isCurrentDateAlreadyExist = false;
            controllerScope.isFullInventoryAlreadyExist = false;

            this.viewIssueStockInventoryMoniterDetailsById();
            this.closeupdateInventoryDateDetailDialogBox();
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$log.log(error);
        });
    }

    private getUnmatchedItemListById(issueStockInventoryId) {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        controllerScope.unmatchedItemCollection = [];
        let promise = this.issueStockInventoryService.getUnmatchedItemListById(issueStockInventoryId);
        promise.then((result) => {
            this.$log.log("get unmatchde item successfully", result);
            if (result.length === 0) {
                controllerScope.unmatchedItemErrorMessage = true;
            } else {
                controllerScope.unmatchedItemErrorMessage = false;
                controllerScope.isAllowToReRecord = result.IsRerecord;
                for (let i = 0; i < result.UnmatchedItemCollection.length; i++) {
                    controllerScope.unmatchedItemCollection.push(result.UnmatchedItemCollection[i]);
                }
            }
            this.unmatchedItemModelDialogBox = this.$modal.open({
                templateUrl: 'unmatchedItemDetails',
                backdrop: 'static',
                keyboard: true,
                scope: this.$scope,
                size: 'lg'
            });
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$log.log(error);
        });
    }

    private reRecordSelectedItemDetails() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let issueInventoryUnmatchedItem = controllerScope.issueInventoryUnmatchedItem;
        issueInventoryUnmatchedItem.IsRerecord = controllerScope.isAllowToReRecord;
        issueInventoryUnmatchedItem.UnmatchedItemCollection = controllerScope.unmatchedItemCollection;
        let promise = this.issueStockInventoryService.reRecordSelectedItemDetails(issueInventoryUnmatchedItem);
        promise.then((result) => {
            this.$log.log("re-record successfully", result);
            this.closeUnmatchedItemDetailsModelDialogBox();
            controllerRootScope.isLoading = false;
            this.$location.path("/InventoryRecorder/" + this.$routeParams.id);
        });
    }

    private closeUnmatchedItemDetailsModelDialogBox() {
        this.unmatchedItemModelDialogBox.dismiss('cancel');
    }

    private checkConflictBranchSelectedOrNot() {
        let flag = false;
        let controllerScope = this.$scope;
        if (controllerScope.isBranchConflict) {
            if (controllerScope.issueInventoryDetails.BranchList.length !== 0) {
                for (let i = 0; i < controllerScope.issueInventoryDetails.BranchList.length; i++) {
                    if (!controllerScope.issueInventoryDetails.BranchList[i].IsAlreadyExist) {
                        if (controllerScope.issueInventoryDetails.BranchList[i].IsInventorySelected === true && controllerScope.issueInventoryDetails.BranchList[i].IsInventorySelected !== undefined
                            && controllerScope.issueInventoryDetails.BranchList[i].IsInventorySelected !== null) {
                            flag = true;
                            break;
                        }
                        else {
                            flag = false;
                        }
                    }
                }
            }
            return flag;
        }
    }

    private checkRerecordItem() {
        let flag = false;
        let controllerScope = this.$scope;
        if (controllerScope.unmatchedItemCollection.length !== 0) {
            for (let i = 0; i < controllerScope.unmatchedItemCollection.length; i++) {
                if (controllerScope.unmatchedItemCollection[i].IsRerecord === true && controllerScope.unmatchedItemCollection[i].IsRerecord !== undefined
                    && controllerScope.unmatchedItemCollection[i].IsRerecord !== null) {
                    flag = true;
                    break;
                }
                else {
                    flag = false;
                }
            }
        }
        return flag;
    }

    private clearIssueInventory() {
        this.$route.reload();
    }
}

app.controller(IssueStockInventoryController.controllerId, ['$scope', '$log', '$location', 'issueStockInventoryService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', '$route', ($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, $route) => {
    return new IssueStockInventoryController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, $route);
}]);

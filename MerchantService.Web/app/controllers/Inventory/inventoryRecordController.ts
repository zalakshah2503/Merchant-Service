// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IinventoryRecordControllerScope extends ng.IScope {
    supplierCollection: any;
    isErrorMessageDisplay: boolean;
    errorMessage: string;
    categoryCollection: any;
    branchList;
    inventoryColletion: any;
    errorMessageDisplayForBlankList: boolean;
    inventoryTypeCollection: any;
    getAllInvetoryType: Function;
    issueInventoryDetails: Model.IssueInventoryAc;
    getAllInventoryList: () => void;
    cancelIssueInventory: () => void;
    viewIssueStockInventoryRecordDetailsById: Function;
    itemSearchCollection: any;
    customInventoryCollection: any;
    search: any;
    getInventoryRecorderDetailsById: Function;
    getItemListByIssueInventoryId: Function;
    itemCollection: any;
    closeItemDetailModelDialogBox: Function;
    searchIssueInventoryDetails: Function;
    getItemDetailsByItemBarcode: Function;
    isDisabledItemDetails: boolean;
    isDialogBoxOpen: boolean;
    addIssueInventoryRecordDetails: Function;
    serchItemDetails: Function;
    isAllowEnterKey: boolean;
    closeUnmatchedItemWarnigDialogBox: Function;
    unmatchedItemDetails: any;
    isDataLoading: boolean;
    itemErrorMessage: boolean;
    getSubItemList: Function;
    itemSearch: any;
    inventoryRecordErrorMessage: boolean;
    noItemFound: any;
    validQuantityError: any;
    itemBarcodeValid: any;
    validBaseUnitCount: any;
    noRecordFound: any;
}

interface IinventoryRecordController {

}


class InventoryRecordController implements IinventoryRecordController {
    static controllerId = "inventoryRecordController";
    public itemDetailsModelDialogBox;
    public openUnmatchedItemWarnigDialogBox;
    constructor(private $scope: IinventoryRecordControllerScope, private $log: ng.ILogService, private $location: ng.ILocationService, private issueStockInventoryService: IssueStockInventoryService, public $rootScope, public $routeParams, private apiPath, public $modal, public filterFilter, public ngToast, private inventoryHubServices) {

        this.$scope.getAllInvetoryType = () => this.getAllInvetoryType();
        this.$scope.inventoryTypeCollection = [];
        this.$scope.issueInventoryDetails = new Model.IssueInventoryAc();
        this.$scope.supplierCollection = [];
        this.$scope.categoryCollection = [];
        this.$scope.isErrorMessageDisplay = false;
        this.$scope.errorMessage = "";
        this.$scope.branchList = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.getAllInventoryList = () => this.getAllInventoryList();
        this.$scope.viewIssueStockInventoryRecordDetailsById = (issueInventoryId: number) => this.viewIssueStockInventoryRecordDetailsById(issueInventoryId);
        this.$scope.cancelIssueInventory = () => this.cancelIssueInventory();
        this.$scope.itemSearchCollection = [];
        this.$scope.customInventoryCollection = [];
        this.$scope.search = new Model.IssueInventoryAc();
        this.$scope.getInventoryRecorderDetailsById = () => this.getInventoryRecorderDetailsById();
        this.$scope.getItemListByIssueInventoryId = (issueInventoryId: number) => this.getItemListByIssueInventoryId(issueInventoryId);
        this.$scope.itemCollection = [];
        this.$scope.closeItemDetailModelDialogBox = () => this.closeItemDetailModelDialogBox();
        this.$scope.searchIssueInventoryDetails = () => this.searchIssueInventoryDetails();
        this.$scope.getItemDetailsByItemBarcode = (issueInventoryDetails: Model.IssueInventoryAc) => this.getItemDetailsByItemBarcode(issueInventoryDetails);
        this.$scope.isDisabledItemDetails = true;
        this.$scope.isDialogBoxOpen = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.$scope.itemBarcodeValid = stringConstants.itemBarcodeValid;
        this.$scope.validBaseUnitCount = stringConstants.validBaseUnitCount;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.$scope.serchItemDetails = () => this.serchItemDetails();
        this.$scope.$on("addIssueInventoryRecord", (event, data) => {
            this.addIssueInventoryRecordDetails();
            this.$log.log("broadcast issue inventory record");
        });
        this.$scope.isAllowEnterKey = true;
        this.$scope.closeUnmatchedItemWarnigDialogBox = () => this.closeUnmatchedItemWarnigDialogBox();
        this.$scope.unmatchedItemDetails = "";
        this.$scope.isDataLoading = false;
        this.$scope.issueInventoryDetails.Quantity = "";
        this.$scope.itemErrorMessage = false;
        this.$scope.getSubItemList = (parentId: number) => this.getSubItemList(parentId);
        this.$scope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
        this.$scope.inventoryRecordErrorMessage = false;
        this.initialize();
    }

    private initialize() {
        this.getAllSupplierList();
        this.getBranchList();
    }

    private getAllSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            } else {
                controllerScope.isErrorMessageDisplay = false;
                this.$log.log("get supplier succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }
                this.getAllCateGoryList();
                controllerRootScope.isLoading = false;
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
        controllerScope.branchList = [];
        //To get branch list
        let promise = this.issueStockInventoryService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ BranchId: result[i].Id, Name: result[i].Name });
                }
                this.getAllInvetoryType();
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

    private getAllInventoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryColletion = [];
        controllerScope.customInventoryCollection = [];
        let promise = this.issueStockInventoryService.getAllInventoryRecorderList();
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

    private serchItemDetails() {
        let searching = [];
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.itemErrorMessage = false;

        //create sub Item Search List;
        let subItemSearch = [];
        if (controllerScope.itemSearchCollection.length > 0) {
            for (let i = 0; i < controllerScope.itemSearchCollection.length; i++) {
                if (controllerScope.itemSearchCollection[i].listOfChildProfileAC !== null && controllerScope.itemSearchCollection[i].listOfChildProfileAC !== undefined) {
                    for (let j = 0; j < controllerScope.itemSearchCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.itemSearchCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }
        if (controllerScope.itemSearch.ItemNameEn !== "" || controllerScope.itemSearch.Barcode !== "" || controllerScope.itemSearch.Code !== "" || controllerScope.itemSearch.FlavourEn !== "") {
            searching = this.filterFilter((subItemSearch), controllerScope.itemSearch);
            controllerScope.itemCollection = this.filterFilter((controllerScope.itemSearchCollection), controllerScope.itemSearch);
        }
        else {
            controllerScope.itemCollection = controllerScope.itemSearchCollection;
        }

        if (controllerScope.itemCollection.length === 0 && searching.length === 0) {
            controllerScope.itemErrorMessage = true;
        }
        else {
            if (searching !== undefined && searching !== null && searching.length !== 0) {
                for (let i = 0; i < controllerScope.itemSearchCollection.length; i++) {
                    for (let j = 0; j < searching.length; j++) {
                        if (controllerScope.itemSearchCollection[i].Id === searching[j].ParentItemId) {
                            let isAlreadyExists = true;
                            for (let k = 0; k < controllerScope.itemCollection.length; k++) {
                                if (controllerScope.itemCollection[k].Id === controllerScope.itemSearchCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemCollection.push(controllerScope.itemSearchCollection[i]);
                        }
                    }
                }
            }
            controllerScope.itemErrorMessage = false;
        }
        controllerScope.itemSearch = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
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
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                controllerRootScope.isLoading = false;
                this.$log.log(error);
            }
            this.$log.log(error);
        });
    }

    private cancelIssueInventory() {
        let controllerScope = this.$scope;
        this.$location.path("/InventoryRecorderWorkList/");
    }

    private viewIssueStockInventoryRecordDetailsById(issueInventoryId) {
        let controllerScope = this.$scope;
        this.$location.path("/InventoryRecorder/" + issueInventoryId);
    }

    private getInventoryRecorderDetailsById() {
        let controllerScope = this.$scope;
        let issueInventoryId = this.$routeParams.id;
        controllerScope.isDataLoading = true;
        controllerScope.issueInventoryDetails = new Model.IssueInventoryAc();
        let promise = this.issueStockInventoryService.getInventoryRecorderDetailsById(issueInventoryId);
        promise.then((result) => {
            if (result.IsNullResult) {
                controllerScope.inventoryRecordErrorMessage = true;
            } else {
                controllerScope.inventoryRecordErrorMessage = false;
                controllerScope.issueInventoryDetails = result;
                controllerScope.issueInventoryDetails.Quantity = "";
                controllerScope.issueInventoryDetails.Barcode = "";
            }
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            this.$log.log(error);
        });
    }

    private getItemListByIssueInventoryId(issueInventoryId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;

        controllerRootScope.isLoading = true;
        controllerScope.itemCollection = [];
        controllerScope.itemSearchCollection = [];
        let promise = this.issueStockInventoryService.getItemListByIssueInventoryId(issueInventoryId);
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.itemErrorMessage = true;
                controllerRootScope.isLoading = false;
            } else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.itemCollection.push(result[i]);
                }
                controllerScope.itemErrorMessage = false;
                controllerScope.issueInventoryDetails.Barcode = "";
                controllerScope.issueInventoryDetails.ItemDetails = null;
                controllerScope.itemSearchCollection = controllerScope.itemCollection;
                this.itemDetailsModelDialogBox = this.$modal.open({
                    templateUrl: 'itemDetailsDialogBox',
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    scope: this.$scope
                });
                controllerScope.isDialogBoxOpen = true;
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                controllerRootScope.isLoading = false;
                this.$log.log(error);
            }
            this.$log.log(error);
        });
    }

    private closeItemDetailModelDialogBox() {
        this.itemDetailsModelDialogBox.dismiss('cancel');
        let controllerScope = this.$scope;
        controllerScope.issueInventoryDetails.Barcode = "";
    }

    private getItemDetailsByItemBarcode(barcode) {
        if (!(isNaN(barcode))) {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerScope.isDataLoading = true;
            controllerScope.issueInventoryDetails.Barcode = barcode;
            controllerScope.issueInventoryDetails.ItemDetails = null;
            let promise = this.issueStockInventoryService.getItemDetailsByItemBarcode(controllerScope.issueInventoryDetails);
            promise.then((result) => {
                if (controllerScope.isDialogBoxOpen) {
                    controllerScope.issueInventoryDetails.Barcode = "";
                    this.closeItemDetailModelDialogBox();
                }
                controllerScope.isDialogBoxOpen = false;
                if (result.IsResultNull) {
                    controllerScope.isDataLoading = false;
                    controllerScope.errorMessageDisplayForBlankList = true;
                    controllerScope.errorMessage = stringConstants.errorMessage;
                } else {
                    controllerScope.errorMessageDisplayForBlankList = false;
                    controllerScope.isDataLoading = false;
                    controllerScope.issueInventoryDetails.ItemDetails = result;
                    controllerScope.issueInventoryDetails.IsQuantityDisabled = false;
                    controllerScope.issueInventoryDetails.Barcode = result.Barcode;
                    this.$log.log("get item details Succssfully");
                }
            }).catch((error) => {
                location.replace(this.apiPath);
                this.$log.log(error);
            });
        }
    }

    private addIssueInventoryRecordDetails() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (controllerScope.issueInventoryDetails.Quantity !== "" && !isNaN(controllerScope.issueInventoryDetails.Quantity)) {
            if (controllerScope.isAllowEnterKey) {
                if (controllerScope.issueInventoryDetails.Barcode === null || controllerScope.issueInventoryDetails.Barcode === undefined || controllerScope.issueInventoryDetails.Barcode === "") {
                    this.ngToast.create(
                        {
                            className: 'danger',
                            content: stringConstants.SelectItemorBarcode
                        });
                }
                else {
                    controllerScope.isAllowEnterKey = false;
                    controllerRootScope.isLoading = true;
                    controllerScope.unmatchedItemDetails = "";
                    let promise = this.issueStockInventoryService.addIssueInventoryRecordDetails(controllerScope.issueInventoryDetails);
                    promise.then((result) => {
                        let moniterPath = "#/InventoryMonitor/" + controllerScope.issueInventoryDetails.IssueStockInventoryId;
                        this.$log.log("add issue inventory recored successfully", result);
                        this.inventoryHubServices.viewInventoryDetails(controllerScope.issueInventoryDetails.IssueStockInventoryId, moniterPath);
                        controllerScope.isAllowEnterKey = true;
                        controllerScope.issueInventoryDetails.ItemDetails.ItemRecordCount = result.ItemDetails.ItemRecordCount;
                        controllerScope.issueInventoryDetails.Quantity = "";
                        controllerRootScope.isLoading = false;
                    }).catch((error) => {
                        this.ngToast.create(
                            {
                                className: 'danger',
                                content: stringConstants.SelectItemorBarcode
                            });
                        this.$log.log(error);
                    });
                }
            }

        } else {
            return;
        }

    }

    private closeUnmatchedItemWarnigDialogBox() {
        this.openUnmatchedItemWarnigDialogBox.dismiss('cancel');
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
}

app.controller(InventoryRecordController.controllerId, ['$scope', '$log', '$location', 'issueStockInventoryService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', 'inventoryHubServices', ($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, inventoryHubServices) => {
    return new InventoryRecordController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, inventoryHubServices);
}]);
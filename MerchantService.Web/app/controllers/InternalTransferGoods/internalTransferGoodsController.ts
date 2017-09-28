// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IinternalTransferGoodsControllerScope extends ng.IScope {
    getAllBranchList: Function;
    branchList: any;
    transferGoodsDetails: any;
    errorMessage: string;
    isDisplayErrorMessage: boolean;
    requestTypeCollection: any;
    isSearchButtonDisabled: boolean;
    changeBranchName: Function;
    getItemDetailsByItemBarcode: Function;
    errorMessageDisplayForBlankList: boolean;
    inventoryItemCollection: any;
    isBarcodeDisabled: boolean;
    isBranchDisabled: boolean;
    itemCollection: any;
    itemSearchDetails: Function;
    closeItemDetailModelDialogBox: Function;
    itemSearchCollection: any;
    search: any;
    errorItemMessage: boolean;
    getItemDetails: Function;
    serchItemDetails: Function;
    isReuestTypeDisabled: boolean;
    changeRequestType: Function;
    checkRequestQuantityForItems: Function;
    checkNullRequestQuantity: Function;
    submitInventoryTranserRequest: Function;
    closeItemValidationDialogBox: Function;
    removeItemFromTheItemCollection: Function;
    isDispalyItemTransferDetails: boolean;
    getAllInventoryTransferList: Function;
    inventoryTransferCollection: any;
    viewInternalTransferGoodDetailsById: Function;
    viewInternalTransferGoodDetails: Function;
    reviewTransferInventoryById: Function;
    transferInventoryApprovalById: Function;
    reSubmitTransferInventory: Function;
    cancelTransferInventory: Function;
    receiveTransferInventoryById: Function;
    searchInventoryDetails: Function;
    inventorySearchCollection: any;
    openIssueDateToModel: Function;
    isOpenIssueDateToModel: boolean;
    openIssueDateFromModel: Function;
    isOpenIssueDateFromModel: boolean;
    searchDate: any;
    tempList: any;
    initiateTransferInventory: Function;
    isDataLoading: boolean;
    branchCollection: any;
    isRequestDisabled: boolean;
    isDueDatePickerOpened: boolean;
    dueDatePickerOpen: Function;
    minStartDate: Date;
    changeReceiveingQuantity: Function;
    openDueDateToModel: Function;
    openDueDateFromModel: Function;
    isDueDateFromPickerOpened: boolean;
    isDueDateToPickerOpened: boolean;
    resolvedCollection: any;
    checkRejectedItemRequestQuantityForItems: Function;
    removeItemConfirmation: Function;
    closeRemoveItemConfirmationDialogBox: Function;
    itemIndex: number;
    checkReceiveItemQuantityForItems: Function;
    clearTransferInventory: Function;
    getSubItemList: Function;
    isItemGrid: boolean;
    itemDetails: any;
    checkRejectItemNullRequestQuantity: Function;
    IsSendInventory: boolean;
    itemId: number;
    searchTransfer: any;
    noItemFound: any;
    itemDeleteConfirmationMessage: any;
    noRecordFound: any;
    validQuantityError: any;
}

interface IinternalTransferGoodsController {

}



class InternalTransferGoodsController implements IinternalTransferGoodsController {
    static controllerId = "internalTransferGoodsController";
    public itemDetailsModelDialogBox;
    public itemValidationDialogBox;
    public openRemoveItemConfirmationDialogBox;
    constructor(private $scope: IinternalTransferGoodsControllerScope, private $log: ng.ILogService, private $location: ng.ILocationService, public $rootScope, public $routeParams, private apiPath, public $modal, public filterFilter, public ngToast, private internalTransferGoodService: InternalTransferGoodService, private issueStockInventoryService: IssueStockInventoryService, public printer, public $route) {
        this.$scope.branchList = [];
        this.$scope.getAllBranchList = () => this.getAllBranchList();
        this.$scope.transferGoodsDetails = new Model.InventoryTransferAc();
        this.$scope.errorMessage = "";
        this.$scope.isDisplayErrorMessage = false;
        this.$scope.requestTypeCollection = [];
        this.$scope.isSearchButtonDisabled = true;
        this.$scope.changeBranchName = (branchId: number) => this.changeBranchName(branchId);
        this.$scope.getItemDetailsByItemBarcode = (barcode: string) => this.getItemDetailsByItemBarcode(barcode);
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.inventoryItemCollection = [];
        this.$scope.isBarcodeDisabled = true;
        this.$scope.isBranchDisabled = false;
        this.$scope.closeItemDetailModelDialogBox = () => this.closeItemDetailModelDialogBox();
        this.$scope.itemSearchDetails = () => this.itemSearchDetails();
        this.$scope.itemSearchCollection = [];

        this.$scope.search = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
        this.$scope.searchTransfer = [];
        this.$scope.searchDate = new Model.InventoryTransferAc();
        this.$scope.errorItemMessage = false;
        this.$scope.getItemDetails = (barcode: string) => this.getItemDetails(barcode);
        this.$scope.serchItemDetails = () => this.serchItemDetails();
        this.$scope.isReuestTypeDisabled = true;
        this.$scope.changeRequestType = (branchId: number, requestTypeId: number) => this.changeRequestType(branchId, requestTypeId);
        this.$scope.checkRequestQuantityForItems = () => this.checkRequestQuantityForItems();
        this.$scope.checkNullRequestQuantity = (item: any) => this.checkNullRequestQuantity(item);
        this.$scope.submitInventoryTranserRequest = (transferGoodsDetails: Model.InventoryTransferAc) => this.submitInventoryTranserRequest(transferGoodsDetails);
        this.$scope.closeItemValidationDialogBox = () => this.closeItemValidationDialogBox();
        this.$scope.removeItemFromTheItemCollection = () => this.removeItemFromTheItemCollection();
        this.$scope.isDispalyItemTransferDetails = false;
        this.$scope.getAllInventoryTransferList = () => this.getAllInventoryTransferList();
        this.$scope.inventoryTransferCollection = [];
        this.$scope.viewInternalTransferGoodDetailsById = () => this.viewInternalTransferGoodDetailsById();
        this.$scope.viewInternalTransferGoodDetails = (inventoryTransferId: number) => this.viewInternalTransferGoodDetails(inventoryTransferId);
        this.$scope.cancelTransferInventory = () => this.cancelTransferInventory();

        this.$scope.reviewTransferInventoryById = (transferGoodsDetails: Model.InventoryTransferAc) => this.reviewTransferInventoryById(transferGoodsDetails);
        this.$scope.transferInventoryApprovalById = (transferGoodsDetails: Model.InventoryTransferAc, status: boolean) => this.transferInventoryApprovalById(transferGoodsDetails, status);
        this.$scope.reSubmitTransferInventory = (transferGoodsDetails: Model.InventoryTransferAc) => this.reSubmitTransferInventory(transferGoodsDetails);
        this.$scope.receiveTransferInventoryById = (transferGoodsDetails: Model.InventoryTransferAc) => this.receiveTransferInventoryById(transferGoodsDetails);
        this.$scope.searchInventoryDetails = () => this.searchInventoryDetails();
        this.$scope.inventorySearchCollection = [];
        this.$scope.openIssueDateToModel = (event) => this.openIssueDateToModel(event);
        this.$scope.isOpenIssueDateToModel = false;
        this.$scope.openIssueDateFromModel = (event) => this.openIssueDateFromModel(event);
        this.$scope.isOpenIssueDateFromModel = false;
        this.$scope.tempList = [];
        this.$scope.initiateTransferInventory = () => this.initiateTransferInventory();
        this.$scope.isDataLoading = false;
        this.$scope.branchCollection = [];
        this.$scope.isRequestDisabled = true;
        this.$scope.isDueDatePickerOpened = false;
        this.$scope.dueDatePickerOpen = (event: any) => this.dueDatePickerOpen(event);
        this.$scope.minStartDate = new Date();
        this.$scope.changeReceiveingQuantity = (itemInventoryTransferId: number) => this.changeReceiveingQuantity(itemInventoryTransferId);

        this.$scope.openDueDateToModel = (event: any) => this.openDueDateToModel(event);
        this.$scope.openDueDateFromModel = (event: any) => this.openDueDateFromModel(event);
        this.$scope.isDueDateFromPickerOpened = false;
        this.$scope.isDueDateToPickerOpened = false;
        this.$scope.resolvedCollection = stringConstants.unmatchedItemResolvedCollection;
        this.$scope.transferGoodsDetails.DueDate = new Date();
        this.$scope.checkRejectedItemRequestQuantityForItems = () => this.checkRejectedItemRequestQuantityForItems();
        this.$scope.removeItemConfirmation = (index: any, item) => this.removeItemConfirmation(index, item);
        this.$scope.closeRemoveItemConfirmationDialogBox = () => this.closeRemoveItemConfirmationDialogBox();
        this.$scope.itemIndex = 0;
        this.$scope.checkReceiveItemQuantityForItems = () => this.checkReceiveItemQuantityForItems();
        this.$scope.clearTransferInventory = () => this.clearTransferInventory();
        this.$scope.getSubItemList = (parenId: number) => this.getSubItemList(parenId);
        this.$scope.isItemGrid = false;
        this.$scope.checkRejectItemNullRequestQuantity = (item: any) => this.checkRejectItemNullRequestQuantity(item);
        this.$scope.IsSendInventory = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.itemDeleteConfirmationMessage = stringConstants.itemDeleteConfirmationMessage;
        this.$scope.itemId = 0;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialization();
    }

    private initialization() {
        this.getAllBranchList();
    }

    private itemSearchDetails() {
        this.itemDetailsModelDialogBox = this.$modal.open({
            templateUrl: 'itemSearchDialogBox',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
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

    private checkRequestQuantityForItems() {
        let flag = false;
        let controllerScope = this.$scope;
        if (controllerScope.inventoryItemCollection !== undefined && controllerScope.inventoryItemCollection !== null) {
            if (controllerScope.inventoryItemCollection.length > 0) {
                for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                    if (controllerScope.inventoryItemCollection[i].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[i].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[i].RequestQuantity !== null && !controllerScope.inventoryItemCollection[i].IsErrorMessage)
                        flag = true;
                    else {
                        flag = false;
                        break;
                    }
                }
            } else {
                controllerScope.isDispalyItemTransferDetails = false;
            }
        }
        return flag;
    }

    private checkRejectedItemRequestQuantityForItems() {
        let flag = true;
        let controllerScope = this.$scope;
        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer !== null) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer.length > 0) {
                if (controllerScope.transferGoodsDetails.IsReceiving) {
                    for (let i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== null)
                            flag = true;
                        else {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === undefined || controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === null) {
                                flag = false;
                                break;
                            } else {
                                flag = true;
                            }
                        }
                    }
                } else {
                    for (let j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== null && !controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage)
                            flag = true;
                        else {
                            flag = false;
                            break;
                        }
                    }
                }

            } else {
                controllerScope.isDispalyItemTransferDetails = false;
            }
        }
        return flag;
    }

    private checkRejectItemNullRequestQuantity(item) {
        let controllerScope = this.$scope;
        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer.length > 0) {
            let itemSystemQuantity = 0;
            for (let i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ItemId === item.ItemId) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== null && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== null) {
                        for (let j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ParentItemId === item.ParentItemId) {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== null) {
                                    itemSystemQuantity = itemSystemQuantity + (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity * controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                                }
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage = false;
                            }
                        }
                        this.updateRejectedItemQunatity(item);
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity < itemSystemQuantity) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsSendInventory) {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = true;
                            }
                            else {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                            }
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = false;
                        }
                        else {
                            if (itemSystemQuantity > controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity) {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsSendInventory) {
                                    if ((itemSystemQuantity - controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity) < controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].MinimumQunatity) {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = true;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = false;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                }
                                else {
                                    if ((itemSystemQuantity + controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity) > controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].MinimumQunatity) {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = true;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = false;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                }
                            }
                            else {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsSendInventory) {
                                    if ((controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity - itemSystemQuantity) < controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].MinimumQunatity) {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = true;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = false;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                }
                                else {
                                    if ((controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity + itemSystemQuantity) > controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].MinimumQunatity) {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = true;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsWarningMesssage = false;
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsErrorMessage = false;
                                    }
                                }
                            }
                        }
                    } else {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity = 0;
                        let itemSystemQuantity = 0;

                        for (let j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ParentItemId === item.ParentItemId) {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== null) {
                                    itemSystemQuantity = itemSystemQuantity + (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity * controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                                }
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage = false;

                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ItemId === item.ItemId) {
                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage = false;
                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsWarningMesssage = false;
                                }
                            }
                        }
                        this.updateRejectedItemQunatity(item);
                        for (let k = 0; k < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; k++) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].ItemId !== item.ItemId) {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].ParentItemId === item.ParentItemId) {
                                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity < itemSystemQuantity) {
                                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsSendInventory) {
                                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = true;
                                        }
                                        else {
                                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                        }
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                    }
                                    else {
                                        if (itemSystemQuantity > controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity) {
                                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsSendInventory) {
                                                if ((itemSystemQuantity - controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity) < controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = true;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((itemSystemQuantity + controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity) > controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].MinimumQunatity) {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = true;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                            }
                                        }
                                        else {
                                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsSendInventory) {
                                                if ((controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity - itemSystemQuantity) < controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].MinimumQunatity) {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = true;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity + itemSystemQuantity) > controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].MinimumQunatity) {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = true;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private updateRejectedItemQunatity(item) {
        //SystemQuantity
        let controllerScope = this.$scope;
        let itemCount = item.BaseUnitCount * item.RequestQuantity;
        let parentItemQunatity = 0;
        let isUpdateItemQuantity = false;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        //condition for sub-item
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ParentItemId === controllerScope.itemId) {
                itemCount = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity * controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].BaseUnitCount;
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity >= parentItemQunatity) {
                    if (parentItemQunatity === 0) {
                        parentItemQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].SystemQuantity - itemCount;
                    }
                    else {
                        parentItemQunatity = parentItemQunatity - itemCount;
                    }
                    isUpdateItemQuantity = true;
                }
                else {
                    isUpdateItemQuantity = false;
                    break;
                }
            }
        }

        if (isUpdateItemQuantity) {
            if (parentItemQunatity >= 0) {
                for (let j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ItemId !== controllerScope.itemId) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ParentItemId === controllerScope.itemId) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsSendInventory) {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                            }
                        }
                    }
                }
            }
        }
    }

    private removeRejectedItemQunatity(item) {
        let controllerScope = this.$scope;
        let isParentItem = false;
        let parentItemQunatity = 0;
        let oldQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        //condition for sub-item
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ItemId === controllerScope.itemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    let itemCount = item.BaseUnitCount * item.OldRequestQuantity;
                    if (item.IsParentItem) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsSendInventory) {
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].CurrentBranchQunatitytoolTip = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].CurrentBranchQunatitytoolTip - itemCount;
                            oldQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].OldRequestQuantity;
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].OldRequestQuantity = item.RequestQuantity;
                            parentItemQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].CurrentBranchQunatitytoolTip;
                            isParentItem = true;
                            break;
                        }
                        else {
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].TargetBranchQuantityToolTip = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].TargetBranchQuantityToolTip - itemCount;
                            oldQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].OldRequestQuantity;
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].OldRequestQuantity = item.RequestQuantity;
                            parentItemQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].TargetBranchQuantityToolTip;
                            isParentItem = true;
                            break;
                        }
                    }
                    //condition for sub-item
                    else {

                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i]) {
                            oldQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].OldRequestQuantity;
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].CurrentBranchQunatitytoolTip = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].CurrentBranchQunatitytoolTip - itemCount;
                            parentItemQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].CurrentBranchQunatitytoolTip;
                            isParentItem = true;
                            break;
                        }
                        else {
                            oldQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].OldRequestQuantity;
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].TargetBranchQuantityToolTip = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].TargetBranchQuantityToolTip - itemCount;
                            parentItemQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].TargetBranchQuantityToolTip;
                            isParentItem = true;
                            break;
                        }
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ItemId !== controllerScope.itemId) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ParentItemId === controllerScope.itemId) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsSendInventory) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ItemId === item.ItemId) {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].OldRequestQuantity = item.RequestQuantity;
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                            }
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].UpdateSystemQunatity = parentItemQunatity;
                        }
                        else {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ItemId === item.ItemId) {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].OldRequestQuantity = item.RequestQuantity;
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                            }
                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].UpdateSystemQunatity = parentItemQunatity;
                        }
                    }
                }
            }
        }
        else {
            let updateItemQuantity = 0;
            let itemExist = false;
            for (let k = 0; k < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; k++) {
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].ItemId === item.ItemId) {
                    //UpdateSystemQunatity
                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].UpdateSystemQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].UpdateSystemQunatity - (item.OldRequestQuantity * item.BaseUnitCount);
                    updateItemQuantity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].UpdateSystemQunatity;
                    oldQunatity = controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].OldRequestQuantity;
                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].OldRequestQuantity = item.RequestQuantity;
                    itemExist = true;
                    break;
                }
            }
            if (oldQunatity !== 0 && oldQunatity !== undefined && oldQunatity !== null) {
                for (let p = 0; p < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; p++) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].ParentItemId === controllerScope.itemId) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].IsSendInventory) {
                            if (itemExist) {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].CurrentBranchQunatitytoolTip = Math.floor(updateItemQuantity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].BaseUnitCount);
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].UpdateSystemQunatity = updateItemQuantity;
                            }
                        }
                        else {
                            if (itemExist) {
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].TargetBranchQuantityToolTip = Math.floor(updateItemQuantity / controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].BaseUnitCount);
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[p].UpdateSystemQunatity = updateItemQuantity;
                            }
                        }
                    }
                }
            }
        }
    }

    private removeItemQunatity(item) {
        let controllerScope = this.$scope;
        let isParentItem = false;
        let parentItemQunatity = 0;
        let oldQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        //condition for sub-item
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
            if (controllerScope.inventoryItemCollection[i].ItemId === controllerScope.itemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    let itemCount = item.BaseUnitCount * item.OldRequestQuantity;
                    if (item.IsParentItem) {
                        if (controllerScope.IsSendInventory) {
                            controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip + itemCount;
                            oldQunatity = controllerScope.inventoryItemCollection[i].OldRequestQuantity;
                            controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip;
                            isParentItem = true;
                            break;
                        }
                        else {
                            controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip + itemCount;
                            oldQunatity = controllerScope.inventoryItemCollection[i].OldRequestQuantity;
                            controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip;
                            isParentItem = true;
                            break;
                        }
                    }
                    //condition for sub-item
                    else {

                        if (controllerScope.IsSendInventory) {
                            oldQunatity = controllerScope.inventoryItemCollection[i].OldRequestQuantity;
                            controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip + itemCount;
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip;
                            isParentItem = true;
                            break;
                        }
                        else {
                            oldQunatity = controllerScope.inventoryItemCollection[i].OldRequestQuantity;
                            controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip + itemCount;
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip;
                            isParentItem = true;
                            break;
                        }
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                if (controllerScope.inventoryItemCollection[j].ItemId !== controllerScope.itemId) {
                    if (controllerScope.inventoryItemCollection[j].ParentItemId === controllerScope.itemId) {
                        if (controllerScope.IsSendInventory) {
                            if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                                controllerScope.inventoryItemCollection[j].OldRequestQuantity = item.RequestQuantity;
                                controllerScope.inventoryItemCollection[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.inventoryItemCollection[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                            controllerScope.inventoryItemCollection[j].UpdateSystemQunatity = parentItemQunatity;
                        }
                        else {
                            if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                                controllerScope.inventoryItemCollection[j].OldRequestQuantity = item.RequestQuantity;
                                controllerScope.inventoryItemCollection[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.inventoryItemCollection[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                            controllerScope.inventoryItemCollection[j].UpdateSystemQunatity = parentItemQunatity;
                        }
                    }
                }
            }
        }
        else {
            let updateItemQuantity = 0;
            let itemExist = false;
            for (let k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
                if (controllerScope.inventoryItemCollection[k].ItemId === item.ItemId) {
                    //UpdateSystemQunatity
                    controllerScope.inventoryItemCollection[k].UpdateSystemQunatity = controllerScope.inventoryItemCollection[k].UpdateSystemQunatity + (item.OldRequestQuantity * item.BaseUnitCount);
                    updateItemQuantity = controllerScope.inventoryItemCollection[k].UpdateSystemQunatity;
                    oldQunatity = controllerScope.inventoryItemCollection[k].OldRequestQuantity;
                    controllerScope.inventoryItemCollection[k].OldRequestQuantity = item.RequestQuantity;
                    itemExist = true;
                    break;
                }
            }
            if (oldQunatity !== 0 && oldQunatity !== undefined && oldQunatity !== null) {
                for (let p = 0; p < controllerScope.inventoryItemCollection.length; p++) {
                    if (controllerScope.inventoryItemCollection[p].ParentItemId === controllerScope.itemId) {
                        if (controllerScope.IsSendInventory) {
                            if (itemExist) {
                                controllerScope.inventoryItemCollection[p].CurrentBranchQunatitytoolTip = Math.floor(updateItemQuantity / controllerScope.inventoryItemCollection[p].BaseUnitCount);
                                controllerScope.inventoryItemCollection[p].UpdateSystemQunatity = updateItemQuantity;
                            }
                        }
                        else {
                            if (itemExist) {
                                controllerScope.inventoryItemCollection[p].TargetBranchQuantityToolTip = Math.floor(updateItemQuantity / controllerScope.inventoryItemCollection[p].BaseUnitCount);
                                controllerScope.inventoryItemCollection[p].UpdateSystemQunatity = updateItemQuantity;
                            }
                        }
                    }
                }
            }
        }
    }

    private updateItemQunatity(item) {
        let controllerScope = this.$scope;
        let itemCount = item.BaseUnitCount * item.RequestQuantity;
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
        for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
            if (controllerScope.inventoryItemCollection[i].ItemId === controllerScope.itemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    if (item.OldRequestQuantity !== item.RequestQuantity) {
                        if (item.OldRequestQuantity < item.RequestQuantity) {
                            let requestDiff = item.RequestQuantity - item.OldRequestQuantity;
                            itemCount = requestDiff * item.BaseUnitCount;
                            if (item.IsParentItem) {
                                if (controllerScope.IsSendInventory) {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                                        controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                                else {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                                        controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                            }
                            //condition for sub-item
                            else {
                                //TargetBranchQuantityToolTip

                                if (controllerScope.IsSendInventory) {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                                else {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            let requestDiff = item.OldRequestQuantity - item.RequestQuantity;
                            itemCount = requestDiff * item.BaseUnitCount;
                            if (item.IsParentItem) {
                                if (controllerScope.IsSendInventory) {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip + itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip + itemCount;
                                        controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                                else {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip + itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip + itemCount;
                                        controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                            }
                            //condition for sub-item
                            else {
                                if (controllerScope.IsSendInventory) {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip + itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip + itemCount;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                                else {
                                    parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip + itemCount;
                                    if (parentItemQunatity >= 0) {
                                        controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip + itemCount;
                                        isParentItem = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (item.IsParentItem) {
                        if (controllerScope.IsSendInventory) {
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                            if (parentItemQunatity >= 0) {
                                controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                                controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                        else {
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                            if (parentItemQunatity >= 0) {
                                controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                                controllerScope.inventoryItemCollection[i].OldRequestQuantity = item.RequestQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                    }
                    //condition for sub-item
                    else {
                        if (controllerScope.IsSendInventory) {
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                            if (parentItemQunatity >= 0) {
                                controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip - itemCount;
                                isParentItem = true;
                                break;
                            }
                        }
                        else {
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                            if (parentItemQunatity >= 0) {
                                controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip - itemCount;
                                isParentItem = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                if (controllerScope.inventoryItemCollection[j].ItemId !== controllerScope.itemId) {
                    if (controllerScope.inventoryItemCollection[j].ParentItemId === controllerScope.itemId) {
                        if (controllerScope.IsSendInventory) {
                            if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                                controllerScope.inventoryItemCollection[j].OldRequestQuantity = item.RequestQuantity;
                                controllerScope.inventoryItemCollection[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.inventoryItemCollection[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                        }
                        else {
                            if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                                controllerScope.inventoryItemCollection[j].OldRequestQuantity = item.RequestQuantity;
                                controllerScope.inventoryItemCollection[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                            else {
                                controllerScope.inventoryItemCollection[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                            }
                        }
                    }
                }
            }
        }
        else {
            let updateItemQuantity = 0;
            let itemExist = false;
            if (item.OldRequestQuantity !== item.RequestQuantity) {
                for (let k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
                    if (controllerScope.inventoryItemCollection[k].ParentItemId === controllerScope.itemId) {
                        //UpdateSystemQunatity
                        if (controllerScope.inventoryItemCollection[k].ItemId !== item.ParentItemId) {
                            if (controllerScope.inventoryItemCollection[k].ItemId === item.ItemId) {
                                updateItemQuantity = controllerScope.inventoryItemCollection[k].UpdateSystemQunatity - (item.RequestQuantity * item.BaseUnitCount);
                                if (updateItemQuantity >= 0) {
                                    controllerScope.inventoryItemCollection[k].UpdateSystemQunatity = controllerScope.inventoryItemCollection[k].UpdateSystemQunatity - (item.RequestQuantity * item.BaseUnitCount);
                                    controllerScope.inventoryItemCollection[k].OldRequestQuantity = item.RequestQuantity;
                                    itemExist = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                for (let p = 0; p < controllerScope.inventoryItemCollection.length; p++) {
                    if (controllerScope.inventoryItemCollection[p].ParentItemId === controllerScope.itemId) {
                        if (updateItemQuantity >= 0) {
                            if (controllerScope.IsSendInventory) {
                                if (itemExist) {
                                    controllerScope.inventoryItemCollection[p].CurrentBranchQunatitytoolTip = Math.floor(updateItemQuantity / controllerScope.inventoryItemCollection[p].BaseUnitCount);
                                    controllerScope.inventoryItemCollection[p].UpdateSystemQunatity = updateItemQuantity;
                                }
                            }
                            else {
                                if (itemExist) {
                                    controllerScope.inventoryItemCollection[p].TargetBranchQuantityToolTip = Math.floor(updateItemQuantity / controllerScope.inventoryItemCollection[p].BaseUnitCount);
                                    controllerScope.inventoryItemCollection[p].UpdateSystemQunatity = updateItemQuantity;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

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
        for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
            if (controllerScope.inventoryItemCollection[i].ParentItemId === controllerScope.itemId) {
                if (!item.IsParentItem) {
                    if (controllerScope.inventoryItemCollection[i].ItemId === controllerScope.itemId) {
                        if (controllerScope.IsSendInventory) {
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].CurrentBranchQunatitytoolTip;
                            isParentItem = true;
                            break;
                        }
                        else {
                            parentItemQunatity = controllerScope.inventoryItemCollection[i].TargetBranchQuantityToolTip;
                            isParentItem = true;
                            break;
                        }
                    }
                }
            }
        }

        if (isParentItem) {
            for (let j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                    if (controllerScope.IsSendInventory) {
                        controllerScope.inventoryItemCollection[j].CurrentBranchQunatitytoolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                    }
                    else {
                        controllerScope.inventoryItemCollection[j].TargetBranchQuantityToolTip = Math.floor(parentItemQunatity / controllerScope.inventoryItemCollection[j].BaseUnitCount);
                    }
                }
            }
        }
        else {
            let updateItemQunatity = 0;
            let itemExist = false;
            for (let k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
                if (controllerScope.inventoryItemCollection[k].ParentItemId === controllerScope.itemId) {
                    if (controllerScope.inventoryItemCollection[k].ItemId !== item.ItemId) {
                        updateItemQunatity = controllerScope.inventoryItemCollection[k].UpdateSystemQunatity;
                        itemExist = true;
                        break;
                    }
                }
            }

            for (let p = 0; p < controllerScope.inventoryItemCollection.length; p++) {
                if (controllerScope.inventoryItemCollection[p].ItemId === item.ItemId) {
                    if (controllerScope.IsSendInventory) {
                        if (itemExist) {
                            controllerScope.inventoryItemCollection[p].CurrentBranchQunatitytoolTip = Math.floor(updateItemQunatity / controllerScope.inventoryItemCollection[p].BaseUnitCount);
                            controllerScope.inventoryItemCollection[p].UpdateSystemQunatity = updateItemQunatity;
                        }
                    }
                    else {
                        if (itemExist) {
                            controllerScope.inventoryItemCollection[p].TargetBranchQuantityToolTip = Math.floor(updateItemQunatity / controllerScope.inventoryItemCollection[p].BaseUnitCount);
                            controllerScope.inventoryItemCollection[p].UpdateSystemQunatity = updateItemQunatity;
                        }
                    }
                }
            }
        }
    }

    private checkNullRequestQuantity(item) {
        let controllerScope = this.$scope;
        if (controllerScope.inventoryItemCollection.length > 0) {
            let itemSystemQuantity = 0;
            for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                if (controllerScope.inventoryItemCollection[i].ItemId === item.ItemId) {
                    if (controllerScope.inventoryItemCollection[i].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[i].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[i].RequestQuantity !== null) {
                        for (let j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                            if (controllerScope.inventoryItemCollection[j].ParentItemId === item.ParentItemId) {
                                if (controllerScope.inventoryItemCollection[j].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[j].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[j].RequestQuantity !== null) {
                                    itemSystemQuantity = itemSystemQuantity + (controllerScope.inventoryItemCollection[j].RequestQuantity * controllerScope.inventoryItemCollection[j].BaseUnitCount);
                                }
                                controllerScope.inventoryItemCollection[j].IsErrorMessage = false;
                            }
                        }
                        this.updateItemQunatity(item);
                        if (controllerScope.inventoryItemCollection[i].SystemQuantity < itemSystemQuantity) {
                            if (controllerScope.inventoryItemCollection[i].IsSendInventory) {
                                controllerScope.inventoryItemCollection[i].IsErrorMessage = true;
                            }
                            else {
                                controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                            }
                            controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                        }
                        else {
                            if (itemSystemQuantity > controllerScope.inventoryItemCollection[i].SystemQuantity) {
                                if (controllerScope.inventoryItemCollection[i].IsSendInventory) {
                                    if ((itemSystemQuantity - controllerScope.inventoryItemCollection[i].SystemQuantity) < controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                                else {
                                    if ((itemSystemQuantity + controllerScope.inventoryItemCollection[i].SystemQuantity) > controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                            }
                            else {
                                if (controllerScope.inventoryItemCollection[i].IsSendInventory) {
                                    if ((controllerScope.inventoryItemCollection[i].SystemQuantity - itemSystemQuantity) < controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                                else {
                                    if ((controllerScope.inventoryItemCollection[i].SystemQuantity + itemSystemQuantity) > controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                            }
                        }
                    } else {
                        controllerScope.inventoryItemCollection[i].RequestQuantity = 0;
                        let itemSystemQuantity = 0;
                        for (let j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                            if (controllerScope.inventoryItemCollection[j].ParentItemId === item.ParentItemId) {
                                if (controllerScope.inventoryItemCollection[j].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[j].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[j].RequestQuantity !== null) {
                                    itemSystemQuantity = itemSystemQuantity + (controllerScope.inventoryItemCollection[j].RequestQuantity * controllerScope.inventoryItemCollection[j].BaseUnitCount);
                                }
                                controllerScope.inventoryItemCollection[j].IsErrorMessage = false;

                                if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                                    controllerScope.inventoryItemCollection[j].IsErrorMessage = false;
                                    controllerScope.inventoryItemCollection[j].IsWarningMesssage = false;
                                }
                            }
                        }
                        this.removeItemQunatity(item);
                        for (let k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
                            if (controllerScope.inventoryItemCollection[k].ItemId !== item.ItemId) {
                                if (controllerScope.inventoryItemCollection[k].ParentItemId === item.ParentItemId) {
                                    if (controllerScope.inventoryItemCollection[k].SystemQuantity < itemSystemQuantity) {
                                        if (controllerScope.inventoryItemCollection[k].IsSendInventory) {
                                            controllerScope.inventoryItemCollection[k].IsErrorMessage = true;
                                        }
                                        else {
                                            controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                        }
                                        controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                    }
                                    else {
                                        if (itemSystemQuantity > controllerScope.inventoryItemCollection[k].SystemQuantity) {
                                            if (controllerScope.inventoryItemCollection[k].IsSendInventory) {
                                                if ((itemSystemQuantity - controllerScope.inventoryItemCollection[k].SystemQuantity) < controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = true;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((itemSystemQuantity + controllerScope.inventoryItemCollection[k].SystemQuantity) > controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = true;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                            }
                                        }
                                        else {
                                            if (controllerScope.inventoryItemCollection[k].IsSendInventory) {
                                                if ((controllerScope.inventoryItemCollection[k].SystemQuantity - itemSystemQuantity) < controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = true;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((controllerScope.inventoryItemCollection[k].SystemQuantity + itemSystemQuantity) > controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = true;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private serchItemDetails() {
        let searching = [];
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.errorItemMessage = false;

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

        if (controllerScope.search.ItemNameEn !== "" || controllerScope.search.Barcode !== "" || controllerScope.search.Code !== "" || controllerScope.search.FlavourEn !== "") {
            searching = this.filterFilter((subItemSearch), controllerScope.search);
            controllerScope.itemCollection = this.filterFilter((controllerScope.itemSearchCollection), controllerScope.search);
        }
        else {
            controllerScope.itemCollection = controllerScope.itemSearchCollection;
        }

        if (controllerScope.itemCollection.length === 0 && searching.length === 0) {
            controllerScope.errorItemMessage = true;
            controllerScope.isItemGrid = false;
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
            controllerScope.errorItemMessage = false;
            controllerScope.isItemGrid = true;
        }
        controllerScope.search = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
    }

    private searchInventoryDetails() {
        let isNoSearch = false;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.errorMessageDisplayForBlankList = false;
        let fromDate;
        if (controllerScope.searchDate.IssueFromDate !== null && controllerScope.searchDate.IssueFromDate !== undefined) {
            let nowFrom = new Date(controllerScope.searchDate.IssueFromDate);
            nowFrom.setTime(nowFrom.getTime() + (330 * 60 * 1000));
            fromDate = nowFrom.toISOString().substr(0, 10);
        }
        let toDate;
        if (controllerScope.searchDate.IssueDate !== null && controllerScope.searchDate.IssueDate !== undefined) {
            let nowTo = new Date(controllerScope.searchDate.IssueDate);
            nowTo.setTime(nowTo.getTime() + (330 * 60 * 1000));
            toDate = nowTo.toISOString().substr(0, 10);
        }
        let fromDueDateDate;
        if (controllerScope.searchDate.DueFromDate !== null && controllerScope.searchDate.DueFromDate !== undefined) {
            let nowFromDueDate = new Date(controllerScope.searchDate.DueFromDate);
            nowFromDueDate.setTime(nowFromDueDate.getTime() + (330 * 60 * 1000));
            fromDueDateDate = nowFromDueDate.toISOString().substr(0, 10);
        }
        let toDueDate;
        if (controllerScope.searchDate.DueDate !== null && controllerScope.searchDate.DueDate !== undefined) {
            let nowToDueDate = new Date(controllerScope.searchDate.DueDate);
            nowToDueDate.setTime(nowToDueDate.getTime() + (330 * 60 * 1000));
            toDueDate = nowToDueDate.toISOString().substr(0, 10);
        }

        if (controllerScope.inventoryTransferCollection.length > 0) {
            for (let i = 0; i < controllerScope.inventoryTransferCollection.length; i++) {
                if ((fromDate !== undefined && toDate !== undefined && fromDate !== null && toDate !== null) || (fromDueDateDate !== undefined && toDueDate !== undefined && fromDueDateDate !== null && toDueDate !== null)) {
                    if ((new Date(controllerScope.inventoryTransferCollection[i].IssuedDateTime).toISOString().substr(0, 10) >= fromDate && new Date(controllerScope.inventoryTransferCollection[i].IssuedDateTime).toISOString().substr(0, 10) <= toDate) || (new Date(controllerScope.inventoryTransferCollection[i].DueDate).toISOString().substr(0, 10) >= fromDueDateDate && new Date(controllerScope.inventoryTransferCollection[i].DueDate).toISOString().substr(0, 10) <= toDueDate)) {
                        controllerScope.tempList.push(controllerScope.inventoryTransferCollection[i]);
                    }
                }
            }
        }

        if (controllerScope.tempList.length > 0) {//this function used for get data between from and to date and amount. 
            if ((controllerScope.searchTransfer.CurrentBranchId !== undefined && controllerScope.searchTransfer.CurrentBranchId !== null) ||
                (controllerScope.searchTransfer.TargetBranchId !== undefined && controllerScope.searchTransfer.TargetBranchId !== null) ||
                (controllerScope.searchTransfer.RequestNo !== undefined && controllerScope.searchTransfer.RequestNo !== null) ||
                (controllerScope.searchTransfer.RequestTypeId !== undefined && controllerScope.searchTransfer.RequestTypeId !== null)) {
                controllerScope.inventoryTransferCollection = this.filterFilter((controllerScope.tempList), controllerScope.searchTransfer);
            } else {
                controllerScope.inventoryTransferCollection = controllerScope.tempList;
            }
        }
        else {
            if ((controllerScope.searchDate.DueFromDate === undefined || controllerScope.searchDate.DueFromDate === null) &&
                (controllerScope.searchDate.DueDate === undefined || controllerScope.searchDate.DueDate === null) &&
                (controllerScope.searchDate.IssueFromDate === undefined || controllerScope.searchDate.IssueFromDate === null) &&
                (controllerScope.searchDate.IssueDate === undefined || controllerScope.searchDate.IssueDate === null)) {
                controllerScope.inventoryTransferCollection = this.filterFilter((controllerScope.inventorySearchCollection), controllerScope.searchTransfer);
            }
            else {
                isNoSearch = true;
            }
        }
        if (isNoSearch) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.errorMessageDisplayForBlankList = true;
        } else {
            /* change pagination with $scope.filtered */
            if (controllerScope.inventoryTransferCollection.length === 0) {
                this.$scope.errorMessage = stringConstants.errorMessage;
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.searchTransfer = [];
                controllerScope.searchDate = [];
            } else {
                controllerScope.searchTransfer = [];
                controllerScope.searchDate = [];
                controllerScope.errorMessageDisplayForBlankList = false;
            }
        }
        controllerScope.tempList = [];
        controllerScope.searchTransfer = [];
        controllerScope.searchDate = [];
        controllerRootScope.isLoading = false;
    }

    private closeItemDetailModelDialogBox() {
        this.itemDetailsModelDialogBox.dismiss('cancel');
    }

    private changeBranchName(branchId) {
        let controllerScope = this.$scope;
        controllerScope.isReuestTypeDisabled = false;
        controllerScope.isRequestDisabled = false;
        controllerScope.isBarcodeDisabled = true;
        controllerScope.transferGoodsDetails.RequestTypeId = "";
    }

    private changeRequestType(branchId, requestTypeId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.itemCollection = [];
        controllerScope.itemSearchCollection = [];
        let promise = this.internalTransferGoodService.getItemListById(branchId);
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerRootScope.isLoading = false;
                controllerScope.isBarcodeDisabled = false;
                controllerScope.errorItemMessage = true;
            } else {
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isBarcodeDisabled = false;
                for (let i = 0; i < result.length; i++) {
                    controllerScope.itemCollection.push(result[i]);
                }
                if (requestTypeId === 83) {
                    controllerScope.IsSendInventory = true;
                }
                else {
                    controllerScope.IsSendInventory = false;
                }
                controllerScope.errorItemMessage = false;
                controllerScope.itemSearchCollection = controllerScope.itemCollection;
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

    private getAllBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.internalTransferGoodService.getAllBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push(result[i]);
                }
                this.$log.log("get branch List successfully", result.length);
                this.getAllRequestType();
            } else {
                this.$log.log("get branch List successfully", result.length);
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.isDisplayErrorMessage = true;
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

    private getAllRequestType() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.requestTypeCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.internalTransferGoodService.getAllRequestType();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isDisplayErrorMessage = true;
                controllerRootScope.isLoading = false;
            } else {
                this.$log.log("get request type succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.requestTypeCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private closeItemValidationDialogBox() {
        this.itemValidationDialogBox.dismiss('cancel');
    }

    private getItemDetailsByItemBarcode(barcode) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (barcode !== null && barcode !== undefined && barcode !== "") {
            controllerRootScope.isLoading = true;
            let transferGoodsDetails = new Model.InventoryTransferAc();
            transferGoodsDetails = controllerScope.transferGoodsDetails;
            let promise = this.internalTransferGoodService.getItemDetailsByItemBarcode(transferGoodsDetails);
            promise.then((result) => {
                controllerScope.transferGoodsDetails.Barcode = "";
                let flag = false;
                if (result.IsResultNull) {
                    controllerRootScope.isLoading = false;
                    this.itemValidationDialogBox = this.$modal.open({
                        templateUrl: 'itemValidation',
                        backdrop: 'static',
                        keyboard: true,
                        scope: this.$scope
                    });
                    controllerScope.errorMessage = stringConstants.itemErrorMessage;
                } else if (result.IsQuantityRequried) {
                    controllerRootScope.isLoading = false;
                    this.itemValidationDialogBox = this.$modal.open({
                        templateUrl: 'itemValidation',
                        backdrop: 'static',
                        keyboard: true,
                        scope: this.$scope
                    });
                    controllerScope.errorMessage = stringConstants.itemQuantityErrorMessage;
                }
                else {
                    controllerScope.isBranchDisabled = true;
                    controllerScope.errorMessageDisplayForBlankList = false;
                    controllerScope.isDispalyItemTransferDetails = true;
                    controllerScope.isRequestDisabled = true;
                    if (controllerScope.inventoryItemCollection.length > 0) {
                        for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                            if (controllerScope.inventoryItemCollection[i].ItemId === result.ItemId) {
                                flag = true;
                                break;
                            } else {
                                flag = false;
                            }
                        }
                        if (!flag) {
                            controllerScope.inventoryItemCollection.push(result);
                            this.updateNewlyAddedItemQunatity(result);
                        }
                    } else {
                        controllerScope.inventoryItemCollection.push(result);
                        this.updateNewlyAddedItemQunatity(result);
                    }
                    controllerRootScope.isLoading = false;
                    this.$log.log("get item details Succssfully");
                }
            }).catch((error) => {
                location.replace(this.apiPath);
                this.$log.log(error);
            });
        } else {
            if (controllerScope.inventoryItemCollection.length !== 0) {
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isDispalyItemTransferDetails = true;
            } else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDispalyItemTransferDetails = false;
            }
            return;
        }
    }

    private getItemDetails(barcode) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let transferGoodsDetails = new Model.InventoryTransferAc();
        transferGoodsDetails = controllerScope.transferGoodsDetails;
        transferGoodsDetails.Barcode = barcode;
        let promise = this.internalTransferGoodService.getItemDetailsByItemBarcode(transferGoodsDetails);
        promise.then((result) => {
            let flag = false;
            controllerScope.transferGoodsDetails.Barcode = "";
            this.closeItemDetailModelDialogBox();
            if (result.IsResultNull) {
                controllerRootScope.isLoading = false;
                controllerRootScope.isLoading = false;
                this.itemValidationDialogBox = this.$modal.open({
                    templateUrl: 'itemValidation',
                    backdrop: 'static',
                    keyboard: true,
                    scope: this.$scope
                });
            }
            else if (result.IsQuantityRequried) {
                controllerRootScope.isLoading = false;
                this.itemValidationDialogBox = this.$modal.open({
                    templateUrl: 'itemValidation',
                    backdrop: 'static',
                    keyboard: true,
                    scope: this.$scope
                });
                controllerScope.errorMessage = stringConstants.itemQuantityErrorMessage;
            }
            else {
                controllerScope.isBranchDisabled = true;
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isDispalyItemTransferDetails = true;
                controllerScope.isRequestDisabled = true;
                if (controllerScope.inventoryItemCollection.length > 0) {
                    for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                        if (controllerScope.inventoryItemCollection[i].ItemId === result.ItemId) {
                            flag = true;
                            break;
                        } else {
                            flag = false;
                        }
                    }
                    if (!flag) {
                        controllerScope.inventoryItemCollection.push(result);
                        this.updateNewlyAddedItemQunatity(result);
                    }
                } else {
                    controllerScope.inventoryItemCollection.push(result);
                    this.updateNewlyAddedItemQunatity(result);
                }
                controllerRootScope.isLoading = false;
                this.$log.log("get item details Succssfully");
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private submitInventoryTranserRequest(transferGoodsDetails) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let that = this;
        controllerRootScope.isLoading = true;
        transferGoodsDetails.ItemInventoryTransfer = controllerScope.inventoryItemCollection;
        let promise = this.internalTransferGoodService.submitInventoryTranserRequest(transferGoodsDetails);
        promise.then((result) => {
            this.$log.log("submit transfer good request successfully", result);
            if (result.status === "Work Flow Not Created") {
                that.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            } else if (result.status === "Not Allow Permission") {
                that.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            } else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.submitInventoryTransfer
                });
                that.$location.path("/InventoryTransferWorkList");
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private removeItemFromTheItemCollection() {
        let controllerScope = this.$scope;
        this.removeItemQunatity(controllerScope.inventoryItemCollection[controllerScope.itemIndex]);
        controllerScope.inventoryItemCollection.splice(controllerScope.itemIndex, 1);
        if (controllerScope.inventoryItemCollection.length === 0) {
            controllerScope.isDispalyItemTransferDetails = false;
            controllerScope.isRequestDisabled = false;
            controllerScope.isBranchDisabled = false;
        } else {
            controllerScope.isDispalyItemTransferDetails = true;
            let itemSystemQuantity = 0;
            for (let j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                if (controllerScope.inventoryItemCollection[j].ParentItemId === controllerScope.itemDetails.ParentItemId) {
                    if (controllerScope.inventoryItemCollection[j].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[j].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[j].RequestQuantity !== null) {
                        itemSystemQuantity = itemSystemQuantity + (controllerScope.inventoryItemCollection[j].RequestQuantity * controllerScope.inventoryItemCollection[j].BaseUnitCount);
                    }
                    controllerScope.inventoryItemCollection[j].IsErrorMessage = false;
                }
            }

            for (let i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                if (controllerScope.inventoryItemCollection[i].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[i].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[i].RequestQuantity !== null) {
                    if (controllerScope.inventoryItemCollection[i].ParentItemId === controllerScope.itemDetails.ParentItemId) {
                        if (controllerScope.inventoryItemCollection[i].SystemQuantity < itemSystemQuantity) {
                            if (controllerScope.inventoryItemCollection[i].IsSendInventory) {
                                controllerScope.inventoryItemCollection[i].IsErrorMessage = true;
                            }
                            else {
                                controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                            }
                            controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                        }
                        else {
                            if (itemSystemQuantity > controllerScope.inventoryItemCollection[i].SystemQuantity) {
                                if (controllerScope.inventoryItemCollection[i].IsSendInventory) {
                                    if ((itemSystemQuantity - controllerScope.inventoryItemCollection[i].SystemQuantity) < controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                                else {
                                    if ((itemSystemQuantity + controllerScope.inventoryItemCollection[i].SystemQuantity) > controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                            }
                            else {
                                if (controllerScope.inventoryItemCollection[i].IsSendInventory) {
                                    if ((controllerScope.inventoryItemCollection[i].SystemQuantity - itemSystemQuantity) < controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                                else {
                                    if ((controllerScope.inventoryItemCollection[i].SystemQuantity + itemSystemQuantity) > controllerScope.inventoryItemCollection[i].MinimumQunatity) {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = true;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                    else {
                                        controllerScope.inventoryItemCollection[i].IsWarningMesssage = false;
                                        controllerScope.inventoryItemCollection[i].IsErrorMessage = false;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        controllerScope.closeRemoveItemConfirmationDialogBox();
    }

    private getAllInventoryTransferList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryTransferCollection = [];
        controllerScope.inventorySearchCollection = [];
        let promise = this.internalTransferGoodService.getAllInventoryTransferList();
        promise.then((result) => {
            this.$log.log("get inventory transfer list susscussfully", result.length);
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            } else {
                controllerScope.errorMessageDisplayForBlankList = false;
                for (let i = 0; i < result.length; i++) {
                    controllerScope.inventoryTransferCollection.push(result[i]);
                }
                controllerScope.inventorySearchCollection = controllerScope.inventoryTransferCollection;
                controllerScope.isDataLoading = false;
                this.getBranchList();
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });;
    }

    private getBranchList() {
        let controllerScope = this.$scope;
        controllerScope.isDataLoading = true;

        //To get branch list
        let promise = this.issueStockInventoryService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchCollection.push({ BranchId: result[i].Id, Name: result[i].Name });
                }
                this.$log.log("get branch list successfully");
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

    private viewInternalTransferGoodDetails(inventoryTransferId) {
        this.$location.path("/InventoryTransferDetails/" + inventoryTransferId);
    }

    private viewInternalTransferGoodDetailsById() {
        let inventoryTransferId = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.transferGoodsDetails = new Model.InventoryTransferAc();
        let promise = this.internalTransferGoodService.viewInternalTransferGoodDetailsById(inventoryTransferId);
        promise.then((result) => {
            controllerScope.transferGoodsDetails = result;
            this.$log.log("get inventory transfer detail successfully", result);
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private reviewTransferInventoryById(transferGoodsDetails) {
        let controllerScope = this.$scope;
        let that = this;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.internalTransferGoodService.reviewTransferInventoryById(transferGoodsDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            } else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIssueInventory
                });
                that.cancelTransferInventory();
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

    private transferInventoryApprovalById(transferGoodsDetails, status) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        transferGoodsDetails.IsStatus = status;
        let promise = this.internalTransferGoodService.transferInventoryApprovalById(transferGoodsDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            } else if (result.status === "Receipt Print") {
                this.ngToast.create({
                    className: 'success',
                    content: stringConstants.approvalIssueInventory
                });
                this.printTransferGoodReceipt(transferGoodsDetails.InventoryTransferId);
                this.cancelTransferInventory();
            } else {
                if (status) {
                    this.ngToast.create({
                        className: 'success',
                        content: stringConstants.approvalIssueInventory
                    });
                } else {
                    this.ngToast.create({
                        className: 'success',
                        content: stringConstants.rejectIssueInventory
                    });
                }
                this.cancelTransferInventory();
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

    private reSubmitTransferInventory(transferGoodsDetails) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.internalTransferGoodService.reSubmitTransferInventory(transferGoodsDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            } else {
                this.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIssueInventory
                });
                this.cancelTransferInventory();
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

    private cancelTransferInventory() {
        this.$location.path("/InventoryTransferWorkList");
    }

    private initiateTransferInventory() {
        this.$location.path("/InventoryTransfer");
    }

    private receiveTransferInventoryById(transferGoodsDetails) {
        let controllerScope = this.$scope;
        let that = this;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.internalTransferGoodService.receiveTransferInventoryById(transferGoodsDetails);
        promise.then((result) => {
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            } else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.receiveTransferInventory
                });
                that.cancelTransferInventory();
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

    //this method used for issue date to date Picker 
    private openIssueDateToModel(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isOpenIssueDateToModel = true;
    }

    //this method used for issue date to date Picker 
    private openIssueDateFromModel(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isOpenIssueDateFromModel = true;
    }

    private printTransferGoodReceipt(transferGoodsDetails) {
        let controllerScope = this.$scope;
        let promise = this.internalTransferGoodService.printTransferGoodReceipt(transferGoodsDetails);
        promise.then((result) => {
            this.$log.log("print sussessfully", result);
            this.printer.print("/Templates/InternalTransferGoods/InventoryTransferReceipt.html", result);
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
            this.$log.log(error);
        });
    }

    //this method used for issue date to date Picker 
    private dueDatePickerOpen(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDatePickerOpened = true;
    }

    private changeReceiveingQuantity(itemInventoryTransferId) {
        let controllerScope = this.$scope;
        for (let i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ItemInventoryTransferId === itemInventoryTransferId) {
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== null) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity < controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity) {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = true;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = false;
                        break;
                    } else {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = true;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = false;
                        break;
                    }
                } else {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === 0) {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = true;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = false;
                    } else {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = true;
                    }
                    return;
                }
            }
        }
    }

    private checkReceiveItemQuantityForItems() {
        let flag = false;
        let controllerScope = this.$scope;
        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer !== null) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer.length > 0) {
                for (let i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== null)
                        flag = true;
                    else {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === undefined || controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === null) {
                            flag = false;
                            break;
                        } else {
                            flag = true;
                        }
                    }
                }
            } else {
                controllerScope.isDispalyItemTransferDetails = false;
            }
        }
        return flag;
    }

    private openDueDateToModel(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateToPickerOpened = true;
    }

    private openDueDateFromModel(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateFromPickerOpened = true;
    }

    private removeItemConfirmation(index, item) {
        let controllerScope = this.$scope;
        this.openRemoveItemConfirmationDialogBox = this.$modal.open({
            templateUrl: 'removeItemConfiramtion',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.itemIndex = index;
        controllerScope.itemDetails = item;
    }

    private closeRemoveItemConfirmationDialogBox() {
        this.openRemoveItemConfirmationDialogBox.dismiss('cancel');
    }

    private clearTransferInventory() {
        this.$route.reload();
    }
}

app.controller(InternalTransferGoodsController.controllerId, ['$scope', '$log', '$location', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', 'internalTransferGoodService', 'issueStockInventoryService', 'printer', '$route', ($scope, $log, $location, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, internalTransferGoodService, issueStockInventoryService, printer, $route) => {
    return new InternalTransferGoodsController($scope, $log, $location, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, internalTransferGoodService, issueStockInventoryService, printer, $route);
}]);

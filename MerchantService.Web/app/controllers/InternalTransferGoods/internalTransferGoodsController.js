// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var InternalTransferGoodsController = (function () {
    function InternalTransferGoodsController($scope, $log, $location, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, internalTransferGoodService, issueStockInventoryService, printer, $route) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$location = $location;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.ngToast = ngToast;
        this.internalTransferGoodService = internalTransferGoodService;
        this.issueStockInventoryService = issueStockInventoryService;
        this.printer = printer;
        this.$route = $route;
        this.$scope.branchList = [];
        this.$scope.getAllBranchList = function () { return _this.getAllBranchList(); };
        this.$scope.transferGoodsDetails = new Model.InventoryTransferAc();
        this.$scope.errorMessage = "";
        this.$scope.isDisplayErrorMessage = false;
        this.$scope.requestTypeCollection = [];
        this.$scope.isSearchButtonDisabled = true;
        this.$scope.changeBranchName = function (branchId) { return _this.changeBranchName(branchId); };
        this.$scope.getItemDetailsByItemBarcode = function (barcode) { return _this.getItemDetailsByItemBarcode(barcode); };
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.inventoryItemCollection = [];
        this.$scope.isBarcodeDisabled = true;
        this.$scope.isBranchDisabled = false;
        this.$scope.closeItemDetailModelDialogBox = function () { return _this.closeItemDetailModelDialogBox(); };
        this.$scope.itemSearchDetails = function () { return _this.itemSearchDetails(); };
        this.$scope.itemSearchCollection = [];
        this.$scope.search = { ItemNameEn: "", Barcode: "", Code: "", FlavourEn: "" };
        this.$scope.searchTransfer = [];
        this.$scope.searchDate = new Model.InventoryTransferAc();
        this.$scope.errorItemMessage = false;
        this.$scope.getItemDetails = function (barcode) { return _this.getItemDetails(barcode); };
        this.$scope.serchItemDetails = function () { return _this.serchItemDetails(); };
        this.$scope.isReuestTypeDisabled = true;
        this.$scope.changeRequestType = function (branchId, requestTypeId) { return _this.changeRequestType(branchId, requestTypeId); };
        this.$scope.checkRequestQuantityForItems = function () { return _this.checkRequestQuantityForItems(); };
        this.$scope.checkNullRequestQuantity = function (item) { return _this.checkNullRequestQuantity(item); };
        this.$scope.submitInventoryTranserRequest = function (transferGoodsDetails) { return _this.submitInventoryTranserRequest(transferGoodsDetails); };
        this.$scope.closeItemValidationDialogBox = function () { return _this.closeItemValidationDialogBox(); };
        this.$scope.removeItemFromTheItemCollection = function () { return _this.removeItemFromTheItemCollection(); };
        this.$scope.isDispalyItemTransferDetails = false;
        this.$scope.getAllInventoryTransferList = function () { return _this.getAllInventoryTransferList(); };
        this.$scope.inventoryTransferCollection = [];
        this.$scope.viewInternalTransferGoodDetailsById = function () { return _this.viewInternalTransferGoodDetailsById(); };
        this.$scope.viewInternalTransferGoodDetails = function (inventoryTransferId) { return _this.viewInternalTransferGoodDetails(inventoryTransferId); };
        this.$scope.cancelTransferInventory = function () { return _this.cancelTransferInventory(); };
        this.$scope.reviewTransferInventoryById = function (transferGoodsDetails) { return _this.reviewTransferInventoryById(transferGoodsDetails); };
        this.$scope.transferInventoryApprovalById = function (transferGoodsDetails, status) { return _this.transferInventoryApprovalById(transferGoodsDetails, status); };
        this.$scope.reSubmitTransferInventory = function (transferGoodsDetails) { return _this.reSubmitTransferInventory(transferGoodsDetails); };
        this.$scope.receiveTransferInventoryById = function (transferGoodsDetails) { return _this.receiveTransferInventoryById(transferGoodsDetails); };
        this.$scope.searchInventoryDetails = function () { return _this.searchInventoryDetails(); };
        this.$scope.inventorySearchCollection = [];
        this.$scope.openIssueDateToModel = function (event) { return _this.openIssueDateToModel(event); };
        this.$scope.isOpenIssueDateToModel = false;
        this.$scope.openIssueDateFromModel = function (event) { return _this.openIssueDateFromModel(event); };
        this.$scope.isOpenIssueDateFromModel = false;
        this.$scope.tempList = [];
        this.$scope.initiateTransferInventory = function () { return _this.initiateTransferInventory(); };
        this.$scope.isDataLoading = false;
        this.$scope.branchCollection = [];
        this.$scope.isRequestDisabled = true;
        this.$scope.isDueDatePickerOpened = false;
        this.$scope.dueDatePickerOpen = function (event) { return _this.dueDatePickerOpen(event); };
        this.$scope.minStartDate = new Date();
        this.$scope.changeReceiveingQuantity = function (itemInventoryTransferId) { return _this.changeReceiveingQuantity(itemInventoryTransferId); };
        this.$scope.openDueDateToModel = function (event) { return _this.openDueDateToModel(event); };
        this.$scope.openDueDateFromModel = function (event) { return _this.openDueDateFromModel(event); };
        this.$scope.isDueDateFromPickerOpened = false;
        this.$scope.isDueDateToPickerOpened = false;
        this.$scope.resolvedCollection = stringConstants.unmatchedItemResolvedCollection;
        this.$scope.transferGoodsDetails.DueDate = new Date();
        this.$scope.checkRejectedItemRequestQuantityForItems = function () { return _this.checkRejectedItemRequestQuantityForItems(); };
        this.$scope.removeItemConfirmation = function (index, item) { return _this.removeItemConfirmation(index, item); };
        this.$scope.closeRemoveItemConfirmationDialogBox = function () { return _this.closeRemoveItemConfirmationDialogBox(); };
        this.$scope.itemIndex = 0;
        this.$scope.checkReceiveItemQuantityForItems = function () { return _this.checkReceiveItemQuantityForItems(); };
        this.$scope.clearTransferInventory = function () { return _this.clearTransferInventory(); };
        this.$scope.getSubItemList = function (parenId) { return _this.getSubItemList(parenId); };
        this.$scope.isItemGrid = false;
        this.$scope.checkRejectItemNullRequestQuantity = function (item) { return _this.checkRejectItemNullRequestQuantity(item); };
        this.$scope.IsSendInventory = false;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.itemDeleteConfirmationMessage = stringConstants.itemDeleteConfirmationMessage;
        this.$scope.itemId = 0;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.$scope.validQuantityError = stringConstants.validQuantityError;
        this.initialization();
    }
    InternalTransferGoodsController.prototype.initialization = function () {
        this.getAllBranchList();
    };
    InternalTransferGoodsController.prototype.itemSearchDetails = function () {
        this.itemDetailsModelDialogBox = this.$modal.open({
            templateUrl: 'itemSearchDialogBox',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
    };
    InternalTransferGoodsController.prototype.getSubItemList = function (parentId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {
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
    };
    InternalTransferGoodsController.prototype.checkRequestQuantityForItems = function () {
        var flag = false;
        var controllerScope = this.$scope;
        if (controllerScope.inventoryItemCollection !== undefined && controllerScope.inventoryItemCollection !== null) {
            if (controllerScope.inventoryItemCollection.length > 0) {
                for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                    if (controllerScope.inventoryItemCollection[i].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[i].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[i].RequestQuantity !== null && !controllerScope.inventoryItemCollection[i].IsErrorMessage)
                        flag = true;
                    else {
                        flag = false;
                        break;
                    }
                }
            }
            else {
                controllerScope.isDispalyItemTransferDetails = false;
            }
        }
        return flag;
    };
    InternalTransferGoodsController.prototype.checkRejectedItemRequestQuantityForItems = function () {
        var flag = true;
        var controllerScope = this.$scope;
        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer !== null) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer.length > 0) {
                if (controllerScope.transferGoodsDetails.IsReceiving) {
                    for (var i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== null)
                            flag = true;
                        else {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === undefined || controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === null) {
                                flag = false;
                                break;
                            }
                            else {
                                flag = true;
                            }
                        }
                    }
                }
                else {
                    for (var j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== null && !controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage)
                            flag = true;
                        else {
                            flag = false;
                            break;
                        }
                    }
                }
            }
            else {
                controllerScope.isDispalyItemTransferDetails = false;
            }
        }
        return flag;
    };
    InternalTransferGoodsController.prototype.checkRejectItemNullRequestQuantity = function (item) {
        var controllerScope = this.$scope;
        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer.length > 0) {
            var itemSystemQuantity = 0;
            for (var i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ItemId === item.ItemId) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== null && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity !== null) {
                        for (var j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
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
                    }
                    else {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity = 0;
                        var itemSystemQuantity_1 = 0;
                        for (var j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ParentItemId === item.ParentItemId) {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity !== null) {
                                    itemSystemQuantity_1 = itemSystemQuantity_1 + (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].RequestQuantity * controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].BaseUnitCount);
                                }
                                controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage = false;
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].ItemId === item.ItemId) {
                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsErrorMessage = false;
                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[j].IsWarningMesssage = false;
                                }
                            }
                        }
                        this.updateRejectedItemQunatity(item);
                        for (var k = 0; k < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; k++) {
                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].ItemId !== item.ItemId) {
                                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].ParentItemId === item.ParentItemId) {
                                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity < itemSystemQuantity_1) {
                                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsSendInventory) {
                                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = true;
                                        }
                                        else {
                                            controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                        }
                                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                    }
                                    else {
                                        if (itemSystemQuantity_1 > controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity) {
                                            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsSendInventory) {
                                                if ((itemSystemQuantity_1 - controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity) < controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = true;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((itemSystemQuantity_1 + controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity) > controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].MinimumQunatity) {
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
                                                if ((controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity - itemSystemQuantity_1) < controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].MinimumQunatity) {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = true;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsWarningMesssage = false;
                                                    controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].SystemQuantity + itemSystemQuantity_1) > controllerScope.transferGoodsDetails.ItemInventoryTransfer[k].MinimumQunatity) {
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
    };
    InternalTransferGoodsController.prototype.updateRejectedItemQunatity = function (item) {
        //SystemQuantity
        var controllerScope = this.$scope;
        var itemCount = item.BaseUnitCount * item.RequestQuantity;
        var parentItemQunatity = 0;
        var isUpdateItemQuantity = false;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
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
                for (var j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
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
    };
    InternalTransferGoodsController.prototype.removeRejectedItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var isParentItem = false;
        var parentItemQunatity = 0;
        var oldQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ItemId === controllerScope.itemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    var itemCount = item.BaseUnitCount * item.OldRequestQuantity;
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
            for (var j = 0; j < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; j++) {
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
            var updateItemQuantity = 0;
            var itemExist = false;
            for (var k = 0; k < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; k++) {
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
                for (var p = 0; p < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; p++) {
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
    };
    InternalTransferGoodsController.prototype.removeItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var isParentItem = false;
        var parentItemQunatity = 0;
        var oldQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
            if (controllerScope.inventoryItemCollection[i].ItemId === controllerScope.itemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    var itemCount = item.BaseUnitCount * item.OldRequestQuantity;
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
            for (var j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
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
            var updateItemQuantity = 0;
            var itemExist = false;
            for (var k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
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
                for (var p = 0; p < controllerScope.inventoryItemCollection.length; p++) {
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
    };
    InternalTransferGoodsController.prototype.updateItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var itemCount = item.BaseUnitCount * item.RequestQuantity;
        var isParentItem = false;
        var parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
            if (controllerScope.inventoryItemCollection[i].ItemId === controllerScope.itemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    if (item.OldRequestQuantity !== item.RequestQuantity) {
                        if (item.OldRequestQuantity < item.RequestQuantity) {
                            var requestDiff = item.RequestQuantity - item.OldRequestQuantity;
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
                            var requestDiff = item.OldRequestQuantity - item.RequestQuantity;
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
            for (var j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
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
            var updateItemQuantity = 0;
            var itemExist = false;
            if (item.OldRequestQuantity !== item.RequestQuantity) {
                for (var k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
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
                for (var p = 0; p < controllerScope.inventoryItemCollection.length; p++) {
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
    };
    InternalTransferGoodsController.prototype.updateNewlyAddedItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var isParentItem = false;
        var parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.itemId = item.ItemId;
        }
        else {
            controllerScope.itemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
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
            for (var j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
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
            var updateItemQunatity = 0;
            var itemExist = false;
            for (var k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
                if (controllerScope.inventoryItemCollection[k].ParentItemId === controllerScope.itemId) {
                    if (controllerScope.inventoryItemCollection[k].ItemId !== item.ItemId) {
                        updateItemQunatity = controllerScope.inventoryItemCollection[k].UpdateSystemQunatity;
                        itemExist = true;
                        break;
                    }
                }
            }
            for (var p = 0; p < controllerScope.inventoryItemCollection.length; p++) {
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
    };
    InternalTransferGoodsController.prototype.checkNullRequestQuantity = function (item) {
        var controllerScope = this.$scope;
        if (controllerScope.inventoryItemCollection.length > 0) {
            var itemSystemQuantity = 0;
            for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                if (controllerScope.inventoryItemCollection[i].ItemId === item.ItemId) {
                    if (controllerScope.inventoryItemCollection[i].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[i].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[i].RequestQuantity !== null) {
                        for (var j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
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
                    }
                    else {
                        controllerScope.inventoryItemCollection[i].RequestQuantity = 0;
                        var itemSystemQuantity_2 = 0;
                        for (var j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                            if (controllerScope.inventoryItemCollection[j].ParentItemId === item.ParentItemId) {
                                if (controllerScope.inventoryItemCollection[j].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[j].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[j].RequestQuantity !== null) {
                                    itemSystemQuantity_2 = itemSystemQuantity_2 + (controllerScope.inventoryItemCollection[j].RequestQuantity * controllerScope.inventoryItemCollection[j].BaseUnitCount);
                                }
                                controllerScope.inventoryItemCollection[j].IsErrorMessage = false;
                                if (controllerScope.inventoryItemCollection[j].ItemId === item.ItemId) {
                                    controllerScope.inventoryItemCollection[j].IsErrorMessage = false;
                                    controllerScope.inventoryItemCollection[j].IsWarningMesssage = false;
                                }
                            }
                        }
                        this.removeItemQunatity(item);
                        for (var k = 0; k < controllerScope.inventoryItemCollection.length; k++) {
                            if (controllerScope.inventoryItemCollection[k].ItemId !== item.ItemId) {
                                if (controllerScope.inventoryItemCollection[k].ParentItemId === item.ParentItemId) {
                                    if (controllerScope.inventoryItemCollection[k].SystemQuantity < itemSystemQuantity_2) {
                                        if (controllerScope.inventoryItemCollection[k].IsSendInventory) {
                                            controllerScope.inventoryItemCollection[k].IsErrorMessage = true;
                                        }
                                        else {
                                            controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                        }
                                        controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                    }
                                    else {
                                        if (itemSystemQuantity_2 > controllerScope.inventoryItemCollection[k].SystemQuantity) {
                                            if (controllerScope.inventoryItemCollection[k].IsSendInventory) {
                                                if ((itemSystemQuantity_2 - controllerScope.inventoryItemCollection[k].SystemQuantity) < controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = true;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((itemSystemQuantity_2 + controllerScope.inventoryItemCollection[k].SystemQuantity) > controllerScope.inventoryItemCollection[k].MinimumQunatity) {
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
                                                if ((controllerScope.inventoryItemCollection[k].SystemQuantity - itemSystemQuantity_2) < controllerScope.inventoryItemCollection[k].MinimumQunatity) {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = true;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                                else {
                                                    controllerScope.inventoryItemCollection[k].IsWarningMesssage = false;
                                                    controllerScope.inventoryItemCollection[k].IsErrorMessage = false;
                                                }
                                            }
                                            else {
                                                if ((controllerScope.inventoryItemCollection[k].SystemQuantity + itemSystemQuantity_2) > controllerScope.inventoryItemCollection[k].MinimumQunatity) {
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
    };
    InternalTransferGoodsController.prototype.serchItemDetails = function () {
        var searching = [];
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.errorItemMessage = false;
        //create sub Item Search List;
        var subItemSearch = [];
        if (controllerScope.itemSearchCollection.length > 0) {
            for (var i = 0; i < controllerScope.itemSearchCollection.length; i++) {
                if (controllerScope.itemSearchCollection[i].listOfChildProfileAC !== null && controllerScope.itemSearchCollection[i].listOfChildProfileAC !== undefined) {
                    for (var j = 0; j < controllerScope.itemSearchCollection[i].listOfChildProfileAC.length; j++) {
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
                for (var i = 0; i < controllerScope.itemSearchCollection.length; i++) {
                    for (var j = 0; j < searching.length; j++) {
                        if (controllerScope.itemSearchCollection[i].Id === searching[j].ParentItemId) {
                            var isAlreadyExists = true;
                            for (var k = 0; k < controllerScope.itemCollection.length; k++) {
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
    };
    InternalTransferGoodsController.prototype.searchInventoryDetails = function () {
        var isNoSearch = false;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.errorMessageDisplayForBlankList = false;
        var fromDate;
        if (controllerScope.searchDate.IssueFromDate !== null && controllerScope.searchDate.IssueFromDate !== undefined) {
            var nowFrom = new Date(controllerScope.searchDate.IssueFromDate);
            nowFrom.setTime(nowFrom.getTime() + (330 * 60 * 1000));
            fromDate = nowFrom.toISOString().substr(0, 10);
        }
        var toDate;
        if (controllerScope.searchDate.IssueDate !== null && controllerScope.searchDate.IssueDate !== undefined) {
            var nowTo = new Date(controllerScope.searchDate.IssueDate);
            nowTo.setTime(nowTo.getTime() + (330 * 60 * 1000));
            toDate = nowTo.toISOString().substr(0, 10);
        }
        var fromDueDateDate;
        if (controllerScope.searchDate.DueFromDate !== null && controllerScope.searchDate.DueFromDate !== undefined) {
            var nowFromDueDate = new Date(controllerScope.searchDate.DueFromDate);
            nowFromDueDate.setTime(nowFromDueDate.getTime() + (330 * 60 * 1000));
            fromDueDateDate = nowFromDueDate.toISOString().substr(0, 10);
        }
        var toDueDate;
        if (controllerScope.searchDate.DueDate !== null && controllerScope.searchDate.DueDate !== undefined) {
            var nowToDueDate = new Date(controllerScope.searchDate.DueDate);
            nowToDueDate.setTime(nowToDueDate.getTime() + (330 * 60 * 1000));
            toDueDate = nowToDueDate.toISOString().substr(0, 10);
        }
        if (controllerScope.inventoryTransferCollection.length > 0) {
            for (var i = 0; i < controllerScope.inventoryTransferCollection.length; i++) {
                if ((fromDate !== undefined && toDate !== undefined && fromDate !== null && toDate !== null) || (fromDueDateDate !== undefined && toDueDate !== undefined && fromDueDateDate !== null && toDueDate !== null)) {
                    if ((new Date(controllerScope.inventoryTransferCollection[i].IssuedDateTime).toISOString().substr(0, 10) >= fromDate && new Date(controllerScope.inventoryTransferCollection[i].IssuedDateTime).toISOString().substr(0, 10) <= toDate) || (new Date(controllerScope.inventoryTransferCollection[i].DueDate).toISOString().substr(0, 10) >= fromDueDateDate && new Date(controllerScope.inventoryTransferCollection[i].DueDate).toISOString().substr(0, 10) <= toDueDate)) {
                        controllerScope.tempList.push(controllerScope.inventoryTransferCollection[i]);
                    }
                }
            }
        }
        if (controllerScope.tempList.length > 0) {
            if ((controllerScope.searchTransfer.CurrentBranchId !== undefined && controllerScope.searchTransfer.CurrentBranchId !== null) ||
                (controllerScope.searchTransfer.TargetBranchId !== undefined && controllerScope.searchTransfer.TargetBranchId !== null) ||
                (controllerScope.searchTransfer.RequestNo !== undefined && controllerScope.searchTransfer.RequestNo !== null) ||
                (controllerScope.searchTransfer.RequestTypeId !== undefined && controllerScope.searchTransfer.RequestTypeId !== null)) {
                controllerScope.inventoryTransferCollection = this.filterFilter((controllerScope.tempList), controllerScope.searchTransfer);
            }
            else {
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
        }
        else {
            /* change pagination with $scope.filtered */
            if (controllerScope.inventoryTransferCollection.length === 0) {
                this.$scope.errorMessage = stringConstants.errorMessage;
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.searchTransfer = [];
                controllerScope.searchDate = [];
            }
            else {
                controllerScope.searchTransfer = [];
                controllerScope.searchDate = [];
                controllerScope.errorMessageDisplayForBlankList = false;
            }
        }
        controllerScope.tempList = [];
        controllerScope.searchTransfer = [];
        controllerScope.searchDate = [];
        controllerRootScope.isLoading = false;
    };
    InternalTransferGoodsController.prototype.closeItemDetailModelDialogBox = function () {
        this.itemDetailsModelDialogBox.dismiss('cancel');
    };
    InternalTransferGoodsController.prototype.changeBranchName = function (branchId) {
        var controllerScope = this.$scope;
        controllerScope.isReuestTypeDisabled = false;
        controllerScope.isRequestDisabled = false;
        controllerScope.isBarcodeDisabled = true;
        controllerScope.transferGoodsDetails.RequestTypeId = "";
    };
    InternalTransferGoodsController.prototype.changeRequestType = function (branchId, requestTypeId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.itemCollection = [];
        controllerScope.itemSearchCollection = [];
        var promise = this.internalTransferGoodService.getItemListById(branchId);
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerRootScope.isLoading = false;
                controllerScope.isBarcodeDisabled = false;
                controllerScope.errorItemMessage = true;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isBarcodeDisabled = false;
                for (var i = 0; i < result.length; i++) {
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    InternalTransferGoodsController.prototype.getAllBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.internalTransferGoodService.getAllBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push(result[i]);
                }
                _this.$log.log("get branch List successfully", result.length);
                _this.getAllRequestType();
            }
            else {
                _this.$log.log("get branch List successfully", result.length);
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.isDisplayErrorMessage = true;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    InternalTransferGoodsController.prototype.getAllRequestType = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.requestTypeCollection = [];
        controllerRootScope.isLoading = true;
        var promise = this.internalTransferGoodService.getAllRequestType();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.isDisplayErrorMessage = true;
                controllerRootScope.isLoading = false;
            }
            else {
                _this.$log.log("get request type succssfully");
                for (var i = 0; i < result.length; i++) {
                    controllerScope.requestTypeCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.closeItemValidationDialogBox = function () {
        this.itemValidationDialogBox.dismiss('cancel');
    };
    InternalTransferGoodsController.prototype.getItemDetailsByItemBarcode = function (barcode) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (barcode !== null && barcode !== undefined && barcode !== "") {
            controllerRootScope.isLoading = true;
            var transferGoodsDetails = new Model.InventoryTransferAc();
            transferGoodsDetails = controllerScope.transferGoodsDetails;
            var promise = this.internalTransferGoodService.getItemDetailsByItemBarcode(transferGoodsDetails);
            promise.then(function (result) {
                controllerScope.transferGoodsDetails.Barcode = "";
                var flag = false;
                if (result.IsResultNull) {
                    controllerRootScope.isLoading = false;
                    _this.itemValidationDialogBox = _this.$modal.open({
                        templateUrl: 'itemValidation',
                        backdrop: 'static',
                        keyboard: true,
                        scope: _this.$scope
                    });
                    controllerScope.errorMessage = stringConstants.itemErrorMessage;
                }
                else if (result.IsQuantityRequried) {
                    controllerRootScope.isLoading = false;
                    _this.itemValidationDialogBox = _this.$modal.open({
                        templateUrl: 'itemValidation',
                        backdrop: 'static',
                        keyboard: true,
                        scope: _this.$scope
                    });
                    controllerScope.errorMessage = stringConstants.itemQuantityErrorMessage;
                }
                else {
                    controllerScope.isBranchDisabled = true;
                    controllerScope.errorMessageDisplayForBlankList = false;
                    controllerScope.isDispalyItemTransferDetails = true;
                    controllerScope.isRequestDisabled = true;
                    if (controllerScope.inventoryItemCollection.length > 0) {
                        for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                            if (controllerScope.inventoryItemCollection[i].ItemId === result.ItemId) {
                                flag = true;
                                break;
                            }
                            else {
                                flag = false;
                            }
                        }
                        if (!flag) {
                            controllerScope.inventoryItemCollection.push(result);
                            _this.updateNewlyAddedItemQunatity(result);
                        }
                    }
                    else {
                        controllerScope.inventoryItemCollection.push(result);
                        _this.updateNewlyAddedItemQunatity(result);
                    }
                    controllerRootScope.isLoading = false;
                    _this.$log.log("get item details Succssfully");
                }
            }).catch(function (error) {
                location.replace(_this.apiPath);
                _this.$log.log(error);
            });
        }
        else {
            if (controllerScope.inventoryItemCollection.length !== 0) {
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isDispalyItemTransferDetails = true;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDispalyItemTransferDetails = false;
            }
            return;
        }
    };
    InternalTransferGoodsController.prototype.getItemDetails = function (barcode) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var transferGoodsDetails = new Model.InventoryTransferAc();
        transferGoodsDetails = controllerScope.transferGoodsDetails;
        transferGoodsDetails.Barcode = barcode;
        var promise = this.internalTransferGoodService.getItemDetailsByItemBarcode(transferGoodsDetails);
        promise.then(function (result) {
            var flag = false;
            controllerScope.transferGoodsDetails.Barcode = "";
            _this.closeItemDetailModelDialogBox();
            if (result.IsResultNull) {
                controllerRootScope.isLoading = false;
                controllerRootScope.isLoading = false;
                _this.itemValidationDialogBox = _this.$modal.open({
                    templateUrl: 'itemValidation',
                    backdrop: 'static',
                    keyboard: true,
                    scope: _this.$scope
                });
            }
            else if (result.IsQuantityRequried) {
                controllerRootScope.isLoading = false;
                _this.itemValidationDialogBox = _this.$modal.open({
                    templateUrl: 'itemValidation',
                    backdrop: 'static',
                    keyboard: true,
                    scope: _this.$scope
                });
                controllerScope.errorMessage = stringConstants.itemQuantityErrorMessage;
            }
            else {
                controllerScope.isBranchDisabled = true;
                controllerScope.errorMessageDisplayForBlankList = false;
                controllerScope.isDispalyItemTransferDetails = true;
                controllerScope.isRequestDisabled = true;
                if (controllerScope.inventoryItemCollection.length > 0) {
                    for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
                        if (controllerScope.inventoryItemCollection[i].ItemId === result.ItemId) {
                            flag = true;
                            break;
                        }
                        else {
                            flag = false;
                        }
                    }
                    if (!flag) {
                        controllerScope.inventoryItemCollection.push(result);
                        _this.updateNewlyAddedItemQunatity(result);
                    }
                }
                else {
                    controllerScope.inventoryItemCollection.push(result);
                    _this.updateNewlyAddedItemQunatity(result);
                }
                controllerRootScope.isLoading = false;
                _this.$log.log("get item details Succssfully");
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.submitInventoryTranserRequest = function (transferGoodsDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var that = this;
        controllerRootScope.isLoading = true;
        transferGoodsDetails.ItemInventoryTransfer = controllerScope.inventoryItemCollection;
        var promise = this.internalTransferGoodService.submitInventoryTranserRequest(transferGoodsDetails);
        promise.then(function (result) {
            _this.$log.log("submit transfer good request successfully", result);
            if (result.status === "Work Flow Not Created") {
                that.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                that.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.submitInventoryTransfer
                });
                that.$location.path("/InventoryTransferWorkList");
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.removeItemFromTheItemCollection = function () {
        var controllerScope = this.$scope;
        this.removeItemQunatity(controllerScope.inventoryItemCollection[controllerScope.itemIndex]);
        controllerScope.inventoryItemCollection.splice(controllerScope.itemIndex, 1);
        if (controllerScope.inventoryItemCollection.length === 0) {
            controllerScope.isDispalyItemTransferDetails = false;
            controllerScope.isRequestDisabled = false;
            controllerScope.isBranchDisabled = false;
        }
        else {
            controllerScope.isDispalyItemTransferDetails = true;
            var itemSystemQuantity = 0;
            for (var j = 0; j < controllerScope.inventoryItemCollection.length; j++) {
                if (controllerScope.inventoryItemCollection[j].ParentItemId === controllerScope.itemDetails.ParentItemId) {
                    if (controllerScope.inventoryItemCollection[j].RequestQuantity !== 0 && controllerScope.inventoryItemCollection[j].RequestQuantity !== undefined && controllerScope.inventoryItemCollection[j].RequestQuantity !== null) {
                        itemSystemQuantity = itemSystemQuantity + (controllerScope.inventoryItemCollection[j].RequestQuantity * controllerScope.inventoryItemCollection[j].BaseUnitCount);
                    }
                    controllerScope.inventoryItemCollection[j].IsErrorMessage = false;
                }
            }
            for (var i = 0; i < controllerScope.inventoryItemCollection.length; i++) {
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
    };
    InternalTransferGoodsController.prototype.getAllInventoryTransferList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryTransferCollection = [];
        controllerScope.inventorySearchCollection = [];
        var promise = this.internalTransferGoodService.getAllInventoryTransferList();
        promise.then(function (result) {
            _this.$log.log("get inventory transfer list susscussfully", result.length);
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = false;
                for (var i = 0; i < result.length; i++) {
                    controllerScope.inventoryTransferCollection.push(result[i]);
                }
                controllerScope.inventorySearchCollection = controllerScope.inventoryTransferCollection;
                controllerScope.isDataLoading = false;
                _this.getBranchList();
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
        ;
    };
    InternalTransferGoodsController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        //To get branch list
        var promise = this.issueStockInventoryService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchCollection.push({ BranchId: result[i].Id, Name: result[i].Name });
                }
                _this.$log.log("get branch list successfully");
                controllerScope.isDataLoading = false;
            }
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    InternalTransferGoodsController.prototype.viewInternalTransferGoodDetails = function (inventoryTransferId) {
        this.$location.path("/InventoryTransferDetails/" + inventoryTransferId);
    };
    InternalTransferGoodsController.prototype.viewInternalTransferGoodDetailsById = function () {
        var _this = this;
        var inventoryTransferId = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.transferGoodsDetails = new Model.InventoryTransferAc();
        var promise = this.internalTransferGoodService.viewInternalTransferGoodDetailsById(inventoryTransferId);
        promise.then(function (result) {
            controllerScope.transferGoodsDetails = result;
            _this.$log.log("get inventory transfer detail successfully", result);
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.reviewTransferInventoryById = function (transferGoodsDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var that = this;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.internalTransferGoodService.reviewTransferInventoryById(transferGoodsDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIssueInventory
                });
                that.cancelTransferInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.transferInventoryApprovalById = function (transferGoodsDetails, status) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        transferGoodsDetails.IsStatus = status;
        var promise = this.internalTransferGoodService.transferInventoryApprovalById(transferGoodsDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else if (result.status === "Receipt Print") {
                _this.ngToast.create({
                    className: 'success',
                    content: stringConstants.approvalIssueInventory
                });
                _this.printTransferGoodReceipt(transferGoodsDetails.InventoryTransferId);
                _this.cancelTransferInventory();
            }
            else {
                if (status) {
                    _this.ngToast.create({
                        className: 'success',
                        content: stringConstants.approvalIssueInventory
                    });
                }
                else {
                    _this.ngToast.create({
                        className: 'success',
                        content: stringConstants.rejectIssueInventory
                    });
                }
                _this.cancelTransferInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.reSubmitTransferInventory = function (transferGoodsDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.internalTransferGoodService.reSubmitTransferInventory(transferGoodsDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                _this.ngToast.create({
                    className: 'success',
                    content: stringConstants.reviewIssueInventory
                });
                _this.cancelTransferInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    InternalTransferGoodsController.prototype.cancelTransferInventory = function () {
        this.$location.path("/InventoryTransferWorkList");
    };
    InternalTransferGoodsController.prototype.initiateTransferInventory = function () {
        this.$location.path("/InventoryTransfer");
    };
    InternalTransferGoodsController.prototype.receiveTransferInventoryById = function (transferGoodsDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var that = this;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.internalTransferGoodService.receiveTransferInventoryById(transferGoodsDetails);
        promise.then(function (result) {
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                that.ngToast.create({
                    className: 'success',
                    content: stringConstants.receiveTransferInventory
                });
                that.cancelTransferInventory();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    //this method used for issue date to date Picker 
    InternalTransferGoodsController.prototype.openIssueDateToModel = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isOpenIssueDateToModel = true;
    };
    //this method used for issue date to date Picker 
    InternalTransferGoodsController.prototype.openIssueDateFromModel = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isOpenIssueDateFromModel = true;
    };
    InternalTransferGoodsController.prototype.printTransferGoodReceipt = function (transferGoodsDetails) {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.internalTransferGoodService.printTransferGoodReceipt(transferGoodsDetails);
        promise.then(function (result) {
            _this.$log.log("print sussessfully", result);
            _this.printer.print("/Templates/InternalTransferGoods/InventoryTransferReceipt.html", result);
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            _this.$log.log(error);
        });
    };
    //this method used for issue date to date Picker 
    InternalTransferGoodsController.prototype.dueDatePickerOpen = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDatePickerOpened = true;
    };
    InternalTransferGoodsController.prototype.changeReceiveingQuantity = function (itemInventoryTransferId) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ItemInventoryTransferId === itemInventoryTransferId) {
                if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== null) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity < controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].RequestQuantity) {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = true;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = false;
                        break;
                    }
                    else {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = true;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = false;
                        break;
                    }
                }
                else {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === 0) {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = true;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = false;
                    }
                    else {
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsPartialReceivedItem = false;
                        controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].IsNotReceivedItem = true;
                    }
                    return;
                }
            }
        }
    };
    InternalTransferGoodsController.prototype.checkReceiveItemQuantityForItems = function () {
        var flag = false;
        var controllerScope = this.$scope;
        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer !== null) {
            if (controllerScope.transferGoodsDetails.ItemInventoryTransfer.length > 0) {
                for (var i = 0; i < controllerScope.transferGoodsDetails.ItemInventoryTransfer.length; i++) {
                    if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== 0 && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== undefined && controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity !== null)
                        flag = true;
                    else {
                        if (controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === undefined || controllerScope.transferGoodsDetails.ItemInventoryTransfer[i].ReceivingQuantity === null) {
                            flag = false;
                            break;
                        }
                        else {
                            flag = true;
                        }
                    }
                }
            }
            else {
                controllerScope.isDispalyItemTransferDetails = false;
            }
        }
        return flag;
    };
    InternalTransferGoodsController.prototype.openDueDateToModel = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateToPickerOpened = true;
    };
    InternalTransferGoodsController.prototype.openDueDateFromModel = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateFromPickerOpened = true;
    };
    InternalTransferGoodsController.prototype.removeItemConfirmation = function (index, item) {
        var controllerScope = this.$scope;
        this.openRemoveItemConfirmationDialogBox = this.$modal.open({
            templateUrl: 'removeItemConfiramtion',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.itemIndex = index;
        controllerScope.itemDetails = item;
    };
    InternalTransferGoodsController.prototype.closeRemoveItemConfirmationDialogBox = function () {
        this.openRemoveItemConfirmationDialogBox.dismiss('cancel');
    };
    InternalTransferGoodsController.prototype.clearTransferInventory = function () {
        this.$route.reload();
    };
    return InternalTransferGoodsController;
}());
InternalTransferGoodsController.controllerId = "internalTransferGoodsController";
app.controller(InternalTransferGoodsController.controllerId, ['$scope', '$log', '$location', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', 'internalTransferGoodService', 'issueStockInventoryService', 'printer', '$route', function ($scope, $log, $location, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, internalTransferGoodService, issueStockInventoryService, printer, $route) {
        return new InternalTransferGoodsController($scope, $log, $location, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, internalTransferGoodService, issueStockInventoryService, printer, $route);
    }]);
//# sourceMappingURL=internalTransferGoodsController.js.map
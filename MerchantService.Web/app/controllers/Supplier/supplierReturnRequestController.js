var SupplierReturnRequestController = (function () {
    function SupplierReturnRequestController($scope, $log, supplierReturnRequestService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, $routeParams, printer) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.supplierReturnRequestService = supplierReturnRequestService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.printer = printer;
        this.$scope.supplierReturnRequest = new Model.SupplierReturnRequest();
        this.$scope.getCategoryList = function () { return _this.getCategoryList(); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.getItemProfileList = function (branchId) { return _this.getItemProfileList(branchId); };
        this.$scope.getUnitList = function () { return _this.getUnitList(); };
        this.$scope.selectedBranch = "";
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.pagination = function (currentpg) { return _this.pagination(currentpg); };
        this.$scope.itemSearch = function () { return _this.itemSearch(); };
        this.$scope.addItem = function (id, supplierId, isParentItem) { return _this.addItem(id, supplierId, isParentItem); };
        this.$scope.saveReturnItem = function () { return _this.saveReturnItem(); };
        this.$scope.returnItemList = [];
        this.$scope.search = [];
        this.$scope.getSubItemList = function (parentItemId, SupplierId) { return _this.getSubItemList(parentItemId, SupplierId); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.updateReturnItemList = function () { return _this.updateReturnItemList(); };
        this.$scope.openAddSRRItemPopup = function () { return _this.openAddSRRItemPopup(); };
        this.$scope.closeAddSRRItemPopup = function () { return _this.closeAddSRRItemPopup(); };
        this.$scope.receiptDetails = [];
        this.$scope.itemList = [];
        this.$scope.branchList = [];
        this.$scope.openItemAddRepeatPopup = function () { return _this.openItemAddRepeatPopup(); };
        this.$scope.closeItemAddRepeatPopup = function () { return _this.closeItemAddRepeatPopup(); };
        this.$scope.openDeleteSRRItemPopup = function (Item) { return _this.openDeleteSRRItemPopup(Item); };
        this.$scope.closeDeleteSRRItemPopup = function () { return _this.closeDeleteSRRItemPopup(); };
        this.$scope.getCauseList = function () { return _this.getCauseList(); };
        this.$scope.deleteReturnItem = function (item) { return _this.deleteReturnItem(item); };
        this.$scope.check = function () { return _this.check(); };
        this.$scope.causeList = [];
        this.$scope.returnItem = [];
        this.$scope.isItemListEmpty = false;
        this.$scope.isItemDetailsVisible = false;
        this.$scope.changeQuantity = function (item) { return _this.changeQuantity(item); };
        this.$scope.getSupplierReturnRequest = function () { return _this.getSupplierReturnRequest(); };
        this.$scope.clear = function () { return _this.clear(); };
        this.$scope.checkReturnQuantityValid = function (quantity) { return _this.checkReturnQuantityValid(quantity); };
        this.$scope.isEdit = false;
        this.$scope.openSummaryCNPopup = function () { return _this.openSummaryCNPopup(); };
        this.$scope.closeSummaryCNPopup = function () { return _this.closeSummaryCNPopup(); };
        this.$scope.printReceipt = function (receiptDetails) { return _this.printReceipt(receiptDetails); };
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
    SupplierReturnRequestController.prototype.initialize = function () {
        this.getBranchList();
        this.getSupplierList();
        this.getCauseList();
    };
    SupplierReturnRequestController.prototype.pagination = function (currentpg) {
        var controllerScope = this.$scope;
        controllerScope.totalCollection = [];
        var begin = ((currentpg - 1) * controllerScope.itemsPerPage), end = begin + controllerScope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.itemProfileCollection.slice(begin, end);
        controllerScope.totalItems = controllerScope.itemProfileCollection.length;
    };
    //used to fetch BranchList - jj
    SupplierReturnRequestController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (this.$routeParams.id !== null && this.$routeParams.id !== "" && this.$routeParams.id !== undefined) {
            controllerScope.isEdit = true;
        }
        if (controllerRootScope.merchatSettings.IsAllowToAccessAllBranch || controllerScope.isEdit) {
            var promise = this.supplierReturnRequestService.getBranchList();
            promise.then(function (result) {
                controllerScope.branchList = result;
                controllerRootScope.isLoading = false;
                if (_this.$routeParams.id !== null && _this.$routeParams.id !== "" && _this.$routeParams.id !== undefined) {
                    _this.getSupplierReturnRequest();
                }
            }).catch(function (error) {
                controllerRootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingBranch
                });
            });
        }
        else {
            var promise = this.supplierReturnRequestService.getUserBranchName();
            promise.then(function (result) {
                controllerScope.branchList = result;
                controllerRootScope.isLoading = false;
                if (result.branchName !== null && result.branchName !== undefined) {
                    controllerScope.selectedBranch = result.branchName;
                    controllerScope.supplierReturnRequest.BranchId = result.branchId;
                    _this.getItemProfileList(controllerScope.supplierReturnRequest.BranchId);
                }
                if (_this.$routeParams.id !== null && _this.$routeParams.id !== "" && _this.$routeParams.id !== undefined) {
                    _this.getSupplierReturnRequest();
                }
            }).catch(function (error) {
                controllerRootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingBranch
                });
            });
        }
    };
    //this function used for get item profile list -jj
    SupplierReturnRequestController.prototype.getItemProfileList = function (branchId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isItemDetailsVisible = false;
        if (this.$routeParams.id === null && this.$routeParams.id === "" && this.$routeParams.id === undefined) {
            controllerScope.returnItemList = [];
        }
        controllerScope.itemProfileCollection = [];
        controllerScope.subItemCollection = [];
        var itemProfileList = controllerScope.itemProfileCollection;
        var promise = this.supplierReturnRequestService.getItemProfileList(branchId);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.isItemDetailsVisible = true;
                    for (var i = 0; i < result.length; i++) {
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingItems
            });
        });
    };
    //This function used for get sub item list. -An
    SupplierReturnRequestController.prototype.getSubItemList = function (parentId, supplierId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (parentId !== 0 && parentId !== undefined && parentId !== null && supplierId !== 0 && supplierId !== undefined && supplierId !== null) {
            var parent_1 = parseFloat((parentId.toString() + supplierId.toString()));
            controllerRootScope.isLoading = true;
            var getClass = angular.element("#" + parent_1).find('i.action-icon').hasClass('fa-plus');
            if (getClass === true) {
                angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
                angular.element("#subChild" + parent_1).removeClass('isHide').addClass('isShowRow');
                angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');
                angular.element("#" + parent_1).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
            }
            else {
                angular.element("#subChild" + parent_1).removeClass('isShowRow').addClass('isHide');
                angular.element("#" + parent_1).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
            }
        }
        controllerRootScope.isLoading = false;
    };
    //used to fetch list of return cause - jj
    SupplierReturnRequestController.prototype.getCauseList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.supplierReturnRequestService.getCauseList(35);
        promise.then(function (result) {
            controllerScope.causeList = result;
            _this.getCategoryList();
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingReturnCauseList
            });
        });
    };
    // used to fetch supplier list
    SupplierReturnRequestController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnRequestService.getSupplierList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get category list.
    SupplierReturnRequestController.prototype.getCategoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnRequestService.getCategoryList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
                controllerScope.unitList = [];
                _this.getUnitList();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to get unit list 
    SupplierReturnRequestController.prototype.getUnitList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnRequestService.getUnitList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to search item
    SupplierReturnRequestController.prototype.itemSearch = function () {
        var controllerScope = this.$scope;
        var itemList = [];
        controllerScope.isItemDetailsVisible = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.itemProfileCollection = controllerScope.itemList;
        itemList = this.filterFilter(controllerScope.itemList, controllerScope.search);
        var parentIdList = [];
        for (var j = 0; j < itemList.length; j++) {
            parentIdList.push({ Id: itemList[j].ItemId });
        }
        var searchList = [];
        for (var i = 0; i < controllerScope.itemList.length; i++) {
            searchList.push(controllerScope.itemList[i]);
            var isParentSelected = false;
            for (var c = 0; c < parentIdList.length; c++) {
                if (controllerScope.itemList[i].ItemId === parentIdList[c].Id) {
                    isParentSelected = true;
                }
            }
            if (controllerScope.itemList[i].HasChildItem && !isParentSelected) {
                for (var j = 0; j < controllerScope.itemList[i].listOfChildProfileAC.length; j++) {
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
    };
    //used to add selected item to the return item list - jj
    SupplierReturnRequestController.prototype.addItem = function (id, supplierId, isParentItem) {
        var controllerScope = this.$scope;
        var isAllowed = 0;
        var IsSupplierAllowed = true;
        var section_pos = angular.element(".return-grid-section").offset();
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
            for (var j = 0; j < controllerScope.returnItemList.length; j++) {
                if (id === controllerScope.returnItemList[j].ItemId && supplierId === controllerScope.returnItemList[j].SupplierId) {
                    isAllowed = 1;
                }
            }
            if (isAllowed === 0) {
                for (var i = 0; i < controllerScope.itemProfileCollection.length; i++) {
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
                        for (var c = 0; c < controllerScope.itemProfileCollection[i].listOfChildProfileAC.length; c++) {
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
    };
    SupplierReturnRequestController.prototype.updateReturnItemList = function () {
        var controllerScope = this.$scope;
        this.closeAddSRRItemPopup();
        controllerScope.returnItem.OldRequestQuantity = 0;
        controllerScope.returnItemList.push(controllerScope.returnItem);
        this.updateNewlyAddedItemQunatity(controllerScope.returnItem);
    };
    // used for opening the AddSRRItemPopup-jj
    SupplierReturnRequestController.prototype.openAddSRRItemPopup = function () {
        var controllerScope = this.$scope;
        this.addSRRItemPopup = this.$modal.open({
            templateUrl: 'AddSRRItemPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the AddItemRepeatPopup-jj
    SupplierReturnRequestController.prototype.closeAddSRRItemPopup = function () {
        this.addSRRItemPopup.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    };
    // used for opening the AddItemRepeatPopup-jj
    SupplierReturnRequestController.prototype.openItemAddRepeatPopup = function () {
        var controllerScope = this.$scope;
        this.itemAddRepeat = this.$modal.open({
            templateUrl: 'AddItemRepeatPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the AddItemRepeatPopup-jj
    SupplierReturnRequestController.prototype.closeItemAddRepeatPopup = function () {
        this.itemAddRepeat.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    };
    // used for opening the DeleteSRRItemPopup-jj
    SupplierReturnRequestController.prototype.openDeleteSRRItemPopup = function (Item) {
        var controllerScope = this.$scope;
        this.itemAddRepeat = this.$modal.open({
            templateUrl: 'DeleteSRRItemPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.Item = Item;
    };
    //used for closing  the DeleteSRRItemPopup-jj
    SupplierReturnRequestController.prototype.closeDeleteSRRItemPopup = function () {
        this.itemAddRepeat.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.errorMessage = "";
    };
    //used to save Return Request - jj
    SupplierReturnRequestController.prototype.saveReturnItem = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var list = [];
        if (controllerScope.returnItemList.length !== 0) {
            for (var i = 0; i < controllerScope.returnItemList.length; i++) {
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
                var promise = this.supplierReturnRequestService.updateSupplierReturnRequest(controllerScope.supplierReturnRequest);
                promise.then(function (result) {
                    if (result.status === "ok") {
                        _this.ngToast.create(stringConstants.SRRUpdetedSuccessfully);
                        _this.$location.path("/SupplierReturnRequestWorkList");
                    }
                    else if (result.status !== undefined && result.status !== null) {
                        if (result.status === stringConstants.alreadyActivityProcessed) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.alreadyActivityDone
                            });
                        }
                        else {
                            controllerScope.errorMessage = result.status;
                            _this.openItemAddRepeatPopup();
                        }
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.ErrorinUpdatingSRR
                        });
                    }
                    controllerRootScope.isLoading = false;
                }).catch(function (error) {
                    controllerRootScope.isLoading = false;
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.ErrorinUpdatingSRR
                    });
                });
            }
            else {
                var promise = this.supplierReturnRequestService.saveSupplierReturnRequest(controllerScope.supplierReturnRequest);
                promise.then(function (result) {
                    if (result.Status === "ok") {
                        _this.ngToast.create(stringConstants.SRRSavedSucceessfully);
                        _this.$location.path("/SupplierReturnRequestWorkList");
                    }
                    else if (result.Status === "print") {
                        _this.ngToast.create(stringConstants.SRRCompletedSucceessfully);
                        var promise_1 = _this.supplierReturnRequestService.printReturnReceipt("", result.SupplierReturnId);
                        promise_1.then(function (result1) {
                            controllerScope.receiptDetails = result1;
                            _this.openSummaryCNPopup();
                        }).catch(function (error) {
                            _this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.SRRReceiptGenerationFailed
                            });
                            controllerRootScope.isLoading = false;
                        });
                    }
                    else if (result.Status !== undefined && result.Status !== null) {
                        controllerScope.errorMessage = result.Status;
                        _this.openItemAddRepeatPopup();
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.ErrorinSavingSRR
                        });
                    }
                    controllerRootScope.isLoading = false;
                }).catch(function (error) {
                    controllerRootScope.isLoading = false;
                    _this.ngToast.create({
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
    };
    // used for opening the SummaryCNPopup-jj
    SupplierReturnRequestController.prototype.openSummaryCNPopup = function () {
        var controllerScope = this.$scope;
        this.summaryCNPopup = this.$modal.open({
            templateUrl: 'SummaryCN',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the SummaryCNPopup-jj
    SupplierReturnRequestController.prototype.closeSummaryCNPopup = function () {
        this.summaryCNPopup.dismiss('cancel');
    };
    //used to redirect to worklist page - jj
    SupplierReturnRequestController.prototype.cancel = function () {
        this.$location.path("/SupplierReturnRequestWorkList");
    };
    //used to print receipt - jj
    SupplierReturnRequestController.prototype.printReceipt = function (receiptDetails) {
        receiptDetails.TotalQuantity = 0;
        receiptDetails.TotalCostPrice = 0;
        this.closeSummaryCNPopup();
        for (var i = 0; i < receiptDetails.SupplierReturnItemAC.length; i++) {
            receiptDetails.SupplierReturnItemAC[i].TotalCostPrice = (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice);
            receiptDetails.TotalQuantity = receiptDetails.TotalQuantity + parseFloat("" + receiptDetails.SupplierReturnItemAC[i].ReturnQuantity);
            receiptDetails.TotalCostPrice = receiptDetails.TotalCostPrice + parseFloat("" + (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice));
        }
        this.printer.print("/Templates/Supplier/SupplierReturnReceipt.html", receiptDetails);
        this.$location.path("/SupplierReturnRequestWorkList");
    };
    //used to delete items selected to be returned - jj
    SupplierReturnRequestController.prototype.deleteReturnItem = function (item) {
        var controllerScope = this.$scope;
        var list = [];
        this.removeItemQunatity(item);
        for (var i = 0; i < controllerScope.returnItemList.length; i++) {
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
    };
    //used to check whether quantity of the returned item is added - jj
    SupplierReturnRequestController.prototype.check = function () {
        var status = 0;
        var controllerScope = this.$scope;
        if (controllerScope.returnItemList.length === 0) {
            status = 1;
        }
        else {
            for (var i = 0; i < controllerScope.returnItemList.length; i++) {
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
    };
    //used to check return quantity - jj
    SupplierReturnRequestController.prototype.changeQuantity = function (item) {
        var controllerScope = this.$scope;
        var count = 0;
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
    };
    //used for fetching supplier return request - jj
    SupplierReturnRequestController.prototype.getSupplierReturnRequest = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnRequestService.getSupplierReturnRequest(this.$routeParams.id);
        promise.then(function (result) {
            controllerScope.supplierReturnRequest = result;
            controllerScope.returnItemList = controllerScope.supplierReturnRequest.SupplierReturnItemAC;
            for (var j = 0; j < controllerScope.returnItemList.length; j++) {
                _this.updateItemQunatity(controllerScope.returnItemList[j]);
            }
            controllerScope.isItemDetailsVisible = true;
            controllerRootScope.isLoading = false;
            _this.getItemProfileList(controllerScope.supplierReturnRequest.BranchId);
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingSRRList
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to clear all data - jj
    SupplierReturnRequestController.prototype.clear = function () {
        var controllerScope = this.$scope;
        controllerScope.returnItemList = [];
    };
    //this function used for remove item quantity. - jj
    SupplierReturnRequestController.prototype.removeItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var isParentItem = false;
        var parentItemQunatity = 0;
        var oldQuantity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.returnId = item.Id;
        }
        else {
            controllerScope.returnId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.returnItemList.length; i++) {
            if (controllerScope.returnItemList[i].Id === controllerScope.returnId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    var itemCount = item.BaseUnit * item.OldRequestQuantity;
                    if (item.IsParentItem) {
                        controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity + itemCount;
                        controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                        parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
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
            for (var j = 0; j < controllerScope.returnItemList.length; j++) {
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
            var updateItemQuantity = 0;
            for (var k = 0; k < controllerScope.returnItemList.length; k++) {
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
                for (var p = 0; p < controllerScope.returnItemList.length; p++) {
                    if (controllerScope.returnItemList[p].ParentItemId === controllerScope.returnId) {
                        controllerScope.returnItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.returnItemList[p].BaseUnit);
                        controllerScope.returnItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }
    };
    //this function used for update item quanity.- jj
    SupplierReturnRequestController.prototype.updateItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var itemCount = item.BaseUnit * item.ReturnQuantity;
        var isParentItem = false;
        var parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.returnId = item.Id;
        }
        else {
            controllerScope.returnId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.returnItemList.length; i++) {
            if (controllerScope.returnItemList[i].Id === controllerScope.returnId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    if (item.OldRequestQuantity !== item.ReturnQuantity) {
                        if (item.OldRequestQuantity < item.ReturnQuantity) {
                            var requestDiff = item.ReturnQuantity - item.OldRequestQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity - itemCount;
                                controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                            else {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity - itemCount;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                        else {
                            var requestDiff = item.OldRequestQuantity - item.ReturnQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.returnItemList[i].SystemQuantity = controllerScope.returnItemList[i].SystemQuantity + itemCount;
                                controllerScope.returnItemList[i].OldRequestQuantity = item.ReturnQuantity;
                                parentItemQunatity = controllerScope.returnItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
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
            for (var j = 0; j < controllerScope.returnItemList.length; j++) {
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
                var updateItemQuantity = 0;
                for (var k = 0; k < controllerScope.returnItemList.length; k++) {
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
                for (var p = 0; p < controllerScope.returnItemList.length; p++) {
                    if (controllerScope.returnItemList[p].ParentItemId === controllerScope.returnId) {
                        controllerScope.returnItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.returnItemList[p].BaseUnit);
                        controllerScope.returnItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }
    };
    // this function used for update item quantity when add new main and sub item.- jj
    SupplierReturnRequestController.prototype.updateNewlyAddedItemQunatity = function (item) {
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
        for (var i = 0; i < controllerScope.returnItemList.length; i++) {
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
            for (var j = 0; j < controllerScope.returnItemList.length; j++) {
                if (controllerScope.returnItemList[j].Id === item.Id) {
                    controllerScope.returnItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.returnItemList[j].BaseUnit);
                }
            }
        }
        else {
            var updateItemQunatity = 0;
            var itemExist = false;
            for (var k = 0; k < controllerScope.returnItemList.length; k++) {
                if (controllerScope.returnItemList[k].ParentItemId === controllerScope.returnId) {
                    if (controllerScope.returnItemList[k].Id !== item.Id) {
                        updateItemQunatity = controllerScope.returnItemList[k].UpdateSystemQunatity;
                        itemExist = true;
                        break;
                    }
                }
            }
            for (var p = 0; p < controllerScope.returnItemList.length; p++) {
                if (controllerScope.returnItemList[p].Id === item.Id) {
                    if (itemExist) {
                        controllerScope.returnItemList[p].SystemQuantity = Math.floor(updateItemQunatity / controllerScope.returnItemList[p].BaseUnit);
                        controllerScope.returnItemList[p].UpdateSystemQunatity = updateItemQunatity;
                    }
                }
            }
        }
    };
    SupplierReturnRequestController.prototype.checkReturnQuantityValid = function (quantity) {
        var controllerScope = this.$scope;
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
    };
    return SupplierReturnRequestController;
}());
SupplierReturnRequestController.controllerId = "SupplierReturnRequestController";
app.controller(SupplierReturnRequestController.controllerId, ['$scope', '$log', 'SupplierReturnRequestService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', '$routeParams', 'printer', function ($scope, $log, SupplierReturnRequestService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, $routeParams, printer) {
        return new SupplierReturnRequestController($scope, $log, SupplierReturnRequestService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, $routeParams, printer);
    }]);
//# sourceMappingURL=supplierReturnRequestController.js.map
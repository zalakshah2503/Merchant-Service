var SupplierPOController = (function () {
    function SupplierPOController($scope, $log, supplierPOService, ngToast, $rootScope, apiPath, filterFilter, $modal, $routeParams, $location, $filter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.supplierPOService = supplierPOService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.$filter = $filter;
        this.$scope.itemProfile = new Model.AddNewItemProfile();
        this.$scope.supplierPO = new Model.SupplierPO();
        this.$scope.poItemId = 0;
        this.$scope.getSupplierItem = function (id) { return _this.getSupplierItem(id); };
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.getUserBranchList = function () { return _this.getUserBranchList(); };
        this.$scope.addPurchaseOrderGrid = function () { return _this.addPurchaseOrderGrid(); };
        this.$scope.minStartDate = new Date();
        this.$scope.deletePurchaseOrderGrid = function (id) { return _this.deletePurchaseOrderGrid(id); };
        this.$scope.saveSupplierPO = function (supplierPO, isSubmit) { return _this.saveSupplierPO(supplierPO, isSubmit); };
        this.$scope.getSPO = function () { return _this.getSPO(); };
        this.$scope.updateSPO = function (supplierPO) { return _this.updateSPO(supplierPO); };
        this.$scope.close = function () { return _this.close(); };
        this.$scope.itemSelection = [];
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.cpoListEmptyError = stringConstants.cpoListEmptyError;
        this.$scope.openItemSearchPopup = function () { return _this.openItemSearchPopup(); };
        this.$scope.closeItemSearchPopup = function () { return _this.closeItemSearchPopup(); };
        this.$scope.validCostPriceError = stringConstants.validCostPriceError;
        this.$scope.openItemAddtoSPOPopup = function () { return _this.openItemAddtoSPOPopup(); };
        this.$scope.closeItemAddtoSPOPopup = function () { return _this.closeItemAddtoSPOPopup(); };
        this.$scope.checkQuantity = function (po) { return _this.checkQuantity(po); };
        this.$scope.selectAll = function () { return _this.selectAll(); };
        this.$scope.deSelectOneItem = function (id) { return _this.deSelectOneItem(id); };
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
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.isDueDatePickerOpened = false;
        this.$scope.openDueDatePicker = function (event) { return _this.openDueDatePicker(event); };
        this.$scope.search = [];
        this.$scope.itemDetailList = [];
        this.$scope.searchItems = function () { return _this.searchItems(); };
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            if (_this.$scope.itemList !== null && _this.$scope.itemList !== undefined) {
                _this.$scope.totalCollection = _this.$scope.itemList.slice(begin, end);
            }
        });
        this.$scope.ValidDiscountMessage = stringConstants.ValidDiscountMessage;
        this.$scope.supplierRequired = stringConstants.supplierRequired;
        this.$scope.openItemQuantityErrorPopup = function (actualQuantity) { return _this.openItemQuantityErrorPopup(actualQuantity); };
        this.$scope.closeItemQuantityErrorPopup = function () { return _this.closeItemQuantityErrorPopup(); };
        this.$scope.userBranch = "";
        this.$scope.openPOItemDeletePopup = function (poItemId) { return _this.openPOItemDeletePopup(poItemId); };
        this.$scope.closePOItemDeletePopup = function () { return _this.closePOItemDeletePopup(); };
        this.$scope.userBranchId = 0;
        this.$scope.onQuantityChange = function (item) { return _this.onQuantityChange(item); };
        this.$scope.branchRequired = true;
        this.$scope.branchModel = [];
        this.$scope.selectsettings = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true
        };
        this.initialize();
    }
    SupplierPOController.prototype.initialize = function () {
        this.$scope.supplierPO.DueDate = new Date();
        this.getSupplierList();
        this.getUserBranchList();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getSPO();
        }
    };
    //used to fetch branchlist of user's company - jj
    SupplierPOController.prototype.getUserBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        var promise = this.supplierPOService.getUserBranchList();
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.length !== 0) {
                    for (var i = 0; i < result.length; i++) {
                        controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                    }
                    if (_this.$rootScope.merchatSettings.IsAllowToCreateSupplierPurchaseOrderForOtherBranch || _this.$rootScope.merchatSettings.IsAllowToAccessAllBranch) {
                    }
                    else {
                        var promise_1 = _this.supplierPOService.getUserBranchName();
                        promise_1.then(function (result) {
                            if (result.branchName !== null && result.branchName !== undefined) {
                                controllerScope.userBranch = result.branchName;
                                controllerScope.userBranchId = result.branchId;
                                controllerScope.branchRequired = false;
                                var isBranchModelSet = false;
                                if (controllerScope.branchModel !== undefined && controllerScope.branchModel !== null && controllerScope.branchModel.length > 0) {
                                    for (var b = 0; b < controllerScope.branchModel.length; b++) {
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
                        }).catch(function (error) {
                            if (error.status !== 500) {
                                location.replace(_this.apiPath);
                            }
                            rootScope.isLoading = false;
                        });
                    }
                }
            }
            rootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            rootScope.isLoading = false;
        });
    };
    //after editting for branch related change - jj
    // used to fetch Item List of the supplier
    SupplierPOController.prototype.getSupplierItem = function (supplier) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
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
                var itemCollection_1 = controllerScope.itemList;
                if (controllerScope.isEdit) {
                    controllerScope.supplierName = controllerScope.supplierPO.SupplierName;
                }
                else {
                    controllerScope.supplierName = controllerScope.supplierPO.supplier.Name;
                }
                var branchId = 0;
                if (controllerScope.supplierPO.BranchId === null || controllerScope.supplierPO.BranchId === undefined) {
                    branchId = 0;
                }
                else {
                    branchId = controllerScope.supplierPO.BranchId;
                }
                var promise = this.supplierPOService.getItemList(supplier.Id, branchId);
                promise.then(function (result) {
                    if (result.length === 0) {
                        controllerRootScope.isLoading = false;
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {
                            result[i].IsSelected = false;
                            itemCollection_1.push(result[i]);
                            controllerScope.itemTotalCollection = itemCollection_1;
                            var that = _this;
                            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                            controllerScope.totalCollection = itemCollection_1.slice(begin, end);
                            /* init pagination  */
                            controllerScope.totalItems = controllerScope.itemList.length;
                        }
                        _this.setSelectedItems();
                        if (_this.$rootScope.merchatSettings.IsAllowToCreateSupplierPurchaseOrderForOtherBranch || _this.$rootScope.merchatSettings.IsAllowToAccessAllBranch) {
                        }
                        else {
                            controllerScope.supplierPO.InitiationBranchId = controllerScope.userBranchId;
                        }
                        controllerRootScope.isLoading = false;
                    }
                }).catch(function (error) {
                    if (error.status !== 500) {
                        location.replace(_this.apiPath);
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
    };
    // used to fetch supplier list
    SupplierPOController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierPOService.getSupplierList();
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
    //after edit
    SupplierPOController.prototype.addPurchaseOrderGrid = function () {
        var controllerScope = this.$scope;
        //for set scroll position
        var section_pos = angular.element("#polist-section").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top - 200 }, 300);
        for (var i = 0; i < controllerScope.purchaseOrderList.length; i++) {
            for (var j = 0; j < controllerScope.itemTotalCollection.length; j++) {
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
        for (var n = 0; n < controllerScope.itemTotalCollection.length; n++) {
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
    };
    //used to open date picker
    SupplierPOController.prototype.openDueDatePicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDatePickerOpened = true;
    };
    // used for opening the DeleteUserPopup-jj
    SupplierPOController.prototype.openItemSearchPopup = function () {
        var controllerScope = this.$scope;
        this.itemSearchPopup = this.$modal.open({
            templateUrl: 'ItemSearch',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the DeleteUserPopup-jj
    SupplierPOController.prototype.closeItemSearchPopup = function () {
        this.itemSearchPopup.dismiss('cancel');
    };
    //supplier profile search panel.
    SupplierPOController.prototype.searchItems = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.itemList = this.filterFilter((controllerScope.itemTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.itemList.length === 0) {
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.itemList.slice(begin, end);
            controllerScope.totalItems = controllerScope.itemList.length;
        }
        controllerScope.search = [];
    };
    //after edit
    //used to remoce item from selected item list - jj
    SupplierPOController.prototype.deletePurchaseOrderGrid = function (id) {
        var controllerScope = this.$scope;
        this.closePOItemDeletePopup();
        var temp = [];
        //  temp = controllerScope.purchaseOrderList;
        for (var i = 0; i < controllerScope.purchaseOrderList.length; i++) {
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
        for (var l = 0; l < controllerScope.itemList.length; l++) {
            if (controllerScope.itemList[l].Id === id) {
                controllerScope.itemList[l].Select = false;
            }
        }
    };
    SupplierPOController.prototype.uncheckedSelectedItem = function (data) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.itemTotalCollection.length; i++) {
            if (controllerScope.itemTotalCollection[i].ItemId === data) {
                controllerScope.itemTotalCollection[i].IsSelected = false;
                break;
            }
        }
    };
    //used to create supplier PO - jj
    SupplierPOController.prototype.saveSupplierPO = function (supplierPO, isSubmit) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootscope = this.$rootScope;
        controllerRootscope.isLoading = true;
        if (controllerScope.branchModel !== null && controllerScope.branchModel !== undefined) {
            controllerScope.branchError = false;
            if (controllerScope.branchModel.length !== 0) {
                supplierPO.SPOBranch = controllerScope.branchModel;
                var count = 0;
                controllerRootscope.isLoading = true;
                if (controllerScope.purchaseOrderList.length === 0) {
                    this.openItemAddtoSPOPopup();
                    controllerRootscope.isLoading = false;
                    controllerScope.isEmptyItemList = true;
                    controllerScope.isEmptyItemQuantity = false;
                }
                else {
                    for (var j = 0; j < controllerScope.purchaseOrderList.length; j++) {
                        if (controllerScope.purchaseOrderList[j].OrderQuantity <= 0 || controllerScope.purchaseOrderList[j].OrderCostPrice <= 0) {
                            controllerScope.purchaseOrderList[j].FreeQuantity = "";
                            controllerScope.purchaseOrderList[j].OrderCostPrice = "";
                            count++;
                        }
                    }
                    if (count === 0) {
                        supplierPO.SupplierItem = [];
                        for (var i = 0; i < controllerScope.purchaseOrderList.length; i++) {
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
                            var promise = this.supplierPOService.addSupplierPO(supplierPO);
                            promise.then(function (result) {
                                if (result.status === "SPO Created") {
                                    controllerRootscope.isLoading = false;
                                    var x = _this;
                                    x.$location.path("/SupplierPOWorkList/");
                                    if (isSubmit === 1) {
                                        _this.ngToast.create(stringConstants.spoCreated);
                                    }
                                    else {
                                        _this.ngToast.create(stringConstants.SPOSavedSuccessfully);
                                    }
                                }
                                else {
                                    controllerRootscope.isLoading = false;
                                    _this.ngToast.create({
                                        className: 'danger',
                                        content: stringConstants.workFlowNotCreated
                                    });
                                }
                            }).catch(function (error) {
                                _this.ngToast.create({
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
    };
    //USED TO FETCH SPO OF THE GIVEN ID - jj
    SupplierPOController.prototype.getSPO = function () {
        var _this = this;
        var id = this.$routeParams.id;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        controllerScope.isEdit = true;
        if (controllerScope.isEdit && rootScope.merchatSettings.IsAllowToCreateSupplierPurchaseOrderForOtherBranch) {
            controllerScope.branchRequired = false;
        }
        var promise = this.supplierPOService.getSupplierPO(id);
        promise.then(function (result) {
            controllerScope.supplierPO = result;
            controllerScope.branchModel = [];
            for (var i = 0; i < controllerScope.supplierPO.SPOBranch.length; i++) {
                controllerScope.branchModel.push({ Id: controllerScope.supplierPO.SPOBranch[i].Id });
            }
            controllerScope.purchaseOrderList = controllerScope.supplierPO.SupplierItem;
            controllerScope.supplierPO.SupplierProfile = controllerScope.supplierPO.SupplierProfile;
            controllerScope.supplierPO.supplier = controllerScope.supplierPO.SupplierProfile;
            controllerScope.supplierName = controllerScope.supplierPO.SupplierName;
            rootScope.isLoading = false;
            _this.getSupplierItem(controllerScope.supplierPO.SupplierProfile);
            _this.setSelectedItems();
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            rootScope.isLoading = false;
        });
    };
    //used to set selected items - jj
    SupplierPOController.prototype.setSelectedItems = function () {
        var controllerScope = this.$scope;
        if (controllerScope.purchaseOrderList !== null && controllerScope.purchaseOrderList !== undefined && controllerScope.purchaseOrderList.length > 0) {
            if (controllerScope.itemTotalCollection !== null && controllerScope.itemTotalCollection !== undefined && controllerScope.itemTotalCollection.length > 0) {
                for (var i = 0; i < controllerScope.purchaseOrderList.length; i++) {
                    for (var j = 0; j < controllerScope.itemTotalCollection.length; j++) {
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
    };
    //USED TO EDIT SPO - jj
    SupplierPOController.prototype.updateSPO = function (supplierPO) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        supplierPO.SPOBranch = controllerScope.branchModel;
        if (controllerScope.branchModel !== null && controllerScope.branchModel !== undefined) {
            controllerScope.branchError = false;
            if (controllerScope.branchModel.length !== 0) {
                supplierPO.SPOBranch = controllerScope.branchModel;
                var count = 0;
                if (controllerScope.purchaseOrderList.length === 0) {
                    this.openItemAddtoSPOPopup();
                    rootScope.isLoading = false;
                    controllerScope.isEmptyItemList = true;
                    controllerScope.isEmptyItemQuantity = false;
                }
                else {
                    for (var j = 0; j < controllerScope.purchaseOrderList.length; j++) {
                        if (controllerScope.purchaseOrderList[j].OrderQuantity <= 0) {
                            count++;
                        }
                    }
                    if (count === 0) {
                        supplierPO.SupplierItem = [];
                        for (var i = 0; i < controllerScope.purchaseOrderList.length; i++) {
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
                        var promise = this.supplierPOService.updateSupplierPO(supplierPO);
                        promise.then(function (result) {
                            if (result.status !== null && result.status !== undefined) {
                                if (result.status === stringConstants.alreadyActivityProcessed) {
                                    _this.ngToast.create({
                                        className: 'danger',
                                        content: stringConstants.alreadyActivityDone
                                    });
                                }
                                else {
                                    _this.ngToast.create({
                                        className: 'danger',
                                        content: result.status
                                    });
                                }
                            }
                            else {
                                _this.ngToast.create(stringConstants.spoUpdated);
                                var x = _this;
                                x.$location.path("/SupplierPOWorkList/");
                            }
                            rootScope.isLoading = false;
                        }).catch(function (error) {
                            _this.ngToast.create(stringConstants.spoNotUpdated);
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
    };
    //used to redirect to worklist - jj
    SupplierPOController.prototype.close = function () {
        var x = this;
        x.$location.path("/SupplierPOWorkList/");
    };
    // used for opening the DeleteUserPopup-jj
    SupplierPOController.prototype.openItemAddtoSPOPopup = function () {
        var controllerScope = this.$scope;
        this.addItemtoSPOPopup = this.$modal.open({
            templateUrl: 'AddItemtoSPOPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the DeleteUserPopup-jj
    SupplierPOController.prototype.closeItemAddtoSPOPopup = function () {
        this.addItemtoSPOPopup.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.isEmptyItemList = false;
        controllerScope.isEmptyItemQuantity = false;
    };
    //used to check whether requested quantity available - jj
    SupplierPOController.prototype.checkQuantity = function (po) {
        var controllerScope = this.$scope;
        var total = parseInt("" + po.ActualQuantity) + parseInt("" + po.MaxQuantity);
        if (po.OrderQuantity > total) {
            controllerScope.branchError = false;
            this.openItemQuantityErrorPopup(total);
            po.OrderQuantity = total;
            controllerScope.actualQuantity = total;
        }
    };
    //used to open ItemQuantityErrorPopup - jj
    SupplierPOController.prototype.openItemQuantityErrorPopup = function (actualQuantity) {
        var controllerScope = this.$scope;
        this.itemQuantityErrorPopup = this.$modal.open({
            templateUrl: 'ItemQuantityErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.actualQuantity = actualQuantity;
    };
    //used to close ItemQuantityErrorPopup - jj
    SupplierPOController.prototype.closeItemQuantityErrorPopup = function () {
        this.itemQuantityErrorPopup.dismiss('cancel');
    };
    //used to open POItemDeletePopup - jj
    SupplierPOController.prototype.openPOItemDeletePopup = function (poItemId) {
        var controllerScope = this.$scope;
        this.poItemDeletePopup = this.$modal.open({
            templateUrl: 'POItemDeletePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.poItemId = poItemId;
    };
    //used to close POItemDeletePopup - jj
    SupplierPOController.prototype.closePOItemDeletePopup = function () {
        this.poItemDeletePopup.dismiss('cancel');
    };
    //used to fetch branchlist - jj
    SupplierPOController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        var promise = this.supplierPOService.getBranchList();
        promise.then(function (result) {
            if (result.length === 0) {
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
            rootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            rootScope.isLoading = false;
        });
    };
    //used to calculate percentage discount based on free quantity - jj
    SupplierPOController.prototype.onQuantityChange = function (item) {
        var controllerScope = this.$scope;
        var orderQuantity = parseInt(item.OrderQuantity);
        var freeQuantity = parseInt(item.FreeQuantity);
        var costPrice = parseInt(item.OrderCostPrice);
        var totalQuantity = orderQuantity + freeQuantity;
        var totalAmountPayable = orderQuantity * costPrice;
        item.PercentageDiscount = parseFloat((((costPrice - (totalAmountPayable / totalQuantity)) * 100) / costPrice).toFixed(2));
    };
    //used to select or deselect all the items in the itemList - jj
    SupplierPOController.prototype.selectAll = function () {
        var controllerScope = this.$scope;
        if (controllerScope.itemSelection.Select) {
            for (var i = 0; i < controllerScope.itemTotalCollection.length; i++) {
                controllerScope.itemTotalCollection[i].IsSelected = true;
            }
        }
        else {
            for (var i = 0; i < controllerScope.itemTotalCollection.length; i++) {
                controllerScope.itemTotalCollection[i].IsSelected = false;
            }
        }
    };
    //used to deselect an item - jj
    SupplierPOController.prototype.deSelectOneItem = function (id) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.purchaseOrderList.length; i++) {
            if (controllerScope.purchaseOrderList[i].ItemId = id) {
            }
        }
    };
    return SupplierPOController;
}());
SupplierPOController.controllerId = "SupplierPOController";
app.controller(SupplierPOController.controllerId, ['$scope', '$log', 'SupplierPOService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$routeParams', '$location', '$filter', function ($scope, $log, SupplierPOService, ngToast, $rootScope, apiPath, filterFilter, $modal, $routeParams, $location, $filter) {
        return new SupplierPOController($scope, $log, SupplierPOService, ngToast, $rootScope, apiPath, filterFilter, $modal, $routeParams, $location, $filter);
    }]);
//# sourceMappingURL=supplierPOController.js.map
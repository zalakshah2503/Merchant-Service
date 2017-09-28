var ItemDestructionRequestController = (function () {
    function ItemDestructionRequestController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.ItemDestructionService = ItemDestructionService;
        this.ngToast = ngToast;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.printer = printer;
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
        this.$scope.closeItemAddErrorPopup = function () { return _this.closeItemAddErrorPopup(); };
        this.$scope.destructionItemList = [];
        this.$scope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
        this.$scope.itemsPerPage = 5;
        this.$scope.isSameSupplierInList = true;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.getSubItemList = function (parentId, supplierId) { return _this.getSubItemList(parentId, supplierId); };
        this.$scope.openItemListPopup = function () { return _this.openItemListPopup(); };
        this.$scope.cancelButtonForItemPopup = function () { return _this.cancelButtonForItemPopup(); };
        this.$scope.viewItemDetail = function (item) { return _this.viewItemDetail(item); };
        this.$scope.searchButton = function () { return _this.searchButton(); };
        this.$scope.deletedestructionItem = function (id) { return _this.deletedestructionItem(id); };
        this.$scope.closeDeleteItemPopup = function () { return _this.closeDeleteItemPopup(); };
        this.$scope.branchList = [];
        this.$scope.errorMessageForNotAddedDestructionItem = true;
        this.$scope.deleteDestructionItem = function () { return _this.deleteDestructionItem(); };
        this.$scope.compareSystemQuantityWithIndex = function (systemQuantity, destructionQuantity, index) { return _this.compareSystemQuantityWithIndex(systemQuantity, destructionQuantity, index); };
        this.$scope.submitButton = function () { return _this.submitButton(); };
        this.$scope.clickCancelButton = function () { return _this.clickCancelButton(); };
        this.$scope.updateButton = function () { return _this.updateButton(); };
        this.$scope.isSubmit = true;
        this.$scope.branchChangeEvent = function (branchId) { return _this.branchChangeEvent(branchId); };
        this.$scope.selectAll = function () { return _this.selectAll(); };
        this.$scope.viewItemList = function () { return _this.viewItemList(); };
        this.$scope.supplierPopupOk = function () { return _this.supplierPopupOk(); };
        this.$scope.closeAlreadyExistsItemDestructionPopup = function () { return _this.closeAlreadyExistsItemDestructionPopup(); };
        this.$scope.closeSupplierExpireReturnAcceptPopup = function () { return _this.closeSupplierExpireReturnAcceptPopup(); };
        this.$scope.clickOnYesButtonForItemDestruction = function () { return _this.clickOnYesButtonForItemDestruction(); };
        this.$scope.closeCreditNotePopup = function () { return _this.closeCreditNotePopup(); };
        this.$scope.clickOnOkButton = function () { return _this.clickOnOkButton(); };
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
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.itemSupplierCollection.slice(begin, end);
        });
    }
    ItemDestructionRequestController.prototype.initialization = function () {
        this.getUnitTypeList();
        this.getCategoryList();
        this.getBranchList();
        this.getSupplierList();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getItemDestructionRequestDetailById(this.$routeParams.id);
            this.$scope.isSubmit = false;
        }
    };
    ItemDestructionRequestController.prototype.clickOnOkButton = function () {
        this.$location.path("/ItemDestructionWorkList");
        this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", this.$scope.itemDestructionReceiptDetail);
        this.popupCreditNote.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.supplierPopupOk = function () {
        this.itemDestructionSameSupplierPopup.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.closeAlreadyExistsItemDestructionPopup = function () {
        this.alreadyExistsItemDestructionPopup.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.closeSupplierExpireReturnAcceptPopup = function () {
        this.supplierExpireReturnAcceptPopup.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.closeCreditNotePopup = function () {
        this.popupCreditNote.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.clickOnYesButtonForItemDestruction = function () {
        var _this = this;
        this.$scope.isDataLoading = true;
        this.alreadyExistsItemDestructionPopup.dismiss('cancel');
        var promise = this.ItemDestructionService.SubmitDestructionItemRequest(this.$scope.ItemDestructionRequestModel);
        promise.then(function (result) {
            if (result._isResult.IsResult === "true") {
                if (result._isResult.SupplierName !== undefined && result._isResult.CreditNoteNumber !== undefined && result._isResult.Amount !== undefined &&
                    result._isResult.SupplierName !== null && result._isResult.CreditNoteNumber !== null && result._isResult.Amount !== null) {
                    _this.$scope.supplierName = result._isResult.SupplierName;
                    _this.$scope.creditNoteNumber = result._isResult.CreditNoteNumber;
                    _this.$scope.amount = result._isResult.Amount;
                    _this.$scope.itemDestructionReceiptDetail = result._isResult;
                    _this.creditNotePopup();
                }
                else {
                    _this.$location.path("/ItemDestructionWorkList");
                    _this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", result._isResult);
                }
            }
            else if (result._isResult.IsResult === "NotExists") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result._isResult.IsResult === "false") {
                _this.ngToast.create(stringConstants.itemDestructionRequestSucessfully);
                _this.$location.path("/ItemDestructionWorkList");
            }
            _this.$scope.isDataLoading = false;
        }).catch(function (error) {
            _this.$scope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemDestructionRequestController.prototype.clickCancelButton = function () {
        this.$scope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel;
        this.searchButton();
        this.$scope.isRequestDetail = false;
        this.$scope.destructionItemList = [];
        this.$scope.isDestructionQuantityRequired = false;
    };
    ItemDestructionRequestController.prototype.viewItemList = function () {
        var section_pos = angular.element(".request-section").offset();
        angular.element('html,body').animate({ scrollTop: section_pos.top - 200 }, 300);
        this.$scope.isRequestDetail = true;
        this.$scope.errorMessageForNotAddedDestructionItem = false;
    };
    ItemDestructionRequestController.prototype.selectAll = function () {
        this.$scope.destructionItemList = [];
        if (this.$scope.totalItemSupplierList.length > 0) {
            if (this.$scope.selectedAll) {
                for (var i = 0; i < this.$scope.totalItemSupplierList.length; i++) {
                    if (this.$scope.totalItemSupplierList[i].SystemQuantity > 0) {
                        this.$scope.totalItemSupplierList[i].Checked = true;
                        this.$scope.destructionItemList.push(this.$scope.totalItemSupplierList[i]);
                    }
                    if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== undefined) {
                        for (var j = 0; j < this.$scope.totalItemSupplierList[i].listOfChildProfileAC.length; j++) {
                            if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].SystemQuantity > 0) {
                                this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].Checked = true;
                                this.$scope.destructionItemList.push(this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j]);
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this.$scope.totalItemSupplierList.length; i++) {
                    this.$scope.totalItemSupplierList[i].Checked = false;
                    this.$scope.destructionItemList.splice(i, 1);
                    if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== undefined) {
                        for (var j = 0; j < this.$scope.totalItemSupplierList[i].listOfChildProfileAC.length; j++) {
                            this.$scope.totalItemSupplierList[i].listOfChildProfileAC[j].Checked = false;
                            this.$scope.destructionItemList.splice(j, 1);
                        }
                    }
                }
                if (this.$scope.destructionItemList.length <= 0) {
                    var controllerScope = this.$scope;
                    controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
                    controllerScope.itemDestructionRequest.$setPristine();
                    controllerScope.itemDestructionRequest.$setValidity();
                    controllerScope.itemDestructionRequest.$setUntouched();
                    this.$scope.isRequestDetail = false;
                }
            }
        }
    };
    ItemDestructionRequestController.prototype.branchChangeEvent = function (branchId) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel;
        controllerScope.destructionItemList = [];
        this.$scope.isRequestDetail = false;
        controllerScope.isDestructionQuantityRequired = false;
        controllerScope.itemSupplierCollection = [];
        var itemSupplierList = controllerScope.itemSupplierCollection;
        var promise = this.ItemDestructionService.getSupplierItemListByBranchId(branchId);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                _this.$scope.ItemDestructionRequestModel.branchId = result.BranchId;
                if (result.listOfItemProfileAC.length > 0) {
                    for (var i = 0; i < result.listOfItemProfileAC.length; i++) {
                        itemSupplierList.push(result.listOfItemProfileAC[i]);
                    }
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = itemSupplierList.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.itemSupplierCollection.length;
                    controllerScope.totalItemSupplierList = controllerScope.itemSupplierCollection;
                }
                else {
                    _this.$scope.errorMessageDisplayForBlankList = true;
                }
            }
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemDestructionRequestController.prototype.closeDeleteItemPopup = function () {
        this.deletePopup.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.getItemDestructionRequestDetailById = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        this.$scope.errorMessageForNotAddedDestructionItem = true;
        this.$scope.isRequestDetail = true;
        //To get branch list
        var promise = this.ItemDestructionService.getItemDestructionRequestById(id);
        promise.then(function (result) {
            if (result._isResult !== false) {
                _this.$scope.ItemDestructionRequestModel.intiatedId = result._isResult.intiatedId;
                _this.$scope.ItemDestructionRequestModel.branchId = result._isResult.branchId;
                _this.$scope.ItemDestructionRequestModel.destructioCasueId = result._isResult.destructioCasueId;
                _this.$scope.errorMessageForNotAddedDestructionItem = false;
                if (result._isResult.listOfItemProfileAC.length > 0) {
                    for (var i = 0; i < result._isResult.listOfItemProfileAC.length; i++) {
                        _this.$scope.destructionItemList.push(result._isResult.listOfItemProfileAC[i]);
                    }
                    _this.BindItemDestruction(_this.$scope.destructionItemList);
                }
            }
            else {
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
    ItemDestructionRequestController.prototype.BindItemDestruction = function (destructionList) {
        if (destructionList.length > 0) {
            for (var i = 0; i < destructionList.length; i++) {
                if (this.$scope.totalItemSupplierList.length > 0) {
                    for (var j = 0; j < this.$scope.totalItemSupplierList.length; j++) {
                        if (destructionList[i].Id === this.$scope.totalItemSupplierList[j].Id) {
                            this.$scope.totalItemSupplierList[j].Checked = true;
                        }
                        if (this.$scope.totalItemSupplierList[j].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[j].listOfChildProfileAC !== undefined) {
                            for (var k = 0; k < this.$scope.totalItemSupplierList[j].listOfChildProfileAC.length; k++) {
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
    };
    //this funciton usedvi for cancel button for item popup. - An
    ItemDestructionRequestController.prototype.viewItemDetail = function (item) {
        var isAlreadyExistsItem = false;
        var isNotSameSupplier = false;
        if (item !== undefined && item !== null) {
            if (item.Checked === true) {
                for (var j = 0; j < this.$scope.destructionItemList.length; j++) {
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
                for (var i = 0; i < this.$scope.destructionItemList.length; i++) {
                    if (this.$scope.destructionItemList[i].Id === item.Id) {
                        this.$scope.destructionItemList[i].DestructionQuantity = 0;
                        this.removeItemQunatity(this.$scope.destructionItemList[i]);
                        this.$scope.destructionItemList.splice(i, 1);
                    }
                }
            }
        }
        if (this.$scope.destructionItemList.length <= 0) {
            var controllerScope = this.$scope;
            controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
            controllerScope.itemDestructionRequest.$setPristine();
            controllerScope.itemDestructionRequest.$setValidity();
            controllerScope.itemDestructionRequest.$setUntouched();
            this.$scope.destructionItemList = [];
            this.$scope.isRequestDetail = false;
            this.$scope.selectedAll = false;
            this.searchButton();
        }
    };
    ItemDestructionRequestController.prototype.closeItemAddErrorPopup = function () {
        this.itemAddErrorPopup.dismiss('cancel');
    };
    ItemDestructionRequestController.prototype.submitButton = function () {
        var _this = this;
        this.$scope.isDataLoading = true;
        if (this.$scope.isFirstClick) {
            var isValid = true;
            if (this.$scope.destructionItemList.length > 0) {
                isValid = this.CheckIfSupplierAcceptsReturnForExpireItems(this.$scope.destructionItemList[0].SupplierId);
                if (!isValid) {
                    this.$scope.isDataLoading = false;
                    return;
                }
            }
            this.$scope.isFirstClick = false;
            isValid = true;
            var isDestructionQuantityValid = true;
            this.$scope.isDestructionQuantityRequired = false;
            for (var i = 0; i < this.$scope.destructionItemList.length; i++) {
                if (this.$scope.destructionItemList[i].DestructionQuantity <= 0 ||
                    this.$scope.destructionItemList[i].DestructionQuantity === "")
                    isValid = false;
                else if (this.$scope.destructionItemList[i].ActualQuantity < this.$scope.destructionItemList[i].DestructionQuantity)
                    isDestructionQuantityValid = false;
            }
            if (isValid) {
                if (isDestructionQuantityValid) {
                    this.$scope.ItemDestructionRequestModel.listOfItemProfileAC = this.$scope.destructionItemList;
                    var promise = this.ItemDestructionService.checkItemAlreadyDestructed(this.$scope.ItemDestructionRequestModel);
                    promise.then(function (result) {
                        if (result._isResult === true) {
                            var promise_1 = _this.ItemDestructionService.SubmitDestructionItemRequest(_this.$scope.ItemDestructionRequestModel);
                            promise_1.then(function (result) {
                                if (result._isResult !== null && result._isResult !== undefined) {
                                    if (result._isResult.IsResult === "true") {
                                        if (result._isResult.SupplierName !== undefined && result._isResult.CreditNoteNumber !== undefined && result._isResult.Amount !== undefined &&
                                            result._isResult.SupplierName !== null && result._isResult.CreditNoteNumber !== null && result._isResult.Amount !== null) {
                                            _this.$scope.supplierName = result._isResult.SupplierName;
                                            _this.$scope.creditNoteNumber = result._isResult.CreditNoteNumber;
                                            _this.$scope.amount = result._isResult.Amount;
                                            _this.$scope.itemDestructionReceiptDetail = result._isResult;
                                            _this.creditNotePopup();
                                        }
                                        else {
                                            _this.$location.path("/ItemDestructionWorkList");
                                            _this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", result._isResult);
                                        }
                                    }
                                    else if (result._isResult.IsResult === "NotExists") {
                                        _this.ngToast.create({
                                            className: 'danger',
                                            content: stringConstants.workFlowNotCreated
                                        });
                                    }
                                    else if (result._isResult.IsResult === "false") {
                                        _this.ngToast.create(stringConstants.itemDestructionRequestSucessfully);
                                        _this.$location.path("/ItemDestructionWorkList");
                                    }
                                }
                                _this.$scope.isFirstClick = true;
                                _this.$scope.isDataLoading = false;
                            }).catch(function (error) {
                                _this.$scope.isDataLoading = false;
                                _this.$log.log(error);
                                if (error.status !== 500) {
                                    //if user is not authenticated that time it will redirect to the login page.
                                    location.replace(_this.apiPath);
                                }
                            });
                        }
                        else {
                            _this.$scope.itemNameList = result._isResult;
                            _this.OpenPoupForAlreadyItemDesturcionExists();
                            _this.$scope.isDataLoading = false;
                            _this.$scope.isFirstClick = true;
                        }
                    }).catch(function (error) {
                        _this.$scope.isDataLoading = false;
                        _this.$log.log(error);
                        if (error.status !== 500) {
                            //if user is not authenticated that time it will redirect to the login page.
                            location.replace(_this.apiPath);
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
    };
    //Open the credit not popup
    ItemDestructionRequestController.prototype.creditNotePopup = function () {
        this.popupCreditNote = this.$modal.open({
            templateUrl: 'popupCreditNoteDetail',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    ItemDestructionRequestController.prototype.OpenPoupForAlreadyItemDesturcionExists = function () {
        this.alreadyExistsItemDestructionPopup = this.$modal.open({
            templateUrl: 'alreadyExistsItemDestruciton',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    ItemDestructionRequestController.prototype.CheckIfSupplierAcceptsReturnForExpireItems = function (id) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === id) {
                var supplier = controllerScope.supplierList[i];
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
    };
    ItemDestructionRequestController.prototype.updateButton = function () {
        var _this = this;
        this.$scope.isDataLoading = true;
        var isDestructionQuantityValid = true;
        this.$scope.isDestructionQuantityRequired = false;
        var isValid = true;
        if (this.$scope.destructionItemList.length > 0) {
            isValid = this.CheckIfSupplierAcceptsReturnForExpireItems(this.$scope.destructionItemList[0].SupplierId);
            if (!isValid) {
                this.$scope.isDataLoading = false;
                return;
            }
        }
        for (var i = 0; i < this.$scope.destructionItemList.length; i++) {
            if (this.$scope.destructionItemList[i].DestructionQuantity <= 0 || this.$scope.destructionItemList[i].DestructionQuantity === "")
                isValid = false;
            else if (this.$scope.destructionItemList[i].SystemQuantity < this.$scope.destructionItemList[i].DestructionQuantity)
                isDestructionQuantityValid = false;
        }
        if (isValid) {
            if (isDestructionQuantityValid) {
                this.$scope.ItemDestructionRequestModel.listOfItemProfileAC = this.$scope.destructionItemList;
                this.$scope.ItemDestructionRequestModel.destructionId = this.$routeParams.id;
                var promise = this.ItemDestructionService.UpdateDestructionItemRequest(this.$scope.ItemDestructionRequestModel);
                promise.then(function (result) {
                    if (result._isResult === true) {
                        _this.ngToast.create(stringConstants.itemDestructionRequestUpdateSucessfully);
                        _this.$location.path("/ItemDestructionWorkList");
                    }
                    else if (result._isResult === "NotExists") {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.workFlowNotCreated
                        });
                    }
                    else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                    }
                    else if (result._isResult === false) {
                    }
                }).catch(function (error) {
                    _this.$scope.isDataLoading = false;
                    _this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(_this.apiPath);
                    }
                });
            }
        }
        else {
            this.$scope.isDestructionQuantityRequired = true;
        }
        this.$scope.isDataLoading = false;
    };
    ItemDestructionRequestController.prototype.compareSystemQuantityWithIndex = function (systemQuantity, item, index) {
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
    };
    //this function used for remove item quantity.
    ItemDestructionRequestController.prototype.removeItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var isParentItem = false;
        var parentItemQunatity = 0;
        var oldQuantity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.destructionItemId = item.Id;
        }
        else {
            controllerScope.destructionItemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.destructionItemList.length; i++) {
            if (controllerScope.destructionItemList[i].Id === controllerScope.destructionItemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    var itemCount = item.BaseUnit * item.OldRequestQuantity;
                    if (item.IsParentItem) {
                        controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity + itemCount;
                        controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                        parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                        isParentItem = true;
                        break;
                    }
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
            for (var j = 0; j < controllerScope.destructionItemList.length; j++) {
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
            var updateItemQuantity = 0;
            for (var k = 0; k < controllerScope.destructionItemList.length; k++) {
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
                for (var p = 0; p < controllerScope.destructionItemList.length; p++) {
                    if (controllerScope.destructionItemList[p].ParentItemId === controllerScope.destructionItemId) {
                        controllerScope.destructionItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.destructionItemList[p].BaseUnit);
                        controllerScope.destructionItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }
    };
    //this function used for update item quanity.
    ItemDestructionRequestController.prototype.updateItemQunatity = function (item) {
        var controllerScope = this.$scope;
        var itemCount = item.BaseUnit * item.DestructionQuantity;
        var isParentItem = false;
        var parentItemQunatity = 0;
        //parent-item && sub-item Quantity increase and decrease calculation 
        if (item.IsParentItem) {
            controllerScope.destructionItemId = item.Id;
        }
        else {
            controllerScope.destructionItemId = item.ParentItemId;
        }
        for (var i = 0; i < controllerScope.destructionItemList.length; i++) {
            if (controllerScope.destructionItemList[i].Id === controllerScope.destructionItemId) {
                if (item.OldRequestQuantity !== 0 && item.OldRequestQuantity !== undefined && item.OldRequestQuantity !== null) {
                    if (item.OldRequestQuantity !== item.DestructionQuantity) {
                        if (item.OldRequestQuantity < item.DestructionQuantity) {
                            var requestDiff = item.DestructionQuantity - item.OldRequestQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity - itemCount;
                                controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                            else {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity - itemCount;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
                        }
                        else {
                            var requestDiff = item.OldRequestQuantity - item.DestructionQuantity;
                            itemCount = requestDiff * item.BaseUnit;
                            if (item.IsParentItem) {
                                controllerScope.destructionItemList[i].SystemQuantity = controllerScope.destructionItemList[i].SystemQuantity + itemCount;
                                controllerScope.destructionItemList[i].OldRequestQuantity = item.DestructionQuantity;
                                parentItemQunatity = controllerScope.destructionItemList[i].SystemQuantity;
                                isParentItem = true;
                                break;
                            }
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
            for (var j = 0; j < controllerScope.destructionItemList.length; j++) {
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
                var updateItemQuantity = 0;
                for (var k = 0; k < controllerScope.destructionItemList.length; k++) {
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
                for (var p = 0; p < controllerScope.destructionItemList.length; p++) {
                    if (controllerScope.destructionItemList[p].ParentItemId === controllerScope.destructionItemId) {
                        controllerScope.destructionItemList[p].SystemQuantity = Math.floor(updateItemQuantity / controllerScope.destructionItemList[p].BaseUnit);
                        controllerScope.destructionItemList[p].UpdateSystemQunatity = updateItemQuantity;
                    }
                }
            }
        }
    };
    // this function used for update item quantity when add new main and sub item.
    ItemDestructionRequestController.prototype.updateNewlyAddedItemQunatity = function (item) {
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
        for (var i = 0; i < controllerScope.destructionItemList.length; i++) {
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
            for (var j = 0; j < controllerScope.destructionItemList.length; j++) {
                if (controllerScope.destructionItemList[j].Id === item.Id) {
                    controllerScope.destructionItemList[j].SystemQuantity = Math.floor(parentItemQunatity / controllerScope.destructionItemList[j].BaseUnit);
                }
            }
        }
        else {
            var updateItemQunatity = 0;
            var itemExist = false;
            for (var k = 0; k < controllerScope.destructionItemList.length; k++) {
                if (controllerScope.destructionItemList[k].ParentItemId === controllerScope.destructionItemId) {
                    if (controllerScope.destructionItemList[k].Id !== item.Id) {
                        updateItemQunatity = controllerScope.destructionItemList[k].UpdateSystemQunatity;
                        itemExist = true;
                        break;
                    }
                }
            }
            for (var p = 0; p < controllerScope.destructionItemList.length; p++) {
                if (controllerScope.destructionItemList[p].Id === item.Id) {
                    if (itemExist) {
                        controllerScope.destructionItemList[p].SystemQuantity = Math.floor(updateItemQunatity / controllerScope.destructionItemList[p].BaseUnit);
                        controllerScope.destructionItemList[p].UpdateSystemQunatity = updateItemQunatity;
                    }
                }
            }
        }
    };
    //this method used for open popu when add already exists item.
    ItemDestructionRequestController.prototype.openItemAddErrorPopup = function () {
        this.itemAddErrorPopup = this.$modal.open({
            templateUrl: 'AddItemErrorPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
            size: 'sm'
        });
    };
    ItemDestructionRequestController.prototype.deletedestructionItem = function (id) {
        this.$scope.itemId = id;
        this.deletePopup = this.$modal.open({
            templateUrl: 'DeleteItemPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    ItemDestructionRequestController.prototype.deleteDestructionItem = function () {
        if (this.$scope.itemId !== 0 && this.$scope.itemId !== undefined && this.$scope.itemId !== null) {
            for (var i = 0; i < this.$scope.destructionItemList.length; i++) {
                if (this.$scope.destructionItemList[i].Id === this.$scope.itemId) {
                    this.$scope.destructionItemList[i].DestructionQuantity = 0;
                    this.removeItemQunatity(this.$scope.destructionItemList[i]);
                    this.$scope.destructionItemList.splice(i, 1);
                }
            }
            if (this.$scope.totalItemSupplierList.length > 0) {
                for (var i = 0; i < this.$scope.totalItemSupplierList.length; i++) {
                    if (this.$scope.totalItemSupplierList[i].Id === this.$scope.itemId) {
                        this.$scope.totalItemSupplierList[i].Checked = false;
                    }
                    if (this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== null && this.$scope.totalItemSupplierList[i].listOfChildProfileAC !== undefined) {
                        for (var j = 0; j < this.$scope.totalItemSupplierList[i].listOfChildProfileAC.length; j++) {
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
            var controllerScope = this.$scope;
            controllerScope.ItemDestructionRequestModel = new Model.ItemDestructionRequestModel();
            controllerScope.itemDestructionRequest.$setPristine();
            controllerScope.itemDestructionRequest.$setValidity();
            controllerScope.itemDestructionRequest.$setUntouched();
            this.$scope.isRequestDetail = false;
            this.$scope.destructionItemList = [];
            this.$scope.selectedAll = false;
            this.searchButton();
        }
    };
    //this funciton used for get branch list -An
    ItemDestructionRequestController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        //To get branch list
        var promise = this.ItemDestructionService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
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
    ItemDestructionRequestController.prototype.searchButton = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        if (controllerScope.ItemDestructionRequestModel.branchId !== undefined && controllerScope.ItemDestructionRequestModel.branchId !== null)
            controllerScope.ItemDestructionSearchModel.BranchId = controllerScope.ItemDestructionRequestModel.branchId;
        controllerScope.itemSupplierCollection = [];
        var itemSupplierList = controllerScope.itemSupplierCollection;
        var promise = this.ItemDestructionService.getSupplierItemListSearch(controllerScope.ItemDestructionSearchModel);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                _this.$scope.ItemDestructionRequestModel.branchId = result.BranchId;
                if (result.listOfItemProfileAC.length > 0) {
                    for (var i = 0; i < result.listOfItemProfileAC.length; i++) {
                        itemSupplierList.push(result.listOfItemProfileAC[i]);
                    }
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = itemSupplierList.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.itemSupplierCollection.length;
                    controllerScope.totalItemSupplierList = controllerScope.itemSupplierCollection;
                    _this.checkSupplierSameOrNot(controllerScope.totalItemSupplierList);
                    _this.$scope.errorMessageDisplayForBlankList = false;
                }
                else {
                    _this.$scope.errorMessageDisplayForBlankList = true;
                }
                _this.$scope.ItemDestructionSearchModel = new Model.ItemDestructionSearchModel();
            }
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemDestructionRequestController.prototype.checkSupplierSameOrNot = function (totalItemSupplierList) {
        this.$scope.isSameSupplierInList = true;
        var itemList = [];
        for (var i = 0; i < totalItemSupplierList.length; i++) {
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
    };
    //this funciton used for cancel button for item popup. -An
    ItemDestructionRequestController.prototype.cancelButtonForItemPopup = function () {
        this.itemListPopup.dismiss('cancel');
    };
    //this function used for open popup for change main item. -An
    ItemDestructionRequestController.prototype.openItemListPopup = function () {
        this.itemListPopup = this.$modal.open({
            templateUrl: 'itemListPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'itemCollectionController',
            scope: this.$scope,
        });
    };
    ItemDestructionRequestController.prototype.getSubItemList = function (parentId, supplierId) {
        var controllerScope = this.$scope;
        if (parentId !== 0 && parentId !== undefined && parentId !== null && supplierId !== 0 && supplierId !== undefined && supplierId !== null) {
            var parent_1 = parseFloat((parentId.toString() + supplierId.toString()));
            controllerScope.isDataLoading = true;
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
        controllerScope.isDataLoading = false;
    };
    //This function used for get supplier list.
    ItemDestructionRequestController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.ItemDestructionService.getSupplierList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, IsAcceptReturnForExpiredItem: result[i].IsAcceptReturnForExpiredItem });
                }
            }
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get category list.
    ItemDestructionRequestController.prototype.getCategoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.ItemDestructionService.getCategoryList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
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
    //This funciton used for get unit type.
    ItemDestructionRequestController.prototype.getUnitTypeList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isDataLoading = true;
        //to get unit type list
        var promise = this.ItemDestructionService.getUnitList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
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
    return ItemDestructionRequestController;
}());
ItemDestructionRequestController.controllerId = "ItemDestructionRequestController";
app.controller(ItemDestructionRequestController.controllerId, ['$scope', '$log', '$rootScope', 'ItemDestructionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', function ($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        return new ItemDestructionRequestController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
    }]);
//# sourceMappingURL=ItemDestructionRequestController.js.map
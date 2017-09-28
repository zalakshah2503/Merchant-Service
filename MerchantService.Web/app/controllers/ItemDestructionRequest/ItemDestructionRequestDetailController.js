var ItemDestructionRequestDetailController = (function () {
    function ItemDestructionRequestDetailController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
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
        this.$scope.itemDestructionRequestDetail = [];
        this.$scope.totalItemDestructionRequestCollection = [];
        this.$scope.actionList = [];
        this.$scope.itemDestructionReceiptDetail = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.amount = 0;
        this.$scope.ItemDestructionDetailApprovalAC = new Model.ItemDestuctionDetailModel();
        this.$scope.maxSize = 10;
        this.$scope.currentPage = 1;
        this.$scope.totalQuantity = 0;
        this.$scope.totalCost = 0;
        this.$scope.isEdit = false;
        this.$scope.isDeleted = false;
        this.$scope.isApproval = false;
        this.$scope.approveButtonClick = function () { return _this.approveButtonClick(); };
        this.$scope.rejectButtonClick = function () { return _this.rejectButtonClick(); };
        this.$scope.returnButtonClick = function () { return _this.returnButtonClick(); };
        this.$scope.cancleButtonClick = function () { return _this.cancleButtonClick(); };
        this.$scope.editButtonEvent = function () { return _this.editButtonEvent(); };
        this.$scope.closeCreditNotePopup = function () { return _this.closeCreditNotePopup(); };
        this.$scope.clickOnOkButton = function () { return _this.clickOnOkButton(); };
        this.$scope.reSubmitEvent = function () { return _this.reSubmitEvent(); };
        this.$scope.rejectItemDestruction = function () { return _this.rejectItemDestruction(); };
        this.$scope.closeRejectPopup = function () { return _this.closeRejectPopup(); };
        this.$scope.itemDestructionReceipt = stringConstants.itemDestructionReceipt;
        this.$scope.rejectConfirm = stringConstants.rejectConfirm;
        this.$scope.rejectConfirmation = stringConstants.rejectConfirmation;
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.totalItemDestructionRequestCollection.slice(begin, end);
        });
        this.initialization();
    }
    ItemDestructionRequestDetailController.prototype.initialization = function () {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getItemDestructionList(this.$routeParams.id);
            this.getActionList(this.$routeParams.id);
        }
    };
    //this method used for close the reject item detruction popup. -An
    ItemDestructionRequestDetailController.prototype.closeRejectPopup = function () {
        this.popupRejectItemDestruction.dismiss('cancel');
    };
    //this method used for open the reject item detruction. -An
    ItemDestructionRequestDetailController.prototype.rejectItemDestruction = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        var promise = this.ItemDestructionService.rejectRequest(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.itemDestructionRequestRejectSucessfully);
                    _this.$location.path("/ItemDestructionWorkList");
                }
                else if (result._isResult === stringConstants.alreadyActivityProcessed) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
                }
            }
            _this.popupRejectItemDestruction.dismiss('cancel');
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ItemDestructionRequestDetailController.prototype.reSubmitEvent = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        var promise = this.ItemDestructionService.reSubmitItemDestruction(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.itemDestructionRequestResubmitSucessfully);
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
            }
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
        this.$rootScope.isLoading = false;
    };
    //This method used for edit button event. -An
    ItemDestructionRequestDetailController.prototype.editButtonEvent = function () {
        this.$location.path("/ItemDestructionRequest/" + this.$routeParams.id);
    };
    ItemDestructionRequestDetailController.prototype.closeCreditNotePopup = function () {
        this.popupCreditNote.dismiss('cancel');
    };
    ItemDestructionRequestDetailController.prototype.clickOnOkButton = function () {
        this.$location.path("/ItemDestructionWorkList");
        this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", this.$scope.itemDestructionReceiptDetail);
        this.popupCreditNote.dismiss('cancel');
    };
    //This method used for approve button click event. -An
    ItemDestructionRequestDetailController.prototype.approveButtonClick = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        var promise = this.ItemDestructionService.approveRequest(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result._isResult.IsResult === "NotExists") {
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
                else {
                    if (result._isResult.IsResult === "true") {
                        if (result._isResult.SupplierName !== undefined && result._isResult.SupplierName !== null && result._isResult.CreditNoteNumber !== undefined && result._isResult.Amount !== undefined
                            && result._isResult.CreditNoteNumber !== null && result._isResult.Amount !== null) {
                            _this.$scope.supplierName = result._isResult.SupplierName;
                            _this.$scope.creditNoteNumber = result._isResult.CreditNoteNumber;
                            _this.$scope.amount = result._isResult.Amount;
                            _this.$scope.itemDestructionReceiptDetail = result._isResult;
                            _this.creditNotePopup();
                        }
                        else {
                            _this.printer.print("/Templates/Inventory/ItemDestructionReceipt.html", result._isResult);
                        }
                    }
                    _this.ngToast.create(stringConstants.itemDestructionRequestApproveSucessfully);
                    _this.$location.path("/ItemDestructionWorkList");
                }
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //Open the credit not popup
    ItemDestructionRequestDetailController.prototype.creditNotePopup = function () {
        this.popupCreditNote = this.$modal.open({
            templateUrl: 'popupCreditNoteDetail',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    //This method used for return button click event. -An
    ItemDestructionRequestDetailController.prototype.returnButtonClick = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.ItemDestructionDetailApprovalAC.destructionId = this.$routeParams.id;
        var promise = this.ItemDestructionService.returnRequest(this.$scope.ItemDestructionDetailApprovalAC);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.itemDestructionRequestReturnSucessfully);
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
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This method used for reject button click event. -An
    ItemDestructionRequestDetailController.prototype.rejectButtonClick = function () {
        this.popupRejectItemDestruction = this.$modal.open({
            templateUrl: 'rejectItemDestructionPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
    };
    //This method used for cancel button click event. -An
    ItemDestructionRequestDetailController.prototype.cancleButtonClick = function () {
        this.$location.path("/ItemDestructionWorkList");
    };
    //This method used for get item destruction list. -An
    ItemDestructionRequestDetailController.prototype.getItemDestructionList = function (id) {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.totalItemDestructionRequestCollection = [];
        var destructionItemList = this.$scope.totalItemDestructionRequestCollection;
        var promise = this.ItemDestructionService.getItemDestructionList(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                _this.$scope.totalQuantity = result.TotalQuantity;
                _this.$scope.totalCost = result.TotalCostPrice;
                _this.$scope.itemDestructionRequestDetail.RequestNo = result.RequestNo;
                _this.$scope.itemDestructionRequestDetail.SupplierName = result.SupplierName;
                _this.$scope.itemDestructionRequestDetail.SupplierCode = result.SupplierCode;
                _this.$scope.itemDestructionRequestDetail.Branch = result.Branch;
                _this.$scope.itemDestructionRequestDetail.RequestedDate = result.RequestedDate;
                _this.$scope.itemDestructionRequestDetail.Cause = result.Cause;
                _this.$scope.itemDestructionRequestDetail.initiatedBy = result.InitiatedBy;
                if (result.IsDeleted) {
                    _this.$scope.isDeleted = true;
                }
                else {
                    if (result.IsPandingApproval) {
                        if (result.IsAllowApproval)
                            _this.$scope.isApproval = true;
                    }
                    else {
                        if (result.IsAllowApproval)
                            _this.$scope.isApproval = true;
                    }
                    if (result.IsClosed) {
                        _this.$scope.isApproval = false;
                        _this.$scope.isApproval = false;
                        _this.$scope.isDeleted = true;
                    }
                    //after approve
                    if (result.IsApproval) {
                        _this.$scope.isApproval = true;
                        _this.$scope.isEdit = false;
                    }
                    else if (result.IsReject) {
                        _this.$scope.isApproval = false;
                        _this.$scope.isDeleted = false;
                        _this.$scope.isEdit = true;
                    }
                }
                if (result.listOfItemProfileAC.length > 0) {
                    for (var i = 0; i < result.listOfItemProfileAC.length; i++) {
                        destructionItemList.push(result.listOfItemProfileAC[i]);
                    }
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    _this.$scope.totalCollection = destructionItemList.slice(begin, end);
                    /* init pagination with $scope.list */
                    _this.$scope.totalItems = _this.$scope.totalItemDestructionRequestCollection.length;
                }
            }
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This method used for get action list. -An
    ItemDestructionRequestDetailController.prototype.getActionList = function (id) {
        var _this = this;
        var promise = this.ItemDestructionService.getActionList(id);
        promise.then(function (result) {
            if (result.length > 0) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        _this.$scope.actionList.push(result[i]);
                    }
                }
            }
            _this.$rootScope.isLoading = false;
        }).catch(function (error) {
            _this.$rootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    return ItemDestructionRequestDetailController;
}());
ItemDestructionRequestDetailController.controllerId = "ItemDestructionRequestDetailController";
app.controller(ItemDestructionRequestDetailController.controllerId, ['$scope', '$log', '$rootScope', 'ItemDestructionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', function ($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        return new ItemDestructionRequestDetailController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
    }]);
//# sourceMappingURL=ItemDestructionRequestDetailController.js.map
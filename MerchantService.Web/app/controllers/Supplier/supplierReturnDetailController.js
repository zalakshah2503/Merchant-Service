var SupplierReturnDetailController = (function () {
    function SupplierReturnDetailController($scope, $log, supplierReturnDetailService, ngToast, $rootScope, apiPath, $routeParams, $modal, $location, printer, $filter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.supplierReturnDetailService = supplierReturnDetailService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.$routeParams = $routeParams;
        this.$modal = $modal;
        this.$location = $location;
        this.printer = printer;
        this.$filter = $filter;
        this.$scope.supplierReturnRequest = new Model.SupplierReturnRequest();
        this.$scope.approveSupReturnRequest = function () { return _this.approveSupReturnRequest(); };
        this.$scope.returnSupReturnRequest = function () { return _this.returnSupReturnRequest(); };
        this.$scope.getSupplierReturnRequest = function () { return _this.getSupplierReturnRequest(); };
        this.$scope.rejectSupplierReturnRequest = function () { return _this.rejectSupplierReturnRequest(); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.getCurrentUser = function () { return _this.getCurrentUser(); };
        this.$scope.isApproveVisible = false;
        this.$scope.isEditVisible = false;
        this.$scope.isDeleteVisible = false;
        this.$scope.edit = function () { return _this.edit(); };
        this.$scope.isCommentVisible = true;
        this.$scope.receiptDetails = [];
        this.$scope.userId = 0;
        this.$scope.rejectConfirm = stringConstants.rejectConfirm;
        this.$scope.rejectConfirmation = stringConstants.rejectConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.openRejectSRRPopup = function () { return _this.openRejectSRRPopup(); };
        this.$scope.closeRejectSRRPopup = function () { return _this.closeRejectSRRPopup(); };
        this.$scope.openSummaryCNPopup = function () { return _this.openSummaryCNPopup(); };
        this.$scope.closeSummaryCNPopup = function () { return _this.closeSummaryCNPopup(); };
        this.$scope.resubmitSupReturnRequest = function () { return _this.resubmitSupReturnRequest(); };
        this.$scope.deleteSupplierReturnRequest = function () { return _this.deleteSupplierReturnRequest(); };
        this.$scope.printReceipt = function (receiptDetails) { return _this.printReceipt(receiptDetails); };
        this.initialize();
    }
    SupplierReturnDetailController.prototype.initialize = function () {
        this.getCurrentUser();
    };
    SupplierReturnDetailController.prototype.getCurrentUser = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnDetailService.getCurrentUserDetail();
        promise.then(function (result) {
            controllerScope.userRoleName = result.rolename;
            controllerScope.userId = result.userId;
            _this.getSupplierReturnRequest();
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorFromOurSide
            });
        });
    };
    //used for fetching supplier return request - jj
    SupplierReturnDetailController.prototype.getSupplierReturnRequest = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierReturnDetailService.getSupplierReturnRequest(this.$routeParams.id);
        promise.then(function (result) {
            controllerScope.supplierReturnRequest = result;
            controllerScope.supplierReturnRequest.InitiationDate = _this.$filter('date')(controllerScope.supplierReturnRequest.InitiationDate, 'dd-MM-yyyy');
            for (var i = controllerScope.supplierReturnRequest.WorkFlowLog.length - 1; i < controllerScope.supplierReturnRequest.WorkFlowLog.length; i++) {
                if (controllerScope.supplierReturnRequest.WorkFlowLog[i].NextActivityId !== 3 && !result.IsRejected && !result.IsDeleted) {
                    if (controllerScope.userRoleName === controllerScope.supplierReturnRequest.WorkFlowLog[i].AssignedRole) {
                        if (controllerScope.supplierReturnRequest.WorkFlowLog[i].IsRejected) {
                            if (controllerScope.userId === result.InitiatorId) {
                                controllerScope.isDeleteVisible = true;
                            }
                            controllerScope.isEditVisible = true;
                            controllerScope.isCommentVisible = true;
                            controllerScope.isApproveVisible = false;
                        }
                        else {
                            controllerScope.isApproveVisible = true;
                            controllerScope.isEditVisible = false;
                        }
                    }
                    else {
                        controllerScope.isCommentVisible = false;
                        controllerScope.isApproveVisible = false;
                        controllerScope.isEditVisible = false;
                    }
                }
                else {
                    controllerScope.isCommentVisible = false;
                    controllerScope.isApproveVisible = false;
                    controllerScope.isEditVisible = false;
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ErrorinFetchingSRRList
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to reject supplier return Request - jj
    SupplierReturnDetailController.prototype.rejectSupplierReturnRequest = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closeRejectSRRPopup();
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        var promise = this.supplierReturnDetailService.rejectSupReturnRequest(controllerScope.supplierReturnRequest.SupplierReturnId, controllerScope.supplierReturnRequest.InitiationComment);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.SRRRejectedSuccessfully);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
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
                        _this.cancel();
                    }
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SRRRejectFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to delete supplier return Request - jj
    SupplierReturnDetailController.prototype.deleteSupplierReturnRequest = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closeRejectSRRPopup();
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        var promise = this.supplierReturnDetailService.deleteSupReturnRequest(controllerScope.supplierReturnRequest.SupplierReturnId, controllerScope.supplierReturnRequest.InitiationComment);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.SRRDeletedSuccessfully);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
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
                        _this.cancel();
                    }
                }
                else {
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SRRDeleteFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    // used for opening the RejectSRRPopup-jj
    SupplierReturnDetailController.prototype.openRejectSRRPopup = function () {
        var controllerScope = this.$scope;
        this.rejectSRRPopup = this.$modal.open({
            templateUrl: 'RejectSRRPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the RejectSRRPopup-jj
    SupplierReturnDetailController.prototype.closeRejectSRRPopup = function () {
        this.rejectSRRPopup.dismiss('cancel');
    };
    //used to return Supplier Return Request - jj 
    SupplierReturnDetailController.prototype.returnSupReturnRequest = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        var promise = this.supplierReturnDetailService.approveSupReturnRequest(controllerScope.supplierReturnRequest.RecordId, controllerScope.supplierReturnRequest.InitiationComment, false, controllerScope.supplierReturnRequest.SupplierReturnId);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.SRRReturnSuccessfully);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
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
                        _this.cancel();
                    }
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SRRReturnFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to approve Supplier Return Request - jj
    SupplierReturnDetailController.prototype.approveSupReturnRequest = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        var promise = this.supplierReturnDetailService.approveSupReturnRequest(controllerScope.supplierReturnRequest.RecordId, controllerScope.supplierReturnRequest.InitiationComment, true, controllerScope.supplierReturnRequest.SupplierReturnId);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.SRRApprovalSuccessful);
                    _this.cancel();
                }
                else if (result.status === "print") {
                    _this.ngToast.create(stringConstants.SRRApprovalSuccessful);
                    var promise_1 = _this.supplierReturnDetailService.printReturnReceipt(controllerScope.supplierReturnRequest.InitiationComment, controllerScope.supplierReturnRequest.SupplierReturnId);
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
                else if (result.status !== undefined && result.status !== null) {
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
                        _this.cancel();
                    }
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SRRApprovalFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to redirect to Supplier Return Request WorkList page-jj
    SupplierReturnDetailController.prototype.cancel = function () {
        this.$location.path("/SupplierReturnRequestWorkList");
    };
    //used to redirect to supplier Return request page-jj
    SupplierReturnDetailController.prototype.edit = function () {
        var controllerScope = this.$scope;
        this.$location.path("/SupplierReturnRequest/" + controllerScope.supplierReturnRequest.SupplierReturnId);
    };
    // used for opening the SummaryCNPopup-jj
    SupplierReturnDetailController.prototype.openSummaryCNPopup = function () {
        var controllerScope = this.$scope;
        this.summaryCNPopup = this.$modal.open({
            templateUrl: 'SummaryCN',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the SummaryCNPopup-jj
    SupplierReturnDetailController.prototype.closeSummaryCNPopup = function () {
        this.summaryCNPopup.dismiss('cancel');
    };
    //used to resubmit supplier return request - jj
    SupplierReturnDetailController.prototype.resubmitSupReturnRequest = function () {
        var _this = this;
        var id = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.supplierReturnRequest.InitiationComment === null ||
            controllerScope.supplierReturnRequest.InitiationComment === undefined) {
            controllerScope.supplierReturnRequest.InitiationComment = ".";
        }
        var promise = this.supplierReturnDetailService.resubmitSupReturnRequest(this.$routeParams.id, controllerScope.supplierReturnRequest.InitiationComment);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.SRRResubmitSuccessfully);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
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
                        _this.cancel();
                    }
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.SRRResubmitFailed
                    });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SRRResubmitFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to print receipt - jj
    SupplierReturnDetailController.prototype.printReceipt = function (receiptDetails) {
        receiptDetails.TotalQuantity = 0;
        receiptDetails.TotalCostPrice = 0;
        this.closeSummaryCNPopup();
        for (var i = 0; i < receiptDetails.SupplierReturnItemAC.length; i++) {
            receiptDetails.SupplierReturnItemAC[i].TotalCostPrice = (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice);
            receiptDetails.TotalQuantity = receiptDetails.TotalQuantity + parseFloat("" + receiptDetails.SupplierReturnItemAC[i].ReturnQuantity);
            receiptDetails.TotalCostPrice = receiptDetails.TotalCostPrice + parseFloat("" + (receiptDetails.SupplierReturnItemAC[i].ReturnQuantity * receiptDetails.SupplierReturnItemAC[i].CostPrice));
        }
        this.printer.print("/Templates/Supplier/SupplierReturnReceipt.html", receiptDetails);
        this.cancel();
    };
    return SupplierReturnDetailController;
}());
SupplierReturnDetailController.controllerId = "SupplierReturnDetailController";
app.controller(SupplierReturnDetailController.controllerId, ['$scope', '$log', 'SupplierReturnDetailService', 'ngToast', '$rootScope', 'apiPath', '$routeParams', '$modal', '$location', 'printer', '$filter', function ($scope, $log, SupplierReturnDetailService, ngToast, $rootScope, apiPath, $routeParams, $modal, $location, printer, $filter) {
        return new SupplierReturnDetailController($scope, $log, SupplierReturnDetailService, ngToast, $rootScope, apiPath, $routeParams, $modal, $location, printer, $filter);
    }]);
//# sourceMappingURL=supplierReturnDetailController.js.map
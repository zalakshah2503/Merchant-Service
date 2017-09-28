var ReturnBillController = (function () {
    function ReturnBillController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.ReturnBillService = ReturnBillService;
        this.ngToast = ngToast;
        this.$location = $location;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.printer = printer;
        this.$scope.billNumber = "";
        this.$scope.clickOnGetBill = function () { return _this.clickOnGetBill(); };
        this.$scope.billList = [];
        this.$scope.paymentTypeList = [];
        this.$scope.search = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.clickOnCancelButton = function () { return _this.clickOnCancelButton(); };
        this.$scope.clickOnSubmitButton = function () { return _this.clickOnSubmitButton(); };
        this.$scope.returningAmountChangeEvent = function () { return _this.returningAmountChangeEvent(); };
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.clickOnSearchBillButton = function () { return _this.clickOnSearchBillButton(); };
        this.$scope.viewItemDetail = function (id) { return _this.viewItemDetail(id); };
        this.$scope.returnBillModel = new Model.POSReturnBillModel();
        this.$scope.isAnchorTagDisplay = false;
        this.$scope.retunBillList = [];
        this.$scope.clickOnCloseButton = function () { return _this.clickOnCloseButton(); };
        this.$scope.branchList = [];
        this.$scope.daysOfLimit = 0;
        this.$scope.clickOnCancelButtonForPOSBillExpier = function () { return _this.clickOnCancelButtonForPOSBillExpier(); };
        this.$scope.showDetails = false;
        this.$scope.isBranch = false;
        this.$scope.isReturnQunatity = true;
        this.$scope.checkReturningItem = function () { return _this.checkReturningItem(); };
        this.$scope.deletedReturnBillItemNumber = "";
        this.$scope.existsbillNumber = "";
        this.$scope.checkIntegerReturnQuantity = function (quantity, index) { return _this.checkIntegerReturnQuantity(quantity, index); };
        this.$scope.deleteReturnBill = function (billNumber) { return _this.deleteReturnBill(billNumber); };
        this.$scope.deleteReturnBillButtonEvent = function () { return _this.deleteReturnBillButtonEvent(); };
        this.$scope.cancelDeleteReturnBillItem = function () { return _this.cancelDeleteReturnBillItem(); };
        this.$scope.totalCountForAnchorTag = 0;
        this.$scope.deleted = stringConstants.deleted;
        this.$scope.processed = stringConstants.processed;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.ValidReturningQty = stringConstants.ValidReturningQty;
        this.$scope.ValidReturnItemAmt = stringConstants.ValidReturnItemAmt;
        this.$scope.validAmountError = stringConstants.validAmountError;
        this.$scope.noCategoryFound = stringConstants.noCategoryFound;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.returnBillItemListCollection.slice(begin, end);
        });
        this.initialize();
    }
    //this method used for get initialize method. -An
    ReturnBillController.prototype.clickOnCancelButtonForPOSBillExpier = function () {
        this.posBillExpierDate.dismiss('cancel');
    };
    ReturnBillController.prototype.deleteReturnBillButtonEvent = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.ReturnBillService.deleteReturnBillItem(this.$scope.deletedReturnBillItemNumber);
        promise.then(function (result) {
            if (result.isResult === true) {
                _this.deleteReturnItemBill.dismiss('cancel');
                _this.ngToast.create(stringConstants.deletePOSSessionReturnBill);
                //this.getReturnBillList(this.$scope.existsbillNumber);
                _this.$scope.billNumber = _this.$scope.existsbillNumber;
                _this.clickOnGetBill();
            }
            else if (result.isResult !== false) {
                _this.ngToast.create({
                    className: 'danger',
                    content: result.isResult
                });
                _this.deleteReturnItemBill.dismiss('cancel');
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    ReturnBillController.prototype.cancelDeleteReturnBillItem = function () {
        this.deleteReturnItemBill.dismiss('cancel');
    };
    ReturnBillController.prototype.deleteReturnBill = function (billNumber) {
        this.deleteReturnItemBill = this.$modal.open({
            templateUrl: 'deleteReturnItemBill',
            backdrop: 'static',
            keyboard: true,
            size: 'sm',
            scope: this.$scope,
        });
        this.$scope.deletedReturnBillItemNumber = billNumber;
    };
    //this method used for check returning item. -An
    ReturnBillController.prototype.checkReturningItem = function () {
        if (this.$scope.returnBillItemListCollection !== undefined || this.$scope.returnBillItemListCollection !== null) {
            if (this.$scope.returnBillItemListCollection.length > 0) {
                for (var i = 0; i < this.$scope.returnBillItemListCollection.length; i++) {
                    if (this.$scope.returnBillItemListCollection[i].ReturnQunatity !== 0 && this.$scope.returnBillItemListCollection[i].ReturnQunatity !== "")
                        return true;
                }
            }
        }
        return false;
    };
    //this method used for get initialize method. -An 
    ReturnBillController.prototype.initialize = function () {
        var _this = this;
        this.getBranchList();
        this.$rootScope.isLoading = true;
        var promise = this.ReturnBillService.checkAllowReturnToAnotherBranch();
        promise.then(function (result) {
            if (result.isResult !== 0) {
                _this.$scope.isBranch = true;
                _this.$scope.returnBillModel.BranchId = result.isResult;
            }
            else
                _this.$scope.isBranch = false;
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
    //this function used for click on close button for clsoe popup.-An
    ReturnBillController.prototype.clickOnCloseButton = function () {
        this.billSearchPopup.dismiss('cancel');
    };
    //this funciton used for get bill detail list  click on get bill button. -An
    ReturnBillController.prototype.clickOnGetBill = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.showDetails = false;
        this.$scope.deletedReturnBillItemNumber = this.$scope.billNumber;
        this.$scope.existsbillNumber = this.$scope.billNumber;
        if (this.$scope.billNumber !== 0) {
            if (this.$scope.returnBillModel.BranchId !== undefined && this.$scope.returnBillModel.BranchId !== null && this.$scope.returnBillModel.BranchId !== 0) {
                var promise = this.ReturnBillService.getBillDetailByBillNumberByBranchId(this.$scope.billNumber, this.$scope.returnBillModel.BranchId);
                promise.then(function (result) {
                    _this.GetReturnBillDetail(result);
                }).catch(function (error) {
                    _this.$rootScope.isLoading = false;
                    _this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(_this.apiPath);
                    }
                });
            }
            else {
                var promise = this.ReturnBillService.getBillDetailByBillNumber(this.$scope.billNumber);
                promise.then(function (result) {
                    _this.GetReturnBillDetail(result);
                }).catch(function (error) {
                    _this.$rootScope.isLoading = false;
                    _this.$log.log(error);
                    if (error.status !== 500) {
                        //if user is not authenticated that time it will redirect to the login page.
                        location.replace(_this.apiPath);
                    }
                });
            }
            this.getReturnBillList(this.$scope.billNumber);
        }
    };
    ReturnBillController.prototype.GetReturnBillDetail = function (result) {
        this.$scope.returnBillItemListCollection = [];
        this.$scope.billList = [];
        this.$scope.paymentTypeList = [];
        var returnItemBill = this.$scope.returnBillItemListCollection;
        this.$scope.billNumber = "";
        if (result.isResult === "NotExists") {
            this.$scope.errorMessageDisplayForBlankList = true;
        }
        else if ((result.isResult.ReturnBillItemList !== null && result.isResult.ReturnBillItemList !== undefined) ||
            (result.isResult.ReturnBillList !== null && result.isResult.ReturnBillList !== undefined) ||
            (result.isResult.ReturnBillPaymentTypeList !== null && result.isResult.ReturnBillPaymentTypeList !== undefined)) {
            this.$scope.errorMessageDisplayForBlankList = false;
            this.$scope.returnBillModel.ReturnCashAmount = 0;
            if (result.isResult.ReturnBillList !== null && result.isResult.ReturnBillList !== undefined) {
                if (result.isResult.ReturnBillList.length !== 0) {
                    for (var i = 0; i < result.isResult.ReturnBillList.length; i++) {
                        this.$scope.billList.push(result.isResult.ReturnBillList[i]);
                    }
                }
                if (result.isResult.ReturnBillPaymentTypeList !== null && result.isResult.ReturnBillPaymentTypeList !== undefined) {
                    if (result.isResult.ReturnBillPaymentTypeList.length !== 0) {
                        for (var i = 0; i < result.isResult.ReturnBillPaymentTypeList.length; i++) {
                            this.$scope.paymentTypeList.push(result.isResult.ReturnBillPaymentTypeList[i]);
                        }
                    }
                }
                if (result.isResult.ReturnBillItemList !== null && result.isResult.ReturnBillItemList !== undefined) {
                    if (result.isResult.ReturnBillItemList.length > 0) {
                        for (var i = 0; i < result.isResult.ReturnBillItemList.length; i++) {
                            returnItemBill.push(result.isResult.ReturnBillItemList[i]);
                        }
                        var that = this;
                        var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                        this.$scope.totalCollection = returnItemBill.slice(begin, end);
                        /* init pagination with $scope.list */
                        this.$scope.totalItems = this.$scope.returnBillItemListCollection.length;
                    }
                }
            }
        }
        else if (result.isResult !== 0) {
            this.posBillExpierDate = this.$modal.open({
                templateUrl: 'PosBillDateExpier',
                backdrop: 'static',
                keyboard: true,
                size: 'sm',
                scope: this.$scope,
            });
            this.$scope.errorMessageDisplayForBlankList = true;
            this.$scope.daysOfLimit = result.isResult;
        }
        this.$rootScope.isLoading = false;
    };
    //this function used for get return bill list by billnumber. -An
    ReturnBillController.prototype.getReturnBillList = function (returnBillNumber) {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.retunBillList = [];
        var promise = this.ReturnBillService.getReturnBillListByBillNumber(returnBillNumber);
        promise.then(function (result) {
            if (result.length !== 0) {
                _this.$scope.isReturnQunatity = true;
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.retunBillList.push(result[i]);
                }
                _this.$scope.totalCountForAnchorTag = _this.$scope.retunBillList.length;
                _this.$scope.isAnchorTagDisplay = true;
            }
            else {
                _this.$scope.isReturnQunatity = false;
                _this.$scope.isAnchorTagDisplay = false;
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
    //this function used for click on search button. -An
    ReturnBillController.prototype.clickOnSearchBillButton = function () {
        var branchId = this.$scope.returnBillModel.BranchId;
        this.billSearchPopup = this.$modal.open({
            templateUrl: 'billSearch',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'BillSearchContoller',
            scope: this.$scope,
            resolve: {
                id: function () {
                    return branchId;
                }
            }
        });
        this.$scope.showDetails = false;
    };
    //this function used for returning amount change event. -An
    ReturnBillController.prototype.returningAmountChangeEvent = function () {
        if (this.$scope.returnBillItemListCollection.length > 0) {
            this.$scope.returnBillModel.ReturnCashAmount = 0;
            for (var i = 0; i < this.$scope.returnBillItemListCollection.length; i++) {
                var retunAmount = 0;
                if (this.$scope.returnBillItemListCollection[i].ReturnQunatity > 0) {
                    retunAmount = (parseFloat(this.$scope.returnBillItemListCollection[i].ReturnQunatity) * this.$scope.returnBillItemListCollection[i].SellPrice);
                    var totaleAlreadyQuantity = (parseFloat(this.$scope.returnBillItemListCollection[i].ReturnQunatity) + parseFloat(this.$scope.returnBillItemListCollection[i].ReturnedQunatity));
                    if (totaleAlreadyQuantity <= this.$scope.returnBillItemListCollection[i].BillQunatity) {
                        this.$scope.returnBillModel.ReturnCashAmount = this.$scope.returnBillModel.ReturnCashAmount + retunAmount;
                    }
                    else {
                        this.$scope.returnBillItemListCollection[i].ReturnQunatity = 0;
                        this.$scope.returnBillModel.ReturnSubtituteItemsAmount = 0;
                    }
                }
            }
            if (this.$scope.returnBillModel.ReturnSubtituteItemsAmount !== 0) {
                if (this.$scope.returnBillModel.ReturnCashAmount !== 0) {
                    if (this.$scope.returnBillModel.ReturnCashAmount >= this.$scope.returnBillModel.ReturnSubtituteItemsAmount) {
                        this.$scope.returnBillModel.ReturnCashAmount = (this.$scope.returnBillModel.ReturnCashAmount - this.$scope.returnBillModel.ReturnSubtituteItemsAmount);
                    }
                    else
                        this.$scope.returnBillModel.ReturnSubtituteItemsAmount = 0;
                }
            }
        }
    };
    //this function used for submit button event. -An
    ReturnBillController.prototype.clickOnSubmitButton = function () {
        var _this = this;
        this.$scope.returnBillModel.ReturnBillItemList = this.$scope.returnBillItemListCollection;
        this.$scope.returnBillModel.ReturnBillNumber = this.$scope.billList[0].BillNumber;
        this.$scope.returnBillModel.POSBillId = this.$scope.billList[0].BillId;
        var posBillId = this.$scope.billList[0].BillId;
        this.$rootScope.isLoading = true;
        var promise = this.ReturnBillService.submitPOSBill(this.$scope.returnBillModel);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.isResult !== false) {
                    _this.ngToast.create(stringConstants.returnBillSubmitedSucessfully);
                    _this.$scope.returnBillModel = new Model.POSReturnBillModel();
                    _this.$scope.billList = [];
                    _this.$scope.paymentTypeList = [];
                    _this.$scope.billNumber = "";
                    _this.$scope.errorMessageDisplayForBlankList = true;
                    _this.$rootScope.isLoading = false;
                    _this.printReturnBill(result.isResult);
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
    //This method usd for print return bill. -An
    ReturnBillController.prototype.printReturnBill = function (id) {
        var _this = this;
        var promise = this.ReturnBillService.getReturnBillRecipt(id);
        promise.then(function (result) {
            if (result.isResult !== null && result.isResult !== undefined) {
                _this.printer.print("/Templates/Sales/ReturnBillReceipt.html", result.isResult);
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
    //this function used for click on cancel button event. -An
    ReturnBillController.prototype.clickOnCancelButton = function () {
        this.$scope.returnBillModel = new Model.POSReturnBillModel();
        this.$scope.billList = [];
        this.$scope.paymentTypeList = [];
        this.$scope.billNumber = "";
        this.$scope.errorMessageDisplayForBlankList = true;
    };
    //this function used for view item detail event. -An
    ReturnBillController.prototype.viewItemDetail = function (id) {
        this.$scope.billNumber = id;
        this.clickOnGetBill();
        this.billSearchPopup.dismiss('cancel');
    };
    //this funciton used for get branch list. -An
    ReturnBillController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.ReturnBillService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
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
    ReturnBillController.prototype.checkIntegerReturnQuantity = function (quantity, index) {
        var controllerScope = this.$scope;
        if (quantity !== "" && quantity !== undefined && quantity !== null) {
            if (isNaN(quantity)) {
                controllerScope.returnBill.$invalid = true;
                return true;
            }
            else {
                if (Math.round(quantity) === parseInt(quantity, 10)) {
                    return false;
                }
                else {
                    controllerScope.returnBill.$invalid = true;
                    return true;
                }
            }
        }
    };
    return ReturnBillController;
}());
ReturnBillController.controllerId = "ReturnBillController";
app.controller(ReturnBillController.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', function ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) {
        return new ReturnBillController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
    }]);
//# sourceMappingURL=ReturnBillController.js.map
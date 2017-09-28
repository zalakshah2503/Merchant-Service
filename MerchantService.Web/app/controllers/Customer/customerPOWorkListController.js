/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/customer/customerpoworklistservice.ts" />
var CustomerPOWorkListController = (function () {
    function CustomerPOWorkListController($scope, $log, customerPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.customerPOWorkListService = customerPOWorkListService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$filter = $filter;
        this.$location = $location;
        this.$modal = $modal;
        this.$routeParams = $routeParams;
        this.$scope.getCustomerPOWorkList = function () { return _this.getCustomerPOWorkList(); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.searchCustomerPOWorkList = function () { return _this.searchCustomerPOWorkList(); };
        this.$scope.customerPO = [];
        this.$scope.poWorkList = [];
        this.$scope.totalCPOItemList = [];
        this.$scope.notFoundItem = true;
        this.$scope.branchList = [];
        this.$scope.isAmountSearchVisible = false;
        this.$scope.isDateSearchVisible = false;
        this.$scope.onChangeSearchPreference = function () { return _this.onChangeSearchPreference(); };
        this.$scope.preference = [];
        this.$scope.closeCancelPopup = function () { return _this.closeCancelPopup(); };
        //string constants
        this.$scope.downPaymentNotFound = stringConstants.downPaymentNotFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.cpoDeleteConfirmation = stringConstants.cpoDeleteConfirmation;
        this.$scope.cpoItem = stringConstants.cpoItem;
        this.$scope.cpoNotFound = stringConstants.cpoNotFound;
        this.$scope.validAmountError = stringConstants.validAmountError;
        // datepicker
        this.$scope.isIssueDateFromPickerOpened = false;
        this.$scope.openIssueDateFromPicker = function (event) { return _this.openIssueDateFromPicker(event); };
        this.$scope.isIssueDateToPickerOpened = false;
        this.$scope.openIssueDateToPicker = function (event) { return _this.openIssueDateToPicker(event); };
        this.$scope.isDueDateFromPickerOpened = false;
        this.$scope.openDueDateFromPicker = function (event) { return _this.openDueDateFromPicker(event); };
        this.$scope.isDueDateToPickerOpened = false;
        this.$scope.openDueDateToPicker = function (event) { return _this.openDueDateToPicker(event); };
        this.$scope.getCPODetail = function () { return _this.getCPODetail(); };
        this.$scope.fetchCPODetail = function (id) { return _this.fetchCPODetail(id); };
        this.$scope.close = function () { return _this.close(); };
        this.$scope.cancelCPO = function (returnAmount, additionalCostReturned, isAdditionalCostReturn) { return _this.cancelCPO(returnAmount, additionalCostReturned, isAdditionalCostReturn); };
        this.$scope.additionalCostReturned = [];
        this.$scope.editCPO = function () { return _this.editCPO(); };
        this.$scope.returnAmount = 0;
        this.$scope.isAdditionalCostReturnVisible = false;
        this.$scope.onCancelAdditionalCostChange = function (cost, isAdditionalCostReturnVisible) { return _this.onCancelAdditionalCostChange(cost, isAdditionalCostReturnVisible); };
        this.$scope.onChangeAdditionalCostSetting = function (cost, status) { return _this.onChangeAdditionalCostSetting(cost, status); };
        this.$scope.openCancelCPOModal = function () { return _this.openCancelCPOModal(); };
        this.$scope.closeCancelCPOPopup = function () { return _this.closeCancelCPOPopup(); };
        this.$scope.cancelConfirm = function () { return _this.cancelConfirm(); };
        this.$scope.isCancelConfirm = false;
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.customerPOList = [];
        this.$scope.search = [];
        this.$scope.dateSearch = [];
        this.$scope.amountSearch = [];
        this.$scope.customerPOTotalCollection = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 5;
        this.$scope.errorMessage = "";
        this.$scope.notFoundItem = false;
        this.$scope.isCollected = false;
        this.$scope.openCPODetailListPopup = function () { return _this.openCPODetailListPopup(); };
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.customerPOList.slice(begin, end);
        });
        this.initialize();
    }
    CustomerPOWorkListController.prototype.initialize = function () {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getCPODetail();
        }
        else {
            this.getCustomerPOWorkList();
            this.getBranchList();
        }
    };
    //used to check which search parameters are selected
    CustomerPOWorkListController.prototype.onChangeSearchPreference = function () {
        var controllerScope = this.$scope;
        controllerScope.isAmountSearchVisible = controllerScope.preference.Amount;
        controllerScope.isDateSearchVisible = controllerScope.preference.Date;
    };
    // used to fetch customer purchase order worklist
    CustomerPOWorkListController.prototype.getCustomerPOWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.customerPOList = [];
        controllerRootScope.cpoInfo = [];
        controllerRootScope.isCustomerDetailsVisible = false;
        controllerRootScope.isCPOAdded = false;
        controllerRootScope.customerProfile = [];
        var customerPOCollection = controllerScope.customerPOList;
        var promise = this.customerPOWorkListService.getCustomerPOWorkList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    result[i].DueDate = new Date(result[i].DueDate).toISOString().substr(0, 10);
                    result[i].InitiationDate = new Date(result[i].InitiationDate).toISOString().substr(0, 10);
                    if (result[i].IsCollected) {
                        result[i].Status = stringConstants.OrderCollected;
                    }
                    else {
                        result[i].Status = stringConstants.PendingCollection;
                    }
                    customerPOCollection.push(result[i]);
                    controllerScope.customerPOTotalCollection = customerPOCollection;
                    controllerScope.customerPOList = customerPOCollection;
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = customerPOCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.customerPOList.length;
                }
            }
            controllerRootScope.isLoading = false;
            ;
        }).catch(function (error) {
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    // used to fetch list of branches
    CustomerPOWorkListController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.customerPOWorkListService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push(result[i]);
                }
            }
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to search customer
    CustomerPOWorkListController.prototype.searchCustomerPOWorkList = function () {
        var controllerScope;
        controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        var count = 0;
        var IssueDateFrom;
        var DueDateFrom;
        var IssueDateTo;
        var DueDateTo;
        if (controllerScope.dateSearch.IssueDateFrom !== null && controllerScope.dateSearch.IssueDateFrom !== undefined) {
            IssueDateFrom = this.$filter('date')(controllerScope.dateSearch.IssueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateFrom !== null && controllerScope.dateSearch.DueDateFrom !== undefined) {
            DueDateFrom = this.$filter('date')(controllerScope.dateSearch.DueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.IssueDateTo !== null && controllerScope.dateSearch.IssueDateTo !== undefined) {
            IssueDateTo = this.$filter('date')(controllerScope.dateSearch.IssueDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateTo !== null && controllerScope.dateSearch.DueDateTo !== undefined) {
            DueDateTo = this.$filter('date')(controllerScope.dateSearch.DueDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        controllerScope.customerPOList = this.filterFilter((controllerScope.customerPOTotalCollection), controllerScope.search);
        var tempList = [];
        tempList = controllerScope.customerPOList;
        controllerScope.customerPOList = [];
        /* change pagination with $scope.filtered */
        if (tempList.length === 0) {
            controllerScope.totalCollection = [];
        }
        else {
            for (var i = 0; i < tempList.length; i++) {
                var DueDate = (this.$filter('date')(tempList[i].DueDate, 'yyyy/MM/dd'));
                var InitiationDate = (this.$filter('date')(tempList[i].InitiationDate, 'yyyy/MM/dd'));
                if (DueDateFrom !== null && DueDateTo !== null && DueDateFrom !== undefined && DueDateTo !== undefined) {
                    if (DueDate >= DueDateFrom && DueDate <= DueDateTo) {
                        controllerScope.customerPOList.push(tempList[i]);
                    }
                }
                else {
                    if ((DueDate >= DueDateFrom) || (DueDate <= DueDateTo) || (InitiationDate >= IssueDateFrom) || (InitiationDate <= IssueDateTo)) {
                        controllerScope.customerPOList.push(tempList[i]);
                    }
                }
            }
            if (count === 0) {
                controllerScope.customerPOList = tempList;
            }
            var secondList = [];
            secondList = controllerScope.customerPOList;
            controllerScope.customerPOList = [];
            for (var k = 0; k < secondList.length; k++) {
                var DueDate = (this.$filter('date')(secondList[k].DueDate, 'yyyy/MM/dd'));
                var InitiationDate = (this.$filter('date')(secondList[k].InitiationDate, 'yyyy/MM/dd'));
                if (secondList.length !== 0) {
                    if (IssueDateTo !== null && IssueDateFrom !== null && IssueDateTo !== undefined && IssueDateFrom !== undefined) {
                        if (InitiationDate >= (IssueDateFrom) && InitiationDate <= (IssueDateTo)) {
                            controllerScope.customerPOList.push(secondList[k]);
                        }
                    }
                    else {
                        if ((DueDate >= DueDateFrom) || (DueDate <= DueDateTo) || (InitiationDate >= IssueDateFrom) || (InitiationDate <= IssueDateTo)) {
                            controllerScope.customerPOList.push(secondList[k]);
                        }
                    }
                }
            }
            if (count === 0) {
                controllerScope.customerPOList = secondList;
            }
        }
        var finalList = [];
        var finalCount = 0;
        finalList = controllerScope.customerPOList;
        if (controllerScope.amountSearch.AmountTo === "") {
            controllerScope.amountSearch.AmountTo = null;
        }
        if (controllerScope.amountSearch.AmountFrom === "") {
            controllerScope.amountSearch.AmountFrom = null;
        }
        controllerScope.customerPOList = [];
        if (finalList.length === 0) {
        }
        else {
            for (var j = 0; j < finalList.length; j++) {
                if (controllerScope.amountSearch.AmountTo !== null && controllerScope.amountSearch.AmountFrom !== null && controllerScope.amountSearch.AmountTo !== undefined && controllerScope.amountSearch.AmountFrom !== undefined) {
                    finalCount = 1;
                    if (finalList[j].Total <= controllerScope.amountSearch.AmountTo && finalList[j].Total >= controllerScope.amountSearch.AmountFrom) {
                        controllerScope.customerPOList.push(finalList[j]);
                    }
                }
                else {
                    if ((controllerScope.amountSearch.AmountTo !== null && controllerScope.amountSearch.AmountTo !== undefined)
                        || (controllerScope.amountSearch.AmountFrom !== null && controllerScope.amountSearch.AmountFrom !== undefined)) {
                        finalCount = 1;
                        if ((finalList[j].Total <= controllerScope.amountSearch.AmountTo) || (finalList[j].Total >= controllerScope.amountSearch.AmountFrom)) {
                            controllerScope.customerPOList.push(finalList[j]);
                        }
                    }
                }
            }
        }
        if (finalCount === 0) {
            controllerScope.customerPOList = finalList;
        }
        var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.customerPOList.slice(begin, end);
        controllerScope.totalItems = controllerScope.customerPOList.length;
        controllerScope.search = [];
        controllerScope.dateSearch = [];
        controllerScope.amountSearch = [];
    };
    // datepicker for search
    CustomerPOWorkListController.prototype.openIssueDateFromPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateFromPickerOpened = true;
    };
    CustomerPOWorkListController.prototype.openIssueDateToPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateToPickerOpened = true;
    };
    CustomerPOWorkListController.prototype.openDueDateToPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateToPickerOpened = true;
    };
    CustomerPOWorkListController.prototype.openDueDateFromPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateFromPickerOpened = true;
    };
    //used to redirect to cpodetail page
    CustomerPOWorkListController.prototype.getCPODetail = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var id = this.$routeParams.id;
        var promise = this.customerPOWorkListService.getCPODetail(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                result.DueDate = new Date(result.DueDate).toISOString().substr(0, 10);
                result.InitiationDate = new Date(result.InitiationDate).toISOString().substr(0, 10);
                for (var i = 0; i < result.CPOPayment.length; i++) {
                    result.CPOPayment[i].CreatedDateTime = new Date(result.CPOPayment[i].CreatedDateTime).toISOString().substr(0, 10);
                    for (var j = 0; j < stringConstants.paymentModeList.length; j++) {
                        if (result.CPOPayment[i].PaymentMode === stringConstants.paymentModeList[j].Id) {
                            result.CPOPayment[i].Mode = stringConstants.paymentModeList[j].Name;
                        }
                    }
                }
                controllerScope.customerPO = result;
                if (controllerScope.customerPO.Customer.BalanceAmount > 0) {
                    controllerScope.customerPO.Customer.BalanceAmt = controllerScope.customerPO.Customer.BalanceAmount - controllerScope.customerPO.Customer.TransactionAmount;
                }
                else if (controllerScope.customerPO.Customer.AmountLimit > 0) {
                    controllerScope.customerPO.Customer.LimitAmt = controllerScope.customerPO.Customer.AmountLimit - controllerScope.customerPO.Customer.TransactionAmount;
                }
                else {
                }
                controllerRootScope.PriceCategory = controllerScope.customerPO.Customer.PriceCategory;
                for (var k = 0; k < stringConstants.priceCategoryList.length; k++) {
                    if (controllerScope.customerPO.Customer.PriceCategory === stringConstants.priceCategoryList[k].Id) {
                        controllerScope.customerPO.Customer.PriceCategoryName = stringConstants.priceCategoryList[k].Name;
                    }
                }
                if (controllerScope.customerPO.Customer.IsCreditCustomer) {
                    controllerScope.isCreditCustomer = true;
                }
                else {
                    controllerScope.isCreditCustomer = false;
                }
                _this.BindPopupGrid(result.listOfCustomerPurchaseOrderItem);
                _this.$scope.isCollected = result.IsCollected;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            controllerRootScope.isLoading = false;
        });
    };
    //this funciton used for bind CPO Detail Popup. -An
    CustomerPOWorkListController.prototype.BindPopupGrid = function (listOfCustomerPurchaseOrderItem) {
        if (listOfCustomerPurchaseOrderItem.length > 0) {
            for (var i = 0; i < listOfCustomerPurchaseOrderItem.length; i++) {
                this.$scope.totalCPOItemList.push(listOfCustomerPurchaseOrderItem[i]);
            }
            this.$scope.notFoundItem = false;
        }
        else
            this.$scope.notFoundItem = true;
    };
    //this funcion used for close CPO Detail Popup. -An
    CustomerPOWorkListController.prototype.closeCancelPopup = function () {
        this.cpoDetailListPopup.dismiss('cancel');
    };
    //this function used for open CPO Detail Popup. -An
    CustomerPOWorkListController.prototype.openCPODetailListPopup = function () {
        this.cpoDetailListPopup = this.$modal.open({
            templateUrl: 'cpoItemDetailList',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            scope: this.$scope,
        });
    };
    // used to redirect to cpo detail page
    CustomerPOWorkListController.prototype.fetchCPODetail = function (id) {
        var x = this;
        x.$location.path("/CustomerPODetail/" + id);
    };
    //used to redirect to worklist
    CustomerPOWorkListController.prototype.close = function () {
        //  window.location.assign('#CustomerPOWorkList');
        var x = this;
        x.$location.path("/CustomerPOWorkList/");
    };
    // used to cancel CPO
    CustomerPOWorkListController.prototype.cancelCPO = function (returnAmount, additionalCostReturned, isAdditionalCostReturn) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.customerPOWorkListService.cancelCustomerPO(controllerScope.customerPO.CustomerPOId, returnAmount);
        promise.then(function (result) {
            if (result.status === undefined || result.status === null) {
                _this.closeCancelCPOPopup();
                var x = _this;
                x.$location.path("/CustomerPOWorkList/");
                _this.ngToast.create(stringConstants.CPOCanceled);
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.permissionDenied
                });
            }
        }).catch(function (error) {
            if (error.status !== 400) {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to redirect to CustomerPO page - jj
    CustomerPOWorkListController.prototype.editCPO = function () {
        var x = this;
        var controllerScope = this.$scope;
        x.$location.path("/CustomerPO/" + controllerScope.customerPO.CustomerPOId);
    };
    // used for opening the CancelCPOPopup-jj
    CustomerPOWorkListController.prototype.openCancelCPOModal = function () {
        var controllerScope = this.$scope;
        controllerScope.returnAmount = 0;
        controllerScope.additionalCostReturned.additionalCostReturned = 0;
        controllerScope.totalAdditionalCost = 0;
        controllerScope.totalReceived = 0;
        for (var i = 0; i < controllerScope.customerPO.CPOPayment.length; i++) {
            if (controllerScope.customerPO.CPOPayment[i].PaymentMode === 0) {
                controllerScope.totalReceived = controllerScope.totalReceived + controllerScope.customerPO.CPOPayment[i].TotalAmount;
            }
            else {
                controllerScope.totalReceived = controllerScope.totalReceived - controllerScope.customerPO.CPOPayment[i].TotalAmount;
            }
        }
        for (var j = 0; j < controllerScope.customerPO.CPOAdditionalCost.length; j++) {
            controllerScope.totalAdditionalCost = controllerScope.totalAdditionalCost + controllerScope.customerPO.CPOAdditionalCost[j].Amount;
        }
        controllerScope.isAdditionalCostReturnVisible = true;
        if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
            controllerScope.returnAmount = controllerScope.totalReceived;
            controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalReceived;
        }
        else {
            controllerScope.returnAmount = controllerScope.totalReceived;
            controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalAdditionalCost;
        }
        this.openCancelPopUp();
    };
    CustomerPOWorkListController.prototype.openCancelPopUp = function () {
        this.cancelCPOPopup = this.$modal.open({
            templateUrl: 'CancelCPOModal',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
    };
    // used for closing  the DeleteAdditionalCostPopup-jj
    CustomerPOWorkListController.prototype.closeCancelCPOPopup = function () {
        var controllerScope = this.$scope;
        controllerScope.isCancelConfirm = false;
        this.cancelCPOPopup.dismiss('cancel');
    };
    CustomerPOWorkListController.prototype.cancelConfirm = function () {
        this.closeCancelCPOPopup();
        var controllerScope = this.$scope;
        controllerScope.isCancelConfirm = true;
        this.openCancelPopUp();
    };
    //used to change return amount-jj
    CustomerPOWorkListController.prototype.onCancelAdditionalCostChange = function (cost, isAdditionalCostReturnVisible) {
        var controllerScope = this.$scope;
        if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
            if (isAdditionalCostReturnVisible) {
                controllerScope.returnAmount = cost;
            }
        }
        else {
            if (isAdditionalCostReturnVisible) {
                if (cost >= 0 && cost !== "") {
                    controllerScope.returnAmount = controllerScope.totalReceived - parseFloat("" + controllerScope.totalAdditionalCost) + parseFloat("" + cost);
                }
                else {
                    controllerScope.returnAmount = controllerScope.totalReceived - parseFloat("" + controllerScope.totalAdditionalCost);
                }
            }
        }
    };
    CustomerPOWorkListController.prototype.onChangeAdditionalCostSetting = function (cost, status) {
        var controllerScope = this.$scope;
        if (status) {
            if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
                controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalReceived;
                controllerScope.returnAmount = controllerScope.totalReceived;
            }
            else {
                controllerScope.returnAmount = controllerScope.totalReceived;
                controllerScope.additionalCostReturned.additionalCostReturned = controllerScope.totalAdditionalCost;
            }
        }
        else {
            controllerScope.additionalCostReturned.additionalCostReturned = 0;
            if (controllerScope.totalAdditionalCost >= controllerScope.totalReceived) {
                controllerScope.returnAmount = controllerScope.totalReceived;
            }
            else {
                controllerScope.returnAmount = controllerScope.totalReceived - controllerScope.totalAdditionalCost;
            }
        }
    };
    return CustomerPOWorkListController;
}());
CustomerPOWorkListController.controllerId = "CustomerPOWorkListController";
app.controller(CustomerPOWorkListController.controllerId, ['$scope', '$log', 'CustomerPOWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$modal', '$routeParams', function ($scope, $log, CustomerPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams) {
        return new CustomerPOWorkListController($scope, $log, CustomerPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams);
    }]);
//# sourceMappingURL=customerPOWorkListController.js.map
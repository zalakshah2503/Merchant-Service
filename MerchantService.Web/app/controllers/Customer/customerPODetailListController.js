var CustomerPODetailListController = (function () {
    function CustomerPODetailListController($scope, $log, customerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.customerPOService = customerPOService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$filter = $filter;
        this.$location = $location;
        this.$modal = $modal;
        this.$routeParams = $routeParams;
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.notFoundItem = false;
        this.$scope.search = [];
        this.$scope.searchDate = [];
        this.$scope.isCollectionDateTo = false;
        this.$scope.isCollectionDateFrom = false;
        this.$scope.searchClick = function () { return _this.searchClick(); };
        this.$scope.clickOnCollectionDateFrom = function (event) { return _this.clickOnCollectionDateFrom(event); };
        this.$scope.clickOnCollectionDateTo = function (event) { return _this.clickOnCollectionDateTo(event); };
        this.$scope.tempList = [];
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.customerPODetailCollection.slice(begin, end);
        });
        this.initialization();
    }
    CustomerPODetailListController.prototype.initialization = function () {
        this.getCustomerPODetailList();
    };
    CustomerPODetailListController.prototype.clickOnCollectionDateFrom = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isCollectionDateFrom = true;
    };
    CustomerPODetailListController.prototype.clickOnCollectionDateTo = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isCollectionDateTo = true;
    };
    CustomerPODetailListController.prototype.searchClick = function () {
        var controllerScope = this.$scope;
        this.$rootScope.isLoading = true;
        controllerScope.notFoundItem = false;
        var fromDate;
        var toDate;
        if (controllerScope.searchDate.CollectionDateFrom !== undefined && controllerScope.searchDate.CollectionDateFrom !== null) {
            var nowFrom = new Date(controllerScope.searchDate.CollectionDateFrom); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
            fromDate = new Date(nowFrom.getTime() - nowFrom.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        if (controllerScope.searchDate.CollectionDateTo !== undefined && controllerScope.searchDate.CollectionDateTo !== null) {
            var nowTo = new Date(controllerScope.searchDate.CollectionDateTo);
            toDate = new Date(nowTo.getTime() - nowTo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        if (controllerScope.totalCustomerPODetailCollection.length > 0) {
            if (fromDate !== undefined && toDate !== undefined && fromDate !== null && toDate !== null) {
                for (var i = 0; i < controllerScope.totalCustomerPODetailCollection.length; i++) {
                    if (fromDate <= new Date(controllerScope.totalCustomerPODetailCollection[i].IssueDate).toISOString().substr(0, 10)
                        && toDate >= new Date(controllerScope.totalCustomerPODetailCollection[i].IssueDate).toISOString().substr(0, 10)) {
                        controllerScope.tempList.push(controllerScope.totalCustomerPODetailCollection[i]);
                    }
                }
            }
        }
        if (fromDate !== undefined && toDate !== undefined && fromDate !== null && toDate !== null) {
            if ((controllerScope.search.CustomerName !== undefined && controllerScope.search.CustomerName !== null) ||
                (controllerScope.search.MembershipNumber !== undefined && controllerScope.search.MembershipNumber !== null) ||
                (controllerScope.search.ReturnBillNumber !== undefined && controllerScope.search.ReturnBillNumber !== null)) {
                controllerScope.customerPODetailCollection = this.filterFilter((controllerScope.tempList), controllerScope.search);
            }
            else
                controllerScope.customerPODetailCollection = controllerScope.tempList;
        }
        else {
            controllerScope.customerPODetailCollection = this.filterFilter((controllerScope.totalCustomerPODetailCollection), controllerScope.search);
        }
        if (controllerScope.customerPODetailCollection.length === 0) {
            controllerScope.notFoundItem = true;
            controllerScope.totalCollection = [];
        }
        else {
            var that = this;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.customerPODetailCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.customerPODetailCollection.length;
        }
        controllerScope.tempList = [];
        controllerScope.search = [];
        controllerScope.searchDate = [];
        this.$rootScope.isLoading = false;
    };
    //this method used for get customer PO Detail List. -An
    CustomerPODetailListController.prototype.getCustomerPODetailList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        this.$scope.notFoundItem = false;
        var controllerRootScope = this.$rootScope;
        controllerScope.customerPODetailCollection = [];
        var customerPODetail = controllerScope.customerPODetailCollection;
        //To get branch list
        var promise = this.customerPOService.getCustomerPODetailList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    customerPODetail.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = customerPODetail.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.customerPODetailCollection.length;
                controllerScope.totalCustomerPODetailCollection = controllerScope.customerPODetailCollection;
            }
            else
                _this.$scope.notFoundItem = true;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get sub item list. -An
    CustomerPODetailListController.prototype.getSubItemList = function (parentId) {
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
    return CustomerPODetailListController;
}());
CustomerPODetailListController.controllerId = "CustomerPODetailListController";
app.controller(CustomerPODetailListController.controllerId, ['$scope', '$log', 'CustomerPOService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$modal', '$routeParams', function ($scope, $log, CustomerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams) {
        return new CustomerPODetailListController($scope, $log, CustomerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams);
    }]);
//# sourceMappingURL=customerPODetailListController.js.map
var ReturnBillReceiptController = (function () {
    function ReturnBillReceiptController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
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
        this.$scope.returnBillReceiptList = [];
        this.$scope.returnBillItem = [];
        this.initialize();
    }
    //this method used for initialization 
    ReturnBillReceiptController.prototype.initialize = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        var promise = this.ReturnBillService.getReturnBillRecipt(this.$routeParams.id);
        promise.then(function (result) {
            if (result.isResult !== null && result.isResult !== undefined) {
                _this.$scope.returnBillReceiptList.Date = result.isResult.Date;
                _this.$scope.returnBillReceiptList.MembershipNo = result.isResult.MemberShipNumber;
                _this.$scope.returnBillReceiptList.ReturnInvoiceNo = result.isResult.ReturnInvoiceNumber;
                _this.$scope.returnBillReceiptList.InvoiceNo = result.isResult.InvoiceNo;
                _this.$scope.returnBillReceiptList.TotalQuantity = result.isResult.TotalQuantity;
                _this.$scope.returnBillReceiptList.ReturnAmount = result.isResult.ReturnAmount;
                if (result.isResult.ListOfReturnBillList.length > 0) {
                    for (var i = 0; i <= result.isResult.ListOfReturnBillList.length; i++) {
                        _this.$scope.returnBillItem.push(result.isResult.ListOfReturnBillList[i]);
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
    return ReturnBillReceiptController;
}());
ReturnBillReceiptController.controllerId = "ReturnBillReceiptController";
app.controller(ReturnBillReceiptController.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', function ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) {
        return new ReturnBillReceiptController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
    }]);
//# sourceMappingURL=ReturnBillReceiptController.js.map
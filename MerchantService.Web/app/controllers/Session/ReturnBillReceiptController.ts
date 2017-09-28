interface IReturnBillReceiptControllerScope extends ng.IScope {
    returnBillReceiptList: any;
    returnBillItem: any;
}

interface IReturnBillReceiptController {

}

class ReturnBillReceiptController implements IReturnBillReceiptController {
    static controllerId = "ReturnBillReceiptController";

    constructor(private $scope: IReturnBillReceiptControllerScope, private $log: ng.ILogService, public $rootScope, private ReturnBillService: ReturnBillService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal) {
        this.$scope.returnBillReceiptList = [];
        this.$scope.returnBillItem = [];
        this.initialize();
    }

    //this method used for initialization 
    private initialize() {
        this.$rootScope.isLoading = true;
        let promise = this.ReturnBillService.getReturnBillRecipt(this.$routeParams.id);
        promise.then((result) => {
            if (result.isResult !== null && result.isResult !== undefined) {
                this.$scope.returnBillReceiptList.Date = result.isResult.Date;
                this.$scope.returnBillReceiptList.MembershipNo = result.isResult.MemberShipNumber;
                this.$scope.returnBillReceiptList.ReturnInvoiceNo = result.isResult.ReturnInvoiceNumber;
                this.$scope.returnBillReceiptList.InvoiceNo = result.isResult.InvoiceNo;
                this.$scope.returnBillReceiptList.TotalQuantity = result.isResult.TotalQuantity;
                this.$scope.returnBillReceiptList.ReturnAmount = result.isResult.ReturnAmount;
                if (result.isResult.ListOfReturnBillList.length > 0) {
                    for (let i = 0; i <= result.isResult.ListOfReturnBillList.length; i++) {
                        this.$scope.returnBillItem.push(result.isResult.ListOfReturnBillList[i]);
                    }
                }
            }
            this.$rootScope.isLoading = false;
        }).catch((error) => {
            this.$rootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
}

app.controller(ReturnBillReceiptController.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) => {
    return new ReturnBillReceiptController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
}]);
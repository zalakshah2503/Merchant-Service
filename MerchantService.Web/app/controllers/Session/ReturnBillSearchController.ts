interface IReturnBillSearchControllerScope extends ng.IScope {
    errorMessageDisplay: boolean;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    totalCollection: any;
    returnBillCollection: any;
    returnBillTotalCollection: any;
    printReturnBill: Function;
    openDateFromPickerDate: Function;
    openDateToPickerDate: Function;
    isReturningDateFrom: boolean;
    isReturningDateTo: boolean;
    searchButtonClick: Function;
    search: any;
    returnDate: any;
    tempList: any;
    noItemFound: any;
}

interface IReturnBillSearchController {

}

class ReturnBillSearchController implements IReturnBillSearchController {
    static controllerId = "ReturnBillSearchController";
    constructor(private $scope: IReturnBillSearchControllerScope, private $log: ng.ILogService, public $rootScope, private ReturnBillService: ReturnBillService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal, public printer) {
        this.$scope.returnBillTotalCollection = [];
        this.$scope.tempList = [];
        this.$scope.returnDate = [];
        this.$scope.errorMessageDisplay = true;
        this.$scope.search = [];
        this.$scope.maxSize = 10;
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.printReturnBill = (returnBillNumber) => this.printReturnBill(returnBillNumber);
        this.$scope.openDateFromPickerDate = (event) => this.openDateFromPickerDate(event);
        this.$scope.openDateToPickerDate = (event) => this.openDateToPickerDate(event);
        this.$scope.isReturningDateFrom = false;
        this.$scope.isReturningDateTo = false;
        this.$scope.searchButtonClick = () => this.searchButtonClick();
        this.$scope.noItemFound = stringConstants.noItemFound;
        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.returnBillCollection.slice(begin, end);
        });

        this.initialization();
    }


    private initialization() {
        this.getReturnBillList();
    }
    

    private openDateFromPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isReturningDateFrom = true;
    }


    private openDateToPickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isReturningDateTo = true;
    }


    private searchButtonClick() {
        let controllerScope = this.$scope;
        this.$rootScope.isLoading = true;
        controllerScope.errorMessageDisplay = false;
        let resturningFromDate;
        if (controllerScope.returnDate.resturningDateFrom !== undefined && controllerScope.returnDate.resturningDateFrom !== null) {
            let nowFrom = new Date(controllerScope.returnDate.resturningDateFrom); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
            resturningFromDate = new Date(nowFrom.getTime() - nowFrom.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        let resturningToDate;
        if (controllerScope.returnDate.resturningDateTo !== undefined && controllerScope.returnDate.resturningDateTo !== null) {
            let nowTo = new Date(controllerScope.returnDate.resturningDateTo);
            resturningToDate = new Date(nowTo.getTime() - nowTo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }

        if (controllerScope.returnBillTotalCollection.length > 0) {
            if (resturningFromDate !== undefined && resturningToDate !== undefined
                && resturningFromDate !== null && resturningToDate !== null) {
                for (let i = 0; i < controllerScope.returnBillTotalCollection.length; i++) {
                    if (resturningFromDate <= new Date(controllerScope.returnBillTotalCollection[i].ReturningDate).toISOString().substr(0, 10)
                        && resturningToDate >= new Date(controllerScope.returnBillTotalCollection[i].ReturningDate).toISOString().substr(0, 10)) {
                        controllerScope.tempList.push(controllerScope.returnBillTotalCollection[i]);
                    }
                }
            }
        }

        if (resturningFromDate !== undefined && resturningToDate !== undefined &&
            resturningFromDate !== null && resturningToDate !== null) {
            if ((controllerScope.search.CustomerName !== null && controllerScope.search.CustomerName !== undefined) ||
                (controllerScope.search.MembershipNumber !== null && controllerScope.search.MembershipNumber !== undefined) ||
                (controllerScope.search.ReturnBillNumber !== null && controllerScope.search.ReturnBillNumber !== undefined)) {
                controllerScope.returnBillCollection = this.filterFilter((controllerScope.tempList), controllerScope.search);
            }
            else
                controllerScope.returnBillCollection = controllerScope.tempList;
        }
        else {
            controllerScope.returnBillCollection = this.filterFilter((controllerScope.returnBillTotalCollection), controllerScope.search);
        }

        if (controllerScope.returnBillCollection.length === 0) {
            controllerScope.errorMessageDisplay = true;
            controllerScope.totalCollection = [];
        }
        else {
            let that = this;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.returnBillCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.returnBillCollection.length;
            controllerScope.errorMessageDisplay = false;
        }
        controllerScope.tempList = [];
        controllerScope.search = [];
        controllerScope.returnDate = [];
        this.$rootScope.isLoading = false;
    }


    //get return bill list.-An
    private getReturnBillList() {
        this.$scope.returnBillCollection = [];
        this.$rootScope.isLoading = true;
        let returnBill = this.$scope.returnBillCollection;
        let promise = this.ReturnBillService.getReturnBillDetailList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    returnBill.push(result[i]);
                }

                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                this.$scope.totalCollection = returnBill.slice(begin, end);
                /* init pagination with $scope.list */
                this.$scope.totalItems = this.$scope.returnBillCollection.length;
                this.$scope.returnBillTotalCollection = this.$scope.returnBillCollection;
                this.$scope.errorMessageDisplay = false;
            }
            else
                this.$scope.errorMessageDisplay = true;
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

    //This method usd for print return bill. -An
    private printReturnBill(returnBillNumber) {
        let promise = this.ReturnBillService.getReturnBillRecipt(returnBillNumber);
        promise.then((result) => {
            if (result.isResult !== null && result.isResult !== undefined) {
                this.printer.print("/Templates/Sales/ReturnBillReceipt.html", result.isResult);
            }
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

app.controller(ReturnBillSearchController.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'printer', ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer) => {
    return new ReturnBillSearchController($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, printer);
}]);

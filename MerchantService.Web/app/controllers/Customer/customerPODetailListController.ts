interface IcustomerPODetailListControllerScope extends ng.IScope {
    customerPODetailCollection: any;
    totalCustomerPODetailCollection: any;
    totalCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    notFoundItem: boolean;
    getSubItemList: Function;
    search: any;
    searchDate: any;
    isCollectionDateTo: boolean;
    isCollectionDateFrom: boolean;
    clickOnCollectionDateFrom: Function;
    clickOnCollectionDateTo: Function;
    searchClick: Function;
    tempList: any;

}

interface IcustomerPODetailListController {
}

class CustomerPODetailListController implements IcustomerPODetailListController {
    static controllerId = "CustomerPODetailListController";
    constructor(private $scope: IcustomerPODetailListControllerScope, private $log: ng.ILocaleService, private customerPOService: CustomerPOService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $filter, public $location, public $modal, public $routeParams) {
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.notFoundItem = false;
        this.$scope.search = [];
        this.$scope.searchDate = [];
        this.$scope.isCollectionDateTo = false;
        this.$scope.isCollectionDateFrom = false;
        this.$scope.searchClick = () => this.searchClick();
        this.$scope.clickOnCollectionDateFrom = (event) => this.clickOnCollectionDateFrom(event);
        this.$scope.clickOnCollectionDateTo = (event) => this.clickOnCollectionDateTo(event);
        this.$scope.tempList = [];
        this.$scope.getSubItemList = (parentId) => this.getSubItemList(parentId);
        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.customerPODetailCollection.slice(begin, end);
        });
        this.initialization();
    }

    private initialization() {
        this.getCustomerPODetailList();
    }

    private clickOnCollectionDateFrom(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isCollectionDateFrom = true;
    }

    private clickOnCollectionDateTo(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isCollectionDateTo = true;
    }

    private searchClick() {
        let controllerScope = this.$scope;
        this.$rootScope.isLoading = true;
        controllerScope.notFoundItem = false;
        let fromDate;
        let toDate;
        if (controllerScope.searchDate.CollectionDateFrom !== undefined && controllerScope.searchDate.CollectionDateFrom !== null) {
            let nowFrom = new Date(controllerScope.searchDate.CollectionDateFrom); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
            fromDate = new Date(nowFrom.getTime() - nowFrom.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        if (controllerScope.searchDate.CollectionDateTo !== undefined && controllerScope.searchDate.CollectionDateTo !== null) {
            let nowTo = new Date(controllerScope.searchDate.CollectionDateTo);
            toDate = new Date(nowTo.getTime() - nowTo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }

        if (controllerScope.totalCustomerPODetailCollection.length > 0) {
            if (fromDate !== undefined && toDate !== undefined && fromDate !== null && toDate !== null) {
                for (let i = 0; i < controllerScope.totalCustomerPODetailCollection.length; i++) {
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
                (controllerScope.search.ReturnBillNumber !== undefined && controllerScope.search.ReturnBillNumber !== null)
            ) {
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
            let that = this;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.customerPODetailCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.customerPODetailCollection.length;
        }
        controllerScope.tempList = [];
        controllerScope.search = [];
        controllerScope.searchDate = [];
        this.$rootScope.isLoading = false;
    }

    //this method used for get customer PO Detail List. -An
    private getCustomerPODetailList() {
        let controllerScope = this.$scope;
        this.$scope.notFoundItem = false;
        let controllerRootScope = this.$rootScope;
        controllerScope.customerPODetailCollection = [];
        let customerPODetail = controllerScope.customerPODetailCollection;
        //To get branch list
        let promise = this.customerPOService.getCustomerPODetailList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    customerPODetail.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = customerPODetail.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.customerPODetailCollection.length;
                controllerScope.totalCustomerPODetailCollection = controllerScope.customerPODetailCollection;
            }
            else
                this.$scope.notFoundItem = true;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This function used for get sub item list. -An
    private getSubItemList(parentId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) { //to check click on pluse or minus icon.
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
    }

}


app.controller(CustomerPODetailListController.controllerId, ['$scope', '$log', 'CustomerPOService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$modal', '$routeParams', ($scope, $log, CustomerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams) => {
    return new CustomerPODetailListController($scope, $log, CustomerPOService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $modal, $routeParams);
}]);

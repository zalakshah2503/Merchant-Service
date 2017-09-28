interface IsupplierReturnWorkListControllerScope extends ng.IScope {
    supplierReturnRequest: Model.SupplierReturnRequest;
    getSupplierList: Function;
    getCauseList: Function;
    supplierList: any;
    causeList: any;
    supplierReturnWorkList: any;
    supplierReturnList: any;
    getSupplierReturnWorkList: Function;
    getBranchList: Function;
    branchList: any;
    searchWorkList: Function;
    search: any;
    dateSearch: any;
    viewDetail: Function;
    isRequestedDateFromPickerOpened: any;
    openRequestedDateFromPicker: Function;
    isRequestedDateToPickerOpened: any;
    openRequestedDateToPicker: Function;
    totalCollection: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    srrNotFound: string;
    deleted: string;
    rejected: string;
    itemTotalCollection: any;
}

interface IsupplierReturnWorkListController {

}


class SupplierReturnWorkListController implements IsupplierReturnWorkListController {
    static controllerId = "SupplierReturnWorkListController";
   


    constructor(private $scope: IsupplierReturnWorkListControllerScope, private $log: ng.ILocaleService, private supplierReturnWorkListService: SupplierReturnWorkListService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $filter, public $modal, public $location) {

        this.$scope.supplierReturnRequest = new Model.SupplierReturnRequest();
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.getCauseList = () => this.getCauseList();
        this.$scope.supplierList = [];
        this.$scope.causeList = [];
        this.$scope.supplierReturnWorkList = [];
        this.$scope.supplierReturnList = [];
        this.$scope.getSupplierReturnWorkList = () => this.getSupplierReturnWorkList();
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.branchList = [];
        this.$scope.searchWorkList = () => this.searchWorkList();
        this.$scope.search = [];
        this.$scope.dateSearch = [];
        this.$scope.srrNotFound = stringConstants.srrNotFound;
        this.$scope.rejected = stringConstants.rejected;
        this.$scope.deleted = stringConstants.deleted;
        this.$scope.viewDetail = (id) => this.viewDetail(id);
        this.$scope.isRequestedDateFromPickerOpened = false;
        this.$scope.openRequestedDateFromPicker = (event) => this.openRequestedDateFromPicker(event);
        this.$scope.isRequestedDateToPickerOpened = false;
        this.$scope.openRequestedDateToPicker = (event) => this.openRequestedDateToPicker(event);
        this.$scope.totalCollection = [];
        this.$scope.itemTotalCollection = [];
        this.$scope.itemsPerPage = 3;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.initialize();
    }

    private initialize() {
        this.getSupplierReturnWorkList();
        this.getSupplierList();
    }


    // used to fetch supplier list - jj
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnWorkListService.getSupplierList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].IsActive) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn, Code: result[i].Code });
                }
            }
            this.getCauseList();
        }).catch((error) => {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }
  

    //used to fetch BranchList - jj
    private getBranchList() {
        let controllerScope = this.$scope;
        let promise = this.supplierReturnWorkListService.getBranchList();
        promise.then((result) => {
            controllerScope.branchList = result;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingBranch
                });
        });
    }

    //used to fetch list of return cause - jj
    private getCauseList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnWorkListService.getCauseList(35);
        promise.then((result) => {
            controllerScope.causeList = result;
            this.getBranchList();
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingReturnCauseList
                });
            controllerRootScope.isLoading = false;
        });
    }


    //used to fetch supplier return request workList - jj
    private getSupplierReturnWorkList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierReturnWorkListService.getSupplierReturnList();
        promise.then((result) => {
            controllerScope.supplierReturnWorkList = result;
            controllerScope.supplierReturnList = result;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.ErrorinFetchingSRRList
                });
            controllerRootScope.isLoading = false;
        });
    }

    //used to search supplier return request worklist- jj
    private searchWorkList() {
        let controllerScope = this.$scope;
        let count = 0;
        let list = [];
        let requestedDateFrom;
        let requestedDateTo;
        if (controllerScope.dateSearch.RequestedDateFrom !== null && controllerScope.dateSearch.RequestedDateFrom !== undefined) {
            requestedDateFrom = this.$filter('date')(controllerScope.dateSearch.RequestedDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.RequestedDateTo !== null && controllerScope.dateSearch.RequestedDateTo !== undefined) {
            requestedDateTo = this.$filter('date')(controllerScope.dateSearch.RequestedDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        controllerScope.supplierReturnWorkList = this.filterFilter(controllerScope.supplierReturnList, controllerScope.search);
        list = controllerScope.supplierReturnWorkList;
        controllerScope.supplierReturnWorkList = [];

        //if i create  list1 which contains list where initiationdate are greater than fromdate and then from list2 which dates are
        //less than todate , i have to run the loop twice, thus i am using a diff method
        if (count === 1) {
            for (let i = 0; i < list.length; i++) {
                let initiationDate = this.$filter('date')(list[i].InitiationDate, 'yyyy/MM/dd');
                if (requestedDateFrom !== null && requestedDateFrom !== undefined && requestedDateTo !== null && requestedDateTo !== undefined) {
                    if (requestedDateFrom <= initiationDate && requestedDateTo >= initiationDate) {
                        controllerScope.supplierReturnWorkList.push(list[i]);
                    }
                }
                else {
                    if ((requestedDateFrom <= initiationDate) || (requestedDateTo >= initiationDate)) {
                        controllerScope.supplierReturnWorkList.push(list[i]);
                    }
                }
            }
        }
        else {
            controllerScope.supplierReturnWorkList = list;
        }
        controllerScope.search = [];
        controllerScope.dateSearch = [];
    }


    // datepicker for search -jj
    private openRequestedDateFromPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateFromPickerOpened = true;
    }

    private openRequestedDateToPicker(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateToPickerOpened = true;
    }


    //used to redirect to detail page - jj
    private viewDetail(id) {
        this.$location.path("/SupplierReturnRequestDetails/" + id);
    }
}

app.controller(SupplierReturnWorkListController.controllerId, ['$scope', '$log', 'SupplierReturnWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$modal', '$location', ($scope, $log, SupplierReturnWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $modal, $location) => {
    return new SupplierReturnWorkListController($scope, $log, SupplierReturnWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $modal, $location);
}]);


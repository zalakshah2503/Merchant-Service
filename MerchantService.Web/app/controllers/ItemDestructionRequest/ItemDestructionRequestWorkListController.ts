
interface IItemDestructionRequestWorkListControllerScope extends ng.IScope {
    branchList: any;
    supplierList: any;
    destructioCasueList: any;
    openRequestDateFromPickerDate: Function;
    openRequestDateToPickerDate: Function;
    isEndFromRequestDateOpened: boolean;
    isEndToRequestDateOpened: boolean;
    requestDate: any;
    totalCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    itemDestructionWorkListCollection: any;
    totalItemDestructionWorkListList: any;
    errorMessageDisplayForBlankList: boolean;
    search: any;
    editItemDestructionWorkList: Function;
    searchClick: Function;
    tempList: any;
    noItemFound: any;
}

interface IItemDestructionRequestWorkListController {

}

class ItemDestructionRequestWorkListController implements IItemDestructionRequestWorkListController {
    static controllerId = "ItemDestructionRequestWorkListController";
    constructor(private $scope: IItemDestructionRequestWorkListControllerScope, private $log: ng.ILogService, public $rootScope, private ItemDestructionService: ItemDestructionService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal) {
        this.$scope.branchList = [];
        this.$scope.search = [];
        this.$scope.supplierList = [];
        this.$scope.tempList = [];
        this.$scope.requestDate = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.itemDestructionWorkListCollection = [];
        this.$scope.maxSize = 10;
        this.$scope.isEndFromRequestDateOpened = false;
        this.$scope.editItemDestructionWorkList = (destructionId) => this.editItemDestructionWorkList(destructionId);
        this.$scope.isEndToRequestDateOpened = false;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.searchClick = () => this.searchClick();
        this.$scope.openRequestDateFromPickerDate = () => this.openRequestDateFromPickerDate();
        this.$scope.openRequestDateToPickerDate = () => this.openRequestDateToPickerDate();
        this.$scope.destructioCasueList = stringConstants.destructioCasueList;
        this.$scope.noItemFound = stringConstants.noItemFound;
        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.itemDestructionWorkListCollection.slice(begin, end);
        });
        this.initialization();
    }


    private initialization() {
        this.getBranchList();
        this.getSupplierList();
        this.getItemDestructionWorkList();
    }

    //this function used for search click. -An
    private searchClick() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.errorMessageDisplayForBlankList = false;
        let requestEndFromDate;
        if (controllerScope.requestDate.requestEndFromDate !== undefined && controllerScope.requestDate.requestEndFromDate !== null) {
            let nowFrom = new Date(controllerScope.requestDate.requestEndFromDate); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
            requestEndFromDate = new Date(nowFrom.getTime() - nowFrom.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }
        let requestEndToDate;
        if (controllerScope.requestDate.requestEndToDate !== undefined && controllerScope.requestDate.requestEndToDate !== null) {
            let nowTo = new Date(controllerScope.requestDate.requestEndToDate);
            requestEndToDate = new Date(nowTo.getTime() - nowTo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        }

        if (controllerScope.totalItemDestructionWorkListList.length > 0) {
            if (requestEndFromDate !== undefined && requestEndToDate !== undefined && requestEndFromDate !== null && requestEndToDate !== null) {
                for (let i = 0; i < controllerScope.totalItemDestructionWorkListList.length; i++) {
                    if (requestEndFromDate <= new Date(controllerScope.totalItemDestructionWorkListList[i].RequestedDate).toISOString().substr(0, 10)
                        && requestEndToDate >= new Date(controllerScope.totalItemDestructionWorkListList[i].RequestedDate).toISOString().substr(0, 10)) {
                        controllerScope.tempList.push(controllerScope.totalItemDestructionWorkListList[i]);
                    }
                }
            }
        }

        if (requestEndFromDate !== undefined && requestEndToDate !== undefined && requestEndFromDate !== null && requestEndToDate !== null) {
            if ((controllerScope.search.RequestNo !== undefined && controllerScope.search.RequestNo !== null) ||
                (controllerScope.search.BranchId !== undefined && controllerScope.search.BranchId !== null) ||
                (controllerScope.search.SupplierId !== undefined && controllerScope.search.SupplierId !== null) ||
                (controllerScope.search.CauseId !== undefined && controllerScope.search.CauseId !== null)) {

                controllerScope.itemDestructionWorkListCollection = this.filterFilter((controllerScope.tempList), controllerScope.search);
            }
            else
                controllerScope.itemDestructionWorkListCollection = controllerScope.tempList;
        }
        else {
            controllerScope.itemDestructionWorkListCollection = this.filterFilter((controllerScope.totalItemDestructionWorkListList), controllerScope.search);
        }

        if (controllerScope.itemDestructionWorkListCollection.length === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
        }
        else {
            let that = this;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.itemDestructionWorkListCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.itemDestructionWorkListCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
        controllerScope.tempList = [];
        controllerScope.requestDate = [];
        controllerRootScope.isLoading = false;
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.ItemDestructionService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This function used for get supplier list. -An
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let promise = this.ItemDestructionService.getSupplierList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push({ Id: result[i].Id, Name: result[i].NameEn });
                }
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This function used for open request date from picker date. -An
    private openRequestDateFromPickerDate() {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndFromRequestDateOpened = true;
    }

    //This funcion used for open request date to picker date. -An
    private openRequestDateToPickerDate() {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndToRequestDateOpened = true;
    }

    //This fucniton used for get item destruction work list. -An
    private getItemDestructionWorkList() {
        let controllerScope = this.$scope;
        this.$scope.errorMessageDisplayForBlankList = false;
        let controllerRootScope = this.$rootScope;
        controllerScope.itemDestructionWorkListCollection = [];
        let itemDestruction = controllerScope.itemDestructionWorkListCollection;
        //To get branch list
        let promise = this.ItemDestructionService.getItemDestructionRequest();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    itemDestruction.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = itemDestruction.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.itemDestructionWorkListCollection.length;
                controllerScope.totalItemDestructionWorkListList = controllerScope.itemDestructionWorkListCollection;
            }
            else
                this.$scope.errorMessageDisplayForBlankList = true;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    //This funciton used for edit item destruction work list. -An
    private editItemDestructionWorkList(destructionId) {
        this.$location.path("/ItemDestructionDetails/" + destructionId);
    }

}

app.controller(ItemDestructionRequestWorkListController.controllerId, ['$scope', '$log', '$rootScope', 'ItemDestructionService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', ($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal) => {
    return new ItemDestructionRequestWorkListController($scope, $log, $rootScope, ItemDestructionService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal);
}]);
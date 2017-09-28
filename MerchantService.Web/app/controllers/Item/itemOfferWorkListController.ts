interface IitemOfferWorkListControllerScope extends ng.IScope {
    branchList: any;
    statusList: any;
    errorMessageDisplayForBlankList: boolean;
    totalCollectionForItemOffer: any;
    totalRecordsCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    isOfferRequstGrid: boolean;
    totalItems: number;
    searchEvent: Function;
    search: any;
    viewItemOffer: Function;
    openStartDatePickerDate: Function;
    openEndDatePickerDate: Function;
    isStartPickerDateOpened: boolean;
    isEndPickerDateOpened: boolean;
    startTime: any;
    endTime: any;
    SearchStartDate: any;
    SearchEndDate: any;
    SearchStartTime: any;
    SerachEndTime: any;
    tempList: any;
    noItemFound: any;
}

interface IitemOfferWorkListController {

}

class ItemOfferWorkListController implements IitemOfferWorkListController {
    static controllerId = "itemOfferWorkListController";
    constructor(private $scope: IitemOfferWorkListControllerScope, private $log: ng.ILogService, public $rootScope, private itemOfferService: ItemOfferService, public apiPath, public ngToast, public authenticationPath, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.tempList = [];
        this.$scope.branchList = [];
        this.$scope.statusList = [];
        this.$scope.totalCollectionForItemOffer = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.totalItems = 0;
        this.$scope.searchEvent = () => this.searchEvent();
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.isOfferRequstGrid = false;
        this.$scope.viewItemOffer = (id) => this.viewItemOffer(id);
        this.$scope.search = [];
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.openStartDatePickerDate = (event) => this.openStartDatePickerDate(event);
        this.$scope.openEndDatePickerDate = (event) => this.openEndDatePickerDate(event);
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.noItemFound = stringConstants.noItemFound;


        let itemOfferWorkList = this.$scope.$watch("currentPage + itemsPerPage", () => {
            this.$scope.totalCollectionForItemOffer = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollectionForItemOffer = this.$scope.totalRecordsCollection.slice(begin, end);
        });

        this.initialization();
    }

    private initialization() {
        this.getBranchList();
        //this.getStatusList();
        this.getItemOfferWorkList();
    }

    //this function redirect to view item offer page. -An
    private viewItemOffer(id) {
        this.$location.path("/ItemOfferDetails/" + id);
    }

    //this funciton used for get branch list -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.itemOfferService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
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

    //this method used for get status list. -An
    private getStatusList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.itemOfferService.getStatusList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.statusList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
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

    //this method used for get item offer list. -An
    private getItemOfferWorkList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalRecordsCollection = [];
        let itemRecords = controllerScope.totalRecordsCollection;
        controllerScope.errorMessageDisplayForBlankList = false;
        //To get branch list
        let promise = this.itemOfferService.getItemOfferWorkList();
        promise.then((result) => {
            if (result.length !== 0) {
                controllerScope.isOfferRequstGrid = true;
                for (let i = 0; i < result.length; i++) {
                    itemRecords.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollectionForItemOffer = itemRecords.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.totalRecordsCollection.length;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isOfferRequstGrid = false;
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

    //This funciton used for search funcitonality in main item grid. -An
    private searchEvent() {
        let controllerScope = this.$scope;
        let that = this;
        this.$scope.tempList = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        let startDate = controllerScope.SearchStartDate;
        let endDate = controllerScope.SearchEndDate;

        if (controllerScope.SearchStartDate !== undefined && controllerScope.SearchStartDate !== null && controllerScope.SearchStartDate !== "") {
            startDate = new Date(controllerScope.SearchStartDate.getFullYear(), controllerScope.SearchStartDate.getMonth(), controllerScope.SearchStartDate.getDate()).getTime();
        }
        if (controllerScope.SearchEndDate !== undefined && controllerScope.SearchEndDate !== null && controllerScope.SearchEndDate !== "") {
            endDate = new Date(controllerScope.SearchEndDate.getFullYear(), controllerScope.SearchEndDate.getMonth(), controllerScope.SearchEndDate.getDate()).getTime();
        }

        //for (let i = 0; i < controllerScope.totalRecordsCollection.length; i++) {
        //    let startDateTime = new Date(controllerScope.totalRecordsCollection[i].StartDateTime);
        //    let endDateTime = new Date(controllerScope.totalRecordsCollection[i].EndDateTime);
        //    controllerScope.totalRecordsCollection[i].StartDateTime = startDateTime;
        //    controllerScope.totalRecordsCollection[i].EndDateTime = endDateTime;
        //}

        if (controllerScope.totalRecordsCollection.length > 0) {
            if (startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null && startDate !== "" && endDate !== "") {
                for (let i = 0; i < controllerScope.totalRecordsCollection.length; i++) {
                    let sDate = new Date(controllerScope.totalRecordsCollection[i].StartDate);
                    let eDate = new Date(controllerScope.totalRecordsCollection[i].EndDate);
                    if (startDate <= new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime() && endDate >= new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate()).getTime()) {
                        controllerScope.tempList.push(controllerScope.totalRecordsCollection[i]);
                    }
                }
            }
        }

        let searchList = this.filterFilter((startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null && startDate !== "" && endDate !== "" ? controllerScope.tempList : controllerScope.totalRecordsCollection), controllerScope.search);

        /* change pagination with $scope.filtered */
        if (searchList === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollectionForItemOffer = [];
            controllerScope.isOfferRequstGrid = false;
        }
        else {
            controllerScope.isOfferRequstGrid = true;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollectionForItemOffer = searchList.slice(begin, end);
            controllerScope.totalItems = searchList.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
        controllerScope.SearchStartDate = '';
        controllerScope.SearchEndDate = '';
    }

    //this method used for Start Date Picker -An
    private openStartDatePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    }

    //this method used for end date Picker -An
    private openEndDatePickerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    }
}

app.controller(ItemOfferWorkListController.controllerId, ['$scope', '$log', '$rootScope', 'itemOfferService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) => {
    return new ItemOfferWorkListController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
}]);

interface IBillSearchControllerScope extends ng.IScope {
    isStartPickerDateOpened: boolean;
    isEndPickerDateOpened: boolean;
    openStartDatePickerDate: Function;
    openEndDatePickerDate: Function;
    searchList: any;
    searchForDateAmount: any;
    branchList: any;
    errorMessageDisplay: boolean;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    totalCollection: any;
    billSearchCollection: any;
    clickOnsearchButton: Function;
    search: any;
    templist: any;
    billTotalCollection: any;
    noItemFound: any;
}

interface IBillSearchContoller {

}

class BillSearchContoller implements IBillSearchContoller {
    static controllerId = "BillSearchContoller";
    constructor(private $scope: IBillSearchControllerScope, private $log: ng.ILogService, public $rootScope, private ReturnBillService: ReturnBillService, public ngToast, public $location, public filterFilter, public $routeParams, public apiPath, public $modal, public id) {
        this.$scope.openStartDatePickerDate = (event) => this.openStartDatePickerDate(event);
        this.$scope.openEndDatePickerDate = (event) => this.openEndDatePickerDate(event);
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.errorMessageDisplay = false;
        this.$scope.searchList = [];
        this.$scope.clickOnsearchButton = () => this.clickOnsearchButton();
        this.$scope.search = [];
        this.$scope.branchList = [];
        this.$scope.templist = [];
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 8;
        this.$scope.maxSize = 10;
        this.$scope.searchForDateAmount = [];
        this.initialize();

        let itemPage = this.$scope.$watch("currentPage + itemsPerPage", () => {
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.billSearchCollection.slice(begin, end);
        });
    }

    private initialize() {
        this.getbillList();
        this.getBranchList();
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

    //this funciton used for get branch list. -An
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        let promise = this.ReturnBillService.getBranchList();
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

    //this function used for get bill list. -An
    private getbillList() {
        this.$rootScope.isLoading = true;
        this.$scope.errorMessageDisplay = false;
        if (this.id !== undefined && this.id !== null && this.id !== 0) {
            let promise = this.ReturnBillService.getPOSBillListByBranchId(this.id);
            promise.then((result) => {
                this.GetPOSBillList(result);
            }).catch((error) => {
                this.$rootScope.isLoading = false;
                this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }
        else {
            let promise = this.ReturnBillService.getPOSBillList();
            promise.then((result) => {
                this.GetPOSBillList(result);
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

    //This method used for get pos bill list. -An
    private GetPOSBillList(result) {
        this.$scope.billSearchCollection = [];
        let billDetialList = this.$scope.billSearchCollection;
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                billDetialList.push(result[i]);
            }
            this.$scope.billTotalCollection = billDetialList;
            let that = this;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            this.$scope.totalCollection = billDetialList.slice(begin, end);
            /* init pagination with $scope.list */
            this.$scope.totalItems = this.$scope.billSearchCollection.length;
        }
        else {
            this.$scope.errorMessageDisplay = true;
        }
        this.$rootScope.isLoading = false;
    }

    //this function used for click on search button. -An
    private clickOnsearchButton() {
        let controllerScope = this.$scope;
        controllerScope.templist = [];
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;

        let that = this;
        let isNoSearch = false;
        let StartDate;
        if (controllerScope.searchForDateAmount.StartDate !== null && controllerScope.searchForDateAmount.StartDate !== undefined) {
            let startDate = new Date(controllerScope.searchForDateAmount.StartDate);
            startDate.setTime(startDate.getTime() + (330 * 60 * 1000));
            StartDate = startDate.toISOString().substr(0, 10);
        }
        let EndDate;
        if (controllerScope.searchForDateAmount.EndDate !== null && controllerScope.searchForDateAmount.EndDate !== undefined) {
            let endDate = new Date(controllerScope.searchForDateAmount.EndDate);
            endDate.setTime(endDate.getTime() + (330 * 60 * 1000));
            EndDate = endDate.toISOString().substr(0, 10);
        }

        if (controllerScope.billTotalCollection.length > 0) {
            if (controllerScope.searchForDateAmount.FromAmount !== undefined && controllerScope.searchForDateAmount.ToAmount !== undefined &&
                controllerScope.searchForDateAmount.FromAmount !== null && controllerScope.searchForDateAmount.ToAmount !== null) {
                for (let i = 0; i < controllerScope.billTotalCollection.length; i++) {
                    if (controllerScope.billTotalCollection[i].Amount >= controllerScope.searchForDateAmount.FromAmount &&
                        controllerScope.billTotalCollection[i].Amount <= controllerScope.searchForDateAmount.ToAmount) {
                        controllerScope.templist.push(controllerScope.billTotalCollection[i]);
                    }
                }
                if (StartDate !== undefined && EndDate !== undefined && StartDate !== null && EndDate !== null) {
                    let listOfItem = [];
                    for (let i = 0; i < controllerScope.templist.length; i++) {
                        if (new Date(controllerScope.templist[i].BillDate).toISOString().substr(0, 10) >= StartDate && new Date(controllerScope.templist[i].BillDate).toISOString().substr(0, 10) <= EndDate)
                            listOfItem.push(controllerScope.templist[i]);
                    }

                    if (listOfItem.length > 0)
                        controllerScope.templist = listOfItem;
                }
            }
            else if (StartDate !== undefined && EndDate !== undefined && StartDate !== null && EndDate !== null) {
                for (let i = 0; i < controllerScope.billTotalCollection.length; i++) {
                    if (new Date(controllerScope.billTotalCollection[i].BillDate).toISOString().substr(0, 10) >= StartDate && new Date(controllerScope.billTotalCollection[i].BillDate).toISOString().substr(0, 10) <= EndDate)
                        controllerScope.templist.push(controllerScope.billTotalCollection[i]);
                }
            }
        }

        if (controllerScope.templist.length > 0) {//this function used for get data between from and to date and amount. 
            if ((controllerScope.searchList.CustomerNumber !== undefined && controllerScope.searchList.CustomerNumber !== null) ||
                (controllerScope.searchList.BranchId !== undefined && controllerScope.searchList.BranchId !== null))
                controllerScope.billSearchCollection = this.filterFilter((controllerScope.templist), controllerScope.searchList);
            else
                controllerScope.billSearchCollection = controllerScope.templist;
        }
        else {
            if ((controllerScope.searchForDateAmount.FromAmount === undefined || controllerScope.searchForDateAmount.FromAmount === null) &&
                (controllerScope.searchForDateAmount.ToAmount === undefined || controllerScope.searchForDateAmount.ToAmount === null) &&
                (controllerScope.searchForDateAmount.StartDate === undefined || controllerScope.searchForDateAmount.StartDate === null) &&
                (controllerScope.searchForDateAmount.EndDate === undefined || controllerScope.searchForDateAmount.EndDate === null))
                controllerScope.billSearchCollection = this.filterFilter((controllerScope.billTotalCollection), controllerScope.searchList);
            else
                isNoSearch = true;
        }

        if (isNoSearch) {//when between amount and date is not assign then its set true otherwise false
            controllerScope.errorMessageDisplay = true;
            controllerScope.totalCollection = [];

        }
        else {
            /* change pagination with $scope.filtered */
            if (controllerScope.billSearchCollection.length === 0) {
                //check searching and searchList set 0.
                controllerScope.errorMessageDisplay = true;
                controllerScope.totalCollection = [];
            }
            else {
                let begin = ((controllerScope.currentPage - 1) * controllerScope.itemsPerPage),
                    end = begin + controllerScope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.billSearchCollection.slice(begin, end);
                controllerScope.totalItems = controllerScope.billSearchCollection.length;
                controllerScope.errorMessageDisplay = false;
            }
        }
        controllerScope.searchList = [];
        controllerScope.searchForDateAmount = [];
    }

}

app.controller(BillSearchContoller.controllerId, ['$scope', '$log', '$rootScope', 'ReturnBillService', 'ngToast', '$location', 'filterFilter', '$routeParams', 'apiPath', '$modal', 'id', ($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, id) => {
    return new BillSearchContoller($scope, $log, $rootScope, ReturnBillService, ngToast, $location, filterFilter, $routeParams, apiPath, $modal, id);
}]);
var ItemOfferWorkListController = (function () {
    function ItemOfferWorkListController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.itemOfferService = itemOfferService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.$scope.tempList = [];
        this.$scope.branchList = [];
        this.$scope.statusList = [];
        this.$scope.totalCollectionForItemOffer = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.totalItems = 0;
        this.$scope.searchEvent = function () { return _this.searchEvent(); };
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.isOfferRequstGrid = false;
        this.$scope.viewItemOffer = function (id) { return _this.viewItemOffer(id); };
        this.$scope.search = [];
        this.$scope.isStartPickerDateOpened = false;
        this.$scope.isEndPickerDateOpened = false;
        this.$scope.openStartDatePickerDate = function (event) { return _this.openStartDatePickerDate(event); };
        this.$scope.openEndDatePickerDate = function (event) { return _this.openEndDatePickerDate(event); };
        this.$scope.startTime = new Date();
        this.$scope.endTime = new Date();
        this.$scope.noItemFound = stringConstants.noItemFound;
        var itemOfferWorkList = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollectionForItemOffer = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollectionForItemOffer = _this.$scope.totalRecordsCollection.slice(begin, end);
        });
        this.initialization();
    }
    ItemOfferWorkListController.prototype.initialization = function () {
        this.getBranchList();
        //this.getStatusList();
        this.getItemOfferWorkList();
    };
    //this function redirect to view item offer page. -An
    ItemOfferWorkListController.prototype.viewItemOffer = function (id) {
        this.$location.path("/ItemOfferDetails/" + id);
    };
    //this funciton used for get branch list -An
    ItemOfferWorkListController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.itemOfferService.getBranchList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this method used for get status list. -An
    ItemOfferWorkListController.prototype.getStatusList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //To get branch list
        var promise = this.itemOfferService.getStatusList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.statusList.push({ Id: result[i].Id, Name: result[i].Name });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this method used for get item offer list. -An
    ItemOfferWorkListController.prototype.getItemOfferWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalRecordsCollection = [];
        var itemRecords = controllerScope.totalRecordsCollection;
        controllerScope.errorMessageDisplayForBlankList = false;
        //To get branch list
        var promise = this.itemOfferService.getItemOfferWorkList();
        promise.then(function (result) {
            if (result.length !== 0) {
                controllerScope.isOfferRequstGrid = true;
                for (var i = 0; i < result.length; i++) {
                    itemRecords.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollectionForItemOffer = itemRecords.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.totalRecordsCollection.length;
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isOfferRequstGrid = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This funciton used for search funcitonality in main item grid. -An
    ItemOfferWorkListController.prototype.searchEvent = function () {
        var controllerScope = this.$scope;
        var that = this;
        this.$scope.tempList = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var startDate = controllerScope.SearchStartDate;
        var endDate = controllerScope.SearchEndDate;
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
                for (var i = 0; i < controllerScope.totalRecordsCollection.length; i++) {
                    var sDate = new Date(controllerScope.totalRecordsCollection[i].StartDate);
                    var eDate = new Date(controllerScope.totalRecordsCollection[i].EndDate);
                    if (startDate <= new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime() && endDate >= new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate()).getTime()) {
                        controllerScope.tempList.push(controllerScope.totalRecordsCollection[i]);
                    }
                }
            }
        }
        var searchList = this.filterFilter((startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null && startDate !== "" && endDate !== "" ? controllerScope.tempList : controllerScope.totalRecordsCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (searchList === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollectionForItemOffer = [];
            controllerScope.isOfferRequstGrid = false;
        }
        else {
            controllerScope.isOfferRequstGrid = true;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollectionForItemOffer = searchList.slice(begin, end);
            controllerScope.totalItems = searchList.length;
            controllerScope.errorMessageDisplayForBlankList = false;
        }
        controllerScope.search = [];
        controllerScope.SearchStartDate = '';
        controllerScope.SearchEndDate = '';
    };
    //this method used for Start Date Picker -An
    ItemOfferWorkListController.prototype.openStartDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isStartPickerDateOpened = true;
    };
    //this method used for end date Picker -An
    ItemOfferWorkListController.prototype.openEndDatePickerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isEndPickerDateOpened = true;
    };
    return ItemOfferWorkListController;
}());
ItemOfferWorkListController.controllerId = "itemOfferWorkListController";
app.controller(ItemOfferWorkListController.controllerId, ['$scope', '$log', '$rootScope', 'itemOfferService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        return new ItemOfferWorkListController($scope, $log, $rootScope, itemOfferService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=itemOfferWorkListController.js.map
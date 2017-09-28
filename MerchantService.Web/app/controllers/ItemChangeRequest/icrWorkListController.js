var IcrWorkListController = (function () {
    function IcrWorkListController($scope, $log, icrWorkListService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, $routeParams, $filter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.icrWorkListService = icrWorkListService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$filter = $filter;
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.itemChangedDetails = new Model.ItemChangedDetails();
        this.$scope.getICRWorkList = function () { return _this.getICRWorkList(); };
        this.$scope.icrWorkList = [];
        this.$scope.getICRDetail = function () { return _this.getICRDetail(); };
        this.$scope.viewDetail = function (icr) { return _this.viewDetail(icr); };
        this.$scope.search = [];
        this.$scope.searchICRList = function () { return _this.searchICRList(); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.editICR = function () { return _this.editICR(); };
        this.$scope.approveICR = function () { return _this.approveICR(); };
        this.$scope.returnICR = function () { return _this.returnICR(); };
        this.$scope.rejectICR = function () { return _this.rejectICR(); };
        this.$scope.reviewICR = function () { return _this.reviewICR(); };
        this.$scope.resubmitICRDetail = function () { return _this.resubmitICRDetail(); };
        this.$scope.getCurrentUser = function () { return _this.getCurrentUser(); };
        this.$scope.openRejectICRPopup = function () { return _this.openRejectICRPopup(); };
        this.$scope.closeRejectICRPopup = function () { return _this.closeRejectICRPopup(); };
        this.$scope.openRequestedDateFromPicker = function (event) { return _this.openRequestedDateFromPicker(event); };
        this.$scope.isRequestedDateFromPickerOpened = false;
        this.$scope.dateSearch = [];
        this.$scope.isApproval = false;
        this.$scope.isEditVisible = false;
        this.$scope.isReviewVisible = false;
        this.$scope.userRoleName = "";
        //string constants
        this.$scope.rejectConfirmation = stringConstants.rejectConfirmation;
        this.$scope.rejectConfirm = stringConstants.rejectConfirm;
        this.$scope.noICRFound = stringConstants.noICRFound;
        this.$scope.priceChangeRequest = stringConstants.priceChangeRequest;
        this.$scope.quantityChangeRequest = stringConstants.quantityChangeRequest;
        this.$scope.rejected = stringConstants.rejected;
        this.$scope.openRequestedDateToPicker = function (event) { return _this.openRequestedDateToPicker(event); };
        this.$scope.isRequestedDateToPickerOpened = false;
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.icrTotalCollection = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.entryLimit = 10;
        this.$scope.errorMessage = "";
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.icrWorkList.slice(begin, end);
        });
        this.initialize();
    }
    IcrWorkListController.prototype.initialize = function () {
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getCurrentUser();
        }
        else {
            this.getICRWorkList();
        }
    };
    IcrWorkListController.prototype.getCurrentUser = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.icrWorkListService.getCurrentUserDetail();
        promise.then(function (result) {
            controllerScope.userRoleName = result.rolename;
            _this.getICRDetail();
        }).catch(function (error) {
        });
    };
    //this service used for fetching ICR Work list.-jj
    IcrWorkListController.prototype.getICRWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.icrWorkListService.getICRWorkList();
        promise.then(function (result) {
            if (result.length > 0) {
                controllerScope.icrWorkList = result;
                controllerRootScope.isLoading = false;
                controllerScope.icrTotalCollection = controllerScope.icrWorkList;
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = controllerScope.icrWorkList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.icrWorkList.length;
            }
            else {
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    //used to redirect to ICRDetail page
    IcrWorkListController.prototype.viewDetail = function (icr) {
        this.$location.path("/ICRDetails/" + icr.Id);
    };
    //used to fetch Detail of ICR
    IcrWorkListController.prototype.getICRDetail = function () {
        var id = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //   let currentRole = "PM";
        var promise = this.icrWorkListService.getICRDetail(this.$routeParams.id);
        promise.then(function (result) {
            controllerScope.itemChangedDetails = result;
            if (controllerScope.itemChangedDetails.IsRejected) {
                controllerScope.isApproval = false;
                controllerScope.isEditVisible = false;
                controllerScope.isReviewVisible = false;
            }
            else {
                for (var i = controllerScope.itemChangedDetails.WorkFlowLog.length - 1; i < controllerScope.itemChangedDetails.WorkFlowLog.length; i++) {
                    if (controllerScope.itemChangedDetails.WorkFlowLog[i].NextActivityId !== 3) {
                        if (controllerScope.userRoleName === controllerScope.itemChangedDetails.WorkFlowLog[i].AssignedRole && !controllerScope.itemChangedDetails.WorkFlowLog[i].IsCondition) {
                            //if (controllerScope.itemChangedDetails.WorkFlowLog[i].IsRejected && controllerScope.itemChangedDetails.WorkFlowLog[i].InitiatorRole == controllerScope.userRoleName) {
                            if (controllerScope.itemChangedDetails.IsReturned) {
                                controllerScope.isApproval = false;
                                controllerScope.isEditVisible = true;
                                controllerScope.isReviewVisible = false;
                            }
                            else {
                                if (controllerScope.itemChangedDetails.WorkFlowLog[i].IsReview) {
                                    controllerScope.isApproval = false;
                                    controllerScope.isEditVisible = false;
                                    controllerScope.isReviewVisible = true;
                                }
                                else {
                                    controllerScope.isApproval = true;
                                    controllerScope.isEditVisible = false;
                                    controllerScope.isReviewVisible = false;
                                }
                            }
                        }
                        else if (controllerScope.userRoleName === controllerScope.itemChangedDetails.WorkFlowLog[i].AssignedRole && controllerScope.itemChangedDetails.WorkFlowLog[i].IsCondition) {
                            //else if (controllerScope.itemChangedDetails.WorkFlowLog[i].IsReview) {
                            controllerScope.isApproval = false;
                            controllerScope.isEditVisible = false;
                            controllerScope.isReviewVisible = true;
                        }
                    }
                    else {
                        controllerScope.isApproval = false;
                        controllerScope.isEditVisible = false;
                        controllerScope.isReviewVisible = false;
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    //used to resubmit Detail of ICR - jj
    IcrWorkListController.prototype.resubmitICRDetail = function () {
        var _this = this;
        var id = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //   let currentRole = "PM";
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        var promise = this.icrWorkListService.resubmitICR(this.$routeParams.id, controllerScope.itemChangedDetails.Comment);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.ICRResubmitted);
                    _this.$location.path("/ICRWorkList");
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.$location.path("/ICRWorkList");
                    }
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.ICRFailedResubmit
                    });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ICRFailedResubmit
            });
            controllerRootScope.isLoading = false;
        });
    };
    //used to search ICR Worklist
    IcrWorkListController.prototype.searchICRList = function () {
        var controllerScope = this.$scope;
        var count = 0;
        var InitiationDateFrom;
        var InitiationDateTo;
        if (controllerScope.dateSearch.InitiationDateFrom !== null && controllerScope.dateSearch.InitiationDateFrom !== undefined) {
            // let IssueDateFrom = new Date(controllerScope.dateSearch.IssueDateFrom).toISOString().substr(0, 10);
            InitiationDateFrom = this.$filter('date')(controllerScope.dateSearch.InitiationDateFrom, 'yyyy/MM/dd');
            //   alert(InitiationDateFrom);
            count = 1;
        }
        if (controllerScope.dateSearch.InitiationDateTo !== null && controllerScope.dateSearch.InitiationDateTo !== undefined) {
            //  let DueDateFrom = new Date(controllerScope.dateSearch.DueDateFrom).toISOString().substr(0, 10);
            InitiationDateTo = this.$filter('date')(controllerScope.dateSearch.InitiationDateTo, 'yyyy/MM/dd');
            // alert(InitiationDateTo);
            count = 1;
        }
        var tempList = [];
        controllerScope.icrWorkList = this.filterFilter(controllerScope.icrTotalCollection, controllerScope.search);
        tempList = controllerScope.icrWorkList;
        controllerScope.icrWorkList = [];
        for (var i = 0; i < tempList.length; i++) {
            var RequestDate = this.$filter('date')(tempList[i].RequestedDate, 'yyyy/MM/dd');
            if (InitiationDateFrom !== null && InitiationDateFrom !== undefined && InitiationDateTo !== null && InitiationDateTo !== undefined) {
                if (RequestDate >= InitiationDateFrom && RequestDate <= InitiationDateTo) {
                    controllerScope.icrWorkList.push(tempList[i]);
                }
            }
            else {
                if ((RequestDate >= InitiationDateFrom) || (RequestDate <= InitiationDateTo)) {
                    controllerScope.icrWorkList.push(tempList[i]);
                }
            }
        }
        if (count === 0) {
            controllerScope.icrWorkList = tempList;
        }
        var that = this;
        var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
        controllerScope.totalCollection = controllerScope.icrWorkList.slice(begin, end);
        /* init pagination with $scope.list */
        controllerScope.totalItems = controllerScope.icrWorkList.length;
        controllerScope.search = [];
        controllerScope.dateSearch = [];
    };
    //used to return to ICRWorkList page
    IcrWorkListController.prototype.cancel = function () {
        this.$location.path("/ICRWorkList");
    };
    //used to redirect to edit page
    IcrWorkListController.prototype.editICR = function () {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        //controllerRootScope.icrDetails = controllerScope.itemChangedDetails;
        this.$location.path("/InitiateICR/" + controllerScope.itemChangedDetails.Id);
    };
    //USED TO APPROVE ICR - JJ
    IcrWorkListController.prototype.approveICR = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        var promise = this.icrWorkListService.approveICR(controllerScope.itemChangedDetails.ParentRecordId, controllerScope.itemChangedDetails.Comment, true);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.ICRApprovalSuccessful);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.cancel();
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ICRApprovalFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //USED TO APPROVE ICR - JJ
    IcrWorkListController.prototype.reviewICR = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        var details = controllerScope.itemChangedDetails;
        controllerScope.itemChangedDetails = new Model.ItemChangedDetails();
        controllerScope.itemChangedDetails = details;
        var promise = this.icrWorkListService.reviewICR(controllerScope.itemChangedDetails);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.ICRReviewSuccessful);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.cancel();
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ICRReviewFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //USED TO return ICR - JJ
    IcrWorkListController.prototype.returnICR = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        var promise = this.icrWorkListService.approveICR(controllerScope.itemChangedDetails.ParentRecordId, controllerScope.itemChangedDetails.Comment, false);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.ICRReturnedSuccessful);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.cancel();
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ICRReturnedFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    //USED TO REJECT ICR - JJ
    IcrWorkListController.prototype.rejectICR = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closeRejectICRPopup();
        controllerRootScope.isLoading = true;
        if (controllerScope.itemChangedDetails.Comment === null || controllerScope.itemChangedDetails.Comment === undefined) {
            controllerScope.itemChangedDetails.Comment = ".";
        }
        var promise = this.icrWorkListService.rejectICR(controllerScope.itemChangedDetails.Id, controllerScope.itemChangedDetails.ParentRecordId, controllerScope.itemChangedDetails.Comment);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.ICRRejectedSuccessful);
                    _this.cancel();
                }
                else if (result.status !== undefined && result.status !== null) {
                    if (result.status === stringConstants.alreadyActivityProcessed) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.alreadyActivityDone
                        });
                    }
                    else {
                        _this.ngToast.create({
                            className: 'danger',
                            content: result.status
                        });
                        _this.cancel();
                    }
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.ICRRejectedFailed
            });
            controllerRootScope.isLoading = false;
        });
    };
    // used for opening the RejectICRPopup-jj
    IcrWorkListController.prototype.openRejectICRPopup = function () {
        var controllerScope = this.$scope;
        this.rejectICRPopup = this.$modal.open({
            templateUrl: 'RejectICRPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used for closing  the RejectICRPopup-jj
    IcrWorkListController.prototype.closeRejectICRPopup = function () {
        this.rejectICRPopup.dismiss('cancel');
    };
    // datepicker for search
    IcrWorkListController.prototype.openRequestedDateFromPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateFromPickerOpened = true;
    };
    IcrWorkListController.prototype.openRequestedDateToPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isRequestedDateToPickerOpened = true;
    };
    return IcrWorkListController;
}());
IcrWorkListController.controllerId = "icrWorkListController";
app.controller(IcrWorkListController.controllerId, ['$scope', '$log', 'icrWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', '$routeParams', '$filter', function ($scope, $log, icrWorkListService, ngToast, $rootSoope, apiPath, filterFilter, $modal, $location, $routeParams, $filter) {
        return new IcrWorkListController($scope, $log, icrWorkListService, ngToast, $rootSoope, apiPath, filterFilter, $modal, $location, $routeParams, $filter);
    }]);
//# sourceMappingURL=icrWorkListController.js.map
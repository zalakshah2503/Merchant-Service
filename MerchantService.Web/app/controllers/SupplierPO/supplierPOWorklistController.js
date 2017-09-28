/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/supplierpo/supplierpoworklistservice.ts" />
var SupplierPOWorkListController = (function () {
    function SupplierPOWorkListController($scope, $log, supplierPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $routeParams, printer, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.supplierPOWorkListService = supplierPOWorkListService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$filter = $filter;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.printer = printer;
        this.$modal = $modal;
        this.$scope.getSupplierPOWorkList = function () { return _this.getSupplierPOWorkList(); };
        this.$scope.clickOnOpenRecivingPopup = function () { return _this.clickOnOpenRecivingPopup(); };
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.searchSupplierPOWorkList = function () { return _this.searchSupplierPOWorkList(); };
        this.$scope.viewDetail = function (id) { return _this.viewDetail(id); };
        this.$scope.getPODetails = function () { return _this.getPODetails(); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.roleName = "";
        this.$scope.userId = 0;
        this.$scope.approveSPO = function (Comment, RecordId) { return _this.approveSPO(Comment, RecordId); };
        this.$scope.reviewSPO = function (Comment, RecordId) { return _this.reviewSPO(Comment, RecordId); };
        this.$scope.resubmitSPO = function () { return _this.resubmitSPO(); };
        this.$scope.rejectSPO = function (Comment, RecordId) { return _this.rejectSPO(Comment, RecordId); };
        this.$scope.cancelSPO = function (Comment, RecordId) { return _this.cancelSPO(Comment, RecordId); };
        this.$scope.approveCancelSPO = function (Status) { return _this.approveCancelSPO(Status); };
        this.$scope.edit = function (id) { return _this.edit(id); };
        this.$scope.receiveSPORedirect = function (id) { return _this.receiveSPORedirect(id); };
        this.$scope.send = function (Comment, RecordId) { return _this.send(Comment, RecordId); };
        this.$scope.getSPOBill = function (id) { return _this.getSPOBill(id); };
        this.$scope.verifyBill = function (id) { return _this.verifyBill(id); };
        this.$scope.verifySPO = function (id) { return _this.verifySPO(id); };
        this.$scope.noPOFound = stringConstants.noPOFound;
        this.$scope.deleteSPO = function (id) { return _this.deleteSPO(id); };
        this.$scope.submitSPO = function (id, comment) { return _this.submitSPO(id, comment); };
        this.$scope.poWorkList = [];
        this.$scope.savedSPOList = [];
        this.$scope.isResubmitVisible = false;
        this.$scope.isButtonsVisible = false;
        this.$scope.displayConfirm = false;
        this.$scope.isCancel = false;
        this.$scope.isCanceled = false;
        this.$scope.isEditDisplay = false;
        this.$scope.isReceiveVisible = false;
        this.$scope.billList = [];
        this.$scope.isReviewVisible = false;
        this.$scope.supplierList = [];
        this.$scope.branchList = [];
        this.$scope.poItemList = [];
        this.$scope.spoWorkLog = [];
        this.$scope.comment = [];
        this.$scope.branchModel = [];
        this.$scope.openPODeletePopup = function () { return _this.openPODeletePopup(); };
        this.$scope.closePODeletePopup = function () { return _this.closePODeletePopup(); };
        //string constants
        this.$scope.receivePODetails = stringConstants.receivePODetails;
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.deleteConfirmation = stringConstants.deleteConfirmation;
        this.$scope.deleteConfirmMessage = stringConstants.deleteConfirmMessage;
        //pagination
        this.$scope.totalCollection = [];
        this.$scope.supplierPOList = [];
        this.$scope.search = [];
        this.$scope.dateSearch = [];
        this.$scope.supplierPOTotalCollection = [];
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 15;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 15;
        this.$scope.errorMessage = "";
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.supplierList.slice(begin, end);
            //i think the last line shud be like this
        });
        // datepicker
        this.$scope.isIssueDateFromPickerOpened = false;
        this.$scope.openIssueDateFromPicker = function (event) { return _this.openIssueDateFromPicker(event); };
        this.$scope.isIssueDateToPickerOpened = false;
        this.$scope.openIssueDateToPicker = function (event) { return _this.openIssueDateToPicker(event); };
        this.$scope.isDueDateFromPickerOpened = false;
        this.$scope.openDueDateFromPicker = function (event) { return _this.openDueDateFromPicker(event); };
        this.$scope.isDueDateToPickerOpened = false;
        this.$scope.openDueDateToPicker = function (event) { return _this.openDueDateToPicker(event); };
        this.$scope.recevingPurchaseOrderList = [];
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.isDisplayRecevingSPOButton = false;
        this.$scope.cancelReceivedPurchaseOrderDetail = function () { return _this.cancelReceivedPurchaseOrderDetail(); };
        this.initialize();
    }
    SupplierPOWorkListController.prototype.initialize = function () {
        this.getSupplierList();
        this.getBranchList();
        this.getReceivingPurchaseOrders();
    };
    SupplierPOWorkListController.prototype.getReceivingPurchaseOrders = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (this.$routeParams.id !== undefined && this.$routeParams.id !== null) {
            var promise = this.supplierPOWorkListService.getRecevingPurchaseOrderById(this.$routeParams.id);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    if (result.RecevingPurchaseOrderList.length > 0) {
                        for (var i = 0; i < result.RecevingPurchaseOrderList.length; i++) {
                            _this.$scope.recevingPurchaseOrderList.push(result.RecevingPurchaseOrderList[i]);
                        }
                        _this.$scope.errorMessageDisplayForBlankList = false;
                    }
                    else
                        _this.$scope.errorMessageDisplayForBlankList = true;
                    if (result.IsReceived)
                        _this.$scope.isDisplayRecevingSPOButton = true;
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                controllerRootScope.isLoading = false;
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
    };
    // used to fetch supplier purchase order worklist - jj
    SupplierPOWorkListController.prototype.getSupplierPOWorkList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.supplierPOList = [];
        var supplierPOCollection = controllerScope.supplierPOList;
        var promise = this.supplierPOWorkListService.getSupplierPOWorkList();
        promise.then(function (result) {
            var status = "";
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < controllerScope.supplierList.length; j++) {
                        if (controllerScope.supplierList[j].Id === result[i].SupplierId) {
                            result[i].DueDate = new Date(result[i].DueDate).toISOString().substr(0, 10);
                            result[i].IssueDate = new Date(result[i].IssueDate).toISOString().substr(0, 10);
                            if (result[i].IsSubmitted) {
                                supplierPOCollection.push({
                                    Id: result[i].SPOId,
                                    PurchaseOrderNumber: result[i].PurchaseOrderNumber, DueDate: result[i].DueDate, IssueDate: result[i].IssueDate,
                                    SupplierName: controllerScope.supplierList[j].NameEn, SupplierCode: controllerScope.supplierList[j].Code,
                                    BranchName: result[i].BranchName, BranchId: result[i].BranchId, Status: status, WorkFlowLog: result[i].WorkFlowLog,
                                    IsApproved: result[i].IsApproved, IsConfirmed: result[i].IsConfirmed, IsRejected: result[i].IsRejected,
                                    IsCanceled: result[i].IsCanceled, IsCancelApproved: result[i].IsCancelApproved, IsPartiallyReceived: result[i].IsPartiallyReceived,
                                    Action: result[i].Action, IsSubmitted: result[i].IsSubmitted, UserId: result[i].UserId, IsAutomaticSpo: result[i].IsAutomaticSpo
                                });
                            }
                            else {
                                if (controllerScope.userId === result[i].UserId) {
                                    controllerScope.savedSPOList.push({
                                        Id: result[i].SPOId,
                                        PurchaseOrderNumber: result[i].PurchaseOrderNumber, DueDate: result[i].DueDate, IssueDate: result[i].IssueDate,
                                        SupplierName: controllerScope.supplierList[j].NameEn, SupplierCode: controllerScope.supplierList[j].Code,
                                        BranchName: result[i].BranchName, BranchId: result[i].BranchId, Status: status, WorkFlowLog: result[i].WorkFlowLog,
                                        IsApproved: result[i].IsApproved, IsConfirmed: result[i].IsConfirmed, IsRejected: result[i].IsRejected,
                                        IsCanceled: result[i].IsCanceled, IsCancelApproved: result[i].IsCancelApproved, IsPartiallyReceived: result[i].IsPartiallyReceived,
                                        Action: result[i].Action, IsSubmitted: result[i].IsSubmitted, UserId: result[i].UserId, IsAutomaticSpo: result[i].IsAutomaticSpo
                                    });
                                }
                            }
                        }
                    }
                    controllerScope.supplierPOTotalCollection = supplierPOCollection;
                    controllerScope.totalCollection = supplierPOCollection;
                    controllerScope.totalItems = controllerScope.supplierPOList.length;
                }
            }
            controllerRootScope.isLoading = false;
            ;
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
        });
    };
    //used to receiving purchase order popup.
    SupplierPOWorkListController.prototype.clickOnOpenRecivingPopup = function () {
        this.recevingPurchaseOrderPopup = this.$modal.open({
            templateUrl: 'recevingPurchaseOrder',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            scope: this.$scope,
        });
    };
    SupplierPOWorkListController.prototype.cancelReceivedPurchaseOrderDetail = function () {
        this.recevingPurchaseOrderPopup.dismiss("cancel");
    };
    //used to fetch supplier list - jj
    SupplierPOWorkListController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        var promise = this.supplierPOWorkListService.getSupplierList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.supplierList.push(result[i]);
                }
            }
            rootScope.isLoading = false;
            _this.getUserDetail();
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            rootScope.isLoading = false;
        });
    };
    //used to get branchlist - jj
    SupplierPOWorkListController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        var promise = this.supplierPOWorkListService.getBranchList();
        promise.then(function (result) {
            if (result.length === 0) {
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ Id: result[i].Id, Name: result[i].Name });
                }
            }
            rootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            rootScope.isLoading = false;
        });
    };
    //version 2
    //supplier purchase order worklist search panel. - jj
    SupplierPOWorkListController.prototype.searchSupplierPOWorkList = function () {
        var controllerScope;
        controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        var DueDateFrom;
        var DueDateTo;
        var IssueDateFrom;
        var IssueDateTo;
        var count = 0;
        if (controllerScope.dateSearch.IssueDateFrom !== null && controllerScope.dateSearch.IssueDateFrom !== undefined) {
            IssueDateFrom = this.$filter('date')(controllerScope.dateSearch.IssueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateFrom !== null && controllerScope.dateSearch.DueDateFrom !== undefined) {
            DueDateFrom = this.$filter('date')(controllerScope.dateSearch.DueDateFrom, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.IssueDateTo !== null && controllerScope.dateSearch.IssueDateTo !== undefined) {
            IssueDateTo = this.$filter('date')(controllerScope.dateSearch.IssueDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        if (controllerScope.dateSearch.DueDateTo !== null && controllerScope.dateSearch.DueDateTo !== undefined) {
            DueDateTo = this.$filter('date')(controllerScope.dateSearch.DueDateTo, 'yyyy/MM/dd');
            count = 1;
        }
        controllerScope.supplierPOList = this.filterFilter((controllerScope.supplierPOTotalCollection), controllerScope.search);
        var tempList = [];
        tempList = controllerScope.supplierPOList;
        controllerScope.supplierPOList = [];
        if (tempList.length === 0) {
            controllerScope.totalCollection = [];
        }
        else {
            for (var i = 0; i < tempList.length; i++) {
                var DueDate = this.$filter('date')(tempList[i].DueDate, 'yyyy/MM/dd');
                var IssueDate = this.$filter('date')(tempList[i].IssueDate, 'yyyy/MM/dd');
                if (DueDateFrom !== null && DueDateFrom !== undefined && DueDateTo !== null && DueDateTo !== undefined) {
                    if (DueDate >= DueDateFrom && DueDate <= (DueDateTo)) {
                        controllerScope.supplierPOList.push(tempList[i]);
                    }
                }
                else {
                    if ((DueDate >= (DueDateFrom)) || (DueDate <= DueDateTo) || (IssueDate >= IssueDateFrom) || (IssueDate <= IssueDateTo)) {
                        controllerScope.supplierPOList.push(tempList[i]);
                    }
                }
            }
            if (count === 0) {
                controllerScope.supplierPOList = tempList;
            }
            var secondList = [];
            secondList = controllerScope.supplierPOList;
            controllerScope.supplierPOList = [];
            for (var k = 0; k < secondList.length; k++) {
                var DueDate = this.$filter('date')(secondList[k].DueDate, 'yyyy/MM/dd');
                var IssueDate = this.$filter('date')(secondList[k].IssueDate, 'yyyy/MM/dd');
                if (secondList.length !== 0) {
                    if (IssueDateTo !== null && IssueDateFrom !== null && IssueDateTo !== undefined && IssueDateFrom !== undefined) {
                        if (IssueDate >= (IssueDateFrom) && IssueDate <= (IssueDateTo)) {
                            controllerScope.supplierPOList.push(secondList[k]);
                        }
                    }
                    else {
                        if ((DueDate >= DueDateFrom) || (DueDate <= DueDateTo) || (IssueDate >= IssueDateFrom) || (IssueDate <= IssueDateTo)) {
                            controllerScope.supplierPOList.push(secondList[k]);
                        }
                    }
                }
            }
            if (count === 0) {
                controllerScope.supplierPOList = secondList;
            }
            //used to resolve pagination
            controllerScope.totalCollection = controllerScope.supplierPOList;
        }
        controllerScope.search = [];
        controllerScope.dateSearch = [];
    };
    //open datepicker
    SupplierPOWorkListController.prototype.openIssueDateFromPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateFromPickerOpened = true;
    };
    SupplierPOWorkListController.prototype.openIssueDateToPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isIssueDateToPickerOpened = true;
    };
    SupplierPOWorkListController.prototype.openDueDateToPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateToPickerOpened = true;
    };
    SupplierPOWorkListController.prototype.openDueDateFromPicker = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isDueDateFromPickerOpened = true;
    };
    // used to redirect to Details page
    SupplierPOWorkListController.prototype.viewDetail = function (spoWorkList) {
        var controllerScope = this.$scope;
        var x = this;
        var id = spoWorkList.Id;
        x.$location.path("/SupplierPODetails/" + id);
    };
    // used to check whether current user is the initiator of the po - jj
    SupplierPOWorkListController.prototype.getUserDetail = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var roortScope = this.$rootScope;
        roortScope.isLoading = true;
        var display = "";
        var promise = this.supplierPOWorkListService.getCurrentUserDetail();
        promise.then(function (result) {
            controllerScope.userId = result.userId;
            controllerScope.roleName = result.rolename;
            if (_this.$routeParams.id !== null && _this.$routeParams.id !== undefined && _this.$routeParams.id !== "") {
                _this.getPODetails();
            }
            else {
                _this.getSupplierPOWorkList();
            }
            roortScope.isLoading = false;
        }).catch(function (error) {
            if (error.status !== 400) {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to get the details of particular purchase order - jj
    SupplierPOWorkListController.prototype.getPODetails = function () {
        var _this = this;
        var poId = this.$routeParams.id;
        // let scope = this.$scope;
        var fetchBill = false;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierPOWorkListService.getSPO(poId);
        promise.then(function (result) {
            controllerScope.isButtonsVisible = true;
            controllerScope.poDetail = result;
            controllerScope.poDetail.IssueDate = _this.$filter('date')(controllerScope.poDetail.IssueDate, 'dd-MM-yyyy');
            controllerScope.poDetail.DueDate = _this.$filter('date')(controllerScope.poDetail.DueDate, 'dd-MM-yyyy');
            for (var i = 0; i < controllerScope.poDetail.SPOBranch.length; i++) {
                controllerScope.branchModel.push({ Id: controllerScope.poDetail.SPOBranch[i].Id });
            }
            controllerRootScope.RecordId = controllerScope.poDetail.ParentRecordId;
            controllerScope.poDetail.LastLog.CreatedDateTime = new Date(controllerScope.poDetail.LastLog.CreatedDateTime).toISOString().substr(0, 10);
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.IsRejected === false && !controllerScope.poDetail.IsApproved && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                if (controllerScope.poDetail.LastLog.WorkFlowDetail.IsReview || controllerScope.poDetail.LastLog.WorkFlowDetail.IsCondition) {
                    controllerScope.isReviewVisible = true;
                    controllerScope.displayConfirm = false;
                }
                else {
                    if (!controllerScope.poDetail.LastLog.WorkFlowDetail.IsRejectPanel) {
                        controllerScope.isReviewVisible = false;
                        controllerScope.displayConfirm = true;
                    }
                }
            }
            else {
                controllerScope.displayConfirm = false;
            }
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.IsCanceled === true && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                controllerScope.isCanceled = true;
            }
            else {
                controllerScope.isCanceled = false;
            }
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.IsRejected === true && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                controllerScope.isCancel = true;
            }
            else {
                controllerScope.isCancel = false;
            }
            if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && !controllerScope.poDetail.IsSend && controllerScope.poDetail.IsCancelApproved === false && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                controllerScope.isEditDisplay = true;
            }
            else {
                controllerScope.isEditDisplay = false;
            }
            if (controllerScope.poDetail.IsSend === true && !controllerScope.poDetail.IsReceived) {
                controllerScope.isReceiveVisible = true;
            }
            else {
                controllerScope.isReceiveVisible = false;
                if (!controllerScope.poDetail.IsVerified && controllerScope.poDetail.IsReceived) {
                    fetchBill = true;
                }
            }
            if (!controllerScope.poDetail.IsCancelApproved && !controllerScope.poDetail.IsApproved && (controllerScope.poDetail.IsRejected || controllerScope.poDetail.LastLog.WorkFlowDetail.IsRejectPanel) && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                if (controllerScope.roleName === controllerScope.poDetail.LastLog.WorkFlowDetail.AssignedRole.RoleName && controllerScope.poDetail.LastLog.WorkFlowDetail.NextActivityId !== 3) {
                    controllerScope.isResubmitVisible = true;
                }
            }
            else {
                controllerScope.isResubmitVisible = false;
            }
            if (fetchBill && controllerRootScope.merchatSettings.IsAllowToVerifySupplierPurchaseOrder) {
                _this.getSPOBill(_this.$routeParams.id);
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    //used to approve spo - jj
    SupplierPOWorkListController.prototype.approveSPO = function (Comment, RecordId) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.approveSPO(Comment, rootScope.RecordId);
        promise.then(function (result) {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                    // window.location.assign('#SupplierPOWorkList');
                    _this.ngToast.create(stringConstants.SPOApproved);
                }
                else if (result.status === stringConstants.alreadyActivityProcessed) {
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
                }
                rootScope.isLoading = false;
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SPOApprovedFailed
                });
                rootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SPOApprovedFailed
            });
            rootScope.isLoading = false;
        });
    };
    //used to review spo - jj
    SupplierPOWorkListController.prototype.reviewSPO = function (Comment, RecordId) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.reviewSPO(Comment, rootScope.RecordId);
        promise.then(function (result) {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    rootScope.isLoading = false;
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                    // window.location.assign('#SupplierPOWorkList');
                    _this.ngToast.create(stringConstants.SPOReviewedSuccessfully);
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: result.status
                    });
                    rootScope.isLoading = false;
                }
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SPOReviewedFailed
                });
                rootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SPOReviewedFailed
            });
            rootScope.isLoading = false;
        });
    };
    //used to resubmit spo - jj
    SupplierPOWorkListController.prototype.resubmitSPO = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        var Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.resubmitSPO(controllerScope.poDetail.Id, Comment);
        promise.then(function (result) {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                    _this.ngToast.create(stringConstants.SPOResubmittedSuccessfully);
                }
                else if (result.status === stringConstants.alreadyActivityProcessed) {
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
                }
                rootScope.isLoading = false;
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.spoResubmitFail
                });
                rootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.spoResubmitFail
            });
            rootScope.isLoading = false;
        });
    };
    //used to send spo - jj
    SupplierPOWorkListController.prototype.send = function (Comment, RecordId) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        var totalQuantity = 0;
        var totalOrderCP = 0;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.send(Comment, rootScope.RecordId);
        promise.then(function (result) {
            if (result !== null || result !== undefined) {
                if (result.status === stringConstants.alreadyActivityProcessed) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
                }
                else {
                    if (!result.spoReceipt.EmailSendtoSupplier) {
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.SPONotEmit
                        });
                    }
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                    if (result.spoReceipt.SupplierItem.length > 0) {
                        for (var i = 0; i < result.spoReceipt.SupplierItem.length; i++) {
                            totalOrderCP = totalOrderCP + parseFloat("" + (result.spoReceipt.SupplierItem[i].OrderCostPrice * result.spoReceipt.SupplierItem[i].OrderQuantity));
                            totalQuantity = totalQuantity + parseFloat("" + result.spoReceipt.SupplierItem[i].OrderQuantity);
                        }
                        result.spoReceipt.TotalQuantity = totalQuantity;
                        result.spoReceipt.TotalCostPrice = totalOrderCP;
                        _this.printer.print("/Templates/Supplier/SupplierPurchaseOrderReceipt.html", result.spoReceipt);
                    }
                }
                rootScope.isLoading = false;
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SPONotSend
                });
                rootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.SPONotSend
            });
            rootScope.isLoading = false;
        });
    };
    // used to reject spo - jj
    SupplierPOWorkListController.prototype.rejectSPO = function (Comment, RecordId) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.rejectSPO(Comment, rootScope.RecordId);
        promise.then(function (result) {
            if (result.status === "ok") {
                _this.ngToast.create(stringConstants.SPORejected);
                var x = _this;
                x.$location.path("/SupplierPOWorkList/");
            }
            else if (result.status === stringConstants.alreadyActivityProcessed) {
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
            }
            rootScope.isLoading = false;
            //  window.location.assign('#SupplierPOWorkList');
        }).catch(function (error) {
            rootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to cancel spo
    SupplierPOWorkListController.prototype.cancelSPO = function (Comment, RecordId) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        Comment = controllerScope.comment.Comment;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.cancelSPO(Comment, rootScope.RecordId);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status === "ok") {
                    _this.ngToast.create(stringConstants.SPOCancelled);
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                }
                else if (result.status === stringConstants.alreadyActivityProcessed) {
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
                }
                rootScope.isLoading = false;
            }
            else {
                rootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SPONotCancelled
                });
            }
            //  window.location.assign('#SupplierPOWorkList');
        }).catch(function (error) {
            rootScope.isLoading = false;
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to approve cancelaltion of spo
    SupplierPOWorkListController.prototype.approveCancelSPO = function (Status) {
        var _this = this;
        var controllerScope = this.$scope;
        var rootScope = this.$rootScope;
        rootScope.isLoading = true;
        var Comment = controllerScope.comment.Comment;
        //   let approve = true;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var promise = this.supplierPOWorkListService.approveCancelSPO(Comment, rootScope.RecordId, Status);
        promise.then(function (result) {
            rootScope.isLoading = false;
            if (Status === 1) {
                _this.ngToast.create(stringConstants.SPOCancelledApproved);
            }
            else {
                _this.ngToast.create(stringConstants.SPOCancelledRejected);
            }
            var x = _this;
            x.$location.path("/SupplierPOWorkList/");
            // window.location.assign('#SupplierPOWorkList');
        }).catch(function (error) {
            rootScope.isLoading = false;
            if (Status === 1) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SPOCancelledApprovedFailed
                });
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.SPOCancelledRejectedFailed
                });
            }
        });
    };
    // used to redirect to workflow list page
    SupplierPOWorkListController.prototype.cancel = function () {
        var x = this;
        x.$location.path("/SupplierPOWorkList/");
        // window.location.assign('#SupplierPOWorkList');
    };
    // used to redirect to AddUser page - jj
    SupplierPOWorkListController.prototype.edit = function (id) {
        //  let RootScope = this.$rootScope;
        var x = this;
        x.$location.path("/SupplierPO/" + id);
    };
    //used to redirect to SPOReceiving page
    SupplierPOWorkListController.prototype.receiveSPORedirect = function (id) {
        var x = this;
        x.$location.path("/SupplierPOReceiving/" + id);
    };
    SupplierPOWorkListController.prototype.getSPOBill = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierPOWorkListService.getSPOBill(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.billList = result;
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.BillListNotFetched
                    });
                }
                controllerRootScope.isLoading = false;
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.BillListNotFetched
                });
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.BillListNotFetched
            });
        });
    };
    //Used to verify bill - jj
    SupplierPOWorkListController.prototype.verifyBill = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierPOWorkListService.verifyBill(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.status) {
                    _this.ngToast.create(stringConstants.BillVerified);
                    _this.updateBill(id);
                    controllerRootScope.isLoading = false;
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.verifyBillFail
                    });
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                controllerRootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.verifyBillFail
                });
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.verifyBillFail
            });
        });
    };
    SupplierPOWorkListController.prototype.updateBill = function (id) {
        var controllerScope = this.$scope;
        for (var i = 0; i < controllerScope.billList.length; i++) {
            if (controllerScope.billList[i].BillId === id) {
                controllerScope.billList[i].IsVerified = true;
            }
        }
    };
    //Used to verify spo - jj
    SupplierPOWorkListController.prototype.verifySPO = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var Comment = controllerScope.comment.Comment;
        //   let approve = true;
        if (Comment === null || Comment === undefined) {
            Comment = ".";
        }
        var isAllVerified = true;
        for (var i = 0; i < controllerScope.billList.length; i++) {
            if (!controllerScope.billList[i].IsVerified) {
                isAllVerified = false;
                break;
            }
        }
        if (isAllVerified) {
            var promise = this.supplierPOWorkListService.verifySPO(id, Comment);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    if (result.status) {
                        _this.ngToast.create(stringConstants.SPOVerified);
                        _this.cancel();
                        controllerRootScope.isLoading = false;
                    }
                    else {
                        controllerRootScope.isLoading = false;
                        _this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.verifySPOFail
                        });
                    }
                }
                else {
                    controllerRootScope.isLoading = false;
                    _this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.verifySPOFail
                    });
                }
            }).catch(function (error) {
                controllerRootScope.isLoading = false;
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.verifySPOFail
                });
            });
        }
        else {
            controllerRootScope.isLoading = false;
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.VerifyFirst
            });
        }
    };
    //this function is used to submit an spo of the given id - jj
    SupplierPOWorkListController.prototype.submitSPO = function (id, comment) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        if (comment === null || comment === undefined) {
            comment = ".";
        }
        var promise = this.supplierPOWorkListService.submitSPO(id, comment);
        promise.then(function (result) {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    controllerRootScope.isLoading = false;
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                    // window.location.assign('#SupplierPOWorkList');
                    _this.ngToast.create(stringConstants.spoSubmitSuccess);
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: result.status
                    });
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.spoSubmitFailed
                });
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.spoSubmitFailed
            });
        });
    };
    //this function is used to soft delete an spo of the given id - jj
    SupplierPOWorkListController.prototype.deleteSPO = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        this.closePODeletePopup();
        controllerRootScope.isLoading = true;
        var promise = this.supplierPOWorkListService.deleteSPO(id);
        promise.then(function (result) {
            if (result !== null || result !== undefined) {
                if (result.status === "ok") {
                    controllerRootScope.isLoading = false;
                    var x = _this;
                    x.$location.path("/SupplierPOWorkList/");
                    _this.ngToast.create(stringConstants.spoDeleteSuccess);
                }
                else {
                    _this.ngToast.create({
                        className: 'danger',
                        content: result.status
                    });
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.spoDeleteFailed
                });
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.ngToast.create({
                className: 'danger',
                content: stringConstants.spoDeleteFailed
            });
        });
    };
    //used to open PODeletePopup - jj
    SupplierPOWorkListController.prototype.openPODeletePopup = function () {
        var controllerScope = this.$scope;
        this.poDeletePopup = this.$modal.open({
            templateUrl: 'PODeletePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //used to close PODeletePopup - jj
    SupplierPOWorkListController.prototype.closePODeletePopup = function () {
        this.poDeletePopup.dismiss('cancel');
    };
    return SupplierPOWorkListController;
}());
SupplierPOWorkListController.controllerId = "SupplierPOWorkListController";
app.controller(SupplierPOWorkListController.controllerId, ['$scope', '$log', 'SupplierPOWorkListService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$filter', '$location', '$routeParams', 'printer', '$modal', function ($scope, $log, SupplierPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $routeParams, printer, $modal) {
        return new SupplierPOWorkListController($scope, $log, SupplierPOWorkListService, ngToast, $rootScope, apiPath, filterFilter, $filter, $location, $routeParams, printer, $modal);
    }]);
//# sourceMappingURL=supplierPOWorklistController.js.map
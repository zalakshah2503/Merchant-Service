/// <reference path="../../services/branch/branchdetailservice.ts" />
var BranchController = (function () {
    function BranchController($scope, $location, $log, branchDetailService, ngToast, $rootScope, $routeParams, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.$log = $log;
        this.branchDetailService = branchDetailService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.$modal = $modal;
        this.$rootScope.branchDetail = new Model.BranchDetail();
        this.$scope.addNewBranch = function () { return _this.addNewBranch(); };
        this.$scope.editBranch = function (id) { return _this.editBranch(id); };
        this.$scope.addBranchDetail = function (branchDetail) { return _this.addBranchDetail(branchDetail); };
        this.$scope.deleteBranchDetail = function (id) { return _this.deleteBranchDetail(id); };
        this.$scope.getBranchList = function () { return _this.getBranchList(); };
        this.$scope.getBranchById = function () { return _this.getBranchById(); };
        this.$scope.getCompanyList = function () { return _this.getCompanyList(); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.elementList = [];
        this.$scope.additionalServiceListTemp = [];
        this.$scope.elementListTemp = [];
        this.$scope.additionalGrid = [];
        this.$scope.temp = [];
        this.$scope.additionalServiceName = "";
        this.$scope.emailExists = false;
        this.$scope.nameExists = false;
        this.$scope.codeExists = false;
        this.$scope.phoneExists = false;
        this.$scope.isEdit = false;
        this.$scope.isBranchListEmpty = false;
        this.$scope.isCompanyListEmpty = false;
        this.$scope.isBranchCpoListEmpty = false;
        this.$scope.openDeleteBranchPopup = function (branch) { return _this.openDeleteBranchPopup(branch); };
        this.$scope.closeDeleteBranchPopup = function () { return _this.closeDeleteBranchPopup(); };
        this.$scope.openDeleteFailureBranchPopup = function () { return _this.openDeleteBranchFailurePopup(); };
        this.$scope.closeDeleteFailureBranchPopup = function () { return _this.closeDeleteBranchFailurePopup(); };
        this.$scope.deleteBranchFailureMsg = "";
        //paging
        this.$scope.totalCollection = [];
        this.$scope.branchList = [];
        this.$scope.search = [];
        this.$scope.branchTotalCollection = [];
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.branchNameRequired = stringConstants.branchNameRequired;
        this.$scope.branchNameUnique = stringConstants.branchNameUnique;
        this.$scope.codeUnique = stringConstants.codeUnique;
        this.$scope.addressRequired = stringConstants.addressRequired;
        this.$scope.codeRequired = stringConstants.codeRequired;
        this.$scope.companyRequired = stringConstants.companyRequired;
        this.$scope.emailRequired = stringConstants.emailRequired;
        this.$scope.phoneRequired = stringConstants.phoneRequired;
        this.$scope.emailInvalid = stringConstants.emailInvalid;
        this.$scope.phoneInvalid1 = stringConstants.phoneInvalid1;
        this.$scope.phoneMinLength = stringConstants.phoneMinLength;
        this.$scope.phoneUnique = stringConstants.phoneUnique;
        this.$scope.zipcodeMinlength = stringConstants.zipcodeMinlength;
        this.$scope.emailUnique = stringConstants.emailUnique;
        this.$scope.spoList = stringConstants.spoList;
        this.$scope.branchDetail.spoSelection = 2;
        this.$rootScope.location = "";
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.branchList.slice(begin, end);
        });
        this.$scope.isFocusIn = true;
        this.initialize();
    }
    // on button click it will redirect to AddBranch page
    BranchController.prototype.addNewBranch = function () {
        this.$location.path("/AddBranch");
    };
    //edit user
    //on button click it will redirect to AddBranch page along with id
    BranchController.prototype.editBranch = function (id) {
        var x = this;
        var controllerScope = this.$scope;
        x.$location.path("/AddBranch/" + id);
    };
    BranchController.prototype.initialize = function () {
        //this.getAdditionalService();
        this.getCompanyList();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getBranchById();
        }
    };
    //get branch list
    BranchController.prototype.getBranchList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.branchList = [];
        var branchCollection = controllerScope.branchList;
        var promise = this.branchDetailService.getBranchList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.isBranchListEmpty = true;
            }
            else {
                controllerScope.isBranchListEmpty = false;
                ;
                for (var i = 0; i < result.length; i++) {
                    branchCollection.push({ Id: result[i].Id, NameSl: result[i].NameSl, Name: result[i].Name, Address: result[i].Address, Phone: result[i].Phone, Code: result[i].Code });
                    controllerScope.branchTotalCollection = branchCollection;
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = branchCollection.slice(begin, end);
                    /* init pagination  */
                    controllerScope.totalItems = controllerScope.branchList.length;
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    // get branch detail of given id
    BranchController.prototype.getBranchById = function () {
        var _this = this;
        var branchId = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.branchDetailService.getBranchById(branchId);
        promise.then(function (result) {
            controllerScope.isEdit = true;
            controllerScope.branchDetail = result;
            controllerRootScope.location = result.Address;
            if (result.IsAutomaticIssueSPO === true) {
                controllerScope.branchDetail.spoSelection = 2;
            }
            else {
                controllerScope.branchDetail.spoSelection = 1;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
        });
    };
    //add or edit branch
    BranchController.prototype.addBranchDetail = function (branchDetail) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isAddBranch = (branchDetail.Id === undefined || branchDetail.Id === null) ? true : false;
        if (branchDetail.spoSelection === 1) {
            branchDetail.IsAutomaticIssueSPO = false;
        }
        else {
            branchDetail.IsAutomaticIssueSPO = true;
        }
        var num = 0;
        branchDetail.Address = this.$rootScope.location;
        //add branch
        if (controllerScope.isAddBranch) {
            controllerScope.emailExists = false;
            controllerScope.codeExists = false;
            controllerScope.nameExists = false;
            controllerScope.phoneExists = false;
            var promise = this.branchDetailService.addBranchDetail(branchDetail);
            promise.then(function (result) {
                if (result.Email === "invalid") {
                    controllerScope.emailExists = true;
                }
                else if (result.Name === "invalid") {
                    controllerScope.nameExists = true;
                }
                else if (result.Code === "invalid") {
                    controllerScope.codeExists = true;
                }
                else if (result.Phone === "invalid") {
                    controllerScope.phoneExists = true;
                }
                else {
                    window.location.assign('#ManageBranch');
                    _this.ngToast.create("Branch Added Successfully");
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                if (error.status === 0 || error.status === 500) {
                }
                else {
                    location.replace('/');
                }
                controllerRootScope.isLoading = false;
                _this.$log.error(error);
            });
        }
        else {
            var promise = this.branchDetailService.updateBranchDetail(branchDetail);
            promise.then(function (result) {
                if (result.nameExists) {
                    controllerScope.nameExists = true;
                }
                else if (result.codeExists) {
                    controllerScope.codeExists = true;
                }
                else if (result.emailExixts) {
                    controllerScope.emailExists = true;
                }
                else if (result.phoneExists) {
                    controllerScope.phoneExists = true;
                }
                else {
                    window.location.assign('#ManageBranch');
                    _this.ngToast.create("Branch Updated Successfully");
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                if (error.status === 0 || error.status === 500) {
                }
                else {
                    location.replace('/');
                }
                controllerRootScope.isLoading = false;
                _this.$log.error(error);
            });
        }
    };
    //delete branch profile
    BranchController.prototype.deleteBranchDetail = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.branchDetailService.deleteBranchDetail(id);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.closeDeleteBranchPopup();
            if (result.status === "") {
                window.location.assign('#ManageBranch');
                _this.ngToast.create("Branch Deleted Successfully");
            }
            else {
                controllerScope.deleteBranchFailureMsg = result.status;
                _this.openDeleteBranchFailurePopup();
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // get all company list
    BranchController.prototype.getCompanyList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //    controllerScope.companyList = [];
        var promise = this.branchDetailService.getCompanyList();
        promise.then(function (result) {
            _this.$log.log('get all company list successfully', result.length);
            if (result.length === 0) {
                controllerScope.isCompanyListEmpty = true;
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace('/');
            }
        });
    };
    // open the DeleteBranchPopup
    BranchController.prototype.openDeleteBranchPopup = function (branch) {
        var controllerScope = this.$scope;
        this.deleteBranchPopup = this.$modal.open({
            templateUrl: 'DeleteBranchPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.branchDetail = branch;
    };
    //closing  the DeleteBranchPopup
    BranchController.prototype.closeDeleteBranchPopup = function () {
        this.deleteBranchPopup.dismiss('cancel');
    };
    // open the DeleteBranchFailurePopup
    BranchController.prototype.openDeleteBranchFailurePopup = function () {
        var controllerScope = this.$scope;
        this.deleteBranchFailurePopup = this.$modal.open({
            templateUrl: 'DeleteBranchFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
    };
    //closing  the DeleteBranchFailurePopup
    BranchController.prototype.closeDeleteBranchFailurePopup = function () {
        this.deleteBranchFailurePopup.dismiss('cancel');
    };
    BranchController.prototype.cancel = function () {
        window.location.assign('#ManageBranch');
    };
    return BranchController;
}());
BranchController.controllerId = "BranchController";
app.controller(BranchController.controllerId, ['$scope', '$location', '$log', 'BranchDetailService', 'ngToast', '$rootScope', '$routeParams', '$modal', function ($scope, $location, $log, branchDetailService, ngToast, $rootScope, $routeParams, $modal) {
        return new BranchController($scope, $location, $log, branchDetailService, ngToast, $rootScope, $routeParams, $modal);
    }]);
//# sourceMappingURL=branchController.js.map
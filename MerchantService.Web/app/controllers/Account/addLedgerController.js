var AddLedgerController = (function () {
    function AddLedgerController($scope, $log, ledgersService, ngToast, $rootScope, $location, apiPath, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.ledgersService = ledgersService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$scope.listOfGroup = [];
        this.$scope.listOfLedgers = [];
        this.$scope.saveLedgers = function () { return _this.saveLedgers(); };
        this.$scope.ledgersAccount = new Model.LedgersAccount();
        this.$scope.changeCategory = function () { return _this.changeCategory(); };
        this.$scope.openledgerDate = function (event) { return _this.openledgerDate(event); };
        this.$scope.listOfLedgerGroupType = [];
        this.$scope.changeDetailType = function () { return _this.changeDetailType(); };
        this.$scope.groupNameRequired = stringConstants.selectGroupNameRequired;
        this.$scope.detailTypeRequired = stringConstants.detailTypeRequired;
        this.$scope.ledegerNameRequired = stringConstants.ledegerNameRequired;
        this.$scope.isBalancedSection = false;
        this.$scope.isCheckedSubAccount = false;
        this.$scope.isLedgerDate = false;
        this.$scope.isDisableDetailType = true;
        this.$scope.isDisableParentLedger = true;
        this.$scope.isLedgerValid = false;
        this.$scope.isLedgerNameNotValid = false;
        this.$scope.ledgerNotValid = stringConstants.ledgerNotValid;
        this.$scope.ledgerNameNotValid = stringConstants.notValidLedgerName;
        this.$scope.clickSubAccountCheckBox = function () { return _this.clickSubAccountCheckBox(); };
        this.$scope.isFirstClick = false;
        this.initialization();
    }
    AddLedgerController.prototype.initialization = function () {
        this.GetCategoryType();
        this.GetLedgersDetailWithChild();
    };
    AddLedgerController.prototype.openledgerDate = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isLedgerDate = true;
    };
    AddLedgerController.prototype.clickSubAccountCheckBox = function () {
        if (!this.$scope.ledgersAccount.isSubAccountChecked) {
            this.$scope.ledgersAccount.ParentLedgerId = undefined;
        }
    };
    AddLedgerController.prototype.GetCategoryType = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.ledgersService.getGroupList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.listOfGroup.push(result[i]);
                }
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
    AddLedgerController.prototype.changeDetailType = function () {
        if (this.$scope.ledgersAccount.GroupTypeId !== undefined && this.$scope.ledgersAccount.GroupTypeId !== null) {
            for (var i = 0; i < this.$scope.listOfLedgerGroupType.length; i++) {
                if (this.$scope.listOfLedgerGroupType[i].Id === this.$scope.ledgersAccount.GroupTypeId)
                    this.$scope.ledgersAccount.LedgerName = this.$scope.listOfLedgerGroupType[i].Name;
            }
        }
    };
    AddLedgerController.prototype.GetLedgersDetailWithChild = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var promise = this.ledgersService.getLedgerWithChildLedger();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.listOfLedgers.push(result[i]);
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    AddLedgerController.prototype.changeCategory = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.listOfLedgerGroupType = [];
        controllerScope.ledgersAccount.Description = "";
        controllerScope.ledgersAccount.LedgerName = "";
        controllerScope.ledgersAccount.Balance = 0;
        controllerScope.ledgersAccount.LedgerName = "";
        controllerScope.ledgersAccount.GroupTypeId = undefined;
        controllerScope.ledgersAccount.ParentLedgerId = undefined;
        controllerRootScope.isLoading = true;
        if (this.$scope.ledgersAccount.GroupId !== undefined && this.$scope.ledgersAccount.GroupId !== null) {
            for (var i = 0; i < this.$scope.listOfGroup.length; i++) {
                if (this.$scope.listOfGroup[i].GroupId === this.$scope.ledgersAccount.GroupId) {
                    if (this.$scope.listOfGroup[i].HasBalanced)
                        this.$scope.isBalancedSection = true;
                    else
                        this.$scope.isBalancedSection = false;
                    break;
                }
            }
            this.$scope.isDisableDetailType = false;
            var promise = this.ledgersService.getGroupTypeByGroupId(this.$scope.ledgersAccount.GroupId);
            promise.then(function (result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        controllerScope.listOfLedgerGroupType.push(result[i]);
                    }
                }
                controllerRootScope.isLoading = false;
            }).catch(function (error) {
                controllerRootScope.isLoading = false;
                _this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
    };
    AddLedgerController.prototype.saveLedgers = function () {
        var _this = this;
        if (!this.$scope.isFirstClick) {
            this.$scope.isFirstClick = true;
            var controllerRootScope_1 = this.$rootScope;
            this.$scope.isLedgerValid = false;
            this.$scope.isLedgerNameNotValid = false;
            var promise = this.ledgersService.saveLedgerAccount(this.$scope.ledgersAccount);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    if (result._isResult !== "NotValidGroup") {
                        if (result._isResult !== "NotValidLedgerName") {
                            var controllerScope = _this.$scope;
                            controllerScope.ledgersAccount = new Model.LedgersAccount();
                            _this.ngToast.create(stringConstants.addedLedgeds);
                            if (controllerRootScope_1.isAccountLedger) {
                                _this.$rootScope.$broadcast("closeAccountLedgersPopup", result._isResult);
                            }
                            else {
                                _this.$rootScope.$broadcast("closeLedgersPopup", function () { });
                            }
                        }
                        else
                            _this.$scope.isLedgerNameNotValid = true;
                    }
                    else {
                        _this.$scope.isLedgerValid = true;
                    }
                }
                _this.$rootScope.isLoading = false;
                _this.$scope.isFirstClick = false;
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$scope.isFirstClick = false;
                _this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
    };
    return AddLedgerController;
}());
AddLedgerController.controllerId = "AddLedgerController";
app.controller(AddLedgerController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'apiPath', '$modal', function ($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal) {
        return new AddLedgerController($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal);
    }]);
//# sourceMappingURL=addLedgerController.js.map
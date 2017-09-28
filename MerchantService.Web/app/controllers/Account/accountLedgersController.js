var AccountLedgersController = (function () {
    function AccountLedgersController($scope, $log, ledgersService, ngToast, $rootScope, $location, apiPath, $modal) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.ledgersService = ledgersService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.errorMessageForLedger = true;
        this.$scope.adNewLedgers = function () { return _this.adNewLedgers(); };
        this.$scope.cancleAddLedgerPopup = function () { return _this.cancleAddLedgerPopup(); };
        this.$scope.clickOnEditIcon = function (ledeger) { return _this.clickOnEditIcon(ledeger); };
        this.$scope.clickOnSaveIcon = function (ledeger) { return _this.clickOnSaveIcon(ledeger); };
        this.$scope.clickOnCancleIcon = function (ledeger) { return _this.clickOnCancelIcon(ledeger); };
        this.$scope.isLedgerNameNotValid = false;
        this.$scope.ledgerNameNotValid = stringConstants.notValidLedgerName;
        this.$scope.NoLedgersfound = stringConstants.NoLedgersfound;
        this.$scope.ledgersAccount = new Model.LedgersAccount();
        this.$scope.ledgerName = "";
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.ledegersCollection.slice(begin, end);
        });
        this.$rootScope.$on("closeLedgersPopup", function (event, data) {
            _this.getLedgers();
            _this.cancleAddLedgerPopup();
        });
        this.initialization();
    }
    AccountLedgersController.prototype.initialization = function () {
        this.getLedgers();
    };
    AccountLedgersController.prototype.clickOnEditIcon = function (ledeger) {
        if (ledeger !== undefined && ledeger !== null) {
            this.$scope.ledgerName = ledeger.LedgerName;
            angular.element("#ledgers" + ledeger.LedgerId).addClass('isHide');
            angular.element("#ledgersInput" + ledeger.LedgerId).removeClass('isHide');
            angular.element("#tdledgers" + ledeger.LedgerId).addClass('isHide');
            angular.element("#tdledgersInput" + ledeger.LedgerId).removeClass('isHide');
        }
    };
    AccountLedgersController.prototype.clickOnSaveIcon = function (ledeger) {
        var _this = this;
        if (ledeger !== undefined && ledeger !== null) {
            this.$rootScope.isLoading = true;
            this.$scope.isLedgerNameNotValid = false;
            this.$scope.ledgersAccount.LedgerName = ledeger.LedgerName;
            this.$scope.ledgersAccount.LedgerId = ledeger.LedgerId;
            var promise = this.ledgersService.updateLedgersAccount(this.$scope.ledgersAccount);
            promise.then(function (result) {
                if (result !== null && result !== undefined) {
                    if (result._isResult === "NotValidLedgerName") {
                        _this.$scope.isLedgerNameNotValid = true;
                    }
                    else {
                        angular.element('#ledgers' + ledeger.LedgerId).removeClass('isHide');
                        angular.element("#ledgersInput" + ledeger.LedgerId).addClass('isHide');
                        angular.element("#tdledgers" + ledeger.LedgerId).removeClass('isHide');
                        angular.element("#tdledgersInput" + ledeger.LedgerId).addClass('isHide');
                    }
                }
                _this.$rootScope.isLoading = false;
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                _this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
    };
    AccountLedgersController.prototype.clickOnCancelIcon = function (ledeger) {
        if (ledeger !== undefined && ledeger !== null) {
            ledeger.LedgerName = this.$scope.ledgerName;
            angular.element('#ledgers' + ledeger.LedgerId).removeClass('isHide');
            angular.element("#ledgersInput" + ledeger.LedgerId).addClass('isHide');
            angular.element("#tdledgers" + ledeger.LedgerId).removeClass('isHide');
            angular.element("#tdledgersInput" + ledeger.LedgerId).addClass('isHide');
        }
    };
    AccountLedgersController.prototype.getLedgers = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.ledegersCollection = [];
        var ledegersList = controllerScope.ledegersCollection;
        var promise = this.ledgersService.getLedgerList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    ledegersList.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = ledegersList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.ledegersCollection.length;
                controllerScope.errorMessageForLedger = false;
            }
            else
                controllerScope.errorMessageForLedger = true;
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
    AccountLedgersController.prototype.adNewLedgers = function () {
        this.ledgerAddPopup = this.$modal.open({
            templateUrl: 'ledgerAddPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'AddLedgerController',
            scope: this.$scope,
        });
    };
    AccountLedgersController.prototype.cancleAddLedgerPopup = function () {
        this.ledgerAddPopup.dismiss('cancel');
        var controllerScope = this.$scope;
        controllerScope.ledgersAccount = new Model.LedgersAccount();
    };
    return AccountLedgersController;
}());
AccountLedgersController.controllerId = "AccountLedgersController";
app.controller(AccountLedgersController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'apiPath', '$modal', function ($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal) {
        return new AccountLedgersController($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal);
    }]);
//# sourceMappingURL=accountLedgersController.js.map
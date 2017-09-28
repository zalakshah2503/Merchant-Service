// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/Account/ledgersService.ts" />
var LedgersController = (function () {
    function LedgersController($scope, $log, ledgersService, ngToast, $rootScope, $location, listOfAccessPages, authenticationPath, userAccessService) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.ledgersService = ledgersService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.userAccessService = userAccessService;
        this.$scope.ledger = new Model.LedgersAccount;
        this.$scope.ledgerList = [];
        this.$scope.legderErrorMessage = "";
        this.$scope.getLedgerList = function () { return _this.getLedgerList(); };
        this.$scope.isLoading = false;
        this.$scope.editLedgerAccount = function (ledgerId) { return _this.editLedgerAccount(ledgerId); };
        this.$scope.newLedgerPanel = false;
        this.$scope.isUpdate = false;
        this.$scope.addNewLedger = function () { return _this.addNewLedger(); };
        this.$scope.cancelLedgerDetail = function () { return _this.cancelLedgerDetail(); };
        this.$scope.groupList = [];
        this.$scope.AddLedger = function (ledger) { return _this.AddLedger(ledger); };
        this.$scope.updateLedger = function (ledger) { return _this.updateLedger(ledger); };
        this.$scope.ledgerNameRequired = stringConstants.ledgerNameRequired;
        this.$scope.isLedgerExists = false;
        this.$scope.ledgerAccountExsits = stringConstants.ledgerAccountExsits;
        this.$scope.isFocusIn = false;
        this.$scope.isDataLoading = true;
        this.initialization();
    }
    LedgersController.prototype.initialization = function () {
        this.groupList();
        this.getLedgerList();
    };
    //This method is used for enable/disable grid panel. SP
    LedgersController.prototype.addNewLedger = function () {
        this.$scope.newLedgerPanel = true;
        this.$scope.isLedgerExists = false;
        this.$scope.isUpdate = false;
        this.$scope.ledger = new Model.LedgersAccount();
        this.$scope.isFocusIn = true;
    };
    // get the list of ledger from database -SP
    LedgersController.prototype.getLedgerList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.ledgersService.getLedgerList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.ledgerList.push(result[i]);
                }
            }
            _this.$scope.isDataLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
        });
    };
    //Add Ledger into database -SP
    LedgersController.prototype.AddLedger = function (ledger) {
        var _this = this;
        var controllerScope = this.$scope;
        var controlerScope = this.$scope;
        controllerScope.isLedgerExists = false;
        controllerScope.isDataLoading = true;
        var promise = this.ledgersService.saveLedgerAccount(ledger);
        promise.then(function (result) {
            controllerScope.ledgerList.push(result);
            controllerScope.newLedgerPanel = false;
            controllerScope.ledger = new Model.LedgersAccount();
            _this.ngToast.create(stringConstants.ledgerInserted);
            controllerScope.isDataLoading = false;
        }).catch(function (error) {
            controllerScope.isDataLoading = false;
            controllerScope.isLedgerExists = true;
            controllerScope.legderErrorMessage = error.data.ExceptionMessage;
            _this.$log.log(error);
        });
        controlerScope.addLedger.$setPristine();
        //controlerScope.addGroup.$setValidity();
        controlerScope.addLedger.$setUntouched();
    };
    // get the list of group from Group table.
    LedgersController.prototype.groupList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.ledgersService.getGroupList();
        promise.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                controllerScope.groupList.push(result[i]);
            }
        }).catch(function (error) {
            _this.$log.log(error);
        });
    };
    //Fill the data on edit
    LedgersController.prototype.editLedgerAccount = function (ledgerId) {
        this.$scope.newLedgerPanel = true;
        var controllerScope = this.$scope;
        controllerScope.isUpdate = true;
        for (var i = 0; i < controllerScope.ledgerList.length; i++) {
            if (controllerScope.ledgerList[i].LedgerId === ledgerId) {
                controllerScope.ledger.LedgerId = controllerScope.ledgerList[i].LedgerId;
                controllerScope.ledger.LedgerName = controllerScope.ledgerList[i].LedgerName;
                controllerScope.ledger.GroupId = controllerScope.ledgerList[i].GroupId;
                controllerScope.ledger.Name = controllerScope.ledgerList[i].Name;
                controllerScope.ledger.Address = controllerScope.ledgerList[i].Address;
                controllerScope.ledger.State = controllerScope.ledgerList[i].State;
                break;
            }
        }
    };
    //This method is used for updating ledger in database. -SP
    LedgersController.prototype.updateLedger = function (ledger) {
        var _this = this;
        var controllScope = this.$scope;
        controllScope.isDataLoading = true;
        controllScope.isLedgerExists = false;
        var promise = this.ledgersService.updateLedgerAccount(ledger);
        promise.then(function (result) {
            for (var i = 0; i < controllScope.ledgerList.length; i++) {
                if (controllScope.ledgerList[i].LedgerId === result.Id) {
                    controllScope.ledgerList[i].LedgerName = result.LedgerName;
                    controllScope.ledgerList[i].GroupName = result.GroupName;
                    controllScope.ledgerList[i].GroupId = result.GroupId;
                    controllScope.ledgerList[i].Name = result.Name;
                    controllScope.ledgerList[i].Address = result.Address;
                    controllScope.ledgerList[i].State = result.State;
                    break;
                }
            }
            controllScope.newLedgerPanel = false;
            controllScope.ledger = new Model.LedgersAccount();
            _this.ngToast.create(stringConstants.ledgerUpdated);
            controllScope.isDataLoading = false;
        }).catch(function (error) {
            controllScope.isLedgerExists = true;
            controllScope.isDataLoading = false;
            controllScope.legderErrorMessage = error.data.ExceptionMessage;
            _this.$log.log(error);
        });
    };
    //This method is used for clear control value and enable grid panel. -SP
    LedgersController.prototype.cancelLedgerDetail = function () {
        var controllerScope = this.$scope;
        controllerScope.addLedger.$setPristine();
        controllerScope.addLedger.$setUntouched();
        controllerScope.newLedgerPanel = false;
        controllerScope.isUpdate = false;
        controllerScope.ledger = new Model.LedgersAccount();
    };
    return LedgersController;
}());
LedgersController.controllerId = "LedgersController";
app.controller(LedgersController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', function ($scope, $log, LedgersService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService) {
        return new LedgersController($scope, $log, LedgersService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService);
    }]);
//# sourceMappingURL=ledgersController.js.map
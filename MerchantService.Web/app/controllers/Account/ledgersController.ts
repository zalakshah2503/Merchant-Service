// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/Account/ledgersService.ts" />


interface IledgersControllerScope extends ng.IScope {
    title: string;
    ledger: Model.LedgersAccount;
    getLedgerList: Function;
    isLoading: boolean;
    ledgerList: any;
    groupList: any;
    editLedgerAccount: Function;
    newLedgerPanel: boolean;
    isUpdate: boolean;
    addNewLedger: Function;
    cancelLedgerDetail: Function;
    AddLedger: Function;
    updateLedger: Function;
    legderErrorMessage: string;
    ledgerNameRequired: string;
    isLedgerExists: boolean;
    ledgerAccountExsits: string;
    isFocusIn: boolean;
    isDataLoading: boolean;
}

interface IledgersController {

}

class LedgersController implements IledgersController {
    static controllerId = "LedgersController";

    constructor(private $scope: IledgersControllerScope, private $log: ng.ILogService, private ledgersService: LedgersService, public ngToast, public $rootScope, public $location, public listOfAccessPages, public authenticationPath, private userAccessService: UserAccessService) {
        this.$scope.ledger = new Model.LedgersAccount;
        this.$scope.ledgerList = [];
        this.$scope.legderErrorMessage = "";
        this.$scope.getLedgerList = () => this.getLedgerList();
        this.$scope.isLoading = false;
        this.$scope.editLedgerAccount = (ledgerId: number) => this.editLedgerAccount(ledgerId);
        this.$scope.newLedgerPanel = false;
        this.$scope.isUpdate = false;
        this.$scope.addNewLedger = () => this.addNewLedger();
        this.$scope.cancelLedgerDetail = () => this.cancelLedgerDetail();
        this.$scope.groupList = [];
        this.$scope.AddLedger = (ledger: Model.LedgersAccount) => this.AddLedger(ledger);
        this.$scope.updateLedger = (ledger: Model.LedgersAccount) => this.updateLedger(ledger);
        this.$scope.ledgerNameRequired = stringConstants.ledgerNameRequired;
        this.$scope.isLedgerExists = false;
        this.$scope.ledgerAccountExsits = stringConstants.ledgerAccountExsits;
        this.$scope.isFocusIn = false;
        this.$scope.isDataLoading = true;
        this.initialization();

    }

    private initialization() {
        this.groupList();
        this.getLedgerList();
    }
 
    //This method is used for enable/disable grid panel. SP
    private addNewLedger() {
        this.$scope.newLedgerPanel = true;
        this.$scope.isLedgerExists = false;
        this.$scope.isUpdate = false;
        this.$scope.ledger = new Model.LedgersAccount();
        this.$scope.isFocusIn = true;
    }
   
    // get the list of ledger from database -SP
    private getLedgerList() {
        let controllerScope = this.$scope;
        let promise = this.ledgersService.getLedgerList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.ledgerList.push(result[i]);
                }
            }
            this.$scope.isDataLoading = false;
        }).catch((error) => {
            this.$log.log(error);
        });

    }
  
    //Add Ledger into database -SP
    private AddLedger(ledger) {
        let controllerScope = this.$scope;
        let controlerScope: any = this.$scope;
        controllerScope.isLedgerExists = false;
        controllerScope.isDataLoading = true;
        let promise = this.ledgersService.saveLedgerAccount(ledger);
        promise.then((result) => {
            controllerScope.ledgerList.push(result);
            controllerScope.newLedgerPanel = false;
            controllerScope.ledger = new Model.LedgersAccount();
            this.ngToast.create(stringConstants.ledgerInserted);
            controllerScope.isDataLoading = false;
        }).catch((error) => {
            controllerScope.isDataLoading = false;
            controllerScope.isLedgerExists = true;
            controllerScope.legderErrorMessage = error.data.ExceptionMessage;
            this.$log.log(error);
        });
        controlerScope.addLedger.$setPristine();
        //controlerScope.addGroup.$setValidity();
        controlerScope.addLedger.$setUntouched();
    }
    
    // get the list of group from Group table.
    private groupList() {
        let controllerScope = this.$scope;
        let promise = this.ledgersService.getGroupList();
        promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
                controllerScope.groupList.push(result[i]);
            }
        }).catch((error) => {
            this.$log.log(error);
        });
    }

    //Fill the data on edit
    private editLedgerAccount(ledgerId) {
        this.$scope.newLedgerPanel = true;
        let controllerScope = this.$scope;
        controllerScope.isUpdate = true;
        for (let i = 0; i < controllerScope.ledgerList.length; i++) {
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
    }

    //This method is used for updating ledger in database. -SP
    private updateLedger(ledger) {
        let controllScope = this.$scope;
        controllScope.isDataLoading = true;
        controllScope.isLedgerExists = false;
        let promise = this.ledgersService.updateLedgerAccount(ledger);
        promise.then((result) => {
            for (let i = 0; i < controllScope.ledgerList.length; i++) {
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
            this.ngToast.create(stringConstants.ledgerUpdated);
            controllScope.isDataLoading = false;
        }).catch((error) => {
            controllScope.isLedgerExists = true;
            controllScope.isDataLoading = false;
            controllScope.legderErrorMessage = error.data.ExceptionMessage;
            this.$log.log(error);
        });
    }

    //This method is used for clear control value and enable grid panel. -SP
    private cancelLedgerDetail() {
        let controllerScope: any = this.$scope;
        controllerScope.addLedger.$setPristine();
        controllerScope.addLedger.$setUntouched();
        controllerScope.newLedgerPanel = false;
        controllerScope.isUpdate = false;
        controllerScope.ledger = new Model.LedgersAccount();
    }

}

app.controller(LedgersController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', ($scope, $log, LedgersService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService) => {
    return new LedgersController($scope, $log, LedgersService, ngToast, $rootSoope, $location, listOfAccessPages, authenticationPath, UserAccessService);
}]);


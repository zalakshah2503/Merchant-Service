interface IaccountLedgersControllerScope extends ng.IScope {
    ledegersCollection: any;
    totalCollection: any;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItems: number;
    errorMessageForLedger: boolean;
    adNewLedgers: Function;
    cancleAddLedgerPopup: Function;
    ledgerDate: Date;
    clickOnEditIcon: Function;
    clickOnSaveIcon: Function;
    clickOnCancleIcon: Function;
    ledgersAccount: Model.LedgersAccount;
    isLedgerNameNotValid: boolean;
    ledgerNameNotValid: string;
    ledgerName: string;
    NoLedgersfound: any;
}

interface IaccountLedgersController {

}

class AccountLedgersController implements IaccountLedgersController {
    static controllerId = "AccountLedgersController";
    public ledgerAddPopup;
    constructor(private $scope: IaccountLedgersControllerScope, private $log: ng.ILogService, private ledgersService: LedgersService, public ngToast, public $rootScope, public $location, public apiPath, public $modal) {

        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;

        this.$scope.maxSize = 10;
        this.$scope.errorMessageForLedger = true;
        this.$scope.adNewLedgers = () => this.adNewLedgers();
        this.$scope.cancleAddLedgerPopup = () => this.cancleAddLedgerPopup();
        this.$scope.clickOnEditIcon = (ledeger) => this.clickOnEditIcon(ledeger);
        this.$scope.clickOnSaveIcon = (ledeger) => this.clickOnSaveIcon(ledeger);
        this.$scope.clickOnCancleIcon = (ledeger) => this.clickOnCancelIcon(ledeger);
        this.$scope.isLedgerNameNotValid = false;
        this.$scope.ledgerNameNotValid = stringConstants.notValidLedgerName;
        this.$scope.NoLedgersfound = stringConstants.NoLedgersfound;
        this.$scope.ledgersAccount = new Model.LedgersAccount();
        this.$scope.ledgerName = "";

        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.ledegersCollection.slice(begin, end);
        });

        this.$rootScope.$on("closeLedgersPopup", (event, data) => {
            this.getLedgers();
            this.cancleAddLedgerPopup();
        });
        this.initialization();
    }

    private initialization() {
        this.getLedgers();
    }

    private clickOnEditIcon(ledeger) {
        if (ledeger !== undefined && ledeger !== null) {
            this.$scope.ledgerName = ledeger.LedgerName;
            angular.element("#ledgers" + ledeger.LedgerId).addClass('isHide');
            angular.element("#ledgersInput" + ledeger.LedgerId).removeClass('isHide');
            angular.element("#tdledgers" + ledeger.LedgerId).addClass('isHide');
            angular.element("#tdledgersInput" + ledeger.LedgerId).removeClass('isHide');
        }
    }

    private clickOnSaveIcon(ledeger) {
        if (ledeger !== undefined && ledeger !== null) {
            this.$rootScope.isLoading = true;
            this.$scope.isLedgerNameNotValid = false;
            this.$scope.ledgersAccount.LedgerName = ledeger.LedgerName;
            this.$scope.ledgersAccount.LedgerId = ledeger.LedgerId;
            let promise = this.ledgersService.updateLedgersAccount(this.$scope.ledgersAccount);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    if (result._isResult === "NotValidLedgerName") {
                        this.$scope.isLedgerNameNotValid = true;
                    }
                    else {
                        angular.element('#ledgers' + ledeger.LedgerId).removeClass('isHide');
                        angular.element("#ledgersInput" + ledeger.LedgerId).addClass('isHide');
                        angular.element("#tdledgers" + ledeger.LedgerId).removeClass('isHide');
                        angular.element("#tdledgersInput" + ledeger.LedgerId).addClass('isHide');
                    }
                }
                this.$rootScope.isLoading = false;
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

    private clickOnCancelIcon(ledeger) {
        if (ledeger !== undefined && ledeger !== null) {
            ledeger.LedgerName = this.$scope.ledgerName;
            angular.element('#ledgers' + ledeger.LedgerId).removeClass('isHide');
            angular.element("#ledgersInput" + ledeger.LedgerId).addClass('isHide');
            angular.element("#tdledgers" + ledeger.LedgerId).removeClass('isHide');
            angular.element("#tdledgersInput" + ledeger.LedgerId).addClass('isHide');
        }
    }

    private getLedgers() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.ledegersCollection = [];
        let ledegersList = controllerScope.ledegersCollection;
        let promise = this.ledgersService.getLedgerList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    ledegersList.push(result[i]);
                }
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = ledegersList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.ledegersCollection.length;
                controllerScope.errorMessageForLedger = false;
            }
            else
                controllerScope.errorMessageForLedger = true;
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private adNewLedgers() {
        this.ledgerAddPopup = this.$modal.open({
            templateUrl: 'ledgerAddPopup',
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            controller: 'AddLedgerController',
            scope: this.$scope,
        });
    }

    private cancleAddLedgerPopup() {
        this.ledgerAddPopup.dismiss('cancel');
        let controllerScope: any = this.$scope;
        controllerScope.ledgersAccount = new Model.LedgersAccount();
    }

}
app.controller(AccountLedgersController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'apiPath', '$modal', ($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal) => {
    return new AccountLedgersController($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal);
}]);
 
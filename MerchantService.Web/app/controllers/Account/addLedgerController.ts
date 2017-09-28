interface IaddLedgerControllerScope extends ng.IScope {
    listOfGroup; any;
    listOfLedgers: any;
    saveLedgers: Function;
    ledgersAccount: Model.LedgersAccount;
    changeDetailType: Function;
    changeCategory: Function;
    listOfLedgerGroupType: any;
    isBalancedSection: boolean;
    isCheckedSubAccount: boolean;
    isDisableParentLedger: boolean;
    groupNameRequired: string;
    detailTypeRequired: string;
    ledegerNameRequired: string;
    ledgerNotValid: string;
    isLedgerValid: boolean;
    isLedgerNameNotValid: boolean;
    ledgerNameNotValid: string;
    isDisableDetailType: boolean;
    isLedgerDate: boolean;
    openledgerDate: Function;
    clickSubAccountCheckBox: Function;
    isFirstClick: boolean;
}

interface IaddLedgerController {

}

class AddLedgerController implements IaddLedgerController {
    static controllerId = "AddLedgerController";
    public ledgerAddPopup;
    constructor(private $scope: IaddLedgerControllerScope, private $log: ng.ILogService, private ledgersService: LedgersService, public ngToast, public $rootScope, public $location, public apiPath, public $modal) {

        this.$scope.listOfGroup = [];
        this.$scope.listOfLedgers = [];
        this.$scope.saveLedgers = () => this.saveLedgers();
        this.$scope.ledgersAccount = new Model.LedgersAccount();
        this.$scope.changeCategory = () => this.changeCategory();
        this.$scope.openledgerDate = (event) => this.openledgerDate(event);
        this.$scope.listOfLedgerGroupType = [];
        this.$scope.changeDetailType = () => this.changeDetailType();
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
        this.$scope.clickSubAccountCheckBox = () => this.clickSubAccountCheckBox();
        this.$scope.isFirstClick = false;
        this.initialization();
    }

    private initialization() {
        this.GetCategoryType();
        this.GetLedgersDetailWithChild();

    }

    private openledgerDate(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$scope.isLedgerDate = true;
    }

    private clickSubAccountCheckBox() {
        if (!this.$scope.ledgersAccount.isSubAccountChecked) {
            this.$scope.ledgersAccount.ParentLedgerId = undefined;
        }
    }

    private GetCategoryType() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.ledgersService.getGroupList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.listOfGroup.push(result[i]);
                }
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

    private changeDetailType() {
        if (this.$scope.ledgersAccount.GroupTypeId !== undefined && this.$scope.ledgersAccount.GroupTypeId !== null) {
            for (let i = 0; i < this.$scope.listOfLedgerGroupType.length; i++) {
                if (this.$scope.listOfLedgerGroupType[i].Id === this.$scope.ledgersAccount.GroupTypeId)
                    this.$scope.ledgersAccount.LedgerName = this.$scope.listOfLedgerGroupType[i].Name;
            }
        }
    }

    private GetLedgersDetailWithChild() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let promise = this.ledgersService.getLedgerWithChildLedger();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    this.$scope.listOfLedgers.push(result[i]);
                }
            }
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

    private changeCategory() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.listOfLedgerGroupType = [];
        controllerScope.ledgersAccount.Description = "";
        controllerScope.ledgersAccount.LedgerName = "";
        controllerScope.ledgersAccount.Balance = 0;
        controllerScope.ledgersAccount.LedgerName = "";
        controllerScope.ledgersAccount.GroupTypeId = undefined;
        controllerScope.ledgersAccount.ParentLedgerId = undefined;
        controllerRootScope.isLoading = true;
        if (this.$scope.ledgersAccount.GroupId !== undefined && this.$scope.ledgersAccount.GroupId !== null) {
            for (let i = 0; i < this.$scope.listOfGroup.length; i++) {
                if (this.$scope.listOfGroup[i].GroupId === this.$scope.ledgersAccount.GroupId) {
                    if (this.$scope.listOfGroup[i].HasBalanced)
                        this.$scope.isBalancedSection = true;
                    else
                        this.$scope.isBalancedSection = false;
                    break;
                }
            }
            this.$scope.isDisableDetailType = false;
            let promise = this.ledgersService.getGroupTypeByGroupId(this.$scope.ledgersAccount.GroupId);
            promise.then((result) => {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        controllerScope.listOfLedgerGroupType.push(result[i]);
                    }
                }
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

    }

    private saveLedgers() {
        if (!this.$scope.isFirstClick) {
            this.$scope.isFirstClick = true;
            let controllerRootScope = this.$rootScope;
            this.$scope.isLedgerValid = false;
            this.$scope.isLedgerNameNotValid = false;
            let promise = this.ledgersService.saveLedgerAccount(this.$scope.ledgersAccount);
            promise.then((result) => {
                if (result !== null && result !== undefined) {
                    if (result._isResult !== "NotValidGroup") {
                        if (result._isResult !== "NotValidLedgerName") {
                            let controllerScope: any = this.$scope;
                            controllerScope.ledgersAccount = new Model.LedgersAccount();
                            this.ngToast.create(stringConstants.addedLedgeds);
                            if (controllerRootScope.isAccountLedger) {
                                this.$rootScope.$broadcast("closeAccountLedgersPopup", result._isResult);
                            } else {
                                this.$rootScope.$broadcast("closeLedgersPopup", () => { });
                            }

                        }
                        else
                            this.$scope.isLedgerNameNotValid = true;
                    }
                    else {
                        this.$scope.isLedgerValid = true;
                    }
                }
                this.$rootScope.isLoading = false;
                this.$scope.isFirstClick = false;
            }).catch((error) => {
                this.$rootScope.isLoading = false;
                this.$scope.isFirstClick = false;
                this.$log.log(error);
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(this.apiPath);
                }
            });
        }
    }
}
app.controller(AddLedgerController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'apiPath', '$modal', ($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal) => {
    return new AddLedgerController($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal);
}]);
  
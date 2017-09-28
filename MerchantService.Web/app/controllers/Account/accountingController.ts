// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

    interface IaccountingControllerScope extends ng.IScope {
        journalEntryDetails: any;
        journalEntryCollection: any;
        totalDebitAmount: number;
        totalCreditAmount: number;
        openJournalDateModel: Function;
        isJournalEntryOpen: boolean;
        listOfLedgers: any;
        changeDebitAmount: Function;
        changeCreditAmount: Function;
        checkAccountSelectedOrNot: Function;
        changeAccountName: Function;
        addNewJournalEntry: Function;
        removeJounalEntry: Function;
        saveAccountingJournalEntry: Function;
        clearJournalEntry: Function;
        ledgerAccountId : number;
        journalIndex: number;
        cancleAddLedgerPopup: Function;
        isDataLoading: boolean;
        accountingEntryCollection: any;
        errorMessageDisplay: boolean;
        errorMessage: string;
        getAllAccountingEntry: Function;
        checNullkDescription: Function;
        isNullDescription: boolean;
    }

    interface IaccountingController {
       
    }

    class AccountingController implements IaccountingController {
        static controllerId ="AccountingController";
        public ledgerAddPopup;
        constructor(private $scope: IaccountingControllerScope, private $log: ng.ILogService, private ledgersService: LedgersService, public ngToast, public $rootScope, public $location, public apiPath, public $modal, private accountingService: AccountingService, public $route) {
            this.$scope.journalEntryDetails = new Model.JournalEntryAc();
            this.$scope.journalEntryCollection = [{ LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount:""},
                { LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: ""},
                { LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: ""},
                { LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" }
            ];
            this.$scope.totalDebitAmount = 0;
            this.$scope.totalCreditAmount =0;
            this.$scope.isJournalEntryOpen = false;
            this.$scope.journalEntryDetails.JournalDate = new Date();
            this.$scope.openJournalDateModel = (event:any) => this.openJournalDateModel(event);
            this.$scope.listOfLedgers = [];
            this.$scope.changeDebitAmount = (index: any) => this.changeDebitAmount(index);
            this.$scope.changeCreditAmount = (index: any) => this.changeCreditAmount(index);
            this.$scope.checkAccountSelectedOrNot = () => this.checkAccountSelectedOrNot();
            this.$scope.changeAccountName = (index : any) => this.changeAccountName(index);
            this.$scope.addNewJournalEntry = (index: any) => this.addNewJournalEntry(index);
            this.$scope.removeJounalEntry = (index: any) => this.removeJounalEntry(index);
            this.$scope.saveAccountingJournalEntry = () => this.saveAccountingJournalEntry();
            this.$scope.clearJournalEntry = () => this.clearJournalEntry();
            this.$scope.ledgerAccountId = 0;
            this.$scope.journalIndex = 0;
            this.$scope.cancleAddLedgerPopup = () => this.cancleAddLedgerPopup();
            this.$scope.isDataLoading = false;
            this.$scope.accountingEntryCollection = [];
            this.$scope.errorMessageDisplay = false;
            this.$scope.errorMessage = "";
            this.$rootScope.$on("closeAccountLedgersPopup", (event, data) => {
                this.getAllLedgersList();
                this.closeAddLedgerPopup(data);
                this.$scope.ledgerAccountId = data;
            });
            this.$scope.getAllAccountingEntry = () => this.getAllAccountingEntry();
            this.initialization();
            this.$scope.checNullkDescription = () => this.checNullkDescription();
            this.$scope.isNullDescription = true;
        }

        private initialization() {
            this.getAllLedgersList();
        }

        private openJournalDateModel(event) {
            let controllerScope = this.$scope;
            event.preventDefault();
            event.stopPropagation();
            controllerScope.isJournalEntryOpen = true;
        }

        private getAllLedgersList() {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.listOfLedgers = [];
            controllerScope.listOfLedgers.push({ LedgerId:"0",LedgerName: "Add new", IsAddNewAccount: true, Name:"Add new" });
            let promise = this.ledgersService.getLedgerWithChildLedger();
            promise.then((result) => {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        controllerScope.listOfLedgers.push(result[i]);
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

        private changeDebitAmount(index) {
            let controllerScope = this.$scope;
            for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (i === index) {
                    controllerScope.addNewJournalEntry(index);
                    if (controllerScope.totalDebitAmount === 0 && controllerScope.totalCreditAmount === 0) {
                        if (controllerScope.journalEntryCollection[i].DebitAmount !== undefined && controllerScope.journalEntryCollection[i].DebitAmount !== 0 && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== "") {
                            controllerScope.totalDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                            controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                        } else {
                            controllerScope.totalDebitAmount = 0;
                            controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                        }
                       
                       break;
                    } else {
                        if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 && controllerScope.journalEntryCollection[i].DebitAmount !== undefined && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== "") {
                            if (controllerScope.journalEntryCollection[i].OldDebitAmount !== 0 && controllerScope.journalEntryCollection[i].OldDebitAmount !== "" && controllerScope.journalEntryCollection[i].OldDebitAmount !== undefined && controllerScope.journalEntryCollection[i].OldDebitAmount !== null) {
                                controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldDebitAmount);
                            }
                           
                            controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) + parseInt(controllerScope.journalEntryCollection[i].DebitAmount);
                            controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                            if (controllerScope.journalEntryCollection[i].CreditAmount !== 0 && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null && controllerScope.journalEntryCollection[i].CreditAmount !== "") {
                                controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].CreditAmount);
                                controllerScope.journalEntryCollection[i].CreditAmount = "";
                                controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                              
                            }
                        } else {
                            if (controllerScope.journalEntryCollection[i].OldDebitAmount !== 0 && controllerScope.journalEntryCollection[i].OldDebitAmount !== undefined && controllerScope.journalEntryCollection[i].OldDebitAmount !== "" && controllerScope.journalEntryCollection[i].OldDebitAmount !== null) {
                                controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldDebitAmount);
                                controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                            }
                        }                    
                        break;
                    }
                }

            }
        }

        private changeCreditAmount(index) {
         
            let controllerScope = this.$scope;
            for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (i === index) {
                    controllerScope.addNewJournalEntry(index);
                    if (controllerScope.totalDebitAmount === 0 && controllerScope.totalCreditAmount === 0) {
                        if (controllerScope.journalEntryCollection[i].CreditAmount !== 0 && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null && controllerScope.journalEntryCollection[i].CreditAmount !== "") {
                            controllerScope.totalCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                            controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;    
                        } else {
                            controllerScope.totalCreditAmount = 0;
                            controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                        }
                        break;
                    } else {
                        if (controllerScope.journalEntryCollection[i].CreditAmount !== 0 && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null && controllerScope.journalEntryCollection[i].CreditAmount !== "") {
                            if (controllerScope.journalEntryCollection[i].OldCreditAmount !== 0 && controllerScope.journalEntryCollection[i].OldCreditAmount !== undefined && controllerScope.journalEntryCollection[i].OldCreditAmount !== "" && controllerScope.journalEntryCollection[i].OldCreditAmount !== null) {
                                controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldCreditAmount);
                            }
                          
                            controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) + parseInt(controllerScope.journalEntryCollection[i].CreditAmount);
                            controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                            if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 && controllerScope.journalEntryCollection[i].DebitAmount !== undefined && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== "") {
                                controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].DebitAmount);
                                controllerScope.journalEntryCollection[i].DebitAmount = "";
                              
                                controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                            }
                        } else {
                            if (controllerScope.journalEntryCollection[i].OldCreditAmount !== 0 && controllerScope.journalEntryCollection[i].OldCreditAmount !== undefined && controllerScope.journalEntryCollection[i].OldCreditAmount !== "" && controllerScope.journalEntryCollection[i].OldCreditAmount !== null) {
                                controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].OldCreditAmount);
                                controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                            }
                        }
                        break;
                    }
                }
            }
        }

        private checNullkDescription() {
          
            let controllerScope = this.$scope;
            if (controllerScope.journalEntryCollection.length !== 0) {
                for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                       if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 || controllerScope.journalEntryCollection[i].CreditAmount !== 0 )  {
                           if ((controllerScope.journalEntryCollection[i].LedgerId !== "" && controllerScope.journalEntryCollection[i].LedgerId !== undefined && controllerScope.journalEntryCollection[i].LedgerId !== null)) {
                            if (controllerScope.journalEntryCollection[i].Description === "") {
                                controllerScope.isNullDescription = true;
                                break;
                            } else {
                                controllerScope.isNullDescription = false;
                            }
                          
                        }
                    }
                   
                }

               
            }
        }

        private checkAccountSelectedOrNot() {
            let flag = false;
            let controllerScope = this.$scope;
            if (controllerScope.journalEntryCollection.length !== 0) {

                for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                    if (controllerScope.journalEntryCollection[i].DebitAmount !== 0 || controllerScope.journalEntryCollection[i].CreditAmount !== 0 ) {
                        if ((controllerScope.journalEntryCollection[i].LedgerId !== "" && controllerScope.journalEntryCollection[i].LedgerId !== undefined && controllerScope.journalEntryCollection[i].LedgerId !== null)) {
                            flag = true;
                        }
                        else {
                            flag = false;
                           
                            break;
                           
                           
                        }

                    }
                    return flag;
            }             
            }
        }

        private adNewLedgers() {
            let controllerRootScope = this.$rootScope;
            this.ledgerAddPopup = this.$modal.open({
                templateUrl: 'ledgerAddPopup',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                controller: 'AddLedgerController',
                scope: this.$scope,
            });
            controllerRootScope.isAccountLedger = true;
        }

        private changeAccountName(index) {
            let controllerScope = this.$scope;
          
            for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (i === index) {
                    controllerScope.journalIndex = index;
                    if (controllerScope.journalEntryCollection[i].LedgerId === "0") {
                        this.adNewLedgers();
                        break;
                    } else {
                        if (controllerScope.journalEntryCollection[i].Description === "") {
                            controllerScope.isNullDescription = true;
                          
                        } else {
                            controllerScope.isNullDescription = false;
                        }
                        if (controllerScope.journalEntryCollection[i].CreditAmount === 0 || controllerScope.journalEntryCollection[i].DebitAmount === 0) {
                            if (controllerScope.totalCreditAmount === controllerScope.totalDebitAmount) {
                                if (controllerScope.journalEntryCollection[i].DebitAmount === "") {
                                    controllerScope.journalEntryCollection[i].DebitAmount = "";
                                    controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                                }
                                if (controllerScope.journalEntryCollection[i].CreditAmount === "") {
                                    controllerScope.journalEntryCollection[i].CreditAmount = "";

                                    controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                                }
                                break;
                            } else if (controllerScope.totalCreditAmount < controllerScope.totalDebitAmount) {
                                if (controllerScope.journalEntryCollection[i].CreditAmount === "") {
                                    if (controllerScope.journalEntryCollection[i].DebitAmount === "") {
                                        controllerScope.journalEntryCollection[i].CreditAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.totalCreditAmount.toString());
                                        controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) + controllerScope.journalEntryCollection[i].CreditAmount;
                                        controllerScope.journalEntryCollection[i].DebitAmount = "";

                                        controllerScope.journalEntryCollection[i].OldDebitAmount = "";
                                        controllerScope.journalEntryCollection[i].OldCreditAmount = controllerScope.journalEntryCollection[i].CreditAmount;
                                    }

                                }

                                break;
                            } else if (controllerScope.totalCreditAmount > controllerScope.totalDebitAmount) {
                                if (controllerScope.journalEntryCollection[i].DebitAmount === "") {
                                    if (controllerScope.journalEntryCollection[i].CreditAmount === "") {
                                        controllerScope.journalEntryCollection[i].DebitAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.totalDebitAmount.toString());
                                        controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) + controllerScope.journalEntryCollection[i].DebitAmount;
                                        controllerScope.journalEntryCollection[i].CreditAmount = "";
                                        controllerScope.journalEntryCollection[i].OldCreditAmount = "";

                                        controllerScope.journalEntryCollection[i].OldDebitAmount = controllerScope.journalEntryCollection[i].DebitAmount;
                                    }

                                }

                                break;
                            }
                            else {
                                controllerScope.totalCreditAmount = 0;
                                controllerScope.totalDebitAmount = 0;
                                break;
                            }
                        }
                        break;
                    }
                    }
                 
            }
            
        }

        private closeAddLedgerPopup(ledgerId) {
            let controllerRootScope = this.$rootScope;
            this.ledgerAddPopup.dismiss('cancel');
            let controllerScope: any = this.$scope;
            controllerScope.ledgersAccount = new Model.LedgersAccount();
            controllerRootScope.isAccountLedger = false;
            for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (i === controllerScope.journalIndex) {
                    controllerScope.journalEntryCollection[i].LedgerId = ledgerId;
                }
            }
        }

        private cancleAddLedgerPopup() {
            let controllerRootScope = this.$rootScope;
            this.ledgerAddPopup.dismiss('cancel');
            let controllerScope: any = this.$scope;
            controllerScope.ledgersAccount = new Model.LedgersAccount();
            controllerRootScope.isAccountLedger = false;
            for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (i === controllerScope.journalIndex) {
                    controllerScope.journalEntryCollection[i].LedgerId = "";
                }
            }
        }

        private addNewJournalEntry(index) {
            let controllerScope = this.$scope;
            if (controllerScope.journalEntryCollection.length === index + 1) {
                controllerScope.journalEntryCollection.push({ LedgerId: "", DebitAmount: "", CreditAmount: "", Description: "", OldCreditAmount: "", OldDebitAmount: "" });
            }
        }

        private removeJounalEntry(index) {
            let controllerScope = this.$scope;
            for (let i = 0; i < controllerScope.journalEntryCollection.length; i++) {
                if (i === index) {
                    if (controllerScope.journalEntryCollection[i].CreditAmount !== "" && controllerScope.journalEntryCollection[i].CreditAmount !== undefined && controllerScope.journalEntryCollection[i].CreditAmount !== null) {
                        controllerScope.totalCreditAmount = parseInt(controllerScope.totalCreditAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].CreditAmount);
                    }

                    if (controllerScope.journalEntryCollection[i].DebitAmount !== "" && controllerScope.journalEntryCollection[i].DebitAmount !== null && controllerScope.journalEntryCollection[i].DebitAmount !== undefined) {
                        controllerScope.totalDebitAmount = parseInt(controllerScope.totalDebitAmount.toString()) - parseInt(controllerScope.journalEntryCollection[i].DebitAmount);
                    }
                   
       
                    controllerScope.journalEntryCollection[i].LedgerId = "";
                    controllerScope.journalEntryCollection[i].DebitAmount = "";
                    controllerScope.journalEntryCollection[i].CreditAmount = "";
                    controllerScope.journalEntryCollection[i].Description = "";
                    controllerScope.journalEntryCollection[i].OldCreditAmount = "";
                    controllerScope.journalEntryCollection[i].OldDebitAmount = "";

                    controllerScope.journalEntryCollection.splice(index, 1);
                    break;
                }
            }
        }

        private saveAccountingJournalEntry() {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerRootScope.isLoading = true;
            controllerScope.journalEntryDetails.JournalEntryCollection = controllerScope.journalEntryCollection;
            let promise = this.accountingService.saveAccountingJournalEntry(controllerScope.journalEntryDetails);
            promise.then((result) => {
                this.$log.log("save accounting journal entry successfully");
                this.clearJournalEntry();
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                location.replace(this.apiPath);
                this.$log.log(error);
            });
          
        }

        private clearJournalEntry() {
            this.$route.reload();
        }

        private getAllAccountingEntry() {
            let controllerScope = this.$scope;
            let controllerRootScope = this.$rootScope;
            controllerScope.isDataLoading = true;
            controllerScope.accountingEntryCollection = [];
           
            let promise = this.accountingService.getAllAccountingEntry();
            promise.then((result) => {
                this.$log.log("get inventory transfer list susscussfully", result.length);
                    controllerScope.errorMessageDisplay = false;
                    controllerScope.accountingEntryCollection = result;
                    controllerScope.isDataLoading = false;
            }).catch((error) => {
                location.replace(this.apiPath);
                this.$log.log(error);
            });
        }
    }

app.controller(AccountingController.controllerId, ['$scope', '$log', 'LedgersService', 'ngToast', '$rootScope', '$location', 'apiPath', '$modal', 'AccountingService', '$route', ($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal, AccountingService, $route) => {
    return new AccountingController($scope, $log, LedgersService, ngToast, $rootSoope, $location, apiPath, $modal, AccountingService, $route);
}]);

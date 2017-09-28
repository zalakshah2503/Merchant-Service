// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


    interface IaccountingService {
        saveAccountingJournalEntry: (journalEntryDetails) => void;
        getAllAccountingEntry: () => void;
    }
    
    class AccountingService implements IaccountingService {
        public saveJournalEntry;
        public getAccount;

        constructor(private $resource: ng.resource.IResourceService, private $log: ng.ILogService) {
            this.saveJournalEntry = this.$resource(apiPaths.saveAccountingJournalEntry);
            this.getAccount = this.$resource(apiPaths.getAllAccountingEntry, {}, { query: { method: "GET", isArray: false } });
        }

        saveAccountingJournalEntry(journalEntryDetails) {
            return this.saveJournalEntry.save(journalEntryDetails).$promise;
        }

        getAllAccountingEntry() {
            return this.getAccount.query().$promise;
        }

    }

    app.service("AccountingService", ['$resource','$log', ($resource, $log) => {
        return new AccountingService($resource, $log);
    }]);

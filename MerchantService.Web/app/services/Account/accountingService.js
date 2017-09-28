// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var AccountingService = (function () {
    function AccountingService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.saveJournalEntry = this.$resource(apiPaths.saveAccountingJournalEntry);
        this.getAccount = this.$resource(apiPaths.getAllAccountingEntry, {}, { query: { method: "GET", isArray: false } });
    }
    AccountingService.prototype.saveAccountingJournalEntry = function (journalEntryDetails) {
        return this.saveJournalEntry.save(journalEntryDetails).$promise;
    };
    AccountingService.prototype.getAllAccountingEntry = function () {
        return this.getAccount.query().$promise;
    };
    return AccountingService;
}());
app.service("AccountingService", ['$resource', '$log', function ($resource, $log) {
        return new AccountingService($resource, $log);
    }]);
//# sourceMappingURL=accountingService.js.map
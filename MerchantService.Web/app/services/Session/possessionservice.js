var POSSessionService = (function () {
    function POSSessionService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getCashier = this.$resource(apiPaths.getCashierList);
        this.cashierDetial = this.$resource(apiPaths.getCashierDetail);
        this.getTransactionType = this.$resource(apiPaths.getAllTransaction);
        this.nonSalesTransaction = this.$resource(apiPaths.addNonSalesTransaction);
        this.getListOfNonSalesTransaction = this.$resource(apiPaths.getNonSalesTransactionList);
        this.getPOsSessionBillList = this.$resource(apiPaths.getPOSSessionBillList);
        this.viewSessionBillPayment = this.$resource(apiPaths.viewSessionBillPayment);
        this.paymentEvent = this.$resource(apiPaths.changePaymentTypeEvent);
        this.nonSalesTransactionForDelete = this.$resource(apiPaths.nonSalesTransactionForDelete);
        this.posSessionClosingSave = this.$resource(apiPaths.savePOSSessionClose);
        this.submitPOSSession = this.$resource(apiPaths.submitPOSSessionClose);
        this.getBranch = this.$resource(apiPaths.getListOfBranch);
        this.getPOSSessionWork = this.$resource(apiPaths.getPOSSessionWorkList);
        this.sessionClosingVarification = this.$resource(apiPaths.sessionClosingVarificationWorkFlow);
        this.updateSessionClosingObject = this.$resource(apiPaths.sessionClosingUpdate);
        this.getlistOfAllAction = this.$resource(apiPaths.getPOSSeesionActionList);
        this.varificationPOSSession = this.$resource(apiPaths.varificationForPOSSession);
        this.approveForPOSSession = this.$resource(apiPaths.approveForPOSSession);
        this.rejectForPOSSession = this.$resource(apiPaths.rejectForPOSSession);
        this.getPOSSessionBillListByCashierId = this.$resource(apiPaths.getPOSSessionBillListByCashierId);
        this.getCashierByBranch = this.$resource(apiPaths.getCashierByBranch);
    }
    POSSessionService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //this service used for submit pos session closing. -An
    POSSessionService.prototype.submitPOSSessionCosing = function (resource) {
        return this.submitPOSSession.save(resource).$promise;
    };
    //this service used for get cashier list. -An
    POSSessionService.prototype.getCashierList = function () {
        return this.getCashier.query().$promise;
    };
    //this service used for get cashier Detail. -An
    POSSessionService.prototype.getcashierDetial = function (cashierId) {
        return this.cashierDetial.get({ cashierId: cashierId }).$promise;
    };
    //this service used for get all transaction type. -An
    POSSessionService.prototype.getAllTransactionType = function () {
        return this.getTransactionType.query().$promise;
    };
    //this service used for insert non slaes transaction. -An
    POSSessionService.prototype.addNewNonSalesTransaction = function (resource) {
        return this.nonSalesTransaction.save(resource).$promise;
    };
    //this service used for get non sales transaction list. -An
    POSSessionService.prototype.getNonSalesTransactionList = function (id) {
        return this.getListOfNonSalesTransaction.query({ id: id }).$promise;
    };
    //this service used for get list of pos sessoin bill. -An
    POSSessionService.prototype.getListOfPOSSessionBill = function () {
        return this.getPOsSessionBillList.query().$promise;
    };
    //this service used for get list of pos sessoin bill by cashierId. -An
    POSSessionService.prototype.getListOfPOSSessionBillCashierId = function (id, byuser) {
        return this.getPOSSessionBillListByCashierId.query({ id: id, byuser: byuser }).$promise;
    };
    //this service used for get session bill payment detail by id.-An
    POSSessionService.prototype.viewSessionBillPaymentDetail = function (id) {
        return this.viewSessionBillPayment.query({ id: id }).$promise;
    };
    //this service used for update payment type.- An
    POSSessionService.prototype.changePaymentEvent = function (resource) {
        return this.paymentEvent.save(resource).$promise;
    };
    //this service used for delete non sales payment. -An
    POSSessionService.prototype.deleteNonSalesTransaction = function (id) {
        return this.nonSalesTransactionForDelete.get({ id: id }).$promise;
    };
    //this service used foe save pos session closing. -An
    POSSessionService.prototype.savePOSSessionClosing = function (resource) {
        return this.posSessionClosingSave.save(resource).$promise;
    };
    //this service used for get pos session work list. -An
    POSSessionService.prototype.getPOSSessionWorkList = function () {
        return this.getPOSSessionWork.query().$promise;
    };
    //this service used for get Session Closing Varification by id. -An
    POSSessionService.prototype.getSessionClosingVarification = function (id) {
        return this.sessionClosingVarification.get({ id: id }).$promise;
    };
    //this service used update session closing. -An
    POSSessionService.prototype.updateSessionClosing = function (resource) {
        return this.updateSessionClosingObject.save(resource).$promise;
    };
    //this service used for get lis of all action. -An
    POSSessionService.prototype.getActionList = function (id) {
        return this.getlistOfAllAction.query({ id: id }).$promise;
    };
    //this service used for pos session varification. -An
    POSSessionService.prototype.varificationButtonEvent = function (resource) {
        return this.varificationPOSSession.save(resource).$promise;
    };
    //this service used for pos session approve. -An 
    POSSessionService.prototype.approvePOSSession = function (resource) {
        return this.approveForPOSSession.save(resource).$promise;
    };
    //this service used for pos session reject. An
    POSSessionService.prototype.rejectPOSSession = function (resource) {
        return this.rejectForPOSSession.save(resource).$promise;
    };
    //this service used for get cashier by branch
    POSSessionService.prototype.getCashierListByBranch = function () {
        return this.getCashierByBranch.query().$promise;
    };
    return POSSessionService;
}());
POSSessionService.serviceId = "POSSessionService";
app.service(POSSessionService.serviceId, ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new POSSessionService($resource, $q, $log);
    }]);
//# sourceMappingURL=possessionservice.js.map
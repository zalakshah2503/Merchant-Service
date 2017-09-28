
interface IPOSSessionService {
    getCashierList: () => void;
    getAllTransactionType: () => void;
    getcashierDetial: (cashierId: number) => void;
    addNewNonSalesTransaction: (resource) => void;
    getNonSalesTransactionList: (id) => void;
    getListOfPOSSessionBill: () => void;
    viewSessionBillPaymentDetail: (id: number) => void;
    changePaymentEvent: (resource) => void;
    deleteNonSalesTransaction: (id) => void;
    savePOSSessionClosing: (resource) => void;
    submitPOSSessionCosing: (resource) => void;
    getBranchList: () => void;
    getPOSSessionWorkList: () => void;
    getSessionClosingVarification: (id: number) => void;
    updateSessionClosing: (resource) => void;
    getActionList: (id: number) => void;
    varificationButtonEvent: (sessionClosingVarificaitonObject: any) => void;
    approvePOSSession: (resource) => void;
    rejectPOSSession: (resource) => void;
    getListOfPOSSessionBillCashierId: (id: number,byuser:boolean) => void;
    getCashierListByBranch: () => void;

}

class POSSessionService implements IPOSSessionService {
    static serviceId = "POSSessionService";
    private $resource;
    private $q;
    private $log;
    public getCashier;
    public cashierDetial;
    public getTransactionType;
    public nonSalesTransaction;
    public getListOfNonSalesTransaction;
    public getPOsSessionBillList;
    public posSessionClose;
    public viewSessionBillPayment;
    public paymentEvent;
    public nonSalesTransactionForDelete;
    public posSessionClosingSave;
    public submitPOSSession;
    public getBranch;
    public getPOSSessionWork;
    public sessionClosingVarification;
    public updateSessionClosingObject;
    public getlistOfAllAction;
    public varificationPOSSession;
    public approveForPOSSession;
    public rejectForPOSSession;
    public statusList;
    public getPOSSessionBillListByCashierId;
    public getCashierByBranch;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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


    getBranchList() {
        return this.getBranch.query().$promise;
    }

    //this service used for submit pos session closing. -An
    submitPOSSessionCosing(resource: Model.PosSessionModel) {
        return this.submitPOSSession.save(resource).$promise;
    }
   
    //this service used for get cashier list. -An
    getCashierList() {
        return this.getCashier.query().$promise;
    }

    //this service used for get cashier Detail. -An
    getcashierDetial(cashierId) {
        return this.cashierDetial.get({ cashierId: cashierId }).$promise;
    }

    //this service used for get all transaction type. -An
    getAllTransactionType() {
        return this.getTransactionType.query().$promise;
    }

    //this service used for insert non slaes transaction. -An
    addNewNonSalesTransaction(resource: Model.PosNonSaleTransactionModel) {
        return this.nonSalesTransaction.save(resource).$promise;
    }

    //this service used for get non sales transaction list. -An
    getNonSalesTransactionList(id) {
        return this.getListOfNonSalesTransaction.query({ id: id }).$promise;
    }

    //this service used for get list of pos sessoin bill. -An
    getListOfPOSSessionBill() {
        return this.getPOsSessionBillList.query().$promise;
    }

    //this service used for get list of pos sessoin bill by cashierId. -An
    getListOfPOSSessionBillCashierId(id,byuser) {
        return this.getPOSSessionBillListByCashierId.query({ id: id,byuser:byuser }).$promise;
    }

    //this service used for get session bill payment detail by id.-An
    viewSessionBillPaymentDetail(id) {
        return this.viewSessionBillPayment.query({ id: id }).$promise;
    }

    //this service used for update payment type.- An
    changePaymentEvent(resource: Model.POSSessionBillModel) {
        return this.paymentEvent.save(resource).$promise;
    }

    //this service used for delete non sales payment. -An
    deleteNonSalesTransaction(id) {
        return this.nonSalesTransactionForDelete.get({ id: id }).$promise;
    }

    //this service used foe save pos session closing. -An
    savePOSSessionClosing(resource: Model.PosSessionModel) {
        return this.posSessionClosingSave.save(resource).$promise;
    }

    //this service used for get pos session work list. -An
    getPOSSessionWorkList() {
        return this.getPOSSessionWork.query().$promise;
    }

    //this service used for get Session Closing Varification by id. -An
    getSessionClosingVarification(id) {
        return this.sessionClosingVarification.get({ id: id }).$promise;
    }

    //this service used update session closing. -An
    updateSessionClosing(resource: Model.PosSessionModel) {
        return this.updateSessionClosingObject.save(resource).$promise;
    }

    //this service used for get lis of all action. -An
    getActionList(id) {
        return this.getlistOfAllAction.query({ id: id }).$promise;
    }

    //this service used for pos session varification. -An
    varificationButtonEvent(resource: Model.POSApprovalModel) {
        return this.varificationPOSSession.save(resource).$promise;
    }

    //this service used for pos session approve. -An 
    approvePOSSession(resource: Model.POSApprovalModel) {
        return this.approveForPOSSession.save(resource).$promise;
    }

    //this service used for pos session reject. An
    rejectPOSSession(resource: Model.POSApprovalModel) {
        return this.rejectForPOSSession.save(resource).$promise;
    }

    //this service used for get cashier by branch
    getCashierListByBranch() {
        return this.getCashierByBranch.query().$promise;
    }

}

app.service(POSSessionService.serviceId, ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new POSSessionService($resource, $q, $log);
}]);


interface IReturnBillService {
    getBillDetailByBillNumber: (billNumber) => void;
    getBranchList: () => void;
    getPOSBillList: () => void;
    submitPOSBill: (resource) => void;
    getReturnBillListByBillNumber: (billNumber: string) => void;
    checkAllowReturnToAnotherBranch: () => void;
    deleteReturnBillItem: (billNumber: string) => void;
    getReturnBillRecipt: (returnBillNumber: string) => void;
    getBillDetailByBillNumberByBranchId: (billNumber: string, branchId: number) => void;
    getPOSBillListByBranchId: (branchId: number) => void;
    getReturnBillDetailList: () => void;
}

class ReturnBillService implements IReturnBillService {
    static serviceId = "ReturnBillService";
    public billDetail;
    public $resource;
    public getBranch;
    public getPOSBill;
    public submitPOS;
    public getReturnBillList;
    public checkAllowReturnAnotherBranch;
    public deleteRetunrBill;
    public returnBillRecipt;
    public billDetailByBillNumberByBranch;
    public posBillListByBranchId;
    public getReturnBillDetail;


    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
        this.$resource = $resource;
        this.billDetail = this.$resource(apiPaths.returnBillDetailById);
        this.getBranch = this.$resource(apiPaths.getListOfBranch);
        this.getPOSBill = this.$resource(apiPaths.getPOSBillList);
        this.submitPOS = this.$resource(apiPaths.submitPOSBill);
        this.getReturnBillList = this.$resource(apiPaths.getReturnBillList);
        this.checkAllowReturnAnotherBranch = this.$resource(apiPaths.checkAllowToAnotherBranch);
        this.deleteRetunrBill = this.$resource(apiPaths.deleteReturnBill);
        this.returnBillRecipt = this.$resource(apiPaths.getReturnBillReceipt);
        this.billDetailByBillNumberByBranch = this.$resource(apiPaths.billDetailByBillNumberByBranch);
        this.posBillListByBranchId = this.$resource(apiPaths.posBillListByBranchId);
        this.getReturnBillDetail = this.$resource(apiPaths.getReturnBillDetail);
    }

    //this service used for get bill detail by bill number. -An
    getBillDetailByBillNumber(billNumber) {
        return this.billDetail.get({ billNumber: billNumber }).$promise;
    }

    //this service used for get user roles. -An
    getBranchList() {
        return this.getBranch.query().$promise;
    }

    //this service used for get pos bill list. -An
    getPOSBillList() {
        return this.getPOSBill.query().$promise;
    }

    getPOSBillListByBranchId(branchId) {
        return this.posBillListByBranchId.query({ branchId: branchId }).$promise;
    }

    //this service used for submit pos bill. -An
    submitPOSBill(resource: Model.POSReturnBillModel) {
        return this.submitPOS.save(resource).$promise;
    }

    //this service used for get return bill list by bill number. -An
    getReturnBillListByBillNumber(billNumber) {
        return this.getReturnBillList.query({ billNumber: billNumber }).$promise;
    }

    //this service used for check allow return to another branch or not. -An
    checkAllowReturnToAnotherBranch() {
        return this.checkAllowReturnAnotherBranch.get().$promise;
    }

    //this service used for delete return bill item. -An
    deleteReturnBillItem(billNumber) {
        return this.deleteRetunrBill.get({ billNumber: billNumber }).$promise;
    }

    //this service used for get Return Bill Receipt. -An
    getReturnBillRecipt(returnBillNumber) {
        return this.returnBillRecipt.get({ returnBillNumber: returnBillNumber }).$promise;
    }

    //this service used fr get bill detail by bill number and branch id. -An
    getBillDetailByBillNumberByBranchId(billNumber, branchId) {
        return this.billDetailByBillNumberByBranch.get({ billNumber: billNumber, branchId: branchId }).$promise;
    }

    //this service used for return bill detail list. -An
    getReturnBillDetailList() {
        return this.getReturnBillDetail.query().$promise;
    }
}

app.service(ReturnBillService.serviceId, ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new ReturnBillService($resource, $q, $log);
}]);
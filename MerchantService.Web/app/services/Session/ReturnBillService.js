var ReturnBillService = (function () {
    function ReturnBillService($resource, $q, $log) {
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
    ReturnBillService.prototype.getBillDetailByBillNumber = function (billNumber) {
        return this.billDetail.get({ billNumber: billNumber }).$promise;
    };
    //this service used for get user roles. -An
    ReturnBillService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //this service used for get pos bill list. -An
    ReturnBillService.prototype.getPOSBillList = function () {
        return this.getPOSBill.query().$promise;
    };
    ReturnBillService.prototype.getPOSBillListByBranchId = function (branchId) {
        return this.posBillListByBranchId.query({ branchId: branchId }).$promise;
    };
    //this service used for submit pos bill. -An
    ReturnBillService.prototype.submitPOSBill = function (resource) {
        return this.submitPOS.save(resource).$promise;
    };
    //this service used for get return bill list by bill number. -An
    ReturnBillService.prototype.getReturnBillListByBillNumber = function (billNumber) {
        return this.getReturnBillList.query({ billNumber: billNumber }).$promise;
    };
    //this service used for check allow return to another branch or not. -An
    ReturnBillService.prototype.checkAllowReturnToAnotherBranch = function () {
        return this.checkAllowReturnAnotherBranch.get().$promise;
    };
    //this service used for delete return bill item. -An
    ReturnBillService.prototype.deleteReturnBillItem = function (billNumber) {
        return this.deleteRetunrBill.get({ billNumber: billNumber }).$promise;
    };
    //this service used for get Return Bill Receipt. -An
    ReturnBillService.prototype.getReturnBillRecipt = function (returnBillNumber) {
        return this.returnBillRecipt.get({ returnBillNumber: returnBillNumber }).$promise;
    };
    //this service used fr get bill detail by bill number and branch id. -An
    ReturnBillService.prototype.getBillDetailByBillNumberByBranchId = function (billNumber, branchId) {
        return this.billDetailByBillNumberByBranch.get({ billNumber: billNumber, branchId: branchId }).$promise;
    };
    //this service used for return bill detail list. -An
    ReturnBillService.prototype.getReturnBillDetailList = function () {
        return this.getReturnBillDetail.query().$promise;
    };
    return ReturnBillService;
}());
ReturnBillService.serviceId = "ReturnBillService";
app.service(ReturnBillService.serviceId, ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new ReturnBillService($resource, $q, $log);
    }]);
//# sourceMappingURL=ReturnBillService.js.map
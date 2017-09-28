// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var CustomerService = (function () {
    function CustomerService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.$log.log('Customer Services Call');
        this.addCustomer = this.$resource(apiPaths.addNewCustomerDetails);
        this.getCustomer = this.$resource(apiPaths.getAllCustomerList);
        this.viewCustomerDetails = this.$resource(apiPaths.viewCustomerDetailsById);
        this.approveAndRejectRequest = this.$resource(apiPaths.customerRequestApproval, { workFLowLog: "@workFlowLog" }, { update: { method: "PUT" } });
        this.resubmitRequest = this.$resource(apiPaths.reSubmitCustomerInformation, { customerDetails: "@customerDetails" }, { update: { method: "PUT" } });
        this.deleteCustomerInfo = this.$resource(apiPaths.deleteCustomerDetail);
        this.updateInformation = this.$resource(apiPaths.updateCustomerInformation, { customerProfile: "@customerProfile" }, { update: { method: "PUT" } });
        this.customerInformation = this.$resource(apiPaths.saveBalanceAmount, { customerInfo: "@customerInfo" }, { update: { method: "PUT" } });
        this.getCode = this.$resource(apiPaths.getMembershipCode);
        this.getNumber = this.$resource(apiPaths.checkNumberAlreadyExistOrNot);
    }
    CustomerService.prototype.addNewCustomerDetails = function (customerProfile) {
        return this.addCustomer.save(customerProfile).$promise;
    };
    CustomerService.prototype.getAllCustomerList = function () {
        return this.getCustomer.query().$promise;
    };
    CustomerService.prototype.viewCustomerDetailsById = function (customerId) {
        return this.viewCustomerDetails.get({ customerId: customerId }).$promise;
    };
    CustomerService.prototype.customerRequestApproval = function (workFlowLog) {
        return this.approveAndRejectRequest.update(workFlowLog).$promise;
    };
    CustomerService.prototype.reSubmitCustomerInformation = function (customerDetail) {
        return this.resubmitRequest.update(customerDetail).$promise;
    };
    CustomerService.prototype.deleteCustomerDetail = function (customerId) {
        return this.deleteCustomerInfo.get({ customerId: customerId }).$promise;
    };
    CustomerService.prototype.updateCustomerInformation = function (customerProfile) {
        return this.updateInformation.update(customerProfile).$promise;
    };
    CustomerService.prototype.getMembershipCode = function () {
        return this.getCode.get().$promise;
    };
    CustomerService.prototype.checkNumberAlreadyExistOrNot = function (customerProfile) {
        return this.getNumber.save(customerProfile).$promise;
    };
    CustomerService.prototype.saveBalanceAmount = function (customerInfo) {
        return this.customerInformation.update(customerInfo).$promise;
    };
    return CustomerService;
}());
app.service("CustomerService", ['$resource', '$log', function ($resource, $log) {
        return new CustomerService($resource, $log);
    }]);
//# sourceMappingURL=customerService.js.map
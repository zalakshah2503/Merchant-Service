// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IcustomerService {
    addNewCustomerDetails: (customerProfile: any) => void;
    getAllCustomerList: () => void;
    viewCustomerDetailsById: (customerId) => void;
    customerRequestApproval: (workFlowLog: Model.WorkFlowLog) => void;
    reSubmitCustomerInformation: (customerDetails: Model.CustomerProfile) => void;
    deleteCustomerDetail: (customerId: number) => void;
    updateCustomerInformation: (customerProfile: Model.CustomerProfile) => void;
    getMembershipCode: () => void;
    checkNumberAlreadyExistOrNot: (customerProfile: Model.CustomerProfile) => void;
    saveBalanceAmount: (customerInfo : Model.CustomerProfile)=> void;
    }
    
class CustomerService implements IcustomerService {
    private $resource;
    private $log;
    public addCustomer;
    public getCustomer;
    public viewCustomerDetails;
    public approveAndRejectRequest;
    public resubmitRequest;
    public deleteCustomerInfo;
    public updateInformation;
    public getCode;
    public getNumber;
    public customerInformation;
        constructor($resource: ng.resource.IResourceService,$log:ng.ILogService) {
            this.$resource = $resource;
            this.$log = $log;
            this.$log.log('Customer Services Call');
            this.addCustomer = this.$resource(apiPaths.addNewCustomerDetails);
            this.getCustomer = this.$resource(apiPaths.getAllCustomerList);
            this.viewCustomerDetails = this.$resource(apiPaths.viewCustomerDetailsById);
            this.approveAndRejectRequest = this.$resource(apiPaths.customerRequestApproval, {workFLowLog :"@workFlowLog"}, { update: {method:"PUT"} });
            this.resubmitRequest = this.$resource(apiPaths.reSubmitCustomerInformation, { customerDetails: "@customerDetails" }, { update: { method: "PUT" } });
            this.deleteCustomerInfo = this.$resource(apiPaths.deleteCustomerDetail);
            this.updateInformation = this.$resource(apiPaths.updateCustomerInformation, { customerProfile: "@customerProfile" }, { update: {method:"PUT"}});
            this.customerInformation = this.$resource(apiPaths.saveBalanceAmount, { customerInfo: "@customerInfo" }, { update: { method: "PUT" } });
            this.getCode = this.$resource(apiPaths.getMembershipCode);
            this.getNumber = this.$resource(apiPaths.checkNumberAlreadyExistOrNot);
        }

        addNewCustomerDetails(customerProfile) {
            return this.addCustomer.save(customerProfile).$promise;
        }
        getAllCustomerList() {
            return this.getCustomer.query().$promise;
        }

        viewCustomerDetailsById(customerId) {
            return this.viewCustomerDetails.get({ customerId: customerId }).$promise;
        }

        customerRequestApproval(workFlowLog) {
            return this.approveAndRejectRequest.update(workFlowLog).$promise;
        }

        reSubmitCustomerInformation(customerDetail) {
            return this.resubmitRequest.update(customerDetail).$promise;
        }

        deleteCustomerDetail(customerId) {
            return this.deleteCustomerInfo.get({customerId : customerId}).$promise;
        }

        updateCustomerInformation(customerProfile) {
            return this.updateInformation.update(customerProfile).$promise;
        }

        getMembershipCode() {
            return this.getCode.get().$promise;
        }

        checkNumberAlreadyExistOrNot(customerProfile) {
            return this.getNumber.save(customerProfile).$promise;
        }


        saveBalanceAmount(customerInfo) {
            return this.customerInformation.update(customerInfo).$promise;
        }
    }

app.service("CustomerService", ['$resource','$log', ($resource,$log) => {
    return new CustomerService($resource,$log);
}]);

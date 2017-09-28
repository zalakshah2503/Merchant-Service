// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
interface IcustomerControllerScope extends ng.IScope {
    addNewCustomer: Function;
    addNewCustomerDetails: Function;
    customerProfile: any;
    priceCategoryCollection: any;
    changeAmountLimit: Function;
    changeBalanceAmountLimit: Function;
    isAmountLimitDisable: boolean;
    isBalanceAmountLimitDisable: boolean;
    phoneRequired: string;
    phoneInvalid: string;
    customerNameRequired: string;
    getAllCustomerList: Function;
    itemsPerPage: number;
    currentPage: number;
    maxSize: number;
    serachFilter: number;
    entryLimit: number;
    totalCollection: any;
    customerCollection: any;
    totalItems: any;
    searchcustomerDetails: Function;
    customerTotalCollection: any;
    errorMessage: string;
    customerErrorMessageDisplay: boolean;
    search: any;
    mobileNumberInvalid: string;
    zipCodeInvalid: string;
    faxInvalid: string;
    emailIdInvalid: string;
    amountLimitInvalid: string;
    balanceAmountInvalid: string;
    cancelCunstomerInformation: Function;
    deletecustomerInformation: Function;
    updateCustomerInformation: Function;
    closeCustomerDeleteDialogbox: Function;
    viewCustomerInformation: Function;
    closeCustomerViewDialogbox: Function;
    isCustomerNameExist: boolean;
    customerErrorMessage: string;
    isViewDetailDialogBoxOpen: boolean;
    customerRequestApproveAndReject: Function;
    workFlowLogDetails: any;
    resubmitCustomerRequest: Function;
    customerDetailsDialogBox: Function;
    isUserDetailsLoading: boolean;
    updateCustomerInfo: any;
    customerInfoDetailsById: Function;
    checkNumberAlreadyExistOrNot: Function;
    isCustomerMobileNumberExist: boolean;
    addBalanceAmountLimit: Function;
    customerInfo: any;
    closeBalanceAmountLimitDialogBox: Function;
    saveBalanceAmount: Function;
    isDataLoading: boolean;
    ValidMobileNoMessage: any;
    ExistMobileNoMesssage: any;
    ValidPhoneNoMessage: any;
}

interface IcustomerController {

}

class CustomerController implements IcustomerController {
    static controllerId = "CustomerController";
    public openCustomerDeleteDialogbox;
    public openCustomerViewDialogbox;
    public openBalaceAmountDialogbox;
    constructor(private $scope: IcustomerControllerScope, private $log: ng.ILogService, private $location: ng.ILocationService, private customerService: CustomerService, public $rootScope, public $routeParams, private apiPath, public $modal, public filterFilter, public ngToast, public printer) {
        this.$scope.addNewCustomer = () => this.addNewCustomer();
        this.$scope.addNewCustomerDetails = (customerProfile: Model.CustomerProfile) => this.addNewCustomerDetails(customerProfile);
        this.$scope.customerProfile = new Model.CustomerProfile();
        this.$scope.priceCategoryCollection = stringConstants.priceCategoryCollection ;
        this.$scope.changeAmountLimit = (amount: number) => this.changeAmountLimit(amount);
        this.$scope.changeBalanceAmountLimit = (balance: number) => this.changeBalanceAmountLimit(balance);
        this.$scope.isAmountLimitDisable = false;
        this.$scope.isBalanceAmountLimitDisable = false;
        this.$scope.phoneRequired = stringConstants.mobileNumberRequired;
        this.$scope.phoneInvalid = stringConstants.phonesInvalid;
        this.$scope.mobileNumberInvalid = stringConstants.mobileNumberInvalid;
        this.$scope.customerNameRequired = stringConstants.customerNameRequired;
        this.$scope.customerProfile.PriceCategory = this.$scope.priceCategoryCollection[0].Id;
        this.$scope.getAllCustomerList = () => this.getAllCustomerList();
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.totalCollection = [];
        this.$scope.customerCollection = [];
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.customerCollection.slice(begin, end);
        });
        this.$scope.customerTotalCollection = [];
        this.$scope.searchcustomerDetails = () => this.searchcustomerDetails();
        this.$scope.errorMessage = "";
        this.$scope.customerErrorMessageDisplay = false;
        this.$scope.search = new Model.CustomerProfile();
        this.$scope.zipCodeInvalid = stringConstants.zipCodeInvalid;
        this.$scope.faxInvalid = stringConstants.faxInvalid;
        this.$scope.emailIdInvalid = stringConstants.emailIdInvalid;
        this.$scope.amountLimitInvalid = stringConstants.amountLimitInvalid;
        this.$scope.balanceAmountInvalid = stringConstants.balanceAmountInvalid;
        this.$scope.cancelCunstomerInformation = () => this.cancelCunstomerInformation();
        this.$scope.deletecustomerInformation = (customer: Model.CustomerProfile) => this.deletecustomerInformation(customer);
        this.$scope.updateCustomerInformation = (customerProfile: Model.CustomerProfile) => this.updateCustomerInformation(customerProfile);
        this.$scope.closeCustomerDeleteDialogbox = () => this.closeCustomerDeleteDialogbox();
        this.$scope.viewCustomerInformation = (customer: Model.CustomerProfile) => this.viewCustomerInformation(customer);
        this.$scope.closeCustomerViewDialogbox = () => this.closeCustomerViewDialogbox();
        this.$scope.isCustomerNameExist = false;
        this.$rootScope.isLoading = false;
        this.$scope.customerErrorMessage = "";
        this.$scope.isViewDetailDialogBoxOpen = false;
        this.$scope.customerRequestApproveAndReject = (customerProfile: Model.CustomerProfile, status: boolean) => this.customerRequestApproveAndReject(customerProfile, status);
        this.$scope.workFlowLogDetails = new Model.WorkFlowLog();
        this.$scope.resubmitCustomerRequest = (customerProfile: Model.CustomerProfile) => this.resubmitCustomerRequest(customerProfile);
        this.$scope.customerDetailsDialogBox = (customer: Model.CustomerProfile) => this.customerDetailsDialogBox(customer);
        this.$scope.isUserDetailsLoading = false;
        this.$scope.updateCustomerInfo = new Model.CustomerProfile();
        this.$scope.customerInfoDetailsById = () => this.customerInfoDetailsById();
        this.$scope.checkNumberAlreadyExistOrNot = (customerProfile: Model.CustomerProfile) => this.checkNumberAlreadyExistOrNot(customerProfile);
        this.$scope.isCustomerMobileNumberExist = false;
        this.$scope.addBalanceAmountLimit = (customerProfile: Model.CustomerProfile) => this.addBalanceAmountLimit(customerProfile);
        this.$scope.customerInfo = new Model.CustomerProfile();
        this.$scope.closeBalanceAmountLimitDialogBox = () => this.closeBalanceAmountLimitDialogBox();
        this.$scope.saveBalanceAmount = (customerInfo: Model.CustomerProfile) => this.saveBalanceAmount(customerInfo);
        this.$scope.isDataLoading = false;
        this.$scope.ValidMobileNoMessage = stringConstants.ValidMobileNoMessage;
        this.$scope.ExistMobileNoMesssage = stringConstants.ExistMobileNoMesssage;
        this.$scope.ValidPhoneNoMessage = stringConstants.ValidPhoneNoMessage;
        this.initialization();
    }

    private initialization() {
        if (this.$routeParams.id === null || this.$routeParams.id === undefined || this.$routeParams.id === "") {
            this.getMembershipCode();
        }
    }

    private getMembershipCode() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.customerService.getMembershipCode();
        promise.then((result) => {
            controllerScope.customerProfile = new Model.CustomerProfile();
            controllerScope.customerProfile.MembershipCode = result.code;
            controllerScope.customerProfile.PriceCategory = this.$scope.priceCategoryCollection[0].Id;
            controllerRootScope.isLoading = false;
        });

    }

    private addNewCustomer() {
        this.$location.path("/AddNewCustomer");
    }

    private addNewCustomerDetails(customerProfile) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.customerService.addNewCustomerDetails(customerProfile);
        promise.then((result) => {
            this.$log.log("add new customer successfully");
            controllerScope.isBalanceAmountLimitDisable = false;
            controllerScope.isAmountLimitDisable = false;
            controllerRootScope.isLoading = false;
            if (result.status === "Work Flow Not Created") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.workFlowNotCreated
                    });
            } else if (result.status === "Not Allow Permission") {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NoPermission
                    });
            } else {
                this.ngToast.create(
                    {
                        className: 'success',
                        content: stringConstants.customerProfile
                    });
                this.$location.path("/CustomerWorkList");
            }



        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });;
    }

    private changeAmountLimit(amount) {
        let controllerScope = this.$scope;
        if (amount === "") {
            controllerScope.isBalanceAmountLimitDisable = false;
        }
        else {
            controllerScope.isBalanceAmountLimitDisable = true;
        }

    }

    private changeBalanceAmountLimit(balance) {
        let controllerScope = this.$scope;
        if (balance === "") {
            controllerScope.isAmountLimitDisable = false;
        }
        else {
            controllerScope.isAmountLimitDisable = true;
        }

    }

    private getAllCustomerList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.customerCollection = [];
        let customerlist = controllerScope.customerCollection;
        let promise = this.customerService.getAllCustomerList();
        promise.then((result) => {
            this.$log.log("get all customer list successfully", result);
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.customerErrorMessageDisplay = true;
                controllerScope.isDataLoading = false;
            } else {
                for (let i = 0; i < result.length; i++) {
                    customerlist.push(result[i]);
                }
                controllerScope.customerTotalCollection = customerlist;
                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = customerlist.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.customerCollection.length;
                controllerScope.isDataLoading = false;
            }
        }).catch((error) => {
            this.$log.log(error);
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.customerErrorMessageDisplay = true;
                controllerScope.isDataLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });;

    }

    private searchcustomerDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.customerCollection = this.filterFilter((controllerScope.customerTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.customerCollection.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.customerErrorMessageDisplay = true;
            controllerScope.search = new Model.CustomerProfile();
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.customerCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.customerCollection.length;
            controllerScope.search = new Model.CustomerProfile();
            controllerScope.customerErrorMessageDisplay = false;
        }
    }



    private cancelCunstomerInformation() {
        let controllerScope: any = this.$scope;
        controllerScope.addCustomer.$setPristine();
        controllerScope.addCustomer.$setValidity();
        controllerScope.addCustomer.$setUntouched();
        this.$location.path("/CustomerWorkList");
    }

    private updateCustomerInformation(customerInformation) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isUserDetailsLoading = true;
        let promise = this.customerService.updateCustomerInformation(customerInformation);
        promise.then((result) => {
            if (result.isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
            }
            else {
                this.$log.log('update information successfully');
                controllerScope.isUserDetailsLoading = false;
                //  this.getAllCustomerList();
                this.closeCustomerViewDialogbox();
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });


    }

    private deletecustomerInformation(custommer) {
        let controllerScope = this.$scope;
        controllerScope.isUserDetailsLoading = true;
        let promise = this.customerService.deleteCustomerDetail(custommer.CustomerId);
        promise.then((result) => {
            this.$log.log('Delete CustomerInformation successfully', result);
            this.getAllCustomerList();
            this.closeCustomerDeleteDialogbox();
            controllerScope.isUserDetailsLoading = false;
        });

    }

    private closeCustomerDeleteDialogbox() {
        this.openCustomerDeleteDialogbox.dismiss('cancel');
    }

    private viewCustomerInformation(customer) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;

        if (!controllerScope.isViewDetailDialogBoxOpen) {
            controllerScope.isViewDetailDialogBoxOpen = true;
            this.$location.path("/CustomerDetails/" + customer.CustomerId);
        }
    }

    private closeCustomerViewDialogbox() {
        //this.openCustomerViewDialogbox.dismiss('cancel');
        this.$location.path("/CustomerWorkList");
    }

    private customerRequestApproveAndReject(customer, status) {
        let controllerScope = this.$scope;
        let controolerRootScope = this.$rootScope;
        controolerRootScope.isLoading = true;
        let workFlowLog = new Model.WorkFlowLog();
        workFlowLog.Status = status;
        workFlowLog.Comment = customer.Comments;
        workFlowLog.RecordId = customer.RecordId;
        let promise = this.customerService.customerRequestApproval(workFlowLog);
        promise.then((result) => {
            if (result.isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
            }
            else {
                this.$log.log("customer request approval successfully");
                this.closeCustomerViewDialogbox();
                this.getAllCustomerList();
            }
            controolerRootScope.isLoading = false;
        });

    }

    private resubmitCustomerRequest(customerProfile) {
        let controllerScope = this.$scope;
        controllerScope.isUserDetailsLoading = true;
        let promise = this.customerService.reSubmitCustomerInformation(customerProfile);
        promise.then((result) => {
            if (result.isResult === stringConstants.alreadyActivityProcessed) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.alreadyActivityDone
                    });
            } else {
                this.$log.log("customer request approval successfully");
                this.closeCustomerViewDialogbox();
                this.getAllCustomerList();
            }
            controllerScope.isUserDetailsLoading = false;
        });
    }

    private customerDetailsDialogBox(customer) {
        let controllerScope = this.$scope;
        this.openCustomerDeleteDialogbox = this.$modal.open({
            templateUrl: 'customerDetailsConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.customerProfile = customer;
    }

    private customerInfoDetailsById() {
        let customerId = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.isUserDetailsLoading = true;

        let promise = this.customerService.viewCustomerDetailsById(customerId);
        promise.then((result) => {
            if (controllerRootScope.merchatSettings.IsAllowToReview) {
                if (result.IsUpdated) {
                    controllerScope.customerProfile = result.UpdateInformation;
                    controllerScope.customerProfile.WorkFlowAction = result.WorkFlowAction;
                    controllerScope.updateCustomerInfo = result;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                } else {
                    controllerScope.customerProfile = result;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                }
            } else {
                if (result.IsUpdated) {
                    controllerScope.customerProfile = result.UpdateInformation;
                    controllerScope.customerProfile.WorkFlowAction = result.WorkFlowAction;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                } else {
                    controllerScope.customerProfile = result;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                }
            }
        });


    }

    private checkNumberAlreadyExistOrNot(customerProfile) {
        let controllerScope = this.$scope;
        let promise = this.customerService.checkNumberAlreadyExistOrNot(customerProfile);
        promise.then((result) => {
            if (result.status) {
                controllerScope.isCustomerMobileNumberExist = true;
            } else {
                controllerScope.isCustomerMobileNumberExist = false;
            }
        }).catch((error) => {
            this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(this.apiPath);

        });
    }

    private addBalanceAmountLimit(customerProfile) {
        let controllerScope = this.$scope;
        controllerScope.customerInfo = new Model.CustomerProfile();
        this.openBalaceAmountDialogbox = this.$modal.open({
            templateUrl: 'balanceAmountConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.customerInfo = customerProfile;
        controllerScope.customerInfo.CustomerBalanceAmount = "";
    }

    private closeBalanceAmountLimitDialogBox() {
        this.openBalaceAmountDialogbox.dismiss('cancel');

    }

    private saveBalanceAmount(customerInfo) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        if (customerInfo.CustomerBalanceAmount === "") {
            return;
        } else {
            controllerRootScope.isLoading = true;
            customerInfo.BalanceAmount = customerInfo.CustomerBalanceAmount;
            controllerScope.isUserDetailsLoading = true;
            let promise = this.customerService.saveBalanceAmount(customerInfo);
            promise.then((result) => {
                this.$log.log('update information successfully', result);
                controllerScope.isUserDetailsLoading = false;
                controllerRootScope.isLoading = false;
                this.customerInfoDetailsById();
                controllerScope.customerInfo = new Model.CustomerProfile();
                this.closeBalanceAmountLimitDialogBox();
                this.printer.print("/Templates/Customer/CustomerPaymentReceipt.html", result);
            }).catch((error) => {
                location.replace(this.apiPath);
                this.$log.log(error);
            });
        }

    }
}

app.controller(CustomerController.controllerId, ['$scope', '$log', '$location', 'CustomerService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', 'printer', ($scope, $log, $location, CustomerService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, printer) => {
    return new CustomerController($scope, $log, $location, CustomerService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, printer);
}]);

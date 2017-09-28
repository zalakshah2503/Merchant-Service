var CustomerController = (function () {
    function CustomerController($scope, $log, $location, customerService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, printer) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$location = $location;
        this.customerService = customerService;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.ngToast = ngToast;
        this.printer = printer;
        this.$scope.addNewCustomer = function () { return _this.addNewCustomer(); };
        this.$scope.addNewCustomerDetails = function (customerProfile) { return _this.addNewCustomerDetails(customerProfile); };
        this.$scope.customerProfile = new Model.CustomerProfile();
        this.$scope.priceCategoryCollection = stringConstants.priceCategoryCollection;
        this.$scope.changeAmountLimit = function (amount) { return _this.changeAmountLimit(amount); };
        this.$scope.changeBalanceAmountLimit = function (balance) { return _this.changeBalanceAmountLimit(balance); };
        this.$scope.isAmountLimitDisable = false;
        this.$scope.isBalanceAmountLimitDisable = false;
        this.$scope.phoneRequired = stringConstants.mobileNumberRequired;
        this.$scope.phoneInvalid = stringConstants.phonesInvalid;
        this.$scope.mobileNumberInvalid = stringConstants.mobileNumberInvalid;
        this.$scope.customerNameRequired = stringConstants.customerNameRequired;
        this.$scope.customerProfile.PriceCategory = this.$scope.priceCategoryCollection[0].Id;
        this.$scope.getAllCustomerList = function () { return _this.getAllCustomerList(); };
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.totalCollection = [];
        this.$scope.customerCollection = [];
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.customerCollection.slice(begin, end);
        });
        this.$scope.customerTotalCollection = [];
        this.$scope.searchcustomerDetails = function () { return _this.searchcustomerDetails(); };
        this.$scope.errorMessage = "";
        this.$scope.customerErrorMessageDisplay = false;
        this.$scope.search = new Model.CustomerProfile();
        this.$scope.zipCodeInvalid = stringConstants.zipCodeInvalid;
        this.$scope.faxInvalid = stringConstants.faxInvalid;
        this.$scope.emailIdInvalid = stringConstants.emailIdInvalid;
        this.$scope.amountLimitInvalid = stringConstants.amountLimitInvalid;
        this.$scope.balanceAmountInvalid = stringConstants.balanceAmountInvalid;
        this.$scope.cancelCunstomerInformation = function () { return _this.cancelCunstomerInformation(); };
        this.$scope.deletecustomerInformation = function (customer) { return _this.deletecustomerInformation(customer); };
        this.$scope.updateCustomerInformation = function (customerProfile) { return _this.updateCustomerInformation(customerProfile); };
        this.$scope.closeCustomerDeleteDialogbox = function () { return _this.closeCustomerDeleteDialogbox(); };
        this.$scope.viewCustomerInformation = function (customer) { return _this.viewCustomerInformation(customer); };
        this.$scope.closeCustomerViewDialogbox = function () { return _this.closeCustomerViewDialogbox(); };
        this.$scope.isCustomerNameExist = false;
        this.$rootScope.isLoading = false;
        this.$scope.customerErrorMessage = "";
        this.$scope.isViewDetailDialogBoxOpen = false;
        this.$scope.customerRequestApproveAndReject = function (customerProfile, status) { return _this.customerRequestApproveAndReject(customerProfile, status); };
        this.$scope.workFlowLogDetails = new Model.WorkFlowLog();
        this.$scope.resubmitCustomerRequest = function (customerProfile) { return _this.resubmitCustomerRequest(customerProfile); };
        this.$scope.customerDetailsDialogBox = function (customer) { return _this.customerDetailsDialogBox(customer); };
        this.$scope.isUserDetailsLoading = false;
        this.$scope.updateCustomerInfo = new Model.CustomerProfile();
        this.$scope.customerInfoDetailsById = function () { return _this.customerInfoDetailsById(); };
        this.$scope.checkNumberAlreadyExistOrNot = function (customerProfile) { return _this.checkNumberAlreadyExistOrNot(customerProfile); };
        this.$scope.isCustomerMobileNumberExist = false;
        this.$scope.addBalanceAmountLimit = function (customerProfile) { return _this.addBalanceAmountLimit(customerProfile); };
        this.$scope.customerInfo = new Model.CustomerProfile();
        this.$scope.closeBalanceAmountLimitDialogBox = function () { return _this.closeBalanceAmountLimitDialogBox(); };
        this.$scope.saveBalanceAmount = function (customerInfo) { return _this.saveBalanceAmount(customerInfo); };
        this.$scope.isDataLoading = false;
        this.$scope.ValidMobileNoMessage = stringConstants.ValidMobileNoMessage;
        this.$scope.ExistMobileNoMesssage = stringConstants.ExistMobileNoMesssage;
        this.$scope.ValidPhoneNoMessage = stringConstants.ValidPhoneNoMessage;
        this.initialization();
    }
    CustomerController.prototype.initialization = function () {
        if (this.$routeParams.id === null || this.$routeParams.id === undefined || this.$routeParams.id === "") {
            this.getMembershipCode();
        }
    };
    CustomerController.prototype.getMembershipCode = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.customerService.getMembershipCode();
        promise.then(function (result) {
            controllerScope.customerProfile = new Model.CustomerProfile();
            controllerScope.customerProfile.MembershipCode = result.code;
            controllerScope.customerProfile.PriceCategory = _this.$scope.priceCategoryCollection[0].Id;
            controllerRootScope.isLoading = false;
        });
    };
    CustomerController.prototype.addNewCustomer = function () {
        this.$location.path("/AddNewCustomer");
    };
    CustomerController.prototype.addNewCustomerDetails = function (customerProfile) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.customerService.addNewCustomerDetails(customerProfile);
        promise.then(function (result) {
            _this.$log.log("add new customer successfully");
            controllerScope.isBalanceAmountLimitDisable = false;
            controllerScope.isAmountLimitDisable = false;
            controllerRootScope.isLoading = false;
            if (result.status === "Work Flow Not Created") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.workFlowNotCreated
                });
            }
            else if (result.status === "Not Allow Permission") {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NoPermission
                });
            }
            else {
                _this.ngToast.create({
                    className: 'success',
                    content: stringConstants.customerProfile
                });
                _this.$location.path("/CustomerWorkList");
            }
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
        ;
    };
    CustomerController.prototype.changeAmountLimit = function (amount) {
        var controllerScope = this.$scope;
        if (amount === "") {
            controllerScope.isBalanceAmountLimitDisable = false;
        }
        else {
            controllerScope.isBalanceAmountLimitDisable = true;
        }
    };
    CustomerController.prototype.changeBalanceAmountLimit = function (balance) {
        var controllerScope = this.$scope;
        if (balance === "") {
            controllerScope.isAmountLimitDisable = false;
        }
        else {
            controllerScope.isAmountLimitDisable = true;
        }
    };
    CustomerController.prototype.getAllCustomerList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.customerCollection = [];
        var customerlist = controllerScope.customerCollection;
        var promise = this.customerService.getAllCustomerList();
        promise.then(function (result) {
            _this.$log.log("get all customer list successfully", result);
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.customerErrorMessageDisplay = true;
                controllerScope.isDataLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    customerlist.push(result[i]);
                }
                controllerScope.customerTotalCollection = customerlist;
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = customerlist.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.customerCollection.length;
                controllerScope.isDataLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.customerErrorMessageDisplay = true;
                controllerScope.isDataLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
        ;
    };
    CustomerController.prototype.searchcustomerDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.customerCollection = this.filterFilter((controllerScope.customerTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.customerCollection.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.customerErrorMessageDisplay = true;
            controllerScope.search = new Model.CustomerProfile();
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.customerCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.customerCollection.length;
            controllerScope.search = new Model.CustomerProfile();
            controllerScope.customerErrorMessageDisplay = false;
        }
    };
    CustomerController.prototype.cancelCunstomerInformation = function () {
        var controllerScope = this.$scope;
        controllerScope.addCustomer.$setPristine();
        controllerScope.addCustomer.$setValidity();
        controllerScope.addCustomer.$setUntouched();
        this.$location.path("/CustomerWorkList");
    };
    CustomerController.prototype.updateCustomerInformation = function (customerInformation) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.isUserDetailsLoading = true;
        var promise = this.customerService.updateCustomerInformation(customerInformation);
        promise.then(function (result) {
            if (result.isResult === stringConstants.alreadyActivityProcessed) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            else {
                _this.$log.log('update information successfully');
                controllerScope.isUserDetailsLoading = false;
                //  this.getAllCustomerList();
                _this.closeCustomerViewDialogbox();
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            location.replace(_this.apiPath);
            _this.$log.log(error);
        });
    };
    CustomerController.prototype.deletecustomerInformation = function (custommer) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isUserDetailsLoading = true;
        var promise = this.customerService.deleteCustomerDetail(custommer.CustomerId);
        promise.then(function (result) {
            _this.$log.log('Delete CustomerInformation successfully', result);
            _this.getAllCustomerList();
            _this.closeCustomerDeleteDialogbox();
            controllerScope.isUserDetailsLoading = false;
        });
    };
    CustomerController.prototype.closeCustomerDeleteDialogbox = function () {
        this.openCustomerDeleteDialogbox.dismiss('cancel');
    };
    CustomerController.prototype.viewCustomerInformation = function (customer) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (!controllerScope.isViewDetailDialogBoxOpen) {
            controllerScope.isViewDetailDialogBoxOpen = true;
            this.$location.path("/CustomerDetails/" + customer.CustomerId);
        }
    };
    CustomerController.prototype.closeCustomerViewDialogbox = function () {
        //this.openCustomerViewDialogbox.dismiss('cancel');
        this.$location.path("/CustomerWorkList");
    };
    CustomerController.prototype.customerRequestApproveAndReject = function (customer, status) {
        var _this = this;
        var controllerScope = this.$scope;
        var controolerRootScope = this.$rootScope;
        controolerRootScope.isLoading = true;
        var workFlowLog = new Model.WorkFlowLog();
        workFlowLog.Status = status;
        workFlowLog.Comment = customer.Comments;
        workFlowLog.RecordId = customer.RecordId;
        var promise = this.customerService.customerRequestApproval(workFlowLog);
        promise.then(function (result) {
            if (result.isResult === stringConstants.alreadyActivityProcessed) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            else {
                _this.$log.log("customer request approval successfully");
                _this.closeCustomerViewDialogbox();
                _this.getAllCustomerList();
            }
            controolerRootScope.isLoading = false;
        });
    };
    CustomerController.prototype.resubmitCustomerRequest = function (customerProfile) {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.isUserDetailsLoading = true;
        var promise = this.customerService.reSubmitCustomerInformation(customerProfile);
        promise.then(function (result) {
            if (result.isResult === stringConstants.alreadyActivityProcessed) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.alreadyActivityDone
                });
            }
            else {
                _this.$log.log("customer request approval successfully");
                _this.closeCustomerViewDialogbox();
                _this.getAllCustomerList();
            }
            controllerScope.isUserDetailsLoading = false;
        });
    };
    CustomerController.prototype.customerDetailsDialogBox = function (customer) {
        var controllerScope = this.$scope;
        this.openCustomerDeleteDialogbox = this.$modal.open({
            templateUrl: 'customerDetailsConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.customerProfile = customer;
    };
    CustomerController.prototype.customerInfoDetailsById = function () {
        var customerId = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.isUserDetailsLoading = true;
        var promise = this.customerService.viewCustomerDetailsById(customerId);
        promise.then(function (result) {
            if (controllerRootScope.merchatSettings.IsAllowToReview) {
                if (result.IsUpdated) {
                    controllerScope.customerProfile = result.UpdateInformation;
                    controllerScope.customerProfile.WorkFlowAction = result.WorkFlowAction;
                    controllerScope.updateCustomerInfo = result;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                }
                else {
                    controllerScope.customerProfile = result;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                }
            }
            else {
                if (result.IsUpdated) {
                    controllerScope.customerProfile = result.UpdateInformation;
                    controllerScope.customerProfile.WorkFlowAction = result.WorkFlowAction;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                }
                else {
                    controllerScope.customerProfile = result;
                    controllerScope.isViewDetailDialogBoxOpen = false;
                    controllerScope.isUserDetailsLoading = false;
                    controllerScope.isDataLoading = false;
                }
            }
        });
    };
    CustomerController.prototype.checkNumberAlreadyExistOrNot = function (customerProfile) {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.customerService.checkNumberAlreadyExistOrNot(customerProfile);
        promise.then(function (result) {
            if (result.status) {
                controllerScope.isCustomerMobileNumberExist = true;
            }
            else {
                controllerScope.isCustomerMobileNumberExist = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            //if user is not authenticated that time it will redirect to the login page.
            location.replace(_this.apiPath);
        });
    };
    CustomerController.prototype.addBalanceAmountLimit = function (customerProfile) {
        var controllerScope = this.$scope;
        controllerScope.customerInfo = new Model.CustomerProfile();
        this.openBalaceAmountDialogbox = this.$modal.open({
            templateUrl: 'balanceAmountConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.customerInfo = customerProfile;
        controllerScope.customerInfo.CustomerBalanceAmount = "";
    };
    CustomerController.prototype.closeBalanceAmountLimitDialogBox = function () {
        this.openBalaceAmountDialogbox.dismiss('cancel');
    };
    CustomerController.prototype.saveBalanceAmount = function (customerInfo) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (customerInfo.CustomerBalanceAmount === "") {
            return;
        }
        else {
            controllerRootScope.isLoading = true;
            customerInfo.BalanceAmount = customerInfo.CustomerBalanceAmount;
            controllerScope.isUserDetailsLoading = true;
            var promise = this.customerService.saveBalanceAmount(customerInfo);
            promise.then(function (result) {
                _this.$log.log('update information successfully', result);
                controllerScope.isUserDetailsLoading = false;
                controllerRootScope.isLoading = false;
                _this.customerInfoDetailsById();
                controllerScope.customerInfo = new Model.CustomerProfile();
                _this.closeBalanceAmountLimitDialogBox();
                _this.printer.print("/Templates/Customer/CustomerPaymentReceipt.html", result);
            }).catch(function (error) {
                location.replace(_this.apiPath);
                _this.$log.log(error);
            });
        }
    };
    return CustomerController;
}());
CustomerController.controllerId = "CustomerController";
app.controller(CustomerController.controllerId, ['$scope', '$log', '$location', 'CustomerService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', 'printer', function ($scope, $log, $location, CustomerService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, printer) {
        return new CustomerController($scope, $log, $location, CustomerService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast, printer);
    }]);
//# sourceMappingURL=customerController.js.map
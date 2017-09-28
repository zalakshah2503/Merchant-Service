var CreditNoteController = (function () {
    function CreditNoteController($scope, $log, creditNoteService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, authenticationPath) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.creditNoteService = creditNoteService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$location = $location;
        this.authenticationPath = authenticationPath;
        this.$scope.supplierList = [];
        this.$scope.changeCashCheque = function () { return _this.changeCashCheque(); };
        this.$scope.checkbox = [];
        this.$scope.chekBoxEvent = function (creditNote) { return _this.chekBoxEvent(creditNote); };
        this.$scope.hasChecked = false;
        this.$scope.search = [];
        this.$scope.totalCreditListCollection = [];
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.recevingCreditNote = new Model.RecevingCreditNote();
        this.$scope.recevingCreditNote.Cash = 0;
        this.$scope.recevingCreditNote.TotalAmount = 0;
        this.$scope.recevingCreditNote.Cheque = 0;
        this.$scope.recevingCreditNote.ListOfCreditNotes = [];
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.isChequeNo = false;
        this.$scope.chequeNoRequired = stringConstants.chequeNoRequired;
        this.$scope.receiveClick = function () { return _this.receiveClick(); };
        this.$scope.cancelClick = function () { return _this.cancelClick(); };
        this.$scope.supplierChangeEvent = function () { return _this.supplierChangeEvent(); };
        this.$scope.checkIntegerCheque = function (amount) { return _this.checkIntegerCheque(amount); };
        this.$scope.checkIntegerCash = function (amount) { return _this.checkIntegerCash(amount); };
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.validAmountError = stringConstants.validAmountError;
        var itemPage = this.$scope.$watch("currentPage + itemsPerPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.creditListCollection.slice(begin, end);
        });
        this.Initialize();
    }
    CreditNoteController.prototype.Initialize = function () {
        this.getSupplierList();
    };
    CreditNoteController.prototype.changeCashCheque = function () {
        if (this.$scope.recevingCreditNote.Cheque !== undefined && this.$scope.recevingCreditNote.Cheque !== null && this.$scope.recevingCreditNote.Cash !== undefined && this.$scope.recevingCreditNote.Cash !== null) {
            if (this.$scope.recevingCreditNote.Cheque.toString() !== "" && this.$scope.recevingCreditNote.Cash.toString() !== "")
                this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (parseFloat(this.$scope.recevingCreditNote.Cheque.toString()) + parseFloat(this.$scope.recevingCreditNote.Cash.toString())));
            else {
                if (this.$scope.recevingCreditNote.Cheque.toString() !== "")
                    this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (parseFloat(this.$scope.recevingCreditNote.Cheque.toString())));
                else if (this.$scope.recevingCreditNote.Cash.toString() !== "")
                    this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (parseFloat(this.$scope.recevingCreditNote.Cash.toString())));
                else
                    this.$scope.recevingCreditNote.Diffrents = this.$scope.recevingCreditNote.TotalAmount;
            }
        }
    };
    CreditNoteController.prototype.supplierChangeEvent = function () {
        this.$scope.recevingCreditNote.Cash = 0;
        this.$scope.recevingCreditNote.Cheque = 0;
        this.$scope.recevingCreditNote.ChequeNo = "";
        this.$scope.recevingCreditNote.VoucharNo = "";
        this.$scope.recevingCreditNote.TotalAmount = 0;
        this.$scope.recevingCreditNote.Diffrents = 0;
        this.$scope.recevingCreditNote.ListOfCreditNotes = [];
        this.$scope.recevingCreditNote.Comments = "";
        this.getCreditNoteList(this.$scope.search.SupplierId);
    };
    //this method used for check box event. -An
    CreditNoteController.prototype.chekBoxEvent = function (creditNote) {
        this.$rootScope.isLoading = true;
        var cheque = this.$scope.recevingCreditNote.Cheque.toString();
        var cash = this.$scope.recevingCreditNote.Cash.toString();
        if (creditNote.checked === true) {
            this.$scope.recevingCreditNote.TotalAmount = this.$scope.recevingCreditNote.TotalAmount + (creditNote.RemaningAmount === 0 ? creditNote.Amount : creditNote.RemaningAmount);
            this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (cheque !== "" ? parseFloat(cheque) : 0 + cash !== "" ? parseFloat(cash) : 0));
            this.$scope.recevingCreditNote.ListOfCreditNotes.push(creditNote);
        }
        else {
            this.$scope.recevingCreditNote.TotalAmount = this.$scope.recevingCreditNote.TotalAmount - (creditNote.RemaningAmount === 0 ? creditNote.Amount : creditNote.RemaningAmount);
            this.$scope.recevingCreditNote.Diffrents = (this.$scope.recevingCreditNote.TotalAmount - (cheque !== "" ? parseFloat(cheque) : 0 + cash !== "" ? parseFloat(cash) : 0));
            for (var i = 0; i < this.$scope.recevingCreditNote.ListOfCreditNotes.length; i++) {
                if (this.$scope.recevingCreditNote.ListOfCreditNotes[i] === creditNote) {
                    this.$scope.recevingCreditNote.ListOfCreditNotes.splice(i, 1);
                }
            }
        }
        this.$rootScope.isLoading = false;
    };
    //this method used for get supplier list.
    CreditNoteController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.creditNoteService.getSupplierList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    _this.$scope.supplierList.push({ Name: result[i].NameEn, Id: result[i].Id });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    CreditNoteController.prototype.getCreditNoteList = function (supplierId) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        this.$scope.creditListCollection = [];
        var creditNote = this.$scope.creditListCollection;
        var promise = this.creditNoteService.getCreditNoteList(supplierId);
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    creditNote.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = creditNote.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.creditListCollection.length;
                controllerScope.totalCreditListCollection = controllerScope.creditListCollection;
                controllerScope.errorMessageDisplayForBlankList = false;
            }
            else
                controllerScope.errorMessageDisplayForBlankList = true;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    CreditNoteController.prototype.receiveClick = function () {
        var _this = this;
        this.$rootScope.isLoading = true;
        this.$scope.isChequeNo = false;
        this.$scope.isChequeNo = false;
        var isValid = true;
        if (this.$scope.recevingCreditNote.Cheque !== undefined && this.$scope.recevingCreditNote.Cheque !== null && this.$scope.recevingCreditNote.Cheque !== 0) {
            if (this.$scope.recevingCreditNote.ChequeNo === undefined || this.$scope.recevingCreditNote.ChequeNo === null || this.$scope.recevingCreditNote.ChequeNo === "")
                isValid = false;
        }
        if (isValid) {
            var promise = this.creditNoteService.submitReceivigCreditNote(this.$scope.recevingCreditNote);
            promise.then(function (result) {
                if (result._isResult === true) {
                    _this.ngToast.create(stringConstants.recevingCreditNoteSuccessfully);
                    _this.cancelClick();
                }
                _this.$rootScope.isLoading = false;
            }).catch(function (error) {
                _this.$rootScope.isLoading = false;
                if (error.status !== 500) {
                    //if user is not authenticated that time it will redirect to the login page.
                    location.replace(_this.apiPath);
                }
            });
        }
        else {
            this.$scope.isChequeNo = true;
            this.$rootScope.isLoading = false;
        }
    };
    CreditNoteController.prototype.cancelClick = function () {
        this.$scope.recevingCreditNote = new Model.RecevingCreditNote();
        this.$scope.totalCollection = [];
        this.$scope.search.SupplierId = undefined;
        this.$scope.errorMessageDisplayForBlankList = true;
        this.$scope.isChequeNo = false;
    };
    CreditNoteController.prototype.checkIntegerCash = function (cashAmount) {
        var controllerScope = this.$scope;
        if (cashAmount !== "" && cashAmount !== undefined && cashAmount !== null) {
            if (isNaN(cashAmount)) {
                return true;
            }
            else {
                if (Math.round(cashAmount) === parseInt(cashAmount, 10)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    };
    CreditNoteController.prototype.checkIntegerCheque = function (chequeAmount) {
        if (chequeAmount !== "" && chequeAmount !== undefined && chequeAmount !== null) {
            if (isNaN(chequeAmount)) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    return CreditNoteController;
}());
CreditNoteController.controllerId = "CreditNoteController";
app.controller(CreditNoteController.controllerId, ['$scope', '$log', 'CreditNoteService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', 'authenticationPath', function ($scope, $log, CreditNoteService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath) {
        return new CreditNoteController($scope, $log, CreditNoteService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, authenticationPath);
    }]);
//# sourceMappingURL=creditNoteController.js.map
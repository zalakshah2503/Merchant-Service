/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var CompanyController = (function () {
    //company controller constructor.
    function CompanyController($scope, $location, $log, companyService, $rootScope, $routeParams, apiPath, $modal, ngToast, $timeout) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.$log = $log;
        this.companyService = companyService;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.apiPath = apiPath;
        this.$modal = $modal;
        this.ngToast = ngToast;
        this.$timeout = $timeout;
        this.$scope.tabs = [
            { Id: 1, title: "Company Details", content: 'Templates/Company/CompanyDetailPage.html', disabled: false },
            { Id: 2, title: "Barcode Balance", content: 'Templates/Company/BarcodeBalance.html', disabled: true },
            { Id: 3, title: "Payment Mode", content: 'Templates/Company/PaymentMode.html', disabled: true },
            { Id: 4, title: "Item Return & Invoice Prefix", content: "Templates/Company/ItemReturn.html", disabled: true },
            { Id: 5, title: "Language", content: "Templates/Company/Language.html", disabled: true },
            { Id: 6, title: "Profit Margin", content: "Templates/Company/ProfitMargin.html", disabled: true }
        ];
        this.$scope.normalBarcodeModel = new Model.NormalBarcode();
        this.$scope.balanceBarcodeSection = new Model.BalanceBarcodeSection();
        this.$scope.companyBarcodeConfiguration = new Model.CompanyBarcodeConfiguration();
        this.$scope.listOfBalanceBarcodeConfiguration = [];
        this.$scope.fromNormalBarcodeRequired = stringConstants.fromNormalBarcodeRequired;
        this.$scope.toNormalBarcodeRequired = stringConstants.toNormalBarcodeRequired;
        this.$scope.addNewCompany = function () { return _this.addNewCompany(); };
        this.$scope.noDataFound = stringConstants.errorMessage;
        this.$scope.compantNameRequired = stringConstants.compantNameRequired;
        this.$scope.addressRequired = stringConstants.addressRequired;
        this.$scope.emailInvalid = stringConstants.emailInvalid;
        this.$scope.emailRequired = stringConstants.emailRequired;
        this.$scope.cpoAdditionalCostType = stringConstants.cpoAdditionalCostType;
        this.$scope.phoneInvalid = stringConstants.phoneInvalid;
        this.$scope.phoneMinlength = stringConstants.contactMinlength;
        this.$rootScope.companyDetail = new Model.CompanyDetail();
        this.$rootScope.companyDetail.CashPayment = true;
        this.$rootScope.companyDetail.PriceStartFrom = "First";
        this.$scope.addCompanyDetail = function (companyDetail) { return _this.addCompanyDetail(companyDetail); };
        this.$scope.redirectToNextTab = function () { return _this.redirectToNextTab(); };
        this.$scope.redirectToPreviousTab = function () { return _this.redirectToPreviousTab(); };
        this.$scope.tabCount = 1;
        this.$scope.phoneNumRegx = "^[0-9-+(][0-9-+()]{1,14}$";
        this.$scope.emailRegx = "/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/";
        this.$scope.phoneRequired = stringConstants.phoneRequried;
        this.$scope.faxInvalid = stringConstants.faxInvalid;
        this.$scope.zipCodeInvalid = stringConstants.zipCodeInvalid;
        this.$scope.barcodeInvalid = stringConstants.barcodeInvalid;
        this.$scope.barcodeRequired = stringConstants.barcodeRequired;
        this.$scope.priceDigitInvalid = stringConstants.priceDigitInvalid;
        this.$scope.priceDigitRequired = stringConstants.priceDigitRequired;
        this.$scope.invoiceRequired = stringConstants.invoiceRequired;
        this.$scope.validDueDaysToReturnPurchasedRequired = stringConstants.validDueDaysToReturnPurchasedRequired;
        this.$scope.digitRequired = stringConstants.digitRequired;
        this.$scope.returnInvoiceRequired = stringConstants.returnInvoiceRequired;
        this.$scope.cpoInvoiceRequired = stringConstants.cpoInvoiceRequired;
        this.$scope.spoInvoiceRequired = stringConstants.spoInvoiceRequired;
        this.$scope.itemDestructionRequired = stringConstants.itemDestructionRequired;
        this.$scope.supplierReturnReceiptRequired = stringConstants.supplierReturnReceiptRequired;
        this.$scope.profitMarginRequired = stringConstants.profitMarginRequired;
        this.$scope.specialCharacter = stringConstants.specialCharacter;
        this.$scope.getAllCompanyDetail = function () { return _this.getAllCompanyDetail(); };
        this.$scope.companyCollection = [];
        this.$scope.getCompanyDetailsById = function () { return _this.getCompanyDetailsById(); };
        this.$scope.updateCompanyDetail = function (companyDetail) { return _this.updateCompanyDetail(companyDetail); };
        this.$scope.addBalanceBarcodeSection = function () { return _this.addBalanceBarcodeSection(); };
        this.$scope.editCompanyDetails = function (companyId) { return _this.editCompanyDetails(companyId); };
        this.$rootScope.isPaymentMode = false;
        this.$scope.errorMessage = "";
        this.$scope.languageCollection = [];
        this.$scope.languageSelectRequired = stringConstants.languageSelectRequired;
        this.$scope.companyDetails = [];
        this.$scope.openDeleteCompanyInfoDialogBox = function (company) { return _this.openDeleteCompanyInfoDialogBox(company); };
        this.$scope.closeCompanyDeleteDialogbox = function () { return _this.closeCompanyDeleteDialogbox(); };
        this.$scope.deleteCompanyDetails = function (companyId) { return _this.deleteCompanyDetails(companyId); };
        this.$scope.invoicedigitRequired = stringConstants.invoicedigitRequired;
        this.$scope.cpodigitRequired = stringConstants.cpodigitRequired;
        this.$scope.spodigitRequired = stringConstants.spodigitRequired;
        this.$scope.itemdigitRequired = stringConstants.itemdigitRequired;
        this.$scope.supplierdigitRequired = stringConstants.supplierdigitRequired;
        this.$scope.returnInvoicedigitRequired = stringConstants.returnInvoicedigitRequired;
        this.$rootScope.location = "";
        this.$rootScope.isLoading = false;
        this.$scope.isCompanyNameExist = false;
        this.$scope.companyErrorMessage = "";
        this.$scope.companyAlreadyAdded = false;
        this.$rootScope.systemSetting = new Model.SystemSetting();
        this.$scope.saveSystemSetting = function (systemSetting) { return _this.saveSystemSetting(systemSetting); };
        this.$scope.getSystemSetting = function () { return _this.getSystemSetting(); };
        this.$scope.itemsPerPage = 5;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.totalCollection = [];
        this.$scope.additionalCostType = "";
        this.$scope.cpoId = 0;
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.companyCollection.slice(begin, end);
        });
        this.$scope.companyAlredyAddedMessageDisplay = false;
        this.$scope.changeCreditAccount = function (isCreditAccountPayment) { return _this.changeCreditAccount(isCreditAccountPayment); };
        this.$scope.isAllowCreditAccountLimit = true;
        this.$scope.openHelpDialogBox = function (helpString) { return _this.openHelpDialogBox(helpString); };
        this.$scope.itemReturnhelp = "(E.g. 'Invoice Prefix' = IN , No.Of Digit = 3, Barcode for Invoice = IN23102015001...IN23102015999 Where IN = Prefix, 23102015 = Current Date, 001...999 = Entries)";
        this.$scope.helpString = "";
        this.$scope.closeHelpDialogBox = function () { return _this.closeHelpDialogBox(); };
        this.$scope.barcodeStringHelp = "(e.g. Minimum = 12, Maximum = 12, Price Digit Length = 4, Barcode = 523864313224)";
        this.$scope.isFocusIn = true;
        this.$scope.isCompanyDetailPanel = true;
        this.$scope.isCompanyBarcodePaymentPanel = false;
        this.$scope.isPaymentModePanel = false;
        this.$scope.isItemReturnPanel = false;
        this.$scope.isLanguagePanlel = false;
        this.$scope.isProfitMarginPanel = false;
        this.$scope.saveAdditionalCostType = function () { return _this.saveAdditionalCostType(); };
        this.$scope.editAdditionalCostType = function (id) { return _this.editAdditionalCostType(id); };
        this.$scope.deleteAdditionalCostType = function (id) { return _this.deleteAdditionalCostType(id); };
        this.$scope.additionalCostTypeExist = stringConstants.additionalCostTypeExist;
        this.$scope.isAdditionalCostTypeExist = false;
        this.$scope.startPositionRequired = stringConstants.startPositionRequired;
        this.$scope.lengthRequired = stringConstants.lengthRequired;
        this.$scope.totalCompanyBarcodeLengthRequired = stringConstants.totalCompanyBarcodeLengthRequired;
        this.$scope.deleteBalanceBarcodeSection = function (index) { return _this.deleteBalanceBarcodeSection(index); };
        this.$scope.editBalanceBarcodeSection = function (index) { return _this.editBalanceBarcodeSection(index); };
        this.$scope.deleteBalanceBarcodeDeletePopup = function () { return _this.deleteBalanceBarcodeDeletePopup(); };
        this.$scope.cancelBalanceBarcodeDeletePopup = function () { return _this.cancelBalanceBarcodeDeletePopup(); };
        this.$scope.deleteBalanceBarcodeIndex = 0;
        this.$scope.editBalanceBarcodeIndex = 0;
        this.$scope.isButtonText = "Add";
        this.$scope.checkCompanyBarcodeIsValidorNot = function () { return _this.checkCompanyBarcodeIsValidorNot(); };
        this.$scope.checkNormalBarcodeIsValidorNot = function () { return _this.checkNormalBarcodeIsValidorNot(); };
        this.$scope.checkBarcodeLengthValid = function () { return _this.checkBarcodeLengthValid(); };
        this.$scope.patternValidationMessage = stringConstants.patternValidationMessage;
        this.$scope.isShowForm = true;
        this.initialization();
    }
    CompanyController.prototype.initialization = function () {
        this.getAllLanguage();
        this.getAllCurrencyDetail();
    };
    CompanyController.prototype.cancelBalanceBarcodeDeletePopup = function () {
        this.deleteBarcodePopup.dismiss('cancel');
    };
    CompanyController.prototype.editBalanceBarcodeSection = function (index) {
        this.$scope.editBalanceBarcodeIndex = index;
        this.$scope.balanceBarcodeSection = this.$scope.listOfBalanceBarcodeConfiguration[index];
        this.$scope.isButtonText = "Edit";
        angular.element('html,body').animate({ scrollTop: 100 }, 100);
    };
    CompanyController.prototype.deleteBalanceBarcodeDeletePopup = function () {
        this.$scope.listOfBalanceBarcodeConfiguration.splice(this.$scope.deleteBalanceBarcodeIndex, 1);
        this.deleteBarcodePopup.dismiss('cancel');
    };
    //added balance barcode in list
    CompanyController.prototype.addBalanceBarcodeSection = function () {
        if (this.$scope.balanceBarcodeSection !== null && this.$scope.balanceBarcodeSection !== undefined) {
            var result = this.checkBalanceBarcodeSectionValidation(this.$scope.balanceBarcodeSection);
            if (result === true) {
                //get total length of balance barcode
                var totalLengthforBalanceBarcode = this.getTotalLengthOfBalanceBarcode(this.$scope.balanceBarcodeSection);
                //compare with company barcode length
                if (this.checkCompanyBarcodeLength(totalLengthforBalanceBarcode)) {
                    if (this.checkNoramBarcodeLength(totalLengthforBalanceBarcode)) {
                        if (this.$scope.balanceBarcodeSection.Name !== undefined && this.$scope.balanceBarcodeSection.Name !== "") {
                            this.$scope.listOfBalanceBarcodeConfiguration[this.$scope.editBalanceBarcodeIndex] = this.$scope.balanceBarcodeSection;
                            this.$scope.isButtonText = "Add";
                            this.ngToast.create(stringConstants.balanceBarcodeUpdated);
                        }
                        else {
                            this.$scope.balanceBarcodeSection.Name = stringConstants.configuration + (this.$scope.listOfBalanceBarcodeConfiguration.length + 1);
                            this.$scope.listOfBalanceBarcodeConfiguration.push(this.$scope.balanceBarcodeSection);
                            this.ngToast.create(stringConstants.balanceBarcodeAdded);
                        }
                        var controllerScope_1 = this.$scope;
                        controllerScope_1.isShowForm = false;
                        this.$timeout(function () {
                            controllerScope_1.balanceBarcodeSection = new Model.BalanceBarcodeSection();
                            controllerScope_1.isShowForm = true;
                        }, 50);
                    }
                    else {
                        this.ngToast.create({
                            className: 'danger',
                            content: stringConstants.NormalBarcodeLengthOverride
                        });
                    }
                }
                else {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.CompanyBarcodeLengthOverride
                    });
                }
            }
            else if (result === false) {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.balanceBarocedNotValid
                });
            }
        }
    };
    // get total length of balance barcode
    CompanyController.prototype.getTotalLengthOfBalanceBarcode = function (balanceBarcodeSection) {
        var maxValue = 0;
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.PrefixStartPosition, balanceBarcodeSection.PrefixLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.SubBarcodeStartPosition, balanceBarcodeSection.SubBarcodeLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.WeightStartPosition, balanceBarcodeSection.WeightLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.WeightDecimalStartPosition, balanceBarcodeSection.WeightDecimalLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.WeightUnitStartPosition, balanceBarcodeSection.WeightUnitLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.AmountStartPosition, balanceBarcodeSection.AmountLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.AmountDecimalStartPosition, balanceBarcodeSection.AmountDecimalLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.SuffixStartPosition, balanceBarcodeSection.SuffixLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.CheckSumStartPosition, balanceBarcodeSection.CheckSumLength);
        maxValue = this.checkTotalLength(maxValue, balanceBarcodeSection.OtherStartPosition, balanceBarcodeSection.OtherLength);
        return maxValue;
    };
    //this method usd for calcualte total length of balance barcode.
    CompanyController.prototype.checkTotalLength = function (maxValue, startPosition, length) {
        if (startPosition !== undefined && startPosition !== null && startPosition !== ""
            && length !== "" && length !== undefined && length !== null) {
            if (maxValue < parseInt(startPosition) + parseInt(length)) {
                maxValue = parseInt(startPosition) + parseInt(length);
            }
        }
        return maxValue;
    };
    //check balance length is not override normal barcode length 
    CompanyController.prototype.checkNoramBarcodeLength = function (totalLengthforBalanceBarcode) {
        if (this.$scope.normalBarcodeModel.From !== undefined && this.$scope.normalBarcodeModel.From !== null && this.$scope.normalBarcodeModel.To !== undefined && this.$scope.normalBarcodeModel.To !== null) {
            if (!(totalLengthforBalanceBarcode < +this.$scope.normalBarcodeModel.From || totalLengthforBalanceBarcode > +this.$scope.normalBarcodeModel.To)) {
                return false;
            }
        }
        return true;
    };
    //check balance barcode length is not override company barcode length 
    CompanyController.prototype.checkCompanyBarcodeLength = function (totalLengthforBalanceBarcode) {
        if (this.$scope.companyBarcodeConfiguration !== null && this.$scope.companyBarcodeConfiguration !== undefined) {
            if (this.$scope.companyBarcodeConfiguration.From !== undefined && this.$scope.companyBarcodeConfiguration.From !== null && this.$scope.companyBarcodeConfiguration.To !== undefined && this.$scope.companyBarcodeConfiguration.To !== null) {
                if (!(totalLengthforBalanceBarcode < (+this.$scope.companyBarcodeConfiguration.From) || totalLengthforBalanceBarcode > (+this.$scope.companyBarcodeConfiguration.To))) {
                    return false;
                }
            }
        }
        return true;
    };
    //check balance barcode setion validation
    CompanyController.prototype.checkBalanceBarcodeSectionValidation = function (balanceBarcodeSection) {
        //create dumy array
        var booleanArray = [];
        var result;
        for (var i = 1; i < 198; i++) {
            booleanArray.push(false);
        }
        if (this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.PrefixStartPosition, balanceBarcodeSection.PrefixLength)) {
            return false;
        }
        if (this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.SubBarcodeStartPosition, balanceBarcodeSection.SubBarcodeLength)) {
            return false;
        }
        if (this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.WeightStartPosition, balanceBarcodeSection.WeightLength)) {
            return false;
        }
        if (this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.WeightDecimalStartPosition, balanceBarcodeSection.WeightDecimalLength)) {
            return false;
        }
        result = this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.WeightUnitStartPosition, balanceBarcodeSection.WeightUnitLength);
        if (result === true) {
            return false;
        }
        else {
            if (result !== false) {
                this.ngToast.create({
                    className: 'danger',
                    content: result
                });
                return '';
            }
        }
        result = this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.AmountStartPosition, balanceBarcodeSection.AmountLength);
        if (result === true) {
            return false;
        }
        else {
            if (result !== false) {
                this.ngToast.create({
                    className: 'danger',
                    content: result
                });
                return '';
            }
        }
        result = this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.AmountDecimalStartPosition, balanceBarcodeSection.AmountDecimalLength);
        if (result === true) {
            return false;
        }
        else {
            if (result !== false) {
                this.ngToast.create({
                    className: 'danger',
                    content: result
                });
                return '';
            }
        }
        result = this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.SuffixStartPosition, balanceBarcodeSection.SuffixLength);
        if (result === true) {
            return false;
        }
        else {
            if (result !== false) {
                this.ngToast.create({
                    className: 'danger',
                    content: result
                });
                return '';
            }
        }
        result = this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.CheckSumStartPosition, balanceBarcodeSection.CheckSumLength);
        if (result === true) {
            return false;
        }
        else {
            if (result !== false) {
                this.ngToast.create({
                    className: 'danger',
                    content: result
                });
                return '';
            }
        }
        result = this.checkStartPostionAndLengthIsOverride(booleanArray, balanceBarcodeSection.OtherStartPosition, balanceBarcodeSection.OtherLength);
        if (result === true) {
            return false;
        }
        else {
            if (result !== false) {
                this.ngToast.create({
                    className: 'danger',
                    content: result
                });
                return '';
            }
        }
        return true;
    };
    //check start postion and length is override or not.
    CompanyController.prototype.checkStartPostionAndLengthIsOverride = function (booleanArray, balanceBarcodeStartPosition, length) {
        if (balanceBarcodeStartPosition !== undefined && balanceBarcodeStartPosition !== "" && balanceBarcodeStartPosition !== null && length !== undefined && length !== "" && length !== null) {
            for (var i = balanceBarcodeStartPosition; i <= (parseInt(balanceBarcodeStartPosition) + parseInt(length)); i++) {
                if (booleanArray[i] == true) {
                    return true;
                }
                else {
                    booleanArray[i] = true;
                }
            }
        }
        else {
            if ((balanceBarcodeStartPosition === undefined || balanceBarcodeStartPosition === "" || balanceBarcodeStartPosition == null) && (length !== undefined && length !== "" && length !== null)) {
                return stringConstants.startPositionRequired;
            }
            if ((length === undefined || length === "" || length === null) && (balanceBarcodeStartPosition !== undefined && balanceBarcodeStartPosition !== "" && balanceBarcodeStartPosition !== null)) {
                return stringConstants.lengthRequired;
            }
        }
        return false;
    };
    //this method uesd for open delete balance barcode popup
    CompanyController.prototype.deleteBalanceBarcodeSection = function (index) {
        this.$scope.deleteBalanceBarcodeIndex = index;
        this.deleteBarcodePopup = this.$modal.open({
            templateUrl: 'deleteBarcodePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //this method used for check normal barcode from length is less than to length
    CompanyController.prototype.checkNormalBarcodeIsValidorNot = function () {
        if (this.$scope.normalBarcodeModel.From !== undefined && this.$scope.normalBarcodeModel.From !== 0 && this.$scope.normalBarcodeModel.To !== undefined && this.$scope.normalBarcodeModel.To != 0) {
            if (+this.$scope.normalBarcodeModel.From > +this.$scope.normalBarcodeModel.To) {
                this.$scope.normalBarcodeModel.To = 0;
            }
        }
    };
    //this method used for check company barcode from length is less than to length 
    CompanyController.prototype.checkCompanyBarcodeIsValidorNot = function () {
        if (this.$scope.companyBarcodeConfiguration.From !== undefined && this.$scope.companyBarcodeConfiguration.From !== 0 && this.$scope.companyBarcodeConfiguration.To !== undefined && this.$scope.companyBarcodeConfiguration.To) {
            if (+this.$scope.companyBarcodeConfiguration.From > +this.$scope.companyBarcodeConfiguration.To) {
                this.$scope.companyBarcodeConfiguration.To = 0;
            }
        }
    };
    //this method used for check normal barcode and balnce barcode and company 
    //barcode override or not and normal and company barcode length non zero or not.
    //this method call when in click on next button
    CompanyController.prototype.checkBarcodeLengthValid = function () {
        var companyBarcodeFromLength = +this.$scope.companyBarcodeConfiguration.From;
        var companyBarcodeToLength = +this.$scope.companyBarcodeConfiguration.To;
        var normalBarcodeFromLength = +this.$scope.normalBarcodeModel.From;
        var normalBarcodeToLength = +this.$scope.normalBarcodeModel.To;
        if (companyBarcodeFromLength === 0 || companyBarcodeToLength === 0) {
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.CompanyBarcodeLengthNotbeZero
            });
            return false;
        }
        else if (normalBarcodeFromLength === 0 || normalBarcodeToLength === 0) {
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.NormalBarcodeLengthNotbeZero
            });
            return false;
        }
        else {
            if (this.checkCompanyBarcodeStartWithNotOverrideToLength()) {
                if (this.checkNormalAndCompanyBarcodeIsOverride()) {
                    for (var i = 0; i < this.$scope.listOfBalanceBarcodeConfiguration.length; i++) {
                        //get total length of balance barcode
                        var totalLengthforBalanceBarcode = this.getTotalLengthOfBalanceBarcode(this.$scope.listOfBalanceBarcodeConfiguration[i]);
                        //compare with company barcode length
                        if (this.checkCompanyBarcodeLength(totalLengthforBalanceBarcode)) {
                            if (!this.checkNoramBarcodeLength(totalLengthforBalanceBarcode)) {
                                this.ngToast.create({
                                    className: 'danger',
                                    content: stringConstants.NormalBarcodeLengthOverride
                                });
                                return false;
                            }
                        }
                        else {
                            this.ngToast.create({
                                className: 'danger',
                                content: stringConstants.CompanyBarcodeLengthOverride
                            });
                            return false;
                        }
                    }
                }
                else {
                    this.ngToast.create({
                        className: 'danger',
                        content: stringConstants.NormalBarcodeLengthOverrideCompanyBarcode
                    });
                    return false;
                }
            }
            else {
                this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.CompanyBarcodeStartWithLengthOverrride
                });
                return false;
            }
        }
        return true;
    };
    //This method used for check company barcode start with is override to length or not. 
    CompanyController.prototype.checkCompanyBarcodeStartWithNotOverrideToLength = function () {
        if (this.$scope.companyBarcodeConfiguration !== null && this.$scope.companyBarcodeConfiguration !== undefined) {
            if (this.$scope.companyBarcodeConfiguration.StartWith !== undefined && this.$scope.companyBarcodeConfiguration.StartWith !== null) {
                var length_1 = this.$scope.companyBarcodeConfiguration.StartWith.toString().length;
                if (!(length_1 <= +(((+this.$scope.companyBarcodeConfiguration.To) - (+this.$scope.companyBarcodeConfiguration.From)) + 1))) {
                    return false;
                }
            }
        }
        return true;
    };
    CompanyController.prototype.checkNormalAndCompanyBarcodeIsOverride = function () {
        var normalBarcodeFromLength = +this.$scope.normalBarcodeModel.From;
        var normalBarcodeToLength = +this.$scope.normalBarcodeModel.To;
        var companyBarcodeFromLength = +this.$scope.companyBarcodeConfiguration.From;
        var companyBarcodeToLength = +this.$scope.companyBarcodeConfiguration.To;
        //if (!((normalBarcodeFromLength < companyBarcodeFromLength && companyBarcodeFromLength < normalBarcodeToLength) || (normalBarcodeFromLength < companyBarcodeToLength && companyBarcodeToLength < normalBarcodeToLength))) {
        if ((normalBarcodeFromLength > companyBarcodeToLength && normalBarcodeToLength > companyBarcodeToLength) || (normalBarcodeFromLength < companyBarcodeFromLength && normalBarcodeToLength < companyBarcodeFromLength)) {
            return true;
        }
        return false;
    };
    //redirect to add new comapant detail page
    CompanyController.prototype.addNewCompany = function () {
        this.$location.path("/AddCompany");
        //this.$state.go('addCompany');
    };
    //add new company detail
    CompanyController.prototype.addCompanyDetail = function (companyDetail) {
        var _this = this;
        var contollerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        contollerRootScope.isLoading = true;
        companyDetail.Location = this.$scope.location;
        companyDetail.CompanyBarcodeConfiguration = this.$scope.companyBarcodeConfiguration;
        companyDetail.ListOfBalanceBarcodeConfiguration = this.$scope.listOfBalanceBarcodeConfiguration;
        companyDetail.NormalBarcodeFrom = this.$scope.normalBarcodeModel.From;
        companyDetail.NormalBarcodeTo = this.$scope.normalBarcodeModel.To;
        controllerScope.tabCount = 1;
        var promise = this.companyService.addCompanyDetail(companyDetail);
        promise.then(function (result) {
            contollerRootScope.isLoading = false;
            _this.$log.log('add company detaills successfully');
            _this.$location.path("/ManageCompany");
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                if (error.data.ExceptionMessage === "User can not create multiple company.") {
                    controllerScope.companyAlredyAddedMessageDisplay = true;
                    controllerScope.companyErrorMessage = error.data.ExceptionMessage;
                    contollerRootScope.isLoading = false;
                }
                else {
                    //company name already exist that time redirect to company detail tab.
                    for (var i = 0; i < controllerScope.tabs.length; i++) {
                        if (controllerScope.tabs[i].Id === controllerScope.tabCount) {
                            controllerScope.tabs[i].active = true;
                            controllerScope.tabs[i].disabled = false;
                            controllerScope.isCompanyNameExist = true;
                            controllerScope.companyErrorMessage = error.data.ExceptionMessage;
                        }
                        else {
                            controllerScope.tabs[i].active = false;
                            controllerScope.tabs[i].disabled = true;
                        }
                    }
                    contollerRootScope.isLoading = false;
                    _this.$log.log(error);
                }
            }
            _this.$log.log(error);
        });
        //   }
    };
    //redirect to next tab
    CompanyController.prototype.redirectToNextTab = function () {
        var controllerScope = this.$scope;
        //if (controllerScope.addCompany.$valid){
        controllerScope.tabCount = controllerScope.tabCount + 1;
        if (controllerScope.tabCount === 2) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = true;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 3) {
            if (this.checkBarcodeLengthValid()) {
                controllerScope.isCompanyDetailPanel = false;
                controllerScope.isCompanyBarcodePaymentPanel = false;
                controllerScope.isPaymentModePanel = true;
                controllerScope.isItemReturnPanel = false;
                controllerScope.isLanguagePanlel = false;
                controllerScope.isProfitMarginPanel = false;
            }
            else {
                controllerScope.tabCount = controllerScope.tabCount - 1;
            }
        }
        else if (controllerScope.tabCount === 4) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = true;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 5) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = true;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 6) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = true;
        }
        else {
            controllerScope.isCompanyDetailPanel = true;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
            controllerScope.tabCount = 1;
        }
    };
    //redirect to the previous tab
    CompanyController.prototype.redirectToPreviousTab = function () {
        var controllerScope = this.$scope;
        controllerScope.tabCount = controllerScope.tabCount - 1;
        if (controllerScope.tabCount === 2) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = true;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 3) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = true;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 4) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = true;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 5) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = true;
            controllerScope.isProfitMarginPanel = false;
        }
        else if (controllerScope.tabCount === 6) {
            controllerScope.isCompanyDetailPanel = false;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = true;
        }
        else {
            controllerScope.isCompanyDetailPanel = true;
            controllerScope.isCompanyBarcodePaymentPanel = false;
            controllerScope.isPaymentModePanel = false;
            controllerScope.isItemReturnPanel = false;
            controllerScope.isLanguagePanlel = false;
            controllerScope.isProfitMarginPanel = false;
            controllerScope.tabCount = 1;
        }
    };
    //get all company list
    CompanyController.prototype.getAllCompanyDetail = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.companyCollection = [];
        var companylist = controllerScope.companyCollection;
        var promise = this.companyService.getAllCompanyDetail();
        promise.then(function (result) {
            _this.$log.log('get all company list successfully', result.length);
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.companyErrorMessageDisplay = true;
                controllerScope.companyAlreadyAdded = false;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    companylist.push(result[i]);
                    controllerScope.companyAlreadyAdded = true;
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollection = companylist.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItems = controllerScope.companyCollection.length;
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.companyErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.companyAlreadyAdded = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //by the company id get company details
    CompanyController.prototype.getCompanyDetailsById = function () {
        var _this = this;
        var companyId = this.$routeParams.id;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.companyService.getCompanyDetailsById(companyId);
        promise.then(function (result) {
            _this.$log.log("get company details successfully");
            controllerRootScope.companyDetail = result;
            controllerScope.listOfBalanceBarcodeConfiguration = result.ListOfBalanceBarcodeConfiguration;
            if (result.CompanyBarcodeConfiguration != null)
                controllerScope.companyBarcodeConfiguration = result.CompanyBarcodeConfiguration;
            controllerScope.normalBarcodeModel.To = result.NormalBarcodeTo;
            controllerScope.normalBarcodeModel.From = result.NormalBarcodeFrom;
            _this.changeCreditAccount(controllerRootScope.companyDetail.CreditAccountPayment);
            controllerRootScope.location = result.Location;
            controllerRootScope.isPaymentMode = true;
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            _this.$log.log(error);
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerScope.companyErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
            }
            else {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //update company details with company detail.
    CompanyController.prototype.updateCompanyDetail = function (companyDetail) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.tabCount = 1;
        companyDetail.Location = controllerRootScope.location;
        companyDetail.CompanyBarcodeConfiguration = this.$scope.companyBarcodeConfiguration;
        companyDetail.ListOfBalanceBarcodeConfiguration = this.$scope.listOfBalanceBarcodeConfiguration;
        companyDetail.NormalBarcodeFrom = this.$scope.normalBarcodeModel.From;
        companyDetail.NormalBarcodeTo = this.$scope.normalBarcodeModel.To;
        controllerRootScope.isLoading = true;
        var promise = this.companyService.updateCompanyDetail(companyDetail);
        promise.then(function (result) {
            controllerRootScope.isLoading = false;
            _this.$log.log("update company details successfully");
            _this.$location.path("/ManageCompany");
            controllerRootScope.location = "";
            controllerRootScope.isPaymentMode = false;
        }).catch(function (error) {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
            else {
                for (var i = 0; i < controllerScope.tabs.length; i++) {
                    if (controllerScope.tabs[i].Id === controllerScope.tabCount) {
                        controllerScope.tabs[i].active = true;
                        controllerScope.tabs[i].disabled = false;
                        controllerScope.isCompanyNameExist = true;
                        controllerScope.companyErrorMessage = error.data.ExceptionMessage;
                    }
                    else {
                        controllerScope.tabs[i].active = false;
                        controllerScope.tabs[i].disabled = true;
                    }
                }
                controllerRootScope.isLoading = false;
                _this.$log.log(error);
            }
            _this.$log.log(error);
        });
    };
    //redirect to the edit company detail page by the company id
    CompanyController.prototype.editCompanyDetails = function (companyId) {
        this.$location.path("/EditCompany/" + companyId);
    };
    //get all language
    CompanyController.prototype.getAllLanguage = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.languageCollection = [];
        var languageList = controllerScope.languageCollection;
        var promise = this.companyService.getAllLanguage();
        promise.then(function (result) {
            _this.$log.log("get all Language list", result.length);
            for (var i = 0; i < result.length; i++) {
                if (result[i].Name != "English")
                    languageList.push(result[i]);
            }
        });
    };
    //open the delete company details dialog box.
    CompanyController.prototype.openDeleteCompanyInfoDialogBox = function (company) {
        var controllerScope = this.$scope;
        this.companyDetailModel = this.$modal.open({
            templateUrl: 'comapnyDetailsConfirmation',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.companyDetails = company;
    };
    //clsoe the dialogbox.
    CompanyController.prototype.closeCompanyDeleteDialogbox = function () {
        this.companyDetailModel.dismiss('cancel');
    };
    //delete the company details by the company id.
    CompanyController.prototype.deleteCompanyDetails = function (companyId) {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.companyService.deleteCompanyDetails(companyId);
        promise.then(function (result) {
            controllerScope.getAllCompanyDetail();
            _this.closeCompanyDeleteDialogbox();
        }).catch(function (error) {
            location.replace(_this.apiPath);
        });
    };
    // used to insert System Setting into database
    CompanyController.prototype.saveSystemSetting = function (systemSetting) {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.companyService.saveSystemSetting(systemSetting);
        promise.then(function (result) {
            controllerScope.systemSetting = result;
        }).catch(function (error) {
            location.replace(_this.apiPath);
        });
    };
    // used to fetch System Setting from database
    CompanyController.prototype.getSystemSetting = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var promise = this.companyService.getSystemSetting();
        promise.then(function (result) {
            // for (let i = 0; i < result.length; i++) {
            controllerScope.systemSetting = result;
            //  }
        }).catch(function (error) {
            location.replace(_this.apiPath);
        });
    };
    CompanyController.prototype.changeCreditAccount = function (isCreditAccountPayment) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        if (isCreditAccountPayment) {
            controllerScope.isAllowCreditAccountLimit = false;
        }
        else {
            controllerScope.isAllowCreditAccountLimit = true;
            controllerRootScope.companyDetail.AllowCreditAccountLimit = false;
        }
    };
    CompanyController.prototype.getAllCurrencyDetail = function () {
        var _this = this;
        var controllerScope = this.$scope;
        controllerScope.currencyCollection = [];
        var currencyCollection = controllerScope.currencyCollection;
        var promise = this.companyService.getAllCurrencyDetail();
        promise.then(function (result) {
            _this.$log.log("get all currecy successfully", result);
            for (var i = 0; i < result.length; i++) {
                currencyCollection.push(result[i]);
            }
        });
    };
    CompanyController.prototype.openHelpDialogBox = function (helpString) {
        var controllerScope = this.$scope;
        this.helpModel = this.$modal.open({
            templateUrl: 'helpDialogBox',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.helpString = helpString;
    };
    CompanyController.prototype.closeHelpDialogBox = function () {
        this.helpModel.dismiss('cancel');
    };
    CompanyController.prototype.saveAdditionalCostType = function () {
        var _this = this;
        var additionalCostType = this.$rootScope.companyDetail.CPOConfigurations.find(function (x) { return x.AdditionalCostType === _this.$rootScope.companyDetail.AdditionalCostType; });
        if (additionalCostType && this.$scope.cpoId !== additionalCostType.Id) {
            this.$scope.isAdditionalCostTypeExist = true;
            return;
        }
        this.$scope.isAdditionalCostTypeExist = false;
        var index = this.$rootScope.companyDetail.CPOConfigurations.findIndex(function (x) { return x.Id === _this.$scope.cpoId; });
        if (index !== -1) {
            this.$rootScope.companyDetail.CPOConfigurations[index].AdditionalCostType = this.$rootScope.companyDetail.AdditionalCostType;
        }
        else {
            var aryLength = this.$rootScope.companyDetail.CPOConfigurations.length;
            var newObj = new Model.CPOAdditionalCost();
            newObj.AdditionalCostType = this.$rootScope.companyDetail.AdditionalCostType;
            newObj.Id = aryLength === 0 ? 1 : this.$rootScope.companyDetail.CPOConfigurations[aryLength - 1].Id + 1;
            this.$rootScope.companyDetail.CPOConfigurations.push(newObj);
        }
        this.$rootScope.companyDetail.AdditionalCostType = '';
        this.$scope.cpoId = 0;
    };
    CompanyController.prototype.editAdditionalCostType = function (id) {
        var additionalCostType = this.$rootScope.companyDetail.CPOConfigurations.find(function (x) { return x.Id === id; });
        this.$rootScope.companyDetail.AdditionalCostType = additionalCostType.AdditionalCostType;
        this.$scope.cpoId = id;
    };
    CompanyController.prototype.deleteAdditionalCostType = function (id) {
        var index = this.$rootScope.companyDetail.CPOConfigurations.findIndex(function (x) { return x.Id === id; });
        if (index > -1) {
            this.$rootScope.companyDetail.CPOConfigurations.splice(index, 1);
        }
    };
    return CompanyController;
}());
CompanyController.controllerId = "CompanyController";
app.controller(CompanyController.controllerId, [
    '$scope', '$location', '$log', 'CompanyService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'ngToast', '$timeout', function ($scope, $location, $log, companyService, $rootScope, $routeParams, apiPath, $modal, ngToast, $timeout) {
        return new CompanyController($scope, $location, $log, companyService, $rootScope, $routeParams, apiPath, $modal, ngToast, $timeout);
    }
]);
//# sourceMappingURL=companyController.js.map
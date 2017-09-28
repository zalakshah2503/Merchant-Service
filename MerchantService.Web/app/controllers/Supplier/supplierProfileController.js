var SupplierProfileController = (function () {
    function SupplierProfileController($scope, $log, supplierProfileService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, userAccessService) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.supplierProfileService = supplierProfileService;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.apiPath = apiPath;
        this.filterFilter = filterFilter;
        this.$modal = $modal;
        this.$location = $location;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.userAccessService = userAccessService;
        this.$scope.supplierProfile = new Model.SupplierProfile;
        this.$scope.discountDays = new Model.DiscountDays;
        this.$scope.contactPerson = new Model.ContactPerson;
        this.$scope.addSupplier = function () { return _this.addSupplier(); };
        this.$scope.isAddSupplier = false;
        this.$scope.isActiveVisible = false;
        this.$scope.addSupplierProfiles = function (supplierProfile) { return _this.addSupplierProfiles(supplierProfile); };
        this.$scope.getSupplierList = function () { return _this.getSupplierList(); };
        this.$scope.getSupplierType = function () { return _this.getSupplierType(); };
        this.$scope.searchSupplierDetails = function () { return _this.searchSupplierDetails(); };
        this.$scope.cancel = function () { return _this.cancel(); };
        this.$scope.cancelContact = function (addSupplierContact) { return _this.cancelContact(addSupplierContact); };
        this.$scope.deleteSupplierProfile = function (id) { return _this.deleteSupplierProfile(id); };
        this.$scope.editSupplierProfile = function (Id) { return _this.editSupplierProfile(Id); };
        this.$scope.onChangeSupplierType = function (Id) { return _this.onChangeSupplierType(Id); };
        this.$scope.onChangeDays = function (Days) { return _this.onChangeDays(Days); };
        this.$scope.addElements = function ($scope) { return _this.addElements(); };
        this.$scope.removeElement = function () { return _this.removeElement(); };
        this.$scope.checkDiscount = function (discount) { return _this.checkDiscount(discount); };
        this.$scope.updateSupplierProfile = function (supplierProfile) { return _this.updateSupplierProfile(supplierProfile); };
        this.$scope.onIsActiveChanged = function (id) { return _this.onIsActiveChanged(id); };
        this.$scope.supplierProfileList = [];
        this.$scope.supplierTypeList = [];
        this.$scope.days = [];
        this.$scope.elementList = [];
        this.$scope.counter = 0;
        this.$scope.supplierNotFound = stringConstants.supplierNotFound;
        this.$scope.contactNotFound = stringConstants.contactNotFound;
        this.$scope.discountDaysTemp = [];
        this.$scope.errorMessage = "";
        this.$scope.IsSupplierListVisible = false;
        this.$scope.supplierErrorMessageDisplay = false;
        this.$scope.hideDiscount = false;
        this.$scope.IsContactPersonListVisible = false;
        this.$scope.isUpdate = false;
        this.$scope.isSupplierContactAdd = true;
        this.$scope.enableDaysLimit = false;
        this.$scope.hideDiscountDays = false;
        this.$scope.codeExists = false;
        this.$scope.phoneExists = false;
        this.$scope.emailExists = false;
        this.$scope.openDeleteSupplierPopup = function (supplier) { return _this.openDeleteSupplierPopup(supplier); };
        this.$scope.openDeleteSupplierContactPopup = function (contact) { return _this.openDeleteSupplierContactPopup(contact); };
        this.$scope.closeDeleteSupplierPopup = function () { return _this.closeDeleteSupplierPopup(); };
        this.$scope.closeDeleteSupplierContactPopup = function () { return _this.closeDeleteSupplierContactPopup(); };
        this.$scope.openDeleteSupplierFailurePopup = function () { return _this.openDeleteSupplierFailurePopup(); };
        this.$scope.closeDeleteSupplierFailurePopup = function () { return _this.closeDeleteSupplierFailurePopup(); };
        this.$scope.deleteSupplierFailureMsg = "";
        this.$scope.supplierDeleteFail = stringConstants.supplierDeleteFail;
        this.$scope.setForm = function () { return _this.setForm(); };
        this.$scope.contactTemp = [];
        this.$scope.contactPersonListTemp = [];
        this.$scope.totalCollection = [];
        this.$scope.supplierList = [];
        this.$scope.search = [];
        this.$scope.supplierTotalCollection = [];
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.errorMessage = "";
        var userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.supplierList.slice(begin, end);
        });
        this.$scope.isSupplierExixts = false;
        this.$scope.isAddContactPerson = false;
        this.$scope.addContact = function () { return _this.addContact(); };
        this.$scope.getContactPersonList = function (id) { return _this.getContactPersonList(id); };
        this.$scope.addContactPerson = function (contactPerson, addSupplierContact) { return _this.addContactPerson(contactPerson, addSupplierContact); };
        this.$scope.deleteContactPerson = function (id) { return _this.deleteContactPerson(id); };
        this.$scope.editContactPerson = function (ContactId) { return _this.editContactPerson(ContactId); };
        this.$scope.updateContactPerson = function (contactPerson, addSupplierContact) { return _this.updateContactPerson(contactPerson, addSupplierContact); };
        this.$scope.contactPersonList = [];
        this.$scope.firstUpdate = false;
        this.$scope.firstContactUpdate = false;
        this.$scope.isContactUpdate = false;
        this.$scope.supplierTabClick = function () { return _this.supplierTabClick(); };
        this.$scope.emailRequired = stringConstants.emailRequired;
        this.$scope.phoneRequired = stringConstants.phoneRequired;
        this.$scope.emailInvalid = stringConstants.emailInvalid;
        this.$scope.emailUnique = stringConstants.emailUnique;
        this.$scope.phoneInvalid = stringConstants.phoneInvalid;
        this.$scope.phoneMinLength = stringConstants.phoneMinLength;
        this.$scope.phoneUnique = stringConstants.phoneUnique;
        this.$scope.nameRequired = stringConstants.nameRequired;
        this.$scope.supplierCodeRequired = stringConstants.supplierCodeRequired;
        this.$scope.supplierCodeUnique = stringConstants.supplierCodeUnique;
        this.$scope.supplierTypeRequired = stringConstants.supplierTypeRequired;
        this.$scope.addressRequired = stringConstants.addressRequired;
        this.$scope.FaxInvalid = stringConstants.FaxInvalid;
        this.$scope.zipcodeMinlength = stringConstants.zipcodeMinlength;
        this.$scope.ValidZipcodeMessage = stringConstants.ValidZipcodeMessage;
        this.$scope.ValidNoofDaysMessage = stringConstants.ValidNoofDaysMessage;
        this.$scope.ValidDiscountMessage = stringConstants.ValidDiscountMessage;
        this.$scope.ValidPhoneExtensionMessage = stringConstants.ValidPhoneExtensionMessage;
        this.$scope.isFocusIn = false;
        this.$scope.onSeacrhSupplierNameChanged = function () { return _this.onSeacrhSupplierNameChanged(); };
        this.$scope.onSeacrhSupplierCodeChanged = function () { return _this.onSeacrhSupplierCodeChanged(); };
        this.$scope.ProfileTab = stringConstants.ProfileTab;
        this.$scope.ContactInfoTab = stringConstants.ContactInfoTab;
    }
    SupplierProfileController.prototype.addSupplier = function () {
        var controllerScope = this.$scope;
        controllerScope.isAddSupplier = true;
        this.$scope.isFocusIn = true;
    };
    SupplierProfileController.prototype.addSupplierProfiles = function (supplierProfile) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        var isCredit = false;
        var canAdd = true;
        controllerRootScope.isLoading = true;
        for (var i = 0; i < controllerScope.supplierTypeList.length; i++) {
            if (controllerScope.supplierProfile.SupplierTypeId === controllerScope.supplierTypeList[i].Id) {
                if (controllerScope.supplierTypeList[i].ValueEn === "Credit") {
                    isCredit = true;
                }
            }
        }
        var supplierDetail = supplierProfile;
        if (supplierProfile.DiscountDays !== undefined || supplierProfile.DiscountDays !== null) {
            supplierDetail.DiscountDays = controllerScope.elementList;
        }
        if (canAdd) {
            var promise = this.supplierProfileService.saveSupplierProfile(supplierDetail);
            controllerScope.codeExists = false;
            promise.then(function (result) {
                if (result.status !== undefined) {
                    _this.ngToast.create({
                        className: 'danger',
                        content: result.status
                    });
                    controllerRootScope.isLoading = false;
                }
                else {
                    if (result.Code === "") {
                        controllerScope.codeExists = true;
                    }
                    else {
                        var x = _this;
                        x.$location.path("/SupplierProfile/");
                        controllerScope.supplierProfileList.push(result);
                        _this.ngToast.create(stringConstants.SupplierAddedSuccessFully);
                    }
                    controllerRootScope.isLoading = false;
                }
            }).catch(function (error) {
                if (error.data.Message === "PhoneNumberIsAlreadyExists") {
                    controllerScope.phoneExists = true;
                }
                else if (error.data.Message === "EmailisAlreadyExists") {
                    controllerScope.emailExists = true;
                }
                controllerRootScope.isLoading = false;
                controllerScope.errorMessage = error.data.ExceptionMessage;
            });
        }
        else {
            controllerRootScope.isLoading = false;
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.DaysLimitforCreditSupplier
            });
        }
    };
    // get supplier list - jj
    SupplierProfileController.prototype.getSupplierList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.supplierProfileList = [];
        controllerScope.supplierList = [];
        var supplierCollection = controllerScope.supplierList;
        var promise = this.supplierProfileService.getSupplierList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerScope.IsSupplierListVisible = false;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < controllerScope.supplierTypeList.length; j++) {
                        if (result[i].SupplierTypeId === controllerScope.supplierTypeList[j].Id) {
                            supplierCollection.push({
                                Id: result[i].Id, NameEn: result[i].NameEn,
                                Code: result[i].Code, AddressEn: result[i].AddressEn, Phone: result[i].Phone,
                                Fax: result[i].Fax, Email: result[i].Email, ZipCode: result[i].ZipCode,
                                POBox: result[i].POBox, SupplierTypeId: controllerScope.supplierTypeList[j],
                                IsDeleted: result[i].IsDeleted, IsActive: result[i].IsActive,
                                IsAcceptReturnForExpiredItem: result[i].IsAcceptReturnForExpiredItem,
                                CreatedDateTime: result[i].CreatedDateTime, TotalDaysLimit: result[i].TotalDaysLimit
                            });
                            break;
                        }
                    }
                    controllerScope.supplierTotalCollection = supplierCollection;
                    controllerScope.supplierProfileList = supplierCollection;
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = supplierCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.supplierList.length;
                }
                controllerRootScope.isLoading = false;
                controllerScope.IsSupplierListVisible = true;
            }
        }).catch(function (error) {
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerScope.IsSupplierListVisible = false;
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // get list of supplier types
    SupplierProfileController.prototype.getSupplierType = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        var location = this.$location.path();
        controllerRootScope.isLoading = true;
        var promise = this.supplierProfileService.getSupplierTypeList();
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.IsContactPersonListVisible = false;
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
            }
            else {
                controllerScope.supplierTypeList = result;
                _this.getSupplierList();
            }
        })
            .catch(function (error) {
            if (error.status !== 500) {
                location.replace(_this.apiPath);
            }
            controllerRootScope.isLoading = false;
        });
    };
    //delete supplier profile
    SupplierProfileController.prototype.deleteSupplierProfile = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierProfileService.deleteSupplierProfile(id);
        promise.then(function (result) {
            _this.closeDeleteSupplierPopup();
            controllerRootScope.isLoading = false;
            if (result.status === "") {
                var x = _this;
                x.$location.path("/SupplierProfile/");
                _this.ngToast.create(stringConstants.SupplierDeletedSuccessfully);
            }
            else {
                controllerScope.deleteSupplierFailureMsg = result.status;
                _this.openDeleteSupplierFailurePopup();
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // used to populate textboxes 
    SupplierProfileController.prototype.editSupplierProfile = function (Id) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerScope.isContactUpdate = false;
        controllerScope.enableDaysLimit = false;
        controllerScope.isActiveVisible = true;
        controllerScope.isUpdate = true;
        controllerScope.isAddSupplier = true;
        controllerScope.supplierProfile = new Model.SupplierProfile();
        for (var i = 0; i <= controllerScope.supplierList.length; i++) {
            if (controllerScope.supplierList[i].Id === Id) {
                controllerScope.supplierProfile.Id = controllerScope.supplierList[i].Id;
                controllerScope.supplierProfile.NameEn = controllerScope.supplierList[i].NameEn;
                controllerScope.supplierProfile.Code = controllerScope.supplierList[i].Code;
                controllerScope.supplierProfile.AddressEn = controllerScope.supplierList[i].AddressEn;
                controllerScope.supplierProfile.Phone = controllerScope.supplierList[i].Phone;
                controllerScope.supplierProfile.Fax = controllerScope.supplierList[i].Fax;
                controllerScope.supplierProfile.Email = controllerScope.supplierList[i].Email;
                controllerScope.supplierProfile.ZipCode = controllerScope.supplierList[i].ZipCode;
                controllerScope.supplierProfile.POBox = controllerScope.supplierList[i].POBox;
                controllerScope.supplierProfile.SupplierTypeId = controllerScope.supplierList[i].SupplierTypeId.Id;
                controllerScope.supplierProfile.IsDeleted = controllerScope.supplierList[i].IsDeleted;
                controllerScope.supplierProfile.IsActive = controllerScope.supplierList[i].IsActive;
                controllerScope.supplierProfile.TotalDaysLimit = controllerScope.supplierList[i].TotalDaysLimit;
                controllerScope.supplierProfile.IsAcceptReturnForExpiredItem = controllerScope.supplierList[i].IsAcceptReturnForExpiredItem;
                controllerScope.supplierProfile.CreatedDateTime = controllerScope.supplierList[i].CreatedDateTime;
                controllerScope.contactPerson = new Model.ContactPerson();
                for (var i_1 = 0; i_1 < controllerScope.supplierTypeList.length; i_1++) {
                    if (controllerScope.supplierProfile.SupplierTypeId === controllerScope.supplierTypeList[i_1].Id) {
                        if (controllerScope.supplierTypeList[i_1].ValueEn === "Credit") {
                            controllerScope.enableDaysLimit = true;
                        }
                    }
                }
                controllerScope.supplierId = controllerScope.supplierProfile.Id;
                this.getContactPersonList(Id);
                break;
            }
        }
        var promise = this.supplierProfileService.getDaysDiscountList(Id);
        promise.then(function (result) {
            controllerScope.supplierProfile.DiscountDays = [];
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
                controllerScope.supplierProfile.Discount = 0;
            }
            else {
                controllerScope.enableDaysLimit = true;
                controllerScope.hideDiscountDays = true;
                for (var a = 0; a < result.length; a++) {
                    if (a === 0) {
                        controllerScope.supplierProfile.Days = result[a].Days;
                        controllerScope.supplierProfile.Discount = result[a].Discount;
                    }
                    else {
                        controllerScope.elementList.push({ Days: result[a].Days, Discount: result[a].Discount });
                    }
                }
                for (var i = 1; i <= controllerScope.supplierProfile.TotalDaysLimit; i++) {
                    controllerScope.days[i] = { Id: i, Days: i };
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    SupplierProfileController.prototype.supplierTabClick = function () {
        var controllerScope = this.$scope;
        if (controllerScope.firstUpdate === true) {
            controllerScope.isUpdate = true;
        }
    };
    // update supplier - jj
    SupplierProfileController.prototype.updateSupplierProfile = function (supplierProfile) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.hideDiscountDays = true;
        var count = 0;
        for (var j = 0; j < controllerScope.supplierTypeList.length; j++) {
            if (controllerScope.supplierTypeList[j].Id === supplierProfile.SupplierTypeId && controllerScope.supplierTypeList[j].ValueEn === "Credit") {
                supplierProfile.DiscountDays = controllerScope.elementList;
            }
        }
        var promise = this.supplierProfileService.updateSupplier(supplierProfile);
        promise.then(function (result) {
            if (result.status !== undefined) {
                _this.ngToast.create({
                    className: 'danger',
                    content: result.status
                });
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < controllerScope.supplierList.length; i++) {
                    if (controllerScope.supplierList[i].Id === result.Id) {
                        controllerScope.supplierList[i].NameEn = result.NameEn;
                        controllerScope.supplierList[i].Code = result.Code;
                        controllerScope.supplierList[i].AddressEn = result.AddressEn;
                        controllerScope.supplierList[i].Phone = result.Phone;
                        controllerScope.supplierList[i].Fax = result.Fax;
                        controllerScope.supplierList[i].Email = result.Email;
                        controllerScope.supplierList[i].ZipCode = result.ZipCode;
                        controllerScope.supplierList[i].POBox = result.POBox;
                        controllerScope.supplierList[i].SupplierTypeId = result.SupplierTypeId;
                        controllerScope.supplierList[i].IsDeleted = result.IsDeleted;
                        controllerScope.supplierList[i].IsActive = result.IsActive;
                        controllerScope.supplierList[i].IsAcceptReturnForExpiredItem = result.IsAcceptReturnForExpiredItem;
                        controllerScope.supplierList[i].CreatedDateTime = result.CreatedDateTime;
                        break;
                    }
                }
                controllerRootScope.isLoading = false;
                var x = _this;
                x.$location.path("/SupplierProfile/");
                _this.ngToast.create(stringConstants.SupplierUpdatedSuccessfully);
            }
        }).catch(function (error) {
            if (error.data.Message === "PhoneNumberIsAlreadyExists") {
                controllerScope.phoneExists = true;
            }
            else if (error.data.Message === "EmailisAlreadyExists") {
                controllerScope.emailExists = true;
            }
            controllerRootScope.isLoading = false;
            controllerScope.errorMessage = error.data.ExceptionMessage;
        });
    };
    //used to check whether supplier is involved in some other activity 
    SupplierProfileController.prototype.onIsActiveChanged = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierProfileService.checkSPOExist(id);
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.spoCount === 0) {
                }
                else {
                    alert(stringConstants.CanNotSetInactive);
                    controllerScope.supplierProfile.IsActive = true;
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // used to check which type of supplier is selected and act accordingly
    SupplierProfileController.prototype.onChangeSupplierType = function (supplierType) {
        var controllerScope = this.$scope;
        if (supplierType === "Credit") {
            controllerScope.enableDaysLimit = true;
            controllerScope.supplierProfile.Discount = 0;
        }
        else {
            controllerScope.enableDaysLimit = false;
            controllerScope.supplierProfile.TotalDaysLimit = 0;
            controllerScope.supplierProfile.DiscountDays = [];
            controllerScope.supplierProfile.Discount = 0;
            controllerScope.supplierProfile.Days = 0;
            controllerScope.elementList = [];
            controllerScope.days = [];
        }
    };
    // called on changing the value of total days limit
    //it fills the dropdown of dayslimit
    SupplierProfileController.prototype.onChangeDays = function (Days) {
        if (!isNaN(Days)) {
            var controllerScope = this.$scope;
            controllerScope.supplierProfile.DiscountDays = [];
            controllerScope.elementList = [];
            controllerScope.days = [];
            var i = 1;
            controllerScope.supplierProfile.Discount = "";
            controllerScope.supplierProfile.Days = [];
            for (i = 1; i <= Days; i++) {
                controllerScope.days[i] = { Id: i, Days: i };
            }
        }
    };
    //used to dynamically add dropdown and textbox 
    SupplierProfileController.prototype.addElements = function () {
        var controllerScope = this.$scope;
        controllerScope.elementList.push({
            Discount: 0
        });
    };
    //used to dynamically remove dropdown and textbox 
    SupplierProfileController.prototype.removeElement = function () {
        var lastItem = this.$scope.elementList.length - 1;
        this.$scope.elementList.splice(lastItem);
    };
    //supplier profile search panel.
    SupplierProfileController.prototype.searchSupplierDetails = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.supplierProfileList = this.filterFilter((controllerScope.supplierTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.supplierProfileList.length === 0) {
            controllerScope.IsSupplierListVisible = false;
        }
        else {
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.supplierProfileList.slice(begin, end);
            controllerScope.totalItems = controllerScope.supplierProfileList.length;
            controllerScope.IsSupplierListVisible = true;
        }
        controllerScope.search = [];
    };
    //called whenever either supplierName  is selected
    SupplierProfileController.prototype.onSeacrhSupplierNameChanged = function () {
        var controllerScope = this.$scope;
        controllerScope.search.Code = "";
        var tempList = [];
        tempList = this.filterFilter((controllerScope.supplierTotalCollection), controllerScope.search);
        for (var i = 0; i < tempList.length; i++) {
            if (tempList[i].NameEn === controllerScope.search.NameEn) {
                controllerScope.search.Code = tempList[i].Code;
            }
        }
    };
    //called whenever either supplierCode  is selected
    SupplierProfileController.prototype.onSeacrhSupplierCodeChanged = function () {
        var controllerScope = this.$scope;
        controllerScope.search.NameEn = "";
        var tempList = [];
        tempList = this.filterFilter((controllerScope.supplierTotalCollection), controllerScope.search);
        for (var i = 0; i < tempList.length; i++) {
            if (tempList[i].Code === controllerScope.search.Code) {
                controllerScope.search.NameEn = tempList[i].NameEn;
            }
        }
    };
    //called on contact person tab click
    SupplierProfileController.prototype.addContact = function () {
        var controllerScope = this.$scope;
        if (controllerScope.isUpdate === true) {
        }
        else {
            alert(stringConstants.ChooseSupplier);
            var x = this;
            x.$location.path("/SupplierProfile/");
        }
    };
    // used to fetch Contact Person List of the supplier
    SupplierProfileController.prototype.getContactPersonList = function (id) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.contactPersonList = [];
        var promise = this.supplierProfileService.getContactList(id);
        promise.then(function (result) {
            if (result.length === 0) {
                controllerScope.IsContactPersonListVisible = false;
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.IsContactPersonListVisible = true;
                    controllerScope.contactPersonList.push(result[i]);
                    controllerRootScope.isLoading = false;
                }
            }
        }).catch(function (error) {
            if (error.status === 500) {
                controllerScope.IsContactPersonListVisible = false;
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(_this.apiPath);
            }
        });
    };
    // Add new contact of supplier in database
    SupplierProfileController.prototype.addContactPerson = function (contactPerson, addSupplierContact) {
        var _this = this;
        var controllerRootScope = this.$rootScope;
        var controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        contactPerson.SupplierId = controllerScope.supplierId;
        var promise = this.supplierProfileService.saveContactPerson(contactPerson);
        promise.then(function (result) {
            controllerScope.contactPersonList.push(result);
            controllerRootScope.isLoading = false;
            controllerScope.contactPerson = new Model.ContactPerson();
            controllerScope.IsContactPersonListVisible = true;
            addSupplierContact.$setPristine();
            addSupplierContact.$setUntouched();
            _this.ngToast.create(stringConstants.ContactAdded);
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    //delete contact person
    SupplierProfileController.prototype.deleteContactPerson = function (contact) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierProfileService.deleteContactPerson(contact.Id);
        promise.then(function (result) {
            _this.closeDeleteSupplierContactPopup();
            _this.getContactPersonList(contact.SupplierId);
            controllerRootScope.isLoading = false;
            _this.ngToast.create(stringConstants.ContactDeleted);
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
        });
    };
    // to fill the grid on click of edit button of contact person
    SupplierProfileController.prototype.editContactPerson = function (ContactId) {
        var controllerScope = this.$scope;
        controllerScope.isContactUpdate = true;
        for (var i = 0; i <= controllerScope.contactPersonList.length; i++) {
            if (controllerScope.contactPersonList[i].ContactId === ContactId) {
                controllerScope.contactPerson.ContactId = controllerScope.contactPersonList[i].ContactId;
                controllerScope.contactPerson.ContactNameEn = controllerScope.contactPersonList[i].ContactNameEn;
                controllerScope.contactPerson.SupplierId = controllerScope.contactPersonList[i].SupplierId;
                controllerScope.contactPerson.ContactAddressEn = controllerScope.contactPersonList[i].ContactAddressEn;
                controllerScope.contactPerson.ContactPhone = controllerScope.contactPersonList[i].ContactPhone;
                controllerScope.contactPerson.PhoneExtension = controllerScope.contactPersonList[i].PhoneExtension;
                controllerScope.contactPerson.ContactFax = controllerScope.contactPersonList[i].ContactFax;
                controllerScope.contactPerson.ContactEmail = controllerScope.contactPersonList[i].ContactEmail;
                controllerScope.contactPerson.JobTitleEn = controllerScope.contactPersonList[i].JobTitleEn;
                controllerScope.contactPerson.ContactIsDeleted = controllerScope.contactPersonList[i].IsDeleted;
                controllerScope.contactPerson.CreatedDateTime = controllerScope.contactPersonList[i].CreatedDateTime;
                break;
            }
        }
    };
    SupplierProfileController.prototype.setForm = function () {
        var scope = this.$scope;
        scope.addSupplierContact.$setPristine();
        scope.addSupplierContact.$setValidity();
        scope.addSupplierContact.$setUntouched();
    };
    // update contact person
    SupplierProfileController.prototype.updateContactPerson = function (contactPerson, addSupplierContact) {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.supplierProfileService.updateContactPerson(contactPerson);
        promise.then(function (result) {
            for (var i = 0; i < controllerScope.contactPersonList.length; i++) {
                if (controllerScope.contactPersonList[i].ContactId === result.Id) {
                    result.ContactId = result.Id;
                    controllerScope.contactPersonList[i] = result;
                }
            }
            controllerRootScope.isLoading = false;
            controllerScope.contactPerson = new Model.ContactPerson();
            controllerScope.isContactUpdate = false;
            addSupplierContact.$setPristine();
            addSupplierContact.$setUntouched();
            _this.ngToast.create(stringConstants.SupplierUpdatedSuccessfully);
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            controllerScope.errorMessage = error.data.ExceptionMessage;
        });
    };
    // opening the DeleteSupplierPopup
    SupplierProfileController.prototype.openDeleteSupplierPopup = function (contact) {
        var controllerScope = this.$scope;
        this.deleteSupplierPopup = this.$modal.open({
            templateUrl: 'DeleteSupplierPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.supplierProfile = contact;
    };
    // opening the DeleteSupplierContactPopup
    SupplierProfileController.prototype.openDeleteSupplierContactPopup = function (contact) {
        var controllerScope = this.$scope;
        this.deleteSupplierContactPopup = this.$modal.open({
            templateUrl: 'DeleteSupplierContactPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.contactTemp.Id = contact.ContactId;
        controllerScope.contactTemp.ContactNameEn = contact.ContactNameEn;
        controllerScope.contactTemp.SupplierId = contact.SupplierId;
    };
    //closing  the DeleteSupplierPopup
    SupplierProfileController.prototype.closeDeleteSupplierPopup = function () {
        var controllerScope = this.$scope;
        this.deleteSupplierPopup.dismiss('cancel');
        controllerScope.supplierProfile = new Model.SupplierProfile();
    };
    //closing  the DeleteSupplierContactPopup
    SupplierProfileController.prototype.closeDeleteSupplierContactPopup = function () {
        var controllerScope = this.$scope;
        this.deleteSupplierContactPopup.dismiss('cancel');
    };
    SupplierProfileController.prototype.cancel = function () {
        var controllerScope = this.$scope;
        controllerScope.supplierProfile = new Model.SupplierProfile();
        controllerScope.isUpdate = false;
        controllerScope.contactPerson = new Model.ContactPerson();
        controllerScope.isContactUpdate = false;
        controllerScope.contactPersonList = [];
        var x = this;
        x.$location.path("/SupplierProfile/");
    };
    SupplierProfileController.prototype.cancelContact = function (addSupplierContact) {
        var controllerScope = this.$scope;
        controllerScope.contactPerson = new Model.ContactPerson();
        controllerScope.isContactUpdate = false;
        addSupplierContact.$setPristine();
        addSupplierContact.$setUntouched();
    };
    // opening the DeleteSupplierFailurePopup
    SupplierProfileController.prototype.openDeleteSupplierFailurePopup = function () {
        var controllerScope = this.$scope;
        this.deleteSupplierFailurePopup = this.$modal.open({
            templateUrl: 'DeleteSupplierFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    };
    //closing  the DeleteSupplierFailurePopup
    SupplierProfileController.prototype.closeDeleteSupplierFailurePopup = function () {
        var controllerScope = this.$scope;
        this.deleteSupplierFailurePopup.dismiss('cancel');
    };
    //check whether valid discount has been added
    SupplierProfileController.prototype.checkDiscount = function (discount) {
        var scope = this.$scope;
        if (scope.isAddSupplier) {
            for (var i = 0; i < scope.supplierTypeList.length; i++) {
                if (scope.supplierProfile.SupplierTypeId === scope.supplierTypeList[i].Id) {
                    if (scope.supplierTypeList[i].ValueEn === "Credit") {
                        var controllerScope = this.$scope;
                        if (discount !== "" && isNaN(discount)) {
                            return true;
                        }
                        return false;
                    }
                }
            }
        }
    };
    return SupplierProfileController;
}());
SupplierProfileController.controllerId = "SupplierProfileController";
app.controller(SupplierProfileController.controllerId, ['$scope', '$log', 'SupplierProfileService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', function ($scope, $log, SupplierProfileService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, UserAccessService) {
        return new SupplierProfileController($scope, $log, SupplierProfileService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, UserAccessService);
    }]);
//# sourceMappingURL=supplierProfileController.js.map
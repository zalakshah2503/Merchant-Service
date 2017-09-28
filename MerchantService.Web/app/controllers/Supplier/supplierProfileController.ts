
interface IsupplierProfileControllerScope extends ng.IScope {
    supplierProfile: any;
    discountDays: any;
    contactPerson: any;
    addSupplier: Function;
    isAddSupplier: boolean;
    isAdd: boolean;
    isActiveVisible: boolean;
    supplierProfileList: any;
    supplierTypeList: any;
    addSupplierProfiles: Function;
    getSupplierList: Function;
    getSupplierType: Function;
    deleteSupplierProfile: Function;
    editSupplierProfile: Function;
    updateSupplierProfile: Function;
    onChangeSupplierType: Function;
    onChangeDays: Function;
    addElements: Function;
    removeElement: Function;
    searchSupplierDetails: Function;
    checkDiscount: Function;
    cancel: Function;
    cancelContact: Function;
    setForm: Function;
    onIsActiveChanged: Function;
    errorMessage: string;
    IsSupplierListVisible: boolean;
    IsContactPersonListVisible: boolean;
    tabs: any;
    contactNotFound: any;
    isUpdate: boolean;
    isSupplierContactAdd: boolean;
    enableDaysLimit: boolean;
    hideDiscountDays: boolean;
    days: any;
    elementList: any;
    supplierDeleteFail: any;
    counter: any;
    discountDaysTemp: any;
    dayslimiterror: any;
    hideDiscount: any;
    addContact: Function;
    getContactPersonList: Function;
    addContactPerson: Function;
    deleteContactPerson: Function;
    editContactPerson: Function;
    updateContactPerson: Function;
    isSupplierExixts: boolean;
    isAddContactPerson: boolean;
    contactPersonList: any;
    contactPersonListTemp: any;
    supplierId: any;
    codeExists: boolean;
    phoneExists: boolean;
    emailExists: boolean;
    openDeleteSupplierPopup: Function;
    openDeleteSupplierContactPopup: Function;
    openDeleteSupplierFailurePopup: Function;
    closeDeleteSupplierPopup: Function;
    closeDeleteSupplierContactPopup: Function;
    closeDeleteSupplierFailurePopup: Function;
    deleteSupplierFailureMsg: string;
    contactTemp: any;
    totalCollection: any;
    supplierList: any;
    search: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    serachFilter: any;
    entryLimit: any;
    supplierErrorMessageDisplay: boolean;
    supplierTotalCollection: any;
    firstUpdate: boolean;
    firstContactUpdate: boolean;
    isContactUpdate: boolean;
    supplierTabClick: Function;
    nameRequired: any;
    supplierCodeRequired: any;
    supplierCodeUnique: any;
    addressRequired: any;
    phoneMinLength: any;
    phoneInvalid: any;
    phoneRequired: any;
    phoneUnique: any;
    FaxInvalid: any;
    emailRequired: any;
    emailInvalid: any;
    emailUnique: any;
    zipcodeMinlength: any;
    supplierTypeRequired: any;
    isFocusIn: boolean;
    supplierNotFound: any;
    onSeacrhSupplierNameChanged: Function;
    onSeacrhSupplierCodeChanged: Function;
    filterDays: Function;
    ValidZipcodeMessage: any;
    ValidNoofDaysMessage: any;
    ValidDiscountMessage: any;
    ValidPhoneExtensionMessage: any;
    ProfileTab: any;
    ContactInfoTab: any;
}

interface IsupplierProfileController {

}


class SupplierProfileController implements IsupplierProfileController {
    static controllerId = "SupplierProfileController";
    public deleteSupplierPopup;
    public deleteSupplierContactPopup;
    public deleteSupplierFailurePopup;

    constructor(private $scope: IsupplierProfileControllerScope, private $log: ng.ILocaleService, private supplierProfileService: SupplierProfileService, public ngToast, public $rootScope, public apiPath, public filterFilter, public $modal, public $location, public listOfAccessPages, public authenticationPath, private userAccessService: UserAccessService) {
        this.$scope.supplierProfile = new Model.SupplierProfile;
        this.$scope.discountDays = new Model.DiscountDays;
        this.$scope.contactPerson = new Model.ContactPerson;
        this.$scope.addSupplier = () => this.addSupplier();
        this.$scope.isAddSupplier = false;
        this.$scope.isActiveVisible = false;
        this.$scope.addSupplierProfiles = (supplierProfile: Model.SupplierProfile) => this.addSupplierProfiles(supplierProfile);
        this.$scope.getSupplierList = () => this.getSupplierList();
        this.$scope.getSupplierType = () => this.getSupplierType();
        this.$scope.searchSupplierDetails = () => this.searchSupplierDetails();
        this.$scope.cancel = () => this.cancel();
        this.$scope.cancelContact = (addSupplierContact) => this.cancelContact(addSupplierContact);
        this.$scope.deleteSupplierProfile = (id) => this.deleteSupplierProfile(id);
        this.$scope.editSupplierProfile = (Id: number) => this.editSupplierProfile(Id);
        this.$scope.onChangeSupplierType = (Id: number) => this.onChangeSupplierType(Id);
        this.$scope.onChangeDays = (Days: number) => this.onChangeDays(Days);
        this.$scope.addElements = ($scope) => this.addElements();
        this.$scope.removeElement = () => this.removeElement();
        this.$scope.checkDiscount = (discount) => this.checkDiscount(discount);
        this.$scope.updateSupplierProfile = (supplierProfile: Model.SupplierProfile) => this.updateSupplierProfile(supplierProfile);
        this.$scope.onIsActiveChanged = (id) => this.onIsActiveChanged(id);
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
        this.$scope.openDeleteSupplierPopup = (supplier: Model.SupplierProfile) => this.openDeleteSupplierPopup(supplier);
        this.$scope.openDeleteSupplierContactPopup = (contact: Model.SupplierProfile) => this.openDeleteSupplierContactPopup(contact);
        this.$scope.closeDeleteSupplierPopup = () => this.closeDeleteSupplierPopup();
        this.$scope.closeDeleteSupplierContactPopup = () => this.closeDeleteSupplierContactPopup();
        this.$scope.openDeleteSupplierFailurePopup = () => this.openDeleteSupplierFailurePopup();
        this.$scope.closeDeleteSupplierFailurePopup = () => this.closeDeleteSupplierFailurePopup();
        this.$scope.deleteSupplierFailureMsg = "";
        this.$scope.supplierDeleteFail = stringConstants.supplierDeleteFail;
        this.$scope.setForm = () => this.setForm();
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
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.supplierList.slice(begin, end);
        });
        this.$scope.isSupplierExixts = false;
        this.$scope.isAddContactPerson = false;
        this.$scope.addContact = () => this.addContact();
        this.$scope.getContactPersonList = (id) => this.getContactPersonList(id);
        this.$scope.addContactPerson = (contactPerson: Model.ContactPerson, addSupplierContact) => this.addContactPerson(contactPerson, addSupplierContact);
        this.$scope.deleteContactPerson = (id) => this.deleteContactPerson(id);
        this.$scope.editContactPerson = (ContactId: number) => this.editContactPerson(ContactId);
        this.$scope.updateContactPerson = (contactPerson: Model.ContactPerson, addSupplierContact) => this.updateContactPerson(contactPerson, addSupplierContact);
        this.$scope.contactPersonList = [];
        this.$scope.firstUpdate = false;
        this.$scope.firstContactUpdate = false;
        this.$scope.isContactUpdate = false;
        this.$scope.supplierTabClick = () => this.supplierTabClick();
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
        this.$scope.onSeacrhSupplierNameChanged = () => this.onSeacrhSupplierNameChanged();
        this.$scope.onSeacrhSupplierCodeChanged = () => this.onSeacrhSupplierCodeChanged();
        this.$scope.ProfileTab = stringConstants.ProfileTab;
        this.$scope.ContactInfoTab = stringConstants.ContactInfoTab;
    }

    private addSupplier() {
        let controllerScope = this.$scope;
        controllerScope.isAddSupplier = true;
        this.$scope.isFocusIn = true;
    }


    private addSupplierProfiles(supplierProfile) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        let isCredit = false;
        let canAdd = true;
        controllerRootScope.isLoading = true;
        for (let i = 0; i < controllerScope.supplierTypeList.length; i++) {
            if (controllerScope.supplierProfile.SupplierTypeId === controllerScope.supplierTypeList[i].Id) {
                if (controllerScope.supplierTypeList[i].ValueEn === "Credit") {
                    isCredit = true;
                }
            }
        }
        let supplierDetail = supplierProfile;
        if (supplierProfile.DiscountDays !== undefined || supplierProfile.DiscountDays !== null) {
            supplierDetail.DiscountDays = controllerScope.elementList;
        }
        if (canAdd) {
            let promise = this.supplierProfileService.saveSupplierProfile(supplierDetail);
            controllerScope.codeExists = false;
            promise.then((result) => {
                if (result.status !== undefined) {
                    this.ngToast.create(
                        {
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
                        let x = this;
                        x.$location.path("/SupplierProfile/");
                        controllerScope.supplierProfileList.push(result);
                        this.ngToast.create(stringConstants.SupplierAddedSuccessFully);
                    }
                    controllerRootScope.isLoading = false;
                }
            }).catch((error) => {
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
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.DaysLimitforCreditSupplier
                });
        }
    }


    // get supplier list - jj
    private getSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.supplierProfileList = [];
        controllerScope.supplierList = [];
        let supplierCollection = controllerScope.supplierList;
        let promise = this.supplierProfileService.getSupplierList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerScope.IsSupplierListVisible = false;
                controllerRootScope.isLoading = false;
            }
            else {
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < controllerScope.supplierTypeList.length; j++) {
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
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = supplierCollection.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.supplierList.length;
                }
                controllerRootScope.isLoading = false;
                controllerScope.IsSupplierListVisible = true;
            }
        }).catch((error) => {
            if (error.status === 500) {
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerScope.IsSupplierListVisible = false;
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }

    // get list of supplier types
    private getSupplierType() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        let location = this.$location.path();
        controllerRootScope.isLoading = true;
        let promise = this.supplierProfileService.getSupplierTypeList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.IsContactPersonListVisible = false;
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
            }
            else {
                controllerScope.supplierTypeList = result;
                this.getSupplierList();
            }
        })
            .catch((error) => {
                if (error.status !== 500) {
                    location.replace(this.apiPath);
                }
                controllerRootScope.isLoading = false;
            });
    }


    //delete supplier profile
    private deleteSupplierProfile(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierProfileService.deleteSupplierProfile(id);
        promise.then((result) => {
            this.closeDeleteSupplierPopup();
            controllerRootScope.isLoading = false;
            if (result.status === "") {
                let x = this;
                x.$location.path("/SupplierProfile/");
                this.ngToast.create(stringConstants.SupplierDeletedSuccessfully);
            }
            else {
                controllerScope.deleteSupplierFailureMsg = result.status;
                this.openDeleteSupplierFailurePopup();
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    // used to populate textboxes 
    private editSupplierProfile(Id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isContactUpdate = false;
        controllerScope.enableDaysLimit = false;
        controllerScope.isActiveVisible = true;
        controllerScope.isUpdate = true;
        controllerScope.isAddSupplier = true;
        controllerScope.supplierProfile = new Model.SupplierProfile();
        for (let i = 0; i <= controllerScope.supplierList.length; i++) {
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

                for (let i = 0; i < controllerScope.supplierTypeList.length; i++) {
                    if (controllerScope.supplierProfile.SupplierTypeId === controllerScope.supplierTypeList[i].Id) {
                        if (controllerScope.supplierTypeList[i].ValueEn === "Credit") {
                            controllerScope.enableDaysLimit = true;
                        }
                    }
                }
                controllerScope.supplierId = controllerScope.supplierProfile.Id;
                this.getContactPersonList(Id);
                break;
            }
        }

        let promise = this.supplierProfileService.getDaysDiscountList(Id);
        promise.then((result) => {
            controllerScope.supplierProfile.DiscountDays = [];

            if (result.length === 0) {
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
                controllerScope.supplierProfile.Discount = 0;
            }
            //inorder to fill data on the static days and discount field i'm making the following changes
            else {
                controllerScope.enableDaysLimit = true;
                controllerScope.hideDiscountDays = true;
                for (let a = 0; a < result.length; a++) {
                    if (a === 0) {
                        controllerScope.supplierProfile.Days = result[a].Days;
                        controllerScope.supplierProfile.Discount = result[a].Discount;
                    }
                    else {
                        controllerScope.elementList.push({ Days: result[a].Days, Discount: result[a].Discount });
                    }
                }

                for (let i = 1; i <= controllerScope.supplierProfile.TotalDaysLimit; i++) {
                    controllerScope.days[i] = { Id: i, Days: i };
                }
                controllerRootScope.isLoading = false;
            }

        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }


    private supplierTabClick() {
        let controllerScope = this.$scope;
        if (controllerScope.firstUpdate === true) {
            controllerScope.isUpdate = true;
        }
    }

    // update supplier - jj
    private updateSupplierProfile(supplierProfile) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.hideDiscountDays = true;
        let count = 0;

        for (let j = 0; j < controllerScope.supplierTypeList.length; j++) {
            if (controllerScope.supplierTypeList[j].Id === supplierProfile.SupplierTypeId && controllerScope.supplierTypeList[j].ValueEn === "Credit") {
                supplierProfile.DiscountDays = controllerScope.elementList;
            }
        }
        let promise = this.supplierProfileService.updateSupplier(supplierProfile);
        promise.then((result) => {
            if (result.status !== undefined) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: result.status
                    });
                controllerRootScope.isLoading = false;
            }
            else {
                for (let i = 0; i < controllerScope.supplierList.length; i++) {
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
                let x = this;
                x.$location.path("/SupplierProfile/");
                this.ngToast.create(stringConstants.SupplierUpdatedSuccessfully);
            }
        }).catch((error) => {
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

    //used to check whether supplier is involved in some other activity 
    private onIsActiveChanged(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierProfileService.checkSPOExist(id);
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.spoCount === 0) {
                }
                else {
                    alert(stringConstants.CanNotSetInactive);
                    controllerScope.supplierProfile.IsActive = true;
                }
            }

            controllerRootScope.isLoading = false;
        }).catch((error) => {
            if (error.status === 500) {

                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });

    }

    // used to check which type of supplier is selected and act accordingly
    private onChangeSupplierType(supplierType) {
        let controllerScope: any = this.$scope;
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
    }

    // called on changing the value of total days limit
    //it fills the dropdown of dayslimit
    private onChangeDays(Days) {
        if (!isNaN(Days)) {
            let controllerScope = this.$scope;
            controllerScope.supplierProfile.DiscountDays = [];
            controllerScope.elementList = [];
            controllerScope.days = [];
            let i = 1;
            controllerScope.supplierProfile.Discount = "";
            controllerScope.supplierProfile.Days = [];
            for (i = 1; i <= Days; i++) {
                controllerScope.days[i] = { Id: i, Days: i };
            }
        }
    }

    //used to dynamically add dropdown and textbox 
    private addElements() {
        let controllerScope = this.$scope;
        controllerScope.elementList.push({
            Discount: 0
        });
    }

    //used to dynamically remove dropdown and textbox 
    private removeElement() {
        let lastItem = this.$scope.elementList.length - 1;
        this.$scope.elementList.splice(lastItem);
    }


    //supplier profile search panel.
    private searchSupplierDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.totalItems = 0;
        controllerScope.currentPage = 1;
        controllerScope.supplierProfileList = this.filterFilter((controllerScope.supplierTotalCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.supplierProfileList.length === 0) {
            controllerScope.IsSupplierListVisible = false;
        } else {
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.supplierProfileList.slice(begin, end);
            controllerScope.totalItems = controllerScope.supplierProfileList.length;
            controllerScope.IsSupplierListVisible = true;
        }

        controllerScope.search = [];
    }

    //called whenever either supplierName  is selected
    private onSeacrhSupplierNameChanged() {
        let controllerScope = this.$scope;
        controllerScope.search.Code = "";
        let tempList = [];
        tempList = this.filterFilter((controllerScope.supplierTotalCollection), controllerScope.search);
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].NameEn === controllerScope.search.NameEn) {
                controllerScope.search.Code = tempList[i].Code;
            }
        }
    }


    //called whenever either supplierCode  is selected
    private onSeacrhSupplierCodeChanged() {
        let controllerScope = this.$scope;
        controllerScope.search.NameEn = "";
        let tempList = [];
        tempList = this.filterFilter((controllerScope.supplierTotalCollection), controllerScope.search);
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].Code === controllerScope.search.Code) {
                controllerScope.search.NameEn = tempList[i].NameEn;
            }
        }
    }


    //called on contact person tab click
    private addContact() {
        let controllerScope = this.$scope;
        if (controllerScope.isUpdate === true) {
        }
        else {
            alert(stringConstants.ChooseSupplier);
            let x = this;
            x.$location.path("/SupplierProfile/");
        }
    }

    // used to fetch Contact Person List of the supplier
    private getContactPersonList(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.contactPersonList = [];
        let promise = this.supplierProfileService.getContactList(id);
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.IsContactPersonListVisible = false;
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
            }
            else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.IsContactPersonListVisible = true;
                    controllerScope.contactPersonList.push(result[i]);
                    controllerRootScope.isLoading = false;
                }
            }
        }).catch((error) => {
            if (error.status === 500) {
                controllerScope.IsContactPersonListVisible = false;
                controllerScope.errorMessage = stringConstants.noDataFound;
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace(this.apiPath);
            }
        });
    }


    // Add new contact of supplier in database
    private addContactPerson(contactPerson, addSupplierContact) {
        let controllerRootScope = this.$rootScope;
        let controllerScope: any = this.$scope;
        controllerRootScope.isLoading = true;
        contactPerson.SupplierId = controllerScope.supplierId;
        let promise = this.supplierProfileService.saveContactPerson(contactPerson);
        promise.then((result) => {
            controllerScope.contactPersonList.push(result);
            controllerRootScope.isLoading = false;
            controllerScope.contactPerson = new Model.ContactPerson();
            controllerScope.IsContactPersonListVisible = true;
            addSupplierContact.$setPristine();
            addSupplierContact.$setUntouched();
            this.ngToast.create(stringConstants.ContactAdded);
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }


    //delete contact person
    private deleteContactPerson(contact) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierProfileService.deleteContactPerson(contact.Id);
        promise.then((result) => {
            this.closeDeleteSupplierContactPopup();
            this.getContactPersonList(contact.SupplierId);
            controllerRootScope.isLoading = false;
            this.ngToast.create(stringConstants.ContactDeleted);
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

    // to fill the grid on click of edit button of contact person
    private editContactPerson(ContactId) {
        let controllerScope = this.$scope;
        controllerScope.isContactUpdate = true;
        for (let i = 0; i <= controllerScope.contactPersonList.length; i++) {
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
    }

    private setForm() {
        let scope: any = this.$scope;
        scope.addSupplierContact.$setPristine();
        scope.addSupplierContact.$setValidity();
        scope.addSupplierContact.$setUntouched();
    }

    // update contact person
    private updateContactPerson(contactPerson, addSupplierContact) {
        let controllerScope: any = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.supplierProfileService.updateContactPerson(contactPerson);
        promise.then((result) => {
            for (let i = 0; i < controllerScope.contactPersonList.length; i++) {
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
            this.ngToast.create(stringConstants.SupplierUpdatedSuccessfully);
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            controllerScope.errorMessage = error.data.ExceptionMessage;
        });
    }


    // opening the DeleteSupplierPopup
    private openDeleteSupplierPopup(contact) {
        let controllerScope = this.$scope;
        this.deleteSupplierPopup = this.$modal.open({
            templateUrl: 'DeleteSupplierPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.supplierProfile = contact;
    }

    // opening the DeleteSupplierContactPopup
    private openDeleteSupplierContactPopup(contact) {
        let controllerScope = this.$scope;
        this.deleteSupplierContactPopup = this.$modal.open({
            templateUrl: 'DeleteSupplierContactPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
        controllerScope.contactTemp.Id = contact.ContactId;
        controllerScope.contactTemp.ContactNameEn = contact.ContactNameEn;
        controllerScope.contactTemp.SupplierId = contact.SupplierId;
    }

    //closing  the DeleteSupplierPopup
    private closeDeleteSupplierPopup() {
        let controllerScope = this.$scope;
        this.deleteSupplierPopup.dismiss('cancel');
        controllerScope.supplierProfile = new Model.SupplierProfile();
    }

    //closing  the DeleteSupplierContactPopup
    private closeDeleteSupplierContactPopup() {
        let controllerScope = this.$scope;
        this.deleteSupplierContactPopup.dismiss('cancel');
    }

    private cancel() {
        let controllerScope: any = this.$scope;
        controllerScope.supplierProfile = new Model.SupplierProfile();
        controllerScope.isUpdate = false;
        controllerScope.contactPerson = new Model.ContactPerson();
        controllerScope.isContactUpdate = false;
        controllerScope.contactPersonList = [];
        let x = this;
        x.$location.path("/SupplierProfile/");
    }

    private cancelContact(addSupplierContact) {
        let controllerScope = this.$scope;
        controllerScope.contactPerson = new Model.ContactPerson();
        controllerScope.isContactUpdate = false;
        addSupplierContact.$setPristine();
        addSupplierContact.$setUntouched();
    }


    // opening the DeleteSupplierFailurePopup
    private openDeleteSupplierFailurePopup() {
        let controllerScope = this.$scope;
        this.deleteSupplierFailurePopup = this.$modal.open({
            templateUrl: 'DeleteSupplierFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope,
        });
    }

    //closing  the DeleteSupplierFailurePopup
    private closeDeleteSupplierFailurePopup() {
        let controllerScope = this.$scope;
        this.deleteSupplierFailurePopup.dismiss('cancel');
    }

    //check whether valid discount has been added
    private checkDiscount(discount) {
        let scope = this.$scope;
        if (scope.isAddSupplier) {
            for (let i = 0; i < scope.supplierTypeList.length; i++) {
                if (scope.supplierProfile.SupplierTypeId === scope.supplierTypeList[i].Id) {
                    if (scope.supplierTypeList[i].ValueEn === "Credit") {
                        let controllerScope: any = this.$scope;
                        if (discount !== "" && isNaN(discount)) {
                            return true;
                        }
                        return false;
                    }
                }
            }
        }
    }
}

app.controller(SupplierProfileController.controllerId, ['$scope', '$log', 'SupplierProfileService', 'ngToast', '$rootScope', 'apiPath', 'filterFilter', '$modal', '$location', 'listOfAccessPages', 'authenticationPath', 'UserAccessService', ($scope, $log, SupplierProfileService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, UserAccessService) => {
    return new SupplierProfileController($scope, $log, SupplierProfileService, ngToast, $rootScope, apiPath, filterFilter, $modal, $location, listOfAccessPages, authenticationPath, UserAccessService);
}]);


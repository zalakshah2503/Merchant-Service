/// <reference path="../../services/branch/branchdetailservice.ts" />

interface IBranchControllerScope extends ng.IScope {
    branchDetail: Model.BranchDetail;
    addNewBranch: Function;
    editBranch: Function;
    addBranchDetail: Function;
    deleteBranchDetail: Function;
    deleteCpoAdditionalService: Function;
    getBranchList: Function;
    getBranchById: Function;
    getCompanyList: Function;
    getAdditionalService: Function;
    getAdditionalServiceName: Function;
    deleteAdditionalService: Function;
    removeChoice: Function;
    addElements: Function;
    isAddBranch: boolean;
    companyList: any;
    additionalServiceList: any;
    elementList: any;
    elementListTemp: any;
    additionalServiceListTemp: any;
    additionalGrid: any;
    additionalServiceName: any;
    radioChecked: any;
    temp: any;
    count: any;
    addBranch: any;
    emailExists: boolean;
    nameExists: boolean;
    codeExists: boolean;
    phoneExists: boolean;
    isEdit: boolean;
    isBranchListEmpty: boolean;
    isCompanyListEmpty: boolean;
    isBranchCpoListEmpty: boolean;
    openDeleteBranchPopup: Function;
    closeDeleteBranchPopup: Function;
    openDeleteFailureBranchPopup: Function;
    closeDeleteFailureBranchPopup: Function;
    deleteBranchFailureMsg: string;
    cancel: Function;
    // pagination
    totalCollection: any;
    branchList: any;
    search: any;
    totalItems: number;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    serachFilter: any;
    entryLimit: any;
    userErrorMessageDisplay: boolean;
    branchTotalCollection: any;
    branchNameRequired: any;
    branchNameUnique: any;
    codeRequired: any;
    codeUnique: any;
    addressRequired: any;
    companyRequired: any;
    emailRequired: any;
    emailUnique: any;
    phoneRequired: any;
    emailInvalid: any;
    phoneInvalid1: any;
    phoneMinLength: any;
    phoneUnique: any;
    zipcodeMinlength: any;
    spoList: any;
    location: any;
    isFocusIn: boolean;
}

interface IBranchController {

}

class BranchController implements IBranchController {
    static controllerId = "BranchController";
    public deleteBranchPopup;
    public deleteBranchFailurePopup;

    constructor(private $scope: IBranchControllerScope, private $location: ng.ILocationService, private $log: ng.ILogService, private branchDetailService: BranchDetailService, public ngToast, public $rootScope, public $routeParams, public $modal) {
        this.$rootScope.branchDetail = new Model.BranchDetail();
        this.$scope.addNewBranch = () => this.addNewBranch();
        this.$scope.editBranch = (id) => this.editBranch(id);
        this.$scope.addBranchDetail = (branchDetail) => this.addBranchDetail(branchDetail);
        this.$scope.deleteBranchDetail = (id) => this.deleteBranchDetail(id);
        this.$scope.getBranchList = () => this.getBranchList();
        this.$scope.getBranchById = () => this.getBranchById();
        this.$scope.getCompanyList = () => this.getCompanyList();
        this.$scope.cancel = () => this.cancel();
        this.$scope.elementList = [];
        this.$scope.additionalServiceListTemp = [];
        this.$scope.elementListTemp = [];
        this.$scope.additionalGrid = [];
        this.$scope.temp = [];
        this.$scope.additionalServiceName = "";
        this.$scope.emailExists = false;
        this.$scope.nameExists = false;
        this.$scope.codeExists = false;
        this.$scope.phoneExists = false;
        this.$scope.isEdit = false;
        this.$scope.isBranchListEmpty = false;
        this.$scope.isCompanyListEmpty = false;
        this.$scope.isBranchCpoListEmpty = false;
        this.$scope.openDeleteBranchPopup = (branch) => this.openDeleteBranchPopup(branch);
        this.$scope.closeDeleteBranchPopup = () => this.closeDeleteBranchPopup();
        this.$scope.openDeleteFailureBranchPopup = () => this.openDeleteBranchFailurePopup();
        this.$scope.closeDeleteFailureBranchPopup = () => this.closeDeleteBranchFailurePopup();
        this.$scope.deleteBranchFailureMsg = "";
        //paging
        this.$scope.totalCollection = [];
        this.$scope.branchList = [];
        this.$scope.search = [];
        this.$scope.branchTotalCollection = [];
        this.$scope.itemsPerPage = 15;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.serachFilter = 0;
        this.$scope.entryLimit = 10;
        this.$scope.branchNameRequired = stringConstants.branchNameRequired;
        this.$scope.branchNameUnique = stringConstants.branchNameUnique;
        this.$scope.codeUnique = stringConstants.codeUnique;
        this.$scope.addressRequired = stringConstants.addressRequired;
        this.$scope.codeRequired = stringConstants.codeRequired;
        this.$scope.companyRequired = stringConstants.companyRequired;
        this.$scope.emailRequired = stringConstants.emailRequired;
        this.$scope.phoneRequired = stringConstants.phoneRequired;
        this.$scope.emailInvalid = stringConstants.emailInvalid;
        this.$scope.phoneInvalid1 = stringConstants.phoneInvalid1;
        this.$scope.phoneMinLength = stringConstants.phoneMinLength;
        this.$scope.phoneUnique = stringConstants.phoneUnique;
        this.$scope.zipcodeMinlength = stringConstants.zipcodeMinlength;
        this.$scope.emailUnique = stringConstants.emailUnique;
        this.$scope.spoList = stringConstants.spoList;
        this.$scope.branchDetail.spoSelection = 2;
        this.$rootScope.location = "";
        let userPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.branchList.slice(begin, end);
        });
        this.$scope.isFocusIn = true;
        this.initialize();      
    }

    // on button click it will redirect to AddBranch page
    private addNewBranch() {
        this.$location.path("/AddBranch");
    }

    //edit user
    //on button click it will redirect to AddBranch page along with id
    private editBranch(id) {
        let x = this; let controllerScope = this.$scope;
        x.$location.path("/AddBranch/" + id);
    }

    private initialize() {
        //this.getAdditionalService();
        this.getCompanyList();
        if (this.$routeParams.id !== null && this.$routeParams.id !== undefined && this.$routeParams.id !== "") {
            this.getBranchById();
        }
    }
      

    //get branch list
    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.totalCollection = [];
        controllerScope.branchList = [];
        let branchCollection = controllerScope.branchList;
        let promise = this.branchDetailService.getBranchList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isBranchListEmpty = true;
            }
            else {
                controllerScope.isBranchListEmpty = false;;
                for (let i = 0; i < result.length; i++) {

                    branchCollection.push({ Id: result[i].Id, NameSl: result[i].NameSl,Name: result[i].Name, Address: result[i].Address, Phone: result[i].Phone, Code: result[i].Code });
                    controllerScope.branchTotalCollection = branchCollection;
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = branchCollection.slice(begin, end);
                    /* init pagination  */
                    controllerScope.totalItems = controllerScope.branchList.length;
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    // get branch detail of given id
    private getBranchById() {
        let branchId = this.$routeParams.id;
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.branchDetailService.getBranchById(branchId);
        promise.then((result) => {
            controllerScope.isEdit = true;
            controllerScope.branchDetail = result;
            controllerRootScope.location = result.Address;
            if (result.IsAutomaticIssueSPO === true) {
                controllerScope.branchDetail.spoSelection = 2;
            }
            else {
                controllerScope.branchDetail.spoSelection = 1;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
        });
    }

    //add or edit branch
    private addBranchDetail(branchDetail) {
        let controllerRootScope = this.$rootScope;
        let controllerScope = this.$scope;
        controllerRootScope.isLoading = true;
        controllerScope.isAddBranch = (branchDetail.Id === undefined || branchDetail.Id === null) ? true : false;
        if (branchDetail.spoSelection === 1) {
            branchDetail.IsAutomaticIssueSPO = false;
        }
        else {
            branchDetail.IsAutomaticIssueSPO = true;
        }
        let num = 0;
      
        branchDetail.Address = this.$rootScope.location;
        //add branch
        if (controllerScope.isAddBranch) {
            controllerScope.emailExists = false;
            controllerScope.codeExists = false;
            controllerScope.nameExists = false;
            controllerScope.phoneExists = false;
            let promise = this.branchDetailService.addBranchDetail(branchDetail);
            promise.then((result) => {
                if (result.Email === "invalid") {
                    controllerScope.emailExists = true;
                    //   controllerScope.addBranch.branchEmail.$setValidity = ("emailExists", false);                  
                }
                else if (result.Name === "invalid") {
                    controllerScope.nameExists = true;
                }
                else if (result.Code === "invalid") {
                    controllerScope.codeExists = true;
                }
                else if (result.Phone === "invalid") {
                    controllerScope.phoneExists = true;
                }
                else {
                    window.location.assign('#ManageBranch');
                    this.ngToast.create("Branch Added Successfully");
                }
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                if (error.status === 0 || error.status === 500) {
                }
                else {
                    location.replace('/');
                }
                controllerRootScope.isLoading = false;
                this.$log.error(error);
            });
        }
        //edit branch
        else {
            let promise = this.branchDetailService.updateBranchDetail(branchDetail);
            promise.then((result) => {
                if (result.nameExists) {
                    controllerScope.nameExists = true;
                }
                else if (result.codeExists) {
                    controllerScope.codeExists = true;
                }
                else if (result.emailExixts) {
                    controllerScope.emailExists = true;
                }
                else if (result.phoneExists) {
                    controllerScope.phoneExists = true;
                }
                else {
                    window.location.assign('#ManageBranch');
                    this.ngToast.create("Branch Updated Successfully");
                }
                controllerRootScope.isLoading = false;
            }).catch((error) => {
                if (error.status === 0 || error.status === 500) {
                }
                else {
                    location.replace('/');
                }
                controllerRootScope.isLoading = false;
                this.$log.error(error);
            });
        }
    }
    
    //delete branch profile
    private deleteBranchDetail(id) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.branchDetailService.deleteBranchDetail(id);
        promise.then((result) => {
            controllerRootScope.isLoading = false;
            this.closeDeleteBranchPopup();
            if (result.status === "") {
                window.location.assign('#ManageBranch');
                this.ngToast.create("Branch Deleted Successfully");
            }
            else {
                controllerScope.deleteBranchFailureMsg = result.status;
                this.openDeleteBranchFailurePopup();
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
        });
    }

   
    // get all company list
    private getCompanyList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //    controllerScope.companyList = [];
        let promise = this.branchDetailService.getCompanyList();
        promise.then((result) => {
            this.$log.log('get all company list successfully', result.length);
            if (result.length === 0) {
                controllerScope.isCompanyListEmpty = true;

            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            this.$log.log(error);
            if (error.status === 500) {
                controllerRootScope.isLoading = false;
            }
            else {
                location.replace('/');
            }
        });
    }

  

    // open the DeleteBranchPopup
    private openDeleteBranchPopup(branch) {
        let controllerScope = this.$scope;
        this.deleteBranchPopup = this.$modal.open({
            templateUrl: 'DeleteBranchPopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });
        controllerScope.branchDetail = branch;
    }
      
    //closing  the DeleteBranchPopup
    private closeDeleteBranchPopup() {
        this.deleteBranchPopup.dismiss('cancel');
    }


    // open the DeleteBranchFailurePopup
    private openDeleteBranchFailurePopup() {
        let controllerScope = this.$scope;
        this.deleteBranchFailurePopup = this.$modal.open({
            templateUrl: 'DeleteBranchFailurePopup',
            backdrop: 'static',
            keyboard: true,
            scope: this.$scope
        });

    }
      
    //closing  the DeleteBranchFailurePopup
    private closeDeleteBranchFailurePopup() {
        this.deleteBranchFailurePopup.dismiss('cancel');
    }

    private cancel() {
        window.location.assign('#ManageBranch');
    }
}

app.controller(BranchController.controllerId, ['$scope', '$location', '$log', 'BranchDetailService', 'ngToast', '$rootScope', '$routeParams', '$modal', ($scope, $location, $log, branchDetailService, ngToast, $rootScope, $routeParams, $modal) => {
    return new BranchController($scope, $location, $log, branchDetailService, ngToast, $rootScope, $routeParams, $modal);
}]);
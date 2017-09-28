// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IinventoryMoniterControllerScope extends ng.IScope {
    supplierCollection: any;
    isErrorMessageDisplay: boolean;
    errorMessage: string;
    categoryCollection: any;
    branchList;
    inventoryColletion: any;
    errorMessageDisplayForBlankList: boolean;
    inventoryTypeCollection: any;
    getAllInvetoryType: Function;
    issueInventoryDetails: Model.IssueInventoryAc;
    getAllInventoryList: () => void;
    cancelIssueInventory: () => void;
    viewIssueStockInventoryRecordDetailsById: Function;
    viewIssueStockInventoryMoniterDetailsById: Function;
    isAllowMoniterView: boolean;
    customInventoryCollection: any;
    search: any;
    searchIssueInventoryDetails: Function;
    isDataLoading: boolean;
    noRecordFound: any;
}

interface IinventoryMoniterController {

}

class InventoryMoniterController implements IinventoryMoniterController {


    static controllerId = "inventoryMoniterController";

    constructor(private $scope: IinventoryMoniterControllerScope, private $log: ng.ILogService, private $location: ng.ILocationService, private issueStockInventoryService: IssueStockInventoryService, public $rootScope, public $routeParams, private apiPath, public $modal, public filterFilter, public ngToast) {
        this.$scope.getAllInvetoryType = () => this.getAllInvetoryType();
        this.$scope.inventoryTypeCollection = [];
        this.$scope.issueInventoryDetails = new Model.IssueInventoryAc();
        this.$scope.supplierCollection = [];
        this.$scope.categoryCollection = [];
        this.$scope.isErrorMessageDisplay = false;
        this.$scope.errorMessage = "";
        this.$scope.branchList = [];
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.getAllInventoryList = () => this.getAllInventoryList();
        this.$scope.isAllowMoniterView = false;
        this.$scope.viewIssueStockInventoryMoniterDetailsById = (issueInventoryId: number) => this.viewIssueStockInventoryMoniterDetailsById(issueInventoryId);
        this.$scope.cancelIssueInventory = () => this.cancelIssueInventory();
        this.$scope.customInventoryCollection = [];
        this.$scope.search = new Model.IssueInventoryAc();
        this.$scope.searchIssueInventoryDetails = () => this.searchIssueInventoryDetails();
        this.$scope.isDataLoading = false;
        this.$scope.noRecordFound = stringConstants.noRecordFound;
        this.initialize();
    }

    private initialize() {
        this.getAllSupplierList();
        this.getBranchList();
    }

    private getAllSupplierList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.supplierCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllSupplierList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerScope.errorMessage = stringConstants.errorMessage;
                controllerRootScope.isLoading = false;
            } else {
                controllerScope.isErrorMessageDisplay = false;
                this.$log.log("get supplier succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.supplierCollection.push(result[i]);
                }
                this.getAllCateGoryList();
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private getAllCateGoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.categoryCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllCateGoryList();
        promise.then((result) => {
            if (result.length === 0) {
                controllerScope.isErrorMessageDisplay = true;
                controllerRootScope.isLoading = false;
                controllerScope.errorMessage = stringConstants.errorMessage;
            } else {
                controllerScope.isErrorMessageDisplay = false;
                this.$log.log("get category succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private getBranchList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;

        //To get branch list
        let promise = this.issueStockInventoryService.getBranchList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.branchList.push({ BranchId: result[i].Id, Name: result[i].Name });
                }
                this.getAllInvetoryType();
                controllerRootScope.isLoading = false;
            }
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }

    private getAllInventoryList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.isDataLoading = true;
        controllerScope.inventoryColletion = [];
        controllerScope.customInventoryCollection = [];
        let promise = this.issueStockInventoryService.getAllInventoryList();
        promise.then((result) => {
            this.$log.log("get all incident report succssfully");
            if (result.length === 0) {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
            } else {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.inventoryColletion.push(result[i]);
                }
                controllerScope.customInventoryCollection = controllerScope.inventoryColletion;
                controllerScope.isDataLoading = false;
            }
        }).catch((error) => {
            if (error.data === "") {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            } else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isDataLoading = false;
                this.$log.log(error);
            }
            this.$log.log(error);
        });
    }

    private searchIssueInventoryDetails() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.inventoryColletion = this.filterFilter((controllerScope.customInventoryCollection), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (controllerScope.inventoryColletion.length === 0) {
            this.$scope.errorMessage = stringConstants.errorMessage;
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.search = new Model.IssueInventoryAc();
        } else {
            controllerScope.search = new Model.IssueInventoryAc();
            controllerScope.errorMessageDisplayForBlankList = false;
        }
    }

    private getAllInvetoryType() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerScope.inventoryTypeCollection = [];
        controllerRootScope.isLoading = true;
        let promise = this.issueStockInventoryService.getAllInvetoryType();
        promise.then((result) => {
            if (result.length === 0) {
                controllerRootScope.isLoading = false;
            } else {
                this.$log.log("get inventory type succssfully");
                for (let i = 0; i < result.length; i++) {
                    controllerScope.inventoryTypeCollection.push(result[i]);
                }
                controllerRootScope.isLoading = false;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            location.replace(this.apiPath);
            this.$log.log(error);
        });
    }

    private cancelIssueInventory() {
        let controllerScope = this.$scope;
        this.$location.path("/InventoryMonitorWorkList/");
    }

    private viewIssueStockInventoryMoniterDetailsById(issueInventoryId) {
        let controllerScope = this.$scope;
        this.$location.path("/InventoryMonitor/" + issueInventoryId);
    }
}

app.controller(InventoryMoniterController.controllerId, ['$scope', '$log', '$location', 'issueStockInventoryService', '$rootScope', '$routeParams', 'apiPath', '$modal', 'filterFilter', 'ngToast', ($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast) => {
    return new InventoryMoniterController($scope, $log, $location, issueStockInventoryService, $rootScope, $routeParams, apiPath, $modal, filterFilter, ngToast);
}]);

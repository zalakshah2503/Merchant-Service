/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />

interface IitemProfileListControllerScope extends ng.IScope {
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    totalItemProfileItems: number;
    totalCollectionList: any;
    searchEvent: Function;
    itemProfileErrorMessageDisplay: boolean;
    itemProfileCollectionList: any;
    categoryList: any;
    search: any;
    isItemGrid: boolean;
}

interface IitemProfileListController {

}

class ItemProfileListController implements IitemProfileListController {
    static controllerId = "itemProfileListController";
    constructor(private $scope: IitemProfileListControllerScope, private $log: ng.ILogService, public $rootScope, private addNewItemProfileService: AddNewItemProfileService, private userAccessService: UserAccessService, public apiPath, public ngToast, public listOfAccessPages, public authenticationPath, public $location, public $modal, public filterFilter) {
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 3;
        this.$scope.maxSize = 100;
        this.$scope.totalCollectionList = [];
        this.$scope.searchEvent = () => this.searchEvent();
        this.$scope.itemProfileCollectionList = [];
        this.$scope.itemProfileErrorMessageDisplay = false;
        this.$scope.categoryList = [];
        this.$scope.search = [];
        this.$scope.isItemGrid = true;
        this.initialize();

        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollectionList = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollectionList = this.$scope.itemProfileCollectionList.slice(begin, end);
        });

    }




    private initialize() {
        this.getCategoryItemList();
        this.gridBindingForMainItem();
    }


    //this function used for binding for main item. -An 
    private gridBindingForMainItem() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileErrorMessageDisplay = false;
        controllerScope.itemProfileCollectionList = [];
        let itemProfileList = controllerScope.itemProfileCollectionList;
        let promise = this.addNewItemProfileService.getItemProfileList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].IsActive)
                        result[i].IsActive = stringConstants.yes;
                    else
                        result[i].IsActive = stringConstants.no;
                    itemProfileList.push(result[i]);
                }

                let that = this;
                let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                    end = begin + that.$scope.itemsPerPage;
                controllerScope.totalCollectionList = itemProfileList.slice(begin, end);
                /* init pagination with $scope.list */
                controllerScope.totalItemProfileItems = controllerScope.itemProfileCollectionList.length;
                controllerScope.isItemGrid = true;

            }
            else {
                controllerScope.isItemGrid = false;
                controllerScope.itemProfileErrorMessageDisplay = true;
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
    //this function used for get category list. -An
    private getCategoryItemList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.addNewItemProfileService.getCategoryList();
        promise.then((result) => {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch((error) => {
            controllerRootScope.isLoading = false;
            this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(this.apiPath);
            }
        });
    }
    //This funciton used for search funcitonality in main item grid. -An
    private searchEvent() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.itemProfileErrorMessageDisplay = false;
        let searchList = this.filterFilter((controllerScope.itemProfileCollectionList), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (searchList === 0) {
            controllerScope.itemProfileErrorMessageDisplay = true;
            controllerScope.totalCollectionList = [];
            controllerScope.isItemGrid = false;
        }
        else {
            controllerScope.isItemGrid = true;
            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollectionList = searchList.slice(begin, end);
            controllerScope.totalItemProfileItems = searchList.length;
            controllerScope.itemProfileErrorMessageDisplay = false;
        }
        controllerScope.search = [];

    }

}

app.controller(ItemProfileListController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'UserAccessService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', 'filterFilter', ($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter) => {
    return new ItemProfileListController($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter);
}]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />




interface IitemCollectionControllerScope extends ng.IScope {
    categoryList: any;
    unitList: any;
    itemProfileCollection: any;
    errorMessageDisplayForBlankList: boolean;
    isItemGrid: boolean;
    totalCollection: any;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    maxSize: number;
    searchEvent: Function;
    search: any;
    getchildItemList: Function;
    cancelButtonForItemPopup: Function;
    totalItemCollection: any;

}

interface IitemCollectionController {

}

class ItemCollectionController implements IitemCollectionController {
    static controllerId = "itemCollectionController";
    constructor(private $scope: IitemCollectionControllerScope, private $log: ng.ILogService, public $rootScope, private addNewItemProfileService: AddNewItemProfileService, public apiPath, public ngToast, public authenticationPath, public $location, public $modal, public filterFilter, public $routeParams) {
        this.$scope.categoryList = [];
        this.$scope.unitList = [];
        this.$scope.itemProfileCollection = [];
        this.$scope.totalCollection = [];
        this.$scope.isItemGrid = false;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 2;
        this.$scope.maxSize = 10;
        this.$scope.searchEvent = () => this.searchEvent();
        this.$scope.search = [];
        this.$scope.totalItemCollection = [];
        this.$scope.getchildItemList = (parentId) => this.getchildItemList(parentId);

        let itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", () => {
            this.$scope.totalCollection = [];
            let begin = ((this.$scope.currentPage - 1) * this.$scope.itemsPerPage),
                end = begin + this.$scope.itemsPerPage;
            this.$scope.totalCollection = this.$scope.itemProfileCollection.slice(begin, end);
        });

        this.initialization();
    }

    private initialization() {
        this.getItemProfileList();
        this.getUnitTypeList();
        this.getCategoryList();
    }

    //This function used for get category list.
    private getCategoryList() {
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

    //This funciton used for get unit type.
    private getUnitTypeList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        let promise = this.addNewItemProfileService.getUnitList();
        promise.then((result) => {
            if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
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

    //this function used for get item profile list -An
    private getItemProfileList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        let itemProfileList = controllerScope.itemProfileCollection;
        let promise = this.addNewItemProfileService.getItemProfileList();
        promise.then((result) => {
            if (result !== null) {
                if (result.length > 0) {
                    controllerScope.isItemGrid = true;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].IsActive)
                            result[i].IsActive = stringConstants.yes;
                        else
                            result[i].IsActive = stringConstants.no;
                        if (result[i].listOfChildProfileAC !== null) {
                            for (let j = 0; j < result[i].listOfChildProfileAC.length; j++) {
                                if (result[i].listOfChildProfileAC[j].IsActive)
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.yes;
                                else
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.no;
                            }
                        }
                        itemProfileList.push(result[i]);
                    }
                    let that = this;
                    let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                        end = begin + that.$scope.itemsPerPage;
                    controllerScope.totalCollection = itemProfileList.slice(begin, end);
                    /* init pagination with $scope.list */
                    controllerScope.totalItems = controllerScope.itemProfileCollection.length;
                    controllerScope.totalItemCollection = controllerScope.itemProfileCollection;

                }
                else {
                    controllerScope.errorMessageDisplayForBlankList = true;
                    controllerScope.isItemGrid = false;
                }
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isItemGrid = false;
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

    //This funciton used for search funcitonality. -An
    private searchEvent() {
        let controllerScope = this.$scope;
        let that = this;
        controllerScope.errorMessageDisplayForBlankList = false;

        //create sub Item Search List;
        let subItemSearch = [];
        if (controllerScope.totalItemCollection.length > 0) {
            for (let i = 0; i < controllerScope.totalItemCollection.length; i++) {
                if (controllerScope.totalItemCollection[i].listOfChildProfileAC !== null) {
                    for (let j = 0; j < controllerScope.totalItemCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.totalItemCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }
        let searching = this.filterFilter((subItemSearch), controllerScope.search);
        controllerScope.itemProfileCollection = this.filterFilter((controllerScope.totalItemCollection), controllerScope.search);

        if (controllerScope.itemProfileCollection === 0 && searching === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
            controllerScope.isItemGrid = false;
        }
        else {
            if (searching !== 0) {
                for (let i = 0; i < controllerScope.totalItemCollection.length; i++) {
                    for (let j = 0; j < searching.length; j++) {
                        if (controllerScope.totalItemCollection[i].Id === searching[j].ParentItemId) {
                            let isAlreadyExists = true;
                            for (let k = 0; k < controllerScope.itemProfileCollection.length; k++) {
                                if (controllerScope.itemProfileCollection[k].Id === controllerScope.totalItemCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemProfileCollection.push(controllerScope.totalItemCollection[i]);
                        }
                    }
                }
            }

            let begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage),
                end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.itemProfileCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.itemProfileCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
            controllerScope.isItemGrid = true;
        }
        controllerScope.search = [];
    }

    //This function used for get sub item list. -An
    private getchildItemList(parentId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let getClass = angular.element("#item" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {//to check click on pluse or minus icon.
            angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
            angular.element("#subChildItem" + parentId).removeClass('isHide').addClass('isShowRow');
            angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');

            angular.element("#item" + parentId).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
        }
        else {
            angular.element("#subChildItem" + parentId).removeClass('isShowRow').addClass('isHide');
            angular.element("#item" + parentId).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
        }
        controllerRootScope.isLoading = false;
    }

}



app.controller(ItemCollectionController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', ($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) => {
    return new ItemCollectionController($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
}]);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />

interface IitemProfileControllerScope extends ng.IScope {
    addNewItemProfile: Model.AddNewItemProfile;
    addNewItem: Function;
    itemsPerPage: number;
    currentPage: any;
    maxSize: number;
    unitList: any;
    categoryList: any;
    itemProfileCollection: any;
    totalItemProfileCollection: any;
    totalItems: number;
    totalCollection: any;
    editItemProfile: Function;
    deleteItemProfile: Function;
    addSubItem: Function;
    search: any;
    searchEvent: Function;
    errorMessage: string;
    errorMessageDisplayForBlankList: boolean;
    getSubItemList: Function;
    subItemCollection: any;
    previousId: number;
    deleteItemProfilePopup: Function;
    deletedItemId: number;
    cancelDeleteItemProfilePopup: Function;
    isItemGrid: boolean;
    isFocusIn: boolean;
    offerItemList: any;
    activeList: any;
    autoPOList: any;
    noItemFound: any;
}

interface IitemProfileController {

}

class ItemProfileController implements IitemProfileController {
    static controllerId = "itemProfileController";
    public delteItemPopup;
    constructor(private $scope: IitemProfileControllerScope, private $log: ng.ILogService, public $rootScope, private addNewItemProfileService: AddNewItemProfileService, public apiPath, public ngToast, public listOfAccessPages, public authenticationPath, public $location, public $modal, public filterFilter) {
        this.$scope.addNewItem = () => this.addNewItem();
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.editItemProfile = (id, isParentItem) => this.editItemProfile(id, isParentItem);
        this.$scope.deleteItemProfile = () => this.deleteItemProfile();
        this.$scope.getSubItemList = (parentId) => this.getSubItemList(parentId);
        this.$scope.addSubItem = (id) => this.addSubItem(id);
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.categoryList = [];
        this.$scope.searchEvent = () => this.searchEvent();
        this.$scope.unitList = [];
        this.$scope.search = [];
        this.$scope.errorMessage = stringConstants.errorMessage;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.subItemCollection = [];
        this.$scope.previousId = 0;
        this.$scope.deleteItemProfilePopup = (item) => this.deleteItemProfilePopup(item);
        this.$scope.deletedItemId = 0;
        this.$scope.cancelDeleteItemProfilePopup = () => this.cancelDeleteItemProfilePopup();
        this.$scope.isItemGrid = false;
        this.$rootScope.isFocusIn = true;
        this.$scope.totalItemProfileCollection = [];
        this.$scope.noItemFound = stringConstants.noItemFound;
        this.$scope.offerItemList = [
            { Name: stringConstants.yes, IsOfferItem: stringConstants.yes },
            { Name: stringConstants.no, IsOfferItem: stringConstants.no },
        ];
        this.$scope.activeList = [
            { Name: stringConstants.yes, IsActive: stringConstants.yes },
            { Name: stringConstants.no, IsActive: stringConstants.no },
        ];
        this.$scope.autoPOList = [
            { Name: stringConstants.yes, IsIcrApproved: stringConstants.yes },
            { Name: stringConstants.no, IsIcrApproved: stringConstants.no },
        ];

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

    //this function used for get item profile list -An
    private getItemProfileList() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.subItemCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        let itemProfileList = controllerScope.itemProfileCollection;
        let promise = this.addNewItemProfileService.getItemProfileList();
        promise.then((result) => {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.isItemGrid = true;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].IsActive)
                            result[i].IsActive = stringConstants.yes;
                        else
                            result[i].IsActive = stringConstants.no;

                        if (result[i].IsOfferItem)
                            result[i].IsOfferItem = stringConstants.yes;
                        else
                            result[i].IsOfferItem = stringConstants.no;

                        if (result[i].IsIcrApproved)
                            result[i].IsIcrApproved = stringConstants.yes;
                        else
                            result[i].IsIcrApproved = stringConstants.no;

                        if (result[i].listOfChildProfileAC !== null && result[i].listOfChildProfileAC !== undefined) {
                            for (let j = 0; j < result[i].listOfChildProfileAC.length; j++) {
                                if (result[i].listOfChildProfileAC[j].IsActive)
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.yes;
                                else
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.no;

                                if (result[i].listOfChildProfileAC[j].IsOfferItem)
                                    result[i].listOfChildProfileAC[j].IsOfferItem = stringConstants.yes;
                                else
                                    result[i].listOfChildProfileAC[j].IsOfferItem = stringConstants.no;

                                if (result[i].listOfChildProfileAC[j].IsIcrApproved)
                                    result[i].listOfChildProfileAC[j].IsIcrApproved = stringConstants.yes;
                                else
                                    result[i].listOfChildProfileAC[j].IsIcrApproved = stringConstants.no;
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
                    controllerScope.totalItemProfileCollection = controllerScope.itemProfileCollection;
                    controllerRootScope.isLoading = false;
                }
                else {
                    controllerScope.errorMessageDisplayForBlankList = true;
                    controllerScope.isItemGrid = false;
                    controllerRootScope.isLoading = false;
                }
            }
            else {
                controllerScope.errorMessageDisplayForBlankList = true;
                controllerScope.isItemGrid = false;
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

    //this function used for redirect to edit item page. -An
    private editItemProfile(id, isParentItem) {
        if (isParentItem)
            this.$location.path("/EditNewItem/" + id);
        else
            this.$location.path("/EditSubItem/" + id);
        angular.element('html,body').animate({ scrollTop: 0 }, 100);
    }

    //this function used for cancel Item Profile. -An
    private cancelDeleteItemProfilePopup() {
        this.delteItemPopup.dismiss('cancel');
    }

    //this function used for add new item. -An
    private addNewItem() {
        this.$location.path('/AddNewItem');
        this.$scope.isFocusIn = true;
    }

    //this function used for open delete item profile popup. -An
    private deleteItemProfilePopup(item) {
        this.$scope.deletedItemId = item.Id;
        if (item.IsIssueInventory === false) {
            this.delteItemPopup = this.$modal.open({
                templateUrl: 'deleteItemProfile',
                backdrop: 'static',
                keyboard: true,
                size: 'sm',
                scope: this.$scope,
            });
        }
        else {
            this.ngToast.create(
                {
                    className: 'danger',
                    content: stringConstants.issueInventoryItem
                });
        }
    }

    //this function ised for delete item profile. An
    private deleteItemProfile() {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let promise = this.addNewItemProfileService.deleteItemProfile(this.$scope.deletedItemId);
        promise.then((result) => {
            this.delteItemPopup.dismiss('cancel');
            if (result._isResult === null || result._isResult === undefined) {
                this.getItemProfileList();
                this.ngToast.create(stringConstants.deltedItem);
            }
            else if (+result._isResult === -1) {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.itemNotDeleted
                    });
            }
            else {
                this.ngToast.create(
                    {
                        className: 'danger',
                        content: stringConstants.NotDeleteMainItem.replace(/{result}/, result._isResult)
                    });
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

    //this function used for redirect to add sub item. -An
    private addSubItem(id) {
        this.$location.path("/AddSubItem/" + id);
    }

    //This funciton used for search funcitonality. -An
    private searchEvent() {
        let controllerScope = this.$scope;
        let that = this;
        let searching = [];
        controllerScope.errorMessageDisplayForBlankList = false;

        let subItemSearch = [];
        if (controllerScope.totalItemProfileCollection.length > 0) {
            for (let i = 0; i < controllerScope.totalItemProfileCollection.length; i++) {
                if (controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== null && controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== undefined) {
                    for (let j = 0; j < controllerScope.totalItemProfileCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.totalItemProfileCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }

        if ((controllerScope.search.ItemNameEn !== undefined && controllerScope.search.ItemNameEn !== null) || (controllerScope.search.CategoryId !== undefined && controllerScope.search.CategoryId !== null) || (controllerScope.search.IsOfferItem !== undefined && controllerScope.search.IsOfferItem !== null) ||
            (controllerScope.search.Barcode !== undefined && controllerScope.search.Barcode !== null) || (controllerScope.search.UnitParamTypeId !== undefined && controllerScope.search.UnitParamTypeId !== null) || (controllerScope.search.IsActive !== undefined && controllerScope.search.IsActive !== null) ||
            (controllerScope.search.FlavourEn !== undefined && controllerScope.search.FlavourEn !== null) || (controllerScope.search.Code !== undefined && controllerScope.search.Code !== null) || (controllerScope.search.IsIcrApproved !== undefined && controllerScope.search.IsIcrApproved !== null))
            searching = this.filterFilter((subItemSearch), controllerScope.search);

        controllerScope.itemProfileCollection = this.filterFilter((controllerScope.totalItemProfileCollection), controllerScope.search);

        if (controllerScope.itemProfileCollection === 0 && searching.length === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
            controllerScope.isItemGrid = false;
        }
        else {
            if (searching !== undefined && searching !== null && searching.length !== 0) {
                for (let i = 0; i < controllerScope.totalItemProfileCollection.length; i++) {
                    for (let j = 0; j < searching.length; j++) {
                        if (controllerScope.totalItemProfileCollection[i].Id === searching[j].ParentItemId) {

                            let isAlreadyExists = true;
                            for (let k = 0; k < controllerScope.itemProfileCollection.length; k++) {
                                if (controllerScope.itemProfileCollection[k].Id === controllerScope.totalItemProfileCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemProfileCollection.push(controllerScope.totalItemProfileCollection[i]);
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
    private getSubItemList(parentId) {
        let controllerScope = this.$scope;
        let controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        let getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {//to check click on pluse or minus icon.
            angular.element(".sub-grid-list").removeClass('isShowRow').addClass('isHide');
            angular.element("#subChild" + parentId).removeClass('isHide').addClass('isShowRow');
            angular.element(".action-icon").removeClass('fa-minus').addClass('fa-plus');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-plus').addClass('fa-minus');
        }
        else {
            angular.element("#subChild" + parentId).removeClass('isShowRow').addClass('isHide');
            angular.element("#" + parentId).find('i.action-icon').removeClass('fa-minus').addClass('fa-plus');
        }
        controllerRootScope.isLoading = false;
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
}

app.controller(ItemProfileController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', 'filterFilter', ($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter) => {
    return new ItemProfileController($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter);
}]);


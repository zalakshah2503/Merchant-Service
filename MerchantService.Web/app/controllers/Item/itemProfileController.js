/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
var ItemProfileController = (function () {
    function ItemProfileController($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.addNewItemProfileService = addNewItemProfileService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$scope.addNewItem = function () { return _this.addNewItem(); };
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;
        this.$scope.maxSize = 10;
        this.$scope.editItemProfile = function (id, isParentItem) { return _this.editItemProfile(id, isParentItem); };
        this.$scope.deleteItemProfile = function () { return _this.deleteItemProfile(); };
        this.$scope.getSubItemList = function (parentId) { return _this.getSubItemList(parentId); };
        this.$scope.addSubItem = function (id) { return _this.addSubItem(id); };
        this.$scope.addNewItemProfile = new Model.AddNewItemProfile();
        this.$scope.categoryList = [];
        this.$scope.searchEvent = function () { return _this.searchEvent(); };
        this.$scope.unitList = [];
        this.$scope.search = [];
        this.$scope.errorMessage = stringConstants.errorMessage;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.subItemCollection = [];
        this.$scope.previousId = 0;
        this.$scope.deleteItemProfilePopup = function (item) { return _this.deleteItemProfilePopup(item); };
        this.$scope.deletedItemId = 0;
        this.$scope.cancelDeleteItemProfilePopup = function () { return _this.cancelDeleteItemProfilePopup(); };
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
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.itemProfileCollection.slice(begin, end);
        });
        this.initialization();
    }
    ItemProfileController.prototype.initialization = function () {
        this.getItemProfileList();
        this.getUnitTypeList();
        this.getCategoryList();
    };
    //this function used for get item profile list -An
    ItemProfileController.prototype.getItemProfileList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.subItemCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var itemProfileList = controllerScope.itemProfileCollection;
        var promise = this.addNewItemProfileService.getItemProfileList();
        promise.then(function (result) {
            if (result !== null && result !== undefined) {
                if (result.length > 0) {
                    controllerScope.isItemGrid = true;
                    for (var i = 0; i < result.length; i++) {
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
                            for (var j = 0; j < result[i].listOfChildProfileAC.length; j++) {
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
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for redirect to edit item page. -An
    ItemProfileController.prototype.editItemProfile = function (id, isParentItem) {
        if (isParentItem)
            this.$location.path("/EditNewItem/" + id);
        else
            this.$location.path("/EditSubItem/" + id);
        angular.element('html,body').animate({ scrollTop: 0 }, 100);
    };
    //this function used for cancel Item Profile. -An
    ItemProfileController.prototype.cancelDeleteItemProfilePopup = function () {
        this.delteItemPopup.dismiss('cancel');
    };
    //this function used for add new item. -An
    ItemProfileController.prototype.addNewItem = function () {
        this.$location.path('/AddNewItem');
        this.$scope.isFocusIn = true;
    };
    //this function used for open delete item profile popup. -An
    ItemProfileController.prototype.deleteItemProfilePopup = function (item) {
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
            this.ngToast.create({
                className: 'danger',
                content: stringConstants.issueInventoryItem
            });
        }
    };
    //this function ised for delete item profile. An
    ItemProfileController.prototype.deleteItemProfile = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.addNewItemProfileService.deleteItemProfile(this.$scope.deletedItemId);
        promise.then(function (result) {
            _this.delteItemPopup.dismiss('cancel');
            if (result._isResult === null || result._isResult === undefined) {
                _this.getItemProfileList();
                _this.ngToast.create(stringConstants.deltedItem);
            }
            else if (+result._isResult === -1) {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.itemNotDeleted
                });
            }
            else {
                _this.ngToast.create({
                    className: 'danger',
                    content: stringConstants.NotDeleteMainItem.replace(/{result}/, result._isResult)
                });
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for redirect to add sub item. -An
    ItemProfileController.prototype.addSubItem = function (id) {
        this.$location.path("/AddSubItem/" + id);
    };
    //This funciton used for search funcitonality. -An
    ItemProfileController.prototype.searchEvent = function () {
        var controllerScope = this.$scope;
        var that = this;
        var searching = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var subItemSearch = [];
        if (controllerScope.totalItemProfileCollection.length > 0) {
            for (var i = 0; i < controllerScope.totalItemProfileCollection.length; i++) {
                if (controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== null && controllerScope.totalItemProfileCollection[i].listOfChildProfileAC !== undefined) {
                    for (var j = 0; j < controllerScope.totalItemProfileCollection[i].listOfChildProfileAC.length; j++) {
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
                for (var i = 0; i < controllerScope.totalItemProfileCollection.length; i++) {
                    for (var j = 0; j < searching.length; j++) {
                        if (controllerScope.totalItemProfileCollection[i].Id === searching[j].ParentItemId) {
                            var isAlreadyExists = true;
                            for (var k = 0; k < controllerScope.itemProfileCollection.length; k++) {
                                if (controllerScope.itemProfileCollection[k].Id === controllerScope.totalItemProfileCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemProfileCollection.push(controllerScope.totalItemProfileCollection[i]);
                        }
                    }
                }
            }
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollection = controllerScope.itemProfileCollection.slice(begin, end);
            controllerScope.totalItems = controllerScope.itemProfileCollection.length;
            controllerScope.errorMessageDisplayForBlankList = false;
            controllerScope.isItemGrid = true;
        }
        controllerScope.search = [];
    };
    //This function used for get sub item list. -An
    ItemProfileController.prototype.getSubItemList = function (parentId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var getClass = angular.element("#" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {
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
    };
    //This funciton used for get unit type.
    ItemProfileController.prototype.getUnitTypeList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        //to get unit type list
        var promise = this.addNewItemProfileService.getUnitList();
        promise.then(function (result) {
            if (result.length !== 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.unitList.push({ Id: result[i].Id, Name: result[i].ValueEn });
                }
                controllerRootScope.isLoading = false;
            }
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This function used for get category list.
    ItemProfileController.prototype.getCategoryList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var promise = this.addNewItemProfileService.getCategoryList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    controllerScope.categoryList.push({ Id: result[i].Id, Name: result[i].BrandParamType.ValueEn + "-" + result[i].GroupParamType.ValueEn });
                }
            }
            controllerRootScope.isLoading = false;
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    return ItemProfileController;
}());
ItemProfileController.controllerId = "itemProfileController";
app.controller(ItemProfileController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', 'filterFilter', function ($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter) {
        return new ItemProfileController($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter);
    }]);
//# sourceMappingURL=itemProfileController.js.map
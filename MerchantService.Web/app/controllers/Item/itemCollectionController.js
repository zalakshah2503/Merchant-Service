/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
var ItemCollectionController = (function () {
    function ItemCollectionController($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.addNewItemProfileService = addNewItemProfileService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$routeParams = $routeParams;
        this.$scope.categoryList = [];
        this.$scope.unitList = [];
        this.$scope.itemProfileCollection = [];
        this.$scope.totalCollection = [];
        this.$scope.isItemGrid = false;
        this.$scope.errorMessageDisplayForBlankList = false;
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 2;
        this.$scope.maxSize = 10;
        this.$scope.searchEvent = function () { return _this.searchEvent(); };
        this.$scope.search = [];
        this.$scope.totalItemCollection = [];
        this.$scope.getchildItemList = function (parentId) { return _this.getchildItemList(parentId); };
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollection = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollection = _this.$scope.itemProfileCollection.slice(begin, end);
        });
        this.initialization();
    }
    ItemCollectionController.prototype.initialization = function () {
        this.getItemProfileList();
        this.getUnitTypeList();
        this.getCategoryList();
    };
    //This function used for get category list.
    ItemCollectionController.prototype.getCategoryList = function () {
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
    //This funciton used for get unit type.
    ItemCollectionController.prototype.getUnitTypeList = function () {
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
    //this function used for get item profile list -An
    ItemCollectionController.prototype.getItemProfileList = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileCollection = [];
        controllerScope.errorMessageDisplayForBlankList = false;
        var itemProfileList = controllerScope.itemProfileCollection;
        var promise = this.addNewItemProfileService.getItemProfileList();
        promise.then(function (result) {
            if (result !== null) {
                if (result.length > 0) {
                    controllerScope.isItemGrid = true;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].IsActive)
                            result[i].IsActive = stringConstants.yes;
                        else
                            result[i].IsActive = stringConstants.no;
                        if (result[i].listOfChildProfileAC !== null) {
                            for (var j = 0; j < result[i].listOfChildProfileAC.length; j++) {
                                if (result[i].listOfChildProfileAC[j].IsActive)
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.yes;
                                else
                                    result[i].listOfChildProfileAC[j].IsActive = stringConstants.no;
                            }
                        }
                        itemProfileList.push(result[i]);
                    }
                    var that = _this;
                    var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //This funciton used for search funcitonality. -An
    ItemCollectionController.prototype.searchEvent = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.errorMessageDisplayForBlankList = false;
        //create sub Item Search List;
        var subItemSearch = [];
        if (controllerScope.totalItemCollection.length > 0) {
            for (var i = 0; i < controllerScope.totalItemCollection.length; i++) {
                if (controllerScope.totalItemCollection[i].listOfChildProfileAC !== null) {
                    for (var j = 0; j < controllerScope.totalItemCollection[i].listOfChildProfileAC.length; j++) {
                        subItemSearch.push(controllerScope.totalItemCollection[i].listOfChildProfileAC[j]);
                    }
                }
            }
        }
        var searching = this.filterFilter((subItemSearch), controllerScope.search);
        controllerScope.itemProfileCollection = this.filterFilter((controllerScope.totalItemCollection), controllerScope.search);
        if (controllerScope.itemProfileCollection === 0 && searching === 0) {
            controllerScope.errorMessageDisplayForBlankList = true;
            controllerScope.totalCollection = [];
            controllerScope.isItemGrid = false;
        }
        else {
            if (searching !== 0) {
                for (var i = 0; i < controllerScope.totalItemCollection.length; i++) {
                    for (var j = 0; j < searching.length; j++) {
                        if (controllerScope.totalItemCollection[i].Id === searching[j].ParentItemId) {
                            var isAlreadyExists = true;
                            for (var k = 0; k < controllerScope.itemProfileCollection.length; k++) {
                                if (controllerScope.itemProfileCollection[k].Id === controllerScope.totalItemCollection[i].Id)
                                    isAlreadyExists = false;
                            }
                            if (isAlreadyExists)
                                controllerScope.itemProfileCollection.push(controllerScope.totalItemCollection[i]);
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
    ItemCollectionController.prototype.getchildItemList = function (parentId) {
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        var getClass = angular.element("#item" + parentId).find('i.action-icon').hasClass('fa-plus');
        if (getClass === true) {
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
    };
    return ItemCollectionController;
}());
ItemCollectionController.controllerId = "itemCollectionController";
app.controller(ItemCollectionController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'apiPath', 'ngToast', 'authenticationPath', '$location', '$modal', 'filterFilter', '$routeParams', function ($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams) {
        return new ItemCollectionController($scope, $log, $rootScope, addNewItemProfileService, apiPath, ngToast, authenticationPath, $location, $modal, filterFilter, $routeParams);
    }]);
//# sourceMappingURL=itemCollectionController.js.map
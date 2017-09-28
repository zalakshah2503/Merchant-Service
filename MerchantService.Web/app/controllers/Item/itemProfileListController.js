/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
var ItemProfileListController = (function () {
    function ItemProfileListController($scope, $log, $rootScope, addNewItemProfileService, userAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.addNewItemProfileService = addNewItemProfileService;
        this.userAccessService = userAccessService;
        this.apiPath = apiPath;
        this.ngToast = ngToast;
        this.listOfAccessPages = listOfAccessPages;
        this.authenticationPath = authenticationPath;
        this.$location = $location;
        this.$modal = $modal;
        this.filterFilter = filterFilter;
        this.$scope.currentPage = 1;
        this.$scope.itemsPerPage = 3;
        this.$scope.maxSize = 100;
        this.$scope.totalCollectionList = [];
        this.$scope.searchEvent = function () { return _this.searchEvent(); };
        this.$scope.itemProfileCollectionList = [];
        this.$scope.itemProfileErrorMessageDisplay = false;
        this.$scope.categoryList = [];
        this.$scope.search = [];
        this.$scope.isItemGrid = true;
        this.initialize();
        var itemPage = this.$scope.$watch("currentPage + itemPerCurrentPage", function () {
            _this.$scope.totalCollectionList = [];
            var begin = ((_this.$scope.currentPage - 1) * _this.$scope.itemsPerPage), end = begin + _this.$scope.itemsPerPage;
            _this.$scope.totalCollectionList = _this.$scope.itemProfileCollectionList.slice(begin, end);
        });
    }
    ItemProfileListController.prototype.initialize = function () {
        this.getCategoryItemList();
        this.gridBindingForMainItem();
    };
    //this function used for binding for main item. -An 
    ItemProfileListController.prototype.gridBindingForMainItem = function () {
        var _this = this;
        var controllerScope = this.$scope;
        var controllerRootScope = this.$rootScope;
        controllerRootScope.isLoading = true;
        controllerScope.itemProfileErrorMessageDisplay = false;
        controllerScope.itemProfileCollectionList = [];
        var itemProfileList = controllerScope.itemProfileCollectionList;
        var promise = this.addNewItemProfileService.getItemProfileList();
        promise.then(function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].IsActive)
                        result[i].IsActive = stringConstants.yes;
                    else
                        result[i].IsActive = stringConstants.no;
                    itemProfileList.push(result[i]);
                }
                var that = _this;
                var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
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
        }).catch(function (error) {
            controllerRootScope.isLoading = false;
            _this.$log.log(error);
            if (error.status !== 500) {
                //if user is not authenticated that time it will redirect to the login page.
                location.replace(_this.apiPath);
            }
        });
    };
    //this function used for get category list. -An
    ItemProfileListController.prototype.getCategoryItemList = function () {
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
    //This funciton used for search funcitonality in main item grid. -An
    ItemProfileListController.prototype.searchEvent = function () {
        var controllerScope = this.$scope;
        var that = this;
        controllerScope.itemProfileErrorMessageDisplay = false;
        var searchList = this.filterFilter((controllerScope.itemProfileCollectionList), controllerScope.search);
        /* change pagination with $scope.filtered */
        if (searchList === 0) {
            controllerScope.itemProfileErrorMessageDisplay = true;
            controllerScope.totalCollectionList = [];
            controllerScope.isItemGrid = false;
        }
        else {
            controllerScope.isItemGrid = true;
            var begin = ((that.$scope.currentPage - 1) * that.$scope.itemsPerPage), end = begin + that.$scope.itemsPerPage;
            controllerScope.totalCollectionList = searchList.slice(begin, end);
            controllerScope.totalItemProfileItems = searchList.length;
            controllerScope.itemProfileErrorMessageDisplay = false;
        }
        controllerScope.search = [];
    };
    return ItemProfileListController;
}());
ItemProfileListController.controllerId = "itemProfileListController";
app.controller(ItemProfileListController.controllerId, ['$scope', '$log', '$rootScope', 'addNewItemProfileService', 'UserAccessService', 'apiPath', 'ngToast', 'listOfAccessPages', 'authenticationPath', '$location', '$modal', 'filterFilter', function ($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter) {
        return new ItemProfileListController($scope, $log, $rootScope, addNewItemProfileService, UserAccessService, apiPath, ngToast, listOfAccessPages, authenticationPath, $location, $modal, filterFilter);
    }]);
//# sourceMappingURL=itemProfileListController.js.map
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var AddNewItemProfileService = (function () {
    function AddNewItemProfileService($resource, $q, $log) {
        this.$resource = $resource;
        this.$q = $q;
        this.$log = $log;
        this.getBranch = this.$resource(apiPaths.getListOfBranch);
        this.getUnitType = this.$resource(apiPaths.getUnitTypeList);
        this.getCategory = this.$resource(apiPaths.getCategoryList);
        this.marginProfit = this.$resource(apiPaths.getMarginProfit);
        this.insertNewItemProfile = this.$resource(apiPaths.insertNewItemProfile);
        this.getItemProfile = this.$resource(apiPaths.getItemProfile);
        this.getItemProfileObject = this.$resource(apiPaths.getItemProfileObjectById);
        this.updateItemProfileObject = this.$resource(apiPaths.updateItemProfile, { updateItemProfileObject: "@updateItemProfileObject" }, { update: { method: "PUT" } });
        this.deleteItem = this.$resource(apiPaths.deleteItemProfile);
        this.addSubItem = this.$resource(apiPaths.insertSubItem);
        this.subItemByParentId = this.$resource(apiPaths.getSubItemListByParentId);
        this.updateSubItemProfile = this.$resource(apiPaths.updateSubItem, { updateSubItemProfileObject: "@updateSubItemProfileObject" }, { update: { method: "PUT" } });
        this.convertMainItem = this.$resource(apiPaths.convertToMainItem);
        this.mainItemChange = this.$resource(apiPaths.changeMainItem + '/:parentId/:childId', { parentId: 'parentId', childId: 'childId' }, { getdetail: { method: "GET" } });
        this.getItemDetail = this.$resource(apiPaths.getItemProfileDetailById);
        this.editItemInformation = this.$resource(apiPaths.editInformationByItemId);
        this.updateItemInfo = this.$resource(apiPaths.updateItemDetails, { itemDetails: "@itemDetails" }, { update: { method: "PUT" } });
        this.getSupplier = this.$resource(apiPaths.getSupplierListByCategoryId, {}, { query: { method: "GET", isArray: true } });
        this.getInitiator = this.$resource(apiPaths.getAllInitiatorOfSpo);
        this.genrateCompanyBarcode = this.$resource(apiPaths.genrateCompanyBarcode);
    }
    //this service used for get user roles. -An
    AddNewItemProfileService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //this service used ofr get unit list.-An
    AddNewItemProfileService.prototype.getUnitList = function () {
        return this.getUnitType.query().$promise;
    };
    //this service used for get category list.-An
    AddNewItemProfileService.prototype.getCategoryList = function () {
        return this.getCategory.query().$promise;
    };
    //this service used for margin profit.-An
    AddNewItemProfileService.prototype.getMarginProfit = function () {
        return this.marginProfit.get().$promise;
    };
    //this service used for add new item profile.-An
    AddNewItemProfileService.prototype.insertItemProfile = function (resource) {
        return this.insertNewItemProfile.save(resource).$promise;
    };
    //this service used for get item profile -An
    AddNewItemProfileService.prototype.getItemProfileList = function () {
        return this.getItemProfile.query().$promise;
    };
    //this service used for get item profile object by id.-An
    AddNewItemProfileService.prototype.getItemProfileObjectById = function (id) {
        return this.getItemProfileObject.get({ id: id }).$promise;
    };
    //this service used for update item profile.-An
    AddNewItemProfileService.prototype.updateItemProfile = function (updateItemProfileObject) {
        return this.updateItemProfileObject.update(updateItemProfileObject).$promise;
    };
    //this service used for delete item profile. -An
    AddNewItemProfileService.prototype.deleteItemProfile = function (id) {
        return this.deleteItem.get({ id: id }).$promise;
    };
    //this service used for insert sub item. -An
    AddNewItemProfileService.prototype.insertSubItem = function (resource) {
        return this.addSubItem.save(resource).$promise;
    };
    AddNewItemProfileService.prototype.updateSubItem = function (updateSubItemProfileObject) {
        return this.updateSubItemProfile.update(updateSubItemProfileObject).$promise;
    };
    //this service used for get sub item  list by id.-An
    AddNewItemProfileService.prototype.getSubItemByParentId = function (parentId) {
        return this.subItemByParentId.query({ parentId: parentId }).$promise;
    };
    //this service used for convert to main item. -An
    AddNewItemProfileService.prototype.convertToMainItem = function (id) {
        return this.convertMainItem.get({ id: id }).$promise;
    };
    //this service used for change main item. -An
    AddNewItemProfileService.prototype.changeMainItem = function (parentId, childId) {
        return this.mainItemChange.getdetail({ parentId: parentId, childId: childId }).$promise;
    };
    //this service used for get item profile detail with child item list. -An
    AddNewItemProfileService.prototype.getItemDetailById = function (id) {
        return this.getItemDetail.get({ id: id }).$promise;
    };
    AddNewItemProfileService.prototype.editInformationByItemId = function (itemId) {
        return this.editItemInformation.get({ itemid: itemId }).$promise;
    };
    //updateItemDetails
    AddNewItemProfileService.prototype.updateItemDetails = function (itemDetails) {
        return this.updateItemInfo.update(itemDetails).$promise;
    };
    // used to fetch supplier list - jj
    AddNewItemProfileService.prototype.getSupplierList = function (categoryId) {
        return this.getSupplier.query({ categoryId: categoryId }).$promise;
    };
    AddNewItemProfileService.prototype.getAllInitiatorOfSpo = function () {
        return this.getInitiator.query().$promise;
    };
    AddNewItemProfileService.prototype.genrateBarcode = function () {
        return this.genrateCompanyBarcode.get().$promise;
    };
    return AddNewItemProfileService;
}());
AddNewItemProfileService.serviceId = "addNewItemProfileService";
app.service(AddNewItemProfileService.serviceId, ['$resource', '$q', '$log', function ($resource, $q, $log) {
        return new AddNewItemProfileService($resource, $q, $log);
    }]);
//# sourceMappingURL=addnewitemprofileservice.js.map
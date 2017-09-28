/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

interface IaddNewItemProfileService {
    getBranchList: () => void;
    getUnitList: () => void;
    getCategoryList: () => void;
    insertItemProfile: (resource) => void;
    getItemProfileList: () => void;
    getItemProfileObjectById: (id: number) => void;
    updateItemProfile: (updateItemProfileObject) => void;
    deleteItemProfile: (id: number) => void;
    insertSubItem: (resource) => void;
    getSubItemByParentId: (parentId: number) => void;
    updateSubItem: (updateSubItemProfileObject) => void;
    convertToMainItem: (id: number) => void;
    changeMainItem: (parentId, childId) => void;
    getItemDetailById: (id: number) => void;
    updateItemDetails: (itemDetails) => void;
    getSupplierList: (categoryId) => void;
    getAllInitiatorOfSpo:()=>void;

}


class AddNewItemProfileService {
    static serviceId = "addNewItemProfileService";
    private $resource;
    private $q;
    private $log;
    public getBranch;
    public getUnitType;
    public getCategory;
    public marginProfit;
    public insertNewItemProfile;
    public getItemProfile;
    public getItemProfileObject;
    public updateItemProfileObject;
    public deleteItem;
    public addSubItem;
    public subItemByParentId;
    public updateSubItemProfile;
    public convertMainItem;
    public mainItemChange;
    public getItemDetail;
    public editItemInformation;
    public updateItemInfo;
    public getSupplier;
    public getInitiator;
    public genrateCompanyBarcode;

    constructor($resource: ng.resource.IResourceService, $q: ng.IQService, $log: ng.ILogService) {
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
    getBranchList() {
        return this.getBranch.query().$promise;
    }

    //this service used ofr get unit list.-An
    getUnitList() {
        return this.getUnitType.query().$promise;
    }

    //this service used for get category list.-An
    getCategoryList() {
        return this.getCategory.query().$promise;
    }

    //this service used for margin profit.-An
    getMarginProfit() {
        return this.marginProfit.get().$promise;
    }

    //this service used for add new item profile.-An
    insertItemProfile(resource: Model.AddNewItemProfile) {
        return this.insertNewItemProfile.save(resource).$promise;
    }

    //this service used for get item profile -An
    getItemProfileList() {
        return this.getItemProfile.query().$promise;
    }

    //this service used for get item profile object by id.-An
    getItemProfileObjectById(id) {
        return this.getItemProfileObject.get({ id: id }).$promise;
    }

    //this service used for update item profile.-An
    updateItemProfile(updateItemProfileObject) {
        return this.updateItemProfileObject.update(updateItemProfileObject).$promise;
    }

    //this service used for delete item profile. -An
    deleteItemProfile(id) {
        return this.deleteItem.get({ id: id }).$promise;
    }

    //this service used for insert sub item. -An
    insertSubItem(resource: Model.AddNewItemProfile) {
        return this.addSubItem.save(resource).$promise;
    }

    updateSubItem(updateSubItemProfileObject) {
        return this.updateSubItemProfile.update(updateSubItemProfileObject).$promise;
    } 

    //this service used for get sub item  list by id.-An
    getSubItemByParentId(parentId) {
        return this.subItemByParentId.query({ parentId: parentId }).$promise;
    }

    //this service used for convert to main item. -An
    convertToMainItem(id) {
        return this.convertMainItem.get({ id: id }).$promise;
    }

    //this service used for change main item. -An
    changeMainItem(parentId, childId) {
        return this.mainItemChange.getdetail({ parentId: parentId, childId: childId }).$promise;
    }


    //this service used for get item profile detail with child item list. -An
    getItemDetailById(id) {
        return this.getItemDetail.get({ id: id }).$promise;
    }

    editInformationByItemId(itemId) {
        return this.editItemInformation.get({ itemid: itemId }).$promise;
    }
    //updateItemDetails
    updateItemDetails(itemDetails) {
        return this.updateItemInfo.update(itemDetails).$promise;
    }

    // used to fetch supplier list - jj
    getSupplierList(categoryId) {
        return this.getSupplier.query({ categoryId: categoryId }).$promise;
    }

    getAllInitiatorOfSpo() {
        return this.getInitiator.query().$promise;
    }

    genrateBarcode() {
        return this.genrateCompanyBarcode.get().$promise;
    }

}

app.service(AddNewItemProfileService.serviceId, ['$resource', '$q', '$log', ($resource, $q, $log) => {
    return new AddNewItemProfileService($resource, $q, $log);
}]);
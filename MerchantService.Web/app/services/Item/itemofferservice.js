/// <reference path="../../models/item/addnewitemprofile.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
/// <reference path="../../services/item/categoryservice.ts" /> 
var ItemOfferService = (function () {
    function ItemOfferService($resource) {
        this.$resource = $resource;
        this.getItemProfile = this.$resource(apiPaths.getItemListFotItemOffer);
        this.getBranch = this.$resource(apiPaths.getListOfBranch);
        this.getItemProfileObject = this.$resource(apiPaths.getItemProfileObjectById);
        this.insertOffer = this.$resource(apiPaths.insertItemOffer);
        this.statusList = this.$resource(apiPaths.getSearchList);
        this.getItemOfferWork = this.$resource(apiPaths.getItemOfferWorkList);
        this.getItemOfferDetail = this.$resource(apiPaths.getItemOfferDetailById);
        this.approveItemOffer = this.$resource(apiPaths.approveItemOffer);
        this.rejectItemOffer = this.$resource(apiPaths.rejectItemOffer);
        this.listOfAction = this.$resource(apiPaths.getactionList);
        this.updateItemOffer = this.$resource(apiPaths.updateItemOffer);
        this.stopItemOffer = this.$resource(apiPaths.stopItemOffer);
        this.resumeItemOffer = this.$resource(apiPaths.resumeItemOffer);
        this.deleteItemOffer = this.$resource(apiPaths.deletedItemOffer);
        this.supplierList = this.$resource(apiPaths.getSupplierListByItemId);
    }
    //this service used for get item profile -An
    ItemOfferService.prototype.getItemProfileList = function () {
        return this.getItemProfile.query().$promise;
    };
    //this service used for get user roles. -An
    ItemOfferService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //this service used for get item profile object by id.-An
    ItemOfferService.prototype.getItemProfileObjectById = function (id) {
        return this.getItemProfileObject.get({ id: id }).$promise;
    };
    //this service used for save item offer. -An
    ItemOfferService.prototype.insertItemOffer = function (resource) {
        return this.insertOffer.save(resource).$promise;
    };
    //this service used for update item offer. -An
    ItemOfferService.prototype.updateItemOfferDetail = function (resource) {
        return this.updateItemOffer.save(resource).$promise;
    };
    //this service used for get status list. -An
    ItemOfferService.prototype.getStatusList = function () {
        return this.statusList.query().$promise;
    };
    //this service used for get item offer work list. -An
    ItemOfferService.prototype.getItemOfferWorkList = function () {
        return this.getItemOfferWork.query().$promise;
    };
    //this service used for get item offer detail by id. -An
    ItemOfferService.prototype.getItemOfferDetailById = function (id) {
        return this.getItemOfferDetail.get({ id: id }).$promise;
    };
    //this service used for approve item offer request. -An 
    ItemOfferService.prototype.approveItemOfferRequest = function (resource) {
        return this.approveItemOffer.save(resource).$promise;
    };
    //this service used for reject item offer. -An
    ItemOfferService.prototype.rejectItemOfferRequest = function (resource) {
        return this.rejectItemOffer.save(resource).$promise;
    };
    //this service used for stop item offer. -An
    ItemOfferService.prototype.stopItemOfferRequest = function (resource) {
        return this.stopItemOffer.save(resource).$promise;
    };
    //this servie used for resume item offer. -An
    ItemOfferService.prototype.resumeItemOfferRequest = function (resource) {
        return this.resumeItemOffer.save(resource).$promise;
    };
    //this service used for delete item offer. -An
    ItemOfferService.prototype.deletedItemOfferRequest = function (resource) {
        return this.deleteItemOffer.save(resource).$promise;
    };
    //this service used for get list of action. -An
    ItemOfferService.prototype.actionList = function (itemOfferId) {
        return this.listOfAction.query({ itemOfferId: itemOfferId }).$promise;
    };
    ItemOfferService.prototype.getSupplierListByItemId = function (itemId) {
        return this.supplierList.query({ itemId: itemId }).$promise;
    };
    return ItemOfferService;
}());
ItemOfferService.serviceId = "itemOfferService";
app.service(ItemOfferService.serviceId, ['$resource', function ($resource) {
        return new ItemOfferService($resource);
    }]);
//# sourceMappingURL=itemofferservice.js.map
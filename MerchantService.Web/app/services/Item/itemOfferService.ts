/// <reference path="../../models/item/addnewitemprofile.ts" />
/// <reference path="../../services/item/addnewitemprofileservice.ts" />
/// <reference path="../../services/item/categoryservice.ts" /> 

interface IitemOfferService {
    getItemProfileList: () => void;
    getBranchList: () => void;
    getItemProfileObjectById: (id: number) => void;
    insertItemOffer: (resource) => void;
    getStatusList: () => void;
    getItemOfferWorkList: () => void;
    getItemOfferDetailById: (id: number) => void;
    approveItemOfferRequest: (resource) => void;
    rejectItemOfferRequest: (resource) => void;
    actionList: (itemOfferId: number) => void;
    updateItemOfferDetail: (updateItemOffer: Model.ItemOffer) => void;
    stopItemOfferRequest: (resource) => void;
    resumeItemOfferRequest: (resource) => void;
    deletedItemOfferRequest: (resource) => void;
    getSupplierListByItemId: (itemId: number) => void;
}

class ItemOfferService implements IitemOfferService {
    static serviceId: string = "itemOfferService";
    public getItemProfile;
    public getItemProfileObject;
    public getBranch;
    public insertOffer;
    public statusList;
    public getItemOfferWork;
    public approveItemOffer;
    public getItemOfferDetail;
    public rejectItemOffer;
    public listOfAction;
    public updateItemOffer;
    public stopItemOffer;
    public resumeItemOffer;
    public deleteItemOffer;
    public supplierList;

    constructor(private $resource: ng.resource.IResourceService) {
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
    getItemProfileList() {
        return this.getItemProfile.query().$promise;
    }

    //this service used for get user roles. -An
    getBranchList() {
        return this.getBranch.query().$promise;
    }

    //this service used for get item profile object by id.-An
    getItemProfileObjectById(id) {
        return this.getItemProfileObject.get({ id: id }).$promise;
    }

    //this service used for save item offer. -An
    insertItemOffer(resource: Model.ItemOffer) {
        return this.insertOffer.save(resource).$promise;
    }

    //this service used for update item offer. -An
    updateItemOfferDetail(resource: Model.ItemOffer) {
        return this.updateItemOffer.save(resource).$promise;
    }

    //this service used for get status list. -An
    getStatusList() {
        return this.statusList.query().$promise;
    }

    //this service used for get item offer work list. -An
    getItemOfferWorkList() {
        return this.getItemOfferWork.query().$promise;
    }

    //this service used for get item offer detail by id. -An
    getItemOfferDetailById(id) {
        return this.getItemOfferDetail.get({ id: id }).$promise;
    }

    //this service used for approve item offer request. -An 
    approveItemOfferRequest(resource: Model.WorkFlowForItemOffer) {
        return this.approveItemOffer.save(resource).$promise;
    }

    //this service used for reject item offer. -An
    rejectItemOfferRequest(resource: Model.WorkFlowForItemOffer) {
        return this.rejectItemOffer.save(resource).$promise;
    }

    //this service used for stop item offer. -An
    stopItemOfferRequest(resource: Model.WorkFlowForItemOffer) {
        return this.stopItemOffer.save(resource).$promise;
    }

    //this servie used for resume item offer. -An
    resumeItemOfferRequest(resource: Model.WorkFlowForItemOffer) {
        return this.resumeItemOffer.save(resource).$promise;
    }

    //this service used for delete item offer. -An
    deletedItemOfferRequest(resource: Model.WorkFlowForItemOffer) {
        return this.deleteItemOffer.save(resource).$promise;
    }

    //this service used for get list of action. -An
    actionList(itemOfferId) {
        return this.listOfAction.query({ itemOfferId: itemOfferId }).$promise;
    }

    getSupplierListByItemId(itemId) {
        return this.supplierList.query({ itemId: itemId }).$promise;
    }

}


app.service(ItemOfferService.serviceId, ['$resource', ($resource) => {
    return new ItemOfferService($resource);
}]);
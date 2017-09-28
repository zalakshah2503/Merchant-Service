interface IItemDestructionService {
    getUnitList: () => void;
    getCategoryList: () => void;
    getSupplierList: () => void;
    getBranchList: () => void;
    SubmitDestructionItemRequest: (resource) => void;
    UpdateDestructionItemRequest: (resouece) => void;
    getItemDestructionRequest: () => void;
    getItemDestructionList: (destructionId: number) => void;
    getActionList: (destructionId: number) => void;
    approveRequest: (resource) => void;
    returnRequest: (resource) => void;
    getItemDestructionRequestById: (destructionId: number) => void;
    rejectRequest: (resource) => void;
    getSupplierItemListByBranchId: (branchId: number) => void;
    getSupplierItemListSearch: (resource) => void;
    reSubmitItemDestruction: (resource) => void;
    checkItemAlreadyDestructed:(resource) =>void;
}

class ItemDestructionService implements IItemDestructionService {
    static serviceId = "ItemDestructionService";
    public getUnitType;
    public getCategory;
    public getSupplier;
    public getItem;
    public getBranch;
    public submitDestructionItem;
    public getItemDestruction;
    public getItemDestructionDetail;
    public actionList;
    public approve;
    public return;
    public itemDestructionRequestById;
    public updateDestructionItem;
    public reject;
    public getSupplierItemByBrach;
    public reSubmit;
    public checkItemAlreadyDestruct;


    constructor(private $resource: ng.resource.IResourceService) {
        this.getUnitType = this.$resource(apiPaths.getUnitTypeList);
        this.getCategory = this.$resource(apiPaths.getCategoryList);
        this.getSupplier = this.$resource(apiPaths.getSupplierProfileList);
        this.getItem = this.$resource(apiPaths.getSupplierItemList);
        this.getBranch = this.$resource(apiPaths.getListOfBranch);
        this.submitDestructionItem = this.$resource(apiPaths.submitDestructionItem);
        this.updateDestructionItem = this.$resource(apiPaths.updateDestructionItem);
        this.getItemDestruction = this.$resource(apiPaths.getItemDestruction);
        this.getItemDestructionDetail = this.$resource(apiPaths.getItemDestructionDetailByDesturctionId);
        this.actionList = this.$resource(apiPaths.getActionListForItemDestruction);
        this.approve = this.$resource(apiPaths.approveItemDestructionRequest);
        this.return = this.$resource(apiPaths.returnItemDestructionRequest);
        this.reject = this.$resource(apiPaths.rejectItemDestructionRequest);
        this.itemDestructionRequestById = this.$resource(apiPaths.itemDestructionRequestById);
        this.getSupplierItemByBrach = this.$resource(apiPaths.getSupplierItemListByBranchId);
        this.reSubmit = this.$resource(apiPaths.reSubmitItemDestruction);
        this.checkItemAlreadyDestruct = this.$resource(apiPaths.checkItemAlreadyDestruct);
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

    //this service used for get supplier list. -An
    getSupplierList() {
        return this.getSupplier.query().$promise;
    }

    //this service used for submit item destruction 
    SubmitDestructionItemRequest(resource: Model.ItemDestructionRequestModel) {
        return this.submitDestructionItem.save(resource).$promise;
    }

    //this service used for submit item destruction 
    UpdateDestructionItemRequest(resource: Model.ItemDestructionRequestModel) {
        return this.updateDestructionItem.save(resource).$promise;
    }

    //this service used for get Item Destruction Request
    getItemDestructionRequest() {
        return this.getItemDestruction.query().$promise;
    }

    //this service used for get item destruction list. -An
    getItemDestructionList(destructionId) {
        return this.getItemDestructionDetail.get({ destructionId: destructionId }).$promise;
    }

    //this service used for get action list. -An
    getActionList(destructionId) {
        return this.actionList.query({ destructionId: destructionId }).$promise;
    }

    //this service used for approve. -An
    approveRequest(resource: Model.ItemDestuctionDetailModel) {
        return this.approve.save(resource).$promise;
    }

    //this service used for return reusrt. -An
    returnRequest(resource: Model.ItemDestuctionDetailModel) {
        return this.return.save(resource).$promise;
    }

    //this service used for get irem destruction request bu destructionId. -An
    getItemDestructionRequestById(destructionId) {
        return this.itemDestructionRequestById.get({ destructionId: destructionId }).$promise;
    }

    //this service used for reject request. -An
    rejectRequest(resource: Model.ItemDestuctionDetailModel) {
        return this.reject.save(resource).$promise;
    }

    //this request used for get supplier item by branch id. -An
    getSupplierItemListByBranchId(branchId) {
        return this.getSupplierItemByBrach.get({ branchId: branchId }).$promise;
    }

    getSupplierItemListSearch(resource: Model.ItemDestructionSearchModel) {
        return this.getItem.save(resource).$promise;
    }

    reSubmitItemDestruction(resource: Model.ItemDestuctionDetailModel) {
        return this.reSubmit.save(resource).$promise;
    }


  
    checkItemAlreadyDestructed(resource: Model.ItemDestructionRequestModel) {
        return this.checkItemAlreadyDestruct.save(resource).$promise;
    }
}

app.service(ItemDestructionService.serviceId, ['$resource', ($resource) => {
    return new ItemDestructionService($resource);
}]);
  
var ItemDestructionService = (function () {
    function ItemDestructionService($resource) {
        this.$resource = $resource;
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
    ItemDestructionService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    //this service used ofr get unit list.-An
    ItemDestructionService.prototype.getUnitList = function () {
        return this.getUnitType.query().$promise;
    };
    //this service used for get category list.-An
    ItemDestructionService.prototype.getCategoryList = function () {
        return this.getCategory.query().$promise;
    };
    //this service used for get supplier list. -An
    ItemDestructionService.prototype.getSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    //this service used for submit item destruction 
    ItemDestructionService.prototype.SubmitDestructionItemRequest = function (resource) {
        return this.submitDestructionItem.save(resource).$promise;
    };
    //this service used for submit item destruction 
    ItemDestructionService.prototype.UpdateDestructionItemRequest = function (resource) {
        return this.updateDestructionItem.save(resource).$promise;
    };
    //this service used for get Item Destruction Request
    ItemDestructionService.prototype.getItemDestructionRequest = function () {
        return this.getItemDestruction.query().$promise;
    };
    //this service used for get item destruction list. -An
    ItemDestructionService.prototype.getItemDestructionList = function (destructionId) {
        return this.getItemDestructionDetail.get({ destructionId: destructionId }).$promise;
    };
    //this service used for get action list. -An
    ItemDestructionService.prototype.getActionList = function (destructionId) {
        return this.actionList.query({ destructionId: destructionId }).$promise;
    };
    //this service used for approve. -An
    ItemDestructionService.prototype.approveRequest = function (resource) {
        return this.approve.save(resource).$promise;
    };
    //this service used for return reusrt. -An
    ItemDestructionService.prototype.returnRequest = function (resource) {
        return this.return.save(resource).$promise;
    };
    //this service used for get irem destruction request bu destructionId. -An
    ItemDestructionService.prototype.getItemDestructionRequestById = function (destructionId) {
        return this.itemDestructionRequestById.get({ destructionId: destructionId }).$promise;
    };
    //this service used for reject request. -An
    ItemDestructionService.prototype.rejectRequest = function (resource) {
        return this.reject.save(resource).$promise;
    };
    //this request used for get supplier item by branch id. -An
    ItemDestructionService.prototype.getSupplierItemListByBranchId = function (branchId) {
        return this.getSupplierItemByBrach.get({ branchId: branchId }).$promise;
    };
    ItemDestructionService.prototype.getSupplierItemListSearch = function (resource) {
        return this.getItem.save(resource).$promise;
    };
    ItemDestructionService.prototype.reSubmitItemDestruction = function (resource) {
        return this.reSubmit.save(resource).$promise;
    };
    ItemDestructionService.prototype.checkItemAlreadyDestructed = function (resource) {
        return this.checkItemAlreadyDestruct.save(resource).$promise;
    };
    return ItemDestructionService;
}());
ItemDestructionService.serviceId = "ItemDestructionService";
app.service(ItemDestructionService.serviceId, ['$resource', function ($resource) {
        return new ItemDestructionService($resource);
    }]);
//# sourceMappingURL=ItemDestructionService.js.map
// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var InternalTransferGoodService = (function () {
    function InternalTransferGoodService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.getBranchList = this.$resource(apiPaths.getAllBranchList);
        this.getRequestTypeList = this.$resource(apiPaths.getAllRequestType);
        this.getItemList = this.$resource(apiPaths.getItemListById);
        this.getItemDetails = this.$resource(apiPaths.itemDetailsByItemBarcode, { transferGoodsDetails: "@transferGoodsDetails" }, { query: { method: "GET", isArray: false } });
        this.submitInventoryRequest = this.$resource(apiPaths.submitInventoryTranserRequest);
        this.getInventory = this.$resource(apiPaths.getAllInventoryTransferList);
        this.viewTransferDetails = this.$resource(apiPaths.viewInternalTransferGoodDetailsById);
        this.reviewRequest = this.$resource(apiPaths.reviewTransferInventoryById, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.reSubmitRequest = this.$resource(apiPaths.reSubmitTransferInventory, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.approveRequest = this.$resource(apiPaths.transferInventoryApprovalById, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.receiveRequest = this.$resource(apiPaths.receiveTransferInventoryById, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.printReceipt = this.$resource(apiPaths.printTransferGoodReceipt);
    }
    InternalTransferGoodService.prototype.getAllBranchList = function () {
        return this.getBranchList.query().$promise;
    };
    InternalTransferGoodService.prototype.getAllRequestType = function () {
        return this.getRequestTypeList.query().$promise;
    };
    InternalTransferGoodService.prototype.getItemListById = function (branchId) {
        return this.getItemList.query({ branchId: branchId }).$promise;
    };
    InternalTransferGoodService.prototype.getItemDetailsByItemBarcode = function (transferGoodsDetails) {
        return this.getItemDetails.query(transferGoodsDetails).$promise;
    };
    InternalTransferGoodService.prototype.submitInventoryTranserRequest = function (transferGoodsDetails) {
        return this.submitInventoryRequest.save(transferGoodsDetails).$promise;
    };
    InternalTransferGoodService.prototype.getAllInventoryTransferList = function () {
        return this.getInventory.query().$promise;
    };
    InternalTransferGoodService.prototype.viewInternalTransferGoodDetailsById = function (inventoryTransferId) {
        return this.viewTransferDetails.get({ inventoryTransferId: inventoryTransferId }).$promise;
    };
    InternalTransferGoodService.prototype.reSubmitTransferInventory = function (transferGoodsDetails) {
        return this.reSubmitRequest.update(transferGoodsDetails).$promise;
    };
    InternalTransferGoodService.prototype.transferInventoryApprovalById = function (transferGoodsDetails) {
        return this.approveRequest.update(transferGoodsDetails).$promise;
    };
    InternalTransferGoodService.prototype.reviewTransferInventoryById = function (transferGoodsDetails) {
        return this.reviewRequest.update(transferGoodsDetails).$promise;
    };
    InternalTransferGoodService.prototype.receiveTransferInventoryById = function (transferGoodsDetails) {
        return this.receiveRequest.update(transferGoodsDetails).$promise;
    };
    InternalTransferGoodService.prototype.printTransferGoodReceipt = function (inventoryTransferId) {
        return this.printReceipt.get({ inventoryTransferId: inventoryTransferId }).$promise;
    };
    return InternalTransferGoodService;
}());
app.service("internalTransferGoodService", ['$resource', '$log', function ($resource, $log) {
        return new InternalTransferGoodService($resource, $log);
    }]);
//# sourceMappingURL=internalTransferGoodService.js.map
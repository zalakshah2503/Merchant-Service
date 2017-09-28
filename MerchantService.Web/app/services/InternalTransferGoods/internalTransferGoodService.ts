// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

interface IinternalTransferGoodService {
    getAllBranchList: () => void;
    getAllRequestType: () => void;
    getItemListById: (branchId) => void;
    getItemDetailsByItemBarcode: (transferGoodsDetails) => void;
    submitInventoryTranserRequest: (transferGoodsDetails) => void;
    getAllInventoryTransferList: () => void;
    viewInternalTransferGoodDetailsById: (inventoryTransferId) => void;
    reSubmitTransferInventory: (transferGoodsDetails) => void;
    transferInventoryApprovalById: (transferGoodsDetails) => void;
    reviewTransferInventoryById: (transferGoodsDetails) => void;
    receiveTransferInventoryById: (transferGoodsDetails) => void;
    printTransferGoodReceipt: (inventoryTransferId) => void;
}

class InternalTransferGoodService implements IinternalTransferGoodService {
    public getBranchList;
    public getRequestTypeList;
    public getItemList;
    public getItemDetails;
    public submitInventoryRequest;
    public getInventory;
    public viewTransferDetails;
    public reviewRequest;
    public approveRequest;
    public reSubmitRequest;
    public receiveRequest;
    public printReceipt;

    constructor(private $resource: ng.resource.IResourceService, private $log: ng.ILogService) {
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

    getAllBranchList() {
        return this.getBranchList.query().$promise;
    }

    getAllRequestType() {
        return this.getRequestTypeList.query().$promise;
    }

    getItemListById(branchId) {
        return this.getItemList.query({ branchId: branchId }).$promise;
    }

    getItemDetailsByItemBarcode(transferGoodsDetails) {
        return this.getItemDetails.query(transferGoodsDetails).$promise;
    }

    submitInventoryTranserRequest(transferGoodsDetails) {
        return this.submitInventoryRequest.save(transferGoodsDetails).$promise;
    }

    getAllInventoryTransferList() {
        return this.getInventory.query().$promise;
    }

    viewInternalTransferGoodDetailsById(inventoryTransferId) {
        return this.viewTransferDetails.get({ inventoryTransferId: inventoryTransferId }).$promise;
    }

    reSubmitTransferInventory(transferGoodsDetails) {
        return this.reSubmitRequest.update(transferGoodsDetails).$promise;
    }

    transferInventoryApprovalById(transferGoodsDetails) {
        return this.approveRequest.update(transferGoodsDetails).$promise;
    }

    reviewTransferInventoryById(transferGoodsDetails) {
        return this.reviewRequest.update(transferGoodsDetails).$promise;
    }

    receiveTransferInventoryById(transferGoodsDetails) {
        return this.receiveRequest.update(transferGoodsDetails).$promise;
    }

    printTransferGoodReceipt(inventoryTransferId) {
        return this.printReceipt.get({ inventoryTransferId: inventoryTransferId }).$promise;
    }
}

app.service("internalTransferGoodService", ['$resource', '$log', ($resource, $log) => {
    return new InternalTransferGoodService($resource, $log);
}]);

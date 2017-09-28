// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var IssueStockInventoryService = (function () {
    function IssueStockInventoryService($resource, $log) {
        this.$resource = $resource;
        this.$log = $log;
        this.getInventoryType = this.$resource(apiPaths.getAllInvetoryType);
        this.getSupplier = this.$resource(apiPaths.getAllSupplierList);
        this.getCategory = this.$resource(apiPaths.getAllCateGoryList);
        this.getBranch = this.$resource(apiPaths.getListOfBranch);
        this.getItemProfile = this.$resource(apiPaths.getItemProfile);
        this.issueStockInventory = this.$resource(apiPaths.submitIssueStockInventory);
        this.getInventory = this.$resource(apiPaths.getAllInventoryList);
        this.deleteInventory = this.$resource(apiPaths.deleteIssueStockInventoryById);
        this.issueMoniterInventoryDetails = this.$resource(apiPaths.viewIssueStockInventoryMoniterDetailsById);
        this.getRecorderInventory = this.$resource(apiPaths.getAllInventoryRecorderList);
        this.startInventory = this.$resource(apiPaths.startIssueStockInventory);
        this.recordInventory = this.$resource(apiPaths.getInventoryRecorderDetailsById);
        this.getInventoryItemList = this.$resource(apiPaths.getItemListByIssueInventoryId);
        this.barcodeDetails = this.$resource(apiPaths.getItemDetailsByItemBarcode, { issueInventoryDetails: "@issueInventoryDetails" }, { query: { method: "GET" } });
        this.issueInventoryRecode = this.$resource(apiPaths.addIssueInventoryRecordDetails, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.submitInventory = this.$resource(apiPaths.submitIssueStockInventoryDetails, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.viewIssueInventory = this.$resource(apiPaths.viewIssueStockInventoryDetailsById);
        this.issueInventoryApproval = this.$resource(apiPaths.issueStockInventoryApprovalById, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.rejectIssueInventory = this.$resource(apiPaths.reviewIssueStockInventoryById, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.getItemDetails = this.$resource(apiPaths.getItemDetailsById + '/:paramId/:detailsId', { paramId: 'paramId', detailsId: 'detailsId' }, { query: { method: "GET", isArray: true } });
        this.rejectInventory = this.$resource(apiPaths.reSubmitIssueStockInventory, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.updateInventory = this.$resource(apiPaths.updateIssueInventoryDate, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.stockInventory = this.$resource(apiPaths.submitStockInventory);
        this.unmatchedItemList = this.$resource(apiPaths.getUnmatchedItemListById, {}, { query: { method: "GET", isArray: false } });
        this.updateStockInventory = this.$resource(apiPaths.updateIssueStockInventoryDate, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
        this.submitConfilctInventory = this.$resource(apiPaths.submitConflictBranchIssueInventory);
        this.reRecordRequest = this.$resource(apiPaths.reRecordSelectedItemDetails, { issueInventoryUnmatchedItem: "@issueInventoryUnmatchedItem" }, { update: { method: "PUT" } });
    }
    IssueStockInventoryService.prototype.getAllInvetoryType = function () {
        return this.getInventoryType.query().$promise;
    };
    IssueStockInventoryService.prototype.getAllSupplierList = function () {
        return this.getSupplier.query().$promise;
    };
    IssueStockInventoryService.prototype.getAllCateGoryList = function () {
        return this.getCategory.query().$promise;
    };
    IssueStockInventoryService.prototype.getBranchList = function () {
        return this.getBranch.query().$promise;
    };
    IssueStockInventoryService.prototype.getItemProfileList = function () {
        return this.getItemProfile.query().$promise;
    };
    IssueStockInventoryService.prototype.submitIssueStockInventory = function (issueInventoryDetails) {
        return this.issueStockInventory.save(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.getAllInventoryList = function () {
        return this.getInventory.query().$promise;
    };
    IssueStockInventoryService.prototype.deleteIssueStockInventoryById = function (issueInventoryId) {
        return this.deleteInventory.get({ issueInventoryId: issueInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.viewIssueStockInventoryMoniterDetailsById = function (issueInventoryId) {
        return this.issueMoniterInventoryDetails.get({ issueInventoryId: issueInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.getAllInventoryRecorderList = function () {
        return this.getRecorderInventory.query().$promise;
    };
    IssueStockInventoryService.prototype.startIssueStockInventory = function (issueInventoryId) {
        return this.startInventory.get({ issueInventoryId: issueInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.getInventoryRecorderDetailsById = function (issueInventoryId) {
        return this.recordInventory.get({ issueInventoryId: issueInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.getItemListByIssueInventoryId = function (issueInventoryId) {
        return this.getInventoryItemList.query({ issueInventoryId: issueInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.getItemDetailsByItemBarcode = function (issueInventoryDetails) {
        return this.barcodeDetails.query(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.addIssueInventoryRecordDetails = function (issueInventoryDetails) {
        return this.issueInventoryRecode.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.submitIssueStockInventoryDetails = function (issueInventoryDetails) {
        return this.submitInventory.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.viewIssueStockInventoryDetailsById = function (issueInventoryId) {
        return this.viewIssueInventory.get({ issueInventoryId: issueInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.issueStockInventoryApprovalById = function (issueInventoryDetails) {
        return this.issueInventoryApproval.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.reviewIssueStockInventoryById = function (issueInventoryDetails) {
        return this.rejectIssueInventory.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.getItemDetailsById = function (paramId, detailsId) {
        return this.getItemDetails.query({ paramId: paramId, detailsId: detailsId }).$promise;
    };
    IssueStockInventoryService.prototype.reSubmitIssueStockInventory = function (issueInventoryDetails) {
        return this.rejectInventory.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.updateIssueInventoryDate = function (issueInventoryDetails) {
        return this.updateInventory.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.submitStockInventory = function (issueInventoryDetails) {
        return this.stockInventory.save(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.updateIssueStockInventoryDate = function (issueInventoryDetails) {
        return this.updateStockInventory.update(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.getUnmatchedItemListById = function (issueStockInventoryId) {
        return this.unmatchedItemList.query({ issueStockInventoryId: issueStockInventoryId }).$promise;
    };
    IssueStockInventoryService.prototype.submitConflictBranchIssueInventory = function (issueInventoryDetails) {
        return this.submitConfilctInventory.save(issueInventoryDetails).$promise;
    };
    IssueStockInventoryService.prototype.reRecordSelectedItemDetails = function (issueInventoryUnmatchedItem) {
        return this.reRecordRequest.update(issueInventoryUnmatchedItem).$promise;
    };
    return IssueStockInventoryService;
}());
app.service("issueStockInventoryService", ['$resource', '$log', function ($resource, $log) {
        return new IssueStockInventoryService($resource, $log);
    }]);
//# sourceMappingURL=issueStockInventoryService.js.map
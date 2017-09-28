// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


    interface IissueStockInventoryService {
        getAllInvetoryType: () => void;
        getAllSupplierList:()=>void;
        getAllCateGoryList:()=> void;
        getBranchList: () => void;
        submitIssueStockInventory: (issueInventoryDetails) => void;
        getAllInventoryList: () => void;
        deleteIssueStockInventoryById: (issueInventoryId) => void;
        viewIssueStockInventoryMoniterDetailsById: (issueInventoryId) => void;
        getAllInventoryRecorderList: () => void;
        startIssueStockInventory: (issueInventoryId) => void;
        getInventoryRecorderDetailsById: (issueInventory) => void;
        getItemListByIssueInventoryId: (issueInventory) => void;
        addIssueInventoryRecordDetails: (issueInventoryDetails) => void;
        submitIssueStockInventoryDetails: (issueInventoryDetails) => void;
        viewIssueStockInventoryDetailsById: (issueInventoryId) => void;
        issueStockInventoryApprovalById: (issueInventoryDetails) => void;
        reviewIssueStockInventoryById: (issueInventoryDetails) => void;
        getItemDetailsById: (paramId, detailsId) => void;
        reSubmitIssueStockInventory: (issueInventoryDetails) => void;
        getItemDetailsByItemBarcode: (issueInventoryDetails)=> void;
        updateIssueInventoryDate: (issueInventoryDetails)=> void;
        submitStockInventory: (issueInventoryDetails) => void;
        updateIssueStockInventoryDate: (issueInventoryDetails) => void;
        getUnmatchedItemListById: (issueStockInventoryId) => void;
        submitConflictBranchIssueInventory: (issueInventoryDetails) => void;
        reRecordSelectedItemDetails: (unmatchedItemCollection) => void;
    }
    
    class IssueStockInventoryService implements IissueStockInventoryService {
        
        public getInventoryType;
        public getSupplier;
        public getCategory;
        public getBranch;
        public getItemProfile;
        public issueStockInventory;
        public getInventory;
        public deleteInventory;
        public issueMoniterInventoryDetails;
        public getRecorderInventory;
        public startInventory;
        public recordInventory;
        public getInventoryItemList;
        public barcodeDetails;
        public issueInventoryRecode;
        public submitInventory;
        public viewIssueInventory;
        public issueInventoryApproval;
        public rejectIssueInventory;
        public getItemDetails;
        public rejectInventory;
        public updateInventory;
        public stockInventory;
        public updateStockInventory;
        public unmatchedItemList;
        public submitConfilctInventory;
        public reRecordRequest;
        constructor(private  $resource: ng.resource.IResourceService,private  $log: ng.ILogService) {
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
            this.barcodeDetails = this.$resource(apiPaths.getItemDetailsByItemBarcode, { issueInventoryDetails: "@issueInventoryDetails" },{query:{method:"GET"}});
            this.issueInventoryRecode = this.$resource(apiPaths.addIssueInventoryRecordDetails, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
            this.submitInventory = this.$resource(apiPaths.submitIssueStockInventoryDetails, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
            this.viewIssueInventory = this.$resource(apiPaths.viewIssueStockInventoryDetailsById);
            this.issueInventoryApproval = this.$resource(apiPaths.issueStockInventoryApprovalById,{issueInventoryDetails:"@issueInventoryDetails"},{update:{method:"PUT"}});
            this.rejectIssueInventory = this.$resource(apiPaths.reviewIssueStockInventoryById, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
            this.getItemDetails = this.$resource(apiPaths.getItemDetailsById + '/:paramId/:detailsId', { paramId: 'paramId', detailsId: 'detailsId' }, { query: { method: "GET", isArray: true}});
            this.rejectInventory = this.$resource(apiPaths.reSubmitIssueStockInventory, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
            this.updateInventory = this.$resource(apiPaths.updateIssueInventoryDate, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
            this.stockInventory = this.$resource(apiPaths.submitStockInventory);
            this.unmatchedItemList = this.$resource(apiPaths.getUnmatchedItemListById,{},{query:{method:"GET" ,isArray:false}});
            this.updateStockInventory = this.$resource(apiPaths.updateIssueStockInventoryDate, { issueInventoryDetails: "@issueInventoryDetails" }, { update: { method: "PUT" } });
            this.submitConfilctInventory = this.$resource(apiPaths.submitConflictBranchIssueInventory);
            this.reRecordRequest = this.$resource(apiPaths.reRecordSelectedItemDetails, { issueInventoryUnmatchedItem: "@issueInventoryUnmatchedItem" }, { update: { method: "PUT" } });
        }

        getAllInvetoryType() {
            return this.getInventoryType.query().$promise;
        }

        getAllSupplierList() {
            return this.getSupplier.query().$promise;
        }

        getAllCateGoryList() {
            return this.getCategory.query().$promise;
        }

        getBranchList() {
            return this.getBranch.query().$promise;
        }

        getItemProfileList() {
            return this.getItemProfile.query().$promise;
        }

        submitIssueStockInventory(issueInventoryDetails) {
            return this.issueStockInventory.save(issueInventoryDetails).$promise;
        }

        getAllInventoryList() {
            return this.getInventory.query().$promise;
        }

        deleteIssueStockInventoryById(issueInventoryId) {
            return this.deleteInventory.get({ issueInventoryId: issueInventoryId }).$promise;
        }

        viewIssueStockInventoryMoniterDetailsById(issueInventoryId) {
            return this.issueMoniterInventoryDetails.get({ issueInventoryId: issueInventoryId}).$promise;
        }

        getAllInventoryRecorderList() {
            return this.getRecorderInventory.query().$promise;
        }

        startIssueStockInventory(issueInventoryId) {
            return this.startInventory.get({ issueInventoryId: issueInventoryId }).$promise;
        }

        getInventoryRecorderDetailsById(issueInventoryId) {
            return this.recordInventory.get({ issueInventoryId: issueInventoryId}).$promise;
        }

        getItemListByIssueInventoryId(issueInventoryId) {
            return this.getInventoryItemList.query({ issueInventoryId: issueInventoryId}).$promise;
        }

        getItemDetailsByItemBarcode(issueInventoryDetails) {
            return this.barcodeDetails.query(issueInventoryDetails).$promise;

        }

        addIssueInventoryRecordDetails(issueInventoryDetails) {
            return this.issueInventoryRecode.update(issueInventoryDetails).$promise;
        }

        submitIssueStockInventoryDetails(issueInventoryDetails) {
            return this.submitInventory.update(issueInventoryDetails).$promise;
        }

        viewIssueStockInventoryDetailsById(issueInventoryId) {
            return this.viewIssueInventory.get({ issueInventoryId: issueInventoryId}).$promise;
        }

        issueStockInventoryApprovalById(issueInventoryDetails) {
            return this.issueInventoryApproval.update(issueInventoryDetails).$promise;
        }

        reviewIssueStockInventoryById(issueInventoryDetails) {
            return this.rejectIssueInventory.update(issueInventoryDetails).$promise;
        }

        getItemDetailsById(paramId, detailsId) {
            return this.getItemDetails.query({paramId: paramId, detailsId : detailsId}).$promise;
        }

        reSubmitIssueStockInventory(issueInventoryDetails) {
            return this.rejectInventory.update(issueInventoryDetails).$promise;
        }

        updateIssueInventoryDate(issueInventoryDetails) {
            return this.updateInventory.update(issueInventoryDetails).$promise;
        }

        submitStockInventory(issueInventoryDetails) {
            return this.stockInventory.save(issueInventoryDetails).$promise;
        }

        updateIssueStockInventoryDate(issueInventoryDetails) {
            return this.updateStockInventory.update(issueInventoryDetails).$promise;
        }

        getUnmatchedItemListById(issueStockInventoryId) {
            return this.unmatchedItemList.query({ issueStockInventoryId: issueStockInventoryId }).$promise;
        }

        submitConflictBranchIssueInventory(issueInventoryDetails: Object) {
            return this.submitConfilctInventory.save(issueInventoryDetails).$promise;
        }

        reRecordSelectedItemDetails(issueInventoryUnmatchedItem) {
            return this.reRecordRequest.update(issueInventoryUnmatchedItem).$promise;
        }
    }

    app.service("issueStockInventoryService", ['$resource', '$log', ($resource,$log)=> {
        return new IssueStockInventoryService($resource, $log);
    }]);

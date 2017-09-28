using System.Web.Optimization;

namespace MerchantService.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                      "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/jquery.signalR-2.2.0.js",
                       "~/Scripts/angular.js",
                       "~/Scripts/angular-resource.min.js",
                       "~/Scripts/angular-route.min.js",
                       "~/Scripts/angular-animate.min.js",
                       "~/Scripts/angular-sanitize.min.js",
                       "~/Scripts/ngToast.min.js",
                       "~/Scripts/angular-messages.js",
                       "~/Scripts/select.min.js",
                      "~/Scripts/timepickerpop.js",
                      "~/Scripts/mask.js",
                      "~/Scripts/lodash.min.js",
                      "~/Scripts/angularjs-dropdown-multiselect.js",
                      "~/Scripts/dirPagination.js",
                      "~/Scripts/angular-signalr-hub.js"));
            //app
            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      "~/app/app.js"
                     ));
            //constants
            bundles.Add(new ScriptBundle("~/bundles/constants").Include(
                     "~/app/appConstant.js",
                     "~/app/keyValuePair.js"
                     ));


            bundles.Add(new ScriptBundle("~/bundles/themejs").Include(
                      "~/Content/Theme/js/ui-bootstrap-tpls.min.js",
                      "~/Content/Theme/js/loading-bar.min.js",
                      "~/Content/Theme/js/ocLazyLoad.min.js",
                      "~/Content/Theme/js/metisMenu.min.js",
                      "~/Content/Theme/js/sb-admin-2.js",
                       "~/Scripts/ng-google-chart.js"
                     ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/ngToast.min.css",
                      "~/Content/select.min.css"));

            bundles.Add(new StyleBundle("~/Content/Theme/themecss").Include(
                        "~/Content/Theme/css/main.css",
                        "~/Content/Theme/css/sb-admin-2.css",
                        "~/Content/Theme/css/timeline.css",
                        "~/Content/Theme/css/metisMenu.min.css",
                        "~/Content/Theme/css/loading-bar.min.css",
                        "~/Content/Theme/css/font-awesome.min.css"));
            bundles.Add(new StyleBundle("~/Content/Maincss").Include(
                      "~/Content/Style.css"));

            bundles.Add(new ScriptBundle("~/bundles/controller").Include(
                      "~/app/controllers/Account/groupController.js",
                      "~/app/controllers/Account/ledgersController.js",
                      "~/app/controllers/Supplier/supplierProfileController.js",
                      "~/app/controllers/Item/categoryController.js",
                      "~/app/controllers/Account/receiptPaymentController.js",
                      "~/app/controllers/ItemChangeRequest/icrController.js",
                      "~/app/controllers/ItemChangeRequest/icrWorkListController.js",
                      "~/app/controllers/Item/systemParameterController.js",
                      "~/app/controllers/SupplierPO/supplierPOController.js",
                      "~/app/controllers/SupplierPO/supplierPOWorkListController.js",
                      "~/app/controllers/SupplierPO/spoReceivingController.js",
                      "~/app/controllers/SupplierPO/spoPaymentController.js",

                      "~/app/controllers/UserAuthentication/userAccessController.js",
                      "~/app/controllers/Item/addNewItemProfileController.js",
                      "~/app/controllers/Account/salesPurchaseVoucherController.js",
                      "~/app/controllers/Customer/customerController.js",
                      "~/app/controllers/Customer/customerPOController.js",
                      "~/app/controllers/Customer/customerPOWorkListController.js",
                      "~/app/controllers/Item/itemProfileController.js",
                      "~/app/controllers/Item/addSubItemProfileController.js",
                      "~/app/controllers/Item/itemProfileListController.js",
                      "~/app/controllers/Item/itemOfferController.js",
                      "~/app/controllers/Item/itemCollectionController.js",
                      "~/app/controllers/Item/itemOfferWorkListController.js",
                      "~/app/controllers/Item/itemOfferDetailsController.js",
                      "~/app/controllers/IncidentReport/IncidentRportWorklistController.js",
                      "~/app/controllers/Session/POSSessionController.js",
                      "~/app/controllers/Session/POSSessionBillController.js",
                      "~/app/controllers/Session/POSSessionWorkListController.js",
                      "~/app/controllers/Session/SessionClosingVarificationController.js",
                      "~/app/controllers/Session/ReturnBillController.js",
                      "~/app/controllers/Session/BillSearchContoller.js",
                      "~/app/controllers/IncidentReport/incidentReportController.js",
                      "~/app/controllers/IncidentReport/editItemDetailsController.js",
                      "~/app/controllers/IncidentReport/manageIncidentReportApprovalController.js",
                      "~/app/controllers/Supplier/CreditNoteController.js",
                      "~/app/controllers/Supplier/supplierReturnRequestController.js",
                      "~/app/controllers/Supplier/supplierReturnDetailController.js",
                      "~/app/controllers/Supplier/supplierReturnWorkListController.js",
                      "~/app/controllers/Session/ReturnBillReceiptController.js",
                      "~/app/controllers/Inventory/issueStockInventoryController.js",
                      "~/app/controllers/ItemDestructionRequest/ItemDestructionRequestController.js",
                      "~/app/controllers/Inventory/inventoryRecordController.js",
                      "~/app/controllers/Inventory/inventoryMoniterController.js",
                      "~/app/controllers/Session/POSBillSearchController.js",
                      "~/app/controllers/ItemDestructionRequest/ItemDestructionRequestWorkListController.js",
                      "~/app/controllers/ItemDestructionRequest/ItemDestructionRequestDetailController.js",
                      "~/app/controllers/InternalTransferGoods/internalTransferGoodsController.js",
                      "~/app/controllers/Session/ReturnBillSearchController.js",
                      "~/app/controllers/Customer/customerPODetailListController.js",
                      "~/app/controllers/Account/accountLedgersController.js",
                      "~/app/controllers/Account/addLedgerController.js",
                      "~/app/controllers/Account/accountingController.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/service").Include(
                      "~/app/services/Account/groupService.js",
                      "~/app/services/Account/ledgersService.js",
                      "~/app/services/Account/receiptPaymentService.js",
                      "~/app/services/Item/systemParameterService.js",
                      "~/app/services/Supplier/supplierProfileService.js",
                      "~/app/services/Supplier/supplierReturnRequestService.js",
                      "~/app/services/Supplier/supplierReturnWorkListService.js",
                      "~/app/services/Supplier/supplierReturnDetailService.js",
                      "~/app/services/Item/categoryService.js",
                      "~/app/services/ItemChangeRequest/icrService.js",
                      "~/app/services/ItemChangeRequest/icrWorkListService.js",
                      "~/app/services/SupplierPO/supplierPOService.js",
                      "~/app/services/SupplierPO/supplierPOWorkListService.js",
                      "~/app/services/SupplierPO/spoReceivingService.js",
                      "~/app/services/SupplierPO/spoPaymentService.js",
                      "~/app/services/UserAuthentication/userAccessService.js",
                      "~/app/services/Item/addNewItemProfileService.js",
                      "~/app/services/Customer/customerService.js",
                      "~/app/services/Customer/customerPOService.js",
                      "~/app/services/Customer/customerPOWorkListService.js",
                      "~/app/services/Account/salesPurchaseVoucherService.js",
                      "~/app/services/Item/itemOfferService.js",
                      "~/app/services/IncidentReport/IncidentReportWorklistService.js",
                      "~/app/services/Session/POSSessionService.js",
                      "~/app/services/Session/ReturnBillService.js",
                      "~/app/services/IncidentReport/incidentReportService.js",
                      "~/app/services/Inventory/issueStockInventoryService.js",
                      "~/app/services/Inventory/inventoryHubServices.js",
                      "~/app/services/ItemDestructionRequest/ItemDestructionService.js",
                      "~/app/services/InternalTransferGoods/internalTransferGoodService.js",
                      "~/app/services/Supplier/creditNoteService.js",
                      "~/app/services/Account/accountingService.js"
                     ));

            bundles.Add(new ScriptBundle("~/bundles/model").Include(
                      "~/app/models/Account/groupAccount.js",
                      "~/app/models/Account/ledgersAccount.js",
                      "~/app/models/Supplier/supplierProfile.js",
                      "~/app/models/Supplier/contactPerson.js",
                      "~/app/models/Supplier/discountDays.js",
                      "~/app/models/Supplier/SupplierReturnItemAC.js",
                      "~/app/models/Supplier/supplierReturnRequest.js",
                      "~/app/models/Item/category.js",
                      "~/app/models/ItemChangeRequest/itemChangedDetails.js",
                      "~/app/models/ItemChangeRequest/IcrQuantity.js",
                      "~/app/models/SupplierPO/supplierPO.js",
                      "~/app/models/SupplierPO/spoBranch.js",
                      "~/app/models/SupplierPO/SupplierBranchId.js",
                      "~/app/models/SupplierPO/SPOReceiving.js",
                      "~/app/models/SupplierPO/SPOReceivingBill.js",
                      "~/app/models/SupplierPO/supplierItem.js",
                      "~/app/models/SupplierPO/billDiscountDays.js",

                      "~/app/models/SupplierPO/creditNoteDetail.js",
                      "~/app/models/SupplierPO/SPOPayment.js",

                      "~/app/models/Item/itemSupplier.js",
                      "~/app/models/Account/receiptPaymentDetails.js",
                      "~/app/models/Account/receiptPaymentVouchers.js",
                      "~/app/models/Item/paramType.js",
                      "~/app/models/Item/addNewItemProfile.js",
                      "~/app/models/Customer/customerProfile.js",
                      "~/app/models/Customer/customerPO.js",
                      "~/app/models/Customer/customerPOItem.js",
                      "~/app/models/Customer/CPOAdditionalCost.js",
                      "~/app/models/Customer/CPODownPayment.js",
                      "~/app/models/Customer/CPOPayment.js",
                      "~/app/models/Global/globalRootScope.js",
                      "~/app/models/Account/salesPurchaseDetail.js",
                      "~/app/models/Account/salesPurchaseVouchers.js",
                       "~/app/models/WorkFlow/workFlowLog.js",
                      "~/app/models/Item/itemOffer.js",
                      "~/app/models/Item/workFlowForItemOffer.js",
                      "~/app/models/Session/posSessionModel.js",
                      "~/app/models/Session/posNonSaleTransactionModel.js",
                      "~/app/models/Session/POSSessionBillModel.js",
                      "~/app/models/Session/POSReturnBillModel.js",
                      "~/app/models/Session/POSApprovalModel.js",
                      "~/app/models/IncidentReport/posIncidentReportAc.js",
                      "~/app/models/Inventory/issueInventoryAc.js",
                      "~/app/models/ItemDestructionRequest/ItemDestructionRequestModel.js",
                      "~/app/models/ItemDestructionRequest/ItemDestuctionDetailModel.js",
                      "~/app/models/InternalTransferGoods/inventoryTransferAc.js",
                      "~/app/models/Supplier/recevingCreditNote.js",
                     "~/app/models/ItemDestructionRequest/ItemDestructionSearchModel.js",
                     "~/app/models/Inventory/issueInventoryUnmatchedItemAc.js",
                     "~/app/models/Account/journalEntryAc.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/directive").Include(
                   "~/app/directives/Global/stringReplace.js",
                     "~/app/directives/sidebar/navigationMenu.js",
                     "~/app/directives/Global/autoFocus.js",
                     "~/app/directives/Global/tabindexDisabled.js",
                     "~/app/directives/printer.js",
                     "~/app/directives/Global/enterKey.js",
                     "~/app/directives/Global/setDecimal.js",
                     "~/app/directives/Global/rawHtml.js"
                    ));

            BundleTable.EnableOptimizations = false;
        }
    }
}
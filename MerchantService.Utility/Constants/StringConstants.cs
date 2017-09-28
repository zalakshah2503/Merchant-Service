using System;
using System.Configuration;

namespace MerchantService.Utility.Constants
{
    public class StringConstants
    {
        #region Error Message Related to Validation
        public const string UserNameRequired = "User name is required.";
        public const string PasswordRequired = "Password is required.";
        public const string LedgerExists = "Ledger Name Already Exists.";

        #endregion

        #region MerchantService AppSettings keys
        public const string AdminName = "superadmin";
        public const string AdminPassword = "111111";
        public const string SuperAdminRoleName = "SuperAdmin";
        public const string AdminRoleName = "Admin";
        #endregion

        #region Merchant Services All Modules
        public const string CustomerProfile = "Customer Profile";
        public const string ItemProfile = "Item Profile";
        public const string SupplierProfile = "Supplier Profile";
        public const string ItemOffer = "Item Offer";
        public const string Approval = "Approval";
        public const string SupplierPurchaseOrder = "Supplier Purchase Order";
        public const string SPOReceiving = "Supplier Purchase Order Receiving";
        public const string SPOVerification = "Supplier Purchase Order Verification";
        public const string SPOPayment = "Supplier Purchase Order Payment";
        public const string SupplierReturnRequest = "Supplier Return Request";
        public const string SessionClosing = "Session Closing";
        public const string CustomerPurchaseOrder = "Customer Purchase Order";
        public const string ItemChangeRequest = "Item Change Request";
        public const string InternalTransferGoods = "Internal Transfer Goods";
        #endregion

        #region Merchant Services All Sub Modulles
        public const string CreateNewCustomer = "Add,Edit And Delete Customer Information";
        public const string Review = "Review";
        public const string Closed = "Close";
        public const string CreateNewItemProfile = "Create New Item Profile";
        public const string EditItemProfile = "Edit Item Profile";
        public const string DeleteItemProfile = "Delete Item Profile";
        public const string ConvertMainItem = "Convert Main Item";
        public const string ChangeMainItem = "Change Main Item";
        public const string CustomerApproval = "Customer Request Approval";
        public const string CPOPayment = "Customer Purchase Order Paymrent";
        public const string CreateSupplier = "Create New Supplier";
        public const string DeleteSupplier = "Delete Supplier";
        public const string EditSupplier = "Edit Supplier";
        public const string FurtherApproval = "Further approval is required";
        public const string CreateItemOffer = "Create ItemOffer";
        public const string CreateItemOfferApproval = "Item Offer Approval";
        public const string StopItemOffer = "Stop Item Offer";
        public const string ResumeItemOffer = "Resume Item Offer";
        public const string RejectItemOffer = "Reject Item Offer";
        public const string ApproveItemOffer = "Approve Item Offer";
        public const string DeleteItemOffer = "Delete Item Offer";
        public const string ReceivingCreditNote = "Credit Note Receiving";
        public const string CreateSupplierPurchaseOrder = "Create Supplier Purchase Order";
        public const string DeleteSupplierPurchaseOrder = "Delete Supplier Purchase Order";
        public const string EditSupplierPurchaseOrder = "Edit Supplier Purchase Order";
        public const string CreateSPOForOtherBranch = "Create Supplier Purchase Order For Other Branches";
        public const string ApprovalSPO = "Approval Supplier Purchase Order";
        public const string RejectSPO = "Reject Supplier Purchase Order";
        public const string ReviewSPO = "Review Supplier Purchase Order";
        public const string ResubmitSPO = "Resubmit Supplier Purchase Order";
        public const string CancelSPO = "Cancel Supplier Purchase Order";
        public const string ApproveCancelSPO = "Approve Cancellation of Supplier Purchase Order";
        public const string ProcessSPO = "Process Supplier Purchase Order";
        public const string ReceiveSPO = "Receive Supplier Purchase Order";
        public const string PaySPO = "Pay Supplier Purchase Order";
        public const string SendSPO = "Send Purchase Order";
        public const string VerifySPO = "Verify Supplier Purchase Order";
        public const string VarificationAction = "Varification";
        public const string SPOCreated = "SPO Created";

        public const string ApproveResetIncidentReportRequest = "Approve Reset Incident Request";
        public const string IncidentReport = "Incident Report";
        public const string ResetIncidentReportRequest = "Reset Incident Report Request";
        public const string IncidentReportParamenter = "Incidnet Report Parameter";
        public const string DestructionItemRequest = "Destruction Item Request";
        public const string DestructionItem = "Item Destruction";

        public const string PosSystem = "POS System";
        public const string PosSale = "POS Sale";
        public const string PosSystemLogin = "Allow POS System Login";
        public const string CreditAmoutLimitOver = "Insufficient fund is available in your account.";
        public const string CreditBalanceLimitOver = "Credit Balance Amount is Over.";
        public const string EnterReference = "Please Enter Reference.";
        public const string SuspendItemNofFound = "There are no items added. You can not suspend Empty Transaction.";
        public const string ReturnBillSuspend = "You can not suspend Returnbill with no substitute.";
        public const string Reconciled = "Reconciled";
        public const string AllowUnRegigerItemPOS = "Allow Add UnRegistered Item";
        public const string ReturnBill = "Return Bill";
        public const string AddWorkFlow = "Add existing workflow";
        public const string Condition = "Condition";
        public const string InitiateIcr = "Initiate Incident Report";
        public const string AddIcrApprovalWorkFlow = "Add ICR Approval WorkFlow";

        public const string CreateCPO = "Create Customer Purchase Order";
        public const string CancelCPO = "Cancel Customer Purchase Order";
        public const string IssueStockInventory = "Issue Stock Inventory";
        public const string AllowRecovery = "Allow Recovery Action";

        public const string InitiateICR = "Initiate Item Change Request";
        public const string ApproveICR = "Approved Item Change Request";
        public const string RejectICR = "Rejected Item Change Request";
        public const string EditICR = "Edited Item Change Request";
        public const string ReturnICR = "Returned Item Change Request";
        public const string ReviewICR = "Review Item Change Request";
        public const string InitiateICRForOtherBranches = "Initiate Item Change Request For Other Branches";

        public const string ReviewStockInventory = "Review Stock Inventory";
        public const string InventoryRecord = "Allow Inventory Record";
        public const string InventoryReRecord = "Allow Invetnory Re-Record";
        public const string InitiateStockInventory = "Initiate Issue Stock Inventory";
        public const string InventroyStart = "Allow Inventory Start";
        public const string InitiateTransferGoodRequest = "Initiate Internal  Transfer Good Request";
        public const string SupplierInventory = "Supplier Inventory";
        public const string CategoryInventory = "Category Inventory";
        public const string ItemInventory = "Item Inventory";
        public const string FullInventory = "Full Inventory";
        public const string Expier = "Expire";
        public const string Damage = "Damage";
        public const string Send = "Send";
        public const string SupplierReturnNote = "Supplier Return Note";
        public const string SupplierItemOfferNote = "Supplier Item Offer Note";
        public const string SupplierDestructionNote = "Supplier Item Destruction Note";

        public const string InitiateSupplierReturnRequest = "Initiate/Edit Supplier Return Request ";
        // public const string InitiateSupplierReturnRequestApprovalByPA = "Supplier Return Request Approval By PA";
        public const string EditSupplierReturnRequest = "Edited Supplier Return Request";
        public const string ApproveSupplierReturnRequest = "Approved Supplier Return Request";
        public const string ReturnSupplierReturnRequest = "Returned Supplier Return Request";
        public const string RejectSupplierReturnRequest = "Rejected Supplier Return Request";
        public const string ResubmitSupplierReturnRequest = "Resubmit Supplier Return Request";
        public const string DeleteSupplierReturnRequest = "Delete Supplier Return Request";

        public const string UnmatchedItem = "Resolved Unmatched Item Quantity";
        public const string ReslovedUnmatchedItem = "Resolved Unmatched Item ";
        public const string WorkFlowNotCreated = "There is no work flow created for this activity. Please contact  System Administrator.";
        public const string PermissionDenied = "You do not have rights to perform this operation. Please contact  System Administrator.";

        public const string AllowDestructionToAnotherBranch = "Allow Destruction To Another Branch";
        public const string AllowRejectItemDestructionRequest = "Allow Reject Item Destruciton Request.";
        public const string SendInventory = "Send Inventory";
        public const string RequestInventory = "Request Inventory";
        public const string AllowToDeleteItemOffer = "Allow To Delete Item Offer";
        public const string AllowUpdateItemOffer = "Allow Update Item Offer";

        public const string ReceiveInternalTransferGood = "Receive Internal Transfer Good Request";
        public const string Cash = "Cash";
        public const string DebitCard = "DebitCard";
        public const string Credit = "Credit";
        public const string Cheque = "Cheque";
        public const string CreditCardPOS = "CreditCard";
        public const string Coupon = "Coupon";
        public const string CreditAccount = "CreditAccount";
        public const string CreditNote = "CreditNote";
        public const string JournalEntry = "Journal Entry";

        public const string ManageSystemParameter = "Manage System Parameter";
        public const string ManageCategory = "Manage Category";
        public const string AllowManageSystemParameter = "Allow Manage System Parameter";
        public const string AllowManageCategory = "Allow Manage Category";

        #endregion

        #region Purchase Order Status
        public const string ClosedPurchaseOrder = "Closed";
        public const string NotCollected = "Not Collected";
        public const string Collected = "Collected";
        public const string PartialCollected = "Partial Collected";
        public const string PONotFound = "Supplier Purchase Order Not Found";
        public const string ICRPriceGenerateError = "Item Price Change Request has already been generated for this item";
        public const string ICRQuantityGenerateError = "Item Quantity Change Request has already been generated";
        #endregion

        #region Error Message for POS
        public const string InvalidUser = "User Name or Password are Invalid.";


        public const string CustomerNoRequired = "Please Enter Membership Code or Mobile Number.";
        public const string ReturnBillNoRequired = "Please Enter Return Bill No.";
        public const string CustomerPORequired = "Please Enter Customer PO.";
        public const string CustomerNoNotFound = "Membership Code or Mobile Number not Found.";
        public const string ItemNotExists = "Item does not exist. Do you want to Proceed?";
        public const string ValidAmount = "Please Enter valid Amount.";
        public const string PayAdtioanlAmout = "Please pay an Additional Amount of ";
        public const string UnSuspendValidation = "You must Suspend the current bill Or Process  it In Order to Unsuspend a Bill.";
        public const string InActiveCustomer = "Customer is not Active.";
        public const string CpoNotExists = "Customer Purchase Order not exist.";
        public const string CpoCollected = "CPO Already Collected.";
        public const string CpoCancelled = "CPO is Cancelled.";
        public const string ReturnBillNotFount = "Return Bill Number Not Found.";
        public const string ReturnBillProceed = "Return Bill Already Processed";
        public const string SuccessReturn = "Successfully Payment Done to Customer.";
        public const string OverQuantityMessage = "Item with such quantity does not exists.Do you want to Proceed?";
        public const string ReturnBillSubstituteMsg = "The Customer must purchase item with a total amount of at least ";
        public const string KeepSessionMessage = "Are you sure you want to Keep Session And Logout?";
        public const string EndSessionMessage = "Are you sure you want to End Session And Logout?";
        public const string ItemInActvieMessage = "Item with such barcode is InActive. Do you want to Proceed?";
        public const string ReconcileAccountFirst = "First reconcile your session in order to Log In into the system.";
        public const string ReturnOtherBranchNotAllowd = "Return from other branch is not allowed. Please return to {0} branch.";
        public const string AllFieldsAreMandatory = "All Fields are required. Please Fill details.";
        public const string SingleProcessTransaction = "You must suspend or process current transaction in order to process another.";
        public const string UniqueItemCode = "Item Code should be unique.";
        public const string SellPriceValidation = "Sell Price should match with the profit margin criteria.";
        public const string UserAlreadyLoggedIn = "This user is already logged in and have active session.";
        public const string CPOCollectionValidation = "This CPO can not be collected here as it was issued to be collected from {0} branch.";
        public const string ReturnBillPaymentAlreadyDone = "You cannot delete return bill,Payment is already done";
        public const string ReturnBillAlreadyDeleted = "Return bill already deleted so you cannot pay";

        #region Error Message for Item offer
        public const string AddedItemOffer = "Item Offer added sucessfully";
        public const string ItemOfferAlreadyExists = "This item is already in offer";
        public const string notValidQuantityLimit = "Offer for this item cannot be created (Quantity limit should be less than System quantity)";
        #endregion

        #endregion

        #region Merchant Services Status

        public const string ScheduledOn = "Scheduled on";
        public const string CurrentDateInventory = "Same date inventory already exist";
        public const string FullInventoryExist = "Full inventory already exist";
        public const string CompletedOn = "Completed on";
        public const string BranchConflict = "Branch conflict";
        public const string InitiateInventory = "Initiate Inventory";
        #endregion

        #region Account Ledege

        public const string CashInHand = "CashInHand";
        public const string Bank = "Bank";
        public const string Sales = "Sales";
        public const string Purchase = "Purchase";
        public const string Discount = "Discount";
        public const string Coupan = "Coupan";
        public const string MiscLoss = "MiscLoss";
        public const string MiscExp = "MiscExp";
        public const string CRNote = "CRNote";
        public const string AccessBranch = "Access Branch";
        public const string AccessAllBranch = "Access to all branch";
        public const string StockInHand = "Stock-In-Hand";
        public const string AccountsreceivableDebtors = "Accounts receivable(Debtors)";
        public const string Currentassets = "Current assets";
        public const string Fixedassets = "Fixed assets";
        public const string Noncurrentassets = "Non-current assets";
        public const string AccountsPayableCreditors = "Accounts Payable (Creditors)";
        public const string CreditCard = "Credit Card";
        public const string Currentliablities = "Current liablities";
        public const string Noncurrentliabilities = "Non-current liabilities";
        public const string Equity = "Equity";
        public const string Income = "Income";
        public const string OtherIncome = "Other Income";
        public const string CostofGoodsSold = "Cost of Goods Sold";
        public const string Expenses = "Expenses";
        public const string OtherExpense = "Other Expense";
        public const string SalesReturn = "Sales Return";
        public const string PurchaseRetrun = "Purchase Return";


        #endregion

        #region Status Type
        public const string Initiate = "Initiate";
        public const string Supplier = "Supplier";
        public const string Owner = "Owner";
        public const string PendingApproval = "Pending Approval";
        public const string PendingEditConfirmation = "Pending Edit Confirmation";
        public const string PendingEditApproval = "Pending Edit Approval";
        public const string RejectEdit = "Reject Edit";
        public const string Rejected = "Rejected";
        public const string Valid = "Valid";
        public const string PendingDeleteApproval = "Pending Delete Approval";
        public const string PendingUpdateApproval = "Pending Update Approval";
        public const string Deleted = "Deleted";
        public const string PendingEditing = "Pending Update Approval";
        public const string PendingConfirmation = "Pending Confirmation";
        public const string PendingSendingToSupplier = "Pending Sending To Supplier";
        public const string POProcessing = "Purchase Order Processing";
        public const string PendingSendingToSupplierSPObyPM = "Pending Sending To Supplier(SPO by PM)";
        public const string Reject = "Reject";
        public const string Approve = "Approve";
        public const string Delete = "Delete";
        public const string Update = "Edit";
        public const string ReSubmit = "Resubmit";
        public const string Pause = "Pause";
        public const string Resume = "Resume";
        public const string PendingReset = "Pending Reset";
        public const string Initiation = "Initiated";
        public const string Reconciliation = "Reconciliation";
        public const string Verification = "Verification";
        public const string Confirmation = "Confirmation";
        public const string Processing = "Processing";
        public const string End = "End";
        public const string Matched = "Matched";
        public const string DoNothing = "DoNothing";
        public const string Gain = "Gain";
        public const string Loss = "Loss";
        public const string Verified = "Verified";
        public const string Confirmed = "Confirmed";
        public const string PendingVerification = "Pending Verification";
        public const string ApprovAction = "Approved";
        public const string RejectAction = "Rejected";
        public const string ReturnAction = "Returned";
        public const string ReviewAction = "Reviewed";
        public const string InitiateAction = "Initiated";
        public const string ReceiveAction = "Received";
        public const string ReSubmitedAction = "Resubmitted";
        public const string EditedAction = "Edited";
        public const string AddWork = "Add existing workflow";
        public const string AlreadyActivityProcessed = "AlreadyActivityProcessed";
        public const string RendomNumber = "0123456789";
        #endregion

        #region ApiPaths

        public static string WebApiPath
        {
            get { return ConfigurationManager.AppSettings["ApiPath"]; }
        }
        public static bool IsOnline
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["IsOnline"]); }
        }

        public static string AdminApiPath
        {
            get
            {
                return ConfigurationManager.AppSettings["AdminApiPath"];
            }
        }



        #endregion

        #region Param Name
        public const string SupplierType = "Supplier Type";
        public const string PaymentType = "Payment Type";
        public const string PayCash = "Pay Cash";
        public const string PayDebitCard = "Pay Debit Card";
        public const string PayCreditCard = "Pay Credit Card";
        public const string PayCoupon = "Pay Coupon";
        public const string POSPaymentType = "POS Payment Type";
        public const string PayCreditAccount = "Pay Credit Account";
        #endregion
    }
}


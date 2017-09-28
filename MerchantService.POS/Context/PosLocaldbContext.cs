using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.InventoryTransfer;
using MerchantService.DomainModel.Models.IssueInventory;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.DomainModel.Models.POS;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SupplierPayment;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.UserAccess;
using MerchantService.DomainModel.Models.WorkFlow;
using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;

namespace MerchantService.POS.Data
{
    public class PosLocaldbContext : DbContext
    {

        public PosLocaldbContext()            
       {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<PosLocaldbContext, Migrations.Configuration>());
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                   .HasRequired(m => m.BrandParamType)
                   .WithMany()
                   .HasForeignKey(m => m.BrandParamTypeId)
                   .WillCascadeOnDelete(false);

            modelBuilder.Entity<Category>()
                        .HasRequired(m => m.GroupParamType)
                        .WithMany()
                        .HasForeignKey(m => m.GroupParamTypeId)
                        .WillCascadeOnDelete(false);

            modelBuilder.Entity<ItemProfile>()
                   .HasOptional(m => m.SystemParameter)
                   .WithMany()
                   .HasForeignKey(m => m.UnitParamTypeId)
                    .WillCascadeOnDelete(false);

            modelBuilder.Entity<ItemProfile>()
                   .HasOptional(m => m.Category)
                   .WithMany()
                   .HasForeignKey(m => m.CategoryId)
                    .WillCascadeOnDelete(false);

            modelBuilder.Entity<ItemProfile>()
                    .HasOptional(m => m.ParentItem)
                    .WithMany()
                    .HasForeignKey(m => m.ParentItemId);


            modelBuilder.Entity<SupplierProfile>()
                      .HasRequired(m => m.SupplierType)
                      .WithMany()
                      .HasForeignKey(m => m.SupplierTypeId)
                      .WillCascadeOnDelete(false);

            modelBuilder.Entity<SupplierProfile>()
                .HasRequired(m => m.CompanyDetail)
                .WithMany()
                .HasForeignKey(m => m.CompanyId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<CPOPaymentType>()
                    .HasRequired(m => m.ParamType)
                    .WithMany()
                    .HasForeignKey(m => m.PaymentTypeId)
                    .WillCascadeOnDelete(false);

            modelBuilder.Entity<ItemDestructionDetail>()
                     .HasRequired(m => m.ItemProfile)
                     .WithMany()
                     .HasForeignKey(m => m.ItemId)
                     .WillCascadeOnDelete(false);

            modelBuilder.Entity<CreditNoteDetail>()
                    .HasRequired(m => m.BranchDetail)
                    .WithMany()
                    .HasForeignKey(m => m.BranchId)
                    .WillCascadeOnDelete(false);

            modelBuilder.Entity<CreditNoteDetail>()
                   .HasRequired(m => m.ParamType)
                   .WithMany()
                   .HasForeignKey(m => m.TypeId)
                   .WillCascadeOnDelete(false);

            modelBuilder.Entity<SupplierReturnItem>()
                   .HasRequired(m => m.ItemProfile)
                   .WithMany()
                   .HasForeignKey(m => m.ItemId)
                   .WillCascadeOnDelete(false);


            modelBuilder.Entity<BranchDetail>()
                  .HasRequired(m => m.CompanyDetail)
                  .WithMany()
                  .HasForeignKey(m => m.CompanyId)
                  .WillCascadeOnDelete(false);

            modelBuilder.Entity<POSNonSaleTransaction>()
                 .HasRequired(m => m.POSSession)
                 .WithMany()
                 .HasForeignKey(m => m.POSSessionId)
                 .WillCascadeOnDelete(false);

            modelBuilder.Entity<POSNonSaleTransaction>()
               .HasRequired(m => m.ParamType)
               .WithMany()
               .HasForeignKey(m => m.TransactionTypeId)
               .WillCascadeOnDelete(false);
            
            modelBuilder.Entity<POSSession>()
               .HasRequired(m => m.POSLoginSession)
               .WithMany()
               .HasForeignKey(m => m.POSLoginSessionId)
               .WillCascadeOnDelete(false);
            
            modelBuilder.Entity<CustomerPurchaseOrder>().HasRequired(m => m.CustomerProfile).WithMany().HasForeignKey(m => m.CustomerId).WillCascadeOnDelete(false);
            modelBuilder.Entity<CustomerPurchaseOrder>().HasRequired(m => m.InitiationBranch).WithMany().HasForeignKey(m => m.InitiationBranchId).WillCascadeOnDelete(false);
            modelBuilder.Entity<CustomerPurchaseOrder>().HasRequired(m => m.UserDetail).WithMany().HasForeignKey(m => m.InitiatorId).WillCascadeOnDelete(false);
            modelBuilder.Entity<CPOPayment>().HasRequired(m => m.CustomerProfile).WithMany().HasForeignKey(m => m.CustomerId).WillCascadeOnDelete(false);
            modelBuilder.Entity<CPOPayment>().HasRequired(m => m.UserDetail).WithMany().HasForeignKey(m => m.InitiatorId).WillCascadeOnDelete(false);
            modelBuilder.Entity<InventoryTransfer>().HasRequired(m => m.TargetBranch).WithMany().HasForeignKey(m => m.TargetBranchId).WillCascadeOnDelete(false);
            modelBuilder.Entity<InventoryTransfer>().HasRequired(m => m.InitiateBranch).WithMany().HasForeignKey(m => m.InitiateBranchId).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSBill>().HasRequired(m => m.Customer).WithMany().HasForeignKey(m => m.CustomerID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSBill>().HasRequired(m => m.UserDetail).WithMany().HasForeignKey(m => m.UserID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSLoginSession>().HasRequired(m => m.UserDetail).WithMany().HasForeignKey(m => m.UserId).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSBillItem>().HasRequired(m => m.POSBill).WithMany().HasForeignKey(m => m.BillID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSBillPayment>().HasRequired(m => m.POSBill).WithMany().HasForeignKey(m => m.POSBillID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSReturnBill>().HasRequired(m => m.POSBill).WithMany().HasForeignKey(m => m.POSBillId).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSReturnBill>().HasRequired(m => m.ProcesessorUser).WithMany().HasForeignKey(m => m.ProcessorID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSReturnBill>().HasRequired(m => m.ProcessingBranch).WithMany().HasForeignKey(m => m.ProcessingBranchID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSReturnBill>().HasRequired(m => m.UserDetail).WithMany().HasForeignKey(m => m.ReturneBy).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSReturnBillItem>().HasRequired(m => m.POSReturnBill).WithMany().HasForeignKey(m => m.ReturnedBillID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSReturnBillItem>().HasRequired(m => m.POSBillItem).WithMany().HasForeignKey(m => m.POSBiillItemID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSTempTrans>().HasRequired(m => m.BranchDetail).WithMany().HasForeignKey(m => m.BranchID).WillCascadeOnDelete(false);
            modelBuilder.Entity<POSTempTrans>().HasRequired(m => m.UserDetail).WithMany().HasForeignKey(m => m.UserID).WillCascadeOnDelete(false);
            modelBuilder.Entity<ReceiptPaymentVoucher>().HasRequired(m => m.Ledgers).WithMany().HasForeignKey(m => m.AccountId).WillCascadeOnDelete(false);
            modelBuilder.Entity<SalesPurchaseVoucher>().HasRequired(m => m.PartyAccount).WithMany().HasForeignKey(m => m.PartyAccountId).WillCascadeOnDelete(false);
            modelBuilder.Entity<CPOBill>().HasRequired(m => m.POSBill).WithMany().HasForeignKey(m => m.POSBillId).WillCascadeOnDelete(false);
           

            modelBuilder.Entity<Form>()
            .HasMany(e => e.ParentsCollection)
            .WithOptional(e => e.Parents)
            .HasForeignKey(e => e.ParentsId);

            modelBuilder.Entity<Form>()
                .HasMany(e => e.MasterParentsCollection)
                .WithOptional(e => e.MasterParents)
                .HasForeignKey(e => e.ParentsId2);
            

            modelBuilder.Entity<WorkFlowDetail>()
                    .HasRequired(m => m.AssignedRole)
                    .WithMany()
                    .HasForeignKey(m => m.AssignedId)
                    .WillCascadeOnDelete(false);

            modelBuilder.Entity<WorkFlowDetail>()
                   .HasRequired(m => m.InitiatorRole)
                   .WithMany()
                   .HasForeignKey(m => m.InitiatorId)
                   .WillCascadeOnDelete(false);

            modelBuilder.Entity<WorkFlowDetail>()
                .HasRequired(m => m.ParentPermission)
                .WithMany()
                .HasForeignKey(m => m.WorkFlowId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<WorkFlowLog>()
              .HasRequired(m => m.WorkFlowDetail)
              .WithMany()
              .HasForeignKey(m => m.WorkFlowId)
              .WillCascadeOnDelete(false);

            modelBuilder.Entity<CompanyConfiguration>()
           .HasRequired(m => m.CompanyDetail)
           .WithMany()
           .HasForeignKey(m => m.CompanyId)
           .WillCascadeOnDelete(false);

            modelBuilder.Entity<DoubleEntry>()
           .HasRequired(m => m.Ledger)
           .WithMany()
           .HasForeignKey(m => m.LedgerId)
           .WillCascadeOnDelete(false);


            modelBuilder.Entity<GroupType>()
           .HasRequired(m => m.Group)
           .WithMany()
           .HasForeignKey(m => m.GroupId)
           .WillCascadeOnDelete(false);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Param> Param { get; set; }
        public DbSet<UserLogin> UserLogin { get; set; }

        public DbSet<GroupType> GroupType { get; set; }

        public DbSet<ParamType> ParamType { get; set; }

        public DbSet<Form> Form { get; set; }

        public DbSet<ModuleInfo> ModuleInfo { get; set; }

        public DbSet<GlobalizationDetail> GlobalizationDetail { get; set; }

        public DbSet<SecondaryLanguage> SecondaryLanguage { get; set; }

        public DbSet<Category> Category { get; set; }

        public DbSet<Language> Language { get; set; }

        public DbSet<ItemProfile> ItemProfile { get; set; }

        public DbSet<SupplierPurchaseOrderLog> SupplierPurchaseOrderLog { get; set; }

        public DbSet<UserDetail> UserDetail { get; set; }

        public DbSet<ItemQuantity> ItemQuantity { get; set; }

        public DbSet<SupplierProfile> SupplierProfile { get; set; }

        public DbSet<SupplierDaysLimit> SupplierDaysLimit { get; set; }

        public DbSet<SupplierContactPerson> SupplierContactPerson { get; set; }

        public DbSet<ItemSupplier> ItemSupplier { get; set; }

        public DbSet<ParentRecord> ParentRecord { get; set; }

        public DbSet<SystemParameter> SystemParameter { get; set; }

        public DbSet<ItemOffer> ItemOffer { get; set; }

        public DbSet<ItemOfferCreditNote> ItemOfferCreditNote { get; set; }

        public DbSet<IcrDetail> IcrDetail { get; set; }

        public DbSet<POItemIcr> POItemIcr { get; set; }

        public DbSet<IcrQuantity> IcrQuantity { get; set; }

        public DbSet<IcrPrice> IcrPrice { get; set; }

        public DbSet<Destruction> Destruction { get; set; }

        public DbSet<ItemDestructionDetail> ItemDestructionDetail { get; set; }

        public DbSet<ItemDestructionCreditNote> ItemDestructionCreditNote { get; set; }
        public DbSet<AdditionalService> AdditionalService { get; set; }
        public DbSet<BranchDetail> BranchDetail { get; set; }
        public DbSet<BranchCPOConfiguration> BranchCPOConfiguration { get; set; }
        public DbSet<CustomerProfile> CustomerProfile { get; set; }
        public DbSet<CompanyDetail> CompanyDetail { get; set; }
        public DbSet<CompanyConfiguration> CompanyConfiguration { get; set; }
        public DbSet<CustomerPurchaseOrder> CustomerPurchaseOrder { get; set; }
        public DbSet<CPOBill> CPOBill { get; set; }
        public DbSet<CPOAdditionalCost> CPOAdditionalCost { get; set; }
        public DbSet<CPODownPayment> CPODownPayment { get; set; }
        public DbSet<CPOItem> CPOItem { get; set; }
        public DbSet<CPOPayment> CPOPayment { get; set; }
        public DbSet<CPOPaymentType> CPOPaymentType { get; set; }
        public DbSet<InventoryTransfer> InventoryTransfer { get; set; }
        public DbSet<ItemInventoryTransfer> ItemInventoryTransfer { get; set; }
        public DbSet<IssueInventory> IssueInventory { get; set; }
        public DbSet<InventoryRecorder> InventoryRecorder { get; set; }
        public DbSet<ItemInventory> ItemInventory { get; set; }
        public DbSet<InventoryUnmatchedItem> InventoryUnmatchedItem { get; set; }

        public DbSet<CreditNoteDetail> CreditNoteDetail { get; set; }
        public DbSet<PaymentTypeCreditNote> PaymentTypeCreditNote { get; set; }
        public DbSet<CreditNotePayment> CreditNotePayment { get; set; }
        public DbSet<CreditNoteItem> CreditNoteItem { get; set; }

        public DbSet<SupplierReturnDetail> SupplierReturnDetail { get; set; }

        public DbSet<SupplierReturnItem> SupplierReturnItem { get; set; }

        public DbSet<SupplierReturnCreditNote> SupplierReturnCreditNote { get; set; }

        public DbSet<SupplierPaymentDetail> SupplierPaymentDetail { get; set; }

        public DbSet<PaymentType> PaymentType { get; set; }

        public DbSet<UserAccessDetail> UserAccessDetail { get; set; }

        public DbSet<Group> Group { get; set; }

        public DbSet<Ledgers> Ledger { get; set; }

        public DbSet<DoubleEntry> DoubleEntry { get; set; }
        public DbSet<ReceiptPaymentDetail> ReceiptPaymentDetail { get; set; }
        public DbSet<ReceiptPaymentVoucher> ReceiptPaymentVoucher { get; set; }
        public DbSet<SalesPurchaseDetail> SalesPurchaseDetail { get; set; }
        public DbSet<SalesPurchaseVoucher> SalesPurchaseVoucher { get; set; }

        public DbSet<POSBill> POSBill { get; set; }
        public DbSet<POSBillItem> POSBillItem { get; set; }
        public DbSet<POSBillPayment> POSBillPayment { get; set; }
        public DbSet<POSLoginSession> POSLoginSession { get; set; }
        public DbSet<POSReturnBill> POSReturnBill { get; set; }
        public DbSet<POSReturnBillItem> POSReturnBillItem { get; set; }
        public DbSet<POSSession> POSSession { get; set; }
        public DbSet<POSTempTrans> POSTempTrans { get; set; }
        public DbSet<POSTempTransItem> POSTempTransItem { get; set; }

        public DbSet<SupplierPurchaseOrder> SupplierPurchaseOrder { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItem { get; set; }
        public DbSet<PurchaseOrderBranch> PurchaseOrderBranch { get; set; }
        public DbSet<POSupplierBill> POSupplierBill { get; set; }
        public DbSet<POBillPayment> POBillPayment { get; set; }

        public DbSet<LogInfo> LogInfo { get; set; }
        public DbSet<ChildPermission> ChildPermission { get; set; }
        public DbSet<ParentPermission> ParentPermission { get; set; }
        public DbSet<RolePermission> RolePermission { get; set; }
        public DbSet<WorkFlowDetail> WorkFlow { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<StatusType> StatusType { get; set; }
        public DbSet<WorkFlowLog> WorkFlowLog { get; set; }
        public DbSet<CurrencyDetail> CurrencyDetail { get; set; }
        public DbSet<UpdateCustomerInfo> UpdateCustomerInfo { get; set; }
        public DbSet<IncidentReport> IncidentReport { get; set; }
        public DbSet<ConditionalOperator> ConditionalOperator { get; set; }
        public DbSet<CashierIncidentReport> CashierIncidentReport { get; set; }
        public DbSet<POSNonSaleTransaction> POSNonSaleTransaction { get; set; }
        public DbSet<PosIncidentReport> PosIncidentReport { get; set; }
        public DbSet<RecevingCreditNotePaymentDetail> RecevingCreditNotePaymentDetail { get; set; }
        public static PosLocaldbContext Create()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<PosLocaldbContext, Migrations.Configuration>("MerchantServiceDataContext"));
            return new PosLocaldbContext();
        }

        //added these comment lines to check deployment issues
    }
}

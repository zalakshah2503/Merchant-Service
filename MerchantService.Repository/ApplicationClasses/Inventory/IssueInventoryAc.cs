using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.ApplicationClasses.Item;

namespace MerchantService.Repository.ApplicationClasses.Inventory
{
   public class IssueInventoryAc
    {
        public int? RecordId { get; set; }
        public string InventoryNO { get; set; }    
        public DateTime StartDate { get; set; }
        public string EndDate { get; set; }
        public DateTime? CloseDate { get; set; }       
        public decimal SystemAmount { get; set; }
        public int? SupplierId { get; set; }
        public decimal ShelfAmount { get; set; }
        public int? CategoryId { get; set; }
        public string Barcode { get; set; }
        public int IssueStockInventoryId { get; set; }
        public int? ParamTypeId { get; set; }
        public string BranchName { get; set; }
        public string InventoryType { get; set; }
        public int BranchId { get; set; }
        public bool IsInitiate { get; set; }
        public bool IsActive { get; set; }
        public bool IsRecord { get; set; }
        public bool IsReview { get; set; }
        public bool IsRejected { get; set; }
        public bool IsItemInventory { get; set; }
        public bool IsFullInventory { get; set; }
        public bool IsCategoryInventory { get; set; }
        public bool IsSupplierInventory { get; set; }
        public bool IsQuantityDisabled { get; set; }
        public decimal Quantity { get; set; }
        public bool IsInventoryUnmatched { get; set; }
        public decimal QuantityProcess { get; set; }
        public string InitiationComment { get; set; }
        public bool IsAllowApprovalButton { get; set; }
        public bool IsAllowReViewButton { get; set; }
        public bool IsStatus { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsResubmitRequest { get; set; }

        public List<InventoryRecorderAc> InventoryRecorderCollection { get; set; }
        public List<InventoryUnmatchedItemAc> UnmatchedItemCollection { get; set; }
        public IOrderedEnumerable<WorkFlowActionAc> WorkFlowAction { get; set; }
        public bool IsAllowToStartInventory { get; set; }
        public string WorkFlowStatus { get; set; }
        public bool IsUnmatchedItem { get; set; }
        public bool IsStartDate { get; set; }
        public ItemProfileAC ItemDetails { get; set; }
        public bool IsRecoveItem { get; set; }
        public decimal TotalQuantity { get; set; }
        public bool IsRejectedRequest { get; set; }
        public bool IsTotalQuantity { get; set; }

        public decimal MatchItemCount { get; set; }
        public decimal UnMatchItemCount { get; set; }
        public string SupplierName { get; set; }
        public string CategoryName { get; set; }
        public double ElapsedTime { get; set; }
        public string StartedDate { get; set; }
        public bool IsCloseDateNullable { get; set; }
        public DateTime StartingDate { get; set; }
        public List<BranchListAc> BranchList { get; set; }
        public string CompletedStatus { get; set; }

        public bool IsResubmitReRecord { get; set; }

        public bool IsUnmatchedButtonVisible { get; set; }
    }

   public class BranchListAc
   {
       public int Id { get; set; }

       public string BranchName { get; set; }
       public string CategoryType { get; set; }
       public string Status { get; set; }
       public DateTime? Date { get; set; }
       public bool IsScheduledOn { get; set; }
       public bool IsCompletedOn { get; set; }
       public bool IsAlreadyExist { get; set; }
       public int BranchId { get; set; }
       public bool IsInventorySelected { get; set; }
   }
}

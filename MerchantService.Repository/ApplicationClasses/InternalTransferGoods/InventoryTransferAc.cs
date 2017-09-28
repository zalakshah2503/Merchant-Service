using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.Repository.ApplicationClasses.Customer;

namespace MerchantService.Repository.ApplicationClasses.InternalTransferGoods
{
   public class InventoryTransferAc
    {
        public int RecordId { get; set; }
        public int CurrentBranchId { get; set; }
        public string CurrentBranchName { get; set; }
        public string RequestNo { get; set; }
        public int TargetBranchId { get; set; }
        public string TargetBranchName { get; set; }
        public bool IsProcessing { get; set; }
        public bool IsReceiving { get; set; }
        public bool IsReject { get; set; }
        public bool IsActive{get; set;}
        public List<ItemInventoryTransferAc> ItemInventoryTransfer { get; set; } 
        public int InventoryTransferId { get; set; }
        public int? RequestTypeId { get; set; }
        public string RequestType { get; set; }
        public string Barcode { get; set; }
        public string InitiationComment { get; set; }
       public string WorkFlowStatus { get; set; }
       public string IssueDate { get; set; }
       public DateTime IssuedDateTime { get; set; }
       public IOrderedEnumerable<WorkFlowActionAc> WorkFlowAction { get; set; }
       public bool IsRejectedRequest { get; set; }
       public bool IsAllowApprovalButton { get; set; }
       public bool IsAllowReViewButton { get; set; }
       public bool IsTragetedBranch { get; set; }
       public bool IsDeleted { get; set; }
       public bool IsStatus { get; set; }
       public BranchDetail BranchDetail { get; set; }
       public string Invoice { get; set; }
       public string PrintDate { get; set; }
       public decimal TotalAmount { get; set; }
       public DateTime DueDate { get; set; }
       public bool IsReceived { get; set; }
       public bool IsAllowToEditQunatity { get; set; }
       public bool IsRecoveItem { get; set; }
       public BranchDetail RequestBranchDetails { get; set; }
       public string PrintDueDate { get; set; }
       public bool IsReceiveQuantityDisabled { get; set; }
       public bool IsRequestQuantityDisabled { get; set; }
        public bool IsComment { get; set; }
        public bool IsSendRequest { get; set; }
    }

  
}

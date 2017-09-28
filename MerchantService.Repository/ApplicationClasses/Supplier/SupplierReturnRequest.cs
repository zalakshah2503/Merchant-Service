using MerchantService.Repository.ApplicationClasses.Customer;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class SupplierReturnRequest
    {
        public string Status { get; set; }
        public int RecordId { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierCode { get; set; }
        public string RequestNo { get; set; }
        public bool IsRejected { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsResubmit { get; set; }
        public int SupplierReturnId { get; set; }
        public int ItemId { get; set; }
        public int ReturnQuantity { get; set; }
        public decimal CostPrice { get; set; }
        public string InitiationComment { get; set; }
        public string Initiator { get; set; }
        public int InitiatorId { get; set; }
        public string CreditNoteNo { get; set; }
        public int? BranchId { get; set; }
        public string BranchName { get; set; }
        public decimal Amount { get; set; }
        public bool IsCollected { get; set; }
        public string Action { get; set; }
        public string Comment { get; set; }
        public DateTime InitiationDate { get; set; }
        public List<SupplierReturnItemAC> SupplierReturnItemAC { get; set; }
        public ICollection<WorkFlowActionAc> WorkFlowLog { get; set; }
    }
}

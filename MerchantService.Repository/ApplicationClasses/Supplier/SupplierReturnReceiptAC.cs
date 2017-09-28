using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class SupplierReturnReceiptAC
    {
        public string ReceiptNo { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierMobileNo { get; set; }
        //public int ApproverId { get; set; }
        public string ApproverName { get; set; }
        public DateTime Date { get; set; }
        public string BranchAddress { get; set; }
        public string BranchName { get; set; }
        public decimal CostPrice { get; set; }
        public string CreditNoteNo { get; set; }
        public decimal CreditNoteAmount { get; set; }
        public List<SupplierReturnItemAC> SupplierReturnItemAC { get; set; }
        public string Invoice { get; set; }
    }
}

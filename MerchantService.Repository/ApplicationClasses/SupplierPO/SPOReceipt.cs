using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class SPOReceipt
    {
        public string BranchName { get; set; }
        public string BranchAddress { get; set; }
        public string SupplierName { get; set; }
        public string MobileNo { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public string SPONumber { get; set; }
        public string SupplierEmail { get; set; }
        public string POType { get; set; }
        public string Comment { get; set; }
        public bool IsReceipt { get; set; }
        public bool EmailSendtoSupplier { get; set; }
        public ICollection<SupplierItemAC> SupplierItem { get; set; }
        public string Invoice { get; set; }
    }
}

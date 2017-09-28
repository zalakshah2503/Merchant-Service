using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CPOReceiptAC
    {
        public string CurrentBranchAdd { get; set; }
        public string CurrentBranchName { get; set; }
        public string CustomerMobile { get; set; }
        public string PurchaseOrderNo { get; set; }
        public string CollectingBranchName { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerName { get; set; }
        public Int64 MembershipCode { get; set; }
        public string PriceCategory { get; set; }
        public string InitiationBranchName { get; set; }
        public bool IsReceipt { get; set; }
        public bool ToCustomer { get; set; }
        public decimal DownPaymentAmount { get; set; }
        public decimal TotalCPOAmount { get; set; }
        public ICollection<CPOItemAC> CPOItemAC { get; set; }
        public string Invoice { get; set; }
    }
}

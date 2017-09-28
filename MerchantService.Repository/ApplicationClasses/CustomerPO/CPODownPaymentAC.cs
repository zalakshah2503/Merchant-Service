using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CPODownPaymentAC
    {
        public int CustomerPOId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public bool CreditCustomer { get; set; }
        public string CustomerMobile { get; set; }
        public decimal AmountLimit { get; set; }
        public decimal BalanceAmount { get; set; }
        public string PurchaseOrderNo { get; set; }
        public DateTime InitiationDate { get; set; }
        public int? InitiationBranchId { get; set; }
        public string InitiationBranchName { get; set; }
        public int InitiatorId { get; set; }
        public string InitiatorName { get; set; }
        public string Comments { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCancel { get; set; }
        public bool IsSPORequired { get; set; }
        public DateTime? CancelationDate { get; set; }
        public bool IsCollected { get; set; }
        public int CollectingBranchId { get; set; }
        public string CollectingBranchName { get; set; }
        public DateTime? CollectionDate { get; set; }
        public int ModifiedBy { get; set; }
        public decimal Total { get; set; }
        public decimal DownPaymentAmount { get; set; }
        public ICollection<CPOItemAC> CPOItemAC { get; set; }
      
    }
}



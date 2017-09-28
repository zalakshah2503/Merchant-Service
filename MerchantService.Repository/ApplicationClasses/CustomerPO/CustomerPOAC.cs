using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.Item;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CustomerPOAC
    {
        public int CustomerPOId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public Int64 MembershipCode { get; set; }
        public string CustomerMobile { get; set; }
        public string PurchaseOrderNo { get; set; }
        public DateTime InitiationDate { get; set; }
        public int? InitiationBranchId { get; set; }
        public string InitiationBranchName { get; set; }
        public int InitiatorId { get; set; }
        public decimal ExcessAmount { get; set; }
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
        public DateTime ModifiedDate { get; set; }
        public decimal TotalCPOAmount { get; set; }
        public decimal Total { get; set; }
        public bool IsEdit { get; set; }
        public bool ToCustomer { get; set; }
        public decimal DownPaymentAmount { get; set; }
        public bool IsReceipt { get; set; }
        public decimal POSBillAmount { get; set; }
        public PaymentMode PaymentMode { get; set; }
        public CustomerProfile Customer { get; set; }
        public CPOPaymentAC CPOPaymentAC { get; set; }
        public ICollection<CPOPayment> CPOPayment { get; set; }
        public ICollection<CPOAdditionalCost> CPOAdditionalCost { get; set; }
        public ICollection<CPOItem> CPOItem { get; set; }
        public ICollection<CPOItemAC> CPOItemAC { get; set; }
        public ICollection<POSItemDetail> CPOItemDetailPOS { get; set; }
        public List<CustomerPurchaseOrderItemAC> listOfCustomerPurchaseOrderItem { get; set; }
    }
}



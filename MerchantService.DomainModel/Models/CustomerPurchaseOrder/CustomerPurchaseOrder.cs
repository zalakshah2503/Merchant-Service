using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.CustomerPurchaseOrder
{
    public class CustomerPurchaseOrder : MerchantServiceBase
    {
        public int CustomerId { get; set; }
        public string PurchaseOrderNo { get; set; }
        public DateTime InitiationDate { get; set; }
        public int? InitiationBranchId { get; set; }
        public int InitiatorId { get; set; }
        public string Comments { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCancel { get; set; }
        public bool IsSPORequired { get; set; }
        public DateTime? CancelationDate { get; set; }
        public bool IsCollected { get; set; }
        public int CollectingBranchId { get; set; }
        public DateTime? CollectionDate { get; set; }
        public decimal TotalCPOAmount { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        [ForeignKey("CustomerId")]
        public virtual CustomerProfile CustomerProfile { get; set; }
        [ForeignKey("InitiationBranchId")]
        public virtual BranchDetail InitiationBranch { get; set; }
        [ForeignKey("CollectingBranchId")]
        public virtual BranchDetail CollectingBranch { get; set; }
        [ForeignKey("InitiatorId")]
        public virtual UserDetail UserDetail { get; set; }
    }
}

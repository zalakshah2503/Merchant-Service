using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierReturn
{
    public class SupplierReturnDetail : MerchantServiceBase
    {
        public int RecordId { get; set; }
        public bool IsDeleted { get; set; }
        public int SupplierId { get; set; }
        public int? BranchId { get; set; }
        public string RequestNo { get; set; }
        public bool IsRejected { get; set; }
        public int? RejectorId { get; set; }
        //comment while deleting or rejecting
        public string Comment { get; set; }
        public int InitiatorId { get; set; }
        public string InitiationComment { get; set; }
        public DateTime? RejectedDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }
        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }
        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }
        [ForeignKey("InitiatorId")]
        public virtual UserDetail Initiator { get; set; }
    }
}

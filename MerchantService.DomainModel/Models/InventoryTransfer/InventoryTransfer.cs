using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.InventoryTransfer
{
    public class InventoryTransfer : MerchantServiceBase
    {
        public int RecordId { get; set; }
        public int CurrentBranchId { get; set; }
        public string RequestNo { get; set; }
        public int TargetBranchId { get; set; }
        public bool IsProcessing { get; set; }
        public bool IsReceiving { get; set; }
        public bool IsReceived { get; set; }
        public bool IsReject { get; set; }
        public bool IsActive{get; set;}
        public bool IsReceivingInProcess { get; set; }
        public int? RequestTypeId { get; set; }
        public int InitiateBranchId { get; set; }
        [ForeignKey("RequestTypeId")]
        public virtual ParamType RequestDetails { get; set; }

        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }
        [ForeignKey("TargetBranchId")]
        public virtual BranchDetail TargetBranch { get; set; }
        [ForeignKey("InitiateBranchId")]
        public virtual BranchDetail InitiateBranch { get; set; }

        [ForeignKey("CurrentBranchId")]
        public virtual BranchDetail CurrentBranchDetail { get; set; }
        public bool IsInitiateTransferRequest { get; set; }
        public bool IsDeleted { get; set; }

        public DateTime DueDate { get; set; }
       
    }
}

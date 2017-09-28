using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
namespace MerchantService.DomainModel.Models.IncidentReport
{
    public class PosIncidentReport : MerchantServiceBase
     {
        public int ItemId { get; set; }

        public int IncidentType { get; set; }

        public int ShelfQuantity { get; set; }
        public int? RecordId { get; set; }
        public int? ItemOverQuantity { get; set; }
        public int? SystemQuantity { get; set; }

        public decimal Price { get; set; }

        public decimal CostPrice { get; set; }

        public int CommitedQuantity { get; set; }
        public int? BranchId { get; set; }
        public decimal CommittedGainValue { get; set; }

        public decimal CommittedLossValue { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
        [ForeignKey("IncidentType")]
        public virtual ParamType IncidentTypes { get; set; }
        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }

        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        public bool IsActive { get; set; }
        public bool IsProcess { get; set; }
        [CustomAttribute]
        public bool IsRegisterItem { get; set; }
        [CustomAttribute]
        public bool IsInActiveItem { get; set; }
        [CustomAttribute]
        public bool IsOverQuantityItem { get; set; }


        public bool IsReject { get; set; }
    }
}

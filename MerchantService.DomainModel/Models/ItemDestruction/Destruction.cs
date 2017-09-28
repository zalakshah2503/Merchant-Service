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

namespace MerchantService.DomainModel.Models.ItemDestruction
{
    public class Destruction : MerchantServiceBase
    {
        public int RecordId { get; set; }

        public int DestructionCauseId { get; set; }

        public int SupplierId { get; set; }

        public int? BranchId { get; set; }

        public string RequestNo { get; set; }

        public bool IsInitiatedBysupplier { get; set; }

        public bool IsDelete { get; set; }

        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("DestructionCauseId")]
        public virtual ParamType ParamType { get; set; }

        [ForeignKey("SupplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }
    }
}

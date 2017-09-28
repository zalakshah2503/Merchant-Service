using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSReturnBill : MerchantServiceBase
    {
        public int POSBillId { get; set; }
        public int ReturningType { get; set; }
        public int IssuingBranchID { get; set; }
        public int ReturneBy { get; set; }
        public int ProcessingBranchID { get; set; }
        public int ProcessorID { get; set; }
        public DateTime ReturningDate { get; set; }
        public string ReturningComments { get; set; }
        public string ReturnedBillNo { get; set; }
        public decimal ReturnedCash { get; set; }
        public decimal SubstituteItemsAmount { get; set; }
        public bool IsProcessed { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime ProcessingDate { get; set; }
        [ForeignKey("POSBillId")]
        public virtual POSBill POSBill { get; set; }
        [ForeignKey("ReturningType")]
        public virtual ParamType ParamType { get; set; }
        [ForeignKey("IssuingBranchID")]
        public virtual BranchDetail BranchDetail { get; set; }
        [ForeignKey("ReturneBy")]
        public virtual UserDetail UserDetail { get; set; }
        [ForeignKey("ProcessingBranchID")]
        public virtual BranchDetail ProcessingBranch { get; set; }
        [ForeignKey("ProcessorID")]
        public virtual UserDetail ProcesessorUser { get; set; }


    }
}

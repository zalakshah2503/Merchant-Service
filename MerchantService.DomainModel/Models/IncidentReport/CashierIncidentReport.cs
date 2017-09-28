using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.IncidentReport
{
    public class CashierIncidentReport : MerchantServiceBase
    {
        public int UserId { get; set; }

        public int? RecordId { get; set; }

        public decimal AmountLimit { get; set; }

        public int OperationCounter { get; set; }

        public bool IsResetRequest { get; set; }

        public bool IsRefreshRequset { get; set; }

        [ForeignKey("UserId")]
        public virtual UserDetail UserDetail { get; set; }

        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }
    }
}

using MerchantService.DomainModel.Models.Company;
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
    public class IncidentReport : MerchantServiceBase
    {
        public int OperationTypeId { get; set; }
        public decimal AmountLimit { get; set; }
        public int OperationCounter { get; set; }
        public string Comment { get; set; }
        public int StatusId { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public int? DurationTypeId { get; set; }
        public int CompanyId { get; set; }

        [ForeignKey("OperationTypeId")]
        public virtual ParamType ParamTypesForOperationType { get; set; }

        [ForeignKey("DurationTypeId")]
        public virtual ParamType ParamTypesForDurationType { get; set; }

        [ForeignKey("StatusId")]
        public virtual StatusType StatusType { get; set; }

        [ForeignKey("CompanyId")]
        public virtual CompanyDetail ComapnyDetail { get; set; }
    }
}

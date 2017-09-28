using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin.IncidentReport
{
    public class IncidentReportAC
    {
        public int OperationTypeId { get; set; }
        public decimal AmountLimit { get; set; }
        public int OperationCounter { get; set; }

        public int DurationTypeId { get; set; }

        public string Comment { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int DurationId { get; set; }
        public int companyId { get; set; }
        public int Id { get; set; }
        public string Operation { get; set; }
        public string Status { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Admin.IncidentReport
{
    public class IncidentReportWorkListAC
    {
        public int Id { get; set; }
        public int CashierId { get; set; }
        public string CashierName { get; set; }
        public string BranchName { get; set; }
        public int BranchId { get; set; }
        public DateTime ReachedDateTime { get; set; }
        public string Comment { get; set; }
        public int OperationCount { get; set; }
        public decimal Amount { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string status { get; set; }
        public bool HasChildItem { get; set; }
        public List<SubIncidentReportWorkListAC> ListOfSubIncidentReportWorkListAC { get; set; }
    }
    public class SubIncidentReportWorkListAC
    {
        public int SubIncidentReportId { get; set; }
        public int CashierId { get; set; }
        public string CashierName { get; set; }
        public string BranchName { get; set; }
        public string ReachedDateTime { get; set; }
        public int BranchId { get; set; }
        public string Comment { get; set; }
        public int OperationCount { get; set; }
        public decimal Amount { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string status { get; set; }
    }
}


namespace MerchantService.Repository.ApplicationClasses.IncidentReport
{
    public class CashierIncidentReportAC
    {
        public int CashierId { get; set; }

        public string Cashier { get; set; }

        public string BranchName { get; set; }

        public string ReachedTime { get; set; }

        public string ReachedDate { get; set; }

        public string Comment { get; set; }

        public string Status { get; set; }
    }
}

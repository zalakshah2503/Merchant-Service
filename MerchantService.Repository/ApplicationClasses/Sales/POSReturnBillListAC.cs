using System;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSReturnBillListAC
    {
        public string ReturnBy { get; set; }

        public string IssueAt { get; set; }
        public string ReturnBillNumber { get; set; }
        public DateTime ReturningDate { get; set; }
        public decimal Cash { get; set; }
        public string Processor { get; set; }

        public DateTime ProcessingDate { get; set; }

        public string ProcessAt { get; set; }

        public bool IsProcessed { get; set; }

        public bool IsDeleted { get; set; }

        public string CustomerName { get; set; }
        public decimal MembershipNumber { get; set; }
        public decimal SubstituteItemsAmount { get; set; }

    }
}

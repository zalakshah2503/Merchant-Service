using System;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSSessionWorkListAC
    {
        public int Id { get; set; }
        public string BranchName { get; set; }

        public string CahierName { get; set; }

        public int BranchId { get; set; }
        public int CashierId { get; set; }

        public int StatusId { get; set; }

        public int ResolvedTypeId { get; set; }
        public string Status { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsMatched { get; set; }

        public decimal MisMatchValue { get; set; }

        public string ResolvedAd { get; set; }

    }
}

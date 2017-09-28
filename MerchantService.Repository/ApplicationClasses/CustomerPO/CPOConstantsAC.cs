using System;

namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CPOConstantsAC
    {
        public string PurchaseOrderNo { get; set; }
        public bool AllowCreditAccountLimit { get; set; }
        public decimal CPODownPaymentDiscount { get; set; }
        public DateTime date { get; set; }
        public string branchName { get; set; }
        public int? branchId { get; set; }
        public string userName { get; set; }
    }
}

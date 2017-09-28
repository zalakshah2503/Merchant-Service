using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSSessionAC
    {
        public int POSSessionId { get; set; }
        public int POSSessionLoginId { get; set; }
        public string SessionStartDate { get; set; }
        public string SessionEndDate { get; set; }
        public string SessionStatus { get; set; }
        public decimal SystemSalesCash { get; set; }
        public decimal SystemSalesDebitCard { get; set; }
        public decimal SystemSalesCreditCard { get; set; }
        public decimal SystemSalesCoupon { get; set; }
        public decimal SystemSalesCreditAccount { get; set; }
        public decimal SystemSalesReturnBill { get; set; }
        public decimal SystemSalesTotalIn { get; set; }
        public decimal SystemSalesTotalOut { get; set; }
        public decimal ActualSalesCash { get; set; }
        public decimal ActualSalesDebitCard { get; set; }
        public decimal ActualSalesCreditCard { get; set; }
        public decimal ActualSalesCoupon { get; set; }
        public decimal ActualSalesCreditAccount { get; set; }
        public decimal ActualSalesReturnBill { get; set; }
        public decimal ActualCheque { get; set; }
        public decimal SystemCheque { get; set; }
        public decimal ActualSalesTotalIn { get; set; }
        public decimal ActualSalesTotalOut { get; set; }
        public string Comment { get; set; }
        public string Status { get; set; }
        public decimal MsMatchValue { get; set; }
        public string MsMatcheStatus { get; set; }
        public string Cashier { get; set; }
        public int CashierId { get; set; }
        public string Branch { get; set; }
        public int BranchId { get; set; }
        public bool IsRiview { get; set; }
        public bool IsApproval { get; set; }
        public bool IsSessionEnd { get; set; }
        public int MismatchResolveTypeID { get; set; }
        public List<POSNonSalesTransactionListAC> listOfPOSNonSalesTransactionListAC { get; set; }
    }

}

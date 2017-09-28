using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSReturnBillAC
    {
        public int POSBillId { get; set; }

        public string ReturnBillNumber { get; set; }

        public decimal ReturnCashAmount { get; set; }

        public string Comment { get; set; }

        public decimal ReturnSubtituteItemsAmount { get; set; }

        public int BranchId { get; set; }

        public List<RetunrBillItemListAC> ReturnBillItemList { get; set; }
    }
}

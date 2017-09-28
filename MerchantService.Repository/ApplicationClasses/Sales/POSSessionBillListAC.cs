using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Sales
{
    public class POSSessionBillListAC
    {
        public int POSBillId { get; set; }
        public string BillNo { get; set; }
        public decimal NumberOfTotalAmount { get; set; }
        public DateTime BillDate { get; set; }
        public long MembershipCode { get; set; }
        public string CashierName { get; set; }
        public List<POSSessionBillItemAC> listOfPOSSessionBillItemAC { get; set; }

        public bool HasChildItem { get; set; }
    }

    public class POSSessionBillItemAC
    {
        public int POSBillItemId { get; set; }
        public string Barcode { get; set; }
        public string Name { get; set; }
        public string Flavor { get; set; }
        public string Unit { get; set; }
        public int BaseUnit { get; set; }
        public decimal SellPrice { get; set; }
        public int Quantity { get; set; }
        public int ReturnQunatity { get; set; }
        
     }

}

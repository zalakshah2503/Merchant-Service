using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class ReceivingPurchaseOrderAC
    {
        public bool IsReceived { get; set; }

        public List<RecevingPurchaseOrderList> RecevingPurchaseOrderList { get; set; }
    }


    public class RecevingPurchaseOrderList
    {
        public string Barcode { get; set; }

        public string Code { get; set; }

        public string Unit { get; set; }


        public string ItemName { get; set; }


        public int FreeQuantity { get; set; }


        public decimal Discount { get; set; }

        public int ReceivingQuantity { get; set; }

        public decimal ReceivnigCostPrice { get; set; }

        public string SPOReceivingStatus { get; set; }

    }
}

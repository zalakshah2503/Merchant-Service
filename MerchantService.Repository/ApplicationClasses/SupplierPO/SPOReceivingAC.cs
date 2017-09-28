using MerchantService.Repository.Modules.SupplierPO;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class SPOReceivingAC
    {
        public int PurchaseOrderId { get; set; }
        public string Comment { get; set; }
        public DateTime ReceivingDate { get; set; }
        public SupplierPOAC SupplierPOAC { get; set; }
        public ICollection<SupplierItemAC> POItem { get; set; }
        public ICollection<SPOReceivingBillAC> SPOBill { get; set; }
    }
}

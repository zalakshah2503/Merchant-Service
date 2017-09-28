using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.CustomerPO
{
    public class CustomerPurchaseOrderDetailAC
    {
        public int Id { get; set; }

        public string CustomerName { get; set; }

        public string OrderNumber { get; set; }

        public long MemberShipCode { get; set; }

        public DateTime? CollectionDate { get; set; }

        public string CollectionBranch { get; set; }

        public DateTime IssueDate { get; set; }

        public bool HasChildItem { get; set; }

        public List<CustomerPurchaseOrderItemAC> CustomerPurchaseOrderItemList { get; set; }


    }


    public class CustomerPurchaseOrderItemAC
    {
        public int CustomerPOItemId { get; set; }

        public string ItemName { get; set; }

        public string Barcode { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }
    }
}

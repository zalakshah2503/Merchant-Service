using MerchantService.Repository.ApplicationClasses.Item;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.ItemDestruction
{
    public class ItemDestructionApprovalAC
    {
        public string SupplierName { get; set; }

        public string IsResult { get; set; }

        public string ComapnyAddress { get; set; }

        public string BranchName { get; set; }

        public decimal Amount { get; set; }

        public string ReceiptNumber { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string SupplierMobileNumber { get; set; }

        public string ApprovedBy { get; set; }

        public string CreditNoteNumber { get; set; }

        public decimal TotalAmount { get; set; }

        public int TotalQuantity { get; set; }

        public List<ItemProfileAC> listOfItemProdileAC { get; set; }
        public string Invoice { get; set; }
    }
}

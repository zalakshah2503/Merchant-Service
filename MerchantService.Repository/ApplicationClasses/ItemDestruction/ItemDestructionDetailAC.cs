using MerchantService.Repository.ApplicationClasses.Item;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.ItemDestruction
{
    public class ItemDestructionDetailAC
    {
        public string RequestNo { get; set; }

        public string SupplierName { get; set; }

        public string SupplierCode { get; set; }

        public string Branch { get; set; }

        public int BranchId { get; set; }

        public string RequestedDate { get; set; }

        public string Cause { get; set; }

        public bool IsPandingApproval { get; set; }

        public bool IsApproval { get; set; }

        public string InitiatedBy { get; set; }

        public bool IsReject { get; set; }

        public bool IsAllowApproval { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsClosed { get; set; }

        public int TotalQuantity { get; set; }

        public decimal TotalCostPrice { get; set; }

        public List<ItemProfileAC> listOfItemProfileAC { get; set; }
    }
}

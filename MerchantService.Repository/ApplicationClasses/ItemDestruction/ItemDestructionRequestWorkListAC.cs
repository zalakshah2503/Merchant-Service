using System;

namespace MerchantService.Repository.ApplicationClasses.ItemDestruction
{
    public class ItemDestructionRequestWorkListAC
    {
        public int DestructionId { get; set; }

        public int BranchId { get; set; }

        public string Branch { get; set; }

        public DateTime RequestedDate { get; set; }

        public string SupplierName { get; set; }

        public string SupplierCode { get; set; }

        public int SupplierId { get; set; }

        public string Cause { get; set; }

        public int CauseId { get; set; }
        public string Status { get; set; }

        public int StatusId { get; set; }

        public string RequestNo { get; set; }

        public int DestructedQuantity { get; set; }

        public string initiatedBy { get; set; }

        public bool IsDeleted { get; set; }
    }
}

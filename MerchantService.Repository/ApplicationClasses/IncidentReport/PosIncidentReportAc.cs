using System.Linq;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.ApplicationClasses.Item;

namespace MerchantService.Repository.ApplicationClasses.IncidentReport
{
    public class PosIncidentReportAc
    {
        public string BranchName { get; set; }
        public int PosIncidentReportId { get; set; }
        public int ItemId { get; set; }

        public int IncidentType { get; set; }
        public string IncidentTypeName { get; set; }
        public int ShelfQuantity { get; set; }
        public int CurrentSystemQuantity { get; set; }
        public int? SystemQuantity { get; set; }

        public decimal Price { get; set; }
        public int? ItemOverQuantity { get; set; }
        public decimal CostPrice { get; set; }

        public int ResolveQuantity { get; set; }
        public bool IsActive { get; set; }
        public bool IsProcess { get; set; }
        public decimal GainValue { get; set; }

        public decimal LossValue { get; set; }
        public string ItemName { get; set; }
        public string IncidentDate { get; set; }
        public decimal SellPrice { get; set; }
        public ItemOfferDetailAC ItemDetails { get; set; }

        public int? RecordId { get; set; }
        public bool IsRegisterItem { get; set; }

        public bool IsInActiveItem { get; set; }
        public string Comment { get; set; }
        public bool IsOverQuantityItem { get; set; }
        public bool IsDisabledInfo { get; set; }
        public bool IsReview { get; set; }
        public bool IsApproval { get; set; }
        public IOrderedEnumerable<WorkFlowActionAc> WorkFlowAction { get; set; }
        public string WorkFlowStatus { get; set; }
        public bool IsStatus { get; set; }

        public int CommitedQuantity { get; set; }
        public decimal CommittedGainValue { get; set; }
        public decimal CommittedLossValue { get; set; }
        public int BranchId { get; set; }
        public bool IsCurrentUser { get; set; }
        public int IncidentAvailableQuantity { get; set; }
    }
}

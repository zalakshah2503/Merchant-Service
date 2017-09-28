using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using System;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class WorkFlowLogAC
    {
        public int Id { get; set; }
        public string Stage { get; set; }
        public string Action { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int RecordId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public string Comments { get; set; }
        public int WorkFlowId { get; set; }
        public WorkFlowDetail WorkFlowDetail { get; set; }
        public ParentRecord ParentRecord { get; set; }
        public string RoleName { get; set; }
    }
}

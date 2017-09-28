using System;

namespace MerchantService.Repository.ApplicationClasses.WorkFlow
{
    public class WorkFlowActionAC
    {
        public int Id { get; set; }
        public string  Action { get; set; }
        public string Stage { get; set; }
        public DateTime ActionDate { get; set; }
        public string Role { get; set; }
        public string UserName { get; set; }
        public string Comments { get; set; }
        public int RoleId { get; set; }
     
    }
}

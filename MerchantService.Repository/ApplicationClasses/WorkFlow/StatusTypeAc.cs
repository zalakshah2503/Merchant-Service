
namespace MerchantService.Repository.ApplicationClasses.WorkFlow
{
   public class StatusTypeAc
    {
       public int StatusId { get; set; }
        public string Name { get; set; }
        public bool IsClosed { get; set; }
        public bool IsActiveStatus { get; set; }
    }
}

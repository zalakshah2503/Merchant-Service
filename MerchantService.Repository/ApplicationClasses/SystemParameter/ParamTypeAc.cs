
namespace MerchantService.Repository.ApplicationClasses.SystemParameter
{
   public class ParamTypeAc
    {
        public int Id { get; set; }
        public string ValueEn { get; set; }
        public string ValueSl { get; set; }
        public bool IsDeleted { get; set; }
        public int ParamId { get; set; }
        public int ParamTypeId { get; set; }
    }
}

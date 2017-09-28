
namespace MerchantService.Repository.ApplicationClasses.SystemParameter
{
   public class SystemParameterAC
    {
       public int Id { get; set; }
        public string ValueEn { get; set; }
        public string ValueSl { get; set; }
        public bool IsDelete { get; set; }
        public int ParamId { get; set; }
    }
}

using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.SystemParameters
{
    public class Param : MerchantServiceBase
    {
        public string Key { get; set; }

        public string Value { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsAdd { get; set; }
    }
}

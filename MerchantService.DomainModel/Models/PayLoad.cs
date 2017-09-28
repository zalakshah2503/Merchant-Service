using MerchantService.DomainModel.Models.Global;
using System;

namespace MerchantService.DomainModel.Models
{
    public class PayLoad : MerchantServiceBase
    {
        public Guid UniqueId { get; set; }
        public string Data { get; set; }
    }
}
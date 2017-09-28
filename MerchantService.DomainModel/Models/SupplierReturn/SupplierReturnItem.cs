using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.SupplierReturn
{
    public class SupplierReturnItem : MerchantServiceBase
    {
        public int SupplierReturnId { get; set; }
        public int ItemId { get; set; }
        public int ReturnQuantity { get; set; }
        public decimal CostPrice { get; set; }
        public int ReturnCauseId { get; set; }
        [ForeignKey("ReturnCauseId")]
        public virtual ParamType ReturnCause { get; set; }

        [ForeignKey("SupplierReturnId")]
        public virtual SupplierReturnDetail SupplierReturnDetail { get; set; }

        [ForeignKey("ItemId")]
        public virtual ItemProfile ItemProfile { get; set; }
    }
}

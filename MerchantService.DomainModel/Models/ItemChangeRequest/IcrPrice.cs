using MerchantService.DomainModel.Models.CustomAttributes;
using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.ItemChangeRequest
{
    public class IcrPrice : MerchantServiceBase
    {
        public int IcrId { get; set; }
        [NotMapped]
        [CustomAttribute]
        public decimal CalculatedCostPrice { get; set; }
        [NotMapped]
        [CustomAttribute]
        public bool IsPriceChangeRequest { get; set; }
        public decimal ModifyingCostPrice { get; set; }
        [CustomAttribute]
        public decimal ModifyingSellPrice { get; set; }
        [CustomAttribute]
        public decimal ModifyingSellPriceA { get; set; }
        [CustomAttribute]
        public decimal ModifyingSellPriceB { get; set; }
        [CustomAttribute]
        public decimal ModifyingSellPriceC { get; set; }
        [CustomAttribute]
        public decimal ModifyingSellPriceD { get; set; }

        [ForeignKey("IcrId")]
        public virtual IcrDetail IcrDetail { get; set; }


    }
}

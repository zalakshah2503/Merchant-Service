using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.ItemChangeRequest;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.ItemChangeRequest
{
    public class IcrQuantity : MerchantServiceBase
    {
        public int IcrId { get; set; }
        public int BranchId { get; set; }
        public int SystemQuantity { get; set; }
        public int ModifyingQuantity { get; set; }
        public bool IsAddOperation { get; set; }
        [ForeignKey("IcrId")]
        public virtual IcrDetail IcrDetail { get; set; }
        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }

        //added these comment lines to check deployment issues

    }
}

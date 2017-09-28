using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.ItemChangeRequest
{
    public class POItemIcr : MerchantServiceBase
    {
        public int IcrId { get; set; }
        public int POItemId { get; set; }

        [ForeignKey("IcrId")]
        public virtual IcrDetail IcrDetail { get; set; }


        //added these comment lines to check deployment issues

    }


}

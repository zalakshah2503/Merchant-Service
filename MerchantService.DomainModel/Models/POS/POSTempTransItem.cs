using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Item;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSTempTransItem : MerchantServiceBase
    {

       public int TempTransID { get; set; }

       public int ItemID { get; set; }
       public string Barcode {get;set;}

       public int Quantity { get; set; }

       public decimal ItemPrice { get; set; }

       public bool IsOfferItem { get; set; }

       [ForeignKey("TempTransID")]
       public virtual POSTempTrans POSTampTrans { get; set; }

       [ForeignKey("ItemID")]
       public virtual ItemProfile ItemProfile { get; set; }
    }
}

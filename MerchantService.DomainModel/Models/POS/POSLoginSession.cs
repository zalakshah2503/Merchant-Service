using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSLoginSession : MerchantServiceBase
    {

        public int UserId { get; set; }
        public DateTime LoginDateTime { get; set; }
        public DateTime? LogoutDateTime { get; set; }

        [ForeignKey("UserId")]
        public virtual UserDetail UserDetail { get; set; }

    }
}

using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class GroupType : MerchantServiceBase
    {
        public string Name { get; set; }

        public int GroupId { get; set; }

        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }
    }
}

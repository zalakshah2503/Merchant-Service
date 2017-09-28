using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSNonSaleTransaction : MerchantServiceBase
    {
        public int POSSessionId { get; set; }

        public int TransactionTypeId { get; set; }

        public decimal Amount { get; set; }

        public string Remark { get; set; }

        public bool IsDeleted { get; set; }

        [ForeignKey("POSSessionId")]
        public virtual POSSession POSSession { get; set; }

        [ForeignKey("TransactionTypeId")]
        public virtual ParamType ParamType { get; set; }

    }
}

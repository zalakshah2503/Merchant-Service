using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Customer;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSTempTrans : MerchantServiceBase
    {

        public int UserID { get; set; }
        public int BranchID { get; set; }
        public int CustomerID { get; set; }
        public string ReturnedBillNo { get; set; }
        public string PurchaseOrderNo { get; set; }
        public string TransReference { get; set; }
        public DateTime TransDate { get; set; }
        public bool IsSuspendedBill { get; set; }

        public decimal? CpoDownPayment { get; set; }

        public decimal? AdditionalAmount { get; set; }

        [ForeignKey("UserID")]
        public virtual UserDetail UserDetail { get; set; }
        [ForeignKey("BranchID")]
        public virtual BranchDetail BranchDetail { get; set; }
        [ForeignKey("CustomerID")]
        public virtual CustomerProfile CustomerProfile { get; set; }
    }
}

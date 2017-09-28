using System;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Global;

namespace MerchantService.DomainModel.Models.POS
{
    public class POSBill : MerchantServiceBase
    {

        public int POSSessionID { get; set; }
        public int UserID { get; set; }
        public int BranchID { get; set; }
        public int CustomerID { get; set; }
        public DateTime BillDate { get; set; }
        public decimal TotalAmount { get; set; }

        public string BillNo { get; set; }
        [ForeignKey("POSSessionID")]
        public virtual POSSession POSSession { get; set; }
                
        [ForeignKey("UserID")]
        public virtual UserDetail UserDetail { get; set; }

        [ForeignKey("BranchID")]
        public virtual BranchDetail BranchDetail { get; set; }
        
        
        [ForeignKey("CustomerID")]
        public virtual CustomerProfile Customer { get; set; }

    }
}

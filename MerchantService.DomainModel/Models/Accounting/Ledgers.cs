using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.Supplier;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.Accounting
{
    public class Ledgers : MerchantServiceBase
    {

        public int GroupId { get; set; }
        public string LedgerName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string State { get; set; }
        public bool IsEditable { get; set; }
        public int? BranchId { get; set; }
        public int? SuplierId { get; set; }
        public int? ParentLedgerId { get; set; }
        public string Comment { get; set; }
        public decimal Balance { get; set; }
        public int CompanyId { get; set; }
        public DateTime? LedgersDate { get; set; }
        public int? CustomerId { get; set; }
        public int? GroupTypId { get; set; }

        [NotMapped]
        public string GroupName { get; set; }

        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }

        [ForeignKey("GroupTypId")]
        public virtual GroupType GroupType { get; set; }

        [ForeignKey("BranchId")]
        public virtual BranchDetail BranchDetail { get; set; }

        [ForeignKey("SuplierId")]
        public virtual SupplierProfile SupplierProfile { get; set; }

        [ForeignKey("ParentLedgerId")]
        public virtual Ledgers ParentLedger { get; set; }

        [ForeignKey("CustomerId")]
        public virtual CustomerProfile CustomerProfile { get; set; }
    }

}

using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations.Builders;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Account
{
    public class LedgerAccountAC
    {
        public int LedgerId { get; set; }
        public string LedgerName { get; set; }

        public string Description { get; set; }
        public int GroupId { get; set; }
        public string Name { get; set; }
        public string LableName { get; set; }
        public string Address { get; set; }
        public string BranchName { get; set; }
        public string State { get; set; }
        public string GroupName { get; set; }
        public bool IsEditable { get; set; }
        public int CompanyId { get; set; }
        public int ParentLedgerId { get; set; }
        public int GroupTypeId { get; set; }
        public string GroupTypeName { get; set; }
        public decimal Balance { get; set; }
        public bool isSubAccountChecked { get; set; }
        public DateTime? ledgersDate { get; set; }
        public bool IsAddNewAccount { get; set; }
        public bool IsChild { get; set; }
        public List<LedgerAccountAC> SubLedgerAccountCollection { get; set; }

    }
}

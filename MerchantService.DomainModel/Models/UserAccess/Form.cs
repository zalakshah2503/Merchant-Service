using MerchantService.DomainModel.Models.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models.UserAccess
{
    public class Form : MerchantServiceBase
    {
        public Form()
        {
            ParentsCollection = new HashSet<Form>();
            MasterParentsCollection = new HashSet<Form>();
            UserAccessDetails = new HashSet<UserAccessDetail>();
        }

        [StringLength(100)]
        public string FormName { get; set; }

        public string FormDescription { get; set; }

        public bool IsActive { get; set; }

        public string FormUrl { get; set; }

        public int? ParentsId { get; set; }

        public int? ParentsId2 { get; set; }

        public virtual ICollection<Form> ParentsCollection { get; set; }

        public virtual Form Parents { get; set; }

        public virtual ICollection<Form> MasterParentsCollection { get; set; }

        public virtual Form MasterParents { get; set; }

        public virtual ICollection<UserAccessDetail> UserAccessDetails { get; set; }

    }
}

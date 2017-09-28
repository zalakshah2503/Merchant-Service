using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;

namespace MerchantService.DomainModel.Models.Customer
{
   public class UpdateCustomerInfo : MerchantServiceBase
    {
       public int CustomerProfileId { get; set; }
        /// <summary>
        /// Foreign Key from Parent Record Table.
        /// </summary>
        public int RecordId { get; set; }
        public string Name { get; set; }
        public string ArabicName { get; set; }
        public string ArabicAddress { get; set; }
        public string Address { get; set; }
        public string Zipcode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public int Fax { get; set; }
        public Int64 MembershipCode { get; set; }
        public string PriceCategory { get; set; }
        public decimal AmountLimit { get; set; }
        public decimal BalanceAmount { get; set; }
        public bool IsCreditCustomer { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal SalesAmount { get; set; }
        public bool IsActive { get; set; }
        public string Comment { get; set; }
        public CustomerStatus Status { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsRejected { get; set; }
        [ForeignKey("RecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

    }
}
